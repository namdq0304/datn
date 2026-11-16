package com.example.datn.service;

import com.example.datn.dto.hoadon.*;
import com.example.datn.entity.*;
import com.example.datn.exception.BadRequestException;
import com.example.datn.exception.NotFoundException;
import com.example.datn.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Quản lý hóa đơn & thanh toán — phục vụ tab "Quản lý hóa đơn" (HoaDonController, /api/hoa-don).
 *
 * Trạng thái dùng ở màn này:
 *   0 Chờ thanh toán, 1 Đã thanh toán, 2 Đang chuẩn bị,
 *   3 Đang giao, 4 Giao thất bại, 5 Hoàn thành, 6 Đã hủy
 */
@Service
@RequiredArgsConstructor
public class HoaDonService {

    public static final int CHO_THANH_TOAN = 0, DA_THANH_TOAN = 1, DANG_CHUAN_BI = 2,
            DANG_GIAO = 3, GIAO_THAT_BAI = 4, HOAN_THANH = 5, DA_HUY = 6;

    private final HoaDonRepository hoaDonRepo;
    private final HoaDonChiTietRepository chiTietRepo;
    private final ChiTietThanhToanRepository thanhToanRepo;
    private final HinhThucThanhToanRepository hinhThucRepo;
    private final LichSuHoaDonRepository lichSuRepo;
    private final SanPhamChiTietRepository sanPhamChiTietRepo;
    private final KhachHangRepository khachHangRepo;
    private final NhanVienRepository nhanVienRepo;
    private final MaHoaDonGenerator maHoaDonGenerator;
    private final KhuyenMaiService khuyenMaiService;

    // ─────────────────────────────────────────────── Tạo hóa đơn

    @Transactional
    public HoaDonResponse taoHoaDon(TaoHoaDonRequest req, String emailNhanVien) {
        NhanVienEntity nv = nhanVienRepo.findByEmail(emailNhanVien)
                .orElseThrow(() -> new AccessDeniedException("Tài khoản không phải nhân viên"));
        if (req.khachHangId() != null && !khachHangRepo.existsById(req.khachHangId()))
            throw new NotFoundException("Không tìm thấy khách hàng");

        // TreeMap: khóa biến thể theo thứ tự id tăng dần → tránh deadlock với giao dịch khác
        Map<Long, Integer> soLuongTheoId = new TreeMap<>();
        for (var item : req.sanPham()) soLuongTheoId.merge(item.chiTietSanPhamId(), item.soLuong(), Integer::sum);

        BigDecimal tong = BigDecimal.ZERO;
        List<SanPhamChiTietEntity> variants = new ArrayList<>();
        for (var e : soLuongTheoId.entrySet()) {
            SanPhamChiTietEntity spct = sanPhamChiTietRepo.findDangBanForUpdate(e.getKey())
                    .orElseThrow(() -> new NotFoundException("Không tìm thấy sản phẩm chi tiết ID " + e.getKey()));
            if (spct.getSoLuong() == null || spct.getSoLuong() < e.getValue())
                throw new BadRequestException("Sản phẩm " + spct.getMaChiTiet() + " không đủ tồn kho");
            tong = tong.add(giaBan(spct).multiply(BigDecimal.valueOf(e.getValue())));
            variants.add(spct);
        }
        BigDecimal giam = req.tienGiam() == null ? BigDecimal.ZERO : req.tienGiam();
        if (giam.compareTo(tong) > 0) throw new BadRequestException("Tiền giảm không được lớn hơn tổng tiền");

        HoaDonEntity hd = hoaDonRepo.save(HoaDonEntity.builder()
                .maHoaDon(maHoaDonGenerator.sinh(MaHoaDonGenerator.PREFIX_HOA_DON))
                .khachHangId(req.khachHangId())
                .nhanVienId(nv.getId())
                .tongTien(tong).tienGiam(giam).thanhTien(tong.subtract(giam))
                .trangThai(CHO_THANH_TOAN)
                .build());

        for (SanPhamChiTietEntity spct : variants) {
            int sl = soLuongTheoId.get(spct.getId());
            BigDecimal gia = giaBan(spct);
            chiTietRepo.save(HoaDonChiTietEntity.builder().hoaDon(hd).chiTietSanPham(spct)
                    .soLuong(sl).donGia(gia).thanhTien(gia.multiply(BigDecimal.valueOf(sl))).build());
            spct.setSoLuong(spct.getSoLuong() - sl);
            sanPhamChiTietRepo.save(spct);
        }
        ghiLichSu(hd, nv.getId(), null, CHO_THANH_TOAN, "Tạo hóa đơn");
        return toResponse(hd, null, null);
    }

    // ─────────────────────────────────────────────── Xem

    @Transactional(readOnly = true)
    public List<HoaDonResponse> danhSach() {
        List<HoaDonEntity> list = hoaDonRepo.findAllByOrderByNgayTaoDesc();
        // Nạp tên khách hàng / nhân viên 1 lần cho cả danh sách (tránh N+1)
        Map<Long, String> tenKh = khachHangRepo.findAllById(list.stream().map(HoaDonEntity::getKhachHangId)
                        .filter(Objects::nonNull).collect(Collectors.toSet())).stream()
                .collect(Collectors.toMap(KhachHangEntity::getId, k -> Objects.toString(k.getHoTen(), "")));
        Map<Long, String> tenNv = nhanVienRepo.findAllById(list.stream().map(HoaDonEntity::getNhanVienId)
                        .filter(Objects::nonNull).collect(Collectors.toSet())).stream()
                .collect(Collectors.toMap(NhanVienEntity::getId, n -> Objects.toString(n.getHoTen(), "")));
        return list.stream().map(hd -> toResponse(hd, tenKh, tenNv)).toList();
    }

    @Transactional(readOnly = true)
    public HoaDonResponse chiTiet(Integer id) {
        return toResponse(layHoaDon(id), null, null);
    }

    // ─────────────────────────────────────────────── Trạng thái / hủy

    @Transactional
    public HoaDonResponse capNhatTrangThai(Integer id, CapNhatTrangThaiRequest req, String email) {
        int moi = req.trangThai();
        if (moi < 0 || moi > 6) throw new BadRequestException("Trạng thái hóa đơn không hợp lệ");
        // Chuyển sang "Đã hủy" phải đi qua luồng hủy để hoàn kho
        if (moi == DA_HUY) return huyHoaDon(id, email, req.lyDo());

        HoaDonEntity hd = layHoaDon(id);
        int cu = trangThai(hd);
        if (cu == DA_HUY) throw new BadRequestException("Hóa đơn đã hủy");
        if (cu == CHO_THANH_TOAN && moi != CHO_THANH_TOAN)
            throw new BadRequestException("Hóa đơn chưa thanh toán");

        hd.setTrangThai(moi);
        hoaDonRepo.save(hd);
        ghiLichSu(hd, timNhanVienId(email), cu, moi, req.lyDo());
        return toResponse(hd, null, null);
    }

    @Transactional
    public HoaDonResponse huyHoaDon(Integer id, String email, String lyDo) {
        HoaDonEntity hd = layHoaDon(id);
        int cu = trangThai(hd);
        if (cu == DA_HUY) throw new BadRequestException("Hóa đơn đã được hủy");
        if (cu == HOAN_THANH) throw new BadRequestException("Không thể hủy hóa đơn đã hoàn thành");

        // Hoàn lại tồn kho (khóa dòng theo thứ tự id để không mất cập nhật khi POS đang bán cùng biến thể)
        List<HoaDonChiTietEntity> dsChiTiet = chiTietRepo.findByHoaDon_Id(id).stream()
                .filter(ct -> ct.getChiTietSanPham() != null)
                .sorted(Comparator.comparing(ct -> ct.getChiTietSanPham().getId()))
                .toList();
        for (HoaDonChiTietEntity ct : dsChiTiet) {
            SanPhamChiTietEntity spct = sanPhamChiTietRepo.findByIdForUpdate(ct.getChiTietSanPham().getId())
                    .orElse(null);
            if (spct == null) continue;
            spct.setSoLuong((spct.getSoLuong() == null ? 0 : spct.getSoLuong()) + ct.getSoLuong());
            sanPhamChiTietRepo.save(spct);
        }
        // Trả lại 1 lượt khuyến mãi đã dùng
        khuyenMaiService.hoanLuot(hd.getKhuyenMaiId());
        hd.setTrangThai(DA_HUY);
        hoaDonRepo.save(hd);
        ghiLichSu(hd, timNhanVienId(email), cu, DA_HUY, lyDo == null ? "Hủy hóa đơn" : lyDo);
        return toResponse(hd, null, null);
    }

