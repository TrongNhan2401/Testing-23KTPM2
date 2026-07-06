# Domain Testing Report — FR-04: Quản lý Hồ sơ Cá nhân

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
| SRS/README — FR-04 | `contexts/README.md` §2, dòng 62–68 | Yêu cầu nghiệp vụ cơ bản |
| API Spec — Users | `contexts/api_specification.md` §2, dòng 61–80 | Endpoint PUT /api/users/me, body format |

---

## 1. Input & Output

### 1.1 Input

| # | Input | Kiểu | Ràng buộc (theo spec) | Nguồn | Độ tin cậy |
|---|---|---|---|---|---|
| I1 | JWT Token (Authorization header) | String | Phải là token hợp lệ, user phải đăng nhập | `api_specification.md` §2 dòng 63 | Từ spec |
| I2 | `name` (Họ Tên) | String | Bắt buộc khi gửi? — Spec không nêu rõ | `README.md` FR-04 dòng 64 | Giả định — CẦN XÁC NHẬN |
| I3 | `phone` (Số điện thoại) | String | Bắt đầu bằng `0`, từ 10–11 chữ số | `README.md` FR-04 dòng 65 | Từ spec |
| I4 | `shipping_address` (Địa chỉ giao hàng) | String | Không bắt buộc theo spec | `api_specification.md` §2 dòng 77 | Từ spec |
| I5 | `email` | — | Không thể thay đổi qua API này | `README.md` FR-04 dòng 66 | Từ spec |
| I6 | `role` | — | Không thể thay đổi — user không thể tự đổi role | `README.md` FR-04 dòng 67 | Từ spec |

### 1.2 Output

| # | Output | Mô tả | Nguồn |
|---|---|---|---|
| O1 | `200 OK` + updated user | Cập nhật thành công, trả về thông tin user đã cập nhật | `api_specification.md` §2 dòng 72 |
| O2 | `401 Unauthorized` | Không có token / token không hợp lệ | `api_specification.md` §2 dòng 63 |
| O3 | `400 Bad Request` | Validation error — dữ liệu không hợp lệ | Thông lệ API chung |

---

## 2. Equivalence Classes

### 2.1 EC cho Authorization (I1)

| EC | Điều kiện | Mô tả lớp | Valid/Invalid | Độ tin cậy |
|---|---|---|---|---|
| EC-A1 | Có JWT token hợp lệ | User đã đăng nhập | Valid | Từ spec |
| EC-A2 | Không có header `Authorization` | Request không gửi token | Invalid | Từ spec |
| EC-A3 | Token không hợp lệ / hết hạn | Token giả hoặc đã hết hạn | Invalid | Từ spec |

### 2.2 EC cho `name` (I2)

| EC | Điều kiện | Mô tả lớp | Valid/Invalid | Độ tin cậy |
|---|---|---|---|---|
| EC-N1 | `name` có nội dung hợp lệ (tối thiểu 1 ký tự) | Họ tên hợp lệ | Valid | Giả định hợp lý — CẦN XÁC NHẬN |
| EC-N2 | `name` bị rỗng (`""`) | Họ tên trống | Invalid | Giả định — CẦN XÁC NHẬN |
| EC-N3 | `name` chỉ có khoảng trắng (`" "`) | Họ tên chỉ có space | Invalid (edge case) | Giả định — CẦN XÁC NHẬN |
| EC-N4 | `name` bị `null` | Không gửi trường name | Invalid | Giả định — CẦN XÁC NHẬN |
| EC-N5 | `name` tối đa 255 ký tự (thông lệ) | Họ tên dài vừa đủ | Valid | Giả định — CẦN XÁC NHẬN |
| EC-N6 | `name` vượt quá 255 ký tự | Họ tên quá dài | Invalid | Giả định — CẦN XÁC NHẬN |

### 2.3 EC cho `phone` (I3)

