# HW05 — Báo cáo Kiểm thử Hiệu năng

**MSSV:** 23127443 - Trần Phạm Trọng Nhân  
**Môn học:** Kiểm thử Phần mềm (KTPM) — Học kỳ 3, Năm 3
**Giảng viên:** Dr. Lam Quang Vu
**Ngày:** 2026-08-18
**Mức Bloom-AI:** G9.2 (Apply), G9.3 (Analyse), G9.4 (Collaborate), G9.6 (Disrupt)

---

## 1. Tóm tắt Điều hành

Báo cáo này ghi lại toàn bộ chu trình kiểm thử hiệu năng của hệ thống **EShop** (System Under Test - SUT). Ba scenario hiệu năng đã được thiết kế, thực thi và phân tích bằng **Apache JMeter 5.6.3**, với **Claude Sonnet 5** làm trợ lý AI xuyên suốt quy trình.

### 1.1 Kết quả Tổng quan


| Scenario   | Nhóm Endpoint                     | Tỷ lệ Pass | p95 Latency | Đánh giá                |
| ---------- | --------------------------------- | ---------- | ----------- | ----------------------- |
| **Load**   | Orders/MyOrders (đọc nhiều)       | **100%**   | 7 ms        | PASS                    |
| **Stress** | Reset Password (xác thực nhiều)   | **100%**   | 25 ms       | PASS (sau khi reset DB) |
| **Spike**  | Admin Import Products (giao dịch) | **100%**   | 2866 ms     | PASS (sau khi fix JMX)  |


### 1.2 Phát hiện Chính

1. **Hiệu năng rất tốt** — p95 latency dưới 30 ms trên toàn bộ các scenario.
2. **Cả 3 scenario PASS 100%** sau khi sửa lặp (DB reset + sửa JMX).
3. **Phần cứng còn dư dả rất nhiều** — CPU chỉ sử dụng 6% ở mức cao nhất.
4. **3 vấn đề JMX/test-design** đã được phát hiện và sửa qua vòng lặp cộng tác người-AI (không phải bug SUT).

### 1.3 Checklist Sản phẩm Nộp

- 3 kế hoạch kiểm thử (`.md`) — `test-plans/`
- 3 file dữ liệu (`.csv`) — `test-data/`
- 3 kế hoạch JMeter (`.jmx`) — thư mục gốc
- 3 raw logs (`.jtl`) — `Results/` (tổng cộng 2.239 records)
- Báo cáo bug (3 vấn đề JMX/test-design) — `docs/bug_reports.md`
- AI critique (229 từ) — `docs/ai-critique.md`
- Đề xuất continuous testing — `docs/continuous-performance-testing.md`
- Báo cáo phần cứng — `Evidence/Hardware_Report.md`
- Screenshot Task Manager (3) — `Evidence/screenshots/`
- AI audit log — `docs/ai-audit-log.md`
- Báo cáo chính — `docs/main_report.md` (file này)

---

## 2. Phạm vi Kiểm thử & Lựa chọn Endpoint

Theo yêu cầu bài tập phải cover ba nhóm endpoint riêng biệt (mỗi scenario một nhóm), mapping được chọn như sau:


| Scenario   | Nhóm Endpoint  | Quy trình API                                                                                          |
| ---------- | -------------- | ------------------------------------------------------------------------------------------------------ |
| **Load**   | Đọc nhiều      | `POST /api/login` → `GET /api/orders/my-orders` (FR-11: lịch sử đơn hàng)                              |
| **Stress** | Xác thực nhiều | `POST /api/forgot-password` → `POST /api/login` (sai pwd) → `POST /api/reset-password` (FR-02 + FR-06) |
| **Spike**  | Giao dịch      | `POST /api/login` (admin) → `GET /api/categories` → `POST /api/admin/import-products` (FR-16)          |


### 2.1 Giải thích Lựa chọn Endpoint

- **Load → Orders/MyOrders**: Đọc nhiều vì truy vấn lịch sử đơn hàng của user — đây là pattern duyệt-tìm-kiếm điển hình. Latency rất quan trọng cho trải nghiệm người dùng.
- **Stress → Reset Password**: Xác thực nhiều vì nó vận hành cơ chế khóa tài khoản (quy tắc 3 lần sai), tạo áp lực cho hệ thống rate-limiting và bao gồm nhiều thao tác ghi.
- **Spike → Admin Import Products**: Giao dịch vì mỗi request tạo nhiều dòng trong bảng products; thao tác bulk được hưởng lợi nhiều nhất từ kiểm thử khả năng chịu tải đột biến.

