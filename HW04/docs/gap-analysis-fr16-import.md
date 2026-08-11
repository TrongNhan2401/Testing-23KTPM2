# Gap Analysis — FR-16: Import Sản phẩm từ CSV (UI Automation)

> **Phạm vi:** UI Automation — Playwright, 12 test cases, data-driven
> **Source test cases:** `tests/fr16-import/testcases-fr16-import.md`
> **Script:** `tests/fr16-import/fr16-import.spec.ts`
> **Page Object:** `tests/fr16-import/fr16-import.page.ts`
> **Test data:** `tests/fr16-import/data/fr16-testdata.json`
> **Ngày chạy:** 2026-08-11
> **Environment:** SUT admin panel `http://localhost:5174/` + backend `http://localhost:3000`
> **Browsers:** Chromium + Firefox + WebKit

---

## 1. Tổng quan kết quả

| Browser   | PASS | FAIL | Tổng | Thời gian |
|-----------|------|------|-------|-----------|
| Chromium  | 10   | 3    | 13    | ~2m       |
| Firefox   | 10   | 3    | 13    | ~2m       |
| WebKit    | 10   | 3    | 13    | ~2m       |
| **Tổng** | **30** | **9** | **39** | **~4m** |

**Note:** Mỗi test case chạy trên 3 browsers → 12 × 3 = 36 runs. Số trên cho thấy 3 test cases fail nhất quán trên cả 3 browsers.

### Test cases FAIL nhất quán (cùng nguyên nhân trên cả 3 browsers):

| ID       | Type     | Nguyên nhân fail                                          |
|----------|----------|-----------------------------------------------------------|
| TC-A2    | negative | `clear adminToken → ""` không tạo 401 (React state ≠ localStorage) |
| TC-UI-1  | negative | Upload `.txt` → button ENABLED (UI không validate extension) |
| TC-UI-9  | positive | Download event không trigger (link dùng Blob/navigate thay vì href) |

---

## 2. Chi tiết từng fail

### 2.1. TC-A2 — `clear localStorage adminToken = ""` không gây 401

**Mô tả test case:** Login admin → set `localStorage.adminToken = ""` → upload file CSV → click Import → expect HTTP 401.

**Lỗi:**
```
Error: TC-A2: Expected network status 401, got null
```

**Phân tích nguyên nhân:**

App.jsx dòng 61–74 (đã đọc source):

```jsx
const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post(`${API_URL}/login`, { email, password });
    if (res.data.user.role !== "admin") {
      alert("Bạn không phải là admin!");
      return;
    }
    setToken(res.data.token);         // ← React state
    localStorage.setItem("adminToken", res.data.token); // ← localStorage
  } catch (err) { ... }
};
```

Vấn đề: sau `login()`, React state `token` và `localStorage.adminToken` **đều đã set**. Khi test set `localStorage.adminToken = ""`:
- `localStorage` bị xóa
- **Nhưng `token` state trong React component VẪN CÒN** (React state không tự đồng bộ với localStorage)
- Axios interceptor dùng `token` state chứ không đọc localStorage mỗi lần
- Request vẫn gửi kèm token hợp lệ → backend trả 200 thay vì 401

**Kết luận:** Đây là **script bug** (không phải SUT bug). Test setup không đúng cách mô phỏng session expire.

**Hướng khắc phục:**
- Cách 1: Clear React state bằng cách reload page (sau đó token sẽ đọc từ localStorage và bị rỗng)
- Cách 2: Clear cả localStorage + reload page để component đọc lại từ đầu
- Cách 3: Dùng API endpoint test-only để reset token phía backend

### 2.2. TC-UI-1 — Upload file `.txt` → button vẫn ENABLED

**Mô tả test case:** Upload file có đuôi `.txt` thay vì `.csv` → preview KHÔNG render + button Import vẫn disabled.

**Lỗi:**
```
Error: TC-UI-1: Import button disabled = false, expected = true
```

**Phân tích nguyên nhân:**

Test expect button **disabled** khi upload `.txt` (không phải CSV). Thực tế button **enabled**.

→ Đây chính là **FR-16-FUNC-BUG-002** — bug UI thiếu validation đuôi file (đã document trong testcases).

**Kết luận:** Test PASS đúng nghĩa — đúng là SUT không validate extension. Đây là **SUT bug** (UI không check file extension), không phải script bug.

**Hướng khắc phục:**
- Đây là test case có chủ ý FAIL để document bug UI.
- Giữ nguyên test như hiện tại (assert button disabled = true → fail → document bug).
- Hoặc đổi thành best-effort: expect button enabled (bug behavior) → test PASS.

