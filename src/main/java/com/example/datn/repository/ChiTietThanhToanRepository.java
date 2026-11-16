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
             AND tt.trangThai = 1 AND tt.hoaDon.trangThai <> 6
           GROUP BY tt.hinhThuc.maHinhThuc, tt.hinhThuc.tenHinhThuc
           """)
    List<Object[]> doanhThuTheoHinhThuc(@Param("tu") LocalDateTime tu, @Param("den") LocalDateTime den);

    /** Tổng tiền mặt thu trong kỳ — cho tab Giao Ca & Chốt Két. */
    @Query("""
           SELECT COALESCE(SUM(tt.soTien), 0)
           FROM ChiTietThanhToanEntity tt
           WHERE tt.hinhThuc.maHinhThuc = 'TIEN_MAT'
             AND tt.hoaDon.ngayTao >= :tu AND tt.hoaDon.ngayTao < :den
             AND tt.trangThai = 1 AND tt.hoaDon.trangThai <> 6
           """)
    BigDecimal tongTienMat(@Param("tu") LocalDateTime tu, @Param("den") LocalDateTime den);

    /** Lịch sử thanh toán của 1 hóa đơn, mới nhất trước. */
    List<ChiTietThanhToanEntity> findByHoaDon_IdOrderByNgayThanhToanDesc(Integer hoaDonId);

    /** Dòng thanh toán VNPay mới nhất của hóa đơn. */
    java.util.Optional<ChiTietThanhToanEntity> findFirstByHoaDon_IdAndHinhThuc_MaHinhThucOrderByIdDesc(Integer hoaDonId, String maHinhThuc);

    /** Giao dịch theo phương thức + trạng thái tạo trước thời điểm (dọn VNPay quá hạn). */
    List<ChiTietThanhToanEntity> findByHinhThuc_MaHinhThucAndTrangThaiAndNgayThanhToanBefore(String maHinhThuc, Integer trangThai, LocalDateTime truoc);
}
