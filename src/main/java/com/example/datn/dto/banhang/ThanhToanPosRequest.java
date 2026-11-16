package com.example.datn.dto.banhang;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * Body POST /api/ban-hang/thanh-toan.
 * Tiền giảm KHÔNG nhận từ FE — chỉ nhận mã khuyến mãi, backend tự tính.
 */
public record ThanhToanPosRequest(
        @NotEmpty(message = "Hóa đơn đang trống!")
        @Size(max = 100, message = "Hóa đơn tối đa 100 dòng hàng")
        List<@Valid DongHang> items,

        /** TIEN_MAT | CHUYEN_KHOAN (mặc định TIEN_MAT). */
        String phuongThuc,

        /** Mã khuyến mãi (tùy chọn). */
        @Size(max = 50, message = "Mã khuyến mãi không hợp lệ")
        String maKhuyenMai,

        /** null = khách vãng lai. */
        Long khachHangId,

        @DecimalMin(value = "0", message = "Tiền khách đưa không được âm")
        BigDecimal tienKhachDua,

        /** Chuyển khoản: nội dung CK (mã tham chiếu VietQR) hoặc mã giao dịch ngân hàng. */
        @Size(max = 100, message = "Mã giao dịch tối đa 100 ký tự")
        String maGiaoDich
) {
    public record DongHang(
            @NotNull(message = "Thiếu biến thể sản phẩm") Long chiTietId,
            @NotNull(message = "Thiếu số lượng")
            @Min(value = 1, message = "Số lượng phải lớn hơn 0")
            @Max(value = 999, message = "Số lượng tối đa 999")
            Integer soLuong
    ) {}
}
