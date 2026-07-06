# Domain Testing Report — FR-16: Import Sản phẩm từ CSV

## Phương pháp luận

Domain testing trong report này được thực hiện theo phương pháp **Black-box thuần**: mọi
Equivalence Class và Boundary Value được xác định chỉ dựa trên đặc tả (SRS/README) và tài
liệu hợp đồng API (OpenAPI/Postman collection), KHÔNG dựa trên việc đọc source code xử lý
logic nghiệp vụ. Các giá trị mà spec không nêu rõ được đánh dấu là "giá trị thăm dò" và sẽ
được xác nhận qua kết quả thực thi bằng Postman, không suy luận từ implementation.

---

## 0. Tài liệu đã khảo sát


| Loại tài liệu      | Nguồn                                              | Ghi chú                                         |
| ------------------ | -------------------------------------------------- | ----------------------------------------------- |
| SRS/README — FR-16 | `contexts/README.md` §2, dòng 200–212              | 4 quy tắc nghiệp vụ cốt lõi                     |
| SRS/README — FR-15 | `contexts/README.md` §2, dòng 191–199              | Product CRUD — ràng buộc input sản phẩm         |
| SRS/README — FR-12 | `contexts/README.md` §2, dòng 174–180              | Admin access control — yêu cầu JWT + role admin |
| API Spec — Import  | `contexts/api_specification.md` §6.3, dòng 204–220 | Endpoint, body format (JSON array)              |


---

## 1. Input & Output

### 1.1 Input


| #   | Input                            | Kiểu          | Ràng buộc (theo spec)                       | Nguồn                                                  | Độ tin cậy              |
| --- | -------------------------------- | ------------- | ------------------------------------------- | ------------------------------------------------------ | ----------------------- |
| I1  | JWT Token (Authorization header) | String        | Phải là token hợp lệ và có `role = 'admin'` | `README.md` FR-12 dòng 176–180                         | Từ spec                 |
| I2  | `products` array (trong body)    | Array[Object] | Phải là mảng JSON, không rỗng               | `api_specification.md` §6.3 dòng 209                   | Từ spec                 |
| I3  | `name` (mỗi sản phẩm)            | String        | Không được rỗng                             | `README.md` FR-16 dòng 208                             | Từ spec                 |
| I4  | `price` (mỗi sản phẩm)           | Number        | Phải là số dương (> 0)                      | `README.md` FR-16 dòng 209; `README.md` FR-15 dòng 196 | Từ spec                 |
| I5  | `description` (mỗi sản phẩm)     | String        | Không bắt buộc theo spec                    | `api_specification.md` §6.3 dòng 215                   | Giả định — CẦN XÁC NHẬN |
| I6  | `imageUrl` (mỗi sản phẩm)        | String        | Không bắt buộc theo spec                    | `api_specification.md` §6.3 dòng 216                   | Giả định — CẦN XÁC NHẬN |
| I7  | `category_id` (mỗi sản phẩm)     | Integer       | Bắt buộc, phải là danh mục có sẵn           | `README.md` FR-16 dòng 207; `README.md` FR-15 dòng 197 | Từ spec                 |


### 1.2 Output


| #   | Output             | Mô tả                                                                               | Nguồn                              |
| --- | ------------------ | ----------------------------------------------------------------------------------- | ---------------------------------- |
| O1  | `200 OK` + report  | Import thành công toàn bộ: thông báo + số dòng thành công                           | `README.md` FR-16 dòng 211         |
| O2  | `401 Unauthorized` | Không có token / token không hợp lệ                                                 | `api_specification.md` §6 dòng 191 |
| O3  | `403 Forbidden`    | Token hợp lệ nhưng không phải admin                                                 | `README.md` FR-12 dòng 176–180     |
| O4  | `400 Bad Request`  | Lỗi validation (dòng có `name` rỗng, `price` không dương, hoặc rollback khi có lỗi) | `README.md` FR-16 dòng 210–211     |


---

## 2. Equivalence Classes

### 2.1 EC cho Authorization (I1)


| EC    | Điều kiện                                       | Mô tả lớp                     | Valid/Invalid | Độ tin cậy |
| ----- | ----------------------------------------------- | ----------------------------- | ------------- | ---------- |
| EC-A1 | Có JWT token hợp lệ với `role = 'admin'`        | User là admin đã authenticate | Valid         | Từ spec    |
| EC-A2 | Không có header `Authorization`                 | Request không gửi token       | Invalid       | Từ spec    |
| EC-A3 | Có token nhưng không phải admin (role = 'user') | User thường cố gắng import    | Invalid       | Từ spec    |
| EC-A4 | Token không hợp lệ / hết hạn                    | Token giả hoặc đã hết hạn     | Invalid       | Từ spec    |


### 2.2 EC cho sản phẩm trong mảng (`name` — I3)


| EC    | Điều kiện                                               | Mô tả lớp             | Valid/Invalid       | Độ tin cậy                     |
| ----- | ------------------------------------------------------- | --------------------- | ------------------- | ------------------------------ |
| EC-N1 | `name` có nội dung thực (tối thiểu 1 ký tự có nội dung) | Tên sản phẩm hợp lệ   | Valid               | Từ spec                        |
| EC-N2 | `name` bị rỗng (`""`)                                   | Tên sản phẩm trống    | Invalid             | Từ spec                        |
| EC-N3 | `name` chỉ có khoảng trắng (`" "`)                      | Tên chỉ có space      | Invalid (edge case) | Giả định hợp lý — CẦN XÁC NHẬN |
| EC-N4 | `name` bị `null` hoặc thiếu trường                      | Không gửi trường name | Invalid             | Giả định hợp lý — CẦN XÁC NHẬN |
| EC-N5 | `name` tối đa 255 ký tự (theo FR-15)                    | Tên dài vừa đủ        | Valid               | Từ spec                        |
| EC-N6 | `name` vượt quá 255 ký tự                               | Tên quá dài           | Invalid             | Từ spec                        |


### 2.3 EC cho `price` (I4)


| EC    | Điều kiện                                     | Mô tả lớp       | Valid/Invalid                 | Độ tin cậy                     |
| ----- | --------------------------------------------- | --------------- | ----------------------------- | ------------------------------ |
| EC-P1 | `price` là số dương (> 0)                     | Giá hợp lệ      | Valid                         | Từ spec                        |
| EC-P2 | `price` = 0                                   | Giá bằng 0      | Invalid                       | Từ spec                        |
| EC-P3 | `price` là số âm                              | Giá âm          | Invalid                       | Giả định hợp lý — CẦN XÁC NHẬN |
| EC-P4 | `price` là `null` hoặc thiếu trường           | Không gửi price | Invalid                       | Giả định hợp lý — CẦN XÁC NHẬN |
| EC-P5 | `price` là kiểu string (ví dụ `"100000"`)     | Giá dạng chuỗi  | Invalid                       | Giả định — CẦN XÁC NHẬN        |
| EC-P6 | `price` là số thập phân dương (ví dụ `99.99`) | Giá có cents    | Thăm dò — xem có hỗ trợ không | Giả định — CẦN XÁC NHẬN        |


### 2.4 EC cho `category_id` (I7)


| EC    | Điều kiện                                              | Mô tả lớp                        | Valid/Invalid | Độ tin cậy                     |
| ----- | ------------------------------------------------------ | -------------------------------- | ------------- | ------------------------------ |
| EC-C1 | `category_id` là ID của danh mục có sẵn trong hệ thống | Danh mục hợp lệ                  | Valid         | Từ spec                        |
| EC-C2 | `category_id` là ID không tồn tại                      | Danh mục không có trong hệ thống | Invalid       | Giả định hợp lý — CẦN XÁC NHẬN |
| EC-C3 | `category_id` bị `null` hoặc thiếu trường              | Không gửi category_id            | Invalid       | Giả định hợp lý — CẦN XÁC NHẬN |
| EC-C4 | `category_id` = 0                                      | ID bằng 0                        | Invalid       | Giả định — CẦN XÁC NHẬN        |


