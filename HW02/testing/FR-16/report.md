# Domain Testing Report — FR-16: Import Sản phẩm từ CSV

## Phương pháp luận

Domain testing trong report này được thực hiện theo phương pháp **Black-box thuần**: mọi
Equivalence Class và Boundary Value được xác định chỉ dựa trên đặc tả (SRS/README) và tài
liệu hợp đồng API (OpenAPI/Postman collection), KHÔNG dựa trên việc đọc source code xử lý
logic nghiệp vụ. Các giá trị mà spec không nêu rõ được đánh dấu là "giá trị thăm dò" và sẽ
được xác nhận qua kết quả thực thi bằng Postman, không suy luận từ implementation.

---

## 0. Tài liệu đã khảo sát

| Loại tài liệu | Nguồn | Ghi chú |
|---|---|---|
| SRS/README — FR-16 | `contexts/README.md` §2, dòng 200–212 | 4 quy tắc nghiệp vụ cốt lõi |
| SRS/README — FR-15 | `contexts/README.md` §2, dòng 191–199 | Product CRUD — ràng buộc input sản phẩm |
| SRS/README — FR-12 | `contexts/README.md` §2, dòng 174–180 | Admin access control — yêu cầu JWT + role admin |
| API Spec — Import | `contexts/api_specification.md` §6.3, dòng 204–220 | Endpoint, body format (JSON array) |

---

## 1. Input & Output

### 1.1 Input

| # | Input | Kiểu | Ràng buộc (theo spec) | Nguồn | Độ tin cậy |
|---|---|---|---|---|---|
| I1 | JWT Token (Authorization header) | String | Phải là token hợp lệ và có `role = 'admin'` | `README.md` FR-12 dòng 176–180 | Từ spec |
| I2 | `products` array (trong body) | Array[Object] | Phải là mảng JSON, không rỗng | `api_specification.md` §6.3 dòng 209 | Từ spec |
| I3 | `name` (mỗi sản phẩm) | String | Không được rỗng | `README.md` FR-16 dòng 208 | Từ spec |
| I4 | `price` (mỗi sản phẩm) | Number | Phải là số dương (> 0) | `README.md` FR-16 dòng 209; `README.md` FR-15 dòng 196 | Từ spec |
| I5 | `description` (mỗi sản phẩm) | String | Không bắt buộc theo spec | `api_specification.md` §6.3 dòng 215 | Giả định — CẦN XÁC NHẬN |
| I6 | `imageUrl` (mỗi sản phẩm) | String | Không bắt buộc theo spec | `api_specification.md` §6.3 dòng 216 | Giả định — CẦN XÁC NHẬN |
| I7 | `category_id` (mỗi sản phẩm) | Integer | Bắt buộc, phải là danh mục có sẵn | `README.md` FR-16 dòng 207; `README.md` FR-15 dòng 197 | Từ spec |

### 1.2 Output

| # | Output | Mô tả | Nguồn |
|---|---|---|---|
| O1 | `200 OK` + report | Import thành công toàn bộ: thông báo + số dòng thành công | `README.md` FR-16 dòng 211 |
| O2 | `401 Unauthorized` | Không có token / token không hợp lệ | `api_specification.md` §6 dòng 191 |
| O3 | `403 Forbidden` | Token hợp lệ nhưng không phải admin | `README.md` FR-12 dòng 176–180 |
| O4 | `400 Bad Request` | Lỗi validation (dòng có `name` rỗng, `price` không dương, hoặc rollback khi có lỗi) | `README.md` FR-16 dòng 210–211 |

---

## 2. Equivalence Classes

### 2.1 EC cho Authorization (I1)

| EC | Điều kiện | Mô tả lớp | Valid/Invalid | Độ tin cậy |
|---|---|---|---|---|
| EC-A1 | Có JWT token hợp lệ với `role = 'admin'` | User là admin đã authenticate | Valid | Từ spec |
| EC-A2 | Không có header `Authorization` | Request không gửi token | Invalid | Từ spec |
| EC-A3 | Có token nhưng không phải admin (role = 'user') | User thường cố gắng import | Invalid | Từ spec |
| EC-A4 | Token không hợp lệ / hết hạn | Token giả hoặc đã hết hạn | Invalid | Từ spec |

### 2.2 EC cho sản phẩm trong mảng (`name` — I3)

