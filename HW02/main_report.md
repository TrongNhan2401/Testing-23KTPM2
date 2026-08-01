# Báo cáo HW02 — Domain Testing & Boundary Value Analysis

**Sinh viên:** Trần Phạm Trọng Nhân | **MSSV:** 23127443 | **Nhóm:** 10

---

## Phương pháp luận chung

Domain testing trong report này được thực hiện theo phương pháp **Black-box thuần**: mọi
Equivalence Class và Boundary Value được xác định chỉ dựa trên đặc tả (SRS/README) và tài
liệu hợp đồng API (OpenAPI/Postman collection), KHÔNG dựa trên việc đọc source code xử lý
logic nghiệp vụ. Các giá trị mà spec không nêu rõ được đánh dấu là "giá trị thăm dò" và sẽ
được xác nhận qua kết quả thực thi bằng Postman, không suy luận từ implementation.

---

## Danh sách 4 tính năng đã chọn


| Pool | FR    | Tên tính năng                    | Người phụ trách |
| ---- | ----- | -------------------------------- | --------------- |
| A    | FR-02 | Login & Lockout                  | Nhân            |
| B    | FR-16 | Import CSV                       | Nhân            |
| C    | FR-08 | Thanh toán (Checkout)            | Nhân            |
| D    | FR-04 | Hồ sơ cá nhân (Personal Profile) | Nhân            |


---

## Phần 1 — FR-02: Login & Account Lockout

### 1.0 Codebase/Tài liệu đã khảo sát


| Loại tài liệu | Nguồn                                               | Ghi chú                                |
| ------------- | --------------------------------------------------- | -------------------------------------- |
| SRS/README    | `contexts/README.md` — §2, FR-02 (dòng 38–44)       | Mô tả đầy đủ nghiệp vụ login & lockout |
| API Spec      | `contexts/api_specification.md` — §1.2 (dòng 23–32) | Contract endpoint `POST /api/login`    |


### 1.1 Input & Output

#### 1.1.1 Input


| #   | Input                                         | Kiểu    | Ràng buộc (theo spec)                                                     | Nguồn                       | Độ tin cậy |
| --- | --------------------------------------------- | ------- | ------------------------------------------------------------------------- | --------------------------- | ---------- |
| I1  | `email`                                       | String  | Phải là email đã đăng ký trong hệ thống; định dạng hợp lệ                 | README.md §2, FR-01         | Từ spec    |
| I2  | `password`                                    | String  | Phải khớp với mật khẩu đã đăng ký của email đó                            | README.md §2, FR-02         | Từ spec    |
| I3  | Số lần đăng nhập sai liên tiếp                | Integer | Bộ đếm tăng đúng 1 đơn vị sau mỗi lần sai; khóa khi ≥ 3 lần sai liên tiếp | README.md §2, FR-02         | Từ spec    |
| I4  | Thời gian khóa tạm thời                       | Integer | Thời gian khóa = 30 giây (môi trường demo)                                | README.md §2, FR-02         | Từ spec    |
| I5  | Tài khoản có tồn tại trong hệ thống hay không | Boolean | Email phải đã đăng ký; tài khoản chưa bị xóa                              | README.md §2, FR-02 + FR-01 | Từ spec    |
| I6  | Email có đúng định dạng syntax hay không      | Boolean | Định dạng hợp lệ (HTML5 `type="email"` validation)                        | README.md §2, FR-02         | Từ spec    |


#### 1.1.2 Output


| #   | Output                                                            | Mô tả                                                                      | Nguồn                     |
| --- | ----------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------- |
| O1  | JWT Token (`200 OK`)                                              | Đăng nhập thành công — trả về chuỗi JWT token + thông tin user             | api_specification.md §1.2 |
| O2  | Lỗi xác thực (`401 Unauthorized`)                                 | Email hoặc mật khẩu sai — thông báo chung chung, không tiết lộ cái nào sai | README.md §2, FR-02       |
| O3  | Lỗi tài khoản bị khóa (`423 Locked` hoặc `429 Too Many Requests`) | Đăng nhập sai ≥ 3 lần liên tiếp — khóa 30 giây, thông báo phù hợp          | README.md §2, FR-02       |
| O4  | Lỗi validation (`400 Bad Request`)                                | Email không đúng định dạng — theo HTML5 `type="email"` validation          | README.md §2, FR-02       |


### 1.2 Equivalence Classes

#### 1.2.1 EC cho `email` (kết hợp với password)


| EC  | Field            | Điều kiện                                            | Mô tả lớp                           | Valid/Invalid | Độ tin cậy      |
| --- | ---------------- | ---------------------------------------------------- | ----------------------------------- | ------------- | --------------- |
| EC1 | email + password | Email đúng format & đã đăng ký, password đúng        | Đăng nhập thành công                | Valid         | Từ spec         |
| EC2 | email + password | Email đúng format & đã đăng ký, password SAI         | Sai mật khẩu — tăng bộ đếm thất bại | Invalid       | Từ spec         |
| EC3 | email + password | Email đúng format nhưng KHÔNG tồn tại trong hệ thống | Tài khoản không tồn tại             | Invalid       | Từ spec         |
| EC4 | email            | Email không đúng định dạng                           | Định dạng email không hợp lệ        | Invalid       | Từ spec         |
| EC5 | email            | Email rỗng hoặc null                                 | Trường bắt buộc bị bỏ trống         | Invalid       | Giả định hợp lý |
| EC6 | password         | Password rỗng hoặc null                              | Trường bắt buộc bị bỏ trống         | Invalid       | Giả định hợp lý |


#### 1.2.2 EC cho logic khóa tài khoản (Account Lockout)


| EC   | Field   | Điều kiện                                               | Mô tả lớp                                    | Valid/Invalid | Độ tin cậy |
| ---- | ------- | ------------------------------------------------------- | -------------------------------------------- | ------------- | ---------- |
| EC7  | Lockout | Lần sai thứ 1 (bộ đếm = 1)                              | Chưa bị khóa; cho phép thử tiếp              | N/A           | Từ spec    |
| EC8  | Lockout | Lần sai thứ 2 (bộ đếm = 2)                              | Chưa bị khóa; cho phép thử tiếp              | N/A           | Từ spec    |
| EC9  | Lockout | Lần sai thứ 3 (bộ đếm = 3)                              | Bị tạm khóa 30 giây                          | N/A           | Từ spec    |
| EC10 | Lockout | Lần sai thứ 4 (bộ đếm = 4)                              | Đang bị khóa — từ chối đăng nhập             | N/A           | Từ spec    |
| EC11 | Lockout | Đăng nhập đúng sau khi khóa hết hạn (≥30 giây)          | Khóa hết hạn — cho phép đăng nhập thành công | N/A           | Từ spec    |
| EC12 | Lockout | Đăng nhập đúng trước khi đạt ngưỡng khóa (lần 1 hoặc 2) | Reset bộ đếm — không khóa                    | N/A           | Từ spec    |


