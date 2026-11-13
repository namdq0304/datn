package com.example.datn.controller;

import com.example.datn.dto.hoadon.*;
import com.example.datn.service.HoaDonService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/hoa-don")
@PreAuthorize("hasAnyRole('ADMIN','NHAN_VIEN')")
public class HoaDonController {
    private final HoaDonService service;
    public HoaDonController(HoaDonService service) { this.service=service; }

    @GetMapping
    public List<HoaDonResponse> danhSach() { return service.danhSach(); }

    @GetMapping("/{id}")
    public HoaDonResponse chiTiet(@PathVariable Long id) { return service.chiTiet(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HoaDonResponse taoHoaDon(@Valid @RequestBody TaoHoaDonRequest req, Authentication auth) {
        return service.taoHoaDon(req,auth.getName());
    }

    @PatchMapping("/{id}/trang-thai")
    public HoaDonResponse capNhatTrangThai(@PathVariable Long id,
        @Valid @RequestBody CapNhatTrangThaiRequest req, Authentication auth) {
        return service.capNhatTrangThai(id,req,auth.getName());
    }

    @PostMapping("/{id}/huy")
    public HoaDonResponse huyHoaDon(@PathVariable Long id, @RequestBody(required=false) Map<String,String> body,
        Authentication auth) {
        return service.huyHoaDon(id,auth.getName(),body==null?null:body.get("lyDo"));
    }

    @GetMapping("/hinh-thuc-thanh-toan")
    public List<Map<String,Object>> hinhThucThanhToan() { return service.danhSachHinhThuc(); }

    @PostMapping("/{id}/thanh-toan")
    @ResponseStatus(HttpStatus.CREATED)
    public ThanhToanResponse thanhToan(@PathVariable Long id,@Valid @RequestBody ThanhToanRequest req) {
        return service.thanhToan(id,req);
    }

    @GetMapping("/{id}/thanh-toan")
    public List<ThanhToanResponse> lichSuThanhToan(@PathVariable Long id) {
        return service.lichSuThanhToan(id);
    }
}
