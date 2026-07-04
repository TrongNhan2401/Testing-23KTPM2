# Domain Testing Report — <FR-ID>: <tên feature>

## 0. Codebase đã khảo sát

| Vai trò | File | Ghi chú |
|---------|------|---------|
| Route/Controller | `path/to/file:line` | [mô tả ngắn] |
| Validation/Schema | `path/to/file:line` | [mô tả ngắn] |
| Model/DB | `path/to/file:line` | [ràng buộc DB liên quan] |
| Test có sẵn | `path/to/file:line` | [EC nào đã được cover sẵn] |

## 1. Input & Output

| # | Input | Kiểu | Ràng buộc (trích code) | Nguồn |
|---|-------|------|--------------------------|-------|
| I1 | [tên] | [kiểu] | [ràng buộc] | `file:line` |

| # | Output | Mô tả | Nguồn |
|---|--------|-------|-------|
| O1 | [status + shape] | [mô tả] | `file:line` |

## 2. Equivalence Classes

| EC | Field | Điều kiện | Mô tả lớp | Valid/Invalid | Bằng chứng trong code |
|----|-------|-----------|-----------|----------------|--------------------------|
| EC1 | ... | ... | ... | Valid | `file:line` |
| EC2 | ... | ... | ... | Invalid | `file:line` hoặc "Suy luận — CẦN XÁC NHẬN" |

## 3. Test Case (Equivalence Partitioning) — bảng chạy Postman

| STT | Lớp bao phủ | Input (body/params) | Expected Output | Actual | Status |
|-----|-------------|------------------------|--------------------|--------|--------|
| TC1 | EC1, ... | ```json\n{...}\n``` | `200` — `{...}` | _(điền sau khi test bằng Postman)_ | ☐ |
| TC2 | EC2 | ```json\n{...}\n``` | `400` — `{...}` | _(điền sau khi test bằng Postman)_ | ☐ |

## 4. Boundary Value Analysis — bảng chạy Postman

**Boundary cho [field], cận [LB, UB] — hằng số trong code: `file:line`**

| STT | Điểm biên | Input (body/params) | Expected Output | Actual | Status |
|-----|-----------|------------------------|--------------------|--------|--------|
| BV1 | LB-1 | ```json\n{...}\n``` | `400` — `{...}` | _(điền sau khi test bằng Postman)_ | ☐ |
| BV2 | LB | ```json\n{...}\n``` | `200` — `{...}` | _(điền sau khi test bằng Postman)_ | ☐ |
| BV3 | LB+1 | ```json\n{...}\n``` | `200` — `{...}` | _(điền sau khi test bằng Postman)_ | ☐ |
| BV4 | UB-1 | ```json\n{...}\n``` | `200` — `{...}` | _(điền sau khi test bằng Postman)_ | ☐ |
| BV5 | UB | ```json\n{...}\n``` | `200` — `{...}` | _(điền sau khi test bằng Postman)_ | ☐ |
| BV6 | UB+1 | ```json\n{...}\n``` | `400` — `{...}` | _(điền sau khi test bằng Postman)_ | ☐ |

## 5. Gap Analysis

| # | EC/Biên/Bug bị bỏ sót | Loại gap | Vì sao bị bỏ sót |
|---|--------------------------|----------|--------------------|
| 1 | [mô tả] | Không đọc được code / Thiếu context nghiệp vụ / Giới hạn cấu trúc EP-BVA | [lý do] |
