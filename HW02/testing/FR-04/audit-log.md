# Audit Log — FR-04: Quản lý Hồ sơ Cá nhân

> Ghi chép theo trình tự thời gian. Mỗi phiên làm việc của AI được ghi thành 1 entry.

---

### [2026-07-07 01:28] — FR-04 — Bước 0 → Bước 6: Domain Testing Black-box (phiên bản 1)

- **Công cụ:** Cursor Agent (Claude)
- **Prompt/instruction nhận được:** Thực hiện kỹ thuật domain testing cho FR-04: Quản lý hồ sơ cá nhân, theo phương pháp black-box thuần từ domain-testing-agent-blackbox.md.
- **File code đã đọc:**
  - `contexts/README.md` §2 (FR-04 Quản lý hồ sơ cá nhân) — dòng 62–68
  - `contexts/api_specification.md` §2 (Users API) — dòng 61–80
  - `domain-testing-agent-blackbox.md` — phương pháp luận
  - `templates/report_template_blackbox.md` — cấu trúc output
- **Output/kết luận của bước:**
  - Tạo thư mục `testing/FR-04/` và file `testing/FR-04/report.md` với đầy đủ 8 sections.
  - Tạo `testing/FR-04/audit-log.md` với Entry #1.
  - **Đặc điểm nổi bật của FR-04:**
    - Feature đơn giản: chỉ có PUT /api/users/me để cập nhật hồ sơ.
    - 3 trường có thể cập nhật: `name`, `phone`, `shipping_address`.
    - Validation quan trọng nhất: `phone` phải bắt đầu bằng `0`, 10–11 chữ số (FR-04 dòng 65).
    - Security: không thể thay đổi `email` và `role` (FR-04 dòng 66–67).
    - Nhiều giá trị thăm dò: name max length, phone có bắt buộc không, shipping_address max length.
  - **31 test case** được thiết kế: 3 (Auth) + 5 (name) + 10 (phone) + 4 (shipping_address) + 2 (security) + 7 (BV).
- **Human review / correction:** Đồng ý chia các miền EC như trong report sau khi thực hiện phân tích FR-04

