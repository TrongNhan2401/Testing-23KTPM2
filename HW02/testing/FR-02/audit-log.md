# AI Audit Log

> File append-only. Mỗi lần agent chạy domain testing cho một FR, thêm entry mới ở CUỐI file
> theo đúng khung dưới đây — không sửa/xóa entry cũ. Một entry cho mỗi bước (0 → 6).

---

### [2026-07-04 23:40] — FR-02 — Bước 0: Thu thập đặc tả

- **Công cụ:** Cursor Agent
- **Prompt/instruction nhận được:** Thực hiện kỹ thuật domain testing cho FR-02: Login and account lockout
- **File code đã đọc:** Không đọc bất kỳ file source code nào — chỉ đọc tài liệu đặc tả
- **Output/kết luận của bước:** Đã xác định 2 nguồn tài liệu chính: (1) contexts/README.md §2, FR-02 (dòng 38–44) về nghiệp vụ login & lockout; (2) contexts/api_specification.md §1.2 (dòng 23–32) về contract endpoint POST /api/login. Tài khoản test: [test@eshop.com](mailto:test@eshop.com) / Test1234! và [admin@eshop.com](mailto:admin@eshop.com) / Admin123!.
- **Human review / correction:** Agent đã thu thập đúng đặc tả

---

### [2026-07-04 23:41] — FR-02 — Bước 1: Input & Output

- **Công cụ:** Cursor Agent
- **Prompt/instruction nhận được:** Hoàn thiện Bước 1 (Input & Output) cho domain testing FR-02
- **File code đã đọc:** Không đọc bất kỳ file source code nào
- **Output/kết luận của bước:** Xác định 6 input chính (email, password, số lần sai liên tiếp, thời gian khóa, tồn tại tài khoản, định dạng email) và 4 output chính (JWT 200, 401 sai xác thực, 423/429 khóa, 400 validation). Tất cả nguồn trỏ tới tài liệu spec.
- **Human review / correction:** *Agent đã xác định được đúng các loại input và các kiểu dữ liệu đi kèm. Agent đã xác định đúng được các yêu cầu dựa trên spec.*

---

### [2026-07-04 23:41] — FR-02 — Bước 2: Equivalence Classes

- **Công cụ:** Cursor Agent
- **Prompt/instruction nhận được:** Hoàn thiện Bước 2 (EC) cho domain testing FR-02
- **File code đã đọc:** Không đọc bất kỳ file source code nào
- **Output/kết luận của bước:** Tạo 16 EC: 6 EC cho email/password, 6 EC cho logic lockout (EC7–EC12), 4 EC giá trị thăm dò (EC13–EC16). Đánh dấu độ tin cậy: Từ spec (EC1–EC4, EC7–EC12) vs Giả định hợp lý — CẦN XÁC NHẬN (EC5–EC6, EC13–EC16).
- **Human review / correction:** *Agent đã xác định được đầy đủ các miền dễ thấy như của email và mật khảu. Bên cạnh đó Agent còn xác định thêm logic cho tài khoản được xác định theo condition trong spec nhưng không chia được các miền valid hay invalid.*

---

### [2026-07-04 23:41] — FR-02 — Bước 3 & 4: Test Case & BVA

- **Công cụ:** Cursor Agent
- **Prompt/instruction nhận được:** Hoàn thiện Bước 3 (EC test cases) và Bước 4 (BVA) cho domain testing FR-02
- **File code đã đọc:** Không đọc bất kỳ file source code nào
- **Output/kết luận của bước:** Tạo 27 test case tổng cộng: Nhóm A (đăng nhập thành công, 1 TC), Nhóm B (đăng nhập thất bại, 2 TC), Nhóm C (validation, 4 TC), Nhóm D (account lockout, 8 TC), BV lockout (6 TC với biên 2/3/4 lần sai và 29/30/31 giây), BV probing (6 TC giá trị cực trị). Tất cả giá trị boundary đều dựa trên spec ("từ 3 lần trở lên liên tiếp", "khóa 30 giây").
- **Human review / correction:**
  - *Phần test case của nhóm C validation phải chọn expected output trả về là 400 - Bad Request*
  - *Bổ sung TC-D5 và TC-D6 thêm một bước nhập cung tài khoản email và sai mật khẩu để đảm bảo rằng bộ đếm đã reset về 0*
  - *Để đảm bảo rằng khi tiếp tục đăng nhập sai sau khi*

