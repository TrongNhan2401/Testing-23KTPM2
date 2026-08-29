# KẾ HOẠCH THỰC HIỆN BÀI TẬP HW06 – KIỂM THỬ API

> **Mã bài tập:** HW06-AI  
> **Mục tiêu:** Kế hoạch chi tiết từng bước giúp sinh viên hoàn thành 100% các yêu cầu của bài tập kiểm thử API (EShop SUT) theo chuẩn Bloom-AI.

---

## MỤC LỤC

1. [Giai Đoạn 1: Chuẩn Bị & Dựng Môi Trường](#giai-doan-1-chuan-bi--dung-moi-truong)
2. [Giai Đoạn 2: Sinh Test Case Bằng AI, Audit & Mở Rộng (3 APIs)](#giai-doan-2-sinh-test-case-bang-ai-audit--mo-rong-3-apis)
3. [Giai Đoạn 3: Cấu Hình Postman, Chạy Newman & Báo Cáo Lỗi](#giai-doan-3-cau-hinh-postman-chay-newman--bao-cao-loi)
4. [Giai Đoạn 4: Tích Hợp CI/CD Pipeline (GitHub Actions)](#giai-doan-4-tich-hop-cicd-pipeline-github-actions)
5. [Giai Đoạn 5: Thiết Kế Agent Skill - AI Test Generator](#giai-doan-5-thiet-ke-agent-skill---ai-test-generator)
6. [Giai Đoạn 6: Tổng Hợp Báo Cáo & Đóng Gói Nộp Bài](#giai-doan-6-tong-hop-bao-cao--dong-goi-nop-bai)

---

## GIAI ĐOẠN 1: CHUẨN BỊ & DỰNG MÔI TRƯỜNG

- [ ] **Bước 1.1: Clone & Khởi chạy SUT Backend**
  - Repository: `https://github.com/ttbhanh/eshop-sut`
  - Cài đặt và khởi chạy server local (`http://localhost:5000`).
  - Đọc kỹ file `api_specification.md` trong repo.

- [ ] **Bước 1.2: Lựa chọn 3 API đại diện (Đã loại trừ các API của nhóm)**
  * Danh sách các API đồng đội đã chọn (CẦN TRÁNH): `POST /api/register` (FR-01), `POST /api/login` (FR-02), Quên mật khẩu (FR-03), Add to cart (FR-07), Checkout (FR-08), Apply coupon (FR-09), Hủy đơn hàng (FR-10), CRUD sản phẩm Admin (FR-15), Đổi trạng thái đơn Admin (FR-18).
  * **3 API ĐƯỢC CHỌN DÀNH CHO BẠN (KHÔNG TRÙNG LẶP):**
    * 🔹 **Pool A (FR-05):** `GET /api/products/search` (Tìm kiếm và lọc danh sách sản phẩm)
    * 🔹 **Pool B (FR-11):** `GET /api/user/orders` (Xem danh sách/chi tiết lịch sử đơn hàng cá nhân)
    * 🔹 **Pool C (FR-14):** `POST /api/admin/categories` (Tạo mới danh mục sản phẩm - Quyền Admin)

- [ ] **Bước 1.3: Cấu hình Postman Environment**
  - Tạo Environment `EShop_Local` với các biến: `baseUrl`, `student_id`, `jwt_token`, `admin_token`.

- [ ] **Bước 1.4: Thêm Pre-request Script bắt buộc (Anti-AI-Cheat)**
  - Thêm script tự động gán header `X-Student-Id: {StudentID}` tại Collection Root.

---

## GIAI ĐOẠN 2: SINH TEST CASE BẰNG AI, AUDIT & MỞ RỘNG (3 APIs ĐÃ CHỌN)

Thực hiện chuỗi 4 bước cho từng API:

### 📍 API 1 - Pool A (FR-05): `GET /api/products/search`
- [ ] **Prompt AI 3 đợt:** Sinh $\ge 35$ test cases bao phủ query params (`q`, `categoryId`, `minPrice`, `maxPrice`, `page`, `limit`, `sort`), SQL Injection trên ô tìm kiếm, XSS, Schema validation.
- [ ] **Lập bảng AI Audit Log:** Đánh giá từng case `VALID`, `INVALID`, `INCOMPLETE` + Sửa đổi.
- [ ] **Mở rộng $\ge 5$ test cases:** Tự viết thêm 5 case AI bỏ sót (ví dụ: kết hợp nhiều filter phức tạp cùng lúc, tràn số minPrice > maxPrice, SQLi lồng nhau).

### 📍 API 2 - Pool B (FR-11): `GET /api/user/orders`
- [ ] **Prompt AI 3 đợt:** Sinh $\ge 35$ test cases bao phủ lọc trạng thái đơn (`status`), phân trang, kiểm thử IDOR (SEC-03: User A cố tình xem đơn hàng bằng ID của User B), chưa đăng nhập (SEC-01).
- [ ] **Lập bảng AI Audit Log.**
- [ ] **Mở rộng $\ge 5$ test cases:** Tự viết thêm 5 case AI bỏ sót (ví dụ: IDOR qua header giả mạo, SQLi trong query status).

### 📍 API 3 - Pool C (FR-14): `POST /api/admin/categories`
- [ ] **Prompt AI 3 đợt:** Sinh $\ge 35$ test cases bao phủ tên danh mục (độ dài, rỗng, ký tự đặc biệt, trùng tên), Leo thang quyền (SEC-04: User thường cố gọi API Admin), Token hết hạn, Schema.
- [ ] **Lập bảng AI Audit Log.**
- [ ] **Mở rộng $\ge 5$ test cases:** Tự viết thêm 5 case AI bỏ sót (ví dụ: tạo danh mục cha/con lồng vòng lặp đệ quy, XSS trong tên danh mục).

---

## GIAI ĐOẠN 3: CẤU HÌNH POSTMAN, CHẠY NEWMAN & BÁO CÁO LỖI

- [ ] **Bước 3.1: Xây dựng Postman Requests & Test Scripts**
  - Viết code assert bằng Chai.js cho toàn bộ $\ge 120$ test cases.
- [ ] **Bước 3.2: Thực hiện Data-driven Testing**
  - Chuẩn bị file `data-register.json` / `data-cart.json` cho Collection Runner.
- [ ] **Bước 3.3: Chạy Newman CLI & Xuất Báo Cáo HTML**
  - Chạy lệnh Newman với `--reporter-htmlextra-export ./reports/newman-report.html`.
- [ ] **Bước 3.4: Báo cáo lỗi (Bugs)**
  - Đăng tạo GitHub Issues kèm ảnh chụp màn hình minh chứng cho các bug phát hiện được.

---

## GIAI ĐOẠN 4: TÍCH HỢP CI/CD PIPELINE (GITHUB ACTIONS)

- [ ] **Bước 4.1: Tạo file Workflow `.github/workflows/api-testing.yml`**
  - Cấu hình cài đặt Node.js, khởi chạy SUT backend và thực thi Newman.
- [ ] **Bước 4.2: Commit 1 (All Pass - Green Build)**
  - Chạy pipeline thành công 100%, chụp ảnh giao diện GitHub Actions và lấy link commit.
- [ ] **Bước 4.3: Commit 2 (Test Failure - Red Build)**
  - Chủ động chỉnh sửa 1 assertion để tạo 1 test failure, chụp ảnh minh chứng và lấy link commit.
- [ ] **Bước 4.4: Viết báo cáo CI/CD ngắn gọn**

---

## GIAI ĐOẠN 5: THIẾT KẾ AGENT SKILL - AI TEST GENERATOR

- [ ] **Bước 5.1: Tự vẽ sơ đồ kiến trúc AI Test Generator**
  - Sử dụng Mermaid hoặc công cụ vẽ sơ đồ (sơ đồ phải do bạn tự thiết kế ý tưởng).
- [ ] **Bước 5.2: Viết mã giả (Pseudo-code)**
  - Viết script Python / JS mô tả luồng nhận API Spec $\rightarrow$ Prompt LLM $\rightarrow$ Xuất Postman Collection.
- [ ] **Bước 5.3: (Tùy chọn) Video Demo YouTube**
  - Quay clip ngắn 2-3 phút minh họa Agent hoạt động và chèn link vào báo cáo.

---

## GIAI ĐOẠN 6: TỔNG HỢP BÁO CÁO & ĐÓNG GÓI NỘP BÀI

- [ ] **Bước 6.1: Viết đoạn văn AI Critique (200 - 300 từ)**
- [ ] **Bước 6.2: Hoàn thiện Báo cáo chính (Markdown + PDF)**
- [ ] **Bước 6.3: Tạo file `README.md` tự đánh giá (Self-assessment score)**
- [ ] **Bước 6.4: Xuất nhật ký Git Commit**
  - Run lệnh `git log --pretty=format:"%h - %an, %ar : %s" > git_log.txt`.
- [ ] **Bước 6.5: Đóng gói file `.zip` nộp bài**
  - Cú pháp tên file: `<StudentID>_HW06_AI_API_<SelfAssessedGrade>.zip`
  - Nộp lên Moodle đúng hạn.
