package com.example.datn.repository;

import com.example.datn.entity.KhuyenMaiEntity;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface KhuyenMaiRepository extends JpaRepository<KhuyenMaiEntity, Integer> {

    Optional<KhuyenMaiEntity> findByMaKhuyenMai(String maKhuyenMai);

    boolean existsByMaKhuyenMai(String maKhuyenMai);

    boolean existsByMaKhuyenMaiAndIdNot(String maKhuyenMai, Integer id);

    List<KhuyenMaiEntity> findAllByOrderByNgayTaoDesc();

    /** Khóa dòng khi áp dụng vào hóa đơn — tránh vượt số lượt khi 2 quầy dùng cùng lúc. */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT k FROM KhuyenMaiEntity k WHERE k.maKhuyenMai = :ma")
    Optional<KhuyenMaiEntity> findByMaForUpdate(@Param("ma") String ma);

    /** Khuyến mãi đang hiệu lực (còn hạn, còn lượt, đang bật). */
    @Query("""
           SELECT k FROM KhuyenMaiEntity k
           WHERE k.trangThai = true
             AND k.ngayBatDau <= :now AND k.ngayKetThuc >= :now
             AND (k.soLuong IS NULL OR k.soLuongDaDung < k.soLuong)
           ORDER BY k.ngayKetThuc ASC
           """)
    List<KhuyenMaiEntity> findDangHieuLuc(@Param("now") LocalDateTime now);
}
