# [FR-08][Functional Bug] Giao diện cho phép user nhập và thay đổi tổng số tiền thanh toán trước khi xác nhận đơn hàng

**Labels:** `bug`, `FR-08`, `functional-testing`, `severity: critical`

---

## 1. Tóm tắt (Summary)

Giao diện thanh toán (checkout) trên UI cho phép người dùng nhìn thấy và có thể tự ý thay đổi giá trị tổng số tiền thanh toán (`total_amount`) trước khi xác nhận đơn hàng. Điều này vi phạm nghiệp vụ cơ bản: tổng tiền phải do hệ thống tự tính toán từ giỏ hàng, không cho phép người dùng chỉnh sửa.

> **Lưu ý:** Bug này có cùng root cause với **FR-08-BUG-001** (Domain Testing — Backend không ignore `total_amount` từ client). Chi tiết xem phần [7. Cross-Reference](#7-cross-reference).

---

## 2. Nguồn spec / kỳ vọng (Expected Behavior)

- **Tài liệu tham chiếu:** `contexts/README.md` — FR-08 §2, dòng 107
- **Trích nội dung spec:**
  > "Backend phải tự tính lại tổng tiền từ giỏ hàng; không chấp nhận giá trị `total_amount` do client gửi lên."
- **Mức độ rõ ràng của spec:** `[Rõ ràng từ spec]` — đây là yêu cầu bắt buộc, không phải recommendation.

---

## 3. Hành vi thực tế quan sát được (Actual Behavior)

| Bước | Input trên UI | Expected | Actual | Status |
|---|---|---|---|---|
| 1 | Người dùng truy cập trang checkout, giỏ hàng có sản phẩm với tổng giá trị 200,000 VNĐ | Hiển thị tổng tiền tự động = 200,000 VNĐ (readonly, không cho sửa) | Hiển thị tổng tiền = 200,000 VNĐ | ✅ |
| 2 | Người dùng nhấn vào ô tổng tiền và thay đổi giá trị thành 1,000 VNĐ | Ô tổng tiền bị khóa (readonly), không cho phép sửa | **Người dùng có thể sửa được tổng tiền thành 1,000 VNĐ** | ❌ |
| 3 | Người dùng nhấn nút "Thanh toán" với tổng tiền đã sửa | Hệ thống từ chối hoặc tự động sửa lại tổng tiền = 200,000 VNĐ | **Đơn hàng được tạo với tổng tiền = 1,000 VNĐ** (giá trị user đã sửa) | ❌ |

---

## 4. Các bước tái hiện (Steps to Reproduce)

1. Đăng nhập với tài khoản có giỏ hàng chứa sản phẩm (tổng giá trị > 0 VNĐ).
2. Truy cập trang checkout thanh toán.
3. Quan sát ô hiển thị tổng tiền — kiểm tra xem có bị khóa (readonly) hay cho phép nhập.
4. Thử thay đổi giá trị tổng tiền thành một số nhỏ hơn (ví dụ: 1,000 VNĐ).
5. Nhấn nút "Thanh toán" / "Xác nhận đơn hàng".
6. Quan sát kết quả:
   - Nếu đơn hàng được tạo với giá trị đã sửa → **Bug xác nhận**.
   - Kiểm tra email/notification xác nhận để xem số tiền hiển thị.

**Môi trường test:** Browser (Chrome/Firefox), công cụ: Manual testing

---

## 5. Giả thuyết hành vi (Behavioral Hypothesis)

> Đây là suy luận **functional black-box** dựa trên quan sát hành vi người dùng trên giao diện.

- **Giả thuyết:** Giao diện checkout có trường `total_amount` được implement dưới dạng input field có thể sửa (editable), thay vì display field readonly. Khi user submit, giá trị này được gửi lên backend qua API `POST /api/checkout`. Backend hiện tại nhận và lưu giá trị này mà không tự tính lại (đã xác nhận qua FR-08-BUG-001).
- **Mức độ tin cậy:** `Cao` — hành vi quan sát được qua 3 bước trên UI.
- **Test case bổ sung cần chạy để xác nhận:**
  - Thử thay đổi tổng tiền thành giá trị lớn hơn (ví dụ: +1,000,000 VNĐ) — xem hệ thống có chấp nhận không.
  - Thử nhập số âm — xem validation phía client có ngăn không.

---

## 6. Mức độ ảnh hưởng (Severity/Priority)

- **Severity:** `Critical`
- **Lý do:** Đây là bug bảo mật và tài chính nghiêm trọng. Kết hợp với FR-08-BUG-001 (backend không validate):
  - Người dùng có thể thanh toán số tiền tùy ý.
  - Khai thác: nhập `0` để thanh toán miễn phí, hoặc nhập số nhỏ để gian lận.
  - Toàn bộ tính toàn vẹn tài chính của hệ thống bị ảnh hưởng.

---

## 7. Cross-Reference

| Tầng test | Bug ID | Mô tả | Ghi chú |
|---|---|---|---|
| **Domain Testing (API)** | FR-08-BUG-001 | Backend không ignore `total_amount` từ client — nhận và lưu giá trị client gửi | Root cause gốc |
| **Functional Testing (UI)** | FR-08-FUNC-BUG-001 | UI cho phép user nhập/sửa tổng tiền — biểu hiện của BUG-001 ở tầng cao hơn | Cùng root cause với BUG-001 |

> **Khi fix:** Cần fix **cả 2 tầng** để đảm bảo:
> - **Backend (BUG-001):** Tự tính `total_amount` từ giỏ hàng, ignore giá trị client gửi.
> - **UI (FUNC-BUG-001):** Hiển thị `total_amount` dưới dạng readonly text, không phải input field.

---

## 8. Traceability

- **Test Case ID liên quan (trong report.md):** TC-B1, TC-B2, TC-B3 (Nhóm B — Domain Testing)
- **Feature:** FR-08 — Thanh toán (Checkout)
- **File report gốc:** `testing/FR-08/report.md`
- **Bug liên quan (Domain):** `testing/FR-08/issues/FR-08-BUG-001.md`

---

## 9. Đính kèm

- [ ] Screenshot trang checkout — hiển thị ô tổng tiền (có thể sửa)
- [ ] Screenshot sau khi sửa tổng tiền thành giá trị khác
- [ ] Screenshot xác nhận đơn hàng — hiển thị số tiền đã sửa
- [ ] Screenshot email/notification xác nhận đơn hàng (nếu có)