### 2.5 EC cho hành vi Rollback (nghiệp vụ cốt lõi — I2)


| EC    | Điều kiện              | Mô tả lớp                            | Valid/Invalid | Độ tin cậy |
| ----- | ---------------------- | ------------------------------------ | ------------- | ---------- |
| EC-R1 | Tất cả dòng đều hợp lệ | Import toàn bộ thành công            | Valid         | Từ spec    |
| EC-R2 | Có ít nhất 1 dòng lỗi  | Toàn bộ bị rollback (all-or-nothing) | Invalid       | Từ spec    |


---

## 3. Test Case (Equivalence Partitioning) — bảng chạy Postman

### 3.1 Nhóm A: Xác thực & Phân quyền (Authorization)


| STT   | Lớp bao phủ                | Input                                                             | Expected Output                            | Actual                                                                                          | Status                                       |
| ----- | -------------------------- | ----------------------------------------------------------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------- | -------------------------------------------- |
| TC-A1 | EC-A1 (Admin hợp lệ)       | `POST /api/admin/import-products` với JWT admin, body đúng format | `200` — import thành công, báo cáo số dòng | `200 OK`{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] } | Success                                      |
| TC-A2 | EC-A2 (Không có token)     | Request không có header `Authorization`                           | `401 Unauthorized`                         | `401 Unauthorized`{ "error": "Unauthorized" }                                                 | Success                                      |
| TC-A3 | EC-A3 (Không phải admin)   | JWT của user thường (role = 'user')                               | `403 Forbidden`                            | `200 OK`{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] } | Failure - Thêm sản phẩm khi đang ở role user |
| TC-A4 | EC-A4 (Token không hợp lệ) | JWT giả `"Bearer invalid-token-xyz"`                              | `401 Unauthorized` hoặc `403`              | `403 Forbidden`{ "error": "Forbidden" }                                                       | Success                                      |


### 3.2 Nhóm B: Validation `name` (I3)


| STT   | Lớp bao phủ               | Input                                                                         | Expected Output                         | Actual                                                                                                                        | Status                                                                                                                                       |
| ----- | ------------------------- | ----------------------------------------------------------------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| TC-B1 | EC-N1 (Name hợp lệ)       | Body: `{ products: [{ name: "Sản phẩm A", price: 100000, category_id: 1 }] }` | `200` — thành công                      | `200 OK`{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] }                               | Success                                                                                                                                      |
| TC-B2 | EC-N2 (Name rỗng)         | Body: `{ products: [{ name: "", price: 100000, category_id: 1 }] }`           | `400` — name bắt buộc, rollback toàn bộ | `200 OK`{ "message": "Import hoàn tất: 0/1 sản phẩm được thêm", "inserted": 0, "errors": [ "Hàng 2: Thiếu tên sản phẩm" ] } | Sucess - Có thể được xem là success bởi vì response trả về là không thêm và khi check với /api/products thì sản phẩm thực sự không được thêm |
| TC-B3 | EC-N3 (Name chỉ có space) | Body: `{ products: [{ name: " ", price: 100000, category_id: 1 }] }`          | `400` — name không hợp lệ, rollback     | `200 OK`{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] }                               | Failure - Sản phẩm không được để tên chỉ có 1 khoảng trắng -> Server chưa có backend xử lý                                                   |
| TC-B4 | EC-N4 (Name null)         | Body: `{ products: [{ name: null, price: 100000, category_id: 1 }] }`         | `400` — name bắt buộc, rollback         | `200 OK`{ "message": "Import hoàn tất: 0/1 sản phẩm được thêm", "inserted": 0, "errors": [ "Hàng 2: Thiếu tên sản phẩm" ] } | Success                                                                                                                                      |
| TC-B5 | EC-N4 (Thiếu trường name) | Body: `{ products: [{ price: 100000, category_id: 1 }] }`                     | `400` — thiếu trường bắt buộc, rollback | `200 OK`{ "message": "Import hoàn tất: 0/1 sản phẩm được thêm", "inserted": 0, "errors": [ "Hàng 2: Thiếu tên sản phẩm" ] } | ☐                                                                                                                                            |
| TC-B6 | EC-N6 (Name > 255 ký tự)  | Body: `{ products: [{ name: "A"*256, price: 100000, category_id: 1 }] }`      | `400` — name vượt max length, rollback  | `200 OK`{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] }                               | Failure                                                                                                                                      |


