---

## name: gui-checklist-runner
description: >
  Run a user-supplied GUI/usability checklist against a set of screenshots for one screen,
  and produce a structured Pass/Failed/N-A/Not-Verified report. Trigger whenever the user
  gives (a) a path to a checklist file and (b) a path to a folder of screenshots, and asks to
  "run the checklist", "check this screen", "audit these screenshots". Generic across any
  project — do not assume a specific app, domain, or coursework context; take checklist
  content and screen identity entirely from what the user provides.

# GUI Checklist Runner

## Mục đích

Đối chiếu từng mục trong một checklist do người dùng cung cấp với bằng chứng ảnh chụp màn hình
thật, rồi xuất báo cáo có cấu trúc. Không tự bịa bằng chứng, không tự đoán kết quả khi thiếu
ảnh, không tự sửa nội dung checklist gốc.

## Input bắt buộc

1. **Đường dẫn checklist** — người dùng chỉ định file checklist (Markdown/Excel/CSV...).
2. **Đường dẫn thư mục ảnh** — người dùng chỉ định folder chứa ảnh chụp cho một màn hình/luồng
  cụ thể. Đọc toàn bộ ảnh trong thư mục đó làm bằng chứng.
3. **Tên/định danh màn hình đang kiểm tra** — để ghi vào header báo cáo.

Nếu thiếu bất kỳ input nào ở trên, dừng lại và hỏi người dùng trước khi chạy.

## Quy trình

### Bước 1 — Nạp checklist

Đọc toàn bộ nội dung file checklist. Giữ nguyên số lượng mục, mã ID, nội dung — không thêm,
không bớt, không diễn giải lại.

### Bước 2 — Nạp ảnh

Xem toàn bộ ảnh trong thư mục được chỉ định. Ghi nhận ảnh nào thể hiện trạng thái/tương tác gì
(mặc định, loading, lỗi, hover, empty...) dựa trên nội dung ảnh và tên file.

### Bước 3 — Đối chiếu từng mục checklist với ảnh

Với mỗi mục, gán một trong bốn trạng thái:

- **Passed** — có ảnh chứng minh rõ ràng hành vi đúng.
- **Failed** — có ảnh chứng minh rõ ràng hành vi sai/thiếu.
- **Not Verified** — không có ảnh nào đủ để kết luận. KHÔNG được suy diễn thành Passed chỉ vì
không thấy lỗi rõ ràng trong ảnh sẵn có.
- **N/A** — mục không áp dụng cho loại giao diện/control xuất hiện trong ảnh — phải nêu lý do.

### Bước 4 — Với mỗi mục Failed

Ghi rõ: mô tả hành vi thực tế quan sát được, tên file ảnh làm bằng chứng, và (nếu checklist có
cột mức độ nghiêm trọng hoặc nguồn tham chiếu) điền theo đúng cột đó — không tự chế thêm tiêu
chí ngoài checklist gốc trừ khi người dùng yêu cầu.

### Bước 5 — Xuất báo cáo theo format bên dưới

## Nguyên tắc bắt buộc

- Không bịa bằng chứng — mỗi kết luận Passed/Failed phải trỏ được tới ảnh cụ thể trong thư mục.
- Không tự thêm/xóa/sửa mục checklist khi đang chạy.
- Mỗi mục Failed phải có mô tả cụ thể, không viết chung chung.
- Cuối mỗi lần chạy, nhắc người dùng tự kiểm tra lại các dòng Failed và Not Verified trước khi
đưa vào báo cáo chính thức — output của skill là bản nháp có căn cứ, không phải kết luận cuối.

## Output Format

Hãy dựa trên output này và tạo ra file bug reports

```markdown
## Kết quả chạy checklist — [Tên/định danh màn hình]
Checklist nguồn: [đường dẫn] | Thư mục ảnh: [đường dẫn] | Ngày chạy: [YYYY-MM-DD]

| Mã ID | Mục kiểm tra | Trạng thái | Ảnh bằng chứng | Ghi chú |
|---|---|---|---|---|
| ... | ... | Passed | ảnh_01.png | - |
| ... | ... | Failed | ảnh_03.png | Mô tả lỗi cụ thể quan sát được |
| ... | ... | N/A | - | Lý do không áp dụng |
| ... | ... | Not Verified | - | Không có ảnh thể hiện trạng thái này |

### Tổng hợp
- Tổng số mục: [N]
- Passed: [n] | Failed: [n] | N/A: [n] | Not Verified: [n]
```

## Khi nào KHÔNG dùng skill này

- Không dùng khi chưa có ảnh thật trong thư mục được chỉ định — không chạy dựa trên trí nhớ
hoặc suy đoán về giao diện.
- Không tự sinh checklist mới nếu người dùng chưa cung cấp — đây là skill để *chạy* checklist
có sẵn, không phải để *tạo* checklist.

