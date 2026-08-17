# Stress Test Plan - Reset Password (Auth-Heavy)

## 1. Tổng quan

| Thuộc tính | Giá trị |
|------------|---------|
| **Test Name** | `{StudentID}_Stress_ResetPassword_{YYYYMMDD}` |
| **Test Type** | Stress Testing (Auth-Heavy) |
| **Endpoint Group** | Reset Password + Account Lockout |
| **Mục đích** | Kiểm tra stress authentication flow với account lockout |

## 2. Background: FR-02 & FR-03 (từ SRS)

### FR-02: Đăng nhập & Khóa tài khoản
- Sau mỗi lần đăng nhập **sai**, hệ thống tăng bộ đếm lên **đúng 1 đơn vị**
- Nếu đăng nhập sai từ **3 lần trở lên liên tiếp** → Tài khoản bị **khóa 30 giây**
- Trả về thông báo lỗi phù hợp; không để lộ chi tiết nguyên nhân

### FR-03: Quên mật khẩu & Đặt lại mật khẩu (2 bước)
**Bước 1:** POST /api/forgot-password - Lấy OTP 6 số
**Bước 2:** POST /api/reset-password - Đặt lại mật khẩu với OTP

## 3. Workflow API - Stress Test (Account Lockout Focus)

```
┌─────────────────────────────────────────────────────────────┐
│  PHASE 1: TEST ACCOUNT LOCKOUT                              │
│  ========================================================== │
│  Loop 3 lần với SAI password để trigger lockout:         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 1a: POST /api/login (Sai password lần 1)             │
│  - Body: {"email":"${email}","password":"${wrong_pass}"}    │
│  - Expected: 401 Unauthorized (sai mật khẩu)               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 1b: POST /api/login (Sai password lần 2)             │
│  - Body: {"email":"${email}","password":"${wrong_pass}"}    │
│  - Expected: 401 Unauthorized                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 1c: POST /api/login (Sai password lần 3) → LOCKOUT    │
│  - Body: {"email":"${email}","password":"${wrong_pass}"}    │
│  - Expected: 429 Too Many Requests (LOCKED 30s)            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  CHỜ 30 GIÂY (Account unlock)                             │
│  ========================================================== │
│  Timer: Constant 32000 ms (dư 2s buffer)                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  PHASE 2: RESET PASSWORD FLOW                               │
│  ========================================================== │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 2: POST /api/forgot-password                         │
│  - Body: {"email":"${email}"}                               │
│  - Response: {"resetToken":"${otp}"}                        │
│  - JSON Extractor: $.resetToken -> ${otp}                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 3: POST /api/reset-password                           │
│  - Body: {"email":"${email}","resetToken":"${otp}","newPassword":"${new_password}"} │
│  - Expected: 200 OK                                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 4: POST /api/login (Đăng nhập với password mới)     │
│  - Body: {"email":"${email}","password":"${new_password}"}  │
│  - Expected: 200 OK + JWT token                           │
└─────────────────────────────────────────────────────────────┘
```

## 4. CSV Data: `stress_reset_password.csv`

```csv
email,password,wrong_pass,new_password
stressuser1@eshop.com,Pass1234!,WrongPass1!,NewPass1234!
stressuser2@eshop.com,Pass1234!,WrongPass2!,NewPass5678!
stressuser3@eshop.com,Pass1234!,WrongPass3!,NewPass9012!
stressuser4@eshop.com,Pass1234!,WrongPass4!,NewPass3456!
stressuser5@eshop.com,Pass1234!,WrongPass5!,NewPass7890!
stressuser6@eshop.com,Pass1234!,WrongPass6!,NewPass2345!
stressuser7@eshop.com,Pass1234!,WrongPass7!,NewPass6789!
stressuser8@eshop.com,Pass1234!,WrongPass8!,NewPass0123!
stressuser9@eshop.com,Pass1234!,WrongPass9!,NewPass4567!
stressuser10@eshop.com,Pass1234!,WrongPass0!,NewPass8901!
```

## 5. JMeter Configuration - Stress Test

### Thread Group 1: Baseline Load
| Parameter | Value | Giải thích |
|-----------|-------|------------|
| Number of Threads (Users) | 20 | 20 concurrent users (baseline) |
| Ramp-up Period (seconds) | 30 | Tăng 20 users trong 30s |
| Hold Load For (seconds) | 120 | Giữ baseline 2 phút |

