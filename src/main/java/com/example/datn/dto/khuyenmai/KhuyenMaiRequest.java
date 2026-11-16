package com.example.datn.dto.khuyenmai;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/** Tạo / cập nhật khuyến mãi. */
public record KhuyenMaiRequest(
        @NotBlank(message = "Mã khuyến mãi không được để trống")
        @Size(max = 50, message = "Mã khuyến mãi tối đa 50 ký tự")
        @Pattern(regexp = "^[A-Za-z0-9_-]+$", message = "Mã khuyến mãi chỉ gồm chữ, số, '-' và '_'")
        String maKhuyenMai,

        @NotBlank(message = "Tên khuyến mãi không được để trống")
        @Size(max = 255, message = "Tên khuyến mãi tối đa 255 ký tự")
        String tenKhuyenMai,

        String moTa,

        @NotNull(message = "Vui lòng chọn loại giảm")
        @Min(value = 1, message = "Loại giảm không hợp lệ") @Max(value = 2, message = "Loại giảm không hợp lệ")
        Integer loaiGiam,

        @NotNull(message = "Giá trị giảm không được để trống")
        @DecimalMin(value = "0.01", message = "Giá trị giảm phải lớn hơn 0")
        BigDecimal giaTriGiam,

        @DecimalMin(value = "0.01", message = "Giảm tối đa phải lớn hơn 0")
        BigDecimal giamToiDa,

        @DecimalMin(value = "0", message = "Đơn tối thiểu không được âm")
        BigDecimal donToiThieu,

        @Min(value = 0, message = "Số lượng không được âm")
        Integer soLuong,

        @NotNull(message = "Ngày bắt đầu không được để trống")
        LocalDateTime ngayBatDau,

        @NotNull(message = "Ngày kết thúc không được để trống")
        LocalDateTime ngayKetThuc,

        Boolean trangThai
) {}