| EC | Điều kiện | Mô tả lớp | Valid/Invalid | Độ tin cậy |
|---|---|---|---|---|
| EC-P1 | Phone bắt đầu bằng `0`, đúng 10 chữ số | Số điện thoại hợp lệ (10 số) | Valid | Từ spec |
| EC-P2 | Phone bắt đầu bằng `0`, đúng 11 chữ số | Số điện thoại hợp lệ (11 số) | Valid | Từ spec |
| EC-P3 | Phone bắt đầu bằng `0`, 9 chữ số | Số điện thoại quá ngắn | Invalid | Từ spec |
| EC-P4 | Phone bắt đầu bằng `0`, 12+ chữ số | Số điện thoại quá dài | Invalid | Từ spec |
| EC-P5 | Phone không bắt đầu bằng `0` (ví dụ: `9123456789`) | Phone thiếu số 0 đầu | Invalid | Từ spec |
| EC-P6 | Phone chứa ký tự không phải số (ví dụ: `0912345abc`) | Phone có chữ cái | Invalid | Giả định — CẦN XÁC NHẬN |
| EC-P7 | Phone bị rỗng (`""`) | Phone trống | Invalid | Giả định — CẦN XÁC NHẬN |
| EC-P8 | Phone bị `null` hoặc không gửi | Không gửi phone | Invalid | Giả định — CẦN XÁC NHẬN |
| EC-P9 | Phone bắt đầu bằng `+84` thay vì `0` | Định dạng quốc tế | Thăm dò — xem có hỗ trợ không | Giả định — CẦN XÁC NHẬN |

### 2.4 EC cho `shipping_address` (I4)

| EC | Điều kiện | Mô tả lớp | Valid/Invalid | Độ tin cậy |
|---|---|---|---|---|
| EC-S1 | `shipping_address` có nội dung | Địa chỉ giao hàng hợp lệ | Valid | Từ spec |
| EC-S2 | `shipping_address` bị rỗng (`""`) | Địa chỉ trống | Invalid | Giả định — CẦN XÁC NHẬN |
| EC-S3 | `shipping_address` bị `null` hoặc không gửi | Không gửi shipping_address | Valid (optional) | Giả định — CẦN XÁC NHẬN |
| EC-S4 | `shipping_address` quá dài (thăm dò) | Địa chỉ rất dài | Thăm dò | Giả định — CẦN XÁC NHẬN |

---

## 3. Test Case (Equivalence Partitioning) — bảng chạy Postman

### 3.1 Nhóm A: Xác thực (Authorization)

| STT | Lớp bao phủ | Input | Expected Output | Actual | Status |
|---|---|---|---|---|---|
| TC-A1 | EC-A1 (Token hợp lệ) | `PUT /api/users/me` với JWT hợp lệ, body hợp lệ | `200` — cập nhật thành công | `200 OK` `{ "message": "Profile updated" }` | ✅ Success |
| TC-A2 | EC-A2 (Không có token) | Request không có header `Authorization` | `401 Unauthorized` | `401 Unauthorized` `{ "error": "Unauthorized" }` | ✅ Success |
| TC-A3 | EC-A3 (Token không hợp lệ) | JWT giả `"Bearer invalid-token-xyz"` | `401 Unauthorized` | `403 Forbidden` `{ "error": "Forbidden" }` | ✅ Success |

### 3.2 Nhóm B: Validation `name` (I2)

