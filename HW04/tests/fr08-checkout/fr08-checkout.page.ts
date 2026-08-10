import { Page, Locator, expect } from "@playwright/test";

/**
 * ============================================================
 * Fr08CheckoutPage — Page Object cho FR-08 Checkout
 * ============================================================
 *
 * Bảng Inspect DOM (từ HTML dump user cung cấp):
 *
 * | Thuộc tính       | Tổng tiền input                          | Coupon input                          | Btn Áp dụng       | Btn Xác Nhận           |
 * | ---------------- | --------------------------------------- | ------------------------------------- | ----------------- | ---------------------- |
 * | `id`             | `""`                                    | `""`                                  | `""`              | `""`                   |
 * | `name`           | `""`                                    | `""`                                  | `""`              | `""`                   |
 * | `placeholder`    | `""`                                    | `"Nhập mã giảm giá..."`               | n/a               | n/a                    |
 * | `aria-label`     | `null`                                  | `null`                                | `null`            | `null`                 |
 * | `aria-labelledby`| `null`                                  | `null`                                | `null`            | `null`                 |
 * | `label[for]`     | `null` (label không có `for`)           | `null`                                | n/a               | n/a                    |
 * | `label` text     | `"Tổng tiền thanh toán (VND):"`         | `"Mã Giảm Giá"`                       | `"Áp dụng"`       | `"Xác Nhận Thanh Toán"`|
 * | Position         | sibling ngay sau label                  | sibling ngay sau label                | sibling ngay sau  | button submit          |
 *
 * Kết luận:
 * - KHÔNG có `data-testid`, `aria-label`, `id`, `name`, `label[for]` → vi phạm accessibility.
 * - Selector ưu tiên: `getByRole` (button) + `label:has-text() ~ input` (CSS sibling — fragile).
 * - Cần đề xuất dev thêm `data-testid` cho tất cả input/button quan trọng.
 *
 * Selector Robustness Rubric (theo SKILL.md):
 * - Level 1 (Stable):   getByRole('button', { name: '...' }) — dùng cho Áp dụng, Xác Nhận Thanh Toán
 * - Level 2 (Medium):   getByPlaceholder — chỉ dùng được cho coupon input
 * - Level 3 (Fragile):  CSS sibling — đánh dấu FRAGILE
 * - Level 3 (Fragile):  CSS class `.bg-green-600`, `.bg-orange-500` — FRAGILE, fallback
 * ============================================================
 */
export class Fr08CheckoutPage {
  // ====== HEADER / NAVIGATION ======
  // Level 1: role + accessible name (link EShop ở header)
  readonly headerLogo: Locator;
  readonly headerCartLink: Locator;
  readonly headerProfileLink: Locator;
  readonly headerLogoutButton: Locator;

  // ====== FORM: TITLE ======
  // Level 1: heading role (chỉ có 1 h2 trên trang)
  readonly formTitle: Locator;

  // ====== FORM: PRODUCT LIST ======
  // Level 3: CSS list class (FRAGILE)
  readonly productList: Locator;
  readonly productItems: Locator;

  // ====== FORM: TOTAL AMOUNT INPUT (BUG FR-08-FUNC-BUG-001) ======
  // Level 3: CSS sibling (FRAGILE — không có id/name/for/aria)
  // Lý do: label "Tổng tiền thanh toán (VND):" đứng ngay trước input, dùng `+` để chọn sibling kế tiếp
  readonly totalAmountInput: Locator;

  // ====== FORM: COUPON INPUT + BUTTON ======
  // Level 2: placeholder (ổn định vì dev thường không đổi)
  readonly couponInput: Locator;
  // Level 1: getByRole — button có accessible name
  readonly applyCouponButton: Locator;

  // ====== FORM: TOTAL DISPLAY ======
  // Level 3: text-based (FRAGILE — text có thể đổi format)
  readonly totalDisplay: Locator;

  // ====== FORM: SUBMIT BUTTON ======
  // Level 1: getByRole — button có accessible name
  readonly confirmButton: Locator;

  // ====== ERROR/SUCCESS MESSAGES ======
  // Level 3: text-based fallback (FRAGILE — backend có thể đổi message)
  readonly pageErrorMessage: Locator;
  readonly couponSuccessMessage: Locator;
  readonly couponErrorMessage: Locator;

