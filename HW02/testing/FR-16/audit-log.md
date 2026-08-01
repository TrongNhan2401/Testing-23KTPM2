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

---

### [2026-07-06 21:45] — FR-16 — Human Review Corrections + User Test Execution + Bug Discovery (phiên bản 2)

- **Công cụ:** Cursor Agent (Claude)
- **Prompt/instruction nhận được:**
  ```
  Human review / correction:

  Ở EC cho name, theo tôi trường name bị thiếu hoặc null là không được (EC - N4) và name chỉ có khoảng trắng cũng là invalid (EC - N3)

  Ở EC cho price, theo tôi price là số âm, thiếu trường price đều là invalid (EC - P3) (EC - P4) còn EC - P5, EC - P6 sẽ tiếp tục thăm dò

  Đây là review của tôi về human review của tôi. Tôi đã thực hiện các test case mà bạn đề xuất. Ngoài ra tôi phát hiện thêm lỗi là ghi gửi 2 lần import của cùng một nội dung body (cùng 1 sản phẩm 2 lần) thì sẽ đều được import như 2 sản phẩm khác id, đây là 1 bugs không có trong report @testing/FR-16/report.md. Bây giờ bạn hãy trình bày bugs chưa có và chú thích là phần AI chưa tìm được test case này. Sau đó bạn hãy thực hiện bước 7 trong @domain-testing-agent-blackbox.md để phân tích các issues. Sau đó dựa vào @templates/github_issue_template.md để viết các issues cho FR-16. Sau đó bạn hãy trình bày @testing/FR-16/audit-log.md và viết đầy đủ prompt cũng như AI-Output vào file @audit-log-full.md
  ```
- **File code đã đọc:**
  - `testing/FR-16/report.md` — đã có Actual + Status từ user
  - `domain-testing-agent-blackbox.md` — Bước 7
  - `templates/github_issue_template.md`
- **Output/kết luận của bước:**
**Tổng kết test sau khi user chạy Postman:**
  - A (Authorization): 3/4 PASS, 1 FAIL (TC-A3: non-admin import)
  - B (Name validation): 3/6 PASS, 3 FAIL (TC-B3: space, TC-B5: thiếu, TC-B6: >255)
  - C (Price validation): 3/7 PASS, 4 FAIL (TC-C2/C3/C4/C5)
  - D (Category validation): 1/5 PASS, 4 FAIL (TC-D2/D3/D4/D5)
  - E (Rollback): 3/4 PASS, 1 FAIL (TC-E2: không rollback all-or-nothing)
  - BV (Boundary): 5/7 PASS, 2 FAIL (BV-N3, BV-P3/P4)
  - **Tổng: 18 PASS / 15 FAIL trên 33 test case (54.5%)**
  **Bug ngoài spec (user phát hiện):** Duplicate products — gửi 2 sản phẩm trùng lặp trong cùng 1 request tạo 2 bản ghi khác id.
  **6 Bug được phát hiện từ test case:**
  1. **FR-16-BUG-001** (Critical): Non-admin import được — vi phạm FR-12 Access Control
  2. **FR-16-BUG-002** (High): Name chỉ có space được thêm
  3. **FR-16-BUG-003** (High): Name > 255 ký tự được thêm
  4. **FR-16-BUG-004** (Critical): Price = 0/âm/null/thiếu được thêm
  5. **FR-16-BUG-005** (Critical): Category không tồn tại/null/thiếu được thêm
  6. **FR-16-BUG-006** (Critical): Không rollback khi có lỗi — vi phạm all-or-nothing
  **1 Bug được phát hiện bởi Human (ngoài phạm vi AI):**
  7. **FR-16-BUG-007** (High): Duplicate products không được xử lý — **AI chưa tìm được test case này**
  **Các file đã tạo/cập nhật:**
  - `testing/FR-16/report.md` — cập nhật Section 6, 7, 8 với kết quả phân tích
  - `testing/FR-16/issues/FR-16-BUG-001.md`
  - `testing/FR-16/issues/FR-16-BUG-002.md`
  - `testing/FR-16/issues/FR-16-BUG-003.md`
  - `testing/FR-16/issues/FR-16-BUG-004.md`
  - `testing/FR-16/issues/FR-16-BUG-005.md`
  - `testing/FR-16/issues/FR-16-BUG-006.md`
  - `testing/FR-16/issues/FR-16-BUG-007.md`
  - `testing/FR-16/audit-log.md` — Entry #2, #3
  - `audit-log-full.md` — Entry #13, #14
