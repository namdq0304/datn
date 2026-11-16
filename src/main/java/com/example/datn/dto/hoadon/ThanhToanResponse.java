package com.example.datn.dto.hoadon;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ThanhToanResponse(
        Integer id, Integer hoaDonId, String maHoaDon,
        Integer hinhThucThanhToanId, String tenHinhThuc, BigDecimal soTien,
        LocalDateTime ngayThanhToan, String maGiaoDich, Integer trangThai
) {}