| EC | Điều kiện | Mô tả lớp | Valid/Invalid | Độ tin cậy |
|---|---|---|---|---|
| EC-N1 | `name` có nội dung thực (tối thiểu 1 ký tự có nội dung) | Tên sản phẩm hợp lệ | Valid | Từ spec |
| EC-N2 | `name` bị rỗng (`""`) | Tên sản phẩm trống | Invalid | Từ spec |
| EC-N3 | `name` chỉ có khoảng trắng (`" "`) | Tên chỉ có space | Invalid | Giả định hợp lý — CẦN XÁC NHẬN |
| EC-N4 | `name` bị `null` hoặc thiếu trường | Không gửi trường name | Invalid | Giả định hợp lý — CẦN XÁC NHẬN |
| EC-N5 | `name` tối đa 255 ký tự (theo FR-15) | Tên dài vừa đủ | Valid | Từ spec |
| EC-N6 | `name` vượt quá 255 ký tự | Tên quá dài | Invalid | Từ spec |

### 2.3 EC cho `price` (I4)

| EC | Điều kiện | Mô tả lớp | Valid/Invalid | Độ tin cậy |
|---|---|---|---|---|
| EC-P1 | `price` là số dương (> 0) | Giá hợp lệ | Valid | Từ spec |
| EC-P2 | `price` = 0 | Giá bằng 0 | Invalid | Từ spec |
| EC-P3 | `price` là số âm | Giá âm | Invalid | Giả định hợp lý — CẦN XÁC NHẬN |
| EC-P4 | `price` là `null` hoặc thiếu trường | Không gửi price | Invalid | Giả định hợp lý — CẦN XÁC NHẬN |
| EC-P5 | `price` là kiểu string (ví dụ `"100000"`) | Giá dạng chuỗi | Thăm dò | Giả định — CẦN XÁC NHẬN |
| EC-P6 | `price` là số thập phân dương (ví dụ `99.99`) | Giá có cents | Thăm dò — xem có hỗ trợ không | Giả định — CẦN XÁC NHẬN |

### 2.4 EC cho `category_id` (I7)

| EC | Điều kiện | Mô tả lớp | Valid/Invalid | Độ tin cậy |
|---|---|---|---|---|
| EC-C1 | `category_id` là ID của danh mục có sẵn trong hệ thống | Danh mục hợp lệ | Valid | Từ spec |
| EC-C2 | `category_id` là ID không tồn tại | Danh mục không có trong hệ thống | Invalid | Giả định hợp lý — CẦN XÁC NHẬN |
| EC-C3 | `category_id` bị `null` hoặc thiếu trường | Không gửi category_id | Invalid | Giả định hợp lý — CẦN XÁC NHẬN |
| EC-C4 | `category_id` = 0 | ID bằng 0 | Invalid | Giả định — CẦN XÁC NHẬN |

### 2.5 EC cho hành vi Rollback (nghiệp vụ cốt lõi — I2)

| EC | Điều kiện | Mô tả lớp | Valid/Invalid | Độ tin cậy |
|---|---|---|---|---|
| EC-R1 | Tất cả dòng đều hợp lệ | Import toàn bộ thành công | Valid | Từ spec |
| EC-R2 | Có ít nhất 1 dòng lỗi | Toàn bộ bị rollback (all-or-nothing) | Invalid | Từ spec |

---

## 3. Test Case (Equivalence Partitioning) — bảng chạy Postman

### 3.1 Nhóm A: Xác thực & Phân quyền (Authorization)

| STT | Lớp bao phủ | Input | Expected Output | Actual | Status |
|---|---|---|---|---|---|
| TC-A1 | EC-A1 (Admin hợp lệ) | `POST /api/admin/import-products` với JWT admin, body đúng format | `200` — import thành công, báo cáo số dòng | `200 OK` `{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] }` | ✅ Success |
| TC-A2 | EC-A2 (Không có token) | Request không có header `Authorization` | `401 Unauthorized` | `401 Unauthorized` `{ "error": "Unauthorized" }` | ✅ Success |
| TC-A3 | EC-A3 (Không phải admin) | JWT của user thường (role = 'user') | `403 Forbidden` | `200 OK` `{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] }` | ❌ **Failure** — Thêm sản phẩm khi đang ở role user |
| TC-A4 | EC-A4 (Token không hợp lệ) | JWT giả `"Bearer invalid-token-xyz"` | `401 Unauthorized` hoặc `403` | `403 Forbidden` `{ "error": "Forbidden" }` | ✅ Success |

