# Domain Testing Report — FR-08: Thanh toán (Checkout)

## Phương pháp luận

Domain testing trong report này được thực hiện theo phương pháp **Black-box thuần**: mọi
Equivalence Class và Boundary Value được xác định chỉ dựa trên đặc tả (SRS/README) và tài
liệu hợp đồng API (OpenAPI/Postman collection), KHÔNG dựa trên việc đọc source code xử lý
logic nghiệp vụ. Các giá trị mà spec không nêu rõ được đánh dấu là "giá trị thăm dò" và sẽ
được xác nhận qua kết quả thực thi bằng Postman, không suy luận từ implementation.

---

## 0. Tài liệu đã khảo sát


| Loại tài liệu            | Nguồn                                              | Ghi chú                                               |
| ------------------------ | -------------------------------------------------- | ----------------------------------------------------- |
| SRS/README — FR-08       | `contexts/README.md` §2, dòng 102–108              | 4 quy tắc nghiệp vụ cốt lõi                           |
| SRS/README — FR-07       | `contexts/README.md` §2, dòng 93–100               | Giỏ hàng (checkout phụ thuộc giỏ hàng có sản phẩm)    |
| API Spec — Checkout      | `contexts/api_specification.md` §4.3, dòng 129–137 | Endpoint, body, header requirement                    |
| API Spec — Auth header   | `contexts/api_specification.md` §4, dòng 110–112   | Yêu cầu `Authorization: Bearer <token>`               |
| API Spec — Order details | `contexts/api_specification.md` §4.5, dòng 142–143 | `GET /api/orders/:id` — dùng để xác nhận final_amount |


---

## 1. Input & Output

### 1.1 Input


| #   | Input                            | Kiểu     | Ràng buộc (theo spec)                                                | Nguồn                                                   | Độ tin cậy                     |
| --- | -------------------------------- | -------- | -------------------------------------------------------------------- | ------------------------------------------------------- | ------------------------------ |
| I1  | JWT Token (Authorization header) | String   | Phải là token hợp lệ của user đã đăng nhập                           | `api_specification.md` §4 dòng 112                      | Từ spec                        |
| I2  | `shipping_address`               | String   | Phải có nội dung (tối thiểu 1 ký tự có nội dung thực)                | `api_specification.md` §4.3 dòng 135; `README.md` FR-08 | Giả định hợp lý — CẦN XÁC NHẬN |
| I3  | `total_amount` (trong body)      | Number   | Spec nói backend tự tính lại, không chấp nhận giá trị client gửi lên | `README.md` FR-08 dòng 107                              | Từ spec                        |
| I4  | Giỏ hàng (trạng thái)            | Implicit | Phải có ít nhất 1 sản phẩm                                           | `README.md` FR-08; suy luận nghiệp vụ                   | Giả định hợp lý — CẦN XÁC NHẬN |


### 1.2 Output


| #   | Output                        | Mô tả                                                                   | Nguồn                                                            |
| --- | ----------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------- |
| O1  | `200 OK` + thông tin đơn hàng | Checkout thành công, giỏ hàng bị xóa, `final_amount` = tổng từ giỏ hàng | `README.md` FR-08 dòng 108; suy luận nghiệp vụ                   |
| O2  | `401 Unauthorized`            | Không có token / token không hợp lệ                                     | `api_specification.md` §4 dòng 112                               |
| O3  | `400 Bad Request`             | Body không hợp lệ (shipping_address rỗng, thiếu trường bắt buộc)        | `api_specification.md` §4.3 — không nêu rõ nhưng suy luận hợp lý |
| O4  | `422` hoặc `400`              | Giỏ hàng trống (không có sản phẩm để thanh toán)                        | Không có trong spec — giá trị thăm dò                            |


---

## 2. Equivalence Classes

### 2.1 EC cho `Authorization` (I1)


| EC    | Điều kiện                                    | Mô tả lớp               | Valid/Invalid | Độ tin cậy |
| ----- | -------------------------------------------- | ----------------------- | ------------- | ---------- |
| EC-A1 | Có JWT token hợp lệ của user đã đăng nhập    | User đã authenticate    | Valid         | Từ spec    |
| EC-A2 | Không có header `Authorization`              | Request không gửi token | Invalid       | Từ spec    |
| EC-A3 | Có header nhưng token không hợp lệ / hết hạn | Token giả / đã hết hạn  | Invalid       | Từ spec    |


