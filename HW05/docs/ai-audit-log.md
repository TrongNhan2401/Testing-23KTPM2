# AI Audit Log

---

## [2026-08-17 15:30] Claude Sonnet 5 (Cursor)

**Prompt:**
Bạn là chuyên gia Performance Testing. Hệ thống SUT: EShop (Node.js + Express + SQLite, backend tại [http://localhost:3000](http://localhost:3000)).

Tôi cần chọn 3 nhóm endpoint KHÁC với nhóm đã chọn (products, users/me, login, register, forgot-password, checkout, cart, admin products).

Đề xuất workflow cho 3 test plans:

1. Load Test (Read-heavy): Đọc nhiều dữ liệu
2. Stress Test (Auth-heavy): Authentication flow với account lockout
3. Spike Test (Transactional): Giao dịch (cart + checkout)

Với mỗi workflow, liệt kê:

- Tên test (Load/Stress/Spike)
- Các API steps trong workflow
- CSV data cần thiết
- JMeter listener phù hợp (3 listener khác nhau)

Sau đó dựa vào ai-audit-logger.md để trình bày logs vào ai-audit-log.md.

**Output:**
Đã phân tích và đề xuất 3 nhóm endpoint mới:

## 3 Nhóm Endpoint Mới (Không trùng lặp)

### Nhóm 1: Categories + Product Details (Read-heavy) → Load Test

- GET /api/categories - Lấy danh sách danh mục
- GET /api/products?search={keyword} - Tìm kiếm sản phẩm
- GET /api/products/:id - Xem chi tiết sản phẩm

### Nhóm 2: Coupons + Order Management (Auth-heavy) → Stress Test

- GET /api/orders/my-orders - Lấy lịch sử đơn hàng (JWT required)
- GET /api/orders/:id - Xem chi tiết đơn hàng (JWT required)
- POST /api/apply-coupon - Áp dụng mã giảm giá (JWT required)

### Nhóm 3: Admin Orders Management (Transactional) → Spike Test

- GET /api/admin/orders - Dashboard đơn hàng (Admin JWT required)
- PUT /api/admin/orders/:id/status - Cập nhật trạng thái đơn hàng
- GET /api/orders/:id - Xem chi tiết đơn hàng

## Chi tiết Test Plans

### 1. LOAD TEST - Categories_Products_Load

**Workflow:**

1. GET /api/categories
2. GET /api/products?search=keyword
3. GET /api/products/{id}

**CSV Data:** categories_products.csv

```
id,search_keyword,product_id
1,iPhone,1
2,Samsung,2
3,OPPO,3
```

**Listener:** View Results Tree

### 2. STRESS TEST - Coupons_Orders_Stress

**Workflow:**

1. GET /api/orders/my-orders (JWT required)
2. GET /api/orders/{id} (JWT required)
3. POST /api/apply-coupon (JWT required)

**CSV Data:** coupons_orders.csv

```
order_id,coupon_code,total_amount,user_id
1,SAVE10,500000,1
2,BIGBUY,600000,2
3,VIP100,400000,3
```

**Listener:** Summary Report

### 3. SPIKE TEST - AdminOrders_Spike

**Workflow:**

1. GET /api/admin/orders (Admin JWT required)
2. PUT /api/admin/orders/{id}/status (Admin JWT required)
3. GET /api/orders/{id}

**CSV Data:** admin_orders.csv

```
order_id,status
1,confirmed
2,shipping
3,delivered
```

**Listener:** Aggregate Report

---

## [2026-08-17 15:45] Claude Sonnet 5 (Cursor) - Human Review & Correction

**Prompt:**
Hiện tại sau khi đọc các test plan của bạn thì tôi phát hiện rằng load và spike thì bị trùng work flow còn stress thì không hoàn toàn là auth theo yêu cầu của để. Nên tôi đề xuất các endpoint sau. Bạn hãy xem phân tích và sửa chữa lại các test plan sao cho hợp lý.

Sửa Load Test Plan cho GET /api/orders/my-orders
Sửa Stress Test Plan cho POST /api/reset-password
Sửa Spike Test Plan cho POST /api/admin/import-products

Sau đó ghi logs vào ai-audit-log.md

**Output:**
Đã phân tích và sửa các test plans theo đề xuất:

## Vấn đề đã được phát hiện (Human Review)

1. **Load & Spike trùng workflow** - Cả hai đều có workflow login + orders
2. **Stress không đúng yêu cầu** - Auth-heavy cần tập trung vào authentication flow với account lockout

## Các Test Plans đã sửa

### 1. LOAD TEST - Orders My-Orders (Read-Heavy)

**Workflow:**
```
POST /api/login → GET /api/orders/my-orders
```

**CSV Data:** load_orders.csv (25 users)
```csv
email,password
perfuser1@eshop.com,Pass1234!
...
```

**Listener:** View Results Tree

**JMeter Configuration:**
- 100 users, 60s ramp-up, 300s hold
- Think-time: 1000-3000ms
- Constant Throughput: 150 RPS

### 2. STRESS TEST - Reset Password (Auth-Heavy)

**Workflow:**
```
3x POST /api/login (wrong pass) → Wait 32s → POST /api/forgot-password → POST /api/reset-password → POST /api/login (new pass)
```

**CSV Data:** stress_reset_password.csv (10 users)
```csv
email,password,wrong_pass,new_password
stressuser1@eshop.com,Pass1234!,WrongPass1!,NewPass1234!
...
```

**Listener:** Summary Report

**Key Scenarios:**
- 1st failed login: 401, fail_count = 1
- 2nd failed login: 401, fail_count = 2
- 3rd failed login: 429 LOCKED (30s), fail_count = 3
- Login after 30s wait: 200 OK (unlocked)

### 3. SPIKE TEST - Admin Import Products (Transactional)

**Workflow:**
```
POST /api/login (admin) → GET /api/categories → POST /api/admin/import-products → GET /api/products
```

**CSV Data:** spike_import_products.csv (10 rows)
```csv
email,password,product_count,product_prefix
admin@eshop.com,Admin123!,5,ImportProduct
...
```

**Listener:** Aggregate Report

**Spike Pattern:**
- 0 → 100 users trong 5s
- Peak 60s
- 100 → 0 users trong 5s
- Recovery 60s

**Dynamic Payload Generation (BSF PreProcessor):**
```javascript
var products = [];
for (var i = 1; i <= count; i++) {
    products.push({
        "name": prefix + "_" + i + "_" + System.currentTimeMillis(),
        "price": Math.floor(Math.random() * 900000) + 100000,
        "description": "Test product " + i,
        "imageUrl": "",
        "category_id": parseInt(categoryId) || 1
    });
}
```

## Files đã tạo/sửa

### Test Plans (Markdown)
- `HW05/test-plans/Load_OrdersMyOrders.md`
- `HW05/test-plans/Stress_ResetPassword.md`
- `HW05/test-plans/Spike_AdminImportProducts.md`

### Test Data (CSV)
- `HW05/test-data/load_orders.csv` (25 users)
- `HW05/test-data/stress_reset_password.csv` (10 users)
- `HW05/test-data/spike_import_products.csv` (10 rows)

### Files đã xóa (cũ)
- `HW05/test-plans/Load_CategoriesProducts.md`
- `HW05/test-plans/Stress_CouponsOrders.md`
- `HW05/test-plans/Spike_AdminOrders.md`
- `HW05/test-data/load_categories_products.csv`
- `HW05/test-data/stress_coupons_orders.csv`
- `HW05/test-data/spike_admin_orders.csv`

---