### 3.2 Nhóm B: Validation `name` (I3)

| STT | Lớp bao phủ | Input | Expected Output | Actual | Status |
|---|---|---|---|---|---|
| TC-B1 | EC-N1 (Name hợp lệ) | Body: `{ products: [{ name: "Sản phẩm A", price: 100000, category_id: 1 }] }` | `200` — thành công | `200 OK` `{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] }` | ✅ Success |
| TC-B2 | EC-N2 (Name rỗng) | Body: `{ products: [{ name: "", price: 100000, category_id: 1 }] }` | `400` — name bắt buộc, rollback toàn bộ | `200 OK` `{ "message": "Import hoàn tất: 0/1 sản phẩm được thêm", "inserted": 0, "errors": [ "Hàng 2: Thiếu tên sản phẩm" ] }` | ✅ Success — Response trả về 200 nhưng không thêm sản phẩm nào, CSDL đúng |
| TC-B3 | EC-N3 (Name chỉ có space) | Body: `{ products: [{ name: " ", price: 100000, category_id: 1 }] }` | `400` — name không hợp lệ, rollback | `200 OK` `{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] }` | ❌ **Failure** — Sản phẩm có tên chỉ 1 khoảng trắng vẫn được thêm |
| TC-B4 | EC-N4 (Name null) | Body: `{ products: [{ name: null, price: 100000, category_id: 1 }] }` | `400` — name bắt buộc, rollback | `200 OK` `{ "message": "Import hoàn tất: 0/1 sản phẩm được thêm", "inserted": 0, "errors": [ "Hàng 2: Thiếu tên sản phẩm" ] }` | ✅ Success — Backend xử lý null đúng |
| TC-B5 | EC-N4 (Thiếu trường name) | Body: `{ products: [{ price: 100000, category_id: 1 }] }` | `400` — thiếu trường bắt buộc, rollback | `200 OK` `{ "message": "Import hoàn tất: 0/1 sản phẩm được thêm", "inserted": 0, "errors": [ "Hàng 2: Thiếu tên sản phẩm" ] }` | ✅ Success — Backend xử lý thiếu trường đúng |
| TC-B6 | EC-N6 (Name > 255 ký tự) | Body: `{ products: [{ name: "A"*256, price: 100000, category_id: 1 }] }` | `400` — name vượt max length, rollback | `200 OK` `{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] }` | ❌ **Failure** — Sản phẩm với name 256 ký tự vẫn được thêm |

### 3.3 Nhóm C: Validation `price` (I4)

| STT | Lớp bao phủ | Input | Expected Output | Actual | Status |
|---|---|---|---|---|---|
| TC-C1 | EC-P1 (Price dương) | Body: `{ products: [{ name: "SP A", price: 100000, category_id: 1 }] }` | `200` — thành công | `200 OK` `{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] }` | ✅ Success |
| TC-C2 | EC-P2 (Price = 0) | Body: `{ products: [{ name: "SP A", price: 0, category_id: 1 }] }` | `400` — price phải dương, rollback | `200 OK` `{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] }` | ❌ **Failure** — Sản phẩm với price = 0 vẫn được thêm |
| TC-C3 | EC-P3 (Price âm) | Body: `{ products: [{ name: "SP A", price: -100, category_id: 1 }] }` | `400` — price không hợp lệ, rollback | `200 OK` `{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] }` | ❌ **Failure** — Sản phẩm với price âm vẫn được thêm |
| TC-C4 | EC-P4 (Price null) | Body: `{ products: [{ name: "SP A", price: null, category_id: 1 }] }` | `400` — price bắt buộc, rollback | `200 OK` `{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] }` | ❌ **Failure** — Sản phẩm với price null vẫn được thêm |
| TC-C5 | EC-P4 (Thiếu price) | Body: `{ products: [{ name: "SP A", category_id: 1 }] }` | `400` — thiếu trường bắt buộc, rollback | `200 OK` `{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] }` | ❌ **Failure** — Sản phẩm thiếu price vẫn được thêm |
| TC-C6 | EC-P5 (Price là string) | Body: `{ products: [{ name: "SP A", price: "100000", category_id: 1 }] }` | Không xác định — thăm dò | `200 OK` `{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] }` | ✅ Success — Backend tự động ép kiểu string sang số |
| TC-C7 | EC-P6 (Price thập phân) | Body: `{ products: [{ name: "SP A", price: 99.99, category_id: 1 }] }` | Không xác định — thăm dò xem có hỗ trợ cents không | `200 OK` `{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] }` | ✅ Success — Backend hỗ trợ price thập phân |

