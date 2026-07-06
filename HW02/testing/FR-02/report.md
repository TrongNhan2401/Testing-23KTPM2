# Domain Testing Report — FR-02: Đăng nhập & Khóa tài khoản

## Phương pháp luận

Domain testing trong report này được thực hiện theo phương pháp **Black-box thuần**: mọi
Equivalence Class và Boundary Value được xác định chỉ dựa trên đặc tả (SRS/README) và tài
liệu hợp đồng API (OpenAPI/Postman collection), KHÔNG dựa trên việc đọc source code xử lý
logic nghiệp vụ. Các giá trị mà spec không nêu rõ được đánh dấu là "giá trị thăm dò" và sẽ
được xác nhận qua kết quả thực thi bằng Postman, không suy luận từ implementation.

---

## 0. Tài liệu đã khảo sát


| Loại tài liệu | Nguồn                                               | Ghi chú                                |
| ------------- | --------------------------------------------------- | -------------------------------------- |
| SRS/README    | `contexts/README.md` — §2, FR-02 (dòng 38–44)       | Mô tả đầy đủ nghiệp vụ login & lockout |
| API Spec      | `contexts/api_specification.md` — §1.2 (dòng 23–32) | Contract endpoint `POST /api/login`    |


---

## 1. Input & Output

### 1.1 Input


| #   | Input                                         | Kiểu    | Ràng buộc (theo spec)                                                                                 | Nguồn                       | Độ tin cậy |
| --- | --------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------- | --------------------------- | ---------- |
| I1  | `email`                                       | String  | Phải là email đã đăng ký trong hệ thống; định dạng hợp lệ ([user@domain.com](mailto:user@domain.com)) | README.md §2, FR-01         | Từ spec    |
| I2  | `password`                                    | String  | Phải khớp với mật khẩu đã đăng ký của email đó                                                        | README.md §2, FR-02         | Từ spec    |
| I3  | Số lần đăng nhập sai liên tiếp                | Integer | Bộ đếm tăng đúng 1 đơn vị sau mỗi lần sai; khóa khi ≥ 3 lần sai liên tiếp                             | README.md §2, FR-02         | Từ spec    |
| I4  | Thời gian khóa tạm thời                       | Integer | Thời gian khóa = 30 giây (môi trường demo)                                                            | README.md §2, FR-02         | Từ spec    |
| I5  | Tài khoản có tồn tại trong hệ thống hay không | Boolean | Email phải đã đăng ký; tài khoản chưa bị xóa                                                          | README.md §2, FR-02 + FR-01 | Từ spec    |
| I6  | Email có đúng định dạng syntax hay không      | Boolean | Định dạng hợp lệ (HTML5 `type="email"` validation)                                                    | README.md §2, FR-02         | Từ spec    |


### 1.2 Output


| #   | Output                                                            | Mô tả                                                                                   | Nguồn                     |
| --- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------- |
| O1  | JWT Token (`200 OK`)                                              | Đăng nhập thành công — trả về chuỗi JWT token + thông tin user                          | api_specification.md §1.2 |
| O2  | Lỗi xác thực (`401 Unauthorized`)                                 | Email hoặc mật khẩu sai — thông báo chung chung, không tiết lộ cái nào sai              | README.md §2, FR-02       |
| O3  | Lỗi tài khoản bị khóa (`423 Locked` hoặc `429 Too Many Requests`) | Đăng nhập sai ≥ 3 lần liên tiếp — khóa 30 giây, thông báo phù hợp, không để lộ chi tiết | README.md §2, FR-02       |
| O4  | Lỗi validation (`400 Bad Request`)                                | Email không đúng định dạng — theo HTML5 `type="email"` validation                       | README.md §2, FR-02       |


---

## 2. Equivalence Classes

### 2.1 EC cho `email` (kết hợp với password)


| EC  | Field            | Điều kiện                                                                               | Mô tả lớp                                     | Valid/Invalid | Độ tin cậy                     |
| --- | ---------------- | --------------------------------------------------------------------------------------- | --------------------------------------------- | ------------- | ------------------------------ |
| EC1 | email + password | Email đúng format & đã đăng ký, password đúng                                           | Đăng nhập thành công — nhận JWT token         | Valid         | Từ spec                        |
| EC2 | email + password | Email đúng format & đã đăng ký, password SAI                                            | Sai mật khẩu — tăng bộ đếm thất bại           | Invalid       | Từ spec                        |
| EC3 | email + password | Email đúng format nhưng KHÔNG tồn tại trong hệ thống                                    | Tài khoản không tồn tại — thông báo lỗi chung | Invalid       | Từ spec                        |
| EC4 | email            | Email không đúng định dạng (không theo chuẩn [user@domain.com](mailto:user@domain.com)) | Định dạng email không hợp lệ — validation lỗi | Invalid       | Từ spec                        |
| EC5 | email            | Email rỗng hoặc null                                                                    | Trường bắt buộc bị bỏ trống — validation lỗi  | Invalid       | Giả định hợp lý — CẦN XÁC NHẬN |
| EC6 | password         | Password rỗng hoặc null                                                                 | Trường bắt buộc bị bỏ trống — validation lỗi  | Invalid       | Giả định hợp lý — CẦN XÁC NHẬN |