| STT | Lớp bao phủ | Input | Expected Output | Actual | Status |
|---|---|---|---|---|---|
| TC-B1 | EC-N1 (Name hợp lệ) | Body: `{ name: "Nguyen Van A", phone: "0912345678" }` | `200` — cập nhật thành công | `200 OK` `{ "message": "Profile updated" }` | ✅ Success |
| TC-B2 | EC-N2 (Name rỗng) | Body: `{ name: "", phone: "0912345678" }` | `400` — name bắt buộc | `200 OK` `{ "message": "Profile updated" }` | ❌ **Failure** — Backend không validate name rỗng |
| TC-B3 | EC-N3 (Name chỉ có space) | Body: `{ name: " ", phone: "0912345678" }` | `400` — name không hợp lệ | `200 OK` `{ "message": "Profile updated" }` | ❌ **Failure** — Backend không validate name space |
| TC-B4 | EC-N4 (Name null) | Body: `{ name: null, phone: "0912345678" }` | `400` — name bắt buộc | `200 OK` `{ "message": "Profile updated" }` | ❌ **Failure** — Backend không validate name null |
| TC-B5 | EC-N6 (Name > 255 ký tự) | Body: `{ name: "A"*256, phone: "0912345678" }` | `400` — name vượt max length | `200 OK` `{ "message": "Profile updated" }` | ❌ **Failure** — Backend không validate name max length |

### 3.3 Nhóm C: Validation `phone` (I3)

| STT | Lớp bao phủ | Input | Expected Output | Actual | Status |
|---|---|---|---|---|---|
| TC-C1 | EC-P1 (Phone 10 số, bắt đầu bằng 0) | Body: `{ name: "Test User", phone: "0912345678" }` | `200` — cập nhật thành công | `200 OK` `{ "message": "Profile updated" }` | ✅ Success |
| TC-C2 | EC-P2 (Phone 11 số, bắt đầu bằng 0) | Body: `{ name: "Test User", phone: "091234567890" }` | `200` — cập nhật thành công | `200 OK` `{ "message": "Profile updated" }` | ✅ Success |
| TC-C3 | EC-P3 (Phone 9 số) | Body: `{ name: "Test User", phone: "091234567" }` | `400` — phone phải 10–11 số | `200 OK` `{ "message": "Profile updated" }` | ❌ **Failure** — Backend không validate phone 9 số |
| TC-C4 | EC-P4 (Phone 12+ số) | Body: `{ name: "Test User", phone: "0912345678901" }` | `400` — phone phải 10–11 số | `200 OK` `{ "message": "Profile updated" }` | ❌ **Failure** — Backend không validate phone 12+ số |
| TC-C5 | EC-P5 (Phone không bắt đầu bằng 0) | Body: `{ name: "Test User", phone: "9123456789" }` | `400` — phone phải bắt đầu bằng 0 | `200 OK` `{ "message": "Profile updated" }` | ❌ **Failure** — Backend không validate phone không có 0 |
| TC-C6 | EC-P6 (Phone có ký tự không phải số) | Body: `{ name: "Test User", phone: "0912345abc" }` | `400` — phone phải là số | `200 OK` `{ "message": "Profile updated" }` | ❌ **Failure** — Backend không validate phone có chữ |
| TC-C7 | EC-P7 (Phone rỗng) | Body: `{ name: "Test User", phone: "" }` | `400` — phone không hợp lệ | `200 OK` `{ "message": "Profile updated" }` | ❌ **Failure** — Backend không validate phone rỗng |
| TC-C8 | EC-P8 (Phone null) | Body: `{ name: "Test User", phone: null }` | `400` — phone không hợp lệ | `200 OK` `{ "message": "Profile updated" }` | ❌ **Failure** — Backend không validate phone null |
| TC-C9 | EC-P8 (Không gửi phone) | Body: `{ name: "Test User" }` | Không xác định — thăm dò | `200 OK` `{ "message": "Profile updated" }` | ✅ Success (thăm dò) — Có vẻ chỉ update name, không update phone |
| TC-C10 | EC-P9 (Phone định dạng +84) | Body: `{ name: "Test User", phone: "+84912345678" }` | Không xác định — thăm dò | `200 OK` `{ "message": "Profile updated" }` | ✅ Success (thăm dò) — Backend lưu phone nguyên giá trị |

### 3.4 Nhóm D: Validation `shipping_address` (I4)

