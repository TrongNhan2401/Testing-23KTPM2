## Tiêu đề issue

```
[FR-02][Bug] UI không hiển thị thông báo khóa tài khoản khi đạt ngưỡng
```

## Labels đề xuất

`bug`, `FR-02`, `functional-testing`, `ux`, `severity: high`

---

```markdown
## 1. Tóm tắt (Summary)
Khi người dùng nhập sai mật khẩu đủ số lần theo ngưỡng khóa của hệ thống (3 lần liên tiếp
theo quan sát thực tế), giao diện đăng nhập KHÔNG hiển thị bất kỳ thông báo nào nói rằng
tài khoản đã bị tạm khóa. Thay vào đó, UI tiếp tục hiển thị thông báo lỗi chung giống như
khi sai mật khẩu thông thường: "Đăng nhập thất bại. Vui lòng kiểm tra lại."

Hậu quả: người dùng không biết mình đã bị khóa, không biết phải đợi bao lâu, dễ tiếp tục
nhập sai và lặp lại trải nghiệm khó hiểu nhiều lần.

## 2. Nguồn spec / kỳ vọng (Expected Behavior)
- Tài liệu tham chiếu: `contexts/README.md` §2, FR-02
- Trích đúng nội dung spec liên quan (paraphrase):
  > "Nếu đăng nhập sai từ 3 lần trở lên liên tiếp, tài khoản bị tạm khóa 30 giây.
  > Hệ thống trả về thông báo lỗi phù hợp."
- Spec yêu cầu **"thông báo lỗi phù hợp"** khi bị khóa. Việc phớt lờ trạng thái khóa và
  vẫn hiển thị thông báo "đăng nhập thất bại, kiểm tra lại" là **không phù hợp** vì:
  1. Sai lệch hoàn toàn bản chất sự cố: đây không phải "sai mật khẩu" mà là "đã bị khóa".
  2. Người dùng không được thông báo nên tiếp tục thử — vi phạm nguyên tắc UX fail-fast.
- Expected tối thiểu (giả định UX): khi đạt ngưỡng khóa, thông báo phải nói rõ
  "Tài khoản đã bị tạm khóa, vui lòng thử lại sau X giây".
- Mức độ rõ ràng của spec: `[Spec không quy định nội dung cụ thể, nhưng yêu cầu "phù hợp"
  — Expected là diễn giải tối thiểu]`

## 3. Hành vi thực tế quan sát được (Actual Behavior)
Mô tả thuần túy dựa trên quan sát trên giao diện, KHÔNG tham chiếu source code React/component:

| Bước | Thao tác | Expected (theo spec — "thông báo phù hợp") | Actual | Status |
|---|---|---|---|---|
| 1 | Truy cập `/login`, nhập `test@eshop.com` + 3 password sai liên tiếp | Ở lần thứ 3, thông báo phải nói rõ "tài khoản đã bị khóa" | Cả 3 lần đều hiển thị cùng một thông báo: **"Đăng nhập thất bại. Vui lòng kiểm tra lại."** | ❌ |
| 2 | Sau khi "bị khóa" (thực tế), thử lại lần 4 với password đúng | Thông báo "đang khóa, vui lòng đợi..." | Vẫn hiển thị "Đăng nhập thất bại. Vui lòng kiểm tra lại." | ❌ |
| 3 | Sau ~30 giây, thử lại với password đúng | Cho phép đăng nhập | Đăng nhập thành công (xử lý đúng chức năng) | ✅ (nhưng UI không chủ động báo đã hết khóa) |

## 4. Các bước tái hiện (Steps to Reproduce)
1. Truy cập `http://localhost:5173/login`.
2. Nhập `Email = test@eshop.com` + `Password = SaiLan1!` → bấm "Đăng nhập".
3. Quan sát: hiển thị "Đăng nhập thất bại. Vui lòng kiểm tra lại."
4. Lặp lại với 2 password sai khác (`SaiLan2!`, `SaiLan3!`).
5. Ở lần thứ 3: **vẫn hiển thị cùng thông báo "Đăng nhập thất bại. Vui lòng kiểm tra lại."**
   — không có dấu hiệu nào nói rằng tài khoản đã bị khóa.
6. Thử nhập tiếp một lần khác (đợi vài giây): thông báo vẫn y nguyên.

**Quan sát quan trọng:** Thông báo "Đăng nhập thất bại. Vui lòng kiểm tra lại" xuất hiện
**ở mọi lần sai kể cả sau khi đã bị khóa**, không phân biệt được giữa "sai mật khẩu" và
"đang bị khóa".

Môi trường test: local, công cụ: trình duyệt Chrome (DevTools Network tab để theo dõi
API trả về 403 nhưng UI vẫn hiển thị thông báo chung).

