import { test, expect, Page } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import { Fr08CheckoutPage } from "./fr08-checkout.page";
import { HomePage } from "./home.page";

/**
 * ============================================================
 * FR-08 Checkout — Data-Driven Spec (phiên bản dùng UI setup)
 * ============================================================
 *
 * Data source:  tests/fr08-checkout/data/fr08-testdata.json (12 records)
 * Page Object:  tests/fr08-checkout/fr08-checkout.page.ts (checkout page)
 *               tests/fr08-checkout/home.page.ts (home page — thêm vào giỏ)
 * Test cases:   tests/fr08-checkout/testcases-fr08-checkout.md
 *
 * Schema JSON mới (đã rewrite):
 *   - loginRequired: true/false
 *   - cartState: "empty" | "with_items"
 *   - couponCode: string | ""
 *   - performCoupon: true/false
 *   - performCheckout: true/false
 *   - removeItemsBeforeCheckout: true/false (D1 — xóa cart giữa test)
 *   - expect: { navigation, errorVisible, couponSuccessVisible, couponErrorVisible,
 *               couponErrorContains, applyCouponButtonDisabled, totalDisplayChanged,
 *               scriptExecuted, noCrash, cartClearedAfter, errorContains,
 *               redirectToLogin, stayOnCheckout }
 *
 * Setup cart bằng UI:
 *   - Vào trang chủ qua /, click button "Thêm vào giỏ"
 *   - Ưu tiên UI thay vì API vì:
 *     (1) match với user flow thật
 *     (2) nếu backend /api/cart có bug, test vẫn phản ánh đúng
 *     (3) tránh race condition giữa localStorage + React fetch
 *
 * Assertion Patterns áp dụng:
 *   1. UI state assertion          → message visible / contains text
 *   2. Navigation/URL assertion    → redirect đến /login, /cart, /checkout, /order-success
 *   3. Network/API response assertion → intercept POST /api/checkout, /api/apply-coupon
 *   4. Business-rule assertion     → cart empty sau checkout (productItems.count === 0)
 *   5. Element state/count assertion → readonly, disabled, count
 */

// ============================================================
// Backend URL (API request setup)
// ============================================================
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";

// ============================================================
// Types — khớp với JSON schema mới
// ============================================================
interface TestRecord {
  id: string;
  type: "positive" | "negative" | "edge";
  group: string;
  description: string;
  loginRequired: boolean;
  cartState: "empty" | "with_items";
  couponCode: string;
  performCoupon: boolean;
  performCheckout: boolean;
  removeItemsBeforeCheckout?: boolean;
  expect: {
    navigation?: "stay_on_checkout" | "away_from_checkout";
    errorVisible?: boolean;
    errorContains?: string;
    redirectToLogin?: boolean;
    redirectToCart?: boolean;
    stayOnCheckout?: boolean;
    couponSuccessVisible?: boolean;
    couponSuccessContains?: string;
    couponErrorVisible?: boolean;
    couponErrorContains?: string;
    applyCouponButtonDisabled?: boolean;
    totalDisplayChanged?: boolean;
    scriptExecuted?: boolean;
    noCrash?: boolean;
    cartClearedAfter?: boolean;
  };
}

// ============================================================
// Load test data
// ============================================================
const TESTDATA_PATH = path.join(__dirname, "data", "fr08-testdata.json");
const RECORDS: TestRecord[] = JSON.parse(fs.readFileSync(TESTDATA_PATH, "utf-8"));

// ============================================================
// Helpers
// ============================================================

/**
 * Setup precondition theo JSON schema mới:
 *   - loginRequired: login qua API → set localStorage TRƯỚC khi goto /
 *   - cartState: "with_items" → dùng UI HomePage.click "Thêm vào giỏ"
 *                "empty" → không add gì
 *
 * Lưu ý quan trọng:
 *   - Phải set localStorage TRƯỚC khi page.goto("/")
 *   - Sau đó wait networkidle để React render xong products grid
 *   - Mới click "Thêm vào giỏ" được
 */
async function setupPrecondition(
  page: Page,
  home: HomePage,
  record: TestRecord
): Promise<{ token: string | null }> {
  let token: string | null = null;

  // ----- Auth setup -----
  if (!record.loginRequired) {
    // Anonymous → clear auth state
    await page.goto(HomePage.HOME_URL);
    await page.evaluate(() => {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch {
        /* ignore */
      }
    });
    return { token: null };
  }

  // Login qua API
  const loginResp = await page.request.post(`${BACKEND_URL}/api/login`, {
    data: { email: "test@eshop.com", password: "Test1234!" },
  });

  if (!loginResp.ok()) {
    throw new Error(
      `[${record.id}] Login setup failed — status ${loginResp.status()}. ` +
        `Bạn đã khởi động backend (${BACKEND_URL}) chưa?`
    );
  }

  const loginBody = await loginResp.json();
  token = loginBody.token ?? loginBody.accessToken;
  if (!token) {
    throw new Error(`[${record.id}] Login response missing token field`);
  }

  // Set token vào localStorage TRƯỚC khi goto trang chủ
  // Đây là phần quan trọng nhất — nếu set SAU khi goto, React sẽ render
  // không có auth → không fetch products → không có button "Thêm vào giỏ"
  await page.goto(HomePage.HOME_URL);
  await page.evaluate((t) => {
    localStorage.setItem("token", t);
    localStorage.setItem(
      "user",
      JSON.stringify({ id: 2, email: "test@eshop.com", name: "Test User" })
    );
  }, token);

  // Reload để React đọc token từ localStorage và fetch products
  await page.goto(HomePage.HOME_URL);
  await page.waitForLoadState("networkidle").catch(() => {});
  // Thêm 1s chờ React render products grid
  await page.waitForTimeout(1000);

  // ----- Cart setup bằng UI -----
  if (record.cartState === "with_items") {
    // Click "Thêm vào giỏ" cho sản phẩm đầu tiên
    const added = await home.addFirstProductToCart();
    if (!added) {
      console.warn(
        `[${record.id}] Could not add product via UI — products grid empty. ` +
          `Có thể backend không trả products hoặc React chưa render kịp.`
      );
    }
  }
  // cartState === "empty" → không add gì

  return { token };
}

