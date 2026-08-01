# AI Audit Report — HW02 Domain Testing

*Theo mẫu chính thức AI-02 · FIT@HCMUS · CS423/CSC13003 · 2026 v1.0*

## 1. Thông tin Sinh viên


| Mục                       | Giá trị                                                                            |
| ------------------------- | ---------------------------------------------------------------------------------- |
| Họ tên sinh viên (in hoa) | TRẦN PHẠM TRỌNG NHÂN                                                               |
| MSSV                      | 23127443                                                                           |
| Lớp / Khoá                | 23KTPM2                                                                            |
| Mã bài tập                | HW#02 — Domain Testing                                                             |
| Ngày làm bài              | 04/07/2026                                                                         |
| Công cụ AI đã dùng        | Claude (Sonnet 5, claude.ai) + Cursor Agent (dùng skill `domain-testing-blackbox`) |
| Có dùng AI                | [X] Có [ ] Không                                                                   |


## 2. Hướng dẫn

Mỗi hàng dưới đây là 1 artifact AI sinh ra. Prompt và output dán **nguyên văn**. Verdict gắn
nhãn VALID/INVALID/INCOMPLETE, lý do dẫn chiếu ISTQB. Cột cuối là bản bạn đã tự sửa lại.

> **Lưu ý về nguồn dữ liệu của bảng này:** Các Artifact #1–#4 dưới đây được điền từ đúng  
> nguyên văn phiên làm việc với **Claude** (dùng để xây skill và phân tích, không phải sinh  
> test case trực tiếp cho FR). Các Artifact liên quan đến **Cursor** (thiết kế EC/TC/BVA thật  
> cho FR-02, FR-16...) nằm trong file audit-log-full.md (lưu toàn bộ prompt và AI-Output của đoạn hội thoại chat) và các files audit-log.md ở mỗi phần testing của FR (nhằm giúp tôi xác nhận từng phần được agent gen ra và tiến hành chỉnh sửa).

## 3. Bảng Audit — 1 hàng / artifact

---

### Artifact #1 — Xây dựng skill Domain Testing black-box cho Cursor Agent

**Tool:** Claude (Sonnet 5, claude.ai)
**Thời gian:** 22:11 04/07/2026

**Prompt:**

```
Tôi muốn build skill agent theo kiểu black-box hoàn toàn và áp dụng domain testing được hay không
```

