USE VibeFlowDB;
GO
IF NOT EXISTS (SELECT 1 FROM HINH_THUC_THANH_TOAN WHERE ma_hinh_thuc='TIEN_MAT')
 INSERT INTO HINH_THUC_THANH_TOAN(ma_hinh_thuc,ten_hinh_thuc,mo_ta,trang_thai)
 VALUES ('TIEN_MAT',N'Tiền mặt',N'Thanh toán trực tiếp tại quầy',1);
IF NOT EXISTS (SELECT 1 FROM HINH_THUC_THANH_TOAN WHERE ma_hinh_thuc='CHUYEN_KHOAN')
 INSERT INTO HINH_THUC_THANH_TOAN(ma_hinh_thuc,ten_hinh_thuc,mo_ta,trang_thai)
 VALUES ('CHUYEN_KHOAN',N'Chuyển khoản',N'Thanh toán qua ngân hàng hoặc mã QR',1);
IF NOT EXISTS (SELECT 1 FROM HINH_THUC_THANH_TOAN WHERE ma_hinh_thuc='COD')
 INSERT INTO HINH_THUC_THANH_TOAN(ma_hinh_thuc,ten_hinh_thuc,mo_ta,trang_thai)
 VALUES ('COD',N'Thanh toán khi nhận hàng',N'Thu tiền khi giao hàng',1);
GO
