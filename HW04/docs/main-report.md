# Main Report — UI Automation Testing (FR-02, FR-08, FR-16)

> **Môn học:** Kiểm thử phần mềm (Software Testing)
> **Ngày nộp:** 2026-08-11
> **Sinh viên:** 23127443
> **Công cụ:** Playwright (3 browsers: Chromium, Firefox, WebKit)

---

## 1. Tổng quan dự án

### Mục tiêu

Xây dựng bộ automation test (Playwright) cho 3 chức năng của hệ thống EShop:


| FR    | Chức năng               | SUT Frontend             | SUT Backend      |
| ----- | ----------------------- | ------------------------ | ---------------- |
| FR-02 | Login & Account Lockout | `localhost:5173` (user)  | `localhost:3000` |
| FR-08 | Checkout                | `localhost:5173` (user)  | `localhost:3000` |
| FR-16 | Import CSV (Admin)      | `localhost:5174` (admin) | `localhost:3000` |


### Quy trình

Sử dụng **SKILL.md** 5 bước cho mỗi FR:

1. **Bước 1:** Thiết kế test case
2. **Bước 2:** Tạo Page Object + inspect DOM
3. **Bước 3:** Tạo test data (JSON data-driven)
4. **Bước 4:** Viết spec (data-driven, ≥3 assertion patterns)
5. **Bước 5:** Chạy thực tế + Gap Analysis

---

## 2. Kết quả chạy tổng hợp

### 2.1 Bảng tổng hợp


| FR       | Test Cases  | PASS    | FAIL   | Pass Rate | Thời gian     | Bugs mới |
| -------- | ----------- | ------- | ------ | --------- | ------------- | -------- |
| FR-02    | 13 (×3)     | 39      | 0      | **100%**  | 5.1 phút      | 2        |
| FR-08    | 12 (×3)     | 33      | 3      | **91.7%** | 3.4 phút      | 5        |
| FR-16    | 12 (×3)     | 30      | 9      | **76.9%** | 4.0 phút      | 1        |
| **Tổng** | **37 (×3)** | **102** | **12** | **89.5%** | **12.5 phút** | **8**    |


### 2.2 Chi tiết FAIL

**FR-08 — 3 fail đồng nhất (BUG-003):**

- TC-C2: Cart có sản phẩm → checkout → cart KHÔNG bị clear → fail đúng behavior SUT (bug backend)

**FR-16 — 9 fail (3 test × 3 browsers):**

- TC-A2: Script bug — clear localStorage không đồng bộ với React state
- TC-UI-1: SUT bug — upload .txt → button vẫn enabled (FR-16-FUNC-BUG-002)
- TC-UI-9: Script bug — `waitForEvent("download")` không phù hợp với cách download thực tế

---

## 3. Test suite architecture

### Assertion patterns


| Pattern                | Mô tả                       | FR-02 | FR-08 | FR-16 |
| ---------------------- | --------------------------- | ----- | ----- | ----- |
| #1 UI state            | `toBeVisible`, `toHaveText` | ✅     | ✅     | ✅     |
| #2 Navigation/URL      | `toHaveURL`                 | ✅     | ✅     | —     |
| #3 Network/API         | `waitForResponse` + status  | ✅     | ✅     | ✅     |
| #4 Business rule       | count, regex, value match   | ✅     | ✅     | ✅     |
| #5 Accessibility/Count | `toHaveCount`               | ✅     | ✅     | ✅     |
| #6 Dialog/Alert        | `page.once("dialog")`       | —     | —     | ✅     |
| #7 Download event      | `waitForEvent("download")`  | —     | —     | ✅     |


**Đạt yêu cầu ≥3 patterns theo SKILL.md.**

---

## 4. Bugs phát hiện

### 4.1 Bảng tổng hợp


| Mức    | FR    | Bug                | Mô tả                                                | Loại     |
| ------ | ----- | ------------------ | ---------------------------------------------------- | -------- |
| **P0** | FR-08 | BUG-003            | Cart không clear sau checkout → thanh toán trùng lặp | Backend  |
| **P0** | FR-08 | BUG-005            | GET /api/cart thiếu fields (name, price, imageUrl)   | Backend  |
| **P0** | FR-08 | BUG-006            | DELETE /api/cart 404 — không reset được cart         | Backend  |
| **P1** | FR-02 | BUG-002            | Tài khoản khóa ở lần sai thứ 2 (spec = 3 lần)        | Backend  |
| **P1** | FR-02 | BUG-007            | Anti-enumeration: error message giống nhau           | Backend  |
| **P1** | FR-16 | FR-16-FUNC-BUG-001 | category_id optional → mặc định sai                  | Backend  |
| **P1** | FR-16 | FR-16-FUNC-BUG-002 | UI không validate extension file                     | Frontend |
| **P2** | FR-02 | BUG-001            | Validation trả 401 thay vì 400                       | Backend  |
| **P2** | FR-02 | BUG-003            | Thời gian khóa > 30 giây                             | Backend  |
| **P2** | FR-02 | BUG-005            | UI không hiển thị số lần thử còn lại                 | Frontend |
| **P2** | FR-02 | BUG-006            | UI không hiển thị "tài khoản bị khóa"                | Frontend |
| **P2** | FR-08 | BUG-001 (UI)       | Input total editable (spec: readonly)                | Frontend |
| **P2** | FR-08 | BUG-002            | Cart trống vẫn thanh toán 200 OK                     | Backend  |
| **P2** | FR-08 | BUG-004            | CartContext local state — cart mất khi reload        | Frontend |
| **P2** | FR-08 | BUG-007            | Label thiếu `htmlFor` (accessibility)                | Frontend |
| **P2** | FR-16 | FR-16-BUG-006      | Error message không rõ ràng                          | Backend  |