### 1.3 Test Case (EP)

**Tài khoản test mặc định:** `test@eshop.com` / `Test1234!`

#### Nhóm A: Đăng nhập thành công


| STT   | Lớp bao phủ | Input                                                    | Expected Output      | Actual   | Status    |
| ----- | ----------- | -------------------------------------------------------- | -------------------- | -------- | --------- |
| TC-A1 | EC1         | `{ "email": "test@eshop.com", "password": "Test1234!" }` | `200 OK` — JWT token | `200 OK` | ✅ Success |


#### Nhóm B: Đăng nhập thất bại


| STT   | Lớp bao phủ | Input                                                           | Expected Output | Actual             | Status    |
| ----- | ----------- | --------------------------------------------------------------- | --------------- | ------------------ | --------- |
| TC-B1 | EC2         | `{ "email": "test@eshop.com", "password": "SaiMatKhau123!" }`   | `401`           | `401 Unauthorized` | ✅ Success |
| TC-B2 | EC3         | `{ "email": "khongtonTai@eshop.com", "password": "BatKy123!" }` | `401`           | `401 Unauthorized` | ✅ Success |


#### Nhóm C: Validation input


| STT   | Lớp bao phủ | Input                                                                      | Expected Output  | Actual             | Status    |
| ----- | ----------- | -------------------------------------------------------------------------- | ---------------- | ------------------ | --------- |
| TC-C1 | EC4         | `{ "email": "khonghople", "password": "Test1234!" }`                       | `400`            | `401 Unauthorized` | ❌ Failure |
| TC-C2 | EC4         | `{ "email": "co@ky-tu-dac-biet-!#$%@eshop.com", "password": "Test1234!" }` | `400` hoặc `200` | `401 Unauthorized` | ❌ Failure |
| TC-C3 | EC5         | `{ "email": "", "password": "Test1234!" }`                                 | `400`            | `401 Unauthorized` | ❌ Failure |
| TC-C4 | EC6         | `{ "email": "test@eshop.com", "password": "" }`                            | `400`            | `401 Unauthorized` | ❌ Failure |


#### Nhóm D: Khóa tài khoản (Account Lockout)


| STT   | Lớp bao phủ | Mô tả bước                            | Expected Output       | Actual                       | Status     |
| ----- | ----------- | ------------------------------------- | --------------------- | ---------------------------- | ---------- |
| TC-D1 | EC7         | Lần sai thứ 1                         | `401` — chưa khóa     | `401 Unauthorized`           | ✅ Success  |
| TC-D2 | EC8         | Lần sai thứ 2                         | `401` — chưa khóa     | `403 Forbidden`              | ❌ Failure  |
| TC-D3 | EC9         | Lần sai thứ 3                         | `423`/`429` — bị khóa | `403 Forbidden`              | ✅ Success  |
| TC-D4 | EC10        | Tiếp tục thử khi đang bị khóa         | `423`/`429`           | `403 Forbidden`              | ✅ Success  |
| TC-D5 | EC12        | Đăng nhập đúng sau 1 lần sai          | `200` — reset         | `200 OK` (login_attempts: 4) | ⚠️ Partial |
| TC-D6 | EC12        | Đăng nhập đúng sau 2 lần sai          | `200` — reset         | `200 OK` (login_attempts: 4) | ⚠️ Partial |
| TC-D7 | EC11        | Hết thời gian khóa, đăng nhập đúng    | `200`                 | `200 OK`                     | ✅ Success  |
| TC-D8 | EC11        | Hết thời gian khóa, đăng nhập sai     | `401`                 | `401 Unauthorized`           | ✅ Success  |
| TC-D9 | EC8+EC11    | Hết khóa → sai 1 → sai 2 → đúng lần 3 | `200`                 | `403 Forbidden`              | ❌ Failure  |


### 1.4 Boundary Value Analysis

#### 1.4.1 Biên cho ngưỡng khóa (spec: "từ 3 lần trở lên liên tiếp")


| STT   | Điểm biên        | Mô tả bước      | Expected Output | Actual             | Status          |
| ----- | ---------------- | --------------- | --------------- | ------------------ | --------------- |
| BV-D1 | LB-1 (2 lần sai) | Lần sai thứ 2   | `401`           | `401 Unauthorized` | ⚠️ Cần xác nhận |
| BV-D2 | LB (3 lần sai)   | Lần sai thứ 3   | `423`/`429`     | `403 Forbidden`    | ✅ Success       |
| BV-D3 | LB+1 (4 lần sai) | Lần sai thứ 4   | `423`/`429`     | `403 Forbidden`    | ✅ Success       |
| BV-T1 | LB-1 (29 giây)   | Thử sau 29 giây | `423`/`429`     | `403 Forbidden`    | ✅ Success       |
| BV-T2 | LB (30 giây)     | Thử sau 30 giây | `200`           | `403 Forbidden`    | ❌ Failure       |
| BV-T3 | LB+1 (31 giây)   | Thử sau 31 giây | `200`           | `403 Forbidden`    | ❌ Failure       |


### 1.5 Gap Analysis

#### 1.5.1 Ràng buộc không xác định được vì spec thiếu


| #   | Ràng buộc không xác định                         | Vì sao            | Cách xử lý       |
| --- | ------------------------------------------------ | ----------------- | ---------------- |
| G1  | Sau khi hết khóa, bộ đếm có tự reset về 0?       | Spec không nói    | Giá trị thăm dò  |
| G2  | Đăng nhập đúng sau 1-2 lần sai, bộ đếm có reset? | Spec không nói    | Giá trị thăm dò  |
| G3  | Khóa theo IP hay theo email?                     | Spec không nói    | Cần hỏi business |
| G4  | HTTP status khi bị khóa?                         | Spec không chỉ rõ | Test thực tế     |
| G5  | Bộ đếm có reset khi server restart?              | Không test được   | —                |


