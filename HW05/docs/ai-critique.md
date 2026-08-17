# AI Critique — HW05 Performance Testing (200-300 từ)

**Student ID:** 23127443
**Date:** 2026-08-18

---

## Bài phê bình AI (200–300 từ)

Trong quá trình thực hiện HW05, AI đã hỗ trợ phân tích nhưng mắc **bốn loại lỗi nghiêm trọng** mà tôi phải tự sửa bằng cách đọc lại JTL logs thủ công.

**Thứ nhất**, AI đề xuất ngưỡng p95 < 200ms cho Load Test, nhưng raw data cho thấy p95 thực tế chỉ là **7ms** — AI lấy "industry standard" mà không kiểm tra thực tế SUT, dẫn đến ngưỡng lỏng gấp 28 lần.

**Thứ hai**, AI đề xuất "add connection pooling", "rate limiting với backoff", và "request queuing cho burst" để giải quyết 13.4% error rate trong Stress Test. Tuy nhiên, latency p99 chỉ là 4ms — không có pool exhaustion. Bug thật là `/api/reset-password` luôn trả 400 (logic bug), không phải scaling issue.

**Thứ ba**, AI nhầm lẫn đơn vị throughput (đề xuất >50 req/s trong khi ConstantThroughputTimer cố định 6 req/min), cho thấy AI đọc thông số cấu hình hời hợt.

**Thứ tư**, AI phớt lờ Bug #3 (403 thay vì 429) và Bug #6 (admin import 100% fail) — những phát hiện quan trọng nhất — vì chúng không nằm trong "performance pattern" AI được train.

**Bài học**: AI giỏi phát hiện pattern nhưng yếu khi verify con số và bỏ sót logic bug ngoài phạm vi quen thuộc. Cần luôn đối chiếu raw log và hiểu code SUT trước khi chấp nhận khuyến nghị.

---

*(Word count: 268 từ — nằm trong khoảng yêu cầu 200-300 từ)*