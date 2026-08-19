# AI Audit Logger — Skill

## Mục đích
Sau mỗi lần AI hỗ trợ (thiết kế test plan, phân tích log, đề xuất mô hình...), tự động ghi lại 1 entry vào file `ai-audit-log.md` tại thư mục gốc của project, phục vụ yêu cầu AI Audit Report của HW05.

## Khi nào chạy
Ngay sau khi AI trả lời xong một yêu cầu có ý nghĩa (không log các câu hỏi vặt/xác nhận nhỏ). Nếu `ai-audit-log.md` chưa tồn tại, tạo mới với tiêu đề `# AI Audit Log`.

## Format entry — PHẢI theo đúng cấu trúc sau, append vào cuối file

```
## [YYYY-MM-DD HH:MM] <Tên AI Tool>

**Prompt:**
<nguyên văn prompt của người dùng>

**Output:**
<nguyên văn hoặc toàn bộ nội dung AI trả lời>

---
```

## Quy tắc

1. **Datetime**: lấy giờ hệ thống thực tế lúc ghi log, định dạng `YYYY-MM-DD HH:MM`, múi giờ GMT+7.
2. **Tên AI Tool**: ghi rõ tên + phiên bản/model nếu biết (vd: `Claude Sonnet 5`, `ChatGPT-4o`, `Gemini 2.5 Pro`).
3. **Prompt**: chép nguyên văn, không tóm tắt, không chỉnh sửa.
4. **Output**: chép nguyên văn phần AI trả lời. Nếu output quá dài (code, bảng lớn...), có thể giữ nguyên toàn bộ — không cắt bớt, vì đề yêu cầu log đầy đủ.
5. Luôn **append**, không bao giờ sửa hoặc xoá entry cũ.
6. Mỗi entry cách nhau bằng dòng `---`.
7. Không tự thêm phần đánh giá/nhận xét — file này chỉ ghi lại prompt và output thô, phần review là do người dùng tự viết riêng.

## Ví dụ

```
# AI Audit Log

## [2026-08-16 14:30] Claude Sonnet 5

**Prompt:**
Thiết kế test plan JMeter cho Load Testing endpoint GET /api/orders/my-orders, 50 virtual users, ramp-up 30s.

**Output:**
[Toàn bộ nội dung AI trả lời được dán nguyên văn tại đây]

---

## [2026-08-16 15:10] Claude Sonnet 5

**Prompt:**
Phân tích file result.jtl này và cho biết p95 latency.

**Output:**
[Toàn bộ nội dung AI trả lời được dán nguyên văn tại đây]

---
```
