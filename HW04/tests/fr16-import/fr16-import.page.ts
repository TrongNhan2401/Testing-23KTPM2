/**
 * Page Object — FR-16: Import sản phẩm từ CSV (Admin)
 *
 * SUT URL: http://localhost:5174/  (admin panel — Vite default port riêng)
 * Source:  eshop/frontend-admin/src/App.jsx  (dòng 188–215 login + dòng 337–481 Products/CSV Import)
 *
 * ============================================================================
 * BẢNG INSPECT ELEMENT — Thuộc tính DOM trích xuất từ source code
 * ============================================================================
 *
 * | Phần tử                    | id   | name | type     | data-testid | aria-* | placeholder/label text | Class                                  | Position                | Robustness |
 * | -------------------------- | ---- | ---- | -------- | ----------- | ------ | ---------------------- | -------------------------------------- | ----------------------- | ---------- |
 * | Email input (login)        | ""   | ""   | ""       | null        | null   | placeholder="Email"    | "w-full border p-2 mb-4"                | form > input[0]         | 2 (Medium) |
 * | Password input (login)     | ""   | ""   | password | null        | null   | placeholder="Password" | "w-full border p-2 mb-4"                | form > input[1]         | 2 (Medium) |
 * | Login button               | ""   | ""   | submit   | null        | null   | text="Login"           | "w-full bg-blue-600 text-white p-2 rounded" | form > button        | 2 (Medium) |
 * | Tab "Sản phẩm"             | ""   | ""   | ""       | null        | null   | text="Sản phẩm"       | "cursor-pointer hover:text-blue-300"    | nav > ul > li[2]        | 4 (Break)  |
 * | Section heading Import CSV | ""   | ""   | ""       | null        | null   | text="📂 Import sản phẩm từ CSV" | "font-bold text-blue-800" | div > h3              | 2 (Medium) |
 * | Link tải template          | ""   | ""   | ""       | null        | null   | text="Tải file mẫu (template.csv)" | "text-xs text-blue-600 underline" | div > a           | 2 (Medium) |
 * | File input (CSV)           | ""   | ""   | file     | null        | null   | ""                     | "border p-2 rounded bg-white flex-1 text-sm" | div > input[type=file]| 3 (Fragile)|
 * | Button Import              | ""   | ""   | button   | null        | null   | text=^Import \d+ sản phẩm$ hoặc "Đang import..." | "bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 whitespace-nowrap" | div > button | 2 (Medium) |
 * | Preview text "Xem trước"   | ""   | ""   | ""       | null        | null   | text=/^Xem trước \(\d+ dòng\):$/ | "text-sm text-blue-700 mb-1" | div > p              | 2 (Medium) |
 * | Preview table              | ""   | ""   | ""       | null        | null   | ""                     | "w-full text-xs bg-white border rounded"  | div > table             | 3 (Fragile)|
 * | Preview row                | ""   | ""   | ""       | null        | null   | ""                     | "border-b"                              | table > tbody > tr       | 3 (Fragile)|
 * | Result box (success/error) | ""   | ""   | ""       | null        | null   | text=^✅.*hoàn tất$ hoặc text=^❌  | "mt-2 p-3 rounded text-sm"              | div > div (cuối)        | 2 (Medium) |
 * | Alert (non-admin)          | —    | —    | —        | —           | —      | text="Bạn không phải là admin!" | window.alert()                  | global                  | 2 (Medium) |
 *
 * ============================================================================
 * NHẬN XÉT VỀ ACCESSIBILITY:
 * - KHÔNG có bất kỳ `data-testid` nào trong toàn bộ admin panel
 * - KHÔNG có `id` attribute cho bất kỳ element tương tác nào
 * - KHÔNG có `aria-*` attributes
 * - Tất cả input chỉ có `placeholder` (placeholder không phải stable selector vì dev dễ đổi)
 * - Class Tailwind dài và có thể thay đổi theo design
 * - Navigation dùng `onClick` thay vì `react-router` Link → không có semantic role
 *
 * ===> Tất cả selector dưới đây đều ở mức 2-3. ĐỀ XUẤT: thêm `data-testid` cho
 *      các element tương tác chính (file input, button import, result box).
 * ============================================================================
 */

