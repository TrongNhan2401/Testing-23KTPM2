---
name: jmeter-performance-testing
description: Tạo test plan JMeter 5.x (Load/Stress/Spike) cho REST API. Workflow từng bước: user chọn loại test → cung cấp endpoint + context → nhận JMX + CSV tương ứng. Dùng khi user nói về JMeter, test hiệu năng, load test, stress test, spike test, file .jmx, .csv data, hoặc muốn benchmark API endpoint.
disable-model-invocation: true
---

# JMeter Performance Testing — Vietnamese Workflow

Tạo file JMX + CSV cho REST API theo từng phần. **KHÔNG tạo hết 3 kịch bản cùng lúc** — hỏi user chọn trước, rồi mới gen.

## Khi nào dùng skill này

- User muốn performance-test REST API bằng JMeter
- User nhắc tới Load/Stress/Spike testing
- User hỏi cách tạo `.jmx` test plan, `.csv` data file
- User muốn đo throughput, latency, error rate của HTTP endpoint

## Workflow tổng quan (BẮT BUỘC theo thứ tự)

```
Task Progress:
- [ ] Bước 1: Hỏi user chọn loại test (Load / Stress / Spike)
- [ ] Bước 2: Hỏi thông tin endpoint + context
- [ ] Bước 3: Xác nhận phương án + tham số
- [ ] Bước 4: Sinh file CSV
- [ ] Bước 5: Sinh file JMX
- [ ] Bước 6: Verify + chạy thử
- [ ] Bước 7: Phân tích kết quả
```

---

## Bước 1: Hỏi user chọn loại test

**Dùng AskQuestion tool** với 3 lựa chọn (KHÔNG tự quyết):

| Loại | Mục đích | Đặc điểm |
|------|----------|-----------|
| **Load Test** | Đo throughput & latency ở mức tải bình thường | Hằng định, kéo dài, không phá hệ thống |
| **Stress Test** | Tìm điểm gãy, test rate-limiting, auth flow | Tăng dần tải, đẩy tới giới hạn |
| **Spike Test** | Test đột biến tải đột ngột | Tăng/giảm VU cực nhanh, test resilience |

Ví dụ câu hỏi:

> *"Bạn muốn tạo test plan cho loại nào?"*
> - Load Test (đo hiệu năng ở tải bình thường)
> - Stress Test (đẩy tới giới hạn)
> - Spike Test (test đột biến tải)

**Nếu user không rõ → hỏi thêm:** API nào? Mục tiêu chính là gì (đo pass rate, tìm bug, hay chứng minh SUT chịu được tải)?

---

## Bước 2: Thu thập thông tin endpoint + context

Sau khi user chọn loại test, hỏi **từng phần** (không hỏi dump một lần):

### 2.1 Thông tin endpoint

| Câu hỏi | Ví dụ |
|---------|-------|
| Base URL của SUT | `http://localhost:3000` |
| Endpoint(s) cần test | `POST /api/login`, `GET /api/orders/my-orders` |
| Method (GET/POST/...) | `POST` |
| Cần authentication không? | Có (JWT token) / Không |
| Request body schema | `{ "username": "...", "password": "..." }` |
| Response thành công | `200 { token: "..." }` |

### 2.2 Thông tin data

| Câu hỏi | Ví dụ |
|---------|-------|
| Có dữ liệu mẫu sẵn không? | CSV có sẵn / Chưa có (cần gen) |
| Trường dữ liệu cần thiết | `username, password` |
| Bao nhiêu row? | Thường = `2x số thread` |
| Format đặc biệt? | Email hợp lệ, password >= 8 ký tự có ký tự đặc biệt |

### 2.3 Tham số test (đề xuất theo loại)

| Loại | Threads mặc định | Ramp-up | Thời lượng | Throughput Timer |
|------|-------------------|---------|------------|------------------|
| **Load** | 10-30 | 30-60s | 5 phút | 60-300 req/min |
| **Stress** | 50-100 (tăng dần) | 60-120s | 10 phút | 200-500 req/min |
| **Spike** | 100-200 (đột biến) | 0-5s | 1-2 phút | Không (raw capacity) |

**Hỏi user:** dùng tham số mặc định hay muốn customize? Nếu SUT nhỏ thì giảm threads.

---

## Bước 3: Xác nhận phương án

Tóm tắt lại và xin user xác nhận **trước khi sinh file**:

```
Test plan: Load Test cho GET /api/orders/my-orders
- Threads: 20 VU
- Ramp-up: 30s
- Duration: 5 phút
- Throughput: 120 req/min
- CSV: test-data/load_orders.csv (40 dòng)
- JMX: 23127443_Load_OrdersMyOrders_20260818.jmx
- Endpoint: cần JWT token từ POST /api/login
```

User confirm → mới đi tiếp Bước 4-7.

---

## Bước 4: Sinh file CSV

Tạo `test-data/[tên-phù-hợp].csv` với số dòng >= `2x threads`.

**Cột quan trọng cần có:**

| Cột | Mục đích | Ví dụ |
|-----|----------|-------|
| `username` / `email` | User identifier duy nhất | `user001@test.com` |
| `password` | Mật khẩu đăng nhập | `Test@123` |
| `name` | Tên hiển thị (nếu cần) | `Test User 1` |

**Rule kiểm tra:**
- ✅ Có dòng header
- ✅ Không trùng username/email
- ✅ Password đáp ứng yêu cầu SUT (ký tự đặc biệt, độ dài)
- ✅ Số dòng data ≥ `2 × threads`

**Ví dụ CSV cho Load Test (20 VU → 40 dòng):**

```csv
username,password,name
user001@test.com,Test@123,User 001
user002@test.com,Test@123,User 002
...
user040@test.com,Test@123,User 040
```

---

## Bước 5: Sinh file JMX

Mỗi JMX là file XML với cấu trúc cụ thể. Build theo template dưới.

### Cấu trúc top-level

```xml
<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="..." jmeter="5.6.3">
  <hashTree>
    <TestPlan testname="[Loai]_[Endpoint]_YYYYMMDD">
      <stringProp name="TestPlan.comments">...</stringProp>
    </TestPlan>
    <hashTree/>
  </hashTree>
</jmeterTestPlan>
```

### Thành phần bắt buộc (theo thứ tự)

1. **Test Plan** (root)
2. **HTTP Header Manager** (đặt ở Test Plan level)
   - `Content-Type: application/json`
   - `Accept: application/json`
3. **Setup Thread Group** (tùy chọn — dùng khi cần seed data, đăng ký user)
4. **Main Thread Group** (ThreadGroup hoặc ConcurrencyThreadGroup)
   - `N threads, M giây ramp-up, K giây duration`
   - **Load/Stress**: dùng Constant Throughput Timer
   - **Spike**: không cần throughput timer (để raw capacity)
5. **CSV Data Set Config** (trong mỗi Thread Group)
   - Filename: `test-data/[tên].csv`
   - Variable Names: tên cột CSV
   - Recycle on EOF: `true`
   - Stop thread on EOF: `false`
   - Sharing mode: `All threads`
6. **HTTP Samplers** (HTTPSamplerProxy) — một cái cho mỗi API call
7. **Transaction Controller** (nếu flow có nhiều bước)
8. **Listeners**
   - **Summary Report** — KPI tổng quan
   - **View Results Tree** — debug (chỉ log first failure)
   - **Aggregate Report** — p95/p99

### Lỗi JMX phổ biến (PHẢI tránh)

| Lỗi | Triệu chứng | Cách fix |
|-----|------------|----------|
| Header Manager local set REPLACE global | Missing Content-Type → 400 errors | Set Header ở Test Plan level, local set ADD |
| JSR223 PreProcessor dùng JavaScript syntax trong Groovy engine | Empty body → 400 errors | Dùng Groovy: `vars.put("key", value)` |
| Throughput Timer đặt trên từng sampler | Cumulative throttling phá plan | Đặt ở Thread Group hoặc Transaction Controller |
| CSV sharing mode = "Current thread" | Mỗi iteration dùng lại row cũ | Set "All threads" |
| Thiếu Authorization header cho protected endpoint | 401 errors | Thêm HTTP Header Manager dưới login sampler |

### Tham số mặc định theo loại test

**Load Test:**
```xml
<ThreadGroup>
  <stringProp name="ThreadGroup.num_threads">20</stringProp>
  <stringProp name="ThreadGroup.ramp_time">30</stringProp>
  <stringProp name="ThreadGroup.duration">300</stringProp> <!-- 5 phút -->
</ThreadGroup>
<ConstantThroughputTimer>
  <stringProp name="throughput">120.0</stringProp> <!-- 120 req/min -->
</ConstantThroughputTimer>
```

