# Khảo Thí HSK 3.0 — PWA

Thư mục này đã được chuẩn bị để triển khai trực tiếp bằng GitHub Pages.

## Cấu trúc
- `index.html`: bản web chính
- `manifest.webmanifest`: cấu hình PWA
- `sw.js`: Service Worker (cache + notification/reminder)
- `icons/`: icon 192×192 và 512×512

## Đưa lên GitHub Pages
1. Tạo repository mới trên GitHub.
2. Upload **toàn bộ** nội dung trong thư mục này, giữ nguyên cấu trúc.
3. Vào **Settings → Pages**.
4. Chọn **Deploy from a branch** → branch `main` → folder `/ (root)` → Save.
5. Mở URL GitHub Pages bằng Chrome/Edge trên Android. Sau khi Service Worker chạy, nút **Cài đặt ứng dụng** sẽ xuất hiện khi trình duyệt cho phép cài PWA.

## Lưu ý
- PWA và Service Worker cần HTTPS; GitHub Pages đáp ứng điều kiện này.
- Tính năng Gemini vẫn gọi API trực tiếp từ trình duyệt và cần API key như app hiện tại.
- Phần nhắc học nền phụ thuộc khả năng Background/Periodic Sync của trình duyệt; thông báo thử và nhắc khi app đang mở vẫn sử dụng logic có sẵn trong `index.html`.
