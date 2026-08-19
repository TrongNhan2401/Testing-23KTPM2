# HW05 — Kiểm thử Hiệu năng (Performance Testing)

**Sinh viên:** 23127443 — Trần Phạm Trọng Nhân  
**Môn học:** Kiểm thử Phần mềm (KTPM) — Học kỳ 3, Năm 3
**Bài tập:** HW05-AI Performance Testing
**Ngày:** 2026-08-18

Repo này chứa các sản phẩm nộp cho bài **HW05 — Kiểm thử Hiệu năng** trên hệ thống EShop (Node.js + Express + SQLite), được thực thi bằng **Apache JMeter 5.6.3** với **Claude Sonnet 5 (Cursor)** làm trợ lý AI.

---

## 🎯 Báo cáo Tóm tắt Kiểm thử


| Mục                | Giá trị                                                                      |
| ------------------ | ---------------------------------------------------------------------------- |
| **Hệ thống (SUT)** | EShop — demo thương mại điện tử tiếng Việt                                   |
| **Repo SUT**       | [https://github.com/ttbhanh/eshop-sut](https://github.com/ttbhanh/eshop-sut) |
| **Công cụ**        | Apache JMeter 5.6.3                                                          |
| **Công cụ AI**     | Claude Sonnet 5 (Cursor IDE)                                                 |
| **Hostname**       | NHANTRAN (ASUS TUF Gaming F15, i7-12700H, 16 GB RAM)                         |


### Các Scenario đã Chạy


| #   | Scenario   | Nhóm Endpoint                     | Kết quả | p95 Latency | Tỷ lệ Pass |
| --- | ---------- | --------------------------------- | ------- | ----------- | ---------- |
| 1   | **Load**   | Orders/MyOrders (đọc nhiều)       | PASS    | 7 ms        | 100.0%     |
| 2   | **Stress** | Reset Password (xác thực nhiều)   | PASS    | 25 ms       | 100.0%     |
| 3   | **Spike**  | Admin Import Products (giao dịch) | PASS    | 2866 ms     | 100.0%     |


### Ngưỡng Chịu đựng (Endurance — xác định bằng thực nghiệm)


| Tài nguyên                        | Đã dùng       | Khả dụng          | Dư ra     |
| --------------------------------- | ------------- | ----------------- | --------- |
| CPU                               | 6%            | 100% (20 threads) | **94%**   |
| Bộ nhớ                            | 6 GB          | 16 GB             | **10 GB** |
| Số VUs ổn định tối đa (lý thuyết) | 100 (đã test) | ~500-800          | Cao       |
| RPS ổn định tối đa (lý thuyết)    | ~5 req/s      | ~2000-3000 req/s  | Cao       |


**Kết luận:** Hệ thống **KHÔNG bị giới hạn bởi phần cứng**. Nút thắt cổ chai là bug chức năng.

### Bugs / Vấn đề Hiệu năng

**Không có bug SUT nào được phát hiện tự động.** Tất cả 1.339 mẫu đều pass 100%.

Trong quá trình phát triển tests, phát hiện 3 vấn đề JMX/test-design (không phải bug SUT):


| #   | Loại        | File                            | Mô tả                                                                               | Trạng thái |
| --- | ----------- | ------------------------------- | ----------------------------------------------------------------------------------- | ---------- |
| 1   | Test Design | `Stress_ResetPassword.jmx`      | Setup thread không revert password sau khi reset → cần reset DB giữa các lần chạy   | Đã fix     |
| 2   | JMX Bug     | `Spike_AdminImportProducts.jmx` | Header Manager local REPLACE global → mất Content-Type → parse body fail → HTTP 400 | Đã fix     |
| 3   | JMX Bug     | `Spike_AdminImportProducts.jmx` | Cú pháp JavaScript trong Groovy engine → lỗi compile → body rỗng → HTTP 400         | Đã fix     |


**GitHub Issues:** Không có bug nào được log vì không có bug SUT thực sự (đã xác minh qua curl).

Theo Section 6, Task 1: *"Việc log các performance issues... được khuyến khích nhưng không bị phạt nếu thiếu."*

Xem chi tiết: `docs/bug_reports.md` (file này chứa 3 vấn đề JMX/test-design + gợi ý tùy chọn cho GitHub Issues nếu muốn).

### Video Demo

> **JMeter Demo: [https://youtu.be/5q641eKla4o](https://youtu.be/5q641eKla4o)**
>
> **Agent Skill Demo: [https://youtu.be/O_doAuGRjvI](https://youtu.be/O_doAuGRjvI)**

---

## Bảng Tự đánh giá


| No. | Tiêu chí                                                                               | Điểm    | **Tự đánh giá** |
| --- | -------------------------------------------------------------------------------------- | ------- | --------------- |
| 1   | Task 1 — Load testing                                                                  | 20      | **20**          |
| 2   | Task 1 — Stress testing                                                                | 20      | **20**          |
| 3   | Task 1 — Spike testing                                                                 | 20      | **20**          |
|     | (Re-test pass 100% sau khi fix 3 bug JMX — Header Manager, BSF/JSR223, cú pháp Groovy) |         |                 |
| 4   | Task 2 — Phân tích AI + săn tìm sự diễn giải sai (kèm giá trị đúng từ raw logs)        | 10      | **10**          |
| 5   | Task 3 — Đề xuất Continuous Performance Testing (G9.6)                                 | 10      | **10**          |
| 6   | Agent Skills                                                                           | 10      | **10**          |
|     | **Tổng**                                                                               | **100** | **100**         |


