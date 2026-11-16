package com.example.datn.controller;

import com.example.datn.dto.hoadon.*;
import com.example.datn.service.HoaDonService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Quản lý hóa đơn & thanh toán — tab "Quản lý hóa đơn" (InvoicePaymentTab).
 *
 * GET   /api/hoa-don                      → danh sách hóa đơn
 * GET   /api/hoa-don/{id}                 → chi tiết hóa đơn
 * POST  /api/hoa-don                      → tạo hóa đơn (chờ thanh toán) + trừ kho
 * PATCH /api/hoa-don/{id}/trang-thai      → cập nhật trạng thái
 * POST  /api/hoa-don/{id}/huy             → hủy hóa đơn, hoàn kho
 * GET   /api/hoa-don/hinh-thuc-thanh-toan → hình thức thanh toán
 * POST  /api/hoa-don/{id}/thanh-toan      → ghi nhận thanh toán
 * GET   /api/hoa-don/{id}/thanh-toan      → lịch sử thanh toán
 */
@RestController
@RequestMapping("/hoa-don")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'NHAN_VIEN')")
public class HoaDonController {

    private final HoaDonService service;

    @GetMapping
    public List<HoaDonResponse> danhSach() {
        return service.danhSach();
    }

    @GetMapping("/hinh-thuc-thanh-toan")
    public List<Map<String, Object>> hinhThucThanhToan() {
        return service.danhSachHinhThuc();
    }

    @GetMapping("/{id}")
    public HoaDonResponse chiTiet(@PathVariable Integer id) {
        return service.chiTiet(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HoaDonResponse taoHoaDon(@Valid @RequestBody TaoHoaDonRequest req, Authentication auth) {
        return service.taoHoaDon(req, auth.getName());
    }

    @PatchMapping("/{id}/trang-thai")
    public HoaDonResponse capNhatTrangThai(@PathVariable Integer id,
                                           @Valid @RequestBody CapNhatTrangThaiRequest req,
                                           Authentication auth) {
        return service.capNhatTrangThai(id, req, auth.getName());
    }

    @PostMapping("/{id}/huy")
    public HoaDonResponse huyHoaDon(@PathVariable Integer id,
                                    @RequestBody(required = false) Map<String, String> body,
                                    Authentication auth) {
        return service.huyHoaDon(id, auth.getName(), body == null ? null : body.get("lyDo"));
    }

    @PostMapping("/{id}/thanh-toan")
    @ResponseStatus(HttpStatus.CREATED)
    public ThanhToanResponse thanhToan(@PathVariable Integer id, @Valid @RequestBody ThanhToanRequest req) {
        return service.thanhToan(id, req);
    }

    @GetMapping("/{id}/thanh-toan")
    public List<ThanhToanResponse> lichSuThanhToan(@PathVariable Integer id) {
        return service.lichSuThanhToan(id);
    }
}