### 2.2 EC cho logic khóa tài khoản (Account Lockout)


| EC   | Field   | Điều kiện                                                    | Mô tả lớp                                    | Valid/Invalid            | Độ tin cậy |
| ---- | ------- | ------------------------------------------------------------ | -------------------------------------------- | ------------------------ | ---------- |
| EC7  | Lockout | Lần sai thứ 1 (bộ đếm = 1) — chưa bị khóa                    | Không khóa; cho phép thử tiếp                | N/A (hành vi trung gian) | Từ spec    |
| EC8  | Lockout | Lần sai thứ 2 (bộ đếm = 2) — chưa bị khóa                    | Không khóa; cho phép thử tiếp                | N/A (hành vi trung gian) | Từ spec    |
| EC9  | Lockout | Lần sai thứ 3 (bộ đếm = 3) — ngưỡng khóa                     | Bị tạm khóa 30 giây                          | N/A (hành vi trung gian) | Từ spec    |
| EC10 | Lockout | Lần sai thứ 4 (bộ đếm = 4) — vẫn trong thời gian khóa        | Đang bị khóa — từ chối đăng nhập             | N/A (hành vi trung gian) | Từ spec    |
| EC11 | Lockout | Đăng nhập đúng SAU khi khóa hết hạn (sau ≥ 30 giây)          | Khóa hết hạn — cho phép đăng nhập thành công | N/A (hành vi trung gian) | Từ spec    |
| EC12 | Lockout | Đăng nhập đúng ngay TRƯỚC khi đạt ngưỡng khóa (lần 1 hoặc 2) | Reset bộ đếm — không khóa                    | N/A (hành vi trung gian) | Từ spec    |


### 2.3 EC cho giá trị thăm dò (probing) — spec không nêu rõ


| EC   | Field    | Điều kiện                                                          | Mô tả lớp                                    | Valid/Invalid | Độ tin cậy                     |
| ---- | -------- | ------------------------------------------------------------------ | -------------------------------------------- | ------------- | ------------------------------ |
| EC13 | email    | Email đúng format nhưng chứa ký tự đặc biệt XSS (ví dụ `<script>`) | Ký tự đặc biệt / injection attempt           | Invalid       | Giả định hợp lý — CẦN XÁC NHẬN |
| EC14 | password | Password cực dài (1000 ký tự)                                      | Giá trị thăm dò — quan sát hành vi thực tế   | Probing       | Giả định hợp lý — CẦN XÁC NHẬN |
| EC15 | email    | Email cực dài (1000 ký tự)                                         | Giá trị thăm dò — quan sát hành vi thực tế   | Probing       | Giả định hợp lý — CẦN XÁC NHẬN |
| EC16 | lockout  | Số lần sai = 0 (gọi login 0 lần rồi đăng nhập đúng)                | Trạng thái ban đầu — phải cho phép đăng nhập | N/A           | Giả định hợp lý — CẦN XÁC NHẬN |


---

## 3. Test Case (Equivalence Partitioning) — bảng chạy Postman

> **Tài khoản test mặc định** (README.md §1): `test@eshop.com` / `Test1234!`
> **Tài khoản Admin**: `admin@eshop.com` / `Admin123!`

### Nhóm A: Đăng nhập thành công


| STT   | Lớp bao phủ | Input (body/params)                                                   | Expected Output                               | Actual                                                                                                                                                                                                                                                                                                                                                                                                                                            | Status  |
| ----- | ----------- | --------------------------------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| TC-A1 | EC1         | `json\n{\n "email": "test@eshop.com",\n "password": "Test1234!"\n}\n` | `200 OK` — trả về JWT token và thông tin user | *200 - OK* `json "message": "Login successful", "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6InVzZXIiLCJpYXQiOjE3ODMyNDA4MzV9.SLVFAEZqT3GENo2SH9IcL7U-y6c2GXCo7f6TdfE8KRo", "user": { "id": 2, "name": "Test User", "email": "[test@eshop.com](mailto:test@eshop.com)", "password": "Test1234!", "role": "user", "login_attempts": 2, "locked_until": null, "reset_token": null, "shipping_address": null, "phone": null }` | Success |


### Nhóm B: Đăng nhập thất bại — sai thông tin


