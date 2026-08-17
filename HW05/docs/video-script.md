# Video Demo Script — HW05 Performance Testing

**Student ID:** 23127443  
**Target duration:** ≥ 6 minutes total (3 clips: Load, Stress, Spike)  
**Format:** Unlisted YouTube  
**Language:** Vietnamese narration (bắt buộc)

---

## 🎬 Phần mở đầu (30 giây) — QUAN TRỌNG

> *"Xin chào, em là [TÊN], MSSV 23127443. Hôm nay em sẽ demo bài HW05 — Performance Testing với JMeter. Em sẽ chạy 3 kịch bản: Load Test, Stress Test và Spike Test trên hệ thống EShop chạy local."*

**Trên màn hình:**
- Mở 2 cửa sổ song song (50/50): **JMeter** bên trái, **Task Manager** bên phải
- Cả 2 phải thấy trong **1 frame** (yêu cầu đề bài)

---

## 🔍 Trước khi chạy — Giải thích file JMX (1 phút)

> *"Trước khi chạy, em xin giải thiệu ngắn về file JMX của em. File JMX là file cấu hình test plan của JMeter, được viết bằng XML."*

**Mở file `23127443_Load_OrdersMyOrders_20260817.jmx`** trong Notepad hoặc JMeter GUI:

### Load Test (100 VUs, 2 phút)
> *"File Load Test có 3 thành phần chính:"*

| Thành phần | Giá trị | Mục đích |
|------------|---------|----------|
| **Number of Threads** | 100 users | Giả lập 100 user đồng thời |
| **Ramp-up** | 60 giây | Mỗi giây thêm ~1.7 user mới |
| **Duration** | 120 giây (2 phút) | Chạy trong 2 phút |

> *"Trong Load Test em test flow Orders/MyOrders — tức là user đăng nhập rồi xem đơn hàng. Em dùng **Constant Throughput Timer = 150 req/phút** để giả lập tải thực tế, không spam request."*

### Stress Test (80 VUs, 1.5 phút)
> *"Stress Test em test flow Reset Password với 80 user đồng thời trong 90 giây."*

### Spike Test (100 VUs, 1 phút)
> *"Spike Test em test flow Admin Import Products với 100 user đồng thời trong 60 giây — đây là kịch bản tải đột biến."*

---

## ❓ Tại sao mở Node.js trong Task Manager? (Giải thích 30 giây)

> *"Nhiều bạn thắc mắc tại sao em lại mở Node.js JavaScript Runtime trong Task Manager. Lý do là:"*

```
┌──────────────────────────────────────────────────────────┐
│  EShop SUT (System Under Test)                            │
│  ┌─────────────────────────────────────────────┐         │
│  │  Node.js server chạy trên localhost:3000    │         │
│  │  Framework: Express.js                      │         │
│  │  Database: SQLite (file-based)              │         │
│  └─────────────────────────────────────────────┘         │
│           ↑                                                │
│           │ HTTP request                                   │
│           │                                                │
│  ┌─────────────────────────────────────────────┐         │
│  │  JMeter (100 VUs) gửi request đến SUT        │         │
│  └─────────────────────────────────────────────┘         │
└──────────────────────────────────────────────────────────┘
```

> *"EShop của em được viết bằng **Node.js + Express.js**. Khi em chạy SUT, Node.js process sẽ chạy trong background và sử dụng CPU để xử lý request. Khi JMeter gửi 100-200 request đồng thời, Node.js sẽ phải xử lý chúng, do đó **CPU của Node.js sẽ tăng**."*

> *"Đó là lý do em mở **Node.js JavaScript Runtime** trong Task Manager — để theo dõi xem SUT có đang hoạt động không, và CPU có tăng khi tải cao không."*

**Trên màn hình** (Task Manager bên phải):
- Tìm dòng **"Node.js: JavaScript Runtime"**
- Sắp xếp theo **CPU** để thấy rõ nhất
- Chuột phải → **"Show more details"** nếu chưa thấy

