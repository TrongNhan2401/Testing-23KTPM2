# TẬP TEST CASE API 3 — POST /api/categories (FR-14 & FR-12: Quản lý Danh mục Admin)

> **Mã API:** API-03 (Pool C)  
> **Endpoint:** `POST /api/categories`  
> **Mục tiêu:** Kiểm thử chức năng tạo mới danh mục sản phẩm của Admin, kiểm thử bảo mật Leo thang quyền (SEC-04), xác thực JWT Admin Token (SEC-01/02), Phân vùng miền cho tên danh mục và JSON Schema Validation.

---

## 1. DANH SÁCH 35 TEST CASES DO AI TẠO & KẾT QUẢ KIỂM TOÁN (AUDIT LOG)

| TestID | Kỹ thuật (Technique) | Mô tả Test Case | Header & Request Body (JSON) | Status Code Mong Đợi | Assertions / Expected Response | Đánh giá Audit | Ghi chú Audit / Sửa đổi của SV |
| :--- | :--- | :--- | :--- | :---: | :--- | :---: | :--- |
| **TC01** | Domain / Valid | Tạo danh mục mới thành công với quyền Admin | `Auth: AdminToken`<br>`{"name": "Điện thoại"}` | `201 Created` / `200` | Trả về object danh mục chứa `id` mới và `name == "Điện thoại"`. | **VALID** | Giữ nguyên. |
| **TC02** | Domain / Valid | Tạo danh mục tên có tiếng Việt có dấu | `Auth: AdminToken`<br>`{"name": "Thời trang Nam"}` | `201 Created` / `200` | Lưu đúng tên Unicode tiếng Việt. | **VALID** | Giữ nguyên. |
| **TC03** | Domain / Valid | Tạo danh mục tên chứa chữ số | `Auth: AdminToken`<br>`{"name": "Laptop 2026"}` | `201 Created` / `200` | Tạo thành công danh mục có số. | **VALID** | Giữ nguyên. |
| **TC04** | Domain / Valid | Tạo danh mục tên có khoảng trắng đầu/cuối | `Auth: AdminToken`<br>`{"name": "  Đồ gia dụng  "}` | `201 Created` / `200` | Server trim khoảng trắng hoặc giữ nguyên. | **VALID** | Giữ nguyên. |
| **TC05** | Domain / Boundary | Tạo danh mục tên có độ dài 1 ký tự | `Auth: AdminToken`<br>`{"name": "A"}` | `201 Created` / `200` | Độ dài tối thiểu hợp lệ. | **VALID** | Giữ nguyên. |
| **TC06** | Domain / Boundary | Tạo danh mục tên vừa đúng độ dài max (255 ký tự) | `Auth: AdminToken`<br>`{"name": "A...A"}` (255 chars) | `201 Created` / `200` | Độ dài tối đa hợp lệ. | **VALID** | Giữ nguyên. |
| **TC07** | Domain / Invalid | Tạo danh mục tên rỗng (Empty string) | `Auth: AdminToken`<br>`{"name": ""}` | `400 Bad Request` | Không cho phép tên danh mục rỗng. | **VALID** | Giữ nguyên. |
| **TC08** | Domain / Invalid | Tạo danh mục chỉ gồm toàn khoảng trắng | `Auth: AdminToken`<br>`{"name": "   "}` | `400 Bad Request` | Từ chối tên danh mục chỉ có khoảng trắng. | **VALID** | Giữ nguyên. |
| **TC09** | Domain / Invalid | Tạo danh mục thiếu trường `name` trong body | `Auth: AdminToken`<br>`{}` | `400 Bad Request` | Lỗi thiếu trường bắt buộc `name`. | **VALID** | Giữ nguyên. |
| **TC10** | Domain / Invalid | Trường `name` bị gán giá trị `null` | `Auth: AdminToken`<br>`{"name": null}` | `400 Bad Request` | Không chấp nhận giá trị null. | **VALID** | Giữ nguyên. |
| **TC11** | Domain / Invalid | Trường `name` bị truyền sai kiểu dữ liệu (Số) | `Auth: AdminToken`<br>`{"name": 12345}` | `400 Bad Request` | Lỗi sai kiểu dữ liệu (phải là string). | **VALID** | Giữ nguyên. |
| **TC12** | Domain / Invalid | Trường `name` bị truyền sai kiểu dữ liệu (Boolean) | `Auth: AdminToken`<br>`{"name": true}` | `400 Bad Request` | Lỗi sai kiểu dữ liệu boolean. | **VALID** | Giữ nguyên. |
| **TC13** | Domain / Invalid | Trường `name` bị truyền sai kiểu dữ liệu (Mảng/Object) | `Auth: AdminToken`<br>`{"name": ["DM1"]}` | `400 Bad Request` | Lỗi sai kiểu dữ liệu mảng. | **VALID** | Giữ nguyên. |
| **TC14** | Domain / Invalid | Tạo danh mục tên vượt quá 255 ký tự | `Auth: AdminToken`<br>`{"name": "A...A"}` (300 chars) | `400 Bad Request` | Lỗi độ dài tên quá giới hạn. | **INVALID** | AI kỳ vọng status `200`. Đã sửa thành `400 Bad Request`. |
| **TC15** | Domain / Conflict | Tạo danh mục với tên đã tồn tại trong DB | `Auth: AdminToken`<br>`{"name": "Điện thoại"}` | `400` / `409 Conflict` | Từ chối trùng tên danh mục. | **INCOMPLETE** | AI thiếu check message trùng tên. Bổ sung assertion check message. |
| **TC16** | Security / SEC-04 | **Leo thang quyền:** User thường cố tạo danh mục | `Auth: UserToken`<br>`{"name": "Hack Category"}` | `403 Forbidden` | **Bảo mật (SEC-04):** Từ chối User thường truy cập API Admin. | **VALID** | Giữ nguyên. |
| **TC17** | Security / SEC-01 | Gửi Request không truyền Header `Authorization` | *(Không truyền Header)*<br>`{"name": "DM Test"}` | `401 Unauthorized` | Từ chối truy cập không có token. | **VALID** | Giữ nguyên. |
| **TC18** | Security / SEC-01 | Gửi Token sai / Không đúng định dạng JWT | `Auth: Bearer invalid_token`<br>`{"name": "DM"}` | `401 Unauthorized` | Từ chối Token không hợp lệ. | **VALID** | Giữ nguyên. |
| **TC19** | Security / SEC-02 | Gửi Token Admin đã hết hạn | `Auth: Bearer <expired_admin_token>`<br>`{"name": "DM"}` | `401 Unauthorized` | Từ chối Token hết hạn. | **VALID** | Giữ nguyên. |
| **TC20** | Security / SQLi | SQL Injection trong tên danh mục | `Auth: AdminToken`<br>`{"name": "DM' OR '1'='1"}` | `201` / `400` | Escape an toàn, lưu như tên chuỗi hoặc từ chối. | **VALID** | Giữ nguyên. |
| **TC21** | Security / SQLi | SQL Injection với lệnh DROP TABLE | `Auth: AdminToken`<br>`{"name": "DM'; DROP TABLE categories;--"}` | `201` / `400` | Escape chuỗi, không làm mất cơ sở dữ liệu. | **VALID** | Giữ nguyên. |
| **TC22** | Security / XSS | Stored XSS trong tên danh mục | `Auth: AdminToken`<br>`{"name": "<script>alert(1)</script>"}` | `201` / `400` | Sanitize HTML entities khi lưu và trả về UI. | **VALID** | Giữ nguyên. |
| **TC23** | Security / XSS | Stored XSS qua thẻ IMG | `Auth: AdminToken`<br>`{"name": "<img src=x onerror=alert(1)>"}` | `201` / `400` | Escape HTML entities an toàn. | **VALID** | Giữ nguyên. |
| **TC24** | Security | Gửi Request với Header `Content-Type` sai | `Content-Type: text/plain`<br>`{"name": "DM"}` | `400` / `415` | Từ chối Content-Type không phải JSON. | **VALID** | Giữ nguyên. |
| **TC25** | Domain / Valid | Truyền thừa trường thuộc tính không liên quan trong Body | `Auth: AdminToken`<br>`{"name": "DM", "extra": "123"}` | `201 Created` / `200` | Bỏ qua trường lạ, tạo danh mục bình thường. | **VALID** | Giữ nguyên. |
| **TC26** | Dataflow | Tạo danh mục mới và gọi `GET /api/categories` kiểm tra | `Auth: AdminToken`<br>`{"name": "Danh Mục Mới 2026"}` | `201 Created` | Danh mục mới tạo ngay lập tức xuất hiện trong `GET /api/categories`. | **VALID** | Giữ nguyên. |
| **TC27** | Dataflow | Tạo danh mục mới và thêm sản phẩm vào danh mục đó | `POST /api/products` dùng `category_id` mới tạo | `201 Created` | Sản phẩm liên kết thành công với `category_id` mới. | **VALID** | Giữ nguyên. |
| **TC28** | Security | Gửi Body không đúng chuẩn JSON (Malformed JSON) | `Auth: AdminToken`<br>`{"name": "DM"` *(thiếu dấu đóng } )* | `400 Bad Request` | Lỗi cú pháp JSON. | **VALID** | Giữ nguyên. |
| **TC29** | Schema | Xác thực JSON Schema Response khi tạo thành công | `Auth: AdminToken`<br>`{"name": "DM Valid"}` | `201 Created` / `200` | Match JSON Schema object danh mục. | **VALID** | Giữ nguyên. |
| **TC30** | Schema | Kiểm tra kiểu dữ liệu trường `id` trả về | `Auth: AdminToken`<br>`{"name": "DM Valid"}` | `201 Created` / `200` | `typeof id === 'number'`, số nguyên dương $> 0$. | **VALID** | Giữ nguyên. |
| **TC31** | Schema | Kiểm tra trường `name` trả về khớp với tên đã gửi | `Auth: AdminToken`<br>`{"name": "DM Valid"}` | `201 Created` / `200` | `jsonData.name === 'DM Valid'`. | **VALID** | Giữ nguyên. |
| **TC32** | Schema | Kiểm tra Response Header `Content-Type` | `Auth: AdminToken`<br>`{"name": "DM Valid"}` | `201 Created` / `200` | `Content-Type` chứa `application/json`. | **VALID** | Giữ nguyên. |
| **TC33** | Security | Cố tình truyền `role: "admin"` trong body bằng User Token | `Auth: UserToken`<br>`{"name": "DM", "role": "admin"}` | `403 Forbidden` | Không cho phép bypass role qua Body Payload (SEC-06). | **VALID** | Giữ nguyên. |
| **TC34** | Domain / Boundary | Tên danh mục chứa các ký tự Unicode đặc biệt (Emoji) | `Auth: AdminToken`<br>`{"name": "📱 Điện Thoại 📱"}` | `201 Created` / `200` | Lưu trữ và trả về đúng UTF-8 Emoji. | **VALID** | Giữ nguyên. |
| **TC35** | Security | Gửi Request với HTTP Method `GET` có Body | `GET /api/categories` có gửi kèm JSON Body | `200 OK` | Bỏ qua Body, trả về danh sách danh mục hiện có. | **VALID** | Giữ nguyên. |

