/**
 * Test Script cho FR-02: User Login
 * Chạy tự động tất cả 16 test case và ghi kết quả ra file
 * 
 * Cách sử dụng:
 *   node test-cases/run-tests.js
 * 
 * Output:
 *   - Console: kết quả tóm tắt
 *   - File: test-cases/results/FR-02-test-results-{timestamp}.txt
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

// ============== CẤU HÌNH ==============
const BASE_URL = 'http://localhost:3000';
const LOGIN_ENDPOINT = `${BASE_URL}/api/login`;
const OUTPUT_DIR = path.resolve(__dirname, 'results');

// Test user data
const TEST_USER = {
  email: 'test@eshop.com',
  password: 'Test1234!',
  wrongPassword: 'wrongpassword',
  invalidEmail: 'notexist@eshop.com',
  badFormatEmail: 'invalid-email'
};

// ============== HÀM TIỆN ÍCH ==============

function formatDate(date) {
  return date.toISOString().replace(/[:.]/g, '-');
}

function getTimestamp() {
  return formatDate(new Date());
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function dbRun(sql) {
  return new Promise((resolve, reject) => {
    const sqlite3 = require('better-sqlite3');
    const dbPath = path.resolve(__dirname, '..', 'eshop', 'backend', 'database.sqlite');
    
    try {
      const db = sqlite3(dbPath);
      db.exec(sql);
      db.close();
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

async function dbQuery(sql) {
  return new Promise((resolve, reject) => {
    const sqlite3 = require('better-sqlite3');
    const dbPath = path.resolve(__dirname, '..', 'eshop', 'backend', 'database.sqlite');
    
    try {
      const db = sqlite3(dbPath);
      const result = db.prepare(sql).get();
      db.close();
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
}

function httpRequest(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            body: JSON.parse(data)
          });
        } catch {
          resolve({
            status: res.statusCode,
            body: data
          });
        }
      });
    });
    
    req.on('error', reject);
    
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function resetUser() {
  const sql = `UPDATE users SET login_attempts = 0, locked_until = NULL WHERE email = 'test@eshop.com'`;
  await dbRun(sql);
}

async function setupUser(sql) {
  await dbRun(sql);
  // Small delay to ensure DB write is committed
  await new Promise(resolve => setTimeout(resolve, 100));
}

// Hàm setup lockout - dùng ISO string để đảm bảo format đúng như server
async function setupLockout(minutesFromNow = 3, currentAttempts = 2) {
  const lockedUntil = new Date(Date.now() + minutesFromNow * 60 * 1000).toISOString();
  await dbRun(`UPDATE users SET login_attempts = ${currentAttempts}, locked_until = '${lockedUntil}' WHERE email = 'test@eshop.com'`);
  await new Promise(resolve => setTimeout(resolve, 100));
}

async function login(email, password) {
  return httpRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/api/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }, { email, password });
}

function log(message) {
  console.log(message);
}

function addResult(results, line) {
  results.push(line);
}

// ============== TEST CASES ==============

async function runTC01(results) {
  addResult(results, '');
  addResult(results, '='.repeat(70));
  addResult(results, 'TC01 — Đăng nhập thành công (Valid)');
  addResult(results, '='.repeat(70));
  
  await resetUser();
  addResult(results, '[Setup] Reset user: login_attempts = 0, locked_until = NULL');
  
  const response = await login(TEST_USER.email, TEST_USER.password);
  
  addResult(results, `[Request] POST ${LOGIN_ENDPOINT}`);
  addResult(results, `[Body] {"email": "${TEST_USER.email}", "password": "${TEST_USER.password}"}`);
  addResult(results, `[Status] ${response.status}`);
  addResult(results, `[Response] ${JSON.stringify(response.body)}`);
  
  const passed = response.status === 200 && response.body.token;
  addResult(results, `[Result] ${passed ? '✅ PASSED' : '❌ FAILED'}`);
  
  return passed;
}

async function runTC02(results) {
  addResult(results, '');
  addResult(results, '='.repeat(70));
  addResult(results, 'TC02 — Email không tồn tại (Invalid)');
  addResult(results, '='.repeat(70));
  
  const response = await login(TEST_USER.invalidEmail, TEST_USER.password);
  
  addResult(results, `[Request] POST ${LOGIN_ENDPOINT}`);
  addResult(results, `[Body] {"email": "${TEST_USER.invalidEmail}", "password": "..."}`);
  addResult(results, `[Status] ${response.status}`);
  addResult(results, `[Response] ${JSON.stringify(response.body)}`);
  
  const passed = response.status === 401;
  addResult(results, `[Result] ${passed ? '✅ PASSED' : '❌ FAILED'}`);
  
  return passed;
}

async function runTC03(results) {
  addResult(results, '');
  addResult(results, '='.repeat(70));
  addResult(results, 'TC03 — Email sai định dạng (Invalid)');
  addResult(results, '='.repeat(70));
  
  const response = await login(TEST_USER.badFormatEmail, TEST_USER.password);
  
  addResult(results, `[Request] POST ${LOGIN_ENDPOINT}`);
  addResult(results, `[Body] {"email": "${TEST_USER.badFormatEmail}", "password": "..."}`);
  addResult(results, `[Status] ${response.status}`);
  addResult(results, `[Response] ${JSON.stringify(response.body)}`);
  
  const passed = response.status === 401;
  addResult(results, `[Result] ${passed ? '✅ PASSED' : '❌ FAILED'}`);
  
  return passed;
}

async function runTC04(results) {
  addResult(results, '');
  addResult(results, '='.repeat(70));
  addResult(results, 'TC04 — Password sai (Invalid)');
  addResult(results, '='.repeat(70));
  
  await resetUser();
  const response = await login(TEST_USER.email, TEST_USER.wrongPassword);
  
  addResult(results, `[Setup] Reset user`);
  addResult(results, `[Request] POST ${LOGIN_ENDPOINT}`);
  addResult(results, `[Body] {"email": "${TEST_USER.email}", "password": "wrongpassword"}`);
  addResult(results, `[Status] ${response.status}`);
  addResult(results, `[Response] ${JSON.stringify(response.body)}`);
  
  const passed = response.status === 401;
  addResult(results, `[Result] ${passed ? '✅ PASSED' : '❌ FAILED'}`);
  
  return passed;
}

async function runTC05(results) {
  addResult(results, '');
  addResult(results, '='.repeat(70));
  addResult(results, 'TC05 — Tài khoản đang bị khóa (Invalid)');
  addResult(results, '='.repeat(70));

  await setupLockout(3, 2);

  const response = await login(TEST_USER.email, TEST_USER.password);

  addResult(results, `[Setup] locked_until = future (+3 min), login_attempts = 2`);
  addResult(results, `[Request] POST ${LOGIN_ENDPOINT}`);
  addResult(results, `[Body] {"email": "${TEST_USER.email}", "password": "..."}`);
  addResult(results, `[Status] ${response.status}`);
  addResult(results, `[Response] ${JSON.stringify(response.body)}`);

  const passed = response.status === 403;
  addResult(results, `[Result] ${passed ? '✅ PASSED' : '❌ FAILED'}`);

  return passed;
}

async function runTC06(results) {
  addResult(results, '');
  addResult(results, '='.repeat(70));
  addResult(results, 'TC06 — login_attempts >= 3, hết hạn khóa (Valid)');
  addResult(results, '='.repeat(70));
  
  await setupUser(`UPDATE users SET login_attempts = 5, locked_until = datetime('now', '-1 minute') WHERE email = 'test@eshop.com'`);
  const response = await login(TEST_USER.email, TEST_USER.password);
  
  addResult(results, `[Setup] login_attempts = 5, locked_until = past (-1 min)`);
  addResult(results, `[Request] POST ${LOGIN_ENDPOINT}`);
  addResult(results, `[Body] {"email": "${TEST_USER.email}", "password": "..."}`);
  addResult(results, `[Status] ${response.status}`);
  addResult(results, `[Response] ${JSON.stringify(response.body)}`);
  
  const passed = response.status === 200 && response.body.token;
  addResult(results, `[Result] ${passed ? '✅ PASSED' : '❌ FAILED'}`);
  
  return passed;
}

async function runTC07(results) {
  addResult(results, '');
  addResult(results, '='.repeat(70));
  addResult(results, 'TC07 — login_attempts = NULL (Invalid)');
  addResult(results, '='.repeat(70));
  
  await setupUser(`UPDATE users SET login_attempts = NULL WHERE email = 'test@eshop.com'`);
  const response = await login(TEST_USER.email, TEST_USER.password);
  
  addResult(results, `[Setup] login_attempts = NULL`);
  addResult(results, `[Request] POST ${LOGIN_ENDPOINT}`);
  addResult(results, `[Status] ${response.status}`);
  addResult(results, `[Response] ${JSON.stringify(response.body)}`);
  
  const passed = response.status === 200 || response.status === 500;
  addResult(results, `[Note] Chấp nhận 200 hoặc 500 (tùy DB xử lý NULL)`);
  addResult(results, `[Result] ${passed ? '✅ PASSED' : '❌ FAILED'}`);
  
  return passed;
}

async function runTC08(results) {
  addResult(results, '');
  addResult(results, '='.repeat(70));
  addResult(results, 'TC08 — login_attempts = số âm (Invalid)');
  addResult(results, '='.repeat(70));
  
  await setupUser(`UPDATE users SET login_attempts = -1 WHERE email = 'test@eshop.com'`);
  const response = await login(TEST_USER.email, TEST_USER.password);
  
  addResult(results, `[Setup] login_attempts = -1`);
  addResult(results, `[Request] POST ${LOGIN_ENDPOINT}`);
  addResult(results, `[Status] ${response.status}`);
  addResult(results, `[Response] ${JSON.stringify(response.body)}`);
  
  const passed = response.status === 200 || response.status === 500;
  addResult(results, `[Note] Chấp nhận 200 hoặc 500`);
  addResult(results, `[Result] ${passed ? '✅ PASSED' : '❌ FAILED'}`);
  
  return passed;
}

async function runTC09(results) {
  addResult(results, '');
  addResult(results, '='.repeat(70));
  addResult(results, 'TC09 — BVA: login_attempts = 0 (LB)');
  addResult(results, '='.repeat(70));
  
  await setupUser(`UPDATE users SET login_attempts = 0 WHERE email = 'test@eshop.com'`);
  const response = await login(TEST_USER.email, TEST_USER.password);
  
  addResult(results, `[Setup] login_attempts = 0 (Lower Boundary)`);
  addResult(results, `[Request] POST ${LOGIN_ENDPOINT}`);
  addResult(results, `[Status] ${response.status}`);
  addResult(results, `[Response] ${JSON.stringify(response.body)}`);
  
  const passed = response.status === 200 && response.body.token;
  addResult(results, `[Result] ${passed ? '✅ PASSED' : '❌ FAILED'}`);
  
  return passed;
}

async function runTC10(results) {
  addResult(results, '');
  addResult(results, '='.repeat(70));
  addResult(results, 'TC10 — BVA: login_attempts = 1 (LB+1)');
  addResult(results, '='.repeat(70));
  
  await setupUser(`UPDATE users SET login_attempts = 1 WHERE email = 'test@eshop.com'`);
  const response = await login(TEST_USER.email, TEST_USER.password);
  
  addResult(results, `[Setup] login_attempts = 1 (LB+1)`);
  addResult(results, `[Request] POST ${LOGIN_ENDPOINT}`);
  addResult(results, `[Status] ${response.status}`);
  addResult(results, `[Response] ${JSON.stringify(response.body)}`);
  
  const passed = response.status === 200 && response.body.token;
  addResult(results, `[Result] ${passed ? '✅ PASSED' : '❌ FAILED'}`);
  
  return passed;
}

async function runTC11(results) {
  addResult(results, '');
  addResult(results, '='.repeat(70));
  addResult(results, 'TC11 — BVA: login_attempts = 2 (UB-1)');
  addResult(results, '='.repeat(70));
  
  await setupUser(`UPDATE users SET login_attempts = 2 WHERE email = 'test@eshop.com'`);
  const response = await login(TEST_USER.email, TEST_USER.password);
  
  addResult(results, `[Setup] login_attempts = 2 (UB-1)`);
  addResult(results, `[Request] POST ${LOGIN_ENDPOINT}`);
  addResult(results, `[Status] ${response.status}`);
  addResult(results, `[Response] ${JSON.stringify(response.body)}`);
  
  const passed = response.status === 200 && response.body.token;
  addResult(results, `[Result] ${passed ? '✅ PASSED' : '❌ FAILED'}`);
  
  return passed;
}

async function runTC12(results) {
  addResult(results, '');
  addResult(results, '='.repeat(70));
  addResult(results, 'TC12 — BVA: login_attempts = 3 (UB)');
  addResult(results, '='.repeat(70));
  
  await setupUser(`UPDATE users SET login_attempts = 3, locked_until = datetime('now', '-1 minute') WHERE email = 'test@eshop.com'`);
  const response = await login(TEST_USER.email, TEST_USER.password);
  
  addResult(results, `[Setup] login_attempts = 3, locked_until = past (Upper Boundary)`);
  addResult(results, `[Request] POST ${LOGIN_ENDPOINT}`);
  addResult(results, `[Status] ${response.status}`);
  addResult(results, `[Response] ${JSON.stringify(response.body)}`);
  
  const passed = response.status === 200 && response.body.token;
  addResult(results, `[Result] ${passed ? '✅ PASSED' : '❌ FAILED'}`);
  
  return passed;
}

async function runTC13(results) {
  addResult(results, '');
  addResult(results, '='.repeat(70));
  addResult(results, 'TC13 — BVA: login_attempts = 4 (UB+1)');
  addResult(results, '='.repeat(70));
  
  await setupUser(`UPDATE users SET login_attempts = 4, locked_until = datetime('now', '-1 minute') WHERE email = 'test@eshop.com'`);
  const response = await login(TEST_USER.email, TEST_USER.password);
  
  addResult(results, `[Setup] login_attempts = 4 (UB+1)`);
  addResult(results, `[Request] POST ${LOGIN_ENDPOINT}`);
  addResult(results, `[Status] ${response.status}`);
  addResult(results, `[Response] ${JSON.stringify(response.body)}`);
  
  const passed = response.status === 200 && response.body.token;
  addResult(results, `[Result] ${passed ? '✅ PASSED' : '❌ FAILED'}`);
  
  return passed;
}

async function runTC14(results) {
  addResult(results, '');
  addResult(results, '='.repeat(70));
  addResult(results, 'TC14 — BVA: locked_until = future + 1 second');
  addResult(results, '='.repeat(70));

  await setupLockout(1, 2); // 1 second, đủ để test trước khi hết hạn

  const response = await login(TEST_USER.email, TEST_USER.password);

  addResult(results, `[Setup] locked_until = future (+1 second) (LB+1)`);
  addResult(results, `[Request] POST ${LOGIN_ENDPOINT}`);
  addResult(results, `[Status] ${response.status}`);
  addResult(results, `[Response] ${JSON.stringify(response.body)}`);

  const passed = response.status === 403;
  addResult(results, `[Result] ${passed ? '✅ PASSED' : '❌ FAILED'}`);

  return passed;
}

async function runTC15(results) {
  addResult(results, '');
  addResult(results, '='.repeat(70));
  addResult(results, 'TC15 — BVA: locked_until = past (LB-1)');
  addResult(results, '='.repeat(70));
  
  await setupUser(`UPDATE users SET locked_until = datetime('now', '-1 second') WHERE email = 'test@eshop.com'`);
  const response = await login(TEST_USER.email, TEST_USER.password);
  
  addResult(results, `[Setup] locked_until = past (-1 second) (LB-1)`);
  addResult(results, `[Request] POST ${LOGIN_ENDPOINT}`);
  addResult(results, `[Status] ${response.status}`);
  addResult(results, `[Response] ${JSON.stringify(response.body)}`);
  
  const passed = response.status === 200 && response.body.token;
  addResult(results, `[Result] ${passed ? '✅ PASSED' : '❌ FAILED'}`);
  
  return passed;
}

async function runTC16(results) {
  addResult(results, '');
  addResult(results, '='.repeat(70));
  addResult(results, 'TC16 — BVA: locked_until = now (=)');
  addResult(results, '='.repeat(70));

  await setupLockout(0, 0); // locked_until = now

  const response = await login(TEST_USER.email, TEST_USER.password);

  addResult(results, `[Setup] locked_until = now (=) (LB)`);
  addResult(results, `[Note] Code dùng < nên now không bị khóa`);
  addResult(results, `[Request] POST ${LOGIN_ENDPOINT}`);
  addResult(results, `[Status] ${response.status}`);
  addResult(results, `[Response] ${JSON.stringify(response.body)}`);

  const passed = response.status === 200 && response.body.token;
  addResult(results, `[Result] ${passed ? '✅ PASSED' : '❌ FAILED'}`);

  return passed;
}

// TC17: Bug +2 - Kiểm tra login_attempts tăng +2 thay vì +1 khi sai password
async function runTC17(results) {
  addResult(results, '');
  addResult(results, '='.repeat(70));
  addResult(results, 'TC17 — Bug +2: login_attempts tăng 2 thay vì 1 khi sai');
  addResult(results, '='.repeat(70));

  // Bug: server dùng user.login_attempts + 2 thay vì +1
  // Nghĩa là: login_attempts tăng gấp đôi mỗi lần sai

  // Step 1: Reset và test lần 1
  await resetUser();
  addResult(results, '[Step 1] Reset user, nhập sai password');
  await login(TEST_USER.email, TEST_USER.wrongPassword);

  let attempts = await dbQuery(`SELECT login_attempts FROM users WHERE email = 'test@eshop.com'`);
  const attempts1 = attempts.login_attempts;
  addResult(results, `[Check] login_attempts sau lần 1: ${attempts1}`);

  // Step 2: Reset locked (để test lần 2) và test
  await dbRun(`UPDATE users SET locked_until = NULL WHERE email = 'test@eshop.com'`);
  addResult(results, '[Step 2] Reset locked_until, nhập sai password lần 2');
  await login(TEST_USER.email, TEST_USER.wrongPassword);

  attempts = await dbQuery(`SELECT login_attempts FROM users WHERE email = 'test@eshop.com'`);
  const attempts2 = attempts.login_attempts;
  addResult(results, `[Check] login_attempts sau lần 2: ${attempts2}`);

  // Step 3: Reset locked (để test lần 3) và test
  await dbRun(`UPDATE users SET locked_until = NULL WHERE email = 'test@eshop.com'`);
  addResult(results, '[Step 3] Reset locked_until, nhập sai password lần 3');
  await login(TEST_USER.email, TEST_USER.wrongPassword);

  attempts = await dbQuery(`SELECT login_attempts FROM users WHERE email = 'test@eshop.com'`);
  const attempts3 = attempts.login_attempts;
  addResult(results, `[Check] login_attempts sau lần 3: ${attempts3}`);

  addResult(results, '');
  addResult(results, '[Bug Analysis]');
  addResult(results, `  Sau lần 1: Expected=1, Actual=${attempts1}`);
  addResult(results, `  Sau lần 2: Expected=2, Actual=${attempts2}`);
  addResult(results, `  Sau lần 3: Expected=3, Actual=${attempts3}`);

  // Bug: login_attempts tăng +2 thay vì +1
  // - Lần 1: 0 + 2 = 2 (thay vì 1)
  // - Lần 2: 2 + 2 = 4 (thay vì 2)
  // - Lần 3: 4 + 2 = 6 (thay vì 3)

  const isBugPresent = attempts1 === 2 && attempts2 === 4 && attempts3 === 6;

  if (isBugPresent) {
    addResult(results, '');
    addResult(results, '[⚠️ BUG CONFIRMED] login_attempts tăng +2 thay vì +1');
    addResult(results, '[Source] server.js:54 - const newAttempts = user.login_attempts + 2');
  }

  // Test case PASS nếu login_attempts tăng đúng +1
  const passed = attempts1 === 1 && attempts2 === 2 && attempts3 === 3;

  addResult(results, `[Result] ${passed ? '✅ PASSED' : '❌ FAILED (BUG: +2)'}`);

  return passed;
}

// ============== MAIN ==============

async function main() {
  const startTime = Date.now();
  const timestamp = getTimestamp();
  
  log('╔══════════════════════════════════════════════════════════════════════╗');
  log('║          FR-02: User Login — Automated Test Suite                   ║');
  log('╚══════════════════════════════════════════════════════════════════════╝');
  log('');
  log(`🕐 Bắt đầu: ${new Date().toLocaleString('vi-VN')}`);
  log('');
  
  ensureDir(OUTPUT_DIR);
  
  const results = [];
  
  // Header
  addResult(results, '╔══════════════════════════════════════════════════════════════════════╗');
  addResult(results, '║          FR-02: User Login — Automated Test Results                 ║');
  addResult(results, '╚══════════════════════════════════════════════════════════════════════╝');
  addResult(results, '');
  addResult(results, `📅 Ngày test: ${new Date().toLocaleString('vi-VN')}`);
  addResult(results, `🌐 Base URL: ${BASE_URL}`);
  addResult(results, `👤 Test User: ${TEST_USER.email}`);
  addResult(results, '');
  addResult(results, '-'.repeat(70));
  addResult(results, 'TEST EXECUTION LOG');
  addResult(results, '-'.repeat(70));
  
  const testFunctions = [
    { name: 'TC01', fn: runTC01 },
    { name: 'TC02', fn: runTC02 },
    { name: 'TC03', fn: runTC03 },
    { name: 'TC04', fn: runTC04 },
    { name: 'TC05', fn: runTC05 },
    { name: 'TC06', fn: runTC06 },
    { name: 'TC07', fn: runTC07 },
    { name: 'TC08', fn: runTC08 },
    { name: 'TC09', fn: runTC09 },
    { name: 'TC10', fn: runTC10 },
    { name: 'TC11', fn: runTC11 },
    { name: 'TC12', fn: runTC12 },
    { name: 'TC13', fn: runTC13 },
    { name: 'TC14', fn: runTC14 },
    { name: 'TC15', fn: runTC15 },
    { name: 'TC16', fn: runTC16 },
    { name: 'TC17', fn: runTC17 },
  ];
  
  const passed = [];
  const failed = [];
  
  for (const test of testFunctions) {
    try {
      const result = await test.fn(results);
      if (result) {
        passed.push(test.name);
      } else {
        failed.push(test.name);
      }
    } catch (err) {
      addResult(results, `[ERROR] ${err.message}`);
      failed.push(test.name);
    }
  }
  
  // Summary
  addResult(results, '');
  addResult(results, '-'.repeat(70));
  addResult(results, 'TEST SUMMARY');
  addResult(results, '-'.repeat(70));
  addResult(results, `✅ Passed: ${passed.length}/${testFunctions.length}`);
  addResult(results, `❌ Failed: ${failed.length}/${testFunctions.length}`);
  
  if (failed.length > 0) {
    addResult(results, `📋 Failed Tests: ${failed.join(', ')}`);
  }
  
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  addResult(results, `⏱️  Execution Time: ${elapsed}s`);
  addResult(results, '');
  addResult(results, '='.repeat(70));
  addResult(results, 'END OF REPORT');
  addResult(results, '='.repeat(70));
  
  // Write to file
  const outputFile = path.join(OUTPUT_DIR, `FR-02-test-results-${timestamp}.txt`);
  fs.writeFileSync(outputFile, results.join('\n'), 'utf8');
  
  // Console output
  log('');
  log('╔══════════════════════════════════════════════════════════════════════╗');
  log('║                           SUMMARY                                    ║');
  log('╚══════════════════════════════════════════════════════════════════════╝');
  log(`✅ Passed: ${passed.length}/${testFunctions.length}`);
  log(`❌ Failed: ${failed.length}/${testFunctions.length}`);
  log(`⏱️  Execution Time: ${elapsed}s`);
  log('');
  log(`📄 Kết quả chi tiết: ${outputFile}`);
  log('');
  
  if (failed.length === 0) {
    log('🎉 Tất cả test case đã pass!');
  } else {
    log(`⚠️  ${failed.length} test case failed: ${failed.join(', ')}`);
  }
  
  process.exit(failed.length > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('❌ Fatal error:', err.message);
  process.exit(1);
});
