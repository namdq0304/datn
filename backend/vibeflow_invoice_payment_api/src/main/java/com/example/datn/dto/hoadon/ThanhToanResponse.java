package com.example.datn.dto.hoadon;
import java.math.BigDecimal;
import java.time.LocalDateTime;
public record ThanhToanResponse(Long id, Long hoaDonId, String maHoaDon,
 Long hinhThucThanhToanId, String tenHinhThuc, BigDecimal soTien,
 LocalDateTime ngayThanhToan, String maGiaoDich, Integer trangThai) {}