import { Page, Locator, expect } from "@playwright/test";
import * as path from "node:path";

export class Fr16ImportPage {
  readonly page: Page;

  // ============ Admin Login (dòng 188-215) ============
  /** Email input trên form login admin. FRAGILE: chỉ có placeholder, không có id/label. */
  readonly emailInput: Locator;
  /** Password input trên form login admin. */
  readonly passwordInput: Locator;
  /** Button "Login" trên form login admin. */
  readonly loginButton: Locator;

  // ============ Admin Sidebar Navigation (dòng 222-272) ============
  /** Sidebar nav item "Sản phẩm" — click để mở tab Products (có CSV Import section). FRAGILE: nth-child(3). */
  readonly productsTab: Locator;
  /** Sidebar nav item "Đăng xuất" — dùng để reset state giữa các test. */
  readonly logoutButton: Locator;

  // ============ CSV Import Section (dòng 341-481) ============
  /** Section heading "📂 Import sản phẩm từ CSV" — xác nhận section đã render. */
  readonly importSectionHeading: Locator;
  /** Link tải file mẫu template. */
  readonly templateDownloadLink: Locator;
  /** File input `type="file"` cho CSV. */
  readonly csvFileInput: Locator;
  /** Button "Import N sản phẩm" hoặc "Đang import..." — enable khi có preview, disabled khi rỗng/đang chạy. */
  readonly importButton: Locator;
  /** Text "Xem trước (N dòng):" — confirm preview table đã render. */
  readonly previewHeading: Locator;
  /** Preview table hiển thị data từ CSV. FRAGILE: chỉ có class, không có id. */
  readonly previewTable: Locator;
  /** Mỗi row trong preview table. */
  readonly previewRows: Locator;
  /** Result box (success/error) sau khi bấm Import. */
  readonly resultBox: Locator;
  /** Result message text (✅ success hoặc ❌ error). */
  readonly resultMessage: Locator;
  /** Errors list <ul> trong result box (chỉ hiển thị khi có lỗi validation). */
  readonly resultErrorsList: Locator;

  constructor(page: Page) {
    this.page = page;

    // ----- Login form (dòng 196-211) -----
    // FRAGILE: dùng placeholder thay vì label/id — dev đổi placeholder là selector chết
    this.emailInput = page.getByPlaceholder("Email");
    this.passwordInput = page.getByPlaceholder("Password");
    this.loginButton = page.getByRole("button", { name: "Login", exact: true });

    // ----- Sidebar navigation (dòng 237-244) -----
    // FRAGILE: nth-of-type — thay đổi thứ tự menu là selector chết
    this.productsTab = page.getByText("Sản phẩm", { exact: true }).first();
    this.logoutButton = page.getByText("Đăng xuất", { exact: true });

    // ----- CSV Import section (dòng 344-481) -----
    this.importSectionHeading = page.getByRole("heading", {
      name: /Import sản phẩm từ CSV/i,
    });
    this.templateDownloadLink = page.getByRole("link", {
      name: /Tải file mẫu/i,
    });
    this.csvFileInput = page.locator('input[type="file"]');
    this.importButton = page.getByRole("button", {
      name: /^(Đang import\.\.\.|Import \d+ sản phẩm)$/,
    });
    this.previewHeading = page.getByText(/^Xem trước \(\d+ dòng\):$/);
    // FRAGILE: scope theo class Tailwind (div > table.w-full.text-xs.bg-white.border.rounded)
    this.previewTable = page.locator(
      'div.mt-2 div.overflow-x-auto table.w-full.text-xs.bg-white.border.rounded',
    );
    this.previewRows = this.previewTable.locator("tbody tr");
    this.resultBox = page.locator(
      'div.mt-2.p-3.rounded.text-sm.bg-green-100, div.mt-2.p-3.rounded.text-sm.bg-red-100',
    );
    // Text result: ✅ <message> hoặc ❌ <error>
    this.resultMessage = page.locator(
      'div.mt-2.p-3.rounded.text-sm p',
    ).first();
    this.resultErrorsList = page.locator(
      'div.mt-2.p-3.rounded.text-sm ul.list-disc',
    );
  }

