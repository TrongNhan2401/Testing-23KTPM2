# Kiểm thử phần mềm — CSC13003
## Kiểm thử khả năng sử dụng (Usability Testing)

*Khoa Công nghệ Phần mềm — fit@hcmus*

---

## Nội dung

- Kiểm thử GUI
- Kiểm thử khả năng sử dụng (Usability Testing)

---

# Phần 1: Kiểm thử GUI

## Kiểm thử GUI là gì?

- Viết tắt của **Graphic User Interface** (Giao diện người dùng đồ họa).
- **Định nghĩa:** Kiểm tra các thành phần khác nhau của giao diện người dùng, chẳng hạn như nút bấm, menu, trường nhập liệu và thiết kế trực quan, để xác minh chúng hoạt động đúng như mong đợi.
- **Mục đích:** Mục đích chính của kiểm thử GUI là phát hiện và khắc phục các vấn đề hoặc khiếm khuyết liên quan đến giao diện người dùng. Nó đảm bảo rằng ứng dụng có giao diện hấp dẫn, thân thiện với người dùng và phản hồi nhanh.
- **Xác nhận chức năng:** Dù tập trung vào khía cạnh trực quan và tương tác của phần mềm, kiểm thử GUI cũng kiểm tra chức năng gắn với các thành phần đó có hoạt động đúng hay không. Nó đảm bảo tương tác của người dùng dẫn đến kết quả mong đợi.
- **Các thành phần phổ biến:** Kiểm thử GUI đánh giá các thành phần GUI thường gặp, bao gồm nút bấm, hộp kiểm (checkbox), nút radio, menu thả xuống, trường văn bản, thông báo lỗi, v.v.

## Tại sao kiểm thử GUI lại cần thiết?

- **Tập trung vào người dùng:** Giao diện người dùng là điểm tương tác giữa phần mềm và người dùng cuối. Đảm bảo độ tin cậy và khả năng sử dụng của nó là điều thiết yếu cho một trải nghiệm người dùng tốt.
- **Tính nhất quán về hình ảnh:** Kiểm thử GUI xác minh rằng phần mềm duy trì tính nhất quán về hình ảnh trên các thiết bị và nền tảng khác nhau. Nó giúp ngăn ngừa các vấn đề như tràn chữ, lệch căn chỉnh và đồ họa bị méo.
- **Xác minh chức năng:** Kiểm thử GUI đảm bảo chức năng gắn với các thành phần GUI hoạt động đúng như mong đợi. Nó xác nhận rằng các nút thực hiện đúng hành động, biểu mẫu chấp nhận đầu vào chính xác, và menu dẫn đến các tùy chọn đúng.
- **Khả năng sử dụng và khả năng tiếp cận:** Nó đánh giá khả năng sử dụng của phần mềm, đảm bảo phần mềm trực quan và dễ điều hướng. Kiểm thử GUI cũng kiểm tra các tính năng hỗ trợ tiếp cận (accessibility) để phục vụ người dùng khuyết tật, đáp ứng yêu cầu pháp quy.
- **Uy tín thương hiệu:** Một giao diện người dùng hoàn thiện và không có lỗi phản ánh tích cực lên uy tín thương hiệu. Nó có thể thu hút và giữ chân người dùng, tạo dựng niềm tin và lòng trung thành.
- **Phát hiện lỗi:** Nhiều lỗi nghiêm trọng biểu hiện ở tầng GUI. Kiểm thử GUI giúp phát hiện sớm các vấn đề này trong quá trình phát triển, giảm chi phí sửa chữa về sau.
- **Tuân thủ:** Trong các ngành như y tế và tài chính, việc tuân thủ các tiêu chuẩn pháp quy là điều cần thiết. Kiểm thử GUI đảm bảo phần mềm tuân thủ các hướng dẫn và yêu cầu riêng của ngành.

## Quy trình

