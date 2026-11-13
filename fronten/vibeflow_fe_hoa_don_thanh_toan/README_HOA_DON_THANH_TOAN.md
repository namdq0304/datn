# Frontend hóa đơn & thanh toán VibeFlow

## File đã thêm
- `src/api/hoaDonApi.js`: gọi các endpoint hóa đơn/thanh toán của backend.
- `src/components/admin/tabs/InvoicePaymentTab.jsx`: màn hình danh sách hóa đơn, tìm kiếm/lọc trạng thái, xem chi tiết, lịch sử thanh toán, ghi nhận thanh toán, hủy hóa đơn và cập nhật tiến độ.

## File đã sửa
- `src/components/AdminPos.jsx`: thay tab Orders bằng màn hình hóa đơn lấy dữ liệu API; thao tác POS tạo hóa đơn và ghi nhận thanh toán qua API.
- `src/api/index.js`: export `hoaDonApi`.

## Điều kiện backend
Frontend đang gọi các API:
- GET `/api/hoa-don`
- GET `/api/hoa-don/{id}`
- POST `/api/hoa-don`
- PATCH `/api/hoa-don/{id}/trang-thai`
- POST `/api/hoa-don/{id}/huy`
- GET `/api/hoa-don/hinh-thuc-thanh-toan`
- POST `/api/hoa-don/{id}/thanh-toan`
- GET `/api/hoa-don/{id}/thanh-toan`

Backend cần cài phần `HoaDonController` và các lớp liên quan trước khi dùng màn hình này. `axiosClient.js` đã tự gắn JWT, không cần tạo axios riêng.

## Lưu ý quan trọng về POS
Dữ liệu sản phẩm đang hiển thị trong `ProductSelectModal.jsx` lấy từ `INITIAL_PRODUCTS` (mock), trong khi API tạo hóa đơn bắt buộc `chiTietSanPhamId` là ID biến thể thật trong bảng `CHI_TIET_SAN_PHAM`. Vì vậy phần checkout đã chủ động chặn nếu sản phẩm chưa có `product.chiTietSanPhamId`, `product.variantId` hoặc `product.idChiTietSanPham`. Không dùng `product.id` làm ID biến thể vì có thể tạo sai hóa đơn/trừ nhầm tồn kho.

Bước cần làm tiếp theo để POS chạy end-to-end: kết nối danh sách sản phẩm/biến thể thật từ `/san-pham` và `/chi-tiet-san-pham/san-pham/{sanPhamId}`, sau đó gắn `chiTietSanPhamId` vào từng dòng giỏ hàng.

## Chạy
1. Giải nén và thay thư mục FE hiện tại bằng thư mục `fe` trong gói (hoặc chép các file đã thêm/sửa theo đúng đường dẫn).
2. Kiểm tra `.env` / `VITE_API_BASE_URL` trỏ đúng backend. Nếu dùng Vite proxy, giữ cấu hình hiện tại.
3. Cài dependencies nếu máy chưa có: `npm install`.
4. Chạy: `npm run dev`.
5. Đăng nhập bằng tài khoản có quyền `ADMIN` hoặc `NHAN_VIEN`.
