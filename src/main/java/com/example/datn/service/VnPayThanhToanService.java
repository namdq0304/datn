package com.example.datn.service;

import com.example.datn.dto.banhang.ThanhToanPosRequest;
import com.example.datn.entity.ChiTietThanhToanEntity;
import com.example.datn.entity.HoaDonEntity;
import com.example.datn.entity.LichSuHoaDonEntity;
import com.example.datn.exception.BadRequestException;
import com.example.datn.exception.NotFoundException;
import com.example.datn.repository.ChiTietThanhToanRepository;
import com.example.datn.repository.HoaDonRepository;
import com.example.datn.repository.LichSuHoaDonRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Nghiệp vụ thanh toán VNPay tại quầy POS.
 *
 * Trạng thái:
 *   HOA_DON.trang_thai             0 = chờ thanh toán → 3 = POS hoàn thành | 6 = đã hủy (hoàn kho)
 *   CHI_TIET_THANH_TOAN.trang_thai 0 = đang chờ VNPay → 1 = thành công   | 2 = thất bại / hủy
 *
 * Kết quả từ VNPay đến qua 2 đường: Return URL (trình duyệt) và IPN (server-to-server, cần URL public).
 * Cả hai cùng gọi xuLyKetQua(); khóa dòng hóa đơn + kiểm tra trạng thái nên xử lý đúng 1 lần.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class VnPayThanhToanService {

    public static final String MA_HINH_THUC = "VNPAY";
    /** VNPay không nhận giao dịch dưới 5.000đ. */
    public static final BigDecimal SO_TIEN_TOI_THIEU = BigDecimal.valueOf(5000);

    private static final int TT_CHO = 0, TT_THANH_CONG = 1, TT_THAT_BAI = 2;
    private static final int HD_CHO_THANH_TOAN = 0, HD_POS_HOAN_THANH = 3, HD_DA_HUY = 6;

    private final VnPayService vnPayService;
    private final BanHangService banHangService;
    private final HoaDonService hoaDonService;
    private final HoaDonRepository hoaDonRepo;
    private final ChiTietThanhToanRepository thanhToanRepo;
    private final LichSuHoaDonRepository lichSuRepo;

    /** Kết quả xử lý dữ liệu VNPay gửi về; rspCode/message dùng trả lời IPN đúng chuẩn VNPay. */
    public record KetQua(String rspCode, String message, boolean thanhCong, String maHoaDon) {}

    // ─────────────────────────────────────────────── Tạo giao dịch

    /** Lập hóa đơn chờ thanh toán + tạo link VNPay. Lỗi tạo link → rollback, không giữ hàng. */
    @Transactional
    public Map<String, Object> taoThanhToan(ThanhToanPosRequest req, Long nhanVienId, String ipKhach) {
        vnPayService.kiemTraCauHinh(); // báo lỗi sớm, trước khi trừ kho
        Map<String, Object> bill = banHangService.lapHoaDonVnPay(req, nhanVienId);
        String maHoaDon = (String) bill.get("maHoaDon");
        BigDecimal thanhTien = (BigDecimal) bill.get("thanhTien");

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("hoaDonId", bill.get("id"));
        res.put("maHoaDon", maHoaDon);
        res.put("thanhTien", thanhTien);
        res.put("paymentUrl", vnPayService.taoUrlThanhToan(maHoaDon, thanhTien, ipKhach));
        res.put("hetHanPhut", vnPayService.getHetHanPhut());
        return res;
    }

    // ─────────────────────────────────────────────── Nhận kết quả (Return URL + IPN)

    @Transactional
    public KetQua xuLyKetQua(Map<String, String> p) {
        if (!vnPayService.chuKyHopLe(p)) {
            log.warn("VNPay: sai chữ ký, TxnRef={}", p.get("vnp_TxnRef"));
            return new KetQua("97", "Invalid Checksum", false, p.get("vnp_TxnRef"));
        }
        String maHoaDon = p.get("vnp_TxnRef");
        HoaDonEntity hd = maHoaDon == null ? null : hoaDonRepo.findByMaHoaDonForUpdate(maHoaDon).orElse(null);
        if (hd == null) return new KetQua("01", "Order not found", false, maHoaDon);

        ChiTietThanhToanEntity tt = thanhToanRepo
                .findFirstByHoaDon_IdAndHinhThuc_MaHinhThucOrderByIdDesc(hd.getId(), MA_HINH_THUC).orElse(null);
        if (tt == null) return new KetQua("01", "Order not found", false, maHoaDon);

        long soTienCanThu = hd.getThanhTien().longValue() * 100;
        if (!String.valueOf(soTienCanThu).equals(p.get("vnp_Amount"))) {
            log.warn("VNPay: sai số tiền, hóa đơn {} cần {} nhận {}", maHoaDon, soTienCanThu, p.get("vnp_Amount"));
            return new KetQua("04", "Invalid amount", false, maHoaDon);
        }

        boolean thanhCong = "00".equals(p.get("vnp_ResponseCode")) && "00".equals(p.get("vnp_TransactionStatus"));

        if (tt.getTrangThai() == null || tt.getTrangThai() != TT_CHO) {
            // Đã xử lý trước đó (Return và IPN cùng về) — không làm lại
            if (thanhCong && tt.getTrangThai() != null && tt.getTrangThai() == TT_THAT_BAI) {
                log.error("VNPay: hóa đơn {} ĐÃ HỦY nhưng khách thanh toán thành công (mã GD {}) — cần hoàn tiền cho khách!",
                        maHoaDon, p.get("vnp_TransactionNo"));
            }
            return new KetQua("02", "Order already confirmed",
                    tt.getTrangThai() != null && tt.getTrangThai() == TT_THANH_CONG, maHoaDon);
        }

        if (hd.getTrangThai() != null && hd.getTrangThai() == HD_DA_HUY) {
            // Hóa đơn đã bị hủy ở nơi khác (vd màn Quản lý hóa đơn) trong lúc chờ → không khôi phục
            tt.setTrangThai(TT_THAT_BAI);
            thanhToanRepo.save(tt);
            if (thanhCong) {
                log.error("VNPay: hóa đơn {} ĐÃ HỦY nhưng khách thanh toán thành công (mã GD {}) — cần hoàn tiền cho khách!",
                        maHoaDon, p.get("vnp_TransactionNo"));
            }
            return new KetQua("02", "Order already confirmed", false, maHoaDon);
        }

        if (thanhCong) {
            tt.setTrangThai(TT_THANH_CONG);
            tt.setMaGiaoDich(p.get("vnp_TransactionNo"));
            thanhToanRepo.save(tt);
            hd.setTrangThai(HD_POS_HOAN_THANH);
            hoaDonRepo.save(hd);
            ghiLichSu(hd, HD_CHO_THANH_TOAN, HD_POS_HOAN_THANH,
                    "VNPay thành công - mã GD " + p.get("vnp_TransactionNo") + " (" + p.get("vnp_BankCode") + ")");
        } else {
            tt.setTrangThai(TT_THAT_BAI);
            thanhToanRepo.save(tt);
            // Hủy hóa đơn: hoàn kho + hoàn lượt khuyến mãi + ghi lịch sử
            hoaDonService.huyHoaDon(hd.getId(), null, "VNPay không thành công - mã lỗi " + p.get("vnp_ResponseCode"));
        }
        return new KetQua("00", "Confirm Success", thanhCong, maHoaDon);
    }

    // ─────────────────────────────────────────────── POS hỏi trạng thái / hủy

    /** { trangThai: CHO | THANH_CONG | THAT_BAI, bill (khi thành công) } */
    @Transactional(readOnly = true)
    public Map<String, Object> trangThai(Integer hoaDonId) {
        ChiTietThanhToanEntity tt = thanhToanRepo
                .findFirstByHoaDon_IdAndHinhThuc_MaHinhThucOrderByIdDesc(hoaDonId, MA_HINH_THUC)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy giao dịch VNPay của hóa đơn"));
        Map<String, Object> res = new LinkedHashMap<>();
        int t = tt.getTrangThai() == null ? TT_CHO : tt.getTrangThai();
        res.put("trangThai", t == TT_THANH_CONG ? "THANH_CONG" : t == TT_THAT_BAI ? "THAT_BAI" : "CHO");
        if (t == TT_THANH_CONG) res.put("bill", banHangService.layBill(hoaDonId));
        return res;
    }

    /** Thu ngân hủy giao dịch đang chờ (khách đổi ý / đổi phương thức) → hoàn kho. */
    @Transactional
    public void huy(Integer hoaDonId, String email, String lyDo) {
        HoaDonEntity hd = hoaDonRepo.findByIdForUpdate(hoaDonId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy hóa đơn"));
        ChiTietThanhToanEntity tt = thanhToanRepo
                .findFirstByHoaDon_IdAndHinhThuc_MaHinhThucOrderByIdDesc(hoaDonId, MA_HINH_THUC)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy giao dịch VNPay của hóa đơn"));
        if (tt.getTrangThai() == null || tt.getTrangThai() != TT_CHO) {
            throw new BadRequestException(tt.getTrangThai() != null && tt.getTrangThai() == TT_THANH_CONG
                    ? "Khách đã thanh toán thành công — không thể hủy!" : "Giao dịch đã được hủy trước đó");
        }
        tt.setTrangThai(TT_THAT_BAI);
        thanhToanRepo.save(tt);
        if (hd.getTrangThai() == null || hd.getTrangThai() != HD_DA_HUY) {
            hoaDonService.huyHoaDon(hoaDonId, email, lyDo);
        }
    }

    // ─────────────────────────────────────────────── Dọn giao dịch bỏ dở (gọi từ VnPayDonDepJob)

    /** Id hóa đơn có giao dịch VNPay còn chờ quá (hạn link + 5 phút). */
    @Transactional(readOnly = true)
    public java.util.List<Integer> hoaDonChoQuaHan() {
        LocalDateTime moc = LocalDateTime.now().minusMinutes(vnPayService.getHetHanPhut() + 5L);
        return thanhToanRepo.findByHinhThuc_MaHinhThucAndTrangThaiAndNgayThanhToanBefore(MA_HINH_THUC, TT_CHO, moc)
                .stream().map(tt -> tt.getHoaDon().getId()).distinct().toList();
    }

    private void ghiLichSu(HoaDonEntity hd, Integer cu, Integer moi, String lyDo) {
        lichSuRepo.save(LichSuHoaDonEntity.builder().hoaDon(hd).nhanVienId(hd.getNhanVienId())
                .trangThaiCu(cu).trangThaiMoi(moi).lyDo(lyDo).thoiGian(LocalDateTime.now()).build());
    }
}