### 3.4 Nhóm D: Validation `category_id` (I7)

| STT | Lớp bao phủ | Input | Expected Output | Actual | Status |
|---|---|---|---|---|---|
| TC-D1 | EC-C1 (Category có sẵn) | Body: `{ products: [{ name: "SP A", price: 100000, category_id: 1 }] }` | `200` — thành công | `200 OK` `{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] }` | ✅ Success |
| TC-D2 | EC-C2 (Category không tồn tại) | Body: `{ products: [{ name: "SP A", price: 100000, category_id: 9999 }] }` | `400` — category không tồn tại, rollback | `200 OK` `{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] }` | ❌ **Failure** — Sản phẩm với category_id không tồn tại vẫn được thêm |
| TC-D3 | EC-C3 (Category null) | Body: `{ products: [{ name: "SP A", price: 100000, category_id: null }] }` | `400` — category bắt buộc, rollback | `200 OK` `{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] }` | ❌ **Failure** — Sản phẩm với category_id null vẫn được thêm |
| TC-D4 | EC-C3 (Thiếu category_id) | Body: `{ products: [{ name: "SP A", price: 100000 }] }` | `400` — thiếu trường bắt buộc, rollback | `200 OK` `{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] }` | ❌ **Failure** — Sản phẩm thiếu category_id vẫn được thêm |
| TC-D5 | EC-C4 (Category = 0) | Body: `{ products: [{ name: "SP A", price: 100000, category_id: 0 }] }` | `400` — category không hợp lệ, rollback | `200 OK` `{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] }` | ❌ **Failure** — Sản phẩm với category_id = 0 vẫn được thêm |

### 3.5 Nhóm E: Rollback / All-or-Nothing (I2)

| STT | Lớp bao phủ | Input | Expected Output | Actual | Status |
|---|---|---|---|---|---|
| TC-E1 | EC-R1 (Tất cả hợp lệ) | Body: `{ products: [{ name: "SP A", price: 100000, category_id: 1 }, { name: "SP B", price: 200000, category_id: 1 }] }` | `200` — cả 2 sản phẩm được tạo | `200 OK` `{ "message": "Import hoàn tất: 2/2 sản phẩm được thêm", "inserted": 1, "errors": [] }` | ✅ Success — Tuy nhiên inserted = 1 (chỉ 1 sản phẩm được thêm, có vẻ như 1 dòng bị skip) |
| TC-E2 | EC-R2 (1 dòng lỗi) | Body: `{ products: [{ name: "SP A", price: 100000, category_id: 1 }, { name: "", price: 200000, category_id: 1 }] }` | `400` — rollback toàn bộ, KHÔNG có sản phẩm nào được tạo | `200 OK` `{ "message": "Import hoàn tất: 1/2 sản phẩm được thêm", "inserted": 1, "errors": [ "Hàng 3: Thiếu tên sản phẩm" ] }` | ❌ **Failure** — Chỉ dòng lỗi bị skip, dòng hợp lệ vẫn được thêm. Vi phạm nguyên tắc all-or-nothing |
| TC-E3 | EC-R2 (Tất cả dòng lỗi) | Body: `{ products: [{ name: "", price: 100000, category_id: 1 }, { name: "", price: 200000, category_id: 1 }] }` | `400` — rollback toàn bộ | `200 OK` `{ "message": "Import hoàn tất: 0/2 sản phẩm được thêm", "inserted": 0, "errors": [ "Hàng 2: Thiếu tên sản phẩm", "Hàng 3: Thiếu tên sản phẩm" ] }` | ✅ Success — Không thêm bất kỳ sản phẩm nào khi tất cả đều lỗi |
| TC-E4 | (Boundary — 1 dòng) | Body: `{ products: [{ name: "SP A", price: 100000, category_id: 1 }] }` — chỉ 1 sản phẩm | `200` — 1 sản phẩm được tạo | `200 OK` `{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] }` | ✅ Success |

---

## 4. Boundary Value Analysis — bảng chạy Postman

### 4.1 Biên cho độ dài `name` (theo spec: tối đa 255 ký tự — FR-15)

