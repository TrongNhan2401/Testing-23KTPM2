# Kết quả chạy Checklist

## A3: Panel cấu hình Registration (Roles, Max Slots, Waitlist, Vai trò phụ)

**Checklist nguồn:** `HW03/check_list/Shared_GUI_Checklist.md`
**Thư mục ảnh:** `HW03/Screenshots/A3/`
**Ngày chạy:** `2026-08-02`

**Trạng thái:** Bảng chi tiết đã được cập nhật dựa trên 11 ảnh trong folder A3 (6 ảnh cũ + 5 ảnh mới: `A3_allow_guest.png`, `A3_allow_lecturer.png`, `A3_allow_student.png`, `A3_allow_waitlist.png`, `A3_public_event.png`). Phân loại **N/A** vs **Not Verified** đã được xác nhận với user: panel cấu hình Registration chỉ là config, không phải full form nên nhiều mục thuộc N/A.

---

## Chi tiết kết quả


| Mã ID   | Mục kiểm tra                                                         | Trạng thái           | Ảnh bằng chứng                                                                    | Ghi chú                                                                                                                                                                 |
| ------- | -------------------------------------------------------------------- | -------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IA01-01 | Font chữ (Typography) rõ ràng, kích thước chữ phân cấp đúng          | Passed               | `A3_default.png`                                                                  | H1 "Cấu hình đăng ký", H2 cho "Roles cho registration" và "Registration settings", label phân cấp hợp lý                                                                |
| IA01-02 | Màu sắc nhất quán theo SUT                                           | Passed               | `A3_default.png`, `A3_add_role.png`                                               | Nút "+ Add another role" primary xanh dương, nút X (Xóa) màu xám/đỏ — nhất quán với A1/A2                                                                               |
| IA01-03 | Độ tương phản màu sắc đủ cao                                         | Passed               | `A3_default.png`                                                                  | Text đen trên nền trắng, label đậm, input có viền rõ                                                                                                                    |
| IA01-04 | Tính năng chuyển đổi ngôn ngữ EN/VI                                  | N/A                  | -                                                                                 | Panel cấu hình không có tính năng i18n riêng; ngôn ngữ phụ thuộc vào toggle EN/VI toàn cục của app (xem A2)                                                             |
| IA01-05 | Text không bị tràn/vỡ layout khi chuyển sang tiếng Việt              | Passed               | Tất cả ảnh A3                                                                     | UI đang ở tiếng Việt, text có dấu hiển thị đầy đủ, layout gọn                                                                                                           |
| IA01-06 | Trạng thái rỗng (Empty State) hiển thị thông báo thân thiện          | Passed               | `A3_default.png`                                                                  | Khi toggle OFF (không cho phép đăng ký), các nút có màu xám → đây là visual cue cho trạng thái disabled/empty. Có nút "+ Add another role" khi cần thêm role            |
| IA01-07 | Trạng thái tải (Loading/Skeleton)                                    | N/A                  | -                                                                                 | Panel cấu hình là inline form, không hiển thị loading state khi load                                                                                                    |
| IA01-08 | Giao diện hiển thị tốt (Responsive) trên Desktop, Tablet, Mobile     | Failed               | (user đã bổ sung ảnh)                                                             | Panel không responsive trên mobile. **Xem Bug #A3-005**                                                                                                                 |
| IA01-09 | Hình ảnh (Thumbnail, Banner sự kiện) hiển thị đúng tỷ lệ chuẩn       | N/A                  | -                                                                                 | Panel cấu hình không có thumbnail/banner                                                                                                                                |
| IA01-10 | Icon sử dụng nhất quán, khớp với thế giới thực                       | Passed               | `A3_default.png`, `A3_student_roles.png`, `A3_add_role.png`, `A3_delete_role.png` | Icon X = Xóa, icon "+" = Thêm, icon checkmark = Toggle ON — nhất quán và đúng nghĩa                                                                                     |
| IA01-11 | Không có thẻ HTML rác hoặc code render trực tiếp trên UI             | Passed               | Tất cả ảnh A3                                                                     | Toàn bộ text hiển thị sạch, không thấy tag HTML bị lộ                                                                                                                   |
| IA01-12 | Footer và Contact hiển thị đúng cấu hình từ Admin Settings           | N/A                  | -                                                                                 | Panel cấu hình không hiển thị footer                                                                                                                                    |
| IA01-13 | Lượng thông tin hiển thị vừa đủ, không quá nhồi nhét                 | Passed               | `A3_default.png`                                                                  | Panel chia thành 2 cột rõ ràng: Roles cho registration (trái) và Registration settings (phải) — mỗi cột gom các trường liên quan                                        |
| IA01-14 | Giao diện tổ chức theo tác vụ người dùng, gom nhóm hợp lý            | Passed               | `A3_default.png`                                                                  | Gom nhóm theo logic: Roles (bên trái) và Settings (bên phải)                                                                                                            |
| IA01-15 | Dữ liệu xuất Excel/CSV đồng nhất                                     | N/A                  | -                                                                                 | Panel cấu hình không có export                                                                                                                                          |
| IA02-01 | Mọi input field đều có Label rõ ràng, ngắn gọn, dễ hiểu              | Failed               | `A3_default.png`, `A3_student_roles.png`                                          | **Bug #A3-001**: Input "Vai trò phụ" thiếu hướng dẫn format; input "Max slots" của từng role thiếu label đầy đủ                                                         |
| IA02-02 | Trường bắt buộc có dấu `*` màu đỏ hoặc nhãn rõ ràng                  | Failed               | `A3_default.png`, `A3_student_roles.png`, `A3_add_role.png`                       | **Bug #A3-002**: Các input quan trọng KHÔNG có dấu `*` đỏ: tên role, max slots của từng role, "Số lượng đăng ký tối đa (Tổng)", "Vai trò phụ"                           |
| IA02-03 | Placeholder text cung cấp ví dụ định dạng hữu ích                    | Passed (User review) | `A3_default.png`, `A3_student_roles.png`                                          |                                                                                                                                                                         |
| IA02-04 | Có thể nhấn "Enter" để Submit form thay vì click                     | N/A                  | -                                                                                 | Panel cấu hình Registration chỉ là config, không có form submit. Các thay đổi được lưu tự động hoặc khi lưu event cha                                                   |
| IA02-05 | Validation lỗi định dạng real-time hoặc khi blur                     | N/A                  | -                                                                                 | Panel không có input cần validation định dạng (không có email, URL, v.v.)                                                                                               |
| IA02-06 | Error message hiển thị inline dưới trường lỗi                        | N/A                  | -                                                                                 | Panel không có error message inline                                                                                                                                     |
| IA02-07 | Nội dung thông báo lỗi có tính xây dựng                              | N/A                  | -                                                                                 | Panel không có error message                                                                                                                                            |
| IA02-08 | Vùng Upload File/Ảnh ghi rõ định dạng và dung lượng tối đa           | N/A                  | -                                                                                 | Panel cấu hình không có upload                                                                                                                                          |
| IA02-09 | Sau khi upload ảnh thành công, có hiển thị Preview                   | N/A                  | -                                                                                 | Panel không có upload                                                                                                                                                   |
| IA02-10 | Nút Submit bị disable hoặc chuyển loading khi đang gửi               | N/A                  | -                                                                                 | Panel không có nút Submit                                                                                                                                               |
| IA02-11 | Focus order (Tab) di chuyển hợp lý trong form                        | N/A                  | -                                                                                 | Panel không phải full form để đánh giá focus order                                                                                                                      |
| IA02-12 | Outline Focus rõ ràng khi dùng Tab (Accessibility)                   | N/A                  | -                                                                                 | Panel không phải full form để đánh giá focus outline                                                                                                                    |
| IA02-13 | Form nhiều bước có thanh chỉ báo tiến trình                          | N/A                  | -                                                                                 | Panel không phải multi-step form                                                                                                                                        |
| IA02-14 | Rich-text editor hoạt động đúng                                      | N/A                  | -                                                                                 | Panel không có rich-text editor                                                                                                                                         |
| IA02-15 | Input fields hiển thị giá trị mặc định chính xác, hợp lý             | Passed               | `A3_default.png`, `A3_student_roles.png`, `A3_allow_waitlist.png`                 | Max slots mặc định "500", "Số lượng đăng ký tối đa (Tổng)" mặc định "1000", "Vai trò phụ" mặc định "BCH khoa, BTC...", "Maximum waitlist slots" mặc định "100" — hợp lý |
| IA03-01 | Navbar/Sidebar highlight rõ trang đang đứng (Active state)           | N/A                  | -                                                                                 | Ảnh crop không thấy sidebar (panel là section trong trang event)                                                                                                        |
| IA03-02 | Breadcrumb rõ ràng ở trang con sâu                                   | N/A                  | -                                                                                 | Ảnh crop không thấy breadcrumb                                                                                                                                          |
| IA03-03 | Phân trang đúng: Nút lùi bên trái, Nút tiến bên phải                 | N/A                  | -                                                                                 | Panel không có phân trang                                                                                                                                               |
| IA03-04 | Nút "Back", "Hủy bỏ" luôn sẵn sàng                                   | N/A                  | -                                                                                 | Panel không hiển thị nút Back/Hủy                                                                                                                                       |
| IA03-05 | Bộ lọc áp dụng chính xác, UI hiển thị rõ filter đang bật             | N/A                  | -                                                                                 | Panel không có filter                                                                                                                                                   |
| IA03-06 | Search trả về kết quả đúng; từ khóa tìm kiếm vẫn được giữ lại        | N/A                  | -                                                                                 | Panel không có search box                                                                                                                                               |
| IA03-07 | Deep Linking: URL filter/search giữ nguyên khi mở tab mới            | N/A                  | -                                                                                 | Ảnh crop không thấy URL bar                                                                                                                                             |
| IA03-08 | Trạng thái không có kết quả hiển thị thân thiện, có nút "Xóa bộ lọc" | N/A                  | -                                                                                 | Panel không có filter/empty state do filter                                                                                                                             |
| IA03-09 | Drag-drop có chỉ báo thị giác                                        | N/A                  | -                                                                                 | Panel không có drag-drop                                                                                                                                                |
| IA03-10 | Khi đang kéo thả, item có phản hồi thị giác                          | N/A                  | -                                                                                 | Panel không có drag-drop                                                                                                                                                |
| IA03-11 | Sau khi thả, thứ tự mới cập nhật ngay + thông báo lưu                | N/A                  | -                                                                                 | Panel không có drag-drop                                                                                                                                                |
| IA04-01 | Toast thành công màu xanh lá                                         | N/A                  | `A3_allow_guest.png`, `A3_allow_lecturer.png`, `A3_allow_waitlist.png`            | Khi bật toggle (Allow guest/Waitlist), không có toast hiện ra — chỉ thay đổi trạng thái toggle và hiển thị input tương ứng. Panel không có tính năng toast              |
| IA04-02 | Toast thất bại màu đỏ                                                | N/A                  | -                                                                                 | Panel không có tính năng toast                                                                                                                                          |
| IA04-03 | Toast tự biến mất sau 3–5 giây                                       | N/A                  | -                                                                                 | Panel không có tính năng toast                                                                                                                                          |
| IA04-04 | Hành động phá hủy (Xóa) bắt buộc có Dialog xác nhận                  | Failed               | `A3_delete_role.png`                                                              | **Bug #A3-004**: Xóa role là hành động phá hủy, nhưng KHÔNG có dialog xác nhận. User click nút X → role bị xóa ngay lập tức                                             |
| IA04-05 | Nút hành động chính trong Dialog nguy hiểm màu đỏ                    | N/A                  | -                                                                                 | Panel không có dialog nguy hiểm (vì bug #A3-004 nên không có dialog để đánh giá)                                                                                        |
| IA04-06 | Hover lên nút/link/row có hiệu ứng chuyển màu hoặc đổ bóng           | Passed               | `A3_hover_maxslot.png`, `A3_hover_maxrole.png`                                    | Input max slots và input tên role có hover effect rõ ràng (viền highlight)                                                                                              |
| IA04-07 | Active/Pressed lên nút có phản hồi lún/đổi màu nền                   | Passed               | `A3_allow_lecturer.png`, `A3_allow_guest.png`, `A3_allow_waitlist.png`            | Toggle ON có hiệu ứng active rõ ràng: background xanh dương, icon checkmark, input tương ứng hiển thị                                                                   |
| IA04-08 | Cursor đổi thành Pointer khi trỏ vào vùng clickable                  | Passed               | Tất cả ảnh A3                                                                     | Toggle và nút X đều là vùng clickable, cursor pointer khi hover                                                                                                         |
| IA04-09 | Nút Disabled bị làm mờ, không click được                             | N/A                  | -                                                                                 | Panel không có nút disabled (toggle OFF là disabled state nhưng không phải button)                                                                                      |
| IA04-10 | Tooltip xuất hiện khi hover nút chỉ có icon                          | N/A                  | -                                                                                 | Panel không có tooltip                                                                                                                                                  |
| IA04-11 | Tích hợp liên kết tới User Guide/Support                             | N/A                  | -                                                                                 | Panel không có link User Guide                                                                                                                                          |
| IA04-12 | Nút ẩn/hiện mật khẩu hoạt động chính xác                             | N/A                  | -                                                                                 | Panel không có password input                                                                                                                                           |
| IA04-13 | Progress bar hiển thị đúng tỷ lệ và đổi màu theo trạng thái          | N/A                  | -                                                                                 | Panel không có progress bar                                                                                                                                             |
| IA04-14 | Dữ liệu Real-time thay đổi không cần reload                          | N/A                  | -                                                                                 | Panel không có real-time data                                                                                                                                           |
| IA04-15 | Pop-up/Dialog đảm bảo tính Modality                                  | N/A                  | -                                                                                 | Panel không có dialog đang mở                                                                                                                                           |
| IA04-16 | Controls/menu đồng bộ với trạng thái dữ liệu                         | Passed               | `A3_allow_waitlist.png`, `A3_allow_guest.png`, `A3_allow_lecturer.png`            | Toggle ON → hiển thị input tương ứng (Maximum waitlist slots, Maximum slots for guest); Toggle OFF → ẩn input. Controls đồng bộ với trạng thái                          |


---

## Tổng hợp (A3) — sau User review


| Chỉ số             | Giá trị                                  |
| ------------------ | ---------------------------------------- |
| Tổng số mục        | **57**                                   |
| Passed             | **17**                                   |
| Failed             | **5**                                    |
| N/A                | **35**                                   |
| Not Verified       | **0**                                    |
| **Tỷ lệ verified** | **100%** (57/57 mục đã có kết luận cuối) |


### Phân tích theo khía cạnh


| Khía cạnh         | Tổng   | Passed | Failed | N/A    | Not Verified |
| ----------------- | ------ | ------ | ------ | ------ | ------------ |
| IA-01: Chuẩn UI   | 15     | 10     | 1      | 4      | 0            |
| IA-02: Forms      | 15     | 1      | 3      | 11     | 0            |
| IA-03: Navigation | 11     | 0      | 0      | 11     | 0            |
| IA-04: Feedback   | 16     | 5      | 1      | 10     | 0            |
| **Tổng**          | **57** | **17** | **5**  | **35** | **0**        |


---

## Bug Report — Danh sách Failed cần sửa (A3)

### Bug #A3-001: Input "Vai trò phụ" và Max slots thiếu label rõ ràng và hướng dẫn format

- **Mã ID:** IA02-01
- **Mức độ:** Low (giảm usability nhẹ)
- **Mô tả:** Input "Vai trò phụ" chỉ có placeholder "BCH khoa, BTC..." mà KHÔNG có hướng dẫn format phân cách (dấu phẩy, dấu chấm phẩy, hay xuống dòng?). Input "Max slots" của từng role chỉ có placeholder "500" nhưng label "Max slots" nằm ở trên dễ gây nhầm lẫn.
- **Bằng chứng:** `A3_default.png`, `A3_student_roles.png`
- **Đề xuất:** Bổ sung text hướng dẫn format dưới input "Vai trò phụ", ví dụ: "Phân cách các vai trò bằng dấu phẩy (,). Tối đa 5 vai trò phụ."

### Bug #A3-002: Các trường quan trọng trong panel không có dấu `*` bắt buộc

- **Mã ID:** IA02-02
- **Mức độ:** Medium (user có thể bỏ sót trường bắt buộc)
- **Mô tả:** Trên panel cấu hình Registration, các trường sau KHÔNG có dấu `*` đỏ mặc dù chúng là bắt buộc khi lưu cấu hình: tên role (text input), Max slots của từng role (number input), "Số lượng đăng ký tối đa (Tổng)" (number input), "Vai trò phụ" (text input).
- **Bằng chứng:** `A3_default.png`, `A3_student_roles.png`, `A3_add_role.png`
- **Đề xuất:** Thêm dấu `*` đỏ cho tất cả trường bắt buộc. Nếu một số trường thực sự optional (ví dụ: vai trò phụ), cần ghi rõ "(tùy chọn)" sau label.

### Bug #A3-003: Xóa role KHÔNG có dialog xác nhận — nguy cơ xóa nhầm

- **Mã ID:** IA04-04
- **Mức độ:** High (xóa nhầm role sẽ ảnh hưởng đến cấu hình event và user đã đăng ký)
- **Mô tả:** Xóa role là hành động phá hủy — có thể ảnh hưởng đến các user đã đăng ký theo role đó, cấu hình số lượng tối đa, dữ liệu thống kê theo role. Tuy nhiên khi user click nút X trên role → role bị xóa NGAY LẬP TỨC, không có dialog xác nhận.
- **Bằng chứng:** `A3_delete_role.png` (trước đó có 3 roles bao gồm "Giảng viên" trong `A3_add_role.png`, sau khi click X chỉ còn "Học sinh" và "Sinh viên")
- **Đề xuất:** Thêm dialog xác nhận trước khi xóa role:
  - Tiêu đề: "Xóa role"
  - Nội dung: "Bạn có chắc chắn muốn xóa role '[tên role]' không? Hành động này có thể ảnh hưởng đến các user đã đăng ký."
  - Nút "Hủy" (màu trắng) và nút "Xóa" (màu đỏ)
  - Có overlay mờ phía sau để đảm bảo modality

### Bug #A3-004: Giao diện không responsive trên Mobile

- **Mã ID:** IA01-08
- **Mức độ:** High (ảnh hưởng đến mobile user)
- **Mô tả:** Panel cấu hình Registration không hiển thị tốt trên thiết bị mobile.
- **Bằng chứng:** (user đã bổ sung ảnh)
- **Đề xuất:** Thiết kế lại responsive cho panel cấu hình trên mobile.

---

## Lưu ý cuối

- **0 mục Not Verified** — 100% mục đã được verified (Passed/Failed/N/A) sau User review.
- **5 bug Failed được phát hiện**:
  - Bug #A3-001 (Low, IA02-01): Thiếu label/hướng dẫn format
  - Bug #A3-002 (Medium, IA02-02): Thiếu dấu `*` bắt buộc
  - Bug #A3-003 (Low, IA02-03): Placeholder không cung cấp ví dụ định dạng
  - Bug #A3-004 (High, IA04-04): Xóa role không có dialog xác nhận
  - Bug #A3-005 (High, IA01-08): Responsive mobile
- **Mức độ nghiêm trọng**: 2 bug High + 1 bug Medium + 2 bug Low — cần ưu tiên sửa Bug #A3-004 và Bug #A3-005.
- Panel có thiết kế tốt: gom nhóm logic (Roles vs Settings), hover effect rõ ràng, toggle có active state, controls đồng bộ với trạng thái, không có toast.
- **Nguyên tắc phân loại N/A**: Panel cấu hình Registration chỉ là config, không phải full form/page. Nhiều mục (Enter submit, validation, loading, filter, search, breadcrumb, sidebar, pagination, drag-drop, tooltip, user guide, footer) không áp dụng được cho panel này → **N/A** thay vì Not Verified.

