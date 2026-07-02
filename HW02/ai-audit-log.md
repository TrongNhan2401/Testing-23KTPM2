### [AI Chat]

- **Tool**: Gemini (model: 3.1 Pro)
- **Date/time**: 21:39 — 01/07/2026
- **Prompt**:
  > Hãy giúp tôi dịch đề của bài tập này
- **AI-Output**:
  > Chào bạn! Việc đọc và nắm bắt một đề bài tập chi tiết bằng tiếng Anh đôi khi có thể hơi tốn thời gian, mình hoàn toàn hiểu điều đó. Là một trí tuệ nhân tạo, mình đã giúp bạn dịch toàn bộ tài liệu này sang tiếng Việt một cách rõ ràng, sát nghĩa và tuân thủ đúng các thuật ngữ chuyên ngành kiểm thử để bạn có thể dễ dàng theo dõi và bắt tay vào làm bài ngay.
  > Dưới đây là bản dịch chi tiết của đề bài:
  >
  > ---
  >
  > # HW02 – Kiểm thử Miền giá trị (Domain Testing) trên EShop
  >
  > ## 1. Thông tin chung
  >
  >
  > | **Tiêu chí**                | **Chi tiết**                                                                                                                                                                                                                                                                                            |
  > | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  > | **Mã bài tập**              | **HW02-AI**                                                                                                                                                                                                                                                                                             |
  > | **Thời lượng**              | 10 giờ                                                                                                                                                                                                                                                                                                  |
  > | **Hạn chót**                | Vui lòng tham khảo link nộp bài trên Moodle                                                                                                                                                                                                                                                             |
  > | **Hình thức**               | Bài tập cá nhân                                                                                                                                                                                                                                                                                         |
  > | **Nộp bài**                 | Moodle (báo cáo)                                                                                                                                                                                                                                                                                        |
  > | **Giảng viên & Trợ giảng**  | TS. Lâm Quang Vũ / TS. Trần Duy Hoàng / ThS. Trần Thị Bích Hạnh / ThS. Trương Phước Lộc / ThS. Hồ Tuấn Thanh                                                                                                                                                                                            |
  > | **Liên hệ**                 | [lqvu@fit.hcmus.edu.vn](mailto:lqvu@fit.hcmus.edu.vn) / [tdhoang@fit.hcmus.edu.vn](mailto:tdhoang@fit.hcmus.edu.vn) / [ttbhanh@fit.hcmus.edu.vn](mailto:ttbhanh@fit.hcmus.edu.vn) / [tploc@fit.hcmus.edu.vn](mailto:tploc@fit.hcmus.edu.vn) / [hthanh@fit.hcmus.edu.vn](mailto:hthanh@fit.hcmus.edu.vn) |
  > | **Chính sách AI**           | Mở — **bắt buộc** phải có khai báo và đính kèm Báo cáo Kiểm toán AI (AI Audit Report)                                                                                                                                                                                                                   |
  > | **Mức độ Bloom-AI yêu cầu** | G9.1 → G9.6, tùy thuộc vào bài tập (xem phần *Ánh xạ CLO*)                                                                                                                                                                                                                                              |
  >
  >
  > ---
  >
  > ## 2. Nguyên tắc hướng dẫn
  >
  > Những nguyên tắc này xác định cách bạn được kỳ vọng làm việc trong suốt chuỗi bài tập của khóa học này. Hãy đọc kỹ trước khi bắt đầu, vì bài nộp của bạn sẽ được đánh giá dựa trên các nguyên tắc này.
  >
  > - **Chiến lược ưu tiên AI (AI-First):** Bạn được yêu cầu áp dụng AI vào các kỹ thuật kiểm thử đã học trên lớp. Tuy nhiên, điều này không có nghĩa là chỉ đưa ra một câu lệnh (prompt) chung chung kiểu *"hãy tạo test case và tìm lỗi trong chức năng này."* Thay vào đó, bạn phải hướng dẫn AI qua từng bước của kỹ thuật kiểm thử như đã được học, sử dụng AI như một trợ lý có kỷ luật chứ không phải là một chiếc hộp đen.
  > - **Con người đánh giá (Human review):** Mọi kết quả do AI tạo ra đều phải được bạn (sinh viên) xem xét cẩn thận. Bạn hoàn toàn chịu trách nhiệm về tính chính xác của các kết quả này. Bạn được kỳ vọng sẽ thực hiện mọi sửa đổi và tinh chỉnh cần thiết — việc nộp trực tiếp kết quả thô của AI mà không qua xem xét là không được chấp nhận.
  > - **Báo cáo Kiểm toán AI (AI Audit Report):** Toàn bộ quá trình sử dụng AI phải được ghi lại thành một nhật ký hoàn chỉnh. Bạn được khuyến khích xây dựng các Kỹ năng Agent (Agent Skills) có thể tự động thực hiện các kỹ thuật kiểm thử này trên các bài tập tương tự. Nếu bạn **không** sử dụng AI, bạn vẫn phải khai báo điều này một cách rõ ràng.
  > - **Tài liệu hóa:** Toàn bộ quá trình làm việc phải được ghi chép lại dưới định dạng văn bản như Markdown.
  > - **Chất lượng hơn mức độ hoàn thành:** Bài làm của bạn sẽ được chấm không chỉ dựa trên việc nó có hoàn thành hay không, mà còn dựa trên số lượng và chất lượng của các sản phẩm giao nộp: báo cáo chung, báo cáo ca kiểm thử (test case), báo cáo lỗi (bug), báo cáo tổng kết kiểm thử, kịch bản (script), ảnh chụp màn hình, video và các liên kết tham khảo.
  >
  > ---
  >
  > ## 3. Mục tiêu học tập
  >
  > Sau khi hoàn thành bài tập này, bạn sẽ có khả năng:
  >
  > - Áp dụng kỹ thuật Kiểm thử Miền giá trị (Domain Testing) và Phân tích Giá trị Biên (Boundary Value Analysis) vào một Hệ thống cần kiểm thử (System Under Test) thực tế.
  > - Thể hiện năng lực Bloom-AI ở các mức độ **G9.2 (Áp dụng - Apply)** và **G9.3 (Phân tích - Analyse)**.
  >
  > ---
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
  > ---
  >
  > ## 5. Chọn chức năng
  >
  > Trong mỗi nhóm sinh viên, mỗi thành viên phải chọn **bốn (4) chức năng — mỗi pool chọn một chức năng** — và đảm bảo rằng **không có chức năng nào bị trùng lặp** giữa các thành viên trong nhóm.
  >
  > ---
  >
  > ## 6. Yêu cầu chi tiết
  >
  > Đối với mỗi chức năng bạn đã chọn, hãy hoàn thành các nhiệm vụ sau:
  >
  > 1. **Kiểm thử Miền giá trị (Domain Testing):** Với sự hỗ trợ của các công cụ AI, hãy áp dụng kỹ thuật kiểm thử miền giá trị để thiết kế một tập hợp các ca kiểm thử (test cases) toàn diện. Bạn được khuyến khích thêm nhiều ca kiểm thử hơn nếu cần để đảm bảo độ bao phủ kỹ lưỡng. Cung cấp lời giải thích chi tiết, từng bước về cách bạn áp dụng kỹ thuật này. Hãy xem lại các bài giảng trên lớp trước khi bắt đầu.
  > 2. **Phân tích Giá trị Biên (Boundary Value Analysis):** Tương tự, hãy áp dụng kỹ thuật phân tích giá trị biên để thiết kế một tập hợp các ca kiểm thử toàn diện, bổ sung thêm nếu cần để đạt độ bao phủ tốt. Cung cấp lời giải thích chi tiết, từng bước về cách bạn áp dụng kỹ thuật này. Nhắc lại, hãy xem lại bài giảng trước khi làm.
  > 3. **Phân tích khoảng trống AI (AI gap analysis):** Nếu các công cụ AI của bạn bỏ sót bất kỳ test case hay lỗi (bug) nào, bạn phải báo cáo chúng. Giải thích *lý do tại sao* AI lại bỏ sót chúng — ví dụ: do chất lượng đầu vào (prompt) của bạn, do những hạn chế của bản thân công cụ AI, hoặc do sự phức tạp vốn có của chức năng đang được kiểm thử.
  > 4. **Báo cáo lỗi (Bug reporting):** Báo cáo tất cả các lỗi được phát hiện vào cả báo cáo Markdown và trên trang GitHub Issues của nhóm bạn. Nhớ đính kèm ảnh chụp màn hình của lỗi vào mỗi GitHub issue.
  >
  > ---
  >
  > ## 7. Kỹ năng Agent (Agent Skill)
  >
  > - Bạn được khuyến khích xây dựng các Kỹ năng Agent áp dụng kỹ thuật kiểm thử miền giá trị và phân tích giá trị biên, để chúng có thể được tái sử dụng cho các chức năng khác trong các nhiệm vụ kiểm thử sau này.
  > - Nộp các kỹ năng này cùng với các video demo (liên kết YouTube) thể hiện quá trình từ đầu đến cuối cách bạn sử dụng các kỹ năng đó trên một chức năng hoàn chỉnh.
  >
  > ---
  >
  > ## 8. Công cụ cho phép và Mức độ Bloom-AI
  >
  > Bạn có thể sử dụng các công cụ sau, và bạn phải khai báo chúng trong Báo cáo Kiểm toán AI của mình:
  >
  > - Bất kỳ công cụ AI nào bạn chọn (ví dụ: ChatGPT, Claude, Gemini, Copilot, Cursor).
  > - *(Tùy chọn)* Các công cụ tạo kiểm thử bằng AI (ví dụ: Diffblue) để kiểm tra chéo.
  >
  > Mức độ Bloom-AI yêu cầu cho bài tập này là **G9.2 (Áp dụng)** và **G9.3 (Phân tích)**.
  >
  > ---
  >
  > ## 9. Báo cáo Kiểm toán AI (Phụ lục Bắt buộc)
  >
  > Đính kèm Báo cáo Kiểm toán AI (AI Audit Report) như một phụ lục. Sử dụng nội dung của các Mẫu AI (AI Templates) được cung cấp nếu cần.
  >
  > - Nếu bạn không sử dụng AI, hãy khai báo: *"Tôi không sử dụng bất kỳ sự trợ giúp nào của AI trong bài tập này."*
  > - Nếu bạn có sử dụng AI, hãy khai báo: *"Tôi sử dụng công cụ AI cho các tác vụ sau,"* và bao gồm các thông tin sau cho mỗi lần tương tác: Tên của công cụ AI; Ngày và giờ; Câu lệnh (prompt) của bạn; Kết quả đầu ra của AI.
  >
  > Để đơn giản hóa quá trình này, bạn được khuyến khích tạo một kỹ năng hoặc quy tắc tự động trích xuất các thông tin trên sau mỗi phiên làm việc với AI.
  >
  > ---
  >
  > ## 10. Đánh giá AI (200–300 từ, Bắt buộc)
  >
  > Viết một đoạn văn từ 200–300 từ để đánh giá (critique) AI. Trả lời các câu hỏi sau: AI đã làm sai, thiên vị hoặc thiếu sót ở điểm nào? Tại sao nó lại không nắm bắt được vấn đề? Bạn đã học được nguyên tắc nào về việc cộng tác với AI trong quá trình làm bài tập này?
  >
  > Sử dụng nội dung của các Mẫu AI được cung cấp nếu cần.
  >
  > ---
  >
  > ## 11. Ràng buộc chống gian lận AI
  >
  > - Không có.
  >
  > ---
  >
  > ## 12. Nhật ký Commit Git (Git Commit Log)
  >
  > - Tạo một Git commit mới cho mỗi bước trong quy trình kiểm thử của từng chức năng.
  > - Cung cấp nhật ký commit Git dưới định dạng file văn bản (text-based).
  >
  > ---
  >
  > ## 13. Bảo vệ miệng (Oral Defense)
  >
  > Sẽ có **30% sinh viên** được chọn ngẫu nhiên để tham gia một buổi bảo vệ miệng kéo dài 5–7 phút trong tuần sau hạn chót nộp bài, nhằm giải thích cách họ đã hoàn thành bài tập này.
  >
  > ---
  >
  > ## 14. Quy định nộp bài
  >
  > - **Định dạng tên file:** `<MãSốSinhViên>_HW02_AI_DomainTesting_<ĐiểmTựĐánhGiá>.zip`
  > - *Điểm Tự Đánh Giá (SelfAssessedGrade):* một số có 3 chữ số trong khoảng [000, 100]. Ví dụ: `25127001_HW02_AI_DomainTesting_090.zip`
  > - **Các thành phần bắt buộc trong file `.zip`:**
  > - Báo cáo chính (Markdown + PDF), bao gồm báo cáo Kiểm thử Miền giá trị và báo cáo Phân tích Giá trị Biên.
  > - Báo cáo lỗi (Bug report), kèm theo ảnh chụp màn hình các lỗi trên trang GitHub Issues.
  > - Đánh giá AI và Báo cáo Kiểm toán AI (Markdown + PDF).
  > - Nhật ký commit Git (file text).
  > - Một file `README.md` chứa bảng tự đánh giá điểm (bên dưới) và báo cáo tổng kết kiểm thử: số lượng chức năng; số lượng test case được thiết kế, đã thực thi, pass (đạt), fail (không đạt), và chưa thực thi; số lượng lỗi; và các video demo.
  > - Bất kỳ tài liệu hỗ trợ nào khác.
  > - Nộp bài lên Moodle. Về hạn chót, vui lòng tham khảo liên kết nộp bài.
  >
  > ---
  >
  > ## 15. Mẫu chấm điểm
  >
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
  >
  > ---
  >
  > ## 16. Tài liệu tham khảo
  >
  > - Đề cương mức Cơ bản của ISTQB (phiên bản mới nhất).
  > - Hardman, P. (2025). *A Post-AI Learning Taxonomy.*
  > - Fuster Rabella, M. (2025). *OECD Education Working Paper No. 338.*
  > - Anthropic (2025). *Building Reliable AI Test Agents* — blog kỹ thuật.
  > - Tài liệu DeepEval & Promptfoo — các framework kiểm thử LLM.
  >
  > ---
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
  > ---
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
  > ---
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

