# AI Audit Log

> File append-only. Mỗi lần agent chạy domain testing cho một FR, thêm entry mới ở CUỐI file
> theo đúng khung dưới đây — không sửa/xóa entry cũ. Một entry cho mỗi bước (0 → 6).

---

### [2026-07-04 23:40] — FR-02 — Bước 0: Thu thập đặc tả

- **Công cụ:** Cursor Agent
- **Prompt/instruction nhận được:** Thực hiện kỹ thuật domain testing cho FR-02: Login and account lockout
- **File code đã đọc:** Không đọc bất kỳ file source code nào — chỉ đọc tài liệu đặc tả
- **Output/kết luận của bước:** Đã xác định 2 nguồn tài liệu chính: (1) contexts/README.md §2, FR-02 (dòng 38–44) về nghiệp vụ login & lockout; (2) contexts/api_specification.md §1.2 (dòng 23–32) về contract endpoint POST /api/login. Tài khoản test: [test@eshop.com](mailto:test@eshop.com) / Test1234! và [admin@eshop.com](mailto:admin@eshop.com) / Admin123!.
- **Human review / correction:** Agent đã thu thập đúng đặc tả

---

### [2026-07-04 23:41] — FR-02 — Bước 1: Input & Output

- **Công cụ:** Cursor Agent
- **Prompt/instruction nhận được:** Hoàn thiện Bước 1 (Input & Output) cho domain testing FR-02
- **File code đã đọc:** Không đọc bất kỳ file source code nào
- **Output/kết luận của bước:** Xác định 6 input chính (email, password, số lần sai liên tiếp, thời gian khóa, tồn tại tài khoản, định dạng email) và 4 output chính (JWT 200, 401 sai xác thực, 423/429 khóa, 400 validation). Tất cả nguồn trỏ tới tài liệu spec.
- **Human review / correction:** *Agent đã xác định được đúng các loại input và các kiểu dữ liệu đi kèm. Agent đã xác định đúng được các yêu cầu dựa trên spec.*

---

### [2026-07-04 23:41] — FR-02 — Bước 2: Equivalence Classes

- **Công cụ:** Cursor Agent
- **Prompt/instruction nhận được:** Hoàn thiện Bước 2 (EC) cho domain testing FR-02
- **File code đã đọc:** Không đọc bất kỳ file source code nào
- **Output/kết luận của bước:** Tạo 16 EC: 6 EC cho email/password, 6 EC cho logic lockout (EC7–EC12), 4 EC giá trị thăm dò (EC13–EC16). Đánh dấu độ tin cậy: Từ spec (EC1–EC4, EC7–EC12) vs Giả định hợp lý — CẦN XÁC NHẬN (EC5–EC6, EC13–EC16).
- **Human review / correction:** *Agent đã xác định được đầy đủ các miền dễ thấy như của email và mật khảu. Bên cạnh đó Agent còn xác định thêm logic cho tài khoản được xác định theo condition trong spec nhưng không chia được các miền valid hay invalid.*

---

### [2026-07-04 23:41] — FR-02 — Bước 3 & 4: Test Case & BVA

- **Công cụ:** Cursor Agent
- **Prompt/instruction nhận được:** Hoàn thiện Bước 3 (EC test cases) và Bước 4 (BVA) cho domain testing FR-02
- **File code đã đọc:** Không đọc bất kỳ file source code nào
- **Output/kết luận của bước:** Tạo 27 test case tổng cộng: Nhóm A (đăng nhập thành công, 1 TC), Nhóm B (đăng nhập thất bại, 2 TC), Nhóm C (validation, 4 TC), Nhóm D (account lockout, 8 TC), BV lockout (6 TC với biên 2/3/4 lần sai và 29/30/31 giây), BV probing (6 TC giá trị cực trị). Tất cả giá trị boundary đều dựa trên spec ("từ 3 lần trở lên liên tiếp", "khóa 30 giây").
- **Human review / correction:** 
  - *Phần test case của nhóm C validation phải chọn expected output trả về là 400 - Bad Request*
  - *Bổ sung TC-D5 và TC-D6 thêm một bước nhập cung tài khoản email và sai mật khẩu để đảm bảo rằng bộ đếm đã reset về 0*
  - *Để đảm bảo rằng khi tiếp tục đăng nhập sai sau khi* 

---

### [2026-07-04 23:41] — FR-02 — Bước 5 & 6: Report & Gap Analysis

- **Công cụ:** Cursor Agent
- **Prompt/instruction nhận được:** Hoàn thiện Bước 5 (Gap Analysis) và tạo report.md cho FR-02
- **File code đã đọc:** Không đọc bất kỳ file source code nào
- **Output/kết luận của bước:** Hoàn thành Gap Analysis với 7 ràng buộc không xác định được từ spec (G1–G7) và 4 giả định cần xác nhận với business (GA1–GA4). Tạo report tổng hợp 27 test case tại testing/FR-02/report.md.
- **Human review / correction:** *Chưa có*

