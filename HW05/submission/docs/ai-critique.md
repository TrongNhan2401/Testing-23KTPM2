# AI Critique — HW05 Performance Testing (200-300 từ)

**Student ID:** 23127443
**Date:** 2026-08-18

---

## Lỗi phát hiện trong quá trình Prompting

Với nhiều lỗi xuất hiện quá trình tương tác giữa tôi và AI trong session dài cũng bộc lộ **ba lỗi nghiêm trọng liên quan đến JMX configuration** mà AI ban đầu không phát hiện ra. **Thứ nhất**, Stress Test ban đầu có test-design flaw nghiêm trọng: Setup thread chỉ `POST /api/register` để tạo user mới, nhưng KHÔNG revert password về ban đầu. Sau lần chạy đầu, toàn bộ users đã bị đổi sang `new_password`. Lần chạy hai với cùng DB, request `login correct password` fail 100% với HTTP 401 vì user không còn dùng password ban đầu. AI giải thích "đây là expected behavior", nhưng thực tế đây là test flaw. **Thứ hai**, khi Spike Test fail 100% với HTTP 400, AI vội kết luận "đây là bug #6 của SUT" mà không verify lại bằng curl thủ công. Sau khi tôi test trực tiếp với body đúng schema, server trả 200 OK - chứng minh SUT không bug. Root cause là JMX: Header Manager local REPLACE global Content-Type, BSF PreProcessor deprecated, và JavaScript syntax chạy trong Groovy engine. **Thứ ba**, AI đã nhiều lần suggest "use RegexExtractor thay JSONExtractor" hay "remove Duration Assertion" nhưng quên kiểm tra liệu những thay đổi này có thực sự giải quyết root cause hay chỉ che giấu vấn đề. Bài học cốt lõi: AI rất giỏi generate boilerplate nhưng yếu khi đào sâu vào nguyên nhân thực sự; người dùng phải liên tục push back và verify thủ công.

---

