package com.example.datn.dto.hoadon;

import jakarta.validation.constraints.NotNull;

public record CapNhatTrangThaiRequest(
        @NotNull(message = "Trạng thái không được để trống") Integer trangThai,
        String lyDo
) {}
