# Bảng Test Case chuẩn hóa — FR-16: Import Sản phẩm từ CSV (UI Automation)

> **Nguồn:** Trích xuất từ `HW04/sources_testcase/FR16.md` (33 case Domain/Postman) + bổ sung các case UI-Only về **thao tác upload file CSV** trên trang `/admin/products` (tab "Sản phẩm" → box "Import sản phẩm từ CSV").
>
> **Scope:** UI Automation (Playwright) — tập trung vào giao diện nút upload, preview, button Import, kết quả. Các case pure-API (validation `name`/`price`/`category_id` ở cấp JSON body) đã được Domain Testing cover — UI có thể tương tác gián tiếp thông qua việc upload file CSV có nội dung bất kỳ.

---

## Đối chiếu 33 case nguồn → 12 case UI


| # nguồn | ID gốc    | Nhóm                         | Quyết định       | Lý do                                                                                                                                           |
| ------- | --------- | ---------------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| 1       | TC-A1     | A — Authorization            | ✅ GIỮ            | UI: login admin hợp lệ, vào `/admin/products`, thấy box Import                                                                                  |
| 2       | TC-A2     | A                            | ✅ GIỮ            | UI: login → token bị xóa → upload file → bấm Import → hiển thị lỗi auth                                                                         |
| 3       | TC-A3     | A                            | ✅ GIỮ            | UI: login user thường → backend vẫn 200 (BUG-001) — UI tự cảnh báo "Bạn không phải là admin!"                                                   |
| 4       | TC-A4     | A                            | ❌ BỎ             | UI không thể giả lập token không hợp lệ từ bên ngoài (admin đã login thành công); đã có TC-A2                                                   |
| 5–10    | TC-B1..B6 | B — Validation `name`        | ❌ BỎ             | Domain Testing đã chạy Postman, UI upload file → chỉ test được nhánh "file valid"; các case name rỗng / space / > 255 đã được domain cover      |
| 11–17   | TC-C1..C7 | C — Validation `price`       | ❌ BỎ             | Tương tự: domain đã cover, UI chỉ test upload file giá trị hợp lệ                                                                               |
| 18–22   | TC-D1..D5 | D — Validation `category_id` | ❌ BỎ             | Domain đã cover, UI chỉ test file có category_id có sẵn                                                                                         |
| 23–26   | TC-E1..E4 | E — Rollback                 | ✅ GIỮ 1 case     | TC-UI-E1 happy path multi-row → UI preview & report "X/Y sản phẩm"; 3 case còn lại liên quan validation rollback → domain đã cover              |
| 27–29   | BV-N1..N3 | BVA — Name length            | ❌ BỎ             | Domain đã cover                                                                                                                                 |
| 30–33   | BV-P1..P4 | BVA — Price                  | ❌ BỎ             | Domain đã cover                                                                                                                                 |
| —       | —         | UI-Only                      | ✅ BỔ SUNG 4 case | `frontend-admin/src/App.jsx` dòng 341–481 có UI riêng (file input, preview table, button, result box) chưa có test case nào cover trong FR16.md |


| # nguồn | ID gốc | Nhóm | Quyết định | Lý do |
| 34–37 | BV-B1..B4 | BVA — Body format | ❌ BỎ | API-level; UI upload file rỗng → file không trigger |
| — | TC-UI-1..4 | UI-Only | ✅ BỔ SUNG | Pre-flight UI validation: file extension, empty file, preview table, button enable |

**Tổng giữ:** 8 case nguồn (3A + 1E + 1E happy path) + 4 case UI-only = **12 case** cho UI Automation. Thực tế chỉ chọn **5 case từ nguồn** (TC-A1, TC-A2, TC-A3, TC-E1, TC-E4 happy path) + **7 case UI-only** = **12 case**.

> **Lý do chọn 12 case:**
>
> - 3 case Authorization (UI login + role check + session timeout) — phủ nhóm A
> - 1 case happy path multi-row (TC-E4 = BV boundary 1 dòng)
> - 1 case multi-row mixed (TC-E1 happy path — preview UI đếm số dòng đúng)
> - 7 case UI-only: pre-flight checks (file extension, empty, header thiếu), preview state, button enable/disable, result box, template download

---

## Bảng chuẩn — 12 test case cho UI Automation


