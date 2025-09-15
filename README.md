# 📦 Hệ Thống Kiểm Kê Tài Sản QR

## 🎯 Tính năng
- ✅ Upload danh sách tài sản từ Excel
- ✅ Tạo mã QR cho từng tài sản
- ✅ Quét QR bằng camera điện thoại
- ✅ Theo dõi tiến độ kiểm kê
- ✅ Export báo cáo Excel
- ✅ Hỗ trợ nhiều người dùng đồng thời
- ✅ PWA - hoạt động offline

## 🚀 Cài đặt nhanh

### Bước 1: Setup Database (Supabase)
1. Đăng nhập: https://supabase.com/dashboard/project/ptduzyyantdvfopqwlvz
2. Vào **SQL Editor**
3. Copy toàn bộ nội dung file `setup.sql`
4. Paste và nhấn **RUN**

### Bước 2: Chạy ứng dụng
```bash
# Install dependencies
pnpm install

# Run development
pnpm dev

# Mở browser
http://localhost:3000
```

## 📱 Sử dụng

### 1. Tạo kỳ kiểm kê
- Vào Dashboard
- Nhập tên kỳ (VD: "Kiểm kê Q1/2025")
- Nhấn "Tạo kỳ mới"

### 2. Upload tài sản
- Vào tab Upload
- Tải template Excel
- Điền thông tin tài sản
- Upload file

### 3. Tạo mã QR
- Vào tab "Tạo QR"
- Chọn tài sản cần tạo
- Nhấn "Tạo QR"
- In tem dán lên tài sản

### 4. Kiểm kê
- Vào tab "Quét QR"
- Nhập tên người kiểm kê
- Quét mã QR trên tài sản
- Xác nhận thông tin

### 5. Export báo cáo
- Vào tab Export
- Chọn loại báo cáo
- Tải file Excel

## 🔧 Khắc phục lỗi

### Lỗi kết nối Supabase
- Kiểm tra .env.local
- Restart server: `pnpm dev`

### Lỗi camera không hoạt động
- Dùng HTTPS hoặc localhost
- Cho phép quyền camera trong browser

### Lỗi import Excel
- Kiểm tra định dạng file
- Dùng template mẫu

## 📊 Cấu trúc Excel

| Cột | Mô tả |
|-----|-------|
| Mã tài sản | Mã duy nhất (bắt buộc) |
| Tên tiếng Việt | Tên tài sản |
| Model | Model thiết bị |
| Serial | Số serial |
| Bộ phận | Phòng ban quản lý |
| Vị trí | Vị trí hiện tại |
| Trạng thái | Active/Inactive |

## 🌐 Deploy Production

### Deploy lên Vercel
```bash
# Install Vercel CLI
pnpm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel Dashboard
```

### Deploy lên VPS
```bash
# Build
pnpm build

# Start
pnpm start
```

## 📝 Lưu ý
- Database free tier: 500MB (~10,000 tài sản)
- Bandwidth: 2GB/tháng
- Concurrent users: 20-30 người
- Offline: PWA cache 24h

## 🆘 Hỗ trợ
- Email: support@example.com
- Docs: /docs