### 3.3 Nhóm C: Validation `price` (I4)


| STT   | Lớp bao phủ             | Input                                                                     | Expected Output                                    | Actual                                                                                          | Status                                                                          |
| ----- | ----------------------- | ------------------------------------------------------------------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| TC-C1 | EC-P1 (Price dương)     | Body: `{ products: [{ name: "SP A", price: 100000, category_id: 1 }] }`   | `200` — thành công                                 | `200 OK`{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] } | Success                                                                         |
| TC-C2 | EC-P2 (Price = 0)       | Body: `{ products: [{ name: "SP A", price: 0, category_id: 1 }] }`        | `400` — price phải dương, rollback                 | `200 OK`{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] } | Failure                                                                         |
| TC-C3 | EC-P3 (Price âm)        | Body: `{ products: [{ name: "SP A", price: -100, category_id: 1 }] }`     | `400` — price không hợp lệ, rollback               | `200 OK`{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] } | Failure                                                                         |
| TC-C4 | EC-P4 (Price null)      | Body: `{ products: [{ name: "SP A", price: null, category_id: 1 }] }`     | `400` — price bắt buộc, rollback                   | `200 OK`{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] } | Failure                                                                         |
| TC-C5 | EC-P4 (Thiếu price)     | Body: `{ products: [{ name: "SP A", category_id: 1 }] }`                  | `400` — thiếu trường bắt buộc, rollback            | `200 OK`{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] } | Failure                                                                         |
| TC-C6 | EC-P5 (Price là string) | Body: `{ products: [{ name: "SP A", price: "100000", category_id: 1 }] }` | `400` — price phải là số, rollback                 | `200 OK`{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] } | Success - Khi check api/products thì sản phẩm được thêm đã được ép kiểu sang số |
| TC-C7 | EC-P6 (Price thập phân) | Body: `{ products: [{ name: "SP A", price: 99.99, category_id: 1 }] }`    | Không xác định — thăm dò xem có hỗ trợ cents không | `200 OK`{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] } | Success                                                                         |


### 3.4 Nhóm D: Validation `category_id` (I7)


| STT   | Lớp bao phủ                    | Input                                                                      | Expected Output                          | Actual                                                                                          | Status  |
| ----- | ------------------------------ | -------------------------------------------------------------------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------- | ------- |
| TC-D1 | EC-C1 (Category có sẵn)        | Body: `{ products: [{ name: "SP A", price: 100000, category_id: 1 }] }`    | `200` — thành công                       | `200 OK`{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] } | Success |
| TC-D2 | EC-C2 (Category không tồn tại) | Body: `{ products: [{ name: "SP A", price: 100000, category_id: 9999 }] }` | `400` — category không tồn tại, rollback | `200 OK`{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] } | Failure |
| TC-D3 | EC-C3 (Category null)          | Body: `{ products: [{ name: "SP A", price: 100000, category_id: null }] }` | `400` — category bắt buộc, rollback      | `200 OK`{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] } | Failure |
| TC-D4 | EC-C3 (Thiếu category_id)      | Body: `{ products: [{ name: "SP A", price: 100000 }] }`                    | `400` — thiếu trường bắt buộc, rollback  | `200 OK`{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] } | Failure |
| TC-D5 | EC-C4 (Category = 0)           | Body: `{ products: [{ name: "SP A", price: 100000, category_id: 0 }] }`    | `400` — category không hợp lệ, rollback  | `200 OK`{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] } | Failure |