```
Xác định kiểm thử → Chuẩn bị kiểm thử → Thực thi kiểm thử

Thiết kế kiểm thử
  ├── Chuẩn bị Script thủ công ─────────────────────► Thực thi thủ công
  ├── Ghi Script tự động ──────┐
  └── Viết mã Script tự động ──┴─► Tích hợp Script tự động ─► Thực thi tự động
```

## Các lỗi GUI phổ biến

- Xác thực dữ liệu
- Giá trị mặc định của trường không đúng
- Xử lý sai khi tiến trình phía server gặp lỗi
- Trường bắt buộc nhưng không được đánh dấu bắt buộc (hoặc ngược lại)
- Truy vấn trả về trường sai
- Tiêu chí tìm kiếm không chính xác
- Thứ tự các trường
- Truy vấn trả về nhiều dòng trong khi chỉ mong đợi một dòng
- Tính "mới" của dữ liệu trên màn hình
- Sự tương ứng giữa đối tượng cửa sổ / trường CSDL
- Tính đúng đắn của modality (chế độ) cửa sổ
- Các lệnh của hệ thống cửa sổ không có sẵn / không hoạt động
- Trạng thái điều khiển có khớp với trạng thái dữ liệu trong cửa sổ không?
- Focus có rơi vào đúng đối tượng cần thiết không?
- Các tùy chọn menu có khớp với trạng thái dữ liệu hoặc chế độ ứng dụng không?
- Hành động của lệnh menu có khớp với trạng thái dữ liệu trong cửa sổ không?
- Đồng bộ nội dung giữa các đối tượng cửa sổ
- Trạng thái của điều khiển có khớp với trạng thái dữ liệu trong cửa sổ không?

## Các mức trong kiểm thử GUI

| Mức | Các loại kiểm thử |
|---|---|
| **Mức thấp (Low Level)** | Kiểm thử theo danh sách kiểm tra (Checklist), Điều hướng (Navigation) |
| **Ứng dụng (Application)** | Phân vùng tương đương, Giá trị biên, Bảng quyết định, Kiểm thử chuyển trạng thái |
| **Tích hợp (Integration)** | Tích hợp Desktop, Giao tiếp Client/Server, Đồng bộ hóa |
| **Phi chức năng (Non-Functional)** | Kiểm thử chịu tải (Soak), Kiểm thử tương thích, Nền tảng/môi trường |

### Mức thấp – Kiểm thử theo danh sách kiểm tra (Checklist testing)

- Tiêu chuẩn GUI
- Tiêu chuẩn ứng dụng
- Bảng màu
- Kiểu chữ (Typography)
- Bố cục và căn chỉnh
- Nhãn
- Thông báo lỗi

### Mức thấp – Kiểm thử điều hướng (Navigation testing)

- **Điều hướng menu chính:** Kiểm thử menu điều hướng chính để đảm bảo người dùng có thể truy cập tất cả các phần chính của ứng dụng.
- **Điều hướng Breadcrumb (vết mục):** Xác minh rằng breadcrumb phản ánh chính xác đường đi của người dùng và cho phép họ quay lại.
- **Liên kết và nút bấm:** Kiểm tra liên kết, nút bấm và các thành phần call-to-action để xác nhận chúng dẫn đến đúng màn hình hoặc hành động mong đợi.
- **Điều hướng biểu mẫu:** Đảm bảo người dùng có thể di chuyển qua biểu mẫu dễ dàng, với thứ tự focus đúng và thông báo xác thực phù hợp.

### Kiểm thử ứng dụng (Application testing)

| Kỹ thuật | Các thành phần cần kiểm thử |
|---|---|
| Phân vùng tương đương và Phân tích giá trị biên | Xác thực đầu vào; Xử lý dựa trên luật đơn giản |
| Bảng quyết định | Logic phức tạp hoặc xử lý dựa trên luật |
| Kiểm thử chuyển trạng thái | Ứng dụng có chế độ/trạng thái ảnh hưởng đến hành vi xử lý; Cửa sổ có sự phụ thuộc giữa các đối tượng |

### Mức tích hợp (Integration Level)

- Kiểm thử tích hợp Desktop
- Kiểm thử giao tiếp Client/Server
- Kiểm thử đồng bộ hóa