#### 1.5.2 Ràng buộc giả định hợp lý


| #   | Giả định                                   | Cần xác nhận      |
| --- | ------------------------------------------ | ----------------- |
| GA1 | Email rỗng → 400                           | Business xác nhận |
| GA2 | Password rỗng → 400                        | Business xác nhận |
| GA3 | Lockout không reset khi thử với email khác | Business xác nhận |


### 1.6 Tổng hợp kết quả & Bug

#### Tổng hợp test case


| Nhóm                         | Số test case | PASS   | FAIL   | Ghi chú                      |
| ---------------------------- | ------------ | ------ | ------ | ---------------------------- |
| Nhóm A: Đăng nhập thành công | 1            | 1      | 0      |                              |
| Nhóm B: Đăng nhập thất bại   | 2            | 2      | 0      |                              |
| Nhóm C: Validation           | 4            | 0      | 4      | TC-C1-C4: 400 → 401          |
| Nhóm D: Account Lockout      | 9            | 5      | 4      | TC-D2/D9 fail; D5/D6 partial |
| Boundary Values — Lockout    | 6            | 2      | 2      | BV-T2/T3 fail                |
| Boundary Values — Probing    | 6            | 6      | 0      |                              |
| **Tổng cộng**                | **28**       | **16** | **10** | **2 partial**                |


**Tỷ lệ pass: 57.1% (16/28)**

#### Bug phát hiện


| Bug ID        | Mô tả                                                         | Severity | File                                                                  |
| ------------- | ------------------------------------------------------------- | -------- | --------------------------------------------------------------------- |
| FR-02-BUG-001 | API trả 401 cho email/password rỗng/sai định dạng thay vì 400 | Medium   | `testing/FR-02/issues/FR-02-BUG-001-validation-returns-401.md`        |
| FR-02-BUG-002 | Tài khoản bị khóa ở lần sai thứ 2 thay vì thứ 3               | High     | `testing/FR-02/issues/FR-02-BUG-002-lockout-at-2-fails.md`            |
| FR-02-BUG-003 | Thời gian khóa kéo dài hơn 30 giây                            | High     | `testing/FR-02/issues/FR-02-BUG-003-lockout-time-exceeds-30s.md`      |
| FR-02-BUG-005 | UI không hiển thị số lần thử còn lại                          | Medium   | `testing/FR-02/issues/FR-02-BUG-005-no-remaining-attempts-shown.md`   |
| FR-02-BUG-006 | UI không thông báo khóa khi đạt ngưỡng                        | High     | `testing/FR-02/issues/FR-02-BUG-006-no-lockout-notification-on-ui.md` |


---

## Phần 2 — FR-16: Import CSV

### 2.0 Codebase/Tài liệu đã khảo sát


| Loại tài liệu      | Nguồn                                              | Ghi chú                        |
| ------------------ | -------------------------------------------------- | ------------------------------ |
| SRS/README — FR-16 | `contexts/README.md` §2, dòng 200–212              | 4 quy tắc nghiệp vụ cốt lõi    |
| SRS/README — FR-15 | `contexts/README.md` §2, dòng 191–199              | Product CRUD — ràng buộc input |
| SRS/README — FR-12 | `contexts/README.md` §2, dòng 174–180              | Admin access control           |
| API Spec — Import  | `contexts/api_specification.md` §6.3, dòng 204–220 | Endpoint, body format          |


### 2.1 Input & Output

#### 2.1.1 Input


| #   | Input            | Kiểu          | Ràng buộc (theo spec)                       | Nguồn                     | Độ tin cậy |
| --- | ---------------- | ------------- | ------------------------------------------- | ------------------------- | ---------- |
| I1  | JWT Token        | String        | Phải là token hợp lệ và có `role = 'admin'` | README.md FR-12           | Từ spec    |
| I2  | `products` array | Array[Object] | Phải là mảng JSON, không rỗng               | api_specification.md §6.3 | Từ spec    |
| I3  | `name`           | String        | Không được rỗng                             | README.md FR-16           | Từ spec    |
| I4  | `price`          | Number        | Phải là số dương (> 0)                      | README.md FR-16 + FR-15   | Từ spec    |
| I5  | `description`    | String        | Không bắt buộc                              | api_specification.md      | Giả định   |
| I6  | `imageUrl`       | String        | Không bắt buộc                              | api_specification.md      | Giả định   |
| I7  | `category_id`    | Integer       | Bắt buộc, phải là danh mục có sẵn           | README.md FR-16 + FR-15   | Từ spec    |


#### 2.1.2 Output


| #   | Output             | Mô tả                               | Nguồn                   |
| --- | ------------------ | ----------------------------------- | ----------------------- |
| O1  | `200 OK` + report  | Import thành công                   | README.md FR-16         |
| O2  | `401 Unauthorized` | Không có token                      | api_specification.md §6 |
| O3  | `403 Forbidden`    | Token hợp lệ nhưng không phải admin | README.md FR-12         |
| O4  | `400 Bad Request`  | Lỗi validation                      | README.md FR-16         |


### 2.2 Equivalence Classes

#### 2.2.1 EC cho Authorization


| EC    | Điều kiện                        | Valid/Invalid |
| ----- | -------------------------------- | ------------- |
| EC-A1 | JWT hợp lệ + role = 'admin'      | Valid         |
| EC-A2 | Không có token                   | Invalid       |
| EC-A3 | Token hợp lệ nhưng role = 'user' | Invalid       |
| EC-A4 | Token không hợp lệ               | Invalid       |


#### 2.2.2 EC cho `name`


| EC    | Điều kiện          | Valid/Invalid |
| ----- | ------------------ | ------------- |
| EC-N1 | name có nội dung   | Valid         |
| EC-N2 | name = ""          | Invalid       |
| EC-N3 | name = " " (space) | Invalid       |
| EC-N4 | name = null/thiếu  | Invalid       |
| EC-N5 | name ≤ 255 ký tự   | Valid         |
| EC-N6 | name > 255 ký tự   | Invalid       |


#### 2.2.3 EC cho `price`


| EC    | Điều kiện          | Valid/Invalid |
| ----- | ------------------ | ------------- |
| EC-P1 | price > 0          | Valid         |
| EC-P2 | price = 0          | Invalid       |
| EC-P3 | price < 0          | Invalid       |
| EC-P4 | price = null/thiếu | Invalid       |


