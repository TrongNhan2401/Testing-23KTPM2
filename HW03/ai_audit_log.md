### AI Interaction Log #1

- Công cụ AI: Claude
- Thời gian: 2026-08-01 10:16

**Prompt của người dùng (nguyên văn):**

```
Đây là yêu cầu cho phần btvn HW03 của tôi. Tôi và nhóm đã soạn sẵn check-list, tôi làm phần A và hãy cho tôi biết tôi phải làm như thế nào để bài này được 10 điểm, cho tôi biết agent skill được dùng để làm gì và làm như thế nào, tôi nên làm thế nào đây
```

**Output của AI (nguyên văn, đầy đủ):**

```
Đã đọc kỹ đề. Nhan phụ trách **Task 1 – Phần A** (checklist GUI dùng chung, sản phẩm nhóm, 15 điểm) và chọn **Kịch bản A – Admin tạo/quản lý sự kiện** cho phần cá nhân. Dưới đây là hướng dẫn để làm tốt phần A, cách dùng Agent Skill, và lộ trình tổng thể.

## 1. Task 1A cần nộp đúng 3 thứ (đọc kỹ mục 6 và 15)

1. **Checklist GUI > 40 mục**, phủ đủ 4 IA (IA-01 UI chung, IA-02 Forms, IA-03 Navigation, IA-04 Feedback/state)
2. **Danh sách nguồn tham khảo** (Nielsen 10 heuristics, Norman 6 principles, Shneiderman 8 golden rules, slide môn học, widget-specific checklists...)
3. **Toàn bộ prompt AI** đã dùng để sinh + tinh chỉnh checklist

## 2. Quy trình để đạt 10 điểm phần này

**Bước 1 – Ôn lý thuyết trước khi hỏi AI** (đề yêu cầu rõ). Đọc lại:

- 10 heuristics của Nielsen
- 6 nguyên tắc của Norman
- 8 golden rules của Shneiderman
- Slide "GUI + Usability + Compatibility Testing"

**Bước 2 – Prompt AI theo từng bước, không prompt chung chung.** Đề chê thẳng kiểu prompt "tạo checklist GUI cho app này". Nên chia nhỏ:

- Prompt 1: sinh mục IA-01 dựa trên Nielsen heuristics, áp cho ngữ cảnh EMS (web app quản lý sự kiện)
- Prompt 2: sinh mục IA-02 (Forms) — nhấn mạnh vào các control cụ thể của EMS: upload ảnh 4:3/24:9, rich-text editor, validation ngày/giờ
- Prompt 3: sinh mục IA-03 (Navigation) — sidebar, tab, breadcrumb, drag-drop reorder
- Prompt 4: sinh mục IA-04 (Feedback/state) — toast, dialog xác nhận, progress bar, real-time update
- Prompt 5: yêu cầu AI tự phản biện, liệt kê các mục nó có thể đã bỏ sót

Lưu **nguyên văn** từng prompt + output — đây chính là nguyên liệu cho AI Audit Report.

**Bước 3 – Review và bổ sung thủ công (bắt buộc).** Với mỗi mục checklist bạn tự thêm (không phải AI sinh), phải ghi rõ **lý do AI bỏ sót**. Đề gợi ý sẵn các điểm AI hay thiếu: accessibility (screen reader, contrast ratio, alt text), RTL layout, dark mode, keyboard navigation, i18n EN/VI. Ngoài ra với EMS cụ thể, kiểm tra thêm các mục đặc thù dễ bị AI bỏ:

- Trạng thái loading khi upload ảnh lớn / khi export Excel
- Đồng bộ i18n EN/VI cho toast và validation message (không chỉ label)
- Hành vi khi ngrok tunnel bị reset / mất kết nối (empty state, error state)
- Barcode/QR rendering trên các độ phân giải khác nhau
- Trạng thái real-time (check-in log) khi mất mạng tạm thời

**Bước 4 – Gắn nguồn cho từng nhóm mục**, không chỉ liệt kê nguồn chung chung ở cuối. Ví dụ mục "Error message xuất hiện gần trường lỗi, không phải popup xa" → gắn Nielsen heuristic #9 (Help users recognize/diagnose/recover from errors).

**Bước 5 – Format.** Excel hoặc Markdown, có cột: STT | IA | Mục checklist | Heuristic/nguồn tham chiếu | Nguồn gốc (AI-generated / Student-added) | Ghi chú.

## 3. Agent Skill dùng để làm gì và làm sao cho đúng (10 điểm riêng)

Agent Skill ở đây là để **tự động hóa việc lặp lại** các bước kiểm thử GUI/usability/compatibility trên nhiều màn hình khác nhau của EMS, chứ không phải để AI tự chấm điểm hộ bạn. Mục 8 nói rõ nó nên áp dụng cho 3 việc:

1. **Chạy checklist GUI** trên một màn hình cho trước → tự đối chiếu từng mục Pass/Fail, sinh khung bug report
2. **Đánh giá heuristic** (Nielsen/Norman/Shneiderman) theo cấu trúc nhất quán
3. **Chạy/ghi log ma trận cross-browser/cross-platform**

Gợi ý cách xây (tương tự các Agent Skill nhóm bạn đã dùng ở CSC13003 — ví dụ skill black-box/grey-box cho domain testing):

- Tạo file skill (SKILL.md hoặc tương đương) mô tả: input (tên màn hình, ảnh chụp), quy trình từng bước áp checklist, output format (bảng Pass/Fail + Notes + ảnh cho mục Fail)
- Skill nên tự động trích thông tin cho **AI Audit Report** (tên tool, timestamp, prompt, output) sau mỗi phiên — đề khuyến khích rõ điều này ở mục 10, đỡ tốn công ghi log thủ công
- Quay video demo (YouTube) chạy skill từ đầu đến cuối trên 1 màn hình/luồng thật của EMS

## 4. Vài lưu ý dễ mất điểm

- Đừng nộp checklist thô từ AI — phải thấy rõ dấu vết review/sửa của người
- Prompt giống nhau giữa các thành viên **khác nhóm** = 0 điểm cả hai bên (checklist dùng chung trong nhóm thì được phép giống)
- Task 1A là sản phẩm nhóm nhưng Nhan cần đảm bảo checklist đủ chi tiết để áp dụng tốt cho Kịch bản A (event lifecycle admin) — nên khi thiết kế, có thể chủ động đề xuất thêm mục liên quan đến Add/Edit Event, Registration config, Check-in vì đây là phần cá nhân bạn sẽ chạy tiếp ở Task 1B.

Nhan có muốn mình soạn sẵn khung checklist 40+ mục (kèm cột nguồn tham chiếu) để nhóm review và bổ sung không?
```

