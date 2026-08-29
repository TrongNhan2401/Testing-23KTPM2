# BÁO CÁO KIỂM TOÁN AI (AI AUDIT REPORT)

> **Mã bài tập:** HW06-AI — Kiểm thử API  
> **Sinh viên thực hiện:** [Họ và tên Sinh viên] — [MSSV]  
> **Công cụ AI sử dụng:** Antigravity AI (Gemini 3.6 Flash)  
> **Thời gian bắt đầu:** 2026-08-29T06:14:44+07:00  

---

## LỜI TUYÊN BỐ SỬ DỤNG AI (AI DECLARATION)

*"Tôi sử dụng công cụ AI cho các tác vụ hỗ trợ tìm hiểu kiến thức, lập kế hoạch thực hiện, tư vấn chọn API không trùng lặp, giải đáp thắc mắc cấu hình công cụ Postman và kiểm toán các testcase kiểm thử API."*

---

## NHẬT KÝ TƯƠNG TÁC AI (AI INTERACTION LOG)

### 📌 Tương tác 1: Tìm hiểu kiến thức cốt lõi cho bài tập HW06
* **Tên công cụ AI:** Gemini 3.6 Flash (Antigravity AI)
* **Thời gian:** `2026-08-29 06:14:44 (UTC+07:00)`
* **Prompt của sinh viên:**
  > `@[HW06/2026.HW06.API_Testing_VN.md] Đây là file về bài tập của tôi, bạn hãy hướng dẫn tôi các làm bài tập này. Trước hết bạn hãy giúp tôi tìm hiểu về kiến thức cần phải nắm để làm được bài tập này`
* **Đầu ra của AI (Tóm tắt Output):**
  > AI phân tích đề bài HW06 và liệt kê 6 khối kiến thức cần nắm: (1) RESTful API & HTTP protocol, (2) Kỹ thuật thiết kế testcase (Domain Partitioning, State Transitions, Security SEC-01->SEC-07, Schema Validation), (3) Công cụ Postman/Newman, (4) CI/CD GitHub Actions, (5) AI Prompting & Audit, (6) Thiết kế AI Agent Skill.

---

### 📌 Tương tác 2: Tổng hợp tài liệu hướng dẫn kiến thức & bài tập mẫu
* **Tên công cụ AI:** Gemini 3.6 Flash (Antigravity AI)
* **Thời gian:** `2026-08-29 06:17:53 (UTC+07:00)`
* **Prompt của sinh viên:**
  > `Bây giờ bạn hãy giúp tôi trình bày một file .md về kiến thức để làm bài tập này, hãy tạo giải thích chi tiết từng kiến thức cho ví dụ minh họa hoặc bài tập để tôi nắm rõ chúng`
* **Đầu ra của AI (Tóm tắt Output):**
  > AI đã soạn thảo và khởi tạo file `HW06_KienThuc_API_Testing.md` bao gồm 6 chương lý thuyết chi tiết kèm đoạn code Postman script, JSON Schema mẫu, lệnh Newman, YAML GitHub Actions, ví dụ minh họa trên EShop SUT và bài tập tự luyện.

---

### 📌 Tương tác 3: Lập kế hoạch thực hiện từng bước (Implementation Plan)
* **Tên công cụ AI:** Gemini 3.6 Flash (Antigravity AI)
* **Thời gian:** `2026-08-29 08:47:22 (UTC+07:00)`
* **Prompt của sinh viên:**
  > `Bây giờ hãy giúp tôi làm 1 plan làm từng bước một để hoàn thành bài tập này, tạo thành 1 file .md giúp tôi`
* **Đầu ra của AI (Tóm tắt Output):**
  > AI đã tạo file `HW06_KeHoach_ThucHien.md` và artifact `implementation_plan.md` chia lộ trình làm việc thành 6 giai đoạn rõ ràng với checklist công việc từ chuẩn bị môi trường đến đóng gói file nộp bài.

---

### 📌 Tương tác 4: Tư vấn chọn 3 API không trùng lặp với thành viên trong nhóm
* **Tên công cụ AI:** Gemini 3.6 Flash (Antigravity AI)
* **Thời gian:** `2026-08-29 08:49:45 (UTC+07:00)`
* **Prompt của sinh viên:**
  > `forgotpassword,cancel order,add-to-cart POST /api/register POST /api/apply-coupon POST/PUT/DELETE /api/products POST /api/login (FR-02) POST /api/checkout (FR-08) PUT/api/admin/orders/:id/status (FR-18). Đây là các api mà nhóm tôi đã chọn rồi, giúp tôi chọn các api còn lại và cập nhật file hướng dẫn`
* **Đầu ra của AI (Tóm tắt Output):**
  > AI đã loại trừ các API của nhóm và đề xuất bộ 3 API tối ưu riêng cho sinh viên:
  > - **Pool A (FR-05):** `GET /api/products/search` (Tìm kiếm sản phẩm)
  > - **Pool B (FR-11):** `GET /api/user/orders` (Lịch sử đơn hàng cá nhân)
  > - **Pool C (FR-14):** `POST /api/admin/categories` (Tạo danh mục Admin)
  > Đồng thời cập nhật thông tin này vào file `HW06_KeHoach_ThucHien.md`.

---

