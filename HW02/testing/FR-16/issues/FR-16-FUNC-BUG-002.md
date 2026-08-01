# [FR-16][Functional Bug] UI cho phép import file không phải đuôi `.csv` — không kiểm tra đuôi file trước khi upload

**Labels:** `bug`, `FR-16`, `functional-testing`, `severity: high`

---

## 1. Tóm tắt (Summary)

Giao diện import CSV trên Web Admin cho phép người dùng tải lên file có đuôi khác `.csv` (ví dụ: `.txt`, `.xlsx`, `.json`) và vẫn tiến hành xử lý import thay vì từ chối. Điều này vi phạm yêu cầu của FR-16: "Đuôi file phải là `.csv`."

> **Lưu ý:** Bug này chỉ có ở tầng UI — Domain Testing (API) không test được đuôi file vì API nhận JSON body thay vì file upload. Bug này không có Cross-reference với Domain Testing bugs.

---

## 2. Nguồn spec / kỳ vọng (Expected Behavior)

- **Tài liệu tham chiếu:** `contexts/README.md` — FR-16 §2, dòng 204
- **Trích nội dung spec:**
  > "**Yêu cầu file CSV:**
  > - Đuôi file phải là `.csv`."
- **Mức độ rõ ràng của spec:** `[Rõ ràng từ spec]` — spec nêu rõ đuôi file phải là `.csv`.

---

## 3. Hành vi thực tế quan sát được (Actual Behavior)

| Bước | Input trên UI | Expected | Actual | Status |
|---|---|---|---|---|
| 1 | Tạo file `.txt` hoặc `.xlsx` hoặc `.json` với nội dung dạng bảng | UI từ chối file: "Chỉ chấp nhận file .csv" | UI cho phép upload file | ❌ |
| 2 | Tải file lên qua giao diện import | Hệ thống báo lỗi định dạng file không hợp lệ | Hệ thống cố gắng xử lý và có thể tạo sản phẩm sai | ❌ |

---

## 4. Các bước tái hiện (Steps to Reproduce)

1. Đăng nhập vào Web Admin với tài khoản admin.
2. Truy cập trang Import Sản phẩm.
3. Tạo file có đuôi không phải `.csv`, ví dụ:
   - `products.txt` với nội dung: `name,price,category_id\nSản phẩm A,100000,1`
   - `products.xlsx` (Excel)
   - `products.json` với nội dung dạng bảng
4. Tải file lên qua nút "Import" / "Tải lên file CSV".
5. Quan sát kết quả:
   - Nếu file được xử lý hoặc hệ thống không báo lỗi rõ ràng → **Bug xác nhận**.
   - Nếu hệ thống báo lỗi "Chỉ chấp nhận file .csv" → Không có bug.

**Môi trường test:** Browser (Chrome/Firefox), Web Admin, công cụ: Manual testing

---

## 5. Giả thuyết hành vi (Behavioral Hypothesis)

> Đây là suy luận **functional black-box** dựa trên quan sát hành vi người dùng trên giao diện.

- **Giả thuyết:** UI/Web Admin không kiểm tra đuôi file (extension) trước khi upload. Có thể:
  - Input file không có thuộc tính `accept=".csv"` để giới hạn loại file.
  - Không có validation phía client hoặc server để kiểm tra đuôi file.
  - Backend nhận file và xử lý như bất kỳ file nào.
- **Mức độ tin cậy:** `Cao` — hành vi quan sát được qua các bước trên UI.
- **Test case bổ sung cần chạy để xác nhận:**
  - Thử file `.csv` nhưng nội dung là text thuần (không có dấu phẩy).
  - Thử file `.csv` với encoding khác (UTF-8 BOM, UTF-16).
  - Thử file `.CSV` (chữ hoa) — xem có phân biệt hoa thường không.

---

## 6. Mức độ ảnh hưởng (Severity/Priority)

- **Severity:** `High`
- **Lý do:**
  - Vi phạm trực tiếp FR-16: đuôi file phải là `.csv`.
  - Có thể gây lỗi xử lý file không đúng định dạng.
  - Rủi ro bảo mật: upload file độc hại với đuôi khác.
  - Không có Cross-reference với Domain Testing vì API nhận JSON, không phải file.

---

## 7. Cross-Reference

| Tầng test | Bug ID | Mô tả | Ghi chú |
|---|---|---|---|
| **Domain Testing (API)** | — | Không có — API nhận JSON body, không nhận file upload | — |
| **Functional Testing (UI)** | FR-16-FUNC-BUG-002 | UI không kiểm tra đuôi file — chấp nhận file không phải .csv | Bug chỉ có ở tầng UI |

> **Khi fix:** Cần fix **UI** để:
> - Thêm thuộc tính `accept=".csv"` vào input file.
> - Validate đuôi file phía client trước khi upload.
> - Backend cũng nên validate đuôi file nếu có xử lý file.

---

## 8. Traceability

- **Test Case ID liên quan (trong report.md):** Không có (Domain Testing không test được đuôi file)
- **Feature:** FR-16 — Import Sản phẩm từ CSV
- **File report gốc:** `testing/FR-16/report.md`

---

## 9. Đính kèm

- [ ] Screenshot file có đuôi không phải `.csv` (ví dụ: `.txt`)
- [ ] Screenshot giao diện import — trước khi upload
- [ ] Screenshot kết quả import — hệ thống xử lý hoặc báo lỗi không rõ ràng
- [ ] Screenshot file upload dialog — kiểm tra có `accept` attribute không
