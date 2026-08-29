# BÁO CÁO TÍCH HỢP CI/CD PIPELINE (GITHUB ACTIONS) — HW06

> **Mã bài tập:** HW06-AI — API Testing  
> **Sinh viên thực hiện:** [Họ và tên Sinh viên] — MSSV: `23127443`  
> **Repository URL:** `https://github.com/TrongNhan2401/Testing-23KTPM2`  

---

## 1. MÔ TẢ CẤU HÌNH PIPELINE (`.github/workflows/api-testing.yml`)

Pipeline kiểm thử API tự động hóa được thiết lập thông qua GitHub Actions với các bước thực thi liền mạch:
1. **Trigger Condition:** Tự động kích hoạt khi có sự kiện `push` hoặc `pull_request` trên nhánh `HW06`, `main`, `master`.
2. **Environment:** Máy chủ ảo Ubuntu (`ubuntu-latest`) cài đặt môi trường Node.js v18.
3. **Services Setup:** Cài đặt dependencies và khởi chạy Backend SUT local (`node server.js &`) trên cổng 3000 ở chế độ background.
4. **Test Execution:** Cài đặt `newman` và `newman-reporter-htmlextra`, thực thi toàn bộ Postman Collection với Environment JSON.
5. **Artifact Storage:** Tự động nén và đính kèm file báo cáo HTML `newman_report.html` vào kết quả Workflow run.

---

## 2. KẾT QUẢ 2 LẦN CHẠY PIPELINE (COMMIT MINH CHỨNG)

### 🟢 Lần Chạy 1: Passing Commit (Build Thành Công - Nền Xanh ✅)
* **Thông điệp Commit:** `"CI/CD Step 4.1: Add GitHub Actions workflow for automated API testing"`
* **Commit Link:** `https://github.com/TrongNhan2401/Testing-23KTPM2/commit/`
* **Mô tả:** Tất cả 5 Requests và 12 Assertions kiểm thử API đều vượt qua 100%. Pipeline hoàn thành với vệt màu **XANH**.
* **Hình ảnh minh chứng (Green Build):** *(Ảnh chụp tab Actions trên GitHub)*

---

### 🔴 Lần Chạy 2: Failing Commit (Build Thất Bại - Nền Đỏ ❌)
* **Thông điệp Commit:** `"CI/CD Step 4.2: Simulate test failure for pipeline detection demonstration"`
* **Commit Link:** `https://github.com/TrongNhan2401/Testing-23KTPM2/commit/`
* **Mô tả:** Cố tình điều chỉnh 1 assertion Status Code kỳ vọng từ `200` thành `500`. Newman CLI phát hiện lỗi assertion và phát tín hiệu dừng build với vệt màu **ĐỎ**.
* **Hình ảnh minh chứng (Red Build):** *(Ảnh chụp tab Actions trên GitHub)*