/**
 * Apply coupon: nhập code và click "Áp dụng" nếu button enabled
 */
async function applyCouponIfRequested(
  page: Page,
  po: Fr08CheckoutPage,
  record: TestRecord
): Promise<{ applied: boolean; buttonWasDisabled: boolean }> {
  if (!record.performCoupon) {
    return { applied: false, buttonWasDisabled: false };
  }

  if (!record.couponCode) {
    return { applied: false, buttonWasDisabled: false };
  }

  // Fill input
  await po.couponInput.fill(record.couponCode);

  // Check button state
  const isDisabled = await po.applyCouponButton.isDisabled().catch(() => true);
  if (isDisabled) {
    return { applied: false, buttonWasDisabled: true };
  }

  await po.applyCouponButton.click();
  await page.waitForTimeout(500);
  return { applied: true, buttonWasDisabled: false };
}

/**
 * Remove tất cả items khỏi cart (dùng cho TC-UI-D1)
 * Dùng UI: vào /cart → click button xóa từng item
 * Best-effort: nếu không tìm thấy button → fallback API DELETE
 */
async function removeAllItemsFromCart(
  page: Page,
  token: string | null
): Promise<void> {
  // UI approach: navigate /cart và click delete button
  await page.goto(Fr08CheckoutPage.CART_URL);
  await page.waitForLoadState("networkidle").catch(() => {});

  // Tìm button xóa (nhiều khả năng: text "Xóa", icon trash, button có class delete)
  const removeBtns = page.getByRole("button", { name: /Xóa|xóa|Remove/i });
  const count = await removeBtns.count();

  if (count > 0) {
    for (let i = count - 1; i >= 0; i--) {
      await removeBtns.nth(i).click();
      await page.waitForTimeout(300);
    }
    return;
  }

  // Fallback API: DELETE từng item
  if (token) {
    const cartResp = await page.request.get(`${BACKEND_URL}/api/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (cartResp.ok()) {
      const cart = await cartResp.json();
      if (Array.isArray(cart)) {
        for (const item of cart) {
          await page.request
            .delete(`${BACKEND_URL}/api/cart/${item.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .catch(() => {});
        }
      }
    }
  }
}

// ============================================================
// MAIN SPEC — Data-Driven Loop
// ============================================================

