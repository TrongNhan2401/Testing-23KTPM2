# Performance Issues Summary — EShop SUT

**MSSV:** 23127443  |  **Ngày:** 2026-08-18  |  **Project:** HW05 Performance Testing

---

## Tóm tắt

Theo yêu cầu Section 6, Task 1 của assignment:

> *"Log bất kỳ bugs hoặc performance issues thực sự nào (error responses, crashes, functional regressions) trên GitHub Issues page với screenshots. Việc log các performance issues như latency cao hoặc error rate tăng được khuyến khích nhưng không bị phạt nếu thiếu."*

**Kết quả: KHÔNG CÓ bugs hoặc performance issues được phát hiện qua automated testing.**

Do đó, file này **không chứa bug reports** (vì không có bug nào thực sự được xác minh qua JTL files). Nếu muốn log GitHub Issues, xem phần "Khuyến nghị" bên dưới.

---

## 1. Phân tích dữ liệu JTL thực tế

### 1.1 Thống kê tổng quan


| Test     | File JTL                          | Samples   | Pass Rate | HTTP 4xx/5xx | Failed |
| -------- | --------------------------------- | --------- | --------- | ------------ | ------ |
| Load     | `load-orders-summary.jtl`         | 589       | 100%      | 0            | 0      |
| Stress   | `stress-reset-password.jtl`       | 250       | 100%      | 0            | 0      |
| Spike    | `spike-admin-import-products.jtl` | 500       | 100%      | 0            | 0      |
| **Tổng** | —                                 | **1,339** | **100%**  | **0**        | **0**  |


**Verify command:**

```bash
cd HW05/Results
for f in *.jtl; do echo "=== $f ==="; wc -l "$f"; done
```

### 1.2 Phân tích theo endpoint


| Endpoint                           | Count | Avg (ms) | Max (ms) | Success |
| ---------------------------------- | ----- | -------- | -------- | ------- |
| POST /api/login (Load)             | 213   | 3        | 5        | 100%    |
| GET /api/orders/my-orders          | 163   | 3        | 5        | 100%    |
| POST /api/login (correct - Stress) | 50    | 3        | 5        | 100%    |
| POST /api/forgot-password          | 50    | 8        | 12       | 100%    |
| POST /api/reset-password           | 50    | 8        | 12       | 100%    |
| POST /api/login (new - Stress)     | 50    | 2        | 4        | 100%    |
| POST /api/login (admin - Spike)    | 100   | 96       | 257      | 100%    |
| GET /api/categories                | 100   | 101      | 222      | 100%    |
| POST /api/admin/import-products    | 100   | 1,299    | 2,826    | 100%    |
| GET /api/products (verify)         | 100   | 118      | 283      | 100%    |


**Quan sát:**

- Tất cả endpoints trả HTTP 200 (không có 4xx/5xx nào)
- Latency thấp (p95 < 30ms cho hầu hết endpoints)
- Import endpoint cần ~1.3s cho 5-50 products (chấp nhận được với bulk operation)

---

## 2. Vấn đề gặp phải TRONG QUÁ TRÌNH TESTING (không phải bug SUT)

Mặc dù kết quả cuối cùng pass 100%, trong quá trình phát triển và chạy tests đã gặp **3 vấn đề JMX/test-design** (KHÔNG phải bug SUT).

### 2.1 Stress Test JMX — Test Design Flaw

**File:** `23127443_Stress_ResetPassword_20260817.jmx`
**Loại:** 🟡 Test Design (không phải bug SUT)
**Mức độ:** Trung bình

**Vấn đề:**
Setup Thread Group chỉ thực hiện `POST /api/register` để tạo user mới, nhưng KHÔNG revert password về password ban đầu sau khi test chạy. Điều này dẫn đến:

- Lần chạy đầu tiên: Users được tạo với password ban đầu → Test pass
- Lần chạy thứ 2: Setup register fail (409 Conflict - user đã tồn tại), nhưng user vẫn giữ password từ lần reset trước → `login correct password` fail 100%

**B�ng chứng:**

Lần đầu chạy (khi chưa phát hiện vấn đề):

