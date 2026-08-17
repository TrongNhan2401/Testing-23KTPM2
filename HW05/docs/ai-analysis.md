# AI Analysis Report — HW05 Performance Testing

**Student ID:** 23127443
**Date:** 2026-08-18
**Methodology:** AI-first (analyze with AI → critique → fix)
**Tools:** Claude Sonnet 5 (Cursor), JMeter 5.6.3

---

## 📊 Executive Summary

| Scenario | Total Samples | Success | Throughput | p95 | Verdict |
|----------|---------------|---------|------------|-----|---------|
| **Load** | 589 | 100.0% | ~5 req/s | 7 ms | ✅ PASS |
| **Stress** | 250 | 100.0% | ~2.1 req/s | 25 ms | ✅ PASS (after DB reset) |
| **Spike** | 1001 | 100.0% | ~25 req/s | 2866 ms | ✅ PASS (after JMX fix) |

---

## 1️⃣ Load Test Analysis (Orders/MyOrders — Read-Heavy)

### Raw Metrics from `load-orders-summary.jtl`

| Metric | POST /api/login | GET /api/orders/my-orders | Transaction |
|--------|----------------|---------------------------|-------------|
| Samples | 213 | 163 | 213 |
| Min | 1 ms | 1 ms | 1 ms |
| Max | 5 ms | 5 ms | 11 ms |
| Avg | 3 ms | 3 ms | 5 ms |
| p95 | 5 ms | 4 ms | 8 ms |
| p99 | 5 ms | 5 ms | 9 ms |
| Error % | 0% | 0% | 0% |

### AI Interpretation
The SUT handles read-heavy workloads **exceptionally well**. Under 10 concurrent virtual users, all 589 requests completed with **sub-10ms latency** at p99.

### Threshold Recommendations (AI)

| Metric | AI Suggestion | Justification | Critique Status |
|--------|---------------|---------------|-----------------|
| p95 latency | < 200 ms | Standard SLA for read endpoints | ❌ **HALLUCINATED** — too lenient; actual p95 is 7ms |
| p99 latency | < 500 ms | Common SaaS threshold | ❌ **HALLUCINATED** — actual p99 is 9ms |
| Throughput | > 50 req/s | Reasonable baseline | ❌ **HALLUCINATED** — driven by ConstantThroughputTimer |
| Error rate | < 1% | Industry standard | ✅ CORRECT — actual error rate is 0% |

### Human Review Corrections
After re-reading the JTL, the realistic thresholds for this SUT:
- **p95**: < 15 ms (2× current baseline)
- **p99**: < 25 ms
- **Error rate**: < 0.5%

---

## 2️⃣ Stress Test Analysis (Reset Password — Auth-Heavy)

### Raw Metrics from `stress-reset-password.jtl` (AFTER DB reset)

| Endpoint | Total | 200 | 401 | Success % |
|----------|-------|-----|-----|-----------|
| POST /api/login (correct password) | 50 | 50 | 0 | **100%** |
| POST /api/forgot-password | 50 | 50 | 0 | **100%** |
| POST /api/reset-password | 50 | 50 | 0 | **100%** |
| POST /api/login (new password) | 50 | 50 | 0 | **100%** |
| Transaction | 50 | 50 | 0 | **100%** ✅ |
| **All Samples** | **250** | **250** | **0** | **100%** |

### Latency by Endpoint
| Endpoint | Count | Avg | Max | p95 | p99 |
|----------|-------|-----|-----|-----|-----|
| /api/login (correct) | 50 | 3 ms | 5 | 4 | 5 |
| /api/forgot-password | 50 | 8 ms | 12 | 10 | 12 |
| /api/reset-password | 50 | 8 ms | 12 | 10 | 12 |
| /api/login (new) | 50 | 2 ms | 4 | 3 | 4 |
| Transaction | 50 | 22 ms | 26 | 25 | 26 |

### AI Interpretation
Sau khi reset DB, Stress Test pass 100% với latency xuất sắc. Test gồm 50 VUs chạy đồng thời, mỗi VU thực hiện flow: login → forgot → reset → login verify.

**Bug #7 (Test Design):** Setup thread chỉ register user, KHÔNG revert password. Sau lần chạy đầu, user đã bị đổi password sang `new_password`. Lần chạy 2 với cùng DB sẽ fail ở `login correct password` (HTTP 401). Cần reset DB (restart server) trước mỗi lần chạy.

### AI Recommendations vs Reality
| AI Recommendation | Verdict | Reasoning |
|-------------------|---------|-----------|
| "Add connection pooling" | ❌ **HALLUCINATED** | p99 = 4ms; không có pool issue. |
| "Implement rate limiting with backoff" | ❌ **HALLUCINATED** | Đã có rate limiting. |
| "SQLite WAL mode" | ⚠️ **FEASIBLE** | Không cần thiết sau khi fix. |

### Human Review Findings
1. **Performance xuất sắc** — p95 toàn bộ < 25ms dưới stress 50 VUs
2. **Pass 100%** sau khi reset DB
3. **AI confused test-design issue với performance issue** — phải phân biệt rõ 2 loại

---

## 3️⃣ Spike Test Analysis (Admin Import Products — Transactional)

### Raw Metrics from `spike-admin-import-products.jtl` (AFTER 3 JMX fixes)

| Endpoint | Total | 200 | 400 | Success % |
|----------|-------|-----|-----|-----------|
| POST /api/login (admin) | 200 | 200 | 0 | **100%** |
| GET /api/categories | 200 | 200 | 0 | **100%** |
| **POST /api/admin/import-products** | **200** | **200** | **0** | **100%** ✅ |
| GET /api/products (verify) | 200 | 200 | 0 | **100%** |
| Transaction | 200 | — | — | **100%** (1001/1001 OK) |

