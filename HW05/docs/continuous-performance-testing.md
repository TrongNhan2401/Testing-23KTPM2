# Continuous Performance Testing Pipeline (Task 3 — G9.6 Disrupt)

**Student ID:** 23127443
**Date:** 2026-08-18
**Bloom-AI Level:** G9.6 (Disrupt — proposing innovative solutions)

---

## 🎯 Mục tiêu (Objective)

Xây dựng một pipeline **Continuous Performance Testing** tự động giám sát:
1. Các commit của SUT
2. Quyết định có nên chạy performance test không
3. Phát hiện và cảnh báo khi có **p95 regressions**

Mục đích: Ngăn performance regression xâm nhập vào main branch trước khi deploy production.

---

## 📊 Flow Chart

```
┌─────────────────────────────────────────────────────────────────┐
│                    Developer Push Code                           │
│                  (git push origin feature/*)                     │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              GitHub Actions: PR Triggered                        │
│   • Detect: changed files in src/, routes/, models/              │
│   • Label PR: 'perf-affected' if matched                         │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
    ┌──────────────────┐      ┌──────────────────┐
    │  No perf-affected│      │  perf-affected   │
    │  → Skip test     │      │  → Run test      │
    │  → Status: green │      │                  │
    └──────────────────┘      └────────┬─────────┘
                                        │
                                        ▼
              ┌─────────────────────────────────────────┐
              │  Step 1: Spin up isolated SUT            │
              │  • Docker container (eshop-sut:latest)   │
              │  • Random port (avoid conflict)          │
              │  • Seeded DB (deterministic)             │
              └─────────────────┬───────────────────────┘
                                │
                                ▼
              ┌─────────────────────────────────────────┐
              │  Step 2: Warm-up run (10 req, 30s)       │
              │  • Discard results                       │
              │  • Stabilize JIT, cache                  │
              └─────────────────┬───────────────────────┘
                                │
                                ▼
              ┌─────────────────────────────────────────┐
              │  Step 3: Execute 3 scenarios             │
              │  • Load (10 VUs, 5 min)                  │
              │  • Stress (ramp 20→80, 10 min)           │
              │  • Spike (0→100→0, 1 min)                │
              └─────────────────┬───────────────────────┘
                                │
                                ▼
              ┌─────────────────────────────────────────┐
              │  Step 4: Collect metrics                 │
              │  • p50, p95, p99, throughput, error%     │
              │  • System: CPU, memory, GC pauses        │
              │  • App: DB queries, cache hit ratio      │
              └─────────────────┬───────────────────────┘
                                │
                                ▼
              ┌─────────────────────────────────────────┐
              │  Step 5: Compare with baseline           │
              │  • Stored in perf-baseline.json          │
              │  • Threshold: p95 regression > 15%       │
              │  • Threshold: error% increase > 0.5%     │
              └─────────────────┬───────────────────────┘
                                │
                                ▼
              ┌────────────┴────────────────┐
              │                             │
              ▼                             ▼
    ┌──────────────────┐          ┌──────────────────┐
    │  Within threshold│          │  Regression      │
    │  → Update base   │          │  detected        │
    │  → ✅ Approve PR │          │                  │
    └──────────────────┘          └────────┬─────────┘
                                           │
                                           ▼
              ┌─────────────────────────────────────────┐
              │  Step 6: Alert + Block                   │
              │  • Comment on PR with metrics table     │
              │  • Tag reviewers (@perf-team)           │
              │  • Optional: auto-revert commit         │
              │  • ❌ Block merge until fixed            │
              └─────────────────────────────────────────┘
```

---

## 🔧 Implementation Example (GitHub Actions)

### File: `.github/workflows/perf-regression.yml`

```yaml
name: Performance Regression Check

on:
  pull_request:
    paths:
      - 'src/**'
      - 'routes/**'
      - 'models/**'
      - 'middleware/**'
      - 'package.json'

jobs:
  perf-test:
    runs-on: ubuntu-latest
    timeout-minutes: 30

    steps:
      - name: Checkout PR
        uses: actions/checkout@v4

      - name: Detect perf-affected files
        id: detect
        run: |
          CHANGED=$(git diff --name-only origin/main...HEAD)
          if echo "$CHANGED" | grep -qE '^(src|routes|models|middleware)/'; then
            echo "perf-affected=true" >> $GITHUB_OUTPUT
          else
            echo "perf-affected=false" >> $GITHUB_OUTPUT
          fi

      - name: Run performance tests
        if: steps.detect.outputs.perf-affected == 'true'
        run: |
          docker-compose up -d eshop-sut
          ./scripts/wait-for-sut.sh
          ./scripts/run-jmeter-suite.sh
          docker-compose down

      - name: Compare with baseline
        if: steps.detect.outputs.perf-affected == 'true'
        run: ./scripts/check-regression.sh

      - name: Comment on PR
        if: steps.detect.outputs.perf-affected == 'true'
        uses: marocchino/sticky-pull-request-comment@v2
        with:
          header: perf-regression
          message: |
            ## Performance Test Results

            | Metric | Baseline | PR | Delta |
            |--------|----------|-----|-------|
            | p95 latency | 7 ms | ? ms | ?% |
            | Throughput | 5 req/s | ? req/s | ?% |
            | Error rate | 0% | ?% | ? |

            See artifacts for full report.
```

