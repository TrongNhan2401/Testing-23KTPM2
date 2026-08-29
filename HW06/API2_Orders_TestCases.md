# TẬP TEST CASE API 2 — GET /api/orders/my-orders (FR-11: Lịch sử Đơn hàng Cá nhân)

> **Mã API:** API-02 (Pool B)  
> **Endpoint:** `GET /api/orders/my-orders`  
> **Mục tiêu:** Kiểm thử chức năng truy xuất lịch sử đơn hàng của người dùng đang đăng nhập, kiểm thử bảo mật IDOR (SEC-03), xác thực JWT Token (SEC-01/02) và kiểm thử Schema Response.

---

## 1. DANH SÁCH 35 TEST CASES DO AI TẠO & KẾT QUẢ KIỂM TOÁN (HUMAN AUDIT LOG)

| TestID | Kỹ thuật (Technique) | Mô tả Test Case | Header / Query Parameters | Status Code Mong Đợi | Assertions / Expected Response | Đánh giá Audit (Human Review) | Ghi chú Audit / Nhận xét phản biện của Sinh viên (MSSV: 23127443) |
| :--- | :--- | :--- | :--- | :---: | :--- | :---: | :--- |
| **TC01** | Domain / Valid | Lấy danh sách đơn hàng với Token hợp lệ (User có đơn) | `Authorization: Bearer <valid_user_token>` | `200 OK` | Trả về mảng danh sách đơn hàng của user, `Array.isArray() == true`. | **VALID** | Giữ nguyên. Khớp Spec 4.4 và FR-11. |
| **TC02** | Domain / Valid | Lấy danh sách đơn hàng với User chưa từng mua hàng | `Authorization: Bearer <new_user_token>` | `200 OK` | Trả về mảng rỗng `[]`, không báo lỗi. | **VALID** | Giữ nguyên. |
| **TC03** | Security / SEC-01 | Gửi Request không truyền Header `Authorization` | *(Không truyền Header)* | `401 Unauthorized` | Trả về lỗi thiếu xác thực danh tính. | **VALID** | Giữ nguyên. Bắt buộc theo Spec 4.4 & SEC-02. |
| **TC04** | Security / SEC-01 | Gửi Header `Authorization` với Token bị sai định dạng | `Authorization: Bearer invalid_token_123` | `401 Unauthorized` | Hệ thống từ chối Token không hợp lệ. | **VALID** | Giữ nguyên. |
| **TC05** | Security / SEC-01 | Gửi Header `Authorization` thiếu từ khóa `Bearer` | `Authorization: <valid_token>` | `401 Unauthorized` | Hệ thống yêu cầu đúng chuẩn `Bearer <token>`. | **VALID** | Giữ nguyên. |
| **TC06** | Security / SEC-02 | Gửi Request với Token đã hết hạn | `Authorization: Bearer <expired_token>` | `401 Unauthorized` | Token hết hạn bị từ chối. | **VALID** | Giữ nguyên. |
| **TC07** | Security / IDOR | Cố tình truyền `?user_id=999` để xem đơn của người khác | `Authorization: Bearer <user_A_token>` & `?user_id=999` | `200 OK` | **Bảo mật (SEC-03):** Server bỏ qua param `user_id`, chỉ trả về đơn của User A. | **VALID** | Giữ nguyên. Kiểm thử chống IDOR cốt lõi. |
| **TC08** | Security / IDOR | Cố tình truyền `user_id` của Admin trong Query String | `Authorization: Bearer <user_token>` & `?user_id=1` | `200 OK` | Không bị lỗi IDOR, không lộ đơn hàng của Admin. | **VALID** | Giữ nguyên. |
| **TC09** | Domain / Hallucinated | Lọc đơn hàng theo trạng thái `pending` | `?status=pending` | `200 OK` | Trả về mảng các đơn có `status == 'pending'`. | **INVALID** | **AI Hallucination:** Spec 4.4 không khai báo bất kỳ Query Param nào (không có `?status=`). AI tự suy đoán. |
| **TC10** | Domain / Hallucinated | Lọc đơn hàng theo trạng thái `confirmed` | `?status=confirmed` | `200 OK` | Trả về mảng các đơn có `status == 'confirmed'`. | **INVALID** | **AI Hallucination:** Spec không hỗ trợ param `status`. |
| **TC11** | Domain / Hallucinated | Lọc đơn hàng theo trạng thái `shipping` | `?status=shipping` | `200 OK` | Trả về mảng các đơn có `status == 'shipping'`. | **INVALID** | **AI Hallucination:** Spec không hỗ trợ param `status`. |
| **TC12** | Domain / Hallucinated | Lọc đơn hàng theo trạng thái `delivered` | `?status=delivered` | `200 OK` | Trả về mảng các đơn có `status == 'delivered'`. | **INVALID** | **AI Hallucination:** Spec không hỗ trợ param `status`. |
| **TC13** | Domain / Hallucinated | Lọc đơn hàng theo trạng thái `canceled` | `?status=canceled` | `200 OK` | Trả về mảng các đơn có `status == 'canceled'`. | **INVALID** | **AI Hallucination:** Spec không hỗ trợ param `status`. |
| **TC14** | Domain / Hallucinated | Lọc đơn hàng với trạng thái không tồn tại | `?status=invalid_status` | `200 OK` / `400` | Trả về mảng rỗng `[]` hoặc lỗi validation status. | **INVALID** | **AI Hallucination:** Spec 4.4 không khai báo param `status`. |
| **TC15** | Domain / Hallucinated | Lọc đơn hàng với `status` viết hoa `PENDING` | `?status=PENDING` | `200 OK` | Xử lý linh hoạt case-insensitive hoặc trả rỗng. | **INVALID** | **AI Hallucination:** Spec không hỗ trợ param `status`. |
| **TC16** | Dataflow | Xem lịch sử đơn hàng ngay sau khi Checkout thành công | `Authorization: Bearer <token>` | `200 OK` | Đơn hàng mới tạo xuất hiện đầu tiên với `status == 'pending'`. | **VALID** | Giữ nguyên. Kiểm thử luồng dữ liệu hợp lệ. |
| **TC17** | Dataflow | Kiểm tra lịch sử sau khi Admin đổi trạng thái sang `confirmed` | `Authorization: Bearer <token>` | `200 OK` | Trạng thái đơn hàng tương ứng cập nhật sang `confirmed`. | **VALID** | Giữ nguyên. |
| **TC18** | Dataflow | Kiểm tra lịch sử sau khi User hủy đơn thành công | `Authorization: Bearer <token>` | `200 OK` | Đơn vừa hủy chuyển trạng thái thành `canceled`. | **VALID** | Giữ nguyên. |
| **TC19** | Security / SQLi | SQL Injection trong tham số status | `?status=' OR '1'='1` | `200 OK` / `400` | **Bảo mật:** Escape câu SQL, không lộ đơn hàng của người khác. | **INCOMPLETE** | AI thiếu assertion check không lộ dữ liệu chéo user. Sửa lại check UserID. |
| **TC20** | Security / SQLi | SQL Injection với comment | `?status=pending'--` | `200 OK` | Xử lý an toàn, trả về mảng rỗng `[]`. | **VALID** | Giữ nguyên. |
| **TC21** | Security / XSS | Reflected XSS trong query status | `?status=<script>alert(1)</script>` | `200 OK` / `400` | Escape HTML entities an toàn. | **VALID** | Giữ nguyên. |
| **TC22** | Security | Token của User A dùng gửi request với Header `X-Forwarded-For` giả | Header `X-Forwarded-For: 127.0.0.1` | `200 OK` | Vẫn trả về đúng danh sách đơn của User A. | **VALID** | Giữ nguyên. |
| **TC23** | Security | Gửi Request bằng Token của Admin | `Authorization: Bearer <admin_token>` | `200 OK` | Trả về mảng các đơn của Admin (nếu có) hoặc mảng `[]`. | **VALID** | Giữ nguyên. |
| **TC24** | Domain / Valid | Kiểm tra thứ tự sắp xếp đơn hàng | `Authorization: Bearer <token>` | `200 OK` | Đơn hàng mới hơn xếp lên trên (Giảm dần theo `created_at` / `id`). | **VALID** | Giữ nguyên. |
| **TC25** | Domain / Hallucinated | Truyền tham số phân trang âm | `?page=-1&limit=-5` | `400 Bad Request` | Lỗi validation phân trang không hợp lệ. | **INVALID** | **AI Hallucination:** Spec 4.4 không quy định các param phân trang `page`/`limit`. |
| **TC26** | Security | Gửi Request với HTTP Method `POST` tới endpoint này | `POST /api/orders/my-orders` | `404` / `405` | Endpoint không hỗ trợ method POST. | **VALID** | Giữ nguyên. |
| **TC27** | Security | Gửi Request với HTTP Method `DELETE` | `DELETE /api/orders/my-orders` | `404` / `405` | Endpoint không hỗ trợ method DELETE. | **VALID** | Giữ nguyên. |
| **TC28** | Schema | Xác thực JSON Schema tổng thể response | `Authorization: Bearer <token>` | `200 OK` | Match JSON Schema mảng đối tượng đơn hàng. | **VALID** | Giữ nguyên. |
| **TC29** | Schema | Kiểu dữ liệu trường `id` trong mỗi đơn hàng | `Authorization: Bearer <token>` | `200 OK` | `typeof id === 'number'`, là số nguyên positive. | **VALID** | Giữ nguyên. |
| **TC30** | Schema | Kiểu dữ liệu trường `total_amount` | `Authorization: Bearer <token>` | `200 OK` | `typeof total_amount === 'number'`, $total \ge 0$. | **VALID** | Giữ nguyên. |
| **TC31** | Schema | Kiểu dữ liệu trường `shipping_address` | `Authorization: Bearer <token>` | `200 OK` | `typeof shipping_address === 'string'`. | **VALID** | Giữ nguyên. |
| **TC32** | Schema | Ràng buộc enum cho trường `status` | `Authorization: Bearer <token>` | `200 OK` | `status` thuộc tập `['pending', 'confirmed', 'shipping', 'delivered', 'canceled']`. | **VALID** | Giữ nguyên. Khớp FR-10. |
| **TC33** | Schema | Kiểm tra trường ngày tạo `created_at` | `Authorization: Bearer <token>` | `200 OK` | `created_at` là chuỗi ISO Date hợp lệ. | **VALID** | Giữ nguyên. |
| **TC34** | Schema | Kiểm tra mảng sản phẩm `items` lồng bên trong đơn | `Authorization: Bearer <token>` | `200 OK` | `Array.isArray(order.items) == true`. | **VALID** | Giữ nguyên. |
| **TC35** | Schema | Kiểm tra Response Header `Content-Type` | `Authorization: Bearer <token>` | `200 OK` | `Content-Type` chứa `application/json`. | **VALID** | Giữ nguyên. |