**Mục đích và nhận xét**

```
Tôi muốn AI nắm rõ yêu cầu đề và đưa ra hướng dẫn tổng thể để tôi có thể nắm được trọng tâm của đề đồng thời có phương pháp làm đúng nhất
```

### AI Interaction Log #2

- Công cụ AI: Claude
- Thời gian: 2026-08-01 10:20

**Prompt của người dùng (nguyên văn):**

```
Vậy là bây giờ tôi sẽ sử dụng agent skill để áp dụng các mục theo checklist và sau đó để nó sinh report. Sau đó tôi sẽ tự kiểm tra lại đúng không. Nếu đúng là vậy bạn hãy giúp tôi tạo một agent skill tôi muốn là 1 file .md duy nhất mô tả rõ ràng.

Và tôi đã gửi cho bạn check-list mà nhóm tôi sử dụng. File nằm trong folder Check-list và tên file là Shared_GUI_Checklist.md
```

**Output của AI (nguyên văn, đầy đủ):**

```
Đã tạo skill dưới dạng 1 file `.md` duy nhất, đặt tại `Check-list/../EMS_GUI_Usability_AgentSkill.md` (đề xuất bạn để cùng cấp với folder `Check-list`).

Vài điểm quan trọng trong skill này bạn nên biết trước khi dùng:

- **Bắt buộc có bằng chứng thật** cho mỗi mục — nếu không đủ ảnh/mô tả, skill sẽ tự đánh dấu "Not Verified" thay vì đoán mò thành Passed. Đây là điểm cố ý thiết kế để tránh vi phạm mục 12 (Ràng buộc chống gian lận AI) của đề.
- Có 4 trạng thái: **Passed / Failed / N/A / Not Verified** — chặt hơn yêu cầu tối thiểu (chỉ Passed/Failed) của đề, giúp bạn dễ lọc ra mục cần tự đi kiểm tra lại.
- Xuất sẵn 3 khuôn output: bảng checklist theo màn hình, Bug Report (khớp format Google Form §7), và AI Audit Log entry (khớp mục 10) — để bạn không phải tự soạn lại format mỗi lần chạy trên màn hình mới.
- Cuối skill có nhắc rõ: skill **không dùng cho Task 2/3**, tránh việc lỡ dùng sai chỗ.

Khi dùng, để nó chạy đúng, bạn nên đưa vào (1) ảnh chụp màn hình EMS thật, (2) tên màn hình/kịch bản, mỗi lần một màn hình trong 3 màn hình đã chọn của Kịch bản A. Sau khi có output, đúng như bạn nói — bạn tự kiểm tra lại từng dòng Failed/Not Verified trước khi đưa vào báo cáo chính thức.

Bạn muốn mình chạy thử skill này ngay trên màn hình A2 (Add/Edit Event) nếu bạn gửi ảnh chụp không?

**Note: trong quá trình sửa chứa claude đã sửa chữa trên file ban đầu và em không thể cung cấp được file ban đầu ở đây.
```

