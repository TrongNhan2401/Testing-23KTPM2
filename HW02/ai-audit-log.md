### [AI Chat]

- **Tool**: Gemini (model: 3.1 Pro)
- **Date/time**: 21:39 — 01/07/2026
- **Prompt**:
  > Hãy giúp tôi dịch đề của bài tập này
- **AI-Output**:

  > Chào bạn! Việc đọc và nắm bắt một đề bài tập chi tiết bằng tiếng Anh đôi khi có thể hơi tốn thời gian, mình hoàn toàn hiểu điều đó. Là một trí tuệ nhân tạo, mình đã giúp bạn dịch toàn bộ tài liệu này sang tiếng Việt một cách rõ ràng, sát nghĩa và tuân thủ đúng các thuật ngữ chuyên ngành kiểm thử để bạn có thể dễ dàng theo dõi và bắt tay vào làm bài ngay.

  > Dưới đây là bản dịch chi tiết của đề bài:
  >
  > ***
  >
  > # HW02 – Kiểm thử Miền giá trị (Domain Testing) trên EShop
  >
  > ## 1. Thông tin chung
  >
  > | **Tiêu chí**                | **Chi tiết**                                                                                                                   |
  > | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
  > | **Mã bài tập**              | **HW02-AI**                                                                                                                    |
  > | **Thời lượng**              | 10 giờ                                                                                                                         |
  > | **Hạn chót**                | Vui lòng tham khảo link nộp bài trên Moodle                                                                                    |
  > | **Hình thức**               | Bài tập cá nhân                                                                                                                |
  > | **Nộp bài**                 | Moodle (báo cáo)                                                                                                               |
  > | **Giảng viên & Trợ giảng**  | TS. Lâm Quang Vũ / TS. Trần Duy Hoàng / ThS. Trần Thị Bích Hạnh / ThS. Trương Phước Lộc / ThS. Hồ Tuấn Thanh                   |
  > | **Liên hệ**                 | lqvu@fit.hcmus.edu.vn / tdhoang@fit.hcmus.edu.vn / ttbhanh@fit.hcmus.edu.vn / tploc@fit.hcmus.edu.vn / hthanh@fit.hcmus.edu.vn |
  > | **Chính sách AI**           | Mở — **bắt buộc** phải có khai báo và đính kèm Báo cáo Kiểm toán AI (AI Audit Report)                                          |
  > | **Mức độ Bloom-AI yêu cầu** | G9.1 → G9.6, tùy thuộc vào bài tập (xem phần _Ánh xạ CLO_)                                                                     |
  >
  > ***
  >
  > ## 2. Nguyên tắc hướng dẫn
  >
  > Những nguyên tắc này xác định cách bạn được kỳ vọng làm việc trong suốt chuỗi bài tập của khóa học này. Hãy đọc kỹ trước khi bắt đầu, vì bài nộp của bạn sẽ được đánh giá dựa trên các nguyên tắc này.
  >
  > - **Chiến lược ưu tiên AI (AI-First):** Bạn được yêu cầu áp dụng AI vào các kỹ thuật kiểm thử đã học trên lớp. Tuy nhiên, điều này không có nghĩa là chỉ đưa ra một câu lệnh (prompt) chung chung kiểu _"hãy tạo test case và tìm lỗi trong chức năng này."_ Thay vào đó, bạn phải hướng dẫn AI qua từng bước của kỹ thuật kiểm thử như đã được học, sử dụng AI như một trợ lý có kỷ luật chứ không phải là một chiếc hộp đen.
  > - **Con người đánh giá (Human review):** Mọi kết quả do AI tạo ra đều phải được bạn (sinh viên) xem xét cẩn thận. Bạn hoàn toàn chịu trách nhiệm về tính chính xác của các kết quả này. Bạn được kỳ vọng sẽ thực hiện mọi sửa đổi và tinh chỉnh cần thiết — việc nộp trực tiếp kết quả thô của AI mà không qua xem xét là không được chấp nhận.
  > - **Báo cáo Kiểm toán AI (AI Audit Report):** Toàn bộ quá trình sử dụng AI phải được ghi lại thành một nhật ký hoàn chỉnh. Bạn được khuyến khích xây dựng các Kỹ năng Agent (Agent Skills) có thể tự động thực hiện các kỹ thuật kiểm thử này trên các bài tập tương tự. Nếu bạn **không** sử dụng AI, bạn vẫn phải khai báo điều này một cách rõ ràng.
  > - **Tài liệu hóa:** Toàn bộ quá trình làm việc phải được ghi chép lại dưới định dạng văn bản như Markdown.
  > - **Chất lượng hơn mức độ hoàn thành:** Bài làm của bạn sẽ được chấm không chỉ dựa trên việc nó có hoàn thành hay không, mà còn dựa trên số lượng và chất lượng của các sản phẩm giao nộp: báo cáo chung, báo cáo ca kiểm thử (test case), báo cáo lỗi (bug), báo cáo tổng kết kiểm thử, kịch bản (script), ảnh chụp màn hình, video và các liên kết tham khảo.
  >
  > ***
  >
  > ## 3. Mục tiêu học tập
  >
  > Sau khi hoàn thành bài tập này, bạn sẽ có khả năng:
  >
  > - Áp dụng kỹ thuật Kiểm thử Miền giá trị (Domain Testing) và Phân tích Giá trị Biên (Boundary Value Analysis) vào một Hệ thống cần kiểm thử (System Under Test) thực tế.
  > - Thể hiện năng lực Bloom-AI ở các mức độ **G9.2 (Áp dụng - Apply)** và **G9.3 (Phân tích - Analyse)**.
  >
  > ***
  >
  > ## 4. Hệ thống cần kiểm thử (SUT)
  >
  > **SUT:** EShop — một ứng dụng demo thương mại điện tử của Việt Nam được thiết kế để thực hành kiểm thử.
  >
  > **Kho lưu trữ (Repository):** [https://github.com/ttbhanh/eshop-sut](https://github.com/ttbhanh/eshop-sut)
  >
  > Các chức năng của ứng dụng được tổ chức thành các nhóm (pool) sau:
  >
  > - **Pool A — Xác thực, Danh mục và Sản phẩm:** FR-01 (Đăng ký tài khoản), FR-02 (Đăng nhập và khóa tài khoản), FR-03 (Quên mật khẩu và đặt lại mật khẩu - hai bước), FR-04 (Quản lý hồ sơ cá nhân), FR-05 (Danh sách sản phẩm và tìm kiếm), FR-06 (Xem chi tiết sản phẩm).
  > - **Pool B — Giỏ hàng và Thanh toán:** FR-07 (Giỏ hàng), FR-08 (Thanh toán), FR-09 (Mã giảm giá), FR-10 (Máy trạng thái đơn hàng), FR-11 (Xem lịch sử đơn hàng của người dùng).
  > - **Pool C — Web Admin:** FR-12 (Kiểm soát truy cập), FR-13 (Bảng điều khiển - Dashboard), FR-14 (Quản lý danh mục - CRUD), FR-15 (Quản lý sản phẩm - CRUD), FR-16 (Nhập sản phẩm từ file CSV), FR-17 (Quản lý mã giảm giá - CRUD), FR-18 (Quản lý đơn hàng - admin), FR-19 (Quản lý người dùng - admin).
  > - **Pool D — Ứng dụng Di động (Mobile App)**
  >
  > ***
  >
  > ## 5. Chọn chức năng
  >
  > Trong mỗi nhóm sinh viên, mỗi thành viên phải chọn **bốn (4) chức năng — mỗi pool chọn một chức năng** — và đảm bảo rằng **không có chức năng nào bị trùng lặp** giữa các thành viên trong nhóm.
  >
  > ***
  >
  > ## 6. Yêu cầu chi tiết
  >
  > Đối với mỗi chức năng bạn đã chọn, hãy hoàn thành các nhiệm vụ sau:
  >
  > 1.  **Kiểm thử Miền giá trị (Domain Testing):** Với sự hỗ trợ của các công cụ AI, hãy áp dụng kỹ thuật kiểm thử miền giá trị để thiết kế một tập hợp các ca kiểm thử (test cases) toàn diện. Bạn được khuyến khích thêm nhiều ca kiểm thử hơn nếu cần để đảm bảo độ bao phủ kỹ lưỡng. Cung cấp lời giải thích chi tiết, từng bước về cách bạn áp dụng kỹ thuật này. Hãy xem lại các bài giảng trên lớp trước khi bắt đầu.
  > 2.  **Phân tích Giá trị Biên (Boundary Value Analysis):** Tương tự, hãy áp dụng kỹ thuật phân tích giá trị biên để thiết kế một tập hợp các ca kiểm thử toàn diện, bổ sung thêm nếu cần để đạt độ bao phủ tốt. Cung cấp lời giải thích chi tiết, từng bước về cách bạn áp dụng kỹ thuật này. Nhắc lại, hãy xem lại bài giảng trước khi làm.
  > 3.  **Phân tích khoảng trống AI (AI gap analysis):** Nếu các công cụ AI của bạn bỏ sót bất kỳ test case hay lỗi (bug) nào, bạn phải báo cáo chúng. Giải thích _lý do tại sao_ AI lại bỏ sót chúng — ví dụ: do chất lượng đầu vào (prompt) của bạn, do những hạn chế của bản thân công cụ AI, hoặc do sự phức tạp vốn có của chức năng đang được kiểm thử.
  > 4.  **Báo cáo lỗi (Bug reporting):** Báo cáo tất cả các lỗi được phát hiện vào cả báo cáo Markdown và trên trang GitHub Issues của nhóm bạn. Nhớ đính kèm ảnh chụp màn hình của lỗi vào mỗi GitHub issue.
  >
  > ***
  >
  > ## 7. Kỹ năng Agent (Agent Skill)
  >
  > - Bạn được khuyến khích xây dựng các Kỹ năng Agent áp dụng kỹ thuật kiểm thử miền giá trị và phân tích giá trị biên, để chúng có thể được tái sử dụng cho các chức năng khác trong các nhiệm vụ kiểm thử sau này.
  > - Nộp các kỹ năng này cùng với các video demo (liên kết YouTube) thể hiện quá trình từ đầu đến cuối cách bạn sử dụng các kỹ năng đó trên một chức năng hoàn chỉnh.
  >
  > ***
  >
  > ## 8. Công cụ cho phép và Mức độ Bloom-AI
  >
  > Bạn có thể sử dụng các công cụ sau, và bạn phải khai báo chúng trong Báo cáo Kiểm toán AI của mình:
  >
  > - Bất kỳ công cụ AI nào bạn chọn (ví dụ: ChatGPT, Claude, Gemini, Copilot, Cursor).
  > - _(Tùy chọn)_ Các công cụ tạo kiểm thử bằng AI (ví dụ: Diffblue) để kiểm tra chéo.
  >
  > Mức độ Bloom-AI yêu cầu cho bài tập này là **G9.2 (Áp dụng)** và **G9.3 (Phân tích)**.
  >
  > ***
  >
  > ## 9. Báo cáo Kiểm toán AI (Phụ lục Bắt buộc)
  >
  > Đính kèm Báo cáo Kiểm toán AI (AI Audit Report) như một phụ lục. Sử dụng nội dung của các Mẫu AI (AI Templates) được cung cấp nếu cần.
  >
  > - Nếu bạn không sử dụng AI, hãy khai báo: _"Tôi không sử dụng bất kỳ sự trợ giúp nào của AI trong bài tập này."_
  > - Nếu bạn có sử dụng AI, hãy khai báo: _"Tôi sử dụng công cụ AI cho các tác vụ sau,"_ và bao gồm các thông tin sau cho mỗi lần tương tác: Tên của công cụ AI; Ngày và giờ; Câu lệnh (prompt) của bạn; Kết quả đầu ra của AI.
  >
  > Để đơn giản hóa quá trình này, bạn được khuyến khích tạo một kỹ năng hoặc quy tắc tự động trích xuất các thông tin trên sau mỗi phiên làm việc với AI.
  >
  > ***
  >
  > ## 10. Đánh giá AI (200–300 từ, Bắt buộc)
  >
  > Viết một đoạn văn từ 200–300 từ để đánh giá (critique) AI. Trả lời các câu hỏi sau: AI đã làm sai, thiên vị hoặc thiếu sót ở điểm nào? Tại sao nó lại không nắm bắt được vấn đề? Bạn đã học được nguyên tắc nào về việc cộng tác với AI trong quá trình làm bài tập này?
  >
  > Sử dụng nội dung của các Mẫu AI được cung cấp nếu cần.
  >
  > ***
  >
  > ## 11. Ràng buộc chống gian lận AI
  >
  > - Không có.
  >
  > ***
  >
  > ## 12. Nhật ký Commit Git (Git Commit Log)
  >
  > - Tạo một Git commit mới cho mỗi bước trong quy trình kiểm thử của từng chức năng.
  > - Cung cấp nhật ký commit Git dưới định dạng file văn bản (text-based).
  >
  > ***
  >
  > ## 13. Bảo vệ miệng (Oral Defense)
  >
  > Sẽ có **30% sinh viên** được chọn ngẫu nhiên để tham gia một buổi bảo vệ miệng kéo dài 5–7 phút trong tuần sau hạn chót nộp bài, nhằm giải thích cách họ đã hoàn thành bài tập này.
  >
  > ***
  >
  > ## 14. Quy định nộp bài
  >
  > - **Định dạng tên file:** `<MãSốSinhViên>_HW02_AI_DomainTesting_<ĐiểmTựĐánhGiá>.zip`
  > - _Điểm Tự Đánh Giá (SelfAssessedGrade):_ một số có 3 chữ số trong khoảng [000, 100]. Ví dụ: `25127001_HW02_AI_DomainTesting_090.zip`
  > - **Các thành phần bắt buộc trong file `.zip`:**
  > - Báo cáo chính (Markdown + PDF), bao gồm báo cáo Kiểm thử Miền giá trị và báo cáo Phân tích Giá trị Biên.
  > - Báo cáo lỗi (Bug report), kèm theo ảnh chụp màn hình các lỗi trên trang GitHub Issues.
  > - Đánh giá AI và Báo cáo Kiểm toán AI (Markdown + PDF).
  > - Nhật ký commit Git (file text).
  > - Một file `README.md` chứa bảng tự đánh giá điểm (bên dưới) và báo cáo tổng kết kiểm thử: số lượng chức năng; số lượng test case được thiết kế, đã thực thi, pass (đạt), fail (không đạt), và chưa thực thi; số lượng lỗi; và các video demo.
  > - Bất kỳ tài liệu hỗ trợ nào khác.
  > - Nộp bài lên Moodle. Về hạn chót, vui lòng tham khảo liên kết nộp bài.
  >
  > ***
  >
  > ## 15. Mẫu chấm điểm
  >
  > | **STT** | **Tiêu chí**                              | **Điểm tối đa** | **Điểm tự đánh giá** |
  > | ------- | ----------------------------------------- | --------------- | -------------------- |
  > | **1**   | Chức năng A (Miền giá trị + Biên)         | 25              |                      |
  > | **2**   | Chức năng B (Miền giá trị + Biên)         | 25              |                      |
  > | **3**   | Chức năng C (Miền giá trị + Biên)         | 25              |                      |
  > | **4**   | Chức năng D (Mobile, Miền giá trị + Biên) | 15              |                      |
  > | **5**   | Các Kỹ năng Agent (Agent Skills)          | 10              |                      |
  > |         | **Tổng cộng**                             | **100**         |                      |
  >
  > ***
  >
  > ## 16. Tài liệu tham khảo
  >
  > - Đề cương mức Cơ bản của ISTQB (phiên bản mới nhất).
  > - Hardman, P. (2025). _A Post-AI Learning Taxonomy._
  > - Fuster Rabella, M. (2025). _OECD Education Working Paper No. 338._
  > - Anthropic (2025). _Building Reliable AI Test Agents_ — blog kỹ thuật.
  > - Tài liệu DeepEval & Promptfoo — các framework kiểm thử LLM.
  >
  > ***
  >
  > ## 17. Các quy định khác
  >
  > - **Tuyệt đối không** chấp nhận nộp bài trễ.
  > - Thiếu bất kỳ tài liệu bắt buộc nào sẽ nhận **0 điểm**.
  > - Sao chép giữa các sinh viên — **bao gồm cả các prompt (câu lệnh)** — sẽ dẫn đến **điểm 0 cho tất cả các bên liên quan**.

- **Human Review**: AI đã dịch đúng và nội dung của requirement

## Tạo file domain-testing.mdc để hướng dẫn agent

- **Tool**: Gemini (model: 3.1 Pro)
- **Date/time**: 22:01 — 01/07/2026
- **Prompt**:

  > Hãy tạo giúp tôi một file domain-testing.mdc để tôi có thể hướng dẫn agent làm theo các bước của lý thuyết domain testing bao gồm:
  > +Bước 0: Xác định phạm vi yêu cầu, Làm rõ rằng người dùng muốn thực hiện FR nào trước khi bắt đầu làm,
  > +Bước 1: Xác định input, output: Đọc source code để xác định chức năng, xác định input rõ ràng và liệt kê như tên, kiểu dữ liệu, ràng buộc (độ dài, requriement, unique,...) và phải có trích dẫn rằng nằm ở file nào, dòng bao nhiêu (file: line)
  >
  > - Bước 2: Phân vùng theo domain testing: Xác định bao gồm miền hợp lệ, miền không hợp lệ, xác định theo nguyên tắc tương đương được miêu tả trong slide
  > - Bước 3: Lập bảng lớp tương đương liệt kê từng EC như trong slide
  > - Bước 4: Chọn các tổ hợp test case, chọn sao cho với miền hợp lệ 1 test case bao phủ càng nhiều càng tốt và miền không hợp lệ thì mỗi test case chỉ bao phủ 1 miền tương đương và trình bày kết quả mong đợi
  > - Bước 5: Bổ sung test lại với giá trị biên (BVA)
  > - Bước 5: Review, kiểm tra trùng lặp, kiểm tra độ phủ
  >
  > Đó là những nguyên tắc, các bước tôi muốn bạn thêm. Hãy hoàn chỉnh và tạo ra 1 file domain-testing.mdc để tôi có thể hướng dẫn agent làm việc

- **AI-Output**:
  > Chào bạn, tôi là Gemini. Việc thiết lập một bộ quy tắc (rule) hay Kỹ năng Agent (Agent Skill) chuẩn xác bằng file `.mdc` (Markdown Context) là một chiến lược rất tuyệt vời và bám sát yêu cầu "AI-First" của bài tập.
  >
  > Dưới đây là nội dung chi tiết cho file `domain-testing.mdc` của bạn. Nội dung này được cấu trúc để hướng dẫn Agent thực thi nghiêm ngặt từng bước theo đúng lý thuyết Kiểm thử Miền giá trị (Domain Testing) và Phân tích Giá trị Biên (Boundary Value Analysis).
  >
  > ***
  >
  > ### Nội dung file `domain-testing.mdc`
  >
  > ```markdown
  > # Agent Skill: Kỹ thuật Domain Testing & Boundary Value Analysis (BVA)
  >
  > **Mô tả:** Hướng dẫn này định hình quy trình từng bước để phân tích và thiết kế Test Case bằng kỹ thuật Domain Testing kết hợp BVA. Agent phải tuân thủ nghiêm ngặt thứ tự các bước dưới đây, không được bỏ qua bất kỳ bước nào.
  >
  > ## Bước 0: Xác định phạm vi yêu cầu (Define Scope)
  >
  > Nhiệm vụ đầu tiên của Agent là tương tác với người dùng để làm rõ tính năng cần kiểm thử.
  >
  > - Hỏi người dùng: "Bạn muốn thực hiện kiểm thử cho Feature Requirement (FR) nào?"
  > - Đợi người dùng cung cấp thông tin FR cụ thể (ví dụ: FR-01: Đăng ký tài khoản) trước khi tiến hành các bước tiếp theo.
  >
  > ## Bước 1: Xác định Input và Output (Identify I/O)
  >
  > [cite_start]Dựa vào mã nguồn (source code) hoặc đặc tả, Agent cần phân tích và trích xuất các biến đầu vào, đầu ra[cite: 14]. Toàn bộ thông tin phải được ghi chép rõ ràng và có trích dẫn nguồn.
  >
  > - Xác định tên biến, kiểu dữ liệu, và các ràng buộc (độ dài, bắt buộc, tính duy nhất,...).
  > - BẮT BUỘC có trích dẫn vị trí tìm thấy trong source code theo định dạng: `(Tên_File: Dòng_Bao_Nhiêu)`.
  >
  > ## Bước 2: Phân vùng theo Domain Testing (Identify Equivalence Classes)
  >
  > [cite_start]Chia tập hợp các giá trị có thể có của mỗi input/output thành các miền tương đương (Equivalence Classes - EC)[cite: 16]. Áp dụng các nguyên tắc sau:
  >
  > - [cite_start]Nếu điều kiện là một khoảng giá trị: Tạo 1 miền hợp lệ và 2 miền không hợp lệ[cite: 49, 50].
  > - [cite_start]Nếu điều kiện là một tập hợp các giá trị: Tạo 1 miền hợp lệ cho mỗi phần tử và 1 miền không hợp lệ chung[cite: 53, 55, 56].
  > - [cite_start]Nếu điều kiện là "bắt buộc phải là" (must be): Tạo 1 miền hợp lệ và 1 miền không hợp lệ[cite: 60, 62, 64].
  > - [cite_start]Phân định rõ đâu là VALID EQUIVALENCE CLASSES (hợp lệ) và INVALID EQUIVALENCE CLASSES (không hợp lệ)[cite: 38].
  >
  > ## Bước 3: Lập bảng Lớp tương đương (EC Table)
  >
  > [cite_start]Trình bày kết quả của Bước 2 dưới dạng bảng chuẩn hóa[cite: 45]. Bảng phải bao gồm các cột sau:
  > | STT | Biến Input/Output | Các Lớp Tương Đương (Equivalence Classes) | Loại (Valid/Invalid) |
  > | --- | --- | --- | --- |
  > | EC1 | ... | ... | ... |
  >
  > ## Bước 4: Thiết kế Tổ hợp Test Case (Select Test Cases)
  >
  > [cite_start]Chọn ít nhất một giá trị đại diện từ mỗi lớp tương đương để tạo Test Case[cite: 145, 146]. Phải tuân thủ nghiêm ngặt quy tắc tổ hợp sau:
  >
  > - [cite_start]Đối với các miền HỢP LỆ: Chọn các test case sao cho bao phủ CÀNG NHIỀU miền hợp lệ càng tốt trong một kịch bản, cho đến khi tất cả các miền hợp lệ đều được bao phủ[cite: 147].
  > - [cite_start]Đối với các miền KHÔNG HỢP LỆ: Chọn các test case sao cho mỗi test case CHỈ BAO PHỦ MỘT VÀ CHỈ MỘT miền không hợp lệ, cho đến khi tất cả các miền không hợp lệ được bao phủ[cite: 148].
  > - [cite_start]Cung cấp Dữ liệu kiểm thử (Input) và Kết quả mong đợi (Expected Output) rõ ràng cho từng Test Case[cite: 151].
  >
  > ## Bước 5: Bổ sung Test Case với Giá trị biên (Boundary Value Analysis - BVA)
  >
  > [cite_start]Mở rộng các Test Case bằng cách phân tích ranh giới của các miền giá trị, vì phần mềm rất dễ gặp lỗi tại các điểm này[cite: 159].
  >
  > - [cite_start]Với mỗi ranh giới (Boundary), xác định và tạo Test Case cho các giá trị: Cận dưới (LB-1), Ngay biên dưới (LB), Ngay biên trên (UB), Cận trên (UB+1) tùy thuộc vào kiểu dữ liệu [cite: 190-196].
  > - [cite_start]Bổ sung các Test Case này vào danh sách hiện có, ghi rõ Mô tả biên (ví dụ: Biên dưới cùng, Biên Max của số dư) để người dùng dễ theo dõi[cite: 369].
  >
  > ## Bước 6: Review và Hoàn thiện (Review & Coverage Check)
  >
  > Trước khi xuất kết quả cuối cùng cho người dùng, Agent phải tự rà soát lại toàn bộ quy trình:
  >
  > - Kiểm tra trùng lặp: Đảm bảo không có Test Case BVA nào bị trùng hoàn toàn với Test Case Domain Testing trước đó. Nếu trùng, hãy gộp lại và ghi chú.
  > - Kiểm tra độ phủ (Coverage): Đảm bảo tất cả các Lớp tương đương (EC) trong bảng ở Bước 3 đều đã được gán (map) vào ít nhất một Test Case.
  > - Đảm bảo mọi kết quả mong đợi đều rõ ràng, khả thi để Tester con người có thể thực thi.
  > ```
  >
  > ***
  >
  > Bạn có thể copy trực tiếp nội dung trong khối code trên và lưu thành file `domain-testing.mdc` để đưa vào Cursor hoặc hệ thống Agent của bạn. Nó đã được thiết kế loại bỏ các danh sách lồng nhau phức tạp để Agent đọc hiểu trơn tru và thực thi chính xác nhất theo lý thuyết. Chúc bạn hoàn thành bài tập kiểm thử EShop thật xuất sắc!
- **Human Review**:
  > +Thiếu một quy tắc khi phân lớp tương đương là:"Nếu có lý do tin rằng các phần tử trong 1 EC không được xử lý giống nhau, hãy chia nhỏ EC đó ra"
  > +Ở bước 5 thiếu 2 biên là LB + 1 và UB - 1

## Hoàn chỉnh agent skill

- **Tool**: Gemini (model: 3.1 Pro)
- **Date/time**: 22:21 — 01/07/2026
- **Prompt**:

  > Hiện tại file trên còn thiếu một số ý sau:
  > +Thiếu một quy tắc khi phân lớp tương đương là:"Nếu có lý do tin rằng các phần tử trong 1 EC không được xử lý giống nhau, hãy chia nhỏ EC đó ra"
  > +Ở bước 5 thiếu 2 biên là LB + 1 và UB - 1

  > Hãy bổ sung và hoàn chỉnh file .mdc này giúp tôi. Đây là file hướng dẫn agent nên bạn phải thêm và hoàn chỉnh sao cho tôi đặt làm rules và tag vào mỗi khi prompting với agent. Ngoài ra thêm cho tôi phần quy tắc như sau:
  >
  > - Luôn trích dẫn nguồn code nếu có (file:line)
  > - Không được tự output ra thẳng kết quả mà phải có quá trình suy luận, bước đi như trên

-**AI-Output**:

> Chào bạn, bạn đã rà soát lý thuyết rất kỹ! Việc phát hiện ra quy tắc chia nhỏ miền tương đương và các giá trị biên `LB+1`, `UB-1` chứng tỏ bạn nắm rất vững kiến thức kiểm thử. Những quy tắc và ràng buộc bạn vừa bổ sung đặc biệt quan trọng để "ép" Agent không được đi đường tắt (sinh ra kết quả ảo) và phải phân tích sâu hơn.
>
> Dưới đây là phiên bản `.mdc` đã được cập nhật hoàn chỉnh, tích hợp đầy đủ các quy tắc mới của bạn để làm System Prompt/Rules cho Agent:
>
> ---
>
> ### Nội dung file `domain-testing.mdc` (Phiên bản cập nhật)
>
> ```markdown
> # Agent Skill: Kỹ thuật Domain Testing & Boundary Value Analysis (BVA)
>
> **Mô tả:** Hướng dẫn này định hình quy trình từng bước để phân tích và thiết kế Test Case bằng kỹ thuật Domain Testing kết hợp BVA. Agent phải tuân thủ nghiêm ngặt các nguyên tắc cốt lõi và thứ tự các bước dưới đây, không được bỏ qua bất kỳ bước nào.
>
> ## Nguyên tắc cốt lõi (Core Rules - Agent BẮT BUỘC tuân thủ)
>
> 1. **Tư duy từng bước (Chain of Thought):** Tuyệt đối KHÔNG được in ra kết quả cuối cùng ngay lập tức. Agent phải trình bày rõ quá trình suy luận, phân tích logic đi qua từng bước một theo đúng thứ tự tài liệu này.
> 2. **Trích dẫn mã nguồn (Code Citation):** Mọi yếu tố đầu vào/đầu ra, ràng buộc độ dài, kiểu dữ liệu khi được phân tích BẮT BUỘC phải kèm theo trích dẫn nguồn gốc từ mã nguồn. Sử dụng định dạng: `(Tên_File: Dòng_Bao_Nhiêu)`.
>
> ---
>
> ## Bước 0: Xác định phạm vi yêu cầu (Define Scope)
>
> Nhiệm vụ đầu tiên của Agent là tương tác với người dùng để làm rõ tính năng cần kiểm thử.
>
> - Hỏi người dùng: "Bạn muốn thực hiện kiểm thử cho Feature Requirement (FR) nào?"
> - Đợi người dùng cung cấp thông tin FR cụ thể (ví dụ: FR-01: Đăng ký tài khoản) trước khi tiến hành các bước tiếp theo.
>
> ## Bước 1: Xác định Input và Output (Identify I/O)
>
> Dựa vào mã nguồn (source code) hoặc đặc tả, Agent cần phân tích và trích xuất các biến đầu vào, đầu ra.
>
> - Xác định tên biến, kiểu dữ liệu, và các ràng buộc (độ dài, bắt buộc, tính duy nhất,...).
> - Luôn tuân thủ nguyên tắc **Code Citation** đã nêu ở phần Nguyên tắc cốt lõi.
>
> ## Bước 2: Phân vùng theo Domain Testing (Identify Equivalence Classes)
>
> Chia tập hợp các giá trị có thể có của mỗi input/output thành các miền tương đương (Equivalence Classes - EC). Áp dụng các nguyên tắc sau:
>
> - Nếu điều kiện là một khoảng giá trị: Tạo 1 miền hợp lệ và 2 miền không hợp lệ.
> - Nếu điều kiện là một tập hợp các giá trị: Tạo 1 miền hợp lệ cho mỗi phần tử và 1 miền không hợp lệ chung.
> - Nếu điều kiện là "bắt buộc phải là" (must be): Tạo 1 miền hợp lệ và 1 miền không hợp lệ.
> - Phân định rõ đâu là VALID EQUIVALENCE CLASSES (hợp lệ) và INVALID EQUIVALENCE CLASSES (không hợp lệ).
> - **Quy tắc chia nhỏ đặc biệt:** Nếu có bất kỳ lý do nào để tin rằng các phần tử trong cùng một Lớp tương đương không được chương trình xử lý theo một cách hoàn toàn giống nhau, BẮT BUỘC phải chia nhỏ EC đó thành hai hoặc nhiều EC nhỏ hơn.
>
> ## Bước 3: Lập bảng Lớp tương đương (EC Table)
>
> Trình bày kết quả của Bước 2 dưới dạng bảng chuẩn hóa. Bảng phải bao gồm các cột sau:
> | STT | Biến Input/Output | Các Lớp Tương Đương (Equivalence Classes) | Loại (Valid/Invalid) |
> | --- | --- | --- | --- |
> | EC1 | ... | ... | ... |
>
> ## Bước 4: Thiết kế Tổ hợp Test Case (Select Test Cases)
>
> Chọn ít nhất một giá trị đại diện từ mỗi lớp tương đương để tạo Test Case. Phải tuân thủ nghiêm ngặt quy tắc tổ hợp sau:
>
> - Đối với các miền HỢP LỆ: Chọn các test case sao cho bao phủ CÀNG NHIỀU miền hợp lệ càng tốt trong một kịch bản, cho đến khi tất cả các miền hợp lệ đều được bao phủ.
> - Đối với các miền KHÔNG HỢP LỆ: Chọn các test case sao cho mỗi test case CHỈ BAO PHỦ MỘT VÀ CHỈ MỘT miền không hợp lệ, cho đến khi tất cả các miền không hợp lệ được bao phủ.
> - Cung cấp Dữ liệu kiểm thử (Input) và Kết quả mong đợi (Expected Output) rõ ràng cho từng Test Case.
>
> ## Bước 5: Bổ sung Test Case với Giá trị biên (Boundary Value Analysis - BVA)
>
> Mở rộng các Test Case bằng cách phân tích ranh giới của các miền giá trị. Với mỗi ranh giới, xem xét và tạo Test Case cho các điểm sau (tùy thuộc vào ngữ cảnh và kiểu dữ liệu):
>
> - Cận dưới (**LB-1**)
> - Ngay biên dưới (**LB**)
> - Trên biên dưới (**LB+1**)
> - Dưới biên trên (**UB-1**)
> - Ngay biên trên (**UB**)
> - Cận trên (**UB+1**)
> - Bổ sung các Test Case này vào danh sách hiện có, ghi rõ Mô tả biên (ví dụ: Biên dưới cùng, Cận trên của số dư) để người dùng dễ theo dõi.
>
> ## Bước 6: Review và Hoàn thiện (Review & Coverage Check)
>
> Trước khi xuất kết quả cuối cùng, Agent phải tự rà soát lại toàn bộ quy trình:
>
> - Kiểm tra trùng lặp: Đảm bảo không có Test Case BVA nào bị trùng hoàn toàn với Test Case Domain Testing trước đó. Nếu trùng, hãy gộp lại và ghi chú.
> - Kiểm tra độ phủ (Coverage): Đảm bảo tất cả các Lớp tương đương (EC) trong bảng ở Bước 3 đều đã được gán (map) vào ít nhất một Test Case.
> - Đảm bảo mọi kết quả mong đợi đều rõ ràng, khả thi để Tester con người có thể thực thi.
> ```

-**Human review**: Hiện tại gemini đã bổ sung những yêu cầu còn thiếu. Bây giờ có thể sử dụng và cập nhật trong tương lai nếu cần.