---

# 📹 CLIP 1: LOAD TEST (2 phút)

## Mở đầu clip (10 giây)
> *"Bây giờ em sẽ chạy Load Test đầu tiên."*

## Bước 1: Khởi động SUT (10 giây)

**Mở terminal, chạy:**
```bash
cd e:\Documents\HCMUS\Semester3_Year3\KTPM\Testing\HW05\jmeter\eshop
node server.js
```

> *"Em khởi động SUT EShop trước. Server Node.js sẽ chạy ở port 3000."*

**Quan sát:** Terminal hiện "Server running on port 3000" hoặc tương tự.

**Trong Task Manager** (bên phải):
- Sẽ thấy **Node.js JavaScript Runtime** xuất hiện
- CPU ban đầu: **0%** (chưa có request)

## Bước 2: Mở JMX trong JMeter (15 giây)

**Mở JMeter GUI:**
```bash
cd "e:\Documents\HCMUS\Semester3_Year3\KTPM\Testing\HW05\jmeter\bin"
jmeter.bat
```

**Trong JMeter:** File → Open → chọn `23127443_Load_OrdersMyOrders_20260817.jmx`

> *"Em mở file JMX Load Test. Các bạn có thể thấy Thread Group với 100 VUs, duration 120 giây."*

**Quan sát panel trái JMeter:**
- Test Plan
  - Setup - Register Users (1 VU, setup data)
  - Load Test - Orders My-Orders (100 VUs)
  - Listeners (Summary Report, View Results Tree)

## Bước 3: Bấm nút Start (5 giây)

**Bấm nút ▶ (Start)** màu xanh hoặc `Ctrl+R`

> *"Em bấm Start. Test sẽ chạy 2 phút, trong đó 60 giây đầu là ramp-up (tăng dần user từ 0 lên 100), 60 giây sau là steady state."*

## Bước 4: Quan sát (60 giây)

### Trong Task Manager (bên phải):
> *"Các bạn chú ý bên phải — Node.js JavaScript Runtime."*

| Thời gian | CPU Node.js | Giải thích |
|-----------|-------------|------------|
| 0-60s | 0% → 5% | Ramp-up, ít user |
| 60-120s | 5% → 15% | Steady state, 100 users |
| Tối đa | ~15-25% | Đỉnh điểm |

> *"CPU của Node.js sẽ tăng từ 0% lên khoảng 10-20% khi 100 user đồng thời gửi request. Tại sao không cao hơn? Vì SUT chạy local với SQLite, response time chỉ khoảng 2-5ms — quá nhanh để CPU phải 'vật lộn'."*

### Trong JMeter (bên trái):
**Mở tab Summary Report** (click vào listener Summary Report)

> *"Bên trái là Summary Report của JMeter. Các bạn thấy:"*

| Label | Samples | Average | Error % | Throughput |
|-------|---------|---------|---------|------------|
| POST /api/login | 200 | 5ms | 0.0% | 50/sec |
| GET /api/orders/my-orders | 200 | 3ms | 0.0% | 50/sec |

> *"**Error rate = 0%** — tất cả request đều thành công. Đây là kết quả mong đợi của Load Test."*

## Bước 5: Kết thúc Load Test (15 giây)

Khi test xong (sau 2 phút), JMeter sẽ tự dừng.

> *"Load Test kết thúc với 0 errors. Đây là kết quả tốt — hệ thống chịu tải ổn định với 100 user đồng thời."*

**Lưu JTL log:**
- Click chuột phải vào **Summary Report** → **Save As**
- Lưu vào `Results/load-orders-summary.jtl`

---

# 📹 CLIP 2: STRESS TEST (1.5 phút)

## Mở đầu clip (10 giây)
> *"Tiếp theo em chạy Stress Test — kịch bản ép hệ thống đến giới hạn để tìm điểm gãy."*

