# Requirement 3 - Bộ Test Case Cho Một Sản Phẩm Vật Lý

## Thông tin thiết bị

- Loại thiết bị: Quạt điều hòa (air cooler fan)
- Thương hiệu: VCJ
- Model: JD-800R
- Năm sản xuất: 2021
- Số serial (đã che 4 ký tự giữa): 2021\*\*\*\*00-1

## Danh sách 15 test case (AI generate)

### TC-01

Hạng mục kiểm thử (Module): Khởi động (Power)

Tên Test Case (Test Case Title): Kiểm tra chức năng Bật/Tắt (ON/OFF) bằng nút bấm trên thiết bị.

Điều kiện tiên quyết (Pre-conditions): Quạt đã cắm dây vào nguồn điện ổn định. Khay chứa nước trống.

Các bước thực hiện (Test Steps):

1. Nhấn nút "ON/OFF" lần 1.
2. Nhấn nút "ON/OFF" lần 2.

Kết quả mong đợi (Expected Result):

1. Quạt bật, đèn LED sáng, quạt quay ở mức mặc định.
2. Quạt tắt hoàn toàn, đèn LED tắt.

### TC-02

Hạng mục kiểm thử (Module): Chức năng (Functional)

Tên Test Case (Test Case Title): Kiểm tra thay đổi tốc độ gió (QUẠT 1-2-3).

Điều kiện tiên quyết (Pre-conditions): Quạt đang ở trạng thái ON.

Các bước thực hiện (Test Steps):

1. Nhấn nút "QUẠT" liên tục để chuyển từ mức 1 -> 2 -> 3.

Kết quả mong đợi (Expected Result): Tốc độ gió tăng dần tương ứng với mức hiển thị trên màn hình LED (3 là mạnh nhất).

### TC-03

Hạng mục kiểm thử (Module): Chức năng (Functional)

Tên Test Case (Test Case Title): Kiểm tra tính năng ĐẢO GIÓ (Đảo chiều tự động).

Điều kiện tiên quyết (Pre-conditions): Quạt đang ở trạng thái ON và đang thổi gió.

Các bước thực hiện (Test Steps):

1. Nhấn nút "ĐẢO GIÓ".
2. Quan sát cánh đảo gió bên trong grid.

Kết quả mong đợi (Expected Result): Cánh gió dọc bên trong tự động chuyển động qua lại trái/phải đều đặn.

### TC-04

Hạng mục kiểm thử (Module): Chức năng (Functional)

Tên Test Case (Test Case Title): Kiểm tra chức năng BƠM NƯỚC (Làm mát bằng hơi nước) khi CÓ NƯỚC.

Điều kiện tiên quyết (Pre-conditions): Khay nước đã được đổ đầy đến vạch MAX. Quạt đang ON.

Các bước thực hiện (Test Steps):

1. Nhấn nút "BƠM NƯỚC/LÀM MÁT".
2. Đợi 1-2 phút và kiểm tra tấm làm mát phía sau.

Kết quả mong đợi (Expected Result): Đèn báo làm mát sáng. Bơm hoạt động ổn định, tấm làm mát ướt đều, gió thổi ra mát hơn rõ rệt.

### TC-05

Hạng mục kiểm thử (Module): An toàn (Safety)

Tên Test Case (Test Case Title): Kiểm tra tính năng cảnh báo/bảo vệ khi HẾT NƯỚC (Cực kỳ quan trọng).

Điều kiện tiên quyết (Pre-conditions): Khay nước trống hoàn toàn (hoặc dưới vạch MIN). Quạt đang ON.

Các bước thực hiện (Test Steps):

1. Nhấn nút "BƠM NƯỚC/LÀM MÁT".
2. Quan sát dòng cảnh báo "LƯU Ý: PHẢI ĐẢM BẢO LUÔN CÓ NƯỚC..."

Kết quả mong đợi (Expected Result): Còi cảnh báo kêu (bíp bíp), đèn báo làm mát nhấp nháy hoặc tắt, bơm tự động ngắt để tránh cháy máy bơm.

### TC-06

Hạng mục kiểm thử (Module): Chức năng (Functional)

Tên Test Case (Test Case Title): Kiểm tra chức năng HẸN GIỜ (Timer).

Điều kiện tiên quyết (Pre-conditions): Quạt đang ở trạng thái ON.

Các bước thực hiện (Test Steps):

1. Nhấn nút "HẸN GIỜ" để chọn 1h, 2h...
2. Đợi hết thời gian hẹn giờ.

