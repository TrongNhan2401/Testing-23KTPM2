# Test Case — FR-02: User Login (Đăng nhập)
**Chức năng**: POST /api/auth/login
**File**: `eshop/backend/server.js`
**Ngày tạo**: 02/07/2026
**Tổng số Test Case**: 16

---

## Môi trường Test
- **Base URL**: `http://localhost:3000/api/auth`
- **Content-Type**: `application/json`
- **Database**: `eshop/backend/database.sqlite`

### Setup/Test Data
```sql
-- Reset user trước mỗi test
UPDATE users SET login_attempts = 0, locked_until = NULL WHERE email = 'test@eshop.com';
```

---

## Test Case chi tiết

### TC01 — Đăng nhập thành công (Valid)
| Thuộc tính | Giá trị |
|---|---|
| **Test ID** | TC01 |
| **Mô tả** | Đăng nhập với email và password đúng |
| **Priority** | P0 (Critical) |
| **Pre-condition** | User `test@eshop.com` tồn tại, chưa bị khóa |
| **Request Body** | `{"email": "test@eshop.com", "password": "Test1234!"}` |
| **locked_until** | NULL |
| **login_attempts** | 0 |
| **Expected Status** | `200 OK` |
| **Expected Response** | `{"message": "Login successful", "token": "<jwt_token>", "user": {...}}` |
| **EC Coverage** | EC1, EC4, EC6, EC8 |

---

### TC02 — Email không tồn tại (Invalid)
| Thuộc tính | Giá trị |
|---|---|
| **Test ID** | TC02 |
| **Mô tả** | Email không tồn tại trong database |
| **Priority** | P0 |
| **Pre-condition** | Không cần |
| **Request Body** | `{"email": "notexist@eshop.com", "password": "Test1234!"}` |
| **Expected Status** | `401 Unauthorized` |
| **Expected Response** | `{"error": "Invalid email or password"}` |
| **EC Coverage** | EC2 |

---

### TC03 — Email sai định dạng (Invalid)
| Thuộc tính | Giá trị |
|---|---|
| **Test ID** | TC03 |
| **Mô tả** | Email không đúng định dạng |
| **Priority** | P1 |
| **Request Body** | `{"email": "invalid-email", "password": "Test1234!"}` |
| **Expected Status** | `401` (DB trả về rỗng) |
| **Expected Response** | `{"error": "Invalid email or password"}` |
| **EC Coverage** | EC3 |

---

### TC04 — Password sai (Invalid)
| Thuộc tính | Giá trị |
|---|---|
| **Test ID** | TC04 |
| **Mô tả** | Email đúng nhưng password sai |
| **Priority** | P0 |
| **Pre-condition** | User tồn tại, chưa bị khóa |
| **Request Body** | `{"email": "test@eshop.com", "password": "wrongpassword"}` |
| **Expected Status** | `401 Unauthorized` |
| **Expected Response** | `{"error": "Invalid email or password"}` |
| **EC Coverage** | EC5 |

---

### TC05 — Tài khoản đang bị khóa (Invalid)
| Thuộc tính | Giá trị |
|---|---|
| **Test ID** | TC05 |
| **Mô tả** | Tài khoản đang trong thời gian khóa |
| **Priority** | P0 |
| **Pre-condition** | User đã bị khóa |
| **Setup SQL** | `UPDATE users SET locked_until = datetime('now', '+3 minutes') WHERE email = 'test@eshop.com';` |
| **Request Body** | `{"email": "test@eshop.com", "password": "Test1234!"}` |
| **locked_until** | `future (+3 min)` |
| **login_attempts** | 2 |
| **Expected Status** | `403 Forbidden` |
| **Expected Response** | `{"error": "Tài khoản đã bị khóa. Vui lòng thử lại sau."}` |
| **EC Coverage** | EC7, BVA LB+1 |

---

### TC06 — login_attempts >= 3 (hết hạn khóa)
| Thuộc tính | Giá trị |
|---|---|
| **Test ID** | TC06 |
| **Mô tả** | User có login_attempts >= 3 nhưng đã hết hạn khóa |
| **Priority** | P1 |
| **Setup SQL** | `UPDATE users SET login_attempts = 5, locked_until = datetime('now', '-1 minute') WHERE email = 'test@eshop.com';` |
| **Request Body** | `{"email": "test@eshop.com", "password": "Test1234!"}` |
| **locked_until** | `past (-1 min)` |
| **login_attempts** | 5 |
| **Expected Status** | `200 OK` (reset attempts về 0) |
| **Expected Response** | `{"message": "Login successful", "token": "...", "user": {...}}` |
| **EC Coverage** | EC11 |

---

