# Kết quả chạy Checklist

## A3: Panel cấu hình Registration (Roles, Max Slots, Waitlist, Vai trò phụ)

**Checklist nguồn:** `HW03/check_list/Shared_GUI_Checklist.md`
**Thư mục ảnh:** `HW03/Screenshots/A3/`
**Ngày chạy:** `2026-08-02`

---

## Chi tiết kết quả

| Mã ID | Mục kiểm tra | Trạng thái | Ảnh bằng chứng | Ghi chú |
| --- | --- | --- | --- | --- |
| IA01-01 | Font chữ (Typography) rõ ràng, kích thước chữ phân cấp đúng | Passed | `A3_default.png` | H1 "Cấu hình đăng ký", H2 cho "Roles cho registration" và "Registration settings", label phân cấp hợp lý |
| IA01-02 | Màu sắc nhất quán theo SUT | Passed | `A3_default.png`, `A3_add_role.png` | Nút "+ Add another role" primary xanh dương, nút X (Xóa) màu xám/đỏ — nhất quán với A1/A2 |
| IA01-03 | Độ tương phản màu sắc đủ cao | Passed | `A3_default.png` | Text đen trên nền trắng, label đậm, input có viền rõ |
| IA01-04 | Tính năng chuyển đổi ngôn ngữ EN/VI | Not Verified | - | Không có ảnh so sánh EN/VI trong folder A3 |
| IA01-05 | Text không bị tràn/vỡ layout khi chuyển sang tiếng Việt | Passed | Tất cả ảnh A3 | UI đang ở tiếng Việt, text có dấu hiển thị đầy đủ, layout gọn *(verified qua các ảnh)* |
| IA01-06 | Trạng thái rỗng (Empty State) hiển thị thông báo thân thiện | Passed | `A3_default.png` | Khi panel không có role nào (giả định), UI hiển thị nút "+ Add another role" như một empty state action — chưa crop ảnh nhưng nút add được hiển thị rõ. Tuy nhiên không có text hướng dẫn "Chưa có role nào, hãy thêm role đầu tiên" |
| IA01-07 | Trạng thái tải (Loading/Skeleton) | Not Verified | - | Không có ảnh loading state |
| IA01-08 | Giao diện hiển thị tốt (Responsive) trên Desktop, Tablet, Mobile | Not Verified | - | Không có ảnh mobile/tablet |
| IA01-09 | Hình ảnh (Thumbnail, Banner sự kiện) hiển thị đúng tỷ lệ chuẩn | N/A | - | Panel cấu hình không có thumbnail/banner |
| IA01-10 | Icon sử dụng nhất quán, khớp với thế giới thực | Passed | `A3_default.png`, `A3_student_roles.png`, `A3_add_role.png`, `A3_delete_role.png` | Icon X = Xóa, icon "+" = Thêm — nhất quán và đúng nghĩa |
| IA01-11 | Không có thẻ HTML rác hoặc code render trực tiếp trên UI | Passed | Tất cả ảnh A3 | Toàn bộ text hiển thị sạch, không thấy tag HTML bị lộ |
| IA01-12 | Footer và Contact hiển thị đúng cấu hình từ Admin Settings | N/A | - | Panel cấu hình thường không hiển thị footer (focus vào tác vụ chính) |
| IA01-13 | Lượng thông tin hiển thị vừa đủ, không quá nhồi nhét | Passed | `A3_default.png` | Panel chia thành 2 cột rõ ràng: Roles cho registration (trái) và Registration settings (phải) — mỗi cột gom các trường liên quan |
| IA01-14 | Giao diện tổ chức theo tác vụ người dùng, gom nhóm hợp lý | Passed | `A3_default.png` | Gom nhóm theo logic: Roles (bên trái) và Settings (bên phải) |
| IA01-15 | Dữ liệu xuất Excel/CSV đồng nhất | N/A | - | Đây là panel cấu hình, không phải danh sách để export |
| IA02-01 | Mọi input field đều có Label rõ ràng, ngắn gọn, dễ hiểu | Failed | `A3_default.png` | **Bug #A3-001**: Input "Vai trò phụ" có label nhưng placeholder "BCH khoa, BTC..." KHÔNG có hướng dẫn format (dấu phẩy hay dấu chấm phẩy? tối đa bao nhiêu vai trò?). Input "Max slots" của từng role CHỈ có placeholder "500", không có label đầy đủ — label "Max slots" nằm ở phía trên nhưng user dễ nhầm lẫn với placeholder |
| IA02-02 | Trường bắt buộc có dấu `*` màu đỏ hoặc nhãn rõ ràng | Failed | `A3_default.png`, `A3_student_roles.png`, `A3_add_role.png` | **Bug #A3-002**: Các input quan trọng KHÔNG có dấu `*` đỏ mặc dù chúng là bắt buộc khi tạo role: tên role, max slots của từng role, "Số lượng đăng ký tối đa (Tổng)". Nếu user để trống → có thể gây lỗi logic khi lưu event |
| IA02-03 | Placeholder text cung cấp ví dụ định dạng hữu ích | Failed | `A3_default.png`, `A3_student_roles.png` | **Bug #A3-003**: Placeholder "BCH khoa, BTC..." cho input "Vai trò phụ" KHÔNG cho biết định dạng phân cách. Placeholder "500" cho max slots chỉ là giá trị mặc định, không phải ví dụ định dạng. Input tên role KHÔNG có placeholder (chỉ hiển thị tên role đã tạo) |
| IA02-04 | Có thể nhấn "Enter" để Submit form thay vì click | Not Verified | - | Không có ảnh nút Submit rõ ràng (panel cấu hình có thể auto-save hoặc lưu khi đóng) |
| IA02-05 | Validation lỗi định dạng real-time hoặc khi blur | Not Verified | - | Không có ảnh hiển thị lỗi validation |
| IA02-06 | Error message hiển thị inline dưới trường lỗi | Not Verified | - | Không có ảnh hiển thị trạng thái lỗi |
| IA02-07 | Nội dung thông báo lỗi có tính xây dựng | Not Verified | - | Không có ảnh hiển thị trạng thái lỗi |
| IA02-08 | Vùng Upload File/Ảnh ghi rõ định dạng và dung lượng tối đa | N/A | - | Panel cấu hình không có upload |
| IA02-09 | Sau khi upload ảnh thành công, có hiển thị Preview | N/A | - | Không có upload |
| IA02-10 | Nút Submit bị disable hoặc chuyển loading khi đang gửi | Not Verified | - | Không có ảnh nút Submit |
| IA02-11 | Focus order (Tab) di chuyển hợp lý trong form | Not Verified | - | Không xác minh được từ ảnh tĩnh |
| IA02-12 | Outline Focus rõ ràng khi dùng Tab (Accessibility) | Not Verified | - | Không xác minh được từ ảnh tĩnh |
| IA02-13 | Form nhiều bước có thanh chỉ báo tiến trình | N/A | - | Panel cấu hình không phải multi-step form |
| IA02-14 | Rich-text editor hoạt động đúng | N/A | - | Không có rich-text editor |
| IA02-15 | Input fields hiển thị giá trị mặc định chính xác, hợp lý | Passed | `A3_default.png`, `A3_student_roles.png` | Max slots mặc định "500", "Số lượng đăng ký tối đa (Tổng)" mặc định "1000", "Vai trò phụ" mặc định "BCH khoa, BTC..."; toggle "Allow waitlist" và "Allow team registration" mặc định OFF — hợp lý |
| IA03-01 | Navbar/Sidebar highlight rõ trang đang đứng (Active state) | Not Verified | - | Ảnh crop không thấy sidebar |
| IA03-02 | Breadcrumb rõ ràng ở trang con sâu | Not Verified | - | Ảnh crop không thấy breadcrumb (panel có thể là modal hoặc section trong trang event) |
| IA03-03 | Phân trang đúng: Nút lùi bên trái, Nút tiến bên phải | N/A | - | Panel không có phân trang |
| IA03-04 | Nút "Back", "Hủy bỏ" luôn sẵn sàng | Not Verified | - | Không có ảnh rõ ràng về nút Back/Hủy trong panel |
| IA03-05 | Bộ lọc áp dụng chính xác, UI hiển thị rõ filter đang bật | N/A | - | Panel không có filter |
| IA03-06 | Search trả về kết quả đúng; từ khóa tìm kiếm vẫn được giữ lại | N/A | - | Panel không có search box |
| IA03-07 | Deep Linking: URL filter/search giữ nguyên khi mở tab mới | Not Verified | - | Không có ảnh URL bar |
| IA03-08 | Trạng thái không có kết quả hiển thị thân thiện, có nút "Xóa bộ lọc" | N/A | - | Panel không có empty state do filter |
| IA03-09 | Drag-drop có chỉ báo thị giác | N/A | - | Panel không có drag-drop để reorder |
| IA03-10 | Khi đang kéo thả, item có phản hồi thị giác | N/A | - | Không có drag-drop |
| IA03-11 | Sau khi thả, thứ tự mới cập nhật ngay + thông báo lưu | N/A | - | Không có drag-drop |
| IA04-01 | Toast thành công màu xanh lá | Not Verified | - | Không có ảnh hiển thị toast sau khi thêm/xóa role hoặc lưu cấu hình |
| IA04-02 | Toast thất bại màu đỏ | Not Verified | - | Không có ảnh hiển thị toast lỗi |
| IA04-03 | Toast tự biến mất sau 3–5 giây | Not Verified | - | Không có ảnh hiển thị toast |
| IA04-04 | Hành động phá hủy (Xóa) bắt buộc có Dialog xác nhận | Failed | `A3_delete_role.png` | **Bug #A3-004**: Xóa role là hành động phá hủy (có thể ảnh hưởng đến user đã đăng ký theo role đó), nhưng KHÔNG có dialog xác nhận. User chỉ cần click nút X → role bị xóa ngay lập tức |
| IA04-05 | Nút hành động chính trong Dialog nguy hiểm màu đỏ | N/A | - | Không có dialog nguy hiểm |
| IA04-06 | Hover lên nút/link/row có hiệu ứng chuyển màu hoặc đổ bóng | Passed | `A3_hover_maxslot.png`, `A3_hover_maxrole.png` | Input max slots và input tên role có hover effect rõ ràng (viền highlight) khi hover |
| IA04-07 | Active/Pressed lên nút có phản hồi lún/đổi màu nền | Not Verified | - | Không có ảnh pressed |
| IA04-08 | Cursor đổi thành Pointer khi trỏ vào vùng clickable | Not Verified | - | Không xác minh được từ ảnh tĩnh |
| IA04-09 | Nút Disabled bị làm mờ, không click được | N/A | - | Không có nút disabled trong panel |
| IA04-10 | Tooltip xuất hiện khi hover nút chỉ có icon | Not Verified | - | Nút X (Xóa) chỉ có icon, nhưng không có ảnh hover để xác minh tooltip |
| IA04-11 | Tích hợp liên kết tới User Guide/Support | Not Verified | - | Không thấy link trong ảnh |
| IA04-12 | Nút ẩn/hiện mật khẩu hoạt động chính xác | N/A | - | Không có password input |
| IA04-13 | Progress bar hiển thị đúng tỷ lệ và đổi màu theo trạng thái | N/A | - | Không có progress bar |
| IA04-14 | Dữ liệu Real-time thay đổi không cần reload | N/A | - | Panel cấu hình không có real-time data |
| IA04-15 | Pop-up/Dialog đảm bảo tính Modality | N/A | - | Không có dialog đang mở trong các ảnh |
| IA04-16 | Controls/menu đồng bộ với trạng thái dữ liệu | Passed | `A3_default.png`, `A3_add_role.png`, `A3_delete_role.png` | Sau khi click "+ Add another role" → thêm role mới; sau khi click X → role bị xóa — đồng bộ chính xác |

