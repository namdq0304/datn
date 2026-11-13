
-- ══════════════════════════════════════════════════════════════════
-- 1. TẠO DATABASE (nếu chưa có)
-- ══════════════════════════════════════════════════════════════════
IF NOT EXISTS (SELECT 1 FROM sys.databases WHERE name = 'VibeFlowDB')
BEGIN
    CREATE DATABASE VibeFlowDB;
END
GO
USE VibeFlowDB;
GO

-- ══════════════════════════════════════════════════════════════════
-- 2. TẠO BẢNG — chỉ tạo bảng CHƯA tồn tại (bản sao cấu trúc db.sql)
-- ══════════════════════════════════════════════════════════════════

IF OBJECT_ID('dbo.VAI_TRO') IS NULL
CREATE TABLE VAI_TRO (
                         id INT IDENTITY(1,1) PRIMARY KEY,
                         ma_vai_tro VARCHAR(20) NOT NULL,
                         ten_vai_tro NVARCHAR(50) NOT NULL,
                         mo_ta NVARCHAR(255),
                         trang_thai BIT DEFAULT 1
);
GO

IF OBJECT_ID('dbo.NHAN_VIEN') IS NULL
CREATE TABLE NHAN_VIEN (
                           id INT IDENTITY(1,1) PRIMARY KEY,
                           ma_nhan_vien VARCHAR(20) NOT NULL,
                           ho_ten NVARCHAR(100) NOT NULL,
                           sdt VARCHAR(15),
                           email VARCHAR(100),
                           mat_khau VARCHAR(255) NOT NULL,
                           vai_tro_id INT FOREIGN KEY REFERENCES VAI_TRO(id),
                           trang_thai BIT DEFAULT 1
);
GO

IF OBJECT_ID('dbo.KHACH_HANG') IS NULL
CREATE TABLE KHACH_HANG (
                            id INT IDENTITY(1,1) PRIMARY KEY,
                            ma_khach_hang VARCHAR(20) NOT NULL,
                            ho_ten NVARCHAR(100) NOT NULL,
                            sdt VARCHAR(15),
                            email VARCHAR(100),
                            ngay_sinh DATE,
                            gioi_tinh BIT,
                            trang_thai BIT DEFAULT 1,
                            mat_khau NVARCHAR(255)
);
GO

IF OBJECT_ID('dbo.DANH_MUC') IS NULL
CREATE TABLE DANH_MUC (
                          id INT IDENTITY(1,1) PRIMARY KEY,
                          ma_danh_muc VARCHAR(20) NOT NULL,
                          ten_danh_muc NVARCHAR(100) NOT NULL,
                          mo_ta NVARCHAR(255),
                          trang_thai BIT DEFAULT 1
);
GO

IF OBJECT_ID('dbo.THUONG_HIEU') IS NULL
CREATE TABLE THUONG_HIEU (
                             id INT IDENTITY(1,1) PRIMARY KEY,
                             ma_thuong_hieu VARCHAR(20) NOT NULL,
                             ten_thuong_hieu NVARCHAR(100) NOT NULL,
                             mo_ta NVARCHAR(255),
                             trang_thai BIT DEFAULT 1
);
GO

IF OBJECT_ID('dbo.XUAT_XU') IS NULL
CREATE TABLE XUAT_XU (
                         id INT IDENTITY(1,1) PRIMARY KEY,
                         ma_xuat_xu VARCHAR(20) NOT NULL,
                         ten_xuat_xu NVARCHAR(100) NOT NULL,
                         mo_ta NVARCHAR(255),
                         trang_thai BIT DEFAULT 1
);
GO

IF OBJECT_ID('dbo.CHAT_LIEU') IS NULL
CREATE TABLE CHAT_LIEU (
                           id INT IDENTITY(1,1) PRIMARY KEY,
                           ma_chat_lieu VARCHAR(20) NOT NULL,
                           ten_chat_lieu NVARCHAR(100) NOT NULL,
                           mo_ta NVARCHAR(255),
                           trang_thai BIT DEFAULT 1
);
GO

