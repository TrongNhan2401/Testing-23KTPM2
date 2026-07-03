# Ngữ cảnh Dự án: HW02 – Kiểm thử EShop (Domain Testing & BVA)

**Mô tả:** Đây là tài liệu hướng dẫn ngữ cảnh gốc (Context File) cho Agent. Agent BẮT BUỘC phải đọc hiểu và ghi nhớ thông tin trong file này trước khi thực hiện bất kỳ yêu cầu phân tích hay sinh test case nào từ người dùng.

## 0. Phạm vi FR được chọn

| Pool | FR | Tên chức năng | Ghi chú |
|------|-----|---------------|---------|
| A | FR-02 | Login and account lockout | ✅ Hoàn thành |
| B | FR-08 | Checkout (Thanh toán) | ⏳ Sắp thực hiện |
| C | FR-16 | Product import from CSV | ⏳ Sắp thực hiện |
| D | FR-04 | Personal profile management | ⏳ Sắp thực hiện |

---

## 1. Thông tin Hệ thống (System Under Test - SUT)

- **Tên hệ thống:** EShop — một ứng dụng demo thương mại điện tử của Việt Nam được thiết kế để thực hành kiểm thử.
- **Kho lưu trữ mã nguồn (Repository):** `https://github.com/ttbhanh/eshop-sut`
- **Kiểu test:** Functional Testing trên **UI** (giao diện người dùng)
- **Cách thức:** Script tự động để phát hiện bug → sau đó test thủ công trên UI để xác nhận

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

- **AI-First & Human Review:** Agent đóng vai trò là một "trợ lý có kỷ luật". Mọi kết quả sinh ra đều phải trải qua tư duy từng bước (Chain of Thought) và chờ con người xem xét (Human Review). Tuyệt đối KHÔNG xuất ra kết quả thô mà không có giải thích.
- **Cung cấp AI-Output ĐẦY ĐỦ (BẮT BUỘC):** Khi ghi log vào `ai-audit-log.md`, Agent PHẢI cung cấp đầy đủ toàn bộ nội dung AI-Output mà không được tóm tắt, bỏ bớt hay cắt ngắn bất kỳ phần nào. Nội dung ghi vào log phải giống hệt (100%) với những gì đã xuất ra cho người dùng, bao gồm tất cả code blocks, bảng, ví dụ, và chi tiết. Không được dùng cụm "tóm tắt" hay "chi tiết đã được rút gọn".
- **Tuân thủ @domain-testing.mdc:** Khi thực hiện thiết kế test case, Agent PHẢI áp dụng nghiêm ngặt các bước đã được định nghĩa trong file `domain-testing.mdc`.
- **Trích dẫn Mã nguồn:** Mọi ràng buộc, biến số, hay quy tắc nghiệp vụ khi phân tích đều BẮT BUỘC phải trích dẫn dòng code tương ứng theo format `(Tên_File: Dòng_Bao_Nhiêu)`.
- **Ghi Log Kiểm toán (AI Audit Report):** Sau mỗi phiên trả lời hoàn chỉnh, Agent BẮT BUỘC phải đính kèm khối log theo chuẩn định dạng quy định tại file `@audit-log.mdc` để người dùng làm báo cáo.
- **Tài liệu hóa bằng Markdown:** Toàn bộ quá trình phân tích, bảng Test Case, và báo cáo lỗi phải được định dạng rõ ràng bằng Markdown.
- **Functional Test trên UI:** Test thực hiện trên giao diện người dùng, không phải API. Script tự động chỉ để phát hiện và gợi ý, kết quả cuối cùng phải được xác nhận bằng test thủ công trên UI.

---

## 5. Quy trình Testing cho mỗi FR (2-Phase Approach)

### Phase 1: Automated Script (Phát hiện nhanh)
1. Phân tích source code để tìm inputs, outputs, state variables
2. Thiết kế test case bằng Domain Testing + BVA
3. Tạo automated script (Node.js/Puppeteer/Playwright) để phát hiện bug
4. Chạy script → ghi nhận kết quả (pass/fail)
5. **Output:** Danh sách bug tiềm năng

### Phase 2: Manual UI Testing (Xác nhận cuối cùng)
1. Mở trình duyệt → truy cập EShop UI
2. Thực hiện test case theo hướng dẫn trên UI thực tế
3. Chụp ảnh màn hình (screenshot) khi phát hiện bug
4. **Output:** Screenshot + Bug report cho GitHub Issues

### Tại sao cần 2 phase?
- **Phase 1 (Script):** Nhanh, bao phủ nhiều trường hợp, phát hiện bug nhanh
- **Phase 2 (UI):** Chính xác, xác nhận bug thực tế, cung cấp screenshot

---

## 6. Framework hỗ trợ cho Functional UI Testing

| Tool | Mục đích | Ghi chú |
|------|----------|---------|
| **Puppeteer** | Browser automation cho Node.js | Nhẹ, dễ dùng |
| **Playwright** | Cross-browser testing | Hỗ trợ nhiều trình duyệt |
| **Selenium** | Web automation | Phổ biến, nhiều tài liệu |

**Đề xuất:** Sử dụng **Puppeteer** cho EShop vì:
- Cài đặt đơn giản
- Tương thích tốt với Node.js (đã có better-sqlite3)
- Đủ mạnh cho functional testing

---

## 7. Cấu trúc thư mục cho mỗi FR

```
test-cases/
├── run-tests.js          # Script tự động
├── FR-02-login/          # Test cho FR-02 (đã có)
│   ├── test-cases.md
│   ├── results/
│   └── screenshots/     # Screenshot từ UI test
├── FR-08-checkout/      # Test cho FR-08 (sắp tạo)
├── FR-16-csv-import/    # Test cho FR-16 (sắp tạo)
└── FR-04-profile/       # Test cho FR-04 (sắp tạo)
```

---

## 8. Deliverables cho mỗi FR

| # | Deliverable | Format | Mô tả |
|---|-------------|--------|--------|
| 1 | Test Case Report | Markdown | Bảng TC đầy đủ |
| 2 | EC Table | Markdown | Các lớp tương đương |
| 3 | BVA Analysis | Markdown | Phân tích ranh giới |
| 4 | Automated Script | Node.js | Script phát hiện bug |
| 5 | Test Results | .txt/.json | Kết quả chạy script |
| 6 | UI Test Screenshots | PNG/JPG | Ảnh chụp khi phát hiện bug |
| 7 | Bug Report | GitHub Issues | Bug đã xác nhận |
| 8 | AI Gap Analysis | Markdown | Phân tích AI miss gì |
| 9 | Audit Log | Markdown | Ghi log từng bước |

---

## 9. Trạng thái hoàn thành

| FR | Pool | Domain Testing | BVA | Script | UI Test | Bug Report | Gap Analysis |
|----|------|----------------|-----|--------|---------|------------|--------------|
| FR-02 | A | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| FR-08 | B | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ |
| FR-16 | C | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ |
| FR-04 | D | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ |
