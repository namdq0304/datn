package com.example.datn.repository;

import com.example.datn.entity.HoaDonEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface HoaDonRepository extends JpaRepository<HoaDonEntity, Integer> {

    boolean existsByMaHoaDon(String maHoaDon);

    /** Doanh thu + số đơn trong kỳ (POS + online gộp chung). */
    @Query("""
           SELECT COALESCE(SUM(h.thanhTien), 0), COUNT(h)
           FROM HoaDonEntity h
           WHERE h.ngayTao >= :tu AND h.ngayTao < :den
           """)
    Object[] tongHopTheoKy(@Param("tu") LocalDateTime tu, @Param("den") LocalDateTime den);

    /** Doanh thu kỳ trước — so % tăng trưởng trên KPI card. */
    @Query("""
           SELECT COALESCE(SUM(h.thanhTien), 0), COUNT(h)
           FROM HoaDonEntity h
           WHERE h.ngayTao >= :tu AND h.ngayTao < :den
           """)
    Object[] tongHopKyTruoc(@Param("tu") LocalDateTime tu, @Param("den") LocalDateTime den);

    /** Doanh thu bán tại quầy (trang_thai = 3). */
    @Query("""
           SELECT COALESCE(SUM(h.thanhTien), 0)
           FROM HoaDonEntity h
           WHERE h.ngayTao >= :tu AND h.ngayTao < :den AND h.trangThai = 3
           """)
    BigDecimal doanhThuPos(@Param("tu") LocalDateTime tu, @Param("den") LocalDateTime den);

    /** Doanh thu online (trang_thai khác 3). */
    @Query("""
           SELECT COALESCE(SUM(h.thanhTien), 0)
           FROM HoaDonEntity h
           WHERE h.ngayTao >= :tu AND h.ngayTao < :den
             AND h.trangThai <> 3
           """)
    BigDecimal doanhThuOnline(@Param("tu") LocalDateTime tu, @Param("den") LocalDateTime den);

    /** Doanh thu từng ngày (biểu đồ 7 ngày) — native vì cần CONVERT date của SQL Server. */
    @Query(value = """
           SELECT CONVERT(date, h.ngay_tao) AS ngay,
                  COALESCE(SUM(h.thanh_tien), 0) AS doanhThu
           FROM hoa_don h
           WHERE h.ngay_tao >= :tu AND h.ngay_tao < :den
           GROUP BY CONVERT(date, h.ngay_tao)
           ORDER BY CONVERT(date, h.ngay_tao)
           """, nativeQuery = true)
    List<Object[]> doanhThuTheoNgay(@Param("tu") LocalDateTime tu, @Param("den") LocalDateTime den);
}
