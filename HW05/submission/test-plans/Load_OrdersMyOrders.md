# Load Test Plan - Orders My-Orders (Read-Heavy)

## 1. Tổng quan

| Thuộc tính | Giá trị |
|------------|---------|
| **Test Name** | `{StudentID}_Load_OrdersMyOrders_{YYYYMMDD}` |
| **Test Type** | Load Testing |
| **Endpoint Group** | Orders My-Orders (Read-heavy) |
| **Mục đích** | Kiểm tra hiệu năng đọc dữ liệu orders với tải expected |

## 2. Workflow API

```
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: POST /api/login                                    │
│  - Đăng nhập để lấy JWT token                              │
│  - Body: {"email":"${email}","password":"${password}"}       │
│  - Response: {"token":"...","user":{...}}                   │
│  - JSON Extractor: $.token -> ${auth_token}                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 2: GET /api/orders/my-orders                          │
│  - Lấy lịch sử đơn hàng của user (read-heavy operation)   │
│  - Header: Authorization: Bearer ${auth_token}              │
│  - Response: Array of orders với chi tiết                  │
│  - Database query: SELECT orders WHERE user_id = ?         │
└─────────────────────────────────────────────────────────────┘
```

## 3. CSV Data: `load_orders.csv`

```csv
email,password
perfuser1@eshop.com,Pass1234!
perfuser2@eshop.com,Pass1234!
perfuser3@eshop.com,Pass1234!
perfuser4@eshop.com,Pass1234!
perfuser5@eshop.com,Pass1234!
perfuser6@eshop.com,Pass1234!
perfuser7@eshop.com,Pass1234!
perfuser8@eshop.com,Pass1234!
perfuser9@eshop.com,Pass1234!
perfuser10@eshop.com,Pass1234!
perfuser11@eshop.com,Pass1234!
perfuser12@eshop.com,Pass1234!
perfuser13@eshop.com,Pass1234!
perfuser14@eshop.com,Pass1234!
perfuser15@eshop.com,Pass1234!
perfuser16@eshop.com,Pass1234!
perfuser17@eshop.com,Pass1234!
perfuser18@eshop.com,Pass1234!
perfuser19@eshop.com,Pass1234!
perfuser20@eshop.com,Pass1234!
perfuser21@eshop.com,Pass1234!
perfuser22@eshop.com,Pass1234!
perfuser23@eshop.com,Pass1234!
perfuser24@eshop.com,Pass1234!
perfuser25@eshop.com,Pass1234!
```

## 4. JMeter Configuration

### Thread Group
| Parameter | Value | Giải thích |
|-----------|-------|------------|
| Number of Threads (Users) | 100 | 100 concurrent users |
| Ramp-up Period (seconds) | 60 | Tăng 100 users trong 60s (1.67 users/s) |
| Hold Load For (seconds) | 300 | Giữ ổn định 5 phút (dài hơn để collect metrics) |
| Loop Count | Forever | Lặp theo scheduler |
| Scheduler | Enabled | Timer-based execution |

### Think Time (Uniform Random Timer)
- **Min Delay:** 1000 ms
- **Max Delay:** 3000 ms
- **Average:** 2000 ms

### Throughput Control
- **Constant Throughput Timer:** 150 RPS
- Kiểm soát requests/giây ở mức ổn định

## 5. Listeners

| Listener | Mục đích |
|----------|----------|
| **View Results Tree** | Xem chi tiết từng request/response, debug |
| View Results in Table | Bảng summary các requests |
| Generate Summary Report | Bảng tổng hợp |

## 6. Assertions

| Assertion | Condition | Mục đích |
|-----------|-----------|----------|
| Response Code | 200 | Kiểm tra thành công |
| Response Data | Contains "orders" hoặc "[]" | Kiểm tra data structure (array rỗng OK) |
| Duration | < 2000 ms | SLO: p95 latency |

## 7. Expected Metrics

| Metric | Threshold | Ghi chú |
|--------|-----------|---------|
| Average Response Time | < 500 ms | |
| p95 Response Time | < 1500 ms | |
| Error Rate | < 1% | |
| Throughput | > 100 RPS | |

## 8. JMeter Elements Structure

```
Test Plan: {StudentID}_Load_OrdersMyOrders_{YYYYMMDD}
├── HTTP Request Defaults (localhost:3000)
├── HTTP Header Manager
│   └── Content-Type: application/json
├── CSV Data Set Config (load_orders.csv)
│   └── Variable Names: email,password
├── Constant Throughput Timer (150 RPS)
├── Uniform Random Timer (1000-3000ms)
│
├── Thread Group (100 users, 60s ramp-up, 300s hold)
│   └── Transaction Controller: "Load_Orders_MyOrders"
│       ├── HTTP Request: POST /api/login
│       │   ├── Body: {"email":"${email}","password":"${password}"}
│       │   └── JSON Extractor: $.token -> ${auth_token}
│       ├── HTTP Header Manager
│       │   └── Authorization: Bearer ${auth_token}
│       └── HTTP Request: GET /api/orders/my-orders
│           └── Response Assertion (200, <2000ms)
│
└── Listeners
    ├── View Results Tree
    ├── View Results in Table
    └── Generate Summary Report
```

## 9. Human Review Checklist

- [ ] Ramp-up 60s có hợp lý cho 100 users? (Có - gradual increase)
- [ ] Think-time 1000-3000ms có realistic cho đọc order history? (Có - user đọc qua orders)
- [ ] CSV data đủ users? (Có - 25 users)
- [ ] Assertion không fail oan khi user không có order? (Có - kiểm tra "orders" OR "[]")
- [ ] Listener phù hợp cho Load Test? (View Results Tree - chi tiết)
- [ ] 300s hold đủ collect stable metrics? (Có - 5 phút)
