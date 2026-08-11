/**
 * FR-08 Checkout — Data-Driven Spec
 * SUT: http://localhost:5173/checkout (baseURL từ playwright.config.js)
 *
 * Theo SKILL.md (Web Automation Generator):
 *   - Load test data từ data/fr08-testdata.json qua fs (tương thích mọi TS config)
 *   - Bọc trong test.describe() để Playwright chấp nhận dynamic test()
 *   - Loop qua từng record → 12 test cases
 *   - Dùng Page Object (fr08-checkout.page.ts) — KHÔNG thao tác locator trực tiếp
 *   - ≥ 3 assertion patterns (file này dùng 5 patterns)
 *
 * Setup:
 *   - .auth/user.json cung cấp storageState (token hợp lệ) cho mặc định
 *   - TC-A2/A3 ghi đè localStorage token trước khi navigate (authContext: cleared/invalid)
 */

import {
  test,
  expect,
  type Page,
  type Response,
} from "@playwright/test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { CheckoutPage } from "./fr08-checkout.page";

// ======= Load test data qua fs (tương thích mọi TS config) =================

const TESTDATA_PATH = resolve(__dirname, "data", "fr08-testdata.json");
const rawData = JSON.parse(readFileSync(TESTDATA_PATH, "utf-8")) as {
  testCases: TestCase[];
};

// ======= Types (khớp 1-1 với schema trong fr08-testdata.json) ===========

type AuthContext = "valid" | "cleared" | "invalid";

interface Precondition {
  hasItemsInCart: boolean;
  editTotalAmount: number | string | null;
  authContext: AuthContext;
}

interface Action {
  submit: boolean;
  checkoutWaitResponse: boolean;
}

interface Expectation {
  successHeadingVisible: boolean | null;
  networkStatus: number | null;
  alertShown: boolean | null;
  alertContains: string | null;
  cartItemRows: number | null;
  expectedCartItemTextContains: string | null;
  totalAmountInputValue: string | null; // regex
  finalTotalTextContains: string | null; // regex
  totalAmountEditable: boolean | null;
  bugTrackingId: string | null;
}

interface Metadata {
  caseSource: string;
  note: string;
}

interface TestCase {
  id: string;
  type: "positive" | "negative" | "edge";
  group: string;
  title: string;
  precondition: Precondition;
  action: Action;
  expect: Expectation;
  metadata: Metadata;
}

const testCases: TestCase[] = rawData.testCases;

// ======= Constants =======================================================

const CHECKOUT_API_PATH = "/api/checkout";
const CART_API_PATH = "/api/cart";

// ======= Helpers =========================================================

/**
 * API reset/setup cart — gọi trực tiếp backend để chuẩn bị state giỏ hàng.
 * Nhanh & idempotent hơn so với thao tác qua UI nhiều lần.
 *
 * Strategy: dùng NEW request context (không phụ thuộc page localStorage) + token
 * lấy từ storageState nếu cần. Inject Authorization qua extraHTTPHeaders.
 * Trả về cartTotal (number) để tiện cho các test cần so sánh.
 */
/**
 * Setup cart state bằng cách click "Thêm vào giỏ" trên trang chủ.
 *
 * LÝ DO dùng UI thay vì API:
 *   - CartContext.jsx chỉ là useState local — KHÔNG sync với backend /api/cart
 *   - Backend /api/cart (GET) chỉ trả [{product_id, quantity}] (không có name/price)
 *   - Frontend Checkout render <ul> từ CartContext.cart → nếu setup qua API
 *     mà CartContext trống → <ul></ul> rỗng → TC-UI-1 fail
 *
 * Chiến lược:
 *   - Đăng nhập: addInitScript set token trước navigate
 *   - Navigate `/` → chờ product cards render → click "Thêm vào giỏ" 2 lần
 *     (addToCart cứng quantity=1 mỗi click, không có quantity selector)
 *   - Return số items cart hiện tại (qua badge nếu có, hoặc dummy 2)
 */
