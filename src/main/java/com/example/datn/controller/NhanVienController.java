package com.example.datn.controller;

import com.example.datn.dto.common.PageResponse;
import com.example.datn.dto.common.TrangThaiRequest;
import com.example.datn.dto.nhanvien.NhanVienRequest;
import com.example.datn.dto.nhanvien.NhanVienResponse;
import com.example.datn.dto.nhanvien.NhanVienThongKe;
import com.example.datn.dto.nhanvien.VaiTroResponse;
import com.example.datn.service.NhanVienService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * Quản lý nhân viên — FE route /admin/nhan-vien (SCR-ADM-NV-01). CHỈ ADMIN (ADR-003).
 * URL thực tế: /api/admin/nhan-vien và /api/admin/vai-tro (context-path /api).
 */
@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class NhanVienController {

    @Autowired
    private NhanVienService nhanVienService;

    @GetMapping("/nhan-vien")
    public PageResponse<NhanVienResponse> search(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Long vaiTroId,
            @RequestParam(required = false) Boolean trangThai,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return nhanVienService.search(q, vaiTroId, trangThai, page, size);
    }

    @GetMapping("/nhan-vien/thong-ke")
    public NhanVienThongKe thongKe() {
        return nhanVienService.thongKe();
    }

    @GetMapping("/nhan-vien/{id}")
    public NhanVienResponse getById(@PathVariable Long id) {
        return nhanVienService.getById(id);
    }

    @PostMapping("/nhan-vien")
    @ResponseStatus(HttpStatus.CREATED)
    public NhanVienResponse create(@Valid @RequestBody NhanVienRequest req) {
        return nhanVienService.create(req);
    }

    @PutMapping("/nhan-vien/{id}")
    public NhanVienResponse update(@PathVariable Long id, @Valid @RequestBody NhanVienRequest req,
                                   Authentication authentication) {
        return nhanVienService.update(id, req, authentication.getName());
    }

    @PatchMapping("/nhan-vien/{id}/trang-thai")
    public NhanVienResponse updateTrangThai(@PathVariable Long id, @Valid @RequestBody TrangThaiRequest req,
                                            Authentication authentication) {
        return nhanVienService.updateTrangThai(id, req.trangThai(), authentication.getName());
    }

    @PostMapping("/nhan-vien/{id}/reset-mat-khau")
    public Map<String, Object> resetMatKhau(@PathVariable Long id, Authentication authentication) {
        nhanVienService.resetMatKhau(id, authentication.getName());
        return Collections.singletonMap("message", "Đã đặt lại mật khẩu");
    }

    @GetMapping("/vai-tro")
    public List<VaiTroResponse> vaiTro() {
        return nhanVienService.vaiTroNhanVien();
    }
}
