import { Page, Locator, expect } from "@playwright/test";

/**
 * Page Object cho trang Login (/login) - FR-02.
 *
 * Thứ tự ưu tiên selector (theo SKILL.md Bước 2):
 *   1. data-testid   - KHONG co trong DOM FR-02 (xac nhan debug).
 *   2. role + name   - KHONG dung duoc vi input khong co accessible name.
 *   3. label         - KHONG dung duoc vi label khong co 'for' attribute.
 *      → Phai dung "closest label" de match label cha.
 *   4. CSS/text      - CHỈ DÙNG cho fallback.
 *
 * Xác nhận từ debug (debug-dom.js, 2026-08-09):
 *   - Input: id="", name="", placeholder="", aria-label=null, aria-labelledby=null
 *   - Label: for=null, text="Username"/"Mật khẩu"
 *   → getByLabel trả 0 elements
 *   → Phải dùng `page.locator('label:has-text("...") + * input')` hoặc tương tự
 *
 * KHONG chua assertion o day - chi chua locator + action method.
 */
export class Fr02LoginPage {
  readonly page: Page;

  // Locators (Bước 2 - REVISED)
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly registerLink: Locator;
  readonly formErrorMessage: Locator;

  // Header locators
  readonly headerLoginLink: Locator;
  readonly headerRegisterLink: Locator;
  readonly headerUserGreeting: Locator;

  constructor(page: Page) {
    this.page = page;

    // Input: Dùng CSS sibling selector `~ input` vì:
    //   - Label KHÔNG có thuộc tính 'for' (xác nhận debug-dom.js 2026-08-09)
    //   - Input là element kế tiếp label trong cùng parent (xác nhận debug)
    //   - getByLabel() trả về 0 vì không có label-for hoặc aria-labelledby
    // CSS `~` chỉ match sibling CÙNG parent, ngay sau label.
    this.usernameInput = page
      .locator('label:has-text("Username") ~ input')
      .first();

    this.passwordInput = page
      .locator('label:has-text("Mật khẩu") ~ input')
      .first();

    // Submit button - vẫn dùng role+name (button thường có accessible name)
    this.submitButton = page.getByRole("button", { name: "Sign In" });

    // Link phụ
    this.forgotPasswordLink = page.getByRole("link", { name: "Quên mật khẩu?" });
    this.registerLink = page.getByRole("link", { name: /Đăng ký ngay/i });

    // Error message - selector fallback
    this.formErrorMessage = page
      .locator('[role="alert"], .text-red-500, .text-red-600, .error, .error-message')
      .first();

    // Header locators
    this.headerLoginLink = page.locator("header nav").getByRole("link", { name: "Đăng nhập" });
    this.headerRegisterLink = page.locator("header nav").getByRole("link", { name: "Đăng ký" });
    this.headerUserGreeting = page.locator("header");
  }

  // ===== Action methods =====

  async goto(): Promise<void> {
    await this.page.goto("/login");
  }

  async fillCredentials(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
  }

  async login(username: string, password: string): Promise<void> {
    await this.fillCredentials(username, password);
    await this.submitButton.click();
  }

  async submitEmpty(): Promise<void> {
    await this.submitButton.click();
  }

  async clearForm(): Promise<void> {
    await this.usernameInput.clear();
    await this.passwordInput.clear();
  }

  async waitForNavigationAfterLogin(timeout: number = 5000): Promise<void> {
    await this.page.waitForURL((url) => !url.pathname.includes("/login"), {
      timeout,
    });
  }

  async goToRegister(): Promise<void> {
    await this.registerLink.click();
  }

  async goToForgotPassword(): Promise<void> {
    await this.forgotPasswordLink.click();
  }

  async isLoaded(): Promise<boolean> {
    return await this.submitButton.isVisible();
  }
}