```
POST /api/login (correct password): 0/50 OK (HTTP 401)
→ User không còn dùng password ban đầu
```

Lần chạy sau khi reset DB:

```
POST /api/login (correct password): 50/50 OK (HTTP 200)
```

**Cách khắc phục:**

1. Reset DB (restart server Node.js + xóa file SQLite) trước mỗi lần chạy test
2. Hoặc thêm 2 requests vào Setup thread: `forgot-password` → `reset-password` để revert về password ban đầu

**Trạng thái:** ✅ Đã fix bằng cách reset DB trước khi chạy. JTL cho thấy 250/250 pass.

---

### 2.2 Spike Test JMX — Header Manager Override

**File:** `23127443_Spike_AdminImportProducts_20260817.jmx`
**Loại:** 🔴 JMX Bug (không phải bug SUT)
**Mức độ:** Nghiêm trọng

**Vấn đề:**
Header Manager ở level con (trong Transaction Controller) **REPLACE** chứ không merge với Header Manager global. Khi active header `Authorization`, header `Content-Type: application/json` bị mất.

**Bằng chứng từ log JMeter (lúc chưa fix):**

```
Server response: 400 Bad Request
Body: {"error":"Không có dữ liệu để import"}
```

**Verify bằng curl thủ công (SUT hoạt động đúng):**

```bash
# Test với body rỗng → Server trả 400 (đúng validation)
curl -X POST http://localhost:3000/api/admin/import-products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN"
# → 400 "Không có dữ liệu để import"

# Test với body đúng → Server trả 200
curl -X POST http://localhost:3000/api/admin/import-products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"products":[{"name":"Test","price":1000,"description":"x","imageUrl":"","category_id":1}]}'
# → 200 "Import hoàn tất: 1/1 sản phẩm được thêm"
```

**Kết luận:** SUT KHÔNG có bug. Body gửi đi bị rỗng do thiếu Content-Type header → server từ chối.

**Cách khắc phục:**
Thêm Content-Type vào Header Manager local:

```xml
<HeaderManager testname="HTTP Header - Auth Token">
  <header name="Authorization" value="Bearer ${admin_token}"/>
  <header name="Content-Type" value="application/json"/>
</HeaderManager>
```

**Trạng thái:** ✅ Đã fix. JTL cho thấy 100/100 import requests pass.

---

### 2.3 Spike Test JMX — Script Engine Error

**File:** `23127443_Spike_AdminImportProducts_20260817.jmx`
**Loại:** 🔴 JMX Bug (không phải bug SUT)
**Mức độ:** Nghiêm trọng

**Vấn đề:**
Script trong PreProcessor dùng JavaScript syntax (`var`, `parseInt`, `JSON.stringify`), nhưng `<scriptLanguage>` lại là `groovy`. Groovy compiler không hiểu JavaScript syntax → script không compile được → body không được generate → server nhận body rỗng → fail.

**B�ng chứng từ log JMeter:**

```
Script2.groovy: 8: Unexpected input: '{\n    products.push({\n        "name":'
javax.script.ScriptException: org.codehaus.groovy.control.MultipleCompilationErrorsException
```

**Cách khắc phục:**
Convert sang Groovy syntax đúng:

```groovy
import groovy.json.JsonOutput
def count = (vars.get("product_count") ?: "5") as int
def products = []
for (def i = 1; i <= count; i++) {
    products.push([
        "name": "${prefix}_${i}_${System.currentTimeMillis()}",
        ...
    ])
}
vars.put("products_json", JsonOutput.toJson(["products": products]))
```

**Trạng thái:** ✅ Đã fix. JTL cho thấy body được gửi đúng schema.

---

## 3. Tại sao KHÔNG có bug reports trên GitHub Issues

Theo Section 14, file nộp cần "Bug report, với screenshots của bất k� issues nào trên GitHub Issues page (nếu có)".

**Lý do không có GitHub Issues:**

1. Không có bug SUT nào được phát hiện qua automated testing (1,339 samples, 100% pass)
2. Các vấn đề gặp phải đều thuộc về JMX/test-design (đã fix, không phải SUT bugs)
3. Không có error responses, crashes, hay functional regressions

