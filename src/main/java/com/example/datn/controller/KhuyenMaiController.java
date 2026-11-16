package com.example.datn.controller;

import com.example.datn.dto.khuyenmai.KhuyenMaiRequest;
import com.example.datn.entity.KhuyenMaiEntity;
import com.example.datn.service.KhuyenMaiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * Khuyến mãi / voucher.
 *
 * GET   /api/khuyen-mai                         → danh sách (ADMIN)
 * GET   /api/khuyen-mai/{id}                    → chi tiết (ADMIN)
 * POST  /api/khuyen-mai                         → tạo (ADMIN)
 * PUT   /api/khuyen-mai/{id}                    → cập nhật (ADMIN)
 * PATCH /api/khuyen-mai/{id}/trang-thai         → bật / tắt (ADMIN)
 * GET   /api/khuyen-mai/kha-dung?tongTien=      → mã đang hiệu lực + tiền giảm dự kiến (POS)
 * GET   /api/khuyen-mai/kiem-tra?ma=&tongTien=  → kiểm tra 1 mã (POS)
 */
@RestController
@RequestMapping("/khuyen-mai")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'NHAN_VIEN')")
public class KhuyenMaiController {

    private final KhuyenMaiService service;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<KhuyenMaiEntity> danhSach() {
        return service.danhSach();
    }

    @GetMapping("/kha-dung")
    public List<Map<String, Object>> khaDung(@RequestParam(defaultValue = "0") BigDecimal tongTien) {
        return service.khaDung(tongTien);
    }

    @GetMapping("/kiem-tra")
    public Map<String, Object> kiemTra(@RequestParam String ma, @RequestParam BigDecimal tongTien) {
        return service.kiemTra(ma, tongTien);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public KhuyenMaiEntity chiTiet(@PathVariable Integer id) {
        return service.chiTiet(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public KhuyenMaiEntity tao(@Valid @RequestBody KhuyenMaiRequest req) {
        return service.tao(req);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public KhuyenMaiEntity capNhat(@PathVariable Integer id, @Valid @RequestBody KhuyenMaiRequest req) {
        return service.capNhat(id, req);
    }

    @PatchMapping("/{id}/trang-thai")
    @PreAuthorize("hasRole('ADMIN')")
    public KhuyenMaiEntity doiTrangThai(@PathVariable Integer id) {
        return service.doiTrangThai(id);
    }
}
