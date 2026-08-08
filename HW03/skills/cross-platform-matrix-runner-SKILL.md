---
name: cross-platform-matrix-runner
description: >
  Two-phase skill for cross-browser/cross-platform compatibility testing. Phase 1 (Plan): given
  a screen name and coverage requirements (N operating systems, M browsers, K device types),
  generate a matrix skeleton — a specific list of OS/Browser/Device-type combinations to run
  on a cloud testing service (BrowserStack, LambdaTest, etc.) that satisfies the minimum
  coverage rule (each OS, each browser, each device type appears at least once). Phase 2
  (Verify): given a folder of screenshots taken against that skeleton, match each screenshot to
  its planned cell, check for required overlay (username/email + OS/browser/device), and fill
  in Pass/Fail results. Trigger Phase 1 when the user asks to "plan the matrix", "tạo khung ma
  trận", or "cho tôi danh sách tổ hợp cần chạy" before testing. Trigger Phase 2 when the user
  provides screenshots and asks to check/fill/verify the matrix. Generic — not tied to a
  specific app.
---

# Cross-Platform Matrix Runner (AI-first: Plan → Test → Verify)

## Triết lý AI-first

AI đóng vai trò **lập kế hoạch trước** (giảm công sức chọn tổ hợp thủ công, đảm bảo không thiếu
độ phủ) và **xác minh sau** (đối chiếu bằng chứng thật). AI KHÔNG được tự chạy test, tự tạo ảnh,
hay tự kết luận Pass/Fail khi không có ảnh thật. Người dùng luôn là người thực thi test thật
trên nền tảng cloud (BrowserStack/LambdaTest) ở giữa hai giai đoạn.

## Giai đoạn 1 — PLAN (sinh khung ma trận trước khi test)

### Input
- Tên/định danh màn hình cần test.
- Yêu cầu độ phủ: số OS tối thiểu, số browser tối thiểu, số loại thiết bị tối thiểu (mặc định
  nếu người dùng không nói rõ: 3 OS, 5 browser, 3 loại thiết bị — mỗi loại xuất hiện ≥1 lần).
- (Tuỳ chọn) danh sách OS/Browser/Device cụ thể người dùng muốn ưu tiên, hoặc để AI tự đề xuất
  tổ hợp hợp lý dựa trên những gì BrowserStack/LambdaTest hỗ trợ phổ biến.

### Việc AI làm
1. Chọn một tập hợp tổ hợp OS × Browser × Device sao cho: mỗi OS, mỗi Browser, mỗi Device type
   xuất hiện **ít nhất 1 lần** — dùng số lượng tổ hợp tối thiểu cần thiết (không cần đủ toàn bộ
   tích Descartes N×M×K).
2. Với mỗi tổ hợp, gán một Cell ID (VD: M01, M02...) để tiện đối chiếu ở Giai đoạn 2.
3. Gợi ý tên file ảnh chuẩn hoá cho từng tổ hợp, đúng format `OS_Browser_DeviceType.png` (khớp
   với script `overlay_watermark.py` đã dùng trước đó) để không phải đặt tên tay.
4. Xuất bảng khung theo format Output Plan bên dưới — mọi ô đều để trống ở cột Kết quả/Ảnh,
   chưa có bằng chứng nào nên chưa kết luận gì.

### Nguyên tắc
- Không tự nhận là "đã test" — giai đoạn này chỉ là kế hoạch, cột Pass/Fail luôn để trống.
- Nếu người dùng chỉ định OS/Browser cụ thể không phổ biến trên BrowserStack, hỏi lại thay vì
  tự đoán tên chính xác của phiên bản.

### Output Plan Format

```markdown
## Khung ma trận cần chạy — [Tên màn hình]
Yêu cầu độ phủ: [N] OS × [M] Browser × [K] Loại thiết bị (mỗi loại ≥1 lần)

| Cell ID | OS | Browser | Loại thiết bị | Tên file ảnh gợi ý | Kết quả | Ghi chú |
|---|---|---|---|---|---|---|
| M01 | Windows 11 | Chrome | Desktop | Windows_Chrome_Desktop.png | (chưa test) | - |
| M02 | Windows 11 | Edge | Desktop | Windows_Edge_Desktop.png | (chưa test) | - |
| M03 | macOS | Safari | Desktop | macOS_Safari_Desktop.png | (chưa test) | - |
| M04 | macOS | Firefox | Tablet | macOS_Firefox_Tablet.png | (chưa test) | - |
| M05 | Android | Chrome | Phone | Android_Chrome_Phone.png | (chưa test) | - |
| ... | ... | ... | ... | ... | (chưa test) | - |

### Kiểm tra độ phủ của khung này
- OS: [danh sách] → đủ [N] yêu cầu? [Có/Không]
- Browser: [danh sách] → đủ [M] yêu cầu? [Có/Không]
- Loại thiết bị: [danh sách] → đủ [K] yêu cầu? [Có/Không]

Bạn hãy chạy lần lượt các Cell ID trên trong BrowserStack, dùng script overlay_watermark.py để
chèn email MSSV vào mỗi ảnh, đặt tên đúng theo cột "Tên file ảnh gợi ý", rồi gửi lại toàn bộ ảnh
để mình đối chiếu ở Giai đoạn 2.
```

## Giai đoạn 2 — VERIFY (đối chiếu ảnh thật với khung đã lập)

### Input
- Khung ma trận đã sinh ở Giai đoạn 1 (hoặc người dùng dán lại bảng đó).
- Thư mục/danh sách ảnh người dùng vừa chụp.
- (Nếu có) tiêu chí Pass/Fail cụ thể người dùng muốn áp dụng.

### Quy trình
1. Với mỗi ảnh, khớp tên file với Cell ID tương ứng trong khung. Nếu tên file không khớp bất kỳ
   Cell ID nào, hỏi người dùng ảnh đó ứng với tổ hợp nào.
2. Kiểm tra ảnh có overlay hợp lệ (email MSSV + OS/Browser/Device) hay không — nếu thiếu, đánh
   dấu "Thiếu overlay — cần chụp lại", không tính là bằng chứng hợp lệ.
3. Với ảnh hợp lệ, đánh giá Pass/Fail dựa trên tiêu chí đã thống nhất (không vỡ layout, không
   tràn chữ, control vẫn thao tác được...). Nếu ảnh không đủ rõ để kết luận, để "Not Verified".
4. Đối chiếu lại toàn bộ khung: Cell ID nào chưa có ảnh vẫn giữ "(chưa test)".
5. Tổng hợp lại đúng yêu cầu độ phủ ở Giai đoạn 1 xem đã đạt hay còn thiếu.

### Nguyên tắc bắt buộc
- Không tự bịa kết quả cho Cell ID chưa có ảnh gửi lên.
- Không tự suy diễn Pass khi ảnh không đủ rõ.
- Mỗi ô Fail bắt buộc có ghi chú lỗi cụ thể (tràn, chồng, vỡ layout, chữ không đọc được, control
  không responsive...).
- Cuối cùng luôn nhắc người dùng tự kiểm tra lại bảng trước khi đưa vào báo cáo chính thức.

### Output Verify Format

```markdown
## Kết quả đối chiếu ma trận — [Tên màn hình]

| Cell ID | OS | Browser | Loại thiết bị | Kết quả | Ảnh | Ghi chú lỗi (nếu Fail) |
|---|---|---|---|---|---|---|
| M01 | Windows 11 | Chrome | Desktop | Pass | Windows_Chrome_Desktop.png | - |
| M02 | Windows 11 | Edge | Desktop | (chưa test) | - | - |
| M03 | macOS | Safari | Desktop | Fail | macOS_Safari_Desktop.png | Banner tràn khỏi khung |

### Tổng hợp
- Đã test: [n]/[tổng số cell trong khung]
- Pass: [n] | Fail: [n] | Not Verified: [n] | Thiếu overlay: [n]
- Độ phủ hiện tại: OS [đạt/thiếu] · Browser [đạt/thiếu] · Device [đạt/thiếu]
```

## Khi nào KHÔNG dùng skill này

- Không dùng để tự vận hành BrowserStack/LambdaTest — người dùng tự chạy test thật giữa 2 giai
  đoạn, AI chỉ lập kế hoạch trước và xác minh bằng chứng sau.
- Không dùng cho checklist GUI thông thường (dùng `gui-checklist-runner`).