### Mức phi chức năng (Non-functional Level)

- Kiểm thử chịu tải (Soak testing)
- Kiểm thử tương thích (Compatibility)
- Kiểm thử nền tảng/môi trường (Platform/Environment)

## Các thách thức trong kiểm thử GUI

**Nhiều nền tảng và thiết bị đa dạng**
- Thách thức: Đảm bảo hiệu năng và giao diện GUI nhất quán trên nhiều hệ điều hành, trình duyệt và thiết bị khác nhau.
- Giải pháp: Kiểm thử chéo trình duyệt và chéo thiết bị một cách toàn diện, kết hợp với các thực hành thiết kế đáp ứng (responsive design).

**Thay đổi UI thường xuyên**
- Thách thức: Các vòng lặp và cập nhật UI nhanh có thể gây khó khăn trong việc bảo trì script kiểm thử.
- Giải pháp: Xây dựng một framework tự động hóa kiểm thử vững chắc, và sử dụng Page Object Model để tách biệt thay đổi UI với script kiểm thử.

**Độ phủ kiểm thử**
- Thách thức: Đảm bảo độ phủ hoàn chỉnh cho tất cả các thành phần GUI và quy trình người dùng.
- Giải pháp: Phát triển một chiến lược kiểm thử toàn diện bao trùm các đường dẫn quan trọng và trường hợp biên.

**Thiết lập dữ liệu kiểm thử và môi trường**
- Thách thức: Tạo và quản lý dữ liệu kiểm thử, môi trường kiểm thử có thể tốn nhiều thời gian.
- Giải pháp: Sử dụng công cụ cung cấp dữ liệu và container hóa để thiết lập môi trường hiệu quả.

**Bản địa hóa và quốc tế hóa**
- Thách thức: Kiểm thử GUI cho nhiều ngôn ngữ, văn hóa và vùng miền khác nhau.
- Giải pháp: Sử dụng các công cụ kiểm thử bản địa hóa và hợp tác với người bản xứ.

**Tích hợp với Backend**
- Thách thức: Phối hợp kiểm thử GUI với các hệ thống backend và API.
- Giải pháp: Triển khai chiến lược kiểm thử end-to-end và sử dụng mock cho các thành phần backend.

## Tự động hóa trong kiểm thử GUI

| Loại kiểm thử | Thủ công so với Tự động |
|---|---|
| Kiểm thử theo danh sách kiểm tra (Checklist) | Thủ công: quy ước ứng dụng / Tự động: trạng thái đối tượng, menu, tính năng chuẩn |
| Điều hướng (Navigation) | Thủ công |
| Phân vùng tương đương, Giá trị biên, Bảng quyết định, Chuyển trạng thái | Thủ công: trường hợp phức tạp / Tự động: trường hợp đơn giản |
| Tích hợp Desktop, Giao tiếp C/S | Thủ công: trường hợp phức tạp / Tự động: trường hợp đơn giản |
| Đồng bộ hóa (Synchronization) | Thủ công |
| Soak testing, Compatibility, Platform/environment | Tự động |

---

# Phần 2: Kiểm thử khả năng sử dụng (Usability Testing)

## Kiểm thử khả năng sử dụng là gì?

- Là quy trình sử dụng những người tham gia đại diện cho nhóm đối tượng mục tiêu để đánh giá khả năng sử dụng của sản phẩm theo các tiêu chí khả dụng cụ thể.
- Kiểm thử khả năng sử dụng không đảm bảo sản phẩm sẽ thành công, nhưng nó ít nhất phải xác định được các vấn đề chính.

## Các thành phần cơ bản

1. Phát triển các phát biểu vấn đề cụ thể, kế hoạch kiểm thử và mục tiêu
2. Sử dụng mẫu đại diện của người dùng cuối
3. Mô phỏng môi trường làm việc thực tế
4. Quan sát người dùng cuối trong quá trình sử dụng hoặc đánh giá sản phẩm
5. Thu thập các phép đo định lượng và định tính
6. Phân tích kết quả và đưa ra khuyến nghị

