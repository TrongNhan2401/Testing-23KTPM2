# AI Audit Report — FR-02 Web Automation

> **Feature:** FR-02 Login & Account Lockout
> **SUT URL:** `http://localhost:5173/`
> **Skill áp dụng:** `docs/SKILL.md` — Web Automation Generator
> **AI tool:** Claude (Cursor)
> **Người thực hiện:** Auto AI-first strategy
> **MSSV:** 23127443

---

### [Bước 1] FR-02 — 2026-08-08 (Saturday, ~21:20 UTC+7)

- **AI tool:** Claude
- **Ngày giờ:** 2026-08-08T21:20:00+07:00
- **Prompt (tóm tắt):**
  - Đọc `docs/SKILL.md` để hiểu quy trình 5 bước
  - Đọc `sources_testcase/FR02.md` (28 test cases từ EP + BVA)
  - Đọc DOM thực tế được user cung cấp để xác định selector khả thi
  - Trích xuất đúng 12 test cases phù hợp cho UI Automation (đủ positive / negative / edge)
  - Chuẩn hóa thành bảng Markdown với cột: id, type, input, expected, note
- **Output (tóm tắt):**
  - File `tests/fr02-login/testcases-fr02-login.md` được tạo
  - 12 cases chia thành 4 nhóm: Positive (1), Negative sai thông tin (2), Validation/Edge (4), Lockout (4), Validation kết hợp (1)
  - Mỗi case có mapping trỏ về case gốc trong `sources_testcase/FR02.md` để dễ truy vết
  - Ghi chú quan trọng: input Username không có `type="email"` → không có HTML5 native validation; Mật kh�u có `type="text"` (không phải password) — quan sát UX/dùng
- **Lý do chọn 12 case cụ thể:**
  - Giữ TC-UI-A1 (happy path — bắt buộc)
  - Giữ TC-UI-B1, B2 (2 case sai thông tin — phủ EC2, EC3, kiểm tra anti-enumeration)
  - Giữ TC-UI-C1, C2, C3, C4 (validation + XSS + whitespace — phủ 4 case quan trọng)
  - Giữ TC-UI-D1, D2, D3, D4 (lockout — phủ boundary 3 lần, hết khóa, trong khóa, reset counter)
  - Giữ TC-UI-N1 (cả 2 trường rỗng — phủ EC5+EC6)
  - **B� qua:** BV-P1, BV-P2 (input cực dài — khó reproduce ổn định trên UI), TC-D5/D6/D8/D9 (API-level chi tiết về `login_attempts` — UI không hiển thị được giá trị này)
- **Người dùng đã sửa gì (nếu có):** Chưa có — chờ review

---

### [Bước 2] FR-02 — 2026-08-08 (Saturday, ~21:25 UTC+7)

- **AI tool:** Claude
- **Ngày giờ:** 2026-08-08T21:25:00+07:00
- **Prompt (tóm tắt):**
  - Tạo file Page Object `tests/fr02-login/fr02-login.page.ts`
  - Xác định selector theo thứ tự ưu tiên skill: data-testid (1) → role (2) → label (3) → CSS/text (4)
  - DOM FR-02 không có `data-testid` nên dùng `getByLabel` cho field và `getByRole` cho button/link
  - Locator cho error message phải dùng CSS fallback (selector fragile)
- **Output (tóm tắt):**
  - File `tests/fr02-login/fr02-login.page.ts` được tạo (khoảng 105 dòng)
  - Class `Fr02LoginPage` với:
    - **Locators:** `usernameInput` (`getByLabel("Username")`), `passwordInput` (`getByLabel("Mật khẩu")`), `submitButton` (`getByRole("button", { name: "Sign In" })`), `forgotPasswordLink`, `registerLink`, `formErrorMessage` (CSS fallback — FRAGILE), header locators
    - **Action methods (không có assertion):** `goto()`, `fillCredentials()`, `login()`, `submitEmpty()`, `clearForm()`, `waitForNavigationAfterLogin()`, `goToRegister()`, `goToForgotPassword()`, `isLoaded()`
  - **Selector summary:**
    - **Ưu tiên 2 (role):** submitButton, forgotPasswordLink, registerLink, headerLoginLink, headerRegisterLink
    - **Ưu tiên 3 (label):** usernameInput, passwordInput
    - **Ưu tiên 4 (CSS — FRAGILE):** `formErrorMessage` (dùng `[role="alert"], .text-red-500, ...`)
- **Ghi chú kỹ thuật:**
  - Selector `formErrorMessage` dùng CSS multi-fallback. **BẮT BUỘC phải verify với user** hoặc thêm `data-testid` vào source code SUT. Sẽ liệt kê trong gap-analysis Bước 5.
  - Page Object KHÔNG chứa assertion — đúng theo yêu cầu skill (Bước 2).
- **Người dùng đã sửa gì (nếu có):** Chưa có — chờ review

---

## Trạng thái tổng thể


| Bước                     | Trạng thái | File output                                |
| ------------------------ | ---------- | ------------------------------------------ |
| 1 — Chuẩn hóa test case  | ✅ DONE     | `tests/fr02-login/testcases-fr02-login.md` |
| 2 — Page Object          | ✅ DONE     | `tests/fr02-login/fr02-login.page.ts`      |
| 3 — Test data (CSV/JSON) | ⏸ PENDING  | chờ review Bước 1+2                        |
| 4 — Script `.spec.ts`    | ⏸ PENDING  | chờ review Bước 3                          |
| 5 — Gap analysis         | ⏸ PENDING  | chờ review Bước 4                          |


**⏸ DỪNG LẠI chờ user review Bước 1 + Bước 2 trước khi qua Bước 3**  
**User review: Đã xác định Bước 1 + Bước 2 chạy đúng**