**Mục đích và nhận xét**

```
File được sinh ra khá là cụ thể cho bài tập HW03 này và em muốn file là một skill tổng quát và có thể áp dụng khi thực hiện trên đồ án hay bất kì GUI testing phần check-list. Nên em quyết định sẽ cải tiến lại file.
```

### AI Interaction Log #3

- Công cụ AI: Claude
- Thời gian: 2026-08-01 10:29

**Prompt của người dùng (nguyên văn):**

```
Vậy flow để làm phần bài tập cá nhân này là chọn 3 màn hình A1, A4, A5 sau đó sẽ ra chụp màn hình lần lượt của các phần đó chi tiết nhất cso thể sau đó bỏ vào folder để cho Agent chạy sau đó mình sẽ kiểm tra lại đúng hay không
```

**Output của AI (nguyên văn, đầy đủ):**

```
Đúng, đó là flow hợp lý và đúng tinh thần đề bài (mục 2 nguyên tắc "Con người review"). Vài điều chỉnh nhỏ để flow chạy trơn tru và không bị thiếu sản phẩm khi nộp:

Flow đề xuất chi tiết

1. Chụp ảnh — nên chụp theo từng trạng thái, không chỉ 1 ảnh/màn hình

Vì checklist có mục về loading, empty state, error state, hover, focus... một ảnh tĩnh không đủ bằng chứng cho nhiều mục. Với mỗi màn hình (A1, A4, A5), cố gắng chụp thêm:

Trạng thái mặc định (default load)
Trạng thái loading (nếu chụp kịp)
Trạng thái empty (nếu có thể tạo ra được, ví dụ filter ra 0 kết quả)
Trạng thái lỗi (validate sai, action thất bại)
Trạng thái hover/focus vào input hoặc nút (dùng để check IA02-11, IA02-12, IA04-06...)
Với A5 (Check-in): chụp cả trước và sau khi quét, để thấy log real-time cập nhật

Mục nào không chụp được bằng chứng → skill sẽ tự để "Not Verified", bạn tự quyết định sau: đi chụp thêm hay để N/A có lý do.

2. Đặt tên file ảnh rõ ràng theo mã màn hình, ví dụ:

A1_default.png
A1_filter_active.png
A1_empty_state.png
A4_participants_list.png
A4_export_progress.png
A5_checkin_before.png
A5_checkin_after_scan.png

Việc này giúp khi bạn đưa vào cho Agent chạy, dễ đối chiếu ảnh nào ứng với mục nào, và sau này làm Bug Report cũng tiện tra cứu lại.

3. Chạy Agent Skill từng màn hình một (A1 → A4 → A5), không gộp chung — để output không bị lẫn lộn mã checklist giữa các màn hình, và mỗi lần chạy có 1 AI Audit Log entry riêng (đúng yêu cầu mục 10: mỗi lần tương tác AI phải ghi timestamp + prompt + output riêng).

4. Sau khi có output từng màn hình, bạn tự kiểm tra lại — đặc biệt chú ý:

Các dòng Failed: đúng là fail thật không, severity có hợp lý không
Các dòng Not Verified: quyết định đi chụp bổ sung hay chuyển thành N/A có giải thích
Đừng để sót dòng nào ảnh hưởng đến tổng số Passed/Failed báo cáo trong README

5. Gộp 3 bảng kết quả (A1, A4, A5) + toàn bộ Bug entries thành báo cáo chính (Task 1B) và file Bug & Usability Findings Log tổng hợp (mục 7).

Bạn có muốn mình liệt kê cụ thể checklist item nào cần trạng thái/tương tác đặc biệt (hover, loading, error...) ứng với từng màn hình A1/A4/A5, để bạn biết chính xác cần chụp bao nhiêu ảnh cho từng cái không?
```