| STT   | Lớp bao phủ | Input (body/params)                                                          | Expected Output                                                    | Actual                                                        | Status  |
| ----- | ----------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------- | ------- |
| TC-B1 | EC2         | `json\n{\n "email": "test@eshop.com",\n "password": "SaiMatKhau123!"\n}\n`   | `401` — thông báo lỗi chung (không tiết lộ email hay password sai) | *401 - Unauthorized*{ "error": "Invalid email or password" } | Success |
| TC-B2 | EC3         | `json\n{\n "email": "khongtonTai@eshop.com",\n "password": "BatKy123!"\n}\n` | `401` — thông báo lỗi chung (không tiết lộ email không tồn tại)    | *401 - Unauthorized*{ "error": "Invalid email or password" } | Success |


### Nhóm C: Validation input


| STT   | Lớp bao phủ | Input (body/params)                                                             | Expected Output                                                                                  | Actual                                                          | Status                                                   |
| ----- | ----------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------- | -------------------------------------------------------- |
| TC-C1 | EC4         | `json { "email": "khonghople", "password": "Test1234!" }`                       | `[Giả định tester — KHÔNG từ spec] 400 — lỗi validation định dạng email không hợp lệ`            | *401 - Unauthorized* `{ "error": "Invalid email or password" }` | Failure - Spec không nêu rõ; expected là giả định tester |
| TC-C2 | EC4         | `json { "email": "co@ky-tu-dac-biet-!#$%@eshop.com", "password": "Test1234!" }` | `[Giả định tester — KHÔNG từ spec] 400 hoặc 200 — tùy hệ thống xử lý ký tự đặc biệt trong email` | *401 - Unauthorized* `{ "error": "Invalid email or password" }` | Failure - Spec không nêu rõ; expected là giả định tester |
| TC-C3 | EC5         | `json { "email": "", "password": "Test1234!" }`                                 | `[Giả định tester — KHÔNG từ spec] 400 — email là trường bắt buộc, không được rỗng`              | *401 - Unauthorized* `{ "error": "Invalid email or password" }` | Failure - Spec không nêu rõ; expected là giả định tester |
| TC-C4 | EC6         | `json { "email": "test@eshop.com", "password": "" }`                            | `[Giả định tester — KHÔNG từ spec] 400 — password là trường bắt buộc, không được rỗng`           | *401 - Unauthorized* `{ "error": "Invalid email or password" }` | Failure - Spec không nêu rõ; expected là giả định tester |


### Nhóm D: Khóa tài khoản (Account Lockout)

> **Lưu ý:** Mỗi test case trong nhóm D yêu cầu chạy TUẦN TỰ. Phải reset/trì hoãn giữa các lần gọi để quan sát bộ đếm. Nếu hệ thống có cơ chế reset bộ đếm khi đăng nhập đúng, mỗi test case phải bắt đầu từ trạng thái sạch (đăng nhập đúng trước rồi thử sai).