### 📌 Tương tác 5: Đọc file đặc tả API SUT và hướng dẫn bước tiếp theo
* **Tên công cụ AI:** Gemini 3.6 Flash (Antigravity AI)
* **Thời gian:** `2026-08-29 09:36:44 (UTC+07:00)`
* **Prompt của sinh viên:**
  > `Bạn hãy đọc file trong context có api_specification trong HW06, đọc cả file README.md để lấy ngữ cảnh sau đó hướng đãn tôi bước tiếp theo`
* **Đầu ra của AI (Tóm tắt Output):**
  > AI đối soát dữ liệu với `api_specification.md` và `README.md` trong repo `eshop`, làm rõ endpoint thực tế (`GET /api/products`, `GET /api/orders/my-orders`, `POST /api/categories`), hướng dẫn cấu hình Postman Environment, Pre-request script và cung cấp Prompt Mẫu Đợt 1 để sinh 35 testcases cho API 1.

---

### 📌 Tương tác 6: Tư vấn thứ tự thực hiện giữa 3 API Pipeline và Agent Skill
* **Tên công cụ AI:** Gemini 3.6 Flash (Antigravity AI)
* **Thời gian:** `2026-08-29 09:38:48 (UTC+07:00)`
* **Prompt của sinh viên:**
  > `Tôi có cần phải tạo agent skill trước hay không`
* **Đầu ra của AI (Tóm tắt Output):**
  > AI khuyên không nên làm Agent Skill trước. Ưu tiên làm xong 3 API trước (chiếm 90/100 điểm) để tích lũy trải nghiệm thực tế về prompt và audit, sau đó mới thiết kế Agent Skill (10 điểm) ở bước 5.

---

### 📌 Tương tác 7: Hướng dẫn chi tiết Bước 1.3 và Bước 1.4 trong Postman
* **Tên công cụ AI:** Gemini 3.6 Flash (Antigravity AI)
* **Thời gian:** `2026-08-29 11:17:19 (UTC+07:00)`
* **Prompt của sinh viên:**
  > `Hiện tại tôi đang tới bước 1.3 hãy hướng dẫn tôi chi tiết`
* **Đầu ra của AI (Tóm tắt Output):**
  > AI hướng dẫn từng bước click chuột để tạo Environment `EShop_Environment` (chứa `baseUrl`, `student_id`, `user_token`, `admin_token`), tạo Collection `HW06_EShop_API_Testing` và dán Pre-request Script tự động gắn header `X-Student-Id`.

---

### 📌 Tương tác 8: Giải đáp vị trí thẻ Pre-request Script trên Postman mới & Lý do cần thiết
* **Tên công cụ AI:** Gemini 3.6 Flash (Antigravity AI)
* **Thời gian:** `2026-08-29 11:26:45 (UTC+07:00)`
* **Prompt của sinh viên:**
  > `Hiện tại tôi chưa thể thực hiện bước này do chưa thấy ở collection root có Thẻ Pre-request Script bạn có thể chỉ chi tiết hơn không. Và có cần thiết không tại vì tôi thấy mình đã để environment có mã số sinh viên rồi`
* **Đầu ra của AI (Tóm tắt Output):**
  > AI giải thích sự khác biệt giữa Variable và HTTP Header (Environment không tự gửi header), dẫn chứng yêu cầu Anti-AI-Cheat của HW06. Đồng thời chỉ rõ cách tìm thẻ `Scripts` -> `Pre-request` trên giao diện Postman v10/v11.

---

### 📌 Tương tác 9: Yêu cầu trích xuất nhật ký AI Audit Report
* **Tên công cụ AI:** Gemini 3.6 Flash (Antigravity AI)
* **Thời gian:** `2026-08-29 11:29:23 (UTC+07:00)`
* **Prompt của sinh viên:**
  > `Tôi đã cấu hình xong, bạn có thể trích xuất và tạo 1 file ai-audit log ghi lại những gì tôi và bạn đã trao đổi như prompt hay output, có đầy đủ thời gian được hay không.`
* **Đầu ra của AI (Tóm tắt Output):**
  > AI đã tổng hợp và xuất ra file `AI_Audit_Report.md` lưu trữ toàn bộ nhật ký tương tác kèm thời gian chính xác để nộp bài.

---

### 📌 Tương tác 10: Sinh danh sách 35 Test Cases và Audit Log cho API 1 (`GET /api/products`)
* **Tên công cụ AI:** Gemini 3.6 Flash (Antigravity AI)
* **Thời gian:** `2026-08-29 11:39:36 (UTC+07:00)`
* **Prompt của sinh viên:**
  > `Bây giờ bạn hãy tạo giúp tôi danh sách 35 test case cho API 1 GET/api/products bao phủ các kỹ thuật, có một cột để tôi đánh giá , ghi prompt cũng như output đầy đủ của phần này vào file audit log cho tôi`
* **Đầu ra của AI (Tóm tắt Output):**
  > AI đã khởi tạo file `API1_Products_TestCases.md` bao gồm:
  > 1. Danh sách **35 Test Cases** bao phủ 4 kỹ thuật (Domain Partitions/BVA, Dataflow/State Transitions, Security SEC-05 SQLi/XSS, và JSON Schema Validation).
  > 2. Có cột **Đánh Giá Audit** (`VALID`, `INVALID`, `INCOMPLETE`) và cột **Ghi Chú Audit / Sửa Đổi** theo đúng quy định kiểm toán.
  > 3. Bảng **5 Test Cases mở rộng (EXT01 - EXT05)** do con người thiết kế bổ sung (Wildcard SQL `%`, HTTP Accept-Encoding gzip, JSON Payload Query, HPP, Race Condition) kèm phân tích lý do AI bỏ sót.