IF OBJECT_ID('dbo.MAU_SAC') IS NULL
CREATE TABLE MAU_SAC (
                         id INT IDENTITY(1,1) PRIMARY KEY,
                         ma_mau VARCHAR(20) NOT NULL,
                         ten_mau NVARCHAR(50) NOT NULL,
                         ma_hex VARCHAR(10),
                         trang_thai BIT DEFAULT 1
);
GO

IF OBJECT_ID('dbo.KICH_THUOC') IS NULL
CREATE TABLE KICH_THUOC (
                            id INT IDENTITY(1,1) PRIMARY KEY,
                            ma_kich_thuoc VARCHAR(20) NOT NULL,
                            ten_kich_thuoc NVARCHAR(20) NOT NULL,
                            trang_thai BIT DEFAULT 1
);
GO

IF OBJECT_ID('dbo.SAN_PHAM') IS NULL
CREATE TABLE SAN_PHAM (
                          id INT IDENTITY(1,1) PRIMARY KEY,
                          ma_san_pham VARCHAR(20) NOT NULL,
                          ten_san_pham NVARCHAR(150) NOT NULL,
                          danh_muc_id INT FOREIGN KEY REFERENCES DANH_MUC(id),
                          thuong_hieu_id INT FOREIGN KEY REFERENCES THUONG_HIEU(id),
                          xuat_xu_id INT FOREIGN KEY REFERENCES XUAT_XU(id),
                          chat_lieu_id INT FOREIGN KEY REFERENCES CHAT_LIEU(id),
                          mo_ta NVARCHAR(500),
                          gia_ban DECIMAL(12,2),
                          trang_thai BIT DEFAULT 1,
                          ngay_tao DATETIME DEFAULT GETDATE()
);
GO

IF OBJECT_ID('dbo.HINH_ANH') IS NULL
CREATE TABLE HINH_ANH (
                          id INT IDENTITY(1,1) PRIMARY KEY,
                          san_pham_id INT FOREIGN KEY REFERENCES SAN_PHAM(id),
                          ten_anh NVARCHAR(150),
                          url_anh NVARCHAR(500),
                          anh_chinh BIT DEFAULT 0,
                          trang_thai BIT DEFAULT 1
);
GO

IF OBJECT_ID('dbo.CHI_TIET_SAN_PHAM') IS NULL
CREATE TABLE CHI_TIET_SAN_PHAM (
                                   id INT IDENTITY(1,1) PRIMARY KEY,
                                   ma_chi_tiet VARCHAR(30) NOT NULL,
                                   san_pham_id INT FOREIGN KEY REFERENCES SAN_PHAM(id),
                                   mau_sac_id INT FOREIGN KEY REFERENCES MAU_SAC(id),
                                   kich_thuoc_id INT FOREIGN KEY REFERENCES KICH_THUOC(id),
                                   so_luong INT DEFAULT 0,
                                   gia_ban DECIMAL(12,2),
                                   trang_thai BIT DEFAULT 1
);
GO

IF OBJECT_ID('dbo.HOA_DON') IS NULL
CREATE TABLE HOA_DON (
                         id INT IDENTITY(1,1) PRIMARY KEY,
                         ma_hoa_don VARCHAR(20) NOT NULL,
                         khach_hang_id INT FOREIGN KEY REFERENCES KHACH_HANG(id),
                         nhan_vien_id INT FOREIGN KEY REFERENCES NHAN_VIEN(id),
                         ngay_tao DATETIME DEFAULT GETDATE(),
                         tong_tien DECIMAL(12,2),
                         tien_giam DECIMAL(12,2),
                         thanh_tien DECIMAL(12,2),
                         trang_thai INT
);
GO

