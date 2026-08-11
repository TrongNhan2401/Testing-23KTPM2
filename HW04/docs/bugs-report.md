# Bugs Report — Playwright UI Automation (FR-02, FR-08, FR-16)

> **Nguồn:** Gap analysis từ `docs/gap-analysis-fr02.md`, `docs/gap-analysis-fr08-checkout.md`, `docs/gap-analysis-fr16-import.md`
> **Ngày tổng hợp:** 2026-08-11
> **Phạm vi:** Bugs được phát hiện qua Playwright UI Automation — không ghi logs hay reproduction steps

---

## Tổng quan


| FR       | Số bug mới | Số bug đã biết | Bug từ source_testcase |
| -------- | ---------- | -------------- | ---------------------- |
| FR-02    | 2          | 4              | 6 total                |
| FR-08    | 5          | 2              | 7 total                |
| FR-16    | 1          | 2              | 3 total                |
| **Tổng** | **8**      | **8**          | **16 total**           |


---

## FR-02 — Login & Account Lockout

### Bugs mới (phát hiện qua UI automation)

#### BUG-002: Tài khoản khóa ở lần sai thứ 2 (Backend)

- **Mô tả:** Spec yêu cầu khóa sau 3 lần sai, thực tế bị khóa sau 2 lần sai.
- **Tác động:** Khóa sớm hơn dự kiến → người dùng hợp lệ có thể bị chặn sớm.
- **Phát hiện bởi:** UI test (TC-UI-D1) — nhưng UI không phân biệt được 401 invalid vs 403 locked.

#### BUG-007: Anti-enumeration — error message giống nhau cho email sai và password sai

- **Mô tả:** Cả "email không tồn tại" và "password sai" đều trả message `"Email hoặc mật khẩu không chính xác"`.
- **Tác động:** User có thể enumerate email hợp lệ qua timing/response khác nhau.
- **Phát hiện bởi:** Cross-check test (TC-N1).

### Bugs đã biết (từ source_testcase/FR02.md)


| Bug ID  | Mô tả                                                          |
| ------- | -------------------------------------------------------------- |
| BUG-001 | Validation email rỗng/sai format → backend trả 401 thay vì 400 |
| BUG-003 | Thời gian khóa > 30 giây (thực tế > 35s để unlock)             |
| BUG-005 | UI không hiển thị số lần thử còn lại                           |
| BUG-006 | UI không hiển thị message "tài khoản đã bị khóa" riêng biệt    |


---

## FR-08 — Checkout

### Bugs mới (phát hiện qua UI automation)

#### BUG-003: Cart không clear sau checkout (Backend — NGHIÊM TRỌNG)

- **Mô tả:** `POST /api/checkout` trả 200 OK nhưng KHÔNG xóa cart. User có thể thanh toán cùng giỏ hàng nhiều lần.
- **Tác động:** Rủi ro thanh toán trùng lặp → mất tiền khách hàng.
- **TC phát hiện:** TC-C2 (FAIL đồng nhất trên Chromium, Firefox, WebKit).

#### BUG-004: CartContext local state — cart mất khi reload (Frontend)

- **Mô tả:** `CartContext.jsx` dùng `useState([])` — cart không persist qua page reload.
- **Tác động:** User refresh page → giỏ hàng trống, mất trải nghiệm.

#### BUG-005: GET /api/cart thiếu fields (Backend)

- **Mô tả:** API chỉ trả `[{product_id, quantity}]` thay vì full cart items có `name`, `price`, `imageUrl`.
- **Tác động:** Frontend không thể render tên/giá sản phẩm khi reload.

#### BUG-006: DELETE /api/cart trả 404 (Backend)

- **Mô tả:** Endpoint `DELETE /api/cart` không tồn tại.
- **Tác động:** Không có cách reset cart qua API.

#### BUG-007: Label thiếu `htmlFor` — accessibility (Frontend)

- **Mô tả:** Input "Tổng tiền thanh toán" không có `id`/`htmlFor`.
- **Tác động:** Screen reader không đọc được label khi focus input.

