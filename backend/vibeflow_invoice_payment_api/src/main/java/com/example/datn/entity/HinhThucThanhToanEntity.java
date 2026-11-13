package com.example.datn.entity;
import jakarta.persistence.*;
import lombok.*;
@Entity @Table(name="HINH_THUC_THANH_TOAN") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class HinhThucThanhToanEntity {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(name="ma_hinh_thuc",nullable=false,length=20) private String maHinhThuc;
 @Column(name="ten_hinh_thuc",nullable=false,length=100) private String tenHinhThuc;
 @Column(name="mo_ta",length=255) private String moTa;
 @Column(name="trang_thai") private Boolean trangThai;
}
