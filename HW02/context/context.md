# Ngữ cảnh Dự án: HW02 – Kiểm thử EShop (Domain Testing & BVA)

**Mô tả:** Đây là tài liệu hướng dẫn ngữ cảnh gốc (Context File) cho Agent. Agent BẮT BUỘC phải đọc hiểu và ghi nhớ thông tin trong file này trước khi thực hiện bất kỳ yêu cầu phân tích hay sinh test case nào từ người dùng.

## 1. Thông tin Hệ thống (System Under Test - SUT)

- [cite_start]**Tên hệ thống:** EShop — một ứng dụng demo thương mại điện tử của Việt Nam được thiết kế để thực hành kiểm thử[cite: 248].
- [cite_start]**Kho lưu trữ mã nguồn (Repository):** `https://github.com/ttbhanh/eshop-sut`[cite: 249].

## 2. Phạm vi chức năng (Feature Pools)

Hệ thống được chia thành 4 nhóm chức năng (Pools). [cite_start]Người dùng sẽ chọn 4 chức năng (mỗi Pool 1 chức năng) để yêu cầu Agent kiểm thử[cite: 253]:

- [cite_start]**Pool A (Xác thực & Sản phẩm):** FR-01 (Đăng ký), FR-02 (Đăng nhập), FR-03 (Quên/Đặt lại mật khẩu), FR-04 (Hồ sơ), FR-05 (Danh sách/Tìm kiếm), FR-06 (Chi tiết sản phẩm)[cite: 249].
- [cite_start]**Pool B (Giỏ hàng & Thanh toán):** FR-07 (Giỏ hàng), FR-08 (Thanh toán), FR-09 (Mã giảm giá), FR-10 (Máy trạng thái đơn hàng), FR-11 (Lịch sử đơn hàng)[cite: 250].
- [cite_start]**Pool C (Web Admin):** FR-12 (Kiểm soát truy cập), FR-13 (Dashboard), FR-14 đến FR-17 (Quản lý danh mục, sản phẩm, import CSV, mã giảm giá), FR-18 (Quản lý đơn hàng), FR-19 (Quản lý người dùng)[cite: 251].
- [cite_start]**Pool D (Mobile App):** Các chức năng trên ứng dụng di động[cite: 252].

## 3. Nhiệm vụ cốt lõi của Agent (Core Missions)

Đối với mỗi chức năng (FR) được người dùng chọn, Agent phải hỗ trợ thực hiện 4 nhiệm vụ sau:

1. [cite_start]**Domain Testing:** Phân tích miền giá trị và thiết kế tập hợp các ca kiểm thử (test cases) toàn diện[cite: 254].
2. [cite_start]**Boundary Value Analysis (BVA):** Phân tích giá trị biên chi tiết (LB-1, LB, LB+1, UB-1, UB, UB+1) và bổ sung test case[cite: 258, 321].
3. [cite_start]**Bug Reporting:** Hỗ trợ phát hiện và báo cáo các lỗi (bug) tìm thấy trong source code, cung cấp thông tin để người dùng log lỗi lên GitHub Issues (cần có ảnh chụp màn hình do người dùng tự cung cấp)[cite: 263, 264].
4. [cite_start]**AI Gap Analysis:** Phân tích những điểm mù mà Agent có thể đã bỏ sót và giải thích lý do tại sao (sự phức tạp của chức năng, giới hạn của prompt, v.v.)[cite: 261, 262].

## 4. Nguyên tắc làm việc BẮT BUỘC (Strict Rules)

- **AI-First & Human Review:** Agent đóng vai trò là một "trợ lý có kỷ luật". [cite_start]Mọi kết quả sinh ra đều phải trải qua tư duy từng bước (Chain of Thought) và chờ con người xem xét (Human Review)[cite: 236, 237]. [cite_start]Tuyệt đối KHÔNG xuất ra kết quả thô mà không có giải thích[cite: 239].
- [cite_start]**Tuân thủ @domain-testing.mdc:** Khi thực hiện thiết kế test case, Agent PHẢI áp dụng nghiêm ngặt 7 bước (Từ Bước 0 đến Bước 6) đã được định nghĩa trong file `domain-testing.mdc`[cite: 313, 314].
- [cite_start]**Trích dẫn Mã nguồn:** Mọi ràng buộc, biến số, hay quy tắc nghiệp vụ khi phân tích đều BẮT BUỘC phải trích dẫn dòng code tương ứng theo format `(Tên_File: Dòng_Bao_Nhiêu)`[cite: 319].
- [cite_start]**Ghi Log Kiểm toán (AI Audit Report):** Sau mỗi phiên trả lời hoàn chỉnh, Agent BẮT BUỘC phải đính kèm khối log theo chuẩn định dạng quy định tại file `@audit-log.mdc` để người dùng làm báo cáo[cite: 240, 327, 328].
- [cite_start]**Tài liệu hóa bằng Markdown:** Toàn bộ quá trình phân tích, bảng Test Case, và báo cáo lỗi phải được định dạng rõ ràng bằng Markdown[cite: 243, 263].
