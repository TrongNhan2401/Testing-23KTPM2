# Continuous Performance Testing (Task 3 — G9.6 Disrupt)

**Sinh viên:** 23127443 — Nguyễn Hân Trần
**Ngày:** 2026-08-18
**Mức Bloom-AI:** G9.6 (Đột phá — đề xuất giải pháp mới)

---

## 1. Đề xuất là gì? (Giải thích đơn giản)

Mình muốn xây dựng một hệ thống **tự động chạy performance test mỗi khi có người đẩy code lên**.

### Vấn đề hiện tại

- Sinh viên/kỹ sư thường **chỉ chạy test chức năng** (unit test, integration test) mỗi khi push code.
- Khi deploy lên production thì **hệ thống chậm, crash, hoặc trả lỗi** vì code mới làm chậm API.
- Phát hiện trễ → tốn thời gian sửa, tốn tiền vì downtime.

### Giải pháp đề xuất

```
Mỗi khi có Pull Request → CI tự động:
  1. Xem code đụng vào phần nào
  2. Nếu đụng phần "performance quan trọng" → chạy JMeter test
  3. So sánh kết quả với bản "baseline" (bản tốt đã chốt)
  4. Nếu chậm hơn 20% → cảnh báo ngay trên PR
```

---

## 2. Vì sao cần làm vậy? (Lợi ích)

| Lợi ích | Ví dụ cụ thể |
|---------|--------------|
| **Phát hiện sớm** | Code mới làm API chậm 30% → phát hiện ngay khi mở PR, không đợi deploy |
| **Tiết kiệm thời gian** | Không cần 1 người ngồi chạy JMeter thủ công sau mỗi lần merge |
| **Đỡ tốn tiền downtime** | Tránh trường hợp production chậm → khách hàng bỏ → mất doanh thu |
| **Bằng chứng khách quan** | Có con số p95, p99 rõ ràng để mọi người cùng xem |

---

## 3. Cách hoạt động (Flow Chart)

```
Bước 1: Developer đẩy code lên GitHub (git push)
                ↓
Bước 2: GitHub Actions nhận tín hiệu, tạo PR (Pull Request)
                ↓
Bước 3: CI tự động xem: code mới đụng vào file nào?
                ↓
        ┌───────┴────────┐
        │                │
   Chỉ đụng           Đụng file
   README.md,         trong routes/,
   docs/              models/, db/
        │                │
        ↓                ↓
   BỎ QUA            CHẠY TEST
   (tiết kiệm 70%    (JMeter tự động)
    thời gian CI)
                        ↓
              Bước 4: Khởi động SUT (Docker)
                      - Dùng DB mới (reset)
                      - Cùng cấu hình production
                        ↓
              Bước 5: Chạy JMeter 3 phút
                      - Giống 3 test plan mình đã làm
                      - Lưu kết quả: p95, p99, error rate
                        ↓
              Bước 6: So sánh với baseline
                      - Lấy file JSON có sẵn (kết quả lần chạy tốt)
                      - Tính: kết quả mới - baseline
                        ↓
        ┌───────┴────────┐
        │                │
   p95 tăng < 20%      p95 tăng ≥ 20%
        │                │
        ↓                ↓
    ✅ PASS            ❌ FAIL
    Merge được         Cảnh báo PR
                       Reviwer phải xem
```

---

## 4. File cấu hình GitHub Actions

File `.github/workflows/perf-test.yml` đặt trong repo SUT, nội dung:

```yaml
name: Performance Test

# Khi nào chạy?
on:
  pull_request:
    branches: [ main, develop ]
  workflow_dispatch:  # Cho phép chạy tay

jobs:
  perf-test:
    # Chỉ chạy nếu code đụng vào file "performance quan trọng"
    if: |
      contains(github.event.pull_request.changed_files, 'routes/') ||
      contains(github.event.pull_request.changed_files, 'models/') ||
      contains(github.event.pull_request.changed_files, 'db/')

    runs-on: ubuntu-latest
    timeout-minutes: 15

    steps:
      # Bước 1: Lấy code
      - name: Checkout code
        uses: actions/checkout@v4

      # Bước 2: Cài Java cho JMeter
      - name: Setup Java
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'

      # Bước 3: Cài JMeter
      - name: Install JMeter
        run: |
          wget https://archive.apache.org/dist/jmeter/binaries/apache-jmeter-5.6.3.tgz
          tar -xzf apache-jmeter-5.6.3.tgz

      # Bước 4: Khởi động SUT (backend Node.js)
      - name: Start SUT
        run: |
          cd eshop/backend
          npm install
          npm start &
          sleep 30  # Đợi server start

      # Bước 5: Chạy 3 test plan
      - name: Run Load Test
        run: ./apache-jmeter-5.6.3/bin/jmeter -n -t test-plans/Load.jmx -l results/load.jtl

      - name: Run Stress Test
        run: ./apache-jmeter-5.6.3/bin/jmeter -n -t test-plans/Stress.jmx -l results/stress.jtl

      - name: Run Spike Test
        run: ./apache-jmeter-5.6.3/bin/jmeter -n -t test-plans/Spike.jmx -l results/spike.jtl

      # Bước 6: Phân tích kết quả
      - name: Compare with baseline
        run: |
          python3 scripts/compare-baseline.py \
            --current results/ \
            --baseline perf-baseline.json

      # Bước 7: Upload kết quả lên GitHub
      - name: Upload results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: perf-results
          path: results/
```

---

## 5. File baseline (kết quả tốt để so sánh)

Sau khi chạy test lần đầu mà pass, mình lưu lại kết quả làm "chuẩn". File `perf-baseline.json`:

```json
{
  "version": "v1.0.0",
  "date": "2026-08-18",
  "host": "GitHub Actions (ubuntu-latest)",
  "scenarios": {
    "load": {
      "p95_ms": 7,
      "p99_ms": 8,
      "error_rate_percent": 0.0,
      "avg_throughput_rps": 2.5
    },
    "stress": {
      "p95_ms": 25,
      "p99_ms": 26,
      "error_rate_percent": 0.0,
      "avg_throughput_rps": 4.2
    },
    "spike": {
      "p95_ms": 2866,
      "p99_ms": 3151,
      "error_rate_percent": 0.0,
      "peak_throughput_rps": 275
    }
  }
}
```

---

## 6. Script so sánh (đơn giản, dễ hiểu)

File `scripts/compare-baseline.py` — mỗi người đọc đều hiểu được:

```python
"""
Script so sánh kết quả mới với baseline.
Nếu p95 tăng quá 20% → FAIL.
Nếu error rate > 5% → FAIL.
"""

import json
import sys

# Ngưỡng (threshold)
P95_THRESHOLD = 1.20  # Tăng 20% là FAIL
ERROR_THRESHOLD = 5.0  # > 5% là FAIL

def compare(baseline, current):
    failed = False
    messages = []

    for scenario in ['load', 'stress', 'spike']:
        b = baseline['scenarios'][scenario]
        c = current['scenarios'][scenario]

        # So sánh p95
        ratio = c['p95_ms'] / b['p95_ms']
        if ratio > P95_THRESHOLD:
            failed = True
            msg = f"❌ {scenario}: p95 = {c['p95_ms']}ms (baseline {b['p95_ms']}ms, xuống cấp {ratio:.1%})"
        else:
            msg = f"✅ {scenario}: p95 = {c['p95_ms']}ms (baseline {b['p95_ms']}ms, OK)"

        print(msg)
        messages.append(msg)

        # So sánh error rate
        if c['error_rate_percent'] > ERROR_THRESHOLD:
            failed = True
            print(f"❌ {scenario}: error rate = {c['error_rate_percent']}% (> 5%)")

    return failed

if __name__ == '__main__':
    with open('perf-baseline.json') as f:
        baseline = json.load(f)
    with open('results/current.json') as f:
        current = json.load(f)

    if compare(baseline, current):
        sys.exit(1)  # FAIL → CI đỏ
    else:
        sys.exit(0)  # PASS
```

