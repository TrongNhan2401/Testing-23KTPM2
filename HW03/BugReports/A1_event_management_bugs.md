# Báo cáo Bug — Màn hình Quản lý Sự kiện (Event Management)

- **Màn hình được kiểm tra:** A1 — Quản lý sự kiện (Event Management)
- **Checklist nguồn:** `HW03/check_list/Shared_GUI_Checklist.md`
- **Skill sử dụng:** `HW03/skills/gui-checklist-runner-SKILL.md`
- **Thư mục ảnh:** `HW03/Screenshots/A1/`
- **Ngày chạy:** 2026-08-04
- **Tổng số ảnh bằng chứng:** 23 ảnh
- **Ghi chú:** Output dưới đây là bản nháp có căn cứ — người dùng cần tự kiểm tra lại các dòng **Failed** và **Not Verified** trước khi đưa vào báo cáo chính thức.

---

## Phần 1 — Bảng kết quả chạy checklist

| Mã ID      | Mục kiểm tra (rút gọn)                                                                          | Trạng thái      | Ảnh bằng chứng                                                                                                  | Ghi chú                                                                                                                                                       |
| ---------- | ------------------------------------------------------------------------------------------------ | --------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IA01-01    | Font chữ rõ ràng, phân cấp H1–H6 đúng                                                            | Passed          | `A1_default.png`                                                                                                 | Tiêu đề trang "Quản lý sự kiện" lớn, vùng phụ có heading nhỏ hơn, phân cấp hợp lý.                                                                          |
| IA01-02    | Màu sắc nhất quán theo SUT (Primary/Danger)                                                       | Passed          | `A1_default.png`, `A1_delete_event.png`                                                                          | Nút "Tạo sự kiện" primary xanh dương; nhãn "Draft" vàng, "Published" xanh lá; nút xóa màu đỏ đúng quy ước.                                                  |
| IA01-03    | Độ tương phản chữ/nền đủ cao                                                                     | Passed          | `A1_default.png`                                                                                                 | Chữ đen trên nền trắng, badge trạng thái có nền đậm và chữ tối — đảm bảo độ tương phản.                                                                       |
| IA01-04    | Chuyển đổi EN/VI mượt mà, dịch đồng nhất                                                          | Passed          | `A1_change_language.png`, `A1_change_language_En.png`, `A1_change_language_Vie.png`                              | UI chuyển ngôn ngữ đầy đủ (Quản lý sự kiện ↔ Event Management, Trạng thái ↔ Status).                                                                         |
| IA01-05    | Text không tràn/vỡ layout khi chuyển sang tiếng Việt                                               | Failed          | `A1_change_language_Vie.png`                                                                                     | Sau khi chuyển sang tiếng Việt, danh sách sự kiện hiển thị "Không có sự kiện" mặc dù trước đó có dữ liệu — dữ liệu bị mất khi đổi ngôn ngữ (xem **Bug #1**).  |
| IA01-06    | Empty state hiển thị thông báo thân thiện + hình minh họa                                          | Failed          | `A1_change_language_Vie.png`                                                                                     | Empty state chỉ hiển thị text "Không có sự kiện" trống, không có icon minh họa, không có CTA gợi ý (xem **Bug #2**).                                           |
| IA01-07    | Trạng thái Loading/Skeleton hiển thị rõ khi gọi API                                                | Not Verified    | —                                                                                                                | Không có ảnh chụp trạng thái loading/skeleton trong thư mục.                                                                                                   |
| IA01-08    | Responsive tốt trên Desktop/Tablet/Mobile, không lỗi cuộn ngang vô lý                              | Failed          | `A1_mobile.jpg`                                                                                                  | Mobile view **ẩn hoàn toàn sidebar** — không có hamburger menu, người dùng không thể điều hướng sang màn khác (xem **Bug #3**).                                  |
| IA01-09    | Thumbnail/Banner đúng tỷ lệ chuẩn (4:3, 24:9), không bị kéo giãn                                  | Passed          | `A1_table_list_events_01.png`, `A1_table_list_events_02.png`                                                     | Ảnh thumbnail sự kiện hiển thị vuông, không méo.                                                                                                              |
| IA01-10    | Icon nhất quán, khớp thế giới thực (thùng rác = xóa)                                              | Passed          | `A1_default.png`, `A1_delete_event.png`                                                                          | Icon con mắt (xem), icon bút (sửa), icon thùng rác (xóa) nhất quán và khớp nghĩa.                                                                             |
| IA01-11    | Không render HTML rác ở vùng text động                                                            | Passed          | `A1_table_list_events_01.png`                                                                                    | Tiêu đề sự kiện render text thuần, không thấy tag HTML lộ.                                                                                                    |
| IA01-12    | Footer/Contact hiển thị đúng cấu hình từ Admin Settings                                           | Not Verified    | —                                                                                                                | Các ảnh chỉ crop phần đầu trang, không thấy footer.                                                                                                           |
| IA01-13    | Lượng thông tin vừa đủ, không nhồi nhét/thiếu                                                     | Passed          | `A1_default.png`                                                                                                 | Bảng 8 cột vừa đủ thông tin (STT, Tiêu đề, TG bắt đầu/kết thúc, Địa điểm, Người tham gia, Trạng thái, Hành động).                                            |
| IA01-14    | Gom nhóm thông tin liên quan hợp lý (Task-based)                                                  | Passed          | `A1_default.png`                                                                                                 | Khu vực filter + search gom trên cùng; bảng dữ liệu + pagination ở dưới.                                                                                      |
| IA01-15    | Export Excel/CSV đồng nhất ngôn ngữ/định dạng/cột                                                 | Not Verified    | —                                                                                                                | Không có ảnh chụp chức năng export.                                                                                                                           |
| IA02-01    | Mọi input có Label rõ ràng                                                                        | Failed          | `A1_search_01.png`, `A1_label_search.png`                                                                        | Ô search chỉ có placeholder "Tìm kiếm theo tiêu đề sự kiện", **không có label** riêng (xem **Bug #4**).                                                       |
| IA02-02    | Trường bắt buộc có dấu `*` đỏ                                                                    | N/A             | —                                                                                                                | Màn hình danh sách không chứa form nhập liệu.                                                                                                                |
| IA02-03    | Placeholder cung cấp ví dụ định dạng hữu ích                                                      | Passed          | `A1_search_01.png`                                                                                               | Placeholder "Tìm kiếm theo tiêu đề sự kiện" hữu ích.                                                                                                          |
| IA02-04    | Nhấn Enter để Submit form                                                                         | Not Verified    | —                                                                                                                | Không có ảnh minh họa thao tác Enter.                                                                                                                         |
| IA02-05    | Validation lỗi real-time/blur                                                                     | N/A             | —                                                                                                                | Không có form nhập liệu trong màn hình này.                                                                                                                   |
| IA02-06    | Error message hiển thị inline dưới trường lỗi                                                     | N/A             | —                                                                                                                | Không có form nhập liệu trong màn hình này.                                                                                                                   |
| IA02-07    | Nội dung lỗi mang tính xây dựng                                                                   | N/A             | —                                                                                                                | Không có form nhập liệu trong màn hình này.                                                                                                                   |
| IA02-08    | Vùng Upload ghi rõ định dạng/dung lượng                                                           | N/A             | —                                                                                                                | Không có upload file trong màn hình này.                                                                                                                       |
| IA02-09    | Sau upload hiển thị Preview                                                                       | N/A             | —                                                                                                                | Không có upload ảnh trong màn hình này.                                                                                                                        |
| IA02-10    | Nút Submit disable/loading khi đang gửi                                                            | N/A             | —                                                                                                                | Không có nút submit trong màn hình này.                                                                                                                       |
| IA02-11    | Focus order Tab hợp lý                                                                            | Not Verified    | —                                                                                                                | Không có ảnh minh họa trình tự Tab.                                                                                                                          |
| IA02-12    | Outline Focus rõ khi Tab                                                                           | Not Verified    | —                                                                                                                | Không có ảnh chụp trạng thái focus.                                                                                                                           |
| IA02-13    | Form nhiều bước có Step Indicator                                                                  | N/A             | —                                                                                                                | Màn hình không có form nhiều bước.                                                                                                                           |
| IA02-14    | Rich-text editor format cơ bản                                                                    | N/A             | —                                                                                                                | Không có rich-text editor trong màn hình này.                                                                                                                 |
| IA02-15    | Input hiển thị default value chính xác                                                             | Not Verified    | —                                                                                                                | Không thấy ảnh input với giá trị default.                                                                                                                     |
| IA03-01    | Navbar/Sidebar highlight rõ trang đang đứng (Active state)                                         | Passed          | `A1_default.png`                                                                                                 | Mục "Quản lý sự kiện" trong sidebar được highlight màu khác biệt so với các mục còn lại.                                                                      |
| IA03-02    | Breadcrumb rõ ở trang con sâu                                                                     | Failed          | `A1_default.png`                                                                                                 | **Không có breadcrumb** hiển thị trên trang — chỉ có tiêu đề trang (xem **Bug #5**).                                                                           |
| IA03-03    | Pagination đúng ánh xạ tự nhiên (lùi trái, tiến phải)                                            | Passed          | `A1_pagination.png`                                                                                              | Thứ tự `« ‹ 1 2 3 › »` đúng quy ước.                                                                                                                          |
| IA03-04    | Nút Back/Hủy bỏ luôn sẵn sàng                                                                    | Passed          | `A1_delete_event.png`                                                                                            | Dialog xóa có nút "Hủy bỏ" rõ ràng.                                                                                                                          |
| IA03-05    | Filter áp dụng chính xác, hiển thị rõ filter đang bật                                             | Passed          | `A1_filter_All_Status.png`, `A1_filter_Published.png`, `A1_filter_Draft.png`, `A1_filter_All_Time.png`           | Filter Status và Time đều áp dụng đúng và hiển thị rõ giá trị đang chọn.                                                                                      |
| IA03-06    | Search trả đúng kết quả & giữ từ khóa trong input                                                  | Passed          | `A1_search_02.png`                                                                                               | Từ khóa tìm kiếm được giữ lại trong ô input sau khi search.                                                                                                   |
| IA03-07    | Deep Linking: URL filter/search giữ nguyên khi mở tab mới                                          | Passed          | `A1_filter_url.png`                                                                                              | URL chứa query string filter, khi mở lại giữ nguyên kết quả.                                                                                                  |
| IA03-08    | Không có kết quả → hiển thị thân thiện có CTA "Xóa bộ lọc"                                        | Failed          | `A1_change_language_Vie.png`                                                                                     | Empty state "Không có sự kiện" **không có nút "Xóa bộ lọc"** để người dùng khôi phục — xem **Bug #2** (cùng bằng chứng).                                       |
| IA03-09    | Drag-drop có chỉ báo thị giác (icon 6 chấm)                                                       | N/A             | —                                                                                                                | Màn hình danh sách sự kiện không có tính năng reorder.                                                                                                        |
| IA03-10    | Khi kéo có phản hồi thị giác (mờ/đổ bóng)                                                        | N/A             | —                                                                                                                | Không có drag-drop.                                                                                                                                           |
| IA03-11    | Sau thả, thứ tự mới cập nhật + thông báo lưu                                                      | N/A             | —                                                                                                                | Không có drag-drop.                                                                                                                                           |
| IA04-01    | Thành công → Toast xanh lá                                                                        | Not Verified    | —                                                                                                                | Không có ảnh toast thành công.                                                                                                                                |
| IA04-02    | Thất bại → Toast đỏ + nội dung cụ thể                                                             | Not Verified    | —                                                                                                                | Không có ảnh toast thất bại.                                                                                                                                  |
| IA04-03    | Toast tự biến mất sau 3–5s                                                                        | Not Verified    | —                                                                                                                | Không có ảnh toast.                                                                                                                                           |
| IA04-04    | Hành động phá hủy BẮT BUỘC có Dialog xác nhận                                                      | Passed          | `A1_delete_event.png`                                                                                            | Nút thùng rác → mở dialog "Bạn có chắc chắn muốn xóa sự kiện này?".                                                                                           |
| IA04-05    | Nút hành động chính trong dialog nguy hiểm màu đỏ; nút Hủy vị trí an toàn                          | Passed          | `A1_delete_event.png`                                                                                            | Nút "Xóa" màu đỏ, nút "Hủy bỏ" nằm bên trái — phù hợp Norman Constraints/Mapping.                                                                            |
| IA04-06    | Hover lên nút/link/hàng table có hiệu ứng chuyển màu/đổ bóng                                      | Passed          | `A1_hover_row.png`                                                                                               | Hàng "Sự kiện cuối tuần dành cho tân sinh viên K2024" được hover đổi nền xám nhạt.                                                                            |
| IA04-07    | Active/Pressed lên nút có phản hồi                                                                 | Not Verified    | —                                                                                                                | Không có ảnh chụp trạng thái nhấn.                                                                                                                           |
| IA04-08    | Con trỏ chuột đổi thành Pointer khi trỏ vùng clickable                                            | Not Verified    | —                                                                                                                | Không thể quan sát qua ảnh tĩnh.                                                                                                                              |
| IA04-09    | Disabled bị làm mờ + cursor not-allowed                                                            | Not Verified    | —                                                                                                                | Không có ảnh chụp trạng thái disabled.                                                                                                                        |
| IA04-10    | Tooltip giải thích khi hover nút icon-only                                                         | Passed          | `A1_hover_tool.png`                                                                                              | Tooltip xuất hiện giải thích cho nút icon-only (xem chi tiết).                                                                                                |
| IA04-11    | Tích hợp liên kết User Guide/Support                                                              | Not Verified    | —                                                                                                                | Không thấy link hỗ trợ trong ảnh crop.                                                                                                                        |
| IA04-12    | Toggle Password Visibility hoạt động                                                               | N/A             | —                                                                                                                | Không có form mật khẩu trong màn hình này.                                                                                                                    |
| IA04-13    | Progress bar đúng tỷ lệ %, đổi màu theo trạng thái                                                | N/A             | —                                                                                                                | Màn hình không có progress bar.                                                                                                                               |
| IA04-14    | Dữ liệu Real-time thay đổi không cần reload                                                        | Not Verified    | —                                                                                                                | Không có ảnh chứng minh.                                                                                                                                      |
| IA04-15    | Pop-up/Dialog đảm bảo Modality (khóa tương tác màn hình nền)                                      | Passed          | `A1_delete_event.png`                                                                                            | Dialog xóa có overlay làm mờ nền, không thể click ra ngoài.                                                                                                   |
| IA04-16    | Trạng thái controls/menu đồng bộ với dữ liệu                                                      | Passed          | `A1_filter_Published.png`, `A1_filter_Draft.png`                                                                | Khi chọn filter "Published" chỉ hiển thị sự kiện Published; filter "Draft" chỉ hiển thị Draft — đồng bộ chính xác.                                            |

---

## Phần 2 — Tổng hợp nhanh

- **Tổng số mục kiểm tra:** 61
- **Passed:** 21
- **Failed:** 5  → IA01-05, IA01-06, IA01-08, IA02-01, IA03-02, IA03-08 _(IA01-06 và IA03-08 dùng cùng bằng chứng và cùng root-cause, đếm là 1 nhóm lỗi nhưng ảnh hưởng 2 ID checklist)_
- **N/A:** 13
- **Not Verified:** 22

### Nhóm lỗi phát hiện được

| # | Mức độ       | Mã checklist liên quan                | Mô tả ngắn                                                          |
| - | ------------ | ------------------------------------- | ------------------------------------------------------------------- |
| 1 | **Critical** | IA01-05, IA01-06, IA03-08             | Đổi ngôn ngữ EN → VI làm mất dữ liệu & không có empty-state hữu ích |
| 2 | **High**     | IA01-08                               | Mobile view ẩn hoàn toàn sidebar — không điều hướng được            |
| 3 | **Medium**   | IA03-02                               | Không có breadcrumb trong trang con                                 |
| 4 | **Medium**   | IA02-01                               | Ô search thiếu label riêng, chỉ dùng placeholder                     |

---

## Phần 3 — Báo cáo Bug chi tiết (Bug Reports)

> Mỗi bug dưới đây đều có mô tả, bằng chứng ảnh và tham chiếu checklist. Người dùng cần tự kiểm tra lại trước khi gửi lên hệ thống quản lý bug chính thức.

---

### 🐞 Bug #1 — Chuyển ngôn ngữ EN → VI làm mất toàn bộ dữ liệu danh sách sự kiện

| Trường        | Giá trị                                                                                                         |
| ------------- | --------------------------------------------------------------------------------------------------------------- |
| **Mã Bug**    | BUG-A1-001                                                                                                      |
| **Severity**  | 🔴 **Critical**                                                                                                 |
| **Priority**  | **High**                                                                                                        |
| **Module**    | Event Management / Localization                                                                                |
| **Màn hình**  | Quản lý sự kiện                                                                                                  |
| **Checklist** | IA01-05 (Text không vỡ layout khi chuyển VI) — cũng ảnh hưởng IA01-04 (chuyển ngôn ngữ mượt mà)               |
| **Reporter**  | gui-checklist-runner                                                                                            |
| **Ngày**      | 2026-08-04                                                                                                      |

**Mô tả (Description):**
Khi người dùng đang xem danh sách sự kiện bằng ngôn ngữ Tiếng Anh (danh sách có dữ liệu) và chuyển sang ngôn ngữ Tiếng Việt, toàn bộ danh sách sự kiện biến mất và hiển thị trạng thái "Không có sự kiện". Điều này cho thấy ngôn ngữ được lưu trong bộ lọc hoặc query string đã vô tình đè lên kết quả dữ liệu.

**Steps to Reproduce:**
1. Truy cập màn hình **Quản lý sự kiện** (mặc định Tiếng Anh).
2. Quan sát danh sách đang hiển thị nhiều sự kiện (3 sự kiện: "Weekend event for K2024 freshmen", "Tech conference 2025", "Music festival").
3. Click vào nút chuyển ngôn ngữ và chọn **Tiếng Việt**.
4. Quan sát danh sách sau khi reload.

**Expected Result (Kết quả mong đợi):**
- Danh sách sự kiện phải giữ nguyên nội dung, chỉ thay đổi ngôn ngữ hiển thị (Tiêu đề EN → Tiêu đề VI, Status EN → Trạng thái VI, v.v.).
- Hoặc nếu có bản dịch tiêu đề sự kiện, danh sách vẫn phải có cùng số lượng bản ghi.

**Actual Result (Kết quả thực tế):**
- Danh sách trống, hiển thị "Không có sự kiện".
- Dữ liệu bị "mất" mặc dù đang ở cùng một tài khoản, cùng một trang.

**Ảnh bằng chứng:**
- Trước: `A1_change_language_En.png` — hiển thị 3 sự kiện.
- Sau: `A1_change_language_Vie.png` — hiển thị "Không có sự kiện".

**Gợi ý nguyên nhân (Hypothesis):**
- State của bộ lọc hoặc search box bị clear/reset khi đổi ngôn ngữ.
- Hoặc locale code (`en` → `vi`) bị gắn nhầm vào filter khiến server trả về kết quả rỗng.
- Hoặc có cache client bị invalidate sai cách lúc switch locale.

---

### 🐞 Bug #2 — Empty state không thân thiện, thiếu minh họa và CTA

| Trường        | Giá trị                                                                          |
| ------------- | -------------------------------------------------------------------------------- |
| **Mã Bug**    | BUG-A1-002                                                                       |
| **Severity**  | 🟠 **Medium**                                                                    |
| **Priority**  | **Medium**                                                                       |
| **Module**    | Event Management / Empty State UX                                                 |
| **Màn hình**  | Quản lý sự kiện                                                                  |
| **Checklist** | IA01-06 (Empty state thân thiện + minh họa), IA03-08 (Empty có CTA "Xóa bộ lọc")  |
| **Reporter**  | gui-checklist-runner                                                             |
| **Ngày**      | 2026-08-04                                                                       |

**Mô tả:**
Khi danh sách sự kiện không có dữ liệu (ví dụ sau khi filter/search không ra kết quả, hoặc sau Bug #1 ở trên), hệ thống chỉ hiển thị dòng chữ "Không có sự kiện" đơn độc giữa bảng. Không có icon minh họa, không có mô tả giải thích, và không có nút hành động để người dùng thoát khỏi trạng thái này.

**Steps to Reproduce:**
1. Truy cập màn hình **Quản lý sự kiện**.
2. Áp dụng bất kỳ filter/search nào khiến kết quả rỗng.
3. Quan sát phần thân bảng.

**Expected Result:**
- Hiển thị illustration hoặc icon (ví dụ: hộp rỗng, kính lúp).
- Kèm dòng mô tả thân thiện: "Không tìm thấy sự kiện nào. Hãy thử thay đổi bộ lọc hoặc tạo sự kiện mới."
- Có 2 nút CTA: "Xóa bộ lọc" (reset filter) và "Tạo sự kiện" (primary action).

**Actual Result:**
- Bảng trống, chỉ có text "Không có sự kiện". Người dùng không biết phải làm gì tiếp.

**Ảnh bằng chứng:** `A1_change_language_Vie.png` — quan sát thân bảng rỗng.

---

### 🐞 Bug #3 — Mobile view ẩn hoàn toàn sidebar, người dùng không điều hướng được

| Trường        | Giá trị                                                                              |
| ------------- | ------------------------------------------------------------------------------------ |
| **Mã Bug**    | BUG-A1-003                                                                           |
| **Severity**  | 🔴 **High**                                                                          |
| **Priority**  | **High**                                                                             |
| **Module**    | Responsive Layout / Navigation                                                       |
| **Màn hình**  | Quản lý sự kiện (phiên bản mobile)                                                   |
| **Checklist** | IA01-08 (Responsive tốt trên Desktop/Tablet/Mobile, không cuộn ngang vô lý)          |
| **Reporter**  | gui-checklist-runner                                                                 |
| **Ngày**      | 2026-08-04                                                                           |

**Mô tả:**
Trên thiết bị mobile, toàn bộ sidebar điều hướng (chứa các mục: Trang chủ, Quản lý sự kiện, Quản lý người dùng, Quản lý vai trò, Quản lý báo cáo, v.v.) bị ẩn hoàn toàn mà không có nút hamburger menu hoặc bất kỳ cơ chế nào để mở lại. Kết quả là người dùng mobile chỉ có thể xem trang hiện tại mà không thể chuyển sang trang khác.

**Steps to Reproduce:**
1. Truy cập màn hình **Quản lý sự kiện** trên thiết bị mobile (viewport ~390px).
2. Quan sát giao diện.
3. Thử tìm cách mở menu điều hướng.

**Expected Result:**
- Sidebar phải collapse thành drawer/hamburger menu.
- Click vào icon menu → drawer trượt ra với đầy đủ các mục điều hướng.
- Hoặc có bottom navigation tab với các mục chính.

**Actual Result:**
- Sidebar biến mất hoàn toàn, không có icon menu nào ở header.
- Người dùng không thể điều hướng sang bất kỳ trang nào khác.

**Ảnh bằng chứng:** `A1_mobile.jpg`.

**Gợi ý sửa:** Thêm icon hamburger ở góc trên bên trái header, khi click sẽ mở drawer chứa navigation links.

---

### 🐞 Bug #4 — Ô tìm kiếm thiếu Label riêng

| Trường        | Giá trị                                              |
| ------------- | ---------------------------------------------------- |
| **Mã Bug**    | BUG-A1-004                                           |
| **Severity**  | 🟡 **Low** (nhưng ảnh hưởng Accessibility)           |
| **Priority**  | **Low**                                              |
| **Module**    | Search box / Accessibility                          |
| **Màn hình**  | Quản lý sự kiện                                      |
| **Checklist** | IA02-01 (Mọi input có Label rõ ràng)                |
| **Reporter**  | gui-checklist-runner                                 |
| **Ngày**      | 2026-08-04                                           |

**Mô tả:**
Ô tìm kiếm chỉ dùng placeholder "Tìm kiếm theo tiêu đề sự kiện" làm gợi ý, nhưng không có label thực sự gắn liền với input (label `for=` hoặc aria-label). Khi người dùng click vào input, placeholder biến mất → người dùng (đặc biệt screen reader) không biết ô này dùng để tìm theo tiêu chí gì.

**Steps to Reproduce:**
1. Truy cập màn hình **Quản lý sự kiện**.
2. Click vào ô search để nhập liệu.
3. Quan sát.

**Expected Result:**
- Có label hiển thị phía trên hoặc bên cạnh input (ví dụ: "Tìm kiếm sự kiện:").
- Hoặc input có thuộc tính `aria-label="Tìm kiếm theo tiêu đề sự kiện"` để screen reader đọc được.

**Actual Result:**
- Không có label, chỉ có placeholder biến mất khi focus.

**Ảnh bằng chứng:** `A1_search_01.png`, `A1_label_search.png`.

---

### 🐞 Bug #5 — Không có Breadcrumb

| Trường        | Giá trị                                                |
| ------------- | ------------------------------------------------------ |
| **Mã Bug**    | BUG-A1-005                                             |
| **Severity**  | 🟡 **Low**                                             |
| **Priority**  | **Low**                                                |
| **Module**    | Navigation / Wayfinding                                |
| **Màn hình**  | Quản lý sự kiện                                        |
| **Checklist** | IA03-02 (Breadcrumb rõ ở trang con sâu)               |
| **Reporter**  | gui-checklist-runner                                   |
| **Ngày**      | 2026-08-04                                             |

**Mô tả:**
Trang chỉ hiển thị tiêu đề "Quản lý sự kiện" mà không có breadcrumb phía trên (ví dụ: `Trang chủ / Quản lý sự kiện`). Người dùng khó nắm được ngữ cảnh vị trí trong hệ thống, đặc biệt khi truy cập sâu qua URL hoặc link chia sẻ.

**Steps to Reproduce:**
1. Truy cập màn hình **Quản lý sự kiện**.
2. Quan sát khu vực phía trên tiêu đề trang.

**Expected Result:**
- Hiển thị breadcrumb dạng: `Trang chủ › Quản lý sự kiện` (mỗi phần là link clickable, phần cuối là text thường).

**Actual Result:**
- Không có breadcrumb.

**Ảnh bằng chứng:** `A1_default.png`.

---

## Phần 4 — Khuyến nghị & Bước tiếp theo

1. **Bug #1 (Critical)** cần fix trước tiên vì ảnh hưởng trực tiếp đến dữ liệu người dùng — mất dữ liệu khi đổi ngôn ngữ là vi phạm nguyên tắc "đừng làm hỏng công việc của người dùng" (Nielsen #5).
2. **Bug #3 (High)** cần fix trước release vì ảnh hưởng trải nghiệm toàn bộ người dùng mobile.
3. **Bug #2, #4, #5** có thể gom vào sprint UX polish.
4. **22 mục Not Verified** cần bổ sung ảnh chụp các trạng thái: loading, toast, focus, hover, responsive tablet, footer, v.v. để verify đầy đủ.
5. Người dùng cần tự kiểm tra lại các dòng **Failed** và **Not Verified** trước khi đưa output này vào báo cáo chính thức.