  // ====== URL CONSTANTS ======
  static readonly CHECKOUT_URL = "/checkout";
  static readonly LOGIN_URL = "/login";
  static readonly CART_URL = "/cart";
  static readonly HOME_URL = "/";

  constructor(private readonly page: Page) {
    // ====== HEADER ======
    this.headerLogo = page.getByRole("link", { name: "EShop", exact: true });
    this.headerCartLink = page.getByRole("link", { name: "Giỏ hàng", exact: true });
    this.headerProfileLink = page.getByRole("link", { name: /Chào/ });
    this.headerLogoutButton = page.getByRole("button", { name: "Thoát" });

    // ====== FORM TITLE ======
    this.formTitle = page.getByRole("heading", { name: "Xác Nhận Đơn Hàng" });

    // ====== PRODUCT LIST ======
    // FRAGILE: CSS class — dev đổi class là gãy
    this.productList = page.locator("ul.list-disc");
    this.productItems = page.locator("ul.list-disc li");

    // ====== TOTAL AMOUNT INPUT ======
    // FRAGILE: CSS sibling — chỉ chọn được vì label đứng ngay trước input
    // Nếu dev thêm 1 element vào giữa → gãy
    this.totalAmountInput = page
      .locator('label:has-text("Tổng tiền thanh toán") + input[type="number"]');

    // ====== COUPON INPUT ======
    // Level 2: getByPlaceholder — OK vì placeholder text thường ổn định
    this.couponInput = page.getByPlaceholder("Nhập mã giảm giá...");

    // ====== APPLY COUPON BUTTON ======
    // Level 1: getByRole — ổn định nhất
    this.applyCouponButton = page.getByRole("button", { name: "Áp dụng", exact: true });

    // ====== TOTAL DISPLAY ======
    // FRAGILE: text-based — dev có thể đổi format số (1,000,000 vs 1.000.000)
    // Chỉ check container span có text "Tổng thanh toán"
    this.totalDisplay = page.locator('span:has-text("Tổng thanh toán")');

    // ====== CONFIRM CHECKOUT BUTTON ======
    // Level 1: getByRole — ổn định nhất
    this.confirmButton = page.getByRole("button", { name: "Xác Nhận Thanh Toán", exact: true });

    // ====== ERROR / SUCCESS MESSAGES ======
    // FRAGILE: dùng role="alert" + text-based fallback
    // Dev có thể đổi nội dung message → test có thể false-positive
    // Ưu tiên: [role="alert"] (chuẩn WAI-ARIA) — nếu không có thì fallback text

    // NOTE: KHÔNG dùng `.text-red-600` (collision với input tổng tiền cũng có class này)
    // Chỉ chọn `<p>` element vì SUT render message thành `<p>` element
    this.pageErrorMessage = page.locator(
      '[role="alert"], p.error-message, p.text-red-600, p.text-red-500'
    ).first();

    this.couponSuccessMessage = page.locator(
      '[role="status"], p.success-message, p.text-green-600'
    ).first();

    this.couponErrorMessage = page.locator(
      'p.coupon-error, p.text-red-600, p.text-red-500'
    ).first();
  }

  // ================================================================
  // NAVIGATION METHODS
  // ================================================================

  /**
   * Điều hướng đến trang checkout — dùng baseURL từ config (KHÔNG hardcode URL)
   */
  async gotoCheckout(): Promise<void> {
    await this.page.goto(Fr08CheckoutPage.CHECKOUT_URL);
  }

  async gotoLogin(): Promise<void> {
    await this.page.goto(Fr08CheckoutPage.LOGIN_URL);
  }

  async gotoCart(): Promise<void> {
    await this.page.goto(Fr08CheckoutPage.CART_URL);
  }

  /**
   * Click "Giỏ hàng" ở header
   */
  async clickHeaderCart(): Promise<void> {
    await this.headerCartLink.click();
  }

  /**
   * Click "Đăng xuất" ở header
   */
  async logout(): Promise<void> {
    await this.headerLogoutButton.click();
  }

  // ================================================================
  // LOGIN PRECONDITION
  // ================================================================

