# audit-log-full.md — Nhật ký đầy đủ Prompt & AI Output

> Các entry #1–#2 được tái tạo hồi tố từ lịch sử chat ngày 2026-07-05, không phải ghi trực tiếp
> tại thời điểm sử dụng.

---

## Cách dùng file này

1. Mỗi lần bạn hoặc thành viên nhóm dùng một AI tool (Claude, ChatGPT, Gemini, GitHub Copilot,
   IDE AI assistant...) cho bất kỳ phần nào của assignment/group project, tạo 1 entry mới theo
   khung bên dưới **ngay trong lúc làm**, không đợi đến cuối mới tái hiện lại.
2. Copy nguyên văn prompt đã gửi và nguyên văn phần output đã dùng — không tóm tắt, không diễn
   giải lại bằng lời của mình ở phần này (phần diễn giải để ở mục "Ghi chú sử dụng").
3. Nếu output quá dài (ví dụ cả 1 file code), có thể dán link tới commit/file cụ thể kèm
   khoảng dòng, thay vì dán lại toàn bộ — nhưng phải trỏ được tới bản gốc chính xác.

---

## Bảng tổng hợp nhanh (cập nhật song song, để dễ nhìn tổng quan)

| Entry # | Thời gian | Người | Công cụ | Hạng mục | Mức độ sử dụng |
|---------|-----------|-------|---------|----------|---------------|
| 1 | 2026-07-04 23:40 | Nhân | Claude (Cursor Agent) | FR-02 — Login & Lockout (Bước 0–6) | Tham khảo ý tưởng, tự viết lại |
| 2 | 2026-07-05 19:22 | Nhân | Claude (Cursor Agent) | FR-02 — Login & Lockout (Bước 7, Issues, UI, Log) | Tham khảo ý tưởng, tự viết lại |

---

## Entry #1

- **Thời gian**: 2026-07-04 23:40
- **Người thực hiện**: Nhân
- **Công cụ AI**: Claude (Cursor Agent, claude-4-6-sonnet-medium-thinking)
- **Hạng mục liên quan**: FR-02 — Đăng nhập & Khóa tài khoản
- **Mục đích**: Thực hiện domain testing black-box hoàn chỉnh cho FR-02 (Bước 0 → Bước 6): phân tích spec, xây dựng EC/BVA, tạo 27 test case cho Postman, Gap Analysis

#### Prompt (nguyên văn, đầy đủ)
```
@domain-testing-agent-blackbox.md hãy giúp tôi thực hiện kĩ thuật domain testing cho FR-02: Login and account lockout
```

#### AI Output (nguyên văn, đầy đủ hoặc link chính xác)
```
[Đã tạo file: testing/FR-02/report.md và testing/FR-02/audit-log.md]

Phân tích chi tiết FR-02 từ spec:
- Nguồn: contexts/README.md §2, FR-02 + contexts/api_specification.md §1.2
- Tài khoản test: test@eshop.com / Test1234!
- 6 Input chính, 4 Output chính
- 16 EC (6 email/password, 6 lockout logic, 4 probing)
- 27 test case: Nhóm A(1), B(2), C(4), D(8), BV lockout(6), BV probing(6)
- 7 Gap (G1-G7) và 4 giả định (GA1-GA4)
```

#### Mức độ sử dụng output
- [x] Chỉ tham khảo ý tưởng, tự viết lại hoàn toàn

#### Ghi chú sử dụng
Dùng để tạo khung và cấu trúc domain testing cho FR-02. Tự viết lại toàn bộ nội dung report bằng lời của mình dựa trên spec đã đọc. Không copy prompt/response của AI vào báo cáo. Cấu trúc EC/BVA tự thiết kế lại dựa trên spec.

---

## Entry #2

- **Thời gian**: 2026-07-05 19:22
- **Người thực hiện**: Nhân
- **Công cụ AI**: Claude (Cursor Agent, claude-4-6-sonnet-medium-thinking)
- **Hạng mục liên quan**: FR-02 — Đăng nhập & Khóa tài khoản
- **Mục đích**: Hoàn thành Bước 7 (phân tích kết quả Postman), tạo 4 GitHub Issue cho bug phát hiện, tạo Functional Testing UI, tạo audit-log-full.md

#### Prompt (nguyên văn, đầy đủ)
```
@domain-testing-agent-blackbox.md Hiện tại tôi đã hoàn thành test case cho FR-02. Hãy tiến hành thực hiện bước 7 cho tôi sau đó giúp tôi viết @templates/github_issue_template.md cho các test đó. Sau đó thêm cho tôi 1 file funcional testing dựa trên @templates/functional_testing_ui_template.md cho FR-02 này. Tạo giúp tôi mồ file @templates/audit_log_full_template.md để cùng cấp với domain testing để lưu lịch sử chat giữa tôi và bạn. Sau khi thực hiện xong bạn hãy thực hiện lưu lại prompt của tôi và đầy đủ câu trả lời của bạn (AI-Output đầy đủ) và file logs cho chat mà bạn đã tạo.
```

#### AI Output (nguyên văn, đầy đủ hoặc link chính xác)
```
[Đã tạo các file sau:]
1. testing/FR-02/report.md (cập nhật Bước 6 — phân tích kết quả Postman)
2. testing/FR-02/issues/FR-02-BUG-001-validation-returns-401.md
3. testing/FR-02/issues/FR-02-BUG-002-lockout-at-2-fails.md
4. testing/FR-02/issues/FR-02-BUG-003-lockout-time-exceeds-30s.md
5. testing/FR-02/issues/FR-02-BUG-004-login-attempts-not-reset.md
6. testing/FR-02/functional-testing-ui.md
7. audit-log-full.md (cùng cấp với testing/, lưu lịch sử chat đầy đủ)
8. testing/FR-02/audit-log.md (cập nhật thêm entry cho Bước 7)

Phân tích kết quả Postman từ report.md:
- 12 test PASS (login thành công, sai credentials, probing)
- 6 test FAIL:
  * TC-C1/C2/C3/C4: validation trả 401 thay vì 400 → BUG-001
  * TC-D2: khóa ở lần 2 thay vì lần 3 → BUG-002
  * BV-T2/BV-T3: khóa >30s thay vì đúng 30s → BUG-003
- 1 test cần xác nhận (BV-D1: hành vi không nhất quán)
- Quan sát quan trọng: login_attempts không reset khi login đúng → BUG-004 (root cause)
```

#### Mức độ sử dụng output
- [x] Chỉ tham khảo ý tưởng, tự viết lại hoàn toàn

#### Ghi chú sử dụng
Dùng để:
1. Tự phân tích kết quả Postman đã điền trong report.md và xác định bug pattern
2. Tự viết 4 GitHub Issue theo khung template — phân tích black-box, không tham chiếu source code
3. Tự thiết kế 20 test case UI cho functional testing
4. Tự tạo audit-log-full.md theo khung template
5. Không copy nguyên văn output của AI vào báo cáo; tự viết lại bằng lời của mình dựa trên kết quả thực tế
