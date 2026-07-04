# EShop SUT — Project Context

> File này chứa toàn bộ ngữ cảnh về dự án **eshop-sut** — hệ thống E-Commerce dùng để thực hành kiểm thử phần mềm. Mọi agent/hành động liên quan đến eshop-sut đều nên đọc file này trước khi thực hiện task.

---

## 1. Tổng quan

**Mục đích:** Hệ thống thương mại điện tử EShop được thiết kế **cố ý chứa nhiều lỗi** (bugs về UI/UX, validation, bảo mật, logic nghiệp vụ) để phục vụ bài tập kiểm thử phần mềm. Nhiệm vụ của sinh viên là tìm và ghi chép lại các lỗi này dựa trên đặc tả yêu cầu đúng.

**Cấu trúc thư mục gốc (HW02):**
```
HW02/
├── eshop-sut/                  # System Under Test
├── templates/                   # Các template báo cáo
├── domain-testing-agent-cursor.md  # Agent prompt chính (đọc TRƯỚC KHI làm bất cứ task testing nào)
├── eshop-context.md            # File này — context tổng hợp
└── (sẽ có) testing/           # Thư mục chứa kết quả test cho từng FR
```

---

## 2. Kiến trúc hệ thống

### 2.1 Các thành phần

| Thành phần       | Công nghệ                        | URL mặc định             |
|------------------|----------------------------------|--------------------------|
| Backend API      | Node.js + Express + SQLite       | `http://localhost:3000`   |
| Frontend Web     | React 19 + Vite + Tailwind CSS   | `http://localhost:5173`   |
| Web Admin        | React 19 + Vite + Tailwind CSS   | `http://localhost:5174`   |
| Mobile App       | React Native 0.81 + Expo SDK 54   | qua QR code (Expo Go)    |

### 2.2 Cổng (Ports)

| Port  | Thành phần   | Ghi chú                          |
|-------|-------------|----------------------------------|
| 3000  | Backend     | **BẮT BUỘC** chạy trước frontend |
| 5173  | Frontend Web |                                  |
| 5174  | Web Admin   |                                  |

---

## 3. Backend — Chi tiết kỹ thuật

**File chính:**
- `eshop-sut/backend/server.js` — Entry point, chứa tất cả route/handler
- `eshop-sut/backend/database.js` — Schema + seed data
- `eshop-sut/backend/package.json`

**Database:** SQLite (file `eshop.db`), tự tạo khi chạy `node database.js`

**Schema quan trọng (tên bảng + cột chính):**

| Bảng          | Cột đáng chú ý                                        |
|---------------|------------------------------------------------------|
| `users`       | `id`, `name`, `email`, `password`, `role`, `login_attempts`, `locked_until`, `reset_token` |
| `products`    | `id`, `name`, `price`, `description`, `imageUrl`, `category_id` |
| `categories` | `id`, `name`                                        |
| `orders`      | `id`, `user_id`, `total_amount`, `status`, `shipping_address`, `created_at` |
| `order_items` | `id`, `order_id`, `product_id`, `quantity`, `price`  |
| `coupons`     | `id`, `code`, `type`, `discount_value`, `min_order_amount`, `expired_at`, `max_uses_per_user`, `is_active`, `used_count` |

**Tài khoản mặc định (đã seed sẵn trong database):**

| Role  | Email             | Mật khẩu    | Ghi chú                          |
|-------|-------------------|-------------|----------------------------------|
| Admin | `admin@eshop.com` | `Admin123!` | role = 'admin'                   |
| Admin | `admin@eshop.com` | `admin123`  | **Cũng hoạt động** (lỗi để test) |
| User  | `test@eshop.com`  | `Test1234!` | role = 'user'                    |

> ⚠️ **Lỗi đã biết trong backend:** Password lưu plaintext (SEC-01 bị vi phạm), `login_attempts` tăng +2 thay vì +1, mã OTP chỉ 4 chữ số thay vì 6 (FR-03 / SEC-07 bị vi phạm).

---

## 4. API Reference — Tóm tắt

Base URL: `http://localhost:3000`

### 4.1 Authentication

| Method | Endpoint               | Ghi chú                              |
|--------|------------------------|--------------------------------------|
| POST   | `/api/register`        | Body: `{name, email, password}`      |
| POST   | `/api/login`           | Body: `{email, password}`, trả token |
| POST   | `/api/forgot-password` | Body: `{email}`, trả `resetToken`    |
| POST   | `/api/reset-password` | Body: `{email, resetToken, newPassword}` |

