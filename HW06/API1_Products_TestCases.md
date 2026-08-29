# TẬP TEST CASE API 1 — GET /api/products (FR-05: Danh sách & Tìm kiếm Sản phẩm)

> **Mã API:** API-01 (Pool A)  
> **Endpoint:** `GET /api/products`  
> **Mục tiêu:** Kiểm thử chức năng hiển thị danh sách sản phẩm và tìm kiếm sản phẩm theo từ khóa (`?search=keyword`), bảo mật SQLi/XSS và xác thực JSON Schema.

---

## 1. DANH SÁCH 35 TEST CASES DO AI TẠO & KẾT QUẢ KIỂM TOÁN (HUMAN AUDIT LOG)

| TestID | Kỹ thuật (Technique) | Mô tả Test Case | Tham số (`Query Params`) | Status Code Mong Đợi | Assertions / Expected Response | Đánh giá Audit (Human Review) | Ghi chú Audit / Nhận xét phản biện của Sinh viên (MSSV: 23127443) |
| :--- | :--- | :--- | :--- | :---: | :--- | :---: | :--- |
| **TC01** | Domain / Valid | Lấy danh sách sản phẩm mặc định (Không truyền param) | *(Không có)* | `200 OK` | Mảng chứa danh sách sản phẩm, `Array.isArray() == true`, mảng không rỗng. | **VALID** | Giữ nguyên. Kịch bản hợp lệ theo Spec 3.1. |
| **TC02** | Domain / Valid | Tìm kiếm theo tên hợp lệ | `?search=Tên` | `200 OK` | Danh sách trả về chứa các sản phẩm có tên khớp với từ khóa. | **VALID** | Giữ nguyên. Khớp với Spec 3.1. |
| **TC03** | Domain / Valid | Tìm kiếm với từ khóa bằng chữ hoa/chữ thường (Case-insensitive) | `?search=tÊn` | `200 OK` | Kết quả không phân biệt hoa thường, giống TC02. | **VALID** | Giữ nguyên. |
| **TC04** | Domain / Valid | Tìm kiếm từ khóa có khoảng trắng đầu/cuối | `?search=%20Tên%20` | `200 OK` | Hệ thống trim khoảng trắng và trả về kết quả đúng. | **VALID** | Giữ nguyên. |
| **TC05** | Domain / Valid | Tìm kiếm bằng từ khóa tiếng Việt có dấu | `?search=Áo%20thun` | `200 OK` | Trả về sản phẩm khớp tiếng Việt Unicode UTF-8. | **VALID** | Giữ nguyên. |
| **TC06** | Domain / Valid | Tìm kiếm bằng từ khóa tiếng Việt không dấu | `?search=Ao%20thun` | `200 OK` | Kết quả khớp hoặc mảng rỗng `[]`. | **VALID** | Giữ nguyên. |
| **TC07** | Domain / Boundary | Tìm kiếm với từ khóa 1 ký tự | `?search=a` | `200 OK` | Trả về danh sách sản phẩm chứa chữ 'a'. | **VALID** | Giữ nguyên. |
| **TC08** | Domain / Boundary | Tìm kiếm từ khóa độ dài 255 ký tự | `?search=a...a` (255 chars) | `200 OK` | Trả về mảng rỗng `[]` (nếu không tìm thấy). | **INVALID** | **AI Hallucination:** Giới hạn $\le 255$ ký tự cho `search` không có trong Spec/README. |
| **TC09** | Domain / Invalid | Tìm kiếm với từ khóa vượt quá 255 ký tự | `?search=a...a` (300 chars) | `400 Bad Request` | Trả về lỗi validation từ khóa quá dài. | **INVALID** | **AI Hallucination:** Spec và Express backend không quy định giới hạn 255 ký tự cho `search`. |
| **TC10** | Domain / Valid | Tìm kiếm từ khóa không tồn tại trong hệ thống | `?search=NonExistentProduct123` | `200 OK` | Trả về mảng rỗng `[]`, không báo lỗi crash server. | **VALID** | Giữ nguyên. Báo mảng rỗng hợp lệ. |
| **TC11** | Domain / Invalid | Tìm kiếm chỉ gồm chuỗi khoảng trắng | `?search=%20%20%20` | `200 OK` | Trả về toàn bộ danh sách hoặc mảng rỗng `[]`. | **VALID** | Giữ nguyên. |
| **TC12** | Domain / Valid | Tìm kiếm từ khóa chứa con số | `?search=123` | `200 OK` | Trả về các sản phẩm có chứa số '123' trong tên. | **VALID** | Giữ nguyên. |
| **TC13** | Domain / Valid | Truyền query param không liên quan | `?search=shirt&unknown_param=123` | `200 OK` | Bỏ qua param lạ, trả về danh sách theo `search`. | **VALID** | Giữ nguyên. Express mặc định bỏ qua query lạ. |
| **TC14** | Domain / Invalid | Truyền tham số `search` trùng lặp (Duplicate param) | `?search=A&search=B` | `400 Bad Request` | Kỳ vọng 400 từ chối query mảng. | **INVALID** | **AI Giả định chưa kiểm chứng:** Express mặc định parse mảng `['A','B']` chứ không tự trả 400. |
| **TC15** | Domain / Valid | Tìm kiếm từ khóa chứa ký tự đặc biệt hợp lệ (`-`, `_`) | `?search=pro-max` | `200 OK` | Tìm kiếm bình thường theo ký tự `-`. | **VALID** | Giữ nguyên. |
| **TC16** | Dataflow | Tìm kiếm sản phẩm ngay sau khi Admin tạo mới thành công | `?search=NewProduct` | `200 OK` | Sản phẩm mới tạo xuất hiện lập tức trong danh sách. | **VALID** | Giữ nguyên. Kiểm thử luồng dữ liệu DB. |
| **TC17** | Dataflow | Tìm kiếm sản phẩm ngay sau khi Admin xóa thành công | `?search=DeletedProduct` | `200 OK` | Trả về mảng rỗng `[]` (Sản phẩm bị xóa không xuất hiện). | **VALID** | Giữ nguyên. |
| **TC18** | Security / SQLi | SQL Injection cơ bản (OR True) | `?search=' OR '1'='1` | `200 OK` | Không để lộ toàn bộ DB hoặc lỗi SQL 500, được escape an toàn. | **INCOMPLETE** | AI thiếu check log lỗi. Sửa lại: Bổ sung check `to.not.include("syntax error")`. |
| **TC19** | Security / SQLi | SQL Injection với comment | `?search=admin'--` | `200 OK` | Escape chuỗi an toàn, trả về mảng `[]`. | **VALID** | Giữ nguyên. |
| **TC20** | Security / SQLi | SQL Injection dạng Stacked Queries | `?search=shirt'; DROP TABLE products;--` | `200 OK` | Không thực thi lệnh DROP TABLE, bảo vệ DB. | **VALID** | Giữ nguyên. |
| **TC21** | Security / SQLi | SQL Injection với UNION SELECT | `?search=' UNION SELECT 1,2,3--` | `200 OK` | Không rò rỉ cấu trúc bảng dữ liệu. | **VALID** | Giữ nguyên. |
| **TC22** | Security / XSS | Reflected XSS trong từ khóa tìm kiếm | `?search=<script>alert(1)</script>` | `200 OK` | Đã escape HTML entities, không tự động thực thi script. | **VALID** | Giữ nguyên. Khớp Yêu cầu SEC-04 trong README. |
| **TC23** | Security / XSS | XSS qua thẻ IMG Event | `?search=<img src=x onerror=alert(1)>` | `200 OK` | Sanitize dữ liệu an toàn. | **VALID** | Giữ nguyên. |
| **TC24** | Security | Truyền Path Traversal trong query | `?search=../../../../etc/passwd` | `200 OK` | Xử lý như chuỗi văn bản thuần túy. | **VALID** | Giữ nguyên. |
| **TC25** | Security | Truyền ký tự null byte | `?search=test%00.php` | `400 Bad Request` | Kỳ vọng từ chối Null byte. | **INVALID** | **AI Giả định không cơ sở:** Node/Express xử lý chuỗi query string không chặn `%00` mặc định. |
| **TC26** | Security | Gửi Request với HTTP Method không hỗ trợ (`POST`) | `POST /api/products` (No Auth) | `401 Unauthorized` | Không cho phép tạo sản phẩm nếu chưa auth Admin. | **INVALID** | AI kỳ vọng status `405`. Đã sửa lại `401 Unauthorized` theo spec. |
| **TC27** | Security | Gửi Request với HTTP Method `DELETE` không Auth | `DELETE /api/products` | `401 Unauthorized` | Không cho phép xóa sản phẩm nếu chưa auth Admin. | **INVALID** | AI kỳ vọng status `405`. Đã sửa lại `401 Unauthorized` theo spec. |
| **TC28** | Schema | Xác thực JSON Schema tổng thể response | `GET /api/products` | `200 OK` | Match JSON Schema mảng đối tượng. | **VALID** | Giữ nguyên. |
| **TC29** | Schema | Kiểu dữ liệu trường `id` | `GET /api/products` | `200 OK` | `typeof id === 'number'`, là số nguyên dương $> 0$. | **VALID** | Giữ nguyên. |
| **TC30** | Schema | Kiểu dữ liệu trường `name` | `GET /api/products` | `200 OK` | `typeof name === 'string'`, không được null. | **VALID** | Giữ nguyên. |
| **TC31** | Schema | Kiểu dữ liệu trường `price` | `GET /api/products` | `200 OK` | `typeof price === 'number'`, $price > 0$. | **VALID** | Giữ nguyên. |
| **TC32** | Schema | Kiểu dữ liệu trường `description` | `GET /api/products` | `200 OK` | `typeof description === 'string'`. | **VALID** | Giữ nguyên. |
| **TC33** | Schema | Kiểu dữ liệu trường `imageUrl` | `GET /api/products` | `200 OK` | `typeof imageUrl === 'string'`. | **VALID** | Giữ nguyên. |
| **TC34** | Schema | Kiểu dữ liệu trường `category_id` | `GET /api/products` | `200 OK` | `typeof category_id === 'number'`, tồn tại trong DB. | **VALID** | Giữ nguyên. |
| **TC35** | Schema | Kiểm tra Response Header `Content-Type` | `GET /api/products` | `200 OK` | `Content-Type` chứa `application/json`. | **VALID** | Giữ nguyên. |