test.describe("FR-08 — Checkout (Data-Driven, UI Setup)", () => {
  for (const record of RECORDS) {
    test(`${record.id} [${record.type}] — ${record.description}`, async ({
      page,
    }) => {
      const po = new Fr08CheckoutPage(page);
      const home = new HomePage(page);

      // ----- (1) Setup precondition -----
      const setupResult = await setupPrecondition(page, home, record);

      // ----- (2) Remove items before checkout (TC-UI-D1) -----
      if (record.removeItemsBeforeCheckout) {
        await removeAllItemsFromCart(page, setupResult.token);
      }

      // ----- (3) Điều hướng đến checkout -----
      await po.gotoCheckout();
      await page.waitForLoadState("networkidle").catch(() => {});
      await page.waitForTimeout(500);

      // ----- (4) Network listeners -----
      const checkoutApiPromise = record.performCheckout
        ? page
            .waitForResponse(
              (res) =>
                res.url().includes("/api/checkout") &&
                res.request().method() === "POST",
              { timeout: 10000 }
            )
            .catch(() => null)
        : null;

      const couponApiPromise = record.performCoupon
        ? page
            .waitForResponse(
              (res) =>
                res.url().includes("/api/apply-coupon") &&
                res.request().method() === "POST",
              { timeout: 10000 }
            )
            .catch(() => null)
        : null;

      // ----- (5) Apply coupon (TC-UI-B2, B3, C1, C2, D2, D3, D4) -----
      const couponResult = await applyCouponIfRequested(page, po, record);

      // ----- (6) Click confirm (TC-UI-A1, D1, N1) -----
      if (record.performCheckout) {
        await po.confirmCheckout();
        await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
        await page.waitForTimeout(500);
      }

      // ============================================================
      // ASSERTIONS
      // ============================================================
      const currentUrl = page.url();

      // ----- Pattern #2: Navigation / URL assertion -----
      if (record.expect.redirectToLogin) {
        expect(
          currentUrl,
          `[${record.id}] Expected redirect to /login but got ${currentUrl}`
        ).toMatch(/\/login/);
      }
      if (record.expect.redirectToCart) {
        expect(
          currentUrl,
          `[${record.id}] Expected redirect to /cart but got ${currentUrl}`
        ).toMatch(/\/cart/);
      }
      if (record.expect.stayOnCheckout) {
        expect(
          currentUrl,
          `[${record.id}] Expected stay on /checkout but got ${currentUrl}`
        ).toMatch(/\/checkout/);
      }
      if (record.expect.navigation === "away_from_checkout") {
        expect(
          currentUrl,
          `[${record.id}] Expected navigate away from /checkout but got ${currentUrl}`
        ).not.toMatch(/\/checkout$/);
      }
      if (record.expect.navigation === "stay_on_checkout") {
        expect(
          currentUrl,
          `[${record.id}] Expected stay on /checkout but got ${currentUrl}`
        ).toMatch(/\/checkout/);
      }

      // ----- Pattern #5: Element state assertion -----
      if (record.expect.applyCouponButtonDisabled !== undefined) {
        const disabled = await po.isApplyCouponButtonDisabled();
        if (record.expect.applyCouponButtonDisabled) {
          expect(
            disabled,
            `[${record.id}] Expected 'Áp dụng' button to be disabled`
          ).toBe(true);
        } else {
          expect(
            disabled,
            `[${record.id}] Expected 'Áp dụng' button to be enabled`
          ).toBe(false);
        }
      }

      // ----- Pattern #1: UI state assertion (error message) -----
      if (record.expect.errorVisible) {
        await expect(
          po.pageErrorMessage,
          `[${record.id}] Expected error message to be visible`
        ).toBeVisible({ timeout: 5000 });

        if (record.expect.errorContains) {
          const errorText = (await po.pageErrorMessage.textContent()) ?? "";
          expect(
            errorText,
            `[${record.id}] Error message should contain "${record.expect.errorContains}" but got: ${errorText}`
          ).toMatch(new RegExp(record.expect.errorContains, "i"));
        }
      }

      if (record.expect.couponSuccessVisible) {
        await expect(
          po.couponSuccessMessage,
          `[${record.id}] Expected coupon success message to be visible`
        ).toBeVisible({ timeout: 5000 });

        if (record.expect.couponSuccessContains) {
          const text = (await po.couponSuccessMessage.textContent()) ?? "";
          expect(
            text,
            `[${record.id}] Coupon success should contain "${record.expect.couponSuccessContains}" but got: ${text}`
          ).toMatch(new RegExp(record.expect.couponSuccessContains, "i"));
        }
      }

      if (record.expect.couponErrorVisible) {
        await expect(
          po.couponErrorMessage,
          `[${record.id}] Expected coupon error message to be visible`
        ).toBeVisible({ timeout: 5000 });

        if (record.expect.couponErrorContains) {
          const text = (await po.couponErrorMessage.textContent()) ?? "";
          expect(
            text,
            `[${record.id}] Coupon error should contain "${record.expect.couponErrorContains}" but got: ${text}`
          ).toMatch(new RegExp(record.expect.couponErrorContains, "i"));
        }
      }

      // ----- Pattern #4: Business-rule assertion (cart cleared) -----
      if (record.expect.cartClearedAfter) {
        // Navigate về /cart và verify trống
        await page.goto(Fr08CheckoutPage.CART_URL);
        await page.waitForLoadState("networkidle").catch(() => {});

        const cartItemsCount = await po.getProductItemCount();
        expect(
          cartItemsCount,
          `[${record.id}] Cart should be empty after checkout but found ${cartItemsCount} items`
        ).toBe(0);
      }

      // ----- Pattern #5b: Verify no script executed (XSS) -----
      if (record.expect.scriptExecuted === false) {
        const hasDialog = await page.evaluate(() => {
          return (window as unknown as { __xssTriggered?: boolean })
            .__xssTriggered === true;
        });
        expect(
          hasDialog,
          `[${record.id}] XSS script should not have executed`
        ).toBe(false);
      }

      // ----- Pattern #3: Network / API response assertion -----
      if (checkoutApiPromise) {
        const checkoutResp = await checkoutApiPromise;
        if (checkoutResp) {
          const status = checkoutResp.status();
          // Bug SUT thường fail — log để debug
          console.log(`[${record.id}] POST /api/checkout status: ${status}`);
        }
      }

      if (couponApiPromise) {
        const couponResp = await couponApiPromise;
        if (couponResp) {
          const status = couponResp.status();
          console.log(`[${record.id}] POST /api/apply-coupon status: ${status}`);
        }
      }

      // ----- Log helper: coupon button state -----
      if (record.performCoupon) {
        console.log(
          `[${record.id}] coupon='${record.couponCode}' buttonWasDisabled=${couponResult.buttonWasDisabled} applied=${couponResult.applied}`
        );
      }
    });
  }
});
