# FR-02: User Login — Automated Test Suite

## Giới thiệu

Script tự động chạy 16 test case cho chức năng đăng nhập (FR-02) và xuất kết quả ra file.

## Yêu cầu

- Node.js >= 14.x
- Server đang chạy tại `http://localhost:3000`
- Database SQLite tại `eshop/backend/database.sqlite`

## Cài đặt

```bash
cd test-cases
npm install
```

## Chạy Test

```bash
# Cách 1: Dùng npm
npm test

# Cách 2: Chạy trực tiếp
node run-tests.js
```

## Output

- **Console**: Hiển thị tóm tắt kết quả
- **File**: `results/FR-02-test-results-{timestamp}.txt`

## Cấu trúc thư mục

```
test-cases/
├── run-tests.js          # Script chính
├── package.json          # Dependencies
├── README.md             # Hướng dẫn sử dụng
├── FR-02-login-test-cases.md  # Chi tiết test case
└── results/             # Thư mục chứa kết quả
    └── FR-02-test-results-YYYY-MM-DDTHH-MM-SS-SSS.txt
```

## Test Cases

| TC | Mô tả | Expected |
|----|-------|----------|
| TC01 | Đăng nhập thành công | 200 |
| TC02 | Email không tồn tại | 401 |
| TC03 | Email sai định dạng | 401 |
| TC04 | Password sai | 401 |
| TC05 | Tài khoản bị khóa | 403 |
| TC06 | login_attempts >= 3, hết hạn | 200 |
| TC07 | login_attempts = NULL | 200/500 |
| TC08 | login_attempts = số âm | 200/500 |
| TC09 | BVA: login_attempts = 0 (LB) | 200 |
| TC10 | BVA: login_attempts = 1 (LB+1) | 200 |
| TC11 | BVA: login_attempts = 2 (UB-1) | 200 |
| TC12 | BVA: login_attempts = 3 (UB) | 200 |
| TC13 | BVA: login_attempts = 4 (UB+1) | 200 |
| TC14 | BVA: locked_until = future | 403 |
| TC15 | BVA: locked_until = past | 200 |
| TC16 | BVA: locked_until = now | 200 |

## Ví dụ kết quả

```
╔══════════════════════════════════════════════════════════════════════╗
║          FR-02: User Login — Automated Test Results                 ║
╚══════════════════════════════════════════════════════════════════════╝

📅 Ngày test: 02/07/2026, 10:57:00
🌐 Base URL: http://localhost:3000
👤 Test User: test@eshop.com

----------------------------------------------------------------------
TEST EXECUTION LOG
----------------------------------------------------------------------

======================================================================
TC01 — Đăng nhập thành công (Valid)
======================================================================
[Setup] Reset user: login_attempts = 0, locked_until = NULL
[Request] POST http://localhost:3000/api/auth/login
[Body] {"email": "test@eshop.com", "password": "Test1234!"}
[Status] 200
[Response] {"message":"Login successful","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","user":{"id":1,"email":"test@eshop.com",...}}
[Result] ✅ PASSED

...

----------------------------------------------------------------------
TEST SUMMARY
----------------------------------------------------------------------
✅ Passed: 16/16
❌ Failed: 0/16
⏱️  Execution Time: 2.35s

======================================================================
END OF REPORT
======================================================================
```

## Xử lý lỗi

### Lỗi: Cannot find module 'better-sqlite3'

```bash
npm install
```

### Lỗi: ECONNREFUSED

Đảm bảo server đang chạy:
```bash
cd eshop/backend
npm run dev
```

### Lỗi: SQLITE_CANTOPEN

Kiểm tra đường dẫn database trong `run-tests.js`:
```javascript
const dbPath = path.join(__dirname, '..', 'eshop', 'backend', 'database.sqlite');
```
