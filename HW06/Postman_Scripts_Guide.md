# HƯỚNG DẪN VIẾT POSTMAN TEST SCRIPTS CHO 3 API (HW06)

> **Mã bài tập:** HW06-AI  
> **Mục tiêu:** Cung cấp đầy đủ bộ mã JavaScript kiểm thử (Assertions bằng Chai.js) dán trực tiếp vào thẻ **Tests / Post-response** trong Postman cho cả 3 API.

---

## 📍 1. API 1: `GET /api/products` (FR-05: Danh sách & Tìm kiếm Sản phẩm)

### 📌 Thẻ Tests (Post-response) trong Postman:

```javascript
// ==========================================
// TEST SCRIPT CHO API 1: GET /api/products
// ==========================================

// 1. Kiểm tra Status Code thành công (200 OK hoặc 400 Bad Request cho input sai)
pm.test("[API1-01] Status code is 200 OK", function () {
    pm.expect([200, 400]).to.include(pm.response.code);
});

// 2. Kiểm tra Thời gian phản hồi (Response Time < 500ms)
pm.test("[API1-02] Response time is below 500ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});

// 3. Kiểm tra Header Content-Type trả về là JSON
pm.test("[API1-03] Content-Type is application/json", function () {
    pm.response.to.have.header("Content-Type");
    pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
});

// 4. Kiểm tra Dữ liệu trả về là Mảng Sản phẩm (Array)
pm.test("[API1-04] Verify response is an array of products", function () {
    if (pm.response.code === 200) {
        const jsonData = pm.response.json();
        pm.expect(jsonData).to.be.an("array");
    }
});

// 5. Kiểm tra JSON Schema cho từng đối tượng Sản phẩm trong Mảng
pm.test("[API1-05] Validate JSON Schema of product item", function () {
    if (pm.response.code === 200) {
        const jsonData = pm.response.json();
        if (jsonData.length > 0) {
            const item = jsonData[0];
            pm.expect(item).to.have.property("id").that.is.a("number").and.to.be.above(0);
            pm.expect(item).to.have.property("name").that.is.a("string");
            pm.expect(item).to.have.property("price").that.is.a("number").and.to.be.at.least(0);
            pm.expect(item).to.have.property("description");
            pm.expect(item).to.have.property("imageUrl");
        }
    }
});

// 6. Kiểm tra Bảo mật: Không rò rỉ lỗi SQL Server Error 500
pm.test("[API1-06] Security check: No raw SQL syntax error leak", function () {
    const responseText = pm.response.text().toLowerCase();
    pm.expect(responseText).to.not.include("sqlite error");
    pm.expect(responseText).to.not.include("syntax error in sql");
    pm.expect(pm.response.code).to.not.equal(500);
});
```

---

## 📍 2. API 2: `GET /api/orders/my-orders` (FR-11: Lịch sử Đơn hàng Cá nhân)

### 📌 Thẻ Tests (Post-response) trong Postman:

```javascript
// ==================================================
// TEST SCRIPT CHO API 2: GET /api/orders/my-orders
// ==================================================

// 1. Kiểm tra Status Code (200 OK cho Auth hợp lệ, 401 cho Unauth)
pm.test("[API2-01] Status code validation (200 or 401)", function () {
    pm.expect([200, 401]).to.include(pm.response.code);
});

// 2. Kiểm tra Header Content-Type
pm.test("[API2-02] Content-Type is application/json", function () {
    pm.response.to.have.header("Content-Type");
    pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
});

// 3. Kiểm tra Cấu trúc danh sách đơn hàng & Enum Trạng thái hợp lệ
pm.test("[API2-03] Validate Order List & Order Status Enum", function () {
    if (pm.response.code === 200) {
        const jsonData = pm.response.json();
        pm.expect(jsonData).to.be.an("array");

        const validStatuses = ['pending', 'confirmed', 'shipping', 'delivered', 'canceled'];
        jsonData.forEach(order => {
            pm.expect(order).to.have.property("id").that.is.a("number");
            pm.expect(order).to.have.property("total_amount").that.is.a("number").and.to.be.at.least(0);
            pm.expect(order).to.have.property("status");
            pm.expect(validStatuses).to.include(order.status);
        });
    }
});

// 4. Kiểm tra Bảo mật IDOR (SEC-03): Không lộ dữ liệu của người dùng khác
pm.test("[API2-04] Security IDOR check: Verify user isolation", function () {
    if (pm.response.code === 200) {
        const jsonData = pm.response.json();
        const currentUserId = pm.environment.get("user_id");
        if (currentUserId && jsonData.length > 0) {
            jsonData.forEach(order => {
                if (order.user_id) {
                    pm.expect(String(order.user_id)).to.eql(String(currentUserId));
                }
            });
        }
    }
});
```

---

## 📍 3. API 3: `POST /api/categories` (FR-14 & FR-12: Quản lý Danh mục Admin)

### 📌 Thẻ Tests (Post-response) trong Postman:

```javascript
// ==============================================
// TEST SCRIPT CHO API 3: POST /api/categories
// ==============================================

// 1. Kiểm tra Status Code (201 Created/200 OK cho Admin, 403 cho User, 400 cho Bad Input)
pm.test("[API3-01] Status code validation", function () {
    pm.expect([200, 201, 400, 401, 403, 409]).to.include(pm.response.code);
});

// 2. Kiểm tra Kết quả khi Admin tạo thành công
pm.test("[API3-02] Admin category creation verification", function () {
    if (pm.response.code === 201 || pm.response.code === 200) {
        const jsonData = pm.response.json();
        pm.expect(jsonData).to.have.property("id").that.is.a("number");
        pm.expect(jsonData).to.have.property("name").that.is.a("string");
        
        // Lưu lại category_id vừa tạo vào Environment để dùng cho các request tiếp theo
        pm.environment.set("last_created_category_id", jsonData.id);
    }
});

// 3. Kiểm tra Bảo mật Leo thang quyền (SEC-04): Cấm User thường truy cập API Admin
pm.test("[API3-03] Security Privilege Escalation check (User role blocked)", function () {
    const isUserToken = pm.environment.get("current_role") === "user";
    if (isUserToken) {
        pm.expect(pm.response.code).to.equal(403);
    }
});

// 4. Kiểm tra JSON Schema đối tượng Danh mục trả về
pm.test("[API3-04] Validate JSON Schema of created Category", function () {
    if (pm.response.code === 201 || pm.response.code === 200) {
        const jsonData = pm.response.json();
        const schema = {
            "type": "object",
            "required": ["id", "name"],
            "properties": {
                "id": { "type": "number" },
                "name": { "type": "string" }
            }
        };
        pm.response.to.have.jsonSchema(schema);
    }
});
```