---

## 2. BẢNG 5 TEST CASES MỞ RỘNG DO CON NGƯỜI THIẾT KẾ (EXTEND)

| TestID | Mô tả Test Case | Tham số / Request | Expected Result | **Lý do AI bỏ sót** |
| :--- | :--- | :--- | :--- | :--- |
| **EXT01** | Kiểm thử IDOR với Token đã bị khóa (Revoked/Blacklisted Token) | `Authorization: Bearer <revoked_token>` | Trả về `401 Unauthorized`, không cho phép truy xuất lịch sử đơn cũ. | AI không lường trước được cơ chế Token Revocation / Blacklist phía Server sau khi User Đăng xuất. |
| **EXT02** | Xung đột IDOR qua Header `X-User-Id` giả mạo | `Authorization: Bearer <user_A_token>` & Header `X-User-Id: 999` | Trả về duy nhất danh sách đơn của User A. | AI chỉ kiểm tra IDOR trong Query string (`?user_id=`) mà quên mất các Custom Header giả mạo danh tính `X-User-Id`. |
| **EXT03** | Gửi Token bị đổi chữ ký HMAC (Tampered Signature) | `Authorization: Bearer <modified_jwt_signature>` | Trả về `401 Unauthorized` do lỗi Signature Verification Failure. | AI chỉ tạo Token ngẫu nhiên rác chứ không thử kỹ thuật sửa đổi chữ ký JWT (JWT Tampering). |
| **EXT04** | Kiểm thử truyền Query String lạ trên API không khai báo param | `GET /api/orders/my-orders?extra_filter=123` | Server vẫn xử lý an toàn, trả về danh sách đơn hàng cá nhân mà không bị crash. | AI tự động giả định API có bộ lọc `fromDate`/`toDate` thay vì kiểm thử hành vi xử lý query string ngoài đặc tả. |
| **EXT05** | Race Condition: Đổi mật khẩu ở thiết bị B rồi gọi lịch sử ở thiết bị A | Thiết bị A dùng Token cũ gọi `GET /api/orders/my-orders` ngay sau khi thiết bị B đổi password | Trả về `401 Unauthorized` buộc thiết bị A đăng nhập lại. | AI không thể mô phỏng được kịch bản đa thiết bị (Multi-device Session Invalidating) nếu không có prompt đặc thù. |
