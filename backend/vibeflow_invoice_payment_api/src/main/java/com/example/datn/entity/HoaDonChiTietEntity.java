package com.example.datn.entity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
@Entity @Table(name="HOA_DON_CHI_TIET") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class HoaDonChiTietEntity {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="hoa_don_id",nullable=false) private HoaDonEntity hoaDon;
 @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="chi_tiet_san_pham_id",nullable=false) private SanPhamChiTietEntity chiTietSanPham;
 @Column(name="so_luong",nullable=false) private Integer soLuong;
 @Column(name="don_gia",precision=12,scale=2) private BigDecimal donGia;
 @Column(name="thanh_tien",precision=12,scale=2) private BigDecimal thanhTien;
}
