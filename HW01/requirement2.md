# Requirement 2 – 20 Software Defects 2022–2026

## PHẦN 1: 5 LỖI PHẦN MỀM LIÊN QUAN ĐẾN AI / LLM

### 1. Sự cố rò rỉ dữ liệu người dùng của ChatGPT (OpenAI) - 2023

- Nguồn (Source Link): [https://openai.com/index/march-20-chatgpt-outage/](https://openai.com/index/march-20-chatgpt-outage/)
- Mô tả lỗi (Description): Một lỗi "race condition" (tình trạng tranh chấp dữ liệu) trong thư viện mã nguồn mở redis-py đã khiến hệ thống gán nhầm phiên làm việc (session). Kết quả là người dùng này có thể nhìn thấy tiêu đề lịch sử trò chuyện, tin nhắn đầu tiên của cuộc hội thoại mới, và thông tin thanh toán của người dùng khác.
- Mức độ nghiêm trọng (Severity): Nghiêm trọng (High).
- Hậu quả (Consequences): Khoảng 1.2% số người dùng ChatGPT Plus đang hoạt động trong khung giờ đó bị lộ họ tên, email, địa chỉ thanh toán, 4 số cuối và hạn hết hạn của thẻ tín dụng. OpenAI đã phải tạm đóng cửa ChatGPT trong vài giờ để khắc phục, và sự việc này khiến cơ quan bảo vệ dữ liệu Ý tạm thời cấm ChatGPT tại nước này.
- Giải pháp (Solution): OpenAI đã vá lỗi thư viện redis-py, tăng cường kiểm tra tính cô lập của session trên cụm bộ nhớ đệm (cache clustering), và bổ sung cơ chế giám sát log để phát hiện sớm các bất thường tương tự.

### 2. Hệ thống AI tuyển dụng của McDonald's làm lộ dữ liệu ứng viên - 2025

- Nguồn (Source Link): [https://www.testdevlab.com/blog/software-bugs-2025](https://www.testdevlab.com/blog/software-bugs-2025)
- Mô tả lỗi (Description): Bot tuyển dụng tích hợp AI được McDonald's sử dụng để sàng lọc và tương tác với các ứng viên xin việc gặp một lỗi logic nghiêm trọng trong phân quyền API. Khi xử lý hàng nghìn hồ sơ đồng thời, hệ thống phân bổ sai mã định danh Token, cho phép người ngoài truy cập không cần xác thực vào cơ sở dữ liệu ứng viên.
- Mức độ nghiêm trọng (Severity): Nghiêm trọng (High).
- Hậu quả (Consequences): Hàng ngàn dữ liệu nhạy cảm của các ứng viên (bao gồm tên tuổi, số điện thoại, email, lịch sử làm việc cũ và căn cước) bị phơi bày công khai trên Internet, tạo ra rủi ro lớn về lừa đảo (phishing) và vi phạm đạo luật GDPR.
- Giải pháp (Solution): McDonald's cùng bên thứ ba phát triển ứng dụng đã phải hạ hệ thống bot xuống, thiết lập lại toàn bộ cấu trúc xác thực API Gateway, triển khai cơ chế kiểm soát truy cập dựa trên vai trò (RBAC) nghiêm ngặt hơn và tiến hành mã hóa dữ liệu ứng viên khi lưu trữ (at rest).

### 3. Chatbot AI của Air Canada đưa ra thông tin sai lệch về chính sách hoàn tiền - 2024

- Nguồn (Source Link): [https://www.theguardian.com/world/2024/feb/16/air-canada-chatbot-lawsuit](https://www.theguardian.com/world/2024/feb/16/air-canada-chatbot-lawsuit)
- Mô tả lỗi (Description): Hiện tượng "ảo tưởng" (hallucination) của mô hình ngôn ngữ lớn. Chatbot AI hỗ trợ khách hàng trên website của Air Canada đã tự tạo ra một quy định hoàn tiền hoàn toàn không có thật, hướng dẫn khách hàng mua vé trước rồi nộp đơn đòi giảm giá tang chế (bereavement fare) sau, dù chính sách thực tế của hãng không cho phép điều này.
- Mức độ nghiêm trọng (Severity): Trung bình (Medium) - Về mặt kỹ thuật, nhưng gây rủi ro pháp lý cao cho doanh nghiệp.
- Hậu quả (Consequences): Hãng hàng không bị hành khách khởi kiện ra tòa. Tòa án Canada đã phán quyết chống lại Air Canada, tuyên bố hãng phải chịu trách nhiệm về thông tin do chính chatbot của mình đưa ra và buộc phải bồi thường tiền cho hành khách.
- Giải pháp (Solution): Air Canada đã phải gỡ bỏ chatbot cũ, thắt chặt kỹ thuật RAG (Retrieval-Augmented Generation) để giới hạn câu trả lời của AI chỉ nằm trong bộ tài liệu chính thức được phê duyệt, đồng thời thêm điều khoản miễn trừ và các cảnh báo rõ ràng hơn cho khách hàng.

### 4. Hệ thống AI gọi món của Taco Bell gặp lỗi điều kiện biên (Edge Case) - 2025

- Nguồn (Source Link): [https://www.testdevlab.com/blog/software-bugs-2025](https://www.testdevlab.com/blog/software-bugs-2025)
- Mô tả lỗi (Description): Hệ thống nhận diện giọng nói và tự động lên đơn bằng AI (Drive-thru AI) tại các cửa hàng Taco Bell gặp lỗi xử lý bộ nhớ khi gặp phải các tình huống âm thanh biên (edge cases) - bao gồm tiếng ồn động cơ quá lớn kết hợp với giọng địa phương đặc biệt của khách hàng. Việc này làm tràn bộ đệm xử lý chuỗi (string buffer), khiến ứng dụng lõi bị treo.
- Mức độ nghiêm trọng (Severity): Trung bình (Medium).
- Hậu quả (Consequences): Hệ thống gọi món tự động tại hàng loạt cửa hàng Drive-thru bị sập hoàn toàn (crash), gây tắc nghẽn giao thông tại các lối vào cửa hàng, buộc nhân viên phải quay lại ghi đơn bằng tay và làm giảm doanh thu nghiêm trọng trong ngày xảy ra sự cố.
- Giải pháp (Solution): Đội ngũ kỹ thuật đã tối ưu hóa mô hình lọc nhiễu âm thanh đầu vào, thêm các khối lệnh try-catch để bắt ngoại lệ (exception handling) đối với các chuỗi văn bản dịch lỗi từ giọng nói và bổ sung cơ chế tự động chuyển hướng cuộc gọi sang nhân viên thật (failover to human) ngay khi hệ thống AI có dấu hiệu quá tải.

### 5. Chatbot AI của Thành phố New York (MyCity) tư vấn vi phạm pháp luật - 2024

- Nguồn (Source Link): [https://themarkup.org/artificial-intelligence/2024/03/29/nycs-ai-chatbot-tells-businesses-to-break-the-law](https://themarkup.org/artificial-intelligence/2024/03/29/nycs-ai-chatbot-tells-businesses-to-break-the-law)
- Mô tả lỗi (Description): Chatbot AI được chính quyền New York triển khai để giúp đỡ các chủ doanh nghiệp nhỏ đã không được huấn luyện (fine-tune) và thiết lập hàng rào bảo vệ (guardrails) đúng cách về mặt luật pháp địa phương. Khi được hỏi, AI này liên tục đưa ra các lời khuyên sai lệch, xúi giục doanh nghiệp thực hiện các hành vi bất hợp pháp như giữ lại tiền tip của nhân viên hoặc phân biệt đối xử trong thuê nhà.
- Mức độ nghiêm trọng (Severity): Trung bình đến Nghiêm trọng (Medium-High).
- Hậu quả (Consequences): Gây làn sóng tranh cãi lớn, đe dọa đẩy nhiều chủ doanh nghiệp vào vòng lao lý vì làm theo lời khuyên của chính quyền. Uy tín công nghệ của thành phố bị ảnh hưởng nặng nề.
- Giải pháp (Solution): Chính quyền thành phố bổ sung thêm hàng loạt cảnh báo lớn trên giao diện thông báo rằng AI không thay thế cho lời khuyên pháp lý, đồng thời cập nhật lại bộ lọc prompt (prompt filtering) và gia cố cơ sở tri thức để kiểm soát chặt chẽ các câu trả lời liên quan đến luật pháp.

## PHẦN 2: 15 LỖI PHẦN MỀM / SỰ CỐ HỆ THỐNG TRUYỀN THỐNG

### 6. Sự cố sập mạng toàn cầu do bản cập nhật lỗi của CrowdStrike - 2024

- Nguồn (Source Link): [https://www.crowdstrike.com/en-us/blog/falcon-content-update-preliminary-post-incident-report/](https://www.crowdstrike.com/en-us/blog/falcon-content-update-preliminary-post-incident-report/)
- Mô tả lỗi (Description): CrowdStrike phát hành một bản cập nhật cấu hình cấu trúc (Channel File 291) cho phần mềm bảo mật Falcon Sensor trên Windows. Bản cập nhật này chứa dữ liệu không hợp lệ nhưng đã vượt qua trình kiểm thử tự động do một lỗi logic trong phần mềm xác thực nội bộ. Khi Falcon Sensor nạp file này, nó gây ra lỗi đọc vùng nhớ ngoài phạm vi (out-of-bounds memory read), dẫn đến lỗi trang không hợp lệ ở cấp hạt nhân (kernel mode).
- Mức độ nghiêm trọng (Severity): Thảm họa (Critical / Catastrophic).
- Hậu quả (Consequences): Khoảng 8.5 triệu máy tính và máy chủ chạy Windows trên toàn cầu bị màn hình xanh chết chóc (BSOD) và rơi vào vòng lặp khởi động lại liên tục. Sân bay, bệnh viện, ngân hàng, hệ thống 911 và các tập đoàn lớn bị tê liệt hoàn toàn, gây thiệt hại kinh tế ước tính hàng chục tỷ USD.
- Giải pháp (Solution): CrowdStrike phát hành tệp sửa lỗi để ghi đè, hướng dẫn người dùng vào chế độ Safe Mode để xóa file lỗi thủ công. Hãng cam kết thay đổi quy trình phát hành: kiểm thử nghiêm ngặt hơn, triển khai cập nhật theo từng giai đoạn (canary deployment) thay vì đẩy đồng loạt toàn cầu.

### 7. Lỗi cấu hình tường lửa WAF của Cloudflare làm sập hàng loạt website - 2025

- Nguồn (Source Link): [https://www.testdevlab.com/blog/software-bugs-2025](https://www.testdevlab.com/blog/software-bugs-2025)
- Mô tả lỗi (Description): Một lỗi phần mềm xuất hiện trong quá trình triển khai cấu hình định kỳ cho hệ thống Tường lửa ứng dụng Web (WAF) của Cloudflare. Sự thay đổi này vô tình tạo ra một vòng lặp kiểm tra regex vô hạn, chiếm dụng 100% tài nguyên CPU trên các máy chủ Edge.
- Mức độ nghiêm trọng (Severity): Nghiêm trọng (High).
- Hậu quả (Consequences): Đánh sập và làm gián đoạn truy cập của hàng nghìn dịch vụ Internet lớn phụ thuộc vào Cloudflare như X (Twitter), ChatGPT, Discord, Canva, và Spotify trên quy mô toàn cầu trong vài giờ.
- Giải pháp (Solution): Các kỹ sư Cloudflare đã phải tiến hành rollback (hoàn tác) cấu hình WAF về phiên bản trước đó ngay lập tức, sửa lại biểu thức chính quy (regex) bị lỗi và tách biệt các luồng xử lý để tránh việc một lỗi cấu hình có thể lan rộng ra toàn bộ hạ tầng Edge toàn cầu.

### 8. Lỗi hệ thống thông báo bay NOTAM của Cục Hàng không Liên bang Mỹ (FAA) - 2023

- Nguồn (Source Link): [https://en.wikipedia.org/wiki/2023_FAA_system_outage](https://en.wikipedia.org/wiki/2023_FAA_system_outage)
- Mô tả lỗi (Description): Các nhân viên kỹ thuật trong quá trình bảo trì định kỳ đã vô tình làm hỏng (corrupt) tệp tin trong cơ sở dữ liệu chính của hệ thống NOTAM (Notice to Air Missions) - hệ thống gửi thông tin an toàn thiết yếu cho phi công. Do một lỗi logic trong mã nguồn đồng bộ, tệp tin bị hỏng này tiếp tục được sao chép trực tiếp sang cả hệ thống dự phòng (backup system).
- Mức độ nghiêm trọng (Severity): Nghiêm trọng (High).
- Hậu quả (Consequences): FAA phải ra lệnh đình chỉ bay (Ground stop) đối với tất cả các chuyến bay nội địa tại Mỹ lần đầu tiên kể từ sau sự kiện 11/9. Hơn 11.000 chuyến bay bị hoãn hoặc hủy bỏ, gây hỗn loạn giao thông hàng không Bắc Mỹ.
- Giải pháp (Solution): FAA tiến hành khôi phục lại cơ sở dữ liệu từ một bản sao lưu sạch cũ hơn, cô lập quy trình đồng bộ giữa hệ thống chính và phụ để tránh lỗi lan truyền trực tiếp, và tiến hành hiện đại hóa mã nguồn của hệ thống NOTAM lâu đời này.

### 9. Sự cố sập mạng di động toàn quốc của AT&T - 2024

- Nguồn (Source Link): [https://www.benton.org/headlines/february-22-2024-att-mobility-network-outage-report-and-findings](https://www.benton.org/headlines/february-22-2024-att-mobility-network-outage-report-and-findings)
- Mô tả lỗi (Description): Trong quá trình triển khai thay đổi mạng lưới, một cấu hình thiết bị bị áp dụng sai quy trình kỹ thuật (lỗi cấu hình thiết bị). Cấu hình lỗi này đã được đẩy thẳng lên mạng lưới lõi, gây sập toàn bộ dịch vụ thoại và dữ liệu 5G, chặn các thiết bị đăng ký vào mạng.
- Mức độ nghiêm trọng (Severity): Đặc biệt nghiêm trọng (Critical / High).
- Hậu quả (Consequences): Kéo dài ít nhất 12 giờ trên toàn bộ 50 bang của Mỹ, Washington D.C., Puerto Rico và Quần đảo Virgin. Sự cố ảnh hưởng tới hơn 125 triệu thiết bị, chặn hơn 92 triệu cuộc gọi thông thường và hơn 25.000 cuộc gọi khẩn cấp 911. Mạng lưới an ninh phản ứng nhanh (FirstNet) cũng bị mất tín hiệu hoàn toàn.
- Giải pháp (Solution): AT&T đã mất 12 tiếng để hoàn tác cấu hình, khôi phục lại các router trung tâm. Sau đó, họ đã siết chặt quy trình phê duyệt thay đổi phần mềm cốt lõi và tặng 5 USD bồi thường cho các tài khoản bị ảnh hưởng.

### 10. Sự cố sập mạng dịch vụ đám mây Microsoft Azure - 2023

- Nguồn (Source Link): [https://www.pingdom.com/outages/microsoft-outage-jan.2023-recap/](https://www.pingdom.com/outages/microsoft-outage-jan.2023-recap/)
- Mô tả lỗi (Description): Một bản cập nhật cấu hình mạng diện rộng (WAN) của Microsoft chứa lỗi script đã thay đổi cấu trúc định tuyến nội bộ giữa các trung tâm dữ liệu. Lỗi này tạo ra hiện tượng bão gói tin (packet storm) khiến các thiết bị định tuyến của Azure bị quá tải tài nguyên.
- Mức độ nghiêm trọng (Severity): Nghiêm trọng (High).
- Hậu quả (Consequences): Làm sập hàng loạt dịch vụ đám mây quan trọng bao gồm Microsoft Teams, Outlook, Microsoft 365, và Azure SQL trên khắp các khu vực Châu Mỹ, Châu Âu và Châu Á - Thái Bình Dương, làm gián đoạn công việc của hàng triệu nhân viên văn phòng.
- Giải pháp (Solution): Microsoft tự động kích hoạt cơ chế cô lập mạng lỗi, chuyển hướng lưu lượng qua các tuyến cáp quang an toàn và thực hiện sửa đổi thuật toán tự động cập nhật WAN để kiểm tra tính hợp lệ của định tuyến trước khi áp dụng diện rộng.

### 11. Sự cố dừng đồng thuận lớp Heimdall của mạng Polygon - 2022

- Nguồn (Source Link): [https://cryptonews.com.au/news/polygon-employs-temporary-hotfix-as-upgrade-causes-11-hour-outage-94046/](https://cryptonews.com.au/news/polygon-employs-temporary-hotfix-as-upgrade-causes-11-hour-outage-94046/)
- Mô tả lỗi (Description): Một lỗi phần mềm xuất hiện sau khi mạng Polygon tiến hành nâng cấp hệ thống. Lỗi này làm ảnh hưởng đến lớp đồng thuận Heimdall, khiến các validator (máy xác thực) bị phân tách và chạy trên các phiên bản blockchain khác nhau. Do không thể đạt được mức đồng thuận $2/3$ theo cơ chế Tendermint, hệ thống đã rơi vào trạng thái mất đồng thuận và ngừng hoạt động.
- Mức độ nghiêm trọng (Severity): Nghiêm trọng (High).
- Hậu quả (Consequences): Mạng Polygon bị tê liệt hoàn toàn, không thể tạo ra khối mới (block production outage) trong suốt gần 11 tiếng đồng hồ. Tất cả các giao dịch và hoạt động của người dùng trên mạng lưới bị đóng băng tạm thời.
- Giải pháp (Solution): Đội ngũ kỹ sư của Polygon đã phải phát hành một bản vá lỗi khẩn cấp (hotfix) cho các validator để khắc phục sự cố và khôi phục lại trạng thái hoạt động của mạng lưới (đồng thời tạm khóa tính năng Polygon Bridge cho đến khi có bản cập nhật hoàn chỉnh).

### 12. Lỗi tràn bộ nhớ bộ đệm của thư viện OpenSSL (CVE-2022-3602) - 2022

- Nguồn (Source Link): [https://openssl-library.org/news/secadv/20221101.txt](https://openssl-library.org/news/secadv/20221101.txt)
- Mô tả lỗi (Description): Lỗi tràn bộ đệm mã hóa (Buffer Overflow) trong việc xác thực chứng chỉ X.509. Khi mã nguồn OpenSSL xử lý một địa chỉ email chứa ký tự quốc tế (Punycode) được định cấu hình sai trong chứng chỉ bảo mật, nó có thể ghi đè lên 4 byte dữ liệu trên ngăn xếp (stack).
- Mức độ nghiêm trọng (Severity): Cao (High) - Ban đầu được đánh giá là Thảm họa (Critical).
- Hậu quả (Consequences): Lỗ hổng này đe dọa hàng triệu máy chủ web, thiết bị định tuyến có sử dụng OpenSSL 3.0.x trên thế giới, có thể bị tin tặc khai thác để gây lỗi từ chối dịch vụ (DoS/Crash hệ thống) hoặc thực thi mã từ xa (RCE).
- Giải pháp (Solution): Đội ngũ OpenSSL đã nhanh chóng phát hành phiên bản vá lỗi OpenSSL 3.0.7, loại bỏ đoạn mã xử lý độ dài bộ đệm sai sót và kêu gọi toàn thế giới cập nhật hệ thống ngay lập tức.

### 13. Lỗi phần mềm hệ thống liên lạc khẩn cấp Optus (Úc) - 2025

- Nguồn (Source Link): [https://www.testdevlab.com/blog/software-bugs-2025](https://www.testdevlab.com/blog/software-bugs-2025)
- Mô tả lỗi (Description): Lỗi không tương thích định dạng dữ liệu (Data format mismatch) sau một đợt nâng cấp firmware định kỳ trên các tổng đài lõi của nhà mạng Optus. Sự cố này khiến hệ thống không thể phân tích cú pháp các gói tin định vị vị trí cuộc gọi khẩn cấp được gửi từ máy điện thoại của người dân.
- Mức độ nghiêm trọng (Severity): Nghiêm trọng (High).
- Hậu quả (Consequences): Hệ thống kết nối cuộc gọi khẩn cấp (Triple Zero - 000) tại Úc bị tê liệt một phần, khiến người dân gặp tai nạn hoặc tình huống nguy hiểm không thể kết nối được với cảnh sát hoặc xe cứu thương, đe dọa trực tiếp đến tính mạng con người.
- Giải pháp (Solution): Nhân viên kỹ thuật của Optus tiến hành cấu hình hạ cấp (rollback) firmware về phiên bản cũ an toàn, bổ sung các hàm chuẩn hóa định dạng dữ liệu đầu vào (data sanitization) trước khi chuyển tiếp gói tin tới hệ thống tổng đài khẩn cấp.

### 14. Lỗi đóng băng ứng dụng ngân hàng trực tiếp của Barclays vào ngày nhận lương - 2025

- Nguồn (Source Link): [https://www.testdevlab.com/blog/software-bugs-2025](https://www.testdevlab.com/blog/software-bugs-2025)
- Mô tả lỗi (Description): Một lỗi rò rỉ bộ nhớ (memory leak) xảy ra trong module xử lý giao dịch theo lô (batch processing) mới được cập nhật của ngân hàng Barclays. Khi số lượng yêu cầu truy vấn số dư và chuyển tiền tăng đột biến vào ngày trả lương cuối tháng, lượng bộ nhớ RAM không được giải phóng kịp thời đã làm cạn kiệt tài nguyên máy chủ.
- Mức độ nghiêm trọng (Severity): Trung bình đến Cao (Medium-High).
- Hậu quả (Consequences): Hàng triệu khách hàng của Barclays tại Anh bị khóa và không thể đăng nhập vào ứng dụng di động cũng như trang web ngân hàng trực tuyến đúng vào ngày họ nhận lương, gây phẫn nộ lớn và làm đình trệ các khoản thanh toán hóa đơn sinh hoạt của người dân.
- Giải pháp (Solution): Kỹ sư hệ thống thực hiện khởi động lại khẩn cấp các cụm máy chủ bị treo, tối ưu hóa các dòng lệnh giải phóng bộ nhớ (garbage collection) và tăng cường kiến trúc tự động mở rộng (auto-scaling) để chịu tải tốt hơn cho các kỳ trả lương tiếp theo.

### 15. Sự cố sập hệ thống bán hàng Shopify trong ngày Cyber Monday - 2025

- Nguồn (Source Link): [https://www.testdevlab.com/blog/software-bugs-2025](https://www.testdevlab.com/blog/software-bugs-2025)
- Mô tả lỗi (Description): Lỗi khóa chết dữ liệu (Deadlock) trong hệ thống quản lý cơ sở dữ liệu phân tán của Shopify. Khi hàng triệu người dùng cùng lúc bấm nút thanh toán mua hàng, các tiến trình (threads) ghi dữ liệu vào bảng kiểm tra kho hàng (inventory table) tranh chấp lẫn nhau và rơi vào trạng thái chờ nhau vô hạn.
- Mức độ nghiêm trọng (Severity): Nghiêm trọng (High).
- Hậu quả (Consequences): Toàn bộ cổng thanh toán và trang quản trị của hàng ngàn cửa hàng trực tuyến sử dụng nền tảng Shopify bị đóng băng hoặc trả về lỗi "502 Bad Gateway" đúng vào giờ cao điểm mua sắm của ngày Cyber Monday, làm thất thoát hàng triệu USD doanh thu trực tiếp của các nhà bán hàng.
- Giải pháp (Solution): Đội ngũ kỹ sư Shopify đã phải phân tách hàng đợi thanh toán (message queueing), áp dụng kỹ thuật khóa lạc quan (optimistic locking) thay cho khóa bi quan để giảm thiểu tình trạng tranh chấp tài nguyên database dưới áp lực tải lớn.

### 16. Sự cố lỗi hệ thống xử lý thanh toán của Ngân hàng Quốc gia Úc (NAB) - 2024 (Đã thay thế lỗi cũ)

- Nguồn (Source Link): [https://en.wikipedia.org/wiki/National_Australia_Bank](https://en.wikipedia.org/wiki/National_Australia_Bank)
- Mô tả lỗi (Description): Lỗi sập hệ thống xử lý giao dịch tự động và thanh toán trực tuyến do xung đột mã nguồn sau một đợt nâng cấp hệ thống core-banking định kỳ. Hệ thống không thể xử lý các lệnh gọi API kiểm tra số dư tức thời đối với các tài khoản liên kết bên thứ ba.
- Mức độ nghiêm trọng (Severity): Nghiêm trọng (High).
- Hậu quả (Consequences): Khiến hàng ngàn khách hàng không thể rút tiền mặt tại ATM, ứng dụng ngân hàng di động bị tê liệt, và các giao dịch thanh toán qua máy quẹt thẻ (EFTPOS) tại các siêu thị, cửa hàng trên toàn nước Úc bị từ chối hàng loạt, gây gián đoạn tài chính trong nhiều giờ.
- Giải pháp (Solution): Bộ phận CNTT của NAB đã tiến hành cô lập máy chủ API bị xung đột, thực hiện rollback (hoàn tác) hệ thống về phiên bản core ổn định trước đó, thực hiện đối soát thủ công các giao dịch bị treo và nâng cấp băng thông xử lý hàng đợi lệnh thanh toán.

### 17. Lỗi định tuyến hệ thống vệ tinh Starlink làm mất kết nối toàn cầu - 2025

- Nguồn (Source Link): [https://www.testdevlab.com/blog/software-bugs-2025](https://www.testdevlab.com/blog/software-bugs-2025)
- Mô tả lỗi (Description): Một lỗi logic nằm trong thuật toán định tuyến liên vệ tinh bằng tia laser (inter-satellite laser links) của SpaceX. Khi một chùm vệ tinh mới được phóng lên mạng lưới, phần mềm của các vệ tinh cũ không cập nhật đúng bản đồ quỹ đạo hình học, tạo ra các vòng lặp định tuyến gói tin (routing loops) trên không gian.
- Mức độ nghiêm trọng (Severity): Trung bình đến Cao (Medium-High).
- Hậu quả (Consequences): Khiến hàng chục ngàn người dùng internet vệ tinh Starlink trên khắp thế giới bị mất kết nối hoàn toàn hoặc gặp hiện tượng trễ mạng (latency) cực cao trong khoảng thời gian kéo dài gần một buổi.
- Giải pháp (Solution): SpaceX nhanh chóng đẩy một bản cập nhật firmware khẩn cấp từ các trạm mặt đất lên chùm vệ tinh để thiết lập lại bảng định tuyến tĩnh tạm thời, trước khi hiệu chỉnh lại thuật toán tự động nhận diện thực thể trên không gian.

### 18. Lỗi hệ thống điều phối không lưu tại Collins Aerospace gây hoãn chuyến bay - 2025

- Nguồn (Source Link): [https://www.testdevlab.com/blog/software-bugs-2025](https://www.testdevlab.com/blog/software-bugs-2025)
- Mô tả lỗi (Description): Một lỗi đồng bộ hóa thời gian thực (real-time synchronization error) xảy ra giữa các máy chủ điều hành của Collins Aerospace với hệ thống dữ liệu hàng không châu Âu. Sự sai lệch vài phần trăm giây trong việc đóng dấu thời gian (timestamp) khiến phần mềm phân tích luồng không lưu từ chối xử lý các kế hoạch bay được gửi lên.
- Mức độ nghiêm trọng (Severity): Nghiêm trọng (High).
- Hậu quả (Consequences): Hàng loạt kế hoạch bay tại các nước châu Âu bị từ chối tự động, buộc các sân bay phải kéo dài khoảng cách cất cánh giữa các máy bay bằng phương pháp thủ công, gây hoãn chuyến dây chuyền cho hàng trăm chuyến bay thương mại tại châu Âu.
- Giải pháp (Solution): Đội ngũ kỹ sư đã triển khai bản vá sửa lại hàm đồng bộ thời gian Network Time Protocol (NTP) trên hệ thống, gia tăng thời gian chờ cho phép (timeout tolerance) đối với các gói dữ liệu có dấu thời gian bị lệch nhẹ.

### 19. Sự cố rò rỉ mã nguồn và dữ liệu nội bộ của Slack - 2022

- Nguồn (Source Link): [https://slack.com/blog/news/slack-security-update](https://slack.com/blog/news/slack-security-update)
- Mô tả lỗi (Description): Lỗi kiểm soát truy cập token (Token access control vulnerability) trên nền tảng lưu trữ mã nguồn của Slack. Tin tặc đã khai thác các thông tin đăng nhập bị đánh cắp của nhân viên để truy cập trái phép vào kho lưu trữ GitHub bên ngoài của Slack thông qua một lỗ hổng trong cơ chế cấp quyền API của hệ thống tích hợp.
- Mức độ nghiêm trọng (Severity): Nghiêm trọng (High).
- Hậu quả (Consequences): Tin tặc đã tải xuống thành công một số kho lưu trữ mã nguồn (repositories) riêng tư của Slack. Mặc dù dữ liệu khách hàng và mã nguồn cốt lõi của ứng dụng không bị ảnh hưởng trực tiếp, sự việc này đã làm dấy lên mối lo ngại lớn về an ninh chuỗi cung ứng phần mềm và làm giảm sút nghiêm trọng niềm tin của các doanh nghiệp đang sử dụng Slack để bảo mật thông tin nội bộ.
- Giải pháp (Solution): Slack đã lập tức vô hiệu hóa các thông tin đăng nhập bị thỏa hiệp, thu hồi toàn bộ các token API liên quan, triển khai các biện pháp kiểm tra nghiêm ngặt hơn đối với quyền truy cập vào kho mã nguồn và tăng cường hệ thống giám sát cảnh báo tự động để phát hiện các hành vi tải xuống dữ liệu bất thường.

### 20. Sự cố rò rỉ dữ liệu qua API của mạng xã hội Twitter (nay là X) - 2022

- Nguồn (Source Link): [https://panorays.com/blog/twitter-data-breach/](https://panorays.com/blog/twitter-data-breach/)
- Mô tả lỗi (Description): Lỗi kiểm tra tính hợp lệ đầu vào trong một bản cập nhật mã nguồn cho kiến trúc API của Twitter vào tháng 6/2021. Lỗi này cho phép một người nộp một địa chỉ email hoặc số điện thoại lên API, hệ thống sẽ trả về chính xác ID tài khoản Twitter tương ứng, từ đó suy ra tên người dùng đứng sau tài khoản đó.
- Mức độ nghiêm trọng (Severity): Nghiêm trọng (High).
- Hậu quả (Consequences): Đến năm 2022, tin tặc đã khai thác triệt để lỗ hổng này để thu thập thông tin và rao bán một cơ sở dữ liệu khổng lồ chứa hơn 5.4 triệu tài khoản người dùng Twitter trên các diễn đàn ngầm, làm ảnh hưởng nghiêm trọng tới những tài khoản muốn ẩn danh (như các nhà báo, nhà hoạt động xã hội).
- Giải pháp (Solution): Twitter đã vá lỗ hổng API ngay sau khi phát hiện, tiến hành rà soát lại toàn bộ các điểm cuối API công khai (public API endpoints) và gửi thông báo cảnh báo bảo mật tới tất cả các chủ tài khoản có nguy cơ bị ảnh hưởng.
