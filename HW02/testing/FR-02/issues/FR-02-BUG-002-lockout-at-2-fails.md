## Tiêu đề issue

```
[FR-02][Bug] Tài khoản bị khóa sau 2 lần đăng nhập sai thay vì 3 lần theo spec
```

## Labels đề xuất

`bug`, `FR-02`, `black-box-testing`, `severity: high`

---

```markdown
## 1. Tóm tắt (Summary)
Sau khi đăng nhập thành công và bắt đầu chuỗi sai liên tiếp, tài khoản bị khóa ngay tại
lần sai THỨ 2 thay vì lần THỨ 3 như spec yêu cầu. Spec nêu rõ "từ 3 lần trở lên liên tiếp",
nhưng quan sát thực tế cho thấy ngưỡng khóa đang là 2 lần sai.

## 2. Nguồn spec / kỳ vọng (Expected Behavior)
- Tài liệu tham chiếu: `contexts/README.md` §2, FR-02 (dòng 38–44)
- Trích đúng nội dung spec liên quan (paraphrase, không copy nguyên văn dài):
  > Nếu đăng nhập sai từ **3 lần trở lên liên tiếp**, tài khoản bị tạm khóa 30 giây.
  > Sau mỗi lần đăng nhập sai, hệ thống tăng bộ đếm lên đúng 1 đơn vị.
- Mức độ rõ ràng của spec: `[Rõ ràng từ spec]`

## 3. Hành vi thực tế quan sát được (Actual Behavior)
Mô tả thuần túy dựa trên dữ liệu Postman đã ghi nhận, KHÔNG tham chiếu source code:

| Test Case | Input | Expected | Actual | Status |
|---|---|---|---|---|
| TC-D1 | Lần sai thứ **1** — password sai | `401` — tăng bộ đếm lên 1, chưa khóa | `401` — `{"error": "Invalid email or password"}` | ✅ |
| TC-D2 | Lần sai thứ **2** — password sai | `401` — tăng bộ đếm lên 2, **chưa khóa** | `403 Forbidden` — `{"error": "Tài khoản đã bị khóa..."}` | ❌ |
| TC-D3 | Lần sai thứ **3** — password sai | `423/429` — bị khóa 30 giây | `403 Forbidden` — `{"error": "Tài khoản đã bị khóa..."}` | ✅ (bị khóa đúng lúc này) |

> **Quan sát quan trọng:** Khi bắt đầu từ trạng thái sạch (sau khi login đúng), lần sai
> thứ 2 đã trigger khóa → ngưỡng thực tế = **2** thay vì **3**.

## 4. Các bước tái hiện (Steps to Reproduce)
1. Đăng nhập thành công với `test@eshop.com` / `Test1234!` để reset bộ đếm
2. Gọi `POST /api/login` với `{ "email": "test@eshop.com", "password": "SaiLan1!" }`
   → Expected: `401`, Actual: `401` ✅
3. Gọi `POST /api/login` với `{ "email": "test@eshop.com", "password": "SaiLan2!" }`
   → Expected: `401` (bộ đếm = 2, chưa khóa), Actual: `403` với thông báo khóa ❌
4. Bug xác nhận: tài khoản bị khóa ở lần sai thứ 2 thay vì thứ 3

**Cách phân biệt với bug khác (BV-D1):**
- Khi bắt đầu test sau khi khởi động server mà không login đúng trước: lần sai thứ 2
  trả về `401` (không bị khóa) → hành vi khác với khi bắt đầu sau login đúng.
- Bug này chỉ xuất hiện khi: login đúng → bắt đầu sai liên tiếp.

Môi trường test: local, công cụ: Postman, thời gian giữa các request: ngay lập tức (< 1 giây)

## 5. Giả thuyết hành vi (Behavioral Hypothesis)
> Chỉ điền mục này nếu đã quan sát đủ nhiều lần lặp để có cơ sở. Đây là suy luận
> **black-box động** (dynamic behavioral inference) dựa trên nhiều lần thăm dò qua API,
> KHÔNG phải đọc source code.

- Giả thuyết: Hành vi khóa ở lần 2 chỉ xảy ra SAU KHI đăng nhập đúng trước đó. Điều này
  gợi ý rằng `login_attempts` trong DB có thể không được reset về 0 khi login đúng, mà
  thay vào đó bộ đếm từ session/API trước đó (giá trị = 1 hoặc 2 từ lần test trước) vẫn
  còn tồn tại. Khi bắt đầu test mới, lần sai thứ 2 thực chất là lần sai thứ 3 hoặc thứ 4
  trong mắt hệ thống.
  - Quan sát bổ sung: sau khi login đúng (TC-D5/TC-D6), response trả về
    `"login_attempts": 4, "locked_until": "2026-07-05T09:05:28.839Z"` — giá trị này cho thấy
    bộ đếm đã tích lũy từ nhiều lần test trước đó và KHÔNG reset về 0 khi login đúng.
- Mức độ tin cậy: `Cao` — quan sát nhất quán qua nhiều test case; response body chứa
  `login_attempts: 4` ngay cả sau login đúng.
- Test case bổ sung cần chạy để xác nhận:
  - Test: sau khi login đúng, gọi login sai lần 1 → quan sát giá trị `login_attempts` trong response
  - Test: chờ hết khóa (30 giây), login đúng, rồi gọi login sai 1 lần → kiểm tra `login_attempts`
  - Test: register tài khoản mới hoàn toàn, test chuỗi sai 1→2→3 → xem khóa xảy ra ở lần nào

## 6. Mức độ ảnh hưởng (Severity/Priority)
- Severity: `High`
- Lý do: Vi phạm trực tiếp spec. Người dùng hợp lệ có thể bị khóa tài khoản sớm hơn 1 lần
  so với thiết kế, gây trải nghiệm xấu và không đúng với cơ chế bảo mật đã đặc tả. Ngoài ra,
  bộ đếm `login_attempts` không reset khi login đúng → tích lũy qua nhiều lần → có thể
  gây khóa sớm ngay cả khi người dùng vừa login đúng.

## 7. Traceability
- Test Case ID liên quan (trong report.md): TC-D2, TC-D3
- Feature: FR-02 — Đăng nhập & Khóa tài khoản
- File report gốc: `testing/FR-02/report.md`

## 8. Đính kèm
- [x] Screenshot Postman request/response (đã ghi trong cột Actual của report.md)
- [ ] Export Postman collection run (nếu có)
- [ ] Log DB liên quan (nếu có, chỉ mô tả giá trị quan sát được — `"login_attempts": 4` sau login đúng — không đính kèm code)
```