IF OBJECT_ID('dbo.HOA_DON_CHI_TIET') IS NULL
CREATE TABLE HOA_DON_CHI_TIET (
                                  id INT IDENTITY(1,1) PRIMARY KEY,
                                  hoa_don_id INT FOREIGN KEY REFERENCES HOA_DON(id),
                                  chi_tiet_san_pham_id INT FOREIGN KEY REFERENCES CHI_TIET_SAN_PHAM(id),
                                  so_luong INT NOT NULL,
                                  don_gia DECIMAL(12,2),
                                  thanh_tien DECIMAL(12,2)
);
GO

IF OBJECT_ID('dbo.LICH_SU_HOA_DON') IS NULL
CREATE TABLE LICH_SU_HOA_DON (
                                 id INT IDENTITY(1,1) PRIMARY KEY,
                                 hoa_don_id INT FOREIGN KEY REFERENCES HOA_DON(id),
                                 nhan_vien_id INT FOREIGN KEY REFERENCES NHAN_VIEN(id),
                                 trang_thai_cu INT,
                                 trang_thai_moi INT,
                                 ly_do NVARCHAR(255),
                                 thoi_gian DATETIME DEFAULT GETDATE()
);
GO

IF OBJECT_ID('dbo.GIO_HANG') IS NULL
CREATE TABLE GIO_HANG (
                          id INT IDENTITY(1,1) PRIMARY KEY,
                          khach_hang_id INT FOREIGN KEY REFERENCES KHACH_HANG(id),
                          device_id INT,
                          chi_tiet_san_pham_id INT FOREIGN KEY REFERENCES CHI_TIET_SAN_PHAM(id),
                          so_luong INT DEFAULT 1,
                          trang_thai BIT DEFAULT 1,
                          created_at DATETIME DEFAULT GETDATE()
);
GO

IF OBJECT_ID('dbo.HINH_THUC_THANH_TOAN') IS NULL
CREATE TABLE HINH_THUC_THANH_TOAN (
                                      id INT IDENTITY(1,1) PRIMARY KEY,
                                      ma_hinh_thuc VARCHAR(20) NOT NULL,
                                      ten_hinh_thuc NVARCHAR(100) NOT NULL,
                                      mo_ta NVARCHAR(255),
                                      trang_thai BIT DEFAULT 1
);
GO

IF OBJECT_ID('dbo.CHI_TIET_THANH_TOAN') IS NULL
CREATE TABLE CHI_TIET_THANH_TOAN (
                                     id INT IDENTITY(1,1) PRIMARY KEY,
                                     hoa_don_id INT FOREIGN KEY REFERENCES HOA_DON(id),
                                     hinh_thuc_thanh_toan_id INT FOREIGN KEY REFERENCES HINH_THUC_THANH_TOAN(id),
                                     so_tien DECIMAL(12,2),
                                     ngay_thanh_toan DATETIME DEFAULT GETDATE(),
                                     ma_giao_dich VARCHAR(100),
                                     trang_thai INT
);
GO

-- ══════════════════════════════════════════════════════════════════
-- 3. BỔ SUNG CỘT THIẾU (cho DB tạo từ bản db.sql cũ)
-- ══════════════════════════════════════════════════════════════════
IF COL_LENGTH('dbo.SAN_PHAM', 'gioi_tinh') IS NULL
ALTER TABLE dbo.SAN_PHAM ADD gioi_tinh INT NULL;   -- 0=nam, 1=nữ, 2=unisex

IF COL_LENGTH('dbo.SAN_PHAM', 'chat_lieu_id') IS NULL
ALTER TABLE dbo.SAN_PHAM ADD chat_lieu_id INT NULL;

IF COL_LENGTH('dbo.SAN_PHAM', 'gia_ban') IS NULL
ALTER TABLE dbo.SAN_PHAM ADD gia_ban DECIMAL(12,2) NULL;

-- Entity chi_tiet_san_pham có trường gia_nhap (db.sql gốc không có cột này)
IF COL_LENGTH('dbo.CHI_TIET_SAN_PHAM', 'gia_nhap') IS NULL
ALTER TABLE dbo.CHI_TIET_SAN_PHAM ADD gia_nhap DECIMAL(12,2) NULL;