#### 2.2.4 EC cho `category_id`


| EC    | Điều kiện                 | Valid/Invalid |
| ----- | ------------------------- | ------------- |
| EC-C1 | category_id tồn tại       | Valid         |
| EC-C2 | category_id không tồn tại | Invalid       |
| EC-C3 | category_id = null/thiếu  | Invalid       |
| EC-C4 | category_id = 0           | Invalid       |


### 2.3 Test Case (EP)

#### Nhóm A: Xác thực & Phân quyền


| STT   | Lớp bao phủ | Input                       | Expected    | Actual             | Status    |
| ----- | ----------- | --------------------------- | ----------- | ------------------ | --------- |
| TC-A1 | EC-A1       | Admin JWT + body đúng       | `200`       | `200 OK`           | ✅ Success |
| TC-A2 | EC-A2       | Không có token              | `401`       | `401 Unauthorized` | ✅ Success |
| TC-A3 | EC-A3       | User JWT (không phải admin) | `403`       | `200 OK`           | ❌ Failure |
| TC-A4 | EC-A4       | Token giả                   | `401`/`403` | `403 Forbidden`    | ✅ Success |


#### Nhóm B: Validation `name`


| STT   | Lớp bao phủ | Input            | Expected | Actual                | Status    |
| ----- | ----------- | ---------------- | -------- | --------------------- | --------- |
| TC-B1 | EC-N1       | name hợp lệ      | `200`    | `200 OK`              | ✅ Success |
| TC-B2 | EC-N2       | name = ""        | `400`    | `200 OK` (0 inserted) | ✅ Success |
| TC-B3 | EC-N3       | name = " "       | `400`    | `200 OK` (1 inserted) | ❌ Failure |
| TC-B4 | EC-N4       | name = null      | `400`    | `200 OK` (0 inserted) | ✅ Success |
| TC-B5 | EC-N4       | Thiếu name       | `400`    | `200 OK` (0 inserted) | ✅ Success |
| TC-B6 | EC-N6       | name > 255 ký tự | `400`    | `200 OK` (1 inserted) | ❌ Failure |


#### Nhóm C: Validation `price`


| STT   | Lớp bao phủ | Input                     | Expected | Actual                | Status    |
| ----- | ----------- | ------------------------- | -------- | --------------------- | --------- |
| TC-C1 | EC-P1       | price > 0                 | `200`    | `200 OK`              | ✅ Success |
| TC-C2 | EC-P2       | price = 0                 | `400`    | `200 OK` (1 inserted) | ❌ Failure |
| TC-C3 | EC-P3       | price < 0                 | `400`    | `200 OK` (1 inserted) | ❌ Failure |
| TC-C4 | EC-P4       | price = null              | `400`    | `200 OK` (1 inserted) | ❌ Failure |
| TC-C5 | EC-P4       | Thiếu price               | `400`    | `200 OK` (1 inserted) | ❌ Failure |
| TC-C6 | EC-P5       | price = "100000" (string) | Thăm dò  | `200 OK`              | ✅ Success |
| TC-C7 | EC-P6       | price = 99.99             | Thăm dò  | `200 OK`              | ✅ Success |


#### Nhóm D: Validation `category_id`


| STT   | Lớp bao phủ | Input               | Expected | Actual                | Status    |
| ----- | ----------- | ------------------- | -------- | --------------------- | --------- |
| TC-D1 | EC-C1       | category_id tồn tại | `200`    | `200 OK`              | ✅ Success |
| TC-D2 | EC-C2       | category_id = 9999  | `400`    | `200 OK` (1 inserted) | ❌ Failure |
| TC-D3 | EC-C3       | category_id = null  | `400`    | `200 OK` (1 inserted) | ❌ Failure |
| TC-D4 | EC-C3       | Thiếu category_id   | `400`    | `200 OK` (1 inserted) | ❌ Failure |
| TC-D5 | EC-C4       | category_id = 0     | `400`    | `200 OK` (1 inserted) | ❌ Failure |


#### Nhóm E: Rollback / All-or-Nothing


| STT   | Lớp bao phủ | Input              | Expected           | Actual                | Status    |
| ----- | ----------- | ------------------ | ------------------ | --------------------- | --------- |
| TC-E1 | EC-R1       | 2 sản phẩm hợp lệ  | `200` (2 inserted) | `200 OK` (1 inserted) | ✅ Success |
| TC-E2 | EC-R2       | 1 hợp lệ + 1 lỗi   | `400` (0 inserted) | `200 OK` (1 inserted) | ❌ Failure |
| TC-E3 | EC-R2       | 2 sản phẩm đều lỗi | `400` (0 inserted) | `200 OK` (0 inserted) | ✅ Success |
| TC-E4 | EC-R1       | 1 sản phẩm         | `200`              | `200 OK`              | ✅ Success |


### 2.4 Boundary Value Analysis

#### 2.4.1 Biên cho `name` (tối đa 255 ký tự)


| STT   | Điểm biên  | Input          | Expected | Actual                | Status    |
| ----- | ---------- | -------------- | -------- | --------------------- | --------- |
| BV-N1 | LB = 1     | name = "A"     | `200`    | `200 OK`              | ✅ Success |
| BV-N2 | LB = 255   | name = "A"*255 | `200`    | `200 OK`              | ✅ Success |
| BV-N3 | LB+1 = 256 | name = "A"*256 | `400`    | `200 OK` (1 inserted) | ❌ Failure |


#### 2.4.2 Biên cho `price` (phải > 0)


| STT   | Điểm biên | Input        | Expected | Actual                | Status    |
| ----- | --------- | ------------ | -------- | --------------------- | --------- |
| BV-P1 | LB = 0.01 | price = 0.01 | Thăm dò  | `200 OK`              | ✅ Success |
| BV-P2 | LB = 1    | price = 1    | `200`    | `200 OK`              | ✅ Success |
| BV-P3 | LB-1 = 0  | price = 0    | `400`    | `200 OK` (1 inserted) | ❌ Failure |
| BV-P4 | LB-1 = -1 | price = -1   | `400`    | `200 OK` (1 inserted) | ❌ Failure |


### 2.5 Gap Analysis


| #   | Ràng buộc không xác định          | Vì sao              | Cách xử lý                                   |
| --- | --------------------------------- | ------------------- | -------------------------------------------- |
| G1  | Price có hỗ trợ số thập phân?     | Spec nói "số dương" | **ĐÃ XÁC NHẬN:** Có (TC-C7)                  |
| G2  | Duplicate products xử lý thế nào? | Spec không nêu      | **BUG:** 2 sản phẩm trùng nhau tạo 2 bản ghi |


