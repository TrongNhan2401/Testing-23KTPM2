# Bug Report — HW02 Domain Testing

> Tổng hợp tất cả bugs phát hiện từ Domain Testing và Functional Testing.

---

## Tổng quan


| FR                       | Domain Bugs | Functional Bugs | Tổng cộng |
| ------------------------ | ----------- | --------------- | --------- |
| FR-02 (Login & Lockout)  | 3           | 2               | 5         |
| FR-04 (Personal Profile) | 4           | 1               | 5         |
| FR-08 (Checkout)         | 5           | 2               | 7         |
| FR-16 (Import CSV)       | 7           | 2               | 9         |
| **Tổng**                 | **19**      | **7**           | **26**    |


**GitHub Issues:** [https://github.com/TrongNhan2401/Testing-23KTPM2-10/issues](https://github.com/TrongNhan2401/Testing-23KTPM2-10/issues)

---

## 1. FR-02 — Login & Lockout

### Domain Testing Bugs (API)


| #   | Bug ID        | Summary                                         | Severity |
| --- | ------------- | ----------------------------------------------- | -------- |
| 1   | FR-02-BUG-001 | API trả 401 thay vì 400 cho validation thất bại | Medium   |
| 2   | FR-02-BUG-002 | Khóa tài khoản ở lần sai thứ 2 thay vì lần 3    | High     |
| 3   | FR-02-BUG-003 | Thời gian khóa > 30 giây                        | Medium   |


### Functional Testing Bugs (UI)


| #   | Bug ID        | Summary                                          | Severity |
| --- | ------------- | ------------------------------------------------ | -------- |
| 4   | FR-02-BUG-005 | UI không hiển thị số lần thử còn lại             | Medium   |
| 5   | FR-02-BUG-006 | UI không hiển thị thông báo tài khoản đã bị khóa | High     |


---

## 2. FR-04 — Personal Profile Management

### Domain Testing Bugs (API)


| #   | Bug ID        | Summary                                                                      | Severity |
| --- | ------------- | ---------------------------------------------------------------------------- | -------- |
| 1   | FR-04-BUG-001 | Backend không validate `name` — chấp nhận name rỗng, space, null, >255 ký tự | Critical |
| 2   | FR-04-BUG-002 | Backend không validate `phone` — chấp nhận phone không đúng định dạng        | Critical |
| 3   | FR-04-BUG-003 | Backend cho phép thay đổi `role` — Privilege Escalation                      | Critical |
| 4   | FR-04-BUG-004 | Backend không validate `shipping_address` rỗng/null                          | Medium   |


### Functional Testing Bugs (UI)


| #   | Bug ID             | Summary                                                 | Severity |
| --- | ------------------ | ------------------------------------------------------- | -------- |
| 5   | FR-04-FUNC-BUG-001 | Mobile cho phép lưu phone 9 chữ số sau khi hiển thị lỗi | High     |


---

## 3. FR-08 — Checkout

### Domain Testing Bugs (API)


| #   | Bug ID        | Summary                                                                     | Severity |
| --- | ------------- | --------------------------------------------------------------------------- | -------- |
| 1   | FR-08-BUG-001 | Backend không ignore `total_amount` từ client — vi phạm spec FR-08          | Critical |
| 2   | FR-08-BUG-002 | Checkout thành công khi giỏ hàng trống — tạo đơn hàng "ma"                  | Critical |
| 3   | FR-08-BUG-003 | Giỏ hàng không bị xóa sau checkout thành công                               | High     |
| 4   | FR-08-BUG-004 | `shipping_address` không được validate — chấp nhận rỗng, null, khoảng trắng | High     |
| 5   | FR-08-BUG-005 | Backend không có max length validation cho `shipping_address`               | Low      |


### Functional Testing Bugs (UI)


| #   | Bug ID             | Summary                                            | Severity |
| --- | ------------------ | -------------------------------------------------- | -------- |
| 6   | FR-08-FUNC-BUG-001 | UI cho phép user nhập/sửa tổng tiền thanh toán     | Critical |
| 7   | FR-08-FUNC-BUG-002 | UI vẫn hiển thị giỏ hàng sau thanh toán thành công | High     |


---

## 4. FR-16 — Import CSV

### Domain Testing Bugs (API)


| #   | Bug ID        | Summary                                              | Severity |
| --- | ------------- | ---------------------------------------------------- | -------- |
| 1   | FR-16-BUG-001 | Non-admin import được — vi phạm FR-12 Access Control | Critical |
| 2   | FR-16-BUG-002 | Name chỉ có khoảng trắng được thêm                   | High     |
| 3   | FR-16-BUG-003 | Name > 255 ký tự được thêm                           | High     |
| 4   | FR-16-BUG-004 | Price = 0/âm/null/thiếu được thêm                    | Critical |
| 5   | FR-16-BUG-005 | Category không tồn tại/null/thiếu được thêm          | Critical |
| 6   | FR-16-BUG-006 | Không rollback khi có lỗi — vi phạm all-or-nothing   | Critical |
| 7   | FR-16-BUG-007 | Duplicate products không được xử lý                  | High     |


### Functional Testing Bugs (UI)


| #   | Bug ID             | Summary                                           | Severity |
| --- | ------------------ | ------------------------------------------------- | -------- |
| 8   | FR-16-FUNC-BUG-001 | UI cho phép import CSV thiếu header `category_id` | Critical |
| 9   | FR-16-FUNC-BUG-002 | UI cho phép import file không phải `.csv`         | High     |


---

## Tổng hợp theo Severity


| Severity | Số lượng | Bugs                                   |
| -------- | -------- | -------------------------------------- |
| Critical | 12       | FR-04: 3, FR-08: 3, FR-16: 6           |
| High     | 11       | FR-02: 1, FR-04: 1, FR-08: 3, FR-16: 4 |
| Medium   | 5        | FR-02: 2, FR-04: 1                     |
| Low      | 1        | FR-08: 1                               |


---

## Bugs ưu tiên cao cần fix (Critical + High)

1. **FR-04-BUG-003** — Privilege Escalation (User có thể tự nâng quyền thành admin)
2. **FR-08-BUG-001** — Backend không ignore `total_amount` (Có thể khai thác thanh toán miễn phí)
3. **FR-08-BUG-002** — Checkout khi giỏ hàng trống (Tạo đơn hàng "ma")
4. **FR-16-BUG-001** — Non-admin import được (Vi phạm Access Control)
5. **FR-16-BUG-004** — Price validation không có (Chấp nhận giá 0/âm)
6. **FR-16-BUG-005** — Category validation không có (Chấp nhận category không tồn tại)
7. **FR-16-BUG-006** — Không rollback (Vi phạm all-or-nothing)