### 4.2 Users (yêu cầu `Authorization: Bearer <token>`)

| Method | Endpoint          | Ghi chú                              |
|--------|-------------------|--------------------------------------|
| GET    | `/api/users/me`   | Lấy thông tin cá nhân                 |
| PUT    | `/api/users/me`   | Body: `{name, phone, shipping_address}` |

### 4.3 Products & Categories

| Method | Endpoint                       | Ghi chú                         |
|--------|--------------------------------|---------------------------------|
| GET    | `/api/products`                 | Query: `?search=keyword`        |
| GET    | `/api/products/:id`            | Chi tiết sản phẩm               |
| POST   | `/api/products`                | Admin only — tạo sản phẩm      |
| PUT    | `/api/products/:id`            | Admin only — sửa sản phẩm      |
| DELETE | `/api/products/:id`            | Admin only — xóa sản phẩm      |
| GET    | `/api/categories`              | Danh sách danh mục              |
| POST   | `/api/categories`              | Admin only — tạo danh mục      |
| PUT    | `/api/categories/:id`          | Admin only — sửa danh mục      |
| DELETE | `/api/categories/:id`          | Admin only — xóa danh mục      |

### 4.4 Cart & Orders (yêu cầu token)

| Method | Endpoint               | Ghi chú                                  |
|--------|------------------------|------------------------------------------|
| GET    | `/api/cart`            | Lấy giỏ hàng                             |
| POST   | `/api/cart`            | Body: `{id, name, price, quantity}`      |
| POST   | `/api/checkout`        | Body: `{total_amount, shipping_address}` |
| GET    | `/api/orders/my-orders`| Lịch sử đơn hàng cá nhân                 |
| GET    | `/api/orders/:id`      | Chi tiết đơn hàng                        |
| PUT    | `/api/orders/:id/cancel`| Hủy đơn hàng                            |

### 4.5 Coupons

| Method | Endpoint                    | Ghi chú                                    |
|--------|-----------------------------|-------------------------------------------|
| POST   | `/api/apply-coupon`         | Body: `{code, total_amount, user_id}`      |
| GET    | `/api/coupons`              | Admin only — danh sách mã                 |
| POST   | `/api/admin/coupons`        | Admin only — tạo mã                       |
| DELETE | `/api/admin/coupons/:id`    | Admin only — xóa mã                       |

### 4.6 Admin APIs

| Method | Endpoint                         | Ghi chú                              |
|--------|----------------------------------|--------------------------------------|
| GET    | `/api/admin/users`               | Danh sách người dùng (không lộ pass) |
| DELETE | `/api/admin/users/:id`          | Xóa người dùng                       |
| GET    | `/api/admin/orders`              | Toàn bộ đơn hàng                     |
| PUT    | `/api/admin/orders/:id/status`   | Body: `{status}` — chuyển trạng thái |
| POST   | `/api/admin/import-products`    | Body: `{products: [...]}` — CSV/JSON |

---

## 5. Các file tài liệu quan trọng

| File                                | Mục đích                                                    |
|-------------------------------------|------------------------------------------------------------|
| `eshop-sut/README.md`              | Đặc tả yêu cầu hệ thống (System Requirements Specification) |
| `eshop-sut/api_specification.md`    | Danh sách API đầy đủ với request/response mẫu             |
| `eshop-sut/setup_guide.md`          | Hướng dẫn cài đặt và khởi chạy từng thành phần           |
| `templates/report_template.md`       | Template cho file `report.md` trong mỗi FR testing         |
| `templates/audit_log_template.md`    | Template cho file `audit-log.md` trong mỗi FR testing     |
| `domain-testing-agent-cursor.md`    | Agent prompt chính — quy trình Domain Testing bắt buộc    |

---

## 6. Mã giảm giá mẫu (seed data)

| Mã        | Loại    | Giá trị    | Ngưỡng tối thiểu | Hạn dùng   | Lần dùng/người |
|-----------|---------|-----------|-----------------|------------|----------------|
| `SAVE10`  | percent | 10%       | 300,000 ₫       | 2099-12-31 | 1              |
| `BIGBUY`  | fixed   | 50.000 ₫  | 500.000 ₫       | 2099-12-31 | 1              |
| `VIP100`  | fixed   | 100.000 ₫ | 300.000 ₫       | 2099-12-31 | 2              |
| `EXPIRED` | percent | 20%       | 100.000 ₫       | 2020-01-01 | 1              |

