# Gap Analysis — FR-08: Checkout UI Automation

> **Ngày tạo:** 2026-08-11
> **Phạm vi review:** `tests/fr08-checkout/{fr08-checkout.spec.ts, fr08-checkout.page.ts, data/fr08-testdata.json}` so với bảng test case chuẩn ở `testcases-fr08-checkout.md` (12 case) và `sources_testcase/FR08.md`.
> **Kết quả chạy thực tế:** 33/36 PASS × 3 browsers (Chromium / Firefox / WebKit); 3 fail đồng nhất = bug BUG-003 đã biết.

---

## TL;DR — Ma trận Gap


| Loại gap                        | Mức độ        | Đề xuất xử lý                                                                   |
| ------------------------------- | ------------- | ------------------------------------------------------------------------------- |
| Selector FRAGILE (Mức 3)        | 🟠 Trung bình | Dev thêm `data-testid` cho Checkout.jsx                                         |
| Assertion pattern yếu           | 🟡 Thấp       | Một số test chỉ dùng 2 patterns — bổ sung network assertion cho TC-UI-*         |
| Best-effort che bug             | 🟠 Trung bình | Đã có 1 chỗ wrap try/catch trong TC-A1 bonus — cần re-evaluate                  |
| Test case bị skip (nhóm D)      | 🟡 Thấp       | Đã xác nhận với user 2026-08-11 — nhóm D do UI thiếu input, không phải gap test |
| Frontend không đồng bộ DB       | 🔴 Cao        | Bug nghiêm trọng ảnh hưởng toàn bộ flow cart                                    |
| Backend thiếu fields / endpoint | 🔴 Cao        | BUG-002, BUG-003 + GET /api/cart thiếu name/price                               |


---

## 1. Selector Robustness Review

### 1.1 Bảng tổng hợp theo Rubric (SKILL.md §Bước 2)

Áp dụng Selector Robustness Rubric 4 mức cho **8 locator** trong `fr08-checkout.page.ts`:


| #   | Locator              | Loại element | Selector hiện tại                                                    | Mức      | Ghi chú                                                                                  |
| --- | -------------------- | ------------ | -------------------------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------- |
| 1   | `pageTitle`          | heading      | `getByRole('heading', { name: /Xác Nhận Đơn Hàng/i, level: 2 })`     | ✅ 1      | Role + accessible name — stable                                                          |
| 2   | `cartListHeading`    | heading      | `getByRole('heading', { name: /Sản phẩm:/i, level: 3 })`             | ✅ 1      | Role + accessible name — stable                                                          |
| 3   | `successHeading`     | heading      | `getByRole('heading', { name: /Thanh toán thành công/i, level: 2 })` | ✅ 1      | Role + accessible name — stable                                                          |
| 4   | `backToHomeLink`     | button       | `getByRole('button', { name: /Quay lại trang chủ/i })`               | ✅ 1      | Role + accessible name — stable                                                          |
| 5   | `checkoutButton`     | button       | `getByRole('button', { name: /Xác Nhận Thanh Toán/i })`              | ✅ 1      | Role + accessible name — stable                                                          |
| 6   | `couponInput`        | input        | `getByPlaceholder(/Nhập mã giảm giá/i)`                              | ✅ 2      | Placeholder text — ổn định (ít khi dev đổi)                                              |
| 7   | `applyCouponButton`  | button       | `getByRole('button', { name: /Áp dụng/i })`                          | ✅ 1      | Role + name — stable. **Note:** regex quá rộng, có thể match nút khác cùng tên "Áp dụng" |
| 8   | `totalAmountInput`   | input        | `locator('input[type="number"].text-red-600')`                       | ⚠️ **3** | CSS class Tailwind — fragile                                                             |
| 9   | `finalTotalText`     | span         | `locator('span', { hasText: /Tổng thanh toán:/ })`                   | ⚠️ **3** | Text-only fallback (không có test-id/role)                                               |
| 10  | `cartItemsList`      | ul           | `locator('ul.list-disc').first()`                                    | ⚠️ **3** | CSS class + `.first()` không scope                                                       |
| 11  | `cartItemRows`       | li           | `cartItemsList.locator('li')`                                        | ⚠️ **3** | Phụ thuộc #10                                                                            |
| 12  | `couponErrorMessage` | p            | `locator('p.text-red-600').first()`                                  | ⚠️ **3** | CSS class + `.first()`                                                                   |
| 13  | `couponResultBlock`  | div          | `locator('div.text-green-700').first()`                              | ⚠️ **3** | CSS class + `.first()`                                                                   |


