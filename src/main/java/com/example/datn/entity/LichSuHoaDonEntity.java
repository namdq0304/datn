package com.example.datn.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

/**
 * Lịch sử thay đổi trạng thái hóa đơn — bảng LICH_SU_HOA_DON (theo đúng db.sql).
 * nhanVienId giữ dạng cột thường giống HoaDonEntity để không sinh thêm FK khi ddl-auto=update.
 */
@Entity
@Table(name = "LICH_SU_HOA_DON")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LichSuHoaDonEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hoa_don_id")
    HoaDonEntity hoaDon;

    @Column(name = "nhan_vien_id")
    Long nhanVienId;

    @Column(name = "trang_thai_cu")
    Integer trangThaiCu;

    @Column(name = "trang_thai_moi")
    Integer trangThaiMoi;

    @Column(name = "ly_do", length = 255)
    String lyDo;

    @Column(name = "thoi_gian")
    LocalDateTime thoiGian;
}