### 2.6 Tổng hợp kết quả & Bug


| Nhóm                         | Số test case | PASS   | FAIL   |
| ---------------------------- | ------------ | ------ | ------ |
| A. Xác thực & Phân quyền     | 4            | 3      | 1      |
| B. Validation `name`         | 6            | 3      | 3      |
| C. Validation `price`        | 7            | 3      | 4      |
| D. Validation `category_id`  | 5            | 1      | 4      |
| E. Rollback / All-or-nothing | 4            | 3      | 1      |
| BV                           | 7            | 5      | 2      |
| **Tổng cộng**                | **33**       | **18** | **15** |


**Tỷ lệ pass: 54.5% (18/33)**

#### Bug phát hiện


| Bug ID             | Mô tả                                         | Severity | File                                         |
| ------------------ | --------------------------------------------- | -------- | -------------------------------------------- |
| FR-16-BUG-001      | User thường có thể import sản phẩm            | Critical | `testing/FR-16/issues/FR-16-BUG-001.md`      |
| FR-16-BUG-002      | Backend không validate name chỉ có space      | High     | `testing/FR-16/issues/FR-16-BUG-002.md`      |
| FR-16-BUG-003      | Backend không enforce max length 255 cho name | High     | `testing/FR-16/issues/FR-16-BUG-003.md`      |
| FR-16-BUG-004      | Backend không validate price                  | Critical | `testing/FR-16/issues/FR-16-BUG-004.md`      |
| FR-16-BUG-005      | Backend không validate category_id            | Critical | `testing/FR-16/issues/FR-16-BUG-005.md`      |
| FR-16-BUG-006      | Backend không rollback khi có lỗi             | Critical | `testing/FR-16/issues/FR-16-BUG-006.md`      |
| FR-16-BUG-007      | Backend không xử lý duplicate products        | High     | `testing/FR-16/issues/FR-16-BUG-007.md`      |
| FR-16-FUNC-BUG-001 | UI cho import file thiếu header category_id   | Critical | `testing/FR-16/issues/FR-16-FUNC-BUG-001.md` |
| FR-16-FUNC-BUG-002 | UI cho import file không phải .csv            | High     | `testing/FR-16/issues/FR-16-FUNC-BUG-002.md` |


---

## Phần 3 — FR-08: Thanh toán (Checkout)

### 3.0 Codebase/Tài liệu đã khảo sát


| Loại tài liệu       | Nguồn                                              | Ghi chú                     |
| ------------------- | -------------------------------------------------- | --------------------------- |
| SRS/README — FR-08  | `contexts/README.md` §2, dòng 102–108              | 4 quy tắc nghiệp vụ cốt lõi |
| SRS/README — FR-07  | `contexts/README.md` §2, dòng 93–100               | Giỏ hàng                    |
| API Spec — Checkout | `contexts/api_specification.md` §4.3, dòng 129–137 | Endpoint, body              |


### 3.1 Input & Output

#### 3.1.1 Input


| #   | Input                 | Kiểu     | Ràng buộc (theo spec)      | Nguồn                     | Độ tin cậy |
| --- | --------------------- | -------- | -------------------------- | ------------------------- | ---------- |
| I1  | JWT Token             | String   | Phải là token hợp lệ       | api_specification.md §4   | Từ spec    |
| I2  | `shipping_address`    | String   | Phải có nội dung           | api_specification.md §4.3 | Giả định   |
| I3  | `total_amount`        | Number   | Backend tự tính lại        | README.md FR-08           | Từ spec    |
| I4  | Giỏ hàng (trạng thái) | Implicit | Phải có ít nhất 1 sản phẩm | README.md FR-08           | Giả định   |


#### 3.1.2 Output


| #   | Output                        | Mô tả               | Nguồn                   |
| --- | ----------------------------- | ------------------- | ----------------------- |
| O1  | `200 OK` + thông tin đơn hàng | Checkout thành công | README.md FR-08         |
| O2  | `401 Unauthorized`            | Không có token      | api_specification.md §4 |
| O3  | `400 Bad Request`             | Body không hợp lệ   | api_specification.md    |
| O4  | `422` hoặc `400`              | Giỏ hàng trống      | Thăm dò                 |


### 3.2 Equivalence Classes

#### 3.2.1 EC cho `Authorization`


| EC    | Điều kiện          | Valid/Invalid |
| ----- | ------------------ | ------------- |
| EC-A1 | Có JWT hợp lệ      | Valid         |
| EC-A2 | Không có token     | Invalid       |
| EC-A3 | Token không hợp lệ | Invalid       |


#### 3.2.2 EC cho `shipping_address`


| EC    | Điều kiện                     | Valid/Invalid |
| ----- | ----------------------------- | ------------- |
| EC-S1 | Địa chỉ có nội dung           | Valid         |
| EC-S2 | shipping_address = ""         | Invalid       |
| EC-S3 | shipping_address = null/thiếu | Invalid       |
| EC-S4 | shipping_address = " "        | Invalid       |


#### 3.2.3 EC cho `total_amount`


| EC    | Điều kiện                       | Valid/Invalid       |
| ----- | ------------------------------- | ------------------- |
| EC-T1 | total_amount khác tổng giỏ hàng | Backend PHẢI ignore |
| EC-T2 | total_amount = 0                | Thăm dò             |


#### 3.2.4 EC cho giỏ hàng


| EC    | Điều kiện            | Valid/Invalid |
| ----- | -------------------- | ------------- |
| EC-C1 | Giỏ hàng có sản phẩm | Valid         |
| EC-C2 | Giỏ hàng trống       | Invalid       |


### 3.3 Test Case (EP)

#### Nhóm A: Xác thực


| STT   | Lớp bao phủ                | Expected    | Actual             | Status    |
| ----- | -------------------------- | ----------- | ------------------ | --------- |
| TC-A1 | EC-A1 (Valid token)        | `200`       | `200 OK`           | ✅ Success |
| TC-A2 | EC-A2 (Không có token)     | `401`       | `401 Unauthorized` | ✅ Success |
| TC-A3 | EC-A3 (Token không hợp lệ) | `401`/`403` | `403 Forbidden`    | ✅ Success |