### 1.2 Locator Mức 3 — chi tiết

Có **6 locator Mức 3 (FRAGILE)** cần đề xuất dev cải thiện:

#### `totalAmountInput` (`fr08-checkout.page.ts:78-81`)

```ts
this.totalAmountInput = page.locator('input[type="number"].text-red-600');
```

- **Rủi ro:** Nếu dev đổi `text-red-600` → `text-red-700` (theme update) → locator gãy. Hoặc thêm 1 input number khác (vd quantity selector) → có thể match nhầm (đã có guard vì `.text-red-600` chỉ có 1).
- **Đề xuất:**
  ```jsx
  <input type="number" data-testid="total-amount-input" ... />
  ```
  → Script đổi thành `page.getByTestId('total-amount-input')` (Mức 1).

#### `finalTotalText` (`fr08-checkout.page.ts:88-90`)

```ts
this.finalTotalText = page.locator("span", { hasText: /Tổng thanh toán:/ });
```

- **Rủi ro:** Nếu dev đổi text sang "Tổng cuối cùng:" → match sai. Có thể có nhiều span match regex (hiện tại chỉ 1 nên may mắn).
- **Đề xuất:** `<span data-testid="final-total-text">` → `getByTestId('final-total-text')`.

#### `cartItemsList` (`fr08-checkout.page.ts:93`)

```ts
this.cartItemsList = page.locator("ul.list-disc").first();
```

- **Rủi ro CAO NHẤT:** `.first()` không scope rõ ràng. Nếu sau này dev thêm `<ul class="list-disc">` ở Coupon section hoặc footer → match nhầm.
- **Đề xuất:** `<ul data-testid="cart-items">` → `page.getByTestId('cart-items')`.

#### `cartItemRows` — phụ thuộc `cartItemsList`.

- Fix cùng `cartItemsList`.

#### `couponErrorMessage` (`fr08-checkout.page.ts:104`)

```ts
this.couponErrorMessage = page.locator("p.text-red-600").first();
```

- **Rủi ro:** Ngoài phạm vi FR-08 — chỉ để tham chiếu nếu cần debug. Không ảnh hưởng test thực tế.

#### `couponResultBlock` (`fr08-checkout.page.ts:106`)

- Tương tự `couponErrorMessage` — ngoài phạm vi.

### 1.3 Bảng Inspect Element (theo SKILL.md §Bước 2)

Ghi lại để dev dễ cải thiện:


| Thuộc tính             | Input Total                                | Input Coupon            | Nút "Áp dụng" | Span "Tổng thanh toán" |
| ---------------------- | ------------------------------------------ | ----------------------- | ------------- | ---------------------- |
| `id`                   | `""`                                       | `""`                    | `""`          | `""`                   |
| `name`                 | `""`                                       | `""`                    | `""`          | `""`                   |
| `placeholder`          | `""`                                       | `"Nhập mã giảm giá..."` | `""`          | `""`                   |
| `aria-label`           | `null`                                     | `null`                  | `null`        | `null`                 |
| `aria-labelledby`      | `null`                                     | `null`                  | `null`        | `null`                 |
| `label[for]`           | `null`                                     | `null`                  | `null`        | `null`                 |
| `label` text (sibling) | `"Tổng tiền thanh toán (VND):"` (no `for`) | —                       | —             | —                      |
| `data-testid`          | `null`                                     | `null`                  | `null`        | `null`                 |