### 3.5 Nhóm E: Rollback / All-or-Nothing (I2)


| STT   | Lớp bao phủ             | Input                                                                                                                    | Expected Output                                          | Actual                                                                                                                                                      | Status                                                                                          |
| ----- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| TC-E1 | EC-R1 (Tất cả hợp lệ)   | Body: `{ products: [{ name: "SP A", price: 100000, category_id: 1 }, { name: "SP B", price: 200000, category_id: 1 }] }` | `200` — cả 2 sản phẩm được tạo                           | `200 OK`{ "message": "Import hoàn tất: 2/2 sản phẩm được thêm", "inserted": 1, "errors": [] }                                                             | Success                                                                                         |
| TC-E2 | EC-R2 (1 dòng lỗi)      | Body: `{ products: [{ name: "SP A", price: 100000, category_id: 1 }, { name: "", price: 200000, category_id: 1 }] }`     | `400` — rollback toàn bộ, KHÔNG có sản phẩm nào được tạo | `200 OK`{ "message": "Import hoàn tất: 1/2 sản phẩm được thêm", "inserted": 1, "errors": [ "Hàng 3: Thiếu tên sản phẩm" ] }                                | Failure                                                                                         |
| TC-E3 | EC-R2 (Tất cả dòng lỗi) | Body: `{ products: [{ name: "", price: 100000, category_id: 1 }, { name: "", price: 200000, category_id: 1 }] }`         | `400` — rollback toàn bộ                                 | `200 OK`{ "message": "Import hoàn tất: 0/2 sản phẩm được thêm", "inserted": 0, "errors": [ "Hàng 2: Thiếu tên sản phẩm", "Hàng 3: Thiếu tên sản phẩm" ] } | Success - Không thêm bất kì sản phẩm nào nếu tất cả đều lỗi -> Chỉ không insert sản phẩm bị lỗi |
| TC-E4 | (Boundary — 1 dòng)     | Body: `{ products: [{ name: "SP A", price: 100000, category_id: 1 }] }` — chỉ 1 sản phẩm                                 | `200` — 1 sản phẩm được tạo                              | `200 OK`{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] }                                                             | Success                                                                                         |


---

## 4. Boundary Value Analysis — bảng chạy Postman

### 4.1 Biên cho độ dài `name` (theo spec: tối đa 255 ký tự — FR-15)


| STT   | Điểm biên        | Giá trị   | Input                                                              | Expected Output           | Actual                                                                                          | Status  |
| ----- | ---------------- | --------- | ------------------------------------------------------------------ | ------------------------- | ----------------------------------------------------------------------------------------------- | ------- |
| BV-N1 | LB = 1 ký tự     | `"A"`     | `{ products: [{ name: "A", price: 100000, category_id: 1 }] }`     | `200` — tối thiểu 1 ký tự | `200 OK`{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] } | Success |
| BV-N2 | LB = 255 ký tự   | `"A"*255` | `{ products: [{ name: "A"*255, price: 100000, category_id: 1 }] }` | `200` — đúng 255 ký tự    | `200 OK`{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] } | Success |
| BV-N3 | LB+1 = 256 ký tự | `"A"*256` | `{ products: [{ name: "A"*256, price: 100000, category_id: 1 }] }` | `400` — vượt quá 255      | `200 OK`{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] } | Failure |


### 4.2 Biên cho giá trị `price` (theo spec: phải dương > 0)


