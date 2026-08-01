# HW02 — Domain Testing & Boundary Value Analysis

---

## Bảng tự chấm điểm (Self-Assessment)


| **No.** | **Criteria**                                                 | **Grade** | **Self-Assessed Grade** |
| ------- | ------------------------------------------------------------ | --------- | ----------------------- |
| **1**   | Feature A (Domain + Boundary) — FR-02: Login & Lockout       | 25        | 25                      |
| **2**   | Feature B (Domain + Boundary) — FR-16: Import CSV            | 25        | 25                      |
| **3**   | Feature C (Domain + Boundary) — FR-08: Thanh toán (Checkout) | 25        | 25                      |
| **4**   | Feature D (Mobile, Domain + Boundary) — FR-04: Hồ sơ cá nhân | 15        | 25                      |
| **5**   | Agent Skills                                                 | 10        | 5                       |
|         | **Total**                                                    | **100**   | 95                      |


---

## Test Summary Report

### Thông tin chung


| Thông tin             | Chi tiết                                 |
| --------------------- | ---------------------------------------- |
| **Môn học**           | Testing                                  |
| **Bài tập**           | HW02 — Domain Testing                    |
| **Phương pháp**       | Black-box Testing (Domain Testing + BVA) |
| **Số tính năng test** | 4                                        |
| **Tổng test case**    | 109                                      |
| **Công cụ test**      | Postman (API), Manual (UI/Mobile)        |


---

## 1. Tổng quan kết quả Test

### 1.1 Kết quả tổng hợp


| Feature               | FR    | Test Case | Pass   | Fail   | Pass Rate |
| --------------------- | ----- | --------- | ------ | ------ | --------- |
| Login & Lockout       | FR-02 | 28        | 16     | 10     | 57.1%     |
| Import CSV            | FR-16 | 33        | 18     | 15     | 54.5%     |
| Thanh toán (Checkout) | FR-08 | 17        | 9      | 8      | 52.9%     |
| Hồ sơ cá nhân         | FR-04 | 31        | 14     | 17     | 45.2%     |
| **Tổng cộng**         |       | **109**   | **57** | **50** | **52.3%** |


### 1.2 Phân bố Bugs theo Severity


| Severity | FR-02 | FR-16 | FR-08 | FR-04 | Tổng   |
| -------- | ----- | ----- | ----- | ----- | ------ |
| Critical | 0     | 5     | 4     | 3     | **12** |
| High     | 2     | 4     | 2     | 3     | **11** |
| Medium   | 3     | 0     | 1     | 1     | **5**  |
| Low      | 0     | 0     | 1     | 0     | **1**  |
| **Tổng** | **5** | **9** | **8** | **7** | **29** |


### 1.3 Bugs theo tầng (Layer)


| Tầng                | Số Bug | Mô tả                                 |
| ------------------- | ------ | ------------------------------------- |
| **Domain (API)**    | 22     | Bugs phát hiện từ Postman API testing |
| **Functional (UI)** | 7      | Bugs phát hiện từ UI/Mobile testing   |


---

## 2. Chi tiết từng Feature

### 2.1 FR-02: Login & Account Lockout


| Nhóm test            | Test Case | Pass   | Fail   |
| -------------------- | --------- | ------ | ------ |
| Đăng nhập thành công | 1         | 1      | 0      |
| Đăng nhập thất bại   | 2         | 2      | 0      |
| Validation input     | 4         | 0      | 4      |
| Account Lockout      | 9         | 5      | 4      |
| Boundary Values      | 12        | 8      | 2      |
| **Tổng**             | **28**    | **16** | **10** |


**Bugs phát hiện:**

- FR-02-BUG-001: API trả 401 cho validation error thay vì 400 (Medium)
- FR-02-BUG-002: Khóa xảy ra ở lần sai thứ 2 thay vì thứ 3 (High)
- FR-02-BUG-003: Thời gian khóa kéo dài hơn 30 giây (High)
- FR-02-BUG-005: UI không hiển thị số lần thử còn lại (Medium)
- FR-02-BUG-006: UI không thông báo khóa khi đạt ngưỡng (High)

### 2.2 FR-16: Import CSV


| Nhóm test                 | Test Case | Pass   | Fail   |
| ------------------------- | --------- | ------ | ------ |
| Xác thực & Phân quyền     | 4         | 3      | 1      |
| Validation `name`         | 6         | 3      | 3      |
| Validation `price`        | 7         | 3      | 4      |
| Validation `category_id`  | 5         | 1      | 4      |
| Rollback / All-or-nothing | 4         | 3      | 1      |
| Boundary Values           | 7         | 5      | 2      |
| **Tổng**                  | **33**    | **18** | **15** |