**Chi tiết:** xem `bugs-report.md`

---

## 5. Selector Robustness Summary


| FR    | Mức 1 (Stable) | Mức 2 (Medium) | Mức 3 (Fragile) | Ghi chú                   |
| ----- | -------------- | -------------- | --------------- | ------------------------- |
| FR-02 | 4              | 3              | 3               | Không có data-testid      |
| FR-08 | 7              | 1              | 6               | 6 selector dùng CSS class |
| FR-16 | 0              | 5              | 5               | Không có data-testid      |


**Đề xuất chung:** Dev thêm `data-testid` cho 4 element chính ở mỗi trang.

---

## 6. Technical Debt

### 6.1 Script bugs (test setup/assertion sai)


| FR    | Test Case   | Vấn đề                                           | Effort fix                      |
| ----- | ----------- | ------------------------------------------------ | ------------------------------- |
| FR-16 | TC-A2       | clear localStorage không đồng bộ với React state | Thấp (reload page)              |
| FR-16 | TC-UI-9     | `waitForEvent("download")` không phù hợp         | Thấp (intercept request)        |
| FR-08 | TC-A1 bonus | try/catch wrap assertion (bonus)                 | Thấp (xóa hoặc dùng annotation) |


### 6.2 Config issues


| Vấn đề                                          | Ảnh hưởng                                        | Đề xuất                   |
| ----------------------------------------------- | ------------------------------------------------ | ------------------------- |
| `playwright.config.js` baseURL = 5173 (user FE) | FR-16 chạy sai port nếu không override           | Dùng env var FR16_SUT_URL |
| `workers: 1` (sequential)                       | Chậm hơn song song nhưng an toàn cho backend yếu | Giữ nguyên                |


---

## 7. Hạn chế của UI Automation

### 7.1 Bugs không thể phát hiện qua UI


| Bug                                | Lý do UI không thấy                              |
| ---------------------------------- | ------------------------------------------------ |
| BUG-003 cross-tab race             | UI chỉ hiển thị 1 cart context                   |
| Token expired silent logout        | UI không phân biệt 401 invalid vs expired        |
| Backend validate total_amount ngầm | UI chỉ thấy input value                          |
| Coupon discount logic (FR-09)      | Coupon logic ở backend — UI chỉ hiển thị kết quả |


### 7.2 Best-effort assertions


| Vị trí                       | Vấn đề                                          | Tác động                    |
| ---------------------------- | ----------------------------------------------- | --------------------------- |
| FR-02 captureLoginResponse() | Silent warn khi backend không response trong 3s | Bug 500 có thể bị bỏ qua    |
| FR-08 TC-A1 bonus            | try/catch wrap bonus assertion                  | Bonus không có giá trị thật |


---

---

## 8. Kết luận

### Đạt được

- 3 FR automation (FR-02, FR-08, FR-16) hoàn chỉnh theo SKILL.md 5 bước
- Tất cả spec đạt ≥3 assertion patterns
- Data-driven architecture (JSON) — dễ maintain và mở rộng
- Page Object pattern — tách logic khỏi spec
- Cross-browser testing (Chromium, Firefox, WebKit)
- Phát hiện 8 bugs mới (trong đó 3 P0 nghiêm trọng)
- Gap analysis chi tiết cho từng FR

### Hạn chế

- 5 selector fragile (Mức 3) — cần dev thêm `data-testid`
- 3 script bugs cần fix (TC-A2, TC-UI-9, TC-A1 bonus)
- Backend yếu → chỉ chạy `workers: 1`, thời gian dài hơn
- Best-effort assertions che giấu 1 số bugs nghiêm trọng

### Khuyến nghị

1. **Fix P0 ngay:** FR-08 BUG-003, BUG-005, BUG-006 (backend)
2. **Fix script bugs:** FR-16 TC-A2, TC-UI-9 (test setup)
3. **Dev thêm data-testid:** 4 element chính mỗi trang
4. **Cải thiện backend:** Reset token state, implement DELETE /api/cart, validate cart có sản phẩm
5. **Bổ sung API testing:** Để phát hiện bugs hiện tại bị che bởi best-effort assertions

