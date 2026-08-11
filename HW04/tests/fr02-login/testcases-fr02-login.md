# FR-02 — Bảng test case chuẩn hóa cho UI Automation

> **Feature:** FR02 — Login & Account Lockout
> **SUT URL:** `http://localhost:5173/`
> **Trang test:** `/login` (render form "Sign In")
> **Tài khoản thử nghiệm (theo README):** `test@eshop.com` / `Test1234!`
> **Phương pháp:** Trích từ `sources_testcase/FR02.md` (EP + BVA). Chỉ chọn **12 case** phù hợp với UI Automation (không bao gồm toàn bộ 28 case API).
> **Ghi chú về DOM:** Form thực tế có 2 input: `Username` + `Mật khẩu` (không phải email + password như API). `Username` chấp nhận email. `Mật khẩu` có `type="text"` (không phải `password`) — quan sát đáng chú ý.

## Bảng test case chuẩn (12 cases)

| #   | id          | type     | input (Username / Mật khẩu)                                       | expected (UI)                                                                                                  | note                                                                                  |
| --- | ----------- | -------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| 1   | TC-UI-A1    | positive | `test@eshop.com` / `Test1234!`                                    | Submit thành công → URL chuyển khỏi `/login` (về `/` hoặc `/cart`); không hiển thị error message                | EC1 — Happy path đăng nhập                                                            |
| 2   | TC-UI-B1    | negative | `test@eshop.com` / `SaiMatKhau123!`                               | Vẫn ở `/login`; hiển thị error message chung (không phân biệt email/password sai)                              | EC2 — Sai password                                                                     |
| 3   | TC-UI-B2    | negative | `khongtonTai@eshop.com` / `BatKy123!`                             | Vẫn ở `/login`; hiển thị **cùng** error message như TC-UI-B1 (không tiết lộ email tồn tại hay không)            | EC3 — Email không tồn tại — kiểm tra không phân biệt message với B1                  |
| 4   | TC-UI-C1    | negative | `khonghople` / `Test1234!`                                        | HTML5 validation chặn submit ngay (vì field không có `type="email"` → không có native validation → vẫn submit)  | EC4 — Email sai format. Lưu ý: input Username là `type="text"` nên KHÔNG có HTML5 email validation |
| 5   | TC-UI-C2    | edge     | `<script>alert(1)</script>@eshop.com` / `Test1234!`               | Vẫn ở `/login`; KHÔNG có popup script chạy; error message hiển thị an toàn (escape được)                        | BV-P4 — Thăm dò XSS injection                                                         |
| 6   | TC-UI-C3    | edge     | ` ` (chỉ khoảng trắng) / `Test1234!`                             | Vẫn ở `/login`; error message hiển thị                                                                         | BV-P6 — Whitespace-only input                                                         |
| 7   | TC-UI-C4    | negative | (rỗng) / `Test1234!`                                              | HTML5 `required` chặn submit ngay; URL không đổi                                                               | EC5 — Username rỗng. Cần verify xem có `required` chặn được hay không                  |
| 8   | TC-UI-D1    | edge     | Sai password 3 lần liên tiếp với `test@eshop.com`                 | Ở lần sai thứ 3 → error message (không rõ là "khóa" hay "sai pass" — quan sát UI)                              | EC9 — Lockout boundary. Lưu ý: spec yêu cầu "từ 3 lần trở lên" nhưng code có thể khóa ở lần 2 |
| 9   | TC-UI-D2    | edge     | Sai password 3 lần → đợi ~30s → nhập đúng                        | Sau khi đợi ≥30s, login đúng → URL chuyển khỏi `/login`                                                        | EC11 — Hết thời gian khóa → login lại thành công                                       |
| 10  | TC-UI-D3    | edge     | Sau khi bị khóa, tiếp tục sai password ngay (không đợi)           | Vẫn � `/login`; error message hiển thị (có thể giống message sai mật khẩu thông thường)                        | EC10 — Đang trong thời gian khóa, thử tiếp tục bị từ chối                              |
| 11  | TC-UI-D4    | edge     | Sai 1 lần → login đúng → quan sát header                          | Login đúng → URL đổi, header hiển thị tên user thay vì link "Đăng nhập/Đăng ký"                                | EC12 — Reset bộ đếm sau login đúng (quan sát hành vi UI sau khi đăng nhập)             |
| 12  | TC-UI-N1    | negative | (rỗng) / (rỗng)                                                  | Cả 2 field `required` → HTML5 chặn submit ngay; URL không đổi                                                  | EC5+EC6 — Cả 2 trường đều rỗng                                                        |

## Mapping case UI ↔ case gốc (sources_testcase/FR02.md)

| id UI      | Gốc trong FR02.md | Nhóm gốc |
| ---------- | ----------------- | -------- |
| TC-UI-A1   | TC-A1             | A — Success |
| TC-UI-B1   | TC-B1             | B — Sai thông tin |
| TC-UI-B2   | TC-B2             | B — Sai thông tin |
| TC-UI-C1   | TC-C1             | C — Validation |
| TC-UI-C2   | BV-P4             | BVA — Probing (XSS) |
| TC-UI-C3   | BV-P6             | BVA — Probing (whitespace) |
| TC-UI-C4   | TC-C3             | C — Validation |
| TC-UI-D1   | TC-D3 / BV-D2     | D — Lockout |
| TC-UI-D2   | TC-D7 / BV-T3     | D — Hết lockout |
| TC-UI-D3   | TC-D4             | D — Trong lockout |
| TC-UI-D4   | TC-D5             | D — Reset counter |
| TC-UI-N1   | TC-C3 + TC-C4     | C — Validation (kết hợp) |

## Ghi chú cho người review

1. **Không bao gồm** các case BVA về input cực dài (BV-P1, BV-P2) — khó reproduce ổn định trên UI và giá trị quan sát thấp.
2. **Có bao gồm** TC-UI-D4 (reset counter sau login đúng) vì đây là quan sát UI quan trọng (header đổi từ "Đăng nhập/Đăng ký" sang tên user).
3. **Lưu ý kỹ thuật:** Một số case (D1, D2, D3) phụ thuộc vào state backend, có thể cần setup trước (reset `login_attempts`) — sẽ xử lý ở Bước 3 (test data + setup script).
4. **Quan sát DOM quan trọng:**
   - Field Username không có `type="email"` → không có HTML5 native email validation
   - Field Mật khẩu có `type="text"` (không phải `password`) → đây là quan sát UX/dùng sẽ note trong gap analysis
   - H2 hiển thị "Đăng Ký" thay vì "Đăng Nhập" — quan sát không nhất quán UI