### TC07 — login_attempts = NULL (Invalid)
| Thuộc tính | Giá trị |
|---|---|
| **Test ID** | TC07 |
| **Mô tả** | login_attempts là NULL |
| **Priority** | P2 |
| **Setup SQL** | `UPDATE users SET login_attempts = NULL WHERE email = 'test@eshop.com';` |
| **Request Body** | `{"email": "test@eshop.com", "password": "Test1234!"}` |
| **Expected Status** | `200` hoặc `500` (tùy DB xử lý NULL + 2) |
| **EC Coverage** | EC12 |

---

### TC08 — login_attempts = số âm (Invalid)
| Thuộc tính | Giá trị |
|---|---|
| **Test ID** | TC08 |
| **Mô tả** | login_attempts là số âm |
| **Priority** | P2 |
| **Setup SQL** | `UPDATE users SET login_attempts = -1 WHERE email = 'test@eshop.com';` |
| **Request Body** | `{"email": "test@eshop.com", "password": "Test1234!"}` |
| **Expected Status** | `200` (sẽ thành 1) hoặc `500` |
| **EC Coverage** | EC12 |

---

### TC09 — BVA: login_attempts = 0 (LB)
| Thuộc tính | Giá trị |
|---|---|
| **Test ID** | TC09 |
| **Mô tả** | login_attempts = 0 (Biên dưới) |
| **Priority** | P1 |
| **Setup SQL** | `UPDATE users SET login_attempts = 0 WHERE email = 'test@eshop.com';` |
| **Request Body** | `{"email": "test@eshop.com", "password": "Test1234!"}` |
| **login_attempts** | 0 |
| **Expected Status** | `200 OK` |
| **Boundary** | LB (Lower Boundary) |

---

### TC10 — BVA: login_attempts = 1 (LB+1)
| Thuộc tính | Giá trị |
|---|---|
| **Test ID** | TC10 |
| **Mô tả** | login_attempts = 1 (sau sai sẽ bị khóa) |
| **Priority** | P1 |
| **Setup SQL** | `UPDATE users SET login_attempts = 1 WHERE email = 'test@eshop.com';` |
| **Request Body** | `{"email": "test@eshop.com", "password": "Test1234!"}` |
| **login_attempts** | 1 |
| **Expected Status** | `200 OK` (đăng nhập thành công) |
| **Boundary** | LB+1 |

---

### TC11 — BVA: login_attempts = 2 (UB-1)
| Thuộc tính | Giá trị |
|---|---|
| **Test ID** | TC11 |
| **Mô tả** | login_attempts = 2 (đủ điều kiện khóa khi sai) |
| **Priority** | P1 |
| **Setup SQL** | `UPDATE users SET login_attempts = 2 WHERE email = 'test@eshop.com';` |
| **Request Body** | `{"email": "test@eshop.com", "password": "Test1234!"}` |
| **login_attempts** | 2 |
| **Expected Status** | `200 OK` (đăng nhập thành công, reset attempts về 0) |
| **Boundary** | UB-1 |

---

### TC12 — BVA: login_attempts = 3 (UB)
| Thuộc tính | Giá trị |
|---|---|
| **Test ID** | TC12 |
| **Mô tả** | login_attempts = 3 (Ngay biên trên) |
| **Priority** | P2 |
| **Setup SQL** | `UPDATE users SET login_attempts = 3, locked_until = datetime('now', '-1 minute') WHERE email = 'test@eshop.com';` |
| **Request Body** | `{"email": "test@eshop.com", "password": "Test1234!"}` |
| **login_attempts** | 3 |
| **Expected Status** | `200 OK` (hết hạn khóa nên cho đăng nhập, reset về 0) |
| **Boundary** | UB (Upper Boundary) |

---

### TC13 — BVA: login_attempts = 4 (UB+1)
| Thuộc tính | Giá trị |
|---|---|
| **Test ID** | TC13 |
| **Mô tả** | login_attempts = 4 (Trên biên trên) |
| **Priority** | P2 |
| **Setup SQL** | `UPDATE users SET login_attempts = 4, locked_until = datetime('now', '-1 minute') WHERE email = 'test@eshop.com';` |
| **Request Body** | `{"email": "test@eshop.com", "password": "Test1234!"}` |
| **login_attempts** | 4 |
| **Expected Status** | `200 OK` (reset về 0) |
| **Boundary** | UB+1 |

---

### TC14 — BVA: locked_until = future + 1ms
| Thuộc tính | Giá trị |
|---|---|
| **Test ID** | TC14 |
| **Mô tả** | locked_until vừa mới bắt đầu (tương lai gần nhất) |
| **Priority** | P1 |
| **Setup SQL** | `UPDATE users SET locked_until = datetime('now', '+1 second'), login_attempts = 2 WHERE email = 'test@eshop.com';` |
| **Request Body** | `{"email": "test@eshop.com", "password": "Test1234!"}` |
| **locked_until** | `future (+1 second)` |
| **Expected Status** | `403 Forbidden` |
| **Boundary** | LB+1 (locked_until) |