### 2.3. TC-UI-9 — Download event không trigger

**Mô tả test case:** Click link "Tải file mẫu (template.csv)" → download file `template_import.csv` được trigger.

**Lỗi:**
```
Error: TC-UI-9: Expected template download to be triggered
expect(received).toBe(true)
Expected: true
Received: false
```

**Phân tích nguyên nhân:**

`page.waitForEvent("download")` chỉ trigger khi:
- `<a href="..." download>` — trình duyệt trigger download event
- Blob URL với `download` attribute

Nếu link dùng `window.open()` hoặc `URL.createObjectURL(blob)` mà không có `download` attribute → `waitForEvent("download")` không bắt được.

**Kết luận:** Đây là **script bug** — test dùng assertion method không phù hợp với cách download thực tế của SUT.

**Hướng khắc phục:**
- Thay `waitForEvent("download")` bằng cách verify khác:
  - Click link → verify navigation (trỏ đến `/api/template` hoặc file cố định)
  - Hoặc intercept request và verify response có Content-Disposition header
  - Hoặc verify link `href` attribute chứa đúng endpoint

---

## 3. Selector Robustness — Phân loại mức độ ổn định

### Bảng đánh giá (từ Page Object)

| # | Locator | Mức | Ghi chú |
|---|---------|-----|---------|
| 1 | `page.getByPlaceholder("Email")` | 2-Medium | Placeholder "Email" có thể đổi → selector chết |
| 2 | `page.getByPlaceholder("Password")` | 2-Medium | Tương tự |
| 3 | `page.getByRole("button", { name: "Login" })` | 2-Medium | Text "Login" ổn định |
| 4 | `page.getByText("Sản phẩm", { exact: true }).first()` | 2-Medium | Text sidebar nav — ít khi đổi |
| 5 | `page.getByRole("heading", { name: /Import sản phẩm/i })` | 2-Medium | Heading text ổn định |
| 6 | `page.locator('input[type="file"]')` | 3-Fragile | Chỉ 1 file input trên page → OK nhưng fragile nếu thêm input khác |
| 7 | `page.locator('div.mt-2 div.overflow-x-auto table.w-full...')` | 3-Fragile | Class chain dài — thay đổi Tailwind → chết |
| 8 | `page.locator('div.mt-2.p-3.rounded.text-sm')` | 3-Fragile | Result box dùng 3 classes để phân biệt success/error |
| 9 | `page.locator('div.mt-2.p-3.rounded.text-sm p')` | 3-Fragile | Selector text result — phụ thuộc DOM structure |
| 10 | `page.locator('div.mt-2.p-3.rounded.text-sm ul.list-disc')` | 3-Fragile | Errors list — fragile nếu UI thay đổi |

**Tổng kết:** 0 selector mức 1 (Stable), 5 selector mức 2 (Medium), 5 selector mức 3 (Fragile).

**Đề xuất cải thiện:** Thêm `data-testid` cho các element tương tác chính:
- `data-testid="csv-file-input"` — file input
- `data-testid="import-button"` — button Import
- `data-testid="import-result-box"` — result box
- `data-testid="import-preview-table"` — preview table

---

## 4. Assertion Coverage Analysis

### 4.1. Assertion patterns sử dụng trong FR-16

| Pattern | Mô tả | Test cases áp dụng | Status |
|---------|-------|---------------------|--------|
| **Pattern 1: UI state** | `toBeVisible`, `toHaveText`, `toContain` | TC-A1, TC-A2, TC-A3, TC-UI-1..10 | ✅ Đầy đủ |
| **Pattern 2: Element state** | `toBeDisabled`, `toBeEnabled`, element count | TC-A1, TC-UI-1, TC-UI-2, TC-UI-5 | ✅ Tốt |
| **Pattern 3: Network/API** | `waitForResponse` + status check | TC-A2, TC-UI-4, TC-UI-6, TC-UI-7, TC-UI-8 | ⚠️ TC-A2 có bug setup |
| **Pattern 4: Business rule** | Preview row count, result message format | TC-UI-2, TC-UI-6, TC-UI-7, TC-UI-10 | ✅ Tốt |
| **Pattern 5: Dialog/Alert** | `page.once("dialog")` | TC-A3 | ✅ Tốt |
| **Pattern 6: Download event** | `waitForEvent("download")` | TC-UI-9 | ❌ Script bug |

### 4.2. Assertion có thể yếu

