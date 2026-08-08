# BÁO CÁO TỔNG HỢP — HW03

## GUI Testing: Admin Event Management System

**Môn học:** Kiểm thử và đảm bảo chất lượng phần mềm (Software Quality Assurance & Testing)
**Đề tài:** Hệ thống Quản lý Sự kiện (EventsPlus)
**Ngày tạo:** 2026-08-04
**Người thực hiện:** Trần Phạm Trọng Nhân  
**Trạng thái:** Hoàn thành

---

## Mục lục

1. [Tổng quan](#tổng-quan)
2. [Task 1 — GUI Testing & Bug Reports](#task-1--gui-testing--bug-reports)
3. [Task 2 — Usability Testing](#task-2--usability-testing)
4. [Task 3 — Cross-Platform Compatibility](#task-3--cross-platform-compatibility)
5. [Tổng hợp đa task](#tổng-hợp-đa-task)
6. [Kết luận chung](#kết-luận-chung)

---

## Tổng quan

### Phạm vi testing

Testing toàn diện giao diện Admin của hệ thống Quản lý Sự kiện (EventsPlus), bao gồm 3 màn hình chính:


| Mã     | Màn hình                    | Mô tả                                                                                              |
| ------ | --------------------------- | -------------------------------------------------------------------------------------------------- |
| **A1** | Danh sách Events            | Bảng danh sách sự kiện với bộ lọc trạng thái, search, phân trang, và chấm thông báo                |
| **A2** | Modal Chỉnh sửa Event       | Form chỉnh sửa sự kiện với 5 tab: Thông tin cơ bản, Ngày giờ, Địa điểm, Danh mục, Tùy chọn bổ sung |
| **A3** | Panel Cấu hình Registration | Cấu hình Roles, Max Slots, Waitlist, Vai trò phụ cho đăng ký sự kiện                               |


### Ba task đã thực hiện


| Task | Tên                          | Mục đích                                                                               | File gốc                                        |
| ---- | ---------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------- |
| 1    | GUI Testing & Bug Reports    | Đánh giá GUI theo checklist 57 mục (IA-01 → IA-04), xác định bug, phân loại severity   | `HW03/Bug reports/Task1_BugReports.md`          |
| 2    | Usability Testing            | Quan sát 5 người dùng thực hiện task tạo sự kiện, đo SUS và phân tích usability issues | `HW03/Bug reports/Task2-Usability Report.md`    |
| 3    | Cross-Platform Compatibility | Test trên 4 OS × 5 Browser × 3 Device Type (10 cells), xác định lỗi responsive         | `HW03/Bug reports/Task3_CrossPlatformMatrix.md` |


---

## Task 1 — GUI Testing & Bug Reports

**Mô tả:** Áp dụng checklist `Shared_GUI_Checklist.md` (57 mục, 4 khía cạnh IA-01 → IA-04) cho 3 màn hình A1, A2, A3.
**Thư mục ảnh:** `HW03/Screenshots/A1/`, `A2/`, `A3/`
**Thời gian chạy:** 2026-08-01 đến 2026-08-03

### Checklist sử dụng


| Khía cạnh             | Mô tả                                                                    |
| --------------------- | ------------------------------------------------------------------------ |
| **IA-01: Chuẩn UI**   | Typography, màu sắc, tương phản, i18n, empty state, responsive, icon     |
| **IA-02: Forms**      | Label, placeholder, validation, upload, rich-text, input defaults        |
| **IA-03: Navigation** | Sidebar, breadcrumb, pagination, filter, search, deep linking, drag-drop |
| **IA-04: Feedback**   | Toast, dialog, hover/active, tooltip, progress, modality, real-time      |


### Quá trình review


| Vòng   | Thời gian         | Người thực hiện | Kết quả                |
| ------ | ----------------- | --------------- | ---------------------- |
| Lần 1  | 2026-08-01        | Agent (Claude)  | Chạy checklist lần đầu |
| Vòng 1 | 2026-08-02 (sáng) | User            | Review, bổ sung ảnh    |
| Vòng 2 | 2026-08-02 (sáng) | Agent           | Cập nhật theo review   |
| Vòng 3 | 2026-08-02 (trưa) | User            | Review lần 2           |
| Vòng 4 | 2026-08-03        | User + Agent    | Tổng hợp A1, A2, A3    |


### Tổng hợp số liệu Task 1

#### Theo màn hình


| Chỉ số         | A1   | A2   | A3   | **Tổng** |
| -------------- | ---- | ---- | ---- | -------- |
| Tổng số mục    | 57   | 57   | 57   | **171**  |
| Passed         | 27   | 29   | 17   | **73**   |
| Failed         | 7    | 4    | 4    | **15**   |
| N/A            | 23   | 24   | 35   | **82**   |
| Not Verified   | 0    | 0    | 0    | **0**    |
| Tỷ lệ verified | 100% | 100% | 100% | **100%** |


#### Theo khía cạnh


| Khía cạnh         | Tổng    | Passed | Failed | N/A    |
| ----------------- | ------- | ------ | ------ | ------ |
| IA-01: Chuẩn UI   | 45      | 30     | 5      | 10     |
| IA-02: Forms      | 45      | 12     | 6      | 26     |
| IA-03: Navigation | 33      | 8      | 3      | 22     |
| IA-04: Feedback   | 48      | 23     | 1      | 24     |
| **Tổng**          | **171** | **73** | **15** | **82** |


#### Phân bố Bug theo mức độ nghiêm trọng


| Mức độ       | Số lượng | Mô tả                                                 |
| ------------ | -------- | ----------------------------------------------------- |
| **Critical** | 0        | Không có bug nghiêm trọng ảnh hưởng đến toàn hệ thống |
| **High**     | 8        | Ảnh hưởng đáng kể đến usability cốt lõi               |
| **Medium**   | 6        | Giảm usability nhưng không ngăn cản sử dụng           |
| **Low**      | 1        | Giảm trải nghiệm nhẹ                                  |


#### Phân bố Bug theo màn hình


| Màn hình               | High  | Medium | Low   | Tổng   |
| ---------------------- | ----- | ------ | ----- | ------ |
| A1: Danh sách Events   | 4     | 3      | 0     | **7**  |
| A2: Modal Chỉnh sửa    | 2     | 2      | 0     | **4**  |
| A3: Panel Registration | 2     | 1      | 1     | **4**  |
| **Tổng**               | **8** | **6**  | **1** | **15** |


### BUG REPORTS — A1: Danh sách Events

**Mô tả:** Bảng danh sách sự kiện với bộ lọc trạng thái, search, phân trang, và chấm thông báo.
**Thư mục ảnh:** `HW03/Screenshots/A1/`

#### Bug #A1-001: Giao diện không responsive trên Mobile

- **Mã ID:** IA01-08
- **Mức độ:** High
- **Mô tả:** Khi truy cập màn hình Danh sách Events trên thiết bị mobile, sidebar chính và sidebar overlay chồng lên nhau (hiển thị đúp), giao diện bị vỡ layout.
- **Bằng chứng:** `A1_mobile.jpg`
- **Đề xuất:** Thiết kế lại responsive cho breakpoint mobile — sidebar chính nên ẩn khi vào mobile, chỉ hiển thị hamburger menu.

#### Bug #A1-002: Bảng danh sách Events hiển thị quá nhiều cột (data overload)

- **Mã ID:** IA01-13
- **Mức độ:** Medium
- **Mô tả:** Bảng danh sách Events hiển thị 6 cột. Cột "Tham gia" và "Doanh thu" hiển thị trên màn hình admin event gây data overload cho tác vụ chính.
- **Bằng chứng:** `A1_default.png`, `A1_table_list_events_01/02/03.png`
- **Đề xuất:** Loại bỏ hoặc ẩn cột "Tham gia" và "Doanh thu" trên màn hình admin, hoặc chuyển sang tab "Thống kê" riêng.

#### Bug #A1-003: Thiếu chức năng Export Excel/CSV

- **Mã ID:** IA01-15
- **Mức độ:** Medium
- **Mô tả:** Màn hình Danh sách Events không có nút Export (Excel/CSV) để xuất dữ liệu phục vụ báo cáo và thống kê.
- **Bằng chứng:** `A1_default.png`, `A1_table_list_events_01/02/03.png`
- **Đề xuất:** Bổ sung nút "Xuất Excel" / "Xuất CSV" cạnh nút "+ Tạo sự kiện".

#### Bug #A1-004: Search box và Filter Dropdown thiếu Label

- **Mã ID:** IA02-01
- **Mức độ:** Medium
- **Mô tả:** Search box chỉ có placeholder, KHÔNG có `<label>` riêng. Dropdown filter Status và Time cũng không có label riêng. Phần pagination chỉ hiển thị "Trang 1 / 1" không có label "Trang" — phụ thuộc placeholder là không đủ cho accessibility (screen reader sẽ không đọc được vai trò của input).
- **Bằng chứng:** `A1_label_search.png`, `A1_label_pagination.png`
- **Đề xuất:** Thêm `<label>` ẩn (visually-hidden nhưng có cho screen reader) cho search box, filter dropdown, và pagination input.

#### Bug #A1-005: Search trả về kết quả không khớp hoàn toàn với từ khóa

- **Mã ID:** IA03-06
- **Mức độ:** High
- **Mô tả:** Tìm kiếm với từ khóa "anh" trả về kết quả có chứa "anh" trong tiêu đề nhưng vẫn xuất hiện event khác không có từ "anh" trong tiêu đề hiện tại — nghi vấn dữ liệu cũ còn lưu khi tên đã thay đổi.
- **Bằng chứng:** `A1_search_01.png`, `A1_search_02.png`
- **Đề xuất:** Kiểm tra logic search backend (full-text search có đang dùng index cũ không? có cần reindex khi update event không?). Test với dữ liệu mới hoàn toàn để xác nhận.

#### Bug #A1-006: Empty State không thân thiện và thiếu nút "Xóa bộ lọc" inline

- **Mã ID:** IA03-08
- **Mức độ:** Medium
- **Mô tả:** Khi filter ra 0 kết quả, câu thông báo "Không có dữ liệu hiển thị" hiển thị ở giữa bảng (gần giữa viewport), người dùng cần kéo qua mới thấy được. KHÔNG có thông báo nhanh ở đầu trang (toast/banner). KHÔNG có nút "Xóa bộ lọc" inline gần thông báo — phải bấm nút "Đặt lại" riêng.
- **Bằng chứng:** `A1_filter_Draft.png`, `A1_filter_combine.png`
- **Đề xuất:** Di chuyển thông báo empty state lên đầu bảng (hoặc thêm banner đầu trang), bổ sung nút "Xóa bộ lọc" inline cạnh thông báo.

#### Bug #A1-007: URL không thay đổi khi filter — không hỗ trợ Deep Linking

- **Mã ID:** IA03-07
- **Mức độ:** High
- **Mô tả:** Sau khi filter (chọn Status "Tất cả trạng thái" và Time "Tất cả thời gian"), URL vẫn là `https://hiu.eventsplus.io/admin/events` — không có query string filter/search. Người dùng không thể:
  - Copy URL đã filter rồi share cho đồng nghiệp.
  - Bookmark lại trạng thái filter cụ thể.
  - Back/Forward trình duyệt không đi qua các trạng thái filter.
- **Bằng chứng:** `A1_filter_url.png`
- **Đề xuất:** Sử dụng query string để sync trạng thái filter vào URL, ví dụ: `?status=draft&time=week`. Khi load trang, đọc query string để áp dụng filter tương ứng.

### BUG REPORTS — A2: Modal Chỉnh sửa Event

**Mô tả:** Form chỉnh sửa sự kiện với 5 tab: Thông tin cơ bản, Ngày giờ, Địa điểm, Danh mục, Tùy chọn bổ sung.
**Thư mục ảnh:** `HW03/Screenshots/A2/`

#### Bug #A2-001: Dấu `*` cho trường bắt buộc sử dụng màu đen thay vì đỏ

- **Mã ID:** IA02-02
- **Mức độ:** Medium
- **Mô tả:** Trên modal chỉnh sửa event, các trường bắt buộc có dấu `*` nhưng sử dụng màu **ĐEN** thay vì màu **ĐỎ** theo yêu cầu của checklist IA02-02 ("dấu `*` màu đỏ"). Điều này làm cho dấu `*` kém nổi bật hơn trên nền trắng, khiến user khó phân biệt đâu là trường bắt buộc trong quá trình nhập liệu.
  - Các trường có dấu `*` đen: Tiêu đề sự kiện, Mô tả ngắn, Thể loại, Danh mục, Sự kiện riêng tư, Registration method
  - Mặc dù hệ thống sẽ cảnh báo và không cho publish khi thiếu trường bắt buộc, nhưng việc dấu `*` đen khó nhận biết gây trải nghiệm không tốt cho người dùng
- **Bằng chứng:** `A2_attachments_basicInfomation.png`, `A2_dateTime.png`, `A2_categories_registration.png`
- **Đề xuất:**
  - Đổi màu dấu `*` từ đen sang **đỏ** theo yêu cầu checklist (Norman's Signifier — dấu hiệu trực quan nổi bật hơn).
  - Đảm bảo tất cả trường bắt buộc đều có dấu `*` cùng màu (đỏ) để đồng nhất.

#### Bug #A2-002: Vùng upload ảnh đại diện và ảnh bìa thiếu thông số kỹ thuật cụ thể

- **Mã ID:** IA02-08
- **Mức độ:** Medium
- **Mô tả:** Khu vực upload Ảnh đại diện (Thumbnail, 1:1) và Ảnh bìa (Banner, 16:9) chỉ hiển thị text hướng dẫn chung chung "Khuyến nghị kích thước ảnh" mà KHÔNG có thông số kỹ thuật cụ thể: kích thước pixel (width × height), tỉ lệ chính xác, dung lượng tối đa (KB/MB), định dạng file được phép (JPG, PNG, WEBP...). User có thể upload file quá lớn gây lỗi server hoặc tỉ lệ sai khiến ảnh bị cắt méo.
- Phần Tệp đính kèm (attachments) có ghi rõ "You can upload up to 5 files (10MB max each)" — KHÔNG đồng nhất với 2 vùng upload ảnh.
- **Bằng chứng:** `A2_thumbnail_banner.png`, `A2_attachments_basicInfomation.png`, `A2_add_thumnail.png`, `A2_add_banner.png`
- **Đề xuất:**
  - Bổ sung text hướng dẫn cụ thể cho Ảnh đại diện: "Khuyến nghị: 400x400 px (1:1). Tối đa: 2MB. Định dạng: JPG, PNG".
  - Bổ sung text hướng dẫn cụ thể cho Ảnh bìa: "Khuyến nghị: 1200x675 px (16:9). Tối đa: 5MB. Định dạng: JPG, PNG".
  - Có thể dùng chung component để đảm bảo đồng nhất giữa các vùng upload.

#### Bug #A2-003: Giao diện không responsive trên Mobile — sidebar hiển thị đúp

- **Mã ID:** IA01-08
- **Mức độ:** High
- **Mô tả:** Khi truy cập màn hình thêm event trên thiết bị mobile, sidebar chính và overlay sidebar chồng lên nhau (hiển thị đúp), giao diện bị vỡ layout. Tương tự bug #A1-001 ở A1.
- **Bằng chứng:** `A2_addEvent_mobile.jpg`
- **Đề xuất:**
  - Thiết kế lại responsive cho breakpoint mobile.
  - Sidebar chính nên ẩn khi vào mobile, chỉ hiển thị hamburger menu.
  - Đảm bảo overlay sidebar chỉ hiển thị khi user click mở menu, không hiển thị đúp cùng sidebar chính.

#### Bug #A2-004: Không thể nhấn Enter để Submit form

- **Mã ID:** IA02-04
- **Mức độ:** High
- **Mô tả:** Khi điền xong các trường trong form chỉnh sửa event, user **không thể nhấn phím Enter** để submit form. Phải dùng chuột click vào nút "Đăng" — đây là điểm gây bất tiện cho user thường xuyên nhập liệu bằng bàn phím.
- **Bằng chứng:** Không có ảnh chụp trực tiếp (đây là test hành vi tương tác bàn phím) — dựa trên xác nhận test thực tế
- **Đề xuất:**
  - Bổ sung handler bắt sự kiện `keydown` cho phím Enter trên form.
  - Đảm bảo Enter submit form tương đương click nút "Đăng".
  - Cân nhắc: chỉ trigger submit khi user không đang focus vào textarea (rich-text editor) để tránh submit nhầm khi đang viết mô tả.

### BUG REPORTS — A3: Panel Cấu hình Registration

**Mô tả:** Cấu hình Roles, Max Slots, Waitlist, Vai trò phụ cho đăng ký sự kiện.
**Thư mục ảnh:** `HW03/Screenshots/A3/`

#### Bug #A3-001: Input "Vai trò phụ" và Max slots thiếu label rõ ràng và hướng dẫn format

- **Mã ID:** IA02-01
- **Mức độ:** Low
- **Mô tả:** Input "Vai trò phụ" chỉ có placeholder "BCH khoa, BTC..." mà KHÔNG có hướng dẫn format phân cách (dấu phẩy, dấu chấm phẩy, hay xuống dòng?). Input "Max slots" của từng role chỉ có placeholder "500" nhưng label "Max slots" nằm ở trên dễ gây nhầm lẫn.
- **Bằng chứng:** `A3_default.png`, `A3_student_roles.png`
- **Đề xuất:** Bổ sung text hướng dẫn format dưới input "Vai trò phụ", ví dụ: "Phân cách các vai trò bằng dấu phẩy (,). Tối đa 5 vai trò phụ."

#### Bug #A3-002: Các trường quan trọng trong panel không có dấu `*` bắt buộc

- **Mã ID:** IA02-02
- **Mức độ:** Medium
- **Mô tả:** Trên panel cấu hình Registration, các trường sau KHÔNG có dấu `*` đỏ mặc dù chúng là bắt buộc khi lưu cấu hình: tên role (text input), Max slots của từng role (number input), "Số lượng đăng ký tối đa (Tổng)" (number input), "Vai trò phụ" (text input).
- **Bằng chứng:** `A3_default.png`, `A3_student_roles.png`, `A3_add_role.png`
- **Đề xuất:** Thêm dấu `*` đỏ cho tất cả trường bắt buộc. Nếu một số trường thực sự optional (ví dụ: vai trò phụ), cần ghi rõ "(tùy chọn)" sau label.

#### Bug #A3-003: Xóa role KHÔNG có dialog xác nhận — nguy cơ xóa nhầm

- **Mã ID:** IA04-04
- **Mức độ:** High
- **Mô tả:** Xóa role là hành động phá hủy — có thể ảnh hưởng đến các user đã đăng ký theo role đó, cấu hình số lượng tối đa, dữ liệu thống kê theo role. Tuy nhiên khi user click nút X trên role → role bị xóa NGAY LẬP TỨC, không có dialog xác nhận.
- **Bằng chứng:** `A3_delete_role.png` (trước đó có 3 roles bao gồm "Giảng viên" trong `A3_add_role.png`, sau khi click X chỉ còn "Học sinh" và "Sinh viên")
- **Đề xuất:** Thêm dialog xác nhận trước khi xóa role:
  - Tiêu đề: "Xóa role"
  - Nội dung: "Bạn có chắc chắn muốn xóa role '[tên role]' không? Hành động này có thể ảnh hưởng đến các user đã đăng ký."
  - Nút "Hủy" (màu trắng) và nút "Xóa" (màu đỏ)
  - Có overlay mờ phía sau để đảm bảo modality

#### Bug #A3-004: Giao diện không responsive trên Mobile

- **Mã ID:** IA01-08
- **Mức độ:** High
- **Mô tả:** Panel cấu hình Registration không hiển thị tốt trên thiết bị mobile.
- **Bằng chứng:** A3_role_mobile.jpg
- **Đề xuất:** Thiết kế lại responsive cho panel cấu hình trên mobile.

### BUG REPORTS chung — Cross-cutting (Task 1)

Các bug sau xuất hiện ở nhiều màn hình và cần được sửa đồng nhất trên toàn hệ thống:

#### Bug #C-001: Sidebar hiển thị đúp trên Mobile (A1, A2, A3)

- **Mã ID:** IA01-08 (A1, A2, A3)
- **Mức độ:** High
- **Bug liên quan:** Bug #A1-001, Bug #A2-003, Bug #A3-004
- **Mô tả:** Bug này xuất hiện ở cả 3 màn hình (A1, A2, A3). Nguyên nhân gốc: sidebar chính và overlay sidebar chồng lên nhau trên mobile.
- **Đề xuất toàn cục:**
  - Sửa ở mức layout/component sidebar thay vì sửa riêng từng màn hình.
  - Kiểm tra CSS media query cho breakpoint mobile (max-width: 768px).
  - Đảm bảo sidebar chính ẩn khi vào mobile, chỉ hiển thị hamburger menu.

#### Bug #C-002: Dấu `*` bắt buộc sử dụng màu đen thay vì đỏ (A2, A3)

- **Mã ID:** IA02-02 (A2, A3)
- **Mức độ:** Medium
- **Bug liên quan:** Bug #A2-001, Bug #A3-002
- **Mô tả:** Bug này xuất hiện ở cả A2 và A3. Nguyên nhân gốc: CSS không định nghĩa màu đỏ cho dấu `*` required.
- **Đề xuất toàn cục:**
  - Sửa ở mức global CSS/component input thay vì sửa riêng từng form.
  - Thêm CSS rule cho `label.required::after { content: " *"; color: red; }`.

### Kết luận Task 1

#### Bug cần ưu tiên sửa (theo thứ tự)


| Ưu tiên | Bug                                                           | Mức độ | Mô tả                           |
| ------- | ------------------------------------------------------------- | ------ | ------------------------------- |
| **1**   | #A1-001, #A2-003, #A3-004, #C-001                             | High   | Responsive mobile — sidebar đúp |
| **2**   | #A1-005                                                       | High   | Search trả kết quả sai          |
| **3**   | #A1-007                                                       | High   | Không hỗ trợ Deep Linking       |
| **4**   | #A2-004                                                       | High   | Không thể nhấn Enter submit     |
| **5**   | #A3-003                                                       | High   | Xóa role không có confirmation  |
| **6**   | #A1-002, #A1-003, #A1-004, #A1-006, #A2-001, #A2-002, #A3-002 | Medium | Usability/Accessibility         |
| **7**   | #A3-001                                                       | Low    | Placeholder/Label               |


#### Điểm tích cực

1. Giao diện sạch sẽ, typography phân cấp rõ ràng
2. Icon nhất quán đúng nghĩa
3. Hover/Active effect rõ ràng
4. Modal có Modality chặn tương tác nền
5. Controls đồng bộ (Toggle ON/OFF)
6. Dialog xóa event có confirmation (A1)
7. Rich-text editor đầy đủ (A2)
8. Gom nhóm hợp lý theo tab/section

#### Khuyến nghị Task 1

1. Ưu tiên sửa bug High trước: Responsive mobile + Deep Linking
2. Sửa bug cross-cutting ở mức component (sidebar, dấu `*`)
3. Thêm unit test cho search backend (#A1-005)
4. Cải thiện Accessibility: thêm `<label>` cho input
5. Thêm Export Excel/CSV

---

## Task 2 — Usability Testing

**Mô tả:** Quan sát 5 người dùng thực hiện task "Tạo sự kiện hội thảo" trên hệ thống admin.
**Sản phẩm:** Hệ thống EMS – Chức năng Tạo & Quản lý sự kiện
**Ngày thực hiện:** 02/08/2026

### Kịch bản tác vụ (Task Scenario)

**Bối cảnh:** Bạn là thành viên ban tổ chức sự kiện của câu lạc bộ.

**Tác vụ:** "Hãy tạo một sự kiện hội thảo sắp tới trên hệ thống dành cho tối đa 50 người tham gia (bao gồm cả sinh viên và giảng viên). Bạn cần thiết lập thời gian diễn ra vào tuần tới, bật tính năng danh sách chờ (waitlist), phân quyền vai trò tham gia đầy đủ, và xuất bản (Publish) sự kiện. Sau đó, hãy tìm lại sự kiện vừa tạo để kiểm tra xem nó đã hiển thị đúng trên hệ thống chưa trước khi chia sẻ link."

### Mục tiêu đo lường

- **Task Success:** Hoàn thành đầy đủ / Một phần / Thất bại
- **Time on Task:** Thời gian từ lúc bắt đầu tìm nút tạo đến lúc thấy sự kiện trên trang chủ
- **Errors / Hesitations:** Lỗi nhập liệu, số lần ngập ngừng khi tương tác với UI
- **Post-Task Metrics:** Điểm SUS (System Usability Scale) và câu hỏi mở về Clarity, Error Recovery, Speed, và Trust

### Bảng thông tin người tham gia


| STT | Họ và tên           | Số điện thoại (ẩn 4 số) | Ngày thực hiện |
| --- | ------------------- | ----------------------- | -------------- |
| 1   | Nguyễn Trường Duy   | 033 833                 | 02/08/2026     |
| 2   | Đào Đức Mạnh        | 036 207                 | 02/08/2026     |
| 3   | Nguyễn Lê Nhật Duy  | 094 210                 | 02/08/2026     |
| 4   | Nguyễn Văn An       | 098 321                 | 02/08/2026     |
| 5   | Nguyễn Võ Huy Cường | 093 622                 | 08/02/2026     |


### Bảng chỉ số tác vụ (Task Metrics)


| Chỉ số đo lường          | Dữ liệu thống kê   | Phân tích chi tiết                                                |
| ------------------------ | ------------------ | ----------------------------------------------------------------- |
| **Tỉ lệ thành công**     | 100% (5/5)         | Cả 5 người đều "Hoàn thành đầy đủ" tác vụ.                        |
| **Thời gian trung bình** | 6.9 phút           | Dao động từ 4 phút (nhanh nhất) đến 10 phút (chậm nhất).          |
| **Số lỗi / Điểm vướng**  | 12 điểm vướng mắc  | Tập trung ở khâu điều hướng (UI), cấu hình thời gian và Waitlist. |
| **Điểm SUS (Ước lượng)** | Tạm ổn (65-70/100) | Giao diện cơ bản đáp ứng luồng, nhưng bị phàn nàn vì cồng kềnh.   |


### Phân tích tính tiện dụng (Xếp hạng theo Mức nghiêm trọng 0–4)

*Quy ước: 0 Không lỗi, 1 Lỗi thẩm mỹ, 2 Lỗi nhỏ, 3 Lỗi lớn, 4 Thảm họa Usability*

- **Severity 3 — Khó khăn trong việc xác định vị trí tính năng (Discoverability):** Người dùng phản ánh việc tìm kiếm vị trí tạo sự kiện hoặc trang "Quản lý sự kiện" rất khó khăn, bố cục thiếu trực quan và không gây được thiện cảm.
- **Severity 3 — Trải nghiệm tồi ở bộ chọn thời gian (Time Picker):** Người dùng phàn nàn về việc phải lăn chuột để chọn giờ thay vì có thể nhập bằng bàn phím. Đặc biệt, vòng lặp số phút không liên tục (khi cuộn đến 59 không tự lật sang 00 mà phải kéo ngược về). Bên cạnh đó, hệ thống không đưa ra cảnh báo lỗi cụ thể khi người dùng nhập sai thời gian trong một số trường hợp.
- **Severity 2 — Logic và giao diện Waitlist & Limits gây bối rối:** Người dùng lúng túng giữa việc thiết lập giới hạn tổng (50 người) và cách chia tỉ lệ cho các vai trò (lecturer/student). Khó khăn trong việc xác định thứ tự bật/tắt công tắc Waitlist hay nhập số lượng trước.
- **Severity 2 — Phân quyền vai trò (Roles) phức tạp hóa luồng người dùng:** Người dùng đánh giá tính năng thêm Role là không cần thiết, làm phức tạp hệ thống, mất nhiều thời gian và đề xuất nên có cơ chế tự động phân loại.
- **Severity 1 — Thiếu chức năng xem trước (Preview) & Wording chưa rõ:** Người dùng gặp khó khăn trong việc căn chỉnh kích thước ảnh thumbnail và muốn có nút "Preview" trước khi xuất bản. Wording "Ngày & Giờ bắt đầu" được đề xuất đổi thành "Ngày & Giờ sự kiện bắt đầu" để tránh hiểu nhầm.

### Khuyến nghị cải thiện (Prioritized Recommendations)

1. **Làm nổi bật Call-to-Action (CTA):** Thiết kế lại trang chủ/danh sách sự kiện, đưa nút "Tạo sự kiện" (Create Event) thành Primary Button với màu sắc nổi bật ở góc phải màn hình.
2. **Sửa lỗi Time Picker (Khẩn cấp):** Thay thế component chọn giờ hiện tại bằng component hỗ trợ nhập số từ bàn phím trực tiếp và xử lý lại logic cuộn (scroll logic) cho mốc 00-59.
3. **Tái cấu trúc UI phần Waitlist & Role:** Gộp nhóm giới hạn người dùng theo Role thành một bảng trực quan (Dòng: Student/Lecturer, Cột: Số lượng, Waitlist Toggle). Thêm tooltip giải thích ngắn gọn tại các icon "i".
4. **Bổ sung chức năng Preview:** Thêm nút "Save & Preview" bên cạnh nút Publish để người dùng an tâm về định dạng ảnh/text trước khi công khai.

---

## Task 3 — Cross-Platform Compatibility

**Mô tả:** Test tương thích trên 4 OS × 5 Browser × 3 Device Type (Phone/Tablet/Desktop) cho 3 màn hình A1, A2, A3.
**Skill sử dụng:** `cross-platform-matrix-runner-SKILL.md`
**Thư mục ảnh:** `HW03/Screenshots/Task3/`
**Giai đoạn:** Phase 2 — VERIFY (đã test, đã đối chiếu ảnh)

### Yêu cầu độ phủ


| Khía cạnh                  | Yêu cầu                                                 |
| -------------------------- | ------------------------------------------------------- |
| Số OS tối thiểu            | **4** (Windows 11, macOS, Android, iOS)                 |
| Số Browser tối thiểu       | **5** (Chrome, Edge, Firefox, Safari, Samsung Internet) |
| Số loại thiết bị tối thiểu | **3** (Desktop, Tablet, Phone)                          |


### Tổng quan 3 màn hình


| Mã       | Màn hình                                                 | URL gốc                                                             | Số Cell cần test |
| -------- | -------------------------------------------------------- | ------------------------------------------------------------------- | ---------------- |
| **A1**   | Danh sách Events với bộ lọc trạng thái và chấm thông báo | `https://hiu.eventsplus.io/admin/events`                            | 10               |
| **A2**   | Modal Chỉnh sửa Event                                    | `https://hiu.eventsplus.io/admin/events/[id]/edit`                  | 10               |
| **A3**   | Panel Cấu hình Registration                              | `https://hiu.eventsplus.io/admin/events/[id]/edit` (tab Categories) | 10               |
| **Tổng** |                                                          |                                                                     | **30**           |


### Khung ma trận (đã test)


| Cell ID | OS         | Browser          | Loại thiết bị | Tên file ảnh                      | Kết quả | Ghi chú                                       |
| ------- | ---------- | ---------------- | ------------- | --------------------------------- | ------- | --------------------------------------------- |
| M01     | Windows 11 | Chrome           | Desktop       | Windows_Chrome_Desktop.png        | Passed  | Layout đầy đủ, sidebar + main content OK      |
| M02     | Windows 11 | Edge             | Desktop       | Windows_Edge_Desktop.png          | Passed  | Tương tự Chrome Desktop                       |
| M03     | macOS      | Safari           | Desktop       | macOS_Safari_Desktop.png          | Passed  | Layout macOS hiển thị đúng                    |
| M04     | macOS      | Firefox          | Desktop       | macOS_Firefox_Desktop.png         | Passed  | Cross-browser desktop OK                      |
| M05     | Android 14 | Chrome           | Phone         | Android_Chrome_Phone.png          | Failed  | Sidebar chồng main content - Không responsive |
| M06     | Android 14 | Samsung Internet | Phone         | Android_SamsungInternet_Phone.png | Failed  | Sidebar chồng main content - Không responsive |
| M07     | Android 14 | Chrome           | Tablet        | Android_Chrome_Tablet.png         | Passed  | Tablet hiển thị OK, layout responsive         |
| M08     | iOS 17     | Safari           | Phone         | iOS_Safari_Phone.png              | Failed  | Sidebar chồng main content - Không responsive |
| M09     | iOS 17     | Safari           | Tablet        | iOS_Safari_Tablet.png             | Passed  | iPad hiển thị OK, layout responsive           |
| M10     | iOS 17     | Chrome           | Phone         | iOS_Chrome_Phone.png              | Failed  | Sidebar chồng main content - Không responsive |


### Tổng kết (Phase 2 — Verify)

**Đã test: 10/10 cells (100%)**


| Chỉ số        | Giá trị |
| ------------- | ------- |
| Tổng cells    | 10      |
| Passed        | **6**   |
| Failed        | **4**   |
| Not Verified  | 0       |
| Thiếu overlay | 0       |


### Phân tích Fail theo Device Type


| Device Type | Tổng  | Passed | Failed | % Fail   |
| ----------- | ----- | ------ | ------ | -------- |
| Desktop     | 4     | 4      | 0      | 0%       |
| Tablet      | 2     | 2      | 0      | 0%       |
| **Phone**   | **4** | **0**  | **4**  | **100%** |


### Phân tích Fail theo OS


| OS          | Tổng  | Passed | Failed |
| ----------- | ----- | ------ | ------ |
| Windows 11  | 2     | 2      | 0      |
| macOS       | 2     | 2      | 0      |
| **Android** | **3** | **1**  | **2**  |
| **iOS**     | **3** | **1**  | **2**  |


### Nhận định chính

**Tất cả 4 cell Failed đều thuộc nhóm Phone (màn hình mobile):**

1. **M05** - Android Chrome Phone → Failed (không responsive)
2. **M06** - Android Samsung Internet Phone → Failed (không responsive)
3. **M08** - iOS Safari Phone → Failed (không responsive)
4. **M10** - iOS Chrome Phone → Failed (không responsive)

**Pattern Fail:** Sidebar chồng lên main content trên màn hình admin — trùng với Bug #A1-001, #A2-003, #A3-004 trong Task1_BugReports.md.

**Desktop và Tablet không bị ảnh hưởng** — chỉ riêng Phone là bị lỗi responsive trên cả 4 OS × Browser combo (Android Chrome, Android Samsung, iOS Safari, iOS Chrome).

### Kiểm tra độ phủ

- **OS:** Windows 11, macOS, Android 14, iOS 17 → **đủ 4** ✓
- **Browser:** Chrome, Edge, Safari, Firefox, Samsung Internet → **đủ 5** ✓
- **Device:** Desktop, Phone, Tablet → **đủ 3** ✓

---

## Tổng hợp đa task

### Bug xuất hiện ở nhiều task (Cross-validation)

Các bug dưới đây được phát hiện bởi **nhiều task khác nhau**, tăng độ tin cậy và mức độ ưu tiên:


| Bug                | Task 1 (GUI)              | Task 2 (Usability)      | Task 3 (Cross-Platform) | Mức độ hợp lệ        |
| ------------------ | ------------------------- | ----------------------- | ----------------------- | -------------------- |
| Sidebar đúp Mobile | #A1-001, #A2-003, #A3-004 | Discoverability score 3 | M05, M06, M08, M10 Fail | **Rất cao** — 3 task |
| Time Picker UX     | (không test)              | Severity 3              | (không test)            | Trung bình           |
| Waitlist phức tạp  | (chỉ panel cấu hình)      | Severity 2              | (không test)            | Trung bình           |
| Thiếu Preview      | (không test)              | Severity 1              | (không test)            | Trung bình           |
| Dấu `*` màu đen    | #A2-001, #A3-002          | (không đề cập)          | (không test)            | Cao                  |


### Bảng tổng hợp ưu tiên sửa (đã xếp theo mức độ nghiêm trọng)


| Ưu tiên | Bug / Vấn đề                                  | Nguồn           | Mức độ | Đề xuất                                                      |
| ------- | --------------------------------------------- | --------------- | ------ | ------------------------------------------------------------ |
| **P1**  | Responsive mobile (sidebar đúp)               | Task 1 + Task 3 | High   | Sửa component sidebar (CSS media query max-width: 768px)     |
| **P2**  | Time Picker UX tồi (Severity 3)               | Task 2          | High   | Thay component chọn giờ hỗ trợ nhập từ bàn phím              |
| **P3**  | Discoverability tạo sự kiện (Severity 3)      | Task 2          | High   | Đưa CTA "Tạo sự kiện" thành Primary Button nổi bật           |
| **P4**  | Search trả kết quả sai (#A1-005)              | Task 1          | High   | Kiểm tra logic search backend                                |
| **P5**  | Không hỗ trợ Deep Linking (#A1-007)           | Task 1          | High   | Sync filter vào query string                                 |
| **P6**  | Enter không submit form (#A2-004)             | Task 1          | High   | Thêm handler keydown Enter                                   |
| **P7**  | Xóa role không có confirmation (#A3-003)      | Task 1          | High   | Thêm dialog xác nhận                                         |
| **P8**  | Waitlist & Limits UI phức tạp (Severity 2)    | Task 2          | Medium | Gộp thành bảng trực quan (Role × Số lượng × Waitlist Toggle) |
| **P9**  | Roles phức tạp hóa luồng (Severity 2)         | Task 2          | Medium | Cơ chế tự động phân loại                                     |
| **P10** | Dấu `*` màu đen thay vì đỏ (#A2-001, #A3-002) | Task 1          | Medium | CSS: `label.required::after { color: red }`                  |
| **P11** | Bảng quá nhiều cột (#A1-002)                  | Task 1          | Medium | Loại bỏ/ẩn cột "Tham gia", "Doanh thu"                       |
| **P12** | Thiếu Export Excel/CSV (#A1-003)              | Task 1          | Medium | Bổ sung nút xuất dữ liệu                                     |
| **P13** | Search/Filter thiếu Label (#A1-004)           | Task 1          | Medium | Thêm `<label>` ẩn cho screen reader                          |
| **P14** | Upload ảnh thiếu thông số kỹ thuật (#A2-002)  | Task 1          | Medium | Bổ sung size/dimension/max-size cho thumbnail + banner       |
| **P15** | Empty State không thân thiện (#A1-006)        | Task 1          | Medium | Di chuyển empty state lên đầu bảng + nút "Xóa bộ lọc" inline |
| **P16** | Thiếu Preview + Wording chưa rõ (Severity 1)  | Task 2          | Low    | Thêm nút "Save & Preview" + đổi label "Ngày & Giờ bắt đầu"   |
| **P17** | Input thiếu label/hướng dẫn format (#A3-001)  | Task 1          | Low    | Bổ sung text hướng dẫn format cho input "Vai trò phụ"        |


---

## Kết luận chung

### Tổng kết số liệu toàn bộ HW03


| Chỉ số                             | Giá trị               |
| ---------------------------------- | --------------------- |
| Tổng mục GUI checklist             | 171                   |
| Tổng bug GUI (Task 1)              | 15                    |
| Tổng severity usability (Task 2)   | 5 (3 + 2 + 2 + 1 + 1) |
| Tổng cells cross-platform (Task 3) | 10                    |
| Tổng cells Failed (Task 3)         | 4                     |
| Người dùng tham gia usability test | 5                     |
| Tỉ lệ thành công task (Task 2)     | 100%                  |
| Thời gian TB hoàn thành task       | 6.9 phút              |
| Điểm SUS ước lượng (Task 2)        | 65-70/100             |


### Bug ưu tiên cao nhất (P1-P7)

Tổng cộng **8 bug High** cần xử lý trước khi release:

1. Responsive mobile (sidebar đúp) — xác nhận bởi cả Task 1 & Task 3
2. Time Picker UX tồi — xác nhận bởi Task 2 (Severity 3)
3. Discoverability tạo sự kiện — xác nhận bởi Task 2 (Severity 3)
4. Search trả kết quả sai
5. Không hỗ trợ Deep Linking
6. Enter không submit form
7. Xóa role không có confirmation

### Khuyến nghị tổng thể

1. **Ưu tiên sửa 8 bug High trước release** — ảnh hưởng trực tiếp đến trải nghiệm user
2. **Sửa bug Responsive Mobile ở mức component** — đây là bug duy nhất được xác nhận bởi cả 3 task, là ưu tiên #1
3. **Cải thiện Time Picker** — ảnh hưởng đến tất cả user nhập liệu thời gian (Task 2 severity 3)
4. **Cải thiện CTA "Tạo sự kiện"** — tăng discoverability (Task 2 severity 3)
5. **Sửa bug Cross-cutting ở mức CSS/component** — sidebar, dấu `*` (Task 1)
6. **Thêm unit test cho search backend** (#A1-005)
7. **Cải thiện Accessibility**: `<label>` ẩn, screen reader
8. **Bổ sung Export Excel/CSV**
9. **Bổ sung Preview trước khi Publish**

### Điểm tích cực tổng thể

1. **Tỉ lệ hoàn thành task 100%** (Task 2) — tất cả user đều hoàn thành được tác vụ
2. **Không có bug Critical** — không có bug nghiêm trọng ảnh hưởng toàn hệ thống
3. **Desktop và Tablet hoạt động tốt** — chỉ Phone là bị lỗi responsive
4. **Đa OS / Browser coverage đầy đủ** — Task 3 đã phủ 4 OS + 5 Browser + 3 Device Type
5. **Quy trình review chặt chẽ** — đã qua 4 vòng review (Task 1)
6. **Modal có Modality, Toggle đồng bộ, Icon nhất quán** (Task 1)
7. **100% mục checklist đã verified** (Task 1)
8. **Quy trình test có tài liệu đầy đủ** — ảnh bằng chứng cho từng bug

---

## Phụ lục

### A. Thư mục ảnh bằng chứng


| Màn hình / Task         | Thư mục                   | Số lượng ảnh |
| ----------------------- | ------------------------- | ------------ |
| A1                      | `HW03/Screenshots/A1/`    | ~15          |
| A2                      | `HW03/Screenshots/A2/`    | ~20          |
| A3                      | `HW03/Screenshots/A3/`    | ~11          |
| Task 3 (Cross-Platform) | `HW03/Screenshots/Task3/` | 10           |


### B. File nguồn


| File                                            | Mô tả                              |
| ----------------------------------------------- | ---------------------------------- |
| `HW03/Bug reports/Task1_BugReports.md`          | Bug report GUI Testing (Task 1)    |
| `HW03/Bug reports/Task2-Usability Report.md`    | Báo cáo Usability Testing (Task 2) |
| `HW03/Bug reports/Task3_CrossPlatformMatrix.md` | Ma trận Cross-Platform (Task 3)    |
| `HW03/Bug reports/A1_bugs.md`                   | Chi tiết checklist A1              |
| `HW03/Bug reports/A2_bugs.md`                   | Chi tiết checklist A2              |
| `HW03/Bug reports/A3_bugs.md`                   | Chi tiết checklist A3              |
| `HW03/check_list/Shared_GUI_Checklist.md`       | Checklist GUI 57 mục               |
| `HW03/ai_audit_log.md`                          | Log tương tác với AI Assistant     |


### C. Skill sử dụng


| Skill                                               | Mô tả                                        |
| --------------------------------------------------- | -------------------------------------------- |
| `HW03/skills/gui-checklist-runner-SKILL.md`         | Áp dụng checklist GUI và sinh bug report     |
| `HW03/skills/ai-audit-logger-SKILL.md`              | Ghi log tương tác AI (verbatim)              |
| `HW03/skills/cross-platform-matrix-runner-SKILL.md` | Lập kế hoạch + verify ma trận cross-platform |


### D. Lịch sử thay đổi


| Ngày       | Phiên bản | Mô tả                                                   |
| ---------- | --------- | ------------------------------------------------------- |
| 2026-08-01 | v1.0      | Chạy checklist GUI lần đầu (Task 1 - Agent)             |
| 2026-08-02 | v2.0      | User review vòng 1, bổ sung ảnh (Task 1)                |
| 2026-08-02 | v3.0      | User review vòng 2 (Task 1)                             |
| 2026-08-03 | v4.0      | Tổng hợp A1, A2, A3 thành Task1_BugReports.md           |
| 2026-08-03 | v1.0      | Plan ma trận cross-platform (Task 3 - Phase 1)          |
| 2026-08-03 | v1.1      | Verify ma trận cross-platform (Task 3 - Phase 2)        |
| 2026-08-04 | v1.0      | Tổng hợp 3 task thành file duy nhất Task_All_Reports.md |


---