## Các loại kiểm thử khả năng sử dụng

### Khám phá (Exploratory)
- Thực hiện sớm trong quy trình
- Có thể dựa trên bất kỳ dạng nào của GUI (phác thảo, wireframe, v.v.)
- Đánh giá khái niệm thiết kế cơ bản, ban đầu
- Thực hiện các tác vụ đại diện ở chế độ "nông" (shallow)
- Phương pháp kiểm thử không chính thức, có nhiều tương tác
- Thảo luận các khái niệm cấp cao

### Đánh giá (Assessment)
- Thực hiện sau khi các khái niệm nền tảng đã hoàn thành
- Đánh giá khả năng sử dụng của các thao tác cấp thấp
- Người dùng thực sự thực hiện một tập các tác vụ được định nghĩa rõ ràng
- Ít tương tác hơn với người giám sát kiểm thử
- Các phép đo định lượng được thu thập

### Thẩm định (Validation)
- Thực hiện vào giai đoạn cuối của chu trình phát triển, gần thời điểm phát hành
- Mục tiêu là chứng nhận khả năng sử dụng của sản phẩm — "bảo hiểm rủi ro" trước khi ra mắt một sản phẩm kém
- Thường là lần đầu tiên toàn bộ sản phẩm được kiểm thử (bao gồm phần trợ giúp và tài liệu)
- Đánh giá theo một tiêu chuẩn hoặc chuẩn mực khả dụng đã được xác định trước
- Tiêu chuẩn đến từ các lần kiểm thử trước, thông tin cạnh tranh, marketing, v.v.
- Các kiểm thử định lượng rất cụ thể
- Có thể thiết lập tiêu chuẩn cho các sản phẩm trong tương lai
- Cũng có thể được thực hiện bởi khách hàng dùng thử (beta)

### So sánh (Comparison)
- Có thể thực hiện ở bất kỳ thời điểm nào trong chu trình phát triển
- So sánh các phương án bằng các phép đo khách quan
- Có thể không chính thức hoặc chính thức, tùy thuộc vào thời điểm thực hiện
- Thường thì phương án tốt nhất trong các thiết kế thay thế sẽ được kết hợp lại

## Môi trường kiểm thử

- Thiết lập phòng đơn giản
  - Người quan sát/giám sát ở gần người đánh giá
  - Người quan sát tách rời khỏi người đánh giá
- Phòng quan sát điện tử
- Phòng thí nghiệm khả dụng cổ điển, tinh vi
- Phòng thí nghiệm di động

**Ví dụ bố trí phòng thí nghiệm:** Phòng quan sát (người quan sát + màn hình theo dõi) → Phòng đánh giá (người dùng, camera, khu vực họp) → Phòng điều khiển (bộ điều khiển video, bàn âm thanh, chuyên gia phân tích, quay phim)

## Định dạng kế hoạch kiểm thử điển hình

- **Mục đích (Purpose):** mục đích chính của kiểm thử là gì
- **Phát biểu vấn đề (Problem statement):** các câu hỏi cụ thể bạn muốn được giải quyết
- **Kế hoạch kiểm thử và mục tiêu (Test plan and objectives):** các tác vụ người dùng sẽ thực hiện
- **Hồ sơ người dùng (User profile):** ai sẽ là người dùng
- **Phương pháp và thiết kế kiểm thử (Method and test design):** bạn sẽ quan sát như thế nào, thu thập dữ liệu ra sao, v.v.
- **Môi trường và thiết bị kiểm thử (Test environment and equipment)**
- **Vai trò của người giám sát kiểm thử (Test monitor role)**
- **Các phép đo đánh giá và dữ liệu cần thu thập (Evaluation measures and data to be collected):** cách thu thập phản hồi và cách đánh giá
- **Báo cáo (Report):** nội dung báo cáo cuối cùng

## Lựa chọn tác vụ để đánh giá