    // ─────────────────────────────────────────────── Thanh toán

    @Transactional
    public ThanhToanResponse thanhToan(Integer hoaDonId, ThanhToanRequest req) {
        HoaDonEntity hd = layHoaDon(hoaDonId);
        int cu = trangThai(hd);
        if (cu == DA_HUY) throw new BadRequestException("Hóa đơn đã hủy");
        if (cu == HOAN_THANH) throw new BadRequestException("Hóa đơn đã hoàn thành");

        HinhThucThanhToanEntity hinhThuc = hinhThucRepo.findById(req.hinhThucThanhToanId())
                .filter(x -> !Boolean.FALSE.equals(x.getTrangThai()))
                .orElseThrow(() -> new NotFoundException("Hình thức thanh toán không tồn tại hoặc đã khóa"));
        if (VnPayThanhToanService.MA_HINH_THUC.equals(hinhThuc.getMaHinhThuc()))
            throw new BadRequestException("VNPay chỉ thanh toán qua cổng VNPay ở màn Bán hàng POS");

        BigDecimal thanhTien = nz(hd.getThanhTien());
        BigDecimal daTra = tongDaThanhToan(hoaDonId);
        BigDecimal conLai = thanhTien.subtract(daTra);
        if (req.soTien().compareTo(conLai) > 0)
            throw new BadRequestException("Số tiền thanh toán vượt quá số tiền còn phải trả: " + conLai);

        ChiTietThanhToanEntity tt = thanhToanRepo.save(ChiTietThanhToanEntity.builder()
                .hoaDon(hd).hinhThuc(hinhThuc).soTien(req.soTien())
                .maGiaoDich(req.maGiaoDich()).trangThai(1).build());

        if (daTra.add(req.soTien()).compareTo(thanhTien) >= 0 && cu == CHO_THANH_TOAN) {
            hd.setTrangThai(DA_THANH_TOAN);
            hoaDonRepo.save(hd);
            ghiLichSu(hd, hd.getNhanVienId(), cu, DA_THANH_TOAN, "Thanh toán đủ hóa đơn");
        }
        return toThanhToanResponse(tt);
    }

