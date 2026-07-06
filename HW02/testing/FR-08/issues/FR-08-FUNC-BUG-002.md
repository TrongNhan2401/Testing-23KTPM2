# [FR-08][Functional Bug] Giỏ hàng không bị xóa sau khi thanh toán thành công trên giao diện người dùng

**Labels:** `bug`, `FR-08`, `functional-testing`, `severity: high`

---

## 1. Tóm tắt (Summary)

Sau khi người dùng thực hiện thanh toán thành công trên giao diện (nhấn nút "Thanh toán" và nhận thông báo thành công), giỏ hàng trên giao diện vẫn hiển thị các sản phẩm ban đầu thay vì được xóa/trống. Điều này vi phạm yêu cầu nghiệp vụ tại `README.md` FR-08: "Sau thanh toán thành công, giỏ hàng được xóa."

> **Lưu ý:** Bug này có cùng root cause với **FR-08-BUG-003** (Domain Testing — Backend không xóa giỏ hàng sau checkout qua API). Chi tiết xem phần [7. Cross-Reference](#7-cross-reference).

---

## 2. Nguồn spec / kỳ vọng (Expected Behavior)

- **Tài liệu tham chiếu:** `contexts/README.md` — FR-08 §2, dòng 108
- **Trích nội dung spec:**
  > "Sau thanh toán thành công, giỏ hàng được xóa."
- **Mức độ rõ ràng của spec:** `[Rõ ràng từ spec]` — đây là yêu cầu bắt buộc, được nêu rõ trong spec.

---

## 3. Hành vi thực tế quan sát được (Actual Behavior)

| Bước | Input trên UI | Expected | Actual | Status |
|---|---|---|---|---|
| 1 | Người dùng có giỏ hàng chứa sản phẩm, truy cập trang giỏ hàng | Giỏ hàng hiển thị danh sách sản phẩm | Giỏ hàng hiển thị danh sách sản phẩm | ✅ |
| 2 | Người dùng nhấn nút "Thanh toán" và hoàn tất quy trình | Chuyển hướng đến trang xác nhận thành công | Chuyển hướng đến trang xác nhận thành công | ✅ |
| 3 | Người dùng nhận thông báo "Thanh toán thành công" | Giỏ hàng được xóa/trống khi quay lại trang giỏ hàng | **Giỏ hàng vẫn hiển thị các sản phẩm ban đầu** | ❌ |
| 4 | Người dùng thử thêm lại sản phẩm đã mua | Hệ thống cho phép thêm bình thường | Hệ thống cho phép thêm → **trùng lặp sản phẩm trong giỏ** | ❌ |

---

## 4. Các bước tái hiện (Steps to Reproduce)

1. Đăng nhập với tài khoản có giỏ hàng chứa ít nhất 1 sản phẩm.
2. Truy cập trang giỏ hàng — kiểm tra sản phẩm hiển thị.
3. Nhấn nút "Thanh toán" và hoàn tất quy trình thanh toán.
4. Quan sát thông báo "Thanh toán thành công" — nhấn "OK" hoặc chuyển hướng về trang chủ/giỏ hàng.
5. Truy cập lại trang giỏ hàng.
6. Kiểm tra giỏ hàng — nếu **vẫn còn sản phẩm ban đầu** → **Bug xác nhận**.
7. (Tùy chọn) Thử thêm lại 1 sản phẩm đã mua vào giỏ — kiểm tra xem có bị trùng lặp không.

**Môi trường test:** Browser (Chrome/Firefox), công cụ: Manual testing

---

## 5. Giả thuyết hành vi (Behavioral Hypothesis)

> Đây là suy luận **functional black-box** dựa trên quan sát hành vi người dùng trên giao diện.

- **Giả thuyết:** Backend không xóa giỏ hàng sau khi tạo đơn hàng thành công (đã xác nhận qua FR-08-BUG-003: gọi `GET /api/cart` sau checkout vẫn trả sản phẩm). UI hiển thị giỏ hàng dựa trên dữ liệu từ API, nên nếu API không xóa thì UI cũng không hiển thị giỏ hàng trống.
- **Mức độ tin cậy:** `Cao` — hành vi quan sát được qua nhiều bước trên UI.
- **Test case bổ sung cần chạy để xác nhận:**
  - Thử checkout nhiều lần liên tiếp — kiểm tra xem có tạo nhiều đơn hàng trùng lặp không.
  - Kiểm tra xem sản phẩm trong giỏ hàng có bị trùng lặp sau khi mua lại không.

---

## 6. Mức độ ảnh hưởng (Severity/Priority)

- **Severity:** `High`
- **Lý do:**
  - Người dùng có thể checkout cùng một giỏ hàng nhiều lần (tạo nhiều đơn hàng trùng lặp).
  - Trải nghiệm người dùng bị gián đoạn — giỏ hàng hiển thị sai sau khi mua.
  - Có thể gây nhầm lẫn cho người dùng về trạng thái đơn hàng.
  - Vi phạm trực tiếp spec FR-08.

---

## 7. Cross-Reference

| Tầng test | Bug ID | Mô tả | Ghi chú |
|---|---|---|---|
| **Domain Testing (API)** | FR-08-BUG-003 | Backend không xóa giỏ hàng sau `POST /api/checkout` — `GET /api/cart` vẫn trả sản phẩm | Root cause gốc |
| **Functional Testing (UI)** | FR-08-FUNC-BUG-002 | UI vẫn hiển thị giỏ hàng sau khi thanh toán thành công — biểu hiện của BUG-003 ở tầng cao hơn | Cùng root cause với BUG-003 |

> **Khi fix:** Cần fix **cả 2 tầng** để đảm bảo:
> - **Backend (BUG-003):** Xóa giỏ hàng sau khi tạo đơn hàng thành công.
> - **UI (FUNC-BUG-002):** Cập nhật UI để hiển thị giỏ hàng trống ngay sau khi nhận phản hồi thanh toán thành công.

---

## 8. Traceability

- **Test Case ID liên quan (trong report.md):** TC-C2 (Nhóm C — Domain Testing)
- **Feature:** FR-08 — Thanh toán (Checkout)
- **File report gốc:** `testing/FR-08/report.md`
- **Bug liên quan (Domain):** `testing/FR-08/issues/FR-08-BUG-003.md`

---

## 9. Đính kèm

- [ ] Screenshot trang giỏ hàng — trước khi thanh toán
- [ ] Screenshot trang xác nhận thanh toán thành công
- [ ] Screenshot trang giỏ hàng — sau khi thanh toán (vẫn còn sản phẩm)
- [ ] Screenshot trùng lặp sản phẩm trong giỏ hàng (nếu có)
