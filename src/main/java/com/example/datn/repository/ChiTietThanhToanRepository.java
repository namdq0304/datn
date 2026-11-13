package com.example.datn.repository;

import com.example.datn.entity.ChiTietThanhToanEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface ChiTietThanhToanRepository extends JpaRepository<ChiTietThanhToanEntity, Integer> {

    List<ChiTietThanhToanEntity> findByHoaDon_Id(Integer hoaDonId);

    /** Doanh thu theo hình thức thanh toán trong kỳ: { maHinhThuc, tenHinhThuc, soTien }. */
    @Query("""
           SELECT tt.hinhThuc.maHinhThuc, tt.hinhThuc.tenHinhThuc, SUM(tt.soTien)
           FROM ChiTietThanhToanEntity tt
           WHERE tt.hoaDon.ngayTao >= :tu AND tt.hoaDon.ngayTao < :den
           GROUP BY tt.hinhThuc.maHinhThuc, tt.hinhThuc.tenHinhThuc
           """)
    List<Object[]> doanhThuTheoHinhThuc(@Param("tu") LocalDateTime tu, @Param("den") LocalDateTime den);

    /** Tổng tiền mặt thu trong kỳ — cho tab Giao Ca & Chốt Két. */
    @Query("""
           SELECT COALESCE(SUM(tt.soTien), 0)
           FROM ChiTietThanhToanEntity tt
           WHERE tt.hinhThuc.maHinhThuc = 'TIEN_MAT'
             AND tt.hoaDon.ngayTao >= :tu AND tt.hoaDon.ngayTao < :den
           """)
    BigDecimal tongTienMat(@Param("tu") LocalDateTime tu, @Param("den") LocalDateTime den);
}