  /**
   * Login qua UI form (FR-02 flow) — dùng cho precondition test.
   * KHÔNG đặt assertion ở đây — chỉ là action.
   *
   * Lưu ý: Nếu test cần setup user chưa đăng nhập (TC-UI-B1), dùng clearAuthState()
   */
  async loginViaUI(email: string, password: string): Promise<void> {
    await this.gotoLogin();
    // FR-02 dùng label "Username" và "Mật khẩu" — selector đã được FR-02 Page Object verify
    const usernameInput = this.page.locator('label:has-text("Username") ~ input').first();
    const passwordInput = this.page.locator('label:has-text("Mật khẩu") ~ input').first();
    const submitButton = this.page.getByRole("button", { name: "Sign In" });

    await usernameInput.fill(email);
    await passwordInput.fill(password);
    await submitButton.click();

    // Đợi navigate ra khỏi /login
    await this.page.waitForURL((url) => !url.pathname.includes("/login"), {
      timeout: 10000,
    });
  }

  /**
   * Clear auth state — dùng cho TC-UI-B1 (chưa đăng nhập)
   * Clear cookies + localStorage + sessionStorage
   */
  async clearAuthState(): Promise<void> {
    await this.page.context().clearCookies();
    await this.page.evaluate(() => {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch {
        // ignore — có thể page chưa load
      }
    });
  }

  // ================================================================
  // CHECKOUT ACTIONS
  // ================================================================

  /**
   * Apply coupon — nhập code và click "Áp dụng"
   *
   * Best-effort:
   * - Nếu button "Áp dụng" bị disabled (HTML disabled="" mặc định khi input rỗng),
   *   method này sẽ KHÔNG click. Caller cần check button state nếu muốn assert.
   * - Trả về boolean để caller biết có click được hay không.
   */
  async applyCoupon(couponCode: string): Promise<boolean> {
    await this.couponInput.fill(couponCode);

    // Check button enabled trước khi click — tránh timeout 20s
    const isDisabled = await this.applyCouponButton.isDisabled().catch(() => true);
    if (isDisabled) {
      return false;
    }

    await this.applyCouponButton.click();
    // Đợi 1 chút để message render
    await this.page.waitForTimeout(500);
    return true;
  }

  /**
   * Click "Xác Nhận Thanh Toán"
   */
  async confirmCheckout(): Promise<void> {
    await this.confirmButton.click();
  }

  // ================================================================
  // VERIFICATION METHODS (read-only — không có assertion)
  // ================================================================

  /**
   * Đọc giá trị hiện tại của input Tổng tiền
   * Dùng để verify: input có readonly không (TC-UI-B3)
   */
  async getTotalAmountValue(): Promise<string> {
    return (await this.totalAmountInput.inputValue()) ?? "";
  }

  /**
   * Check input Tổng tiền có `readonly` attribute không (TC-UI-B3)
   * Trả về true nếu readonly (bảo vệ client-side đúng), false nếu user có thể sửa
   */
  async isTotalAmountReadonly(): Promise<boolean> {
    return await this.totalAmountInput.evaluate((el) => {
      // readonly có thể là HTMLInputElement.readOnly hoặc attribute
      return (el as HTMLInputElement).readOnly === true;
    });
  }

  /**
   * Đọc text hiển thị tổng tiền (span "Tổng thanh toán: ...")
   */
  async getTotalDisplayText(): Promise<string> {
    return ((await this.totalDisplay.textContent()) ?? "").trim();
  }

  /**
   * Lấy số lượng sản phẩm hiển thị trong cart
   */
  async getProductItemCount(): Promise<number> {
    return await this.productItems.count();
  }

  /**
   * Lấy text tất cả sản phẩm trong cart (cho debug/log)
   */
  async getProductItemTexts(): Promise<string[]> {
    return await this.productItems.allTextContents();
  }

  /**
   * Check button "Áp dụng" có đang disabled không
   * Dùng cho verify TC-UI-D3: nhập coupon rỗng / whitespace → button disabled
   */
  async isApplyCouponButtonDisabled(): Promise<boolean> {
    return await this.applyCouponButton.isDisabled();
  }

  /**
   * Check button "Xác Nhận Thanh Toán" có visible và enabled không
   */
  async isConfirmButtonEnabled(): Promise<boolean> {
    return await this.confirmButton.isEnabled();
  }

  /**
   * Verify URL hiện tại có match pattern không (helper cho test)
   * Ví dụ: await po.isOnPath("/login")
   */
  async isOnPath(pathPattern: RegExp): Promise<boolean> {
    const url = this.page.url();
    return pathPattern.test(url);
  }
}
