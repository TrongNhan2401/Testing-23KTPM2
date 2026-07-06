# Audit Log — FR-16: Import Sản phẩm từ CSV

> Ghi chép theo trình tự thời gian. Mỗi phiên làm việc của AI được ghi thành 1 entry.

---

### [2026-07-06 19:51] — FR-16 — Bước 0 → Bước 5: Domain Testing Black-box (phiên bản 1)

- **Công cụ:** Cursor Agent (Claude)
- **Prompt/instruction nhận được:** Thực hiện kỹ thuật domain-testing cho FR-16: Import Sản phẩm từ CSV, theo phương pháp black-box thuần từ domain-testing-agent-blackbox.md.
- **File code đã đọc:**
  - `contexts/README.md` §2 (FR-12 Access Control, FR-15 Product CRUD, FR-16 CSV Import) — dòng 174–212
  - `contexts/api_specification.md` §6.3 (Import Products endpoint) — dòng 204–220
  - `domain-testing-agent-blackbox.md` — phương pháp luận
  - `templates/report_template_blackbox.md` — cấu trúc output
- **Output/kết luận của bước:**
  - Tạo thư mục `testing/FR-16/` và file `testing/FR-16/report.md` với đầy đủ 8 sections.
  - Tạo `testing/FR-16/audit-log.md` với Entry #1.
  - **Đặc điểm nổi bật của FR-16:**
    - FR-16 có 2 nguồn spec: `README.md` mô tả import CSV (file upload), nhưng `api_specification.md` §6.3 mô tả `POST /api/admin/import-products` nhận **JSON array**. Đây là **gap G-APP** — cần làm rõ API thực tế nhận gì.
    - Validation có 2 tầng: validation input (`name`, `price`, `category_id`) và validation transaction (`rollback`).
    - Nhiều giá trị thăm dò: price thập phân, body rỗng, trường không xác định, ký tự đặc biệt trong name.
    - **Logic rollback (all-or-nothing)** là nghiệp vụ cốt lõi — cần test cả TC-E2 để xác nhận không có sản phẩm nào được tạo khi có lỗi.
  - **33 test case** được thiết kế: 4 (Auth) + 6 (name) + 7 (price) + 5 (category) + 4 (rollback) + 7 (BV).
- **Human review / correction:** 
  - Ở EC cho name, theo tôi trường name bị thiếu hoặc null là không được (EC - N4) và name chỉ có khoảng trắng cũng là invalid (EC - N3)
  - Ở EC cho price, theo tôi price là số âm, thiếu trường price đều là invalid (EC - P3) (EC - P4) còn EC - P5, EC - P6 sẽ tiếp tục thăm dò

