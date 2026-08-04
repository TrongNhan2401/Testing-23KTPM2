# HW03 — GUI Testing, Usability & Cross-Platform Testing

## Hệ thống Quản lý Sự kiện (EventsPlus) — Admin Panel

**Môn học:** Kiểm thử và đảm bảo chất lượng phần mềm (Software Quality Assurance & Testing)
**Sinh viên:** Trần Phạm Trọng Nhân — MSSV: 21127641
**Ngày hoàn thành:** 2026-08-04
**Trạng thái:** Hoàn thành 100%

---

## Mục lục

1. [Test Summary](#test-summary)
2. [Cấu trúc thư mục](#cấu-trúc-thư-mục)
3. [Bảng tự đánh giá](#bảng-tự-đánh-giá)
4. [Tài liệu tham khảo](#tài-liệu-tham-khảo)

---

## Test Summary

### Kịch bản đã chọn (Task 2 — Usability Testing)

**Bối cảnh:** Bạn là thành viên ban tổ chức sự kiện của câu lạc bộ.

**Tác vụ:** "Hãy tạo một sự kiện hội thảo sắp tới trên hệ thống dành cho tối đa 50 người tham gia (bao gồm cả sinh viên và giảng viên). Bạn cần thiết lập thời gian diễn ra vào tuần tới, bật tính năng danh sách chờ (waitlist), phân quyền vai trò tham gia đầy đủ, và xuất bản (Publish) sự kiện. Sau đó, hãy tìm lại sự kiện vừa tạo để kiểm tra xem nó đã hiển thị đúng trên hệ thống chưa trước khi chia sẻ link."

### Các màn hình đã kiểm (Task 1 & Task 3)


| Mã     | Màn hình                    | URL gốc                                                             | Mô tả                                                                                              |
| ------ | --------------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **A1** | Danh sách Events            | `https://hiu.eventsplus.io/admin/events`                            | Bảng danh sách sự kiện với bộ lọc trạng thái, search, phân trang, và chấm thông báo                |
| **A2** | Modal Chỉnh sửa Event       | `https://hiu.eventsplus.io/admin/events/[id]/edit`                  | Form chỉnh sửa sự kiện với 5 tab: Thông tin cơ bản, Ngày giờ, Địa điểm, Danh mục, Tùy chọn bổ sung |
| **A3** | Panel Cấu hình Registration | `https://hiu.eventsplus.io/admin/events/[id]/edit` (tab Categories) | Cấu hình Roles, Max Slots, Waitlist, Vai trò phụ cho đăng ký sự kiện                               |


### Số liệu Checklist (Task 1)


| Chỉ số             | A1       | A2       | A3       | **Tổng**                  |
| ------------------ | -------- | -------- | -------- | ------------------------- |
| Số mục thiết kế    | 57       | 57       | 57       | **57** (dùng chung)       |
| Số mục đã chạy     | 57       | 57       | 57       | **171** (57 × 3 màn hình) |
| Passed             | 27       | 29       | 17       | **73**                    |
| Failed             | 7        | 4        | 5        | **16**                    |
| N/A                | 23       | 24       | 35       | **82**                    |
| Not Verified       | 0        | 0        | 0        | **0**                     |
| **Tỷ lệ verified** | **100%** | **100%** | **100%** | **100%**                  |


> **Số mục checklist thiết kế:** 57 mục dùng chung cho cả 3 màn hình (chia thành 4 khía cạnh IA-01 → IA-04, tổng 171 mục khi nhân với 3 màn hình).
>
> **Số mục đã chạy:** 171/171 (100%)

### Số lỗi phát hiện (Task 1)


| Màn hình               | Critical | High  | Medium | Low   | Tổng   |
| ---------------------- | -------- | ----- | ------ | ----- | ------ |
| A1: Danh sách Events   | 0        | 4     | 3      | 0     | **7**  |
| A2: Modal Chỉnh sửa    | 0        | 2     | 2      | 0     | **4**  |
| A3: Panel Registration | 0        | 2     | 1      | 2     | **5**  |
| **Tổng**               | **0**    | **8** | **6**  | **2** | **16** |


### Số người tham gia User-Testing (Task 2)


| STT | Họ và tên           | Số điện thoại (ẩn 4 số) | Ngày thực hiện |
| --- | ------------------- | ----------------------- | -------------- |
| 1   | Nguyễn Trường Duy   | 033 833                 | 02/08/2026     |
| 2   | Đào Đức Mạnh        | 036 207                 | 02/08/2026     |
| 3   | Nguyễn Lê Nhật Duy  | 094 210                 | 02/08/2026     |
| 4   | Nguyễn Văn An       | 098 321                 | 02/08/2026     |
| 5   | Nguyễn Võ Huy Cường | 093 622                 | 02/08/2026     |


### Số vấn đề Usability theo mức nghiêm trọng (Task 2)

*Quy ước: 0 Không lỗi, 1 Lỗi thẩm mỹ, 2 Lỗi nhỏ, 3 Lỗi lớn, 4 Thảm họa Usability*


| Mức nghiêm trọng             | Vấn đề                                                                                         | Số lượng |
| ---------------------------- | ---------------------------------------------------------------------------------------------- | -------- |
| **Severity 3** (Lỗi lớn)     | Discoverability: Khó xác định vị trí tính năng tạo sự kiện                                     | 1        |
| **Severity 3** (Lỗi lớn)     | Time Picker: Trải nghiệm tồi (cuộn chuột thay vì nhập bàn phím, vòng lặp 00-59 không liên tục) | 1        |
| **Severity 2** (Lỗi nhỏ)     | Waitlist & Limits: Logic và giao diện gây bối rối                                              | 1        |
| **Severity 2** (Lỗi nhỏ)     | Phân quyền vai trò: Phức tạp hóa luồng người dùng                                              | 1        |
| **Severity 1** (Lỗi thẩm mỹ) | Thiếu Preview & Wording chưa rõ ("Ngày & Giờ bắt đầu" → "Ngày & Giờ sự kiện bắt đầu")          | 1        |
| **Tổng**                     |                                                                                                | **5**    |


### Số ô tương thích đã phủ (Task 3 — Cross-Platform Matrix)


| Khía cạnh                | Yêu cầu                                             | Đã phủ                        |
| ------------------------ | --------------------------------------------------- | ----------------------------- |
| **Số OS**                | 4 (Windows 11, macOS, Android, iOS)                 | **4/4**                       |
| **Số Browser**           | 5 (Chrome, Edge, Firefox, Safari, Samsung Internet) | **5/5**                       |
| **Số loại thiết bị**     | 3 (Desktop, Tablet, Phone)                          | **3/3**                       |
| **Tổng số cell đã test** | —                                                   | **10/10** (đã verify Phase 2) |


#### Ma trận 10 cell đã chạy


| Cell ID | OS         | Browser          | Device  | Kết quả | Bằng chứng                                            |
| ------- | ---------- | ---------------- | ------- | ------- | ----------------------------------------------------- |
| M01     | Windows 11 | Chrome           | Desktop | Passed  | `Screenshots/Task3/Windows_Chrome_Desktop.png`        |
| M02     | Windows 11 | Edge             | Desktop | Passed  | `Screenshots/Task3/Windows_Edge_Desktop.png`          |
| M03     | macOS      | Safari           | Desktop | Passed  | `Screenshots/Task3/macOS_Safari_Desktop.png`          |
| M04     | macOS      | Firefox          | Desktop | Passed  | `Screenshots/Task3/macOS_Firefox_Desktop.png`         |
| M05     | Android 14 | Chrome           | Phone   | Failed  | `Screenshots/Task3/Android_Chrome_Phone.png`          |
| M06     | Android 14 | Samsung Internet | Phone   | Failed  | `Screenshots/Task3/Android_SamsungInternet_Phone.png` |
| M07     | Android 14 | Chrome           | Tablet  | Passed  | `Screenshots/Task3/Android_Chrome_Tablet.png`         |
| M08     | iOS 17     | Safari           | Phone   | Failed  | `Screenshots/Task3/iOS_Safari_Phone.png`              |
| M09     | iOS 17     | Safari           | Tablet  | Passed  | `Screenshots/Task3/iOS_Safari_Tablet.png`             |
| M10     | iOS 17     | Chrome           | Phone   | Failed  | `Screenshots/Task3/iOS_Chrome_Phone.png`              |


**Tổng kết:** 6 Passed · 4 Failed (tất cả 4 Failed đều là Phone — sidebar chồng main content)

---

## Bảng tự đánh giá


| STT | Tiêu chí                                                                                            | Điểm    | Tự đánh giá |
| --- | --------------------------------------------------------------------------------------------------- | ------- | ----------- |
| 1a  | **Task 1A — Checklist dùng chung (> 40 mục, IA-01…IA-04) + nguồn tham khảo + prompt AI (nhóm)**     | 15      | 15          |
| 1b  | **Task 1B — Chạy checklist trên ≥ 3 màn hình + bug report (cá nhân)**                               | 15      | 15          |
| 2   | **Task 2 — User testing với 5 người dùng thật (kịch bản + 5 phiên + phân tích → Usability Report)** | 25      | 25          |
| 3   | **Task 3 — Ma trận Cross-Browser / Cross-Platform (3 OS × 5 browser × 3 loại thiết bị)**            | 25      | **25**      |
| 4   | **Nộp Bug & Usability Findings (Google Form) + log tổng hợp**                                       | 10      | **10**      |
| 5   | **Agent Skills**                                                                                    | 10      | **10**      |
|     | **Tổng**                                                                                            | **100** | **100**     |


---

## Tài liệu tham khảo

### 1. Lý thuyết

1. **Nielsen, J. (1994).** *10 Usability Heuristics for User Interface Design.* — Nguyên lý heuristic cho usability, nền tảng cho tiêu chí IA-01 và IA-04.
  - URL: [https://www.nngroup.com/articles/ten-usability-heuristics/](https://www.nngroup.com/articles/ten-usability-heuristics/)
2. **Norman, D. (2013).** *The Design of Everyday Things* (Revised & Expanded Edition). Basic Books. — 6 nguyên tắc thiết kế (Affordance, Signifier, Mapping, Feedback, Constraint, Consistency), nền tảng cho tiêu chí IA-02 (Forms) và IA-03 (Navigation).
  - ISBN: 978-0-465-05065-7
3. **Shneiderman, B., Plaisant, C., Cohen, M., Jacobs, S., Elmqvist, N., & Diakopoulos, N. (2016).** *Designing the User Interface: Strategies for Effective Human-Computer Interaction* (6th Edition). Pearson. — Nguyên lý thiết kế tương tác người-máy.
4. **W3C — Web Content Accessibility Guidelines (WCAG) 2.1.** — Tiêu chuẩn accessibility cho web (Label, ARIA, contrast).
  - URL: [https://www.w3.org/TR/WCAG21/](https://www.w3.org/TR/WCAG21/)
5. **MDN Web Docs — Responsive Web Design.** — Best practices cho responsive (media queries, mobile-first).
  - URL: [https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
6. **W3Schools — Cross Browser Compatibility.** — Hướng dẫn đảm bảo tương thích đa trình duyệt.
  - URL: [https://www.w3schools.com/cssref/css3_browsersupport.php](https://www.w3schools.com/cssref/css3_browsersupport.php)

### 2. Công cụ & Nền tảng

1. **BrowserStack / LambdaTest** — Cloud testing platform cho cross-browser testing (sử dụng trong Task 3).
2. **GitHub Copilot & Claude (Cursor)** — AI coding assistant hỗ trợ tạo checklist, ghi log audit, verify ma trận.

### 3. Skills sử dụng trong HW03

1. **HW03/skills/gui-checklist-runner-SKILL.md** — Skill áp dụng checklist GUI và sinh bug report.
2. **HW03/skills/ai-audit-logger-SKILL.md** — Skill ghi log tương tác AI theo định dạng verbatim (prompt nguyên văn + output nguyên văn).
3. **HW03/skills/cross-platform-matrix-runner-SKILL.md** — Skill 2 phases (Plan + Verify) cho cross-platform testing.

---

## Thông tin liên hệ

**Sinh viên:** Trần Phạm Trọng Nhân
**MSSV:** 21127641
**Email:** (xem trong `ai_audit_log.md` — được overlay trên các ảnh test theo skill)

---

**Ngày tạo:** 2026-08-04
**Phiên bản:** v1.0
**Trạng thái:** Hoàn thành