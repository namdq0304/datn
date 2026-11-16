package com.example.datn.dto.hoadon;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public record TaoHoaDonRequest(
        Long khachHangId,
        @NotEmpty(message = "Hóa đơn phải có ít nhất một sản phẩm") List<@Valid SanPhamTrongHoaDon> sanPham,
        @DecimalMin(value = "0.0", message = "Tiền giảm không hợp lệ") BigDecimal tienGiam
) {
    public record SanPhamTrongHoaDon(
            @NotNull(message = "Thiếu sản phẩm chi tiết") Long chiTietSanPhamId,
            @NotNull @Min(value = 1, message = "Số lượng phải lớn hơn 0") Integer soLuong
    ) {}
}
