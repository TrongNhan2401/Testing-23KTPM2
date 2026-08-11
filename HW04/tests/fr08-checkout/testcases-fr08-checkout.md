# Bảng Test Case chuẩn hóa — FR-08: Checkout (UI Automation)

> **Nguồn:** Trích xuất từ `HW04/sources_testcase/FR08.md` (17 case) + bổ sung các case UI thuần về **hiển thị sản phẩm/giá tiền** trên trang `/checkout` (case UI-Only, không thuộc FR-09 Coupon).
>
> **Scope:** UI Automation (Playwright) — KHÔNG bao gồm Coupon (FR-09).

---

## Đối chiếu 17 case nguồn → 12 case UI

| # nguồn | ID gốc | Nhóm                  | Quyết định                                                            | Lý do                                                                                       |
| ------- | ------ | --------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| 1       | TC-A1  | A — Authorization     | ✅ GIỮ                                                                 | UI cho phép test thông qua state/token                                                      |
| 2       | TC-A2  | A                     | ✅ GIỮ                                                                 | Test được qua việc đăng nhập/không                                                          |
| 3       | TC-A3  | A                     | ✅ GIỮ                                                                 | Test được                                                                                   |
| 4       | TC-B1  | B — Total amount      | ✅ GIỮ                                                                 | UI có input `type=number` cho total (editable)                                              |
| 5       | TC-B2  | B                     | ✅ GIỮ                                                                 | UI cho phép nhập đúng total                                                                 |
| 6       | TC-B3  | B                     | ✅ GIỮ                                                                 | UI cho phép nhập 0                                                                          |
| 7       | TC-C1  | C — Cart state        | ✅ GIỮ                                                                 | Test được qua cart trống                                                                    |
| 8       | TC-C2  | C                     | ✅ GIỮ                                                                 | Test được                                                                                   |
| 9       | TC-D1  | D — Shipping address  | ❌ BỎ (user xác nhận 2026-08-11)                                       | UI thiếu input `shipping_address` — case này cũng không thể tương tác UI; user chỉ đạo bỏ luôn         |
| 10      | TC-D2  | D                     | ❌ BỎ (user xác nhận 2026-08-11)                                       | UI thiếu input; không thể tương tác; user chỉ đạo bỏ                                            |
| 11      | TC-D3  | D                     | ❌ BỎ (user xác nhận 2026-08-11)                                       | UI thiếu input                                                                              |
| 12      | TC-D4  | D                     | ❌ BỎ (user xác nhận 2026-08-11)                                       | UI thiếu input                                                                              |
| 13      | TC-D5  | D                     | ❌ BỎ                                                                  | Trùng về bản chất với TC-D3 (đều là thiếu trường/null-equivalent)                           |
| 14      | BV-S1  | Biên                  | ❌ BỎ                                                                  | UI thiếu input shipping_address — không test được                                           |
| 15      | BV-S2  | Biên                  | ❌ BỎ                                                                  | UI thiếu input                                                                              |
| 16      | BV-S3  | Biên                  | ❌ BỎ                                                                  | UI thiếu input                                                                              |
| 17      | BV-S4  | Biên                  | ❌ BỎ                                                                  | UI thiếu input                                                                              |

**Tổng giữ:** 8 case nguồn (3A + 3B + 2C) + 4 case UI-only (TC-UI-1..4) = **12 case** cho UI Automation.

> **2026-08-11 update:** Cả nhóm D (TC-D1..D4) đều bị bỏ vì UI thiếu hoàn toàn input `shipping_address`. Toàn bộ nhóm D thuộc về API/Domain testing (đã có trong FR08.md §3.4).

---

## Case bổ sung (UI-only) — ngoài FR08.md

Quan sát trực tiếp `eshop/frontend-web/src/pages/Checkout.jsx`: trang Checkout hiển thị **danh sách sản phẩm** (`<ul>`) và **tổng tiền** ở cuối trang. Đây là phần UI chưa được test trong FR08.md (chỉ test ở mức API). Bổ sung 4 case UI-only:

| ID mới   | Nguồn                                  | Lý do bổ sung                                                                                                       |
| -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| TC-UI-1 | Checkout.jsx dòng 83–90                | Xác nhận danh sách sản phẩm được render đúng (tên, số lượng, thành tiền từng item)                                  |
| TC-UI-2 | Checkout.jsx dòng 93–102, `cartTotal`  | Xác nhận input "Tổng tiền thanh toán" hiển thị đúng giá trị = tổng từ giỏ hàng khi mới load trang                  |
| TC-UI-3 | Checkout.jsx dòng 134–141               | Xác nhận dòng "Tổng thanh toán" hiển thị đúng = `cartTotal` khi chưa áp coupon                                     |
| TC-UI-4 | Checkout.jsx dòng 95–101               | Xác nhận khi user sửa total trong input, dòng "Tổng thanh toán" cuối trang cập nhật theo (reactive) — bản thân đây là bug UI (FR-08 yêu cầu "không cho phép người dùng chỉnh sửa trực tiếp") |

> **Lưu ý:** TC-UI-1..4 chỉ verify **hiển thị/UI state**, không động đến Coupon. Tổng cuối cùng = **12 case** cho UI Automation (8 case nguồn FR08.md + 4 case bổ sung UI-only).

---

## Bảng chuẩn — 12 test case cho UI Automation