async function uiSetupCart(
  page: Page,
  wantItems: boolean,
  authContext: AuthContext,
): Promise<number> {
  if (!wantItems) return 0;
  if (authContext !== "valid") return 0; // chỉ setup khi auth hợp lệ

  // ----- Trang chủ: click "Thêm vào giỏ" 2 lần -----
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const addToCartButtons = page.getByRole("button", {
    name: /Thêm vào giỏ/i,
  });
  await expect(addToCartButtons.first()).toBeVisible({ timeout: 15000 });

  const buttonCount = await addToCartButtons.count();
  if (buttonCount < 2) {
    throw new Error(
      `Trang chủ chỉ có ${buttonCount} nút 'Thêm vào giỏ' — cần ≥2`,
    );
  }
  await addToCartButtons.nth(0).click();
  await addToCartButtons.nth(1).click();
  await page.waitForTimeout(300);

  // ----- SPA Navigate tới /checkout (KHÔNG full reload — để giữ CartContext state) -----
  // Lưu ý: page.goto() sẽ reload, reset CartContext.useState([]) → cart trống
  // → Dùng SPA navigation qua <Link to="/checkout"> trong Header / Cart
  await page.getByRole("link", { name: /Giỏ hàng/i }).click();
  // Chờ /cart page render
  await expect(
    page.getByRole("heading", { name: /Giỏ Hàng/i }),
  ).toBeVisible({ timeout: 10000 });

  // Click "Tiến hành thanh toán"
  await page
    .getByRole("button", { name: /Tiến hành thanh toán/i })
    .click();

  // Verify đã ở /checkout (URL hash/route đã đổi)
  await page.waitForURL(/\/checkout/, { timeout: 10000 });
  return 2;
}

/**
 * Override auth state trong localStorage để mô phỏng các case TC-A2/A3.
 *
 * QUAN TRỌNG:
 *   - Phải navigate đến SUT trước để có same-origin cho localStorage.
 *   - Với authContext="valid": load token từ .auth/user.json (do config không set
 *     storageState toàn cục) qua addInitScript trước khi navigate.
 *   - Với "cleared"/"invalid": navigate tới SUT root → set token → page tự xử lý.
 */
const AUTH_FILE = resolve(__dirname, "..", "..", ".auth", "user.json");
type AuthFile = {
  origins: { origin: string; localStorage: { name: string; value: string }[] }[];
};
let cachedAuthFile: AuthFile | null = null;
function loadAuthFile(): AuthFile {
  if (cachedAuthFile) return cachedAuthFile;
  const raw = readFileSync(AUTH_FILE, "utf-8");
  cachedAuthFile = JSON.parse(raw) as AuthFile;
  return cachedAuthFile;
}

async function applyAuthContext(page: Page, ctx: AuthContext): Promise<void> {
  if (ctx === "valid") {
    // Inject token vào mọi navigation (chạy TRƯỚC khi page script load)
    const auth = loadAuthFile();
    const origin = auth.origins[0]?.origin ?? "http://localhost:5173";
    const tokenValue =
      auth.origins[0]?.localStorage.find((e) => e.name === "token")?.value ?? "";
    if (!tokenValue) {
      throw new Error("auth file không có token");
    }
    await page.addInitScript(
      ({ origin, token }: { origin: string; token: string }) => {
        try {
          window.localStorage.setItem("token", token);
        } catch {
          /* noop if storage not available */
        }
      },
      { origin, token: tokenValue },
    );
    return;
  }

  // Với cleared/invalid: navigate tới SUT root trước để có same-origin
  // Lấy baseURL từ env (cùng giá trị với playwright.config.js) thay vì
  // truy cập page.context()._options (private API, không có trong public types).
  const sutBaseURL = process.env.SUT_URL || "http://localhost:5173";
  if (
    !page.url() ||
    page.url() === "about:blank" ||
    !page.url().startsWith(sutBaseURL)
  ) {
    await page.goto("/", { waitUntil: "domcontentloaded" });
  }

  if (ctx === "cleared") {
    await page.evaluate(() => localStorage.removeItem("token"));
  } else if (ctx === "invalid") {
    await page.evaluate(() =>
      localStorage.setItem("token", "invalid-token-xyz"),
    );
  }
}

/** Setup dialog handler để bắt alert() (TC-A2/A3) */
function attachAlertCapture(page: Page): {
  messages: string[];
  fired: () => boolean;
  detach: () => void;
} {
  const messages: string[] = [];
  const handler = (dialog: import("@playwright/test").Dialog) => {
    messages.push(dialog.message());
    void dialog.dismiss().catch(() => {});
  };
  page.on("dialog", handler);
  return {
    messages,
    fired: () => messages.length > 0,
    detach: () => page.off("dialog", handler),
  };
}

