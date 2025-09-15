# 🚀 HƯỚNG DẪN TRIỂN KHAI HOÀN CHỈNH

## 📝 BƯỚC 1: SETUP DATABASE TRÊN SUPABASE

### 1.1. Mở Supabase SQL Editor
```
https://supabase.com/dashboard/project/ptduzyyantdvfopqwlvz/sql/new
```

### 1.2. Copy và chạy SQL
Copy toàn bộ nội dung file `database-setup.sql` và paste vào SQL Editor, sau đó nhấn RUN.

**Lưu ý**: Nếu có lỗi, chạy lệnh này trước:
```sql
-- Clean up old tables
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
```

Sau đó chạy lại file `database-setup.sql`

### 1.3. Kiểm tra database
Vào Table Editor để kiểm tra các bảng đã tạo:
- assets
- inventory_cycles  
- inventory_logs
- activity_logs

---

## 📱 BƯỚC 2: TEST KẾT NỐI

### 2.1. Test với HTML đơn giản
Mở file `test-supabase.html` trong browser:
```bash
open test-supabase.html
```

Nếu thấy "✅ Connected Successfully!" là database đã sẵn sàng.

### 2.2. Test với Next.js app
```bash
# Install dependencies
pnpm install

# Run development
pnpm dev
```

Mở browser: http://localhost:3000

---

## ✅ BƯỚC 3: SỬ DỤNG APP

### 3.1. Tạo kỳ kiểm kê
1. Vào Dashboard
2. Nhập tên kỳ: "Kiểm kê Q1/2025"
3. Click "Tạo kỳ mới"

### 3.2. Upload tài sản
1. Vào tab Upload
2. Click "Tải Template Excel" để download mẫu
3. Mở file Excel và điền dữ liệu theo cấu trúc:

| Code | NameVi | NameEn | Type | Model | Serial | Department | Location | Status |
|------|--------|--------|------|-------|--------|------------|----------|--------|
| TS001 | Máy tính | Computer | IT | Dell | 123 | IT | Tầng 2 | Active |

4. Save file và upload lên hệ thống

### 3.3. Tạo mã QR
1. Vào tab "Tạo QR"
2. Chọn tài sản cần tạo QR
3. Click "Tạo mã QR"
4. Click "In tem" để in

### 3.4. Quét kiểm kê
1. Vào tab "Quét QR"
2. Nhập tên người kiểm kê
3. Click "Bắt đầu quét"
4. Cho phép quyền camera
5. Quét mã QR trên tài sản
6. Xác nhận thông tin

### 3.5. Export báo cáo
1. Vào tab Export
2. Chọn loại export:
   - Tất cả
   - Đã kiểm kê
   - Chưa kiểm kê
3. File Excel sẽ được tải về

---

## 🔧 XỬ LÝ LỖI THƯỜNG GẶP

### Lỗi 1: "relation does not exist"
**Nguyên nhân**: Chưa tạo bảng trong database
**Giải pháp**: Chạy lại SQL setup trong Supabase

### Lỗi 2: Camera không hoạt động
**Nguyên nhân**: Chưa cấp quyền hoặc không dùng HTTPS
**Giải pháp**: 
- Dùng localhost hoặc HTTPS
- Cho phép quyền camera trong browser

### Lỗi 3: Upload Excel không nhận dữ liệu
**Nguyên nhân**: Sai format cột
**Giải pháp**: Dùng đúng template với các cột:
- Code (bắt buộc)
- NameVi, NameEn
- Type, Model, Serial
- Department, Location
- Status

### Lỗi 4: Module not found
**Giải pháp**:
```bash
rm -rf node_modules .next
pnpm install
pnpm dev
```

---

## 📊 FILE EXCEL MẪU

Tạo file test 100 tài sản:
1. Mở file `generate-test-data.html` trong browser
2. Click "Download Test Data"
3. File `test_assets_100.xlsx` sẽ được tải về

---

## 🌐 DEPLOY PRODUCTION

### Deploy lên Vercel:
```bash
# Install Vercel CLI
pnpm i -g vercel

# Deploy
vercel --prod
```

Nhớ set environment variables trong Vercel:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

---

## 📋 CHECKLIST KIỂM TRA

- [ ] Database tables đã tạo trong Supabase
- [ ] File test-supabase.html hiển thị "Connected Successfully"
- [ ] App chạy tại localhost:3000 không lỗi
- [ ] Tạo được kỳ kiểm kê
- [ ] Upload Excel thành công
- [ ] Tạo được mã QR
- [ ] Quét QR bằng camera OK
- [ ] Export Excel được file

---

## 💡 TIPS

1. **Performance**: App xử lý tốt 1000-2000 tài sản
2. **Multi-user**: 3-4 người quét đồng thời OK
3. **Mobile**: Dùng Chrome/Safari trên điện thoại
4. **Offline**: PWA cache 24h, online sẽ sync
5. **Backup**: Export Excel định kỳ để backup

---

## 🆘 CẦN HỖ TRỢ?

Nếu còn lỗi, kiểm tra:
1. Console log (F12 trong browser)
2. Network tab xem API calls
3. Supabase logs trong Dashboard

File logs quan trọng:
- Browser console
- Terminal running pnpm dev
- Supabase Dashboard > Logs