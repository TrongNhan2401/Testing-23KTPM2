# Spike Test Plan - Admin Import Products (Transactional)

## 1. Tổng quan

| Thuộc tính | Giá trị |
|------------|---------|
| **Test Name** | `{StudentID}_Spike_AdminImportProducts_{YYYYMMDD}` |
| **Test Type** | Spike Testing |
| **Endpoint Group** | Admin Import Products (Transactional) |
| **Mục đích** | Kiểm tra phản ứng hệ thống với sudden spikes trong bulk import |

## 2. Background: FR-16 (từ SRS)

### FR-16: Import Sản phẩm từ CSV (JSON Array)
- Admin có thể tải lên file CSV để import nhiều sản phẩm cùng lúc
- **Validation:** `name` không rỗng, `price` phải > 0
- **Rollback:** Nếu có lỗi ở bất kỳ dòng nào → toàn bộ **rollback** (all-or-nothing)
- Đây là **transactional operation** nặng về database

## 3. Workflow API - Spike Test

```
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: POST /api/login (Admin)                            │
│  - Đăng nhập với tài khoản admin                          │
│  - Body: {"email":"${email}","password":"${password}"}       │
│  - JSON Extractor: $.token -> ${admin_token}                 │
│  - JSON Extractor: $.user.role -> ${user_role}               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 2: GET /api/categories                                │
│  - Lấy danh sách categories để có valid category_id       │
│  - Header: Authorization: Bearer ${admin_token}              │
│  - JSON Extractor: $[0].id -> ${category_id}               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 3: POST /api/admin/import-products                    │
│  - Bulk import nhiều sản phẩm cùng lúc (transactional)   │
│  - Header: Authorization: Bearer ${admin_token}              │
│  - Body: {"products":[...]} với size từ CSV               │
│  - Database: INSERT nhiều rows + transaction               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 4: GET /api/products                                  │
│  - Verify sản phẩm đã được import                         │
│  - Header: Authorization: Bearer ${admin_token}              │
│  - Response: Array products                                │
└─────────────────────────────────────────────────────────────┘
```

## 4. CSV Data: `spike_import_products.csv`

```csv
email,password,product_count,product_prefix
admin@eshop.com,Admin123!,5,ImportProduct
admin@eshop.com,Admin123!,10,ImportProduct
admin@eshop.com,Admin123!,15,ImportProduct
admin@eshop.com,Admin123!,20,ImportProduct
admin@eshop.com,Admin123!,25,ImportProduct
admin@eshop.com,Admin123!,30,ImportProduct
admin@eshop.com,Admin123!,35,ImportProduct
admin@eshop.com,Admin123!,40,ImportProduct
admin@eshop.com,Admin123!,45,ImportProduct
admin@eshop.com,Admin123!,50,ImportProduct
```

## 5. JMeter Configuration - Spike Test Pattern

### Spike Profile (Sudden Burst)
| Phase | Duration | Users | Pattern |
|-------|----------|-------|---------|
| **Idle** | 30s | 0 users | Baseline |
| **Spike Up** | 5s | 0 → 100 users | Instant spike |
| **Peak** | 60s | 100 users | Sustained peak |
| **Spike Down** | 5s | 100 → 0 users | Instant drop |
| **Recovery** | 60s | 0 users | Observe recovery |

### Thread Group Configuration
| Parameter | Value | Giải thích |
|-----------|-------|------------|
| Number of Threads (Users) | 100 | Peak load (spike to) |
| Ramp-up Period (seconds) | 5 | Cực kỳ nhanh (spike) |
| Hold Load For (seconds) | 60 | Giữ peak 1 phút |
| Ramp-down (seconds) | 5 | Cực kỳ nhanh |

### Think Time
- **Constant Timer:** 500 ms
- Tối thiểu để simulate rapid bulk operations

## 6. Listeners

| Listener | Mục đích |
|----------|----------|
| **Aggregate Report** | Báo cáo tổng hợp theo transaction |
| Response Times Over Time | Đồ thị response time theo thời gian |
| Transactions per Second | Số transactions/giây |

## 7. Assertions

