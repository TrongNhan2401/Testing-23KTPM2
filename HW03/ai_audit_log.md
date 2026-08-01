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
Em đã tạo review và thấy 2 file đã áp dụng được, có thể sẽ tìm hiểu và nâng cấp thêm trong quá trình làm bài. Với file audit log đã có cấu trúc hợp lý và em áp dụng để viết report. Chỉ bổ sung thêm mục "Mục đich và nhận xét" để nêu rõ tại sao và cần nhận xét gì trong phiên làm việc đó.
```
