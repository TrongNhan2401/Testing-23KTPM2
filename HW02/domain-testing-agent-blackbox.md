# Domain Testing Agent — Black-box thuần

## Nguyên tắc cốt lõi — ranh giới black-box

Đây là điểm khác biệt duy nhất nhưng quan trọng nhất so với bản grey-box: **agent thiết kế
test case mà KHÔNG được nhìn vào cách hệ thống implement bên trong.** Mọi EC, mọi giá trị biên
phải suy ra được từ những gì một tester bên ngoài (không có quyền truy cập source) cũng biết.

### Nguồn được phép đọc (luôn được dùng)

- Tài liệu đặc tả: contexts/api_specification.md, README.md

## Quy trình thực hiện

### Bước 0 — Thu thập đặc tả (không đụng vào implementation)

- Tìm và đọc: README/SRS liên quan đến FR, `api_specification.md`/OpenAPI, Postman collection
có sẵn trong repo (nếu có).
- Nếu tài liệu không đủ chi tiết cho một điều kiện cần test (ví dụ không nói rõ số ký tự tối
đa), **không tự suy ra từ code** — ghi nhận đây là "ràng buộc chưa xác định trong spec",
chọn giá trị test hợp lý theo thông lệ chung (0, giá trị âm, chuỗi rất dài, ký tự đặc biệt)
và đánh dấu rõ "CẦN XÁC NHẬN VỚI BUSINESS/QA" — đừng lặng lẽ điền theo con số nhìn thấy trong
code.
- Ghi lại danh sách tài liệu đã dùng làm nguồn (không phải danh sách file code).

### Bước 1 — Input & Output (chỉ từ spec/contract)

Giống cấu trúc chuẩn, nhưng cột "Nguồn" chỉ được trỏ tới tài liệu spec/API doc, KHÔNG được trỏ
tới `file:line` trong source code xử lý logic.

### Bước 2 — Equivalence Classes

Áp dụng đúng 4 heuristic đã học (range / set giá trị / must-be / split rule), nhưng nguồn của
mỗi ràng buộc phải là spec. Với field mà spec không nói gì (rất phổ biến với input như email,
password), tạo EC "theo thông lệ hợp lý" (ví dụ: định dạng email chuẩn RFC, password không
rỗng) và đánh dấu rõ mức độ tin cậy: `[Từ spec]` vs `[Giả định hợp lý — CẦN XÁC NHẬN]`.

### Bước 3 & 4 — Đại diện & Boundary Value Analysis

- Nếu spec nêu con số cụ thể (ví dụ "khóa sau ≥3 lần sai, trong 30 giây") → dùng chính xác con
số đó làm biên (3-1, 3, 3+1; 30-1, 30, 30+1).
- Nếu spec KHÔNG nêu con số (ví dụ không nói rõ maxLength của email) → không bịa số, thay vào
đó tạo test case dạng "giá trị cực trị mang tính thăm dò" (probing): chuỗi rất dài (ví dụ
1000 ký tự), số âm, số 0, giá trị NULL — và ghi rõ đây là **giá trị thăm dò black-box**, mục
đích là để tìm ra biên thật thông qua quan sát response thực tế, không phải biên đã biết
trước.

### Bước 5 — Bảng test case cho Postman

Giống bản grey-box: 4 cột `Input | Expected Output | Actual | Status`. Riêng cột **Expected
Output** cho các trường hợp "giá trị thăm dò" (Bước 4) ghi rõ: `Không xác định trước — dùng để thăm dò hành vi thực tế` thay vì bịa ra một status code cụ thể.

### Bước 6 — Gap Analysis

Thêm một mục riêng cho black-box: **"Ràng buộc không xác định được vì spec thiếu"** — liệt kê
mọi điều kiện mà agent phải giả định vì tài liệu không đủ, khác với gap analysis grey-box (nơi
gap chủ yếu do code phức tạp hoặc không đọc hết được).

### Bước 7 — Phân tích kết quả Postman (SAU khi người dùng đã điền Actual/Status)

Đây là bước mới, chỉ chạy khi được yêu cầu, sau khi người dùng đã tự chạy Postman và điền cột
Actual/Status vào report:

- So sánh Expected vs Actual **thuần túy dựa trên dữ liệu quan sát được**, không tham chiếu
code.
- Nếu phát hiện sai lệch (ví dụ tài khoản bị khóa sớm hơn spec nói), agent được phép **suy
luận giả thuyết** dựa trên hành vi quan sát được qua nhiều test case liên tiếp (ví dụ: "quan
sát thấy khóa xảy ra ở lần sai thứ 2 thay vì thứ 3 → nghi ngờ bộ đếm tăng nhanh hơn dự kiến")
— đây vẫn là suy luận **black-box** (dynamic behavioral inference), vì nó dựa trên việc thăm
dò nhiều lần qua API, không phải đọc source.
- Ghi bug với format: mô tả hành vi quan sát được + spec kỳ vọng + mức độ tin cậy của giả
thuyết (ví dụ "cần thêm test case ở lần sai thứ 2 và thứ 3 riêng biệt để xác nhận chính xác
ngưỡng thật"). KHÔNG khẳng định nguyên nhân kỹ thuật cụ thể (ví dụ "code cộng +2") vì đó là
suy luận về implementation — chỉ báo cáo triệu chứng quan sát được.

## Đoạn "Phương pháp luận" bắt buộc đầu report

Mọi `report.md` do agent tạo theo skill này phải có đoạn sau ở đầu file:

```markdown
## Phương pháp luận
Domain testing trong report này được thực hiện theo phương pháp **Black-box thuần**: mọi
Equivalence Class và Boundary Value được xác định chỉ dựa trên đặc tả (SRS/README) và tài
liệu hợp đồng API (OpenAPI/Postman collection), KHÔNG dựa trên việc đọc source code xử lý
logic nghiệp vụ. Các giá trị mà spec không nêu rõ được đánh dấu là "giá trị thăm dò" và sẽ
được xác nhận qua kết quả thực thi bằng Postman, không suy luận từ implementation.
```

## File output

```
testing/<FR-ID>/
├── report.md       # bắt đầu bằng đoạn Phương pháp luận ở trên
└── audit-log.md     # append-only, thêm entry cho cả Bước 7 khi phân tích kết quả Postman
```

Dùng lại khung `templates/report_template_blackbox.md` và `templates/audit_log_template.md`
(giống bản grey-box, không đổi).

## Cách agent nên phản hồi

- Nếu trong lúc search tài liệu, agent lỡ nhìn thấy nội dung code (ví dụ IDE tự hiển thị file
liên quan), phải chủ động nói rõ: "Tôi thấy có file code liên quan nhưng sẽ không dùng nó để
suy luận EC/BVA, chỉ dùng [tài liệu X]" — minh bạch tuyệt đối về nguồn thông tin.
- Không tự ý "tiện thể" mở file service/controller để "xác nhận nhanh" — nếu cần xác nhận một
điều gì đó, hỏi người dùng hoặc để nguyên là giả định cần xác nhận qua Postman.
- Khi thiếu spec nghiêm trọng đến mức không thể tạo EC có ý nghĩa, dừng lại và hỏi người dùng
thay vì tự bịa toàn bộ ràng buộc.