## Bước 1: Mở file JMX (5 giây)

**Trong JMeter:** File → Open → chọn `23127443_Stress_ResetPassword_20260817.jmx`

> *"File này test flow Reset Password: register → login (sai password) → forgot-password → reset-password → login (password mới)."*

**Quan sát:**
- 80 VUs
- Duration 90 giây

## Bước 2: Bấm Start (5 giây)

> *"Em bấm Start. 80 user sẽ đồng thời gửi request trong 90 giây."*

## Bước 3: Quan sát & Phân tích Bug (60 giây)

### Trong JMeter Summary Report:

Sau ~30 giây, mở Summary Report:

> *"Các bạn chú ý cột **Error %** — nó sẽ hiển thị **99% errors**."*

| Label | Samples | Error % | Response Code |
|-------|---------|---------|---------------|
| POST /api/login (wrong password) | 80 | 99% | 401 + 403 |
| POST /api/forgot-password | 80 | 0% | 200 |
| POST /api/reset-password | 80 | 0% | 200 |

> *"**Tại sao login sai password lại fail 99%?**"*

### 🔍 Giải thích Bug #3 (1 phút):

> *"Khi em test Stress, em chủ động dùng **password sai** để test flow 'quên mật khẩu'. Và em phát hiện bug sau:"*

**Hiển thị response code trong View Results Tree:**

> *"Các bạn thấy: lúc đầu server trả **401 Unauthorized** (sai mật khẩu — đúng chuẩn). Nhưng sau 3 lần sai liên tiếp, server lại trả **403 Forbidden**."*

**Vấn đề theo chuẩn HTTP:**

| Status Code | Ý nghĩa | Khi nào dùng |
|-------------|----------|--------------|
| **401 Unauthorized** | Chưa xác thực / sai thông tin | ✅ ĐÚNG — sai password |
| **403 Forbidden** | Đã xác thực nhưng không có quyền | ❌ SAI ở đây |

> *"Theo chuẩn RESTful, khi user gửi **sai mật khẩu**, server phải trả **401**. Trả **403** là sai ngữ nghĩa — 403 nghĩa là 'user đã xác thực nhưng không có quyền truy cập', nhưng ở đây user **chưa xác thực được** do sai password."*

> *"Đây là **Bug #3** trong báo cáo bug của em — lỗi logic chọn status code, không ảnh hưởng chức năng nhưng sai chuẩn HTTP."*

### Trong Task Manager:
> *"CPU Node.js trong Stress Test sẽ cao hơn Load Test một chút, vì có thêm flow forgot-password và reset-password xử lý token."*

| Thời gian | CPU Node.js |
|-----------|-------------|
| 0-30s | 5% → 15% |
| 30-90s | 15% → 25% |

## Bước 4: Kết thúc Stress Test (10 giây)

> *"Stress Test phát hiện Bug #3: 101/112 request login sai password trả status code sai (403 thay vì 401)."*

---

# 📹 CLIP 3: SPIKE TEST (1 phút)

## Mở đầu clip (10 giây)
> *"Cuối cùng em chạy Spike Test — giả lập tải đột biến, ví dụ như flash sale."*

## Bước 1: Mở file JMX (5 giây)

**File → Open → chọn `23127443_Spike_AdminImportProducts_20260817.jmx`**

> *"Spike Test em test flow Admin Import Products với 100 user đồng thời import sản phẩm hàng loạt."*

## Bước 2: Bấm Start (5 giây)

> *"100 user sẽ spike đồng thời từ 0 lên 100 trong 5 giây — mô phỏng flash sale."*

## Bước 3: Quan sát & Phân tích Bug (45 giây)

### Trong JMeter Summary Report:

> *"Các bạn chú ý — endpoint import-products có **error rate rất cao**."*