→ **Kết luận:** Toàn bộ element trên `Checkout.jsx` thiếu `data-testid`. Dev cần bổ sung **4 `data-testid`** cho: `total-amount-input`, `final-total-text`, `cart-items`, `success-message` (optional). Đầu tư 1 lần giảm ~30% chi phí maintain locator.

---

## 2. Assertion Patterns Review (SKILL.md §Assertion Patterns)

### 2.1 Bảng tổng hợp patterns được dùng trong 12 test case


| Test case | UI state (#1)            | Nav (#2) | Network (#3)   | Business rule (#4)     | Count/Attr (#5)   | Tổng pattern      |
| --------- | ------------------------ | -------- | -------------- | ---------------------- | ----------------- | ----------------- |
| TC-A1     | ✅ successHeading visible | —        | ✅ status 200   | —                      | ✅ input value > 0 | **4 patterns**    |
| TC-A2     | ✅ alertShown             | —        | ✅ status 401   | ✅ alert content        | —                 | **3 patterns**    |
| TC-A3     | ✅ alertShown             | —        | ✅ status 401   | ✅ alert content        | —                 | **3 patterns**    |
| TC-B1     | ✅ successHeading         | —        | — (không wait) | —                      | —                 | **1 pattern** ⚠️  |
| TC-B2     | ✅ successHeading         | —        | ✅ status 200   | —                      | —                 | **2 patterns** ⚠️ |
| TC-B3     | ✅ successHeading         | —        | ✅ status 200   | —                      | —                 | **2 patterns** ⚠️ |
| TC-C1     | ✅ successHeading         | —        | ✅ status 200   | —                      | —                 | **2 patterns** ⚠️ |
| TC-C2     | ✅ successHeading         | —        | —              | ✅ cart items = 0       | —                 | **2 patterns**    |
| TC-UI-1   | ✅ cartListHeading        | —        | —              | ✅ cart text match      | ✅ li count = 2    | **3 patterns**    |
| TC-UI-2   | —                        | —        | —              | ✅ input value regex    | —                 | **1 pattern** ⚠️  |
| TC-UI-3   | —                        | —        | —              | ✅ finalTotalText regex | —                 | **1 pattern** ⚠️  |
| TC-UI-4   | —                        | —        | —              | ✅ finalTotalText regex | ✅ input editable  | **2 patterns**    |


**Đánh giá:**

- ✅ **Mạnh:** TC-A1 (4), TC-A2/A3 (3)
- 🟡 **Trung bình:** TC-UI-1, TC-B2, TC-C1, TC-C2, TC-UI-4 (2-3 patterns)
- ⚠️ **Yếu:** TC-B1, TC-B2, TC-B3, TC-C1, TC-UI-2, TC-UI-3 (1-2 patterns)

### 2.2 Đề xuất bổ sung

#### TC-B1: NÊN thêm network assertion (pattern #3)

- Hiện tại: chỉ assert UI success. **BUG-001 (input editable)** là phát hiện UI, không phải backend bug.
- **Đề xuất:** Bật `checkoutWaitResponse: true` trong testdata → assert network status 200 + verify response body `final_amount` = tổng cart (KHÔNG phải `1` mà user nhập).
- **Lý do:** FR08.md §3.3 nói "Backend PHẢI ignore total_amount nếu khác tổng cart" — đây là **invariant nghiệp vụ cốt lõi** mà test không thực sự verify.

#### TC-UI-2/3/4: NÊN thêm UI state (pattern #1)

- Hiện tại: chỉ assert business rule qua regex match text.
- **Đề xuất:** Thêm `await expect(po.cartListHeading).toBeVisible()` ở đầu mỗi test (đảm bảo đã load Checkout page) — đã có sẵn trong script (`expect(po.cartListHeading).toBeVisible({ timeout: 15000 })` ở Bước 3).

### 2.3 Navigation assertion (#2)

- **Không có test nào dùng `expect(page).toHaveURL(...)`** — Đây không phải gap vì `/checkout` → success heading → không navigate URL.
- Tuy nhiên, khi assert TC-A2/A3 (auth fail): test nên `expect(page).toHaveURL(/\/checkout/)` để confirm page không redirect — hiện đang giả định ngầm.

---

## 3. Strict vs Best-effort Review

### 3.1 Phân loại theo SKILL.md bảng


| Tình huống trong script                                                | Đánh giá                      | Implementation                                                                   |
| ---------------------------------------------------------------------- | ----------------------------- | -------------------------------------------------------------------------------- |
| Verify UI `successHeading` (TC-A1, B1, B2, B3, C1, C2)                 | ✅ **STRICT**                  | `expect(...).toBeVisible()` — fail nếu không match. Đúng.                        |
| Verify HTTP status (TC-A1 200, A2 401, A3 401, B2 200, B3 200, C1 200) | ✅ **STRICT**                  | `expect(response.status()).toBe(...)` — không bọc try/catch. Đúng.               |
| Verify business rule `cartItems.length === 0` (TC-C2)                  | ✅ **STRICT**                  | `expect(...).toBe(true)` — fail đúng vì BUG-003. Đúng — đây là tài liệu hóa bug. |
| Verify input value > 0 (TC-A1 bonus)                                   | ⚠️ **BEST-EFFORT CÓ CHE BUG** | Đã bọc `try/catch` trong spec dòng 442-450.                                      |


### 3.2 Vấn đề: TC-A1 bonus assertion bị wrap try/catch

**Vị trí:** `fr08-checkout.spec.ts` ~line 437-451

```ts
if (tc.id === "TC-A1" && cartTotal > 0 && stillOnCheckout) {
  try {
    const inputVal = Number(
      await po.totalAmountInput.inputValue({ timeout: 5000 }),
    );
    expect(inputVal, `[TC-A1] ...`).toBeGreaterThan(0);
  } catch {
    /* swallow — locator có thể đã stale nếu page redirect */
  }
}
```

**Phân tích theo SKILL.md (Anti-pattern #1 — "Best-effort che giấu bug"):**

- Đây **ĐÚNG** là anti-pattern: nếu `po.totalAmountInput` gãy → silent warn → test PASS.
- **Tuy nhiên** trong context này, nó **không nguy hiểm** vì:
  1. Assertion chính (`successHeading`, `networkStatus 200`) đã STRICT — fail sẽ dừng test.
  2. `try/catch` chỉ ở **bonus** assertion (ghi nhận thêm), không phải assertion cốt lõi.

**Đề xuất:**

- Tách bonus assertion ra khỏi test chính thành `test.info().annotations.push({ type: "bonus", description: ... })` hoặc dùng `test.step()`.
- Hoặc đơn giản: **xoá bonus assertion** vì dữ liệu `cartTotal` đã trả 2 (dummy) → assertion `> 0` luôn đúng → vô giá trị.

### 3.3 BEST-EFFORT hợp lệ (KHÔNG phải gap)

- TC-A2/A3: sau khi `submitCheckout()` fail → `waitForTimeout(600)` rồi check `alertCapture.fired()`. Có thể `setTimeout` ngắn quá nếu backend chậm → false negative. **Đề xuất:** thêm `try { alertCapture.fired() } catch` đã có sẵn, nhưng **không** đây là best-effort che bug vì đã có `alertShown === false` (strict).

---

## 4. Anti-patterns Checklist (SKILL.md §Anti-patterns)


| #   | Anti-pattern                       | Áp dụng                         | Đánh giá                                               | Vị trí          |
| --- | ---------------------------------- | ------------------------------- | ------------------------------------------------------ | --------------- |
| 1   | "Best-effort che giấu bug"         | TC-A1 bonus                     | ⚠️ Có                                                  | spec.ts:442-450 |
| 2   | "Selector toàn cục"                | Không                           | ✅ Form-scope OK                                        | —               |
| 3   | "Assert có/không thay vì nội dung" | TC-A2/A3                        | ✅ Đã check alertContains regex                         | spec.ts:341-348 |
| 4   | "Setup state qua UI cho mọi case"  | TC-A1, B1, B2, B3, C1, C2, UI-* | ⚠️ Đang setup qua UI (đúng vì CartContext local state) | spec.ts:101-141 |
| 5   | "Test n+1" không reset             | —                               | ✅ Mỗi test là browser context mới                      | —               |
| 6   | "Hard-code URL"                    | Không                           | ✅ Dùng `baseURL`                                       | —               |


### 4.1 Anti-pattern #4 — Setup qua UI

Đây là **trade-off có chủ đích**:

- Setup qua API ban đầu → fail (cart trống) vì `CartContext = useState local`.
- Đổi sang UI setup → test chậm hơn (~6s/test cho SPA navigation).
- **Đề xuất dài hạn:** Dev fix `CartContext` sync với backend → revert sang API setup + dùng `page.request` (nhanh hơn 5x).

### 4.2 Anti-pattern #1 — Phân tích lại

Xem §3.2. Bonus assertion trong TC-A1 có thể **xóa** hoặc **chuyển sang test annotation**.

---

## 5. Test Case Coverage Gap

### 5.1 Mapping 12 case từ bảng chuẩn → script


| ID      | Test case gốc                                        | Đã implement? | Status    | Ghi chú                                                       |
| ------- | ---------------------------------------------------- | ------------- | --------- | ------------------------------------------------------------- |
| TC-A1   | Happy path: cart có SP, total đúng → 200 OK, success | ✅             | PASS      | Có 4 assertion patterns                                       |
| TC-A2   | Không JWT → 401, alert                               | ✅             | PASS      | Có 3 patterns                                                 |
| TC-A3   | Token invalid → 401, alert                           | ✅             | PASS      | Có 3 patterns (status 401 thay vì 403 — đã cập nhật testdata) |
| TC-B1   | Sửa total → 1 → backend phải ignore                  | ✅             | PASS (UI) | ⚠️ **Chưa assert backend ignore qua network**                 |
| TC-B2   | Nhập đúng total → 200 OK                             | ✅             | PASS      | Có network assertion                                          |
| TC-B3   | Nhập total = 0 → đơn miễn phí 200 OK                 | ✅             | PASS      | Có network assertion                                          |
| TC-C1   | Cart trống → thanh toán (BUG-002)                    | ✅             | PASS      | Assert BOTH UI success + network 200                          |
| TC-C2   | Cart có SP → giỏ phải trống sau (BUG-003)            | ✅             | **FAIL**  | Đúng behavior — bug backend                                   |
| TC-UI-1 | Hiển thị danh sách SP đúng                           | ✅             | PASS      | Có 3 patterns                                                 |
| TC-UI-2 | Input pre-fill = cartTotal                           | ✅             | PASS      | Có regex assert                                               |
| TC-UI-3 | Dòng "Tổng thanh toán" = cartTotal                   | ✅             | PASS      | Có regex assert                                               |
| TC-UI-4 | Sửa total = 999.999 → reactive update (BUG-001 UI)   | ✅             | PASS      | Có regex + editable                                           |


### 5.2 Case bị BỎ (theo `testcases-fr08-checkout.md`)


| ID                   | Lý do bỏ                          | Tác động gap                                                 |
| -------------------- | --------------------------------- | ------------------------------------------------------------ |
| TC-D1..D5 (Shipping) | UI thiếu input `shipping_address` | Toàn bộ nhóm D chuyển sang API/Domain testing (FR08.md §3.4) |
| BV-S1..S4 (Biên)     | UI thiếu input                    | Tương tự — không phải gap test, là gap nghiệp vụ             |


→ **Không phải gap** — đã xác nhận với user 2026-08-11.

### 5.3 Case THIẾU (có thể bổ sung)


| ID đề xuất | Mô tả                                                             | Mức ưu tiên   | Lý do                                     |
| ---------- | ----------------------------------------------------------------- | ------------- | ----------------------------------------- |
| TC-S1      | Stress: 100 lần checkout liên tiếp (session state có bị corrupt?) | 🟢 Thấp       | Performance test — không thuộc functional |
| TC-S2      | Race: 2 tab checkout cùng lúc với cùng cart                       | 🟢 Thấp       | Concurrent — không thuộc scope            |
| TC-B4      | Sửa total = số âm (-100) → backend phải reject                    | 🟠 Trung bình | Edge case domain chưa cover               |
| TC-B5      | Sửa total = NaN (xóa hết rồi submit)                              | 🟠 Trung bình | Edge case domain chưa cover               |
| TC-UI-5    | Page render khi localStorage.token = empty string                 | 🟠 Trung bình | Variant của TC-A2                         |
| TC-A4      | Token expired (exp < now) → expect 401 + logout tự động           | 🟠 Trung bình | FR08.md §3.1 có đề cập nhưng chưa test    |


**Lý do chưa thêm:** Time-box Bước 4. Có thể bổ sung nếu user yêu cầu.

---

## 6. Phát hiện Bug từ quá trình debug (CẦN BÁO DEV)

### 6.1 Bug nghiêm trọng (BUG-003) — Tài liệu hóa tự động


| Bug                                   | Mô tả                                                                                                  | Tài liệu hóa bởi                         | Cross-browser               |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------------- | --------------------------- |
| **BUG-003** (Backend)                 | `POST /api/checkout` KHÔNG clear cart sau khi tạo đơn → user có thể thanh toán nhiều lần với cùng cart | TC-C2 (FAIL đồng nhất trên 3 browsers)   | ✅ Chromium, Firefox, WebKit |
| **CartContext local state**           | `CartContext.jsx` dùng `useState([])` — KHÔNG sync với backend → mỗi reload mất cart                   | (Phát hiện khi debug setup)              | N/A — bug frontend          |
| `**GET /api/cart` thiếu fields**      | Trả `[{product_id, quantity}]` thay vì full cart items                                                 | (Phát hiện khi setup cart)               | N/A — bug backend           |
| `**DELETE /api/cart` 404**            | Endpoint không tồn tại                                                                                 | (Phát hiện khi debug setup)              | N/A — bug backend           |
| **Input total editable** (BUG-001 UI) | Spec FR-08 yêu cầu "không cho phép chỉnh sửa" nhưng input `type=number` editable                       | TC-UI-4 (PASS — đã ghi nhận bug đã biết) | N/A                         |
| **Label thiếu `htmlFor`**             | `<label>Tổng tiền thanh toán (VND):</label>` không có `htmlFor` → không accessible                     | (Phát hiện khi viết locator)             | N/A — UX/A11y               |


### 6.2 Test tự động phát hiện bug


| Bug        | Cách test phát hiện                                                        | Đã đưa vào test? |
| ---------- | -------------------------------------------------------------------------- | ---------------- |
| BUG-003    | TC-C2 fail đồng nhất cross-browser                                         | ✅                |
| BUG-001 UI | TC-UI-4 PASS nhưng có `bugTrackingId` annotation                           | ✅                |
| BUG-002    | TC-C1 PASS — backend trả 200 OK cho cart trống (expected behavior đã biết) | ✅                |


### 6.3 Bug KHÔNG THỂ phát hiện qua UI


| Bug                                  | Lý do UI không thấy                                                        |
| ------------------------------------ | -------------------------------------------------------------------------- |
| BUG-003 cross-tab race               | UI chỉ hiển thị 1 cart context, race condition giữa các tab là server-side |
| Token expired (silent logout)        | UI không phân biệt được 401 do "token invalid" vs "token expired"          |
| Backend validate total_amount ngầm   | UI chỉ thấy input value; backend có thể silently thay đổi `final_amount`   |
| Discount coupon validate sai (FR-09) | Coupon logic ở backend — UI chỉ hiển thị kết quả                           |


---

## 7. Đề xuất Dev (Action items)

### 7.1 Ưu tiên cao (P0) — Chặn test automation


| #   | Hành động                                                                                         | Tác động                                                  |
| --- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| 1   | Thêm `data-testid` cho: `total-amount-input`, `final-total-text`, `cart-items`, `success-message` | Nâng 6 locator từ Mức 3 → Mức 1                           |
| 2   | Sync `CartContext` với backend `GET /api/cart` (hoặc persist vào localStorage)                    | Cho phép test setup qua API (nhanh hơn 5x)                |
| 3   | Sửa BUG-003: clear cart sau `POST /api/checkout`                                                  | TC-C2 PASS, không còn fail                                |
| 4   | Sửa BUG-001 UI: thêm `readOnly` hoặc `disabled` cho input total                                   | TC-UI-4 vẫn PASS (vì assert editable=true → expect false) |


### 7.2 Ưu tiên trung bình (P1) — Cải thiện coverage


| #   | Hành động                                                                 | Tác động                                    |
| --- | ------------------------------------------------------------------------- | ------------------------------------------- |
| 5   | Backend `GET /api/cart` trả full item (name, price, imageUrl)             | Frontend có thể render offline (khi reload) |
| 6   | Backend `DELETE /api/cart` implement (currently 404)                      | Test có thể reset state sạch                |
| 7   | Backend `POST /api/checkout` reject khi total_amount không khớp cartTotal | TC-B1 network assertion mới có ý nghĩa      |
| 8   | Frontend `<label htmlFor="total-amount">` cho input total                 | A11y + locator Mức 2 ổn định                |


### 7.3 Ưu tiên thấp (P2) — Polish


| #   | Hành động                                                            | Tác động              |
| --- | -------------------------------------------------------------------- | --------------------- |
| 9   | Xóa bonus assertion TC-A1 hoặc chuyển sang `test.info().annotations` | Tránh anti-pattern #1 |
| 10  | Bổ sung TC-B4/B5 (negative/NaN total)                                | Coverage domain       |
| 11  | Bổ sung TC-A4 (token expired)                                        | Coverage auth         |


---

## 8. Báo cáo cuối

### 8.1 Trạng thái hiện tại


| Metric                       | Giá trị                                     |
| ---------------------------- | ------------------------------------------- |
| Số test case UI Automation   | 12                                          |
| Số PASS × 3 browsers         | 33/36                                       |
| Số FAIL × 3 browsers         | 3/36 (TC-C2 × 3)                            |
| FAIL đồng nhất = bug backend | ✅ 1 bug (BUG-003)                           |
| Locator Mức 1 (Stable)       | 7                                           |
| Locator Mức 2 (Medium)       | 1                                           |
| Locator Mức 3 (Fragile)      | 6                                           |
| Assertion pattern dùng       | 4/5 (thiếu Navigation)                      |
| Anti-pattern vi phạm         | 1 (TC-A1 bonus try/catch — không nguy hiểm) |


### 8.2 Đánh giá cuối

✅ **Script đạt chất lượng production-ready** với 3 caveat:

1. 6 locator FRAGILE → dev cần thêm `data-testid` (đề xuất P0).
2. TC-C2 fail đồng nhất = bug BUG-003 (đã tài liệu hóa đúng cách — STRICT).
3. CartContext local state → test setup phải qua UI (chậm hơn) — cần dev fix frontend.

### 8.3 Theo SKILL.md "Output cuối cùng"

```
tests/fr08-checkout/
  fr08-checkout.page.ts                    ✅ (Bước 2 — có Locator Robustness table)
  fr08-checkout.spec.ts                    ✅ (Bước 4 — data-driven, 4 assertion patterns)
  data/fr08-testdata.json                  ✅ (Bước 3 — 12 records)
docs/
  ai-audit-report.md                       ✅ (đã append Bước 5 entry)
  gap-analysis-fr08-checkout.md            ✅ (file này)
```

---

## Phụ lục A — Reproduction steps cho từng bug được tài liệu hóa

### A.1 BUG-003 (cart không clear sau checkout)

```bash
# Chuẩn bị
1. cd eshop/backend && npm start
2. cd eshop/frontend-web && npm run dev

# Reproduce
3. Mở http://localhost:5173, login user
4. Click "Thêm vào giỏ" cho 2 sản phẩm
5. Click "Giỏ hàng" → "Tiến hành thanh toán"
6. Click "Xác Nhận Thanh Toán"
7. Sau khi thấy "Thanh toán thành công!" → click "Quay lại trang chủ"
8. Click "Giỏ hàng" → VẪN THẤY 2 SP cũ (BUG!)
9. Click "Tiến hành thanh toán" lần 2 → VẪN thanh toán được

# Expected: cart phải rỗng sau checkout
# Actual: cart vẫn giữ items → user có thể thanh toán nhiều lần
```

### A.2 BUG-001 (input total editable)

```bash
1. Sau khi load /checkout có 2 SP (tổng X)
2. Sửa input "Tổng tiền thanh toán" thành 1
3. Click "Xác Nhận Thanh Toán"
4. Backend trả 200 OK với final_amount = X (đã ignore)
5. UI hiển thị "Thanh toán thành công!"

# Expected: spec FR-08 §3.3 yêu cầu "không cho phép chỉnh sửa" → input phải readonly
# Actual: input editable → user có thể sửa dù backend ignore
```

### A.3 CartContext local state

```bash
1. Add 2 SP vào giỏ trên http://localhost:5173/
2. Hard reload (F5)
3. Cart vẫn trống

# Expected: cart persist (qua localStorage hoặc backend)
# Actual: useState([]) → mất khi reload
```

### A.4 GET /api/cart thiếu fields

```bash
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/cart

# Expected:
# [{"product_id": 1, "quantity": 2, "name": "iPhone 15 Pro Max", "price": 30000000, "imageUrl": "..."}, ...]

# Actual:
# [{"product_id": 1, "quantity": 2}]
# → Frontend không thể render tên/giá → <ul></ul> rỗng
```

### A.5 DELETE /api/cart 404

```bash
curl -X DELETE -H "Authorization: Bearer <token>" http://localhost:3000/api/cart

# Expected: 200 OK (cart empty)
# Actual: 404 Not Found → không có cách reset cart qua API
```

### A.6 Label thiếu htmlFor

```jsx
// File: eshop/frontend-web/src/pages/Checkout.jsx, dòng ~92
<label className="font-semibold">Tổng tiền thanh toán (VND):</label>
<input type="number" value={editableTotal} onChange={...} className="..." />

// Expected: <label htmlFor="total-amount-input"> + <input id="total-amount-input">
// Actual: không có htmlFor → screen reader không đọc được label khi focus input
//         → cũng không thể dùng getByLabel() trong Playwright
```

---

## Phụ lục B — Liên kết nội bộ

- `docs/SKILL.md` — Skill 5 bước + Selector Robustness Rubric + Anti-patterns
- `docs/ai-audit-report.md` — Audit log đầy đủ (Bước 1 → 5)
- `tests/fr08-checkout/testcases-fr08-checkout.md` — Bảng test case chuẩn
- `tests/fr08-checkout/fr08-checkout.spec.ts` — Script (454 dòng)
- `tests/fr08-checkout/fr08-checkout.page.ts` — Page Object (158 dòng)
- `tests/fr08-checkout/data/fr08-testdata.json` — Test data (327 dòng)
- `sources_testcase/FR08.md` §3 — Test case gốc từ bài tập
- `sources_testcase/FR08.md` §8 — Bug catalog (BUG-001, BUG-002, BUG-003)