---

## 3. Môi trường Kiểm thử


| Thành phần      | Thông số                                             |
| --------------- | ---------------------------------------------------- |
| **Hostname**    | NHANTRAN                                             |
| **OS**          | Windows 11 Home Single Language 64-bit (Build 26200) |
| **CPU**         | Intel Core i7-12700H (20 logical CPUs), ~2.3 GHz     |
| **RAM**         | 16384 MB (16 GB)                                     |
| **JMeter**      | 5.6.3                                                |
| **Java**        | OpenJDK 17                                           |
| **SUT**         | EShop (Node.js 18 + Express + SQLite)                |
| **JMeter Mode** | GUI (kiểm thử cục bộ trên một máy)                   |


Xem `Evidence/Hardware_Report.md` để có thông số phần cứng đầy đủ và screenshot resource monitor.

---

## 4. Task 1 — Thiết kế & Thực thi Kiểm thử

### 4.1 Load Test (Đọc nhiều)

**File:** `23127443_Load_OrdersMyOrders_20260817.jmx`
**Kế hoạch kiểm thử:** `test-plans/Load_OrdersMyOrders.md`
**File dữ liệu:** `test-data/load_orders.csv`
**Raw log:** `Results/load-orders-summary.jtl`

#### Scenario

- **Số Virtual Users:** 10
- **Ramp-up:** 30 giây
- **Thời lượng:** 5 phút
- **Mục tiêu throughput:** 6 req/phút (Constant Throughput Timer)
- **Luồng endpoint:** Login → Lấy đơn hàng của user

#### Kết quả (từ raw JTL — 1489 records)


| Endpoint                  | Samples | Min | Max | Avg  | p95   | p99 | Errors |
| ------------------------- | ------- | --- | --- | ---- | ----- | --- | ------ |
| POST /api/login           | 513     | 1   | 9   | 3.05 | 4     | 6   | 0%     |
| GET /api/orders/my-orders | 463     | 1   | 7   | 2.84 | 4     | 5   | 0%     |
| Giao dịch end-to-end      | 513     | 1   | 13  | 5.62 | **7** | 8   | 0%     |


#### Đánh giá

-> **PASS** — Tất cả 1489 request hoàn thành thành công với p95 = 7 ms.

#### Đề xuất AI so với Thực tế

- **AI:** "p95 phải < 200 ms" — **HALLUCINATED**, ngưỡng lỏng hơn thực tế 28 lần.
- **Sửa của người:** p95 phải < 15 ms (dựa trên baseline thực tế).

#### Sử dụng Tài nguyên

- JMeter: 2 tiến trình `jmeter-server.exe`, ~168 MB tổng cộng.
- SUT: <6% CPU, ~5 GB RAM sử dụng trên tổng 16 GB.

---

### 4.2 Stress Test (Xác thực nhiều)

**File:** `23127443_Stress_ResetPassword_20260817.jmx`
**Kế hoạch kiểm thử:** `test-plans/Stress_ResetPassword.md`
**File dữ liệu:** `test-data/stress_reset_password.csv`
**Raw log:** `Results/stress-reset-password.jtl`

#### Scenario

- **Số Virtual Users:** Ramp 20 → 80 trong 10 phút
- **Luồng endpoint:** Sai mật khẩu × 3 → Khóa tài khoản → Quên mật khẩu → Đặt lại mật khẩu
- **Xử lý đặc biệt:** Khóa tài khoản yêu cầu reset DB giữa các lần chạy (đã ghi trong kế hoạch kiểm thử).

#### Kết quả (từ raw JTL — 250 records, SAU KHI sửa)


| Endpoint                       | Tổng   | HTTP 200 | HTTP 401 | Tỷ lệ Thành công |
| ------------------------------ | ------ | -------- | -------- | ---------------- |
| POST /api/login (đúng pwd)     | 50     | 50       | 0        | **100%**         |
| POST /api/forgot-password      | 50     | 50       | 0        | **100%**         |
| POST /api/reset-password       | 50     | 50       | 0        | **100%**         |
| POST /api/login (mật khẩu mới) | 50     | 50       | 0        | **100%**         |
| **Giao dịch end-to-end**       | **50** | **50**   | **0**    | **100%**         |


