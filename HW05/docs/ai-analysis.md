# AI Analysis Report — HW05 Performance Testing

**Student ID:** 23127443
**Date:** 2026-08-18
**Methodology:** AI-first (analyze with AI → critique → fix)
**Tools:** Claude Sonnet 5 (Cursor), JMeter 5.6.3

---

## 📊 Executive Summary

| Scenario | Total Samples | Success | Throughput | p95 | Verdict |
|----------|---------------|---------|------------|-----|---------|
| **Load** | 1489 | 100.0% | ~5 req/s | 7 ms | ✅ PASS |
| **Stress** | 499 | 13.4% | varies | 17 ms | ❌ FAIL (Bug #3, #4) |
| **Spike** | 1100 | 27.3% | 275 req/s | 9 ms | ❌ FAIL (Bug #6) |

---

## 1️⃣ Load Test Analysis (Orders/MyOrders — Read-Heavy)

### Raw Metrics from `load-orders-summary.jtl`

| Metric | POST /api/login | GET /api/orders/my-orders | Transaction |
|--------|----------------|---------------------------|-------------|
| Samples | 513 | 463 | 513 |
| Min | 1 ms | 1 ms | 1 ms |
| Max | 9 ms | 7 ms | 13 ms |
| Avg | 3.05 ms | 2.84 ms | 5.62 ms |
| p95 | 4 ms | 4 ms | 7 ms |
| p99 | 6 ms | 5 ms | 8 ms |
| Error % | 0% | 0% | 0% |

### AI Interpretation
The SUT handles read-heavy workloads **exceptionally well**. Under 10 concurrent virtual users with a Constant Throughput Timer of 6 req/min, all 1489 requests completed with **sub-10ms latency** at p99. This is a strong indicator that:
- The SQLite read paths (login + my-orders) are well-optimized for the local SUT.
- No connection pool exhaustion observed at this load level.
- JWT validation overhead is minimal (~1ms).

### Threshold Recommendations (AI)

| Metric | AI Suggestion | Justification | Critique Status |
|--------|---------------|---------------|-----------------|
| p95 latency | < 200 ms | Standard SLA for read endpoints | ❌ **HALLUCINATED** — too lenient; actual p95 is 7ms, AI picked a "safe" industry default without inspecting raw data |
| p99 latency | < 500 ms | Common SaaS threshold | ❌ **HALLUCINATED** — actual p99 is 8ms; AI's number is 60× higher than reality |
| Throughput | > 50 req/s | Reasonable baseline | ❌ **HALLUCINATED** — actual throughput is 5 req/s (driven by `ConstantThroughputTimer` 6 req/min); AI ignored the timer constraint |
| Error rate | < 1% | Industry standard | ✅ CORRECT — actual error rate is 0%, threshold is met |

### Human Review Corrections
After re-reading the JTL, the realistic thresholds for **this specific SUT** should be:
- **p95**: < 15 ms (2× current baseline)
- **p99**: < 25 ms
- **Error rate**: < 0.5% (stricter than AI's 1%)
- **Throughput**: Maintain 6 req/min (read-heavy designed load)

The AI applied "industry standard" thresholds without looking at the actual raw data, producing numbers that are technically safe but disconnected from the SUT's true performance envelope.

---

## 2️⃣ Stress Test Analysis (Reset Password — Auth-Heavy)

### Raw Metrics from `stress-reset-password.jtl`

| Endpoint | Total | 200 | 401 | 403 | 400 | Success % |
|----------|-------|-----|-----|-----|-----|-----------|
| POST /api/forgot-password | 67 | 67 | 0 | 0 | 0 | 100% |
| POST /api/login (wrong) | 240 | 0 | 10 | 230 | 0 | 0% (expected) |
| POST /api/reset-password | 24 | 0 | 0 | 0 | 24 | **0%** |
| Transaction (end-to-end) | 24 | 0 | 0 | 0 | 24 | **0%** |
| **All Samples** | **499** | **67** | **10** | **230** | **24** | **13.4%** |

### Latency by Endpoint
| Endpoint | Count | Avg | Max | p95 | p99 |
|----------|-------|-----|-----|-----|-----|
| /api/forgot-password | 67 | 8.97 ms | 12 ms | 11 ms | 12 ms |
| /api/login (wrong) | 240 | 2.5 ms | 6 ms | 3 ms | 4 ms |
| /api/reset-password | 24 | 2.04 ms | 3 ms | 3 ms | 3 ms |
| Transaction | 24 | 17.4 ms | 21 ms | 17 ms | — |

### AI Interpretation
The stress test reveals a **catastrophic functional failure**, not a performance degradation. The SUT:
- Returns 403 (not 429) when account locked — semantic mismatch
- **Cannot complete the password reset workflow at all** — 100% of `POST /api/reset-password` calls fail with HTTP 400

This is consistent with the bugs documented in `bug_reports.md` (#3, #4, #5).

### AI Recommendations vs Reality

| AI Recommendation | Verdict | Reasoning |
|-------------------|---------|-----------|
| "Increase ramp-up time to reduce error rate" | ❌ **FEASIBLE BUT IRRELEVANT** | The errors are functional bugs, not load-related. More ramp-up won't fix `400 Bad Request` on reset-password. |
| "Add connection pooling to handle concurrent requests" | ❌ **HALLUCINATED** | Latency p99 is only 4ms; no connection pool issue. The 400 error is returned in 2ms (immediate rejection). |
| "Enable SQLite WAL mode for write performance" | ⚠️ **FEASIBLE** | Valid suggestion but irrelevant here — the bug is in validation logic, not DB writes. |
| "Implement rate limiting with exponential backoff" | ❌ **HALLUCINATED** | Rate limiting exists (3-strike lockout); the issue is the 403 status code, not absence of rate limiting. |
| "Increase JWT expiry to reduce auth overhead" | ❌ **HALLUCINATED** | JWT validation takes <1ms based on `/api/login` latency. |

### Human Review Findings
1. **Latency under stress remains low** (4ms p99 for wrong-password) — no real performance bottleneck.
2. **The "stress failure" is entirely functional** — Bug #4 makes the reset flow unfinishable.
3. **AI confused symptoms with causes**: it suggested scaling solutions for a logic bug.

---

## 3️⃣ Spike Test Analysis (Admin Import Products — Transactional)

### Raw Metrics from `spike-admin-import-products.jtl`

| Endpoint | Total | 200 | 400 | Success % |
|----------|-------|-----|-----|-----------|
| POST /api/login (admin) | 100 | 100 | 0 | 100% |
| GET /api/categories | 100 | 100 | 0 | 100% |
| **POST /api/admin/import-products** | **100** | **0** | **100** | **0%** |
| GET /api/products (verify) | 100 | 100 | 0 | 100% |
| Transaction | 100 | — | — | 100 samples (with 400 child) |

### Latency by Endpoint
| Endpoint | Count | Avg | Max | p95 | p99 |
|----------|-------|-----|-----|-----|-----|
| /api/login (admin) | 100 | 3.7 ms | 21 ms | 5 ms | 16 ms |
| GET /api/categories | 100 | 1.73 ms | 21 ms | 4 ms | 9 ms |
| **/api/admin/import-products** | 100 | 1.05 ms | 10 ms | 2 ms | 4 ms |
| GET /api/products (verify) | 100 | 3.1 ms | 20 ms | 5 ms | 20 ms |
| Transaction | 100 | 7.85 ms | 30 ms | 9 ms | 18 ms |

### Test Profile (from thread name)
- `Spike Test - Admin Import (0→100→0)` indicates **instant ramp**: 0 → 100 users → 0
- Duration: 4 seconds
- Peak throughput: **275 req/s**

### AI Interpretation
The spike test was designed to assess SUT resilience under sudden load. The findings:
- Login + read endpoints **survived the spike** at 100% success.
- Import endpoint **failed 100% of the time**, but the failure latency (avg 1ms) suggests **immediate request rejection**, not exhaustion.
- This indicates the import endpoint has a **logic bug** (Bug #6) that triggers on every request, independent of load.

### AI Recommendations vs Reality

| AI Recommendation | Verdict | Reasoning |
|-------------------|---------|-----------|
| "Implement request queuing to handle burst" | ❌ **HALLUCINATED** | Queue would help if backend is slow, but here requests are rejected in 1ms. No queue needed. |
| "Add circuit breaker for import endpoint" | ❌ **FEASIBLE BUT WRONG FIX** | Circuit breaker protects against cascading failure. The endpoint itself returns 400, not 503/timeout. |
| "Use batch processing for bulk imports" | ⚠️ **FEASIBLE** | A valid optimization, but doesn't fix the 400 error. |
| "Reduce concurrent import threads" | ❌ **FEASIBLE BUT WRONG FIX** | Reducing concurrency won't fix a validation bug that triggers on every request. |
| "Move import to async worker" | ⚠️ **FEASIBLE** | Would help with long-running imports, but not relevant for a broken endpoint. |

### Human Review Findings
1. **Spike handling is fine** for read paths (login, categories, verify).
2. **The 100% failure on import is pre-existing**, not caused by spike load.
3. **Latency p99 = 4ms** under spike load — SUT is NOT resource-starved.
4. The AI correctly identified the issue as "suspicious latency pattern" but then hallucinated scaling solutions instead of pointing to a logic bug.

---

## 4️⃣ Aggregate Performance Thresholds (Human-Reviewed)

After critiquing the AI suggestions and re-reading the raw JTL logs, the **corrected** thresholds for the SUT are:

| Scenario | Metric | Correct Threshold | AI's Suggestion | Delta |
|----------|--------|-------------------|-----------------|-------|
| Load | p95 | < 15 ms | < 200 ms | -185 ms (AI too lenient) |
| Load | p99 | < 25 ms | < 500 ms | -475 ms |
| Load | Throughput | ≥ 6 req/min | > 50 req/s | AI misread units |
| Load | Error rate | < 0.5% | < 1% | -0.5% |
| Stress | Lockout response | HTTP 429 | (not flagged) | AI missed |
| Stress | Reset success | > 0% | (not flagged) | AI missed |
| Spike | p95 import | < 500 ms | (not flagged) | AI missed |

---

## 5️⃣ Optimization Recommendations (Feasibility-Classified)

| # | Recommendation | Source | Class | Reasoning |
|---|----------------|--------|-------|-----------|
| 1 | Fix `/api/reset-password` validation logic | Manual + AI | **FEASIBLE + REQUIRED** | Bug #4 — broken feature |
| 2 | Return generic response on forgot-password | Manual | **FEASIBLE + REQUIRED** | Bug #1 — security |
| 3 | Remove `resetToken` from forgot-password response | Manual | **FEASIBLE + REQUIRED** | Bug #2 — info disclosure |
| 4 | Return 429 instead of 403 on lockout | Manual | **FEASIBLE + REQUIRED** | Bug #3 — wrong HTTP code |
| 5 | Add SQLite WAL mode | AI | FEASIBLE | DB-level optimization, helpful but not addressing current bugs |
| 6 | Add Redis cache for my-orders | AI | FEASIBLE | Realistic for production, unnecessary for local SUT |
| 7 | Use batch processing for admin import | AI | FEASIBLE | Valid optimization, doesn't fix Bug #6 |
| 8 | Implement circuit breaker | AI | FEASIBLE | Production pattern, not relevant at current scale |
| 9 | "Increase JWT expiry to reduce auth overhead" | AI | **HALLUCINATED** | No evidence of auth overhead |
| 10 | "Add connection pooling" | AI | **HALLUCINATED** | No evidence of pool exhaustion; latency is 2-4ms |
| 11 | "Implement rate limiting with backoff" | AI | **HALLUCINATED** | Rate limiting already exists; bug is in HTTP code, not absence |
| 12 | "Use request queuing for burst" | AI | **HALLUCINATED** | Latency is 1ms — no queue depth exists |

**Summary**: 4 feasible+required (all from manual testing), 4 feasible but lower priority (from AI), 4 hallucinated (from AI).

---

## 6️⃣ Key Takeaways

1. **Load test is healthy** — read paths work well at 10 concurrent users.
2. **Stress test failures are functional, not performance** — Bugs #3 and #4 break the password reset workflow entirely.
3. **Spike test reveals Bug #6** — import endpoint returns 400 for every request (latency 1ms confirms immediate rejection).
4. **AI's analysis was directionally correct but quantitatively hallucinated**:
   - AI picked "industry standard" thresholds without reading raw data
   - AI suggested scaling solutions for logic bugs
   - AI confused throughput units (req/s vs req/min)
5. **Performance metrics are excellent** across all 3 scenarios — the SUT is fast (sub-15ms p95), the issues are correctness, not speed.

---

**Files referenced:**
- `HW05/Results/load-orders-summary.jtl` (1489 records)
- `HW05/Results/stress-reset-password.jtl` (499 records)
- `HW05/Results/spike-admin-import-products.jtl` (1100 records)
- `HW05/docs/bug_reports.md` (6 bugs)
- `HW05/docs/ai-critique.md` (separate critique file)