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

---

### [2026-07-07 05:24] — FR-04 — Bước 7: Phân tích kết quả Postman & Bug Issues (phiên bản 2)

- **Công cụ:** Cursor Agent (Claude)
- **Prompt/instruction nhận được:**
  ```
  @domain-testing-agent-blackbox.md @testing/FR-04/report.md Tôi đã thực hiện việc chạy test case và đưa ra các actual cũng như status. Bây giờ bạn hãy thực hiện bước 7 trong skill của domain testing là phân tích kết quả giúp tôi. Sau đó tổng hợp và viết các file skill isuses theo mẫu @templates/github_issue_template.md. Sau khi hoàn thành hãy tiến hành ghi @testing/FR-04/audit-log.md và đầy đủ prompt cũng như AI-Output vào file @audit-log-full.md.
  ```
- **File đã đọc:**
  - `testing/FR-04/report.md` — đã có Actual + Status từ user
  - `domain-testing-agent-blackbox.md` — Bước 7
  - `templates/github_issue_template.md`
- **Output/kết luận của bước:**

  **Tổng kết test sau khi user chạy Postman:**
  - A (Authorization): 3/3 PASS ✅
  - B (Name validation): 1/5 PASS, 4 FAIL ❌
  - C (Phone validation): 3/10 PASS, 7 FAIL ❌
  - D (Shipping address): 4/4 PASS ✅
  - E (Security): 1/2 PASS, 1 FAIL ❌
  - BV (Boundary): 2/7 PASS, 5 FAIL ❌
  - **Tổng: 14 PASS / 17 FAIL trên 31 test case (45.2%)**

  **5 Bug phát hiện:**

  1. **FR-04-BUG-001** (Critical): Backend không validate `name` — chấp nhận name rỗng, space, null, và >255 ký tự
  2. **FR-04-BUG-002** (Critical): Backend không validate `phone` — chấp nhận phone không đúng định dạng (9 số, 12+ số, không có 0, có chữ, rỗng, null)
  3. **FR-04-BUG-003** (Critical): Backend cho phép thay đổi `role` — vi phạm nghiêm trọng FR-04 Access Control
  4. **FR-04-BUG-004** (Medium): Backend không validate `shipping_address` rỗng/null
  5. **FR-04-BUG-005** (High): Backend không xử lý `phone` — lưu giá trị mà không normalize

  **Bug nghiêm trọng nhất:** FR-04-BUG-003 — User có thể tự nâng quyền thành admin (Privilege Escalation)

  **Các file đã tạo/cập nhật:**
  - `testing/FR-04/report.md` — cập nhật Section 6, 7, 8 với kết quả phân tích
  - `testing/FR-04/issues/FR-04-BUG-001.md`
  - `testing/FR-04/issues/FR-04-BUG-002.md`
  - `testing/FR-04/issues/FR-04-BUG-003.md`
  - `testing/FR-04/issues/FR-04-BUG-004.md`
  - `testing/FR-04/issues/FR-04-BUG-005.md`
  - `testing/FR-04/audit-log.md` — Entry #2
  - `audit-log-full.md` — Entry #17

- **Human review / correction:** *(để trống cho đến khi người dùng review)*

---

### [2026-07-07 05:40] — FR-04 — Functional Bug Mobile: Phone 9 chữ số (phiên bản 3)

- **Công cụ:** Cursor Agent (Claude)
- **Prompt/instruction nhận được:**
  ```
  Hiện tại tôi phát hiện functional testing được báo khi cập nhật trên mobile là từ 9 - 10 chữ số khác trong spec. Hãy ghi lỗi này cho tôi. Khi tôi đổi sđt mà ít hơn 9 chữ số nó sẽ báo
  ```
- **File đã đọc:**
  - `testing/FR-04/report.md` — Domain Testing Report
  - `testing/FR-04/issues/FR-04-BUG-002.md` — Backend phone validation bug
- **Output/kết luận của bước:**

  **Phân tích functional bug:**
  - User phát hiện: Mobile hiển thị lỗi khi nhập phone < 9 chữ số.
  - Bug: Mobile cho phép lưu phone 9 chữ số sau khi hiển thị lỗi (nếu nhấn Lưu).
  - Root cause: Kết hợp với FR-04-BUG-002 — Backend không validate phone.
  - Cross-reference: FR-04-FUNC-BUG-001 ↔ FR-04-BUG-002.

  **Bug đã tạo:**
  - **FR-04-FUNC-BUG-001** (High): Mobile cho phép lưu phone 9 chữ số sau khi hiển thị lỗi.

  **Các file đã tạo/cập nhật:**
  - `testing/FR-04/issues/FR-04-FUNC-BUG-001.md` — Functional Bug Mobile
  - `testing/FR-04/report.md` — bổ sung Section 8.2 (Functional Bugs), 8.3 (Cross-Reference), 8.4 (Tổng hợp)
  - `testing/FR-04/audit-log.md` — Entry #3
  - `audit-log-full.md` — Entry #18

- **Human review / correction:** *(để trống cho đến khi người dùng review)*