IF COL_LENGTH('dbo.NHAN_VIEN', 'ngay_tao') IS NULL
ALTER TABLE dbo.NHAN_VIEN ADD ngay_tao DATETIME2 NULL DEFAULT SYSDATETIME();

IF COL_LENGTH('dbo.KHACH_HANG', 'ngay_tao') IS NULL
ALTER TABLE dbo.KHACH_HANG ADD ngay_tao DATETIME2 NULL DEFAULT SYSDATETIME();
GO

-- ══════════════════════════════════════════════════════════════════
-- 4. NẠP DỮ LIỆU — mỗi khối chỉ chèn phần CHƯA có (WHERE NOT EXISTS)
-- ══════════════════════════════════════════════════════════════════

-- 4.1 VAI TRÒ
INSERT INTO VAI_TRO (ma_vai_tro, ten_vai_tro, mo_ta, trang_thai)
SELECT v.ma, v.ten, v.mo_ta, 1
FROM (VALUES
          ('ADMIN',       N'Quản trị viên', N'Tài khoản quản trị hệ thống'),
          ('NHAN_VIEN',   N'Nhân viên',     N'Tài khoản nhân viên bán hàng / quản lý'),
          ('KHACH_HANG',  N'Khách hàng',    N'Tài khoản khách hàng mua hàng')
     ) v(ma, ten, mo_ta)
WHERE NOT EXISTS (SELECT 1 FROM VAI_TRO x WHERE x.ma_vai_tro = v.ma);
GO

-- 4.2 NHÂN VIÊN (mật khẩu 123456)
INSERT INTO NHAN_VIEN (ma_nhan_vien, ho_ten, sdt, email, mat_khau, vai_tro_id, trang_thai)
SELECT v.ma, v.ten, v.sdt, v.email, '$2a$12$X.RO2ZcEnew4bh4jAJoX/ezz1YWl.rMRIZGs1DYASB6wEK5jD1dMm',
       vt.id, 1
FROM (VALUES
          ('NV001', N'Nguyễn Văn Admin',    '0550000888', 'admin@vibeflow.com',     'ADMIN'),
          ('NV002', N'Trần Thị Nhân Viên',  '0550000156', 'nhanvien01@vibeflow.com','NHAN_VIEN')
     ) v(ma, ten, sdt, email, vaitro)
         JOIN VAI_TRO vt ON vt.ma_vai_tro = v.vaitro
WHERE NOT EXISTS (SELECT 1 FROM NHAN_VIEN x WHERE x.email = v.email);
GO

-- 4.3 KHÁCH HÀNG (mật khẩu 123456)
INSERT INTO KHACH_HANG (ma_khach_hang, ho_ten, sdt, email, ngay_sinh, gioi_tinh, trang_thai, mat_khau)
SELECT 'KH001', N'Nguyễn Văn An', '0912345678', 'nguyenvanan@gmail.com', '1998-05-20', 1, 1,
       '$2a$12$X.RO2ZcEnew4bh4jAJoX/ezz1YWl.rMRIZGs1DYASB6wEK5jD1dMm'
    WHERE NOT EXISTS (SELECT 1 FROM KHACH_HANG WHERE email = 'nguyenvanan@gmail.com');
GO

-- 4.4 DANH MỤC
INSERT INTO DANH_MUC (ma_danh_muc, ten_danh_muc, mo_ta)
SELECT v.ma, v.ten, v.mo_ta
FROM (VALUES
          ('DM001', N'Giày thể thao', N'Giày thể thao đa năng'),
          ('DM002', N'Giày chạy bộ',  N'Giày chuyên chạy bộ'),
          ('DM003', N'Giày bóng đá',  N'Giày đá bóng sân cỏ'),
          ('DM004', N'Giày sneaker',  N'Giày thời trang hằng ngày'),
          ('DM005', N'Giày tập gym',  N'Giày dùng khi tập luyện')
     ) v(ma, ten, mo_ta)
WHERE NOT EXISTS (SELECT 1 FROM DANH_MUC d WHERE d.ma_danh_muc = v.ma);
GO