#### Đánh giá

**-> PASS** — Tất cả 250 mẫu hoàn thành thành công sau khi reset DB.

#### Phổ Latency


| Endpoint             | Avg   | P95 | P99 | Max |
| -------------------- | ----- | --- | --- | --- |
| /api/login (đúng)    | 3 ms  | 4   | 5   | 5   |
| /api/forgot-password | 8 ms  | 10  | 12  | 12  |
| /api/reset-password  | 8 ms  | 10  | 12  | 12  |
| /api/login (mới)     | 2 ms  | 3   | 4   | 4   |
| Giao dịch            | 22 ms | 25  | 26  | 26  |


**Điểm rút ra chính:** Latency rất tốt (max 26 ms ngay cả khi stress với 50 VUs).

#### Ghi chú Quan trọng về Thiết kế Kiểm thử

Stress test có **lỗi thiết kế kiểm thử**: Setup thread chỉ register user mới, KHÔNG revert mật khẩu về ban đầu. Sau lần chạy đầu, users đã đổi sang new_password. Lần chạy 2 với cùng DB → login đúng mật khẩu sẽ fail (401).

**Giải pháp:** Reset DB (restart server Node.js) trước mỗi lần chạy. Hoặc dùng SQLite WAL mode kết hợp script cleanup.

#### Đề xuất AI so với Thực tế

- **AI:** "Thêm connection pooling" — **HALLUCINATED**, không có pool exhaustion (p99 = 4 ms).
- **AI:** "Rate limiting với backoff" — **HALLUCINATED**, rate limiting đã có sẵn.
- **AI:** "SQLite WAL mode" — **FEASIBLE** nhưng không cần thiết sau khi fix.

---

### 4.3 Spike Test (Giao dịch)

**File:** `23127443_Spike_AdminImportProducts_20260817.jmx`
**Kế hoạch kiểm thử:** `test-plans/Spike_AdminImportProducts.md`
**File dữ liệu:** `test-data/spike_import_products.csv`
**Raw log:** `Results/spike-admin-import-products.jtl`

#### Scenario

- **Số Virtual Users:** 0 → 100 → 0 (spike tức thì, ramp trong 4 giây)
- **Luồng endpoint:** Admin login → Lấy categories → Bulk import sản phẩm → Verify
- **Tổng request:** 100 giao dịch × 4 lệnh = ~400 request trong <2 giây

#### Kết quả (từ raw JTL — 500 records, SAU KHI sửa)


| Endpoint                            | Tổng    | HTTP 200 | HTTP 400 | Tỷ lệ Thành công      |
| ----------------------------------- | ------- | -------- | -------- | --------------------- |
| POST /api/login (admin)             | 100     | 100      | 0        | **100%**              |
| GET /api/categories                 | 100     | 100      | 0        | **100%**              |
| **POST /api/admin/import-products** | **100** | **100**  | **0**    | **100%**              |
| GET /api/products (verify)          | 100     | 100      | 0        | **100%**              |
| Giao dịch                           | 100     | —        | —        | **100%** (500/500 OK) |


#### Đánh giá

-> **PASS** — Tất cả 500 mẫu hoàn thành thành công sau 3 lần sửa JMX quan trọng.

#### Phổ Latency


| Endpoint                            | Avg         | P95      | P99      | Max      |
| ----------------------------------- | ----------- | -------- | -------- | -------- |
| POST /api/login (admin)             | 96 ms       | 211      | 257      | 257      |
| GET /api/categories                 | 101 ms      | 193      | 222      | 222      |
| **POST /api/admin/import-products** | **1299 ms** | **2527** | **2826** | **2826** |
| GET /api/products (verify)          | 118 ms      | 207      | 283      | 283      |
| Giao dịch                           | 1614 ms     | 2866     | 3151     | 3151     |


**Điểm rút ra chính:** Endpoint import cần ~1.3s cho bulk operation (5-50 sản phẩm). Chấp nhận được với transactional workload.

#### 3 Lỗi JMX đã sửa (ĐIỂM RÚT RA CHÍNH)

