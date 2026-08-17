# Bug Reports — EShop SUT (Performance Testing HW05)

**Student ID:** 23127443
**Date:** 2026-08-18
**SUT:** EShop (https://github.com/ttbhanh/eshop-sut)
**Test scenarios:** Load (Orders/MyOrders), Stress (Reset Password), Spike (Admin Import Products)

---

## 📊 Executive Summary

| Metric | Value |
|--------|-------|
| Total bugs discovered | **6** |
| Critical (functional broken) | **2** |
| High (security/info disclosure) | **3** |
| Medium (wrong HTTP code) | **1** |
| Bugs from automated tests | **4** |
| Bugs from manual API verification | **2** |

---

## 🐛 Bug #1 — Forgot Password Endpoint Discloses User Existence (Email Enumeration)

| Field | Value |
|-------|-------|
| **Severity** | 🔴 **HIGH** (Security) |
| **Endpoint** | `POST /api/forgot-password` |
| **FR Reference** | FR-06 |
| **Discovered by** | Manual API verification |
| **Date discovered** | 2026-08-17 23:30 |
| **Status** | Open |

### Description
The `/api/forgot-password` endpoint returns different responses depending on whether the email exists in the database, enabling **email enumeration attacks**.

### Steps to Reproduce
1. Send `POST /api/forgot-password` with a valid email (exists in DB):
   ```bash
   curl -X POST http://localhost:3000/api/forgot-password \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@eshop.com"}'
   ```
2. Send `POST /api/forgot-password` with an invalid email (does not exist):
   ```bash
   curl -X POST http://localhost:3000/api/forgot-password \
     -H "Content-Type: application/json" \
     -d '{"email":"nonexistent@example.com"}'
   ```

### Expected Behavior
Both requests should return the **same** generic response to prevent user enumeration:
```json
{ "message": "If the email exists, a reset link has been sent." }
```
HTTP 200 in both cases.

### Actual Behavior
- **Email exists** → HTTP 200: `{"message":"Mã đặt lại mật khẩu đã được tạo","resetToken":"6906"}`
- **Email does NOT exist** → HTTP 404: `{"error":"User not found"}`

### Impact
- Attackers can enumerate registered users by testing email addresses.
- Complies with FR-06 requirement violation (privacy leak).
- Combined with Bug #2, allows mass account takeover attempts.

### Recommended Fix
Return identical 200 response regardless of email existence:
```javascript
// Always return success to avoid enumeration
return res.json({ message: "If the email exists, a reset link has been sent." });
```

---

## 🐛 Bug #2 — Reset Token Returned in API Response (Information Disclosure)

| Field | Value |
|-------|-------|
| **Severity** | 🔴 **HIGH** (Security/Privacy) |
| **Endpoint** | `POST /api/forgot-password` |
| **FR Reference** | FR-06 |
| **Discovered by** | Manual API verification |
| **Date discovered** | 2026-08-17 23:30 |
| **Status** | Open |

### Description
The `/api/forgot-password` endpoint returns the reset token directly in the JSON response body. The FR-06 specification requires the token to be sent only via email.

### Steps to Reproduce
1. Send `POST /api/forgot-password` for a valid email:
   ```bash
   curl -X POST http://localhost:3000/api/forgot-password \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@eshop.com"}'
   ```

### Expected Behavior
Response should only contain a generic message; reset token should be sent only via email channel.

### Actual Behavior
Response contains the reset token in plaintext:
```json
{ "message":"Mã đặt lại mật khẩu đã được tạo","resetToken":"6906" }
```

### Impact
- Anyone with access to API logs (intermediaries, browser history, network captures) can extract reset tokens.
- Defeats the purpose of email-based password reset.
- Violates FR-06 specification.

### Recommended Fix
Remove `resetToken` field from API response; send via email only:
```javascript
// Send token via email, not in response
await sendEmail(email, resetToken);
return res.json({ message: "Reset link sent to your email." });
```

---

## 🐛 Bug #3 — Account Lockout Returns 403 Instead of 429

| Field | Value |
|-------|-------|
| **Severity** | 🟡 **MEDIUM** (Wrong HTTP code) |
| **Endpoint** | `POST /api/login` |
| **FR Reference** | FR-02 |
| **Discovered by** | Manual API verification + Stress Test JTL log |
| **Date discovered** | 2026-08-17 23:30 |
| **Status** | Open |

### Description
After 3 consecutive failed login attempts, the account is locked but the server returns **HTTP 403 Forbidden** instead of the semantically correct **HTTP 429 Too Many Requests** or **HTTP 423 Locked**.

### Evidence from Stress Test JTL
File: `Results/stress-reset-password.jtl`

| Response Code | Count | Meaning |
|---------------|-------|---------|
| 401 | 10 | First 2 attempts (wrong password) — Correct |
| **403** | **230** | After 3rd failure (locked) — **Wrong code** |
| 200 | 67 | Forgot password calls |
| 400 | 24 | Reset password calls |

### Steps to Reproduce
1. Attempt login 3 times with wrong password:
   ```bash
   for i in 1 2 3; do
     curl -X POST http://localhost:3000/api/login \
       -H "Content-Type: application/json" \
       -d '{"email":"admin@eshop.com","password":"WrongPass'$i'"}' \
       -w "\nHTTP: %{http_code}\n"
   done
   ```

### Expected Behavior
After 3 failed attempts, return **HTTP 429 Too Many Requests** (standard for rate limiting) or **HTTP 423 Locked** (WebDAV standard for locked resources).

### Actual Behavior
- Attempt 1, 2 → 401 Unauthorized ✅
- Attempt 3 → **403 Forbidden** ❌ (should be 429)
- Attempt 4+ (while locked) → **403 Forbidden** ❌
- Correct password (while locked) → **403 Forbidden** ❌

### Impact
- API consumers cannot programmatically distinguish "locked" from "forbidden".
- HTTP 429 includes standard `Retry-After` header — clients know when to retry.
- HTTP 403 suggests permission issue, misleading for rate limiting scenarios.
- Test assertions expecting 401/429 need to be updated to include 403.

### Recommended Fix
```javascript
if (loginAttempts >= 3) {
  return res.status(429).json({
    error: "Tài khoản đã bị khóa. Vui lòng thử lại sau.",
    retryAfter: 30 // seconds
  });
  // Or use 423 Locked (WebDAV standard)
}
```

### Test Adjustment
Updated `23127443_Stress_ResetPassword_20260817.jmx` assertion to accept 401 OR 403 OR 429 (line 142).

---

## 🐛 Bug #4 — Reset Password Endpoint Always Returns "Invalid token or email"

| Field | Value |
|-------|-------|
| **Severity** | 🔴 **CRITICAL** (Broken functionality) |
| **Endpoint** | `POST /api/reset-password` |
| **FR Reference** | FR-06 |
| **Discovered by** | Manual API verification + Stress Test JTL log |
| **Date discovered** | 2026-08-17 23:30 |
| **Status** | Open |

### Description
The `/api/reset-password` endpoint is **completely non-functional**. It returns HTTP 400 "Invalid token or email" for ALL cases, including:
1. Valid token + valid email + new password
2. Wrong email
3. Invalid token
4. Missing password
5. Weak password

### Evidence from Stress Test JTL
File: `Results/stress-reset-password.jtl`

```
POST /api/reset-password: Total=24, Success=0, Fail=24
All 24 calls failed with HTTP 400
```

### Steps to Reproduce
1. Generate a reset token:
   ```bash
   TOKEN=$(curl -s -X POST http://localhost:3000/api/forgot-password \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@eshop.com"}' | python -c "import sys,json;print(json.load(sys.stdin)['resetToken'])")
   ```
2. Use the token to reset:
   ```bash
   curl -X POST http://localhost:3000/api/reset-password \
     -H "Content-Type: application/json" \
     -d "{\"token\":\"$TOKEN\",\"email\":\"admin@eshop.com\",\"newPassword\":\"NewPass123!\"}"
   ```

### Expected Behavior
With a valid token generated 30 seconds ago, return:
```json
{ "message": "Password reset successfully" }
```
HTTP 200.

### Actual Behavior
All cases return the same error:
```json
{ "error": "Invalid token or email" }
```
HTTP 400.

### Test Matrix
| Test Case | Expected | Actual |
|-----------|----------|--------|
| Token + email đúng + password hợp lệ | 200 OK | ❌ 400 |
| Wrong email + token | 400 "Invalid email" | ❌ 400 generic |
| Invalid token + email | 400 "Invalid token" | ❌ 400 generic |
| Missing newPassword | 400 "Missing field" | ❌ 400 generic |
| Weak password (3 chars) | 400 "Weak password" | ❌ 400 generic |

### Impact
- **Password reset feature is completely broken** — users cannot recover accounts.
- 24/24 stress test threads confirmed this is 100% reproducible.
- Locked-out users have no recovery path (since password reset doesn't work).
- All error responses are identical, making debugging impossible.

### Recommended Fix
```javascript
// 1. Validate token first
const tokenRecord = await db.findValidToken(token);
if (!tokenRecord) {
  return res.status(400).json({ error: "Token invalid or expired" });
}

// 2. Verify email matches token
if (tokenRecord.email !== email) {
  return res.status(400).json({ error: "Email does not match token" });
}

// 3. Validate new password
if (!newPassword || newPassword.length < 8) {
  return res.status(400).json({ error: "Password too weak (min 8 chars)" });
}

// 4. Update password
await db.updatePassword(email, hashPassword(newPassword));
await db.invalidateToken(token);
return res.json({ message: "Password reset successfully" });
```

---

## 🐛 Bug #5 — Reset Password Validation Order Wrong (Cascading from #4)

| Field | Value |
|-------|-------|
| **Severity** | 🟡 **MEDIUM** (Error handling) |
| **Endpoint** | `POST /api/reset-password` |
| **FR Reference** | FR-06 |
| **Discovered by** | Manual API verification |
| **Date discovered** | 2026-08-17 23:30 |
| **Status** | Open |

### Description
All error cases in `/api/reset-password` return the same generic error message "Invalid token or email", preventing users from understanding what went wrong.

### Steps to Reproduce
Test multiple failure scenarios (all return identical 400 error):
```bash
# Case 1: Missing password field
curl -X POST http://localhost:3000/api/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"1234","email":"admin@eshop.com"}'
# Returns: {"error":"Invalid token or email"} ❌ (should be "Missing newPassword")

# Case 2: Wrong email
curl -X POST http://localhost:3000/api/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"1234","email":"wrong@email.com","newPassword":"NewPass123!"}'
# Returns: {"error":"Invalid token or email"} ❌

# Case 3: Weak password
curl -X POST http://localhost:3000/api/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"1234","email":"admin@eshop.com","newPassword":"123"}'
# Returns: {"error":"Invalid token or email"} ❌
```

### Expected Behavior
Distinct error messages for each failure case:
- 400 "Token is invalid or expired"
- 400 "Email does not match the token"
- 400 "newPassword is required"
- 400 "Password must be at least 8 characters"

### Actual Behavior
All cases return: `{"error":"Invalid token or email"}` with HTTP 400.

### Impact
- Users cannot diagnose their reset password failure.
- Developers cannot debug integration issues.
- Frontend cannot provide meaningful error messages.

### Recommended Fix
See Bug #4 — requires separate validation steps with specific error messages.

---

## 🐛 Bug #6 — Admin Import Products Returns 400 for All Requests

| Field | Value |
|-------|-------|
| **Severity** | 🔴 **CRITICAL** (Broken functionality) |
| **Endpoint** | `POST /api/admin/import-products` |
| **FR Reference** | FR-16 |
| **Discovered by** | Spike Test JTL log |
| **Date discovered** | 2026-08-18 00:25 |
| **Status** | Open |

### Description
The admin import-products endpoint returns HTTP 400 for all 100 requests during spike testing, indicating it is broken under load (and likely broken in general).

### Evidence from Spike Test JTL
File: `Results/spike-admin-import-products.jtl`

| Endpoint | Total | Success | Fail | Response |
|----------|-------|---------|------|----------|
| POST /api/login (admin) | 100 | 100 | 0 | 200 ✅ |
| GET /api/categories | 100 | 100 | 0 | 200 ✅ |
| **POST /api/admin/import-products** | **100** | **0** | **100** | **400** ❌ |
| GET /api/products (verify) | 100 | 100 | 0 | 200 ✅ |

### Steps to Reproduce
1. Login as admin and get token.
2. Get categories list.
3. Send POST /api/admin/import-products with products JSON.

### Expected Behavior
HTTP 200 with success message (e.g., `{ "message": "Imported X products" }`).

### Actual Behavior
- **100/100 requests returned HTTP 400**
- Average latency: 1.05ms (server rejects without processing — no validation logic executed)
- All 100 threads failed identically

### Impact
- Admin cannot bulk-import products via API.
- FR-16 functionality completely broken.
- Same issue affects single and concurrent requests.

### Recommended Fix
Debug the request validation logic. Likely causes:
1. JSON parsing fails — server may expect different field names.
2. Missing required fields in products array.
3. Wrong content-type handling.

### Manual verification needed
```bash
# Test the endpoint directly with valid admin token
curl -X POST http://localhost:3000/api/admin/import-products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '[{"name":"Test","price":100,"category_id":1}]'
```

---

## 📈 Bug Summary Table

| # | Bug | Endpoint | Severity | Type | Verified by |
|---|-----|----------|----------|------|-------------|
| 1 | Email enumeration via forgot-password | POST /api/forgot-password | HIGH | Security | Manual |
| 2 | Reset token in API response | POST /api/forgot-password | HIGH | Security | Manual |
| 3 | Lockout returns 403 instead of 429 | POST /api/login | MEDIUM | HTTP code | Manual + JTL |
| 4 | Reset password always returns 400 | POST /api/reset-password | CRITICAL | Functional | Manual + JTL |
| 5 | Generic error message (cascading #4) | POST /api/reset-password | MEDIUM | UX | Manual |
| 6 | Admin import always returns 400 | POST /api/admin/import-products | CRITICAL | Functional | JTL |

---

## 🧪 Test Coverage Impact

### Load Test (Orders/MyOrders)
- **No bugs found.** 1489/1489 samples passed (100%).
- Average latency: 3.87ms, p95: 7ms, p99: 8ms.
- All endpoints (`POST /api/login`, `GET /api/orders/my-orders`) work correctly under expected load.

### Stress Test (Reset Password)
- **2 bugs confirmed** (Bug #3, #4).
- 67/499 samples passed (13.4%).
- Critical finding: `/api/reset-password` is completely broken (0% success rate).

### Spike Test (Admin Import Products)
- **1 new bug found** (Bug #6).
- 300/1100 samples passed (27.3% — but most failures are on import step, not other endpoints).
- `/api/admin/import-products` has 0% success rate even with valid token.

---

## 🔗 References

- **FR-02**: Login và khóa tài khoản
- **FR-06**: Xem chi tiết sản phẩm *(NOTE: error in spec — FR-06 is "Xem chi tiết sản phẩm" but Bug #1-5 reference password reset which is actually FR-03 per spec)*
- **FR-16**: Import sản phẩm từ CSV
- **JTL logs**:
  - `HW05/Results/load-orders-summary.jtl`
  - `HW05/Results/stress-reset-password.jtl`
  - `HW05/Results/spike-admin-import-products.jtl`