### Bugs đã biết (từ source_testcase/FR08.md)


| Bug ID       | Mô tả                                                                         |
| ------------ | ----------------------------------------------------------------------------- |
| BUG-001 (UI) | Input total editable — spec yêu cầu readonly nhưng `type=number` vẫn cho nhập |
| BUG-002      | Cart trống vẫn thanh toán 200 OK (backend không validate cart có sản phẩm)    |


---

## FR-16 — Import Sản phẩm từ CSV

### Bugs mới (phát hiện qua UI automation)

#### FR-16-FUNC-BUG-002: UI không validate extension file (Frontend)

- **Mô tả:** Upload file `.txt` thay vì `.csv` → preview vẫn render + button Import vẫn enabled.
- **Tác động:** User có thể upload nhầm file → backend xử lý sai hoặc báo lỗi không rõ ràng.
- **TC phát hiện:** TC-UI-1 (FAIL trên cả 3 browsers).
- **TC đã document:** `testcases-fr16-import.md` ghi nhận bug này.

### Bugs đã biết (từ testcases-fr16-import.md)


| Bug ID             | Mô tả                                                         |
| ------------------ | ------------------------------------------------------------- |
| FR-16-FUNC-BUG-001 | `category_id` optional → backend mặc định là 1 (sai danh mục) |
| FR-16-BUG-006      | (từ FR16.md) — message/validation errors không rõ ràng        |


---

## Tổng hợp bugs theo mức độ nghiêm trọng

### Cao — Cần fix ngay


| FR    | Bug     | Mô tả                                                 |
| ----- | ------- | ----------------------------------------------------- |
| FR-08 | BUG-003 | Cart không clear sau checkout → thanh toán trùng lặp  |
| FR-08 | BUG-005 | GET /api/cart thiếu fields → cart không hiển thị đúng |
| FR-08 | BUG-006 | DELETE /api/cart 404 → không reset được cart          |


### Trung bình — Nên fix sớm


| FR    | Bug                | Mô tả                                         |
| ----- | ------------------ | --------------------------------------------- |
| FR-02 | BUG-002            | Khóa tài khoản sớm hơn spec (2 lần thay vì 3) |
| FR-02 | BUG-007            | Anti-enumeration: message giống nhau          |
| FR-16 | FR-16-FUNC-BUG-001 | category_id mặc định sai                      |
| FR-16 | FR-16-FUNC-BUG-002 | Không validate extension file                 |


### Thấp — Cải thiện trải nghiệm


| FR    | Bug           | Mô tả                                    |
| ----- | ------------- | ---------------------------------------- |
| FR-02 | BUG-003       | Thời gian khóa > 30 giây                 |
| FR-02 | BUG-005       | UI không hiển thị số lần thử còn lại     |
| FR-02 | BUG-006       | UI không hiển thị "tài khoản đã bị khóa" |
| FR-02 | BUG-001       | Validation trả 401 thay vì 400           |
| FR-08 | BUG-001 (UI)  | Input total editable                     |
| FR-08 | BUG-002       | Cart trống vẫn thanh toán                |
| FR-08 | BUG-004       | CartContext local state                  |
| FR-08 | BUG-007       | Label thiếu htmlFor (accessibility)      |
| FR-16 | FR-16-BUG-006 | Error message không rõ ràng              |


---

## Thống kê


| Tiêu chí                          | Số lượng          |
| --------------------------------- | ----------------- |
| Tổng bugs phát hiện               | 16                |
| Bugs backend                      | 8                 |
| Bugs frontend                     | 5                 |
| Bugs frontend + backend           | 1 (BUG-003 FR-08) |
| Bugs đã biết từ source_testcase   | 8                 |
| Bugs mới phát hiện qua automation | 8                 |
| Bugs mức Cao (P0)                 | 3                 |
| Bugs mức Trung bình (P1)          | 4                 |
| Bugs mức Thấp (P2)                | 9                 |


