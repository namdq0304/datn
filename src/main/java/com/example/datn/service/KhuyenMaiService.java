package com.example.datn.service;

import com.example.datn.dto.khuyenmai.KhuyenMaiRequest;
import com.example.datn.entity.KhuyenMaiEntity;
import com.example.datn.exception.BadRequestException;
import com.example.datn.exception.ConflictException;
import com.example.datn.exception.NotFoundException;
import com.example.datn.repository.KhuyenMaiRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Khuyến mãi: CRUD + tính tiền giảm + áp dụng vào hóa đơn.
 * Tiền giảm LUÔN được tính ở backend — FE chỉ gửi mã khuyến mãi.
 */
@Service
@RequiredArgsConstructor
public class KhuyenMaiService {

    private final KhuyenMaiRepository repo;

    // ─────────────────────────────────────────────── CRUD

    @Transactional(readOnly = true)
    public List<KhuyenMaiEntity> danhSach() {
        return repo.findAllByOrderByNgayTaoDesc();
    }

    @Transactional(readOnly = true)
    public KhuyenMaiEntity chiTiet(Integer id) {
        return repo.findById(id).orElseThrow(() -> new NotFoundException("Không tìm thấy khuyến mãi"));
    }

    @Transactional
    public KhuyenMaiEntity tao(KhuyenMaiRequest req) {
        String ma = chuanHoaMa(req.maKhuyenMai());
        if (repo.existsByMaKhuyenMai(ma)) throw new ConflictException("Mã khuyến mãi " + ma + " đã tồn tại");
        KhuyenMaiEntity km = new KhuyenMaiEntity();
        km.setSoLuongDaDung(0);
        ganDuLieu(km, req, ma);
        return repo.save(km);
    }

    @Transactional
    public KhuyenMaiEntity capNhat(Integer id, KhuyenMaiRequest req) {
        KhuyenMaiEntity km = chiTiet(id);
        String ma = chuanHoaMa(req.maKhuyenMai());
        if (repo.existsByMaKhuyenMaiAndIdNot(ma, id)) throw new ConflictException("Mã khuyến mãi " + ma + " đã tồn tại");
        if (req.soLuong() != null && req.soLuong() < km.getSoLuongDaDung())
            throw new BadRequestException("Số lượng không được nhỏ hơn số lượt đã dùng (" + km.getSoLuongDaDung() + ")");
        ganDuLieu(km, req, ma);
        return repo.save(km);
    }

    /** Bật / tắt (không xóa cứng vì hóa đơn cũ còn tham chiếu). */
    @Transactional
    public KhuyenMaiEntity doiTrangThai(Integer id) {
        KhuyenMaiEntity km = chiTiet(id);
        km.setTrangThai(!Boolean.TRUE.equals(km.getTrangThai()));
        return repo.save(km);
    }

    // ─────────────────────────────────────────────── Dùng ở POS

    /** Danh sách khuyến mãi đang hiệu lực, kèm tiền giảm dự kiến cho tổng tiền hiện tại. */
    @Transactional(readOnly = true)
    public List<Map<String, Object>> khaDung(BigDecimal tongTien) {
        BigDecimal tong = tongTien == null ? BigDecimal.ZERO : tongTien;
        return repo.findDangHieuLuc(LocalDateTime.now()).stream().map(km -> {
            Map<String, Object> m = toMap(km);
            boolean du = tong.compareTo(km.getDonToiThieu()) >= 0;
            m.put("duDieuKien", du);
            m.put("tienGiam", du ? tinhTienGiam(km, tong) : BigDecimal.ZERO);
            return m;
        }).toList();
    }

    /** Kiểm tra 1 mã với tổng tiền (không trừ lượt). */
    @Transactional(readOnly = true)
    public Map<String, Object> kiemTra(String ma, BigDecimal tongTien) {
        KhuyenMaiEntity km = repo.findByMaKhuyenMai(chuanHoaMa(ma))
                .orElseThrow(() -> new NotFoundException("Mã khuyến mãi không tồn tại"));
        kiemTraHopLe(km, tongTien);
        Map<String, Object> m = toMap(km);
        m.put("tienGiam", tinhTienGiam(km, tongTien));
        return m;
    }

    /**
     * Áp dụng mã cho hóa đơn đang tạo: khóa dòng, kiểm tra, tăng số lượt đã dùng.
     * Phải gọi bên trong transaction của việc tạo hóa đơn.
     */
    @Transactional
    public KhuyenMaiEntity apDung(String ma, BigDecimal tongTien) {
        KhuyenMaiEntity km = repo.findByMaForUpdate(chuanHoaMa(ma))
                .orElseThrow(() -> new NotFoundException("Mã khuyến mãi không tồn tại"));
        kiemTraHopLe(km, tongTien);
        km.setSoLuongDaDung(km.getSoLuongDaDung() + 1);
        return repo.save(km);
    }

