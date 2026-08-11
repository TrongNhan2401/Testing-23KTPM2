/**
 * Page Object — FR-08: Checkout
 * SUT: http://localhost:5173/checkout
 *
 * === Inspect Element bảng (trích từ eshop/frontend-web/src/pages/Checkout.jsx) ===
 *  Toàn bộ element KHÔNG có id / name / data-testid / aria-label / label[for].
 *  Chỉ có: <label> (text), <input> (placeholder/type), <button> (text), <ul>, <h2/h3>, <p>, <span>.
 *
 *  Selector Robustness theo SKILL.md:
 *    Mức 1 (Stable)   : getByRole('heading'|'button', { name: ... })
 *    Mức 2 (Medium)   : getByLabel(...) cho input có label, getByPlaceholder(...) cho input có placeholder
 *    Mức 3 (Fragile)  : CSS class / text thuần — đánh dấu // FRAGILE
 *
 *  Ghi chú UI observations (sẽ dùng cho Gap Analysis Bước 5):
 *   - Thiếu hoàn toàn data-testid / id / name — đề xuất dev bổ sung.
 *   - Input totalAmount là editable (type=number) — vi phạm FR-08 ("không cho phép chỉnh sửa").
 *   - KHÔNG có input shipping_address trên UI — vi phạm nghiệp vụ giao hàng.
 *   - Khu vực Coupon (FR-09) có locator nhưng KHÔNG test trong scope FR-08.
 */

import { expect, type Locator, type Page } from "@playwright/test";

export class CheckoutPage {
  readonly page: Page;

  // --- Headings --------------------------------------------------------------
  readonly pageTitle: Locator; // "Xác Nhận Đơn Hàng"
  readonly cartListHeading: Locator; // "Sản phẩm:"
  readonly successHeading: Locator; // "Thanh toán thành công!"
  readonly backToHomeLink: Locator; // "Quay lại trang chủ"

  // --- Form ------------------------------------------------------------------
  readonly totalAmountInput: Locator; // input tổng tiền (editable — vi phạm FR-08)
  readonly finalTotalText: Locator; // span "Tổng thanh toán: X ₫"
  readonly checkoutButton: Locator; // nút "Xác Nhận Thanh Toán"

  // --- Cart list (FR-08 — hiển thị sản phẩm) -------------------------------
  readonly cartItemsList: Locator; // <ul> không có marker — // FRAGILE
  readonly cartItemRows: Locator; // <li> con — // FRAGILE

  // --- Coupon (FR-09 — chỉ tham chiếu, KHÔNG test sâu trong FR-08) ---------
  readonly couponInput: Locator;
  readonly applyCouponButton: Locator;
  readonly couponErrorMessage: Locator; // FRAGILE
  readonly couponResultBlock: Locator; // FRAGILE

  constructor(page: Page) {
    this.page = page;

    // --- Headings (Mức 1) ---
    this.pageTitle = page.getByRole("heading", {
      name: /Xác Nhận Đơn Hàng/i,
      level: 2,
    });
    this.cartListHeading = page.getByRole("heading", {
      name: /Sản phẩm:/i,
      level: 3,
    });
    this.successHeading = page.getByRole("heading", {
      name: /Thanh toán thành công/i,
      level: 2,
    });
    this.backToHomeLink = page.getByRole("button", {
      name: /Quay lại trang chủ/i,
    });

    // --- Form (Mức 1 + 2) ---
    // Input total: KHÔNG có id/aria-label/htmlFor. Label "Tổng tiền thanh toán (VND):"
    // chỉ là <label> chứ không gắn với input → getByLabel KHÔNG work.
    // Đã verify Checkout.jsx dòng 91-101:
    //   input có class="border p-2 rounded text-red-600 font-bold" + type="number"
    //   <label> KHÔNG có htmlFor hoặc bọc input → không có accessible name
    //
    // CHIẾN LƯỢC MỚI (sau smoke test):
    //   - `input[type="number"].text-red-600` → match đúng 1 input trong toàn trang
    //   - Là Mức 3 (FRAGILE) vì dựa vào CSS class Tailwind — đánh dấu rõ
    //   - Đề xuất Gap Analysis: dev nên bổ sung data-testid="total-amount-input"
    this.totalAmountInput = page.locator(
      'input[type="number"].text-red-600',
    );

    this.checkoutButton = page.getByRole("button", {
      name: /Xác Nhận Thanh Toán/i,
    });

    // FRAGILE: span "Tổng thanh toán:" có text ổn định nhưng không có test-id
    //   -> dùng text matcher (Mức 3 — fallback)
    this.finalTotalText = page.locator("span", {
      hasText: /Tổng thanh toán:/,
    });

    // --- Cart list (Mức 3 — FRAGILE) ---
    // FRAGILE: <ul> không có id/testid — fallback theo class Tailwind "list-disc"
    //   Nếu dev đổi class (vd sang CSS module), locator gãy ngay.
    this.cartItemsList = page.locator("ul.list-disc").first();
    this.cartItemRows = this.cartItemsList.locator("li");

    // --- Coupon — thuộc FR-09, ngoài phạm vi FR-08 ---
    // Chỉ expose locator để tham chiếu nếu cần debug; KHÔNG viết test cho nó.
    this.couponInput = page.getByPlaceholder(/Nhập mã giảm giá/i);
    this.applyCouponButton = page.getByRole("button", { name: /Áp dụng/i });
    // FRAGILE: error message chỉ là `<p class="mt-2 text-red-600 text-sm">` không có role/aria
    this.couponErrorMessage = page.locator("p.text-red-600").first();
    // FRAGILE: khối kết quả chỉ có class — có thể trùng với khối khác trong tương lai
    this.couponResultBlock = page.locator("div.text-green-700").first();
  }

  // --- Navigation ------------------------------------------------------------

  async goto(): Promise<void> {
    await this.page.goto("/checkout");
    // Đợi một trong hai heading xuất hiện (form hoặc success)
    await expect(this.pageTitle.or(this.successHeading)).toBeVisible();
  }

  // --- Actions (KHÔNG chứa assertion — theo SKILL.md) -----------------------

  async setTotalAmount(value: number | string): Promise<void> {
    await this.totalAmountInput.fill(String(value));
  }

  async submitCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  /**
   * Thực hiện checkout và chờ network response `/api/checkout` để trả về cả UI + payload.
   * Trả về response object để Bước 4 dùng cho network assertion (assert pattern #3).
   */
  async submitAndWaitForCheckoutResponse(): Promise<
    import("@playwright/test").Response
  > {
    const responsePromise = this.page.waitForResponse(
      (res) =>
        res.url().includes("/api/checkout") &&
        res.request().method() === "POST",
    );
    await this.submitCheckout();
    return responsePromise;
  }

  async goBackToHome(): Promise<void> {
    await this.backToHomeLink.click();
  }

  // --- Helpers cho TC-UI-* (chỉ truy xuất text, không assert) --------------

  /** Lấy danh sách tên sản phẩm hiển thị (text của từng <li>) */
  async getCartItemTexts(): Promise<string[]> {
    return this.cartItemRows.allInnerTexts();
  }

  /** Lấy text hiển thị ở dòng "Tổng thanh toán: X ₫" */
  async getFinalTotalText(): Promise<string> {
    return (await this.finalTotalText.textContent()) ?? "";
  }
}
