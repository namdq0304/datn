package com.example.datn.controller;

import com.example.datn.dto.*;
import com.example.datn.repository.GioHangRepository.GioHangView;
import com.example.datn.service.GioHangService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/gio-hang")
@RequiredArgsConstructor
public class GioHangController {

    private final GioHangService service;

    @GetMapping
    public ResponseEntity<List<GioHangView>> xem() {
        return ResponseEntity.ok(service.xemGioHang());
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> count() {
        return ResponseEntity.ok(Map.of("count", service.demSoDong()));
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> them(@Valid @RequestBody ThemGioHangRequest req) {
        service.them(req);
        return ResponseEntity.ok(Map.of("message", "Đã thêm vào giỏ hàng"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, String>> capNhat(@PathVariable Long id,
                                                       @Valid @RequestBody CapNhatGioHangRequest req) {
        service.capNhatSoLuong(id, req);
        return ResponseEntity.ok(Map.of("message", "Đã cập nhật giỏ hàng"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> xoa(@PathVariable Long id) {
        service.xoa(id);
        return ResponseEntity.ok(Map.of("message", "Đã xóa khỏi giỏ hàng"));
    }

    @DeleteMapping
    public ResponseEntity<Map<String, String>> xoaTatCa() {
        service.xoaTatCa();
        return ResponseEntity.ok(Map.of("message", "Đã xóa toàn bộ giỏ hàng"));
    }
}