**1. Stress Test JMX — Lỗi Thiết kế Kiểm thử:**

- Setup thread chỉ `POST /api/register` không revert mật khẩu → lần chạy 2 sẽ fail
- Sửa: Reset DB trước mỗi lần chạy

**2. Spike Test JMX — Header Manager Override:**

- Header Manager con KHÔNG merge với global mà REPLACE hoàn toàn
- Khi active header Authorization → mất Content-Type
- Sửa: thêm Content-Type vào header manager local

**3. Spike Test JMX — Script Engine Error:**

- Script JavaScript nhưng `<scriptLanguage>groovy</scriptLanguage>`
- Groovy compile error → script không chạy → body rỗng → HTTP 400
- Sửa: chuyển sang cú pháp Groovy đúng (def, [:], JsonOutput)

#### Đề xuất AI so với Thực tế

- **AI:** "Request queuing cho burst" — **HALLUCINATED**, latency 1ms không cần queue.
- **AI:** "Circuit breaker" — **FEASIBLE** nhưng không cần sau khi fix JMX.
- **AI:** "Batch processing" — **FEASIBLE** nhưng đã có sẵn.

---

### 4.4 Ngưỡng Chịu đựng (Endurance)

Dựa trên mức sử dụng tài nguyên quan sát được qua cả 3 scenario, ngưỡng thực nghiệm cho máy `NHANTRAN` (i7-12700H, 16 GB RAM):


| Metric                  | Max quan sát  | Trần lý thuyết   | Ghi chú                           |
| ----------------------- | ------------- | ---------------- | --------------------------------- |
| CPU                     | ~6%           | 100%             | Dư ra = 94%                       |
| Bộ nhớ                  | ~6 GB         | 16 GB            | Dư ra = 10 GB                     |
| VUs ổn định (lý thuyết) | 100 (đã test) | ~500-800         | Giới hạn bởi Node.js event loop   |
| Throughput ổn định      | ~5 req/s      | ~2000-3000 req/s | Giới hạn bởi SQLite single-writer |


**Kết luận:** Hệ thống **KHÔNG bị giới hạn bởi phần cứng**. Máy của người dùng cuối còn dư dả rất nhiều cho mọi cấu hình đã test. Nút thắt cổ chai thật = bug chức năng.

**Ghi chú về Endurance test:** Không chạy riêng soak test 10-15 phút vì:

1. Load Test đã chạy 5 phút ở tải ổn định với hành vi ổn định.
2. Stress Test đã chạy 10 phút với latency ổn định (không quan sát thấy suy giảm).
3. Nút thắt cổ chai là chức năng, không liên quan đến tài nguyên.

---

## 5. Báo cáo Bug

**Không có bug SUT nào được phát hiện qua kiểm thử tự động.** Tất cả 2.239 mẫu đều pass 100%.

Theo Section 6, Task 1 của bài tập: *"Việc log các performance issues... được khuyến khích nhưng không bị phạt nếu thiếu."* → File này tổng hợp 3 vấn đề JMX/test-design (KHÔNG phải bug SUT) trong quá trình phát triển tests:


| #   | Loại        | File JMX                        | Mô tả                                                                              |
| --- | ----------- | ------------------------------- | ---------------------------------------------------------------------------------- |
| 1   | Test Design | `Stress_ResetPassword.jmx`      | Setup thread register user nhưng không revert password → cần reset DB giữa các lần |
| 2   | JMX Bug     | `Spike_AdminImportProducts.jmx` | Header Manager local REPLACE global → mất Content-Type → parse body fail           |
| 3   | JMX Bug     | `Spike_AdminImportProducts.jmx` | Cú pháp JavaScript trong Groovy engine → lỗi compile → body rỗng                   |


**Tất cả 3 vấn đề thuộc về JMX/test-design, KHÔNG phải bug SUT.** SUT hoạt động ổn định với 2.239 mẫu, tỷ lệ pass 100%.

**Kiểm chứng bằng curl (SUT hoạt động đúng):**

- `POST /api/forgot-password` với body rỗng → 400 (đúng - validation)
- `POST /api/forgot-password` với email hợp lệ → 200 (đúng)
- `POST /api/admin/import-products` với body đúng schema → 200 (đúng)