    @Transactional(readOnly = true)
    public List<ThanhToanResponse> lichSuThanhToan(Integer hoaDonId) {
        layHoaDon(hoaDonId);
        return thanhToanRepo.findByHoaDon_IdOrderByNgayThanhToanDesc(hoaDonId).stream()
                .map(this::toThanhToanResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> danhSachHinhThuc() {
        return hinhThucRepo.findByTrangThaiTrue().stream()
                .filter(x -> !VnPayThanhToanService.MA_HINH_THUC.equals(x.getMaHinhThuc())) // VNPay phải qua cổng
                .map(x -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", x.getId());
            m.put("maHinhThuc", x.getMaHinhThuc());
            m.put("tenHinhThuc", x.getTenHinhThuc());
            m.put("moTa", x.getMoTa());
            return m;
        }).toList();
    }

    // ─────────────────────────────────────────────── helpers

    private HoaDonEntity layHoaDon(Integer id) {
        return hoaDonRepo.findById(id).orElseThrow(() -> new NotFoundException("Không tìm thấy hóa đơn"));
    }

    private static int trangThai(HoaDonEntity hd) {
        return hd.getTrangThai() == null ? CHO_THANH_TOAN : hd.getTrangThai();
    }

    private static BigDecimal nz(BigDecimal v) {
        return v == null ? BigDecimal.ZERO : v;
    }

    private Long timNhanVienId(String email) {
        return email == null ? null : nhanVienRepo.findByEmail(email).map(NhanVienEntity::getId).orElse(null);
    }

    /** Giá bán lấy từ biến thể (CHI_TIET_SAN_PHAM.gia_ban) — không nhận giá từ FE. */
    private BigDecimal giaBan(SanPhamChiTietEntity x) {
        if (x.getGiaBan() != null) return x.getGiaBan();
        throw new BadRequestException("Sản phẩm " + x.getMaChiTiet() + " chưa được thiết lập giá bán");
    }

    private BigDecimal tongDaThanhToan(Integer hoaDonId) {
        return thanhToanRepo.findByHoaDon_Id(hoaDonId).stream()
                .filter(x -> Objects.equals(x.getTrangThai(), 1))
                .map(ChiTietThanhToanEntity::getSoTien).filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private void ghiLichSu(HoaDonEntity hd, Long nhanVienId, Integer cu, Integer moi, String lyDo) {
        lichSuRepo.save(LichSuHoaDonEntity.builder().hoaDon(hd).nhanVienId(nhanVienId)
                .trangThaiCu(cu).trangThaiMoi(moi).lyDo(lyDo).thoiGian(LocalDateTime.now()).build());
    }

    /** tenKh / tenNv: map tên nạp sẵn (danh sách); null → tự tra (chi tiết 1 hóa đơn). */
    private HoaDonResponse toResponse(HoaDonEntity hd, Map<Long, String> tenKh, Map<Long, String> tenNv) {
        List<HoaDonResponse.ChiTietResponse> ds = chiTietRepo.findByHoaDon_Id(hd.getId()).stream().map(ct -> {
            SanPhamChiTietEntity sp = ct.getChiTietSanPham();
            if (sp == null) return new HoaDonResponse.ChiTietResponse(ct.getId(), null, "", "", "", "",
                    ct.getSoLuong(), ct.getDonGia(), ct.getThanhTien());
            return new HoaDonResponse.ChiTietResponse(ct.getId(), sp.getId(), sp.getMaChiTiet(),
                    sp.getSanPham() == null ? "" : sp.getSanPham().getTenSanPham(),
                    sp.getMauSac() == null ? "" : sp.getMauSac().getTenMau(),
                    sp.getKichThuoc() == null ? "" : sp.getKichThuoc().getTenKichThuoc(),
                    ct.getSoLuong(), ct.getDonGia(), ct.getThanhTien());
        }).toList();

        Long khId = hd.getKhachHangId();
        String tenKhachHang = khId == null ? "Khách vãng lai"
                : ten(tenKh, khId, id -> khachHangRepo.findById(id).map(KhachHangEntity::getHoTen).orElse(""));
        Long nvId = hd.getNhanVienId();
        String tenNhanVien = nvId == null ? ""
                : ten(tenNv, nvId, id -> nhanVienRepo.findById(id).map(NhanVienEntity::getHoTen).orElse(""));

        BigDecimal thanhTien = nz(hd.getThanhTien());
        BigDecimal daTra = tongDaThanhToan(hd.getId());
        BigDecimal conLai = thanhTien.subtract(daTra).max(BigDecimal.ZERO);
        return new HoaDonResponse(hd.getId(), hd.getMaHoaDon(), khId, tenKhachHang, nvId, tenNhanVien,
                hd.getNgayTao(), hd.getTongTien(), hd.getTienGiam(), thanhTien, daTra, conLai,
                hd.getTrangThai(), ds);
    }

    private static String ten(Map<Long, String> cache, Long id, Function<Long, String> tra) {
        return cache != null ? cache.getOrDefault(id, "") : tra.apply(id);
    }

    private ThanhToanResponse toThanhToanResponse(ChiTietThanhToanEntity x) {
        HinhThucThanhToanEntity ht = x.getHinhThuc();
        return new ThanhToanResponse(x.getId(), x.getHoaDon().getId(), x.getHoaDon().getMaHoaDon(),
                ht == null ? null : ht.getId(), ht == null ? "" : ht.getTenHinhThuc(),
                x.getSoTien(), x.getNgayThanhToan(), x.getMaGiaoDich(), x.getTrangThai());
    }
}