---

### [2026-07-04 23:41] — FR-02 — Bước 5 & 6: Report & Gap Analysis

- **Công cụ:** Cursor Agent
- **Prompt/instruction nhận được:** Hoàn thiện Bước 5 (Gap Analysis) và tạo report.md cho FR-02
- **File code đã đọc:** Không đọc bất kỳ file source code nào
- **Output/kết luận của bước:** Hoàn thành Gap Analysis với 7 ràng buộc không xác định được từ spec (G1–G7) và 4 giả định cần xác nhận với business (GA1–GA4). Tạo report tổng hợp 27 test case tại testing/FR-02/report.md.
- **Human review / correction:** *Đã test và xác nhận các ràng buộc*

---

### [2026-07-05 19:22] — FR-02 — Bước 7: Phân tích kết quả Postman (phiên bản 1)

- **Công cụ:** Cursor Agent
- **Prompt/instruction nhận được:** Hoàn thành Bước 7 (phân tích kết quả Postman đã điền trong report.md), tạo 4 GitHub Issue, tạo Functional Testing UI, tạo audit-log-full.md
- **File code đã đọc:** Không đọc bất kỳ file source code nào — chỉ phân tích dữ liệu Actual/Status đã điền trong report.md
- **Output/kết luận của bước:** Phân tích 27 test case → 12 PASS, 6 FAIL. Tạo 4 GitHub Issue (BUG-001→004). Tạo Functional Testing UI (20 TC). Tạo audit-log-full.md.
- **Human review / correction:**
  - *Không đồng ý với root cause: vì vẫn chưa có xác nhận hay test từ code. Chỉ biết rằng lỗi khi đăng nhập thành công/restart lại server và khi trạng thái chờ kết thúc thì trả 2 kết quả attempts login khác nhau.*
  - *BUG-001: Expected không phải từ spec mà là giả định của tester — Agent đã không tuân thủ nguyên tắc black-box. Cần ghi rõ đây là giả định, không phải spec.*
  - *BUG-002: Bước tái hiện sai — phải bắt đầu từ "hết thời gian khóa và tiếp tục đăng nhập sai", không phải "từ đăng nhập thành công".*
  - *BUG-003: Đã mô tả đúng.*
  - *BUG-004: Mô tả bộ đếm bất thường — đúng nhưng không phải root cause.*
  - *Kết luận: gộp BUG-001 + BUG-004 thành 1 issue. Thêm TC-D9 (re-test: đúng ở lần 3 sau khi hết khóa). Viết lại report.md.*

---

### [2026-07-05 22:27] — FR-02 — Bước 7: Phân tích kết quả Postman (phiên bản 2 — sau human review)

- **Công cụ:** Cursor Agent
- **Prompt/instruction nhận được:** Human review từ phiên làm việc trước: (1) BUG-001 expected không phải từ spec mà là giả định tester; (2) BUG-002 bước tái hiện sai; (3) BUG-003 đúng; (4) BUG-004 gộp với BUG-001; (5) Thêm TC-D9 re-test; (6) Viết lại report.md và issues
- **File code đã đọc:** Không đọc bất kỳ file source code nào
- **Output/kết luận của bước:**
  - Đã xóa FR-02-BUG-001-validation-returns-401.md và FR-02-BUG-004-login-attempts-not-reset.md
  - Đã viết lại FR-02-BUG-002-lockout-at-2-fails.md với bước tái hiện đúng: "từ khi hết thời gian khóa và đăng nhập sai", thêm kết quả re-test TC-D9
  - Đã viết lại FR-02-BUG-001-004-combined-counter-anomaly.md gộp 2 issue: mô tả bộ đếm hoạt động bất thường, ghi rõ Expected TC-C là giả định không phải từ spec
  - Đã viết lại report.md hoàn chỉnh: (a) Thêm TC-D9 (re-test đúng ở lần 3); (b) Sửa Expected TC-C1–C4 thành "giả định tester — KHÔNG từ spec"; (c) Sửa Status TC-D2/TC-D3; (d) Cập nhật Section 6/7/8 với 3 issue mới
  - Đã thêm Entry #3 vào audit-log-full.md