**Mục đích và nhận xét**

```
Trong quá trình review file thì em đã có một số thắc mắc về việc ứng dụng và screenshot như thế nào nên em đã tham khảo thông tin từ AI
```

### AI Interaction Log #4

- Công cụ AI: Claude
- Thời gian: 2026-08-01 11:18

**Prompt của người dùng (nguyên văn):**

```
Tôi muốn tạo một skill mà không có phụ thuộc vào ngữ cảnh của bài tập này quá, chỉ là user sẽ cung cấp ảnh ở thư mục nào, và output sẽ như thế nào thôi. Và phần AI log tôi muốn là agent sẽ nhập toàn bộ log mà nó đã output ra vào phần output. Có thể tách phần log thành 1 skil riêng
```

**Output của AI (nguyên văn, đầy đủ):**

```
Đã tách thành 2 skill độc lập, không còn gắn cứng với ngữ cảnh EMS:

1. gui-checklist-runner-SKILL.md — chỉ cần 2 input: đường dẫn checklist + đường dẫn thư mục ảnh. Đọc ảnh trong folder, đối chiếu với từng mục checklist, xuất bảng Passed/Failed/N-A/Not Verified. Dùng lại được cho bất kỳ bài tập/dự án nào sau này, không chỉ HW03.

2. ai-audit-logger-SKILL.md — skill riêng, nhiệm vụ duy nhất là append toàn bộ nguyên văn prompt + output của lượt tương tác gần nhất vào một file log, không tóm tắt, không cắt bớt. Bạn gọi skill này sau khi chạy gui-checklist-runner (hoặc bất kỳ tương tác AI nào khác muốn lưu) để tự động dồn vào AI Audit Report.

Cách dùng thực tế: chạy gui-checklist-runner trên folder A1 → xem kết quả, tự kiểm tra → gọi ai-audit-logger để nó chép nguyên output vừa rồi vào file log → lặp lại cho A4, A5.

Một lưu ý: vì skill 2 yêu cầu output "nguyên văn không cắt bớt", nếu bảng checklist dài (như checklist 46 mục của nhóm bạn), log file sẽ khá dài — điều đó là chủ ý, đúng tinh thần minh bạch mục 10 của đề, nhưng bạn nên biết trước để không bất ngờ khi thấy log dài.
```

**Mục đích và nhận xét**

```
Em đã tạo review và thấy 2 file đã áp dụng được, có thể sẽ tìm
hiểu và nâng cấp thêm trong quá trình làm bài. Với file audit log
đã có cấu trúc hợp lý và em áp dụng để viết report. Chỉ bổ sung
thêm mục "Mục đich và nhận xét" để nêu rõ tại sao và cần nhận xét
gì trong phiên làm việc đó.
```

### AI Interaction Log #5

- Công cụ AI: Claude
- Thời gian: 2026-08-01 15:17

**Prompt của người dùng (nguyên văn):**

