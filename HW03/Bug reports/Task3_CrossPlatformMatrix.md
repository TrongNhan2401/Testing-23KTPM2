# Ma trận tương thích chéo (Cross-Platform Matrix) — Task 3

## GUI Testing: Admin Event Management System

**Môn học:** Kiểm thử và đảm bảo chất lượng phần mềm (Software Quality Assurance & Testing)
**Đề tài:** Hệ thống Quản lý Sự kiện (EventsPlus)
**Skill sử dụng:** `cross-platform-matrix-runner-SKILL.md`
**Ngày tạo:** 2026-08-03
**Giai đoạn:** **Phase 2 — VERIFY** (đã test, đã đối chiếu ảnh)
**Phiên bản:** v1.1 — Format gọn (1 bảng duy nhất)

---

## Yêu cầu độ phủ


| Khía cạnh                  | Yêu cầu                                                 |
| -------------------------- | ------------------------------------------------------- |
| Số OS tối thiểu            | **4** (Windows 11, macOS, Android, iOS)                 |
| Số Browser tối thiểu       | **5** (Chrome, Edge, Firefox, Safari, Samsung Internet) |
| Số loại thiết bị tối thiểu | **3** (Desktop, Tablet, Phone)                          |


**Nguyên tắc:** Mỗi OS, mỗi Browser, mỗi loại thiết bị phải xuất hiện **ít nhất 1 lần** trong khung ma trận.

---

## Tổng quan 3 màn hình cần test


| Mã       | Màn hình                                                 | URL gốc                                                             | Số Cell cần test |
| -------- | -------------------------------------------------------- | ------------------------------------------------------------------- | ---------------- |
| **A1**   | Danh sách Events với bộ lọc trạng thái và chấm thông báo | `https://hiu.eventsplus.io/admin/events`                            | 10               |
| **A2**   | Modal Chỉnh sửa Event                                    | `https://hiu.eventsplus.io/admin/events/[id]/edit`                  | 10               |
| **A3**   | Panel Cấu hình Registration                              | `https://hiu.eventsplus.io/admin/events/[id]/edit` (tab Categories) | 10               |
| **Tổng** |                                                          |                                                                     | **30**           |


---

## Khung ma trận chung (dùng chung cho A1, A2, A3)

**Yêu cầu độ phủ:** 4 OS × 5 Browser × 3 Loại thiết bị (mỗi loại ≥1 lần)


| Cell ID | OS         | Browser          | Loại thiết bị | Tên file ảnh gợi ý                | Kết quả | Ghi chú                                             |
| ------- | ---------- | ---------------- | ------------- | --------------------------------- | ------- | --------------------------------------------------- |
| M01     | Windows 11 | Chrome           | Desktop       | Windows_Chrome_Desktop.png        | Passed  | - Layout đầy đủ, sidebar + main content OK          |
| M02     | Windows 11 | Edge             | Desktop       | Windows_Edge_Desktop.png          | Passed  | - Tương tự Chrome Desktop                           |
| M03     | macOS      | Safari           | Desktop       | macOS_Safari_Desktop.png          | Passed  | - Layout macOS hiển thị đúng                        |
| M04     | macOS      | Firefox          | Desktop       | macOS_Firefox_Desktop.png         | Passed  | - Cross-browser desktop OK                          |
| M05     | Android 14 | Chrome           | Phone         | Android_Chrome_Phone.png          | Failed  | - Sidebar chồng lên main content - Không responsive |
| M06     | Android 14 | Samsung Internet | Phone         | Android_SamsungInternet_Phone.png | Failed  | - Sidebar chồng lên main content - Không responsive |
| M07     | Android 14 | Chrome           | Tablet        | Android_Chrome_Tablet.png         | Passed  | - Tablet hiển thị OK, layout responsive             |
| M08     | iOS 17     | Safari           | Phone         | iOS_Safari_Phone.png              | Failed  | - Sidebar chồng lên main content - Không responsive |
| M09     | iOS 17     | Safari           | Tablet        | iOS_Safari_Tablet.png             | Passed  | - iPad hiển thị OK, layout responsive               |
| M10     | iOS 17     | Chrome           | Phone         | iOS_Chrome_Phone.png              | Failed  | - Sidebar chồng lên main content - Không responsive |


### Kiểm tra độ phủ của khung này

- **OS:** Windows 11, macOS, Android 14, iOS 17 → **đủ 4** yêu cầu ✓
- **Browser:** Chrome, Edge, Safari, Firefox, Samsung Internet → **đủ 5** yêu cầu ✓
- **Loại thiết bị:** Desktop, Phone, Tablet → **đủ 3** yêu cầu ✓

**Tổng số cell: 10** — Tối ưu: dùng 10 cells để phủ đủ 4 OS + 5 Browser + 3 Device Type.

### Tại sao mỗi cell quan trọng?


| Cell | Lý do cần test                                                      |
| ---- | ------------------------------------------------------------------- |
| M01  | Desktop + Windows + Chrome là combo phổ biến nhất (80%+ user admin) |
| M02  | Edge là browser mặc định Windows 11 — cần đảm bảo tương thích       |
| M03  | Safari + macOS cần kiểm tra rendering đặc trưng (font, padding)     |
| M04  | Firefox trên macOS để cross-browser check                           |
| M05  | Android Chrome là combo mobile phổ biến nhất                        |
| M06  | Samsung Internet chỉ chạy trên Samsung Galaxy — phủ browser riêng   |
| M07  | Android Tablet để kiểm tra responsive layout                        |
| M08  | iOS Safari là combo mobile quan trọng                               |
| M09  | iPad cần kiểm tra layout riêng (Safari iPad khác iPhone)            |
| M10  | Firefox iOS dùng WebKit engine — cần kiểm tra cross-browser         |


---

## Tổng kết (Phase 2 — Verify)

### Đã test: **10/10 cells** (100%)


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

**Tất cả các cell Failed đều thuộc nhóm Phone (màn hình mobile):**

1. **M05** - Android Chrome Phone → Failed (không responsive)
2. **M06** - Android Samsung Internet Phone → Failed (không responsive)
3. **M08** - iOS Safari Phone → Failed (không responsive)
4. **M10** - iOS Chrome Phone → Failed (không responsive)

**Pattern Fail:** Sidebar chồng lên main content trên màn hình admin, giao diện không responsive trên phone (xem thêm Bug #A1-001, #A2-003, #A3-005 trong Task1_BugReports.md).

**Desktop và Tablet không bị ảnh hưởng** — chỉ riêng Phone là bị lỗi responsive trên cả 4 OS × Browser combo (Android Chrome, Android Samsung, iOS Safari, iOS Chrome).

---

### Kiểm tra độ phủ

- **OS:** Windows 11, macOS, Android 14, iOS 17 → **đủ 4** ✓
- **Browser:** Chrome, Edge, Safari, Firefox, Samsung Internet → **đủ 5** ✓
- **Device:** Desktop, Phone, Tablet → **đủ 3** ✓

---

**Ngày tạo:** 2026-08-03
**Phiên bản:** v1.1 — Đã verify Phase 2
**Người tạo:** AI Assistant (Claude) theo skill `cross-platform-matrix-runner`