- **Human review / correction:** Tôi đã xác định sai file cần phải gộp - file 002 và file 004 mới cùng nội dung, tôi sẽ để lại file Bug 001 vào issues API trả về 401 cho email/password rỗng thay vì 400 Bad Request , hãy tiến hành sửa chữa lại giúp tôi

---

### [2026-07-05 23:59] — FR-02 — Bước 7: Phân tích kết quả Postman (phiên bản 3 — sau human review lần 2)

- **Công cụ:** Cursor Agent
- **Prompt/instruction nhận được:** Human review lần 2: (1) Gộp sai — BUG-002 và BUG-004 mới cùng nội dung, không phải BUG-001 và BUG-004; (2) Giữ lại BUG-001 riêng: expected là giả định của tester, KHÔNG phải từ spec; (3) BUG-002 gộp BUG-002 + BUG-004 (cơ chế khóa ở lần 2); (4) Cập nhật report.md section 8; (5) Cập nhật audit-log.md và audit-log-full.md
- **File code đã đọc:** Không đọc bất kỳ file source code nào
- **Output/kết luận của bước:**
  - Đã viết lại FR-02-BUG-001-validation-returns-401.md: sửa phần Expected Behavior — ghi rõ "Spec không nêu rõ HTTP status code cho validation thất bại. Expected là **giả định của tester**, không phải từ spec."
  - Đã viết lại FR-02-BUG-002-lockout-at-2-fails.md: gộp nội dung BUG-002 và BUG-004 — mô tả cơ chế khóa ở lần 2, bộ đếm bất thường (không reset khi login đúng, không tăng đúng +1 mỗi lần sai)
  - Đã xóa FR-02-BUG-001-004-combined-counter-anomaly.md (file gộp cũ, không còn đúng)
  - Đã cập nhật report.md Section 8: 3 issue độc lập (BUG-001, BUG-002, BUG-003)
  - Đã cập nhật audit-log.md (entry phiên bản 3)
  - Đã thêm Entry #4 vào audit-log-full.md
- **Human review / correction:** *Bị lỗi encoding của report, thêm lại report cũ và cập nhật những thông tin cần thiết*

---

### [2026-07-05 23:55] — FR-02 — Bước 7: Hoàn thiện report.md & sửa encoding audit-log-full.md (phiên bản 4)

- **Công cụ:** Cursor Agent (Python script + ftfy)
- **Prompt/instruction nhận được:** Hoàn thiện 4 mục trong report.md: (a) thêm TC-D9 re-test đúng ở lần 3; (b) sửa Expected TC-C1–C4 thành "giả định tester — KHÔNG từ spec"; (c) sửa Status TC-D2/TC-D3; (d) cập nhật Section 6/7/8 với 3 issue mới. Đồng thời sửa encoding cho audit-log-full.md (file bị double-encoding UTF-8 → Latin-1 → UTF-8, gây mojibake toàn bộ tiếng Việt).
- **File code đã đọc:** Không đọc source code. Chỉ xử lý Markdown file (testing/FR-02/report.md, audit-log-full.md) bằng Python script + ftfy.
- **Output/kết luận của bước:**
  - Đã thêm TC-D9 vào Nhóm D (re-test: hết khóa → sai 2 lần → đúng lần 3 → Actual: 403 bị khóa → xác nhận khóa ở lần 2)
  - Đã đổi Expected TC-C1–C4 thành `[Giả định tester — KHÔNG từ spec]` với ghi chú rõ
  - Đã sửa Status TC-D1→TC-D9 cho khớp với quan sát Postman thực tế (gỡ JSON inline dài, thay bằng mô tả ngắn gọn)
  - Đã cập nhật Section 6: bỏ dòng "Phát hiện root cause", thêm lưu ý "Báo cáo KHÔNG khẳng định nguyên nhân kỹ thuật bên trong server"
  - Đã cập nhật Section 7: tổng 28 test case (thêm TC-D9), 12 pass + 3 partial + 6 fail + 1 cần xác nhận
  - Đã cập nhật Section 8: 3 issue độc lập (BUG-001 giữ riêng; BUG-002 gộp counter bất thường + khóa ở lần 2; BUG-003 thời gian khóa >30s)
  - Đã sửa encoding audit-log-full.md bằng thư viện `ftfy` (fix_text). File giờ là UTF-8 chuẩn, không BOM, không lỗi decode.
- **Human review / correction:** *Đã kiểm tra sơ bộ lỗi encodinng và thông tin được cập nhật*

