---
name: ai-audit-logger
description: >
  Append a full, verbatim audit-log entry of the most recent AI interaction (tool used,
  timestamp, the user's prompt, and the AI's complete output) to an audit log file. Trigger
  whenever the user asks to "log this", "save this to the AI audit report", "ghi log lại",
  or right after using another skill (e.g. gui-checklist-runner) when the user wants the
  interaction recorded. Generic — not tied to any specific coursework or app.
---

# AI Audit Logger

## Mục đích

Ghi lại **toàn bộ** nội dung của một lần tương tác AI — không tóm tắt, không rút gọn — thành
một entry trong file log audit, để phục vụ yêu cầu minh bạch quy trình dùng AI (ví dụ AI Audit
Report trong các bài tập/báo cáo yêu cầu khai báo đầy đủ prompt và output).

## Input

1. **File log đích** — đường dẫn file audit log hiện có (hoặc tạo mới nếu người dùng xác nhận
   chưa có file).
2. **Nội dung cần log** — mặc định là: (a) prompt/yêu cầu gần nhất của người dùng, và (b) toàn
   bộ output AI vừa sinh ra ở lượt trả lời trước đó (bao gồm mọi bảng, mọi dòng, không cắt bớt).
   Nếu người dùng chỉ định lượt tương tác khác (không phải lượt gần nhất), dùng đúng lượt đó.

## Quy trình

### Bước 1 — Xác định file log đích
Nếu người dùng chưa nói rõ, hỏi đường dẫn file log. Nếu file đã tồn tại, đọc nội dung hiện có
để append tiếp (không ghi đè, không xóa log cũ).

### Bước 2 — Lấy nguyên văn prompt và output cần log
Copy **nguyên văn** — không diễn giải lại, không tóm tắt, không rút gọn output dù dài. Nếu
output có bảng, giữ nguyên toàn bộ bảng.

### Bước 3 — Append entry mới vào cuối file log theo format bên dưới

### Bước 4 — Xác nhận với người dùng
Báo lại đã ghi entry số mấy, vào file nào, để người dùng có thể mở kiểm tra lại.

## Nguyên tắc bắt buộc

- **Không tóm tắt output** — log phải là bản sao đầy đủ, verbatim, để tính minh bạch/kiểm chứng
  được giữ nguyên.
- **Không sửa nội dung log cũ** — chỉ append, không xóa/sửa các entry đã ghi trước đó trừ khi
  người dùng yêu cầu rõ ràng.
- Mỗi entry phải có timestamp và định danh công cụ AI đã dùng.

## Output Format (mỗi entry append vào file log)

```markdown
---
### AI Interaction Log #[số thứ tự]
- Công cụ AI: [tên công cụ, VD: Claude]
- Thời gian: [YYYY-MM-DD HH:MM]

**Prompt của người dùng (nguyên văn):**

[toàn bộ prompt gốc]

**Output của AI (nguyên văn, đầy đủ):**

[toàn bộ output — copy nguyên văn, không rút gọn, giữ nguyên bảng/định dạng]
---
```