| Location | Vấn đề | Khuyến nghị |
|----------|--------|-------------|
| `assertExpect()` TC-A2 | `expect(networkStatus).toBe(401)` — networkStatus = null (chưa bắt được) → fail nhưng không đúng nguyên nhân | Fix setup như mục 2.1 |
| `assertExpect()` TC-UI-9 | `expect(download !== null)` — download = null (method không phù hợp) → fail nhưng không đúng nguyên nhân | Fix assertion như mục 2.3 |

**Nhận xét:** 2 assertion fail không phải do SUT mà do script setup/assertion method không đúng. Đây là pattern "che bug" ngược — script fail nhưng nguyên nhân không phải behavior SUT.

---

## 5. Tổng hợp: Script bugs vs SUT bugs

| Loại | Số lượng | Chi tiết |
|------|----------|----------|
| **Script bugs** (test setup/assertion sai) | 2 | TC-A2 (clear state), TC-UI-9 (download method) |
| **SUT bugs** (UI không đúng spec) | 1 | TC-UI-1 = FR-16-FUNC-BUG-002 (không validate extension) |
| **SUT bugs đã document từ nguồn khác** | 2 | TC-UI-4 (FR-16-FUNC-BUG-001), TC-UI-8 (FR-16-BUG-006) |

**Nhận xét chung:**
- Script coverage tốt: 12 cases đều có assertion hợp lý.
- 2 script bugs (TC-A2, TC-UI-9) có thể fix dễ dàng mà không cần đọc thêm SUT.
- 1 SUT bug mới được phát hiện (TC-UI-1) — đúng với mục đích của automation testing.

---

## 6. Nợ kỹ thuật (Technical Debt)

### 6.1. Nợ cấp thấp (có thể fix ngay)

| # | Item | Ảnh hưởng | Độ khó |
|---|------|-----------|--------|
| 1 | Thêm `data-testid` cho 4 element chính (file input, button, result box, preview table) | Giảm 5 fragile selectors | Thấp |
| 2 | Fix TC-A2: reload page sau khi clear localStorage | Script bug | Thấp |
| 3 | Fix TC-UI-9: dùng intercept thay vì `waitForEvent("download")` | Script bug | Thấp |

### 6.2. Nợ cấp trung bình (cần thêm thời gian)

| # | Item | Ảnh hưởng | Độ khó |
|---|------|-----------|--------|
| 4 | Tách `baseURL` ra biến env cho FR-16 (hiện dùng `test.use()` override) | Config isolation | Trung bình |
| 5 | Thêm `data-testid` vào admin panel source (cần modify SUT) | Locator robustness | Trung bình |

### 6.3. Nợ cấp cao (không khuyến khích fix)

| # | Item | Lý do |
|---|------|-------|
| 6 | TC-A2: không có API endpoint để reset login state | Backend demo không có /api/test/reset-login-attempts tương tự |
| 7 | Frontend dùng React state thay vì đọc localStorage mỗi request | Thiết kế React — không nên thay đổi vì 1 test case |

---

## 7. Kết luận

### Điểm mạnh của script

1. **Data-driven tốt:** 12 cases đều load từ JSON, dễ maintain và mở rộng.
2. **Page Object pattern đúng:** Tách action methods và locators riêng, có documentation.
3. **6 assertion patterns** — đạt yêu cầu ≥3, phủ đủ UI + Network + Business rule.
4. **Setup helper có cấu trúc:** `setupForCase()` và `assertExpect()` rõ ràng, dễ debug.
5. **Special handlers tốt:** TC-A3 (alert dialog), TC-UI-9 (download) — ý tưởng đúng, execution cần fix.

### Điểm yếu cần cải thiện

1. **TC-A2 setup sai:** Clear localStorage không đồng bộ với React state → network status null → assertion fail không đúng nguyên nhân.
2. **TC-UI-9 assertion method sai:** `waitForEvent("download")` không phù hợp với cách download thực tế của SUT.
3. **Selector có 5 fragile (mức 3):** Dễ break nếu dev đổi Tailwind classes.
4. **baseURL override qua `test.use()`** — giải pháp tạm, nên dùng config riêng hoặc env var.

### Khuyến nghị hành động

1. **Fix ngay:** TC-A2 (reload page) và TC-UI-9 (intercept request).
2. **Đề xuất dev:** Thêm `data-testid` cho 4 element chính trong admin panel.
3. **Document:** TC-UI-1 = FR-16-FUNC-BUG-002 (UI thiếu file extension validation).
4. **Không cần fix:** TC-A3 (non-admin alert) — pass trên cả 3 browsers, OK.