| STT   | Điểm biên                 | Giá trị | Input                                                           | Expected Output                        | Actual                                                                                          | Status                    |
| ----- | ------------------------- | ------- | --------------------------------------------------------------- | -------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------- |
| BV-P1 | LB = giá trị nhỏ nhất > 0 | `0.01`  | `{ products: [{ name: "SP A", price: 0.01, category_id: 1 }] }` | Không xác định — thăm dò giá tối thiểu | `200 OK`{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] } | Success                   |
| BV-P2 | LB = 1                    | `1`     | `{ products: [{ name: "SP A", price: 1, category_id: 1 }] }`    | `200` — giá tối thiểu là 1             | `200 OK`{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] } | Success                   |
| BV-P3 | LB-1 = 0                  | `0`     | `{ products: [{ name: "SP A", price: 0, category_id: 1 }] }`    | `400` — price = 0 không hợp lệ         | `200 OK`{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] } | Failure - Giá là số dương |
| BV-P4 | LB-1 = -1                 | `-1`    | `{ products: [{ name: "SP A", price: -1, category_id: 1 }] }`   | `400` — price âm không hợp lệ          | `200 OK`{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] } | Failure                   |


### 4.3 Biên thăm dò cho định dạng body (spec không nêu cụ thể)


| STT   | Giá trị thăm dò                    | Input                                                                                 | Expected Output                              | Actual                                                                                          | Status                                 |
| ----- | ---------------------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------- |
| BV-B1 | Body rỗng                          | `{ products: [] }`                                                                    | Không xác định — thăm dò                     | `400 Bad request`{ "error": "Không có dữ liệu để import" }                                     | Success                                |
| BV-B2 | Thiếu trường `products`            | `{}`                                                                                  | Không xác định — thăm dò                     | `400 Bad request`{ "error": "Không có dữ liệu để import" }                                     | Success                                |
| BV-B3 | `products` là object thay vì array | `{ products: {} }`                                                                    | Không xác định — thăm dò                     | `400 Bad request`{ "error": "Không có dữ liệu để import" }                                     | Success                                |
| BV-B4 | Trường không xác định              | `{ products: [{ name: "SP A", price: 100000, category_id: 1, unknown_field: "x" }] }` | Không xác định — thăm dò xem có ignore không | `200 OK`{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] } | Success - Ignore trường không xác định |


---

## 5. Gap Analysis

### 5.1 Ràng buộc không xác định được vì spec thiếu


| #   | Ràng buộc/EC không xác định được                                | Vì sao                                                     | Cách xử lý                                           |
| --- | --------------------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------- |
| G1  | Định dạng price có hỗ trợ số thập phân không?                   | Spec nói "số dương", không nêu rõ kiểu dữ liệu             | TC-C7 thăm dò (99.99), BV-P1 (0.01)                  |
| G2  | `description` và `imageUrl` có bắt buộc không?                  | Spec không nêu, nhưng FR-15 yêu cầu `category_id` bắt buộc | TC-D thăm dò, giả định description/imageUrl optional |
| G3  | Nếu 1 sản phẩm có `name` trùng với sản phẩm đã tồn tại thì sao? | Spec không nêu xử lý duplicate                             | Giả định: tạo mới (không update) — CẦN XÁC NHẬN      |
| G4  | Số lượng sản phẩm tối đa trong 1 request?                       | Spec không nêu                                             | Giá trị thăm dò: 1 dòng, nhiều dòng (TC-E1)          |
| G5  | Xử lý ký tự đặc biệt trong name (UTF-8, emoji, HTML)?           | Spec không nêu                                             | Giá trị thăm dò: tiếng Việt, ký tự đặc biệt          |


### 5.2 Ràng buộc giả định hợp lý (cần xác nhận với business/QA)