| STT   | Lớp bao phủ | Input (body/params)                                        | Mô tả bước                                                                               | Expected Output                                                                   | Actual                                                                                                                                          | Status                                                                                                            |
| ----- | ----------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| TC-D1 | EC7         | Lần sai thứ **1** — `POST /api/login` với password sai     | Sau khi đăng nhập đúng (reset), gọi login với `password: "SaiLan1!"`                     | `401` — tăng bộ đếm lên 1, chưa khóa                                              | *401 - Unauthorized* `{ "error": "Invalid email or password" }`                                                                                 | Success                                                                                                           |
| TC-D2 | EC8         | Lần sai thứ **2** — `POST /api/login` với password sai     | Gọi login với `password: "SaiLan2!"` (cùng email)                                        | `401` — tăng bộ đếm lên 2, chưa khóa                                              | *403 - Forbidden* `{ "error": "Tài khoản đã bị khóa. Vui lòng thử lại sau." }`                                                                  | Failure - Đã bị khóa ngay từ lần sai thứ 2 (vi phạm spec yêu cầu ≥3 lần). Liên quan BUG-002.                      |
| TC-D3 | EC9         | Lần sai thứ **3** — `POST /api/login` với password sai     | Gọi login với `password: "SaiLan3!"` (cùng email)                                        | `423`/`429` — bị khóa tạm 30 giây, thông báo phù hợp                              | *403 - Forbidden* `{ "error": "Tài khoản đã bị khóa. Vui lòng thử lại sau." }`                                                                  | Success (vì đã bị khóa từ lần 2, đến lần 3 vẫn khóa). Lưu ý: HTTP code thực tế là `403`, không phải `423`/`429`.  |
| TC-D4 | EC10        | Tiếp tục thử khi đang bị khóa                              | Gọi login với `password: "SaiLan4!"` ngay sau TC-D3 (chưa đủ 30 giây)                    | `423`/`429` — tài khoản đang bị khóa, thông báo còn bao lâu hoặc hết khóa khi nào | *403 - Forbidden* `{ "error": "Tài khoản đã bị khóa. Vui lòng thử lại sau." }`                                                                  | Success — hành vi từ chối khi đang khóa đúng. Liên quan BUG-003 về thời gian khóa thực tế.                        |
| TC-D5 | EC12        | Đăng nhập **đúng** sau đúng **1 lần sai**                  | Reset: đăng nhập đúng sau 1 lần sai, nhập thêm một lần sai mật khẩu để bộ đếm reset về 0 | `200` — bộ đếm reset về 0, cho phép đăng nhập. Sau đó `401` nếu nhập sai lại.     | Login đúng: *200 - OK* (response user có `login_attempts: 4`). Sau đó nhập sai: *401 - Unauthorized* `{ "error": "Invalid email or password" }` | Failure (partial) - `login_attempts` quan sát được = 4 (không reset về 0 sau login đúng). Liên quan BUG-002.      |
| TC-D6 | EC12        | Đăng nhập **đúng** sau đúng **2 lần sai**                  | Reset: đăng nhập đúng sau 2 lần sai, nhập thêm một lần sai mật khẩu để bộ đếm reset về 0 | `200` — bộ đếm reset về 0, cho phép đăng nhập. Sau đó `401` nếu nhập sai lại.     | Login đúng: *200 - OK* (response user có `login_attempts: 4`). Sau đó nhập sai: *401 - Unauthorized* `{ "error": "Invalid email or password" }` | Failure (partial) - `login_attempts` = 4 (không reset). Liên quan BUG-002.                                        |
| TC-D7 | EC11        | Hết thời gian khóa, đăng nhập **đúng**                     | Đợi ≥ 30 giây sau TC-D3, gọi login với `password: "Test1234!"`                           | `200` — hết thời gian khóa, cho phép đăng nhập                                    | *200 - OK* (response user có `login_attempts: 4`)                                                                                               | Success về xác thực; Failure về bộ đếm — `login_attempts` vẫn = 4 (không reset). Liên quan BUG-002.               |
| TC-D8 | EC11        | Hết thời gian khóa, đăng nhập **sai**                      | Đợi ≥ 30 giây sau TC-D3, gọi login với `password: "SaiSauKhiHetKhoa!"`                   | `401` — hết khóa nhưng sai password → bộ đếm bắt đầu lại từ 1                     | *401 - Unauthorized* `{ "error": "Invalid email or password" }`                                                                                 | Success                                                                                                           |
| TC-D9 | EC8 + EC11  | Re-test: hết khóa → sai lần 1 → sai lần 2 → **đúng lần 3** | Đợi hết thời gian khóa, nhập sai 2 lần liên tiếp, sau đó nhập đúng ở lần thứ 3           | `200` — cho phép đăng nhập (mới chỉ sai 2 lần, chưa đạt ngưỡng 3 theo spec)       | *403 - Forbidden* `{ "error": "Tài khoản đã bị khóa. Vui lòng thử lại sau." }`                                                                  | Failure - Xác nhận khóa xảy ra ở **lần sai thứ 2** thay vì thứ 3; đúng ở lần 3 vẫn bị từ chối. Liên quan BUG-002. |


---

## 4. Boundary Value Analysis — bảng chạy Postman

### 4.1 Biên cho ngưỡng khóa (theo spec: "từ 3 lần trở lên liên tiếp")

> **Trích nguyên văn spec (README.md §2, FR-02):** "Nếu đăng nhập sai từ **3 lần trở lên** liên tiếp, tài khoản bị tạm khóa 30 giây."

**Phân tích biên:**

- LB (Lower Boundary) = 3 lần sai liên tiếp → **bắt đầu khóa**
- Vì spec nói "từ 3 lần trở lên", biên dưới = 3
- Không có biên trên cố định — cần test 3 và 3+1 (tức 4)

**Biên cho thời gian khóa:**

- LB = 30 giây (thời gian khóa)
- Cần test: 30-1 (29s), 30, 30+1 (31s)