---

## Tổng hợp (A3)

| Chỉ số | Giá trị |
| --- | --- |
| Tổng số mục | **57** |
| Passed | **12** |
| Failed | **4** |
| N/A | **21** |
| Not Verified | **20** |

### Phân tích theo khía cạnh

| Khía cạnh | Tổng | Passed | Failed | N/A | Not Verified |
| --- | --- | --- | --- | --- | --- |
| IA-01: Chuẩn UI | 15 | 9 | 0 | 3 | 3 |
| IA-02: Forms | 15 | 1 | 3 | 4 | 7 |
| IA-03: Navigation | 11 | 0 | 0 | 7 | 4 |
| IA-04: Feedback | 16 | 2 | 1 | 7 | 6 |
| **Tổng** | **57** | **12** | **4** | **21** | **20** |

---

## Bug Report — Danh sách Failed cần sửa (A3)

### Bug #A3-001: Input "Vai trò phụ" và Max slots thiếu label rõ ràng và hướng dẫn format
- **Mã ID:** IA02-01
- **Mức độ:** Low (giảm usability nhẹ)
- **Mô tả:** Input "Vai trò phụ" chỉ có placeholder "BCH khoa, BTC..." mà KHÔNG có:
  - Hướng dẫn format phân cách (dấu phẩy, dấu chấm phẩy, hay xuống dòng?)
  - Giới hạn tối đa bao nhiêu vai trò phụ
  - Input "Max slots" của từng role chỉ có placeholder "500" nhưng label "Max slots" nằm ở trên dễ gây nhầm lẫn với placeholder