    /** Hoàn lại 1 lượt khi hủy hóa đơn đã dùng khuyến mãi. */
    @Transactional
    public void hoanLuot(Integer khuyenMaiId) {
        if (khuyenMaiId == null) return;
        repo.findById(khuyenMaiId).ifPresent(km -> {
            km.setSoLuongDaDung(Math.max(0, km.getSoLuongDaDung() - 1));
            repo.save(km);
        });
    }

    /** Tiền giảm: % (làm tròn đồng, có trần) hoặc số tiền; không vượt tổng tiền. */
    public BigDecimal tinhTienGiam(KhuyenMaiEntity km, BigDecimal tongTien) {
        BigDecimal giam;
        if (km.getLoaiGiam() == KhuyenMaiEntity.LOAI_PHAN_TRAM) {
            giam = tongTien.multiply(km.getGiaTriGiam()).divide(BigDecimal.valueOf(100), 0, RoundingMode.DOWN);
            if (km.getGiamToiDa() != null && giam.compareTo(km.getGiamToiDa()) > 0) giam = km.getGiamToiDa();
        } else {
            giam = km.getGiaTriGiam();
        }
        return giam.min(tongTien).max(BigDecimal.ZERO);
    }

    // ─────────────────────────────────────────────── helpers

    private void kiemTraHopLe(KhuyenMaiEntity km, BigDecimal tongTien) {
        LocalDateTime now = LocalDateTime.now();
        if (!Boolean.TRUE.equals(km.getTrangThai())) throw new BadRequestException("Mã khuyến mãi đang bị tắt");
        if (now.isBefore(km.getNgayBatDau())) throw new BadRequestException("Mã khuyến mãi chưa đến thời gian áp dụng");
        if (now.isAfter(km.getNgayKetThuc())) throw new BadRequestException("Mã khuyến mãi đã hết hạn");
        if (km.getSoLuong() != null && km.getSoLuongDaDung() >= km.getSoLuong())
            throw new BadRequestException("Mã khuyến mãi đã hết lượt sử dụng");
        if (tongTien == null || tongTien.compareTo(km.getDonToiThieu()) < 0)
            throw new BadRequestException("Đơn hàng chưa đạt giá trị tối thiểu "
                    + km.getDonToiThieu().stripTrailingZeros().toPlainString() + "đ để dùng mã này");
    }

    private void ganDuLieu(KhuyenMaiEntity km, KhuyenMaiRequest req, String ma) {
        if (!req.ngayKetThuc().isAfter(req.ngayBatDau()))
            throw new BadRequestException("Ngày kết thúc phải sau ngày bắt đầu");
        boolean phanTram = req.loaiGiam() == KhuyenMaiEntity.LOAI_PHAN_TRAM;
        if (phanTram && req.giaTriGiam().compareTo(BigDecimal.valueOf(100)) > 0)
            throw new BadRequestException("Giảm theo % không được vượt quá 100");
        km.setMaKhuyenMai(ma);
        km.setTenKhuyenMai(req.tenKhuyenMai().trim());
        km.setMoTa(req.moTa());
        km.setLoaiGiam(req.loaiGiam());
        km.setGiaTriGiam(req.giaTriGiam());
        km.setGiamToiDa(phanTram ? req.giamToiDa() : null);
        km.setDonToiThieu(req.donToiThieu() == null ? BigDecimal.ZERO : req.donToiThieu());
        km.setSoLuong(req.soLuong());
        km.setNgayBatDau(req.ngayBatDau());
        km.setNgayKetThuc(req.ngayKetThuc());
        km.setTrangThai(req.trangThai() == null || req.trangThai());
    }

    private static String chuanHoaMa(String ma) {
        if (ma == null || ma.isBlank()) throw new BadRequestException("Vui lòng nhập mã khuyến mãi");
        return ma.trim().toUpperCase();
    }

    private Map<String, Object> toMap(KhuyenMaiEntity km) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", km.getId());
        m.put("maKhuyenMai", km.getMaKhuyenMai());
        m.put("tenKhuyenMai", km.getTenKhuyenMai());
        m.put("moTa", km.getMoTa());
        m.put("loaiGiam", km.getLoaiGiam());
        m.put("giaTriGiam", km.getGiaTriGiam());
        m.put("giamToiDa", km.getGiamToiDa());
        m.put("donToiThieu", km.getDonToiThieu());
        m.put("soLuong", km.getSoLuong());
        m.put("soLuongDaDung", km.getSoLuongDaDung());
        m.put("ngayKetThuc", km.getNgayKetThuc());
        return m;
    }
}