| STT   | Điểm biên        | Input (body/params)                      | Mô tả bước                                                      | Expected Output                                      | Actual                                                                     | Status                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----- | ---------------- | ---------------------------------------- | --------------------------------------------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BV-D1 | LB-1 (2 lần sai) | Lần sai thứ **2**                        | Gọi login sai 2 lần liên tiếp (không đăng nhập đúng giữa chừng) | `401` — chưa bị khóa, bộ đếm = 2                     | 401 - Unauthorized{ "error": "Invalid email or password" }                | Bugs (Cần phân tích)- Phát hiện bugs trong quá trình thử test lần 2. Ở TCD1-TCD2-TCD3: Cơ chế khóa này được thực hiện ngay sau khi hết thời gian khóa và nó trả về kết quả là bị khóa ở lần thử thứ 2Ở BV-D1: Cơ chế khóa được thực hiện ngay sau khi thực hiện khởi động server và ngay sau khi chạy và đăng nhập đúng trước thì kết quả trả về chỉ báo lỗi ở lần thử thứ 2 chứ không trả về message khóaCác test case được thực hiện thông qua postman |
| BV-D2 | LB (3 lần sai)   | Lần sai thứ **3**                        | Gọi login sai 3 lần liên tiếp                                   | `423`/`429` — **bị khóa 30 giây**, thông báo phù hợp | 403 - Forbidden{ "error": "Tài khoản đã bị khóa. Vui lòng thử lại sau." } | Bugs (cần phân tích)- Nếu đã đăng nhập thành công và bắt đầu test sai 3 lần liền tiếp thì sẽ quá ở lần request t3. Nếu đợi hết thời gian lock thì khi test sai sẽ khóa ở lần request t2                                                                                                                                                                                                                                                                       |
| BV-D3 | LB+1 (4 lần sai) | Lần sai thứ **4** — trong thời gian khóa | Gọi login sai lần 4 ngay sau khi bị khóa (< 30 giây)            | `423`/`429` — vẫn đang bị khóa                       | 403 - Forbidden{ "error": "Tài khoản đã bị khóa. Vui lòng thử lại sau." } | Success                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| BV-T1 | LB-1 (29 giây)   | Thử đăng nhập lại sau **29 giây**        | Đợi 29 giây sau khi bị khóa, gọi login đúng                     | `423`/`429` — chưa hết thời gian khóa                | 403 - Forbidden{ "error": "Tài khoản đã bị khóa. Vui lòng thử lại sau." } | Success                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| BV-T2 | LB (30 giây)     | Thử đăng nhập lại sau **30 giây**        | Đợi đúng 30 giây, gọi login đúng                                | `200` — hết thời gian khóa, cho phép đăng nhập       | 403 - Forbidden{ "error": "Tài khoản đã bị khóa. Vui lòng thử lại sau." } | Failure - Hết thời gian khóa nhưng chưa cho đăng nhập, phải đợi thêm một khoảng thời gian dài hơn 30 giây                                                                                                                                                                                                                                                                                                                                                     |
| BV-T3 | LB+1 (31 giây)   | Thử đăng nhập lại sau **31 giây**        | Đợi 31 giây, gọi login đúng                                     | `200` — hết thời gian khóa, cho phép đăng nhập       | 403 - Forbidden{ "error": "Tài khoản đã bị khóa. Vui lòng thử lại sau." } | Failure - Hết thời gian khóa nhưng chưa cho đăng nhập, phải đợi thêm một khoảng thời gian dài hơn 31 giây                                                                                                                                                                                                                                                                                                                                                     |


### 4.2 Biên cho các trường input (giá trị thăm dò — spec không nêu con số cụ thể)


| STT   | Giá trị thăm dò                     | Input                                                                                      | Expected Output                                                  | Actual                                                      | Status                                         |
| ----- | ----------------------------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- | ----------------------------------------------------------- | ---------------------------------------------- |
| BV-P1 | Chuỗi email cực dài (1000 ký tự)    | `json\n{\n "email": "a...a@eshop.com (1000 ký tự)",\n "password": "Test1234!"\n}\n`        | Không xác định trước — dùng để thăm dò hành vi thực tế           | 401 - Unauthorized{ "error": "Invalid email or password" } | Success - server có thể không xử lý vấn đề này |
| BV-P2 | Chuỗi password cực dài (1000 ký tự) | `json\n{\n "email": "test@eshop.com",\n "password": "A...a! (1000 ký tự)"\n}\n`            | Không xác định trước — dùng để thăm dò hành vi thực tế           | 401 - Unauthorized{ "error": "Invalid email or password" } | Success - server có thể không xử lý vấn đề này |
| BV-P3 | Giá trị NULL / không truyền trường  | `json\n{}\n`                                                                               | Không xác định trước — dùng để thăm dò hành vi thực tế           | 401 - Unauthorized{ "error": "Invalid email or password" } | Success - server có thể không xử lý vấn đề này |
| BV-P4 | Ký tự XSS trong email               | `json\n{\n "email": "<script>alert(1)</script>@eshop.com",\n "password": "Test1234!"\n}\n` | Không xác định trước — dùng để thăm dò hành vi thực tế (bảo mật) | 401 - Unauthorized{ "error": "Invalid email or password" } | Success - server có thể không xử lý vấn đề này |
| BV-P5 | Số âm / chuỗi số trong trường email | `json\n{\n "email": "-1",\n "password": "Test1234!"\n}\n`                                  | Không xác định trước — dùng để thăm dò hành vi thực tế           | 401 - Unauthorized{ "error": "Invalid email or password" } | Success - server có thể không xử lý vấn đề này |
| BV-P6 | Whitespace-only email               | `json\n{\n "email": " ",\n "password": "Test1234!"\n}\n`                                   | Không xác định trước — dùng để thăm dò hành vi thực tế           | 401 - Unauthorized{ "error": "Invalid email or password" } | Success - server có thể không xử lý vấn đề này |


