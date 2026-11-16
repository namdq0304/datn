package com.example.datn.dto.hoadon;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record ThanhToanRequest(
        @NotNull(message = "Vui lòng chọn hình thức thanh toán") Integer hinhThucThanhToanId,
        @NotNull @DecimalMin(value = "0.01", message = "Số tiền thanh toán phải lớn hơn 0") BigDecimal soTien,
        String maGiaoDich
) {}
