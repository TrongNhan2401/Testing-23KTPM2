# FR-08 — Bảng test case chuẩn hóa cho UI Automation

> **Feature:** FR-08 — Thanh toán (Checkout)
> **SUT URL:** `http://localhost:5173/checkout`
> **Trang test:** `/checkout` (render form "Xác Nhận Đơn Hàng")
> **Tài khoản thử nghiệm (theo README):** `test@eshop.com` / `Test1234!`
> **Phương pháp:** Trích từ `sources_testcase/FR08.md` (EP + BVA). Chỉ chọn **12 case** phù hợp với UI Automation.
> **Ghi chú về DOM:** Form checkout có 2 input chính: `Tổng tiền` (chưa có `readonly` attribute — **BUG FR-08-FUNC-BUG-001**) và `Mã Giảm Giá` (`type="text"`, placeholder). Không có `data-testid`, `id`, `name`, `aria-label`.

---

## Bảng test case chuẩn (12 cases)

| #   | id          | type     | input (coupon / action)                                                | expected (UI)                                                                                                                                                  | note                                                                                   |
| --- | ----------- | -------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| 1   | TC-UI-A1    | positive | Có sản phẩm trong cart, không nhập coupon, click "Xác Nhận Thanh Toán" | → Checkout thành công; chuyển hướng đến trang xác nhận; cart bị xóa (trống)                                                                                | Happy path — EC-A1 + EC-S1                                                            |
| 2   | TC-UI-B1    | negative | Không đăng nhập → truy cập `/checkout` trực tiếp                      | → Bị chặn / chuyển hướng về trang login                                                                                                                       | Security — EC-A2                                                                      |
| 3   | TC-UI-B2    | negative | Đăng nhập với token không hợp lệ (mock expired) → truy cập `/checkout` | → Bị chặn / chuyển hướng về trang login                                                                                                                       | Security — EC-A3                                                                      |
| 4   | TC-UI-B3    | edge     | Sửa giá trị `total_amount` trong input (BUG-001 client-side)         | → Frontend KHÔNG cho phép sửa (`readonly` attribute) — UI bảo vệ tầng client. Backend vẫn tự tính lại theo spec FR-08                                              | UI version of TC-B1 (FR-08-BUG-001)                                                   |
| 5   | TC-UI-C1    | negative | Cart trống → truy cập `/checkout`                                     | → Hiển thị thông báo "Giỏ hàng trống" hoặc chuyển hướng về cart; không cho phép checkout                                                                      | Bug FR-08-BUG-002                                                                     |
| 6   | TC-UI-C2    | positive | Cart có sản phẩm → click "Xác Nhận Thanh Toán" → kiểm tra cart bị xóa | → Sau checkout, GET `/api/cart` trả về `[]` (mảng rỗng)                                                                                                       | Bug FR-08-BUG-003                                                                     |
| 7   | TC-UI-D1    | negative | Coupon không tồn tại (ví dụ: `INVALID999`)                            | → Hiển thị thông báo lỗi "Mã giảm giá không hợp lệ"; tổng tiền không đổi                                                                                     | C1 fail — mã không trong DB                                                            |
| 8   | TC-UI-D2    | edge     | Coupon đã hết hạn (`EXPIRED`)                                         | → Hiển thị thông báo "Mã giảm giá đã hết hạn"; tổng tiền không đổi                                                                                          | C2 fail — expired_at < today                                                            |
| 9   | TC-UI-D3    | edge     | Coupon đủ điều kiện C1-C4 nhưng tổng cart < min_order_amount           | → Hiển thị thông báo "Đơn hàng chưa đạt ngưỡng tối thiểu"; coupon không áp dụng                                                                            | C3 fail — `min_order_amount`                                                           |
| 10  | TC-UI-E1    | edge     | Coupon nhập ký tự đặc biệt / XSS (ví dụ: `<script>alert(1)</script>`) | → Coupon bị coi là không hợp lệ; hiển thị lỗi; KHÔNG có script execution                                                                                     | Security: XSS injection in coupon field                                                |
| 11  | TC-UI-E2    | edge     | `shipping_address` nhập 500 ký tự `"A"*500` qua API (không qua UI form) | → Đơn hàng được tạo — backend không có max length validation (FR-08-BUG-005 đã xác nhận)                                                                     | Boundary probing                                                                      |
| 12  | TC-UI-N1    | negative | Click "Xác Nhận Thanh Toán" mà không có sản phẩm nào                   | → Không chuyển hướng; hiển thị thông báo "Giỏ hàng trống"                                                                                                   | Negative — checkout without items                                                     |