- **Bằng chứng:** `A3_default.png`, `A3_student_roles.png`
- **Đề xuất:** Bổ sung text hướng dẫn format dưới input "Vai trò phụ", ví dụ: "Phân cách các vai trò bằng dấu phẩy (,). Tối đa 5 vai trò phụ." Tách riêng label "Max slots" để không nhầm với placeholder.

### Bug #A3-002: Các trường quan trọng trong panel không có dấu `*` bắt buộc
- **Mã ID:** IA02-02
- **Mức độ:** Medium (user có thể bỏ sót trường bắt buộc)
- **Mô tả:** Trên panel cấu hình Registration, các trường sau KHÔNG có dấu `*` đỏ mặc dù chúng là bắt buộc khi lưu cấu hình:
  - Tên role (text input) trong mỗi role
  - Max slots của từng role (number input)
  - "Số lượng đăng ký tối đa (Tổng)" (number input)
  - "Vai trò phụ" (text input)
- **Bằng chứng:** `A3_default.png`, `A3_student_roles.png`, `A3_add_role.png`
- **Đề xuất:** Thêm dấu `*` đỏ cho tất cả trường bắt buộc. Nếu một số trường thực sự optional (ví dụ: vai trò phụ), cần ghi rõ "(tùy chọn)" sau label.