```
Ngữ cảnh: Đây là một bài tập về GUI testing và nhiệm vụ của bạn là hãy sử dụng và làm theo các hướng dẫn trong @HW03/skills/gui-checklist-runner-SKILL.md và tôi sẽ cung cấp đầy đủ cho bạn về check-list cũng như các ảnh theo từng phần nghiệp vụ của role admin. Hãy dựa vào file check list trong @HW03/check_list/Shared_GUI_Checklist.md để áp dụng testing cho GUI trong folder @HW03/Screenshots/A1/ cho phần Danh sách Events với bộ lọc trạng thái và chấm thông báo. Sau khi làm xong hãy ghi logs đầy đủ theo hướng dẫn trong @HW03/skills/ai-audit-logger-SKILL.md và ghi vào trong file @HW03/ai_audit_log.md sau đó tôi sẽ review và kiểm tra lại.
```

**Output của AI (nguyên văn, đầy đủ):**

```
Đã đọc kỹ 2 skill (gui-checklist-runner-SKILL.md và ai-audit-logger-SKILL.md), checklist (Shared_GUI_Checklist.md), và toàn bộ 11 ảnh trong HW03/Screenshots/A1/.

## Kết quả chạy checklist — A1: Danh sách Events với bộ lọc trạng thái và chấm thông báo
Checklist nguồn: `HW03/check_list/Shared_GUI_Checklist.md` | Thư mục ảnh: `HW03/Screenshots/A1/` | Ngày chạy: 2026-08-01

|| Mã ID | Mục kiểm tra | Trạng thái | Ảnh bằng chứng | Ghi chú |
||---|---|---|---|---|
|| IA01-01 | Font chữ (Typography) rõ ràng, kích thước chữ phân cấp đúng (H1 cho tiêu đề trang, H2-H6 cho các vùng phụ) | Passed | A1_default.png | H1 "Quản lý sự kiện", subtitle cỡ nhỏ hơn, header table phân cấp hợp lý |
|| IA01-02 | Màu sắc nhất quán theo SUT (Primary: Xanh dương cho action chính, Danger: Đỏ cho Xóa/Block) | Passed | A1_default.png, A1_table_list_events_03.png | Nút "+ Tạo sự kiện" primary xanh dương, icon Xóa màu đỏ nhất quán |
|| IA01-03 | Độ tương phản màu sắc (Contrast Ratio) giữa chữ và nền đủ cao | Passed | A1_default.png | Text đen trên nền trắng, badge trạng thái có nền màu nhạt + text đậm |
|| IA01-04 | Tính năng chuyển đổi ngôn ngữ EN/VI | Not Verified | - | Không có ảnh nào thể hiện toggle ngôn ngữ |
|| IA01-05 | Text không bị tràn/vỡ layout khi chuyển sang tiếng Việt | Not Verified | - | UI đang ở tiếng Việt, không có ảnh so sánh EN/VI |
|| IA01-06 | Trạng thái rỗng (Empty State) hiển thị thông báo thân thiện | Not Verified | - | Không có ảnh empty state (VD: filter ra 0 kết quả) |
|| IA01-07 | Trạng thái tải (Loading/Skeleton) | Not Verified | - | Không có ảnh loading |
|| IA01-08 | Giao diện hiển thị tốt (Responsive) trên Desktop, Tablet, Mobile | Not Verified | - | Chỉ có ảnh desktop |
|| IA01-09 | Hình ảnh (Thumbnail, Banner sự kiện) hiển thị đúng tỷ lệ chuẩn | N/A | - | Bảng danh sách Events không có cột thumbnail/banner |
|| IA01-10 | Icon sử dụng nhất quán, khớp với thế giới thực | Passed | A1_table_list_events_01.png, A1_dot_notification.png | Icon Pencil = Edit, X = Xóa, chuông có badge "4" cho thông báo — nhất quán và đúng nghĩa |
|| IA01-11 | Không có thẻ HTML rác hoặc code render trực tiếp trên UI | Passed | A1_default.png | Toàn bộ text hiển thị sạch, không thấy tag bị lộ |
|| IA01-12 | Footer và Contact hiển thị đúng cấu hình từ Admin Settings | Not Verified | - | Ảnh đã crop không thấy footer (có thể ở cuối trang ngoài viewport) |
|| IA01-13 | Lượng thông tin hiển thị vừa đủ, không quá nhồi nhét | Passed | A1_default.png | Bảng 6 cột gọn gàng, không thừa/thiếu thông tin quan trọng |
|| IA01-14 | Giao diện tổ chức theo tác vụ người dùng, gom nhóm hợp lý | Passed | A1_default.png | Filter + Reset gom nhóm trên, Table bên dưới, Action chính đặt top-right |
|| IA01-15 | Dữ liệu xuất Excel/CSV đồng nhất về ngôn ngữ, định dạng | Not Verified | - | Không thấy nút Export trong màn hình danh sách |
|| IA02-01 | Mọi input field đều có Label rõ ràng, ngắn gọn, dễ hiểu | Not Verified | - | Search box chỉ có placeholder "Tìm kiếm theo tiêu đề", không có label riêng — cần review: search box có được coi là ngoại lệ (pattern chỉ dùng placeholder + aria-label) hay là vi phạm. Filter dropdown cũng không có label riêng |
|| IA02-02 | Trường bắt buộc có dấu `*` màu đỏ hoặc nhãn rõ ràng | N/A | - | Màn hình danh sách không có form nhập liệu với trường bắt buộc |
|| IA02-03 | Placeholder text cung cấp ví dụ định dạng hữu ích | Passed | A1_default.png | "Tìm kiếm theo tiêu đề" rõ ràng, đúng chức năng |
|| IA02-04 | Có thể nhấn "Enter" để Submit form thay vì click | Not Verified | - | Không thể xác minh từ ảnh tĩnh |
|| IA02-05 | Validation lỗi định dạng real-time hoặc khi blur | N/A | - | Không có input cần validation trong màn hình danh sách |
|| IA02-06 | Error message hiển thị inline dưới trường lỗi | Not Verified | - | Không có ảnh thể hiện trạng thái lỗi |
|| IA02-07 | Nội dung thông báo lỗi có tính xây dựng | Not Verified | - | Không có ảnh thể hiện trạng thái lỗi |
|| IA02-08 | Vùng Upload File/Ảnh ghi rõ định dạng và dung lượng tối đa | N/A | - | Màn hình danh sách không có upload |
|| IA02-09 | Sau khi upload ảnh thành công, có hiển thị Preview | N/A | - | Màn hình danh sách không có upload |
|| IA02-10 | Nút Submit bị disable hoặc chuyển loading khi đang gửi | N/A | - | Màn hình danh sách không có form submit |
|| IA02-11 | Focus order (Tab) di chuyển hợp lý trong form | Not Verified | - | Không xác minh được từ ảnh tĩnh |
|| IA02-12 | Outline Focus rõ ràng khi dùng Tab (Accessibility) | Not Verified | - | Không xác minh được từ ảnh tĩnh |
|| IA02-13 | Form nhiều bước có thanh chỉ báo tiến trình | N/A | - | Không có multi-step form |
|| IA02-14 | Rich-text editor hoạt động đúng | N/A | - | Không có rich-text editor |
|| IA02-15 | Input fields hiển thị giá trị mặc định chính xác, hợp lý | Passed | A1_default.png | Search box rỗng mặc định, Filter Status = "Tất cả trạng thái", Filter Time = "Tất cả thời gian" — hợp lý |
|| IA03-01 | Navbar/Sidebar highlight rõ trang đang đứng (Active state) | Passed | A1_default.png | Menu "Events" trong sidebar có highlight nền sáng so với các menu khác |
|| IA03-02 | Breadcrumb rõ ràng ở trang con sâu | Passed | A1_default.png | Breadcrumb "Events" hiển thị trên top của content area |
|| IA03-03 | Phân trang đúng: Nút lùi bên trái, Nút tiến bên phải | Passed | A1_pagination.png | Nút "Trước" bên trái, "Sau" bên phải, số trang ở giữa — đúng ánh xạ |
|| IA03-04 | Nút "Back", "Hủy bỏ" luôn sẵn sàng | Not Verified | - | Không có modal/dialog đang mở để xác minh |
|| IA03-05 | Bộ lọc áp dụng chính xác, UI hiển thị rõ filter đang bật | Passed | A1_filter_Draft.png, A1_filter_Published.png | Filter Status "Bản nháp" → bảng chỉ hiển thị event Draft; "Đã xuất bản" → 1 event Published; nút "Đặt lại" có badge đỏ nhỏ báo filter đang active |
|| IA03-06 | Search trả về kết quả đúng, giữ từ khóa sau search | Not Verified | - | Không có ảnh sau khi search |
|| IA03-07 | Deep Linking: URL filter/search giữ nguyên khi mở tab mới | Not Verified | - | Không có ảnh URL bar |
|| IA03-08 | Trạng thái không có kết quả hiển thị thân thiện, có nút "Xóa bộ lọc" | Not Verified | - | Không có ảnh empty state (VD: filter Status ra 0 kết quả) |
|| IA03-09 | Drag-drop có chỉ báo thị giác (icon "6 chấm") | N/A | - | Bảng không có chức năng reorder |
|| IA03-10 | Khi đang kéo thả, item có phản hồi thị giác | N/A | - | Không có drag-drop |
|| IA03-11 | Sau khi thả, thứ tự mới cập nhật ngay + thông báo lưu | N/A | - | Không có drag-drop |
|| IA04-01 | Toast thành công màu xanh lá | Not Verified | - | Không có ảnh toast |
|| IA04-02 | Toast thất bại màu đỏ | Not Verified | - | Không có ảnh toast lỗi |
|| IA04-03 | Toast tự biến mất sau 3-5 giây | Not Verified | - | Không có ảnh toast |
|| IA04-04 | Hành động phá hủy (Xóa) BẮT BUỘC có Dialog xác nhận | Not Verified | - | Có icon Xóa trên row nhưng không có ảnh nào cho thấy confirmation dialog khi nhấn — cần chụp thêm ảnh bằng chứng |
|| IA04-05 | Nút hành động chính trong Dialog nguy hiểm màu đỏ | Not Verified | - | Không có ảnh dialog xác nhận |
|| IA04-06 | Hover lên nút/link/row có hiệu ứng chuyển màu/đổ bóng | Not Verified | - | Không có ảnh trạng thái hover |
|| IA04-07 | Active/Pressed lên nút có phản hồi lún/đổi màu nền | Not Verified | - | Không có ảnh trạng thái pressed |
|| IA04-08 | Cursor đổi thành Pointer khi trỏ vào vùng clickable | Not Verified | - | Không xác minh được từ ảnh tĩnh |
|| IA04-09 | Nút Disabled bị làm mờ, không click được, cursor `not-allowed` | Not Verified | - | Không có ảnh nút disabled |
|| IA04-10 | Tooltip xuất hiện khi hover nút icon-only | Not Verified | - | Không có ảnh tooltip |
|| IA04-11 | Tích hợp liên kết tới User Guide/Support | Not Verified | - | Không thấy link trong ảnh |
|| IA04-12 | Nút ẩn/hiện mật khẩu hoạt động chính xác | N/A | - | Không có form mật khẩu |
|| IA04-13 | Progress bar hiển thị đúng tỷ lệ % và đổi màu theo trạng thái | N/A | - | Không có progress bar trong màn hình danh sách |
|| IA04-14 | Dữ liệu Real-time thay đổi không cần reload | Not Verified | - | Không có ảnh trước/sau real-time update |
|| IA04-15 | Pop-up/Dialog đảm bảo tính Modality | Not Verified | - | Không có ảnh dialog đang mở |
|| IA04-16 | Controls/menu đồng bộ với trạng thái dữ liệu | Passed | A1_filter_Published.png, A1_filter_Draft.png | Filter "Đã xuất bản" → đúng 1 row Published, pagination hiển thị "Trang 1 / 1"; Filter "Bản nháp" → bảng chỉ chứa row Draft — đồng bộ chính xác |

### Tổng hợp
- Tổng số mục: **57**
- Passed: **13** | Failed: **0** | N/A: **14** | Not Verified: **30**

### Ghi chú đặc thù về "chấm thông báo" (được user nhắc trong yêu cầu)
- Badge đỏ hình tròn chứa số "4" trên icon chuông (top-right header) được quan sát trong `A1_dot_notification.png` và `A1_default.png`.
- Pattern này được đánh giá gián tiếp **Passed** dưới **IA01-10** (Icon nhất quán — đúng quy ước thế giới thực: badge số = số thông báo chưa đọc).
- Lưu ý: Checklist `Shared_GUI_Checklist.md` không có mục riêng cho notification badge, nên đây là quan sát bổ sung. Nếu nhóm muốn có mục chính thức, có thể bổ sung mục kiểu **IA04-17: Notification badge hiển thị đúng số lượng thông báo chưa đọc, có tooltip giải thích khi hover** vào bản cập nhật checklist sau.

### Mục Not Verified nổi bật cần user tự kiểm tra / chụp thêm ảnh
1. **IA02-01** (Label của input) — quyết định: search box + filter dropdown chỉ dùng placeholder là đạt hay vi phạm.
2. **IA03-06, IA03-07, IA03-08** — chưa có ảnh: search đã thực thi, URL filter, empty state khi filter ra 0 kết quả.
3. **IA04-04** — chưa có ảnh confirmation dialog khi nhấn nút Xóa (mục quan trọng vì là hành động phá hủy).
4. **IA04-06 đến IA04-10** — toàn bộ hover/active/tooltip/disabled chưa có ảnh.
5. **IA01-12** — footer có thể nằm ngoài viewport ảnh crop, cần chụp full-page hoặc cuộn xuống.

> Theo nguyên tắc của skill: đây là **bản nháp có căn cứ**, không phải kết luận cuối. User cần tự kiểm tra lại các dòng **Not Verified** (đặc biệt các mục IA02-01, IA03-08, IA04-04) trước khi đưa vào báo cáo chính thức.
```

