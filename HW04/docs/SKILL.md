---
name: web-automation-generator
description: Generates data-driven Playwright web automation test scripts from a manual test-case table (e.g. from Equivalence Partitioning / BVA domain testing), step by step rather than one single prompt. Use this skill whenever the user wants to convert existing test cases into automated UI test scripts, needs a Page Object Model for a web feature, wants test data separated into .csv/.json files, or needs a structured review/gap-analysis comparing AI-generated automation against the original test cases. Reusable across any web automation testing assignment or project, not tied to a specific system under test. Always trigger this for requests like "turn these test cases into automation scripts", "automate this feature with Playwright", "generate a data-driven test suite", or general web automation testing homework/assignments.
---

# Web Automation Generator

Skill dùng để chuyển một bảng test case tay (manual test case, ví dụ từ EP/BVA ở Domain Testing) thành bộ automation script Playwright hoàn chỉnh: có Page Object, data-driven, và có review/gap-analysis. Skill này **tổng quát**, không gắn với 1 SUT hay 1 bài tập cụ thể nào — dùng lại được cho nhiều feature, nhiều môn, nhiều project khác nhau, miễn người dùng cung cấp SUT (thường là 1 địa chỉ localhost đang chạy sẵn) và bảng test case.

Nguyên tắc cốt lõi: **KHÔNG sinh toàn bộ script bằng 1 prompt duy nhất**. Luôn đi qua đủ 5 bước dưới đây theo thứ tự, dừng lại sau mỗi bước để review trước khi qua bước kế tiếp.

Skill này **không xử lý phần cấu hình Playwright** (multi-browser project, reporter, v.v.) — phần đó người dùng tự thiết lập riêng hoặc sẽ được hướng dẫn ở một bước khác. Skill chỉ tập trung vào: từ test case → Page Object → data file → script → review.

## Khi nào dùng skill này

- Người dùng đưa một bảng test case (id, input, expected, priority...) và muốn tự động hóa bằng Playwright.
- Người dùng nói "automation testing", "Playwright", "data-driven test", hoặc yêu cầu tự động hóa 1 feature web bất kỳ.
- Người dùng cần review/gap-analysis giữa script AI sinh ra và test case gốc.

## Input cần có trước khi bắt đầu

Hỏi người dùng (nếu chưa có trong hội thoại):

1. **Tên feature** cần test (vd: Login, Checkout, Import CSV...).
2. **Địa chỉ SUT** — thường là 1 URL localhost mà người dùng đã tự khởi động sẵn ở project riêng (vd `http://localhost:3000/login`). Skill không tự khởi động SUT; chỉ dùng địa chỉ được cung cấp làm `baseURL` khi viết script.
3. **Bảng test case** — tối thiểu id, input, expected result. Nếu người dùng đã có sẵn bảng từ bài trước (EP/BVA, bug report...), dùng lại trực tiếp, không tự bịa case mới.
4. (Tùy chọn) Đường dẫn source code của SUT hoặc quyền xem DOM trực tiếp trên localhost, để lấy đúng selector thay vì đoán.

Nếu Playwright project chưa tồn tại, nhắc người dùng chạy `npm init playwright@latest` — nhưng việc cấu hình chi tiết (browser project, reporter...) nằm ngoài phạm vi skill này, để hướng dẫn riêng sau.

## Quy trình 5 bước (bắt buộc theo đúng thứ tự)

Sau **mỗi bước**, nếu người dùng cần audit log (một số bài tập automation testing yêu cầu ghi lại toàn bộ prompt/output khi dùng AI), ghi ngay 1 entry vào `docs/ai-audit-report.md` theo format ở mục "Audit Log" bên dưới, trước khi sang bước tiếp theo.

### Bước 1 — Chuẩn hóa bảng test case

Không sinh code ở bước này. Chỉ đọc bảng test case đầu vào và viết lại thành bảng chuẩn gồm các cột: `id`, `type` (positive/negative/edge), `input`, `expected`, `note`. Nếu bảng gốc thiếu case biên (empty, max-length, khoảng trắng, ký tự đặc biệt) mà tính chất trường dữ liệu cho phép, có thể đề xuất thêm — nhưng phải hỏi người dùng xác nhận trước khi thêm case họ chưa từng thiết kế.

### Bước 2 — Xác định selector & Page Object

