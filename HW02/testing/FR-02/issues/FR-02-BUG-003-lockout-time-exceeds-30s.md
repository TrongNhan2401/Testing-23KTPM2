## Tiêu đề issue

```
[FR-02][Bug] Thời gian khóa tài khoản kéo dài hơn 30 giây theo spec
```

## Labels đề xuất

`bug`, `FR-02`, `black-box-testing`, `severity: high`

---

```markdown
## 1. Tóm tắt (Summary)
Sau khi tài khoản bị khóa, hệ thống vẫn từ chối đăng nhập ngay cả khi đã chờ đúng 30 giây
và 31 giây theo spec. Phải chờ thêm một khoảng thời gian dài hơn 31 giây thì mới được phép
đăng nhập lại. Điều này vi phạm spec nêu rõ "khóa 30 giây (môi trường demo)".

## 2. Nguồn spec / kỳ vọng (Expected Behavior)
- Tài liệu tham chiếu: `contexts/README.md` §2, FR-02 (dòng 38–44)
- Trích đúng nội dung spec liên quan (paraphrase, không copy nguyên văn dài):
  > Nếu đăng nhập sai từ 3 lần trở lên liên tiếp, tài khoản bị tạm khóa **30 giây**
  > (môi trường demo). Hệ thống trả về thông báo lỗi phù hợp.
- Mức độ rõ ràng của spec: `[Rõ ràng từ spec]`

## 3. Hành vi thực tế quan sát được (Actual Behavior)
Mô tả thuần túy dựa trên dữ liệu Postman đã ghi nhận, KHÔNG tham chiếu source code:

| Test Case | Điều kiện | Expected | Actual | Status |
|---|---|---|---|---|
| BV-T1 | Thử lại sau **29 giây** | `423/429` — chưa hết khóa | `403` — `{"error": "Tài khoản đã bị khóa..."}` | ✅ |
| BV-T2 | Thử lại sau **30 giây** | `200` — hết khóa | `403` — `{"error": "Tài khoản đã bị khóa..."}` | ❌ |
| BV-T3 | Thử lại sau **31 giây** | `200` — hết khóa | `403` — `{"error": "Tài khoản đã bị khóa..."}` | ❌ |

> **Quan sát quan trọng:** Cả BV-T2 (30 giây) và BV-T3 (31 giây) đều bị từ chối với
> `403 Forbidden`. Thời gian khóa thực tế lớn hơn đáng kể so với 30 giây theo spec.
> Không xác định được thời gian khóa chính xác từ các test case hiện tại.

## 4. Các bước tái hiện (Steps to Reproduce)
1. Đăng nhập thành công để reset bộ đếm
2. Gọi login sai 3 lần liên tiếp → tài khoản bị khóa (xác nhận qua `403 Forbidden`)
3. Đợi đúng **30 giây**
4. Gọi `POST /api/login` với password đúng: `test@eshop.com` / `Test1234!`
   → Expected: `200 OK`, Actual: `403 Forbidden` ❌
5. Đợi thêm vài giây nữa, gọi lại → vẫn bị khóa cho đến khi đủ thời gian thực tế

Môi trường test: local, công cụ: Postman, thời gian chờ: 29s / 30s / 31s

## 5. Giả thuyết hành vi (Behavioral Hypothesis)
> Chỉ điền mục này nếu đã quan sát đủ nhiều lần lặp để có cơ sở. Đây là suy luận
> **black-box động** (dynamic behavioral inference) dựa trên nhiều lần thăm dò qua API,
> KHÔNG phải đọc source code.

- Giả thuyết: Thời gian khóa thực tế của hệ thống lớn hơn 30 giây đáng kể (có thể là
  60 giây hoặc tính từ thời điểm khác so với kỳ vọng). Hoặc `locked_until` được tính
  dựa trên server time và có sự lệch timezone, hoặc server có cơ chế tính thời gian
  khóa khác với 30 giây được mô tả.
- Mức độ tin cậy: `Trung bình` — cần thêm test case với khoảng thời gian lớn hơn
  (60s, 90s, 120s) để xác định chính xác thời gian khóa thực tế.
- Test case bổ sung cần chạy để xác nhận:
  - Thử lại sau 60 giây → có được login không?
  - Thử lại sau 120 giây → có được login không?
  - Kiểm tra giá trị `locked_until` trong response sau mỗi lần bị khóa (nếu được trả về)
  - Test song song: trong khi tài khoản A bị khóa, test xem tài khoản B có login được không
    (xác định khóa per-account hay per-IP)

## 6. Mức độ ảnh hưởng (Severity/Priority)
- Severity: `High`
- Lý do: Trực tiếp vi phạm spec ("khóa 30 giây (môi trường demo)"). Người dùng bị khóa
  tài khoản không thể khôi phục truy cập trong thời gian thực tế (dài hơn nhiều so với
  kỳ vọng), gây trải nghiệm cực kỳ tiêu cực. Đặc biệt nghiêm trọng trong môi trường demo
  nơi thời gian chờ được kỳ vọng ngắn.

## 7. Traceability
- Test Case ID liên quan (trong report.md): BV-T2, BV-T3, TC-D7
- Feature: FR-02 — Đăng nhập & Khóa tài khoản
- File report gốc: `testing/FR-02/report.md`

## 8. Đính kèm
- [x] Screenshot Postman request/response (đã ghi trong cột Actual của report.md)
- [ ] Export Postman collection run (nếu có)
- [ ] Log DB liên quan (nếu có, chỉ mô tả giá trị quan sát được, không đính kèm code)
```
