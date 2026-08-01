# Template: GitHub Issue (Bug Report từ Domain Testing — Black-box)

> Dùng khi agent hoàn tất Bước 7 (phân tích kết quả Postman/Actual đã điền) và phát hiện sai
> lệch giữa Expected và Actual. Agent tạo 1 issue theo khung này cho mỗi sai lệch, KHÔNG gộp
> nhiều bug không liên quan vào 1 issue. Agent điền vào khung, không tự thêm mục ngoài khung.

---

## Tiêu đề issue

Format bắt buộc:
```
[FR-XX][Bug] <Mô tả ngắn hành vi quan sát được, không suy diễn nguyên nhân>
```
Ví dụ:
```
[FR-02][Bug] Tài khoản bị khóa sau 2 lần đăng nhập sai thay vì 3 lần theo spec
```

## Labels đề xuất
`bug`, `FR-XX`, `black-box-testing`, mức độ severity (`severity: high/medium/low`)

---

```markdown
## 1. Tóm tắt (Summary)
<1–2 câu mô tả triệu chứng quan sát được — thuần mô tả hành vi, không khẳng định nguyên nhân
kỹ thuật (vd không viết "do code cộng +2", chỉ viết "bộ đếm tăng nhanh hơn dự kiến")>

## 2. Nguồn spec / kỳ vọng (Expected Behavior)
- Tài liệu tham chiếu: <api_specification.md / README.md / SRS mục #...>
- Trích đúng nội dung spec liên quan (paraphrase, không copy nguyên văn dài):
  > <tóm tắt yêu cầu, ví dụ: "khóa tài khoản sau ≥3 lần đăng nhập sai trong vòng X giây">
- Mức độ rõ ràng của spec: `[Rõ ràng từ spec]` / `[Suy ra từ thông lệ — cần xác nhận]`

## 3. Hành vi thực tế quan sát được (Actual Behavior)
Mô tả thuần túy dựa trên dữ liệu Postman đã ghi nhận, KHÔNG tham chiếu source code:

| Bước | Input | Expected | Actual | Status |
|---|---|---|---|---|
| 1 | | | | ✅/❌ |
| 2 | | | | ✅/❌ |
| 3 | | | | ✅/❌ |

## 4. Các bước tái hiện (Steps to Reproduce)
1. ...
2. ...
3. ...

Môi trường test: <local / staging>, công cụ: Postman, thời gian giữa các request: <ví dụ
~300ms / ~2 phút / đồng thời>

## 5. Giả thuyết hành vi (Behavioral Hypothesis) — nếu có
> Chỉ điền mục này nếu đã quan sát đủ nhiều lần lặp để có cơ sở. Đây là suy luận **black-box
> động** (dynamic behavioral inference) dựa trên nhiều lần thăm dò qua API, KHÔNG phải đọc
> source code.

- Giả thuyết: <ví dụ: "ngưỡng khóa có thể đang được tính sai, cần thêm test case tách biệt ở
  lần sai thứ 2 và thứ 3">
- Mức độ tin cậy: `Thấp` / `Trung bình` / `Cao`
- Test case bổ sung cần chạy để xác nhận: <mô tả>

## 6. Mức độ ảnh hưởng (Severity/Priority)
- Severity: `Critical / High / Medium / Low`
- Lý do: <ví dụ: ảnh hưởng trải nghiệm đăng nhập, có thể khóa nhầm người dùng hợp lệ>

## 7. Traceability
- Test Case ID liên quan (trong report.md): <TC-XX>
- Feature: FR-XX — <tên feature>
- File report gốc: `testing/<FR-ID>/report.md`

## 8. Đính kèm
- [ ] Screenshot Postman request/response
- [ ] Export Postman collection run (nếu có)
- [ ] Log DB liên quan (nếu có, chỉ mô tả giá trị quan sát được, không đính kèm code)
```

---

### Lưu ý cho agent khi tạo issue
- Không được viết nguyên nhân kỹ thuật cụ thể (vd tên biến, dòng code) trong issue — issue là
  sản phẩm black-box, chỉ mô tả triệu chứng + kỳ vọng theo spec + giả thuyết hành vi.
- Nếu người dùng yêu cầu thêm chi tiết implementation vào issue, agent nhắc lại ranh giới
  black-box và hỏi xác nhận trước khi thêm.
- Mỗi issue nên độc lập, dễ theo dõi tiến độ fix riêng lẻ.
