import { Page, Locator, expect } from "@playwright/test";

/**
 * ============================================================
 * HomePage — Page Object cho trang chủ (/)
 * ============================================================
 *
 * Bảng Inspect DOM (từ HTML dump trang chủ khi đã authenticated):
 *
 * | Thuộc tính       | Trang chủ                                       |
 * | ---------------- | ----------------------------------------------- |
 * | header logo      | `<a href="/">EShop</a>` (link, exact match)     |
 * | header cart link | `<a href="/cart">Giỏ hàng</a>`                 |
 * | header profile   | `<a>Chào, <userName></a>` (khi authenticated)   |
 * | header logout    | `<button>Thoát</button>`                        |
 * | search input     | `<input placeholder="Tìm kiếm...">`             |
 * | search button    | `<button>Tìm</button>`                          |
 * | product card     | div.border.rounded trong grid                   |
 * | product link     | `<a href="/product/:id">Xem chi tiết</a>`       |
 * | add to cart btn  | `<button>Thêm vào giỏ</button>` (Level 1)       |
 * ============================================================
 *
 * Selector Rubric:
 * - Level 1 (Stable):   getByRole("button", { name: "Thêm vào giỏ" })
 * - Level 2 (Medium):   getByRole("link", { name: "Xem chi tiết" })
 * - Level 3 (Fragile):  div.border.rounded (CSS class)
 */
export class HomePage {
  // ====== HEADER ======
  readonly headerLogo: Locator;
  readonly headerCartLink: Locator;
  readonly headerProfileLink: Locator;
  readonly headerLogoutButton: Locator;

  // ====== SEARCH ======
  readonly searchInput: Locator;
  readonly searchButton: Locator;

  // ====== PRODUCT LIST ======
  // FRAGILE: CSS class
  readonly productCards: Locator;
  readonly productDetailLinks: Locator;
  readonly addToCartButtons: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;

  // ====== URL CONSTANTS ======
  static readonly HOME_URL = "/";
  static readonly CART_URL = "/cart";
  static readonly LOGIN_URL = "/login";
  static readonly PRODUCT_URL_PATTERN = /\/product\/\d+/;

  constructor(private readonly page: Page) {
    // ----- Header -----
    this.headerLogo = page.getByRole("link", { name: "EShop", exact: true });
    this.headerCartLink = page.getByRole("link", { name: "Giỏ hàng", exact: true });
    this.headerProfileLink = page.getByRole("link", { name: /Chào/ });
    this.headerLogoutButton = page.getByRole("button", { name: "Thoát", exact: true });

    // ----- Search -----
    this.searchInput = page.getByPlaceholder("Tìm kiếm...");
    this.searchButton = page.getByRole("button", { name: "Tìm", exact: true });

    // ----- Product list -----
    // FRAGILE: CSS class
    this.productCards = page.locator("div.grid > div.border");
    this.productDetailLinks = page.getByRole("link", { name: "Xem chi tiết" });
    this.productNames = page.locator("div.grid h2");
    this.productPrices = page.locator("div.grid p.text-red-500");

    // Level 1: getByRole cho button — nhiều button cùng tên
    // → .first() để click button đầu tiên
    this.addToCartButtons = page.getByRole("button", { name: "Thêm vào giỏ" });
  }

  // ================================================================
  // NAVIGATION METHODS
  // ================================================================
  async gotoHome(): Promise<void> {
    await this.page.goto(HomePage.HOME_URL);
    // Đợi React render products grid (nếu authenticated)
    // Vì page có thể đã render xong trước khi products fetch xong
    await this.page.waitForLoadState("networkidle").catch(() => {
      /* network idle có thể không đến */
    });
  }

  async gotoCart(): Promise<void> {
    await this.page.goto(HomePage.CART_URL);
  }

  // ================================================================
  // ACTIONS
  // ================================================================

  /**
   * Click "Thêm vào giỏ" cho sản phẩm đầu tiên (index 0)
   * Trả về true nếu click được, false nếu không có sản phẩm
   */
  async addFirstProductToCart(): Promise<boolean> {
    const count = await this.addToCartButtons.count();
    if (count === 0) {
      return false;
    }
    await this.addToCartButtons.first().click();
    // Đợi 1 chút để backend xử lý
    await this.page.waitForTimeout(500);
    return true;
  }

  /**
   * Click "Thêm vào giỏ" cho sản phẩm tại index cụ thể (0-based)
   */
  async addProductAtIndexToCart(index: number): Promise<boolean> {
    const count = await this.addToCartButtons.count();
    if (count <= index) {
      return false;
    }
    await this.addToCartButtons.nth(index).click();
    await this.page.waitForTimeout(500);
    return true;
  }

  async searchProduct(keyword: string): Promise<void> {
    await this.searchInput.fill(keyword);
    await this.searchButton.click();
    await this.page.waitForLoadState("networkidle").catch(() => {});
  }

  // ================================================================
  // READ-ONLY VERIFICATION (no assertion here)
  // ================================================================

  /**
   * Số sản phẩm hiển thị trên trang chủ (sau khi fetch products)
   * - Nếu user chưa authenticated → 0
   * - Nếu authenticated → > 0 (5 trong demo này)
   */
  async getProductCount(): Promise<number> {
    return await this.productCards.count();
  }

  /**
   * Check có đang authenticated không (header có button "Thoát")
   */
  async isAuthenticated(): Promise<boolean> {
    return await this.headerLogoutButton.isVisible().catch(() => false);
  }

  /**
   * Tên sản phẩm tại index
   */
  async getProductNameAt(index: number): Promise<string> {
    return ((await this.productNames.nth(index).textContent()) ?? "").trim();
  }
}