---

## 7. State Machine — Trạng thái đơn hàng

```
pending → confirmed → shipping → delivered
    ↓          ↓
 canceled    canceled
```

- `delivered` và `canceled` là **trạng thái kết thúc** — không chuyển được.
- Khi `shipping`: **User không được hủy**, chỉ Admin được hủy.

---

## 8. Danh sách Functional Requirements (FR)

| FR-ID | Tên feature                                |
|-------|-------------------------------------------|
| FR-01 | Đăng ký tài khoản                         |
| FR-02 | Đăng nhập & khóa tài khoản               |
| FR-03 | Quên mật khẩu & đặt lại mật khẩu        |
| FR-04 | Quản lý hồ sơ cá nhân                     |
| FR-05 | Xem danh sách & tìm kiếm sản phẩm         |
| FR-06 | Xem chi tiết sản phẩm                     |
| FR-07 | Giỏ hàng (Shopping Cart)                  |
| FR-08 | Thanh toán (Checkout)                     |
| FR-09 | Mã giảm giá (Coupon)                      |
| FR-10 | Trạng thái đơn hàng (State Machine)       |
| FR-11 | Xem lịch sử đơn hàng (User)               |
| FR-12 | Kiểm soát truy cập Admin                  |
| FR-13 | Dashboard Admin                           |
| FR-14 | Quản lý Danh mục (CRUD — Admin)          |
| FR-15 | Quản lý Sản phẩm (CRUD — Admin)          |
| FR-16 | Import Sản phẩm từ CSV (Admin)            |
| FR-17 | Quản lý Mã Giảm Giá (Admin)               |
| FR-18 | Quản lý Đơn hàng (Admin)                  |
| FR-19 | Quản lý Người dùng (Admin)                |
| FR-20 | Tính năng Mobile                          |
| FR-21 | Tiêu chuẩn giao diện chung               |
| FR-22 | Form Requirements                         |
| FR-23 | Navigation Requirements                   |
| FR-24 | Feedback & State Requirements             |

---

## 9. Yêu cầu bảo mật (để đối chiếu khi test)

| ID     | Mô tả                                                               |
|--------|---------------------------------------------------------------------|
| SEC-01 | Mật khẩu không được lưu plaintext                                  |
| SEC-02 | API bảo mật phải yêu cầu JWT Token hợp lệ                          |
| SEC-03 | API Admin phải kiểm tra `role = 'admin'` trong Token               |
| SEC-04 | Dữ liệu user nhập vào phải escape, không dùng `innerHTML` trực tiếp |
| SEC-05 | Truy vấn CSDL phải dùng Parameterized Query                         |
| SEC-06 | API cập nhật hồ sơ không cho phép thay đổi trường `role`           |
| SEC-07 | OTP phải đủ 6 chữ số, có thời hạn và vô hiệu sau khi dùng         |

---

## 10. Cấu trúc thư mục test (theo domain-testing-agent-cursor.md)

```
testing/
└── <FR-ID>/
    ├── report.md       # Báo cáo kỹ thuật — để nộp
    └── audit-log.md     # Nhật ký thao tác — append-only
```

---

## 11. Cách setup nhanh

```bash
# 1. Backend
cd eshop-sut/backend
npm install
node database.js   # Chạy 1 lần duy nhất
node server.js     # Chạy liên tục

# 2. Frontend Web (terminal mới)
cd eshop-sut/frontend-web
npm install
npm run dev

# 3. Frontend Admin (terminal mới)
cd eshop-sut/frontend-admin
npm install
npm run dev

# 4. Frontend Mobile (tùy chọn)
cd eshop-sut/frontend-mobile
npm install
npx expo start      # Quét QR bằng Expo Go
```

---

## 12. Ghi chú cho agent

- **Đọc `domain-testing-agent-cursor.md` TRƯỚC KHI làm bất cứ task testing nào** — file đó chứa quy trình bắt buộc.
- **Không tự bịa kết quả test** — cột `Actual` và `Status` trong test case PHẢI để placeholder vì người dùng tự chạy Postman.
- **Mỗi FR cần tách 2 file:** `report.md` (kỹ thuật) và `audit-log.md` (nhật ký).
- **Luôn trích dẫn bằng chứng từ code** khi ghi EC, BVA, hoặc phát hiện lỗi — không đoán.
- **Phát hiện bất thường trong code → báo ngay** — rất có thể là bug thật, không đợi đến bước cuối.
