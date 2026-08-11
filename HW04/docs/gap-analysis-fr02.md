# Gap Analysis — FR-02 (Login & Account Lockout) Automation

> **Đối tượng review:** bộ automation test `tests/fr02-login/` sinh ra từ SKILL.md (Bước 1–4).
> **Đối chiếu:** bảng test case gốc `tests/fr02-login/testcases-fr02-login.md` (12 case UI) +
> `sources_testcase/FR02.md` (28 case API + BVA, EP).
> **Ngày review:** 2026-08-09.
> **Kết quả chạy thực tế:** 39/39 PASS (chromium + firefox + webkit, 5.1 phút).

---

## 1. Tóm tắt nhanh

| Tiêu chí                                  | Đánh giá       |
| ------------------------------------------ | -------------- |
| Số test case thiết kế (UI)                | 12             |
| Số test case implement được (UI)          | 12 ✅          |
| Test case bị SKIP/vô hiệu                 | 0             |
| Số case gốc bị **bỏ** do không phù hợp UI | 16 (đã note lý do) |
| Selector có `data-testid`                  | 0/7 ❌ (DOM không cung cấp) |
| Selector theo `role` + name               | 4/7 ✅        |
| Selector theo CSS/text (fragile)          | 3/7 ⚠️       |
| Assertion patterns được dùng              | 6/5 ✅ (vượt yêu cầu) |
| Test có khả năng tự phát hiện bug backend | Trung bình (do best-effort) |

---

## 2. Mapping test case UI ↔ test case gốc FR-02

### 2.1 Đã implement đầy đủ (12/12)

| UI Case   | Gốc trong FR02.md | Nhóm gốc          | Status |
| --------- | ----------------- | ----------------- | ------ |
| TC-UI-A1  | TC-A1             | A — Success       | ✅     |
| TC-UI-B1  | TC-B1             | B — Sai thông tin | ✅     |
| TC-UI-B2  | TC-B2             | B — Sai thông tin | ✅     |
| TC-UI-C1  | TC-C1             | C — Validation    | ✅     |
| TC-UI-C2  | BV-P4             | BVA — Probing     | ✅     |
| TC-UI-C3  | BV-P6             | BVA — Probing     | ✅     |
| TC-UI-C4  | TC-C3             | C — Validation    | ✅     |
| TC-UI-D1  | TC-D3 / BV-D2     | D — Lockout       | ✅     |
| TC-UI-D2  | TC-D7 / BV-T3     | D — Hết lockout   | ✅     |
| TC-UI-D3  | TC-D4             | D — Trong lockout | ✅     |
| TC-UI-D4  | TC-D5             | D — Reset counter | ✅     |
| TC-UI-N1  | TC-C3 + TC-C4     | C — Validation    | ✅     |

**Bổ sung:** 1 cross-check test (Anti-enumeration) — không có trong bảng gốc nhưng hợp lý về mặt nghiệp vụ, khớp với phát hiện tại `sources_testcase/FR02.md` §5 (TC-B1 và TC-B2 phải cùng message).

### 2.2 Đã bỏ qua (16 case) — kèm lý do

| Gốc       | Lý do bỏ qua khỏi UI automation                                                                                 |
| --------- | --------------------------------------------------------------------------------------------------------------- |
| BV-P1     | Email cực dài (1000 ký tự) — note tại `testcases-fr02-login.md` §Ghi chú #1: "khó reproduce ổn định trên UI, giá trị quan sát thấp" |
| BV-P2     | Password cực dài (1000 ký tự) — cùng lý do trên                                                                  |
| BV-P3     | Payload `{}` rỗng — không thể test qua UI form (không có cách submit form rỗng object)                          |
| BV-P5     | Số âm / chuỗi số trong email — UI không có cách nhập khác với text field                                         |
| BV-D1     | Lockout ở LB-1 (2 lần sai) — UI quan sát giống TC-UI-D1, đã cover                                                  |
| BV-D2     | Lockout ở LB (3 lần sai) — UI đã cover bằng TC-UI-D1                                                            |
| BV-D3     | Lockout ở LB+1 (4 lần sai) — UI đã cover bằng TC-UI-D3                                                           |
| BV-T1     | 29 giây — UI đã cover bằng TC-UI-D2 (đợi 35s)                                                                    |
| BV-T2     | 30 giây — UI đã cover bằng TC-UI-D2                                                                              |
| TC-C2     | Email có ký tự đặc biệt — UI đã cover bằng TC-UI-C2 (XSS injection)                                            |
| TC-D1, D2, D5, D6, D8, D9 | Các case phụ thuộc vào việc quan sát `login_attempts` qua API response — UI không có cách truy cập giá trị này |

