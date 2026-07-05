## Tiêu đề issue

```
[FR-02][Bug] API trả về 401 cho email/password rỗng thay vì 400 Bad Request
```

## Labels đề xuất

`bug`, `FR-02`, `black-box-testing`, `severity: medium`

---

```markdown
## 1. Tóm tắt (Summary)
Khi gửi request đăng nhập với trường `email` hoặc `password` bị rỗng (`""`) hoặc sai
định dạng, server trả về `401 Unauthorized` với body `{"error": "Invalid email or password"}`
thay vì `400 Bad Request`. Spec không nêu rõ HTTP status code cho trường hợp validation
thất bại — phần Expected bên dưới là **giả định của tester**, không phải từ spec.

## 2. Nguồn spec / kỳ vọng (Expected Behavior)
- Tài liệu tham chiếu: `contexts/api_specification.md` §1.2, `contexts/README.md` §2, FR-02
- Spec không nêu rõ HTTP status code cho trường hợp email/password rỗng hoặc sai định dạng.
- Phần Expected dưới đây là **giả định của tester**, được đánh dấu rõ ràng — tester tự
  quy ước rằng nên trả về `400 Bad Request` để server không truy vấn CSDL khi input đã
  không hợp lệ.
- Mức độ rõ ràng của spec: `[Spec không nêu rõ — Expected là giả định của tester]`

## 3. Hành vi thực tế quan sát được (Actual Behavior)
Mô tả thuần túy dựa trên dữ liệu Postman đã ghi nhận, KHÔNG tham chiếu source code:

| Test Case | Input | Expected (giả định tester — KHÔNG từ spec) | Actual | Status |
|---|---|---|---|---|
| TC-C1 | `email: "khonghople"` | `400 Bad Request` | `401 Unauthorized` — `{"error": "Invalid email or password"}` | ❌ |
| TC-C2 | `email: "co@ky-tu-dac-biet-!#$%@eshop.com"` | `400` hoặc `200` | `401 Unauthorized` — `{"error": "Invalid email or password"}` | ❌ |
| TC-C3 | `email: ""` (rỗng) | `400 Bad Request` | `401 Unauthorized` — `{"error": "Invalid email or password"}` | ❌ |
| TC-C4 | `password: ""` (rỗng) | `400 Bad Request` | `401 Unauthorized` — `{"error": "Invalid email or password"}` | ❌ |

## 4. Các bước tái hiện (Steps to Reproduce)
1. Gửi `POST http://localhost:3000/api/login` với body:
   ```json
   { "email": "", "password": "Test1234!" }
   ```
2. Quan sát response: `401 Unauthorized` với `{"error": "Invalid email or password"}`
3. So sánh: giả định: `400 Bad Request` với thông báo validation rõ ràng hơn

**Các bước tương tự cho các test case khác:**
- TC-C1: `{ "email": "khonghople", "password": "Test1234!" }`
- TC-C2: `{ "email": "co@ky-tu-dac-biet-!#$%@eshop.com", "password": "Test1234!" }`
- TC-C4: `{ "email": "test@eshop.com", "password": "" }`

Môi trường test: local, công cụ: Postman, thời gian giữa các request: không cần delay

## 5. Giả thuyết hành vi (Behavioral Hypothesis)
> Chỉ điền mục này nếu đã quan sát đủ nhiều lần lặp để có cơ sở. Đây là suy luận
> **black-box động** (dynamic behavioral inference) dựa trên nhiều lần thăm dò qua API,
> KHÔNG phải đọc source code.

- Giả thuyết: Server hiện tại đang xử lý validation email/password rỗng ở tầng authentication
  (kiểm tra credentials), thay vì ở tầng request validation (trước khi gọi CSDL). Cả 4 test case
  đều trả về đúng 1 response body và status code giống hệt nhau — điều này gợi ý server không
  phân biệt giữa "input không hợp lệ" và "credentials sai".
- Mức độ tin cậy: `Trung bình` — pattern rõ ràng trên 4 test case, nhưng cần thêm
  test để loại trừ trường hợp server đang cố tình treat missing/empty fields là "invalid credentials"
- Test case bổ sung cần chạy để xác nhận:
  - Test với `null` thay vì `""` cho cả hai trường
  - Test với trường hoàn toàn không có trong body (`{}`)

## 6. Mức độ ảnh hưởng (Severity/Priority)
- Severity: `Medium`
- Lý do: Không ảnh hưởng bảo mật nghiêm trọng nhưng là bug về validation best practice. Việc
  trả về `401` cho invalid input khiến client không thể phân biệt giữa "input sai format" và
  "credentials sai" — vi phạm nguyên tắc fail-fast và tốn tài nguyên server xử lý truy vấn CSDL
  không cần thiết cho request đã có thể reject sớm ở tầng validation.

## 7. Traceability
- Test Case ID liên quan (trong report.md): TC-C1, TC-C2, TC-C3, TC-C4
- Feature: FR-02 — Đăng nhập & Khóa tài khoản
- File report gốc: `testing/FR-02/report.md`

## 8. Đính kèm
- [x] Screenshot Postman request/response (đã ghi trong cột Actual của report.md)
- [ ] Export Postman collection run (nếu có)
- [ ] Log DB liên quan (nếu có, chỉ mô tả giá trị quan sát được, không đính kèm code)
```
