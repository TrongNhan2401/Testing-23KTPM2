## Tiêu đề issue

```
[FR-02][Bug] Bộ đếm login_attempts không reset về 0 khi đăng nhập thành công
```

## Labels đề xuất

`bug`, `FR-02`, `black-box-testing`, `severity: high`

---

```markdown
## 1. Tóm tắt (Summary)
Sau khi đăng nhập thành công, trường `login_attempts` trong response body vẫn giữ giá trị
cao (ví dụ: `4`) thay vì được reset về `0`. Điều này gây ra hành vi không nhất quán
trong cơ chế khóa tài khoản — tài khoản có thể bị khóa sớm hơn dự kiến vì bộ đếm tích
lũy từ nhiều lần test mà không được reset.

## 2. Nguồn spec / kỳ vọng (Expected Behavior)
- Tài liệu tham chiếu: `contexts/README.md` §2, FR-02 (dòng 38–44)
- Trích đúng nội dung spec liên quan (paraphrase, không copy nguyên văn dài):
  > Sau mỗi lần đăng nhập sai, hệ thống tăng bộ đếm lên đúng 1 đơn vị.
  > Sau khi đăng nhập thành công, bộ đếm nên được reset về 0 để người dùng có thể
  > thử lại từ đầu (theo nguyên tắc cơ bản của cơ chế lockout).
- Mức độ rõ ràng của spec: `[Suy ra từ thông lệ — cần xác nhận]`
  > Spec không nêu rõ cơ chế reset bộ đếm khi login đúng, nhưng đây là hành vi tiêu
  > chuẩn của mọi hệ thống account lockout hợp lý. Nếu không reset, người dùng có thể
  > bị khóa ngay lần sai tiếp theo dù đã login đúng nhiều lần.

## 3. Hành vi thực tế quan sát được (Actual Behavior)
Mô tả thuần túy dựa trên dữ liệu Postman đã ghi nhận, KHÔNG tham chiếu source code:

| Test Case | Mô tả | Response `login_attempts` | Expected | Status |
|---|---|---|---|---|
| TC-A1 | Login đúng (trạng thái sạch) | `2` | `0` | ❌ |
| TC-D5 | Login đúng sau 1 lần sai | `4` (tích lũy từ nhiều lần test) | `0` hoặc `1` | ❌ |
| TC-D6 | Login đúng sau 2 lần sai | `4` | `0` hoặc `2` | ❌ |
| TC-D7 | Login đúng sau khi hết khóa | `4` | `0` hoặc `1` | ❌ |

> **Quan sát quan trọng:** Ngay cả TC-A1 (login đúng đầu tiên, không có lần sai trước đó)
> đã trả về `login_attempts: 2`. Giá trị này gợi ý bộ đếm tồn tại từ các lần test trước
> đó trong cùng môi trường và không bao giờ được reset về 0.

## 4. Các bước tái hiện (Steps to Reproduce)
1. Gọi `POST /api/login` với `{ "email": "test@eshop.com", "password": "Test1234!" }`
2. Quan sát response body — tìm trường `login_attempts`
3. So sánh: `login_attempts` vẫn là giá trị cũ (ví dụ: `2`), KHÔNG phải `0`

**Biến thể:**
- Sau khi chuỗi login sai (TC-D1→D2→D3), chờ hết khóa, login đúng → `login_attempts` vẫn cao
- Sau khi reset bằng cách restart server, login đúng → `login_attempts` = `0` hoặc `1`

Môi trường test: local, công cụ: Postman, thời gian giữa các request: không cần delay

## 5. Giả thuyết hành vi (Behavioral Hypothesis)
> Chỉ điền mục này nếu đã quan sát đầy đủ nhiều lần lặp để có cơ sở. Đây là suy luận
> **black-box động** (dynamic behavioral inference) dựa trên nhiều lần thăm dò qua API,
> KHÔNG phải đọc source code.

- Giả thuyết: Có hai vấn đề liên quan nhưng riêng biệt:
  1. Bộ đếm `login_attempts` **không reset khi login đúng** — đây là bug cốt lõi
  2. Bug này kết hợp với việc bộ đếm tích lũy qua nhiều lần test (do không reset khi
     server restart hoặc không có cơ chế auto-reset) dẫn đến hành vi khóa ở lần 2
     (FR-02-BUG-002).
  - Nếu `login_attempts` đang là `3` từ lần test trước, lần sai tiếp theo sẽ là lần 4
    → khóa. Nhưng nếu bộ đếm reset khi login đúng, lần sai tiếp theo phải là lần 1 → 3
    mới khóa, đúng theo spec.
- Mức độ tin cậy: `Cao` — quan sát nhất quán qua nhiều test case trong cùng session test.
  Giá trị `login_attempts: 4` sau login đúng (TC-D5/TC-D6) là bằng chứng trực tiếp.
- Test case bổ sung cần chạy để xác nhận:
  - Register tài khoản mới hoàn toàn → test chuỗi sai 1→2→3 → khóa xảy ra ở lần nào?
    Nếu khóa đúng ở lần 3 → xác nhận bug là "không reset" chứ không phải "ngưỡng sai".
  - Sau login đúng, kiểm tra ngay `login_attempts` trong response → có phải `0` không?

## 6. Mức độ ảnh hưởng (Severity/Priority)
- Severity: `High`
- Lý do: Đây là root cause (nguyên nhân gốc) của nhiều bug khác trong FR-02:
  - Gây ra khóa sớm ở lần 2 (FR-02-BUG-002) vì bộ đếm tích lũy
  - Gây ra hành vi không nhất quán khi test từ trạng thái sạch vs. từ session cũ
  - Người dùng thực tế có thể bị khóa tài khoản vĩnh viễn (hoặc rất lâu) nếu bộ đếm
    không bao giờ reset

## 7. Traceability
- Test Case ID liên quan (trong report.md): TC-A1, TC-D5, TC-D6, TC-D7, TC-D8
- Feature: FR-02 — Đăng nhập & Khóa tài khoản
- File report gốc: `testing/FR-02/report.md`
- Liên quan đến: FR-02-BUG-002 (bị khóa sau 2 lần sai) — bug này có thể là hệ quả của
  bug không reset bộ đếm

## 8. Đính kèm
- [x] Screenshot Postman request/response (đã ghi trong cột Actual của report.md)
- [ ] Export Postman collection run (nếu có)
- [ ] Log DB liên quan (nếu có, chỉ mô tả giá trị quan sát được — `"login_attempts": 4`
  sau login đúng — không đính kèm code)
```