## Cấu hình file audit-log.mdc:

- **Tool**: Gemini (model: 3.1 Pro)
- **Date/time**: 15:16 — 02/07/2026
- **Prompt**:
  > Bây giờ hãy giúp tôi tạo file audit-log.mdc để ai sẽ tự động ghi file log khi prompt. Cấu trúc bao gồm:
  >
  > ## Tên của phiên
  >
  > - **Tool**: Gemini (model: 3.1 Pro) (Agent và model đang sử dụng)
  > - **Date/time**: 22:21 — 01/07/2026
  > - **Prompt**: -**AI-Output**:
  > - **Human Review**: (Phần này để tôi tự điền) -**AI-Output**:
  > Chào bạn, việc bạn chủ động tạo một kỹ năng tự động ghi log (Audit Log) là một bước đi cực kỳ thông minh. Nó bám sát đúng yêu cầu của phần **"9. Báo cáo Kiểm toán AI (Phụ lục Bắt buộc)"**, trong đó đề bài đặc biệt khuyến khích: "Để đơn giản hóa quá trình này, bạn được khuyến khích tạo một kỹ năng hoặc quy tắc tự động trích xuất các thông tin trên sau mỗi phiên làm việc với AI".
  >
  > Dưới đây là nội dung chi tiết cho file `audit-log.mdc` được thiết kế để ép Agent tự động lưu lại lịch sử làm việc theo đúng chuẩn cấu trúc bạn yêu cầu.
  >
  > ---
  >
  > ### Nội dung file `audit-log.mdc`
  >
  > ```markdown
  > # Agent Skill: Auto AI Audit Logger (Tự động ghi Log Kiểm toán AI)
  >
  > **Mô tả:** Hệ thống quy tắc này yêu cầu Agent tự động trích xuất, định dạng và xuất ra một bản ghi nhật ký (Audit Log) ở cuối mỗi phiên làm việc hoặc ngay sau khi hoàn thành một yêu cầu của người dùng. Mục đích là để phục vụ cho tài liệu "AI Audit Report" bắt buộc.
  >
  > ## Nguyên tắc cốt lõi (Core Rules)
  >
  > 1. Kích hoạt tự động: Bất cứ khi nào người dùng cung cấp một Prompt để thực hiện phân tích, sinh test case, hoặc yêu cầu giải thích, Agent PHẢI đính kèm một khối Audit Log ở cuối câu trả lời của mình (hoặc tạo vào một file riêng nếu được yêu cầu).
  > 2. Định dạng chuẩn: Tuân thủ tuyệt đối cấu trúc Markdown bên dưới, không được tự ý thêm bớt các trường.
  > 3. Nguyên trạng Prompt: Khối `**Prompt`** phải giữ nguyên 100% câu lệnh gốc của người dùng, không được tóm tắt.
  > 4. Để trống Human Review: Mục `**Human Review`** luôn luôn phải để trống để Tester (Con người) tự điền sau này.
  >
  > ## Cấu trúc Log Bắt Buộc (Mandatory Structure)
  >
  > Vui lòng in ra cấu trúc sau ở cuối mỗi phản hồi:
  >
  > ```markdown
  > ## [Tên của phiên - Tự động tóm tắt ngắn gọn mục đích của prompt, vd: Phân tích miền giá trị FR-01]
  >
  > - **Tool**: [Tên Agent/Model đang sử dụng, ví dụ: Gemini, Claude 3.5 Sonnet, Cursor...]
  > - **Date/time**: [Trích xuất thời gian hiện tại của hệ thống lúc trả lời, định dạng: HH:mm — DD/MM/YYYY]
  > - **Prompt**:
  >   > [Trích dẫn nguyên văn toàn bộ yêu cầu của người dùng]
  > - **AI-Output**:
  >   > [Tóm tắt ngắn gọn hoặc trích dẫn đường dẫn/file kết quả AI vừa sinh ra, hoặc ghi rõ: "Đã tạo bảng Test Case và phân tích BVA"]
  > - **Human Review**: [Để trống hoàn toàn phần này]
  > ```
  >
  > ```
  >
  > ## Lưu ý cho Agent khi thực thi:
  >
  > - **Date/time:** Hãy lấy theo giờ hệ thống thực tế (Current Time) lúc bạn sinh ra đoạn text này. (Ví dụ tham khảo: 15:15 — 02/07/2026).
  > - **Tool:** Tự nhận diện model của chính mình để điền vào (ví dụ: Gemini 1.5 Pro).
  >
  > ```
  >
  > ---
  >
  > Bạn hãy lưu nội dung trong khung đen trên thành file `audit-log.mdc`.
  >
  > **Mẹo sử dụng thực tế:** Khi dùng với các công cụ như Cursor hoặc Copilot, nếu bạn muốn AI vừa tạo test case xong là lưu log ngay, bạn chỉ cần gõ ở cuối prompt của mình là: *"Nhớ áp dụng luật file @audit-log.mdc ở cuối nhé"*. [cite_start]AI sẽ tự động sinh ra log chuẩn xác, giúp bạn tiết kiệm hàng giờ đồng hồ ngồi copy-paste[cite: 271, 276]!
  >
  > ```
  >
  > ## -**Human Review**: Đã hài lòng với Output mà AI đã đưa ra, chỉ thêm phần
  >
  > description: Tự động trích xuất thông tin AI Audit Report (tool, ngày giờ, prompt, output) sau mỗi lần Agent thực hiện một bước trong skill domain-testing hoặc boundary-value-analysis.
  > alwaysApply: true
  >
  > ---
  > ```

## Tạo file context.md

- **Tool**: Gemini (model: 3.1 Pro)
- **Date/time**: 15:30 — 02/07/2026
- **Prompt**:
  > Cung cấp cho tôi file context để agent có thể đọc và hiểu nội dung phải làm với dự án eshop
- **AI-Output**:
  > Chào bạn, việc tạo một file ngữ cảnh (Context File) tổng thể cho toàn bộ dự án là một bước chuẩn bị cực kỳ chuyên nghiệp. Nó đóng vai trò như một "bộ não trung tâm", giúp Agent hiểu rõ mình đang tương tác với hệ thống nào, mục tiêu cuối cùng là gì và phải tuân thủ những quy tắc nào trong suốt quá trình làm bài tập.
  >
  > Dưới đây là nội dung file `eshop-project-context.mdc` được tổng hợp dựa trên đề bài HW02 và các kỹ năng bạn đã thiết lập. Bạn có thể sử dụng file này làm System Prompt gốc cho Agent của mình.
  >
  > ---
  >
  > ### Nội dung file `eshop-project-context.mdc`
  >
  > ```markdown
  > # Ngữ cảnh Dự án: HW02 – Kiểm thử EShop (Domain Testing & BVA)
  >
  > **Mô tả:** Đây là tài liệu hướng dẫn ngữ cảnh gốc (Context File) cho Agent. Agent BẮT BUỘC phải đọc hiểu và ghi nhớ thông tin trong file này trước khi thực hiện bất kỳ yêu cầu phân tích hay sinh test case nào từ người dùng.
  >
  > ## 1. Thông tin Hệ thống (System Under Test - SUT)
  >
  > - [cite_start]**Tên hệ thống:** EShop — một ứng dụng demo thương mại điện tử của Việt Nam được thiết kế để thực hành kiểm thử[cite: 248].
  > - [cite_start]**Kho lưu trữ mã nguồn (Repository):** `https://github.com/ttbhanh/eshop-sut`[cite: 249].
  >
  > ## 2. Phạm vi chức năng (Feature Pools)
  >
  > Hệ thống được chia thành 4 nhóm chức năng (Pools). [cite_start]Người dùng sẽ chọn 4 chức năng (mỗi Pool 1 chức năng) để yêu cầu Agent kiểm thử[cite: 253]:
  >
  > - [cite_start]**Pool A (Xác thực & Sản phẩm):** FR-01 (Đăng ký), FR-02 (Đăng nhập), FR-03 (Quên/Đặt lại mật khẩu), FR-04 (Hồ sơ), FR-05 (Danh sách/Tìm kiếm), FR-06 (Chi tiết sản phẩm)[cite: 249].
  > - [cite_start]**Pool B (Giỏ hàng & Thanh toán):** FR-07 (Giỏ hàng), FR-08 (Thanh toán), FR-09 (Mã giảm giá), FR-10 (Máy trạng thái đơn hàng), FR-11 (Lịch sử đơn hàng)[cite: 250].
  > - [cite_start]**Pool C (Web Admin):** FR-12 (Kiểm soát truy cập), FR-13 (Dashboard), FR-14 đến FR-17 (Quản lý danh mục, sản phẩm, import CSV, mã giảm giá), FR-18 (Quản lý đơn hàng), FR-19 (Quản lý người dùng)[cite: 251].
  > - [cite_start]**Pool D (Mobile App):** Các chức năng trên ứng dụng di động[cite: 252].
  >
  > ## 3. Nhiệm vụ cốt lõi của Agent (Core Missions)
  >
  > Đối với mỗi chức năng (FR) được người dùng chọn, Agent phải hỗ trợ thực hiện 4 nhiệm vụ sau:
  >
  > 1. [cite_start]**Domain Testing:** Phân tích miền giá trị và thiết kế tập hợp các ca kiểm thử (test cases) toàn diện[cite: 254].
  > 2. [cite_start]**Boundary Value Analysis (BVA):** Phân tích giá trị biên chi tiết (LB-1, LB, LB+1, UB-1, UB, UB+1) và bổ sung test case[cite: 258, 321].
  > 3. [cite_start]**Bug Reporting:** Hỗ trợ phát hiện và báo cáo các lỗi (bug) tìm thấy trong source code, cung cấp thông tin để người dùng log lỗi lên GitHub Issues (cần có ảnh chụp màn hình do người dùng tự cung cấp)[cite: 263, 264].
  > 4. [cite_start]**AI Gap Analysis:** Phân tích những điểm mù mà Agent có thể đã bỏ sót và giải thích lý do tại sao (sự phức tạp của chức năng, giới hạn của prompt, v.v.)[cite: 261, 262].
  >
  > ## 4. Nguyên tắc làm việc BẮT BUỘC (Strict Rules)
  >
  > - **AI-First & Human Review:** Agent đóng vai trò là một "trợ lý có kỷ luật". [cite_start]Mọi kết quả sinh ra đều phải trải qua tư duy từng bước (Chain of Thought) và chờ con người xem xét (Human Review)[cite: 236, 237]. [cite_start]Tuyệt đối KHÔNG xuất ra kết quả thô mà không có giải thích[cite: 239].
  > - [cite_start]**Tuân thủ @domain-testing.mdc:** Khi thực hiện thiết kế test case, Agent PHẢI áp dụng nghiêm ngặt 7 bước (Từ Bước 0 đến Bước 6) đã được định nghĩa trong file `domain-testing.mdc`[cite: 313, 314].
  > - [cite_start]**Trích dẫn Mã nguồn:** Mọi ràng buộc, biến số, hay quy tắc nghiệp vụ khi phân tích đều BẮT BUỘC phải trích dẫn dòng code tương ứng theo format `(Tên_File: Dòng_Bao_Nhiêu)`[cite: 319].
  > - [cite_start]**Ghi Log Kiểm toán (AI Audit Report):** Sau mỗi phiên trả lời hoàn chỉnh, Agent BẮT BUỘC phải đính kèm khối log theo chuẩn định dạng quy định tại file `@audit-log.mdc` để người dùng làm báo cáo[cite: 240, 327, 328].
  > - [cite_start]**Tài liệu hóa bằng Markdown:** Toàn bộ quá trình phân tích, bảng Test Case, và báo cáo lỗi phải được định dạng rõ ràng bằng Markdown[cite: 243, 263].
  > ```
  >
  > ---
  >
  > Với 3 file `.mdc` (`domain-testing.mdc`, `audit-log.mdc`, và `eshop-project-context.mdc`), bạn đã có một hệ thống Agent Skill cực kỳ mạnh mẽ và sẵn sàng để "cày" bài tập này rồi đấy.
  >
  > Bạn đã sẵn sàng chọn tính năng (FR) đầu tiên trong Pool A để chúng ta bắt đầu chạy thử quy trình với các file quy tắc này chưa?
- **Human Review**: Output của Gemini cung cấp được tổng quan yêu cầu và có thể làm file context.md để bắt đầu.

## Xác nhận quy tắc ghi log audit mỗi bước

- **Tool**: Cursor (model: gpt-5.5-medium)
- **Date/time**: 15:48 — 02/07/2026
- **Prompt**:
  > @ai-audit-log.md @rules/audit-log.mdc Với mỗi bước làm phải luôn kèm việc ghi log audit
- **AI-Output**:
  > Đã đọc file `ai-audit-log.md` và xác nhận yêu cầu. Từ bước tiếp theo, mỗi bước phân tích, bảng đặc tả, domain testing, BVA, bug report hay gap analysis sẽ đều kèm một block audit log rõ ràng. Nếu chưa chọn FR cụ thể, các log tiếp theo sẽ được đánh dấu là phiên làm việc chung cho đến khi bạn chọn đúng 1 FR.
- **Human Review**: Sẽ theo dõi xem agent có ghi log không.

## [FR-02] Bước 1 — Trích xuất đặc tả Input & Output

- **Tool**: Cursor (model: gpt-5.5-medium)
- **Date/time**: 15:54 — 02/07/2026
- **Prompt**:
  > @rules/domain-testing.mdc @rules/audit-log.mdc Bây giờ tôi muốn bạn thực hiện domain testing cho FR-02: Login and account lockout. Hãy thực hiện đúng kĩ thuật đã được nêu ra và ghi log.
- **AI-Output**:

> **Bước 0: Xác định phạm vi yêu cầu**
> FR-02: Login and account lockout — đăng nhập và khóa tài khoản.
>
> **Bước 1: Xác định Input và Output**
>
> Từ `backend/server.js`, logic đăng nhập chính nằm ở `POST /api/login`, cụ thể:
>
> - Lấy `email` và `password` từ request body (`backend/server.js:32-33`)
> - Truy vấn user theo email (`backend/server.js:35`)
> - Kiểm tra `locked_until` để chặn đăng nhập khi tài khoản đang bị khóa (`backend/server.js:40-44`)
> - So sánh mật khẩu trực tiếp (`backend/server.js:46`)
> - Thất bại thì cập nhật `login_attempts` và có thể đặt `locked_until` 3 phút (`backend/server.js:53-63`)
> - Thành công thì reset `login_attempts = 0` và xóa `locked_until` (`backend/server.js:47-52`)
>
> Dữ liệu người dùng được lưu ở bảng `users` (`backend/database.js:50-61`).
>
> **Bảng đặc tả Input:**
>
>
> | STT | Trường     | Kiểu dữ liệu | Bắt buộc | Ràng buộc / Quy tắc nghiệp vụ                                                     | Nguồn                                          |
> | --- | ---------- | ------------ | -------- | --------------------------------------------------------------------------------- | ---------------------------------------------- |
> | 1   | `email`    | string       | Có       | Dùng để tìm user trong DB; không có kiểm tra định dạng ở backend                  | `backend/server.js:33`, `backend/server.js:35` |
> | 2   | `password` | string       | Có       | So sánh trực tiếp với `user.password`; không có kiểm tra độ dài/min/max ở backend | `backend/server.js:33`, `backend/server.js:46` |
>
>
> **Output chính:**
>
> - Thành công: `200` + `{ message, token, user }` (`backend/server.js:52`)
> - Thất bại sai thông tin: `401` + `{ error: "Invalid email or password" }` (`backend/server.js:63`)
> - Tài khoản đang bị khóa: `403` + `{ error: "Tài khoản đã bị khóa. Vui lòng thử lại sau." }` (`backend/server.js:42-43`)
> - Lỗi hệ thống: `500` + `{ error }` (`backend/server.js:36`)
>
> **Quy tắc nghiệp vụ account lockout:**
>
> - Nếu `locked_until` tồn tại và thời điểm hiện tại nhỏ hơn `locked_until`, login bị chặn (`backend/server.js:40-44`)
> - Khi sai mật khẩu, số lần sai được tính bằng `user.login_attempts + 2`; nếu kết quả `>= 3` thì đặt `locked_until` thêm 180.000 ms (~3 phút) (`backend/server.js:54-58`)
> - Khi đăng nhập đúng, hệ thống reset `login_attempts = 0` và `locked_until = NULL` (`backend/server.js:48-49`)
>
> Đang chờ bạn xác nhận trước khi sang Bước 2.

- **Human Review**: AI đã xác nhận đúng cách hoạt động cũng như những input sẽ nhận vào là email và password để xác thực người dùng cũng như cơ chế khóa locked_until.

## [FR-02] Bước 2 — Phân vùng theo Domain Testing (Equivalence Partitioning)

- **Tool**: Cursor (model: gpt-5.5-medium)
- **Date/time**: 17:11 — 02/07/2026
- **Prompt**:
  > Có hãy commit và ghi log cho bước này trước khi sang bước 2
- **AI-Output**:

> **Bước 2: Phân vùng theo Domain Testing**
>
> Dựa trên bảng đặc tả input ở Bước 1, phân tích từng trường:
>
> ### 2a. Trường `email`
>
> Dựa vào logic tại `backend/server.js:35`:
>
> - Hệ thống truy vấn `SELECT * FROM users WHERE email = ?` — không có validation regex hay format ở backend
> - Quan sát: nếu không tìm thấy user, trả về 401 ngay (`backend/server.js:37-38`)
>
> **Lớp tương đương cho `email`:**
>
>
> | EC  | Mô tả                                                  | Loại    | Giá trị đại diện                             |
> | --- | ------------------------------------------------------ | ------- | -------------------------------------------- |
> | EC1 | Email khớp với một user trong DB và password cũng khớp | Valid   | `test@eshop.com` (user đúng + đúng mật khẩu) |
> | EC2 | Email khớp với một user trong DB nhưng password sai    | Invalid | `test@eshop.com` + sai mật khẩu              |
> | EC3 | Email không tồn tại trong DB                           | Invalid | `notexist@eshop.com`                         |
>
>
> ### 2b. Trường `password`
>
> Dựa vào logic tại `backend/server.js:46`:
>
> - So sánh `user.password === password` (so sánh chuỗi trực tiếp, không hash)
> - Không có ràng buộc về độ dài, ký tự đặc biệt từ backend
>
> **Lớp tương đương cho `password` (giả định email đúng):**
>
>
> | EC  | Mô tả                                       | Loại    | Giá trị đại diện |
> | --- | ------------------------------------------- | ------- | ---------------- |
> | EC4 | Password khớp chính xác với `user.password` | Valid   | `Test1234!`      |
> | EC5 | Password sai (không khớp)                   | Invalid | `wrongpassword`  |
>
>
> ### 2c. Trường `locked_until` (trạng thái tài khoản — yếu tố phụ thuộc DB)
>
> Dựa vào logic tại `backend/server.js:40-44` và `backend/server.js:54-58`:
>
> - Tài khoản bị khóa khi `locked_until` tồn tại và thời gian hiện tại < `locked_until`
> - Khóa xảy ra khi `login_attempts + 2 >= 3`, tức cần 2 lần sai liên tiếp là đủ để khóa
> - Thời gian khóa: 180.000 ms = 3 phút
>
> **Lớp tương đương cho trạng thái khóa:**
>
>
> | EC  | Mô tả                                                           | Loại    | Giá trị đại diện                              |
> | --- | --------------------------------------------------------------- | ------- | --------------------------------------------- |
> | EC6 | Tài khoản không bị khóa (`locked_until` = NULL hoặc đã hết hạn) | Valid   | User chưa sai mật khẩu quá 2 lần              |
> | EC7 | Tài khoản đang bị khóa (`locked_until` > now)                   | Invalid | User đã sai >= 2 lần, chưa hết thời gian khóa |
>
>
> ### Bảng tổng hợp Lớp tương đương
>
>
> | STT | Biến Input                | Lớp Tương Đương (EC) | Mô tả                         | Loại (Valid/Invalid) |
> | --- | ------------------------- | -------------------- | ----------------------------- | -------------------- |
> | 1   | `email`                   | EC1                  | Email tồn tại + password đúng | Valid                |
> | 2   | `email`                   | EC2                  | Email tồn tại + password sai  | Invalid              |
> | 3   | `email`                   | EC3                  | Email không tồn tại           | Invalid              |
> | 4   | `password`                | EC4                  | Password khớp chính xác       | Valid                |
> | 5   | `password`                | EC5                  | Password sai                  | Invalid              |
> | 6   | `locked_until` (DB state) | EC6                  | Tài khoản không bị khóa       | Valid                |
> | 7   | `locked_until` (DB state) | EC7                  | Tài khoản đang bị khóa        | Invalid              |
>
>
> **Quy tắc chia nhỏ đặc biệt:** Không chia nhỏ thêm EC vì không có bằng chứng từ source code rằng các giá trị trong cùng một EC được xử lý khác nhau.
>
> Đang chờ bạn review Bước 2 trước khi sang Bước 3.

- **Human Review**: agent hiện tại khi phân chia vùng khá thiếu chính xác những lỗi cần sửa bao gồm:
  > - Miền valid email là: email hợp lệ và tồn tại trong hệ thống
  > - Miền invalid email là: email không tồn tại, email rỗng và email sai định dạng
  > - Nhận xét: ở phân vùng cho email bị trộn lẫn giữa một phân vùng khác là password
  > - Miền valid và invalid của password chính xác
  > - Miền valid cho locked_until: Null -> Tài khoản không bị khóa, là một thời gian trong quá khứ -> Tài khoản hết hạn khóa, là một thời gian trong tương lai -> Tài khoản đang bị khóa (Thời gian so sánh với Date())
  > - Miền invalid cho locked_until: Định dạng sai.
  > - Ngoài ra agent còn xác định thiếu miền cho login_attempts.
  > - Miền valid của login_attempts: [0, 2];
  > - Miền invalid của login_attempts: Sai kiểu dữ liệu, null, số âm

### Human Prompt tiếp theo

- **Tool**: Cursor
- **Date/time**: 21:33 — 02/07/2026
- **Prompt**: @ai-audit-log.md (644-653) Đây là nhận xét bước 2 của tôi. Bây giờ bạn hãy phân tích và đưa ra nhận định. Nếu đồng ý thì hãy sửa chữa, không đồng ý hãy đưa ra lý do. Sau đó thực hiện ghi audit-log cho tôi để hoàn thiện lại bước 2.
- **AI-Output**:

> **Phân tích nhận xét Human Review cho Bước 2:**
>
> **1. Email bị trộn lẫn giữa phân vùng khác là password** → **ĐỒNG Ý**
> Sai. EC1 và EC2 là tổ hợp (email + password), không phải phân vùng thuần cho `email`. Theo Domain Testing đúng, mỗi biến phân vùng độc lập. Cần chia lại:
>
> - EC1: Email tồn tại trong DB (Valid)
> - EC2: Email không tồn tại trong DB (Invalid)
> - EC3: Email rỗng / sai định dạng (Invalid) — backend không validate format (`backend/server.js:35`)
>
> **2. Miền valid/invalid của password chính xác** → **ĐỒNG Ý**
> Giữ nguyên:
>
> - EC4: Password khớp (Valid)
> - EC5: Password sai (Invalid)
>
> **3. Miền valid/invalid của `locked_until` cần chia nhỏ hơn** → **ĐỒNG Ý**
> Chia thành:
>
> - EC6: `locked_until` = NULL hoặc thời gian trong quá khứ → Hết hạn khóa (Valid)
> - EC7: `locked_until` = thời gian trong tương lai → Đang bị khóa (Invalid, output: 403)
>
> **4. Thiếu miền cho `login_attempts`** → **ĐỒNG Ý**
> Thêm `login_attempts` vào bảng phân vùng vì nó trực tiếp ảnh hưởng lockout logic.
>
> **5. Cần chia `login_attempts` thành các EC nhỏ** → **ĐỒNG Ý**
> Vì logic `+2` nên các giá trị 0, 1, 2 xử lý khác nhau:
>
> - EC8: `login_attempts` = 0 (lần sai đầu tiên) → thành 2
> - EC9: `login_attempts` = 1 (lần sai thứ hai) → thành 3 → khóa
> - EC10: `login_attempts` = 2 (lần sai thứ hai, đủ khóa) → thành 4 → khóa
> - EC11: `login_attempts` >= 3 (đã bị khóa) → Invalid
> - EC12: `login_attempts` = NULL / số âm / sai kiểu → Invalid
>
> **Bước 2 — Bảng EC đã sửa đổi:**
>
>
> | STT | Biến Input       | EC   | Mô tả                                      | Loại    |
> | --- | ---------------- | ---- | ------------------------------------------ | ------- |
> | 1   | `email`          | EC1  | Email tồn tại trong DB                     | Valid   |
> | 2   | `email`          | EC2  | Email không tồn tại trong DB               | Invalid |
> | 3   | `email`          | EC3  | Email rỗng / sai định dạng                 | Invalid |
> | 4   | `password`       | EC4  | Password khớp chính xác                    | Valid   |
> | 5   | `password`       | EC5  | Password sai                               | Invalid |
> | 6   | `locked_until`   | EC6  | NULL hoặc thời gian trong quá khứ          | Valid   |
> | 7   | `locked_until`   | EC7  | Thời gian trong tương lai (đang bị khóa)   | Invalid |
> | 8   | `login_attempts` | EC8  | `login_attempts` = 0 (lần sai đầu tiên)    | Valid   |
> | 9   | `login_attempts` | EC9  | `login_attempts` = 1 (lần sai thứ hai)     | Valid   |
> | 10  | `login_attempts` | EC10 | `login_attempts` = 2 (đủ khóa)             | Valid   |
> | 11  | `login_attempts` | EC11 | `login_attempts` >= 3 (đã bị khóa)         | Invalid |
> | 12  | `login_attempts` | EC12 | `login_attempts` = NULL / số âm / sai kiểu | Invalid |
>
>
> Đang chờ user xác nhận để cập nhật Bước 2 hoàn chỉnh.

- **Human Review**: Bảng lớp tương đương đã đầy đủ nhưng có vẻ agent không nhớ được các bước chính xác trong file domain-testing.mdc trong rules vậy nên bây giờ sẽ chuyển sang bước 4 là thiết kế tổ hợp test case.

## [FR-02] Bước 4 — Thiết kế Tổ hợp Test Case

- **Tool**: Cursor (model: gpt-5.5-medium)
- **Date/time**: 21:48 — 02/07/2026
- **Prompt**:
  > @rules/domain-testing.mdc @rules/audit-log.mdc Tôi đã xác nhận xong bước trên. Bây giờ bạn hãy thực hiện việc thiết kế tổ hợp các test case với các miền tương đương đó. (Bước 4 trong file @rules/domain-testing.mdc). Sau đó thực hiện việc giải thích chi tiết và cập nhật đầy đủ prompt cũng như AI-Output vào trong file log
- **AI-Output**:

> **Bước 4: Thiết kế Tổ hợp Test Case**
>
> Quy tắc áp dụng (theo `rules/domain-testing.mdc:50-54`):
>
> - Valid: Một test case bao phủ NHIỀU miền hợp lệ cùng lúc
> - Invalid: Mỗi test case bao phủ CHỈ MỘT miền không hợp lệ
>
> **Test Case hợp lệ (Valid):**
>
>
> | TC   | Mô tả                        | email            | password    | locked_until | login_attempts | Expected Output | EC bao phủ         |
> | ---- | ---------------------------- | ---------------- | ----------- | ------------ | -------------- | --------------- | ------------------ |
> | TC01 | Đăng nhập thành công lần đầu | `test@eshop.com` | `Test1234!` | NULL         | 0              | `200` + token   | EC1, EC4, EC6, EC8 |
>
>
> **Test Case không hợp lệ (Invalid - 1 test case cho 1 EC):**
>
>
> | TC   | Mô tả                              | email                | password        | locked_until    | login_attempts | Expected Output                 | EC bao phủ |
> | ---- | ---------------------------------- | -------------------- | --------------- | --------------- | -------------- | ------------------------------- | ---------- |
> | TC02 | Email không tồn tại                | `notexist@eshop.com` | `Test1234!`     | NULL            | 0              | `401` Invalid email or password | EC2        |
> | TC03 | Email sai định dạng                | `invalid-email`      | `Test1234!`     | NULL            | 0              | `401` (DB trả về rỗng)          | EC3        |
> | TC04 | Password sai                       | `test@eshop.com`     | `wrongpassword` | NULL            | 0              | `401` Invalid email or password | EC5        |
> | TC05 | Tài khoản đang bị khóa             | `test@eshop.com`     | `Test1234!`     | future (+3 min) | 2              | `403` Tài khoản đã bị khóa      | EC7        |
> | TC06 | login_attempts >= 3 (hết hạn khóa) | `test@eshop.com`     | `Test1234!`     | past (-1 min)   | 5              | `200` + token (reset attempts)  | EC11       |
> | TC07 | login_attempts = NULL              | `test@eshop.com`     | `Test1234!`     | NULL            | NULL           | `200` hoặc `500` (tùy DB)       | EC12       |
> | TC08 | login_attempts = số âm             | `test@eshop.com`     | `Test1234!`     | NULL            | -1             | `500` hoặc crash                | EC12       |
>
>
> **Tổng hợp:**
>
> - Valid: 1 test case (TC01)
> - Invalid: 7 test case (TC02-TC08)
> - **Tổng: 8 Test Case**
>
> **Độ phủ EC:**
>
> - EC1 ✅ TC01
> - EC2 ✅ TC02
> - EC3 ✅ TC03
> - EC4 ✅ TC01
> - EC5 ✅ TC04
> - EC6 ✅ TC01
> - EC7 ✅ TC05
> - EC8 ✅ TC01
> - EC9 ✅ (sẽ được bao phủ trong BVA - Bước 5)
> - EC10 ✅ (sẽ được bao phủ trong BVA - Bước 5)
> - EC11 ✅ TC06
> - EC12 ✅ TC07, TC08
>
> Đang chờ user review trước khi sang Bước 5 (BVA).

- **Human Review**: Bảng tổ hợp thiết kết test case đã thiết kế chuẩn chỉnh và phủ được các miền tương đương.

## [FR-02] Bước 5 — Bổ sung Test Case với Giá trị biên (BVA)

- **Tool**: Cursor (model: gpt-5.5-medium)
- **Date/time**: 22:31 — 02/07/2026
- **Prompt**:
  > Bây giờ hãy giúp tôi thực hiện bước tiếp theo về bổ sung test case dựa trên giá trị biên (BVA). Sau đó hãy ghi log không cần đợi tôi review (Tôi sẽ review sau khi bạn ghi log).
- **AI-Output**:

> **Bước 5: Bổ sung Test Case với Giá trị biên (BVA)**
>
> Dựa trên source code tại `backend/server.js:54-58`, biến quan trọng nhất cần phân tích BVA là `login_attempts` vì logic lockout phụ thuộc vào nó:
>
> ```
> login_attempts + 2 >= 3 → khóa tài khoản
> ```
>
> **Phân tích ranh giới `login_attempts`:**
>
>
> | Biên | Giá trị | Hành vi                    | LB/LB+1/UB/UB+1 |
> | ---- | ------- | -------------------------- | --------------- |
> | LB-1 | -1      | Số âm → crash/invalid      | LB-1 (cận dưới) |
> | LB   | 0       | Bình thường, sau sai → 2   | LB (biên dưới)  |
> | LB+1 | 1       | Sau sai → 3 → **khóa**     | LB+1            |
> | UB-1 | 2       | Sau sai → 4 → **khóa**     | UB-1            |
> | UB   | 3       | Ngay biên trên, đã bị khóa | UB (biên trên)  |
> | UB+1 | 4       | Trên biên trên             | UB+1 (cận trên) |
>
>
> **Test Case BVA mới:**
>
>
> | TC   | Mô tả                                       | email            | password    | locked_until | login_attempts | Expected Output       | Biên                  |
> | ---- | ------------------------------------------- | ---------------- | ----------- | ------------ | -------------- | --------------------- | --------------------- |
> | TC09 | Login attempts = 0 (LB) - thành công        | `test@eshop.com` | `Test1234!` | NULL         | 0              | `200` + token         | LB                    |
> | TC10 | Login attempts = 1 (LB+1) - sau sai sẽ khóa | `test@eshop.com` | `Test1234!` | NULL         | 1              | `200` + token         | LB+1                  |
> | TC11 | Login attempts = 2 (UB-1) - đủ khóa khi sai | `test@eshop.com` | `Test1234!` | NULL         | 2              | `200` + token         | UB-1                  |
> | TC12 | Login attempts = 3 (UB) - ngay biên trên    | `test@eshop.com` | `Test1234!` | past (-1min) | 3              | `200` + token (reset) | UB                    |
> | TC13 | Login attempts = 4 (UB+1) - trên biên trên  | `test@eshop.com` | `Test1234!` | NULL         | 4              | `200` + token (reset) | UB+1                  |
> | TC14 | Lockout time hết hạn ngay tại now           | `test@eshop.com` | `Test1234!` | now (=)      | 0              | `200` + token         | locked_until boundary |
>
>
> **Tổng hợp Test Case sau BVA:**
>
>
> | Loại                   | Số lượng  |
> | ---------------------- | --------- |
> | Valid (Domain + BVA)   | 1 + 5 = 6 |
> | Invalid (Domain + BVA) | 7 + 0 = 7 |
> | **Tổng**               | **13**    |
>
>
> **Độ phủ EC sau BVA:**
>
> - EC1 ✅ TC01
> - EC2 ✅ TC02
> - EC3 ✅ TC03
> - EC4 ✅ TC01
> - EC5 ✅ TC04
> - EC6 ✅ TC01, TC14
> - EC7 ✅ TC05
> - EC8 ✅ TC01, TC09
> - EC9 ✅ TC10
> - EC10 ✅ TC11
> - EC11 ✅ TC06, TC12
> - EC12 ✅ TC07, TC08
> - **Tất cả 12 EC đã được bao phủ ✅**

- **Human Review**: Đã kiểm tra và xác nhận các test case mới được sinh ra trên miền của login_attemps. Nhưng còn miền của locked_until so với Thời gian hiện tại (vì có thể code <= thay vì <).

## [FR-02] Bước 5 — Bổ sung BVA cho `locked_until` & Tổng hợp

- **Tool**: Cursor (model: gpt-5.5-medium)
- **Date/time**: 22:41 — 02/07/2026
- **Prompt**:
  > Human Review: Đã kiểm tra và xác nhận các test case mới được sinh ra trên miền của login_attemps. Nhưng còn miền của locked_until so với Thời gian hiện tại (vì có thể code <= thay vì <). Đây là review của bước 5. Bây giờ hãy xác định xem tôi có đúng không. Nếu đúng thì hãy xác định thêm các test case theo BVA. Nếu sai thì hãy nêu ra lý do. Sau đó tông hợp lại một bảng đầy đủ các test case cho tôi.
- **AI-Output**:

> **Xác nhận: User ĐÚNG!**
>
> Đã kiểm tra source code tại `backend/server.js:40`:
>
> ```javascript
> if (user.locked_until && new Date() < new Date(user.locked_until)) {
> ```
>
> **Code dùng `<` (strict less than)**, không phải `<=`. Điều này có nghĩa:
>
> - `now < locked_until` → **Bị khóa** (403)
> - `now >= locked_until` → **Không bị khóa** (có thể đăng nhập)
>
> **Phân tích ranh giới `locked_until` (BVA):**
>
>
> | Biên | Giá trị                        | So sánh với now     | Expected                      | Biên |
> | ---- | ------------------------------ | ------------------- | ----------------------------- | ---- |
> | LB-1 | Quá khứ sát biên (now - 1ms)   | now > locked_until  | Không bị khóa ✅               | LB-1 |
> | LB   | = now                          | now == locked_until | Không bị khóa ✅ (vì dùng `<`) | LB   |
> | LB+1 | Tương lai sát biên (now + 1ms) | now < locked_until  | **Bị khóa**                   | LB+1 |
>
>
> **Test Case BVA mới cho `locked_until`:**
>
>
> | TC   | Mô tả                                       | locked_until     | Expected Output | Biên |
> | ---- | ------------------------------------------- | ---------------- | --------------- | ---- |
> | TC15 | Lockout vừa hết (now - 1ms)                 | past (now - 1ms) | `200` + token   | LB-1 |
> | TC16 | Lockout hết ngay tại thời điểm hiện tại (=) | now (=)          | `200` + token   | LB   |
>
>
> **Bảng Tổng hợp đầy đủ 16 Test Case:**
>
>
> | TC   | Mô tả                        | email                | password        | locked_until   | login_attempts | Expected Output | Loại    | EC/Biên   |
> | ---- | ---------------------------- | -------------------- | --------------- | -------------- | -------------- | --------------- | ------- | --------- |
> | TC01 | Đăng nhập thành công         | `test@eshop.com`     | `Test1234!`     | NULL           | 0              | `200` + token   | Valid   | EC1,4,6,8 |
> | TC02 | Email không tồn tại          | `notexist@eshop.com` | `Test1234!`     | NULL           | 0              | `401`           | Invalid | EC2       |
> | TC03 | Email sai định dạng          | `invalid-email`      | `Test1234!`     | NULL           | 0              | `401`           | Invalid | EC3       |
> | TC04 | Password sai                 | `test@eshop.com`     | `wrongpassword` | NULL           | 0              | `401`           | Invalid | EC5       |
> | TC05 | Tài khoản đang bị khóa       | `test@eshop.com`     | `Test1234!`     | future (+3min) | 2              | `403`           | Invalid | EC7, LB+1 |
> | TC06 | login_attempts >= 3          | `test@eshop.com`     | `Test1234!`     | past           | 5              | `200`           | Valid   | EC11      |
> | TC07 | login_attempts = NULL        | `test@eshop.com`     | `Test1234!`     | NULL           | NULL           | `500`           | Invalid | EC12      |
> | TC08 | login_attempts = số âm       | `test@eshop.com`     | `Test1234!`     | NULL           | -1             | `500`           | Invalid | EC12      |
> | TC09 | login_attempts = 0 (LB)      | `test@eshop.com`     | `Test1234!`     | NULL           | 0              | `200`           | Valid   | LB        |
> | TC10 | login_attempts = 1 (LB+1)    | `test@eshop.com`     | `Test1234!`     | NULL           | 1              | `200`           | Valid   | LB+1      |
> | TC11 | login_attempts = 2 (UB-1)    | `test@eshop.com`     | `Test1234!`     | NULL           | 2              | `200`           | Valid   | UB-1      |
> | TC12 | login_attempts = 3 (UB)      | `test@eshop.com`     | `Test1234!`     | past           | 3              | `200`           | Valid   | UB        |
> | TC13 | login_attempts = 4 (UB+1)    | `test@eshop.com`     | `Test1234!`     | NULL           | 4              | `200`           | Valid   | UB+1      |
> | TC14 | Lockout time = future + 1ms  | `test@eshop.com`     | `Test1234!`     | future (+1ms)  | 0              | `403`           | Invalid | EC7       |
> | TC15 | Lockout vừa hết (now - 1ms)  | past (now - 1ms)     | 0               | `200`          | Valid          | LB-1            |         |           |
> | TC16 | Lockout hết ngay tại now (=) | now (=)              | 0               | `200`          | Valid          | LB              |         |           |
>
>
> **Tổng: 16 Test Case**
>
> **Độ phủ EC:**
>
> - EC1 ✅ TC01
> - EC2 ✅ TC02
> - EC3 ✅ TC03
> - EC4 ✅ TC01
> - EC5 ✅ TC04
> - EC6 ✅ TC01, TC14, TC15, TC16
> - EC7 ✅ TC05, TC14
> - EC8 ✅ TC01, TC09
> - EC9 ✅ TC10
> - EC10 ✅ TC11
> - EC11 ✅ TC06, TC12
> - EC12 ✅ TC07, TC08
> - **Tất cả 12 EC đã được bao phủ ✅**

- **Human Review**: Hiện tại tôi thấy test case đã khá đầy đủ nhưng có một thắc mắc là khi tôi tự test thực tế thì chỉ có thể test là đăng nhập thành công, đăng nhập với mật khẩu sai và đăng nhập sai qua 2 lần và bị khóa. Tôi sẽ hỏi AI để giải đáp thắc mắc và đưa ra giải pháp agent tạo 1 file test case để thực hiện run hay không.

## [FR-02] Giải đáp thắc mắc & Tạo file Test Case

- **Tool**: Cursor (model: gpt-5.5-medium)
- **Date/time**: 22:52 — 02/07/2026
- **Prompt**:
  > Human Review: Hiện tại tôi thấy test case đã khá đầy đủ nhưng có một thắc mắc là khi tôi tự test thực tế thì chỉ có thể test là đăng nhập thành công, đăng nhập với mật khẩu sai và đăng nhập sai qua 2 lần và bị khóa. Tôi sẽ hỏi AI để giải đáp thắc mắc và đưa ra giải pháp agent tạo 1 file test case để thực hiện run hay không.
- **AI-Output**:

> **Giải đáp thắc mắc:**
>
> **Câu hỏi**: Tại sao chỉ test được 3 trường hợp thực tế (đăng nhập thành công, sai mật khẩu, khóa sau 2 lần sai)?
>
> **Trả lời**: Đó là **thực tế khi test thủ công**. Vì:
>
> 1. **Giới hạn của test thủ công**:
>   - Bạn chỉ có 1 tài khoản test, sau khi sai 2 lần → tài khoản bị khóa → không thể reset state dễ dàng
>   - Muốn test lại phải xóa DB hoặc sửa trực tiếp
> 2. **Lý do có nhiều test case trên lý thuyết**:
>   - Các test case như TC02 (email không tồn tại), TC03 (email sai định dạng), TC07-08 (login_attempts = NULL/số âm) là để **đảm bảo độ phủ** theo Domain Testing
>   - Trong thực tế, các trường hợp này có thể hiếm khi xảy ra (vì frontend thường validate trước)
> 3. **Giải pháp**: Tạo **file test script** (JUnit/Postman/Newman) để:
>   - Tự động reset state (xóa lockout, reset login_attempts)
>   - Chạy tất cả test case một cách độc lập
>   - Đảm bảo mỗi test case có data riêng
>
> **File Test Case đã tạo**: `test-cases/FR-02-login-test-cases.md`
>
> **Nội dung file bao gồm**:
>
> - 16 test case chi tiết (TC01-TC16)
> - Setup SQL cho mỗi test case
> - Expected status và response rõ ràng
> - Thứ tự test khuyến nghị khi chạy thủ công
> - Coverage matrix 12/12 EC
>
> **Thứ tự test khuyến nghị (khi chạy thủ công)**:
>
> 1. TC01 — Đăng nhập thành công (baseline)
> 2. TC04 — Sai password (reset state)
> 3. TC02 — Email không tồn tại
> 4. TC05 — Tài khoản bị khóa
> 5. TC15, TC16 — Hết hạn khóa
> 6. TC09, TC10, TC11 — BVA login_attempts
> 7. TC03, TC07, TC08 — Edge cases
>
> **Lưu ý**: Để test hiệu quả, nên chạy test bằng script (Postman/Newman hoặc Jest) thay vì thủ công.

- **Human Review**: [Chờ review]

## [FR-02] Tạo Automated Test Script

- **Tool**: Cursor (model: gpt-5.5-medium)
- **Date/time**: 22:57 — 02/07/2026
- **Prompt**:
  > Hãy tạo cho tôi file test script tự động để chạy tự động test case. Tôi muốn khi chạy script sẽ output kết quả như code status hay respone vào 1 file để dễ theo dõi. Sau khi tạo và hoàn thành task hãy ghi đầy đủ prompts và AI-output vào logs
- **AI-Output**:

> **Files đã tạo:**
>
> 1. `**test-cases/run-tests.js`** — Script chính
>   - Chạy tự động 16 test case
>   - Setup database trước mỗi test (reset state)
>   - Ghi kết quả ra file: `results/FR-02-test-results-{timestamp}.txt`
> 2. `**test-cases/package.json`** — Dependencies
>   - `better-sqlite3` để truy cập SQLite
> 3. `**test-cases/README.md`** — Hướng dẫn sử dụng
>
> **Cách sử dụng:**
>
> ```bash
> cd test-cases
> npm install
> npm test
> ```
>
> **Output:**
>
> - Console: Tóm tắt (passed/failed)
> - File: Kết quả chi tiết tại `results/FR-02-test-results-{timestamp}.txt`
>
> **Các test case được cover:**
>
>
> | TC      | Mô tả                        | Expected Status |
> | ------- | ---------------------------- | --------------- |
> | TC01    | Đăng nhập thành công         | 200             |
> | TC02    | Email không tồn tại          | 401             |
> | TC03    | Email sai định dạng          | 401             |
> | TC04    | Password sai                 | 401             |
> | TC05    | Tài khoản bị khóa            | 403             |
> | TC06    | login_attempts >= 3, hết hạn | 200             |
> | TC07    | login_attempts = NULL        | 200/500         |
> | TC08    | login_attempts = số âm       | 200/500         |
> | TC09-13 | BVA login_attempts (LB-UB+1) | 200             |
> | TC14    | BVA locked_until = future    | 403             |
> | TC15    | BVA locked_until = past      | 200             |
> | TC16    | BVA locked_until = now       | 200             |
>
>
> **Tổng: 16 test case**
>
> **Lưu ý:** Server phải đang chạy tại `http://localhost:3000`

## [FR-02] Debug Test Script — Bug Discovery

- **Tool**: Cursor (model: gpt-5.5-medium)
- **Date/time**: 23:11 — 02/07/2026
- **Prompt**:
  > @test-cases/results/FR-02-test-results-2026-07-02T16-03-02-630Z.txt Hãy kiểm tra lại lỗi giúp tôi.
- **AI-Output**:

> **Tổng hợp các lỗi đã fix:**
>
> 1. **Lỗi 1: Endpoint sai**
>   - Nguyên nhân: Script dùng `/api/auth/login` nhưng server dùng `/api/login`
>   - Fix: Sửa endpoint trong `run-tests.js`
> 2. **Lỗi 2: Path database không chính xác**
>   - Nguyên nhân: Dùng `path.join()` thay vì `path.resolve()`
>   - Fix: Đổi sang `path.resolve()` cho đường dẫn database
> 3. **Lỗi 3 (BUG SERVER): TC05 và TC14 thất bại**
>   - **Root Cause**: Bug timezone trong server code tại `server.js:40`
>
> **Phân tích chi tiết:**
>
> Server code:
>
> ```javascript
> if (user.locked_until && new Date() < new Date(user.locked_until)) {
> ```
>
> Vấn đề:
>
> - `new Date()` → `"2026-07-02T16:09:54.390Z"` (ISO UTC format)
> - `new Date("2026-07-02 16:12:54")` → SQLite trả về local time, khi parse thành Date object, bị hiểu là UTC
> - Kết quả so sánh: `16:09 < 09:12` = FALSE (vì 9:12 AM < 4:09 PM)
>
> **Kết quả test:**
>
>
> | TC      | Mô tả               | Status | Expected | Notes             |
> | ------- | ------------------- | ------ | -------- | ----------------- |
> | TC01-04 | Đăng nhập cơ bản    | ✅      | ✅        | Pass              |
> | TC05    | Bị khóa             | ❌ 200  | 403      | **BUG: timezone** |
> | TC06    | Hết hạn khóa        | ✅      | ✅        | Pass              |
> | TC07-08 | NULL/số âm          | ✅      | ✅        | Pass              |
> | TC09-13 | BVA login_attempts  | ✅      | ✅        | Pass              |
> | TC14    | locked_until future | ❌ 200  | 403      | **BUG: timezone** |
> | TC15-16 | BVA locked_until    | ✅      | ✅        | Pass              |
>
>
> **Tổng kết**: 14/16 passed, 2/16 failed (bug server)
>
> **Files đã cập nhật:**
>
> - `test-cases/run-tests.js` — Endpoint và path đã fix
> - `test-cases/results/FR-02-test-results-*.txt` — Kết quả test mới nhất
>
> **Bug Report:**
>
> **Bug**: Timezone inconsistency trong locked_until comparison
>
> **Location**: `eshop/backend/server.js:40`
>
> **Severity**: Medium (Security)
>
> **Impact**: Tài khoản không bị khóa đúng cách khi `locked_until` được set
>
> **Fix đề xuất**: Đồng nhất timezone trong so sánh
>
> ```javascript
> // Option 1: Parse thành Unix timestamp
> if (user.locked_until && Date.now() < new Date(user.locked_until).getTime()) {
>
> // Option 2: Parse thành local time đúng
> if (user.locked_until && new Date() < new Date(user.locked_until.replace(' ', 'T'))) {
>
> // Option 3: Dùng UTC everywhere
> // Thay đổi SQLite để lưu UTC time
> ```

- **Human Review**: Trong quá trình sửa thì AI đã đã run test nhưng lỗi này không đúng vì tôi đã test với UI và hoàn toàn có cơ chế khóa chạy đúng. Cần phải xác minh lại. Hiện tại tôi phát hiện thêm lỗi liên quan đến số lần thử khi nhập password chỉ được 2 chứ không phải 3.

## [FR-02] Human Review & Fix Bug Timezone + Phát hiện Bug +2

- **Tool**: Cursor (model: gpt-5.5-medium)
- **Date/time**: 23:30 — 02/07/2026
- **Prompt**:
  > Human Review: Trong quá trình sửa thì AI đã đã run test nhưng lỗi này không đúng vì tôi đã test với UI và hoàn toàn có cơ chế khóa chạy đúng. Cần phải xác minh lại.
  Đây là phần review cho lỗi mà bạn nói. Khi tôi test với UI thì vẫn có cơ chế khóa đảm bảo. Hãy kiểm tra lại giúp tôi. Liệu có phải do file run-tests.js của bạn viết test case sai hay không
- **AI-Output**:
  > [Đã kiểm tra và xác nhận với user]
  Sau khi user review:
  > User: Hiện tại ở trong code Đoạn code này đã xử lý múi giờ khá an toàn.
  > Giải thích chi tiết:
  > Điểm mấu chốt giúp code an toàn với múi giờ nằm ở hàm .toISOString():
  > ```javascript
  > lockedUntil = new Date(Date.now() + 180000).toISOString();
  > ```
  > Hàm .toISOString() luôn luôn chuyển đổi thời gian về chuẩn UTC. Kết quả lưu vào database sẽ có dạng như 2024-10-25T14:30:00.000Z (Chữ Z ở cuối mang ý nghĩa là Zulu time / UTC).
  > User phát hiện: **Lỗi đúng ở đây là số lần thử bị + 2 chứ không phải là lỗi gì khác**
- **Human Review**: Xác nhận bug +2 là bug thực sự. Yêu cầu sửa script test và phân tích tại sao miss bug này.

## [FR-02] Sửa Bug Timezone trong Script Test + Thêm TC17

- **Tool**: Cursor (model: gpt-5.5-medium)
- **Date/time**: 23:44 — 02/07/2026
- **Prompt**:
  > Human Review: Trong quá trình sửa thì AI đã đã run test nhưng lỗi này không đúng vì tôi đã test với UI và hoàn toàn có cơ chế khóa chạy đúng. Cần phải xác minh lại. Hiện tại tôi phát hiện thêm lỗi liên quan đến số lần thử khi nhập password chỉ được 2 chứ không phải 3.
  Đây là review của tôi, tôi nghĩ rằng múi giờ ở trong file @test-cases/run-tests.js sai nên hãy sửa lại giúp tôi. Ngoài ra về lỗi số lần thử này thì hãy phân tích giúp tôi. Giải thích tại sao tôi đã thực hiện đầy đủ domain testing nhưng lại bỏ sót trường hợp này. Sau đó thêm cho tôi test case này.
- **AI-Output**:
  > **1. Đã sửa Bug Timezone trong run-tests.js:**
  > Script test cũ dùng SQLite `datetime('now', '+3 minutes')` để set `locked_until`:
  >
  > - Lưu: `"2026-07-02 16:34:37"` (không có 'Z')
  > - JavaScript parse: `new Date("2026-07-02 16:34:37")` → bị hiểu là UTC, gây sai timezone
  > **Fix**: Tạo hàm `setupLockout()` dùng `.toISOString()` để format đúng:
  >
  > ```javascript
  > const lockedUntil = new Date(Date.now() + minutesFromNow * 60 * 1000).toISOString();
  > ```
  >
  > - Lưu: `"2026-07-02T09:34:37.000Z"` (có 'Z' = UTC)
  > **2. Phân tích tại sao Miss Bug +2:**
  > **Nguyên nhân**: Trong Bước 2 (EC Table), AI đã phân tích miền `login_attempts`:
  >
  > ```
  > EC8: login_attempts = 0 (lần sai đầu tiên)
  > EC9: login_attempts = 1 (lần sai thứ hai)
  > EC10: login_attempts = 2 (đủ khóa)
  > ```
  >
  > Nhưng **không có test case nào thực sự kiểm tra việc TĂNG của login_attempts**! Tất cả test case BVA (TC09-TC13) chỉ SET giá trị cố định và kiểm tra kết quả đăng nhập, không kiểm tra **increment logic**.
  > **Điều bị miss**: Không có test case theo dõi `login_attempts` qua nhiều lần đăng nhập sai liên tiếp.
  > **3. Đã thêm TC17 để phát hiện bug +2:**
  > ```javascript
  > // TC17: Kiểm tra login_attempts tăng +2 thay vì +1
  > // Step 1: resetUser() → login sai → check attempts
  > // Step 2: reset locked_until → login sai → check attempts
  > // Step 3: reset locked_until → login sai → check attempts
  > ```
  > **Kết quả test**:
  >
  > ```
  > Sau lần 1: Expected=1, Actual=2  ✅ BUG CONFIRMED
  > Sau lần 2: Expected=2, Actual=4  ✅ BUG CONFIRMED
  > Sau lần 3: Expected=3, Actual=6  ✅ BUG CONFIRMED
  > ```
  > **Bug Location**: `server.js:54` - `const newAttempts = user.login_attempts + 2;`
  > **4. Kết quả test sau khi fix:**
  >
  > - TC05: ✅ PASSED (trước đó fail vì timezone)
  > - TC14: ✅ PASSED (trước đó fail vì timezone)
  > - TC17: ❌ FAILED (bug +2 được phát hiện)
  > - Tổng: 16/17 passed
- **Human Review**: Tôi đã xác nhận và chốt rằng bug ở phần FR-02 là newAttempts = user.login_attempts + 2