---

## Mapping case UI ↔ case gốc (sources_testcase/FR08.md)

| id UI      | Gốc trong FR08.md         | Nhóm gốc                 |
| ---------- | ------------------------- | ------------------------ |
| TC-UI-A1  | TC-A1                     | A — Xác thực             |
| TC-UI-B1  | TC-A2                     | A — Không có token       |
| TC-UI-B2  | TC-A3                     | A — Token không hợp lệ   |
| TC-UI-B3  | TC-B1                     | B — Tổng tiền sai         |
| TC-UI-C1  | TC-C1                     | C — Cart trống           |
| TC-UI-C2  | TC-C2                     | C — Cart sau checkout    |
| TC-UI-D1  | (dựa trên coupon UI)     | B — Coupon không tồn tại |
| TC-UI-D2  | (dựa trên coupon UI)     | B — Coupon hết hạn       |
| TC-UI-D3  | (dựa trên coupon UI)     | B — Coupon min_order_amount |
| TC-UI-E1  | BV-S4 (XSS injection)    | BVA — Ký tự đặc biệt    |
| TC-UI-E2  | BV-S2 (max length)       | BVA — Boundary           |
| TC-UI-N1  | TC-C1, TC-C2             | C — Cart trống           |

---

## Ghi chú cho người review

1. **Tổng tiền (Bug FR-08-FUNC-BUG-001):** HTML cho thấy input `Tổng tiền thanh toán` có `type="number"` và `value="116000000"` — user CÓ THỂ sửa được giá trị này. Đây là bug nghiêm trọng (FR-08-BUG-001): backend nhận `total_amount` từ client thay vì tự tính lại.
   - **TC-UI-B3** cần verify: input `Tổng tiền` phải có `readonly` hoặc `disabled`. Nếu không có → UI chưa bảo vệ tầng client (bug vẫn còn).
2. **Cart sau checkout (Bug FR-08-FUNC-BUG-002):** Sau khi checkout thành công, cart phải bị xóa. **TC-UI-A1** và **TC-UI-C2** cần verify giỏ hàng trống sau khi checkout.
3. **Shipping address:** HTML không có form nhập `shipping_address` trên UI — địa chỉ có thể được lấy từ profile user. Vì vậy các test case về shipping address (TC-D1..D5, BV-S1..S4) từ FR08.md sẽ test qua API, không test qua UI.
4. **Giỏ hàng trống (Bug FR-08-BUG-002):** API cho phép checkout khi cart trống. UI có thể đã chặn ở frontend — cần verify bằng **TC-UI-C1** và **TC-UI-N1**.
5. **Không bao gồm** các test case về session/token expiry vì cần thời gian chờ (token expiry thường 1-24h).
6. **Không bao gồm** test case điều chỉnh số lượng sản phẩm trong checkout vì đây thuộc phạm vi FR-07 (giỏ hàng).
7. **Coupon logic:** Theo README §2 FR-09, mã giảm giá có 5 điều kiện C1-C5. Test UI chỉ verify **message hiển thị** (success/error). Việc verify giá trị `final_amount` sẽ qua API.

---

## Quan sát DOM (từ HTML dump user cung cấp)

| Element              | Chi tiết từ HTML                                                                                                   |
| -------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Header               | `<a class="text-2xl font-bold" href="/">EShop</a>` — link về trang chủ                                              |
| Tiêu đề form         | `<h2>Xác Nhận Đơn Hàng</h2>`                                                                                       |
| Danh sách sản phẩm  | `ul.list-disc li` — text như "iPhone 15 Pro Max x 1 — 30,000,000 ₫"                                                |
| Tổng tiền input     | `type="number"`, `value="116000000"`, **KHÔNG có** `id`, `name`, `placeholder`, `aria-label`, `readonly` attribute   |
| Coupon input         | `type="text"`, `placeholder="Nhập mã giảm giá..."`, **KHÔNG có** `id`, `name`, `aria-label`                        |
| Button "Áp dụng"    | `disabled=""`, text="Áp dụng"                                                                                      |
| Tổng thanh toán hiển thị | `span` với text "Tổng thanh toán: 116,000,000 ₫"                                                                |
| Button "Xác Nhận"   | `class="bg-green-600"`, text="Xác Nhận Thanh Toán"                                                                |

**Kết luận:** Không có `data-testid`, `aria-label`, `id`, `name` — tất cả selector phải dùng `role`, `text`, hoặc **CSS sibling** (fragile). Xem thêm bảng DOM đầy đủ trong `fr08-checkout.page.ts`.