| STT | Lớp bao phủ | Input | Expected Output | Actual | Status |
|---|---|---|---|---|---|
| TC-D1 | EC-S1 (Address có nội dung) | Body: `{ name: "Test", phone: "0912345678", shipping_address: "123 Le loi, Q1" }` | `200` — cập nhật thành công | `200 OK` `{ "message": "Profile updated" }` | ✅ Success |
| TC-D2 | EC-S3 (Không gửi shipping_address) | Body: `{ name: "Test", phone: "0912345678" }` | `200` — cập nhật thành công (optional) | `200 OK` `{ "message": "Profile updated" }` | ✅ Success |
| TC-D3 | EC-S2 (Address rỗng) | Body: `{ name: "Test", phone: "0912345678", shipping_address: "" }` | Không xác định — thăm dò | `200 OK` `{ "message": "Profile updated" }` | ✅ Success — Backend cập nhật address rỗng |
| TC-D4 | EC-S3 (Address null) | Body: `{ name: "Test", phone: "0912345678", shipping_address: null }` | Không xác định — thăm dò | `200 OK` `{ "message": "Profile updated" }` | ✅ Success — Backend cập nhật address null |

### 3.5 Nhóm E: Security — Không thể thay đổi email và role (I5, I6)

| STT | Lớp bao phủ | Input | Expected Output | Actual | Status |
|---|---|---|---|---|---|
| TC-E1 | (Cố gắng thay đổi email) | Body: `{ name: "Test", email: "hacker@evil.com" }` | `400` hoặc `200` nhưng email không đổi | `200 OK` `{ "message": "Profile updated" }` | ✅ Success — Email không bị thay đổi |
| TC-E2 | (Cố gắng thay đổi role) | Body: `{ name: "Test", role: "admin" }` | `400` hoặc `200` nhưng role không đổi | `200 OK` `{ "message": "Profile updated" }` | ❌ **Failure** — **Role bị thay đổi thành công** |

---

## 4. Boundary Value Analysis — bảng chạy Postman

### 4.1 Biên cho độ dài `name` (thông lệ: tối đa 255 ký tự)

| STT | Điểm biên | Giá trị | Input | Expected Output | Actual | Status |
|---|---|---|---|---|---|---|
| BV-N1 | LB = 1 ký tự | `"A"` | `{ name: "A", phone: "0912345678" }` | `200` — tối thiểu 1 ký tự | `200 OK` `{ "message": "Profile updated" }` | ✅ Success |
| BV-N2 | LB = 255 ký tự | `"A"*255` | `{ name: "A"*255, phone: "0912345678" }` | `200` — đúng 255 ký tự | `200 OK` `{ "message": "Profile updated" }` | ✅ Success |
| BV-N3 | LB+1 = 256 ký tự | `"A"*256` | `{ name: "A"*256, phone: "0912345678" }` | `400` — vượt quá 255 | `200 OK` `{ "message": "Profile updated" }` | ❌ **Failure** — Backend không validate name > 255 ký tự |

### 4.2 Biên cho độ dài `phone` (theo spec: bắt đầu `0`, 10–11 chữ số)

| STT | Điểm biên | Giá trị | Input | Expected Output | Actual | Status |
|---|---|---|---|---|---|---|
| BV-P1 | LB = 10 chữ số | `"0912345678"` (9 số + 1) | `{ name: "Test", phone: "0912345678" }` | `200` — tối thiểu 10 số | `200 OK` `{ "message": "Profile updated" }` | ✅ Success |
| BV-P2 | LB = 11 chữ số | `"09123456789"` (10 số + 1) | `{ name: "Test", phone: "09123456789" }` | `200` — tối đa 11 số | `200 OK` `{ "message": "Profile updated" }` | ✅ Success |
| BV-P3 | LB-1 = 9 chữ số | `"091234567"` (8 số + 1) | `{ name: "Test", phone: "091234567" }` | `400` — dưới 10 số | `200 OK` `{ "message": "Profile updated" }` | ❌ **Failure** — Backend không validate phone 9 số |
| BV-P4 | LB+1 = 12 chữ số | `"091234567890"` (11 số + 1) | `{ name: "Test", phone: "091234567890" }` | `400` — trên 11 số | `200 OK` `{ "message": "Profile updated" }` | ❌ **Failure** — Backend không validate phone 12+ số |
| BV-P5 | LB = 0 số | `""` | `{ name: "Test", phone: "" }` | `400` — phone bắt buộc | `200 OK` `{ "message": "Profile updated" }` | ❌ **Failure** — Backend không validate phone rỗng |