-- 4.5 THƯƠNG HIỆU
INSERT INTO THUONG_HIEU (ma_thuong_hieu, ten_thuong_hieu, mo_ta)
SELECT v.ma, v.ten, v.mo_ta
FROM (VALUES
          ('TH001', N'Nike',        N'Thương hiệu giày thể thao'),
          ('TH002', N'Adidas',      N'Thương hiệu thể thao'),
          ('TH003', N'Puma',        N'Thương hiệu thể thao'),
          ('TH004', N'Converse',    N'Giày sneaker thời trang'),
          ('TH005', N'New Balance', N'Giày thể thao và chạy bộ'),
          ('TH006', N'Vans',        N'Giày phong cách đường phố')
     ) v(ma, ten, mo_ta)
WHERE NOT EXISTS (SELECT 1 FROM THUONG_HIEU t WHERE t.ma_thuong_hieu = v.ma);
GO

-- 4.6 XUẤT XỨ
INSERT INTO XUAT_XU (ma_xuat_xu, ten_xuat_xu, mo_ta)
SELECT v.ma, v.ten, v.mo_ta
FROM (VALUES
          ('XX001', N'Việt Nam',          N'Sản xuất tại Việt Nam'),
          ('XX002', N'Indonesia',         N'Sản xuất tại Indonesia'),
          ('XX003', N'Việt Nam/Indonesia',N'Xuất xứ tùy lô sản xuất'),
          ('XX004', N'Trung Quốc',        N'Sản xuất tại Trung Quốc'),
          ('XX005', N'Ấn Độ',             N'Sản xuất tại Ấn Độ')
     ) v(ma, ten, mo_ta)
WHERE NOT EXISTS (SELECT 1 FROM XUAT_XU x WHERE x.ma_xuat_xu = v.ma);
GO

-- 4.7 CHẤT LIỆU
INSERT INTO CHAT_LIEU (ma_chat_lieu, ten_chat_lieu, mo_ta)
SELECT v.ma, v.ten, v.mo_ta
FROM (VALUES
          ('CL001', N'Da thật',         N'Da bò thật, bền, form giữ dáng tốt'),
          ('CL002', N'Da tổng hợp',     N'Da PU/PVC nhân tạo, giá mềm, dễ vệ sinh'),
          ('CL003', N'Vải lưới (Mesh)', N'Thoáng khí, nhẹ, phù hợp chạy bộ'),
          ('CL004', N'Vải Canvas',      N'Vải bố dày, bền, phong cách casual'),
          ('CL005', N'Flyknit',         N'Sợi dệt liền khối, ôm chân, nhẹ'),
          ('CL006', N'Primeknit',       N'Công nghệ dệt của Adidas, mềm, ôm chân'),
          ('CL007', N'Da lộn (Suede)',  N'Bề mặt nhung mịn, phong cách retro')
     ) v(ma, ten, mo_ta)
WHERE NOT EXISTS (SELECT 1 FROM CHAT_LIEU c WHERE c.ma_chat_lieu = v.ma);
GO

-- 4.8 MÀU SẮC
INSERT INTO MAU_SAC (ma_mau, ten_mau, ma_hex)
SELECT v.ma, v.ten, v.hex
FROM (VALUES
          ('MS001',  N'Trắng',      '#FFFFFF'),
          ('MS002',  N'Đen',        '#000000'),
          ('MS003',  N'Đỏ',         '#FF0000'),
          ('MS004',  N'Xanh dương', '#0000FF'),
          ('MS005',  N'Xám',        '#808080'),
          ('MS006',  N'Xanh lá',    '#008000'),
          ('MS007',  N'Be',         '#F5F5DC'),
          ('MS008',  N'Hồng',       '#FFC0CB'),
          ('MS009',  N'Nâu',        '#8B4513')
     ) v(ma, ten, hex)
WHERE NOT EXISTS (SELECT 1 FROM MAU_SAC m WHERE m.ma_mau = v.ma);
GO

