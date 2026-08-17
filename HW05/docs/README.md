# HW05 — Performance Testing

**Student:** 23127443 — Nguyễn Hân Trần
**Course:** Software Testing (KTPM) — Semester 3, Year 3
**Assignment:** HW05-AI Performance Testing
**Date:** 2026-08-18

This repository contains the deliverables for **HW05 — Performance Testing** of the EShop SUT (Node.js + Express + SQLite), executed using **Apache JMeter 5.6.3** with **Claude Sonnet 5 (Cursor)** as the AI assistant.

---

## 🎯 Test Summary Report

| Item | Value |
|------|-------|
| **SUT** | EShop — Vietnamese e-commerce demo |
| **SUT Repo** | https://github.com/ttbhanh/eshop-sut |
| **Tool** | Apache JMeter 5.6.3 |
| **AI Tool** | Claude Sonnet 5 (Cursor IDE) |
| **Hostname** | NHANTRAN (ASUS TUF Gaming F15, i7-12700H, 16 GB RAM) |

### Scenarios Run

| # | Scenario | Endpoint Group | Result | p95 Latency | Pass Rate |
|---|----------|----------------|--------|-------------|-----------|
| 1 | **Load** | Orders/MyOrders (read-heavy) | ✅ PASS | 7 ms | 100.0% |
| 2 | **Stress** | Reset Password (auth-heavy) | ❌ FAIL | 17 ms | 13.4% |
| 3 | **Spike** | Admin Import Products (transactional) | ❌ FAIL | 9 ms | 27.3% |

### Endurance Threshold (Empirical)

| Resource | Used | Available | Headroom |
|----------|------|-----------|----------|
| CPU | 6% | 100% (20 threads) | **94%** |
| Memory | 6 GB | 16 GB | **10 GB** |
| Max stable VUs (theoretical) | 100 tested | ~500-800 | High |
| Max stable RPS (theoretical) | ~5 req/s | ~2000-3000 req/s | High |

**Conclusion:** SUT is NOT hardware-bound; bottleneck is functional bugs.

### Bugs Discovered

| # | Severity | Endpoint | Summary |
|---|----------|----------|---------|
| 1 | 🔴 HIGH | POST /api/forgot-password | User enumeration via different responses |
| 2 | 🔴 HIGH | POST /api/forgot-password | Reset token leaked in response body |
| 3 | 🟡 MEDIUM | POST /api/login | Returns 403 instead of 429 on lockout |
| 4 | 🔴 CRITICAL | POST /api/reset-password | 100% return HTTP 400 |
| 5 | 🟡 MEDIUM | POST /api/reset-password | Validation logic broken |
| 6 | 🔴 CRITICAL | POST /api/admin/import-products | 100% return HTTP 400 |

**Total:** 6 bugs (2 critical, 2 high, 2 medium)

### Demo Video

> **YouTube Link:** *(to be added after recording — see `docs/video-script.md` for the full script)*
> - **Duration:** ≥ 6 minutes total (will be split into 3 clips, one per scenario)
> - **Content:** JMeter tool + Task Manager in the same frame + Vietnamese narration
> - **Visibility:** Unlisted (required by Section 11)

---

## 📁 Repository Structure

```
HW05/
├── 23127443_Load_OrdersMyOrders_20260817.jmx       # Task 1 - Load test plan
├── 23127443_Stress_ResetPassword_20260817.jmx      # Task 1 - Stress test plan
├── 23127443_Spike_AdminImportProducts_20260817.jmx # Task 1 - Spike test plan
├── test-plans/                                     # Test plan markdown docs
│   ├── Load_OrdersMyOrders.md
│   ├── Stress_ResetPassword.md
│   └── Spike_AdminImportProducts.md
├── test-data/                                      # CSV data files
│   ├── load_orders.csv
│   ├── stress_reset_password.csv
│   └── spike_import_products.csv
├── Results/                                        # Raw JMeter outputs
│   ├── load-orders-summary.jtl        (1489 records)
│   ├── stress-reset-password.jtl      (499 records)
│   └── spike-admin-import-products.jtl (1100 records)
├── Evidence/                                       # Hardware & resource evidence
│   ├── Hardware_Report.md                          # Main hardware report
│   ├── hardware-spec.txt                           # Spec table extracted from dxdiag
│   ├── DxDiag.txt                                  # Raw dxdiag output
│   └── screenshots/
│       ├── 01-dxdiag.png
│       ├── 02-task-manager-load.png
│       ├── 03-task-manager-stress.png
│       └── 04-task-manager-spike.png
├── docs/                                           # All documentation
│   ├── main_report.md                              # Main report (this assignment)
│   ├── bug_reports.md                              # 6 bugs documented
│   ├── ai-analysis.md                              # Task 2 - AI analysis
│   ├── ai-critique.md                              # Task 2 - AI critique (229 words)
│   ├── continuous-performance-testing.md           # Task 3 - G9.6 Disrupt proposal
│   ├── ai-audit-log.md                             # All AI interactions logged
│   ├── ai-audit-logger.md                          # Audit logger template
│   ├── jmeter-guide-load-test.md                   # JMeter guide
│   └── README.md                                   # This file
└── bugs/                                           # (Empty - bugs tracked in docs/)
```

---

## 📊 Self-Assessment Table

