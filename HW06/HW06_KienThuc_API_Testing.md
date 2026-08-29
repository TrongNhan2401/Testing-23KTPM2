# TÀI LIỆU HƯỚNG DẪN KIẾN THỨC VÀ THỰC HÀNH KIỂM THỬ API (HW06 - TESTING)

> **Mã bài tập:** HW06-AI  
> **Mục tiêu:** Trang bị toàn bộ lý thuyết, ví dụ thực tế và bài tập thực hành giúp sinh viên hoàn thành xuất sắc HW06 theo chuẩn **Bloom-AI (G9.1 $\rightarrow$ G9.6)**.

---

## MỤC LỤC

1. [Chương 1: Tổng Quan về RESTful API & HTTP Protocol](#chuong-1-tong-quan-ve-restful-api--http-protocol)
2. [Chương 2: Các Kỹ Thuật Thiết Kế Test Case API](#chuong-2-cac-ky-thuat-thiet-ke-test-case-api)
3. [Chương 3: Thành Thạo Postman & Newman (Automation Testing)](#chuong-3-thanh-thao-postman--newman-automation-testing)
4. [Chương 4: Tích Hợp CI/CD với GitHub Actions](#chuong-4-tich-hop-cicd-voi-github-actions)
5. [Chương 5: Phương Pháp Hợp Tác với AI, Audit & Critique](#chuong-5-phuong-phap-hop-tac-voi-ai-audit--critique)
6. [Chương 6: Thiết Kế AI Agent Skill (API Test Generator)](#chuong-6-thiet-ke-ai-agent-skill-api-test-generator)

---

<a name="chuong-1-tong-quan-ve-restful-api--http-protocol"></a>
## CHƯƠNG 1: TỔNG QUAN VỀ RESTful API & HTTP PROTOCOL

### 1.1 RESTful API là gì?
**REST (Representational State Transfer)** là một kiểu kiến trúc phần mềm dựa trên các tiêu chuẩn mạng như HTTP. **RESTful API** cho phép các hệ thống giao tiếp với nhau bằng cách gửi và nhận dữ liệu (thường dưới dạng **JSON** hoặc **XML**).

Một HTTP Transaction bao gồm:
*   **Request (Yêu cầu từ Client gửi tới Server):** Bao gồm HTTP Method, URL/Endpoint, Headers, Parameters và Body.
*   **Response (Phản hồi từ Server về Client):** Bao gồm HTTP Status Code, Response Headers và Response Body.

---

### 1.2 Các HTTP Methods Cốt Lõi

| Method | Ý nghĩa | Có Request Body? | Idempotent? | Ví dụ ứng dụng EShop |
| :--- | :--- | :---: | :---: | :--- |
| **`GET`** | Lấy dữ liệu | Không | Có | `GET /api/products` (Danh sách sản phẩm) |
| **`POST`** | Tạo mới tài nguyên | Có | Không | `POST /api/auth/register` (Tạo tài khoản mới) |
| **`PUT`** | Cập nhật toàn bộ tài nguyên | Có | Có | `PUT /api/admin/products/12` (Ghi đè thông tin sản phẩm #12) |
| **`PATCH`**| Cập nhật một phần tài nguyên | Có | Không | `PATCH /api/orders/5/status` (Đổi trạng thái đơn hàng #5) |
| **`DELETE`**| Xóa tài nguyên | Tùy chọn | Có | `DELETE /api/cart/item/3` (Xóa món hàng khỏi giỏ) |

> **Khái niệm Idempotent:** Một HTTP Method được gọi là *Idempotent* nếu việc thực thi nó $N$ lần ($N \ge 1$) tạo ra cùng một trạng thái trên Server như khi thực thi $1$ lần.

---

### 1.3 HTTP Headers quan trọng trong Kiểm thử

Headers chứa các thông tin metadata được truyền cùng với Request/Response.

1.  **`Content-Type`**: Định nghĩa kiểu dữ liệu trong Request Body.
    *   Ví dụ: `application/json`, `multipart/form-data`.
2.  **`Authorization`**: Xác thực danh tính người dùng.
    *   Ví dụ: `Authorization: Bearer eyJhbGciOiJIUzI1Ni...`
3.  **`X-Student-Id` (Custom Header - BẮT BUỘC TRONG HW06):**
    *   Yêu cầu chống gian lận Anti-AI-Cheat của bài tập: Mọi request gửi đi phải mang header `X-Student-Id: {MSSV_CUA_BAN}`.

---

### 1.4 HTTP Status Codes Cần Nhớ

*   **2xx (Thành công):**
    *   `200 OK`: Request thành công.
    *   `201 Created`: Tạo tài nguyên thành công (thường dùng cho `POST`).
    *   `204 No Content`: Xóa thành công, không trả về body.
*   **4xx (Lỗi từ phía Client):**
    *   `400 Bad Request`: Dữ liệu đầu vào sai định dạng/thiếu trường bắt buộc.
    *   `401 Unauthorized`: Chưa đăng nhập hoặc Token không hợp lệ.
    *   `403 Forbidden`: Đã đăng nhập nhưng không đủ quyền (ví dụ: User thường cố gọi API Admin).
    *   `404 Not Found`: Không tìm thấy endpoint hoặc tài nguyên (VD: `GET /api/products/99999`).
    *   `409 Conflict`: Dữ liệu bị xung đột (VD: Đăng ký email đã tồn tại).
    *   `422 Unprocessable Entity`: Dữ liệu đúng định dạng JSON nhưng vi phạm business logic (VD: giá sản phẩm là số âm).
*   **5xx (Lỗi từ phía Server):**
    *   `500 Internal Server Error`: Lỗi sập server/bị unhandled exception (Đây là Bug nếu tester kích hoạt được lỗi này!).

---

### 1.5 Ví Dụ Thực Tế & Bài Tập Thực Hành

#### Ví dụ minh họa:
Gửi request đăng ký tài khoản mới lên EShop:

*   **Request:**
    ```http
    POST /api/auth/register HTTP/1.1
    Host: localhost:5000
    Content-Type: application/json
    X-Student-Id: 25127001

    {
      "email": "nguyenvana@gmail.com",
      "password": "Password123!",
      "fullName": "Nguyễn Văn A"
    }
    ```
*   **Response (Mong đợi - 201 Created):**
    ```http
    HTTP/1.1 201 Created
    Content-Type: application/json

    {
      "success": true,
      "message": "Đăng ký tài khoản thành công",
      "data": {
        "userId": 102,
        "email": "nguyenvana@gmail.com"
      }
    }
    ```

#### ✏️ Bài tập 1.1 (Tự luyện):
1. Phân biệt sự khác nhau giữa HTTP Status Code `401 Unauthorized` và `403 Forbidden`. Cho ví dụ thực tế trong hệ thống EShop.
2. Nếu gửi request `POST /api/cart/add` với body `{ "productId": "ABC", "quantity": -5 }`, server nên trả về Status Code nào là phù hợp nhất? Giải thích tại sao.

---

<a name="chuong-2-cac-ky-thuat-thiet-ke-test-case-api"></a>
## CHƯƠNG 2: CÁC KỸ THUẬT THIẾT KẾ TEST CASE API

Trong HW06, với mỗi API được chọn, bạn phải thiết kế ít nhất **35 test cases** bao gồm đủ 4 khía cạnh:

```mermaid
graph TD
    A[35+ Test Cases / API] --> B[1. Phân vùng miền - Domain Partitions]
    A --> C[2. Chuyển đổi trạng thái - State Transitions]
    A --> D[3. Bảo mật - Security SEC-01->SEC-07]
    A --> E[4. Xác thực Schema - Schema Validation]
```

---

### 2.1 Phân Vùng Tương Đương & Phân Tích Giá Trị Biên (Domain Partitions & BVA)

Áp dụng trên từng thuộc tính của tham số đầu vào (Input Parameters).

#### 1. Định dạng Chuỗi / Email / Password
*   **Email:**
    *   Hợp lệ: `user@domain.com`, `user.name+tag@domain.co.uk`
    *   Bất hợp lệ: `user@`, `@domain.com`, `user@domain`, chứa khoảng trắng `user @domain.com`.
*   **Password Complexity:**
    *   Độ dài: $<8$ ký tự (Invalid), $8$ ký tự (Biên hợp lệ), $9$ ký tự (Valid), $256$ ký tự (Biên trên/Invalid nếu quá dài).
    *   Thành phần: Thiếu chữ hoa, thiếu chữ thường, thiếu số, thiếu ký tự đặc biệt.

#### 2. Dữ liệu Số (Numeric Fields)
Ví dụ: Giá sản phẩm (`price`), Số lượng (`quantity`).
*   Phân vùng hợp lệ: Số nguyên dương $price > 0$.
*   Phân vùng bất hợp lệ: $price = 0$, $price < 0$, $price = \text{null}$, $price = \text{"chuỗi"}$, số thực cực lớn gây tràn số (Overflow).
*   Giá trị biên: $-1, 0, 1, \text{MAX\_INT}$.

---

### 2.2 Kiểm Thử Chuyển Đổi Trạng Thái (State Transition Testing)

Kiểm thử các workflow có vòng đời trạng thái (Lifecycle), điển hình là **FR-10: Máy trạng thái đơn hàng**.

#### Sơ đồ chuyển đổi trạng thái đơn hàng EShop:

```mermaid
stateDiagram-v2
    [*] --> Pending : Khách hàng đặt hàng
    Pending --> Confirmed : Admin xác nhận
    Pending --> Cancelled : Khách/Admin hủy
    Confirmed --> Shipping : Đơn vị vận chuyển lấy hàng
    Confirmed --> Cancelled : Admin hủy
    Shipping --> Delivered : Giao hàng thành công
    Delivered --> [*]
    Cancelled --> [*]
```

#### Ma trận Chuyển đổi Trạng thái (State Transition Matrix):

| Trạng thái hiện tại | Hành động (Event/API) | Trạng thái mong đợi | Loại Test Case |
| :--- | :--- | :--- | :---: |
| **`Pending`** | `PATCH /api/orders/{id}/confirm` | `Confirmed` | **Hợp lệ (Valid)** |
| **`Pending`** | `PATCH /api/orders/{id}/cancel` | `Cancelled` | **Hợp lệ (Valid)** |
| **`Confirmed`** | `PATCH /api/orders/{id}/ship` | `Shipping` | **Hợp lệ (Valid)** |
| **`Delivered`** | `PATCH /api/orders/{id}/cancel` | **Error 400/409 (Không cho hủy)** | **Bất hợp lệ (Negative)** |
| **`Cancelled`** | `PATCH /api/orders/{id}/ship` | **Error 400/409 (Không thể giao đơn đã hủy)** | **Bất hợp lệ (Negative)** |

---

### 2.3 Kiểm Thử Bảo Mật API (API Security - SEC-01 đến SEC-07)

Bài tập yêu cầu bao phủ các tiêu chuẩn bảo mật sau:

#### 🔴 SEC-01 & SEC-02: Authentication & Authorization Bypass
*   **Kịch bản:** Gửi request đến các API cần đăng nhập (ví dụ: Xem lịch sử đơn hàng `GET /api/user/orders`) nhưng:
    1.  Không truyền header `Authorization`.
    2.  Truyền Token bị hỏng/hết hạn.
*   **Mong đợi:** Trả về `401 Unauthorized`.

#### 🔴 SEC-03: IDOR (Insecure Direct Object Reference)
*   **Kịch bản:** User A (có ID=101) cố tình xem/sửa đơn hàng của User B (có ID=102) bằng cách thay đổi OrderID trên URL: `GET /api/orders/999` (trong đó 999 thuộc về User B).
*   **Mong đợi:** Trả về `403 Forbidden` hoặc `404 Not Found`. Không bao giờ trả về dữ liệu của User B!

#### 🔴 SEC-04: Privilege Escalation (Leo Thang Quyền)
*   **Kịch bản:** Khách hàng (User role) dùng Bearer Token của mình để gọi API Admin (ví dụ: `POST /api/admin/products` để tạo sản phẩm mới).
*   **Mong đợi:** Trả về `403 Forbidden`.

#### 🔴 SEC-05: SQL Injection (SQLi) & Malicious Inputs
*   **Kịch bản:** Truyền câu lệnh SQL vào các ô tìm kiếm hoặc tham số:
    *   `GET /api/products/search?q=' OR '1'='1`
    *   `POST /api/auth/login` với body `{ "email": "admin' --", "password": "anything" }`
*   **Mong đợi:** Hệ thống không bị crash (Status `500`), không lộ thông tin cơ sở dữ liệu, trả về `400 Bad Request` hoặc lọc ký tự đặc biệt.

#### 🔴 SEC-06 & SEC-07: Rate Limiting & Exposure of Sensitive Data
*   **Rate Limiting:** Gửi 100 request đăng nhập liên tiếp trong 5 giây $\rightarrow$ Server trả về `429 Too Many Requests`.
*   **Data Exposure:** API Response không được trả về các thông tin nhạy cảm như `passwordHash`, `resetToken`, `creditCardCVV`.

---

### 2.4 Xác Thực Schema (JSON Schema Validation)

JSON Schema định nghĩa cấu trúc dữ liệu chính xác của response.

#### Ví dụ JSON Schema cho API Đăng nhập thành công:
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["success", "token", "user"],
  "properties": {
    "success": { "type": "boolean" },
    "token": { "type": "string" },
    "user": {
      "type": "object",
      "required": ["id", "email", "role"],
      "properties": {
        "id": { "type": "integer" },
        "email": { "type": "string", "format": "email" },
        "role": { "type": "string", "enum": ["USER", "ADMIN"] }
      }
    }
  }
}
```

---

### 2.5 ✏️ Bài Tập Thực Hành Chương 2

1. Cho API **`POST /api/coupons/apply`** (Áp dụng mã giảm giá), tham số body bao gồm: `couponCode` (string), `cartTotal` (number).
   * Hãy thiết kế **5 test case phân vùng miền** cho trường `cartTotal`.
   * Hãy thiết kế **2 test case bảo mật (SEC-03 và SEC-05)** cho API này.
2. Vẽ sơ đồ chuyển đổi trạng thái cho bài toán: Một tài khoản người dùng ban đầu ở trạng thái `Unverified` $\rightarrow$ Đã xác thực OTP $\rightarrow$ `Active` $\rightarrow$ Nhập sai mật khẩu 5 lần $\rightarrow$ `Locked`.

---

<a name="chuong-3-thanh-thao-postman--newman-automation-testing"></a>
## CHƯƠNG 3: THÀNH THẠO POSTMAN & NEWMAN (AUTOMATION TESTING)

### 3.1 Quản Lý Biến trong Postman (Variables Scope)

Thứ tự ưu tiên của biến trong Postman từ cao xuống thấp:

$$\text{Data Variables} > \text{Local Variables} > \text{Environment Variables} > \text{Collection Variables} > \text{Global Variables}$$

*   **Environment Variables:** Dùng lưu `baseUrl` (`http://localhost:5000`), `authToken`, `student_id`.

---

### 3.2 Pre-request Scripts: Gán Custom Header `X-Student-Id`

Để đáp ứng ràng buộc **Anti-AI-Cheat**, mọi request trong Collection PHẢI mang header `X-Student-Id`.

#### Thao tác thiết lập tự động cấp Collection trong Postman:
1. Click chọn **Collection root**.
2. Thẻ **Pre-request Script**, dán đoạn script sau:

```javascript
// Tự động gán header X-Student-Id cho tất cả request trong Collection
const studentId = pm.environment.get("student_id") || "25127001";
pm.request.headers.upsert({
    key: "X-Student-Id",
    value: studentId
});

console.log("Pre-request script executed: X-Student-Id = " + studentId);
```

---

### 3.3 Test Scripts: Viết Assertions Với Chai.js

Chuyển sang thẻ **Tests** của request trong Postman để viết câu lệnh kiểm thử:

```javascript
// 1. Kiểm tra Status Code
pm.test("Status code is 200 OK", function () {
    pm.response.to.have.status(200);
});

// 2. Kiểm tra Response Time (Dưới 500ms)
pm.test("Response time is less than 500ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});

// 3. Kiểm tra Header trả về
pm.test("Content-Type is application/json", function () {
    pm.response.to.have.header("Content-Type");
    pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
});

// 4. Kiểm tra Chi tiết dữ liệu JSON trả về
pm.test("Verify user data in response", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
    pm.expect(jsonData.data).to.have.property("userId");
    pm.expect(jsonData.data.email).to.eql("nguyenvana@gmail.com");
});

// 5. Kiểm tra JSON Schema (Dùng thư viện TinyTV4/AJV tích hợp sẵn trong Postman)
const schema = {
    "type": "object",
    "required": ["success", "data"],
    "properties": {
        "success": { "type": "boolean" },
        "data": { "type": "object" }
    }
};

pm.test("Response schema is valid", function () {
    pm.response.to.have.jsonSchema(schema);
});
```

---

### 3.4 Data-Driven Testing (Chạy Test với Dữ liệu File)

Tạo file `test-data-register.json`:
```json
[
  { "testCaseId": "TC01", "email": "valid1@gmail.com", "password": "Password123!", "expectedStatus": 201 },
  { "testCaseId": "TC02", "email": "invalid-email", "password": "Password123!", "expectedStatus": 400 },
  { "testCaseId": "TC03", "email": "valid2@gmail.com", "password": "123", "expectedStatus": 400 }
]
```

Trong Postman Test script, gọi biến dữ liệu:
```javascript
const expectedCode = pm.iterationData.get("expectedStatus");
pm.test(`[${pm.iterationData.get("testCaseId")}] Status code matches expected`, function () {
    pm.response.to.have.status(expectedCode);
});
```

---

### 3.5 Thực Thi Lệnh Newman & Xuất Báo Cáo HTML

1. Cài đặt Newman và HtmlExtra Reporter:
   ```bash
   npm install -g newman newman-reporter-htmlextra
   ```
2. Chạy lệnh xuất báo cáo HTML:
   ```bash
   newman run EShop_API_Tests.postman_collection.json \
     -e EShop_Local.postman_environment.json \
     -r cli,htmlextra \
     --reporter-htmlextra-export ./newman-report.html
   ```

---

### 3.6 ✏️ Bài Tập Thực Hành Chương 3

1. Viết script Postman trong thẻ **Tests** để trích xuất `accessToken` từ response của API Đăng Nhập `POST /api/auth/login` và lưu tự động vào **Environment Variable** tên là `jwt_token`.
2. Tạo file `data.json` chứa 4 testcase kiểm thử chức năng tìm kiếm sản phẩm `GET /api/products/search?keyword={{keyword}}` và chạy thử bằng Newman.

---

<a name="chuong-4-tich-hop-cicd-voi-github-actions"></a>
## CHƯƠNG 4: TÍCH HỢP CI/CD VỚI GITHUB ACTIONS

### 4.1 Tạo Workflow File
Tạo file cấu hình tại đường dẫn `.github/workflows/api-testing.yml` trong GitHub Repository của bạn.

```yaml
name: EShop API Automated Testing

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  api-test:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout Source Code
      uses: actions/checkout@v3

    - name: Setup Node.js Environment
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install Newman & Reporters
      run: |
        npm install -g newman newman-reporter-htmlextra

    - name: Start SUT Application (Backend Service)
      run: |
        npm install
        npm start &
        npx wait-on http://localhost:5000/health --timeout 60000

    - name: Run Postman API Tests via Newman
      run: |
        newman run ./tests/EShop_Collection.json \
          -e ./tests/EShop_Env.json \
          -r cli,htmlextra \
          --reporter-htmlextra-export ./newman/report.html

    - name: Upload HTML Test Report Artifact
      if: always()
      uses: actions/upload-artifact@v3
      with:
        name: newman-html-report
        path: ./newman/report.html
```

---

### 4.2 Yêu Cầu 2 Commit Mẫu Trong HW06

HW06 yêu cầu cung cấp liên kết và ảnh chụp màn hình 2 commit trong GitHub Actions:
1.  **Passing Commit:** Tất cả test cases trong Newman run thành công 100% (Green Build).
2.  **Failing Commit:** Bạn chủ động sửa một assertion trong Postman (hoặc sửa dữ liệu test) để có ít nhất 1 test case bị **FAIL** (Red Build) nhằm chứng minh pipeline CI/CD phát hiện được lỗi thực sự.

---

<a name="chuong-5-phuong-phap-hop-tac-voi-ai-audit--critique"></a>
## CHƯƠNG 5: PHƯƠNG PHÁP HỢP TÁC VỚI AI, AUDIT & CRITIQUE

### 5.1 Quy Trình Prompt AI Theo Từng Bước (Step-by-Step Prompting)

❌ **Tránh tuyệt đối (Generic One-shot Prompt):**
> *"Hãy sinh tất cả testcase API đăng nhập cho tôi."*

✅ **Quy trình chuẩn 3 bước:**

*   **Đợt 1 (Cung cấp Context & Domain Partitioning):**
    > *"Tôi đang kiểm thử API Đăng ký tài khoản POST /api/auth/register có đặc tả như sau: [Dán Spec]. Hãy đóng vai một Senior QA, liệt kê các test case bao phủ phân vùng tương đương và giá trị biên cho 3 thuộc tính: email, password, và fullName. Trình bày dưới dạng bảng gồm các cột: TestID, Description, Input Data, Expected Status Code, Expected Response."*
*   **Đợt 2 (Yêu cầu bổ sung Security & State Transitions):**
    > *"Dựa trên đặc tả API trên, hãy tạo thêm các test case bảo mật bao gồm: SQL Injection trên trường email, XSS trên fullName, và test case gửi request không có header Content-Type."*
*   **Đợt 3 (Yêu cầu xuất ra Postman Test Script / JSON Schema):**
    > *"Cho test case TC01 (Đăng ký thành công), hãy viết đoạn code JavaScript Postman Test Script để assert status 201 và kiểm tra JSON Schema trả về."*

---

### 5.2 Kiểm Toán Test Case (AI Audit)

Sau khi AI sinh ra danh sách test case, bạn phải lập bảng **Audit**:

| TestID | Description do AI tạo | Đánh giá (`VALID`/`INVALID`/`INCOMPLETE`) | Lý do & Sửa đổi của sinh viên |
| :--- | :--- | :---: | :--- |
| **TC01** | Đăng ký email hợp lệ | **VALID** | Giữ nguyên. |
| **TC05** | Nhập mật khẩu 500 ký tự | **INVALID** | AI kỳ vọng status 200, nhưng đúng spec phải là 400 (Max length 256). Đã sửa lại Expected Status = 400. |
| **TC12** | Đăng ký bằng email trùng | **INCOMPLETE** | AI thiếu assert message lỗi tiếng Việt. Đã bổ sung check `message == "Email đã tồn tại"`. |

---

### 5.3 Mở Rộng 5 Test Case (Extend)

Bạn phải tự bổ sung thêm **ít nhất 5 test case/API** mà AI đã bỏ sót:

*   *Ví dụ lý do AI bỏ sót:*
    1.  AI không nắm được Business logic ẩn của EShop (VD: Khóa tài khoản khi nhập sai mật khẩu 5 lần trong 15 phút).
    2.  AI chỉ tập trung vào kiểm thử cú pháp (syntax) mà bỏ qua xung đột Race Condition khi 2 request gửi cùng lúc.

---

### 5.4 Viết Đoạn AI Critique (200 - 300 từ)

Cấu trúc đoạn văn phê bình AI:
1.  **Điểm AI làm tốt:** Sinh testcase cú pháp nhanh, phủ tốt các giá trị rỗng/null, hỗ trợ viết code script Postman mẫu.
2.  **Điểm AI hạn chế / Sai sót:** Thiếu hiểu biết về ngữ cảnh nghiệp vụ đặc thù (Business Domain context), hay suy đoán sai Status Code (nhầm giữa 400, 422 và 409), chưa tự động phát hiện được các lỗ hổng bảo mật lồng nhau như IDOR hay Privilege Escalation nếu không được prompt tỉ mỉ.
3.  **Bài học rút ra:** Con người phải đóng vai trò kiểm duyệt cuối cùng (Human-in-the-loop). AI chỉ là trợ lý tăng tốc độ làm việc, không thể thay thế tư duy phản biện của QA/Tester.

---

<a name="chuong-6-thiet-ke-ai-agent-skill-api-test-generator"></a>
## CHƯƠNG 6: THIẾT KẾ AI AGENT SKILL (API TEST GENERATOR)

Dành cho điểm mức độ **Create (G9.5)** trong HW06.

### 6.1 Sơ Đồ Kiến Trúc AI Test Generator Workflow (Mermaid)

```mermaid
flowchart TD
    SubGraph1[INPUT] --> Spec[API Specification .md / OpenAPI .yaml]
    Spec --> Agent[AI Test Generator Agent]
    
    subgraph Agent Core Process
        Agent --> Parser[1. Spec Parser Module]
        Parser --> PromptEngine[2. Dynamic Prompt Engine]
        PromptEngine --> LLM[3. LLM API - Claude / GPT-4]
        LLM --> PostProcessor[4. JSON & Schema Parser]
        PostProcessor --> RuleChecker[5. Business & Security Rule Checker]
    end
    
    RuleChecker --> Output1[Postman Collection .json]
    RuleChecker --> Output2[Markdown Test Report .md]
    RuleChecker --> Output3[Data CSV/JSON Files]
```

---

### 6.2 Mã Giả (Pseudo-code) Triển Khai Agent Generator (Python)

```python
import json
import openai

class APITestGeneratorAgent:
    def __init__(self, api_spec_path, api_key):
        self.api_spec = self.load_spec(api_spec_path)
        openai.api_key = api_key

    def load_spec(self, path):
        with open(path, 'r', encoding='utf-8') as f:
            return f.read()

    def generate_test_cases(self, endpoint_name):
        prompt = f"""
        You are an Expert API Tester. Given the API Spec below:
        {self.api_spec}

        Generate a JSON array of test cases for endpoint '{endpoint_name}' covering:
        1. Boundary Value Analysis
        2. Security (SQLi, XSS, IDOR)
        3. Schema Validation

        Return ONLY a JSON array with format:
        [{{"test_id": "", "description": "", "method": "", "path": "", "body": {{}}, "expected_status": 200}}]
        """

        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2
        )
        
        raw_output = response.choices[0].message.content
        return self.post_process_json(raw_output)

    def post_process_json(self, raw_text):
        # Lọc bỏ bớt markdown ```json ... ```
        cleaned = raw_text.replace("```json", "").replace("```", "").strip()
        test_cases = json.loads(cleaned)
        
        # Rule checker: Tự động chèn Custom Header X-Student-Id
        for tc in test_cases:
            if "headers" not in tc:
                tc["headers"] = {}
            tc["headers"]["X-Student-Id"] = "25127001"
            
        return test_cases

    def export_to_postman_collection(self, test_cases, output_file):
        # Code chuyển đổi danh sách test cases thành file Postman Collection JSON v2.1
        print(f"Exported {len(test_cases)} test cases to {output_file}")

# Sử dụng Script
if __name__ == "__main__":
    generator = APITestGeneratorAgent("./api_specification.md", "YOUR_API_KEY")
    cases = generator.generate_test_cases("POST /api/auth/register")
    generator.export_to_postman_collection(cases, "./EShop_Register_Tests.json")
```

---

## TỔNG KẾT BẢNG CHECKLIST NỘP BÀI HW06

Trước khi đóng gói file `.zip`, hãy dùng checklist sau để đảm bảo không bị điểm 0:

- [ ] File `.zip` đặt tên đúng cú pháp: `<StudentID>_HW06_AI_API_<SelfAssessedGrade>.zip`.
- [ ] Chọn đủ 3 API thuộc 3 Pool A, B, C khác nhau.
- [ ] Đủ $\ge 35$ test cases cho mỗi API (Tổng $\ge 105$ test cases).
- [ ] Bảng AI Audit Report gán nhãn `VALID`/`INVALID`/`INCOMPLETE` chi tiết.
- [ ] Đã thêm $\ge 5$ test cases mở rộng do sinh viên tự viết cho mỗi API.
- [ ] Tất cả Request Postman đều chạy qua Pre-request Script chứa header `X-Student-Id`.
- [ ] Báo cáo Newman HTML được xuất từ CLI.
- [ ] Link GitHub Actions chứa 2 commit mẫu (1 Pass, 1 Fail) kèm ảnh chụp màn hình.
- [ ] Sơ đồ tự vẽ và Mã giả của AI Test Generator (Cấp độ Create).
- [ ] Báo cáo lỗi (GitHub Issues) kèm ảnh chụp màn hình minh chứng.
- [ ] Đoạn văn AI Critique (200-300 từ) và File `README.md` tự đánh giá.
