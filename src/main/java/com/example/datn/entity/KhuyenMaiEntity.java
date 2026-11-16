package com.example.datn.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Khuyến mãi / voucher — bảng KHUYEN_MAI (xem sql/migration_khuyen_mai.sql).
 * loaiGiam: 1 = giảm theo %, 2 = giảm số tiền cố định.
 */
@Entity
@Table(name = "KHUYEN_MAI")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class KhuyenMaiEntity {

    public static final int LOAI_PHAN_TRAM = 1;
    public static final int LOAI_SO_TIEN = 2;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    // UNIQUE đã có ở DB (UQ_KHUYEN_MAI_MA) — không khai báo unique ở đây để ddl-auto không tạo thêm constraint
    @Column(name = "ma_khuyen_mai", length = 50, nullable = false)
    String maKhuyenMai;

    @Column(name = "ten_khuyen_mai", nullable = false)
    String tenKhuyenMai;

    @Column(name = "mo_ta", columnDefinition = "NVARCHAR(MAX)")
    String moTa;

    @Column(name = "loai_giam", nullable = false)
    Integer loaiGiam;

    @Column(name = "gia_tri_giam", precision = 12, scale = 2, nullable = false)
    BigDecimal giaTriGiam;

    /** Trần tiền giảm (chỉ áp dụng cho loại %), null = không giới hạn. */
    @Column(name = "giam_toi_da", precision = 12, scale = 2)
    BigDecimal giamToiDa;

    /** Giá trị đơn tối thiểu để được áp dụng. */
    @Column(name = "don_toi_thieu", precision = 12, scale = 2, nullable = false)
    BigDecimal donToiThieu;

    /** Tổng lượt dùng, null = không giới hạn. */
    @Column(name = "so_luong")
    Integer soLuong;

    @Column(name = "so_luong_da_dung", nullable = false)
    Integer soLuongDaDung;

    @Column(name = "ngay_bat_dau", nullable = false)
    LocalDateTime ngayBatDau;

    @Column(name = "ngay_ket_thuc", nullable = false)
    LocalDateTime ngayKetThuc;

    @Column(name = "trang_thai", nullable = false)
    Boolean trangThai;

    @CreationTimestamp
    @Column(name = "ngay_tao", updatable = false)
    LocalDateTime ngayTao;

    @UpdateTimestamp
    @Column(name = "ngay_cap_nhat")
    LocalDateTime ngayCapNhat;
}