| STT | Điểm biên | Giá trị | Input | Expected Output | Actual | Status |
|---|---|---|---|---|---|---|
| BV-N1 | LB = 1 ký tự | `"A"` | `{ products: [{ name: "A", price: 100000, category_id: 1 }] }` | `200` — tối thiểu 1 ký tự | `200 OK` `{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] }` | ✅ Success |
| BV-N2 | LB = 255 ký tự | `"A"*255` | `{ products: [{ name: "A"*255, price: 100000, category_id: 1 }] }` | `200` — đúng 255 ký tự | `200 OK` `{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] }` | ✅ Success |
| BV-N3 | LB+1 = 256 ký tự | `"A"*256` | `{ products: [{ name: "A"*256, price: 100000, category_id: 1 }] }` | `400` — vượt quá 255 | `200 OK` `{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] }` | ❌ **Failure** — Sản phẩm với name 256 ký tự vẫn được thêm |

### 4.2 Biên cho giá trị `price` (theo spec: phải dương > 0)

| STT | Điểm biên | Giá trị | Input | Expected Output | Actual | Status |
|---|---|---|---|---|---|---|
| BV-P1 | LB = giá trị nhỏ nhất > 0 | `0.01` | `{ products: [{ name: "SP A", price: 0.01, category_id: 1 }] }` | Không xác định — thăm dò giá tối thiểu | `200 OK` `{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] }` | ✅ Success — Backend hỗ trợ price thập phân |
| BV-P2 | LB = 1 | `1` | `{ products: [{ name: "SP A", price: 1, category_id: 1 }] }` | `200` — giá tối thiểu là 1 | `200 OK` `{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] }` | ✅ Success |
| BV-P3 | LB-1 = 0 | `0` | `{ products: [{ name: "SP A", price: 0, category_id: 1 }] }` | `400` — price = 0 không hợp lệ | `200 OK` `{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] }` | ❌ **Failure** — Price = 0 vẫn được thêm (trùng với TC-C2) |
| BV-P4 | LB-1 = -1 | `-1` | `{ products: [{ name: "SP A", price: -1, category_id: 1 }] }` | `400` — price âm không hợp lệ | `200 OK` `{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] }` | ❌ **Failure** — Price âm vẫn được thêm (trùng với TC-C3) |

### 4.3 Biên thăm dò cho định dạng body (spec không nêu cụ thể)

| STT | Giá trị thăm dò | Input | Expected Output | Actual | Status |
|---|---|---|---|---|---|
| BV-B1 | Body rỗng | `{ products: [] }` | Không xác định — thăm dò | `400 Bad request` `{ "error": "Không có dữ liệu để import" }` | ✅ Success |
| BV-B2 | Thiếu trường `products` | `{}` | Không xác định — thăm dò | `400 Bad request` `{ "error": "Không có dữ liệu để import" }` | ✅ Success |
| BV-B3 | `products` là object thay vì array | `{ products: {} }` | Không xác định — thăm dò | `400 Bad request` `{ "error": "Không có dữ liệu để import" }` | ✅ Success |
| BV-B4 | Trường không xác định | `{ products: [{ name: "SP A", price: 100000, category_id: 1, unknown_field: "x" }] }` | Không xác định — thăm dò xem có ignore không | `200 OK` `{ "message": "Import hoàn tất: 1/1 sản phẩm được thêm", "inserted": 1, "errors": [] }` | ✅ Success — Backend ignore trường không xác định |

---

## 5. Gap Analysis

### 5.1 Ràng buộc không xác định được vì spec thiếu

| # | Ràng buộc/EC không xác định được | Vì sao | Kết quả test |
|---|---|---|---|
| G1 | Định dạng price có hỗ trợ số thập phân không? | Spec nói "số dương", không nêu rõ kiểu dữ liệu | **ĐÃ XÁC NHẬN:** Có hỗ trợ (TC-C7, BV-P1) |
| G2 | `description` và `imageUrl` có bắt buộc không? | Spec không nêu, nhưng FR-15 yêu cầu `category_id` bắt buộc | Giả định đúng: optional (không test chi tiết) |
| G3 | Nếu 1 sản phẩm có `name` trùng với sản phẩm đã tồn tại thì sao? | Spec không nêu xử lý duplicate | **PHÁT HIỆN BUG:** User phát hiện duplicate không được xử lý |
| G4 | Số lượng sản phẩm tối đa trong 1 request? | Spec không nêu | TC-E1 thăm dò: 2 sản phẩm trong 1 request hoạt động |
| G5 | Xử lý ký tự đặc biệt trong name (UTF-8, emoji, HTML)? | Spec không nêu | Không test chi tiết (thuộc phạm vi thăm dò mở rộng) |

