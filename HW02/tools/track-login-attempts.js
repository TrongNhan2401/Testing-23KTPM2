/**
 * =====================================================================
 * TRACKING SCRIPT: Theo dõi login_attempts real-time
 * =====================================================================
 * Công dụng: Chạy liên tục, hiển thị login_attempts mỗi khi thay đổi
 * Sử dụng: Chạy script này → Test trên UI → Quan sát giá trị thay đổi
 * =====================================================================
 */

const sqlite3 = require('../eshop/backend/node_modules/sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../eshop/backend/database.sqlite');
const db = new sqlite3.Database(dbPath);

// ============================================================
// CẤU HÌNH
// ============================================================
const TRACK_EMAIL = 'test@eshop.com';
const REFRESH_INTERVAL_MS = 500; // 500ms - càng nhỏ càng real-time

// ============================================================
// HÀM THEO DÕI
// ============================================================

/**
 * Lấy thông tin user từ database
 */
function getUserInfo(email) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT id, name, email, login_attempts, locked_until FROM users WHERE email = ?",
      [email],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      }
    );
  });
}

/**
 * Format thời gian đẹp
 */
function formatTime(date) {
  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 });
}

/**
 * Format locked_until đẹp
 */
function formatLockedUntil(lockedUntil) {
  if (!lockedUntil) return 'NULL';
  const diff = new Date(lockedUntil) - new Date();
  if (diff > 0) {
    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    return `${lockedUntil} (còn ${mins}m ${secs}s)`;
  }
  return `${lockedUntil} (ĐÃ HẾT HẠN)`;
}

/**
 * Tính toán trạng thái tài khoản
 */
function getAccountStatus(loginAttempts, lockedUntil) {
  if (lockedUntil && new Date() < new Date(lockedUntil)) {
    return '🔴 BỊ KHÓA';
  }
  if (loginAttempts >= 3) {
    return '🟡 CẢNH BÁO (>=3)';
  }
  return '🟢 BÌNH THƯỜNG';
}

// ============================================================
// BIẾN THEO DÕI TRẠNG THÁI
// ============================================================
let lastLoginAttempts = null;
let lastLockedUntil = null;
let changeCount = 0;

// ============================================================
// BẮT ĐẦU THEO DÕI
// ============================================================

async function startTracking() {
  console.clear();
  console.log('╔════════════════════════════════════════════════════════════════════╗');
  console.log('║     🔍 TRACKING: login_attempts - Real-time Database Watcher     ║');
  console.log('╚════════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`📧 Email được theo dõi: ${TRACK_EMAIL}`);
  console.log(`⏱️  Refresh interval: ${REFRESH_INTERVAL_MS}ms`);
  console.log('');
  console.log('────────────────────────────────────────────────────────────────────');
  console.log('  Nhấn Ctrl+C để dừng theo dõi');
  console.log('────────────────────────────────────────────────────────────────────');
  console.log('');
  console.log('⏳ Đang kết nối database...');
  console.log('');

  // Lấy giá trị ban đầu
  const initialUser = await getUserInfo(TRACK_EMAIL);
  if (initialUser) {
    lastLoginAttempts = initialUser.login_attempts;
    lastLockedUntil = initialUser.locked_until;
    console.log(`✅ Kết nối thành công!`);
    console.log(`   📊 Giá trị ban đầu: login_attempts = ${lastLoginAttempts}`);
    console.log('');
    console.log('════════════════════════════════════════════════════════════════════');
    console.log('');
  } else {
    console.log('❌ Không tìm thấy user!');
    process.exit(1);
  }

  // Bắt đầu theo dõi liên tục
  setInterval(async () => {
    try {
      const user = await getUserInfo(TRACK_EMAIL);
      
      if (!user) {
        console.log('⚠️  User không tìm thấy!');
        return;
      }

      // Kiểm tra có thay đổi không
      const hasLoginAttemptsChanged = user.login_attempts !== lastLoginAttempts;
      const hasLockedUntilChanged = user.locked_until !== lastLockedUntil;

      if (hasLoginAttemptsChanged || hasLockedUntilChanged) {
        changeCount++;
        const timestamp = formatTime(new Date());
        
        console.log('');
        console.log(`📌 [THAY ĐỔI #${changeCount}] ${timestamp}`);
        console.log('─'.repeat(76));
        console.log(`   Email:            ${user.email}`);
        console.log(`   login_attempts:   ${lastLoginAttempts} → ${user.login_attempts} ${hasLoginAttemptsChanged ? '⬆️' : ' '}`);
        console.log(`   locked_until:     ${formatLockedUntil(user.locked_until)}`);
        console.log(`   Trạng thái:       ${getAccountStatus(user.login_attempts, user.locked_until)}`);
        
        // Hiệu ứng thay đổi login_attempts
        if (hasLoginAttemptsChanged) {
          const diff = user.login_attempts - (lastLoginAttempts || 0);
          if (diff > 0) {
            console.log(`   ⚠️  THAY ĐỔI: +${diff} (BUG: nên là +1)`);
          }
        }
        
        console.log('─'.repeat(76));
        console.log('');

        // Cập nhật giá trị cuối
        lastLoginAttempts = user.login_attempts;
        lastLockedUntil = user.locked_until;
      }
    } catch (err) {
      console.error('❌ Lỗi khi đọc database:', err.message);
    }
  }, REFRESH_INTERVAL_MS);
}

// ============================================================
// XỬ LÝ KHI DỪNG SCRIPT
// ============================================================
process.on('SIGINT', () => {
  console.log('');
  console.log('');
  console.log('════════════════════════════════════════════════════════════════════');
  console.log('📊 TỔNG KẾT THEO DÕI');
  console.log('════════════════════════════════════════════════════════════════════');
  console.log(`   Số lần thay đổi detected: ${changeCount}`);
  console.log(`   Giá trị cuối cùng: login_attempts = ${lastLoginAttempts}`);
  console.log(`   locked_until: ${lastLockedUntil || 'NULL'}`);
  console.log('');
  console.log('👋 Đã dừng tracking!');
  console.log('════════════════════════════════════════════════════════════════════');
  process.exit(0);
});

// ============================================================
// KHỞI CHẠY
// ============================================================
startTracking().catch(err => {
  console.error('❌ Lỗi khởi động:', err);
  process.exit(1);
});
