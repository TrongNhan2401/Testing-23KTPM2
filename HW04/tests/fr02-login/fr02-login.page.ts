import { Page, Locator, expect } from "@playwright/test";

/**
 * Page Object cho trang Login (/login) — FR-02.
 *
 * Thứ tự ưu tiên selector (theo SKILL.md Bước 2):
 *   1. data-testid   — KHÔNG có trong DOM FR-02 hiện tại.
 *   2. role + name   — dùng cho button "Sign In".
 *   3. label         — dùng cho 2 field input (Username, Mật khẩu).
 *   4. CSS/text      — chỉ dùng cho error message (fallback, ghi chú fragile).
 *
 * KHÔNG chứa assertion ở đây — chỉ chứa locator + action method.
 * Assertion sẽ được đặt trong file .spec.ts.
 */
export class Fr02LoginPage {
  readonly page: Page;

  // Locators (Bước 2)
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly registerLink: Locator;
  readonly formErrorMessage: Locator;

  // Header locators (dùng cho case "login đúng → header đổi")
  readonly headerLoginLink: Locator;
  readonly headerRegisterLink: Locator;
  readonly headerUserGreeting: Locator; // dùng CSS — fallback

  constructor(page: Page) {
    this.page = page;

    // Field input — dùng getByLabel (ưu tiên #3)
    // Lưu ý: label thực tế là "Username" và "Mật khẩu"
    this.usernameInput = page.getByLabel("Username");
    this.passwordInput = page.getByLabel("Mật khẩu");

    // Submit button — dùng role + accessible name (ưu tiên #2)
    this.submitButton = page.getByRole("button", { name: "Sign In" });

    // Link phụ
    this.forgotPasswordLink = page.getByRole("link", { name: "Quên mật khẩu?" });
    this.registerLink = page.getByRole("link", { name: /Đăng ký ngay/i });

    // Error message — DOM không có data-testid cố định.
    // Selector fallback: phần tử có class chứa "text-red" hoặc role="alert".
    // Selector này FRAGILE — sẽ được note trong gap analysis.
    this.formErrorMessage = page.locator('[role="alert"], .text-red-500, .text-red-600, .error, .error-message').first();

    // Header locators — dùng để verify sau login đúng
    this.headerLoginLink = page.locator("header nav").getByRole("link", { name: "Đăng nhập" });
    this.headerRegisterLink = page.locator("header nav").getByRole("link", { name: "Đăng ký" });
    this.headerUserGreeting = page.locator("header"); // sẽ kiểm tra sự vắng mặt của login/register link
  }

  // ===== Action methods (không chứa assertion) =====

  /**
   * Điều hướng tới trang login. Dùng baseURL từ playwright.config.js.
   */
  async goto(): Promise<void> {
    await this.page.goto("/login");
  }

  /**
   * Điền form login. Đây là method generic dùng cho data-driven test.
   */
  async fillCredentials(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
  }

  /**
   * Điền và submit form login.
   */
  async login(username: string, password: string): Promise<void> {
    await this.fillCredentials(username, password);
    await this.submitButton.click();
  }

  /**
   * Submit form không điền gì (để test HTML5 required validation).
   */
  async submitEmpty(): Promise<void> {
    await this.submitButton.click();
  }

  /**
   * Clear toàn bộ form.
   */
  async clearForm(): Promise<void> {
    await this.usernameInput.clear();
    await this.passwordInput.clear();
  }

  /**
   * Đợi cho URL thay đổi sau khi submit (helper cho navigation assertion).
   * @param timeout thời gian đợi tối đa (ms), mặc định 5000
   */
  async waitForNavigationAfterLogin(timeout: number = 5000): Promise<void> {
    await this.page.waitForURL((url) => !url.pathname.includes("/login"), {
      timeout,
    });
  }

  /**
   * Click "Đăng ký ngay" để điều hướng sang /register.
   */
  async goToRegister(): Promise<void> {
    await this.registerLink.click();
  }

  /**
   * Click "Quên mật khẩu?" để điều hướng sang /forgot-password.
   */
  async goToForgotPassword(): Promise<void> {
    await this.forgotPasswordLink.click();
  }

  /**
   * Kiểm tra nhanh: form có hiển thị không (page đã load xong chưa).
   */
  async isLoaded(): Promise<boolean> {
    return await this.submitButton.isVisible();
  }
}
