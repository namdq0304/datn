package com.example.datn.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Hóa đơn bán hàng — bảng HOA_DON (theo đúng db.sql, không thêm cột mới).
 * khachHangId nullable: POS được bán cho khách vãng lai.
 * Quy ước trang_thai (khớp query "sản phẩm hot" sẵn có ở module sản phẩm):
 *   3 = POS tại quầy — thanh toán xong là hoàn thành
 *   2 = Online đã giao, 1 = Online đang xử lý, 0 = Online chờ xử lý
 */
@Entity
@Table(name = "HOA_DON")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class HoaDonEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @Column(name = "ma_hoa_don", length = 20, nullable = false)
    String maHoaDon;

    /** FK sang KHACH_HANG.id — null = khách vãng lai. */
    @Column(name = "khach_hang_id")
    Long khachHangId;

    /** FK sang NHAN_VIEN.id — thu ngân tạo hóa đơn, lấy từ JWT đang đăng nhập. */
    @Column(name = "nhan_vien_id")
    Long nhanVienId;

    /** FK sang KHUYEN_MAI.id — mã khuyến mãi đã áp dụng (null = không dùng). */
    @Column(name = "khuyen_mai_id")
    Integer khuyenMaiId;

    @CreationTimestamp
    @Column(name = "ngay_tao", updatable = false)
    LocalDateTime ngayTao;

    @Column(name = "tong_tien", precision = 12, scale = 2)
    BigDecimal tongTien;

    @Column(name = "tien_giam", precision = 12, scale = 2)
    BigDecimal tienGiam;

    @Column(name = "thanh_tien", precision = 12, scale = 2)
    BigDecimal thanhTien;

    @Column(name = "trang_thai")
    Integer trangThai;
}
