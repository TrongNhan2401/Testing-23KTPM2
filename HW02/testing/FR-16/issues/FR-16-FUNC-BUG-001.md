# [FR-16][Functional Bug] UI cho phép import file CSV thiếu header `category_id` — chấp nhận import thay vì báo lỗi

**Labels:** `bug`, `FR-16`, `functional-testing`, `severity: critical`

---

## 1. Tóm tắt (Summary)

Giao diện import CSV trên Web Admin cho phép người dùng tải lên file CSV thiếu header `category_id` (hoặc header không đúng format) và vẫn tiến hành import thay vì báo lỗi. Điều này vi phạm yêu cầu của FR-16: file CSV phải có header đúng format (`name,price,description,imageUrl,category_id`), và `category_id` là bắt buộc.

> **Lưu ý:** Bug này có cùng root cause với **FR-16-BUG-005** (Domain Testing — Backend không validate `category_id` từ client). Chi tiết xem phần [7. Cross-Reference](#7-cross-reference).

---

## 2. Nguồn spec / kỳ vọng (Expected Behavior)

- **Tài liệu tham chiếu:** `contexts/README.md` — FR-16 §2, dòng 200–212
- **Trích nội dung spec:**
  > "Hệ thống hiển thị báo cáo rõ ràng: bao nhiêu dòng thành công, bao nhiêu dòng lỗi và lý do." (FR-16 dòng 211)
  > "`category_id` là trường bắt buộc trong CSV header." (FR-16 dòng 207)
  > "Danh mục: bắt buộc, phải chọn từ danh sách có sẵn." (FR-15 dòng 197)
- **Mức độ rõ ràng của spec:** `[Rõ ràng từ spec]` — `category_id` là trường bắt buộc.

---

## 3. Hành vi thực tế quan sát được (Actual Behavior)

| Bước | Input trên UI | Expected | Actual | Status |
|---|---|---|---|---|
| 1 | Tạo file CSV với header: `name,price,description,imageUrl` (thiếu `category_id`) | UI/Backend báo lỗi: thiếu header bắt buộc `category_id` | UI cho phép upload, xử lý import | ❌ |
| 2 | Tải file CSV lên qua giao diện import | Hệ thống từ chối file không hợp lệ | File được import, sản phẩm được tạo với `category_id` = null hoặc giá trị mặc định | ❌ |

---

## 4. Các bước tái hiện (Steps to Reproduce)

1. Đăng nhập vào Web Admin với tài khoản admin.
2. Truy cập trang Import Sản phẩm.
3. Tạo file CSV với nội dung (thiếu header `category_id`):
   ```csv
   name,price,description,imageUrl
   Sản phẩm A,100000,Mô tả A,https://example.com/img.jpg
   ```
4. Tải file CSV lên qua nút "Import" / "Tải lên file CSV".
5. Quan sát kết quả:
   - Nếu file được xử lý và sản phẩm được tạo → **Bug xác nhận**.
   - Nếu hệ thống báo lỗi "Thiếu header bắt buộc" → Không có bug.

**Môi trường test:** Browser (Chrome/Firefox), Web Admin, công cụ: Manual testing

---

## 5. Giả thuyết hành vi (Behavioral Hypothesis)

> Đây là suy luận **functional black-box** dựa trên quan sát hành vi người dùng trên giao diện.

- **Giả thuyết:** UI/Web Admin không validate header của file CSV trước khi gửi lên backend. Backend nhận dữ liệu và xử lý như bình thường (đã xác nhận qua FR-16-BUG-005: backend không kiểm tra `category_id`). Cả hai tầng đều thiếu validation.
- **Mức độ tin cậy:** `Cao` — hành vi quan sát được qua các bước trên UI.
- **Test case bổ sung cần chạy để xác nhận:**
  - Thử header sai tên: `name,price,description,imageUrl,cate_id` (sai tên trường).
  - Thử header đúng nhưng thứ tự khác: `price,name,category_id,description,imageUrl`.

---

## 6. Mức độ ảnh hưởng (Severity/Priority)

- **Severity:** `Critical`
- **Lý do:**
  - Vi phạm trực tiếp FR-16: file CSV phải có header đúng format.
  - Sản phẩm được tạo với `category_id` không hợp lệ → dữ liệu không nhất quán.
  - Kết hợp với FR-16-BUG-005: nghiêm trọng hơn vì cả UI và Backend đều không validate.

---

## 7. Cross-Reference

| Tầng test | Bug ID | Mô tả | Ghi chú |
|---|---|---|---|
| **Domain Testing (API)** | FR-16-BUG-005 | Backend không validate `category_id` — chấp nhận null, thiếu, không tồn tại | Root cause gốc |
| **Functional Testing (UI)** | FR-16-FUNC-BUG-001 | UI cho phép upload CSV thiếu header `category_id` — biểu hiện của BUG-005 ở tầng cao hơn | Cùng root cause với BUG-005 |

> **Khi fix:** Cần fix **cả 2 tầng** để đảm bảo:
> - **Backend (BUG-005):** Validate `category_id` bắt buộc, phải tồn tại trong bảng categories.
> - **UI (FUNC-BUG-001):** Validate header CSV trước khi upload, hiển thị lỗi rõ ràng nếu thiếu header.

---

## 8. Traceability

- **Test Case ID liên quan (trong report.md):** TC-D4 (Nhóm D — Category validation, Domain Testing)
- **Feature:** FR-16 — Import Sản phẩm từ CSV
- **File report gốc:** `testing/FR-16/report.md`
- **Bug liên quan (Domain):** `testing/FR-16/issues/FR-16-BUG-005.md`

---

## 9. Đính kèm

- [ ] Screenshot file CSV thiếu header `category_id`
- [ ] Screenshot giao diện import — trước khi upload
- [ ] Screenshot kết quả import — sản phẩm được tạo (với category_id không hợp lệ)
- [ ] Screenshot trang quản lý sản phẩm — xác nhận sản phẩm đã được tạo
