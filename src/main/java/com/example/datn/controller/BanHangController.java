package com.example.datn.controller;

import com.example.datn.dto.banhang.ThanhToanPosRequest;
import com.example.datn.entity.NhanVienEntity;
import com.example.datn.repository.NhanVienRepository;
import com.example.datn.service.BanHangService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * Bán Hàng POS + Thống Kê — khớp tab "Bán Hàng POS (F2)" và "Dashboard / Thống Kê".
 *
 * GET  /api/ban-hang/san-pham          → lưới sản phẩm (giá/tồn/ảnh) cho POS
 * GET  /api/ban-hang/san-pham/{id}/bien-the → biến thể màu/size/tồn/giá
 * POST /api/ban-hang/thanh-toan        → lưu hóa đơn + thanh toán + trừ kho, trả bill
 * GET  /api/ban-hang/hoa-don           → danh sách hóa đơn (tab Quản Lý Hóa Đơn)
 * GET  /api/ban-hang/hoa-don/{id}/bill → in lại bill
 * GET  /api/ban-hang/thong-ke          → dashboard thống kê (ADMIN)
 *
 * ADMIN + NHAN_VIEN đều bán được (POS là màn chính của cả 2 vai trò).
 */
@RestController
@RequestMapping("/ban-hang")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'NHAN_VIEN')")
public class BanHangController {

    private final BanHangService banHangService;
    private final NhanVienRepository nhanVienRepository;
    private final com.example.datn.service.VnPayThanhToanService vnPayThanhToanService;

    // ─────────────────────────────────────────────── POS

    /**
     * Lưới sản phẩm POS.
     * q: tên / mã SP / mã chi tiết (quét mã vạch); danhMucId, thuongHieuId: lọc; conHang=true: ẩn SP hết hàng.
     */
    @GetMapping("/san-pham")
    public ResponseEntity<Map<String, Object>> sanPham(
            @RequestParam(defaultValue = "") String q,
            @RequestParam(required = false) Integer danhMucId,
            @RequestParam(required = false) Integer thuongHieuId,
            @RequestParam(defaultValue = "false") boolean conHang,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(banHangService.sanPhamBanHang(q, danhMucId, thuongHieuId, conHang, page, size));
    }

    @GetMapping("/san-pham/{sanPhamId}/bien-the")
    public ResponseEntity<List<Map<String, Object>>> bienThe(@PathVariable Long sanPhamId) {
        return ResponseEntity.ok(banHangService.bienTheBanHang(sanPhamId));
    }

    /**
     * Thanh toán POS.
     * body: { items:[{chiTietId,soLuong}], phuongThuc:"TIEN_MAT"|"CHUYEN_KHOAN",
     *         maKhuyenMai, khachHangId, tienKhachDua, maGiaoDich }
     * (Tiền giảm do backend tính từ maKhuyenMai — không nhận tienGiam từ FE.)
     */
    @PostMapping("/thanh-toan")
    public ResponseEntity<Map<String, Object>> thanhToan(
            @Valid @RequestBody ThanhToanPosRequest body,
            Authentication auth) {
        Long nhanVienId = timNhanVienId(auth);
        return ResponseEntity.ok(banHangService.thanhToan(body, nhanVienId));
    }

    // ─────────────────────────────────────────────── VNPay

    /**
     * Tạo giao dịch VNPay: lập hóa đơn chờ thanh toán (giữ hàng) + trả link cổng VNPay.
     * body giống /thanh-toan (items, maKhuyenMai, khachHangId) → { hoaDonId, maHoaDon, thanhTien, paymentUrl }
     */
    @PostMapping("/vnpay/tao-thanh-toan")
    public ResponseEntity<Map<String, Object>> taoThanhToanVnPay(
            @Valid @RequestBody ThanhToanPosRequest body,
            Authentication auth,
            jakarta.servlet.http.HttpServletRequest request) {
        return ResponseEntity.ok(vnPayThanhToanService.taoThanhToan(body, timNhanVienId(auth), layIp(request)));
    }

    /** POS hỏi định kỳ: { trangThai: CHO | THANH_CONG | THAT_BAI, bill } */
    @GetMapping("/vnpay/{hoaDonId}/trang-thai")
    public ResponseEntity<Map<String, Object>> trangThaiVnPay(@PathVariable Integer hoaDonId) {
        return ResponseEntity.ok(vnPayThanhToanService.trangThai(hoaDonId));
    }

    /** Thu ngân hủy giao dịch VNPay đang chờ → hoàn kho. */
    @PostMapping("/vnpay/{hoaDonId}/huy")
    public ResponseEntity<Map<String, Object>> huyVnPay(@PathVariable Integer hoaDonId, Authentication auth) {
        vnPayThanhToanService.huy(hoaDonId, auth == null ? null : auth.getName(), "Thu ngân hủy giao dịch VNPay");
        return ResponseEntity.ok(Map.of("success", true, "message", "Đã hủy giao dịch VNPay, hàng đã hoàn kho"));
    }

    private static String layIp(jakarta.servlet.http.HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        ip = ip == null || ip.isBlank() ? request.getRemoteAddr() : ip.split(",")[0].trim();
        return ip == null || ip.contains(":") ? "127.0.0.1" : ip; // IPv6 (vd ::1 khi chạy local) → 127.0.0.1
    }

    /**
     * Tạo mã QR chuyển khoản (VietQR Quick Link).
     * body: { soTien } → { qrUrl, maThamChieu, soTien, bankBin, soTaiKhoan, tenTaiKhoan }
     * maThamChieu là nội dung CK — gửi lại làm maGiaoDich khi thanh toán.
     */
    @PostMapping("/vietqr")
    public ResponseEntity<Map<String, Object>> taoMaQr(@RequestBody Map<String, Object> body) {
        Object v = body == null ? null : body.get("soTien");
        BigDecimal soTien;
        try {
            soTien = v == null ? null : new BigDecimal(v.toString());
        } catch (NumberFormatException e) {
            throw new com.example.datn.exception.BadRequestException("Số tiền không hợp lệ");
        }
        return ResponseEntity.ok(banHangService.taoMaQr(soTien));
    }

    @GetMapping("/hoa-don")
    public ResponseEntity<List<Map<String, Object>>> danhSachHoaDon() {
        return ResponseEntity.ok(banHangService.danhSachHoaDon());
    }

    @GetMapping("/hoa-don/{id}/bill")
    public ResponseEntity<Map<String, Object>> layBill(@PathVariable Integer id) {
        return ResponseEntity.ok(banHangService.layBill(id));
    }

    // ─────────────────────────────────────────────── Thống kê (ADMIN)

    @GetMapping("/thong-ke")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> thongKe(
            @RequestParam(defaultValue = "7days") String period) {
        return ResponseEntity.ok(banHangService.thongKe(period));
    }

    // ─────────────────────────────────────────────── helpers

    /** id nhân viên đang đăng nhập (thu ngân) — hóa đơn luôn ghi đúng người bán. */
    private Long timNhanVienId(Authentication auth) {
        if (auth == null || auth.getName() == null) return null;
        return nhanVienRepository.findByEmail(auth.getName())
                .map(NhanVienEntity::getId)
                .orElse(null);
    }
}