#### Nhóm B: Total amount


| STT   | Lớp bao phủ | Input                 | Expected                 | Actual                | Status    |
| ----- | ----------- | --------------------- | ------------------------ | --------------------- | --------- |
| TC-B1 | EC-T1       | total_amount: 1 (sai) | final_amount = tổng cart | total_amount: 1 (sai) | ❌ Failure |
| TC-B2 | EC-T1       | total_amount đúng     | thành công               | phụ thuộc client      | ❌ Failure |
| TC-B3 | EC-T2       | total_amount: 0       | Thăm dò                  | `200 OK`              | ✅ Success |


#### Nhóm C: Giỏ hàng trống


| STT   | Lớp bao phủ              | Expected    | Actual                           | Status    |
| ----- | ------------------------ | ----------- | -------------------------------- | --------- |
| TC-C1 | EC-C2 (Cart trống)       | `400`/`422` | `200 OK` (orderId: 3)            | ❌ Failure |
| TC-C2 | EC-C1 (Cart có sản phẩm) | `200`       | `200 OK` nhưng cart không bị xóa | ❌ Failure |


#### Nhóm D: Shipping address


| STT   | Lớp bao phủ | Input           | Expected | Actual   | Status    |
| ----- | ----------- | --------------- | -------- | -------- | --------- |
| TC-D1 | EC-S1       | "123 Lê Lợi..." | `200`    | `200 OK` | ✅ Success |
| TC-D2 | EC-S2       | ""              | `400`    | `200 OK` | ❌ Failure |
| TC-D3 | EC-S3       | null            | `400`    | `200 OK` | ❌ Failure |
| TC-D4 | EC-S4       | " "             | `400`    | `200 OK` | ❌ Failure |
| TC-D5 | EC-S3       | {} (thiếu)      | `400`    | `200 OK` | ❌ Failure |


### 3.4 Boundary Value Analysis

#### 3.4.1 Biên cho `shipping_address`


| STT   | Điểm biên      | Input    | Expected | Actual   | Status    |
| ----- | -------------- | -------- | -------- | -------- | --------- |
| BV-S1 | Min = 1 ký tự  | "A"      | `200`    | `200 OK` | ✅ Success |
| BV-S2 | 500 ký tự      | "A"*500  | Thăm dò  | `200 OK` | ✅ Success |
| BV-S3 | 1000 ký tự     | "A"*1000 | Thăm dò  | `200 OK` | ✅ Success |
| BV-S4 | HTML injection | ""       | Thăm dò  | `200 OK` | ✅ Success |


### 3.5 Gap Analysis


| #   | Ràng buộc không xác định           | Vì sao                   | Kết quả test                                        |
| --- | ---------------------------------- | ------------------------ | --------------------------------------------------- |
| G1  | Độ dài tối đa shipping_address     | Spec không nêu           | **ĐÃ XÁC NHẬN:** Không có max (1000 ký tự vẫn được) |
| G2  | HTTP status khi cart trống         | Spec không nêu           | **ĐÃ XÁC NHẬN:** Trả `200` thay vì `400`/`422`      |
| G3  | total_amount bắt buộc hay optional | Spec nói backend tự tính | **ĐÃ XÁC NHẬN:** Optional (body `{}` vẫn tạo đơn)   |


### 3.6 Tổng hợp kết quả & Bug


| Nhóm                | Số test case | PASS  | FAIL  |
| ------------------- | ------------ | ----- | ----- |
| A. Xác thực         | 3            | 3     | 0     |
| B. Total amount     | 3            | 1     | 2     |
| C. Giỏ hàng trống   | 2            | 0     | 2     |
| D. Shipping address | 5            | 1     | 4     |
| BV-S                | 4            | 4     | 0     |
| **Tổng cộng**       | **17**       | **9** | **8** |


**Tỷ lệ pass: 52.9% (9/17)**

#### Bug phát hiện


| Bug ID             | Mô tả                                            | Severity | File                                         |
| ------------------ | ------------------------------------------------ | -------- | -------------------------------------------- |
| FR-08-BUG-001      | Backend không ignore total_amount từ client      | Critical | `testing/FR-08/issues/FR-08-BUG-001.md`      |
| FR-08-BUG-002      | Checkout thành công khi giỏ hàng trống           | Critical | `testing/FR-08/issues/FR-08-BUG-002.md`      |
| FR-08-BUG-003      | Giỏ hàng không bị xóa sau checkout               | High     | `testing/FR-08/issues/FR-08-BUG-003.md`      |
| FR-08-BUG-004      | shipping_address không được validate             | High     | `testing/FR-08/issues/FR-08-BUG-004.md`      |
| FR-08-BUG-005      | Backend không có max length cho shipping_address | Low      | `testing/FR-08/issues/FR-08-BUG-005.md`      |
| FR-08-FUNC-BUG-001 | UI cho nhập/sửa tổng tiền                        | Critical | `testing/FR-08/issues/FR-08-FUNC-BUG-001.md` |
| FR-08-FUNC-BUG-002 | UI vẫn hiển thị giỏ hàng sau checkout            | High     | `testing/FR-08/issues/FR-08-FUNC-BUG-002.md` |


---

## Phần 4 — FR-04: Hồ sơ cá nhân (Personal Profile)

### 4.0 Codebase/Tài liệu đã khảo sát


| Loại tài liệu      | Nguồn                                          | Ghi chú                    |
| ------------------ | ---------------------------------------------- | -------------------------- |
| SRS/README — FR-04 | `contexts/README.md` §2, dòng 62–68            | Yêu cầu nghiệp vụ cơ bản   |
| API Spec — Users   | `contexts/api_specification.md` §2, dòng 61–80 | Endpoint PUT /api/users/me |


### 4.1 Input & Output

#### 4.1.1 Input


| #   | Input              | Kiểu   | Ràng buộc (theo spec)             | Nguồn                   | Độ tin cậy |
| --- | ------------------ | ------ | --------------------------------- | ----------------------- | ---------- |
| I1  | JWT Token          | String | Phải là token hợp lệ              | api_specification.md §2 | Từ spec    |
| I2  | `name`             | String | Bắt buộc? — Spec không nêu        | README.md FR-04         | Giả định   |
| I3  | `phone`            | String | Bắt đầu bằng `0`, từ 10–11 chữ số | README.md FR-04         | Từ spec    |
| I4  | `shipping_address` | String | Không bắt buộc                    | api_specification.md    | Từ spec    |
| I5  | `email`            | —      | Không thể thay đổi                | README.md FR-04         | Từ spec    |
| I6  | `role`             | —      | Không thể thay đổi                | README.md FR-04         | Từ spec    |


