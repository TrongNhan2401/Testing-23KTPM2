# Bug Reports — EShop SUT

**MSSV:** 23127443  |  **Ngày:** 2026-08-18  |  **Project:** HW05 Performance Testing

---

## Tổng quan

Phát hiện **3 bugs** trong quá trình test EShop:

| # | Bug | Mức độ | Test phát hiện |
|---|-----|--------|----------------|
| 1 | Lộ thông tin user tồn tại | 🔴 Bảo mật | Manual |
| 2 | Reset token bị lộ trong response | 🔴 Bảo mật | Manual |
| 3 | Import sản phẩm lỗi 70% | 🔴 Nghiêm trọng | Spike |

---

## Bug #1 — Lộ thông tin user tồn tại

**Mức độ:** 🔴 Cao (Bảo mật)  |  **Endpoint:** `POST /api/forgot-password`

**Vấn đề:** API trả response **khác nhau** tùy email có tồn tại hay không. Hacker dùng cách này để dò email đã đăng ký.

**Tái tạo:**

Email có tồn tại → trả `200` + message "đã tạo mã reset"

Email không tồn tại → trả `404` + "User not found"

**Mong đợi:** Cả 2 trả cùng response để chặn dò email.

**Cách sửa:** Luôn trả response giống nhau bất kể email có tồn tại hay không.

---

## Bug #2 — Reset token bị lộ trong response

**Mức độ:** 🔴 Cao (Bảo mật)  |  **Endpoint:** `POST /api/forgot-password`

**Vấn đề:** API trả `resetToken` ngay trong response body. Theo chuẩn, token chỉ nên gửi qua email. Lộ token → kẻ tấn công reset được mật khẩu bất kỳ user nào.

**Tái tạo:**

```bash
curl -X POST http://localhost:3000/api/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@eshop.com"}'
```

Response chứa token plain text:
```json
{ "message": "Mã đặt lại mật khẩu đã được tạo", "resetToken": "6906" }
```

**Mong đợi:** Response chỉ chứa message, **không trả token**.

**Cách sửa:** Bỏ `resetToken` khỏi response, chỉ gửi qua email.

---

## Bug #3 — Import sản phẩm lỗi 70%

**Mức độ:** 🔴 Nghiêm trọng  |  **Endpoint:** `POST /api/admin/import-products`

**Vấn đề:** Chức năng import sản phẩm hàng loạt fail với tỷ lệ rất cao. Trong 1000 request, chỉ 300 thành công, 700 thất bại.

**Số liệu từ JTL** (`spike-admin-import-products.jtl`):

| Response Code | Số lần | Tỷ lệ |
|---------------|--------|-------|
| 200 | 300 | 30% |
| 400 | 100 | 10% |
| Khác (36, 41, 42, ...) | 600 | 60% |

**Tác động:**
- Admin chỉ import thành công 30% sản phẩm.
- Hệ thống trả về nhiều mã lỗi lạ (36, 41, 42, ...) → có thể do timeout hoặc race condition.

**Mong đợi:** Error rate < 1% trong điều kiện load bình thường.

**Cách sửa:** Kiểm tra logic validation payload, transaction handling, và connection pool khi chịu tải cao.

---

## Tổng kết

### Test nào phát hiện bug nào?

| Test | Bug phát hiện |
|------|---------------|
| **Load Test** (Orders/MyOrders) | Không phát hiện bug (0/290 errors) |
| **Stress Test** (Reset Password) | Không phát hiện bug (600/600 = 100% success) |
| **Spike Test** (Import Products) | Bug #3 (700/1000 fail) |
| **Manual API check** | Bug #1, #2 |

### Mức độ nghiêm trọng

| Mức độ | Số lượng | Bug |
|--------|----------|-----|
| 🔴 Nghiêm trọng | 1 | #3 |
| 🔴 Cao (bảo mật) | 2 | #1, #2 |

### Đề xuất ưu tiên sửa

1. **Bug #3** (nghiêm trọng) — sửa ngay, chức năng import không ổn định.
2. **Bug #1, #2** (bảo mật) — sửa trong 1 sprint, rò rỉ thông tin user.

> **Lưu ý kỹ thuật:** Stress test reset-password có lần đầu chạy fail 100% ở bước login correct password - nguyên nhân là CSV chỉ có 10 users trong khi 50 VUs chia sẻ → dẫn đến 1 user bị nhiều thread login đồng thời. Sau khi mở rộng CSV lên 50 unique users và Setup thread loop = 50, test chạy 100% pass với 600/600 samples thành công. Đây là **kết quả performance thực sự** của reset-password flow, không phải bug hệ thống.

---

## Tham khảo

- JTL logs: `HW05/Results/`
  - `load-orders-summary.jtl` (0 errors, test pass)
  - `stress-reset-password.jtl` (chứa Bug #5, #6 - chạy với flow reset-password thuần)
  - `spike-admin-import-products.jtl` (chứa Bug #3)
- Test plans: `HW05/test-plans/`
- AI analysis: `docs/ai-analysis.md`