| Assertion | Condition | Mục đích |
|-----------|-----------|----------|
| Response Code | 200 | Import thành công |
| Response Code | 403 | Unauthorized (non-admin) |
| Response Data | Contains "success" hoặc "imported" | Kiểm tra import response |
| Duration | < 5000 ms | SLO cho spikes |

## 8. Transactional Behavior

Theo FR-16:
- Bulk import là **transactional** → all-or-nothing
- Nếu 1 sản phẩm fail → rollback toàn bộ
- Spike test sẽ verify:
  1. System handles rapid bulk operations
  2. Database transactions don't deadlock
  3. Response time degrades gracefully under load

## 9. Expected Metrics

| Metric | Threshold | Ghi chú |
|--------|-----------|---------|
| Average Response Time (Idle) | < 500 ms | Baseline |
| Average Response Time (Peak) | < 3000 ms | Acceptable under spike |
| Peak Response Time | < 5000 ms | Maximum acceptable |
| Error Rate (Peak) | < 5% | Some degradation expected |
| Recovery Time | < 30s | Time to return to baseline |

## 10. JMeter Elements Structure

```
Test Plan: {StudentID}_Spike_AdminImportProducts_{YYYYMMDD}
├── HTTP Request Defaults (localhost:3000)
├── HTTP Header Manager
│   └── Content-Type: application/json
├── CSV Data Set Config (spike_import_products.csv)
├── Constant Timer (500ms)
│
├── Thread Group: Spike_Test (100 users, 5s ramp-up, 60s hold, 5s ramp-down)
│   └── Transaction Controller: "Spike_Admin_Import_Products"
│       ├── HTTP Request: POST /api/login
│       │   ├── Body: {"email":"${email}","password":"${password}"}
│       │   └── JSON Extractor: $.token -> ${admin_token}
│       ├── HTTP Header Manager
│       │   └── Authorization: Bearer ${admin_token}
│       ├── HTTP Request: GET /api/categories
│       │   └── JSON Extractor: $[0].id -> ${category_id}
│       ├── HTTP Request: POST /api/admin/import-products
│       │   ├── Body: Dynamic JSON với ${product_count} products
│       │   └── Response Assertion (200, <5000ms)
│       └── HTTP Request: GET /api/products
│           └── Response Assertion (200)
│
└── Listeners
    ├── Aggregate Report
    ├── Response Times Over Time
    └── Transactions per Second
```

## 11. Dynamic Product Payload Generation

Sử dụng **BSF PreProcessor** (JavaScript) để generate products array:

```javascript
var count = vars.get("product_count");
var prefix = vars.get("product_prefix");
var categoryId = vars.get("category_id");

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

vars.put("products_json", JSON.stringify({"products": products}));
```

## 12. Spike Test Execution Timeline

```
Timeline (seconds):
|---30s---|---5s---|-------60s-------|---5s---|---60s---|
   Idle    Spike      Peak         Down     Recovery
   (0)      Up       (100)        (0)       (0)

Expected Behavior:
- 0-30s:   No load, baseline metrics
- 30-35s:  Sudden spike to 100 users
- 35-95s:  Sustained 100 users, monitor degradation
- 95-100s: Sudden drop to 0 users
- 100-160s: Recovery period, verify return to baseline
```

## 13. Human Review Checklist

- [ ] Spike pattern đúng chuẩn spike test? (Có - sudden up/down 0→100→0)
- [ ] Admin workflow realistic? (Có - login + categories + import + verify)
- [ ] CSV data test various import sizes? (Có - 5→50 products)
- [ ] Timer phù hợp cho transactional? (Có - 500ms constant)
- [ ] Dynamic payload generation hoạt động? (Có - BSF PreProcessor)
- [ ] Listener Aggregate Report cho Spike Test? (Có)
- [ ] Recovery monitoring được setup? (Có - 60s recovery period)

## 14. Success Criteria

| Criterion | Target | Measurement |
|-----------|--------|-------------|
| Spike Handling | System handles 0→100 instant | No crash |
| Peak Performance | < 3000ms avg response | Response Times Over Time |
| Error Rate | < 5% during peak | Aggregate Report |
| Recovery Time | < 30s to baseline | Response time returns to < 500ms |
| Transaction Integrity | All-or-nothing works | Verify no partial imports |