**Stress Test:**
```xml
<ThreadGroup>
  <stringProp name="ThreadGroup.num_threads">50</stringProp>
  <stringProp name="ThreadGroup.ramp_time">120</stringProp>
  <stringProp name="ThreadGroup.duration">600</stringProp> <!-- 10 phút -->
</ThreadGroup>
<ConstantThroughputTimer>
  <stringProp name="throughput">300.0</stringProp> <!-- 300 req/min -->
</ConstantThroughputTimer>
```

**Spike Test:**
```xml
<!-- Dùng ConcurrencyThreadGroup để tăng/giảm đột biến -->
<com.blazemeter.jmeter.threads.concurrency.ConcurrencyThreadGroup>
  <stringProp name="TargetLevel">200</stringProp> <!-- nhảy từ 0 lên 200 -->
  <stringProp name="RampUp">5</stringProp> <!-- ramp 5 giây -->
  <stringProp name="Steps">3</stringProp> <!-- trong 3 bước -->
  <stringProp name="Hold">60</stringProp> <!-- giữ 60 giây -->
</com.blazemeter.jmeter.threads.concurrency.ConcurrencyThreadGroup>
<!-- KHÔNG có Constant Throughput Timer -->
```

---

## Bước 6: Verify + chạy thử

### Pre-flight check

```bash
# SUT còn sống không
curl -s http://localhost:3000/api/health || echo "SUT DOWN"

# File CSV có đủ dòng không
ROWS=$(($(wc -l < test-data/file.csv) - 1))
THREADS=20
if [ $ROWS -lt $((THREADS * 2)) ]; then echo "CẢNH BÁO: CSV chỉ có $ROWS dòng"; fi

# Validate JMX XML
xmllint --noout file.jmx && echo "OK" || echo "INVALID XML"
```

### Lệnh chạy (CLI mode)

```bash
mkdir -p Results
"<JMETER_HOME>/bin/jmeter" -n -t file.jmx -l Results/file.jtl \
  -Jjmeter.save.saveservice.output_format=csv \
  -Jjmeter.save.saveservice.print_field_names=true
```

### Validate kết quả

```bash
# JTL có data không
wc -l Results/file.jtl

# Tính error rate
awk -F',' 'NR>1 {if ($8=="false") err++; total++} END {printf "Samples: %d, Errors: %d (%.1f%%)\n", total, err, (err/total*100)}' Results/file.jtl
```

---

## Bước 7: Phân tích kết quả

Tạo summary ngắn gọn:

```markdown
## Kết quả [Loại Test]

**File:** `Results/[tên].jtl`
**Trạng thái:** PASS / FAIL

| Metric | Giá trị |
|--------|---------|
| Total Samples | N |
| Pass Rate | X% |
| p95 Latency | Y ms |
| p99 Latency | Z ms |
| Throughput | W req/sec |

### Phát hiện
- [Bug nếu có, kèm mức độ]
- Hoặc "Không phát hiện bug"
```

**Phân loại đúng:**
- **SUT bug** (HTTP error, crash) → ghi vào GitHub Issues
- **JMX bug** (test plan sai) → fix và chạy lại
- **Test design issue** (data/setup) → điều chỉnh test plan

---

## Sai lầm thường gặp

1. **Đừng tự tạo 3 kịch bản khi user chỉ muốn 1** — hỏi user chọn trước
2. **Đừng dùng JavaScript syntax trong Groovy JSR223** — `vars.put()`, không phải `var x =`
3. **Đừng để nhiều thread dùng cùng row CSV** — set sharing "All threads"
4. **Đừng bỏ qua Transaction Controller** khi flow có nhiều bước
5. **Đừng đặt Throughput Timer trên từng sampler** — cumulative sẽ phá plan

## Checklist trước khi kết thúc

- [ ] User đã chọn loại test (Load/Stress/Spike)
- [ ] Thông tin endpoint + context đã thu thập đủ
- [ ] User xác nhận phương án trước khi sinh file
- [ ] CSV có đủ dòng data (≥ 2x threads)
- [ ] JMX XML valid (xmllint pass)
- [ ] JTL có data sau khi chạy
- [ ] Pass rate ≥ 95% (hoặc có giải thích)
- [ ] Phát hiện được phân loại đúng (SUT vs JMX vs design)

## Nguyên tắc vàng

> **"Một JMX tốt = một workflow rõ ràng, một CSV đủ lớn, một flow test đúng mục tiêu."**

**KHÔNG** tạo hết cả Load + Stress + Spike khi user chỉ cần 1. Hỏi trước, build đúng, đủ dùng.
