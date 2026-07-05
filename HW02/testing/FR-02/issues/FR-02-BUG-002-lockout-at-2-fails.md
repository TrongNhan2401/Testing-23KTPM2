## Tiêu đề issue

```
[FR-02][Bug] Tài khoản bị khóa sau 2 lần đăng nhập sai thay vì 3 lần theo spec
```

## Labels đề xuất

`bug`, `FR-02`, `black-box-testing`, `severity: high`

---

```markdown
## 1. Tóm tắt (Summary)
Cơ chế khóa tài khoản hoạt động bất thường: tài khoản bị khóa ngay tại
lần sai THỨ 2 thay vì lần THỨ 3 như spec yêu cầu. Spec nêu rõ "từ 3 lần trở lên
liên tiếp", nhưng quan sát thực tế cho thấy ngưỡng khóa đang là 2 lần sai.
Ngoài ra, sau khi hết thời gian khóa, bộ đếm `login_attempts` có vẻ không hoạt
động đúng: không reset về 0 khi login đúng, và cũng không tăng đúng +1 mỗi lần sai.

## 2. Nguồn spec / kỳ vọng (Expected Behavior)
- Tài liệu tham chiếu: `contexts/README.md` §2, FR-02 (dòng 38–44)
- Trích đúng nội dung spec liên quan (paraphrase, không copy nguyên văn dài):
  > Nếu đăng nhập sai từ **3 lần trở lên liên tiếp**, tài khoản bị tạm khóa 30 giây.
  > Sau mỗi lần đăng nhập sai, hệ thống tăng bộ đếm lên đúng 1 đơn vị.
- Mức độ rõ ràng của spec: `[Rõ ràng từ spec]`

## 3. Hành vi thực tế quan sát được (Actual Behavior)
Mô tả thuần túy dựa trên dữ liệu Postman đã ghi nhận, KHÔNG tham chiếu source code:

### 3.1 Khóa xảy ra ở lần 2 thay vì lần 3

| Test Case | Input | Expected | Actual | Status |
|---|---|---|---|---|
| TC-D1 | Lần sai thứ **1** — password sai | `401` — tăng bộ đếm lên 1, chưa khóa | `401` — `{"error": "Invalid email or password"}` | ✅ |
| TC-D2 | Lần sai thứ **2** — password sai | `401` — tăng bộ đếm lên 2, **chưa khóa** | `403 Forbidden` — `{"error": "Tài khoản đã bị khóa..."}` | ❌ |
| TC-D3 | Lần sai thứ **3** — password sai | `423/429` — bị khóa 30 giây | `403 Forbidden` — `{"error": "Tài khoản đã bị khóa..."}` | ✅ (bị khóa — đáng lẽ ở lần 2) |

### 3.2 Đúng mật khẩu ở lần 3 vẫn bị khóa (re-test)

| Test Case | Input | Expected | Actual | Status |
|---|---|---|---|---|
| TC-D9 | Hết khóa → sai lần 1 → sai lần 2 → **đúng ở lần 3** | `200` — cho phép đăng nhập (đúng spec: chưa đạt ngưỡng 3) | `403 Forbidden` — `{"error": "Tài khoản đã bị khóa..."}` | ❌ |

### 3.3 Bộ đếm login_attempts bất thường

| Test Case | Mô tả | `login_attempts` quan sát được | Expected | Status |
|---|---|---|---|---|
| TC-A1 | Login đúng (trạng thái ban đầu) | Giá trị cao (không phải 0 hoặc 1) | `0` hoặc `1` | ❌ |
| TC-D5/D6/D7 | Login đúng sau khi hết khóa | `4` (tích lũy) | `0` hoặc `1` | ❌ |

> **Quan sát quan trọng:** Sau khi hết thời gian khóa và đăng nhập sai, lần sai thứ 2 đã
> trigger khóa → ngưỡng thực tế = **2** thay vì **3**. Đúng ở lần 3 vẫn bị khóa.
> Bộ đếm `login_attempts` không reset về 0 khi login đúng và có vẻ không tăng đúng +1.

## 4. Các bước tái hiện (Steps to Reproduce)

### Vấn đề khóa ở lần 2:
1. Chuỗi test bắt đầu từ trạng thái "hết thời gian khóa" (sau khi đã bị khóa trước đó và đã hết thời gian chờ)
2. Gọi `POST /api/login` với `{ "email": "test@eshop.com", "password": "SaiLan1!" }`
   → Expected: `401`, Actual: `401` ✅
3. Gọi `POST /api/login` với `{ "email": "test@eshop.com", "password": "SaiLan2!" }`
   → Expected: `401` (bộ đếm = 2, chưa khóa), Actual: `403` với thông báo khóa ❌
4. Bug xác nhận: tài khoản bị khóa ở lần sai thứ 2 thay vì thứ 3

### Bổ sung (re-test):
- Sau khi hết khóa, sai lần 1, sai lần 2, đúng ở lần 3 → Actual: `403` vẫn bị khóa
→ Xác nhận khóa xảy ra ở lần 2.

Môi trường test: local, công cụ: Postman, thời gian giữa các request: sau khi hết thời gian khóa

## 5. Giả thuyết hành vi (Behavioral Hypothesis)
> Chỉ điền mục này nếu đã quan sát đủ nhiều lần lặp để có cơ sở. Đây là suy luận
> **black-box động** (dynamic behavioral inference) dựa trên nhiều lần thăm dò qua API,
> KHÔNG phải đọc source code.

- Giả thuyết: Có vấn đề ở bộ đếm `login_attempts` — bộ đếm có thể hoạt động bất
  thường sau khi hết thời gian khóa: vừa có thể không reset về 0 khi login đúng, vừa
  có thể không tăng đúng +1 mỗi lần sai mà tích lũy thêm. Chi tiết về nguyên nhân
  kỹ thuật bên phía database/server không thuộc phạm vi testing black-box.
- Mức độ tin cậy: `Cao` — quan sát nhất quán qua nhiều test case; phát hiện tương
  tự được xác nhận qua re-test (TC-D9).
- Test case bổ sung cần chạy để xác nhận:
  - Test từ tài khoản hoàn toàn mới (register mới): chuỗi sai 1→2→3 → xem khóa xảy ra ở lần nào

## 6. Mức độ ảnh hưởng (Severity/Priority)
- Severity: `High`
- Lý do: Vi phạm trực tiếp spec. Người dùng hợp lệ có thể bị khóa tài khoản sớm
  hơn 1 lần so với thiết kế, gây trải nghiệm xấu và không đúng với cơ chế bảo mật
  đã đặc tả.

## 7. Traceability
- Test Case ID liên quan (trong report.md): TC-D1, TC-D2, TC-D3, TC-D9, TC-A1, TC-D5, TC-D6, TC-D7
- Feature: FR-02 — Đăng nhập & Khóa tài khoản
- File report gốc: `testing/FR-02/report.md`

## 8. Đính kèm
- [x] Screenshot Postman request/response (đã ghi trong cột Actual của report.md)
- [ ] Export Postman collection run (nếu có)
- [ ] Log DB liên quan (nếu có, chỉ mô tả giá trị quan sát được, không đính kèm code)
```
