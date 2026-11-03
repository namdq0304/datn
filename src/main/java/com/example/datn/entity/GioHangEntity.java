package com.example.datn.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "GIO_HANG")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GioHangEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(name = "khach_hang_id")
    Integer khachHangId;

    @Column(name = "device_id")
    Integer deviceId;

    @Column(name = "chi_tiet_san_pham_id")
    Integer chiTietSanPhamId;

    @Column(name = "so_luong")
    Integer soLuong;

    @Column(name = "trang_thai")
    Boolean trangThai;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    LocalDateTime createdAt;
}