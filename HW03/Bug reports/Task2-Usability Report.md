## **BÁO CÁO KIỂM THỬ TÍNH TIỆN DỤNG (USABILITY REPORT)**

**Sản phẩm:** Hệ thống EMS – Chức năng Tạo & Quản lý sự kiện

### **Giai đoạn 1 — Thiết kế & Chuẩn bị**

**1\. Kịch bản tác vụ (Task Scenario)**  
*Bối cảnh:* Bạn là thành viên ban tổ chức sự kiện của câu lạc bộ.  
*Tác vụ:* "Hãy tạo một sự kiện hội thảo sắp tới trên hệ thống dành cho tối đa 50 người tham gia (bao gồm cả sinh viên và giảng viên). Bạn cần thiết lập thời gian diễn ra vào tuần tới, bật tính năng danh sách chờ (waitlist), phân quyền vai trò tham gia đầy đủ, và xuất bản (Publish) sự kiện. Sau đó, hãy tìm lại sự kiện vừa tạo để kiểm tra xem nó đã hiển thị đúng trên hệ thống chưa trước khi chia sẻ link."  
**2\. Mục tiêu đo lường**

* **Task Success:** Hoàn thành đầy đủ / Một phần / Thất bại.  
* **Time on Task:** Thời gian từ lúc bắt đầu tìm nút tạo đến lúc thấy sự kiện trên trang chủ.  
* **Errors / Hesitations:** Lỗi nhập liệu, số lần ngập ngừng khi tương tác với UI.  
* **Post-Task Metrics:** Điểm SUS (System Usability Scale) và các câu hỏi mở về Clarity, Error Recovery, Speed, và Trust.

**3\. Bảng thông tin người tham gia**  
Hồ sơ người tham gia được chọn lọc phù hợp với đối tượng mục tiêu, đảm bảo tính khách quan (người ngoài nhóm phát triển).

| STT | Họ và tên | Số điện thoại (ẩn 4 số) | Ngày thực hiện |
| :---- | :---- | :---- | :---- |
| 1 | Nguyễn Trường Duy | 033 \*\*\* \*833 | 02/08/2026 |
| 2 | Đào Đức Mạnh | 036 \*\*\* \*207 | 02/08/2026 |
| 3 | Nguyễn Lê Nhật Duy | 094 \*\*\* \*210 | 02/08/2026 |
| 4 | Nguyễn Văn An | 098 \*\*\* \*321 | 02/08/2026 |
| 5 | Nguyễn Võ Huy Cường | 093 \*\*\* \*622 | 08/02/2026 |

### 

### **Giai đoạn 2 & 3 — Phân tích & Báo cáo**

**1\. Bảng chỉ số tác vụ (Task Metrics)**  
Dựa trên kết quả thực tế từ 5 phiên kiểm thử, tỉ lệ hoàn thành tác vụ là 100%, tuy nhiên người dùng gặp khá nhiều cản trở về mặt thời gian và trải nghiệm.

| Chỉ số đo lường | Dữ liệu thống kê | Phân tích chi tiết |
| :---- | :---- | :---- |
| **Tỉ lệ thành công** | 100% (5/5) | Cả 5 người đều "Hoàn thành đầy đủ" tác vụ. |
| **Thời gian trung bình** | \~6.9 phút | Dao động từ 4 phút (nhanh nhất) đến 10 phút (chậm nhất). |
| **Số lỗi / Điểm vướng** | 12 điểm vướng mắc | Tập trung ở khâu điều hướng (UI), cấu hình thời gian và Waitlist. |
| **Điểm SUS (Ước lượng)** | Tạm ổn (\~65-70/100) | Giao diện cơ bản đáp ứng luồng, nhưng bị phàn nàn vì cồng kềnh. |

**2\. Phân tích tính tiện dụng (Xếp hạng theo Mức nghiêm trọng 0–4)**  
*(Quy ước: 0 \= Không lỗi, 1 \= Lỗi thẩm mỹ, 2 \= Lỗi nhỏ, 3 \= Lỗi lớn, 4 \= Thảm họa Usability)*

* **\[Severity 3\] Khó khăn trong việc xác định vị trí tính năng (Discoverability):** Người dùng phản ánh việc tìm kiếm vị trí tạo sự kiện hoặc trang "Quản lý sự kiện" rất khó khăn, bố cục thiếu trực quan và không gây được thiện cảm.  
* **\[Severity 3\] Trải nghiệm tồi ở bộ chọn thời gian (Time Picker):** Người dùng phàn nàn về việc phải lăn chuột để chọn giờ thay vì có thể nhập bằng bàn phím. Đặc biệt, vòng lặp số phút không liên tục (khi cuộn đến 59 không tự lật sang 00 mà phải kéo ngược về). Bên cạnh đó, hệ thống không đưa ra cảnh báo lỗi cụ thể khi người dùng nhập sai thời gian trong một số trường hợp.  
* **\[Severity 2\] Logic và giao diện Waitlist & Limits gây bối rối:** Người dùng lúng túng giữa việc thiết lập giới hạn tổng (50 người) và cách chia tỉ lệ cho các vai trò (lecturer/student). Khó khăn trong việc xác định thứ tự bật/tắt công tắc Waitlist hay nhập số lượng trước.  
* **\[Severity 2\] Phân quyền vai trò (Roles) phức tạp hóa luồng người dùng:** Người dùng đánh giá tính năng thêm Role là không cần thiết, làm phức tạp hệ thống, mất nhiều thời gian và đề xuất nên có cơ chế tự động phân loại.  
* **\[Severity 1\] Thiếu chức năng xem trước (Preview) & Wording chưa rõ:** Người dùng gặp khó khăn trong việc căn chỉnh kích thước ảnh thumbnail và muốn có nút "Preview" trước khi xuất bản. Wording "Ngày & Giờ bắt đầu" được đề xuất đổi thành "Ngày & Giờ sự kiện bắt đầu" để tránh hiểu nhầm.

**3\. Khuyến nghị cải thiện (Prioritized Recommendations)**

1. **Làm nổi bật Call-to-Action (CTA):** Thiết kế lại trang chủ/danh sách sự kiện, đưa nút "Tạo sự kiện" (Create Event) thành Primary Button với màu sắc nổi bật ở góc phải màn hình.  
2. **Sửa lỗi Time Picker (Khẩn cấp):** Thay thế component chọn giờ hiện tại bằng component hỗ trợ nhập số từ bàn phím trực tiếp và xử lý lại logic cuộn (scroll logic) cho mốc 00-59.  
3. **Tái cấu trúc UI phần Waitlist & Role:** Gộp nhóm giới hạn người dùng theo Role thành một bảng trực quan (Dòng: Student/Lecturer, Cột: Số lượng, Waitlist Toggle). Thêm tooltip giải thích ngắn gọn tại các icon "i".  
4. **Bổ sung chức năng Preview:** Thêm nút "Save & Preview" bên cạnh nút Publish để người dùng an tâm về định dạng ảnh/text trước khi công khai.