Trước khi viết assertion hay action, xác định các selector cần dùng trên SUT thật (dựa vào URL localhost người dùng cung cấp — có thể yêu cầu người dùng mô tả hoặc chụp DOM nếu Claude không có quyền truy cập trực tiếp). Thứ tự ưu tiên:
1. `data-testid` (bền nhất)
2. `role` + accessible name (`getByRole`)
3. `label`/`placeholder` cho form field
4. CSS class / text — **chỉ dùng khi 3 loại trên không có**, và phải ghi chú rõ đây là selector dễ vỡ (fragile) trong phần review.

Nếu có quyền truy cập source code SUT, đọc trực tiếp file component để lấy đúng `data-testid` thay vì đoán. Sinh 1 file Page Object (`<feature>.page.ts`) chứa các locator + action method (không chứa assertion).

### Selector Robustness Rubric (đánh giá 4 mức)

Mỗi locator trong Page Object cần được gán 1 mức robustness. Khi review (Bước 5), liệt kê selector ở mức 3 trở lên — đó là nợ kỹ thuật cần đề xuất dev thêm `data-testid`.

| Mức | Tên | Đặc điểm | Ví dụ | Khuyến nghị |
| --- | --- | -------- | ----- | ----------- |
| **1** | Stable | `data-testid` hoặc `role` + unique accessible name | `getByTestId('email-input')`, `getByRole('button', { name: 'Sign In' })` | Ưu tiên dùng |
| **2** | Medium | `label` + sibling, `placeholder`, `name` attribute | `label:has-text("Email") ~ input`, `getByPlaceholder('Enter email')` | OK nếu label/text ổn định (ít khi dev đổi) |
| **3** | Fragile | CSS class đơn lẻ, multi-fallback, `.first()` không scope | `.text-red-500`, `[role="alert"], .error, .error-message` | Chỉ dùng fallback — ghi chú rõ trong comment |
| **4** | Break | CSS chain xa, `nth-child`, position-based | `div > div:nth-child(3) > input` | **Tránh dùng** — chi phí maintain cao |

**Quy tắc vàng:** một locator tốt nên có thể trả lời được:
- _"Nếu dev đổi class nhưng giữ nguyên chức năng, locator có gãy không?"_
- Nếu **CÓ** → đang ở mức 3 trở lên, cần đề xuất cải thiện.

### Cách tìm selector khi DOM thiếu `data-testid`

Thực tế nhiều SUT không có `data-testid` (đặc biệt với demo/prototype). Quy trình debug 4 bước:

1. **Mở SUT trong browser thật** (không dùng Playwright headless vì cần DevTools).
2. **Inspect element** cần locate → ghi nhận vào 1 bảng (in luôn vào comment của Page Object):

   | Thuộc tính | Input Username | Input Mật khẩu |
   | ---------- | -------------- | -------------- |
   | `id`       | `""`           | `""`           |
   | `name`     | `""`           | `""`           |
   | `placeholder` | `""`         | `""`           |
   | `aria-label` | `null`       | `null`         |
   | `aria-labelledby` | `null`  | `null`         |
   | `label[for]` | `null`       | `null`         |
   | `label` text | `"Username"`  | `"Mật khẩu"`   |
   | Position  | sibling ngay sau label | sibling ngay sau label |

3. **Đoán selector tốt nhất** dựa trên bảng trên. Với ví dụ trên: vì không có `for`, không có `aria-*`, chỉ còn cách dùng `label:has-text("Username") ~ input`.
4. **Verify** bằng cách chạy 1 probe test trước khi viết cả suite:
   ```ts
   test("probe selector", async ({ page }) => {
     await page.goto("/login");
     const count = await page.locator('label:has-text("Username") ~ input').count();
     console.log("Found:", count); // phải = 1
   });
   ```

**Đề xuất dài hạn:** Ghi 1 ticket yêu cầu dev thêm `data-testid` cho tất cả input/button quan trọng. Đây là đầu tư 1 lần, giảm chi phí maintain test về sau.

### Bước 3 — Tách test data ra file riêng

Chuyển bảng ở Bước 1 thành file `data/<feature>-testdata.csv` hoặc `.json` (không hardcode mảng/object trong file `.spec.ts`). Cấu trúc mỗi record nên map trực tiếp 1-1 với 1 hàng trong bảng test case (giữ nguyên `id` để dễ truy vết ngược).

### Bước 4 — Sinh script `.spec.ts` đọc dữ liệu từ file, dùng Page Object

Script phải:
- Trỏ tới địa chỉ SUT do người dùng cung cấp (dùng `baseURL` trong config nếu đã có, hoặc full URL trực tiếp nếu chưa cấu hình).
- Đọc dữ liệu từ file ở Bước 3 (dùng `fs.readFileSync` + parse csv, hoặc `import` trực tiếp nếu json), loop qua từng record.
- Dùng Page Object từ Bước 2, không thao tác locator trực tiếp trong file spec.
- Áp dụng **ít nhất 3 pattern assertion khác nhau** — xem danh sách ở mục "Assertion Patterns" bên dưới.

