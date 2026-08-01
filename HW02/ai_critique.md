- Việc ứng dụng AI-First vào domain testing đạt hiệu quả rất cao. Tuy nhiên bên cạnh đó AI cũng mắc phải một số lỗi sai như thiếu một số test case, đưa ra quá nhiều test case nằm ngoài phạm vi của spec dẫn đến việc phải tốn thêm nhiều thời gian để test tương ứng.

- Lượng thông tin mà AI cung cấp rất lớn dẫn đến người đọc có thể chủ động bỏ qua một số phần và mất một số thông tin cốt lõi.

- Mặc dù đã có template cho các mẫu output khác nhau nhưng đã phần AI sẽ tạo ra lệch một chút so với template đã được xây dựng sẵn.

- AI sẽ áp dụng cứng nhắc domain testing skill được build mà bỏ qua mất việc test nhưng feature đơn giản như duplicate cart ở FR-16. Nguyên nhân sai là do kỹ thuật phân miền chỉ phân tách dựa trên spec rõ ràng. Vì vậy khi AI thực hiện theo quy trình sẽ không detect lỗi đc

- Đôi lúc AI sẽ làm sai ý mình ở bước nào đó. Như ở FR-04-FUNC-BUG-001 AI đã hiểu sai ý tôi là thông báo khi nhập mật khẩu ít hơn 9 hiện để cảnh báo, ở đây AI đã tự bịa ra thêm các bước tái hiện mà không thông qua tôi. Vì vậy cách tốt nhất là làm từng step, log ra idea của AI và tiến hành reviews từng step rồi mới chạy tiếp, nếu sai thì sửa lại