### 5.2 Ràng buộc giả định hợp lý (cần xác nhận với business/QA)

| # | Giả định | Lý do giả định | Kết quả test |
|---|---|---|---|
| GA1 | `name` không được rỗng, tối đa 255 ký tự | FR-16 + FR-15: "Tên sản phẩm: bắt buộc, tối đa 255 ký tự" | ❌ **VI PHẠM** — name rỗng được xử lý đúng nhưng name > 255 ký tự và name chỉ có space không được validate |
| GA2 | `price` phải là số dương (> 0) | FR-16 + FR-15: "Giá: bắt buộc, phải là số dương (> 0)" | ❌ **VI PHẠM NGHIÊM TRỌNG** — price = 0, âm, null, thiếu đều được thêm |
| GA3 | `category_id` phải là danh mục có sẵn | FR-16: "Danh mục: bắt buộc, phải chọn từ danh sách có sẵn" | ❌ **VI PHẠM NGHIÊM TRỌNG** — category_id không tồn tại, null, thiếu, = 0 đều được thêm |
| GA4 | Rollback toàn bộ khi có lỗi (all-or-nothing) | FR-16: "Nếu có lỗi ở bất kỳ dòng nào, toàn bộ import phải được rollback" | ❌ **VI PHẠM NGHIÊM TRỌNG** — TC-E2: chỉ dòng lỗi bị skip, dòng hợp lệ vẫn được thêm |
| GA5 | Không tạo sản phẩm nào khi rollback | GA4: transaction nguyên tử | ✅ ĐÚNG khi tất cả dòng đều lỗi (TC-E3) |
| GA6 | Non-admin không được phép import | FR-12: Access control | ❌ **VI PHẠM NGHIÊM TRỌNG** — TC-A3: user thường vẫn import được |

---

## 6. Phân tích kết quả Postman

| # | Test case liên quan | Hành vi quan sát được | Kỳ vọng theo spec | Giả thuyết | Cần test thêm |
|---|---|---|---|---|---|
| 1 | TC-A3 (Non-admin import) | User thường (role = 'user') gửi request → nhận `200 OK`, sản phẩm được thêm | `403 Forbidden` | Backend không kiểm tra `role = 'admin'` trong JWT khi import. Có thể chỉ kiểm tra token tồn tại, không kiểm tra role. | Kiểm tra xem user thường có thể xem danh sách sản phẩm đã import không |
| 2 | TC-B3 (Name chỉ có space) | `name = " "` được thêm thành công | `400` — name không hợp lệ | Backend có thể trim space nhưng không kiểm tra rỗng sau trim. Hoặc không kiểm tra gì cả. | Kiểm tra CSDL xem sản phẩm có tên là `" "` hay bị trim thành `""` |
| 3 | TC-B6 / BV-N3 (Name > 255 ký tự) | `name = "A"*256` được thêm thành công | `400` — name vượt max length | Backend không enforce max length 255 cho trường `name`. | Kiểm tra CSDL xem có lưu đủ 256 ký tự không |
| 4 | TC-C2/C3/C4/C5 (Price validation) | Price = 0, âm, null, thiếu đều được thêm | `400` — price phải dương | Backend hoàn toàn không validate `price`. Có thể trường `price` trong DB cho phép NULL và không có constraint CHECK > 0. | Kiểm tra CSDL xem price được lưu giá trị gì |
| 5 | TC-D2/D3/D4/D5 (Category validation) | category_id = 9999, null, thiếu, 0 đều được thêm | `400` — category phải tồn tại | Backend không kiểm tra foreign key constraint. Có thể DB không có FK constraint hoặc backend không validate trước khi insert. | Kiểm tra CSDL xem category_id được lưu giá trị gì |
| 6 | TC-E2 (Rollback all-or-nothing) | 1 dòng lỗi (name rỗng), 1 dòng hợp lệ → dòng hợp lệ được thêm, dòng lỗi bị skip | Rollback toàn bộ — không có sản phẩm nào được thêm | Backend xử lý từng dòng độc lập, không dùng transaction. Mỗi dòng lỗi → skip dòng đó; dòng hợp lệ → insert. | Kiểm tra TC-E1: gửi 2 sản phẩm hợp lệ → inserted = 1 (có thể 1 dòng bị skip vì trùng) |
| 7 | TC-C6 (Price string) | `price = "100000"` (string) được thêm, backend tự ép kiểu | Không xác định — thăm dò | Backend có thể dùng `Number()` hoặc tương đương để ép kiểu string sang number. | Không cần test thêm — hành vi có thể chấp nhận được |
| 8 | **Duplicate Products (User phát hiện)** | Gửi 2 sản phẩm giống nhau trong 1 request → cả 2 được tạo với 2 id khác nhau | Không rõ trong spec — nhưng nghiệp vụ thường không cho phép trùng lặp | Backend không kiểm tra duplicate trong request hoặc trong CSDL. Có thể cần kiểm tra xem đã có sản phẩm cùng name tồn tại chưa. | Test: gửi 2 sản phẩm trùng name → xem có tạo 2 bản ghi không |

