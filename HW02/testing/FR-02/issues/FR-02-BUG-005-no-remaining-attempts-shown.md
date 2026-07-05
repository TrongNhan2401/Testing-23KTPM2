## Tiêu đề issue

```
[FR-02][Bug] UI không hiển thị số lần thử còn lại trước khi tài khoản bị khóa
```

## Labels đề xuất

`bug`, `FR-02`, `functional-testing`, `ux`, `severity: medium`

---

```markdown
## 1. Tóm tắt (Summary)
Khi người dùng nhập sai mật khẩu nhiều lần liên tiếp trên giao diện đăng nhập, hệ thống
KHÔNG cung cấp bất kỳ phản hồi nào về:

- Số lần thử còn lại trước khi tài khoản bị tạm khóa.
- Thời điểm có thể thử lại sau khi đã bị khóa (không có đồng hồ đếm ngược hoặc con số ước lượng).

Cả ba lần sai đều hiển thị cùng một thông báo chung: "Email hoặc mật khẩu không chính xác".
Khi đạt ngưỡng khóa, thông báo đổi thành "Tài khoản đã bị khóa. Vui lòng thử lại sau."
nhưng không có thông tin về khoảng thời gian chờ.

## 2. Nguồn spec / kỳ vọng (Expected Behavior)
- Tài liệu tham chiếu: `contexts/README.md` §2, FR-02
- Trích đúng nội dung spec liên quan (paraphrase):
  > "Sau khi đăng nhập sai từ 3 lần trở lên, tài khoản bị tạm khóa 30 giây. Hệ thống trả
  > về thông báo lỗi phù hợp; không để lộ chi tiết nguyên nhân."
- Spec không quy định cụ thể **nội dung** thông báo, nhưng yêu cầu thông báo phải **phù hợp**.
- Phần Expected dưới đây là **giả định UX của tester** (best-practice): người dùng nên được
  biết còn bao nhiêu lần thử và khi nào có thể thử lại — đây không phải yêu cầu cứng từ
  spec, nhưng là đề xuất trải nghiệm hợp lý.
- Mức độ rõ ràng của spec: `[Spec không quy định cụ thể — Expected là giả định UX]`

## 3. Hành vi thực tế quan sát được (Actual Behavior)
Mô tả thuần túy dựa trên quan sát trên giao diện, KHÔNG tham chiếu source code:

| Bước | Thao tác | Expected (giả định UX — KHÔNG từ spec cứng) | Actual | Status |
|---|---|---|---|---|
| 1 | Truy cập `/login`, nhập email đúng + password sai lần 1 | Thông báo lỗi + (khuyến nghị) "Bạn còn 2 lần thử trước khi tài khoản bị khóa" | Thông báo: "Email hoặc mật khẩu không chính xác" — không có thông tin số lần còn lại | ❌ |
| 2 | Sai lần 2 | Tương tự bước 1, với cảnh báo mạnh hơn (khuyến nghị: "Bạn còn 1 lần thử") | Cùng thông báo như lần 1 — không phân biệt | ❌ |
| 3 | Sai lần 3 (đạt ngưỡng) | "Tài khoản đã bị khóa. Vui lòng thử lại sau khoảng 30 giây." (kèm đếm ngược) | "Tài khoản đã bị khóa. Vui lòng thử lại sau." — không có thời gian cụ thể, không có đếm ngược | ❌ |
| 4 | Trong lúc đang khóa, thử lại | Duy trì thông báo đang khóa, có thể kèm đếm ngược | Từ chối đúng nhưng thông báo chung chung | ⚠️ |
| 5 | Sau khi hết thời gian khóa | Báo "Đã hết khóa, bạn có thể đăng nhập" hoặc tự động cho đăng nhập | Cho đăng nhập nhưng UI không chủ động phản hồi | ⚠️ |

## 4. Các bước tái hiện (Steps to Reproduce)
1. Truy cập `http://localhost:5173/login` (Frontend Web EShop).
2. Nhập `Email = test@eshop.com` + `Password = SaiLan1!` → bấm "Đăng nhập".
3. Quan sát thông báo lỗi → không thấy số lần thử còn lại.
4. Lặp lại với password sai khác (`SaiLan2!`, `SaiLan3!`).
5. Ở lần thứ 3 → tài khoản bị khóa.
6. Quan sát thông báo khóa → không có đếm ngược / thời gian chờ cụ thể.

Môi trường test: local, công cụ: trình duyệt Chrome (DevTools Network tab để theo dõi request).

## 5. Giả thuyết hành vi (Behavioral Hypothesis)
> Đây là suy luận **black-box** dựa trên quan sát UI và response API — KHÔNG đọc source code.

- Giả thuyết: Giao diện hiện chỉ hiển thị thông báo lỗi "email hoặc mật khẩu không chính xác"
  cho mọi lần sai, và thông báo khóa chung chung khi đạt ngưỡng. Có thể component LoginForm
  đang hiển thị thông báo dựa trên message string từ response mà không tính đến việc parse
  thêm metadata (như số lần thử còn lại hoặc thời gian khóa còn lại).
- Mức độ tin cậy: `Trung bình` — pattern rõ qua test UI; cần kiểm tra response network để
  xác nhận server có trả thêm metadata hay không.
- Test case bổ sung cần chạy để xác nhận:
  - Mở DevTools Network, đăng nhập sai 3 lần, kiểm tra response cuối: có trường
    `retry_after_seconds` / `locked_until` / `remaining_attempts` không?
  - Quan sát thử sau khi hết khóa: UI có tự thay đổi thông báo khi countdown kết thúc không?

## 6. Mức độ ảnh hưởng (Severity/Priority)
- Severity: `Medium`
- Lý do: Không ảnh hưởng bảo mật (server vẫn khóa đúng, chỉ thiếu UX feedback). Tuy nhiên
  gây trải nghiệm kém cho người dùng hợp lệ — họ không biết còn bao nhiêu lần thử hoặc
  khi nào có thể đăng nhập lại. Một người dùng hợp lệ quên mật khẩu có thể bị khóa vĩnh
  viễn (về mặt tâm lý) trước khi nhớ ra mật khẩu đúng.

## 7. Traceability
- Test Case ID liên quan (trong report.md):
  - Functional: TC-UI-D1, TC-UI-D2, TC-UI-D3, TC-UI-D6 (FAIL)
  - Functional: TC-UI-D4, TC-UI-D5 (WARN)
- Feature: FR-02 — Đăng nhập & Khóa tài khoản
- File report gốc: `testing/FR-02/report.md`
- Loại test: Functional Testing (UI) — bổ sung cho Domain Testing API ở Bước 7

## 8. Đính kèm
- [x] Screenshot UI trước/sau khi nhập sai (đã trích trong bảng Section 9)
- [ ] Export Postman collection run (không áp dụng — test trên UI)
- [ ] Log DB liên quan (không thuộc phạm vi — bug thuộc tầng UI/UX)
```

---

## Lưu ý cho agent khi tạo issue

- Bug này thuộc loại **Functional Testing (UI)**, không phải black-box API. Vẫn giữ ranh giới
  **không tham chiếu source code component** — chỉ mô tả triệu chứng quan sát được trên UI.
- Đây không phải bug "vi phạm spec" cứng (spec không quy định hiển thị số lần còn lại), nhưng
  là đề xuất UX rõ ràng. Severity `Medium` là phù hợp.
- Khi fix: agent nhắc dev rằng có thể tận dụng `locked_until` hoặc `login_attempts` đã có
  trong response của một số endpoint — nhưng đây chỉ là gợi ý phạm vi, không đi vào chi tiết
  implementation.