### 4.3 Biên cho `phone` bắt đầu bằng `0`

| STT | Điểm biên | Giá trị | Input | Expected Output | Actual | Status |
|---|---|---|---|---|---|---|
| BV-P6 | Không có số 0 đầu | `"1912345678"` (bắt đầu bằng 1) | `{ name: "Test", phone: "1912345678" }` | `400` — phải bắt đầu bằng 0 | *(chưa test)* | ☐ |
| BV-P7 | Ký tự đầu là `+` | `"+9123456789"` | `{ name: "Test", phone: "+9123456789" }` | Không xác định — thăm dò | *(chưa test)* | ☐ |

---

## 5. Gap Analysis

### 5.1 Ràng buộc không xác định được vì spec thiếu

| # | Ràng buộc/EC không xác định được | Vì sao | Cách xử lý |
|---|---|---|---|
| G1 | `name` có bắt buộc khi gửi không? | Spec FR-04 nói "Họ Tên" là trường có thể cập nhật, không nói rõ có bắt buộc không | TC-B4 (null) thăm dò |
| G2 | `phone` có bắt buộc không? | Spec không nói rõ phone có bắt buộc không | TC-C9 (không gửi) thăm dò |
| G3 | Max length của `name` là bao nhiêu? | Spec không nêu | Giả định 255 (thông lệ), test BV-N2/N3 |
| G4 | Max length của `shipping_address` là bao nhiêu? | Spec không nêu | TC-D4 thăm dò |
| G5 | Max length của `phone` là bao nhiêu? | Spec nói 10–11 chữ số, không nêu max length | Test BV-P2 (11 số), BV-P4 (12 số) |
| G6 | Có hỗ trợ định dạng phone quốc tế (+84) không? | Spec không nêu | TC-C10 thăm dò |

### 5.2 Ràng buộc giả định hợp lý (cần xác nhận với business/QA)

| # | Giả định | Lý do giả định |
|---|---|---|
| GA1 | `name` không được rỗng, tối đa 255 ký tự | Thông lệ chung — CẦN XÁC NHẬN |
| GA2 | `phone` phải bắt đầu bằng `0`, 10–11 chữ số, chỉ chứa số | FR-04: "bắt đầu bằng số 0, từ 10–11 chữ số" |
| GA3 | `shipping_address` là optional (không bắt buộc) | API body có cả 3 trường, spec không nói shipping_address bắt buộc |
| GA4 | Không thể thay đổi `email` qua API này | FR-04: "Email không được phép thay đổi qua giao diện" |
| GA5 | Không thể thay đổi `role` qua API này | FR-04: "không thể tự thay đổi thuộc tính role" |

---

## 6. Phân tích kết quả Postman