-- 4.9 KÍCH THƯỚC (size EU 36–45)
INSERT INTO KICH_THUOC (ma_kich_thuoc, ten_kich_thuoc)
SELECT v.ma, v.ten
FROM (VALUES
          ('EU036', N'36'), ('EU037', N'37'), ('EU038', N'38'),
          ('EU039', N'39'), ('EU040', N'40'), ('EU041', N'41'),
          ('EU042', N'42'), ('EU043', N'43'), ('EU044', N'44'), ('EU045', N'45')
     ) v(ma, ten)
WHERE NOT EXISTS (SELECT 1 FROM KICH_THUOC k WHERE k.ma_kich_thuoc = v.ma);
GO

-- 4.10 SẢN PHẨM (12 mẫu)
INSERT INTO SAN_PHAM (ma_san_pham, ten_san_pham, danh_muc_id, thuong_hieu_id, xuat_xu_id, chat_lieu_id, mo_ta, gia_ban, trang_thai)
SELECT p.ma, p.ten, dm.id, th.id, xx.id, cl.id, p.mo_ta, p.gia, 1
FROM (VALUES
          ('SP001', N'Nike Air Force 1',          'DM004', 'TH001', 'XX002', 'CL001', N'Giày sneaker phong cách cổ điển',        2590000.00),
          ('SP002', N'Nike Air Max Excee',        'DM001', 'TH001', 'XX002', 'CL003', N'Giày thể thao đệm êm, thiết kế hiện đại', 2890000.00),
          ('SP003', N'Adidas Ultraboost',         'DM002', 'TH002', 'XX003', 'CL006', N'Giày chạy bộ đệm êm, hỗ trợ vận động',    3990000.00),
          ('SP004', N'Adidas Superstar',          'DM004', 'TH002', 'XX004', 'CL001', N'Giày sneaker mũi vỏ sò đặc trưng',        2290000.00),
          ('SP005', N'Puma Suede Classic',        'DM004', 'TH003', 'XX004', 'CL007', N'Giày sneaker phong cách cổ điển',         1890000.00),
          ('SP006', N'Converse Chuck Taylor',     'DM004', 'TH004', 'XX003', 'CL004', N'Giày vải cổ điển, dễ phối đồ',            1450000.00),
          ('SP007', N'New Balance 574',           'DM001', 'TH005', 'XX004', 'CL007', N'Giày thể thao phong cách retro',          2490000.00),
          ('SP008', N'Vans Old Skool',            'DM004', 'TH006', 'XX004', 'CL004', N'Giày vải phong cách đường phố',           1650000.00),
          ('SP009', N'Nike Revolution',           'DM002', 'TH001', 'XX001', 'CL003', N'Giày chạy bộ nhẹ, phù hợp tập luyện',     1790000.00),
          ('SP010', N'Adidas Predator',           'DM003', 'TH002', 'XX003', 'CL002', N'Giày bóng đá dành cho sân cỏ',            3190000.00),
          ('SP011', N'Nike Metcon',               'DM005', 'TH001', 'XX002', 'CL003', N'Giày tập luyện sức mạnh và gym',          3290000.00),
          ('SP012', N'Puma Flyer Runner',         'DM002', 'TH003', 'XX004', 'CL003', N'Giày chạy bộ nhẹ nhàng hằng ngày',        1290000.00)
     ) p(ma, ten, dm, th, xx, cl, mo_ta, gia)
         JOIN DANH_MUC    dm ON dm.ma_danh_muc    = p.dm
         JOIN THUONG_HIEU th ON th.ma_thuong_hieu = p.th
         JOIN XUAT_XU     xx ON xx.ma_xuat_xu     = p.xx
         JOIN CHAT_LIEU   cl ON cl.ma_chat_lieu   = p.cl
WHERE NOT EXISTS (SELECT 1 FROM SAN_PHAM s WHERE s.ma_san_pham = p.ma);
GO

