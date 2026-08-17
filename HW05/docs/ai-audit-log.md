# AI Audit Log

## [2026-08-17 09:25] Claude Sonnet 5 (Cursor)

**Prompt:**
Bạn là chuyên gia JMeter. Hãy thiết kế một JMeter Test Plan (.jmx) cho Load Testing endpoint `GET /api/orders/my-orders` của hệ thống EShop (Node.js + Express + SQLite, backend tại http://localhost:3000).

Yêu cầu:
- Workflow 2 bước: (1) POST /api/login để lấy JWT token, (2) GET /api/orders/my-orders với header Authorization: Bearer ${token}
- 50 Virtual Users, ramp-up 30s, hold 3 phút (180s scheduler)
- Think-time uniform 500–1500 ms (sau này tôi tăng lên 1000–3000 ms khi review)
- Data-driven từ CSV `HW05/load/users.csv` chứa 30 dòng email/password (perfuser1..30@eshop.com / Pass1234!)
- Listener cho Load: View Results Tree (3 plan khác dùng Summary Report và Aggregate Report)
- Có Response Assertion kiểm tra status 200
- Có JSON Extractor lấy $.token từ response login
- Có HTTP Header Manager (Content-Type=application/json) + Auth Header Manager per-request
- Constant Throughput Timer ~100 RPS để kiểm soát RPS
- Test Plan name: `23127443_Load_20260817`

Hãy trả về XML .jmx hoàn chỉnh (UTF-8) và giải thích ngắn các giá trị cấu hình.

**Output:**
Đã generate file `23127443_Load_20260817.jmx` với cấu trúc:
- TestPlan > ThreadGroup (50 VU, 30s ramp-up, 180s scheduler, loop forever)
- CSV Data Set Config: users.csv, shareMode.all
- HTTP Request Defaults: localhost:3000
- HTTP Header Manager: Content-Type=application/json
- Constant Throughput Timer: 100 RPS
- Uniform Random Timer: 500–1500 ms
- TransactionController "Workflow: Login -> Get Orders"
  - POST /api/login với body {"email":"${email}","password":"${password}"}
    - JSON Extractor: $.token -> ${token}
  - GET /api/orders/my-orders
    - Auth Header: Bearer ${token}
    - Response Assertion: code 200
- View Results Tree listener, ghi ra results-tree.jtl

**Sau Human Review (đã sửa):**
1. Bỏ assertion "Response contains 'user_id'" — sai vì user chưa có order trả về `[]` (200 OK nhưng không có field user_id) → test sẽ fail oan.
2. Thêm Duration Assertion < 3000 ms — kiểm tra SLO p95.
3. Tăng think-time lên 1000–3000 ms — realistic hơn cho user đọc order history.
4. Thêm Constant Throughput Timer 100 RPS — kiểm soát tải ổn định.
5. Bỏ Summary Report + Aggregate Report khỏi plan này (chỉ giữ View Results Tree cho Load) — đề yêu cầu 3 listener khác nhau cho 3 plan, không lặp trong 1 plan.
6. Ghi chú vào TestPlan.comments: đã review và sửa các điểm trên.

## [2026-08-17 09:30] Claude Sonnet 5 (Cursor)

**Prompt:**
Bạn là chuyên gia JMeter. Tôi đã chạy thử file `23127443_Load_20260817.jmx` nhưng bị lỗi XML:
- `stringProp` thiếu attribute `name` (Assertion 200)
- `DurationAssertion` ở line 124 không tương thích JMeter 5.6.3
- `ResultCollector/objProp/value/assertionsResultsToRegEx` ở line 151 cũng fail khi deserialize

Hãy generate lại file .jmx tối thiểu, đảm bảo KHÔNG có các field optional có thể bị JMeter 5.6.3 reject, GIỮ ĐẦY ĐỦ logic:
- 50 VU, ramp-up 30s, scheduler 180s
- CSV users.csv, shareMode.all
- HTTP Defaults localhost:3000
- Constant Throughput 100 RPS
- Think Time 1000-3000 ms
- Workflow: POST /api/login (extract token) -> GET /api/orders/my-orders (Bearer ${token}, assert 200)
- View Results Tree listener

**Output:**
File `23127443_Load_20260817.jmx` v2 đã được viết lại với:
- Bỏ Duration Assertion (SLO check sẽ làm ở giai đoạn analyze log)
- Bỏ các field optional trong ResultCollector (chỉ giữ tên + filename)
- Tất cả `<stringProp>` trong collectionProp assertion có `name="0"`

**Kết quả chạy smoke test (5 VU, 10 loops):**
- `summary = 100 in 00:00:08 = 12.3/s Avg: 2 Min: 1 Max: 39 Err: 0 (0.00%)`
- → Test plan hợp lệ, workflow hoạt động.

---
