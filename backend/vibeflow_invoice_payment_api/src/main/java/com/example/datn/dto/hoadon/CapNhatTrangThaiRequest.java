package com.example.datn.dto.hoadon;
import jakarta.validation.constraints.NotNull;
public record CapNhatTrangThaiRequest(@NotNull Integer trangThai, String lyDo) {}