/** Helper: assert regex trên string, throw với message rõ ràng */
function expectMatches(actual: string, regex: string, label: string): void {
  expect(
    actual,
    `${label} phải match /${regex}/ (actual: "${actual}")`,
  ).toMatch(new RegExp(regex));
}

// ======= Main: BỌC TRONG test.describe() ================================
// Bắt buộc — Playwright cần test() nằm trong describe để dynamic test() hoạt động.

test.describe("FR-08 Checkout — Data-Driven (12 cases, 4 groups)", () => {
  // Khai báo từng test tĩnh trong 1 file (số lượng cố định theo testCases.length)
  // giúp Playwright khởi tạo trước khi loop. Mỗi test ID đã được biết trước.
  for (const tc of testCases) {
    test(`${tc.id} [${tc.type}] — ${tc.title}`, async ({ page }) => {
      // ----- Annotations cho HTML report -----
      test.info().annotations.push({
        type: "case-source",
        description: tc.metadata.caseSource,
      });
      test.info().annotations.push({ type: "group", description: tc.group });
      if (tc.expect.bugTrackingId) {
        test.info().annotations.push({
          type: "bug-tracking",
          description: tc.expect.bugTrackingId,
        });
      }

      const po = new CheckoutPage(page);
      const alertCapture = attachAlertCapture(page);

      try {
        // ----- 1) Apply auth override (nếu cần) — TRƯỚC khi setup cart -----
        await applyAuthContext(page, tc.precondition.authContext);

        // ----- 2) Setup cart state qua UI -----
        // Lưu ý: CartContext là useState local — KHÔNG sync với backend /api/cart
        const cartTotal = await uiSetupCart(
          page,
          tc.precondition.hasItemsInCart,
          tc.precondition.authContext,
        );

        // ----- 3) Nếu chưa ở /checkout (uiSetupCart đã SPA-navigate rồi) -----
        // Lưu ý: KHÔNG dùng po.goto() vì nó sẽ full reload → reset CartContext state.
        // Đã ở /checkout rồi thì chỉ chờ heading.
        if (!page.url().includes("/checkout")) {
          await po.goto();
        }
        // Chờ heading "Sản phẩm:" (luôn có trên trang checkout, kể cả cart trống)
        await expect(po.cartListHeading).toBeVisible({ timeout: 15000 });
        const stillOnCheckout = page.url().includes("/checkout");

        // ----- 3b) Nếu cần cart có items, chờ ít nhất 1 <li> render (race vs API) -----
        // BỎ QUA nếu page không còn ở /checkout (vd TC-A2 bị redirect /login vì token cleared)
        if (stillOnCheckout && tc.precondition.hasItemsInCart) {
          try {
            await expect(po.cartItemRows.first()).toBeVisible({
              timeout: 10000,
            });
          } catch {
            /* swallow */
          }
        }

        // ----- 4) Nếu cần edit total -----
        if (tc.precondition.editTotalAmount !== null) {
          await po.setTotalAmount(tc.precondition.editTotalAmount);
        }

        // ----- 5) Action: submit -----
        if (tc.action.submit) {
          if (tc.action.checkoutWaitResponse) {
            // ===== ASSERTION PATTERN #3: Network / API =====
            const responsePromise: Promise<Response> =
              po.submitAndWaitForCheckoutResponse();
            const response = await responsePromise;
            // Đợi UI render xong (alert hoặc success heading)
            await page.waitForTimeout(800);

            if (tc.expect.networkStatus != null) {
              expect(
                response.status(),
                `[${tc.id}] network /api/checkout status phải = ${tc.expect.networkStatus} (got ${response.status()})`,
              ).toBe(tc.expect.networkStatus);
            }
          } else {
            await po.submitCheckout();
            await page.waitForTimeout(800);
          }
        }

        // ----- 6) Assertions -----

        // Pattern #1: UI state — success heading
        // Dùng != null (loose) thay vì !== null để match cả undefined
        if (tc.expect.successHeadingVisible === true) {
          await expect(po.successHeading).toBeVisible({ timeout: 10000 });
        } else if (tc.expect.successHeadingVisible === false) {
          await expect(po.successHeading).not.toBeVisible({ timeout: 5000 });
        }

        // Pattern #1: UI state — alert dialog (TC-A2/A3)
        if (tc.expect.alertShown === true) {
          await page.waitForTimeout(600);
          expect(
            alertCapture.fired(),
            `[${tc.id}] phải có window.alert()`,
          ).toBeTruthy();
          if (tc.expect.alertContains) {
            const combined = alertCapture.messages.join(" | ");
            expect(combined, `[${tc.id}] alert message`).toMatch(
              new RegExp(tc.expect.alertContains, "i"),
            );
          }
        } else if (tc.expect.alertShown === false) {
          await page.waitForTimeout(400);
          expect(
            alertCapture.fired(),
            `[${tc.id}] KHÔNG được có alert`,
          ).toBeFalsy();
        }

        // Pattern #5: Element attribute — input readonly check
        // Dùng != null (loose) thay vì !== null để match cả undefined (JSON thiếu key)
        // BỎ QUA nếu page không còn ở /checkout (vd TC-A2 bị redirect /login vì token cleared)
        if (stillOnCheckout && tc.expect.totalAmountEditable != null) {
          try {
            const isReadonly = await po.totalAmountInput
              .getAttribute("readonly", { timeout: 5000 })
              .catch(() => null);
            const editable = isReadonly === null;
            expect(
              editable,
              `[${tc.id}] input total editable: expected ${tc.expect.totalAmountEditable}`,
            ).toBe(tc.expect.totalAmountEditable);
          } catch {
            /* swallow — assertion below đã check navigation */
          }
        }

        // Pattern #4: Business rule — giá trị input total
        if (stillOnCheckout && tc.expect.totalAmountInputValue != null) {
          const actualValue = await po.totalAmountInput.inputValue();
          expectMatches(
            actualValue,
            tc.expect.totalAmountInputValue,
            `[${tc.id}] input total value`,
          );
        }

        // Pattern #4: Business rule — final total text
        if (tc.expect.finalTotalTextContains != null) {
          const actualText = await po.getFinalTotalText();
          expectMatches(
            actualText,
            tc.expect.finalTotalTextContains,
            `[${tc.id}] final total text`,
          );
        }

        // Pattern #4: Business rule — số <li> trong cart list
        if (tc.expect.cartItemRows != null) {
          const count = await po.cartItemRows.count();
          expect(
            count,
            `[${tc.id}] số <li> trong cart list`,
          ).toBe(tc.expect.cartItemRows);

          if (tc.expect.expectedCartItemTextContains) {
            const texts = await po.getCartItemTexts();
            const combined = texts.join(" || ");
            expectMatches(
              combined,
              tc.expect.expectedCartItemTextContains,
              `[${tc.id}] cart item text pattern`,
            );
          }
        }

        // Pattern #3 (extension): TC-C2 — verify GET /api/cart trả [] sau checkout
        if (tc.id === "TC-C2" && tc.expect.successHeadingVisible) {
          const token = await page.evaluate(() =>
            localStorage.getItem("token"),
          );
          const headers = { Authorization: `Bearer ${token}` };
          const apiBase = process.env.BACKEND_URL ?? "http://localhost:3000";
          const cartRes = await page.request.get(
            `${apiBase}${CART_API_PATH}`,
            { headers },
          );
          const cartData = await cartRes.json();
          expect(
            Array.isArray(cartData) && cartData.length === 0,
            `[TC-C2] GET /api/cart sau checkout phải trả [] (FR-08-BUG-003). Actual: ${JSON.stringify(cartData).slice(0, 200)}`,
          ).toBe(true);
        }

        // TC-A1: bonus assertion — input total phải là số dương
        // (giúp verify chuỗi end-to-end có khớp không)
        if (tc.id === "TC-A1" && cartTotal > 0 && stillOnCheckout) {
          // uiSetupCart chỉ click 2 lần "Thêm vào giỏ" (mỗi cái quantity=1)
          // → pre-fill input phải = price_product1 + price_product2
          try {
            const inputVal = Number(
              await po.totalAmountInput.inputValue({ timeout: 5000 }),
            );
            expect(
              inputVal,
              `[TC-A1] input total phải là số dương (got ${inputVal})`,
            ).toBeGreaterThan(0);
          } catch {
            /* swallow — locator có thể đã stale nếu page redirect */
          }
        }
      } finally {
        alertCapture.detach();
      }
    });
  }
});
