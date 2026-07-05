# Template: Functional Testing trên UI (Black-box)

> Bổ sung cho phần test qua Postman (API-level). Mục này áp dụng khi test trực tiếp qua giao
> diện người dùng (browser/app), vẫn theo đúng nguyên tắc black-box thuần: EC/BVA suy ra từ
> spec + hành vi hiển thị trên UI, KHÔNG đọc source code frontend/backend.

## Phương pháp luận (bắt buộc, chèn đầu section)

```markdown
Functional testing trên UI trong report này được thực hiện thuần túy qua thao tác trên giao
diện (browser), quan sát hành vi hiển thị (validation message, trạng thái nút, điều hướng,
thông báo lỗi...) — KHÔNG dựa trên việc đọc code frontend/backend xử lý logic. Các Equivalence
Class và Boundary Value áp dụng ở tầng UI được kế thừa từ report black-box API-level (nếu có),
chỉ bổ sung các khía cạnh riêng của UI (hiển thị, luồng thao tác, trạng thái) không thể quan
sát được qua Postman.
```

## Phạm vi cần bao phủ (checklist tối thiểu)

Với mỗi feature (FR-XX), agent kiểm tra và tạo test case cho các nhóm sau nếu áp dụng được:

- [ ] **Validation hiển thị**: thông báo lỗi có xuất hiện đúng field, đúng thời điểm (blur/
  submit), đúng nội dung không (so với spec, không so với message code trả về)
- [ ] **Trạng thái nút/form**: nút submit có bị disable đúng lúc không (vd khi đang loading,
  khi form invalid), có tránh được double-submit không
- [ ] **Luồng điều hướng**: sau hành động thành công/thất bại, UI điều hướng đúng trang không
  (redirect, ở lại trang, hiển thị modal...)
- [ ] **Thông báo lỗi/thành công**: nội dung, vị trí, thời gian hiển thị (toast tự ẩn sau bao
  lâu, có cần đóng thủ công không)
- [ ] **Khóa/giới hạn hiển thị cho người dùng**: ví dụ khóa tài khoản có hiện đếm ngược, có
  disable nút login không, có thông báo rõ thời gian mở khóa không
- [ ] **Trạng thái biên (empty/loading/error)**: màn hình rỗng, đang tải, lỗi kết nối hiển thị
  ra sao
- [ ] **Responsive cơ bản** (nếu trong phạm vi): layout ở kích thước màn hình phổ biến (desktop/
  mobile) có vỡ không
- [ ] **Khả năng lặp lại thao tác nhanh (rapid actions)**: người dùng click nhiều lần liên tiếp,
  refresh giữa chừng, back/forward trình duyệt — có gây trạng thái UI sai không

## Bảng test case UI

| TC ID | Màn hình/Feature | Precondition | Bước thao tác | Expected (theo spec/thông lệ UX) | Actual | Status | Ghi chú |
|---|---|---|---|---|---|---|---|
| UI-FR-XX-01 | | | | | | ⬜ | |
| UI-FR-XX-02 | | | | | | ⬜ | |

Quy ước cột **Expected**:
- Nếu spec có mô tả rõ hành vi UI → ghi `[Từ spec]` + nội dung
- Nếu không có, agent đề xuất theo thông lệ UX phổ biến và đánh dấu rõ
  `[Giả định UX thông thường — CẦN XÁC NHẬN VỚI QA/BUSINESS]`

## Gap Analysis riêng cho UI

Liệt kê các hành vi UI không thể xác định vì:
- Spec không mô tả chi tiết UX (chỉ mô tả API)
- Có sự khác biệt giữa hành vi API (Postman) và hành vi hiển thị trên UI (ví dụ API trả lỗi
  đúng nhưng UI không hiển thị thông báo tương ứng)

| Vấn đề | Vì sao chưa xác định được | Đề xuất xác nhận |
|---|---|---|
| | | |

## Liên kết với bug từ tầng API

Nếu một bug đã phát hiện ở tầng API (Postman) có biểu hiện tương ứng trên UI (ví dụ tài khoản
bị khóa sớm ở tầng API → UI cũng không hiển thị cảnh báo phù hợp), ghi rõ liên kết:

```
Liên quan issue API: [FR-02][Bug] Tài khoản bị khóa sau 2 lần đăng nhập sai...
Biểu hiện tương ứng trên UI: <mô tả>
```