---

### TC15 — BVA: locked_until = past (LB-1)
| Thuộc tính | Giá trị |
|---|---|
| **Test ID** | TC15 |
| **Mô tả** | locked_until đã hết hạn (quá khứ) |
| **Priority** | P1 |
| **Setup SQL** | `UPDATE users SET locked_until = datetime('now', '-1 second') WHERE email = 'test@eshop.com';` |
| **Request Body** | `{"email": "test@eshop.com", "password": "Test1234!"}` |
| **locked_until** | `past (-1 second)` |
| **Expected Status** | `200 OK` (hết hạn khóa) |
| **Boundary** | LB-1 (locked_until) |

---

### TC16 — BVA: locked_until = now (=)
| Thuộc tính | Giá trị |
|---|---|
| **Test ID** | TC16 |
| **Mô tả** | locked_until = now (ngay tại thời điểm hiện tại) |
| **Priority** | P1 |
| **Setup SQL** | `UPDATE users SET locked_until = datetime('now') WHERE email = 'test@eshop.com';` |
| **Request Body** | `{"email": "test@eshop.com", "password": "Test1234!"}` |
| **locked_until** | `= now` |
| **Expected Status** | `200 OK` (vì code dùng `<` nên now không bị khóa) |
| **Note** | Code tại `server.js:40`: `new Date() < new Date(user.locked_until)` |
| **Boundary** | LB (locked_until) |

---

### TC17 — Bug +2: login_attempts tăng 2 thay vì 1
| Thuộc tính | Giá trị |
|---|---|
| **Test ID** | TC17 |
| **Mô tả** | Kiểm tra số lần thử đăng nhập sai tăng đúng +1 hay không |
| **Priority** | P0 (Bug) |
| **Bug Location** | `server.js:54` - `const newAttempts = user.login_attempts + 2;` |

**Test Steps:**
1. Reset user: `UPDATE users SET login_attempts = 0, locked_until = NULL...`
2. Nhập sai password → Kiểm tra `login_attempts` = 1 (mong đợi) hay 2 (bug)
3. Reset `locked_until = NULL` (nếu bị khóa)
4. Nhập sai password → Kiểm tra `login_attempts` = 2 (mong đợi) hay 4 (bug)
5. Reset `locked_until = NULL`
6. Nhập sai password → Kiểm tra `login_attempts` = 3 (mong đợi) hay 6 (bug)

**Expected Result:**
| Lần sai | Expected login_attempts | Bug (thực tế) |
|---------|----------------------|---------------|
| Lần 1 | 1 | 2 (+2) |
| Lần 2 | 2 | 4 (+2) |
| Lần 3 | 3 | 6 (+2) |

**Bug Analysis:**
- Code hiện tại: `newAttempts = user.login_attempts + 2`
- Nên là: `newAttempts = user.login_attempts + 1`
- Tác động: User chỉ cần 1 lần sai là đủ để bị khóa (thay vì 2 lần)

---

## Tổng hợp Test Coverage

| STT | EC | Mô tả | TC Coverage |
|-----|-----|-------|------------|
| 1 | EC1 | Email tồn tại | TC01 |
| 2 | EC2 | Email không tồn tại | TC02 |
| 3 | EC3 | Email sai định dạng | TC03 |
| 4 | EC4 | Password đúng | TC01 |
| 5 | EC5 | Password sai | TC04 |
| 6 | EC6 | Không bị khóa | TC01, TC14, TC15, TC16 |
| 7 | EC7 | Đang bị khóa | TC05, TC14 |
| 8 | EC8 | login_attempts = 0 | TC01, TC09 |
| 9 | EC9 | login_attempts = 1 | TC10 |
| 10 | EC10 | login_attempts = 2 | TC11 |
| 11 | EC11 | login_attempts >= 3 | TC06, TC12 |
| 12 | EC12 | login_attempts = NULL/số âm | TC07, TC08 |
| 13 | - | Bug +2 (increment logic) | TC17 |

**Tổng EC**: 12/12 + 1 Bug TC = 17 Test Cases ✅

---

## Bug Report Summary

| Bug ID | Mô tả | Location | Severity | TC |
|--------|--------|----------|----------|-----|
| BUG-01 | login_attempts tăng +2 thay vì +1 | `server.js:54` | Medium | TC17 |

---

## Thứ tự Test khuyến nghị (khi chạy thủ công)

1. **TC01** — Đăng nhập thành công (baseline)
2. **TC04** — Sai password (reset state)
3. **TC02** — Email không tồn tại
4. **TC05** — Tài khoản bị khóa
5. **TC15, TC16** — Hết hạn khóa
6. **TC09, TC10, TC11** — BVA login_attempts
7. **TC03, TC07, TC08** — Edge cases (nếu có thời gian)
