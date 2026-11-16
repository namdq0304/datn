package com.example.datn.repository;

import com.example.datn.entity.HoaDonChiTietEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface HoaDonChiTietRepository extends JpaRepository<HoaDonChiTietEntity, Integer> {

    List<HoaDonChiTietEntity> findByHoaDon_Id(Integer hoaDonId);

    /** Số đôi giày xuất kho trong kỳ (POS + online). */
    @Query("""
           SELECT COALESCE(SUM(ct.soLuong), 0)
           FROM HoaDonChiTietEntity ct
           WHERE ct.hoaDon.ngayTao >= :tu AND ct.hoaDon.ngayTao < :den
             AND ct.hoaDon.trangThai NOT IN (0, 6)
           """)
    Long tongSoLuongXuatKho(@Param("tu") LocalDateTime tu, @Param("den") LocalDateTime den);

    /** Top sản phẩm bán chạy trong kỳ: { sanPhamId, tenSanPham, soLuongBan, doanhThu }.
     *  Không dùng Pageable với GROUP BY (count query sinh ra sẽ sai) — limit ở Service. */
    @Query("""
           SELECT ct.chiTietSanPham.sanPham.id,
                  ct.chiTietSanPham.sanPham.tenSanPham,
                  SUM(ct.soLuong),
                  SUM(ct.thanhTien)
           FROM HoaDonChiTietEntity ct
           WHERE ct.hoaDon.ngayTao >= :tu AND ct.hoaDon.ngayTao < :den
             AND ct.hoaDon.trangThai NOT IN (0, 6)
           GROUP BY ct.chiTietSanPham.sanPham.id, ct.chiTietSanPham.sanPham.tenSanPham
           ORDER BY SUM(ct.soLuong) DESC
           """)
    List<Object[]> topBanChay(@Param("tu") LocalDateTime tu, @Param("den") LocalDateTime den);
}