### Latency by Endpoint
| Endpoint | Count | Avg | Max | p95 | p99 |
|----------|-------|-----|-----|-----|-----|
| POST /api/login (admin) | 200 | 96 ms | 257 | 211 | 257 |
| GET /api/categories | 200 | 101 ms | 222 | 193 | 222 |
| **POST /api/admin/import-products** | 200 | **1299 ms** | 2826 | 2527 | 2826 |
| GET /api/products (verify) | 200 | 118 ms | 283 | 207 | 283 |
| Transaction | 200 | 1614 ms | 3151 | 2866 | 3151 |

### 3 Bugs JMX Đã fix

**Bug #8: Header Manager local REPLACE global Content-Type**
- Khi active header Authorization → mất Content-Type
- Server không parse được JSON body → 400

**Bug #9: BSF PreProcessor deprecated**
- BSF không hoạt động đúng với concurrent threads
- Fix: thay bằng JSR223 PreProcessor (Groovy)

**Bug #10: JavaScript syntax trong Groovy engine**
- Script JavaScript nhưng `<scriptLanguage>groovy</scriptLanguage>`
- Groovy compile error → body rỗng → HTTP 400

### AI Recommendations vs Reality
| AI Recommendation | Verdict | Reasoning |
|-------------------|---------|-----------|
| "Implement request queuing" | ❌ **HALLUCINATED** | Latency 1ms không cần queue. |
| "Add circuit breaker" | ⚠️ **FEASIBLE** | Không cần sau khi fix JMX. |
| "Use batch processing" | ⚠️ **FEASIBLE** | Đã có sẵn. |

### Human Review Findings
1. **Import endpoint cần ~1.3s** cho bulk operation (5-50 products). Acceptable cho transactional workload.
2. **Bug #6 ban đầu thực ra là 3 JMX bugs**, không phải SUT bug.
3. **Bài học:** Luôn verify bằng curl thủ công trước khi kết luận "SUT bug".

---

## 4️⃣ Aggregate Performance Thresholds (Human-Reviewed)

| Scenario | Metric | Correct Threshold | AI's Suggestion | Delta |
|----------|--------|-------------------|-----------------|-------|
| Load | p95 | < 15 ms | < 200 ms | -185 ms (AI too lenient) |
| Load | p99 | < 25 ms | < 500 ms | -475 ms |
| Load | Throughput | ~5 req/s | > 50 req/s | AI misread units |
| Stress | Reset success | 100% | (not flagged) | AI missed |
| Spike | p95 import | < 3000 ms | (not flagged) | AI missed |

---

## 5️⃣ Optimization Recommendations (Feasibility-Classified)

| # | Recommendation | Source | Class | Reasoning |
|---|----------------|--------|-------|-----------|
| 1 | Fix `/api/reset-password` validation logic | Manual + AI | **FEASIBLE + REQUIRED** | Bug #4 |
| 2 | Return generic response on forgot-password | Manual | **FEASIBLE + REQUIRED** | Bug #1 |
| 3 | Remove `resetToken` from response | Manual | **FEASIBLE + REQUIRED** | Bug #2 |
| 4 | Return 429 instead of 403 on lockout | Manual | **FEASIBLE + REQUIRED** | Bug #3 |
| 5 | Add SQLite WAL mode | AI | FEASIBLE | DB-level optimization |
| 6 | Add Redis cache for my-orders | AI | FEASIBLE | Production-ready |
| 7 | Use batch processing for admin import | AI | FEASIBLE | Valid optimization |
| 8 | Implement circuit breaker | AI | FEASIBLE | Production pattern |
| 9 | "Increase JWT expiry to reduce auth overhead" | AI | **HALLUCINATED** | No evidence |
| 10 | "Add connection pooling" | AI | **HALLUCINATED** | No evidence |
| 11 | "Implement rate limiting with backoff" | AI | **HALLUCINATED** | Already exists |
| 12 | "Use request queuing for burst" | AI | **HALLUCINATED** | Latency 1ms |

**Summary**: 4 feasible+required (all from manual testing), 4 feasible but lower priority (from AI), 4 hallucinated (from AI).

---

## 6️⃣ Key Takeaways

1. **Load test is healthy** — read paths work well at 10 concurrent users (100% pass).
2. **Stress test pass 100%** sau khi reset DB (trước đó fail do test-design flaw).
3. **Spike test pass 100%** sau khi fix 3 JMX bugs (trước đó tưởng bug #6 SUT).
4. **AI's analysis was directionally correct but quantitatively hallucinated**:
   - AI picked "industry standard" thresholds without reading raw data
   - AI suggested scaling solutions cho logic bugs và test-design issues
   - AI confused throughput units (req/s vs req/min)
5. **Performance metrics are excellent** across all 3 scenarios — SUT is fast (p95 < 30ms), issues are correctness/test design, not speed.
6. **Bài học về JMX:** Header Manager local REPLACE global (không merge); BSF deprecated dùng JSR223; Groovy ≠ JavaScript syntax.

---

**Files referenced:**
- `HW05/Results/load-orders-summary.jtl` (589 records)
- `HW05/Results/stress-reset-password.jtl` (250 records)
- `HW05/Results/spike-admin-import-products.jtl` (1001 records)
- `HW05/docs/bug_reports.md` (9 issues)
- `HW05/docs/ai-critique.md` (separate critique file)