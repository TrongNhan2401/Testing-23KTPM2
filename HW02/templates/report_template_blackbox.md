# Domain Testing Report — <FR-ID>: <tên feature>

## Phương pháp luận

Domain testing trong report này được thực hiện theo phương pháp **Black-box thuần**: mọi
Equivalence Class và Boundary Value được xác định chỉ dựa trên đặc tả (SRS/README) và tài
liệu hợp đồng API (OpenAPI/Postman collection), KHÔNG dựa trên việc đọc source code xử lý
logic nghiệp vụ. Các giá trị mà spec không nêu rõ được đánh dấu là "giá trị thăm dò" và sẽ
được xác nhận qua kết quả thực thi bằng Postman, không suy luận từ implementation.

## 0. Tài liệu đã khảo sát

| Loại tài liệu | Nguồn | Ghi chú |
|---------------|-------|---------|
| SRS/README | `path/to/README.md#section` | [mô tả] |
| API Spec | `path/to/api_specification.md` | [mô tả] |
| Postman Collection có sẵn | [nếu có] | [mô tả] |

## 1. Input & Output

| # | Input | Kiểu | Ràng buộc (theo spec) | Nguồn | Độ tin cậy |
|---|-------|------|--------------------------|-------|-------------|
| I1 | [tên] | [kiểu] | [ràng buộc] | [tài liệu] | Từ spec / Giả định |

| # | Output | Mô tả | Nguồn |
|---|--------|-------|-------|
| O1 | [status + shape] | [mô tả] | [tài liệu] |

## 2. Equivalence Classes

| EC | Field | Điều kiện | Mô tả lớp | Valid/Invalid | Độ tin cậy |
|----|-------|-----------|-----------|----------------|-------------|
| EC1 | ... | ... | ... | Valid | [Từ spec] |
| EC2 | ... | ... | ... | Invalid | [Giả định hợp lý — CẦN XÁC NHẬN] |

## 3. Test Case (Equivalence Partitioning) — bảng chạy Postman

| STT | Lớp bao phủ | Input (body/params) | Expected Output | Actual | Status |
|-----|-------------|------------------------|--------------------|--------|--------|
| TC1 | EC1, ... | ```json\n{...}\n``` | `200` — `{...}` | _(điền sau khi test bằng Postman)_ | ☐ |
| TC2 | EC2 | ```json\n{...}\n``` | `400` — `{...}` | _(điền sau khi test bằng Postman)_ | ☐ |

## 4. Boundary Value Analysis — bảng chạy Postman

**Biên cho [field] — theo spec: [trích nguyên văn spec nêu con số, nếu có]**

| STT | Điểm biên | Input (body/params) | Expected Output | Actual | Status |
|-----|-----------|------------------------|--------------------|--------|--------|
| BV1 | LB-1 | ```json\n{...}\n``` | `400` — `{...}` | _(điền sau khi test bằng Postman)_ | ☐ |
| BV2 | LB | ```json\n{...}\n``` | `200` — `{...}` | _(điền sau khi test bằng Postman)_ | ☐ |
| BV3 | LB+1 | ```json\n{...}\n``` | `200` — `{...}` | _(điền sau khi test bằng Postman)_ | ☐ |

**Biên thăm dò (spec không nêu con số cụ thể):**

| STT | Giá trị thăm dò | Input | Expected Output | Actual | Status |
|-----|-------------------|-------|--------------------|--------|--------|
| BV-P1 | Chuỗi rất dài (1000 ký tự) | ```json\n{...}\n``` | Không xác định trước — dùng để thăm dò hành vi thực tế | _(điền sau khi test bằng Postman)_ | ☐ |

## 5. Gap Analysis

| # | Ràng buộc/EC không xác định được | Vì sao | Cách xử lý |
|---|-------------------------------------|--------|------------|
| 1 | [mô tả] | Spec không nêu rõ / Không thể quan sát từ bên ngoài | [giá trị thăm dò đã chọn / câu hỏi cần hỏi business] |

## 6. Phân tích kết quả Postman (điền sau khi có Actual/Status ở trên)

| # | Test case liên quan | Hành vi quan sát được | Kỳ vọng theo spec | Giả thuyết (không suy đoán implementation) | Cần test thêm |
|---|------------------------|---------------------------|------------------------|-----------------------------------------------|-----------------|
| 1 | TC.../BV... | [mô tả] | [mô tả] | [giả thuyết dựa trên hành vi quan sát] | [test case bổ sung để xác nhận] |