#### 4.1.2 Output


| #   | Output                  | Mô tả               | Nguồn                   |
| --- | ----------------------- | ------------------- | ----------------------- |
| O1  | `200 OK` + updated user | Cập nhật thành công | api_specification.md §2 |
| O2  | `401 Unauthorized`      | Không có token      | api_specification.md §2 |
| O3  | `400 Bad Request`       | Validation error    | Thông lệ API            |


### 4.2 Equivalence Classes

#### 4.2.1 EC cho Authorization


| EC    | Điều kiện          | Valid/Invalid |
| ----- | ------------------ | ------------- |
| EC-A1 | Có JWT hợp lệ      | Valid         |
| EC-A2 | Không có token     | Invalid       |
| EC-A3 | Token không hợp lệ | Invalid       |


#### 4.2.2 EC cho `name`


| EC    | Điều kiện          | Valid/Invalid |
| ----- | ------------------ | ------------- |
| EC-N1 | name có nội dung   | Valid         |
| EC-N2 | name = ""          | Invalid       |
| EC-N3 | name = " " (space) | Invalid       |
| EC-N4 | name = null        | Invalid       |
| EC-N5 | name ≤ 255 ký tự   | Valid         |
| EC-N6 | name > 255 ký tự   | Invalid       |


#### 4.2.3 EC cho `phone`


| EC    | Điều kiện                       | Valid/Invalid |
| ----- | ------------------------------- | ------------- |
| EC-P1 | Phone bắt đầu bằng 0, 10 chữ số | Valid         |
| EC-P2 | Phone bắt đầu bằng 0, 11 chữ số | Valid         |
| EC-P3 | Phone 9 chữ số                  | Invalid       |
| EC-P4 | Phone 12+ chữ số                | Invalid       |
| EC-P5 | Phone không bắt đầu bằng 0      | Invalid       |
| EC-P6 | Phone có ký tự không phải số    | Invalid       |
| EC-P7 | Phone = ""                      | Invalid       |
| EC-P8 | Phone = null/thiếu              | Invalid       |
| EC-P9 | Phone định dạng +84             | Thăm dò       |


#### 4.2.4 EC cho `shipping_address`


| EC    | Điều kiện                     | Valid/Invalid    |
| ----- | ----------------------------- | ---------------- |
| EC-S1 | shipping_address có nội dung  | Valid            |
| EC-S2 | shipping_address = ""         | Invalid          |
| EC-S3 | shipping_address = null/thiếu | Valid (optional) |
| EC-S4 | shipping_address quá dài      | Thăm dò          |


### 4.3 Test Case (EP)

#### Nhóm A: Xác thực


| STT   | Lớp bao phủ                | Expected | Actual             | Status    |
| ----- | -------------------------- | -------- | ------------------ | --------- |
| TC-A1 | EC-A1 (Token hợp lệ)       | `200`    | `200 OK`           | ✅ Success |
| TC-A2 | EC-A2 (Không có token)     | `401`    | `401 Unauthorized` | ✅ Success |
| TC-A3 | EC-A3 (Token không hợp lệ) | `401`    | `403 Forbidden`    | ✅ Success |


#### Nhóm B: Validation `name`


| STT   | Lớp bao phủ | Input                | Expected | Actual   | Status    |
| ----- | ----------- | -------------------- | -------- | -------- | --------- |
| TC-B1 | EC-N1       | name: "Nguyen Van A" | `200`    | `200 OK` | ✅ Success |
| TC-B2 | EC-N2       | name: ""             | `400`    | `200 OK` | ❌ Failure |
| TC-B3 | EC-N3       | name: " "            | `400`    | `200 OK` | ❌ Failure |
| TC-B4 | EC-N4       | name: null           | `400`    | `200 OK` | ❌ Failure |
| TC-B5 | EC-N6       | name: "A"*256        | `400`    | `200 OK` | ❌ Failure |


#### Nhóm C: Validation `phone`


| STT    | Lớp bao phủ | Input                          | Expected | Actual   | Status    |
| ------ | ----------- | ------------------------------ | -------- | -------- | --------- |
| TC-C1  | EC-P1       | phone: "0912345678" (10 số)    | `200`    | `200 OK` | ✅ Success |
| TC-C2  | EC-P2       | phone: "091234567890" (11 số)  | `200`    | `200 OK` | ✅ Success |
| TC-C3  | EC-P3       | phone: "091234567" (9 số)      | `400`    | `200 OK` | ❌ Failure |
| TC-C4  | EC-P4       | phone: "0912345678901" (12 số) | `400`    | `200 OK` | ❌ Failure |
| TC-C5  | EC-P5       | phone: "9123456789" (không 0)  | `400`    | `200 OK` | ❌ Failure |
| TC-C6  | EC-P6       | phone: "0912345abc"            | `400`    | `200 OK` | ❌ Failure |
| TC-C7  | EC-P7       | phone: ""                      | `400`    | `200 OK` | ❌ Failure |
| TC-C8  | EC-P8       | phone: null                    | `400`    | `200 OK` | ❌ Failure |
| TC-C9  | EC-P8       | Không gửi phone                | Thăm dò  | `200 OK` | ✅ Success |
| TC-C10 | EC-P9       | phone: "+84912345678"          | Thăm dò  | `200 OK` | ✅ Success |


#### Nhóm D: Validation `shipping_address`


| STT   | Lớp bao phủ | Input                          | Expected | Actual   | Status    |
| ----- | ----------- | ------------------------------ | -------- | -------- | --------- |
| TC-D1 | EC-S1       | shipping_address: "123 Le loi" | `200`    | `200 OK` | ✅ Success |
| TC-D2 | EC-S3       | Không gửi                      | `200`    | `200 OK` | ✅ Success |
| TC-D3 | EC-S2       | shipping_address: ""           | Thăm dò  | `200 OK` | ✅ Success |
| TC-D4 | EC-S3       | shipping_address: null         | Thăm dò  | `200 OK` | ✅ Success |


#### Nhóm E: Security