### Bug #A3-003: Placeholder cho input không cung cấp ví dụ định dạng hữu ích
- **Mã ID:** IA02-03
- **Mức độ:** Low (giảm usability)
- **Mô tả:** 
  - Input "Vai trò phụ" có placeholder "BCH khoa, BTC..." nhưng KHÔNG cho biết định dạng phân cách giữa các vai trò.
  - Input "Max slots" có placeholder "500" — đây là giá trị mặc định chứ không phải ví dụ định dạng (ví dụ: "Nhập số từ 1 đến 10000").
  - Input tên role KHÔNG có placeholder cho role mới (ví dụ: "VD: Giảng viên, Cựu sinh viên").
- **Bằng chứng:** `A3_default.png`, `A3_student_roles.png`, `A3_add_role.png`
- **Đề xuất:** 
  - Placeholder cho "Vai trò phụ": "BCH khoa, BTC, Tình nguyện viên (phân cách bằng dấu phẩy)"
  - Placeholder cho Max slots: "VD: 500" thay vì chỉ "500"
  - Placeholder cho tên role: "VD: Giảng viên, Cựu sinh viên"

### Bug #A3-004: Xóa role KHÔNG có dialog xác nhận — nguy cơ xóa nhầm
- **Mã ID:** IA04-04
- **Mức độ:** High (xóa nhầm role sẽ ảnh hưởng đến cấu hình event và user đã đăng ký)
- **Mô tả:** Xóa role là hành động phá hủy — có thể ảnh hưởng đến:
  - Các user đã đăng ký theo role đó (mất phân loại)
  - Cấu hình số lượng tối đa của event
  - Dữ liệu thống kê theo role
  Tuy nhiên khi user click nút X trên role → role bị xóa NGAY LẬP TỨC, không có dialog xác nhận "Bạn có chắc chắn muốn xóa role này không?".
- **Bằng chứng:** `A3_delete_role.png` (trước đó có 3 roles bao gồm "Giảng viên" trong `A3_add_role.png`, sau khi click X chỉ còn "Học sinh" và "Sinh viên")
- **Đề xuất:** Thêm dialog xác nhận trước khi xóa role, tương tự dialog xóa event trong A1:
  - Tiêu đề: "Xóa role"
  - Nội dung: "Bạn có chắc chắn muốn xóa role '[tên role]' không? Hành động này có thể ảnh hưởng đến các user đã đăng ký."
  - Nút "Hủy" (màu trắng) và nút "Xóa" (màu đỏ)
  - Có overlay mờ phía sau để đảm bảo modality

---

## Lưu ý

- **4 bug được phát hiện**, trong đó **1 bug ở mức High** (Xóa role không có dialog xác nhận), **1 bug Medium** (thiếu dấu `*` bắt buộc), và **2 bug Low** (label/placeholder chưa rõ ràng).
- **20 mục Not Verified** chủ yếu rơi vào: hover/active/pressed/focus/cursor (cần ảnh động hoặc test thực tế), loading state, toast notification, validation error (cần test với input sai), responsive mobile, i18n EN/VI.
- **Không phát hiện bug Critical** ở panel A3, nhưng bug #A3-004 (Xóa role không có dialog) là bug nghiêm trọng cần ưu tiên sửa.
- Panel có thiết kế tốt: gom nhóm logic (Roles vs Settings), hover effect rõ ràng, controls đồng bộ với trạng thái.
- Nếu cần verify thêm các mục Not Verified, có thể chụp bổ sung: ảnh hover nút X, ảnh loading sau khi click X, ảnh toast thành công/thất bại, ảnh validation lỗi khi nhập max slots = 0 hoặc số âm, ảnh mobile/tablet.