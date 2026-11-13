package com.example.datn.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Chi tiết thanh toán — bảng CHI_TIET_THANH_TOAN (theo đúng db.sql).
 * Mỗi dòng = 1 lần trả tiền cho hóa đơn (POS thường 1 dòng: tiền mặt hoặc chuyển khoản).
 */
@Entity
@Table(name = "CHI_TIET_THANH_TOAN")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChiTietThanhToanEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hoa_don_id")
    HoaDonEntity hoaDon;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hinh_thuc_thanh_toan_id")
    HinhThucThanhToanEntity hinhThuc;

    @Column(name = "so_tien", precision = 12, scale = 2)
    BigDecimal soTien;

    @CreationTimestamp
    @Column(name = "ngay_thanh_toan", updatable = false)
    LocalDateTime ngayThanhToan;

    /** Mã giao dịch bank/QR — tiền mặt để null. */
    @Column(name = "ma_giao_dich", length = 100)
    String maGiaoDich;

    /** 1 = đã thanh toán. */
    @Column(name = "trang_thai")
    Integer trangThai;
}
