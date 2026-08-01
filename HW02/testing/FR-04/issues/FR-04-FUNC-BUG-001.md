# [FR-04][Functional Bug] Mobile cho phép cập nhật số điện thoại 9 chữ số — vi phạm FR-04 spec (tối thiểu 10 chữ số)

**Labels:** `bug`, `FR-04`, `functional-testing`, `severity: high`

---

## 1. Tóm tắt (Summary)

Giao diện Mobile cho phép người dùng cập nhật số điện thoại với 9 chữ số và hiển thị thông báo lỗi. Tuy nhiên, sau khi thông báo lỗi, nếu người dùng tiếp tục nhấn "Lưu" thì số điện thoại 9 chữ số vẫn được lưu thành công. Điều này vi phạm FR-04: "Số điện thoại hợp lệ: bắt đầu bằng số `0`, từ 10–11 chữ số."

---

## 2. Nguồn spec / kỳ vọng (Expected Behavior)

- **Tài liệu tham chiếu:** `contexts/README.md` — FR-04 §2, dòng 65
- **Trích nội dung spec:**
  > "**Số điện thoại hợp lệ**: bắt đầu bằng số `0`, từ 10–11 chữ số."
- **Mức độ rõ ràng của spec:** `[Rõ ràng từ spec]` — phone phải có từ 10–11 chữ số.

---

## 3. Hành vi thực tế quan sát được (Actual Behavior)

| Bước | Input trên Mobile                        | Expected                                       | Actual                             | Status |
| ---- | ---------------------------------------- | ---------------------------------------------- | ---------------------------------- | ------ |
| 1    | Nhập phone 9 chữ số (ví dụ: `091234567`) | Mobile hiển thị thông báo lỗi và không cho lưu | Mobile hiển thị thông báo lỗi      | ☐      |
| 2    | Nhấn "Lưu" sau khi có thông báo lỗi      | Hệ thống từ chối lưu vì phone không hợp lệ     | Phone 9 chữ số được lưu thành công | ❌     |

---

## 4. Các bước tái hiện (Steps to Reproduce)

1. Đăng nhập vào ứng dụng Mobile với tài khoản user.
2. Truy cập trang "Hồ sơ cá nhân" / "Cập nhật thông tin".
3. Nhập số điện thoại dưới 9 chữ số (ví dụ: `09123456`).
4. Quan sát:
   - Mobile hiển thị thông báo lỗi → **Đúng** (validation client hoạt động).
5. Nhấn nút "OK".
6. Quan sát kết quả:
   -Nhập lại sđt, bugs ở đây là lệch số được nhập vào so với spec.

**Môi trường test:** Mobile (Android/iOS), công cụ: Manual testing

---

## 5. Giả thuyết hành vi (Behavioral Hypothesis)

> Đây là suy luận **functional black-box** dựa trên quan sát hành vi người dùng trên giao diện Mobile.

- **Giả thuyết:** Khi nhập dưới 9 chữ số xẻ xuất hiện một bảng thông báo là số lượng số lầ từ 9 - 10 (Thay vì 10 - 11 như trong spec).
- **Mức độ tin cậy:** `Cao` — hành vi quan sát được qua các bước trên Mobile.
- **Test case bổ sung cần chạy để xác nhận:**
  - Thử nhập phone 9 chữ số + nhấn Lưu → xem kết quả.
  - Thử nhập phone 9 chữ số + xóa + nhập lại đúng → xem có lưu được không.

---

## 6. Mức độ ảnh hưởng (Severity/Priority)

- **Severity:** `High`
- **Lý do:**
  - Vi phạm trực tiếp FR-04: phone phải có từ 10–11 chữ số.
  - Kết hợp với FR-04-BUG-002 (Backend không validate phone) → cả client và server đều có lỗ hổng.
  - Người dùng có thể lưu số điện thoại không hợp lệ vào hệ thống.
  - Rủi ro: số điện thoại 9 chữ số không thể liên lạc được.

---

## 7. Cross-Reference

| Tầng test                       | Bug ID             | Mô tả                                                   | Ghi chú                             |
| ------------------------------- | ------------------ | ------------------------------------------------------- | ----------------------------------- |
| **Domain Testing (API)**        | FR-04-BUG-002      | Backend không validate `phone` — chấp nhận phone 9 số   | Root cause gốc                      |
| **Functional Testing (Mobile)** | FR-04-FUNC-BUG-001 | Mobile cho phép lưu phone 9 chữ số sau khi hiển thị lỗi | Biểu hiện của BUG-002 ở tầng Mobile |

> **Khi fix:** Cần fix **cả 2 tầng** để đảm bảo:
>
> - **Backend (BUG-002):** Validate `phone` phải 10–11 chữ số, bắt đầu bằng 0.
> - **Mobile (FUNC-BUG-001):** Kiểm tra lại phone trước khi gửi request, không chỉ hiển thị lỗi.

---

## 8. Traceability

- **Test Case ID liên quan (trong report.md):** TC-C3 (Phone 9 số — Domain Testing)
- **Feature:** FR-04 — Quản lý Hồ sơ Cá nhân
- **File report gốc:** `testing/FR-04/report.md`
- **Bug liên quan (Domain):** `testing/FR-04/issues/FR-04-BUG-002.md`

---

## 9. Đính kèm

- [ ] Screenshot Mobile — nhập phone 9 chữ số
- [ ] Screenshot Mobile — thông báo lỗi hiển thị
- [ ] Screenshot Mobile — nhấn Lưu và kết quả (lưu thành công)
- [ ] Screenshot trang hồ sơ — xác nhận phone 9 số đã được lưu
