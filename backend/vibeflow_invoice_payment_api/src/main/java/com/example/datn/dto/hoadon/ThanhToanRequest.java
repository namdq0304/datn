package com.example.datn.dto.hoadon;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
public record ThanhToanRequest(
 @NotNull Long hinhThucThanhToanId,
 @NotNull @DecimalMin(value="0.01",message="Số tiền thanh toán phải lớn hơn 0") BigDecimal soTien,
 String maGiaoDich
) {}
