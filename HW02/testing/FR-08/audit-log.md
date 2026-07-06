# Audit Log — FR-08: Thanh toán (Checkout)

> Ghi chép theo trình tự thời gian. Mỗi phiên làm việc của AI được ghi thành 1 entry.

---

### [2026-07-06 09:16] — FR-08 — Bước 0 → Bước 5: Domain Testing Black-box hoàn chỉnh (phiên bản 1)

- **Công cụ:** Cursor Agent (Claude)
- **Prompt/instruction nhận được:** Thực hiện kỹ thuật domain-testing cho FR-08: Checkout, theo phương pháp black-box thuần từ domain-testing-agent-blackbox.md.
- **File code đã đọc:**
  - `contexts/README.md` §2 (FR-07 Giỏ hàng, FR-08 Checkout, FR-09 Coupon) — dòng 93–136
  - `contexts/api_specification.md` §4.1–4.3 (Cart & Orders endpoints) — dòng 110–137
  - `domain-testing-agent-blackbox.md` — phương pháp luận
  - `templates/report_template_blackbox.md` — cấu trúc output
- **Output/kết luận của bước:**
  - Tạo thư mục `testing/FR-08/` và file `testing/FR-08/report.md` với đầy đủ 7 bước (Phương pháp luận → Section 7).
  - Tạo `testing/FR-08/audit-log.md` với Entry #1.
  - Đặc điểm nổi bật của FR-08 so với FR-02:
    - FR-08 phụ thuộc giỏ hàng (FR-07) — phải test cart có sản phẩm trước khi checkout.
    - Spec FR-08 nói rõ backend PHẢI ignore `total_amount` từ client → test case TC-D1 đặc biệt quan trọng để xác nhận hành vi này.
    - Nhiều giá trị thăm dò (G1–G6) vì spec thiếu: độ dài address, min/max amount, requiredness của `total_amount`.
  - 22 test case được thiết kế: 3 (Auth) + 2 (Cart) + 5 (Address) + 5 (Total amount) + 4 (BV-S) + 3 (BV-T).
- **Human review / correction:** 
  - Ở input/output đồng ý thực hiện test case thăm dò với các thông tin như độ dài tối thiểu và tối đa của shipping address và trạng thái giỏ hàng không được trống khi thực hiện thanh toán
  - EC cho shipping address thì giả định đã đúng, shipping address phải tối thiểu có chứa nội dung
  - EC cho total amount chỉ cần xét xem có ignore được giá trị này hay không là được rồi vì spec đã yêu cầu không cho người dùng chỉnh sửa. Ngoài ra việc thêm vào giỏ hàng 1 đơn hàng có giá trị âm hay đơn hàng có giá trị lớn thì việc này sẽ do FR-07 test còn tôi sẽ không thực hiện việc này. Còn lại sẽ thăm dò xem giỏ hàng có xử lý đơn hàng miễn phí (total amount = 0) hay không thôi. 
  - Phát hiện việc sắp xếp test case chưa được login lắm khi việc test ignore trước rất quan trọng để xác định xem liệu có phụ thuộc vào total amount mình nhập hay không. Kết hợp với các api xem chi tiết đơn hàng để xác định.


---

### [2026-07-06 10:44] — FR-08 — Human Review & Agent Corrections (phiên bản 2)

- **Công cụ:** Cursor Agent (Claude)
- **Prompt/instruction nhận được:**
  ```
  Human review / correction:
  
  Ở input/output đồng ý thực hiện test case thăm dò với các thông tin như độ dài tối thiểu và tối đa của shipping address và trạng thái giỏ hàng không được trống khi thực hiện thanh toán
  
  EC cho shipping address thì giả định đã đúng, shipping address phải tối thiểu có chứa nội dung
  
  EC cho total amount chỉ cần xét xem có ignore được giá trị này hay không là được rồi vì spec đã yêu cầu không cho người dùng chỉnh sửa. Ngoài ra việc thêm vào giỏ hàng 1 đơn hàng có giá trị âm hay đơn hàng có giá trị lớn thì việc này sẽ do FR-07 test còn tôi sẽ không thực hiện việc này. Còn lại sẽ thăm dò xem giỏ hàng có xử lý đơn hàng miễn phí (total amount = 0) hay không thôi.
  
  Phát hiện việc sắp xếp test case chưa được login lắm khi việc test ignore trước rất quan trọng để xác định xem liệu có phụ thuộc vào total amount mình nhập hay không. Kết hợp với các api xem chi tiết đơn hàng để xác định.
  ```
- **File code đã đọc:** Không đọc thêm source code.
- **Output/kết luận của bước:**
  1. Section 1 (Input/Output): Giữ nguyên I1-I4, O1-O4. O1 bổ sung "final_amount = tổng từ giỏ hàng". Bổ sung nguồn `api_specification.md` §4.5 cho `GET /api/orders/:id`.
  2. Section 2 (EC): EC-S1 mô tả rõ "tối thiểu 1 ký tự có nội dung". EC-T3 và EC-T4 (âm/lớn) đã bỏ — thuộc FR-07. EC-T2 cập nhật thành "đơn hàng miễn phí = 0". Ghi chú rõ spec yêu cầu ignore là BẮT BUỘC.
  3. Section 3 (Test Case): Nhóm B (Total amount) đưa lên đầu vì quan trọng nhất. TC-D1 → TC-B1 (sai total_amount), TC-D2 → TC-B2 (đúng total_amount), giữ TC-D3 → TC-B3 (boundary 0). Nhóm D sắp xếp lại TC-D1 → TC-D5 bắt đầu từ EC-S1. Tổng giảm từ 22 xuống 17 test case.
  4. Section 4 (BVA): Bỏ BV-T hoàn toàn (âm/lớn thuộc FR-07). Giữ BV-S1..BV-S4 để thăm dò độ dài address.
  5. Section 5 (Gap Analysis): Thu gọn G1-G4, bỏ G5-G6. GA1-GA4 giữ nguyên.
  6. Section 6: Cập nhật TC references theo đánh số mới.
  7. Section 7: Tổng test case cập nhật thành 17 (bỏ 5 test case của total_amount âm/lớn và 2 BV-T).
- **Human review / correction:** *Đã nhận và áp dụng toàn bộ 4 điểm correction.*
