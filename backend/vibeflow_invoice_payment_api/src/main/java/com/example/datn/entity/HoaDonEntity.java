package com.example.datn.entity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
@Entity @Table(name="HOA_DON") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class HoaDonEntity {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(name="ma_hoa_don",nullable=false,length=20) private String maHoaDon;
 @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="khach_hang_id") private KhachHangEntity khachHang;
 @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="nhan_vien_id") private NhanVienEntity nhanVien;
 @Column(name="ngay_tao") private LocalDateTime ngayTao;
 @Column(name="tong_tien",precision=12,scale=2) private BigDecimal tongTien;
 @Column(name="tien_giam",precision=12,scale=2) private BigDecimal tienGiam;
 @Column(name="thanh_tien",precision=12,scale=2) private BigDecimal thanhTien;
 @Column(name="trang_thai") private Integer trangThai;
}
