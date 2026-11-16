package com.example.datn.service;

import com.example.datn.dto.banhang.ThanhToanPosRequest;
import com.example.datn.entity.*;
import com.example.datn.exception.BadRequestException;
import com.example.datn.exception.NotFoundException;
import com.example.datn.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * Nghiệp vụ Bán Hàng POS + Thống Kê Dashboard.
 * (Code sản phẩm — SanPham*, ChiTiet*, HinhAnh* — KHÔNG đụng vào.)
 *
 * Quy ước HOA_DON.trang_thai: 3 = POS tại quầy (hoàn thành), còn lại = online.
 * Quy ước HINH_THUC_THANH_TOAN.ma_hinh_thuc: TIEN_MAT | CHUYEN_KHOAN.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class BanHangService {

    private final HoaDonRepository hoaDonRepo;
    private final HoaDonChiTietRepository hoaDonChiTietRepo;
    private final HinhThucThanhToanRepository hinhThucRepo;
    private final ChiTietThanhToanRepository thanhToanRepo;
    private final SanPhamChiTietRepository chiTietRepo;
    private final SanPhamRepository sanPhamRepo;
    private final HinhAnhRepository hinhAnhRepo;
    private final KhachHangRepository khachHangRepo;
    private final KhuyenMaiService khuyenMaiService;
    private final VietQrService vietQrService;
    private final MaHoaDonGenerator maHoaDonGenerator;

    /** Ngưỡng tồn kho thấp hiển thị cảnh báo trên dashboard. */
    private static final int NGUONG_TON_THAP = 10;

    // ══════════════════════════════════════════════════════ BÁN HÀNG (POS)

    /**
     * Lưới sản phẩm cho POS (phân trang + lọc ở backend).
     * q: tên / mã SP (gần đúng) hoặc mã chi tiết (quét mã vạch, chính xác).
     * Chỉ trả sản phẩm đang bán có biến thể đã có giá; giá/tồn tính trên các biến thể đó.
     */
    @Transactional(readOnly = true)
    public Map<String, Object> sanPhamBanHang(String q, Integer danhMucId, Integer thuongHieuId,
                                              boolean conHang, int page, int size) {
        size = Math.min(Math.max(size, 1), 100);
        page = Math.max(page, 0);
        String tuKhoa = q == null ? "" : q.trim();

        var result = sanPhamRepo.findBanHang(tuKhoa, danhMucId, thuongHieuId, conHang,
                org.springframework.data.domain.PageRequest.of(page, size,
                        Sort.by(Sort.Direction.DESC, "ngayTao").and(Sort.by(Sort.Direction.DESC, "id"))));

        List<SanPhamEntity> items = result.getContent();
        List<Long> ids = items.stream().map(SanPhamEntity::getId).toList();

        Map<Long, SanPhamChiTietRepository.GiaBanHang> giaMap = ids.isEmpty() ? Map.of()
                : chiTietRepo.giaBanHang(ids).stream()
                    .collect(java.util.stream.Collectors.toMap(
                            SanPhamChiTietRepository.GiaBanHang::getSanPhamId, java.util.function.Function.identity()));
        Map<Integer, String> anhMap = new HashMap<>();
        if (!ids.isEmpty()) {
            // Query ảnh có sẵn của module sản phẩm nhận Collection<Integer>
            for (var h : hinhAnhRepo.findAnhDaiDien(ids.stream().map(Long::intValue).toList())) {
                anhMap.putIfAbsent(h.getSanPhamId(), h.getUrlAnh());
            }
        }

        List<Map<String, Object>> content = new ArrayList<>();
        for (SanPhamEntity sp : items) {
            var g = giaMap.get(sp.getId());
            long ton = g != null && g.getTonKho() != null ? g.getTonKho() : 0L;
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", sp.getId());
            m.put("maSanPham", sp.getMaSanPham());
            m.put("tenSanPham", sp.getTenSanPham());
            m.put("giaBan", g != null && g.getGiaMin() != null ? g.getGiaMin() : BigDecimal.ZERO);
            m.put("giaMax", g != null && g.getGiaMax() != null ? g.getGiaMax() : BigDecimal.ZERO);
            m.put("tongTonKho", ton);
            m.put("conHang", ton > 0);
            m.put("urlAnhChinh", anhMap.get(sp.getId().intValue()));
            content.add(m);
        }

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("content", content);
        body.put("page", result.getNumber());
        body.put("size", result.getSize());
        body.put("totalElements", result.getTotalElements());
        body.put("totalPages", result.getTotalPages());
        return body;
    }

    /** Biến thể (màu/size/tồn/giá) của 1 sản phẩm để chọn khi bán — dùng API có sẵn. */
    @Transactional(readOnly = true)
    public List<Map<String, Object>> bienTheBanHang(Long sanPhamId) {
        List<Map<String, Object>> list = new ArrayList<>();
        for (SanPhamChiTietEntity ct : chiTietRepo.findActiveBySanPham(sanPhamId)) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", ct.getId());
            m.put("maChiTiet", ct.getMaChiTiet());
            m.put("tenMau", ct.getMauSac().getTenMau());
            m.put("maHex", ct.getMauSac().getMaHex());
            m.put("tenKichThuoc", ct.getKichThuoc().getTenKichThuoc());
            m.put("soLuong", ct.getSoLuong() == null ? 0 : ct.getSoLuong());
            // Bản này giá nằm ở biến thể (SanPhamEntity không có cột giá)
            m.put("giaBan", ct.getGiaBan() != null ? ct.getGiaBan() : BigDecimal.ZERO);
            list.add(m);
        }
        return list;
    }

    /**
     * Thanh toán POS — lưu hóa đơn + dòng hàng + thanh toán, trừ tồn kho, trả bill K80.
     * Toàn bộ trong 1 transaction: lỗi ở bất kỳ bước nào → rollback, không trừ kho, không trừ lượt KM.
     *
     * Kiểm tra:
     *  - gộp các dòng trùng biến thể trước khi so tồn (tránh bán âm kho)
     *  - khóa dòng biến thể (UPDLOCK) theo thứ tự id tăng dần (tránh deadlock giữa 2 quầy)
     *  - giá lấy từ DB; tiền giảm tính từ mã khuyến mãi ở backend
     *  - tiền mặt: khách đưa phải đủ; chuyển khoản: bắt buộc mã giao dịch / nội dung CK
     */
    @Transactional
    public Map<String, Object> thanhToan(ThanhToanPosRequest req, Long nhanVienId) {
        return lapHoaDon(req, nhanVienId, false);
    }

    /**
     * VNPay — lập hóa đơn CHỜ THANH TOÁN (trạng thái 0): giữ hàng (trừ kho), trừ lượt KM,
     * ghi 1 dòng CHI_TIET_THANH_TOAN trạng thái 0 (đang chờ, mã GD = mã hóa đơn = vnp_TxnRef).
     * Kết quả VNPay trả về sẽ xác nhận (→ 3) hoặc hủy + hoàn kho (→ 6). Xem VnPayThanhToanService.
     */
    @Transactional
    public Map<String, Object> lapHoaDonVnPay(ThanhToanPosRequest req, Long nhanVienId) {
        return lapHoaDon(req, nhanVienId, true);
    }

    private Map<String, Object> lapHoaDon(ThanhToanPosRequest req, Long nhanVienId, boolean vnpay) {
        if (nhanVienId == null) {
            throw new AccessDeniedException("Tài khoản đang đăng nhập không phải nhân viên — không thể lập hóa đơn!");
        }

        String phuongThuc = vnpay ? VnPayThanhToanService.MA_HINH_THUC
                : req.phuongThuc() == null || req.phuongThuc().isBlank() ? "TIEN_MAT"
                : req.phuongThuc().trim().toUpperCase();
        if (!vnpay && VnPayThanhToanService.MA_HINH_THUC.equals(phuongThuc)) {
            throw new BadRequestException("Thanh toán VNPay phải tạo qua /ban-hang/vnpay/tao-thanh-toan");
        }
        HinhThucThanhToanEntity hinhThuc = hinhThucRepo.findByMaHinhThuc(phuongThuc)
                .filter(h -> !Boolean.FALSE.equals(h.getTrangThai()))
                .orElseThrow(() -> new BadRequestException("Phương thức thanh toán không hợp lệ: " + phuongThuc));

        if (req.khachHangId() != null && !khachHangRepo.existsById(req.khachHangId())) {
            throw new NotFoundException("Không tìm thấy khách hàng id=" + req.khachHangId());
        }
        String maGiaoDich = req.maGiaoDich() == null || req.maGiaoDich().isBlank() ? null : req.maGiaoDich().trim();

        // ── 1. Gộp dòng trùng biến thể, khóa theo thứ tự id ──
        Map<Long, Integer> soLuongTheoBienThe = new TreeMap<>();
        for (var it : req.items()) {
            soLuongTheoBienThe.merge(it.chiTietId(), it.soLuong(), Integer::sum);
        }

        BigDecimal tongTien = BigDecimal.ZERO;
        List<HoaDonChiTietEntity> dongHang = new ArrayList<>();
        for (var e : soLuongTheoBienThe.entrySet()) {
            Long chiTietId = e.getKey();
            int soLuong = e.getValue();

            SanPhamChiTietEntity bt = chiTietRepo.findDangBanForUpdate(chiTietId)
                    .orElseThrow(() -> new NotFoundException(
                            "Biến thể id=" + chiTietId + " không tồn tại hoặc đã ngừng bán!"));
            String tenBt = String.format("%s [%s size %s]", bt.getSanPham().getTenSanPham(),
                    bt.getMauSac().getTenMau(), bt.getKichThuoc().getTenKichThuoc());

            int ton = bt.getSoLuong() == null ? 0 : bt.getSoLuong();
            if (soLuong > ton) {
                throw new BadRequestException(String.format("%s chỉ còn %d đôi (yêu cầu %d)!", tenBt, ton, soLuong));
            }
            BigDecimal donGia = bt.getGiaBan();
            if (donGia == null || donGia.signum() <= 0) {
                throw new BadRequestException(tenBt + " chưa có giá bán!");
            }
            BigDecimal thanhTienDong = donGia.multiply(BigDecimal.valueOf(soLuong));
            tongTien = tongTien.add(thanhTienDong);

            dongHang.add(HoaDonChiTietEntity.builder()
                    .chiTietSanPham(bt)
                    .soLuong(soLuong)
                    .donGia(donGia)
                    .thanhTien(thanhTienDong)
                    .build());
        }

        // ── 2. Khuyến mãi (backend tự tính, trừ 1 lượt) ──
        KhuyenMaiEntity khuyenMai = null;
        BigDecimal tienGiam = BigDecimal.ZERO;
        if (req.maKhuyenMai() != null && !req.maKhuyenMai().isBlank()) {
            khuyenMai = khuyenMaiService.apDung(req.maKhuyenMai(), tongTien);
            tienGiam = khuyenMaiService.tinhTienGiam(khuyenMai, tongTien);
        }
        BigDecimal thanhTien = tongTien.subtract(tienGiam);

        // ── 3. Kiểm tra tiền theo phương thức ──
        BigDecimal tienKhachDua = null;
        BigDecimal tienThoi = null;
        if ("TIEN_MAT".equals(phuongThuc)) {
            tienKhachDua = req.tienKhachDua();
            if (tienKhachDua == null) {
                throw new BadRequestException("Vui lòng nhập số tiền khách đưa!");
            }
            if (tienKhachDua.compareTo(thanhTien) < 0) {
                throw new BadRequestException("Khách đưa chưa đủ tiền! Cần " + thanhTien.stripTrailingZeros().toPlainString() + "đ");
            }
            tienThoi = tienKhachDua.subtract(thanhTien);
        } else if (vnpay) {
            if (thanhTien.compareTo(VnPayThanhToanService.SO_TIEN_TOI_THIEU) < 0) {
                throw new BadRequestException("VNPay chỉ nhận giao dịch từ 5.000đ trở lên!");
            }
        } else if (maGiaoDich == null) {
            throw new BadRequestException("Chuyển khoản: vui lòng tạo mã QR hoặc nhập mã giao dịch!");
        }

        // ── 4. Lưu hóa đơn (3 = POS hoàn thành; VNPay: 0 = chờ thanh toán) ──
        String maHoaDon = maHoaDonGenerator.sinh(MaHoaDonGenerator.PREFIX_POS);
        HoaDonEntity hd = hoaDonRepo.save(HoaDonEntity.builder()
                .maHoaDon(maHoaDon)
                .khachHangId(req.khachHangId())
                .nhanVienId(nhanVienId)
                .khuyenMaiId(khuyenMai == null ? null : khuyenMai.getId())
                .tongTien(tongTien)
                .tienGiam(tienGiam)
                .thanhTien(thanhTien)
                .trangThai(vnpay ? 0 : 3)
                .build());
        if (vnpay) maGiaoDich = maHoaDon; // = vnp_TxnRef, đổi thành mã GD VNPay khi thanh toán xong

        // ── 5. Lưu chi tiết + trừ tồn kho (dòng đã khóa ở bước 1) ──
        for (HoaDonChiTietEntity ct : dongHang) {
            ct.setHoaDon(hd);
            hoaDonChiTietRepo.save(ct);

            SanPhamChiTietEntity bt = ct.getChiTietSanPham();
            bt.setSoLuong(bt.getSoLuong() - ct.getSoLuong());
            chiTietRepo.save(bt);
        }

        // ── 6. Lưu thanh toán (bảng CHI_TIET_THANH_TOAN) ──
        thanhToanRepo.save(ChiTietThanhToanEntity.builder()
                .hoaDon(hd)
                .hinhThuc(hinhThuc)
                .soTien(thanhTien)
                .maGiaoDich(maGiaoDich)
                .trangThai(vnpay ? 0 : 1)   // 0 = đang chờ VNPay, 1 = đã nhận tiền
                .build());

        // ── 7. Trả bill K80 ──
        Map<String, Object> bill = buildBill(hd, dongHang);
        bill.put("phuongThuc", hinhThuc.getTenHinhThuc());
        bill.put("maPhuongThuc", hinhThuc.getMaHinhThuc());
        bill.put("tienKhachDua", tienKhachDua);
        bill.put("tienThoi", tienThoi);
        bill.put("maGiaoDich", maGiaoDich);
        bill.put("maKhuyenMai", khuyenMai == null ? null : khuyenMai.getMaKhuyenMai());
        return bill;
    }

    /** Mã QR VietQR cho số tiền cần thu (POS chuyển khoản). */
    public Map<String, Object> taoMaQr(BigDecimal soTien) {
        return vietQrService.taoMaQr(soTien);
    }

    /** In lại bill của hóa đơn cũ. */
    @Transactional(readOnly = true)
    public Map<String, Object> layBill(Integer hoaDonId) {
        HoaDonEntity hd = hoaDonRepo.findById(hoaDonId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy hóa đơn!"));
        List<HoaDonChiTietEntity> ds = hoaDonChiTietRepo.findByHoaDon_Id(hoaDonId);

        Map<String, Object> bill = buildBill(hd, ds);
        thanhToanRepo.findByHoaDon_Id(hoaDonId).stream().findFirst().ifPresent(tt -> {
            bill.put("phuongThuc", tt.getHinhThuc().getTenHinhThuc());
            bill.put("maPhuongThuc", tt.getHinhThuc().getMaHinhThuc());
            bill.put("tienKhachDua", null);
            bill.put("tienThoi", null);
            bill.put("maGiaoDich", tt.getMaGiaoDich());
        });
        return bill;
    }

    /** Danh sách hóa đơn (mới nhất trước) — tab Quản Lý Hóa Đơn. */
    @Transactional(readOnly = true)
    public List<Map<String, Object>> danhSachHoaDon() {
        List<Map<String, Object>> res = new ArrayList<>();
        for (HoaDonEntity hd : hoaDonRepo.findAll(Sort.by(Sort.Direction.DESC, "id"))) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", hd.getId());
            m.put("maHoaDon", hd.getMaHoaDon());
            m.put("ngayTao", hd.getNgayTao() == null ? null : hd.getNgayTao().toString());
            m.put("trangThai", hd.getTrangThai());
            m.put("khachHangId", hd.getKhachHangId());
            m.put("nhanVienId", hd.getNhanVienId());
            m.put("tongTien", hd.getTongTien());
            m.put("tienGiam", hd.getTienGiam());
            m.put("thanhTien", hd.getThanhTien());
            thanhToanRepo.findByHoaDon_Id(hd.getId()).stream().findFirst().ifPresent(tt -> {
                m.put("phuongThuc", tt.getHinhThuc().getTenHinhThuc());
                m.put("maPhuongThuc", tt.getHinhThuc().getMaHinhThuc());
            });
            StringBuilder sb = new StringBuilder();
            for (HoaDonChiTietEntity ct : hoaDonChiTietRepo.findByHoaDon_Id(hd.getId())) {
                if (sb.length() > 0) sb.append(", ");
                sb.append(ct.getChiTietSanPham().getSanPham().getTenSanPham())
                  .append(" x").append(ct.getSoLuong());
            }
            m.put("itemsSummary", sb.toString());
            res.add(m);
        }
        return res;
    }

    // ══════════════════════════════════════════════════════ THỐNG KÊ DASHBOARD

    /**
     * GET /ban-hang/thong-ke?period=today|7days|month|year
     * Khớp 4 KPI card + biểu đồ 7 ngày + tỷ trọng kênh + phương thức thanh toán + top bán chạy + tồn thấp.
     */
    @Transactional(readOnly = true)
    public Map<String, Object> thongKe(String period) {
        LocalDate today = LocalDate.now();
        LocalDateTime[] ky = switch (period == null ? "7days" : period) {
            case "today" -> new LocalDateTime[]{ today.atStartOfDay(), today.plusDays(1).atStartOfDay() };
            case "month" -> new LocalDateTime[]{ today.withDayOfMonth(1).atStartOfDay(), today.plusDays(1).atStartOfDay() };
            case "year"  -> new LocalDateTime[]{ today.withDayOfYear(1).atStartOfDay(), today.plusDays(1).atStartOfDay() };
            default      -> new LocalDateTime[]{ today.minusDays(6).atStartOfDay(), today.plusDays(1).atStartOfDay() };
        };
        LocalDateTime tu = ky[0], den = ky[1];
        LocalDateTime[] kyTruoc = new LocalDateTime[]{ tu.minus(Duration.between(tu, den)), tu };

        // ── KPI ──
        Object[] hienTai = hang(hoaDonRepo.tongHopTheoKy(tu, den));
        BigDecimal doanhThu = asBigDecimal(hienTai[0]);
        long soDon = asLong(hienTai[1]);
        long soDoiXuatKho = asLong(hoaDonChiTietRepo.tongSoLuongXuatKho(tu, den));
        BigDecimal aov = soDon == 0 ? BigDecimal.ZERO
                : doanhThu.divide(BigDecimal.valueOf(soDon), 0, RoundingMode.HALF_UP);

        Object[] truoc = hang(hoaDonRepo.tongHopKyTruoc(kyTruoc[0], kyTruoc[1]));
        BigDecimal doanhThuTruoc = asBigDecimal(truoc[0]);
        long soDonTruoc = asLong(truoc[1]);

        // ── Tỷ trọng kênh ──
        BigDecimal dtPos = asBigDecimal(hoaDonRepo.doanhThuPos(tu, den));
        BigDecimal dtOnline = asBigDecimal(hoaDonRepo.doanhThuOnline(tu, den));
        BigDecimal tongKenh = dtPos.add(dtOnline);
        int posPct = tongKenh.signum() == 0 ? 0
                : dtPos.multiply(BigDecimal.valueOf(100)).divide(tongKenh, 0, RoundingMode.HALF_UP).intValue();
        int onlinePct = tongKenh.signum() == 0 ? 0 : 100 - posPct;

        // ── Phương thức thanh toán (từ CHI_TIET_THANH_TOAN thật) ──
        List<Map<String, Object>> phuongThucTT = new ArrayList<>();
        BigDecimal tongPT = BigDecimal.ZERO;
        Map<String, BigDecimal> ptTien = new LinkedHashMap<>();
        for (Object[] r : thanhToanRepo.doanhThuTheoHinhThuc(tu, den)) {
            BigDecimal t = asBigDecimal(r[2]);
            ptTien.put(r[0] + "|" + r[1], t);
            tongPT = tongPT.add(t);
        }
        for (var e : ptTien.entrySet()) {
            String[] k = e.getKey().split("\\|", 2);
            int pct = tongPT.signum() == 0 ? 0
                    : e.getValue().multiply(BigDecimal.valueOf(100)).divide(tongPT, 0, RoundingMode.HALF_UP).intValue();
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("maHinhThuc", k[0]);
            m.put("tenHinhThuc", k[1]);
            m.put("soTien", e.getValue());
            m.put("phanTram", pct);
            phuongThucTT.add(m);
        }

        // ── Biểu đồ 7 ngày (luôn 7 ngày gần nhất) ──
        LocalDateTime c7 = LocalDate.now().minusDays(6).atStartOfDay();
        LocalDateTime c7Den = LocalDate.now().plusDays(1).atStartOfDay();
        Map<LocalDate, BigDecimal> theoNgay = new LinkedHashMap<>();
        for (int i = 6; i >= 0; i--) theoNgay.put(LocalDate.now().minusDays(i), BigDecimal.ZERO);
        for (Object[] r : hoaDonRepo.doanhThuTheoNgay(c7, c7Den)) {
            LocalDate d = toLocalDate(r[0]);
            if (d != null) theoNgay.put(d, asBigDecimal(r[1]));
        }
        List<Map<String, Object>> bieuDo7Ngay = new ArrayList<>();
        for (var e : theoNgay.entrySet()) {
            String thu = switch (e.getKey().getDayOfWeek()) {
                case MONDAY -> "Thứ 2"; case TUESDAY -> "Thứ 3"; case WEDNESDAY -> "Thứ 4";
                case THURSDAY -> "Thứ 5"; case FRIDAY -> "Thứ 6"; case SATURDAY -> "Thứ 7";
                default -> "CN";
            };
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("ngay", e.getKey().toString());
            m.put("thu", thu);
            m.put("doanhThu", e.getValue());
            bieuDo7Ngay.add(m);
        }
        BigDecimal peak = theoNgay.values().stream().max(BigDecimal::compareTo).orElse(BigDecimal.ZERO);

        // ── Top bán chạy ──
        List<Map<String, Object>> topBanChay = new ArrayList<>();
        for (Object[] r : hoaDonChiTietRepo.topBanChay(tu, den)) {
            if (topBanChay.size() >= 5) break;   // chỉ lấy top 5
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("sanPhamId", ((Number) r[0]).longValue());
            m.put("tenSanPham", r[1]);
            m.put("daBan", asLong(r[2]));
            m.put("doanhThu", asBigDecimal(r[3]));
            topBanChay.add(m);
        }

        // ── Tồn kho thấp (dùng truy vấn có sẵn của module sản phẩm) ──
        List<Map<String, Object>> tonKhoThap = new ArrayList<>();
        for (SanPhamEntity sp : sanPhamRepo.findByTrangThaiTrueOrderByNgayTaoDesc()) {
            long ton = 0; long hetSize = 0;
            for (SanPhamChiTietEntity ct : chiTietRepo.findActiveBySanPham(sp.getId())) {
                long sl = ct.getSoLuong() == null ? 0 : ct.getSoLuong();
                ton += sl;
                if (sl == 0) hetSize++;
            }
            if (ton < NGUONG_TON_THAP) {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("sanPhamId", sp.getId());
                m.put("tenSanPham", sp.getTenSanPham());
                m.put("tonKho", ton);
                m.put("sizeHetHang", hetSize);
                tonKhoThap.add(m);
            }
        }

        // ── Ghép response ──
        Map<String, Object> res = new LinkedHashMap<>();
        res.put("period", period == null ? "7days" : period);
        res.put("tu", tu.toString());
        res.put("den", den.toString());

        Map<String, Object> kpi = new LinkedHashMap<>();
        kpi.put("tongDoanhThu", doanhThu);
        kpi.put("tangTruongDoanhThu", phanTramTang(doanhThu, doanhThuTruoc));
        kpi.put("doanhThuKyTruoc", doanhThuTruoc);
        kpi.put("tongDonHang", soDon);
        kpi.put("tangTruongDonHang", phanTramTang(BigDecimal.valueOf(soDon), BigDecimal.valueOf(soDonTruoc)));
        kpi.put("aov", aov);
        kpi.put("soDoiXuatKho", soDoiXuatKho);
        res.put("kpi", kpi);

        Map<String, Object> kenh = new LinkedHashMap<>();
        kenh.put("posDoanhThu", dtPos);
        kenh.put("posPhanTram", posPct);
        kenh.put("onlineDoanhThu", dtOnline);
        kenh.put("onlinePhanTram", onlinePct);
        res.put("kenhBanHang", kenh);

        res.put("phuongThucThanhToan", phuongThucTT);
        res.put("bieuDo7Ngay", bieuDo7Ngay);
        res.put("bieuDo7NgayPeak", peak);
        res.put("doanhThuTB7Ngay", doanhThuTB(theoNgay.values()));
        res.put("topBanChay", topBanChay);
        res.put("tonKhoThap", tonKhoThap);
        res.put("nguongTonThap", NGUONG_TON_THAP);
        return res;
    }

    // ══════════════════════════════════════════════════════ SEED + HELPERS

    /** Nạp 2 hình thức thanh toán cơ bản nếu bảng còn trống (chạy 1 lần lúc khởi động, chỉ THÊM). */
    @Transactional
    public void seedHinhThucThanhToan() {
        taoNeuThieu("TIEN_MAT", "Tiền mặt", "Thanh toán bằng tiền mặt tại quầy");
        taoNeuThieu("CHUYEN_KHOAN", "Chuyển khoản", "Chuyển khoản ngân hàng / quét mã QR");
        taoNeuThieu(VnPayThanhToanService.MA_HINH_THUC, "VNPay", "Cổng thanh toán VNPay (QR / thẻ ATM / thẻ quốc tế)");
    }

    private void taoNeuThieu(String ma, String ten, String moTa) {
        if (hinhThucRepo.findByMaHinhThuc(ma).isEmpty()) {
            hinhThucRepo.save(HinhThucThanhToanEntity.builder()
                    .maHinhThuc(ma).tenHinhThuc(ten).moTa(moTa).trangThai(true).build());
            log.info("Đã nạp hình thức thanh toán: {} - {}", ma, ten);
        }
    }

    /** Spring Data đôi khi bọc cả dòng kết quả vào mảng 1 phần tử (Object[]{Object[2]})
     *  → gây ArrayIndexOutOfBounds khi truy cập cột thứ 2. Hàm này "xếp phẳng" lại. */
    private Object[] hang(Object[] r) {
        if (r != null && r.length == 1 && r[0] instanceof Object[] inner) return inner;
        return r == null ? new Object[0] : r;
    }

    private Map<String, Object> buildBill(HoaDonEntity hd, List<HoaDonChiTietEntity> ds) {
        List<Map<String, Object>> lines = new ArrayList<>();
        for (HoaDonChiTietEntity ct : ds) {
            SanPhamChiTietEntity bt = ct.getChiTietSanPham();
            Map<String, Object> l = new LinkedHashMap<>();
            l.put("tenSanPham", bt.getSanPham().getTenSanPham());
            l.put("mauSac", bt.getMauSac().getTenMau());
            l.put("kichThuoc", bt.getKichThuoc().getTenKichThuoc());
            l.put("soLuong", ct.getSoLuong());
            l.put("donGia", ct.getDonGia());
            l.put("thanhTien", ct.getThanhTien());
            lines.add(l);
        }
        Map<String, Object> bill = new LinkedHashMap<>();
        bill.put("id", hd.getId());
        bill.put("maHoaDon", hd.getMaHoaDon());
        bill.put("ngayTao", hd.getNgayTao() == null ? LocalDateTime.now().toString() : hd.getNgayTao().toString());
        bill.put("kenh", "Bán tại quầy (POS)");
        bill.put("nhanVienId", hd.getNhanVienId());
        bill.put("khachHangId", hd.getKhachHangId());
        bill.put("danhSach", lines);
        bill.put("tongTien", hd.getTongTien());
        bill.put("tienGiam", hd.getTienGiam());
        bill.put("thanhTien", hd.getThanhTien());
        return bill;
    }

    private BigDecimal phanTramTang(BigDecimal hienTai, BigDecimal truoc) {
        if (truoc.signum() == 0) return hienTai.signum() == 0 ? BigDecimal.ZERO : BigDecimal.valueOf(100);
        return hienTai.subtract(truoc).multiply(BigDecimal.valueOf(100))
                .divide(truoc, 1, RoundingMode.HALF_UP);
    }

    private BigDecimal doanhThuTB(Collection<BigDecimal> values) {
        if (values.isEmpty()) return BigDecimal.ZERO;
        BigDecimal tong = values.stream().reduce(BigDecimal.ZERO, BigDecimal::add);
        return tong.divide(BigDecimal.valueOf(values.size()), 0, RoundingMode.HALF_UP);
    }

    /** Hibernate 7 đôi khi trả char[] cho SUM/COALESCE trên SQL Server — quy đổi an toàn. */
    private BigDecimal asBigDecimal(Object o) {
        if (o == null) return BigDecimal.ZERO;
        if (o instanceof BigDecimal bd) return bd;
        if (o instanceof Number n) return BigDecimal.valueOf(n.doubleValue());
        if (o instanceof char[] c) o = new String(c);
        String s = o.toString().trim().replace(",", "");
        try {
            return s.isEmpty() ? BigDecimal.ZERO : new BigDecimal(s);
        } catch (NumberFormatException ex) {
            log.warn("Giá trị thống kê không đọc được, coi là 0: {} ({})", o, o.getClass().getSimpleName());
            return BigDecimal.ZERO;
        }
    }

    private long asLong(Object o) {
        if (o == null) return 0;
        if (o instanceof Number n) return n.longValue();
        if (o instanceof char[] c) o = new String(c);
        try {
            return Long.parseLong(o.toString().trim());
        } catch (NumberFormatException ex) {
            return 0;
        }
    }

    private LocalDate toLocalDate(Object o) {
        if (o == null) return null;
        if (o instanceof java.sql.Date d) return d.toLocalDate();
        if (o instanceof java.sql.Timestamp ts) return ts.toLocalDateTime().toLocalDate();
        if (o instanceof LocalDate ld) return ld;
        if (o instanceof java.time.LocalDateTime ldt) return ldt.toLocalDate();
        return null;
    }
}