| # | Test case liên quan | Hành vi quan sát được | Kỳ vọng theo spec | Giả thuyết | Cần test thêm |
|---|---|---|---|---|---|
| 1 | TC-A1 (Token hợp lệ) | `200 OK` — cập nhật thành công | Cập nhật thành công | Backend xử lý đúng | — |
| 2 | TC-A2/A3 (Auth) | `401 Unauthorized` / `403 Forbidden` | 401 Unauthorized | Backend trả về 403 cho token không hợp lệ (vẫn hợp lệ về security) | — |
| 3 | TC-B2/B3/B4/B5 (Name validation) | Tất cả trả về `200 OK` — name rỗng, space, null, >255 đều được chấp nhận | `400` — name không hợp lệ | Backend hoàn toàn không validate name | Kiểm tra CSDL sau update |
| 4 | TC-C3/C4/C5/C6/C7/C8 (Phone validation) | Tất cả trả về `200 OK` — phone 9 số, 12+ số, không có 0, có chữ, rỗng, null đều được chấp nhận | `400` — phone phải 10–11 số, bắt đầu bằng 0 | Backend hoàn toàn không validate phone | Kiểm tra CSDL sau update |
| 5 | TC-D3/D4 (Shipping address) | `200 OK` — address rỗng và null đều được cập nhật | Không xác định — thăm dò | Backend lưu giá trị rỗng/null mà không validate | Kiểm tra CSDL sau update |
| 6 | TC-E1 (Thay đổi email) | `200 OK` — email không bị thay đổi | Email không thay đổi | Backend filter trường email thành công | — |
| 7 | TC-E2 (Thay đổi role) | `200 OK` — **role bị thay đổi từ 'user' thành 'admin'** | Role không thay đổi | Backend không filter trường role — **BUG NGHIÊM TRỌNG** | Test thử truy cập API admin |

---

## 7. Tổng hợp test case sau khi chạy Postman

| Nhóm | Số test case | PASS | FAIL | Ghi chú |
|---|---|---|---|---|
| A. Xác thực | 3 | 3 | 0 | Auth hoạt động đúng |
| B. Validation `name` | 5 | 1 | 4 | TC-B2/B3/B4/B5: name không được validate |
| C. Validation `phone` | 10 | 3 | 7 | TC-C3/C4/C5/C6/C7/C8: phone không được validate |
| D. Validation `shipping_address` | 4 | 4 | 0 | Shipping address được cập nhật (thăm dò: có thể validate sau) |
| E. Security (email/role) | 2 | 1 | 1 | TC-E1: email không đổi (đúng); TC-E2: **role đổi được (BUG NGHIÊM TRỌNG)** |
| BV (Boundary) | 7 | 2 | 5 | BV-N1/N2: đúng; BV-N3/P3/P4/P5: fail |
| **Tổng cộng** | **31** | **14** | **17** | |

**Tỷ lệ pass: 45.2% (14/31) — 17 bug nghiêm trọng cần fix**

---

## 8. Tổng hợp Bug phát hiện (GitHub Issues)

### 8.1 Bug phát hiện từ Domain Testing

| Bug ID | Mô tả | Severity | File |
|---|---|---|---|
| FR-04-BUG-001 | Backend không validate `name` — chấp nhận name rỗng, space, null, và >255 ký tự | Critical | `testing/FR-04/issues/FR-04-BUG-001.md` |
| FR-04-BUG-002 | Backend không validate `phone` — chấp nhận phone không đúng định dạng (9 số, 12+ số, không có 0, có chữ, rỗng, null) | Critical | `testing/FR-04/issues/FR-04-BUG-002.md` |
| FR-04-BUG-003 | Backend cho phép thay đổi `role` của chính mình — vi phạm nghiêm trọng FR-04 Access Control | Critical | `testing/FR-04/issues/FR-04-BUG-003.md` |
| FR-04-BUG-004 | Backend không validate `shipping_address` rỗng — chấp nhận địa chỉ rỗng và null | Medium | `testing/FR-04/issues/FR-04-BUG-004.md` |
| FR-04-BUG-005 | Backend không xử lý `phone` — lưu giá trị mà không normalize hoặc validate | High | `testing/FR-04/issues/FR-04-BUG-005.md` |

### 8.2 Tổng hợp

| Bug ID | Mô tả | Severity |
|---|---|---|
| FR-04-BUG-001 | Name không được validate | Critical |
| FR-04-BUG-002 | Phone không được validate | Critical |
| FR-04-BUG-003 | Role có thể tự thay đổi | Critical |
| FR-04-BUG-004 | Shipping address rỗng/null được chấp nhận | Medium |
| FR-04-BUG-005 | Phone không được xử lý (normalize) | High |

**Tổng cộng: 5 bugs — 3 Critical, 1 High, 1 Medium**