### 2.2 EC cho `shipping_address` (I2)


| EC    | Điều kiện                                                          | Mô tả lớp                            | Valid/Invalid       | Độ tin cậy                     |
| ----- | ------------------------------------------------------------------ | ------------------------------------ | ------------------- | ------------------------------ |
| EC-S1 | Địa chỉ giao hàng có nội dung thực (tối thiểu 1 ký tự có nội dung) | Địa chỉ hợp lệ                       | Valid               | Giả định hợp lý — CẦN XÁC NHẬN |
| EC-S2 | `shipping_address` bị rỗng (`""`)                                  | Không có địa chỉ                     | Invalid             | Giả định hợp lý — CẦN XÁC NHẬN |
| EC-S3 | `shipping_address` là `null` hoặc thiếu trường                     | Trường bị null hoặc không gửi        | Invalid             | Giả định hợp lý — CẦN XÁC NHẬN |
| EC-S4 | `shipping_address` chỉ có khoảng trắng (`" "`)                     | Trường trống nhưng không rỗng string | Invalid (edge case) | Giả định hợp lý — CẦN XÁC NHẬN |


### 2.3 EC cho `total_amount` (I3) — chỉ xét ignore và boundary zero


| EC    | Điều kiện                                               | Mô tả lớp                                                               | Valid/Invalid                 | Độ tin cậy              |
| ----- | ------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------- | ----------------------- |
| EC-T1 | `total_amount` = giá trị khác với tổng giỏ hàng thực tế | Client gửi sai — backend PHẢI ignore theo spec FR-08                    | Invalid (backend PHẢI bỏ qua) | Từ spec                 |
| EC-T2 | `total_amount = 0` — đơn hàng miễn phí                  | Edge case: giỏ hàng có sản phẩm nhưng tổng = 0 VNĐ (hoặc giảm giá 100%) | Thăm dò — xem có hỗ trợ không | Giả định — CẦN XÁC NHẬN |


> **Lưu ý:** Spec FR-08 yêu cầu "Backend phải tự tính lại tổng tiền; không chấp nhận giá trị `total_amount`
> do client gửi lên" → việc ignore là **bắt buộc**, không phải edge case. TC-B1 (EC-T1) là test case
> quan trọng nhất để xác nhận hành vi này. Các giá trị âm / cực đại của `total_amount` không test ở đây
> vì thuộc phạm vi FR-07 (giỏ hàng).

### 2.4 EC cho trạng thái giỏ hàng (I4) — điều kiện tiên quyết


| EC    | Điều kiện                      | Mô tả lớp                       | Valid/Invalid | Độ tin cậy                     |
| ----- | ------------------------------ | ------------------------------- | ------------- | ------------------------------ |
| EC-C1 | Giỏ hàng có ít nhất 1 sản phẩm | Cart có items                   | Valid         | Giả định hợp lý — CẦN XÁC NHẬN |
| EC-C2 | Giỏ hàng trống                 | Không có sản phẩm để thanh toán | Invalid       | Giả định — CẦN XÁC NHẬN        |


---

## 3. Test Case (Equivalence Partitioning) — bảng chạy Postman

### 3.1 Nhóm A: Xác thực (Authorization)