| #   | Giả định                                     | Lý do giả định                                                           |
| --- | -------------------------------------------- | ------------------------------------------------------------------------ |
| GA1 | `name` không được rỗng, tối đa 255 ký tự     | FR-16 + FR-15: "Tên sản phẩm: bắt buộc, tối đa 255 ký tự"                |
| GA2 | `price` phải là số dương (> 0)               | FR-16 + FR-15: "Giá: bắt buộc, phải là số dương (> 0)"                   |
| GA3 | `category_id` phải là danh mục có sẵn        | FR-16: "Danh mục: bắt buộc, phải chọn từ danh sách có sẵn"               |
| GA4 | Rollback toàn bộ khi có lỗi (all-or-nothing) | FR-16: "Nếu có lỗi ở bất kỳ dòng nào, toàn bộ import phải được rollback" |
| GA5 | Không tạo sản phẩm nào khi rollback          | GA4: transaction nguyên tử                                               |


---

## 6. Phân tích kết quả Postman (điền sau khi có Actual/Status ở trên)


| #   | Test case liên quan     | Hành vi quan sát được | Kỳ vọng theo spec                                | Giả thuyết                    | Cần test thêm                                             |
| --- | ----------------------- | --------------------- | ------------------------------------------------ | ----------------------------- | --------------------------------------------------------- |
| 1   | TC-A1 (Admin hợp lệ)    | *(điền sau khi test)* | Import thành công, response có báo cáo           | *(sẽ điền sau khi có Actual)* | —                                                         |
| 2   | TC-A2/A3/A4 (Auth)      | *(điền sau khi test)* | 401/403 tùy trường hợp                           | *(sẽ điền sau khi có Actual)* | —                                                         |
| 3   | TC-B2 (Name rỗng)       | *(điền sau khi test)* | Rollback toàn bộ                                 | *(sẽ điền sau khi có Actual)* | Kiểm tra CSDL xem có sản phẩm nào được tạo không          |
| 4   | TC-C2 (Price = 0)       | *(điền sau khi test)* | Rollback toàn bộ                                 | *(sẽ điền sau khi có Actual)* | Kiểm tra CSDL xem có sản phẩm nào được tạo không          |
| 5   | TC-E2 (1 dòng lỗi)      | *(điền sau khi test)* | Rollback toàn bộ, không có sản phẩm nào được tạo | *(sẽ điền sau khi có Actual)* | Gọi `GET /api/products` để xác nhận không có sản phẩm mới |
| 6   | BV-P1 (Price = 0.01)    | *(điền sau khi test)* | Không xác định — thăm dò                         | *(sẽ điền sau khi có Actual)* | Xác nhận giá tối thiểu hỗ trợ                             |
| 7   | TC-C7 (Price thập phân) | *(điền sau khi test)* | Không xác định — thăm dò                         | *(sẽ điền sau khi có Actual)* | Xác nhận có lưu cents không                               |


---

## 7. Tổng hợp test case sau khi chạy Postman

*(Điền sau khi có Actual/Status)*


| Nhóm                         | Số test case | PASS  | FAIL  | Cần xác nhận                                 |
| ---------------------------- | ------------ | ----- | ----- | -------------------------------------------- |
| A. Xác thực & Phân quyền     | 4            | —     | —     | —                                            |
| B. Validation `name`         | 6            | —     | —     | Kiểm tra CSDL sau rollback                   |
| C. Validation `price`        | 7            | —     | —     | Kiểm tra CSDL sau rollback                   |
| D. Validation `category_id`  | 5            | —     | —     | Kiểm tra CSDL sau rollback                   |
| E. Rollback / All-or-nothing | 4            | —     | —     | Gọi GET /api/products sau mỗi TC để xác nhận |
| BV (Boundary)                | 7            | —     | —     | —                                            |
| **Tổng cộng**                | **33**       | **—** | **—** | —                                            |


---

## 8. Tổng hợp Bug phát hiện (GitHub Issues)

*(Điền sau khi phân tích kết quả Postman)*


| Bug ID        | Mô tả                          | Severity | File               |
| ------------- | ------------------------------ | -------- | ------------------ |
| FR-16-BUG-001 | *(điền sau khi phát hiện bug)* | —        | *(đường dẫn file)* |


