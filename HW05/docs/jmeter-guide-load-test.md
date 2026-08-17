# Hướng dẫn JMeter GUI - Load Test Orders My-Orders

## File đã tạo

```
HW05/
├── 23127443_Load_OrdersMyOrders_20260817.jmx  ← File JMX
├── test-data/
│   └── load_orders.csv                          ← CSV data
└── results/                                    ← Thư mục lưu kết quả
```

---

## Bước 1: Mở JMeter và Import File JMX

1. **Mở JMeter GUI**
   - Windows: Chạy `jmeter.bat` trong thư mục cài đặt JMeter
   - Hoặc tìm shortcut trong Start Menu

2. **Open Test Plan**
   - Menu: `File` → `Open` (Ctrl+O)
   - Navigate đến: `HW05/23127443_Load_OrdersMyOrders_20260817.jmx`
   - Click `Open`

---

## Bước 2: Kiểm tra cấu hình Test Plan

### 2.1 Test Plan (Root Node)
```
TestPlan: 23127443_Load_OrdersMyOrders_20260817
├── HTTP Request Defaults: localhost:3000
├── CSV Data Set Config: load_orders.csv
├── HTTP Header Manager: Content-Type=application/json
├── Constant Throughput Timer: 150 RPS
└── Thread Group: Load Test (100 users, 60s ramp-up, 300s hold)
```

### 2.2 Kiểm tra Thread Group
Click vào `Load Test - Orders My-Orders` trong Tree:

| Setting | Value | Verify |
|---------|-------|--------|
| Number of Threads | 100 | 100 concurrent users |
| Ramp-up Period | 60 | 60 seconds |
| Scheduler | ✅ Enabled | |
| Duration | 360 | 6 phút (60 ramp-up + 300 hold) |

### 2.3 Kiểm tra CSV Data Set Config
Click vào `CSV Data Set Config`:

| Setting | Value | Verify |
|---------|-------|--------|
| Filename | `test-data/load_orders.csv` | Đường dẫn đúng |
| Variable Names | `email,password` | 2 biến |
| Recycle on EOF | ✅ true | Loop data |
| Stop Thread on EOF | false | Continue testing |
| Sharing Mode | shareMode.all | All threads share |

---

## Bước 3: Kiểm tra Workflow

Trong Thread Group → `Load_Orders_MyOrders` Transaction Controller:

### 3.1 STEP 1: POST /api/login
- **Path:** `/api/login`
- **Method:** POST
- **Body:** `{"email":"${email}","password":"${password}"}`
- **JSON Extractor:** Extract `$.token` → variable `token`

### 3.2 STEP 2: GET /api/orders/my-orders
- **Path:** `/api/orders/my-orders`
- **Method:** GET
- **Header:** `Authorization: Bearer ${token}`
- **Assertion:** Response Code = 200

---

## Bước 4: Kiểm tra Listeners

Test Plan có 3 listeners:

### 4.1 View Results Tree (PRIMARY)
- **Purpose:** Xem chi tiết từng request/response
- **Output file:** `results/load-orders-view-results.jtl`
- **Lưu ý:** Chỉ dùng để debug, có thể disable khi chạy chính thức (tốn memory)

### 4.2 View Results in Table
- **Purpose:** Bảng tổng hợp các requests
- **Output file:** `results/load-orders-table.jtl`

### 4.3 Summary Report
- **Purpose:** Tổng hợp: Total requests, Avg, Min, Max, Error %
- **Output file:** `results/load-orders-summary.jtl`

---

## Bước 5: Cấu hình trước khi chạy (IMPORTANT)

### 5.1 Tạo thư mục results
Đảm bảo thư mục `HW05/results/` tồn tại.

### 5.2 Chỉnh sửa đường dẫn CSV (nếu cần)
Nếu JMeter không tìm thấy file CSV:
1. Click `CSV Data Set Config`
2. Sửa `Filename` thành đường dẫn tuyệt đối:
   ```
   E:\Documents\HCMUS\Semester3_Year3\KTPM\Testing\HW05\test-data\load_orders.csv
   ```