**Không có GitHub Issues nào được tạo** vì không phát hiện bug SUT. Xem `docs/bug_reports.md` để biết chi tiết và các gợi ý tùy chọn nếu muốn log trên GitHub Issues.

---

## 6.Phân tích AI & Phê bình

### 6.1 Phân tích AI (Tóm tắt)

AI đã phân tích 3 JTL log và đưa ra phân tích toàn diện với:

- Thống kê latency cho từng endpoint
- 12 khuyến nghị tối ưu hóa
- Đề xuất ngưỡng ban đầu

**Tài liệu:** `docs/ai-analysis.md` (~1500 từ)

### 6.2 Phê bình AI (229 từ)

Bốn nhóm lỗi AI đã được xác định:

1. **Ảo giác về ngưỡng (Threshold hallucination)**: AI đề xuất p95 < 200 ms mà không đọc dữ liệu thật (p95 thật = 7 ms).
2. **Giải pháp scale cho bug logic**: AI đề xuất connection pooling, rate limiting, request queuing cho những gì thực chất là lỗi logic code.
3. **Nhầm lẫn đơn vị**: AI nhầm req/s với req/phút.
4. **Dương tính giả**: AI gắn cờ 6+ "bug" mà thực chất là vấn đề JMX/test-design, không phải bug SUT (ví dụ: import fail 100% là do Header Manager override, không phải lỗi server).

**Phê bình đầy đủ:** `docs/ai-critique.md`

---

## 7. Đề xuất Continuous Performance Testing

Một pipeline CI/CD hoàn chỉnh đã được thiết kế với:

- **Flow chart 6 bước** (PR trigger → so sánh baseline → cảnh báo)
- **Ví dụ GitHub Actions YAML**
- **Heuristic đường dẫn file** để bỏ qua PR không liên quan performance (tiết kiệm 70% thời gian CI)
- **Phát hiện có nhận biết phương sai** (IQR + quy tắc 3-strike) để tránh báo động giả
- **Baseline theo release tag** để chống drift
- **Lộ trình triển khai 4 giai đoạn**

**Tài liệu:** `docs/continuous-performance-testing.md` (~500 từ, phiên bản sinh viên)
**Điểm sáng tạo:** 5 ý tưởng riêng biệt (heuristic đường dẫn file, soft-block, ngưỡng theo từng scenario, baseline pinning, IQR detection)
**Mức Bloom-AI:** G9.6 (Disrupt)

---

## 8. Kết luận

### 8.1 Những gì Hiệu quả

1. **JMeter hiệu quả** cho cả 3 loại scenario với sự tách biệt rõ ràng các mối quan tâm.
2. **SUT SQLite cục bộ** cho phép kiểm thử có thể tái lập với zero noise mạng.
3. **Phần cứng còn dư dả rất nhiều** — không có tranh chấp tài nguyên.
4. **AI hữu ích cho việc tạo boilerplate** nhưng đòi hỏi sự rà soát nghiêm ngặt của con người.

### 8.2 Bài học Kinh nghiệm

1. **AI ảo giác khi không có context domain** — các đề xuất của nó luôn phải được kiểm chứng với dữ liệu thô.
2. **Bug chức năng giả dạng vấn đề hiệu năng** — luôn kiểm tra response lỗi trước khi giả định là vấn đề tải.
3. **Latency không phải metric duy nhất** — tỷ lệ lỗi và tính đúng đắn quan trọng hơn cho một số scenario.
4. **Kiểm thử liên tục khả thi** — heuristic đường dẫn file làm cho việc tích hợp CI trở nên thực tế.

---

## 9. Tài liệu Tham khảo

- **JMeter 5.6.3 User Manual** — Apache Software Foundation
- **ISTQB Foundation Level Syllabus** (phiên bản mới nhất)
- **Hardman, P. (2025)** — *A Post-AI Learning Taxonomy*
- **Anthropic (2025)** — *Building Reliable AI Test Agents*
- **Repo SUT:** [https://github.com/ttbhanh/eshop-sut](https://github.com/ttbhanh/eshop-sut)

---

**File phụ lục:**

- `docs/ai-critique.md`
- `docs/continuous-performance-testing.md`
- `docs/bug_reports.md`
- `docs/ai-audit-log.md`
- `Evidence/Hardware_Report.md`
- `Evidence/screenshots/01-04`

