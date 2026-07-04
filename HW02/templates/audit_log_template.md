# AI Audit Log

> File append-only. Mỗi lần agent chạy domain testing cho một FR, thêm entry mới ở CUỐI file
> theo đúng khung dưới đây — không sửa/xóa entry cũ. Một entry cho mỗi bước (0 → 6).

---

### [YYYY-MM-DD HH:MM] — <FR-ID> — Bước <n>: <tên bước>

- **Công cụ:** Cursor Agent (model: [tên model nếu biết])
- **Prompt/instruction nhận được:** [nguyên văn hoặc tóm tắt lệnh cho bước này]
- **File code đã đọc:** [danh sách file:line]
- **Output/kết luận của bước:** [tóm tắt ngắn — chi tiết đầy đủ nằm trong report.md]
- **Human review / correction:** [để trống cho đến khi người dùng review — ghi lại thay đổi
  của người dùng ở entry kế tiếp nếu có]

---

<!-- Thêm entry mới bên dưới dòng này, entry mới nhất luôn ở cuối file -->