  // ============ Navigation actions ============

  /**
   * Navigate tới admin panel (port 5174).
   * baseURL sẽ được config trong playwright.config.js riêng cho FR-16.
   */
  async goto(): Promise<void> {
    await this.page.goto("/");
  }

  /**
   * Login admin — happy path.
   * @param email — admin email (vd từ .auth/admin.json)
   * @param password — admin password
   */
  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Click tab "Sản phẩm" trên sidebar để mở Products page (chứa CSV Import section).
   */
  async openProductsTab(): Promise<void> {
    await this.productsTab.click();
  }

  /**
   * Upload file CSV qua input[type=file].
   * @param filePath — đường dẫn tuyệt đối tới file CSV fixture
   */
  async uploadCsv(filePath: string): Promise<void> {
    // Đảm bảo path là absolute
    const absolutePath = path.isAbsolute(filePath)
      ? filePath
      : path.resolve(process.cwd(), filePath);
    await this.csvFileInput.setInputFiles(absolutePath);
  }

  /**
   * Click button "Import N sản phẩm".
   * Throw nếu button đang disabled.
   */
  async submitImport(): Promise<void> {
    await this.importButton.click();
  }

  /**
   * Đợi import xong (button text từ "Đang import..." → "Import N sản phẩm").
   * Timeout 15s — chờ network response từ /api/admin/import-products.
   */
  async waitForImportDone(): Promise<void> {
    await expect(this.importButton).not.toHaveText(/Đang import/, {
      timeout: 15000,
    });
  }

  /**
   * Logout — click "Đăng xuất" để reset state giữa các test.
   */
  async logout(): Promise<void> {
    await this.logoutButton.click();
  }

  // ============ Read state (chỉ query, không assertion) ============

  /**
   * Đếm số dòng preview (đã parse từ file CSV).
   * Trả về 0 nếu preview table chưa render.
   */
  async getPreviewRowCount(): Promise<number> {
    if ((await this.previewTable.count()) === 0) return 0;
    return this.previewRows.count();
  }

  /**
   * Đọc text từ result box (✅ hoặc ❌ message).
   * Trả về "" nếu result box chưa render.
   */
  async getResultMessage(): Promise<string> {
    if ((await this.resultBox.count()) === 0) return "";
    return (await this.resultMessage.textContent()) ?? "";
  }

  /**
   * Đọc tất cả error messages trong result box (mỗi <li> là 1 error).
   * Trả về [] nếu không có error list.
   */
  async getResultErrors(): Promise<string[]> {
    if ((await this.resultErrorsList.count()) === 0) return [];
    return this.resultErrorsList.locator("li").allTextContents();
  }

  /**
   * Kiểm tra button Import có đang disabled không.
   */
  async isImportButtonDisabled(): Promise<boolean> {
    return this.importButton.isDisabled();
  }

  /**
   * Đọc text hiện tại của button Import
   * (vd "Import 3 sản phẩm" hoặc "Đang import...").
   */
  async getImportButtonText(): Promise<string> {
    return (await this.importButton.textContent()) ?? "";
  }

  /**
   * Kiểm tra section "Import CSV" đã render chưa.
   */
  async isImportSectionVisible(): Promise<boolean> {
    return this.importSectionHeading.isVisible();
  }
}