Kết quả mong đợi (Expected Result): Màn hình hiển thị đúng số giờ hẹn. Quạt tự động tắt hoàn toàn khi hết thời gian.

### TC-07

Hạng mục kiểm thử (Module): Chức năng (Functional)

Tên Test Case (Test Case Title): Kiểm tra chức năng của Điều khiển từ xa (Remote Control) - nếu có.

Điều kiện tiên quyết (Pre-conditions): Remote có sẵn pin hoạt động tốt. Quạt đang cắm điện.

Các bước thực hiện (Test Steps):

1. Đứng cách quạt 3m, bấm các nút ON/OFF, QUẠT, BƠM trên remote.

Kết quả mong đợi (Expected Result): Quạt nhận tín hiệu nhạy, phản hồi chính xác giống như bấm trực tiếp trên bo mạch.

### TC-08

Hạng mục kiểm thử (Module): Giao diện (UI/Display)

Tên Test Case (Test Case Title): Kiểm tra hiển thị của màn hình LED.

Điều kiện tiên quyết (Pre-conditions): Quạt đang cắm điện và hoạt động.

Các bước thực hiện (Test Steps):

1. Thay đổi các chế độ (Tốc độ 3, Hẹn giờ...).
2. Quan sát đèn LED trên bảng điều khiển.

Kết quả mong đợi (Expected Result): Các con số (ví dụ: số 3 trong ảnh) và biểu tượng hiển thị rõ ràng, không bị mất nét, không mờ.

### TC-09

Hạng mục kiểm thử (Module): Hiệu năng (Performance)

Tên Test Case (Test Case Title): Kiểm tra độ ồn của thiết bị (Noise level test).

Điều kiện tiên quyết (Pre-conditions): Quạt đặt trong phòng tiêu chuẩn.

Các bước thực hiện (Test Steps):

1. Bật quạt ở mức tốc độ 1, 2, và 3.
2. Dùng máy đo độ ồn để kiểm tra.

Kết quả mong đợi (Expected Result): Độ ồn nằm trong ngưỡng cho phép của nhà sản xuất (không có tiếng lạch cạch hay tiếng động cơ bất thường).

### TC-10

Hạng mục kiểm thử (Module): Ngoại quan/Vật lý (Hardware)

Tên Test Case (Test Case Title): Kiểm tra độ kín của khay chứa nước (Anti-leakage).

Điều kiện tiên quyết (Pre-conditions): Khay nước được đổ đầy đến vạch MAX.

Các bước thực hiện (Test Steps):

1. Để quạt đứng yên trong 2 giờ.
2. Di chuyển quạt nhẹ nhàng trên sàn bằng bánh xe.

Kết quả mong đợi (Expected Result): Nước không bị rò rỉ, chảy ra sàn nhà từ các khớp nối hoặc đáy khay.

### TC-11

Hạng mục kiểm thử (Module): Vật lý (Hardware)

Tên Test Case (Test Case Title): Kiểm tra bánh xe di chuyển và khóa bánh (Casters).

Điều kiện tiên quyết (Pre-conditions): Quạt có trọng lượng đầy đủ (đã đổ nước).

Các bước thực hiện (Test Steps):

1. Đẩy quạt di chuyển trên bề mặt sàn gạch/gỗ.
2. Gạt khóa bánh xe (nếu có).

Kết quả mong đợi (Expected Result):

1. Bánh xe xoay 360 độ mượt mà, không bị kẹt.
2. Khi khóa, quạt được cố định chắc chắn, không bị trôi.

### TC-12

Hạng mục kiểm thử (Module): Vật lý (Hardware)

Tên Test Case (Test Case Title): Kiểm tra khả năng điều chỉnh hướng gió bằng tay (Cánh gió ngang).

Điều kiện tiên quyết (Pre-conditions): Quạt đang tắt hoặc bật.

Các bước thực hiện (Test Steps):

1. Dùng tay gạt các thanh hướng gió ngang (Grid) lên và xuống.

Kết quả mong đợi (Expected Result): Cánh gió giữ nguyên vị trí sau khi gạt, không bị lỏng lẻo hay tự động rơi xuống.

### TC-13

Hạng mục kiểm thử (Module): Độ tin cậy (Reliability)

Tên Test Case (Test Case Title): Kiểm tra khả năng tự khởi động lại sau khi mất điện (Memory function).

Điều kiện tiên quyết (Pre-conditions): Quạt đang hoạt động ở mức Tốc độ 2, có bật Đảo gió.

Các bước thực hiện (Test Steps):

1. Rút đột ngột phích cắm điện (giả lập mất điện).
2. Cắm điện trở lại và bật quạt.