| STT   | Lớp bao phủ                | Input                                                            | Expected Output                              | Actual                                                       | Status  |
| ----- | -------------------------- | ---------------------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------ | ------- |
| TC-A1 | EC-A1 (Valid token)        | `POST /api/checkout` với JWT hợp lệ, body đúng, cart có sản phẩm | `200` — checkout thành công, giỏ hàng bị xóa | `200 - OK`{ "message": "Checkout successful", "orderId": 1 } | Success |
| TC-A2 | EC-A2 (Không có token)     | `POST /api/checkout` — không có header `Authorization`           | `401 Unauthorized`                           | `401 Unauthorized`{ "error": "Unauthorized" }                | Success |
| TC-A3 | EC-A3 (Token không hợp lệ) | `POST /api/checkout` với token giả `"Bearer invalid-token-xyz"`  | `401 Unauthorized` hoặc `403 Forbidden`      | `403 Forbidden{ "error": "Forbidden" }                       | Success |


### 3.2 Nhóm B: Total amount — kiểm tra backend có ignore client value không (QUAN TRỌNG)

> **Thứ tự ưu tiên:** Nhóm này được đặt lên đầu vì TC-B1 là test case quan trọng nhất để
> xác nhận xem backend có thực sự ignore `total_amount` từ client hay không — ảnh hưởng trực tiếp
> đến tính toàn vẹn của toàn bộ checkout. Sau khi có kết quả TC-B1, nên gọi
> `GET /api/orders/:id` để xác nhận `final_amount` trong đơn hàng.


| STT   | Lớp bao phủ               | Input                                                                                                                     | Expected Output                                                                                                                                                                                                                           | Actual                                                                                                                                                                                                                                              | Status                                                                                           |
| ----- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| TC-B1 | EC-T1 (Sai total_amount)  | Body: `{ total_amount: 1, shipping_address: "123 Lê Lợi" }` — gửi giá trị 1 VNĐ trong khi cart thực tế có giá trị lớn hơn | `200` với **đơn hàng có final_amount = tổng thực từ giỏ hàng** (backend đã ignore giá trị client). Sau đó gọi `GET /api/orders/:id` để xác nhận `final_amount` trong response đơn hàng khớp với tổng cart, không phải giá trị client gửi. | `200 OK` { "message": "Checkout successful", "orderId": 2 } `Sau khi xem đơn hàng:` `200 OK` { "id": 2, "user_id": 2, "total_amount": 1, "status": "pending", "shipping_address": "123 Lê Lợi, Q.1, TP.HCM", "created_at": "2026-07-06 04:18:56" }, | Failure - Đơn hàng đang nhận total amount từ client                                              |
| TC-B2 | EC-T1 (Đúng total_amount) | Body: `{ total_amount: <giá trị bất kỳ>, shipping_address: "..." }` — gửi đúng giá trị cart để so sánh với TC-B1          | `200` — thành công. Kết quả `final_amount` trong đơn hàng phải giống TC-B1 (cùng tổng cart).                                                                                                                                              | *(điền sau khi test bằng Postman)*                                                                                                                                                                                                                  | Failure - Do đơn hàng lấy total_amount từ client                                                 |
| TC-B3 | EC-T2 (total_amount = 0)  | Body: `{ total_amount: 0, shipping_address: "..." }` — thăm dò đơn hàng miễn phí                                          | Không xác định trước — xem backend có tạo đơn hàng với `final_amount = 0` được không                                                                                                                                                      | 200 OK { "message": "Checkout successful", "orderId": 4 }                                                                                                                                                                                           | Success ở đây total_amount vẫn lấy từ client nên đánh giá là vẫn thanh toán được đơn hàng 0 đồng |


### 3.3 Nhóm C: Giỏ hàng trống


| STT   | Lớp bao phủ              | Input                                   | Expected Output                                        | Actual                                                                                                                                                                                                             | Status                                                                                                                                                                |
| ----- | ------------------------ | --------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TC-C1 | EC-C2 (Cart trống)       | Đăng nhập → checkout khi giỏ hàng trống | `400`/`422` — không thể checkout khi không có sản phẩm | *Sau khi thực hiện chạy /api/cart để lấy giỏ hàng kết quả: 200 OK [ ] -> đơn hàng hiện tại rỗng**Sau khi thực hiện chạy* /api/checkout kể quả trả về: 200 -OK{ "message": "Checkout successful", "orderId": 3 } | Failure - vẫn checkout được khi giỏ hàng rỗng                                                                                                                         |
| TC-C2 | EC-C1 (Cart có sản phẩm) | Cart trống → thêm 1 sản phẩm → checkout | `200` — thành công                                     | *200 OK* { "message": "Checkout successful", "orderId": 5 }Tuy nhiên:Khi chạy api/cart để lấy giỏ hàng200 OK { "id": 1, "name": "Sản phẩm A", "price": 100000, "quantity": 2 }                                 | Failure - đơn hàng tiến hành tạo ra hóa đơn nhưng giỏ hàng vẫn chưa được xóa -- Có trong spec [README.md](http://README.md) của FR-08 (Agent chưa phân tích chỗ này). |


### 3.4 Nhóm D: Shipping address


| STT   | Lớp bao phủ              | Input                                                                                                     | Expected Output                      | Actual                                                       | Status                                                 |
| ----- | ------------------------ | --------------------------------------------------------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------ |
| TC-D1 | EC-S1 (Địa chỉ hợp lệ)   | Body: `{ shipping_address: "123 Lê Lợi, Q.1, TP.HCM" }` (không cần gửi total_amount — để backend tự tính) | `200` — thành công                   | `200 OK`{ "message": "Checkout successful", "orderId": 6 } | Success                                                |
| TC-D2 | EC-S2 (`""` rỗng)        | Body: `{ shipping_address: "" }`                                                                          | `400 Bad Request` — địa chỉ bắt buộc | `200 OK`{ "message": "Checkout successful", "orderId": 7 } | Failure - Không có xử lý backend cho trường địa chỉ    |
| TC-D3 | EC-S3 (`null`)           | Body: `{ shipping_address: null }`                                                                        | `400 Bad Request`                    | `200 OK`{ "message": "Checkout successful", "orderId": 8 } | Failure - Không có xử lý backend cho trường địa chỉ    |
| TC-D4 | EC-S4 (chỉ khoảng trắng) | Body: `{ shipping_address: " " }`                                                                         | `400` — coi như rỗng                 | `200 OK`{ "message": "Checkout successful", "orderId": 9 }  | Failure - Không có xử lý backend cho trường địa chỉ    |
| TC-D5 | EC-S3 (thiếu trường)     | Body: `{}` — không gửi `shipping_address`                                                                 | `400 Bad Request` — trường bắt buộc  | `200 OK`{ "message": "Checkout successful", "orderId": 10 } | Failure - Gửi body rỗng nhưng vẫn chập nhận thanh toán |


---

## 4. Boundary Value Analysis — bảng chạy Postman

### 4.1 Biên cho độ dài `shipping_address` (spec không nêu số cụ thể — giá trị thăm dò)


| STT   | Điểm biên             | Giá trị                                            | Input                                 | Expected Output                                          | Actual                                                       | Status                                                                                                   |
| ----- | --------------------- | -------------------------------------------------- | ------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| BV-S1 | Min = 1 ký tự         | `"A"`                                              | `{ shipping_address: "A" }`           | `200` — hợp lệ về mặt độ dài                             | `200 OK`{ "message": "Checkout successful", "orderId": 11 } | Success - Tuy nhiên có vẻ backend chỉ nhận thông tin về shipping_address chứ không có xử lý phần backend |
| BV-S2 | Probing: 500 ký tự    | 500 ký tự `"A"*500`                                | `{ shipping_address: "A"*500 }`       | Không xác định trước — thăm dò max length thực           | `200 OK`{ "message": "Checkout successful", "orderId": 12 } | Success - Tuy nhiên có vẻ backend chỉ nhận thông tin về shipping_address chứ không có xử lý phần backend |
| BV-S3 | Probing: 1000 ký tự   | 1000 ký tự `"A"*1000`                              | `{ shipping_address: "A"*1000 }`      | Không xác định trước — thăm dò max length                | `200 OK`{ "message": "Checkout successful", "orderId": 14 } | Success - Tuy nhiên có vẻ backend chỉ nhận thông tin về shipping_address chứ không có xử lý phần backend |
| BV-S4 | Ký tự đặc biệt / HTML | `"<script>alert(1)</script>"` hoặc `"Le\tLoi\nQ1"` | `{ shipping_address: "<script>..." }` | Không xác định trước — thăm dò sanitization / validation | `200 OK`{ "message": "Checkout successful", "orderId": 13 } | Success - Tuy nhiên có vẻ backend chỉ nhận thông tin về shipping_address chứ không có xử lý phần backend |


---

## 5. Gap Analysis

### 5.1 Ràng buộc không xác định được vì spec thiếu


| #   | Ràng buộc/EC không xác định được                               | Vì sao                                                                         | Cách xử lý                                                             |
| --- | -------------------------------------------------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| G1  | Độ dài tối thiểu / tối đa của `shipping_address`               | Spec FR-08 không nêu con số cụ thể                                             | Giá trị thăm dò: 1, 500, 1000 ký tự + ký tự đặc biệt (BV-S1..BV-S4)    |
| G2  | HTTP status code khi giỏ hàng trống                            | Spec FR-08 / api_specification không nêu                                       | TC-C1 thăm dò                                                          |
| G3  | Trường `total_amount` trong API body là bắt buộc hay optional? | `api_specification.md` §4.3 liệt kê trường này nhưng FR-08 nói backend tự tính | Thử không gửi `total_amount` trong TC-B1 — xem server phản ứng thế nào |
| G4  | Xử lý đơn hàng miễn phí (`total_amount = 0` sau khi giảm giá)  | Spec không nêu                                                                 | TC-B3 thăm dò                                                          |


### 5.2 Ràng buộc giả định hợp lý (cần xác nhận với business/QA)


| #   | Giả định                                     | Lý do giả định                                                                                        |
| --- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| GA1 | Checkout với giỏ hàng trống phải bị từ chối  | Nghiệp vụ: không thể thanh toán khi không có sản phẩm                                                 |
| GA2 | `shipping_address` không được rỗng           | Nghiệp vụ: cần địa chỉ để giao hàng                                                                   |
| GA3 | Backend phải ignore `total_amount` từ client | FR-08: "Backend phải tự tính lại tổng tiền; không chấp nhận giá trị `total_amount` do client gửi lên" |
| GA4 | Giỏ hàng bị xóa sau checkout thành công      | FR-08: "Sau thanh toán thành công, giỏ hàng được xóa"                                                 |


---

## 6. Phân tích kết quả Postman (điền sau khi có Actual/Status ở trên)


| #   | Test case liên quan           | Hành vi quan sát được | Kỳ vọng theo spec                                                 | Giả thuyết                    | Cần test thêm                                        |
| --- | ----------------------------- | --------------------- | ----------------------------------------------------------------- | ----------------------------- | ---------------------------------------------------- |
| 1   | TC-B1 (Nhóm B — Total amount) | *(điền sau khi test)* | Backend ignore `total_amount` client → `final_amount` = tổng cart | *(sẽ điền sau khi có Actual)* | Gọi `GET /api/orders/:id` để xác nhận `final_amount` |
| 2   | TC-C1 (Nhóm C — Cart trống)   | *(điền sau khi test)* | Cart trống → từ chối checkout                                     | *(sẽ điền sau khi có Actual)* | Kiểm tra message lỗi                                 |
| 3   | TC-A2                         | *(điền sau khi test)* | Không có token → `401`                                            | *(sẽ điền sau khi có Actual)* | —                                                    |
| 4   | BV-S2 / BV-S3                 | *(điền sau khi test)* | Không xác định — thăm dò max length                               | *(sẽ điền sau khi có Actual)* | Xác nhận max length thực                             |
| 5   | TC-B3 (total_amount = 0)      | *(điền sau khi test)* | Không xác định — thăm dò đơn hàng miễn phí                        | *(sẽ điền sau khi có Actual)* | Kiểm tra `final_amount = 0` được tạo không           |


---

## 7. Tổng hợp test case sau khi chạy Postman

*(Điền sau khi có Actual/Status)*


| Nhóm                                  | Số test case | PASS  | FAIL  | Cần xác nhận                                      |
| ------------------------------------- | ------------ | ----- | ----- | ------------------------------------------------- |
| A. Xác thực (Authorization)           | 3            | —     | —     | —                                                 |
| B. Total amount — backend recalculate | 3            | —     | —     | Xác nhận `final_amount` qua `GET /api/orders/:id` |
| C. Giỏ hàng trống                     | 2            | —     | —     | —                                                 |
| D. Shipping address                   | 5            | —     | —     | —                                                 |
| BV-S (biên shipping address)          | 4            | —     | —     | —                                                 |
| **Tổng cộng**                         | **17**       | **—** | **—** | —                                                 |


---

## 8. Tổng hợp Bug phát hiện (GitHub Issues)

*(Điền sau khi phân tích kết quả Postman)*


| Bug ID        | Mô tả                          | Severity | File               |
| ------------- | ------------------------------ | -------- | ------------------ |
| FR-08-BUG-001 | *(điền sau khi phát hiện bug)* | —        | *(đường dẫn file)* |


