package com.example.datn.repository;

import com.example.datn.entity.SanPhamChiTietEntity;
import com.example.datn.entity.SanPhamEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface SanPhamChiTietRepository extends JpaRepository<SanPhamChiTietEntity, Long> {

    Optional<SanPhamChiTietEntity> findByMaChiTiet(String maChiTiet);

    boolean existsByMaChiTiet(String maChiTiet);

    List<SanPhamChiTietEntity> findBySanPham_Id(Long sanPhamId);

    List<SanPhamChiTietEntity> findByTrangThai(Boolean trangThai);



    @Query("""
       SELECT c FROM SanPhamChiTietEntity c
       JOIN FETCH c.sanPham
       JOIN FETCH c.mauSac
       JOIN FETCH c.kichThuoc
       WHERE c.sanPham.id = :sanPhamId AND c.trangThai = true
       """)
    List<SanPhamChiTietEntity> findActiveBySanPham(@Param("sanPhamId") Long sanPhamId);

    Optional<SanPhamChiTietEntity> findByIdAndTrangThaiTrue(Long id);

    /** Giá + tồn cho lưới POS — tính trên mọi biến thể đang bán có giá (kể cả hết hàng). */
    interface GiaBanHang {
        Long getSanPhamId();
        BigDecimal getGiaMin();
        BigDecimal getGiaMax();
        Long getTonKho();
    }

    @Query("""
       SELECT c.sanPham.id AS sanPhamId,
              MIN(c.giaBan) AS giaMin,
              MAX(c.giaBan) AS giaMax,
              SUM(COALESCE(c.soLuong, 0)) AS tonKho
       FROM SanPhamChiTietEntity c
       WHERE c.sanPham.id IN :ids AND c.trangThai = true AND c.giaBan IS NOT NULL
       GROUP BY c.sanPham.id
       """)
    List<GiaBanHang> giaBanHang(@Param("ids") Collection<Long> ids);

    /**
     * Lấy biến thể + KHÓA DÒNG (UPDLOCK) để trừ tồn kho khi tạo hóa đơn.
     * Giao dịch khác muốn bán cùng biến thể phải chờ → không bán vượt tồn.
     * Chỉ lấy biến thể đang bán của sản phẩm đang bán.
     */
    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @Query("""
       SELECT c FROM SanPhamChiTietEntity c
       WHERE c.id = :id AND c.trangThai = true AND c.sanPham.trangThai = true
       """)
    Optional<SanPhamChiTietEntity> findDangBanForUpdate(@Param("id") Long id);

    /** Khóa dòng biến thể bất kể trạng thái — dùng khi hoàn kho (hủy hóa đơn). */
    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT c FROM SanPhamChiTietEntity c WHERE c.id = :id")
    Optional<SanPhamChiTietEntity> findByIdForUpdate(@Param("id") Long id);

    boolean existsBySanPham_IdAndMauSac_IdAndKichThuoc_IdAndTrangThaiTrue(
            Long sanPhamId, Long mauSacId, Long kichThuocId);
    @Query("""
       SELECT c.sanPham.id, SUM(c.soLuong)
       FROM SanPhamChiTietEntity c
       WHERE c.sanPham.id IN :ids AND c.trangThai = true
       GROUP BY c.sanPham.id
       """)
    List<Object[]> sumSoLuongBySanPhamIds(@Param("ids") List<Long> ids);


    interface GiaTongHop {
        Integer getSanPhamId();
        BigDecimal getGiaMin();
        BigDecimal getGiaMax();
        BigDecimal getGiaGocMax();
        Long getSoBienTheGiamGia();
        Long getTonKho();
    }

    @Query("""
    SELECT ct.sanPham.id AS sanPhamId,
           MIN(ct.giaBan) AS giaMin,
           MAX(ct.giaBan) AS giaMax,
           SUM(ct.soLuong) AS tonKho
    FROM SanPhamChiTietEntity ct
    WHERE ct.sanPham.id IN :ids AND ct.trangThai = true AND ct.soLuong > 0
    GROUP BY ct.sanPham.id
    """)
    List<GiaTongHop> tongHopGia(@Param("ids") Collection<Integer> ids);
}