---

## 5. Gap Analysis

### 5.1 Ràng buộc không xác định được vì spec thiếu


| #   | Ràng buộc/EC không xác định được                                                                   | Vì sao                                                              | Cách xử lý                                                               |
| --- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| G1  | Sau khi hết thời gian khóa, bộ đếm có tự reset về 0 hay không?                                     | Spec không nói rõ cơ chế reset bộ đếm sau khi khóa                  | Giá trị thăm dò: TC-D7, TC-D8, BV-T2 đã thiết kế để xác nhận hành vi này |
| G2  | Nếu đăng nhập đúng sau 1 hoặc 2 lần sai (trước khi bị khóa), bộ đếm có reset về 0 không?           | Spec chỉ nói bộ đếm tăng khi sai, không nói rõ khi nào reset        | Giá trị thăm dò: TC-D5, TC-D6 đã thiết kế để xác nhận                    |
| G3  | Khi đang bị khóa, nếu gọi login với email khác (không phải email bị khóa), hệ thống xử lý thế nào? | Spec không nói rõ phạm vi khóa (per-account hay per-IP)             | Cần hỏi business hoặc giá trị thăm dò bổ sung                            |
| G4  | Trong thời gian khóa, có giới hạn số lần thử hay không? Hay cứ thử mãi vẫn bị từ chối?             | Spec chỉ nói "thông báo phù hợp", không nói rõ retry limit          | Giá trị thăm dò: TC-D4 đã test                                           |
| G5  | Mã HTTP trả về khi bị khóa là gì? (`423 Locked`, `429 Too Many Requests`, hoặc `401`)?             | Spec không chỉ rõ HTTP status code, chỉ nói "thông báo lỗi phù hợp" | TC-D3, TC-D4, BV-D3 sẽ xác nhận qua thực tế                              |
| G6  | Bộ đếm có bị reset khi server restart không?                                                       | Không thể quan sát từ black-box                                     | Không test được từ bên ngoài                                             |
| G7  | Bộ đếm có theo dõi theo IP hay theo email?                                                         | Không thể suy ra từ spec                                            | Giá trị thăm dò — cần test từ nhiều IP khác nhau (nếu có thể)            |


### 5.2 Ràng buộc giả định hợp lý (cần xác nhận với business/QA)


| #   | Giả định                                                                         | Cần xác nhận                                          |
| --- | -------------------------------------------------------------------------------- | ----------------------------------------------------- |
| GA1 | Email rỗng → trả về `400 Bad Request`                                            | Business xác nhận: required field validation          |
| GA2 | Password rỗng → trả về `400 Bad Request`                                         | Business xác nhận: required field validation          |
| GA3 | Email đúng format nhưng chứa ký tự đặc biệt (XSS) → được chấp nhận hoặc sanitize | Security team xác nhận: SEC-04 yêu cầu escape dữ liệu |
| GA4 | Lockout không reset khi thử với email khác (per-account)                         | Business/Dev xác nhận                                 |


---

## 6. Phân tích kết quả Postman

> **Tổng hợp kết quả sau khi người dùng điền Actual/Status:**
>
> - ✅ **11 test PASS** (TC-A1, TC-B1, TC-B2, TC-D1, TC-D3, TC-D4, TC-D8, BV-D3, BV-T1, BV-P1–P6)
> - ⚠️ **3 test PASS một phần** (TC-D5, TC-D6, TC-D7 — đăng nhập đúng nhưng `login_attempts` quan sát được = 4, không reset)
> - ❌ **6 test FAIL** (TC-C1–C4, TC-D2, TC-D9, BV-T2–T3)
> - ⚠️ **1 test cần xác nhận** (BV-D1 — hành vi không nhất quán giữa hai lần chạy)
>
> **Lưu ý phạm vi black-box:** Báo cáo KHÔNG khẳng định nguyên nhân kỹ thuật bên trong server (ví dụ "code cộng +2", "DB transaction thiếu reset"...). Các giả thuyết trong Bảng 6 chỉ là **suy luận hành vi động** dựa trên nhiều lần quan sát qua API.


