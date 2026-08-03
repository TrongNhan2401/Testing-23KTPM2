# BUG REPORTS — TASK 1

## GUI Testing: Admin Event Management System

**Môn học:** Kiểm thử và đảm bảo chất lượng phần mềm (Software Quality Assurance & Testing)
**Đề tài:** Hệ thống Quản lý Sự kiện (EventsPlus)
**Checklist nguồn:** `HW03/check_list/Shared_GUI_Checklist.md`
**Thư mục ảnh:** `HW03/Screenshots/`
**Ngày chạy:** `2026-08-01` đến `2026-08-03`
**Trạng thái:** **Hoàn thành** — 100% mục đã verified (171/171 mục)

---

## Mục lục

1. [Tổng quan](#tổng-quan)
2. [Tổng hợp toàn cục](#tổng-hợp-toàn-cục)
3. [Bug Reports — A1: Danh sách Events](#bug-reports--a1-danh-sách-events)
4. [Bug Reports — A2: Modal Chỉnh sửa Event](#bug-reports--a2-modal-chỉnh-sửa-event)
5. [Bug Reports — A3: Panel Cấu hình Registration](#bug-reports--a3-panel-cấu-hình-registration)
6. [Bug Reports chung — Cross-cutting](#bug-reports-chung--cross-cutting)
7. [Kết luận và Khuyến nghị](#kết-luận-và-khuyến-nghị)

---

## Tổng quan

### Phạm vi testing

Testing tập trung vào giao diện Admin của hệ thống Quản lý Sự kiện, bao gồm 3 màn hình chính:


| Mã     | Màn hình                    | Mô tả                                                                                              |
| ------ | --------------------------- | -------------------------------------------------------------------------------------------------- |
| **A1** | Danh sách Events            | Bảng danh sách sự kiện với bộ lọc trạng thái, search, phân trang, và chấm thông báo                |
| **A2** | Modal Chỉnh sửa Event       | Form chỉnh sửa sự kiện với 5 tab: Thông tin cơ bản, Ngày giờ, Địa điểm, Danh mục, Tùy chọn bổ sung |
| **A3** | Panel Cấu hình Registration | Cấu hình Roles, Max Slots, Waitlist, Vai trò phụ cho đăng ký sự kiện                               |


### Checklist sử dụng

Sử dụng checklist `Shared_GUI_Checklist.md` với **57 mục kiểm tra** chia thành 4 khía cạnh:


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


---

## Tổng hợp toàn cục

### Số liệu tổng hợp


| Chỉ số         | A1   | A2   | A3   | **Tổng** |
| -------------- | ---- | ---- | ---- | -------- |
| Tổng số mục    | 57   | 57   | 57   | **171**  |
| Passed         | 27   | 29   | 17   | **73**   |
| Failed         | 7    | 4    | 5    | **16**   |
| N/A            | 23   | 24   | 35   | **82**   |
| Not Verified   | 0    | 0    | 0    | **0**    |
| Tỷ lệ verified | 100% | 100% | 100% | **100%** |


### Phân tích theo khía cạnh


| Khía cạnh         | Tổng    | Passed | Failed | N/A    |
| ----------------- | ------- | ------ | ------ | ------ |
| IA-01: Chuẩn UI   | 45      | 30     | 5      | 10     |
| IA-02: Forms      | 45      | 12     | 7      | 26     |
| IA-03: Navigation | 33      | 8      | 3      | 22     |
| IA-04: Feedback   | 48      | 23     | 1      | 24     |
| **Tổng**          | **171** | **73** | **16** | **82** |


### Phân bố Bug theo mức độ nghiêm trọng


| Mức độ       | Số lượng | Mô tả                                                 |
| ------------ | -------- | ----------------------------------------------------- |
| **Critical** | 0        | Không có bug nghiêm trọng ảnh hưởng đến toàn hệ thống |
| **High**     | 6        | Ảnh hưởng đáng kể đến usability cốt lõi               |
| **Medium**   | 6        | Giảm usability nhưng không ngăn cản sử dụng           |
| **Low**      | 4        | Giảm trải nghiệm nhẹ                                  |


### Phân bố Bug theo màn hình


| Màn hình               | High  | Medium | Low   | Tổng   |
| ---------------------- | ----- | ------ | ----- | ------ |
| A1: Danh sách Events   | 4     | 3      | 0     | **7**  |
| A2: Modal Chỉnh sửa    | 2     | 2      | 0     | **4**  |
| A3: Panel Registration | 2     | 1      | 2     | **5**  |
| **Tổng**               | **8** | **6**  | **2** | **16** |


---

## BUG REPORTS — A1: Danh sách Events

**Mô tả:** Bảng danh sách sự kiện với bộ lọc trạng thái, search, phân trang, và chấm thông báo.
**Thư mục ảnh:** `HW03/Screenshots/A1/`

### Bug #A1-001: Giao diện không responsive trên Mobile

- **Mã ID:** IA01-08
- **Mức độ:** High
- **Mô tả:** Khi truy cập màn hình Danh sách Events trên thiết bị mobile, sidebar chính và sidebar overlay chồng lên nhau (hiển thị đúp), giao diện bị vỡ layout.
- **Bằng chứng:** `A1_mobile.jpg`
- **Đề xuất:** Thiết kế lại responsive cho breakpoint mobile — sidebar chính nên ẩn khi vào mobile, chỉ hiển thị hamburger menu.

### Bug #A1-002: Bảng danh sách Events hiển thị quá nhiều cột (data overload)

- **Mã ID:** IA01-13
- **Mức độ:** Medium
- **Mô tả:** Bảng danh sách Events hiển thị 6 cột. Cột "Tham gia" và "Doanh thu" hiển thị trên màn hình admin event gây data overload cho tác vụ chính.
- **Bằng chứng:** `A1_default.png`, `A1_table_list_events_01/02/03.png`
- **Đề xuất:** Loại bỏ hoặc ẩn cột "Tham gia" và "Doanh thu" trên màn hình admin, hoặc chuyển sang tab "Thống kê" riêng.

### Bug #A1-003: Thiếu chức năng Export Excel/CSV

- **Mã ID:** IA01-15
- **Mức độ:** Medium
- **Mô tả:** Màn hình Danh sách Events không có nút Export (Excel/CSV) để xuất dữ liệu phục vụ báo cáo và thống kê.
- **Bằng chứng:** `A1_default.png`, `A1_table_list_events_01/02/03.png`
- **Đề xuất:** Bổ sung nút "Xuất Excel" / "Xuất CSV" cạnh nút "+ Tạo sự kiện".

### Bug #A1-004: Search box và Filter Dropdown thiếu Label

- **Mã ID:** IA02-01
- **Mức độ:** Medium
- **Mô tả:** Search box chỉ có placeholder, KHÔNG có `<label>` riêng. Dropdown filter Status và Time cũng không có label riêng. Phần pagination chỉ hiển thị "Trang 1 / 1" không có label "Trang" — phụ thuộc placeholder là không đủ cho accessibility (screen reader sẽ không đọc được vai trò của input).
- **Bằng chứng:** `A1_label_search.png`, `A1_label_pagination.png`
- **Đề xuất:** Thêm `<label>` ẩn (visually-hidden nhưng có cho screen reader) cho search box, filter dropdown, và pagination input.

### Bug #A1-005: Search trả về kết quả không khớp hoàn toàn với từ khóa

- **Mã ID:** IA03-06
- **Mức độ:** High
- **Mô tả:** Tìm kiếm với từ khóa "anh" trả về kết quả có chứa "anh" trong tiêu đề nhưng vẫn xuất hiện event khác không có từ "anh" trong tiêu đề hiện tại — nghi vấn dữ liệu cũ còn lưu khi tên đã thay đổi.
- **Bằng chứng:** `A1_search_01.png`, `A1_search_02.png`
- **Đề xuất:** Kiểm tra logic search backend (full-text search có đang dùng index cũ không? có cần reindex khi update event không?). Test với dữ liệu mới hoàn toàn để xác nhận.

### Bug #A1-006: Empty State không thân thiện và thiếu nút "Xóa bộ lọc" inline

- **Mã ID:** IA03-08
- **Mức độ:** Medium
- **Mô tả:** Khi filter ra 0 kết quả, câu thông báo "Không có dữ liệu hiển thị" hiển thị ở giữa bảng (gần giữa viewport), người dùng cần kéo qua mới thấy được. KHÔNG có thông báo nhanh ở đầu trang (toast/banner). KHÔNG có nút "Xóa bộ lọc" inline gần thông báo — phải bấm nút "Đặt lại" riêng.
- **Bằng chứng:** `A1_filter_Draft.png`, `A1_filter_combine.png`
- **Đề xuất:** Di chuyển thông báo empty state lên đầu bảng (hoặc thêm banner đầu trang), bổ sung nút "Xóa bộ lọc" inline cạnh thông báo.

### Bug #A1-007: URL không thay đổi khi filter — không hỗ trợ Deep Linking

- **Mã ID:** IA03-07
- **Mức độ:** High
- **Mô tả:** Sau khi filter (chọn Status "Tất cả trạng thái" và Time "Tất cả thời gian"), URL vẫn là `https://hiu.eventsplus.io/admin/events` — không có query string filter/search. Người dùng không thể:
  - Copy URL đã filter rồi share cho đồng nghiệp.
  - Bookmark lại trạng thái filter cụ thể.
  - Back/Forward trình duyệt không đi qua các trạng thái filter.
- **Bằng chứng:** `A1_filter_url.png`
- **Đề xuất:** Sử dụng query string để sync trạng thái filter vào URL, ví dụ: `?status=draft&time=week`. Khi load trang, đọc query string để áp dụng filter tương ứng.

---

## BUG REPORTS — A2: Modal Chỉnh sửa Event

**Mô tả:** Form chỉnh sửa sự kiện với 5 tab: Thông tin cơ bản, Ngày giờ, Địa điểm, Danh mục, Tùy chọn bổ sung.
**Thư mục ảnh:** `HW03/Screenshots/A2/`

### Bug #A2-001: Dấu `*` cho trường bắt buộc sử dụng màu đen thay vì đỏ

- **Mã ID:** IA02-02
- **Mức độ:** Medium
- **Mô tả:** Trên modal chỉnh sửa event, các trường bắt buộc có dấu `*` nhưng sử dụng màu **ĐEN** thay vì màu **ĐỎ** theo yêu cầu của checklist IA02-02 ("dấu `*` màu đỏ"). Điều này làm cho dấu `*` kém nổi bật hơn trên nền trắng, khiến user khó phân biệt đâu là trường bắt buộc trong quá trình nhập liệu.
  - Các trường có dấu `*` đen: Tiêu đề sự kiện, Mô tả ngắn, Thể loại, Danh mục, Sự kiện riêng tư, Registration method
  - Mặc dù hệ thống sẽ cảnh báo và không cho publish khi thiếu trường bắt buộc, nhưng việc dấu `*` đen khó nhận biết gây trải nghiệm không tốt cho người dùng
- **Bằng chứng:** `A2_attachments_basicInfomation.png`, `A2_dateTime.png`, `A2_categories_registration.png`
- **Đề xuất:**
  - Đổi màu dấu `*` từ đen sang **đỏ** theo yêu cầu checklist (Norman's Signifier — dấu hiệu trực quan nổi bật hơn).
  - Đảm bảo tất cả trường bắt buộc đều có dấu `*` cùng màu (đỏ) để đồng nhất.

### Bug #A2-002: Vùng upload ảnh đại diện và ảnh bìa thiếu thông số kỹ thuật cụ thể

- **Mã ID:** IA02-08
- **Mức độ:** Medium
- **Mô tả:** Khu vực upload Ảnh đại diện (Thumbnail, 1:1) và Ảnh bìa (Banner, 16:9) chỉ hiển thị text hướng dẫn chung chung "Khuyến nghị kích thước ảnh" mà KHÔNG có thông số kỹ thuật cụ thể: kích thước pixel (width × height), tỉ lệ chính xác, dung lượng tối đa (KB/MB), định dạng file được phép (JPG, PNG, WEBP...). User có thể upload file quá lớn gây lỗi server hoặc tỉ lệ sai khiến ảnh bị cắt méo.
- Phần Tệp đính kèm (attachments) có ghi rõ "You can upload up to 5 files (10MB max each)" — KHÔNG đồng nhất với 2 vùng upload ảnh.
- **Bằng chứng:** `A2_thumbnail_banner.png`, `A2_attachments_basicInfomation.png`, `A2_add_thumnail.png`, `A2_add_banner.png`
- **Đề xuất:**
  - Bổ sung text hướng dẫn cụ thể cho Ảnh đại diện: "Khuyến nghị: 400x400 px (1:1). Tối đa: 2MB. Định dạng: JPG, PNG".
  - Bổ sung text hướng dẫn cụ thể cho Ảnh bìa: "Khuyến nghị: 1200x675 px (16:9). Tối đa: 5MB. Định dạng: JPG, PNG".
  - Có thể dùng chung component để đảm bảo đồng nhất giữa các vùng upload.

### Bug #A2-003: Giao diện không responsive trên Mobile — sidebar hiển thị đúp

- **Mã ID:** IA01-08
- **Mức độ:** High
- **Mô tả:** Khi truy cập màn hình thêm event trên thiết bị mobile, sidebar chính và overlay sidebar chồng lên nhau (hiển thị đúp), giao diện bị vỡ layout. Tương tự bug #A1-001 ở A1.
- **Bằng chứng:** `A2_addEvent_mobile.jpg`
- **Đề xuất:**
  - Thiết kế lại responsive cho breakpoint mobile.
  - Sidebar chính nên ẩn khi vào mobile, chỉ hiển thị hamburger menu.
  - Đảm bảo overlay sidebar chỉ hiển thị khi user click mở menu, không hiển thị đúp cùng sidebar chính.

### Bug #A2-004: Không thể nhấn Enter để Submit form

- **Mã ID:** IA02-04
- **Mức độ:** High
- **Mô tả:** Khi điền xong các trường trong form chỉnh sửa event, user **không thể nhấn phím Enter** để submit form. Phải dùng chuột click vào nút "Đăng" — đây là điểm gây bất tiện cho user thường xuyên nhập liệu bằng bàn phím.
- **Bằng chứng:** Không có ảnh chụp trực tiếp (đây là test hành vi tương tác bàn phím) — dựa trên xác nhận test thực tế
- **Đề xuất:**
  - Bổ sung handler bắt sự kiện `keydown` cho phím Enter trên form.
  - Đảm bảo Enter submit form tương đương click nút "Đăng".
  - Cân nhắc: chỉ trigger submit khi user không đang focus vào textarea (rich-text editor) để tránh submit nhầm khi đang viết mô tả.

---

## BUG REPORTS — A3: Panel Cấu hình Registration

**Mô tả:** Cấu hình Roles, Max Slots, Waitlist, Vai trò phụ cho đăng ký sự kiện.
**Thư mục ảnh:** `HW03/Screenshots/A3/`

### Bug #A3-001: Input "Vai trò phụ" và Max slots thiếu label rõ ràng và hướng dẫn format

- **Mã ID:** IA02-01
- **Mức độ:** Low
- **Mô tả:** Input "Vai trò phụ" chỉ có placeholder "BCH khoa, BTC..." mà KHÔNG có hướng dẫn format phân cách (dấu phẩy, dấu chấm phẩy, hay xuống dòng?). Input "Max slots" của từng role chỉ có placeholder "500" nhưng label "Max slots" nằm ở trên dễ gây nhầm lẫn.
- **Bằng chứng:** `A3_default.png`, `A3_student_roles.png`
- **Đề xuất:** Bổ sung text hướng dẫn format dưới input "Vai trò phụ", ví dụ: "Phân cách các vai trò bằng dấu phẩy (,). Tối đa 5 vai trò phụ."

### Bug #A3-002: Các trường quan trọng trong panel không có dấu `*` bắt buộc

- **Mã ID:** IA02-02
- **Mức độ:** Medium
- **Mô tả:** Trên panel cấu hình Registration, các trường sau KHÔNG có dấu `*` đỏ mặc dù chúng là bắt buộc khi lưu cấu hình: tên role (text input), Max slots của từng role (number input), "Số lượng đăng ký tối đa (Tổng)" (number input), "Vai trò phụ" (text input).
- **Bằng chứng:** `A3_default.png`, `A3_student_roles.png`, `A3_add_role.png`
- **Đề xuất:** Thêm dấu `*` đỏ cho tất cả trường bắt buộc. Nếu một số trường thực sự optional (ví dụ: vai trò phụ), cần ghi rõ "(tùy chọn)" sau label.

### Bug #A3-003: Xóa role KHÔNG có dialog xác nhận — nguy cơ xóa nhầm

- **Mã ID:** IA04-04
- **Mức độ:** High
- **Mô tả:** Xóa role là hành động phá hủy — có thể ảnh hưởng đến các user đã đăng ký theo role đó, cấu hình số lượng tối đa, dữ liệu thống kê theo role. Tuy nhiên khi user click nút X trên role → role bị xóa NGAY LẬP TỨC, không có dialog xác nhận.
- **Bằng chứng:** `A3_delete_role.png` (trước đó có 3 roles bao gồm "Giảng viên" trong `A3_add_role.png`, sau khi click X chỉ còn "Học sinh" và "Sinh viên")
- **Đề xuất:** Thêm dialog xác nhận trước khi xóa role:
  - Tiêu đề: "Xóa role"
  - Nội dung: "Bạn có chắc chắn muốn xóa role '[tên role]' không? Hành động này có thể ảnh hưởng đến các user đã đăng ký."
  - Nút "Hủy" (màu trắng) và nút "Xóa" (màu đỏ)
  - Có overlay mờ phía sau để đảm bảo modality

### Bug #A3-004: Giao diện không responsive trên Mobile

- **Mã ID:** IA01-08
- **Mức độ:** High
- **Mô tả:** Panel cấu hình Registration không hiển thị tốt trên thiết bị mobile.
- **Bằng chứng:** A3_role_mobile.jpg
- **Đề xuất:** Thiết kế lại responsive cho panel cấu hình trên mobile.

---

## BUG REPORTS chung — Cross-cutting

Các bug sau xuất hiện ở nhiều màn hình và cần được sửa đồng nhất trên toàn hệ thống:

### Bug #C-001: Sidebar hiển thị đúp trên Mobile (A1, A2, A3)

- **Mã ID:** IA01-08 (A1, A2, A3)
- **Mức độ:** High
- **Bug liên quan:** Bug #A1-001, Bug #A2-003, Bug #A3-005
- **Mô tả:** Bug này xuất hiện ở cả 3 màn hình (A1, A2, A3). Nguyên nhân gốc: sidebar chính và overlay sidebar chồng lên nhau trên mobile.
- **Đề xuất toàn cục:**
  - Sửa ở mức layout/component sidebar thay vì sửa riêng từng màn hình.
  - Kiểm tra CSS media query cho breakpoint mobile (max-width: 768px).
  - Đảm bảo sidebar chính ẩn khi vào mobile, chỉ hiển thị hamburger menu.

### Bug #C-002: Dấu `*` bắt buộc sử dụng màu đen thay vì đỏ (A2, A3)

- **Mã ID:** IA02-02 (A2, A3)
- **Mức độ:** Medium
- **Bug liên quan:** Bug #A2-001, Bug #A3-002
- **Mô tả:** Bug này xuất hiện ở cả A2 và A3. Nguyên nhân gốc: CSS không định nghĩa màu đỏ cho dấu `*` required.
- **Đề xuất toàn cục:**
  - Sửa ở mức global CSS/component input thay vì sửa riêng từng form.
  - Thêm CSS rule cho `label.required::after { content: " *"; color: red; }`.

---

## Kết luận và Khuyến nghị

### Tổng kết số liệu


| Chỉ số             | Giá trị    |
| ------------------ | ---------- |
| Tổng số mục tested | 171        |
| Tổng Passed        | 73 (42.7%) |
| Tổng Failed (Bug)  | 16 (9.4%)  |
| Tổng N/A           | 82 (47.9%) |
| Tổng Not Verified  | 0 (0%)     |


### Bug cần ưu tiên sửa (theo thứ tự)


| Ưu tiên | Bug                                                           | Mức độ | Mô tả                           |
| ------- | ------------------------------------------------------------- | ------ | ------------------------------- |
| **1**   | #A1-001, #A2-003, #A3-005, #C-001                             | High   | Responsive mobile — sidebar đúp |
| **2**   | #A1-005                                                       | High   | Search trả kết quả sai          |
| **3**   | #A1-007                                                       | High   | Không hỗ trợ Deep Linking       |
| **4**   | #A2-004                                                       | High   | Không thể nhấn Enter submit     |
| **5**   | #A3-004                                                       | High   | Xóa role không có confirmation  |
| **6**   | #A1-002, #A1-003, #A1-004, #A1-006, #A2-001, #A2-002, #A3-002 | Medium | Usability/Accessibility         |
| **7**   | #A3-001, #A3-003                                              | Low    | Placeholder/Label               |


### Điểm tích cực của hệ thống

1. **Giao diện sạch sẽ**: Typography phân cấp rõ ràng, màu sắc nhất quán
2. **Icon nhất quán**: Icon sử dụng đúng nghĩa (X = Xóa, + = Thêm, chuông = Thông báo)
3. **Hover/Active effect rõ ràng**: Các nút và input có hiệu ứng hover/active nhất quán
4. **Modal có Modality**: Modal overlay chặn tương tác với nền
5. **Controls đồng bộ**: Toggle ON/OFF hiển thị input tương ứng
6. **Dialog xóa event có confirmation**: A1 có dialog xác nhận khi xóa event (nhưng A3 không có cho xóa role)
7. **Rich-text editor đầy đủ**: A2 có rich-text editor với đầy đủ format options
8. **Gom nhóm hợp lý**: Các form được chia thành tab/section rõ ràng

### Khuyến nghị

1. **Ưu tiên sửa bug High trước**: Responsive mobile và Deep Linking ảnh hưởng trực tiếp đến trải nghiệm user
2. **Sửa bug cross-cutting ở mức component**: Sidebar và dấu `*` nên sửa ở global CSS/component thay vì sửa riêng từng màn hình
3. **Thêm unit test cho search**: Bug #A1-005 về search trả kết quả sai có thể do backend — cần thêm unit test cho search logic
4. **Cải thiện Accessibility**: Thêm `<label>` cho input, hỗ trợ screen reader
5. **Thêm Export Excel**: Nút xuất dữ liệu phục vụ báo cáo/thống kê

---

## Phụ lục

### A. Bảng chi tiết checklist (tham khảo)

Bảng chi tiết 171 mục kiểm tra cho 3 màn hình (A1, A2, A3) đã được lưu trong các file riêng:

- `HW03/Bug reports/A1_bugs.md`
- `HW03/Bug reports/A2_bugs.md`
- `HW03/Bug reports/A3_bugs.md`

### B. Thư mục ảnh bằng chứng


| Màn hình | Thư mục                | Số lượng ảnh |
| -------- | ---------------------- | ------------ |
| A1       | `HW03/Screenshots/A1/` | ~15          |
| A2       | `HW03/Screenshots/A2/` | ~20          |
| A3       | `HW03/Screenshots/A3/` | ~11          |


### C. Lịch sử thay đổi


| Ngày       | Phiên bản | Mô tả                                     |
| ---------- | --------- | ----------------------------------------- |
| 2026-08-01 | v1.0      | Chạy checklist lần đầu (Agent)            |
| 2026-08-02 | v2.0      | User review vòng 1, bổ sung ảnh           |
| 2026-08-02 | v3.0      | User review vòng 2                        |
| 2026-08-03 | v4.0      | Tổng hợp A1, A2, A3 thành file hoàn chỉnh |


---

**Ngày tạo:** 2026-08-03
**Trạng thái:** Hoàn thành
**Người thực hiện:** Tester (User) + AI Assistant (Claude)