---

## 2. BẢNG 5 TEST CASES MỞ RỘNG DO CON NGƯỜI THIẾT KẾ (EXTEND)

| TestID | Mô tả Test Case | Tham số / Request Body | Expected Result | **Lý do AI bỏ sót** |
| :--- | :--- | :--- | :--- | :--- |
| **EXT01** | Tạo danh mục có tên chứa ký tự điều khiển ngầm (Control Characters `\u0000`, `\u0007`) | `{"name": "DM\u0000Test"}` | Trả về `400 Bad Request` hoặc loại bỏ ký tự điều khiển trước khi lưu. | AI chỉ test các chuỗi string thông thường mà quên các ký tự ẩn điều khiển mã ASCII/Unicode. |
| **EXT02** | Xung đột đồng thời (Concurrency): 2 Admin bấm tạo cùng 1 tên danh mục trong 10ms | 2 Request `POST /api/categories` trùng tên gửi cùng lúc | 1 Request thành công (`201`), 1 Request thất bại (`400`/`409 Conflict`). | AI không thể tự mô phỏng tình huống Race Condition / Unique Constraint Exception khi có ghi song song. |
| **EXT03** | Tạo danh mục có tên giống hệt nhưng khác hoa/thường (`Dien Thoai` vs `dien thoai`) | `{"name": "dien thoai"}` khi đã có `Dien Thoai` | Trả về `400` / `409` do quy tắc trùng tên Case-Insensitive Unique Index. | AI chỉ kiểm tra trùng tên khớp 100% từng ký tự mà không nghĩ đến Unique Index phân biệt hoa thường của DB. |
| **EXT04** | Giới hạn kích thước Request Payload cực lớn (Massive JSON Payload > 10MB) | Body chứa tên danh mục bọc trong mảng 100,000 ký tự | Trả về `413 Payload Too Large`. | AI không kiểm thử các giới hạn tài nguyên server (DoS prevention / Max Payload Limit). |
| **EXT05** | Tạo danh mục bằng Admin Token đã bị vô hiệu hóa quyền Admin ở DB (Revoked Admin Privileges) | Admin A vừa bị Admin B hạ xuống User thường, sau đó Admin A gọi API tạo danh mục | Trả về `403 Forbidden`. | AI giả định Token còn hạn nghĩa là còn quyền, không kiểm tra trường hợp DB đã cập nhật quyền người dùng tức thì. |
