package com.example.datn.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

/**
 * Hình thức thanh toán — bảng HINH_THUC_THANH_TOAN (theo đúng db.sql).
 * Dữ liệu seed: TIEN_MAT, CHUYEN_KHOAN (tự nạp nếu thiếu khi app khởi động).
 */
@Entity
@Table(name = "HINH_THUC_THANH_TOAN")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class HinhThucThanhToanEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @Column(name = "ma_hinh_thuc", length = 20, nullable = false)
    String maHinhThuc;

    @Column(name = "ten_hinh_thuc", length = 100, nullable = false)
    String tenHinhThuc;

    @Column(name = "mo_ta", length = 255)
    String moTa;

    @Column(name = "trang_thai")
    Boolean trangThai;
}