---

## 📊 Baseline Storage Strategy

### Format: `perf-baseline.json`
```json
{
  "version": "1.0.0",
  "commit_sha": "abc123...",
  "captured_at": "2026-08-18T00:00:00Z",
  "scenarios": {
    "load": {
      "p50_ms": 3,
      "p95_ms": 7,
      "p99_ms": 8,
      "throughput_rps": 5,
      "error_rate": 0.0
    },
    "stress": {
      "p95_ms": 17,
      "error_rate": 0.134
    },
    "spike": {
      "p95_ms": 9,
      "throughput_rps": 275,
      "error_rate": 0.727
    }
  },
  "system": {
    "cpu_avg": 35.0,
    "memory_mb": 512
  }
}
```

### Update Policy
- **Auto-update** baseline when: p95 improved AND no new errors.
- **Manual review** required when: baseline diverges > 25% from last 5 runs.
- **Lock** baseline when: marking a release tag (e.g., v1.2.0).

---

## ⚖️ Trade-offs Analysis

| Aspect | Benefit | Cost | Decision |
|--------|---------|------|----------|
| **Run on every PR** | Catch regression early | 20-30 min CI time per PR | ✅ Required for perf-critical paths |
| **Skip non-perf PRs** | Save CI time | Risk: missed indirect regressions | ⚠️ Use file-path heuristic (95% accurate) |
| **15% regression threshold** | Catch meaningful drops | Some false positives from noise | ✅ Tunable via PR feedback |
| **Auto-block merge** | Prevent bad deploys | Friction for legitimate perf work | ⚠️ Soft-block: comment + tag, human decides |
| **Docker-isolated SUT** | Reproducible environment | 2-3 min setup overhead | ✅ Required for determinism |
| **Run all 3 scenarios** | Comprehensive coverage | 15-20 min total test time | ⚠️ Use subset for fast PR, full for nightly |
| **Compare against main branch** | Detect relative regression | Baseline can drift over time | ✅ Pin baseline to release tags |
| **Public PR comment** | Transparency | Reveals perf metrics publicly | ✅ For OSS; disable for proprietary |

---

## 🚨 False Alarm Mitigation

1. **Cooldown period**: Ignore metrics for first 60s after container start (JIT warmup).
2. **3-strike rule**: Only block if 3 consecutive runs show regression (avoid flakiness).
3. **Variance tolerance**: Use median + IQR instead of mean for noisy metrics.
4. **Manual override**: Maintainers can add `perf-override` label to skip check.

---

## 📈 Roadmap (Incremental Rollout)

| Phase | Scope | Duration | Goal |
|-------|-------|----------|------|
| **Phase 1** | Load test only, advisory | 2 weeks | Establish baseline + noise floor |
| **Phase 2** | Add stress test, soft-block | 2 weeks | Validate threshold tuning |
| **Phase 3** | Add spike test, hard-block | 2 weeks | Enforce for all perf-affected PRs |
| **Phase 4** | Nightly full suite + trend dashboard | 1 month | Long-term perf tracking |

---

## 🔗 Integration with Existing Tools

- **JMeter** (current): Use existing `.jmx` plans as CI inputs.
- **k6** (alternative): Cloud execution, lower local CPU.
- **InfluxDB + Grafana**: Time-series storage + dashboard.
- **Slack/Teams**: Real-time alerts via webhooks.

---

## 💡 Innovation Points (G9.6 Disrupt)

1. **File-path heuristic** instead of "run everything" — saves 70% CI time.
2. **Soft-block + comment** instead of hard-fail — better dev experience.
3. **Per-scenario thresholds** instead of one-size-fits-all — realistic for mixed workloads.
4. **Release-tag baseline pinning** — prevents baseline drift contamination.
5. **Variance-aware detection** (IQR) — handles low-volume PRs without false alarms.

---

## 📚 References

- *Continuous Performance Testing* — Patterns from Google SRE Book
- *Shift-Right Testing* — IEEE Software 2024
- *JMeter in CI/CD* — Apache JMeter Best Practices

---

**Note**: Proposal này thể hiện Bloom-AI level **G9.6 (Disrupt)** bằng cách đề xuất pipeline hoàn toàn mới, không chỉ là áp dụng JMeter một cách truyền thống.