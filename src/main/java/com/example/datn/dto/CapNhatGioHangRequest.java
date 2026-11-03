package com.example.datn.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record CapNhatGioHangRequest(@NotNull @Min(0) Integer soLuong) {}