### Bước 5 — Review & Gap Analysis (Human review — không được bỏ qua)

Sau khi có script, chủ động rà lại và liệt kê:
- Selector nào còn fragile (không dùng data-testid được).
- Assertion nào yếu (chỉ check 1 khía cạnh trong khi cần check nhiều hơn).
- Case nghiệp vụ nào script **không thể tự phát hiện** nếu chỉ dựa vào UI — đặc biệt nếu người dùng có sẵn bug report hoặc spec nghiệp vụ để đối chiếu.
- Giải thích **tại sao** AI bỏ sót (do thiếu ngữ cảnh nghiệp vụ, do UI không hiển thị lỗi rõ ràng, do không có quyền đọc backend logic...).

Ghi vào `docs/gap-analysis-<feature>.md` nếu người dùng cần tài liệu này cho báo cáo/critique.

## Audit Log (chỉ dùng khi bài tập yêu cầu)

Nếu bài tập yêu cầu ghi log quá trình dùng AI, sau mỗi bước append 1 entry vào `docs/ai-audit-report.md`:

```markdown
### [Bước <1-5>] <Tên feature> — <Ngày giờ>

- **AI tool:** Claude
- **Ngày giờ:** <ISO timestamp>
- **Prompt (tóm tắt):** <prompt đã dùng>
- **Output (tóm tắt):** <mô tả ngắn gọn AI đã sinh ra gì>
- **Người dùng đã sửa gì (nếu có):** <vd: đổi selector, thêm case boundary bị thiếu>
```

## Assertion Patterns

Chọn ít nhất 3 nhóm khác nhau trong cùng bộ script — không đếm 2 assertion cùng nhóm là 2 pattern khác nhau.

**1. UI state assertion** — kiểm tra trạng thái/nội dung hiển thị sau hành động.
```ts
await expect(page.getByTestId('error-message')).toBeVisible();
await expect(page.getByTestId('error-message')).toHaveText('Thông báo lỗi mong đợi');
```

**2. Navigation / URL assertion** — kiểm tra điều hướng đúng sau hành động.
```ts
await expect(page).toHaveURL(/.*\/dashboard/);
```

**3. Network / API response assertion** — intercept response thực tế từ backend để kiểm tra status code hoặc payload, hữu ích để bắt lỗi mà UI có thể che giấu.
```ts
const responsePromise = page.waitForResponse(res => res.url().includes('/api/login'));
await pageObject.submit();
const response = await responsePromise;
expect(response.status()).toBe(400);
```

**4. Business-rule / state assertion** — kiểm tra một quy tắc nghiệp vụ cụ thể chứ không chỉ UI đơn thuần.
```ts
await expect(page.getByTestId('cart-item-count')).toHaveText('0');
```

**5. Accessibility / element count assertion** — đếm số phần tử hoặc kiểm tra thuộc tính (disabled, aria-*).
```ts
await expect(page.getByTestId('submit-btn')).toBeDisabled();
await expect(page.locator('.item-card')).toHaveCount(0);
```

Lưu ý khi review: nếu AI chỉ sinh toàn assertion loại 1 (UI state) cho mọi test case — đây là dấu hiệu "assertion yếu" cần ghi vào gap analysis, vì nhiều lỗi backend chỉ lộ ra qua pattern #3 hoặc #4.

### Strict vs Best-effort — Khi nào nên dùng cái nào?

Một anti-pattern thường gặp: AI sinh network assertion nhưng bọc trong `try/catch` + silent warn để "tránh flake". Cách này **che giấu bug nghiêm trọng** (vd: backend trả 500 thay vì 401 → test vẫn PASS). Quy tắc dưới đây phân loại rõ:

| Tình huống                                          | Nên dùng       | Cách implement                                  |
| --------------------------------------------------- | -------------- | ----------------------------------------------- |
| Verify UI state quan trọng (error visible, URL đổi) | **STRICT**     | `expect(...).toBeVisible()` — fail nếu không match |
| Verify HTTP status code từ backend                  | **STRICT**     | `expect.soft(response.status()).toBe(4xx)` — vẫn fail, nhưng report gọn |
| Verify business rule thực sự quan trọng (locked vs wrong) | **STRICT** | `expect(errorText).toContain("khóa")` — fail nếu message khác |
| Verify timing/side-effect phụ (header đổi sau login) | **BEST-EFFORT** | Warn + log, không fail — vì phụ thuộc render UI |
| Network assertion optional do backend yếu           | **BEST-EFFORT** | Warn + log rõ `cause` — vẫn assert nếu bắt được |