| id      | type     | input                                                                                                           | expected                                                                                                                                                                                       | note                                                                                                          |
| ------- | -------- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| TC-A1   | positive | Đã đăng nhập user hợp lệ, giỏ hàng có ≥1 SP, total_amount đúng, bấm "Xác Nhận Thanh Toán"                       | Trang hiển thị heading "Thanh toán thành công!"; giỏ hàng bị clear (badge về 0 nếu có)                                                                                                         | Happy path end-to-end                                                                                         |
| TC-A2   | negative | Truy cập `/checkout` khi chưa đăng nhập (hoặc xóa token) — bấm "Xác Nhận Thanh Toán"                            | Backend trả `401`; UI hiển thị `alert("Lỗi khi thanh toán: ...")`                                                                                                                              | Không có JWT token                                                                                            |
| TC-A3   | negative | Đăng nhập → dùng DevTools thay token thành `"invalid-token-xyz"` → bấm "Xác Nhận Thanh Toán"                    | Backend trả `403`; UI hiển thị `alert("Lỗi khi thanh toán: Forbidden")`                                                                                                                        | Token không hợp lệ                                                                                            |
| TC-B1   | negative | Cart có sản phẩm (ví dụ tổng thực = 200.000 ₫) — user **sửa input total thành 1** → bấm thanh toán              | Backend PHẢI ignore; response `final_amount` (kiểm tra qua network) = tổng giỏ hàng thực, KHÔNG phải 1. UI vẫn hiển thị "Thanh toán thành công!"                                               | Test ID-editable input — bản thân UI cho phép nhập là **BUG-001** đã biết. Script chỉ assert hành vi backend. |
| TC-B2   | positive | Cart có sản phẩm → nhập đúng total_amount (khớp `cartTotal`) → bấm thanh toán                                   | `200 OK`; `final_amount` = tổng cart (network assertion)                                                                                                                                       | Baseline so sánh với TC-B1                                                                                    |
| TC-B3   | edge     | Cart có sản phẩm → nhập total = 0 → bấm thanh toán                                                              | Backend hiện `200 OK` cho phép đơn miễn phí; UI hiển thị "Thanh toán thành công!"                                                                                                              | Thăm dò domain: đơn miễn phí                                                                                  |
| TC-C1   | negative | Không có sản phẩm trong giỏ → vào `/checkout` → bấm thanh toán                                                  | Backend hiện trả `200 OK` (BUG-002 đã ghi nhận). UI vẫn hiển thị success — script assert BOTH: (1) UI hiển thị "Thanh toán thành công!" và (2) network response không phải 4xx                 | Tài liệu hóa bug hiện tại                                                                                     |
| TC-C2   | positive | Giỏ có sản phẩm → bấm thanh toán — sau khi success, kiểm tra giỏ                                                | UI redirect về success page; khi quay lại trang chủ/giỏ, giỏ hàng phải rỗng (BUG-003: hiện KHÔNG clear). Assert state giỏ + report bug                                                         | Tài liệu hóa bug hiện tại                                                                                     |
| TC-UI-1 | positive | Giỏ có 2 SP: SP-A (price 100.000, qty 2), SP-B (price 50.000, qty 1). Vào `/checkout`                            | Trang hiển thị `<ul>` chứa đúng 2 dòng: `"Sản phẩm A x 2 — 200.000 ₫"` và `"Sản phẩm B x 1 — 50.000 ₫"` (theo code dòng 86–90)                                                              | Verify hiển thị sản phẩm + thành tiền từng item                                                                |
| TC-UI-2 | positive | Giỏ có SP (tổng = X) → load `/checkout`                                                                         | Input "Tổng tiền thanh toán" có giá trị = X (ban đầu lấy từ `cartTotal` ở `useState`)                                                                                                          | Verify input total được pre-fill đúng                                                                          |
| TC-UI-3 | positive | Giỏ có SP (tổng = X) → load `/checkout`                                                                         | Dòng "Tổng thanh toán: X ₫" hiển thị đúng ở cuối form (chưa áp coupon)                                                                                                                       | Verify tổng cuối cùng = cartTotal khi chưa có coupon                                                           |
| TC-UI-4 | negative | Giỏ có SP (tổng 200.000) → load `/checkout` → sửa input total thành 999.999                                       | Input chấp nhận giá trị mới → dòng "Tổng thanh toán" cuối trang cập nhật = 999.999 ₫. **Bug UI:** spec FR-08 yêu cầu "không cho phép chỉnh sửa trực tiếp" nhưng input là editable                  | Tài liệu hóa bug UI (đã biết từ BUG-001)                                                                     |

---

## Ghi chú phạm vi

- **Coupon (FR-09):** Page Object có sẵn locator `couponInput`, `applyCouponButton` để tham chiếu, nhưng KHÔNG có test case nào trong bảng này đụng đến coupon flow. Bước 4 (script) sẽ không sinh test cho coupon.
- **Shipping address (toàn bộ nhóm D):** Tất cả TC-D1, TC-D2, TC-D3, TC-D4 đã được user xác nhận bỏ (2026-08-11) do UI thiếu hoàn toàn input `shipping_address` — không thể tương tác UI. Toàn bộ nhóm D thuộc về API/Domain testing (đã có trong FR08.md §3.4). Trong script các case này hoàn toàn **vắng mặt**, không dùng `test.skip()`.
- **TC-C1, TC-B3, TC-UI-4:** Test tài liệu hóa bug đã biết — script vẫn chạy và assert hành vi quan sát được (KHÔNG dùng best-effort để nuốt lỗi).