- Các tác vụ cần đánh giá là những chức năng mà người dùng muốn thực hiện với sản phẩm. Trọng tâm là góc nhìn của người dùng về tác vụ, **không phải** các thành phần/chi tiết được dùng để hiện thực hóa nó. Ví dụ:
  - Tạo và lưu trữ tài liệu
  - Nhập nhiều hình ảnh
  - Tìm tài liệu phù hợp
- Mục tiêu là gián tiếp bộc lộ các lỗi khả dụng bằng cách yêu cầu người dùng thực hiện các tác vụ điển hình và **không** hướng dẫn họ chính xác cách thực hiện.
- Chọn các tác vụ chính và được thực hiện thường xuyên nhất.
- Tác vụ phải cụ thể và có thể đo lường được (định lượng hoặc định tính).

### Ví dụ các thành phần của tác vụ

| TÁC VỤ | MÔ TẢ |
|---|---|
| Tác vụ | Nạp giấy vào máy photocopy |
| Trạng thái máy | Khay giấy trống |
| Tiêu chí hoàn thành thành công | Giấy được nạp đúng cách |
| Chuẩn mực | Hoàn thành trong 1 phút |

## Lựa chọn người đánh giá và nhóm kiểm thử

- Người đánh giá phải đại diện cho người dùng mục tiêu.
- Các nhóm độc lập hoặc thiết kế trong chủ thể (nhưng cần cẩn thận để tránh cho người dùng thực hiện cùng một bài kiểm thử, vì điều này sẽ làm sai lệch kết quả).
- Số lượng người kiểm thử phải đầy đủ.
- Cung cấp động lực và phần thưởng.

## Phép đo và Bảng câu hỏi

- **Dữ liệu hiệu năng (Performance data):** các phép đo hành vi người dùng như tỉ lệ lỗi, số lần truy cập trợ giúp, thời gian thực hiện tác vụ, v.v.
  - Thường có thể và nên được đo lường một cách khách quan và tự động.
- **Dữ liệu sở thích (Preference data):** các phép đo ý kiến, quá trình suy nghĩ của người dùng như xếp hạng, câu trả lời cho câu hỏi, nhận xét, v.v.
  - Sử dụng bảng câu hỏi.

### Một số phép đo hiệu năng (đo những gì có thể đo được)

- Thời gian hoàn thành mỗi tác vụ
- Số lượng và tỉ lệ phần trăm các tác vụ hoàn thành thành công/không thành công
- Thời gian cần thiết để truy cập thông tin
- Số lần chọn sai
- Số lỗi
- Thời gian hệ thống phản hồi
- ...

Dữ liệu nên được thu thập tự động hoặc thủ công một cách khách quan.

### Bảng câu hỏi (cho dữ liệu sở thích)

**Thang Likert**

Tôi thấy GUI dễ sử dụng (chọn một)
- Hoàn toàn không đồng ý
- Không đồng ý
- Không đồng ý cũng không phản đối
- Đồng ý
- Hoàn toàn đồng ý

(cũng có thể gán số từ -2 đến 2)

**Phân biệt ngữ nghĩa (Semantic differentials)**

Tôi thấy menu File Open (khoanh một): Đơn giản  3 2 1 0 1 2 3  Phức tạp

**Câu hỏi điền vào chỗ trống (Fill in)**

Tôi thấy những khía cạnh sau của GUI đặc biệt dễ sử dụng (liệt kê 0–4 khía cạnh): ____________

**Hộp kiểm (Check-box)**

Vui lòng đánh dấu phát biểu mô tả đúng nhất việc bạn sử dụng chức năng kiểm tra chính tả:
- Tôi luôn sử dụng kiểm tra chính tả
- Tôi chỉ sử dụng kiểm tra chính tả khi cần
- Tôi không bao giờ sử dụng kiểm tra chính tả

**Câu hỏi phân nhánh (Branching)**

Bạn có muốn sử dụng tìm kiếm nâng cao không?
- KHÔNG (bỏ qua đến câu 19)
- CÓ (tiếp tục) → Bạn muốn loại tìm kiếm nâng cao nào? (chọn một): Boolean / Liên quan (Relevance)

