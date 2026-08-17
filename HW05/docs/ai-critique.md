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

## Phần bổ sung — Lỗi phát hiện trong quá trình Prompting (200-300 từ)

Ngoài bốn loại lỗi phân tích ở trên, quá trình tương tác giữa tôi và AI trong session dài cũng bộc lộ **ba lỗi nghiêm trọng liên quan đến JMX configuration** mà AI ban đầu không phát hiện ra. **Thứ nhất**, Stress Test ban đầu có test-design flaw nghiêm trọng: Setup thread chỉ `POST /api/register` để tạo user mới, nhưng KHÔNG revert password về ban đầu. Sau lần chạy đầu, toàn bộ users đã bị đổi sang `new_password`. Lần chạy hai với cùng DB, request `login correct password` fail 100% với HTTP 401 vì user không còn dùng password ban đầu. AI giải thích "đây là expected behavior", nhưng thực tế đây là test flaw. **Thứ hai**, khi Spike Test fail 100% với HTTP 400, AI vội kết luận "đây là bug #6 của SUT" mà không verify lại bằng curl thủ công. Sau khi tôi test trực tiếp với body đúng schema, server trả 200 OK — chứng minh SUT không bug. Root cause là JMX: Header Manager local REPLACE global Content-Type, BSF PreProcessor deprecated, và JavaScript syntax chạy trong Groovy engine. **Thứ ba**, AI đã nhiều lần suggest "use RegexExtractor thay JSONExtractor" hay "remove Duration Assertion" nhưng quên kiểm tra liệu những thay đổi này có thực sự giải quyết root cause hay chỉ che giấu vấn đề. Bài học cốt lõi: AI rất giỏi generate boilerplate nhưng yếu khi đào sâu vào nguyên nhân thực sự; người dùng phải liên tục push back và verify thủ công.

---

*(Word count bổ sung: ~270 từ — nằm trong khoảng yêu cầu 200-300 từ)*