### Thread Group 2: Ramp-up to Failure
| Parameter | Value | Giải thích |
|-----------|-------|------------|
| Number of Threads (Users) | 80 | Tăng lên 80 users |
| Ramp-up Period (seconds) | 60 | Tăng từ 20 → 80 trong 60s |
| Hold Load For (seconds) | 180 | Giữ 180s |

### Think Time
- **Constant Timer:** 500 ms (rapid fire để trigger lockout nhanh)

## 6. Listeners

| Listener | Mục đích |
|----------|----------|
| **Summary Report** | Tổng hợp requests, errors, throughput |
| Response Time Graph | Đồ thị response time theo thời gian |
| Hits per Second | Số hits/giây |

## 7. Assertions

| Assertion | Condition | Mục đích |
|-----------|-----------|----------|
| Response Code | 200 | Reset password thành công |
| Response Code | 401 | Login sai password |
| Response Code | 429 | Account lockout triggered |
| Response Data | Contains "token" | Login thành công |
| Duration | < 3000 ms | SLO: p95 latency |

## 8. Key Scenarios to Verify

| Scenario | Expected Behavior |
|----------|-------------------|
| 1st failed login | 401, fail_count = 1 |
| 2nd failed login | 401, fail_count = 2 |
| 3rd failed login | 429 LOCKED (30s), fail_count = 3 |
| Login after 30s wait | 200 OK (unlocked) |
| Forgot password | 200 + resetToken (6 digits) |
| Reset with valid OTP | 200 OK |
| Reset with invalid OTP | 400 Bad Request |
| Login with new password | 200 + JWT token |

## 9. Expected Metrics

| Metric | Threshold | Ghi chú |
|--------|-----------|---------|
| Average Response Time | < 500 ms (baseline) | |
| Error Rate (Baseline) | < 5% | Bao gồm expected 401s |
| Error Rate (Peak) | < 15% | Bao gồm 429 lockouts |
| Lockout Frequency | ~1 per 30s per user | Monitor pattern |
| Recovery Time | < 35s | Thực tế 30s + buffer |

## 10. JMeter Elements Structure

```
Test Plan: {StudentID}_Stress_ResetPassword_{YYYYMMDD}
├── HTTP Request Defaults (localhost:3000)
├── HTTP Header Manager
│   └── Content-Type: application/json
├── CSV Data Set Config (stress_reset_password.csv)
├── Constant Timer (500ms)
│
├── Thread Group: Baseline (20 users, 30s ramp-up, 120s hold)
├── Thread Group: Ramp-up to Failure (80 users, 60s ramp-up, 180s hold)
│
└── [Each Thread executes the full workflow:]
    Transaction Controller: "Stress_Auth_Lockout_Reset"
    ├── Loop Controller (3 iterations for failed logins)
    │   └── HTTP Request: POST /api/login (wrong password)
    │       └── Response Assertion (401 OR 429)
    ├── Constant Timer (32000ms) - Wait for unlock
    ├── HTTP Request: POST /api/forgot-password
    │   └── JSON Extractor: $.resetToken -> ${otp}
    ├── HTTP Request: POST /api/reset-password
    │   └── Response Assertion (200)
    └── HTTP Request: POST /api/login (new password)
        └── Response Assertion (200, Contains "token")
```

## 11. Human Review Checklist

- [ ] Workflow cover đủ auth flow + lockout? (Có - login fail → lockout → wait → reset)
- [ ] CSV có 10 users khác nhau? (Có)
- [ ] 30s wait timer đủ để unlock? (Có - 32s buffer)
- [ ] Assertions kiểm tra lockout (429)? (Có)
- [ ] Listener Summary Report cho Stress Test? (Có)
- [ ] Ramp-up pattern realistic? (Có - gradual increase to find breakpoint)

## 12. Account Lockout Reset Procedure

Sau khi chạy stress test:
```bash
# Option 1: Đợi 30 giây tự động unlock
# Option 2: Reset database
```

**Lưu ý quan trọng:**
- Stress test sẽ trigger account lockout nhiều lần
- Cần ghi lại: số lần lockout, thời gian lockout, impact lên error rate
- Mỗi user trong CSV chỉ nên test 1 lần để tránh conflict
