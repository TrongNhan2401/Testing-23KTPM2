# HƯỚNG DẪN VIẾT POSTMAN TEST SCRIPTS CHO 3 API (HW06)

> **Mã bài tập:** HW06-AI  
> **MSSV:** `23127443`  
> **Mục tiêu:** Cung cấp đầy đủ bộ mã JavaScript kiểm thử (Assertions bằng Chai.js) dán trực tiếp vào thẻ **Tests / Post-response** trong Postman cho cả 3 API.

---

## 📍 1. API 1: `GET /api/products` (FR-05: Danh sách & Tìm kiếm Sản phẩm)

```javascript
// ==========================================
// TEST SCRIPT CHO API 1: GET /api/products
// ==========================================

// 1. Kiểm tra Status Code thành công
pm.test("[API1-01] Status code is 200 OK", function () {
    pm.response.to.have.status(200);
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
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an("array");
});

// 5. Kiểm tra JSON Schema cho từng đối tượng Sản phẩm trong Mảng
pm.test("[API1-05] Validate JSON Schema of product item", function () {
    const jsonData = pm.response.json();
    if (jsonData.length > 0) {
        const item = jsonData[0];
        pm.expect(item).to.have.property("id").that.is.a("number").and.to.be.above(0);
        pm.expect(item).to.have.property("name").that.is.a("string");
        pm.expect(item).to.have.property("price").that.is.a("number").and.to.be.at.least(0);
    }
});
```

---

## 📍 2. API 2: `GET /api/orders/my-orders` (FR-11: Lịch sử Đơn hàng Cá nhân)

```javascript
// ==================================================
// TEST SCRIPT CHO API 2: GET /api/orders/my-orders
// ==================================================

// 1. Kiểm tra Status Code thành công
pm.test("[API2-01] Status code is 200 OK", function () {
    pm.response.to.have.status(200);
});

// 2. Kiểm tra Header Content-Type
pm.test("[API2-02] Content-Type is application/json", function () {
    pm.response.to.have.header("Content-Type");
    pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
});

// 3. Kiểm tra Cấu trúc danh sách đơn hàng & Enum Trạng thái hợp lệ
pm.test("[API2-03] Validate Order List & Order Status Enum", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an("array");
    const validStatuses = ['pending', 'confirmed', 'shipping', 'delivered', 'canceled'];
    jsonData.forEach(order => {
        pm.expect(order).to.have.property("id");
        pm.expect(order).to.have.property("status");
        pm.expect(validStatuses).to.include(order.status);
    });
});
```

---

## 📍 3. API 3: `POST /api/categories` (FR-14 & FR-12: Quản lý Danh mục Admin)

```javascript
// ==============================================
// TEST SCRIPT CHO API 3: POST /api/categories
// ==============================================

// 1. Kiểm tra Status Code tạo thành công
pm.test("[API3-01] Status code is 201 Created or 200 OK", function () {
    pm.expect([200, 201]).to.include(pm.response.code);
});

// 2. Kiểm tra Danh mục tạo mới trả về id và name hợp lệ
pm.test("[API3-02] Category created successfully", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("id").that.is.a("number");
    pm.expect(jsonData).to.have.property("name").that.is.a("string");
});
```
