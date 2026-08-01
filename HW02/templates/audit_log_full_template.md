# audit-log-full.md — Nhật ký đầy đủ Prompt & AI Output

> File này KHÁC với `audit-log.md` (bản tóm tắt append-only theo từng bước quy trình). File
> này lưu **toàn văn** prompt gửi cho AI và toàn văn output AI trả về, phục vụ việc dựng lại
> chính xác phần "AI Usage Declaration" khi làm báo cáo (không phải nhớ lại/diễn giải).
>
> Nguyên tắc: append-only — không sửa/xóa entry cũ, chỉ thêm entry mới. Nếu cần đính chính,
> thêm entry mới ghi rõ "Đính chính cho entry #XX".

---

## Cách dùng file này

1. Mỗi lần bạn hoặc thành viên nhóm dùng một AI tool (Claude, ChatGPT, Gemini, GitHub Copilot,
   IDE AI assistant...) cho bất kỳ phần nào của assignment/group project, tạo 1 entry mới theo
   khung bên dưới **ngay trong lúc làm**, không đợi đến cuối mới tái hiện lại.
2. Copy nguyên văn prompt đã gửi và nguyên văn phần output đã dùng — không tóm tắt, không diễn
   giải lại bằng lời của mình ở phần này (phần diễn giải để ở mục "Ghi chú sử dụng").
3. Nếu output quá dài (ví dụ cả 1 file code), có thể dán link tới commit/file cụ thể kèm
   khoảng dòng, thay vì dán lại toàn bộ — nhưng phải trỏ được tới bản gốc chính xác.

---

## Khung 1 entry

```markdown
### Entry #<số thứ tự tăng dần, không trùng>

- **Thời gian**: <YYYY-MM-DD HH:MM, theo giờ máy bạn>
- **Người thực hiện**: <tên thành viên>
- **Công cụ AI**: <Claude / ChatGPT / Gemini / Copilot / khác — ghi rõ model nếu biết>
- **Hạng mục liên quan**: <FR-XX / Group10-Week04-Report / migrate-mongo script / ...>
- **Mục đích**: <1 câu — vì sao dùng AI ở bước này>

#### Prompt (nguyên văn, đầy đủ)
```
<paste toàn bộ prompt đã gửi, không cắt bớt>
```

#### AI Output (nguyên văn, đầy đủ hoặc link chính xác)
```
<paste toàn bộ output đã dùng, không cắt bớt>
```
(Nếu quá dài: link tới file/commit + số dòng, ví dụ `src/auth.js#L20-L45` tại commit `abc123`)

#### Mức độ sử dụng output
- [ ] Dùng nguyên văn không chỉnh sửa
- [ ] Dùng làm nền, có chỉnh sửa thủ công (mô tả phần đã sửa)
- [ ] Chỉ tham khảo ý tưởng, tự viết lại hoàn toàn
- [ ] Dùng để review/phát hiện lỗi (không tạo nội dung mới)

#### Ghi chú sử dụng (diễn giải bằng lời của bạn — phần này được phép tóm tắt)
<vd: "Dùng để phát hiện race condition trong API login, sau đó tự đề xuất fix và tự viết đoạn
runAsync wrapper, AI không viết trực tiếp phần fix cuối cùng.">

---
```

## Ví dụ đã điền (tham khảo)

```markdown
### Entry #1

- **Thời gian**: 2026-07-05 14:30
- **Người thực hiện**: Nhân
- **Công cụ AI**: Claude (claude.ai)
- **Hạng mục liên quan**: FR-02 — Login & Account Lockout
- **Mục đích**: Phân tích nguyên nhân hành vi bất nhất khi test bộ đếm khóa tài khoản qua Postman

#### Prompt (nguyên văn, đầy đủ)
```
Bạn có thể giải thích tại sao tôi gặp hiện tượng này khi thực hiện blackbox testing
hay không: (Tôi test bằng postman) ...
```

#### AI Output (nguyên văn, đầy đủ hoặc link chính xác)
```
Chào Nhân, đây là một bug khá tinh vi kết hợp giữa race condition và lỗi logic của
bộ đếm...
```

#### Mức độ sử dụng output
- [x] Chỉ tham khảo ý tưởng, tự viết lại hoàn toàn

#### Ghi chú sử dụng
Dùng để hiểu nguyên nhân race condition, tự viết lại phần phân tích trong report bằng
lời của mình, không copy nguyên văn giải thích của AI vào báo cáo.
```

---

## Bảng tổng hợp nhanh (cập nhật song song, để dễ nhìn tổng quan)

| Entry # | Thời gian | Người | Công cụ | Hạng mục | Mức độ sử dụng |
|---|---|---|---|---|---|
| 1 | | | | | |

---

## Lưu ý khi dựng lại log retroactive (hồi tố)

Vì log hiện tại đang thiếu, khi tái tạo lại từ lịch sử ChatGPT/Gemini/IDE:
- Ghi rõ ở đầu file dòng: `> Các entry #1–#N được tái tạo hồi tố từ lịch sử chat ngày
  <ngày tái tạo>, không phải ghi trực tiếp tại thời điểm sử dụng.`
- Với mỗi entry hồi tố, cố gắng lấy timestamp gốc từ tool (ChatGPT/Gemini đều có timestamp
  trong lịch sử chat, IDE có thể lấy từ log/commit time) thay vì đoán.
- Nếu không thể xác định chính xác thời gian gốc, ghi `[Ước lượng]` cạnh thời gian thay vì bịa
  một giờ cụ thể.