-- 4.11 BIẾN THỂ TỒN KHO — mỗi sản phẩm 2 màu (Trắng, Đen) x 6 size (39–44)
INSERT INTO CHI_TIET_SAN_PHAM (ma_chi_tiet, san_pham_id, mau_sac_id, kich_thuoc_id, so_luong, gia_ban, trang_thai)
SELECT sp.ma_san_pham + '-' + ms.ma_mau + '-' + kt.ma_kich_thuoc,
       sp.id, ms.id, kt.id, sz.so_luong, sp.gia_ban, 1
FROM SAN_PHAM sp
         CROSS JOIN (VALUES ('MS001'), ('MS002')) m(ma_mau)
         CROSS JOIN (VALUES
                         ('EU039', 28), ('EU040', 32), ('EU041', 30),
                         ('EU042', 24), ('EU043', 20), ('EU044', 15)
) sz(ma_size, so_luong)
         JOIN MAU_SAC    ms ON ms.ma_mau         = m.ma_mau
         JOIN KICH_THUOC kt ON kt.ma_kich_thuoc  = sz.ma_size
WHERE NOT EXISTS (
    SELECT 1 FROM CHI_TIET_SAN_PHAM c
    WHERE c.san_pham_id = sp.id AND c.mau_sac_id = ms.id AND c.kich_thuoc_id = kt.id
);
GO

-- 4.12 HÌNH THỨC THANH TOÁN (app cũng tự nạp lúc khởi động — chèn ở đây để chắc chắn)
INSERT INTO HINH_THUC_THANH_TOAN (ma_hinh_thuc, ten_hinh_thuc, mo_ta, trang_thai)
SELECT v.ma, v.ten, v.mo_ta, 1
FROM (VALUES
          ('TIEN_MAT',      N'Tiền mặt',       N'Thanh toán bằng tiền mặt tại quầy'),
          ('CHUYEN_KHOAN',  N'Chuyển khoản',   N'Chuyển khoản ngân hàng / quét mã QR')
     ) v(ma, ten, mo_ta)
WHERE NOT EXISTS (SELECT 1 FROM HINH_THUC_THANH_TOAN h WHERE h.ma_hinh_thuc = v.ma);
GO

-- ══════════════════════════════════════════════════════════════════
-- 5. KIỂM TRA KẾT QUẢ
-- ══════════════════════════════════════════════════════════════════
SELECT 'VAI_TRO' bang, COUNT(*) so_dong FROM VAI_TRO
UNION ALL SELECT 'NHAN_VIEN', COUNT(*) FROM NHAN_VIEN
UNION ALL SELECT 'KHACH_HANG', COUNT(*) FROM KHACH_HANG
UNION ALL SELECT 'DANH_MUC', COUNT(*) FROM DANH_MUC
UNION ALL SELECT 'THUONG_HIEU', COUNT(*) FROM THUONG_HIEU
UNION ALL SELECT 'XUAT_XU', COUNT(*) FROM XUAT_XU
UNION ALL SELECT 'CHAT_LIEU', COUNT(*) FROM CHAT_LIEU
UNION ALL SELECT 'MAU_SAC', COUNT(*) FROM MAU_SAC
UNION ALL SELECT 'KICH_THUOC', COUNT(*) FROM KICH_THUOC
UNION ALL SELECT 'SAN_PHAM', COUNT(*) FROM SAN_PHAM
UNION ALL SELECT 'CHI_TIET_SAN_PHAM', COUNT(*) FROM CHI_TIET_SAN_PHAM
UNION ALL SELECT 'HINH_THUC_THANH_TOAN', COUNT(*) FROM HINH_THUC_THANH_TOAN
UNION ALL SELECT 'HOA_DON', COUNT(*) FROM HOA_DON
ORDER BY bang;
GO
USE VibeFlowDB;
GO
IF COL_LENGTH('dbo.CHI_TIET_SAN_PHAM', 'gia_nhap') IS NULL
ALTER TABLE dbo.CHI_TIET_SAN_PHAM ADD gia_nhap DECIMAL(12,2) NULL;