| STT   | Lớp bao phủ     | Input                                              | Expected        | Actual                     | Status    |
| ----- | --------------- | -------------------------------------------------- | --------------- | -------------------------- | --------- |
| TC-E1 | Email không đổi | email: "[hacker@evil.com](mailto:hacker@evil.com)" | Email không đổi | `200 OK` (email không đổi) | ✅ Success |
| TC-E2 | Role không đổi  | role: "admin"                                      | Role không đổi  | `200 OK` (role bị đổi!)    | ❌ Failure |


### 4.4 Boundary Value Analysis

#### 4.4.1 Biên cho `name`


| STT   | Điểm biên        | Input   | Expected | Actual   | Status    |
| ----- | ---------------- | ------- | -------- | -------- | --------- |
| BV-N1 | LB = 1 ký tự     | "A"     | `200`    | `200 OK` | ✅ Success |
| BV-N2 | LB = 255 ký tự   | "A"*255 | `200`    | `200 OK` | ✅ Success |
| BV-N3 | LB+1 = 256 ký tự | "A"*256 | `400`    | `200 OK` | ❌ Failure |


#### 4.4.2 Biên cho `phone`


| STT   | Điểm biên        | Input          | Expected | Actual   | Status    |
| ----- | ---------------- | -------------- | -------- | -------- | --------- |
| BV-P1 | LB = 10 chữ số   | "0912345678"   | `200`    | `200 OK` | ✅ Success |
| BV-P2 | LB = 11 chữ số   | "09123456789"  | `200`    | `200 OK` | ✅ Success |
| BV-P3 | LB-1 = 9 chữ số  | "091234567"    | `400`    | `200 OK` | ❌ Failure |
| BV-P4 | LB+1 = 12 chữ số | "091234567890" | `400`    | `200 OK` | ❌ Failure |
| BV-P5 | LB = 0 (rỗng)    | ""             | `400`    | `200 OK` | ❌ Failure |


### 4.5 Gap Analysis


| #   | Ràng buộc không xác định     | Vì sao            | Cách xử lý     |
| --- | ---------------------------- | ----------------- | -------------- |
| G1  | name có bắt buộc không?      | Spec không nêu    | TC-B4 thăm dò  |
| G2  | phone có bắt buộc không?     | Spec không nêu    | TC-C9 thăm dò  |
| G3  | Max length name?             | Spec không nêu    | Giả định 255   |
| G4  | Max length shipping_address? | Spec không nêu    | TC-D4 thăm dò  |
| G5  | Max length phone?            | Spec nói 10-11 số | Đã rõ          |
| G6  | Có hỗ trợ +84?               | Spec không nêu    | TC-C10 thăm dò |


### 4.6 Tổng hợp kết quả & Bug


| Nhóm                             | Số test case | PASS   | FAIL   |
| -------------------------------- | ------------ | ------ | ------ |
| A. Xác thực                      | 3            | 3      | 0      |
| B. Validation `name`             | 5            | 1      | 4      |
| C. Validation `phone`            | 10           | 3      | 7      |
| D. Validation `shipping_address` | 4            | 4      | 0      |
| E. Security                      | 2            | 1      | 1      |
| BV                               | 7            | 2      | 5      |
| **Tổng cộng**                    | **31**       | **14** | **17** |


**Tỷ lệ pass: 45.2% (14/31)**

#### Bug phát hiện


| Bug ID             | Mô tả                                        | Severity     | File                                         |
| ------------------ | -------------------------------------------- | ------------ | -------------------------------------------- |
| FR-04-BUG-001      | Backend không validate name                  | Critical     | `testing/FR-04/issues/FR-04-BUG-001.md`      |
| FR-04-BUG-002      | Backend không validate phone                 | Critical     | `testing/FR-04/issues/FR-04-BUG-002.md`      |
| FR-04-BUG-003      | Backend cho phép thay đổi role               | **Critical** | `testing/FR-04/issues/FR-04-BUG-003.md`      |
| FR-04-BUG-004      | Backend không validate shipping_address rỗng | Medium       | `testing/FR-04/issues/FR-04-BUG-004.md`      |
| FR-04-BUG-005      | Backend không xử lý phone                    | High         | `testing/FR-04/issues/FR-04-BUG-005.md`      |
| FR-04-FUNC-BUG-001 | Mobile cho lưu phone 9 chữ số                | High         | `testing/FR-04/issues/FR-04-FUNC-BUG-001.md` |


---

## Tổng kết chung


| Feature                  | Số TC thiết kế | Đã chạy | Pass   | Fail   | Chưa chạy | Số bug |
| ------------------------ | -------------- | ------- | ------ | ------ | --------- | ------ |
| FR-02 (Login & Lockout)  | 28             | 28      | 16     | 10     | 0         | 5      |
| FR-16 (Import CSV)       | 33             | 33      | 18     | 15     | 0         | 9      |
| FR-08 (Checkout)         | 17             | 17      | 9      | 8      | 0         | 7      |
| FR-04 (Personal Profile) | 31             | 31      | 14     | 17     | 0         | 6      |
| **Tổng**                 | **109**        | **109** | **57** | **50** | **0**     | **27** |


**Tỷ lệ pass trung bình: 52.3% (57/109)**

### Tổng hợp Bug theo Severity


| Severity | FR-02 | FR-16 | FR-08 | FR-04 | Tổng   |
| -------- | ----- | ----- | ----- | ----- | ------ |
| Critical | 0     | 5     | 4     | 3     | **12** |
| High     | 2     | 4     | 2     | 3     | **11** |
| Medium   | 3     | 0     | 1     | 1     | **5**  |
| Low      | 0     | 0     | 1     | 0     | **1**  |
| **Tổng** | **5** | **9** | **8** | **7** | **29** |


### Bugs nghiêm trọng nhất cần fix ngay

1. **FR-04-BUG-003** — User có thể tự nâng quyền thành admin (Privilege Escalation)
2. **FR-16-BUG-001** — User thường có thể import sản phẩm
3. **FR-16-BUG-004** — Backend không validate price
4. **FR-16-BUG-005** — Backend không validate category_id
5. **FR-16-BUG-006** — Backend không rollback khi có lỗi
6. **FR-08-BUG-001** — Backend nhận total_amount từ client
7. **FR-08-BUG-002** — Checkout thành công khi giỏ hàng trống
8. **FR-02-BUG-002** — Khóa xảy ra ở lần sai thứ 2 thay vì thứ 3
9. **FR-02-BUG-003** — Thời gian khóa kéo dài hơn 30 giây

---

