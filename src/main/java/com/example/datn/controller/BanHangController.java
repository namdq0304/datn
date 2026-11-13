package com.example.datn.controller;

import com.example.datn.entity.NhanVienEntity;
import com.example.datn.repository.NhanVienRepository;
import com.example.datn.service.BanHangService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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

    // ─────────────────────────────────────────────── POS

    @GetMapping("/san-pham")
    public ResponseEntity<Map<String, Object>> sanPham(
            @RequestParam(defaultValue = "") String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size) {
        return ResponseEntity.ok(banHangService.sanPhamBanHang(q, page, size));
    }

    @GetMapping("/san-pham/{sanPhamId}/bien-the")
    public ResponseEntity<List<Map<String, Object>>> bienThe(@PathVariable Long sanPhamId) {
        return ResponseEntity.ok(banHangService.bienTheBanHang(sanPhamId));
    }

    /**
     * Thanh toán POS.
     * body: { items:[{chiTietId,soLuong}], phuongThuc:"TIEN_MAT"|"CHUYEN_KHOAN",
     *         tienGiam, khachHangId, tienKhachDua, maGiaoDich }
     */
    @PostMapping("/thanh-toan")
    public ResponseEntity<Map<String, Object>> thanhToan(
            @RequestBody Map<String, Object> body,
            Authentication auth) {
        Long nhanVienId = timNhanVienId(auth);
        return ResponseEntity.ok(banHangService.thanhToan(body, nhanVienId));
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