---

## 7. Đánh đổi (Trade-offs)

| Ưu điểm | Nhược điểm |
|---------|------------|
| Phát hiện regression sớm | Tốn tiền CI (15 phút × 100 PR/tháng = ~25 giờ GitHub Actions) |
| Không cần người chạy tay | Có thể bị "báo động giả" (false alarm) do JMeter chạy máy ảo yếu hơn máy thật |
| Có số liệu khách quan | Test 1-2 phút không detect được memory leak (cần endurance test) |
| Tự động hóa 100% | Cần người maintain script so sánh khi SUT thay đổi endpoint |

### Cách giảm nhược điểm

- **Bỏ qua PR không đụng code**: tiết kiệm **70%** thời gian CI (chỉ chạy khi đụng `routes/`, `models/`, `db/`)
- **Cho phép retry 1 lần**: nếu fail do máy CI yếu, cho chạy lại 1 lần trước khi báo FAIL
- **Dùng máy CI mạnh hơn**: `runs-on: ubuntu-latest-4-cores` thay vì free tier

---

## 8. Lộ trình triển khai (4 giai đoạn)

### Giai đoạn 1 (1-2 tuần): Chạy thử nghiệm
- Chạy thủ công từ workflow_dispatch
- Đo thời gian, chi phí CI
- Check: máy CI có kết quả giống máy thật không?

### Giai đoạn 2 (2-3 tuần): Auto-trigger
- Tự động chạy khi mở PR
- Chỉ chạy nếu đụng `routes/`, `models/`, `db/`
- Gửi comment vào PR

### Giai đoạn 3 (1 tháng): Baseline management
- Sau khi merge → tự động cập nhật baseline
- Lưu baseline theo version tag (v1.0, v1.1, v2.0)
- Cho phép rollback baseline

### Giai đoạn 4 (ongoing): Mở rộng
- Thêm endurance test (15 phút)
- Tích hợp k6 (alternative cho JMeter, nhanh hơn)
- Dùng GitHub Actions matrix: chạy với 3 kích thước máy khác nhau

---

## 9. Điểm mới sáng tạo (Innovation)

Mình đề xuất 5 ý tưởng mới:

1. **File-path heuristic (Heuristic đường dẫn)**: Chỉ chạy test khi đụng file performance quan trọng. Tiết kiệm 70% CI time.
2. **Tự động tạo comment trên PR**: Không cần check log → kết quả hiện ngay trên PR.
3. **Smart threshold theo scenario**: Load test cho p95 < 50ms, Stress test cho p95 < 100ms (không dùng 1 ngưỡng chung).
4. **Baseline theo release tag**: Pin baseline với `v1.0.0`, `v1.1.0` → không bị drift.
5. **IQR + 3-strike detection**: So sánh với 3 lần chạy gần nhất, không so sánh 1 lần → giảm báo động giả.

---

## 10. Tóm tắt

Đề xuất của mình là **một hệ thống đơn giản, dễ hiểu** dành cho sinh viên:

- ✅ Tự động chạy performance test mỗi PR
- ✅ So sánh với baseline (kết quả đã chạy tay 1 lần)
- ✅ Fail nếu chậm hơn 20% hoặc error rate > 5%
- ✅ Bỏ qua PR không đụng code quan trọng
- ✅ Có script so sánh dễ đọc (Python 30 dòng)

Đây là bước đầu để **ngăn performance regression ngay từ giai đoạn dev**, không cần đợi đến production mới phát hiện.

---

**Tài liệu tham khảo:**
- GitHub Actions Documentation: https://docs.github.com/en/actions
- JMeter CLI Mode: https://jmeter.apache.org/usermanual/get-started.html#non_gui
- Spec HW05 Section 6 (Task 3 Continuous Performance Testing)