| #   | Test case liên quan        | Hành vi quan sát được                                                                   | Kỳ vọng theo spec                                                               | Giả thuyết (không suy đoán implementation)                                                                                                                                                       | Cần test thêm                                                                               |
| --- | -------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| 1   | TC-D1, TC-D2, TC-D3        | TC-D1 (lần 1): ✅ 401. TC-D2 (lần 2): ❌ 403 khóa thay vì 401. TC-D3 (lần 3): ❌ 403 khóa  | Bộ đếm tăng đúng 1 đơn vị; khóa ở lần 3                                         | Bộ đếm tích lũy từ lần test trước, không reset khi login đúng → khi đã có 2 sai từ trước, lần sai thứ 2 trong test mới trở thành lần 3 thực tế                                                   | Register tài khoản mới, test chuỗi 1→2→3 từ đầu                                             |
| 2   | BV-T2, BV-T3, TC-D7        | Sau ≥30 giây: vẫn trả 403 → khóa kéo dài >31 giây                                       | Khóa đúng 30 giây, hết khóa → cho đăng nhập                                     | Thời gian khóa thực tế lớn hơn spec (có thể 60s hoặc tính từ thời điểm khác)                                                                                                                     | Test lại sau 60s, 90s, 120s để tìm thời gian khóa thực                                      |
| 3   | TC-D5, TC-D6, TC-D7, TC-A1 | Sau login đúng: `login_attempts` quan sát được = 4 (cao bất thường), không reset về 0/1 | Spec không nêu rõ giá trị sau login đúng; expected = 0 hoặc 1 (giả định tester) | Bộ đếm `login_attempts` **không reset** sau khi login đúng, đồng thời có vẻ **không tăng đúng +1** mỗi lần sai (giá trị tích lũy cao). Đây là quan sát hành vi, không khẳng định implementation. | Register tài khoản hoàn toàn mới, test vòng login đúng → sai 1 → đúng lại → kiểm tra bộ đếm |
| 4   | TC-B1, TC-B2               | Cả hai đều trả `{"error": "Invalid email or password"}` với 401                         | Thông báo lỗi không tiết lộ email hay password sai                              | ✅ Khớp với spec — thông báo chung, không phân biệt                                                                                                                                               | Không cần                                                                                   |
| 5   | TC-C1, TC-C2, TC-C3, TC-C4 | Tất cả trả `401` với `{"error": "Invalid email or password"}` thay vì `400`             | `[Giả định tester — KHÔNG từ spec] Validation error → 400 Bad Request`          | Server xử lý validation cùng tầng authentication, không reject invalid input ở tầng request validation trước khi truy vấn DB                                                                     | Test với `null`, trường thiếu hoàn toàn                                                     |
| 6   | BV-P1...BV-P6              | Tất cả trả 401 — không crash, không XSS, không overflow                                 | Không xác định trước — giá trị thăm dò                                          | ✅ Khớp kỳ vọng thăm dò — không có crash                                                                                                                                                          | Không cần                                                                                   |


---

## 7. Tổng hợp test case sau khi chạy Postman


| Nhóm                         | Số lượng test case | Trạng thái sau Postman                               |
| ---------------------------- | ------------------ | ---------------------------------------------------- |
| Nhóm A: Đăng nhập thành công | 1                  | ✅ PASS (1/1)                                         |
| Nhóm B: Đăng nhập thất bại   | 2                  | ✅ PASS (2/2)                                         |
| Nhóm C: Validation           | 4                  | ❌ FAIL (0/4)                                         |
| Nhóm D: Account Lockout (EC) | 9                  | ⚠️ 6/9 — TC-D2 + TC-D9 FAIL                          |
| Boundary Values — Lockout    | 6                  | ⚠️ 4/6 — BV-T2/T3 FAIL                               |
| Boundary Values — Probing    | 6                  | ✅ PASS (6/6)                                         |
| **Tổng cộng**                | **28**             | ✅ 12 pass, ⚠️ 3 partial, ❌ 6 fail, ⚠️ 1 cần xác nhận |


## 8. Tổng hợp Bug phát hiện (GitHub Issues)


| Bug ID        | Mô tả                                                                             | Severity | File                                                           |
| ------------- | --------------------------------------------------------------------------------- | -------- | -------------------------------------------------------------- |
| FR-02-BUG-001 | API trả 401 cho email/password rỗng/sai định dạng thay vì 400 *(giả định tester)* | Medium   | testing/FR-02/issues/FR-02-BUG-001-validation-returns-401.md   |
| FR-02-BUG-002 | Tài khoản bị khóa ở lần sai thứ 2 thay vì thứ 3 + `login_attempts` bất thường     | High     | testing/FR-02/issues/FR-02-BUG-002-lockout-at-2-fails.md       |
| FR-02-BUG-003 | Thời gian khóa kéo dài hơn 30 giây theo spec                                      | High     | testing/FR-02/issues/FR-02-BUG-003-lockout-time-exceeds-30s.md |


