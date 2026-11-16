/* =====================================================================
   Tạo lại bảng KHUYEN_MAI theo cấu trúc mới + nối với HOA_DON.
   Chạy trong SSMS trên VibeFlowDB. Chạy lại nhiều lần cũng được.
   LƯU Ý: xóa sạch dữ liệu khuyến mãi cũ (bảng cũ đang trống nên không sao).
   ===================================================================== */
USE VibeFlowDB;
GO

-- 1. Gỡ liên kết hóa đơn -> khuyến mãi (nếu đã có) để xóa được bảng
IF OBJECT_ID('FK_HOA_DON_KHUYEN_MAI') IS NOT NULL
    ALTER TABLE HOA_DON DROP CONSTRAINT FK_HOA_DON_KHUYEN_MAI;
IF COL_LENGTH('HOA_DON', 'khuyen_mai_id') IS NOT NULL
    EXEC('UPDATE HOA_DON SET khuyen_mai_id = NULL');
GO

-- 2. Xóa bảng khuyến mãi cũ
DROP TABLE IF EXISTS KHUYEN_MAI_BACKUP_OLD;
DROP TABLE IF EXISTS KHUYEN_MAI;   -- SQL Server không phân biệt hoa/thường: cũng là bảng Khuyen_mai cũ
GO

-- 3. Tạo bảng mới
CREATE TABLE KHUYEN_MAI (
    id               INT IDENTITY(1,1) PRIMARY KEY,
    ma_khuyen_mai    VARCHAR(50)   NOT NULL UNIQUE,      -- mã nhập ở quầy, vd GIAM10
    ten_khuyen_mai   NVARCHAR(255) NOT NULL,
    mo_ta            NVARCHAR(MAX) NULL,
    loai_giam        TINYINT       NOT NULL,             -- 1 = giảm %, 2 = giảm số tiền
    gia_tri_giam     DECIMAL(12,2) NOT NULL,             -- 10 (nghĩa là 10%) hoặc 50000 (nghĩa là 50.000đ)
    giam_toi_da      DECIMAL(12,2) NULL,                 -- loại %: giảm nhiều nhất bao nhiêu tiền
    don_toi_thieu    DECIMAL(12,2) NOT NULL DEFAULT 0,   -- đơn phải từ bao nhiêu tiền mới được dùng
    so_luong         INT           NULL,                 -- tổng số lượt, NULL = không giới hạn
    so_luong_da_dung INT           NOT NULL DEFAULT 0,
    ngay_bat_dau     DATETIME      NOT NULL,
    ngay_ket_thuc    DATETIME      NOT NULL,
    trang_thai       BIT           NOT NULL DEFAULT 1,   -- 1 = đang bật, 0 = tắt
    ngay_tao         DATETIME      NOT NULL DEFAULT GETDATE(),
    ngay_cap_nhat    DATETIME      NULL,

    -- Chặn dữ liệu sai ngay trong DB
    CHECK (loai_giam IN (1, 2)),
    CHECK (gia_tri_giam > 0),
    CHECK (loai_giam = 2 OR gia_tri_giam <= 100),        -- giảm % thì không quá 100
    CHECK (ngay_ket_thuc > ngay_bat_dau),
    CHECK (so_luong IS NULL OR so_luong_da_dung <= so_luong)
);
GO

-- 4. Hóa đơn lưu mã khuyến mãi đã dùng
IF COL_LENGTH('HOA_DON', 'khuyen_mai_id') IS NULL
    ALTER TABLE HOA_DON ADD khuyen_mai_id INT NULL;
GO
ALTER TABLE HOA_DON ADD CONSTRAINT FK_HOA_DON_KHUYEN_MAI
    FOREIGN KEY (khuyen_mai_id) REFERENCES KHUYEN_MAI(id);
GO

-- 5. Mã hóa đơn không được trùng
--    (nếu báo lỗi ở đây nghĩa là HOA_DON đang có mã trùng, cần sửa tay trước)
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'UQ_HOA_DON_MA')
    CREATE UNIQUE INDEX UQ_HOA_DON_MA ON HOA_DON(ma_hoa_don);
GO

-- 6. Hai mã để test bán hàng (dùng được 3 tháng kể từ lúc chạy script)
--    GIAM10 : giảm 10%, tối đa 100.000đ, đơn từ 500.000đ, có 100 lượt
--    GIAM50K: giảm 50.000đ, đơn từ 300.000đ, không giới hạn lượt
INSERT INTO KHUYEN_MAI (ma_khuyen_mai, ten_khuyen_mai, loai_giam, gia_tri_giam, giam_toi_da,
                        don_toi_thieu, so_luong, ngay_bat_dau, ngay_ket_thuc)
VALUES ('GIAM10',  N'Giảm 10% tối đa 100K', 1, 10,    100000, 500000, 100,  GETDATE(), DATEADD(MONTH, 3, GETDATE())),
       ('GIAM50K', N'Giảm thẳng 50.000đ',   2, 50000, NULL,   300000, NULL, GETDATE(), DATEADD(MONTH, 3, GETDATE()));
GO