**Bugs phát hiện:**

- FR-16-BUG-001: User thường có thể import sản phẩm (Critical)
- FR-16-BUG-002: Backend không validate name chỉ có space (High)
- FR-16-BUG-003: Backend không enforce max length 255 cho name (High)
- FR-16-BUG-004: Backend không validate price (Critical)
- FR-16-BUG-005: Backend không validate category_id (Critical)
- FR-16-BUG-006: Backend không rollback khi có lỗi (Critical)
- FR-16-BUG-007: Backend không xử lý duplicate products (High)
- FR-16-FUNC-BUG-001: UI cho import file thiếu header category_id (Critical)
- FR-16-FUNC-BUG-002: UI cho import file không phải .csv (High)

### 2.3 FR-08: Thanh toán (Checkout)


| Nhóm test        | Test Case | Pass  | Fail  |
| ---------------- | --------- | ----- | ----- |
| Xác thực         | 3         | 3     | 0     |
| Total amount     | 3         | 1     | 2     |
| Giỏ hàng trống   | 2         | 0     | 2     |
| Shipping address | 5         | 1     | 4     |
| Boundary Values  | 4         | 4     | 0     |
| **Tổng**         | **17**    | **9** | **8** |


**Bugs phát hiện:**

- FR-08-BUG-001: Backend nhận total_amount từ client thay vì tự tính (Critical)
- FR-08-BUG-002: Checkout thành công khi giỏ hàng trống (Critical)
- FR-08-BUG-003: Giỏ hàng không bị xóa sau checkout (High)
- FR-08-BUG-004: shipping_address không được validate (High)
- FR-08-BUG-005: Backend không có max length cho shipping_address (Low)
- FR-08-FUNC-BUG-001: UI cho nhập/sửa tổng tiền (Critical)
- FR-08-FUNC-BUG-002: UI vẫn hiển thị giỏ hàng sau checkout (High)

### 2.4 FR-04: Hồ sơ cá nhân (Personal Profile)


| Nhóm test                     | Test Case | Pass   | Fail   |
| ----------------------------- | --------- | ------ | ------ |
| Xác thực                      | 3         | 3      | 0      |
| Validation `name`             | 5         | 1      | 4      |
| Validation `phone`            | 10        | 3      | 7      |
| Validation `shipping_address` | 4         | 4      | 0      |
| Security (email/role)         | 2         | 1      | 1      |
| Boundary Values               | 7         | 2      | 5      |
| **Tổng**                      | **31**    | **14** | **17** |


**Bugs phát hiện:**

- FR-04-BUG-001: Backend không validate name (Critical)
- FR-04-BUG-002: Backend không validate phone (Critical)
- FR-04-BUG-003: Backend cho phép thay đổi role — **PRIVILEGE ESCALATION** (Critical)
- FR-04-BUG-004: Backend không validate shipping_address rỗng (Medium)
- FR-04-BUG-005: Backend không xử lý phone (High)
- FR-04-FUNC-BUG-001: Mobile cho lưu phone 9 chữ số (High)

---

## 3. Bugs ưu tiên cao cần fix

### 3.1 Critical Bugs (12 bugs)


| #   | Bug ID             | Mô tả                               | Feature |
| --- | ------------------ | ----------------------------------- | ------- |
| 1   | FR-04-BUG-003      | User tự nâng quyền thành admin      | FR-04   |
| 2   | FR-16-BUG-001      | User thường import sản phẩm         | FR-16   |
| 3   | FR-16-BUG-004      | Backend không validate price        | FR-16   |
| 4   | FR-16-BUG-005      | Backend không validate category_id  | FR-16   |
| 5   | FR-16-BUG-006      | Backend không rollback khi có lỗi   | FR-16   |
| 6   | FR-08-BUG-001      | Backend nhận total_amount từ client | FR-08   |
| 7   | FR-08-BUG-002      | Checkout khi giỏ hàng trống         | FR-08   |
| 8   | FR-16-FUNC-BUG-001 | UI import thiếu header category_id  | FR-16   |
| 9   | FR-08-FUNC-BUG-001 | UI cho nhập/sửa tổng tiền           | FR-08   |
| 10  | FR-04-BUG-001      | Backend không validate name         | FR-04   |
| 11  | FR-04-BUG-002      | Backend không validate phone        | FR-04   |
| 12  | FR-08-BUG-003      | Giỏ hàng không bị xóa sau checkout  | FR-08   |


### 3.2 High Bugs (11 bugs)


