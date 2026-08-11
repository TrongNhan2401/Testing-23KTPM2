// @ts-check
import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config cho toàn bộ dự án HW04.
 *
 * Thiết kế:
 *   - 3 browsers (chromium + firefox + webkit) — cross-browser coverage
 *   - workers: 1 (tuần tự) → không flood backend, an toàn nhất cho demo backend yếu
 *   - Report HTML ở `reports/` (dùng chung cho FR-01, FR-02, FR-03)
 *
 * Lưu ý quan trọng:
 *   - Bạn PHẢI tự khởi động backend trước khi chạy test:
 *       cd backend && npm start      (hoặc yarn dev)
 *     Mặc định Playwright sẽ connect tới http://localhost:5173
 *     Override bằng env: SUT_URL=http://your-host:port npx playwright test
 *
 *   - Nếu backend hay Vite chậm, có thể bật lại warm up bằng cách:
 *       1. Tạo file `global-setup.js`:
 *          module.exports = async () => { /* warm up logic *\/ };
 *       2. Thêm `globalSetup: require.resolve('./global-setup.js')` vào config này
 *
 * Chạy: npx playwright test                   (toàn bộ 3 FRs)
 *       npx playwright test fr02-login        (chỉ FR-02)
 *       npx playwright test fr02-login -g "A1" (chỉ 1 test)
 */

export default defineConfig({
  testDir: "./tests",

  /* Run tests in files in parallel (nhưng workers=1 → thực tế chạy tuần tự) */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry — tăng local retry vì race condition có thể xảy ra khi 3 browsers */
  retries: process.env.CI ? 2 : 1,
  /* Giới hạn workers để không flood backend khi chạy 3 browsers.
   * Lý do: 3 browsers × nhiều tests = concurrent POST /api/login.
   * Backend demo không chịu nổi concurrent → crash server.
   *
   * workers: 1 (local) = TUẦN TỰ, an toàn nhất cho backend yếu.
   *   → Mất 3-5x thời gian so với song song nhưng pass hết.
   * CI: 1 worker (an toàn nhất).
   *
   * Nếu backend đủ mạnh, có thể tăng: workers: 2 → 4.
   */
  workers: process.env.CI ? 1 : 1,
  /* Reporter — HTML ở reports/ (chung cho 3 FRs), list ra stdout */
  reporter: [
    [
      "html",
      {
        outputFolder: "reports",
        open: "never",
        title: "Run by: 23127443",
      },
    ],
    ["list"],
  ],
  /* Shared settings for all the projects below. */
  use: {
    /* Base URL — có thể override bằng env SUT_URL */
    baseURL: process.env.SUT_URL || "http://localhost:5173",
    /* Collect trace khi retry */
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    video: "retain-on-failure",
    /* Timeout lớn hơn để chờ Vite first compile + best-effort network assertion */
    actionTimeout: 20000,
    navigationTimeout: 30000,
  },

  /* Configure projects for major browsers — 3 browsers đầy đủ */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],

  /* Timeout test tổng (FR-02 D2 đợi 35s lockout + action ~10s → cần 60s) */
  timeout: 60000,
  expect: {
    timeout: 5000,
  },
});