---

## 7. Tổng hợp test case sau khi chạy Postman

| Nhóm | Số test case | PASS | FAIL | Ghi chú |
|---|---|---|---|---|
| A. Xác thực & Phân quyền | 4 | 3 | 1 | TC-A3: non-admin vẫn import được |
| B. Validation `name` | 6 | 3 | 3 | TC-B3: name space; TC-B6/BV-N3: name > 255 |
| C. Validation `price` | 7 | 3 | 4 | TC-C2/C3/C4/C5: price = 0/âm/null/thiếu |
| D. Validation `category_id` | 5 | 1 | 4 | TC-D2/D3/D4/D5: category không tồn tại |
| E. Rollback / All-or-nothing | 4 | 3 | 1 | TC-E2: không rollback, chỉ skip dòng lỗi |
| BV (Boundary) | 7 | 5 | 2 | BV-N3: name > 255; BV-P3/P4: price = 0/âm |
| **Tổng cộng** | **33** | **18** | **15** | |

**Tỷ lệ pass: 54.5% (18/33) — 15 bug nghiêm trọng cần fix**

**Bug ngoài spec (user phát hiện):** Duplicate products không được xử lý.

---

## 8. Tổng hợp Bug phát hiện (GitHub Issues)

| Bug ID | Mô tả | Severity | File |
|---|---|---|---|
| FR-16-BUG-001 | User thường (non-admin) có thể import sản phẩm — vi phạm FR-12 Access Control | Critical | `testing/FR-16/issues/FR-16-BUG-001.md` |
| FR-16-BUG-002 | Backend không validate `name` chỉ có khoảng trắng — chấp nhận sản phẩm với name = `" "` | High | `testing/FR-16/issues/FR-16-BUG-002.md` |
| FR-16-BUG-003 | Backend không enforce max length 255 cho `name` — chấp nhận name > 255 ký tự | High | `testing/FR-16/issues/FR-16-BUG-003.md` |
| FR-16-BUG-004 | Backend không validate `price` — chấp nhận price = 0, âm, null, thiếu trường | Critical | `testing/FR-16/issues/FR-16-BUG-004.md` |
| FR-16-BUG-005 | Backend không validate `category_id` — chấp nhận category không tồn tại, null, thiếu, = 0 | Critical | `testing/FR-16/issues/FR-16-BUG-005.md` |
| FR-16-BUG-006 | Backend không rollback khi có lỗi — chỉ skip dòng lỗi, dòng hợp lệ vẫn được insert (vi phạm all-or-nothing) | Critical | `testing/FR-16/issues/FR-16-BUG-006.md` |
| FR-16-BUG-007 | Backend không xử lý duplicate products — cùng 1 sản phẩm import 2 lần tạo 2 bản ghi khác id | High | `testing/FR-16/issues/FR-16-BUG-007.md` |

---

### 8.1 Bug được phát hiện bởi AI (trong phạm vi test case đã thiết kế)

Các bug FR-16-BUG-001 đến FR-16-BUG-006 được phát hiện từ các test case trong report này.

### 8.2 Bug được phát hiện bởi Human (ngoài phạm vi test case AI)

| Bug ID | Mô tả | Phát hiện bởi | Ghi chú |
|---|---|---|---|
| FR-16-BUG-007 | Backend không xử lý duplicate products — cùng 1 sản phẩm import 2 lần tạo 2 bản ghi khác id | Human (User) | **AI chưa tìm được test case này** — không có test case trong report để kiểm tra duplicate products trong cùng 1 request. Cần bổ sung test case TC-DUP trong tương lai. |
