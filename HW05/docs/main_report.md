# HW05 — Performance Testing Report

**Student ID:** 23127443
**Course:** Software Testing (KTPM) — Semester 3, Year 3
**Lecturers:** Dr. Lam Quang Vu, Dr. Tran Duy Hoang, MSc. Tran Thi Bich Hanh, MSc. Truong Phuoc Loc, MSc. Ho Tuan Thanh
**Date:** 2026-08-18
**Bloom-AI Level:** G9.2 (Apply), G9.3 (Analyse), G9.4 (Collaborate), G9.6 (Disrupt)

---

## 📑 Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Test Scope & Endpoint Selection](#2-test-scope--endpoint-selection)
3. [Test Environment](#3-test-environment)
4. [Task 1 — Test Design & Execution](#4-task-1--test-design--execution)
   - [4.1 Load Test (Read-Heavy)](#41-load-test-read-heavy)
   - [4.2 Stress Test (Auth-Heavy)](#42-stress-test-auth-heavy)
   - [4.3 Spike Test (Transactional)](#43-spike-test-transactional)
   - [4.4 Endurance Threshold](#44-endurance-threshold)
5. [Bug Reports](#5-bug-reports)
6. [Task 2 — AI Analysis & Critique](#6-task-2--ai-analysis--critique)
7. [Task 3 — Continuous Performance Testing Proposal](#7-task-3--continuous-performance-testing-proposal)
8. [Conclusion](#8-conclusion)
9. [References](#9-references)

---

## 1. Executive Summary

This report documents the complete performance-testing cycle of the **EShop** system under test (SUT). Three performance scenarios were designed, executed, and analyzed using **Apache JMeter 5.6.3**, with **Claude Sonnet 5** as the AI assistant throughout the workflow.

### 1.1 Results at a Glance

| Scenario | Endpoint Group | Pass Rate | p95 Latency | Verdict |
|----------|----------------|-----------|-------------|---------|
| **Load** | Orders/MyOrders (read-heavy) | **100%** | 7 ms | ✅ PASS |
| **Stress** | Reset Password (auth-heavy) | **13.4%** | 17 ms | ❌ FAIL (functional bugs) |
| **Spike** | Admin Import Products (transactional) | **27.3%** | 9 ms | ❌ FAIL (Bug #6) |

### 1.2 Key Findings

1. **Performance is excellent** — p95 latency under 17 ms across all scenarios.
2. **Failures are functional, not performance-related** — 6 bugs discovered, mostly in auth workflow.
3. **Hardware has massive headroom** — CPU only 6% utilized at peak.
4. **AI made 4 hallucinated recommendations** — caught by human review.

### 1.3 Deliverables Checklist

- [x] 3 test plans (`.md`) — `test-plans/`
- [x] 3 data files (`.csv`) — `test-data/`
- [x] 3 JMeter plans (`.jmx`) — root directory
- [x] 3 raw logs (`.jtl`) — `Results/`
- [x] 6 bug reports — `docs/bug_reports.md`
- [x] AI analysis — `docs/ai-analysis.md`
- [x] AI critique (229 words) — `docs/ai-critique.md`
- [x] Continuous testing proposal — `docs/continuous-performance-testing.md`
- [x] Hardware report — `Evidence/Hardware_Report.md`
- [x] Task Manager screenshots (3) — `Evidence/screenshots/`
- [x] AI audit log — `docs/ai-audit-log.md`
- [x] Main report — `docs/main_report.md` (this file)
- [ ] README with self-assessment — `docs/README.md`
- [ ] Git commit log — `docs/git-commit-log.txt`
- [ ] Video demo (6+ min) — YouTube link

---

## 2. Test Scope & Endpoint Selection

Following the assignment requirement to cover three distinct endpoint groups (one per scenario), the following mapping was chosen:

| Scenario | Endpoint Group | API Workflow |
|----------|----------------|--------------|
| **Load** | Read-heavy | `POST /api/login` → `GET /api/orders/my-orders` (FR-11: order history) |
| **Stress** | Auth-heavy | `POST /api/forgot-password` → `POST /api/login` (wrong pwd) → `POST /api/reset-password` (FR-02 + FR-06) |
| **Spike** | Transactional | `POST /api/login` (admin) → `GET /api/categories` → `POST /api/admin/import-products` (FR-16) |

### 2.1 Endpoint Justification

- **Load → Orders/MyOrders**: Read-heavy because it queries the user's order history, a typical browse-and-search pattern. Latency is critical for UX.
- **Stress → Reset Password**: Auth-heavy because it exercises the lockout mechanism (3-strike rule), which stresses the rate-limiting subsystem and involves multiple write operations.
- **Spike → Admin Import Products**: Transactional because each request creates multiple rows in the products table; bulk operations benefit most from burst-capacity testing.

---

## 3. Test Environment

| Component | Specification |
|-----------|---------------|
| **Hostname** | NHANTRAN |
| **OS** | Windows 11 Home Single Language 64-bit (Build 26200) |
| **CPU** | Intel Core i7-12700H (20 logical CPUs), ~2.3 GHz |
| **RAM** | 16384 MB (16 GB) |
| **JMeter** | 5.6.3 |
| **Java** | OpenJDK 17 |
| **SUT** | EShop (Node.js 18 + Express + SQLite) |
| **JMeter Mode** | GUI (single-machine local test) |

See `Evidence/Hardware_Report.md` for full hardware specs and resource-monitor screenshots.

---

## 4. Task 1 — Test Design & Execution

### 4.1 Load Test (Read-Heavy)

**File:** `23127443_Load_OrdersMyOrders_20260817.jmx`
**Test plan:** `test-plans/Load_OrdersMyOrders.md`
**Data file:** `test-data/load_orders.csv`
**Raw log:** `Results/load-orders-summary.jtl`

#### Scenario
- **Virtual Users:** 10
- **Ramp-up:** 30 seconds
- **Duration:** 5 minutes
- **Throughput target:** 6 req/min (Constant Throughput Timer)
- **Endpoint flow:** Login → Get user's orders

#### Results (from raw JTL — 1489 records)

| Endpoint | Samples | Min | Max | Avg | p95 | p99 | Errors |
|----------|---------|-----|-----|-----|-----|-----|--------|
| POST /api/login | 513 | 1 | 9 | 3.05 | 4 | 6 | 0% |
| GET /api/orders/my-orders | 463 | 1 | 7 | 2.84 | 4 | 5 | 0% |
| End-to-end transaction | 513 | 1 | 13 | 5.62 | **7** | 8 | 0% |

#### Verdict
✅ **PASS** — All 1489 requests completed successfully with p95 = 7 ms.

#### AI Suggestions vs Reality
- **AI:** "p95 should be < 200 ms" — **HALLUCINATED**, threshold 28× too lenient.
- **Human correction:** p95 should be < 15 ms (based on actual baseline).

#### Resource Usage
- JMeter: 2 × `jmeter-server.exe` processes, ~168 MB combined.
- SUT: <6% CPU, ~5 GB RAM used out of 16 GB.

---

### 4.2 Stress Test (Auth-Heavy)

**File:** `23127443_Stress_ResetPassword_20260817.jmx`
**Test plan:** `test-plans/Stress_ResetPassword.md`
**Data file:** `test-data/stress_reset_password.csv`
**Raw log:** `Results/stress-reset-password.jtl`

#### Scenario
- **Virtual Users:** Ramp 20 → 80 over 10 minutes
- **Endpoint flow:** Wrong password × 3 → Account lockout → Forgot password → Reset password
- **Special handling:** Account lockout requires DB reset between iterations (documented in test plan).

#### Results (from raw JTL — 499 records)

| Endpoint | Total | HTTP 200 | HTTP 400 | HTTP 403 | HTTP 401 | Success % |
|----------|-------|----------|----------|----------|----------|-----------|
| POST /api/forgot-password | 67 | 67 | 0 | 0 | 0 | 100% |
| POST /api/login (wrong) | 240 | 0 | 0 | 230 | 10 | 0% (expected) |
| POST /api/reset-password | 24 | 0 | 24 | 0 | 0 | **0%** |
| End-to-end transaction | 24 | 0 | 24 | 0 | 0 | **0%** |
| **ALL** | **499** | **67** | **24** | **230** | **10** | **13.4%** |

#### Verdict
❌ **FAIL** — Caused by **functional bugs**, not performance degradation.

#### Latency Profile
| Endpoint | Avg | p95 | p99 |
|----------|-----|-----|-----|
| /api/forgot-password | 8.97 ms | 11 | 12 |
| /api/login (wrong) | 2.5 ms | 3 | 4 |
| /api/reset-password | 2.04 ms | 3 | 3 |
| Transaction | 17.4 ms | 17 | — |

**Key insight:** All endpoints respond in <12 ms even under stress. Latency is NOT the problem.

#### Bugs Triggered
- **Bug #3** (HTTP 403 instead of 429 for lockout)
- **Bug #4** (HTTP 400 on `/api/reset-password`)
- **Bug #5** (Validation logic broken)

#### AI Suggestions vs Reality
- **AI:** "Add connection pooling" — **HALLUCINATED**, no pool exhaustion (p99 = 4 ms).
- **AI:** "Rate limiting with backoff" — **HALLUCINATED**, rate limiting already exists.
- **AI:** "SQLite WAL mode" — **FEASIBLE** but doesn't fix root cause.

---

### 4.3 Spike Test (Transactional)

**File:** `23127443_Spike_AdminImportProducts_20260817.jmx`
**Test plan:** `test-plans/Spike_AdminImportProducts.md`
**Data file:** `test-data/spike_import_products.csv`
**Raw log:** `Results/spike-admin-import-products.jtl`

#### Scenario
- **Virtual Users:** 0 → 100 → 0 (instant spike, 4-second ramp)
- **Endpoint flow:** Admin login → Fetch categories → Bulk import products → Verify
- **Total requests:** 100 transactions × 4 calls = ~400 requests in <2 seconds

#### Results (from raw JTL — 1100 records)

| Endpoint | Total | HTTP 200 | HTTP 400 | Success % |
|----------|-------|----------|----------|-----------|
| POST /api/login (admin) | 100 | 100 | 0 | 100% |
| GET /api/categories | 100 | 100 | 0 | 100% |
| **POST /api/admin/import-products** | 100 | 0 | 100 | **0%** |
| GET /api/products (verify) | 100 | 100 | 0 | 100% |
| Transaction | 100 | — | — | 100 samples (containing 400) |

#### Verdict
❌ **FAIL** — 100% failure on import endpoint.

#### Latency Profile
| Endpoint | Avg | p95 | p99 |
|----------|-----|-----|-----|
| /api/login (admin) | 3.7 ms | 5 | 16 |
| GET /api/categories | 1.73 ms | 4 | 9 |
| **/api/admin/import-products** | **1.05 ms** | 2 | 4 |
| Transaction | 7.85 ms | 9 | 18 |

**Key insight:** Latency of 1.05 ms for a failing endpoint = **immediate rejection**, NOT load-induced.

#### Bug Triggered
- **Bug #6** (admin import endpoint broken on every request)

#### AI Suggestions vs Reality
- **AI:** "Request queuing for burst" — **HALLUCINATED**, latency too low to need a queue.
- **AI:** "Circuit breaker" — **FEASIBLE** but wrong tool; endpoint returns 400, not 503.
- **AI:** "Batch processing" — **FEASIBLE** as future optimization, doesn't fix Bug #6.

---

### 4.4 Endurance Threshold

Based on observed resource utilization across all 3 scenarios, the empirical threshold for `NHANTRAN` (i7-12700H, 16 GB RAM):

| Metric | Observed Max | Theoretical Ceiling | Notes |
|--------|--------------|---------------------|-------|
| CPU | ~6% | 100% | Headroom = 94% |
| Memory | ~6 GB | 16 GB | Headroom = 10 GB |
| Stable VUs (theoretical) | 100 (tested) | ~500-800 | Limited by Node.js event loop |
| Stable throughput | ~5 req/s | ~2000-3000 req/s | Limited by SQLite single-writer |

**Conclusion:** The SUT is **NOT hardware-bound**. End-user machine has ample headroom for any tested configuration. Real bottleneck = functional bugs.

**Endurance test note:** A full 10-15 minute soak test was not run separately because:
1. Load Test already ran for 5 minutes at sustained load with stable behavior.
2. Stress Test ran for 10 minutes with stable latency (no degradation observed).
3. The bottleneck is functional, not resource-related.

---

## 5. Bug Reports

Six bugs were identified during testing. Full details in `docs/bug_reports.md`.

| # | Severity | Endpoint | Summary |
|---|----------|----------|---------|
| 1 | 🔴 HIGH | POST /api/forgot-password | User enumeration via different responses |
| 2 | 🔴 HIGH | POST /api/forgot-password | Reset token leaked in response body |
| 3 | 🟡 MEDIUM | POST /api/login | Returns 403 instead of 429 on lockout |
| 4 | 🔴 CRITICAL | POST /api/reset-password | 100% return HTTP 400 |
| 5 | 🟡 MEDIUM | POST /api/reset-password | Validation logic broken |
| 6 | 🔴 CRITICAL | POST /api/admin/import-products | 100% return HTTP 400 |

**Bug-to-test mapping:**
- Bugs #1, #2 → discovered during **Stress Test**
- Bugs #3, #4, #5 → triggered by **Stress Test** workflow
- Bug #6 → triggered by **Spike Test** workflow

---

## 6. Task 2 — AI Analysis & Critique

### 6.1 AI Analysis (Summary)

The AI analyzed the 3 JTL logs and produced a comprehensive analysis with:
- Per-endpoint latency statistics
- 12 optimization recommendations
- Initial threshold suggestions

**Document:** `docs/ai-analysis.md` (~1500 words)

### 6.2 AI Critique (229 words)

Four classes of AI errors were identified:

1. **Threshold hallucination**: AI suggested p95 < 200 ms without reading actual data (real p95 = 7 ms).
2. **Scaling solutions for logic bugs**: AI suggested connection pooling, rate limiting, request queuing for what were actually code logic errors.
3. **Unit confusion**: AI confused req/s with req/min.
4. **Missing critical bugs**: AI missed Bug #3 (wrong HTTP code) and Bug #6 (100% fail) because they fell outside typical "performance pattern" categories.

**Full critique:** `docs/ai-critique.md`

### 6.3 Recommendations Classification

| Class | Count | Examples |
|-------|-------|----------|
| FEASIBLE + REQUIRED | 4 | Fix reset-password validation, return generic forgot-password response |
| FEASIBLE (lower priority) | 4 | SQLite WAL mode, Redis cache, batch processing, circuit breaker |
| HALLUCINATED | 4 | Connection pooling, rate limiting with backoff, request queuing, JWT expiry |

---

## 7. Task 3 — Continuous Performance Testing Proposal

A complete CI/CD pipeline was designed with:
- **6-step flow chart** (PR trigger → baseline compare → alert)
- **GitHub Actions YAML** example
- **File-path heuristic** to skip non-perf PRs (saves 70% CI time)
- **Variance-aware detection** (IQR + 3-strike rule) to avoid false alarms
- **Release-tag baseline pinning** to prevent drift
- **4-phase rollout roadmap**

**Document:** `docs/continuous-performance-testing.md` (~800 words)
**Innovation points:** 5 distinct ideas (file-path heuristic, soft-block, per-scenario thresholds, baseline pinning, IQR detection)
**Bloom-AI Level:** G9.6 (Disrupt)

---

## 8. Conclusion

### 8.1 What Worked Well

1. **JMeter was effective** for all 3 scenario types with clear separation of concerns.
2. **Local SQLite SUT** allowed reproducible testing with zero network noise.
3. **Hardware had massive headroom** — no resource contention.
4. **AI was helpful for boilerplate generation** but required rigorous human review.

### 8.2 Lessons Learned

1. **AI hallucinates without domain context** — its suggestions must always be verified against raw data.
2. **Functional bugs masquerade as performance issues** — always check error responses before assuming load problems.
3. **Latency is not the only metric** — error rate and correctness matter more for some scenarios.
4. **Continuous testing is feasible** — file-path heuristics make CI integration practical.

### 8.3 Recommendations for Future Work

1. Fix all 6 bugs before any production deployment.
2. Add CI pipeline (per Task 3 proposal) to prevent regression.
3. Migrate from SQLite to PostgreSQL for true concurrent writes.
4. Introduce APM (Application Performance Monitoring) for production visibility.

---

## 9. References

- **JMeter 5.6.3 User Manual** — Apache Software Foundation
- **ISTQB Foundation Level Syllabus** (latest edition)
- **Hardman, P. (2025)** — *A Post-AI Learning Taxonomy*
- **Anthropic (2025)** — *Building Reliable AI Test Agents*
- **SUT Repository:** https://github.com/ttbhanh/eshop-sut

---

**Appendix files:**
- `docs/ai-analysis.md`
- `docs/ai-critique.md`
- `docs/continuous-performance-testing.md`
- `docs/bug_reports.md`
- `docs/ai-audit-log.md`
- `Evidence/Hardware_Report.md`
- `Evidence/screenshots/01-04`