| Label | Samples | Error % | Response Code |
|-------|---------|---------|---------------|
| POST /api/admin/import-products | 1000 | **70%** | 400, 36, 41, 42... |
| GET /api/products (verify) | 1000 | 0% | 200 |

### 🔍 Giải thích Bug #4 (1 phút):

> *"Tại sao import lại fail 70%?"*

**Hiển thị response code trong View Results Tree:**

> *"Các bạn thấy response code **400 Bad Request** xuất hiện khoảng 100 lần, và các mã lạ như **36, 41, 42** xuất hiện hàng trăm lần."*

**Phân tích nguyên nhân:**

> *"**Nguyên nhân có thể là:**"*

| # | Nguyên nhân | Giải thích |
|---|-------------|------------|
| 1 | **Payload quá lớn** | 100 user đồng thời gửi JSON lớn → server quá tải khi parse |
| 2 | **Transaction lock** | SQLite lock khi nhiều write đồng thời |
| 3 | **Connection pool cạn kiệt** | Express.js mặc định chỉ chịu được vài connection |
| 4 | **Timeout** | Server không respond kịp |

> *"Cụ thể: vì EShop dùng **SQLite** (file-based database), nó chỉ cho phép **1 write tại 1 thời điểm**. Khi 100 user cùng import sản phẩm, các transaction phải xếp hàng, dẫn đến timeout và trả về các mã lỗi lạ."*

> *"Nếu EShop dùng **PostgreSQL hoặc MySQL** (client-server database), hỗ trợ concurrent write tốt hơn, error rate sẽ thấp hơn nhiều."*

### Trong Task Manager:
> *"CPU Node.js sẽ spike lên cao nhất trong 3 test."*

| Thời gian | CPU Node.js |
|-----------|-------------|
| 0-5s | 0% → 80% (SPIKE!) |
| 5-30s | 80% → 60% |
| 30-60s | 60% → 40% |

> *"Các bạn chú ý: CPU spike từ 0% lên **80% trong 5 giây đầu** — đây là bản chất của Spike Test. Sau đó giảm dần vì server bắt đầu trả về errors thay vì xử lý."*

## Bước 4: Kết thúc Spike Test (10 giây)

> *"Spike Test phát hiện Bug #4: 700/1000 request import fail do SQLite không chịu nổi concurrent write."*

---

# 📊 TỔNG KẾT (30 giây — nói cuối video)

> *"Tóm lại, em đã chạy 3 kịch bản và phát hiện 4 bugs:"*

| # | Bug | Test | Mức độ |
|---|-----|------|--------|
| 1 | Lộ thông tin user tồn tại | Manual | 🔴 Bảo mật |
| 2 | Reset token bị lộ trong response | Manual | 🔴 Bảo mật |
| 3 | Trả 403 thay vì 401 khi sai password | Stress | 🟡 Logic |
| 4 | Import sản phẩm lỗi 70% | Spike | 🔴 Nghiêm trọng |

> *"Báo cáo chi tiết có trong file `bug_reports.md`. Cảm ơn các bạn đã theo dõi!"*

---

# 🎥 Checklist trước khi quay

- [ ] Mở 2 cửa sổ: JMeter (trái) + Task Manager (phải) — **cùng frame**
- [ ] SUT (Node.js server) đã chạy ở port 3000
- [ ] Test microphone (quan trọng!)
- [ ] Tắt notification trên máy
- [ ] Chuẩn bị file JMX đã mở sẵn
- [ ] Quay OBS hoặc Windows Game Bar

---

# 💡 Tips khi quay

1. **Nói chậm, rõ ràng** — đề bài yêu cầu narration tiếng Việt
2. **Luôn chỉ vào màn hình** khi nói về con số cụ thể
3. **Pause 2-3 giây** giữa các bước để người xem theo kịp
4. **Bug #3 và #4** — giải thích kỹ, đây là phần quan trọng nhất
5. **Nếu CPU Node.js không hiện** trong Task Manager → bấm "More details" ở dưới