- **Human review / correction:** *User đã đồng ý với corrections và đã chạy test case. User phát hiện thêm bug duplicate products. Không có human review bổ sung. Đồng ý với các issue mà agent đã phân tích*

---

### [2026-07-07 01:16] — FR-16 — Functional Testing Bugs (UI) + Section 8.2 + 8.3 (phiên bản 3)

- **Công cụ:** Cursor Agent (Claude)
- **Prompt/instruction nhận được:**
  ```
  Đây là kết quả của functional testing cho FR-16 của tôi:
  +Lỗi khi sai header (thiếu header category_id) nhưng vãn có thể import sản phẩm
  + Lỗi không rollback khi có 1 cột bị lỗi mà import cột đúng chỉ không import cột lỗi
  + Lỗi thêm được sản phầm có giá 0đ, giá âm, giá không phải là số
  + Lỗi thêm được sản phẩm với category không tồn tại, không điền category
  + Lỗi Thêm được sản phẩm tên dài hơn 256 ký tự
  + Lõi Thêm được 2 sản phẩm trùng tên
  + Lỗi thêm được sản phẩm từ đuôi không phải file .csv

  Hãy trình bày các lỗi functional testing này của UI vào @testing/FR-16/report.md sau đó ghi @testing/FR-16/audit-log.md và đầy đủ prompt AI-Output vào @audit-log-full.md
  ```
- **File đã đọc:**
  - `testing/FR-16/report.md` — Domain Testing Report với 7 Domain bugs
  - `testing/FR-08/report.md` — để tham khảo cách tổ chức Functional Testing Section
- **Output/kết luận của bước:**
**Phân tích 7 lỗi Functional Testing từ user:**

  | #   | Lỗi Functional Testing                                         | Mapping sang Domain Bug | Ghi chú                                                           |
  | --- | -------------------------------------------------------------- | ----------------------- | ----------------------------------------------------------------- |
  | 1   | Lỗi thiếu header `category_id` nhưng vẫn import được           | FR-16-BUG-005           | → Tạo **FR-16-FUNC-BUG-001**                                      |
  | 2   | Không rollback khi có 1 cột lỗi (cột đúng vẫn import)          | FR-16-BUG-006           | → Đã có FR-16-BUG-006 (Domain), không tạo bug mới                 |
  | 3   | Thêm được sản phẩm giá 0đ, âm, không phải số                   | FR-16-BUG-004           | → Đã có FR-16-BUG-004 (Domain), không tạo bug mới                 |
  | 4   | Thêm được sản phẩm category không tồn tại, không điền category | FR-16-BUG-005           | → Đã có FR-16-BUG-005 (Domain), không tạo bug mới                 |
  | 5   | Thêm được sản phẩm tên dài hơn 256 ký tự                       | FR-16-BUG-003           | → Đã có FR-16-BUG-003 (Domain), không tạo bug mới                 |
  | 6   | Thêm được 2 sản phẩm trùng tên                                 | FR-16-BUG-007           | → Đã có FR-16-BUG-007 (Domain), không tạo bug mới                 |
  | 7   | Thêm được sản phẩm từ đuôi không phải `.csv`                   | —                       | → **FR-16-FUNC-BUG-002** (UI only, không có Domain bug tương ứng) |

  **Nhận xét:** 5/7 lỗi Functional Testing (bug #2-6) đều đã được phát hiện ở Domain Testing (Backend). Điều này cho thấy bugs ở Backend ảnh hưởng trực tiếp đến UI. Chỉ có 2 bugs là **UI-specific** (không test được ở Domain Testing):
  - **FR-16-FUNC-BUG-001**: Thiếu header `category_id` (cross-ref với BUG-005)
  - **FR-16-FUNC-BUG-002**: Import file không phải `.csv` (UI only)
  **Các file đã tạo/cập nhật:**
  - `testing/FR-16/issues/FR-16-FUNC-BUG-001.md` — Functional Bug #1: Thiếu header CSV
  - `testing/FR-16/issues/FR-16-FUNC-BUG-002.md` — Functional Bug #2: Import file không phải .csv
  - `testing/FR-16/report.md` — bổ sung Section 8.2 (Functional Testing Bugs), 8.3 (Cross-Reference), 8.4 (Human Bugs)
  - `testing/FR-16/audit-log.md` — Entry #3 (phiên bản 3)
  - `audit-log-full.md` — Entry #15
- **Human review / correction:** *Đã đọc qua các file và đồng ý việc gộp lại các isusse xảy ra ở functional testing vì một số lỗi đã miêu tả ở phần domain testing.*