### 5.3 Tạo Users (nếu chưa có)
Trước khi chạy, đảm bảo các users tồn tại trong database. Chạy script tạo users:

```bash
# Register các users từ CSV
# perfuser1@eshop.com ... perfuser25@eshop.com
# Password: Pass1234!
```

Hoặc sử dụng test user có sẵn: `test@eshop.com` / `Test1234!`

---

## Bước 6: Chạy Test

### 6.1 Start (Chạy)
- Click **Green Play Button** (▶) trên Toolbar
- Hoặc: `Run` → `Start`
- Keyboard: `Ctrl+Shift+R`

### 6.2 Monitor Progress
- **Console/Log Panel** (dưới cùng): Xem log messages
- **View Results Tree**: Xem requests đang chạy
- **Thread count**: Hiển thị số active threads

### 6.3 Stop (Dừng)
- Click **Red Stop Button** (■)
- Hoặc: `Run` → `Stop`
- Keyboard: `Ctrl+Shift+S`

### 6.4 Reset
- Click **Red Stop Button** (■) + `Ctrl+Shift+E` (Clear)

---

## Bước 7: Xem kết quả

### 7.1 View Results Tree
1. Click vào `View Results Tree`
2. Filter theo Status: All / Successful / Failed
3. Click vào một sample để xem:
   - **Request Tab:** Headers, Body
   - **Response Tab:** Body (JSON), Headers
   - **Sampler Result Tab:** Response code, time, size

### 7.2 Summary Report
1. Click vào `Summary Report`
2. Xem các metrics chính:

| Metric | Ý nghĩa |
|--------|---------|
| # Samples | Tổng số requests |
| Average | Response time trung bình (ms) |
| Min | Response time thấp nhất (ms) |
| Max | Response time cao nhất (ms) |
| Error % | Tỷ lệ lỗi |
| Throughput | Requests/giây |

### 7.3 Calculate p95 Latency
Sau khi test xong:
1. Export file `load-orders-summary.jtl`
2. Tính p95:
   ```python
   # Sử dụng script Python
   import pandas as pd
   df = pd.read_csv('load-orders-summary.jtl')
   p95 = df['Latency'].quantile(0.95)
   print(f"p95 Latency: {p95} ms")
   ```

---

## Bước 8: Cleanup sau Test

### 8.1 Disable View Results Tree (tiết kiệm memory)
Trước khi chạy test tiếp theo:
1. Right-click `View Results Tree`
2. Uncheck `Enable`

### 8.2 Xóa kết quả cũ
1. Right-click listener
2. Select `Clear All`

---

## Troubleshooting

### Lỗi: "File not found" cho CSV
**Nguyên nhân:** JMeter không tìm thấy file CSV
**Giải pháp:**
- Sử dụng đường dẫn tuyệt đối
- Hoặc đặt CSV cùng folder với JMX
- Hoặc chạy JMeter từ thư mục HW05

### Lỗi: "401 Unauthorized"
**Nguyên nhân:** Login failed (user không tồn tại hoặc sai password)
**Giải pháp:**
- Tạo users trước khi test
- Hoặc sử dụng test@eshop.com / Test1234!

### Lỗi: Connection refused
**Nguyên nhân:** EShop backend không chạy
**Giải pháp:**
- Start EShop: `npm start` trong folder eshop

### JMeter chạy chậm / Out of Memory
**Nguyên nhân:** View Results Tree lưu quá nhiều data
**Giải pháp:**
- Disable View Results Tree
- Tăng JVM heap size:
  ```
  set HEAP=-Xms2g -Xmx4g
  ```

---

## Quick Reference

| Action | Keyboard |
|--------|----------|
| Start | Ctrl+Shift+R |
| Stop | Ctrl+Shift+S |
| Clear Results | Ctrl+Shift+E |
| Open File | Ctrl+O |
| Save | Ctrl+S |

---

## Output Files

Sau khi chạy xong, các file JTL sẽ được lưu trong `HW05/results/`:

```
HW05/results/
├── load-orders-view-results.jtl   # Chi tiết (lớn)
├── load-orders-table.jtl          # Bảng
└── load-orders-summary.jtl         # Summary (dùng để phân tích)
```