## 5. Giả thuyết hành vi (Behavioral Hypothesis)
> Đây là suy luận **black-box** dựa trên quan sát UI và response API — KHÔNG đọc source code.

- Giá trị API trả về ở lần sai thứ 3 (và sau đó) là `403 Forbidden` với body có
  `error: "Tài khoản đã bị khóa..."` (đã xác nhận qua test API ở TC-D2/D3/D4 trong
  Domain Testing). Tuy nhiên UI không hiển thị message này — thay vào đó hiển thị
  thông báo lỗi chung.
- Giả thuyết: UI có thể đang hiển thị thông báo lỗi dựa trên một message string khác
  (vd: một message cố định "Đăng nhập thất bại. Vui lòng kiểm tra lại") thay vì lấy
  trực tiếp `error` message từ response body của API. Đây là quan sát hành vi, không
  khẳng định implementation.
- Mức độ tin cậy: `Cao` — pattern lặp lại nhất quán qua nhiều lần thử (≥3 lần liên tiếp
  trở lên đều hiển thị y nguyên); số lần nhập không ảnh hưởng đến thông báo.
- Test case bổ sung cần chạy để xác nhận:
  - Mở DevTools Network, đăng nhập sai 3 lần: xác nhận API đã trả 403 với message
    "Tài khoản đã bị khóa..." → nhưng UI vẫn hiển thị "Đăng nhập thất bại. Vui lòng kiểm tra lại".
  - So sánh với thông báo khi sai mật khẩu thông thường (chưa khóa): 2 thông báo giống nhau
    → bug xác nhận UI không phân biệt được trạng thái.

## 6. Mức độ ảnh hưởng (Severity/Priority)
- Severity: `High`
- Lý do:
  - **Gây bối rối nghiêm trọng:** người dùng không biết mình bị khóa, dễ nghĩ là lỗi
    hệ thống / sai mật khẩu, lặp lại thao tác không cần thiết.
  - **Ảnh hưởng hành vi bảo mật:** nếu người dùng tưởng nhầm là "sai mật khẩu", họ
    có thể tiếp tục gõ các biến thể khác — có thể dẫn đến pattern đoán mật khẩu (tất
    nhiên bị giới hạn bởi lockout backend, nhưng về mặt UX là không tốt).
  - **Vi phạm spec mềm:** spec yêu cầu "thông báo phù hợp" — không hiển thị trạng thái
    khóa là "không phù hợp" theo nghĩa hẹp nhất.
  - Severity cao hơn BUG-005 (Medium) vì BUG-005 chỉ thiếu UX phụ (đếm ngược);
    BUG-006 ảnh hưởng đến thông báo lỗi cốt lõi mà hầu hết người dùng sẽ gặp.

## 7. Traceability
- Test Case ID liên quan (trong report.md):
  - Functional: **TC-UI-D3** (FAIL — quan sát thông báo chung thay vì "bị khóa")
  - Domain Testing API: TC-D2, TC-D3, TC-D4, TC-D9 (đã xác nhận API trả 403 + message
    "Tài khoản đã bị khóa" — phần UI chỉ đơn giản là không hiển thị message này)
- Feature: FR-02 — Đăng nhập & Khóa tài khoản
- File report gốc: `testing/FR-02/report.md`
- Loại test: Functional Testing (UI)
- Bug liên quan: BUG-005 (cùng nhóm UX nhưng khác triệu chứng — đã tách thành 2 bug)

## 8. Đính kèm
- [x] Screenshot UI ở lần sai thứ 3, 4, ... đều hiển thị cùng thông báo (đã trích trong
      bảng Section 9.1 của report.md)
- [ ] Export Postman collection run (không áp dụng — test trên UI)
- [ ] Log DB liên quan (không thuộc phạm vi — bug thuộc tầng UI/UX)
- [x] DevTools Network log từ API (xem TC-D2/D3 trong Domain Testing — API đã đúng, UI mới là phần sai)
```

---

## Lưu ý phân biệt với BUG-005

| Bug | Triệu chứng | Mức độ |
| --- | --- | --- |
| **BUG-005** | UI không hiển thị **số lần thử còn lại** trước khi khóa + không có **đếm ngược / thời gian chờ** khi khóa | Medium (thiếu UX phụ) |
| **BUG-006** (file này) | UI không hiển thị **thông báo rằng tài khoản đã bị khóa** — chỉ hiển thị thông báo sai mật khẩu chung | High (thiếu thông báo lỗi cốt lõi) |

Hai bug thuộc cùng feature (FR-02) và cùng nhóm UX (thông báo khi khóa) nhưng có triệu chứng
và severity khác nhau → đã tách thành 2 issue riêng.