Kết quả mong đợi (Expected Result): Quạt lưu giữ được thiết lập trước đó hoặc quay về trạng thái an toàn (chờ) tùy theo spec của hãng.

### TC-14

Hạng mục kiểm thử (Module): An toàn (Safety)

Tên Test Case (Test Case Title): Kiểm tra độ cách điện của vỏ máy (Insulation Test).

Điều kiện tiên quyết (Pre-conditions): Quạt đang bật chế độ Bơm nước (độ ẩm cao).

Các bước thực hiện (Test Steps):

1. Dùng bút thử điện/thiết bị đo dòng rò rỉ chạm vào vỏ nhựa và các ốc vít tiếp xúc bên ngoài.

Kết quả mong đợi (Expected Result): Không có hiện tượng rò rỉ điện ra vỏ máy (Dòng rò = 0).

### TC-15

Hạng mục kiểm thử (Module): Độ tin cậy (Reliability)

Tên Test Case (Test Case Title): Kiểm tra vận hành liên tục (Stress/Endurance Test).

Điều kiện tiên quyết (Pre-conditions): Khay nước lớn hoặc được cấp nước liên tục.

Các bước thực hiện (Test Steps):

1. Bật quạt chạy liên tục ở mức công suất cao nhất (Tốc độ 3 + Bơm nước) trong 24 giờ.

Kết quả mong đợi (Expected Result): Động cơ không bị quá nhiệt (overheat), không có mùi khét, thiết bị hoạt động ổn định không tự ngắt.

## Danh sách 3 edge case

### TC-16

Hạng mục kiểm thử (Module): Độ ổn định (Stability)

Tên Test Case (Test Case Title): Kiểm tra phản hồi khi nhấn nút chức năng liên tục (Button Spam Test)

Điều kiện tiên quyết (Pre-conditions): Quạt đang hoạt động ở mức tốc độ 1.

Các bước thực hiện (Test Steps):

1. Nhấn liên tục nút "QUẠT" khoảng 20-30 lần trong vòng 10 giây.
2. Lặp lại thao tác với nút "ĐẢO GIÓ".
3. Quan sát phản hồi của quạt và màn hình LED.

Kết quả mong đợi (Expected Result):

1. Quạt vẫn hoạt động bình thường.
2. Không bị treo hệ thống điều khiển.
3. Màn hình LED không hiển thị lỗi hoặc nhấp nháy bất thường.
4. Thiết bị không tự khởi động lại.

### TC-17

Hạng mục kiểm thử (Module): Edge Case / Reliability

Tên Test Case (Test Case Title): Kiểm tra trạng thái hoạt động sau khi mất điện đột ngột khi đang làm mát bằng hơi nước

Điều kiện tiên quyết (Pre-conditions):

- Khay nước đã được đổ đầy.
- Quạt đang chạy ở mức tốc độ 3.
- Chế độ BƠM NƯỚC và ĐẢO GIÓ đang bật.

Các bước thực hiện (Test Steps):

1. Rút đột ngột dây điện khi quạt đang hoạt động.
2. Chờ khoảng 10 giây.
3. Cắm điện trở lại và bật quạt.
4. Quan sát hoạt động của motor, bơm nước và cánh đảo gió.

Kết quả mong đợi (Expected Result):

1. Quạt khởi động bình thường.
2. Không phát sinh tiếng động lạ từ motor hoặc bơm nước.
3. Chế độ làm mát không bị lỗi hoặc rò nước sau khi cấp điện lại.
4. Hệ thống không bị treo hoặc reset bất thường.

### TC-18

Hạng mục kiểm thử (Module): Edge Case / Usability

Tên Test Case (Test Case Title): Kiểm tra hoạt động khi nhấn nhiều nút chức năng gần như cùng lúc

Điều kiện tiên quyết (Pre-conditions): Quạt đang hoạt động bình thường ở tốc độ 2.

Các bước thực hiện (Test Steps):

1. Nhấn nhanh liên tiếp hai nút chức năng khác nhau (ví dụ: QUẠT + ĐẢO GIÓ hoặc QUẠT + BƠM NƯỚC).
2. Lặp lại thao tác vài lần với tốc độ nhanh.
3. Quan sát phản hồi của thiết bị và màn hình LED.

Kết quả mong đợi (Expected Result):

1. Quạt vẫn phản hồi đúng chức năng.
2. Không bị treo bảng điều khiển.
3. Màn hình LED không hiển thị lỗi bất thường.
4. Thiết bị không tự tắt hoặc reset ngoài ý muốn.
