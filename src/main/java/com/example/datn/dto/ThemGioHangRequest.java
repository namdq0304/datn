package com.example.datn.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record ThemGioHangRequest(
        @NotNull Integer chiTietSanPhamId,
        @NotNull @Min(1) Integer soLuong) {}