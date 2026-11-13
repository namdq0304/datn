package com.example.datn.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
@Entity @Table(name="LICH_SU_HOA_DON") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LichSuHoaDonEntity {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="hoa_don_id",nullable=false) private HoaDonEntity hoaDon;
 @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="nhan_vien_id") private NhanVienEntity nhanVien;
 @Column(name="trang_thai_cu") private Integer trangThaiCu;
 @Column(name="trang_thai_moi") private Integer trangThaiMoi;
 @Column(name="ly_do",length=255) private String lyDo;
 @Column(name="thoi_gian") private LocalDateTime thoiGian;
}