### Bug phát hiện từ Functional Testing (UI) — chi tiết trong 2 file issue: BUG-005 và BUG-006


| Bug ID        | Mô tả                                                             | Severity | File                                                                |
| ------------- | ----------------------------------------------------------------- | -------- | ------------------------------------------------------------------- |
| FR-02-BUG-005 | UI không hiển thị số lần thử còn lại trước khi khóa tài khoản     | Medium   | testing/FR-02/issues/FR-02-BUG-005-no-remaining-attempts-shown.md   |
| FR-02-BUG-006 | UI không hiển thị thông báo "tài khoản đã bị khóa" khi đạt ngưỡng | High     | testing/FR-02/issues/FR-02-BUG-006-no-lockout-notification-on-ui.md |


> **Ghi chú gộp issue:** BUG-002 trong phiên bản này đã gộp nội dung của BUG-004 trước đó
> (mô tả `login_attempts` không reset + không tăng đúng +1), vì hai quan sát này
> cùng mô tả một hành vi bất thường của bộ đếm. BUG-001 giữ riêng vì expected của nó
> là giả định tester, không phải từ spec — không nên gộp chung với bug vi phạm spec.

---

## 9. Functional Testing (UI) — khóa tài khoản

> **Phạm vi:** Bổ sung cho các test case API ở các nhóm A–D và BVA. Phương pháp vẫn là
> **black-box thuần** — quan sát thao tác và phản hồi hiển thị trên UI, KHÔNG tham chiếu
> source code React/component.
>
> **Giới hạn test:** Phiên này chỉ test khía cạnh **thông báo số lần thử còn lại / đếm ngược
> khi khóa** trên UI. Các khía cạnh khác (validation form, vị trí thông báo lỗi, điều hướng,
> khả năng truy cập...) chưa được test trong phiên này, không nằm trong phạm vi BUG-005.

### 9.1 Test case — khóa tài khoản qua UI & thông báo số lần thử


| STT      | Lớp bao phủ      | Hành động                                       | Expected (giả định tester — KHÔNG từ spec cứng)                                                                          | Actual (quan sát được)                                                                                                             | Status |
| -------- | ---------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- | ------ |
| TC-UI-D1 | Sai lần 1        | Nhập đúng email + sai password ở lần 1          | Thông báo lỗi + hiển thị "Bạn còn 2 lần thử trước khi tài khoản bị khóa" (giả định UX)                                   | Chỉ hiển thị "Email hoặc mật khẩu không chính xác" — **không thấy số lần còn lại**                                                 | ❌      |
| TC-UI-D2 | Sai lần 2        | Tiếp tục nhập sai password ở lần 2              | Cùng thông báo lỗi + hiển thị "Bạn còn 1 lần thử" (giả định UX)                                                          | Cùng thông báo như lần 1 — **không có cảnh báo sắp khóa**                                                                          | ❌      |
| TC-UI-D3 | Sai lần 3 (khóa) | Tiếp tục nhập sai password ở lần 3 (đạt ngưỡng) | Thông báo "Tài khoản đã bị khóa" + (khuyến nghị) đồng hồ đếm ngược hoặc "Có thể thử lại sau khoảng X giây" (giả định UX) | "Đăng nhập thất bại. Vui lòng kiểm tra lại." — **thông báo giống sai mật khẩu thông thường, không thông báo tài khoản đã bị khóa** | ❌      |


**Quan sát chính:** 3 test case đều FAIL, nhưng có **2 nguyên nhân UX khác nhau** cần tách thành 2 bug riêng:

- **BUG-006 (quan sát từ TC-UI-D3):** Khi đạt ngưỡng khóa, UI vẫn hiển thị thông báo
chung "Đăng nhập thất bại. Vui lòng kiểm tra lại" — **không có thông báo riêng
nào nói rằng tài khoản đã bị khóa**. Người dùng không biết mình bị khóa, không biết
phải đợi, dễ tiếp tục thử và bị bối rối. Xem chi tiết tại
`testing/FR-02/issues/FR-02-BUG-006-no-lockout-notification-on-ui.md`.
- **BUG-005 (quan sát từ TC-UI-D1, D2):** UI không hiển thị số lần thử còn lại trước
khi bị khóa và không có đếm ngược / thời gian chờ khi bị khóa. Đây là lỗi UX khác,
đã có issue riêng — xem chi tiết tại
`testing/FR-02/issues/FR-02-BUG-005-no-remaining-attempts-shown.md`.

**Tổng hợp:**


| Nhóm                                   | Test case | PASS | FAIL |
| -------------------------------------- | --------- | ---- | ---- |
| D. Khóa tài khoản & số lần thử còn lại | 3         | 0    | 3    |