| id       | type     | input                                                                                                              | expected                                                                                                                                                                                     | note                                                                             |
| -------- | -------- | ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| TC-A1    | positive | Login admin hợp lệ (email/password đúng, role=admin) → vào `/admin` → click tab "Sản phẩm"                         | Box "📂 Import sản phẩm từ CSV" hiển thị đầy đủ: tiêu đề, link tải template, file input, button Import (disabled)                                                                            | Happy path admin — phải thấy UI mới test tiếp                                    |
| TC-A2    | negative | Login admin → sau đó set localStorage `adminToken` = rỗng (mô phỏng session expire) → upload file CSV → bấm Import | Response lỗi 401/403; UI box kết quả hiển thị nền đỏ `❌ <error message>`; box token bị clear, redirect về form login                                                                         | Anti-enumeration & session validation ở UI layer                                 |
| TC-A3    | negative | Login bằng user thường (role=user) → frontend tự alert "Bạn không phải là admin!" và không set token               | Form login vẫn hiển thị; không có tab admin nào; alert được gọi (dismiss)                                                                                                                    | FR-16-BUG-001 cross-ref: backend vẫn cho non-admin import được, nhưng UI có chặn |
| TC-UI-1  | negative | Upload file có đuôi `.txt` thay vì `.csv` (vd `invalid.txt` chứa text bất kỳ)                                      | Preview table KHÔNG render; button Import vẫn disabled; (UI hiện KHÔNG kiểm tra extension — đây là FR-16-FUNC-BUG-002, test sẽ FAIL để document bug)                                         | FR-16-FUNC-BUG-002: UI thiếu validation đuôi file                                |
| TC-UI-2  | positive | Upload file `.csv` hợp lệ với header `name,price,description,imageUrl,category_id` và 2 dòng data                  | Preview table render đúng 2 dòng; button Import đổi text thành "Import 2 sản phẩm" và enabled                                                                                                | Verify CSV parse logic của UI (split lines, map headers)                         |
| TC-UI-3  | positive | Upload file `.csv` có header tiếng Việt `ten,gia,mo_ta,danh_muc` (không có `name`/`price` chuẩn)                   | Preview table vẫn render theo header file; button Import enabled. Khi bấm Import: backend fallback map `ten→name`, `gia→price` (xem App.jsx dòng 391–402); result box hiển thị success/error | Verify UI alias mapping (`ten`/`gia`/`mo_ta`/`danh_muc`)                         |
| TC-UI-4  | negative | Upload file `.csv` thiếu header `category_id` (vd chỉ có `name,price`)                                             | Preview table render 2 cột; button Import enabled. Khi bấm Import: backend trả success (vì default `category_id=1`) — đây là FR-16-FUNC-BUG-001 (UI không validate header)                   | FR-16-FUNC-BUG-001 cross-ref                                                     |
| TC-UI-5  | negative | Upload file `.csv` trống (chỉ có header, không có dòng data nào)                                                   | Preview table KHÔNG render (vì `importPreview.length === 0`); button Import vẫn disabled                                                                                                     | Boundary: file không có data                                                     |
| TC-UI-6  | positive | Upload file `.csv` với 1 dòng data (boundary 1 sản phẩm) → bấm Import                                              | Preview hiển thị 1 dòng; button text "Import 1 sản phẩm"; sau khi click → box kết quả hiển thị "✅ Import hoàn tất: 1/1 sản phẩm được thêm"                                                   | TC-E4 boundary                                                                   |
| TC-UI-7  | positive | Upload file `.csv` với 3 dòng data hợp lệ → bấm Import                                                             | Box kết quả hiển thị "✅ Import hoàn tất: 3/3 sản phẩm được thêm" (happy path) — UI xác nhận 3/3 inserted                                                                                     | TC-E1 happy path multi-row                                                       |
| TC-UI-8  | positive | Upload file `.csv` với 5 dòng: 4 hợp lệ + 1 dòng `name=""` (rỗng) → bấm Import                                     | Box kết quả hiện `inserted: 4` + errors có "Hàng X: Thiếu tên sản phẩm" — UI document FR-16-BUG-006 (không rollback all-or-nothing)                                                          | Cross-ref FR-16-BUG-006                                                          |
| TC-UI-9  | positive | Click link "Tải file mẫu (template.csv)"                                                                           | Trình duyệt download file `template_import.csv` có nội dung: header `name,price,description,imageUrl,category_id` + 1 dòng mẫu                                                               | Verify download flow (FR-16 spec)                                                |
| TC-UI-10 | positive | Upload file `.csv` → sau khi hiển thị preview → click lại nút "Choose file" và chọn file KHÁC                      | Preview table được update với file mới (không bị append); số dòng preview thay đổi đúng theo file mới; button Import text cập nhật theo `importPreview.length`                               | Verify state reset khi đổi file                                                  |


---

## Ghi chú phạm vi

- **CSV header bắt buộc:** File mẫu có header `name,price,description,imageUrl,category_id`. UI chấp nhận alias `ten,gia,mo_ta,danh_muc` (xem App.jsx dòng 391–402).
- **Bug UI đã document:** TC-UI-1 (thiếu validation đuôi file) và TC-UI-4 (thiếu validation header) được giữ làm test FAIL có chủ ý — không best-effort.
- **Cross-ref bugs từ Domain:** TC-UI-8 document FR-16-BUG-006 (rollback all-or-nothing) qua UI behavior.
- **Pure-API cases (validation name/price/category_id):** KHÔNG thuộc UI Automation scope; đã được Domain Testing cover ở FR16.md §3.2–3.4.
- **Authorization UI:** Frontend App.jsx dòng 65–68 có client-side check `if (res.data.user.role !== "admin")` → alert + return. Đây là lớp UI phòng thủ đầu tiên; test TC-A3 sẽ verify lớp này.
- **Session expiry UI:** Khi `fetchData()` trả 401/403, frontend tự clear token và redirect về login (App.jsx dòng 54–57). TC-A2 mô phỏng điều này.