**Công thức quyết định:**
- Nếu assertion mô tả **hành vi nghiệp vụ cốt lõi** (vd: "sai pass → error message") → STRICT.
- Nếu assertion mô tả **side effect không ảnh hưởng pass/fail** (vd: "header đổi tên user") → BEST-EFFORT được phép.

**Đề xuất nâng cao:** Khi best-effort xảy ra thường xuyên (> 30% tests), đó là dấu hiệu backend quá yếu — cần báo dev trước khi đưa test vào CI, không phải "workaround" bằng cách nuốt lỗi.

### Anti-patterns THƯỜNG GẶP (đọc trước khi viết test)

Danh sách này tổng hợp từ gap analysis thực tế của FR-02. Áp dụng khi review (Bước 5):

1. **"Best-effort che giấu bug"** — silent warn thay vì fail test. Ví dụ:
   ```ts
   // ❌ SAI — backend trả 500 vẫn PASS
   const resp = await page.waitForResponse(...).catch(() => null);
   if (resp && resp.status() !== 401) test.warn("wrong status");
   ```
   → Fix: dùng `expect.soft()` để bug hiện rõ trong HTML report.

2. **"Selector toàn cục"** — query toàn trang thay vì scope theo form:
   ```ts
   // ❌ SAI — pick nhầm alert ở header
   this.formErrorMessage = page.locator('[role="alert"]').first();

   // ✅ ĐÚNG — scope theo form
   this.formErrorMessage = page.locator('form [role="alert"]').first();
   ```

3. **"Assert có/không" thay vì "assert nội dung cụ thể"**:
   ```ts
   // ❌ SAI — error "sai pass" và "bị khóa" đều pass
   await expect(po.formErrorMessage).toBeVisible();

   // ✅ ĐÚNG — phân biệt được message
   await expect(po.formErrorMessage).toContainText("khóa");
   ```
   → Áp dụng pattern: với mỗi error case, xác định message cụ thể rồi assert, đừng chỉ check "có error".

4. **"Setup state qua UI" cho mọi case lockout** — rất chậm + không ổn định:
   ```ts
   // ❌ SAI — gọi 3 lần login sai qua UI (tốn 12s, dễ timeout)
   for (let i = 0; i < 3; i++) await po.login(wrongEmail, wrongPass);

   // ✅ ĐÚNG — dùng API nếu có endpoint test/debug
   await page.request.post('/api/test/reset-login-attempts', { data: { email, attempts: 3 } });
   ```
   → Fallback an toàn: thử API trước, UI chỉ là fallback.

5. **"Test n+1"** — chạy lần lượt mà không reset state giữa các case:
   ```ts
   // ❌ SAI — TC-UI-D2 chạy sau TC-UI-D1 có thể bị ảnh hưởng lockout
   test("D1", ...) { /* setup 3 lần sai */ }
   test("D2", ...) { /* gọi login đúng — có thể vẫn bị lock */ }
   ```
   → Fix: `beforeEach` reset state, hoặc mỗi test tự setup state khởi điểm.

6. **"Hard-code URL tuyệt đối"** trong page object:
   ```ts
   // ❌ SAI — chỉ chạy được ở 1 env
   await page.goto('http://localhost:5173/login');

   // ✅ ĐÚNG — dùng baseURL từ config
   await page.goto('/login');
   ```

Khi gặp bất kỳ anti-pattern nào ở trên trong code, ghi vào `gap-analysis-<feature>.md` kèm vị trí file và dòng cụ thể.

## Output cuối cùng của skill (mỗi lần áp dụng cho 1 feature)

```
tests/<feature>/
  <feature>.page.ts                    # Page Object (Bước 2)
  <feature>.spec.ts                    # Script chính (Bước 4)
  data/<feature>-testdata.csv|json     # Test data (Bước 3)
docs/
  ai-audit-report.md                   # Chỉ nếu bài tập yêu cầu, append theo bước
  gap-analysis-<feature>.md            # Bước 5
```

## Phạm vi không xử lý (để hướng dẫn riêng sau)

- Cấu hình `playwright.config.ts` (browser project, reporter, baseURL cố định...).
- Khởi động / quản lý SUT (người dùng tự chạy ở project riêng và cung cấp địa chỉ localhost).
- Chạy đa trình duyệt và xuất báo cáo HTML — thực hiện sau khi có script, theo hướng dẫn cấu hình riêng.