*(và các lượt làm rõ trước đó: "Tôi muốn build một skill để áp cho agent như cursor để có thể
thực hiện theo quy trình và có khả năng đọc code..." → sau đó yêu cầu chuyển hẳn sang black-box)*

**Output AI (tóm tắt — nội dung đầy đủ nằm trong file `domain-testing-agent-blackbox.md`):**
AI đề xuất phân loại nguồn thông tin thành 3 tier (Tier 1: SRS/API spec luôn được đọc; Tier 2:
schema/DTO chỉ lấy tên field, phải khai báo rõ; Cấm: controller/service/model/DB
constraint/test có sẵn). Đề xuất quy trình 7 bước, trong đó Bước 7 (phân tích kết quả Postman)
chỉ cho phép suy luận hành vi quan sát được, không suy luận implementation.

**Verdict:** INCOMPLETE

**Lý do (ISTQB):** Đề xuất ban đầu về "Tier 2 — được phép đọc schema DTO" tiềm ẩn rủi ro vi
phạm ranh giới black-box nếu áp dụng không cẩn thận (đọc luôn validate rule bên trong DTO thay
vì chỉ tên field). ISTQB FL §4.2 định nghĩa black-box testing dựa trên "specification-based",
không dựa trên cấu trúc nội tại — cần giới hạn rõ ràng hơn để không lẫn sang grey-box ngoài ý
muốn.

**Bản SV sửa:** Đã xóa và gộp thành 1 tier duy nhất và dọc từ 2 file nằm trong context 

Phần đã sửa: Bước 0 — Thu thập đặc tả (không đụng vào implementation)

- Tìm và đọc: README/SRS liên quan đến FR, `api_specification.md`/OpenAPI, Postman collection  
có sẵn trong repo (nếu có).
- Nếu tài liệu không đủ chi tiết cho một điều kiện cần test (ví dụ không nói rõ số ký tự tối  
đa), **không tự suy ra từ code** — ghi nhận đây là "ràng buộc chưa xác định trong spec",  
chọn giá trị test hợp lý theo thông lệ chung (0, giá trị âm, chuỗi rất dài, ký tự đặc biệt)  
và đánh dấu rõ "CẦN XÁC NHẬN VỚI BUSINESS/QA" — đừng lặng lẽ điền theo con số nhìn thấy trong  
code.
- Ghi lại danh sách tài liệu đã dùng làm nguồn (không phải danh sách file code).

---

### Artifact #2 — Phân tích ranh giới black-box/grey-box khi agent đọc code (FR-02)

**Tool:** Claude (Sonnet 5, claude.ai)
**Thời gian:** 23:02 04/07/2026

**Prompt:**

```
Đây là kết quả sau khi tôi yêu cầu agent chạy FR-02. Tại sao ở đây agent lại đọc code và đưa ra
về phần `login_attempts` tăng +2. Đây có còn được gọi là kỹ thuật black-box testing nữa hay
không vì ở đây là agent đã hiểu source code và đọc code từ bên trong rồi
```

*(kèm toàn bộ nội dung report FR-02 do Cursor sinh ra, đính kèm trong tin nhắn)*

**Output AI:** Xác nhận đây là **Grey-box testing**, không phải black-box thuần: thiết kế test
dựa trên code (biết chính xác `+2`, ngưỡng `>=3`, `180000ms`), nhưng thực thi vẫn qua Postman
(HTTP). Chỉ ra rằng cách làm này hợp lệ về phương pháp luận **vì** report so sánh code với
spec (README) để tìm sai lệch, chứ không lấy hành vi code làm expected output (tránh circular
reasoning). Đề xuất thêm đoạn "Phương pháp luận" đầu report để minh bạch hoá.

**Verdict:** VALID

**Lý do (ISTQB):** Phân biệt đúng theo ISTQB FL §4.2 (Black-box) và test-basis nói chung: kỹ  
thuật thiết kế test (EP/BVA) độc lập với mức độ truy cập code; điều quyết định loại testing là  
**nguồn thông tin dùng để thiết kế test**, không phải cách thực thi. Lập luận về circular  
reasoning (không lấy code làm oracle) đúng theo nguyên tắc "test oracle độc lập với  
implementation" trong kiểm thử phần mềm.

---

### Artifact #3 — Giải thích test CSV: body JSON (Postman) vs upload file thật (UI)

**Tool:** Claude (Sonnet 5, claude.ai)  
**Thời gian: 19:54 06/07/2026**

**Prompt:**

```
giải thích cho tôi phần csv là phải làm thế nào? Mình hiện tại testing up file .csv hay là sử
dụng body json với postman
```

**Output AI:** Đối chiếu `README.md` (FR-16, nói "tải lên file CSV") với `api_specification.md`
§6.3 (endpoint nhận JSON array `{"products": [...]}`) → kết luận: tầng API (Postman) phải test
bằng JSON, vì đó là hợp đồng thực tế của endpoint; việc parse file `.csv` thành mảng là việc của
Frontend. Đề xuất ghi nhận đây là 1 gap trong Gap Analysis: rule "đuôi `.csv`, RFC 4180" không
kiểm chứng được ở tầng API.

**Verdict:** VALID

**Lý do (ISTQB):** Đúng nguyên tắc test theo interface thực tế của SUT ở đúng level đang test  
(API level vs UI level) 

---

### Artifact #4 — Sinh bộ 16 file CSV cho Functional Testing UI

**Tool:** Claude (Sonnet 5, claude.ai)
**Thời gian:** **00:58 07/07/2026**

**Prompt:**

```
Bạn có thể tạo giúp tôi các file csv để test được hay không. Tôi chỉ có 3 danh mục sản phẩn có
id là 1, 2, 3. Đây là thực hiện test cho functional testing. Trong file là những phần tôi đã
test với backend rồi
```

**Output AI:** Sinh 16 file (`01_happy_path_valid.csv` → `16_wrong_extension.txt`), map 1-1 vào
checklist functional testing UI đã đưa trước đó (happy path, sai header, rollback mixed/all
invalid, name rỗng/space/256 ký tự, price 0/âm/không phải số, category không tồn tại/0/rỗng,
RFC 4180 dấu phẩy trong ngoặc kép, duplicate name, file 100 dòng, sai đuôi file).

**Verdict:** VALID

**Lý do (ISTQB):** Bộ file bao phủ tốt EP + BVA cho từng field. AI sinh đúng 16 file test case đáp ứng yêu cầu functional testing UI (happy path, sai header, rollback, name/price/category validation, RFC 4180, duplicate, sai đuôi file).

---

---

## 4. Tổng kết Độ chính xác AI

*(Dựa trên audit-log-full.md và 4 audit-log FR: FR-02, FR-04, FR-08, FR-16)*

### 4.1 Bảng tổng hợp Artifact


| Artifact | Mô tả                                   | Tool   | Verdict    | Số lần HR | Bugs   |
| -------- | --------------------------------------- | ------ | ---------- | --------- | ------ |
| #1       | Xây dựng skill Domain Testing           | Claude | INCOMPLETE | 0         | 0      |
| #2       | Phân tích ranh giới black-box/grey-box  | Claude | VALID      | 0         | 0      |
| #3       | CSV vs JSON (API vs UI)                 | Claude | VALID      | 0         | 0      |
| #4       | Sinh 16 file CSV cho Functional Testing | Claude | VALID      | 0         | 0      |
| #5       | Domain Testing FR-02 (Login & Lockout)  | Cursor | VALID      | 5 lần     | 5 bugs |
| #6       | Domain Testing FR-16 (Import CSV)       | Cursor | INCOMPLETE | 1 lần     | 9 bugs |
| #7       | Domain Testing FR-08 (Checkout)         | Cursor | VALID      | 1 lần     | 7 bugs |
| #8       | Domain Testing FR-04 (Personal Profile) | Cursor | VALID      | 2 lần     | 6 bugs |


### 4.2 Tổng kết theo Verdict


| Chỉ số                         | Số lượng | Tỉ lệ   |
| ------------------------------ | -------- | ------- |
| Tổng artifact AI sinh đã audit | 8        | 100%    |
| **VALID**                      | **6**    | **75%** |
| **INCOMPLETE**                 | **2**    | **25%** |
| INVALID                        | 0        | 0%      |


### 4.3 Chi tiết Verdict

#### VALID (6 artifact)


| Artifact | Lý do VALID                                                                                                                                                                                                  |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| #2       | Phân biệt đúng theo ISTQB FL §4.2: kỹ thuật thiết kế test độc lập với mức độ truy cập code; lập luận circular reasoning đúng nguyên tắc test oracle độc lập.                                                 |
| #3       | Đúng nguyên tắc test theo interface thực tế ở đúng level (API vs UI) — ISTQB FL §2.2.                                                                                                                        |
| #4       | Bộ file CSV bao phủ tốt EP + BVA cho từng field. AI sinh đúng 16 file test case đáp ứng yêu cầu functional testing UI.                                                                                       |
| #5       | Tuân thủ đúng 7 bước black-box; sau 5 lần human review đã sửa hết lỗi (Expected TC-C → giả định tester, BUG-002 bước tái hiện sai, gộp bug sai). Tổng 28 test case, 5 bugs.                                  |
| #7       | Thiết kế test đúng cách: test "ignore total_amount" ưu tiên lên đầu; test cart trống đúng nghiệp vụ; BVA thăm dò max length hợp lý. Tổng 17 test case, 7 bugs.                                               |
| #8       | Phân chia EC cho name/phone/address hợp lý; test security (email/role) được đưa vào nhóm riêng; phát hiện bug nghiêm trọng nhất toàn bài: **FR-04-BUG-003 Privilege Escalation**. Tổng 31 test case, 6 bugs. |


#### INCOMPLETE (2 artifact)


| Artifact | Lý do INCOMPLETE                                                                                             | Bản SV sửa                                                                                           |
| -------- | ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| #1       | Đề xuất "Tier 2 — đọc schema DTO" tiềm ẩn rủi ro vi phạm black-box nếu đọc luôn validate rule bên trong DTO. | Đã bổ sung quy tắc "nếu lỡ đọc phải Tier cấm thì phải loại bỏ hoàn toàn thông tin đó khỏi suy luận". |
| #6       | AI **không sinh test case kiểm tra duplicate product** — business rule ngầm định không nêu trong spec.       | User tự phát hiện bug này khi thực hiện Functional Testing.                                          |


### 4.4 Số lần Human Review theo Artifact


| Artifact   | Số lần HR | Nội dung cần sửa                                                                                                            |
| ---------- | --------- | --------------------------------------------------------------------------------------------------------------------------- |
| #5 (FR-02) | **5 lần** | Expected TC-C → giả định tester; BUG-002 bước tái hiện sai; Gộp bug (001+004 → 002+004); Thu gọn Functional UI; BUG-006 mới |
| #6 (FR-16) | **1 lần** | EC name/price (N3/N4, P3/P4); User phát hiện duplicate bug                                                                  |
| #7 (FR-08) | **1 lần** | Phạm vi total_amount (bỏ âm/lớn); sắp xếp test case (Nhóm B lên đầu)                                                        |
| #8 (FR-04) | **2 lần** | BUG-005 (phone normalization — loại bỏ); FUNC-BUG-001 (Mobile phone 9 chữ số)                                               |


## 5. Kết luận — Khi nào nên / không nên dùng AI?

*Nên sử dụng AI để đưa ra giải pháp (AI-First) sau đó sẽ tiến hành review và sửa chữa những lỗi được phát hiện với AI. Không nên dùng AI để làm từ đầu đến cuối mà không thông qua bất kì review nào.*

## 6. Mandatory Disclosure

```
Test case và báo cáo domain testing trong bài nộp này được sinh phiên bản đầu bởi Claude
(Sonnet 5) và Cursor Agent; tôi đã rà soát và đưa ra human review ở các file audit-log.md của các pool để giúp agent chỉnh sửa và hoàn thiện bài làm mà không hoàn toàn phụ thuộ vào AI. Tôi cam đoan không dùng AI để sinh bất kỳ artifact nào thuộc danh mục bị cấm.
```

## Chữ ký


| Mục                       | Giá trị                                |
| ------------------------- | -------------------------------------- |
| Họ tên sinh viên (in hoa) | TRẦN PHẠM TRỌNG NHÂN                   |
| MSSV                      | 23127443                               |
| Lớp / Khoá                | 23KTPM2                                |
| Môn học                   | CS423 / CSC13003 – Kiểm chứng Phần mềm |
| Giảng viên                | LÂM QUANG VŨ                           |
| Ngày                      | 07/07/2026                             |
| Chữ ký                    | nhân                                   |


