package com.example.datn.dto.hoadon;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.List;
public record TaoHoaDonRequest(
 Long khachHangId,
 @NotEmpty(message="Hóa đơn phải có ít nhất một sản phẩm") List<@Valid SanPhamTrongHoaDon> sanPham,
 @DecimalMin(value="0.0",message="Tiền giảm không hợp lệ") BigDecimal tienGiam
) {
 public record SanPhamTrongHoaDon(
  @NotNull Long chiTietSanPhamId,
  @NotNull @Min(1) Integer soLuong
 ) {}
}