**Mục đích và nhận xét**

```
Hiện tại agent chưa tạo ra file ouptut do skill chưa có yêu cầu đủ về phần này nên em sẽ yêu cầu agnet xuất ra file và review. Ngoài ra agnet có tự điền vào mục "Mục tiêu và nhận xét". Em đã sửa lại 2 file skill là ai-audit-logger-SKILL.md và gui-checklist-runner-SKILL.md.
```

### AI Interaction Log #6

- Công cụ AI: Claude
- Thời gian: 2026-08-01 15:31

**Prompt của người dùng (nguyên văn):**

```
@HW03/skills/gui-checklist-runner-SKILL.md tôi đã bổ sung thêm phần xuất ra file output nên bạn hãy xuất ra file output vào @HW03/Bug reports/A1_bugs.md mà tôi đã tạo. Sau đó hãy ghi logs và file @HW03/ai_audit_log.md dựa trên @HW03/skills/ai-audit-logger-SKILL.md và tôi đã bổ sung thêm phần mục tiêu và nhận xét và phần này bạn không cần phải điền
```

**Output của AI (nguyên văn, đầy đủ):**

```
Đã đọc lại 2 file skill sau khi cập nhật:

1. `gui-checklist-runner-SKILL.md` — bạn đã thêm dòng "Hãy dựa trên output này và tạo ra file bug reports" ngay sau "## Output Format". Điều này nghĩa là sau khi chạy checklist, output bảng 57 mục sẽ được lưu thành file bug reports để người dùng review/sửa.

2. `ai-audit-logger-SKILL.md` — bạn đã bổ sung thêm 2 dòng cuối trong template output format:
```

   **Mục đích và nhận xét**
   [không điền phần này, user sẽ tự điền]

**Mục đích và nhận xét**

```
Hình chụp còn thiếu khá nhiều và sẽ tiến hành dựa theo checklist để chụp thêm các screenshots và nhờ agent đưa ra kết quả. Trong quá trình chụp hình sẽ đưa ra thêm phần trạng thái của mình.
```

