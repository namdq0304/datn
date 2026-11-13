# API Hóa đơn và Thanh toán - VibeFlow

## Cách thêm vào backend
Copy các thư mục `controller`, `dto`, `entity`, `repository`, `service` vào:
`src/main/java/com/example/datn/` (giữ nguyên cấu trúc package).

Chạy `sql/insert_hinh_thuc_thanh_toan.sql` trong SQL Server Management Studio.
Các bảng hóa đơn/thanh toán đã có trong `db.sql`; không tạo lại bảng.

## Base URL
Do `server.servlet.context-path=/api`, API có tiền tố `/api`.

Tất cả endpoint yêu cầu JWT Bearer token của ADMIN hoặc NHAN_VIEN.

## Endpoint
- `GET /api/hoa-don` - danh sách hóa đơn
- `GET /api/hoa-don/{id}` - chi tiết hóa đơn
- `POST /api/hoa-don` - tạo hóa đơn và trừ tồn kho
- `PATCH /api/hoa-don/{id}/trang-thai` - cập nhật trạng thái
- `POST /api/hoa-don/{id}/huy` - hủy hóa đơn, hoàn tồn kho
- `GET /api/hoa-don/hinh-thuc-thanh-toan` - danh sách phương thức
- `POST /api/hoa-don/{id}/thanh-toan` - ghi nhận thanh toán
- `GET /api/hoa-don/{id}/thanh-toan` - lịch sử thanh toán

## JSON tạo hóa đơn
```json
{
  "khachHangId": null,
  "tienGiam": 50000,
  "sanPham": [
    { "chiTietSanPhamId": 1, "soLuong": 2 },
    { "chiTietSanPhamId": 2, "soLuong": 1 }
  ]
}
```
`khachHangId: null` là khách vãng lai. Giá bán được lấy từ `CHI_TIET_SAN_PHAM.gia_ban`; nếu null thì lấy `SAN_PHAM.gia_ban`. Không nhận đơn giá từ frontend để tránh tự sửa giá.

## JSON thanh toán
```json
{
  "hinhThucThanhToanId": 1,
  "soTien": 250000,
  "maGiaoDich": "QR-20261102-001"
}
```
Thanh toán có thể chia nhiều lần. Không cho thanh toán vượt số tiền còn phải trả.

## Trạng thái hóa đơn
- `0`: Chờ thanh toán
- `1`: Đã thanh toán
- `2`: Đang chuẩn bị
- `3`: Đang giao
- `4`: Giao hàng thất bại
- `5`: Hoàn thành
- `6`: Đã hủy

## Ví dụ cập nhật trạng thái
```json
{ "trangThai": 2, "lyDo": "Đã chuyển kho chuẩn bị hàng" }
```
## Ví dụ hủy
```json
{ "lyDo": "Khách yêu cầu hủy" }
```

Lưu ý:
- Tạo hóa đơn hiện tại là luồng bán tại quầy: trừ tồn kho ngay khi tạo.
- Hủy hóa đơn sẽ cộng lại tồn kho.
- Thanh toán chuyển khoản ở đây chỉ ghi nhận giao dịch do hệ thống nhận được; chưa tích hợp ngân hàng/VietQR tự động.
- Nếu hủy hóa đơn đã thu tiền, API chưa tự động hoàn tiền. Cần quy trình hoàn tiền riêng.
- Đảm bảo bảng `CHI_TIET_SAN_PHAM` có cột `gia_ban`, `so_luong`; bảng `SAN_PHAM` có `gia_ban`, đúng như SQL hiện tại.