---

## 2. BẢNG 5 TEST CASES MỞ RỘNG DO CON NGƯỜI THIẾT KẾ (EXTEND)

| TestID | Mô tả Test Case | Tham số / Request | Expected Result | **Lý do AI bỏ sót** |
| :--- | :--- | :--- | :--- | :--- |
| **EXT01** | Tìm kiếm với từ khóa bọc trong ký tự phần trăm `%` (Wildcard SQL) | `?search=%25shirt%25` | Hệ thống escape ký tự `%` như chuỗi thường, không làm lộ toàn bộ bảng dữ liệu. | AI mặc định xem `%` là URL encoding (`%25` là `%`) mà không nhận ra `%` là ký tự đặc biệt trong câu lệnh SQL `LIKE '%keyword%'`. |
| **EXT02** | Gửi Header `Accept-Encoding: gzip` kết hợp tìm kiếm | `GET /api/products` với header `Accept-Encoding: gzip` | Response được nén an toàn, Status `200 OK`. | AI chỉ tập trung vào query params mà bỏ qua các HTTP Request Headers tiêu chuẩn ảnh hưởng đến performance. |
| **EXT03** | Tìm kiếm với chuỗi JSON payload bọc trong param | `?search={"name":"shirt"}` | Trả về `200 OK` hoặc `400`, xử lý như chuỗi string thuần túy. | AI không lường trước được trường hợp Client gửi nhầm đối tượng JSON dưới dạng Query String. |
| **EXT04** | Kiểm thử HTTP Parameter Pollution (HPP) với giá trị rỗng | `?search=&search=shirt` | Server ưu tiên tham số có giá trị `shirt` hoặc trả về 400. | AI không kiểm thử kỹ thuật HPP nâng cao khi phối hợp giữa tham số rỗng và tham số có dữ liệu. |
| **EXT05** | Race Condition: Gửi đồng thời 10 request tìm kiếm trong 50ms | 10 requests `GET /api/products` đồng thời | Tất cả 10 requests đều trả về `200 OK` thành công, server không bị nghẽn thread. | AI không có khả năng tự giả lập môi trường concurrency/race condition nếu không được prompt chuyên biệt. |