**Section 6, Task 1 cũng ghi rõ:**

> *"Việc log các performance issues như latency cao hoặc error rate tăng được khuyến khích nhưng không bị phạt nếu thiếu."*

→ Không log GitHub Issues là hoàn toàn hợp lệ và không bị phạt.

---

## 4. Khuyến nghị (optional)

Mặc dù không có bug blocking nào, một số điểm có thể log trên GitHub Issues nếu muốn:

### 4.1 Bulk import optimization (suggestion, not bug)

**Title:** `[Suggestion] Bulk import endpoint optimization for >1000 products`

**Body:**

```
**Current behavior:**
POST /api/admin/import-products takes ~1.3s for 5-50 products.

**Observed metrics (from Spike Test JTL):**
- 100 samples
- Avg: 1299 ms
- p95: 2527 ms
- Max: 2826 ms

**Suggestion:**
For larger batches (>1000 products), consider:
- Async worker with job queue (Bull, Bee-Queue)
- Streaming response
- Database bulk insert

**Evidence:**
- File: spike-admin-import-products.jtl
- Screenshot: [attached]

**Hardware:** Not the bottleneck (CPU ~6%, RAM ~6GB/16GB)
```

**Priority:** Low (enhancement, not bug)

### 4.2 SQLite migration (suggestion, not bug)

**Title:** `[Suggestion] Migrate from SQLite to PostgreSQL for concurrent writes`

**Body:**

```
**Current behavior:**
SQLite single-writer model may limit concurrent writes.

**Observed:**
- All tests pass 100% (1,339 samples)
- No lock contention observed at current load (100 VUs)

**Suggestion:**
For production, consider PostgreSQL to support true concurrent writes.

**Note:** Not a bug - current SUT works fine for the tested load.
```

**Priority:** Low (architectural, not bug)

### 4.3 Add production monitoring (suggestion, not bug)

**Title:** `[Suggestion] Add APM tool for production visibility`

**Body:**

```
**Current state:**
No monitoring in SUT.

**Suggestion:**
- New Relic / Datadog / Prometheus + Grafana
- Track p95, error rate, throughput in production

**Why:**
Performance testing only validates pre-production. Production needs continuous monitoring.
```

**Priority:** Low (DevOps, not bug)

---

## 5. Bài học rút ra

### 5.1 Về JMeter

1. **Header Manager local REPLACE global** (không merge) → Phải copy tất cả headers cần thiết vào local header manager
2. **BSFPreProcessor deprecated** → Dùng JSR223PreProcessor với Groovy
3. **Groovy ≠ JavaScript syntax** → Dùng đúng syntax cho mỗi engine

### 5.2 Về Test Design

1. **Setup thread phải idempotent** → Phải revert state sau khi test chạy, hoặc document rõ rằng cần reset
2. **Test data isolation** → Mỗi test run cần clean state
3. **Verify SUT trước khi kết luận bug** → Manual curl test rất quan trọng

### 5.3 Về Bug Reports

1. **Không tự tạo bug nếu không có bằng chứng** → Section 6 cho phép "không bị phạt nếu thiếu"
2. **Phân biệt rõ JMX bug vs SUT bug** → Tránh blame SUT khi vấn đề ở test plan
3. **Verify bằng cách gọi API trực tiếp** trước khi kết luận "SUT bug"

---

## Phụ lục: Tham khảo

### JTL files (1,339 records, 100% pass)

- `Results/load-orders-summary.jtl` (589 records)
- `Results/stress-reset-password.jtl` (250 records)
- `Results/spike-admin-import-products.jtl` (500 records)

### JMX files

- `23127443_Load_OrdersMyOrders_20260817.jmx`
- `23127443_Stress_ResetPassword_20260817.jmx`
- `23127443_Spike_AdminImportProducts_20260817.jmx`

### AI Audit Log

- `docs/ai-audit-log.md` (toàn bộ quá trình tương tác với AI)

### SUT Repository

- [https://github.com/ttbhanh/eshop-sut](https://github.com/ttbhanh/eshop-sut) (chưa có Issues vì không có bug được phát hiện)