## Tóm tắt kết quả hiệu năng

- **Dữ liệu hiệu năng**
  - Thời gian hoàn thành trung bình
  - Thời gian hoàn thành trung vị
  - Khoảng (cao và thấp)
  - Độ lệch chuẩn của thời gian hoàn thành
  - Thống kê thời gian phản hồi hệ thống
- **Độ chính xác của tác vụ**
  - % người dùng hoàn thành tác vụ trong thời gian quy định
  - % người dùng hoàn thành tác vụ bất kể thời gian
  - Tương tự như trên, có sự hỗ trợ
  - Tỉ lệ lỗi trung bình

## Tóm tắt kết quả sở thích

- **Đối với câu hỏi có lựa chọn giới hạn:** Đếm số người tham gia chọn mỗi lựa chọn (số lượng và %). Đối với thang Likert hoặc phân biệt ngữ nghĩa, cung cấp điểm trung bình nếu có đủ người đánh giá.
- **Đối với câu hỏi tự do:** Liệt kê câu hỏi và nhóm câu trả lời thành các danh mục, đồng thời phân loại thành câu trả lời tích cực và tiêu cực.
- **Đối với nhận xét tự do:** Liệt kê và nhóm chúng ở cuối báo cáo.

## Phân tích dữ liệu

- Xác định và tập trung vào các tác vụ **không vượt qua kiểm thử** hoặc có vấn đề đáng kể.
- Xác định lỗi và khó khăn của người dùng.
- Xác định nguồn gốc lỗi.
- Ưu tiên các vấn đề theo mức độ nghiêm trọng = mức độ nghiêm trọng VÀ xác suất xảy ra.
- Phân tích sự khác biệt giữa các nhóm (nếu có).
- Cung cấp khuyến nghị ở cuối.

### Phát biểu vấn đề và dữ liệu hiệu năng cần thu thập

| Phát biểu vấn đề | Dữ liệu hiệu năng thu thập |
|---|---|
| Hướng dẫn (tutorial) hiệu quả đến mức nào | So sánh tỉ lệ lỗi của người dùng đã sử dụng và chưa sử dụng nó |
| Thực hiện tác vụ X dễ đến mức nào | Tỉ lệ lỗi HOẶC số bước cần thiết |

*Lưu ý: đây chỉ là đo lường dữ liệu hiệu năng. Bạn cũng cần đánh giá dữ liệu sở thích của người dùng.*

### Phát biểu vấn đề và dữ liệu sở thích cần thu thập

| Phát biểu vấn đề | Dữ liệu sở thích thu thập |
|---|---|
| Hướng dẫn (tutorial) hiệu quả đến mức nào | Yêu cầu người dùng đánh giá từ rất không hiệu quả đến rất hiệu quả (thang Likert hoặc phân biệt ngữ nghĩa) + nhận xét tự do |
| Thực hiện tác vụ X dễ đến mức nào | Yêu cầu người dùng đánh giá từ rất dễ đến rất khó (thang Likert hoặc phân biệt ngữ nghĩa) + nhận xét tự do |

### Liên hệ phát biểu vấn đề với tác vụ

| Phát biểu vấn đề | Tác vụ |
|---|---|
| Hướng dẫn (tutorial) hiệu quả đến mức nào | Nhóm A: Nhập hình ảnh không dùng tutorial. Nhóm B: Tương tự nhưng dùng tutorial trước |
| Tạo máy ảo (Virtual Machine) dễ đến mức nào | Tạo máy ảo với các thuộc tính "này" bằng New VM Wizard |

### Ví dụ các thành phần của tác vụ

| TÁC VỤ | MÔ TẢ |
|---|---|
| Tác vụ | Tạo VM bằng New VM Wizard |
| Trạng thái máy | VMware Workstation vừa được nạp |
| Tiêu chí hoàn thành thành công | VM hoạt động đã được tạo |
| Chuẩn mực | Hoàn thành trong 30 giây |

---

## Hỏi & Đáp