| #   | Bug ID             | Mô tả                               | Feature |
| --- | ------------------ | ----------------------------------- | ------- |
| 1   | FR-02-BUG-002      | Khóa ở lần sai thứ 2                | FR-02   |
| 2   | FR-02-BUG-003      | Thời gian khóa > 30 giây            | FR-02   |
| 3   | FR-02-BUG-006      | UI không thông báo khóa             | FR-02   |
| 4   | FR-16-BUG-002      | Name chỉ có space được chấp nhận    | FR-16   |
| 5   | FR-16-BUG-003      | Name > 255 ký tự được chấp nhận     | FR-16   |
| 6   | FR-16-BUG-007      | Duplicate products không được xử lý | FR-16   |
| 7   | FR-16-FUNC-BUG-002 | UI import file không phải .csv      | FR-16   |
| 8   | FR-08-BUG-004      | shipping_address không validate     | FR-08   |
| 9   | FR-08-FUNC-BUG-002 | UI hiển thị giỏ hàng sau checkout   | FR-08   |
| 10  | FR-04-BUG-005      | Backend không xử lý phone           | FR-04   |
| 11  | FR-04-FUNC-BUG-001 | Mobile cho lưu phone 9 chữ số       | FR-04   |


---

## 4. Thư mục cấu trúc

```
HW02/
├── README.md                    # File này
├── main_report.md               # Báo cáo chi tiết từng FR
├── audit-log-full.md           # Lịch sử làm việc
├── contexts/
│   ├── README.md                # SRS/Spec
│   └── api_specification.md    # API Contract
├── templates/
│   └── report_template_blackbox.md
├── domain-testing-agent-blackbox.md
└── testing/
    ├── FR-02/
    │   ├── report.md
    │   ├── audit-log.md
    │   └── issues/
    │       ├── FR-02-BUG-001.md
    │       ├── FR-02-BUG-002.md
    │       ├── FR-02-BUG-003.md
    │       ├── FR-02-BUG-005.md
    │       └── FR-02-BUG-006.md
    ├── FR-04/
    │   ├── report.md
    │   ├── audit-log.md
    │   └── issues/
    │       ├── FR-04-BUG-001.md
    │       ├── FR-04-BUG-002.md
    │       ├── FR-04-BUG-003.md
    │       ├── FR-04-BUG-004.md
    │       ├── FR-04-BUG-005.md
    │       └── FR-04-FUNC-BUG-001.md
    ├── FR-08/
    │   ├── report.md
    │   ├── audit-log.md
    │   └── issues/
    │       ├── FR-08-BUG-001.md
    │       ├── FR-08-BUG-002.md
    │       ├── FR-08-BUG-003.md
    │       ├── FR-08-BUG-004.md
    │       ├── FR-08-BUG-005.md
    │       ├── FR-08-FUNC-BUG-001.md
    │       └── FR-08-FUNC-BUG-002.md
    └── FR-16/
        ├── report.md
        ├── audit-log.md
        └── issues/
            ├── FR-16-BUG-001.md
            ├── FR-16-BUG-002.md
            ├── FR-16-BUG-003.md
            ├── FR-16-BUG-004.md
            ├── FR-16-BUG-005.md
            ├── FR-16-BUG-006.md
            ├── FR-16-BUG-007.md
            ├── FR-16-FUNC-BUG-001.md
            └── FR-16-FUNC-BUG-002.md
```

---

## 5. Công nghệ & Công cụ sử dụng


| Công cụ               | Mục đích                     |
| --------------------- | ---------------------------- |
| Postman               | API Testing (Domain Testing) |
| Cursor Agent (Claude) | AI Assistant cho Testing     |
| Git                   | Version Control              |
| Markdown              | Documentation                |


---

## 6. Phương pháp Testing

### 6.1 Domain Testing (Black-box)

- **EC (Equivalence Classes):** Chia miền giá trị thành các lớp tương đương
- **BVA (Boundary Value Analysis):** Test các điểm biên
- **Input/Output Analysis:** Xác định inputs và expected outputs từ spec

### 6.2 Testing Levels


| Level               | Mô tả                       |
| ------------------- | --------------------------- |
| Domain Testing      | Test API từ spec (Postman)  |
| Functional Testing  | Test UI/Mobile (Manual)     |
| Integration Testing | Test kết hợp nhiều features |


---

## 7. Ghi chú

- Tất cả test được thực hiện theo phương pháp **Black-box thuần**
- Không đọc source code khi thiết kế test case
- Bugs được phân loại theo mức độ nghiêm trọng (Critical > High > Medium > Low)
- Cross-reference giữa Domain bugs và Functional bugs để xác định root cause

---