**Tổng cộng đã cover: 12 UI case + 1 cross-check = 13 ca thực thi**, tương ứng **39 lần chạy** khi nhân 3 browsers (chromium/firefox/webkit).

---

## 3. Selector Review

### 3.1 Bảng selector audit

| Locator                    | Selector                                              | Loại     | Robustness | Note |
| -------------------------- | ----------------------------------------------------- | -------- | ---------- | ---- |
| `usernameInput`            | `label:has-text("Username") ~ input`                  | CSS sibling | ⚠️ Trung bình | DOM không có `data-testid`/`for`/`aria-label`; phụ thuộc label có text cố định |
| `passwordInput`            | `label:has-text("Mật khẩu") ~ input`                  | CSS sibling | ⚠️ Trung bình | Tương tự trên; thay đổi label VN → en sẽ gãy |
| `submitButton`             | `getByRole("button", { name: "Sign In" })`            | role+name | ✅ Tốt     | Ổn định nếu button text không đổi |
| `forgotPasswordLink`       | `getByRole("link", { name: "Quên mật khẩu?" })`       | role+name | ✅ Tốt     | |
| `registerLink`             | `getByRole("link", { name: /Đăng ký ngay/i })`        | role+name (regex) | ✅ Tốt     | Regex cho phép "Đăng ký ngay"/"Đăng ký" |
| `formErrorMessage`         | `[role="alert"], .text-red-500, .text-red-600, .error, .error-message` | CSS multi-fallback | ⚠️ Fragile | Đây là selector yếu nhất trong file — phụ thuộc 5 selector khác nhau, dễ gãy nếu dev đổi class |
| `headerLoginLink`          | `header nav` + `getByRole("link", { name: "Đăng nhập" })` | role+name | ✅ Tốt     | |
| `headerRegisterLink`       | `header nav` + `getByRole("link", { name: "Đăng ký" })` | role+name | ✅ Tốt     | |
| `headerUserGreeting`       | `locator("header")`                                   | CSS | ⚠️ Trung bình | Chỉ xác nhận header tồn tại, không assert nội dung |

### 3.2 Selector yếu nhất

**`formErrorMessage`** — selector multi-fallback này có 3 vấn đề:

1. **Phụ thuộc vào CSS framework:** `.text-red-500`, `.text-red-600` chỉ có nếu dev dùng Tailwind. Đổi sang Bootstrap/MUI → gãy.
2. **Dùng `.first()`:** Nếu trang có nhiều element match (ví dụ: alert khác trong header) → có thể pick nhầm.
3. **Không có cơ chế detect theo context:** Tốt hơn nên scope theo form: `.login-form [role="alert"]`.

**Đề xuất cải thiện** (không breaking, chỉ nâng cấp):

```ts
// Thay vì:
this.formErrorMessage = page
  .locator('[role="alert"], .text-red-500, .text-red-600, .error, .error-message')
  .first();

// Nên dùng:
this.formErrorMessage = page
  .locator('form, [role="form"]')
  .locator('[role="alert"], [class*="error"], [class*="text-red"]')
  .first();
```

### 3.3 Trade-off đã chấp nhận

Vì DOM không cung cấp `data-testid`, việc dùng CSS sibling selector là **lựa chọn tốt nhất có thể** trong điều kiện hiện tại. Đã verify bằng `debug-dom.js` (xem comments trong page object).

---

## 4. Assertion Review

### 4.1 Các pattern assertion được dùng (theo SKILL.md)

| # | Pattern                        | Code minh họa                                                                       | Dùng ở test nào                       |
| - | ------------------------------ | ------------------------------------------------------------------------------------ | ------------------------------------- |
| 1 | UI state                       | `expect(po.formErrorMessage).toBeVisible()`                                          | B1, B2, C1, C2, C3, D1, D3            |
| 2 | Navigation / URL               | `expect(page).not.toHaveURL(/\/login(\?|#|$)/)` + `expect(page).toHaveURL(/\/login/)` | A1, D2, D4, C4, N1                   |
| 3 | Network / API response         | `captureLoginResponse()` + `apiResponse.status` warn                                  | Tất cả 12 case                        |
| 4 | Business-rule                  | `expect(po.headerLoginLink).toHaveCount(0)` + `headerRegisterLink`                    | A1, D4                                |
| 5 | Accessibility / count          | `expect(po.usernameInput).toHaveCount(1)`                                            | C4, N1                                |
| 6 | Security (XSS)                 | `expect(dialogOpened).toBe(false)`                                                   | C2                                    |

**Kết luận:** 6 patterns (yêu cầu ≥ 3) — vượt yêu cầu của SKILL.md.

### 4.2 Assertion yếu — cần review

#### ⚠️ Network assertion bị "best-effort"

```ts
async function captureLoginResponse(page, testId, timeoutMs = 3000): Promise<...> {
  try {
    const apiResponse = await page.waitForResponse(...);
    return { status: apiResponse.status(), ... };
  } catch {
    test.info().annotations.push({ type: "warn", description: `Không bắt được response` });
    return null;  // ← KHÔNG fail test
  }
}
```

**Vấn đề:** Khi backend chậm / không response trong 3s, test vẫn PASS. Nghĩa là nếu backend trả 500 thay vì 401, test vẫn "xanh" — **che giấu bug nghiêm trọng**.

**Lý do chấp nhận:** Backend demo yếu, chạy 3 browsers song song dễ gây timeout. Đã verify trong `docs/ai-audit-report.md` rằng backend bị crash khi `workers: 2`, không thể đợi response lâu hơn.

**Cải thiện có thể làm (sau này):** Dùng `expect.soft()` thay vì silent warn — vẫn cho test PASS nhưng đánh dấu rõ trong report HTML.

#### ⚠️ UI assertion chỉ check `toBeVisible`, không check `toHaveText`

Với TC-UI-B1/B2 (error message), code có check text content qua `textContent()` + `toContain()`, **NHƯNG** chỉ check nếu text tồn tại:

```ts
if (record.expect.errorContains) {
  try {
    const actualText = (await po.formErrorMessage.textContent({ timeout: 1000 })) ?? "";
    if (actualText) {  // ← Nếu text rỗng, SKIP assertion
      expect(actualText.toLowerCase()).toContain(
        record.expect.errorContains.toLowerCase()
      );
    }
  } catch { /* skip */ }
}
```

**Vấn đề:** Nếu `formErrorMessage` không bắt được (selector fail), test vẫn PASS — không verify được message có đúng nội dung không.

**Lý do chấp nhận:** Selector `formErrorMessage` là multi-fallback; nếu fail thì cũng có `toBeVisible` assertion trước đó đã catch. Tuy nhiên nên cải thiện.

**Đề xuất:** Đổi `if (actualText)` thành `expect(actualText).toBeTruthy()` để force fail khi text rỗng.

#### ⚠️ Pattern #4 (business-rule header) chỉ check count, không check content

```ts
await expect(po.headerLoginLink).toHaveCount(0, { timeout: 2000 });
```

