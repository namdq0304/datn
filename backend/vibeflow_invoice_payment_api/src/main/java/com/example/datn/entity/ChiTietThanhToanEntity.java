package com.example.datn.entity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
@Entity @Table(name="CHI_TIET_THANH_TOAN") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ChiTietThanhToanEntity {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="hoa_don_id",nullable=false) private HoaDonEntity hoaDon;
 @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="hinh_thuc_thanh_toan_id",nullable=false) private HinhThucThanhToanEntity hinhThucThanhToan;
 @Column(name="so_tien",precision=12,scale=2) private BigDecimal soTien;
 @Column(name="ngay_thanh_toan") private LocalDateTime ngayThanhToan;
 @Column(name="ma_giao_dich",length=100) private String maGiaoDich;
 @Column(name="trang_thai") private Integer trangThai;
}
