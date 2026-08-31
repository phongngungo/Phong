# Khảo Thí HSK 3.0 — PWA

Bản này đã tích hợp:
- Icon ứng dụng lấy từ ảnh bạn cung cấp.
- `manifest.webmanifest`, Service Worker và các icon PWA.
- Tạo đề HSK 1–6 bằng Gemini, chọn Listening / Reading / Writing / Full Mock.
- Chọn số lượng câu hỏi 5–60.
- Prompt HSK 3.0 mới với distractor, listening script, target vocabulary và JSON schema.
- Tự kiểm tra dữ liệu trước khi hiển thị đề.
- Gemini 3.7/3.6 dùng `thinkingLevel=medium`; không gửi `temperature` vì tài liệu Gemini hiện tại đã loại bỏ tham số sampling này cho Gemini 3.7/3.6.

## GitHub Pages
Upload toàn bộ thư mục này lên repository, sau đó bật GitHub Pages với `main` + `/root`.

## Cài trên Android
Mở website bằng Chrome Android qua HTTPS. Khi trình duyệt cho phép, nút cài PWA sẽ hiện trong app; ngoài ra có thể vào menu Chrome → Cài đặt ứng dụng / Thêm vào màn hình chính.

Lưu ý: API key vẫn là key phía client trong localStorage.