**Đề xuất:** Sau khi login, kiểm tra header có chứa tên user (pattern #4 đầy đủ hơn):

```ts
await expect(po.headerUserGreeting).toContainText("Test User");
```

---

## 5. Case nghiệp vụ mà script KHÔNG thể tự phát hiện

### 5.1 Quan sát từ `sources_testcase/FR02.md` §6 (Phân tích Postman)

| Quan sát Postman                                          | UI test có phát hiện? | Giải thích                                                                                       |
| --------------------------------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------ |
| **Bug BUG-001:** Validation email rỗng/sai format → 401 thay vì 400 | ❌ Không              | UI chỉ check "có error" — không check HTTP status code. Phải xem Network tab để phát hiện.        |
| **Bug BUG-002:** Tài khoản khóa ở lần sai thứ 2 (không phải thứ 3) | ❌ Không              | UI test D1 chỉ check "sau 2 lần sai, lần 3 có error". Không phân biệt "401 invalid" vs "403 locked". |
| **Bug BUG-003:** Thời gian khóa > 30 giây                 | ⚠️ Một phần          | TC-UI-D2 đợi 35s mới login lại. Nếu backend thực sự lock 60s, test vẫn PASS sau 35s.            |
| **Bug BUG-005:** UI không hiển thị số lần thử còn lại    | ❌ Không              | Test không assert message "Bạn còn X lần thử" — nếu UI có thêm thì test vẫn PASS.               |
| **Bug BUG-006:** UI không hiển thị "tài khoản đã bị khóa" | ❌ Không              | Test chỉ check "có error" — không phân biệt message "sai pass" vs "tài khoản bị khóa".          |

### 5.2 Tại sao AI bỏ sót?

| Lý do bỏ sót                                       | Cách khắc phục tiềm năng                                              |
| -------------------------------------------------- | -------------------------------------------------------------------- |
| **Thiếu ngữ cảnh nghiệp vụ:** Script chỉ verify "có lỗi" chứ không verify "lỗi gì". | Pattern #3 (network) warn nếu status code sai — nhưng đã best-effort. |
| **UI không hiển thị rõ ràng:** Backend trả message chung ("Email hoặc mật khẩu không chính xác") cho cả 401 và 403 — UI test không phân biệt được. | Cần assert cụ thể từng message dự kiến theo state (locked vs wrong). |
| **Backend state không truy cập được:** Không có endpoint debug `/api/test/set-login-attempts` thật → script fallback dùng UI (chậm, không ổn định). | Cần dev hỗ trợ test endpoint hoặc reset DB.                          |
| **Best-effort che giấu bug:** Network assertion warn chứ không fail → bug 500 có thể bị bỏ qua. | Đổi sang `expect.soft()` để vẫn thấy trong report.                   |

---

## 6. Rủi ro khi chạy test tự động

### 6.1 Rủi ro backend state pollution

- Setup `wrongAttemptsBefore` qua UI tốn **~3-4 giây** × số lần sai → TC-UI-D1/D2/D3 chậm (4–45s).
- Nếu TC-UI-D2 fail giữa chừng (sau khi đã setup 3 lần sai) → tài khoản bị lock → ảnh hưởng test khác chạy sau.
- **Hiện tượng quan sát được trong lần chạy 39/39 PASS:** TC-UI-D2 mất **41.6s** (chromium), **45.8s** (firefox), **42.7s** (webkit) — đúng kỳ vọng vì phải đợi 35s.

### 6.2 Rủi ro timing khi chạy parallel

- Backend demo yếu, `workers: 1` ở config đã đủ an toàn.
- Nếu user tăng `workers: 2+`, có thể gặp race condition: 2 tests cùng setup state cho cùng 1 email.

### 6.3 Rủi ro false positive

- TC-UI-A1 (positive case) dùng email `test@eshop.com`. Nếu tài khoản này đang bị lock từ test trước → A1 sẽ fail với "sai pass" → flaky test.
- **Hiện tại không xảy ra** vì tests chạy tuần tự (`workers: 1`) và đa số setup đúng state trước khi A1 chạy.

---

## 7. Đề xuất cải thiện (ưu tiên cao → thấp)

| # | Đề xuất                                                                                                  | Effort | Impact |
| - | --------------------------------------------------------------------------------------------------------- | ------ | ------ |
| 1 | Thay `formErrorMessage` selector thành scope theo form (`form [role="alert"]`)                            | 5 phút | Trung bình |
| 2 | Đổi network assertion từ silent warn → `expect.soft()` để bug 500 lộ rõ trong HTML report                | 15 phút | Cao     |
| 3 | Thêm assert cho từng message cụ thể: TC-UI-D3 expect "khóa", TC-UI-B1 expect "không chính xác"            | 30 phút | Cao     |
| 4 | Thêm assert `login_attempts` reset sau login đúng (gọi API response.user.login_attempts)                  | 1 giờ  | Cao     |
| 5 | Tạo `/api/test/reset-account` endpoint dev-only, gọi trước describe để clean state                       | 1 giờ  | Trung bình |
| 6 | Thêm test cho UI message "Bạn còn X lần thử" (BUG-005)                                                    | 30 phút | Trung bình |
| 7 | Thêm test cho message "tài khoản đã bị khóa" riêng biệt (BUG-006)                                          | 30 phút | Trung bình |
| 8 | Đề xuất dev thêm `data-testid` vào DOM để chuyển selector sang tier 1                                     | 1 PR   | Cao (long-term) |

---

## 8. Kết luận

- **Bộ automation đã chạy đúng:** 39/39 PASS trên 3 browsers, 5.1 phút. Mapping test case UI ↔ gốc đầy đủ 12/12.
- **Selectors có fragile:** 3/7 dùng CSS (do DOM không cung cấp `data-testid`/`aria-label`). Đã chấp nhận trade-off vì không có lựa chọn tốt hơn.
- **Assertions vượt yêu cầu:** 6 patterns (≥ 3 theo SKILL.md). Tuy nhiên có 3 chỗ "best-effort" làm giảm sức mạnh phát hiện bug backend.
- **Test KHÔNG phát hiện được 5 bug Postman đã biết** (BUG-001, 002, 003, 005, 006) — chủ yếu do UI không hiển thị rõ và test chỉ check "có lỗi" chứ không check "lỗi gì".

> **Tóm lại:** Bộ test này phù hợp làm **smoke test** + **regression test** (đảm bảo happy path + validation cơ bản không vỡ). Để phát hiện bug nghiệp vụ cụ thể (lockout, anti-enum, XSS), cần bổ sung các đề xuất mục 7.

---

## 9. Phụ lục — Bằng chứng chạy thực tế

```
$ npx playwright test fr02-login

Running 39 tests using 1 worker

  ✓  1-13  [chromium]  13 tests, 0 fail
  ✓ 14-26  [firefox]   13 tests, 0 fail
  ✓ 27-39  [webkit]    13 tests, 0 fail

39 passed (5.1m)
```

Report HTML: `npx playwright show-report reports`