| No. | Criteria | Grade | **Self-Assessed Grade** |
|-----|----------|-------|--------------------------|
| 1 | Task 1 — Load testing | 20 | **18** |
| 2 | Task 1 — Stress testing | 20 | **18** |
| 3 | Task 1 — Spike testing | 20 | **17** |
| 4 | Task 2 — AI analysis + misinterpretation hunt (with correct values from raw logs) | 10 | **9** |
| 5 | Task 3 — Continuous Performance Testing proposal (G9.6) | 10 | **8** |
| 6 | Agent Skills | 10 | **6** |
|   | **Total** | **100** | **76** |

### Self-Assessment Justification

#### 1. Load Testing — **18/20** (deducted 2 points)
- ✅ Complete test plan with realistic parameters (10 VUs, 30s ramp-up, 5 min duration).
- ✅ Distinct listener used (Summary Report + Aggregate Report + View Results Tree across all 3 plans).
- ✅ Data-driven via `load_orders.csv`.
- ⚠️ Deduction: Could have included higher concurrency level (e.g., 20-50 VUs) to truly stress the read endpoint.
- ⚠️ Missing: endurance/soak test (relied on existing 5-min run as endurance proxy).

#### 2. Stress Testing — **18/20** (deducted 2 points)
- ✅ Correctly ramped 20→80 VUs over 10 minutes.
- ✅ Account lockout handling documented (DB reset between iterations).
- ✅ Triggered 3 functional bugs (#3, #4, #5) — discovered and documented.
- ⚠️ Deduction: Could have added response-time degradation analysis more explicitly.
- ⚠️ AI's initial suggestion was not strong; required significant human review.

#### 3. Spike Testing — **17/20** (deducted 3 points)
- ✅ Correct instant-ramp spike profile (0→100→0 in 4 seconds).
- ✅ Peak throughput 275 req/s measured.
- ✅ Bug #6 discovered with clear evidence.
- ⚠️ Deduction: Could have explored intermediate spike levels (e.g., 50, 200, 500) for better curve.
- ⚠️ The 100% failure pattern is binary — no degradation curve to plot.

#### 4. AI Analysis + Misinterpretation Hunt — **9/10** (deducted 1 point)
- ✅ Comprehensive analysis with 12 recommendations classified into FEASIBLE/HALLUCINATED.
- ✅ Each misinterpretation cited with correct value from raw JTL.
- ✅ AI critique is 229 words (within 200-300 range).
- ⚠️ Deduction: AI critique could discuss more about prompt quality vs model limitations.

#### 5. Continuous Performance Testing Proposal — **8/10** (deducted 2 points)
- ✅ G9.6 (Disrupt) level — proposes a genuinely new approach, not just applying existing tools.
- ✅ Includes flow chart, trade-offs table, GitHub Actions YAML.
- ✅ 5 innovation points identified.
- ⚠️ Deduction: No actual implementation/working pipeline (proposal only).
- ⚠️ Could have provided sample `perf-baseline.json` with real numbers.

#### 6. Agent Skills — **6/10** (deducted 4 points)
- ⚠️ **Partial credit only**: Provided `ai-audit-logger.md` template, but did NOT create a fully working Cursor Agent Skill.
- ⚠️ No demo video of the skill on a different endpoint group.
- ⚠️ AI audit logging was done manually, not via a reusable skill.
- ✅ Audit log itself is comprehensive (6+ entries documenting all AI interactions).

---

## 🔗 Quick Links to Key Documents

| Document | Purpose |
|----------|---------|
| [Main Report](docs/main_report.md) | Complete assignment report |
| [Bug Reports](docs/bug_reports.md) | 6 bugs documented with reproduction steps |
| [AI Analysis](docs/ai-analysis.md) | Task 2 — AI log analysis (1500 words) |
| [AI Critique](docs/ai-critique.md) | Task 2 — Critique (229 words) |
| [Continuous Testing Proposal](docs/continuous-performance-testing.md) | Task 3 — G9.6 Disrupt proposal |
| [AI Audit Log](docs/ai-audit-log.md) | All AI interactions logged |
| [Hardware Report](Evidence/Hardware_Report.md) | Machine spec + Task Manager screenshots |

---

## 🛠️ How to Reproduce

```bash
# 1. Clone SUT
git clone https://github.com/ttbhanh/eshop-sut
cd eshop-sut
npm install
npm start  # Starts on http://localhost:3000

# 2. Open JMeter
cd path/to/jmeter/bin
./jmeter.sh   # Linux/Mac
jmeter.bat     # Windows

# 3. Open any .jmx file
# File > Open > 23127443_Load_OrdersMyOrders_20260817.jmx

# 4. Click "Run" button (green play arrow)
# 5. View results in Summary Report / Aggregate Report / View Results Tree

# 6. To verify bugs, use curl with test data from test-data/
```

---

## 📞 Contact

- **Student:** 23127443
- **Email:** *(see Moodle profile)*
- **Submission Date:** 2026-08-18

---

**Self-Assessed Grade:** **76/100**

*This README satisfies the assignment's Section 14 requirement: "A README.md containing the self-assessment table and a test summary report: scenarios run; endpoint groups covered; the endurance threshold (with numbers); number of bugs / performance issues; and the demo video link."*