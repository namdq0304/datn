package com.example.datn.repository;

import com.example.datn.entity.SanPhamEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface SanPhamRepository extends JpaRepository<SanPhamEntity, Integer> {

    List<SanPhamEntity> findByTrangThaiTrueOrderByNgayTaoDesc();

    Optional<SanPhamEntity> findByIdAndTrangThaiTrue(Integer id);

    boolean existsByMaSanPham(String maSanPham);

    @Query("""
           SELECT s FROM SanPhamEntity s
           WHERE s.trangThai = true
             AND (LOWER(s.tenSanPham) LIKE LOWER(CONCAT('%', :q, '%'))
               OR LOWER(s.maSanPham)  LIKE LOWER(CONCAT('%', :q, '%')))
           ORDER BY s.ngayTao DESC
           """)
    List<SanPhamEntity> search(@Param("q") String q);

    /** Phân trang — tìm kiếm kết hợp với lọc thương hiệu */
    @Query("""
           SELECT s FROM SanPhamEntity s
           WHERE s.trangThai = true
             AND (:q = '' OR LOWER(s.tenSanPham) LIKE LOWER(CONCAT('%', :q, '%'))
                         OR LOWER(s.maSanPham)   LIKE LOWER(CONCAT('%', :q, '%')))
             AND (:thuongHieuId IS NULL OR s.thuongHieuId = :thuongHieuId)
           """)
    Page<SanPhamEntity> findWithPaging(
            @Param("q") String q,
            @Param("thuongHieuId") Integer thuongHieuId,
            Pageable pageable);

    /** Public — danh sách sản phẩm đang bán (không cần đăng nhập) */

    // Điều kiện dùng chung cho query dữ liệu và query đếm.
    String PUBLIC_FROM_WHERE = """
        FROM SanPhamEntity sp, SanPhamChiTietEntity ct
        WHERE ct.sanPham.id = sp.id
          AND sp.trangThai = true
          AND ct.trangThai = true
          AND (:inStock = false OR ct.soLuong > 0)
          AND (:q = '' OR LOWER(sp.tenSanPham) LIKE LOWER(CONCAT('%', :q, '%'))
                        OR LOWER(sp.maSanPham)  LIKE LOWER(CONCAT('%', :q, '%')))
          AND (:thuongHieuId IS NULL OR sp.thuongHieuId = :thuongHieuId)
          AND (:danhMucId    IS NULL OR sp.danhMucId    = :danhMucId)
          AND (:chatLieuId   IS NULL OR sp.chatLieuId   = :chatLieuId)
          AND (:xuatXuId     IS NULL OR sp.xuatXuId     = :xuatXuId)
          AND (:gioiTinh     IS NULL OR sp.gioiTinh = :gioiTinh OR sp.gioiTinh = 2)
          AND (:mauSacId     IS NULL OR ct.mauSac.id     = :mauSacId)
          AND (:kichThuocId  IS NULL OR ct.kichThuoc.id  = :kichThuocId)
          AND (:minPrice     IS NULL OR ct.giaBan >= :minPrice)
          AND (:maxPrice     IS NULL OR ct.giaBan <= :maxPrice)
          AND (:onSale = false OR (ct.giaNhap IS NOT NULL))
        """;

    // Query 1 thương hiệu (giữ nguyên để backward-compat)
    @Query(value = "SELECT sp.id " + PUBLIC_FROM_WHERE + " GROUP BY sp.id, sp.ngayTao",
            countQuery = "SELECT COUNT(DISTINCT sp.id) " + PUBLIC_FROM_WHERE)
    Page<Integer> findPublicIds(
            @Param("q") String q,
            @Param("thuongHieuId") Integer thuongHieuId,
            @Param("danhMucId") Integer danhMucId,
            @Param("chatLieuId") Integer chatLieuId,
            @Param("xuatXuId") Integer xuatXuId,
            @Param("gioiTinh") Integer gioiTinh,
            @Param("mauSacId") Integer mauSacId,
            @Param("kichThuocId") Integer kichThuocId,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("onSale") boolean onSale,
            @Param("inStock") boolean inStock,
            Pageable pageable);

    // Query nhiều thương hiệu — dùng khi thuongHieuIds không rỗng
    @Query(value = """
        SELECT sp.id
        FROM SanPhamEntity sp, SanPhamChiTietEntity ct
        WHERE ct.sanPham.id = sp.id
          AND sp.trangThai = true
          AND ct.trangThai = true
          AND (:inStock = false OR ct.soLuong > 0)
          AND (:q = '' OR LOWER(sp.tenSanPham) LIKE LOWER(CONCAT('%', :q, '%'))
                        OR LOWER(sp.maSanPham)  LIKE LOWER(CONCAT('%', :q, '%')))
          AND sp.thuongHieuId IN (:thuongHieuIds)
          AND (:danhMucId   IS NULL OR sp.danhMucId   = :danhMucId)
          AND (:chatLieuId  IS NULL OR sp.chatLieuId  = :chatLieuId)
          AND (:xuatXuId    IS NULL OR sp.xuatXuId    = :xuatXuId)
          AND (:gioiTinh    IS NULL OR sp.gioiTinh = :gioiTinh OR sp.gioiTinh = 2)
          AND (:mauSacId    IS NULL OR ct.mauSac.id    = :mauSacId)
          AND (:kichThuocId IS NULL OR ct.kichThuoc.id = :kichThuocId)
          AND (:minPrice    IS NULL OR ct.giaBan >= :minPrice)
          AND (:maxPrice    IS NULL OR ct.giaBan <= :maxPrice)
          AND (:onSale = false OR ct.giaNhap IS NOT NULL)
        GROUP BY sp.id, sp.ngayTao
        """,
        countQuery = """
        SELECT COUNT(DISTINCT sp.id)
        FROM SanPhamEntity sp, SanPhamChiTietEntity ct
        WHERE ct.sanPham.id = sp.id
          AND sp.trangThai = true
          AND ct.trangThai = true
          AND (:inStock = false OR ct.soLuong > 0)
          AND (:q = '' OR LOWER(sp.tenSanPham) LIKE LOWER(CONCAT('%', :q, '%'))
                        OR LOWER(sp.maSanPham)  LIKE LOWER(CONCAT('%', :q, '%')))
          AND sp.thuongHieuId IN (:thuongHieuIds)
          AND (:danhMucId   IS NULL OR sp.danhMucId   = :danhMucId)
          AND (:chatLieuId  IS NULL OR sp.chatLieuId  = :chatLieuId)
          AND (:xuatXuId    IS NULL OR sp.xuatXuId    = :xuatXuId)
          AND (:gioiTinh    IS NULL OR sp.gioiTinh = :gioiTinh OR sp.gioiTinh = 2)
          AND (:mauSacId    IS NULL OR ct.mauSac.id    = :mauSacId)
          AND (:kichThuocId IS NULL OR ct.kichThuoc.id = :kichThuocId)
          AND (:minPrice    IS NULL OR ct.giaBan >= :minPrice)
          AND (:maxPrice    IS NULL OR ct.giaBan <= :maxPrice)
          AND (:onSale = false OR ct.giaNhap IS NOT NULL)
        """)
    Page<Integer> findPublicIdsMultiBrand(
            @Param("q") String q,
            @Param("thuongHieuIds") List<Integer> thuongHieuIds,
            @Param("danhMucId") Integer danhMucId,
            @Param("chatLieuId") Integer chatLieuId,
            @Param("xuatXuId") Integer xuatXuId,
            @Param("gioiTinh") Integer gioiTinh,
            @Param("mauSacId") Integer mauSacId,
            @Param("kichThuocId") Integer kichThuocId,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("onSale") boolean onSale,
            @Param("inStock") boolean inStock,
            Pageable pageable);
    /**
     * Sản phẩm hot: tổng số lượng bán (SUM hoa_don_chi_tiet.so_luong qua chi_tiet_san_pham)
     * Chỉ tính các hóa đơn đã hoàn thành (trang_thai = 3 hoặc > 0 tùy quy ước — dùng != 0 và != -1)
     * Trả về Object[] { sanPhamId, tongBan }
     */
    @Query(value = """
   SELECT TOP (:limit)
       sp.id              AS sanPhamId,
       SUM(hdct.so_luong) AS tongBan
   FROM SAN_PHAM sp
   JOIN CHI_TIET_SAN_PHAM ctsp ON ctsp.san_pham_id = sp.id AND ctsp.trang_thai = 1
   JOIN HOA_DON_CHI_TIET  hdct ON hdct.chi_tiet_san_pham_id = ctsp.id
   JOIN HOA_DON            hd  ON hd.id = hdct.hoa_don_id
   WHERE sp.trang_thai = 1
     AND hd.trang_thai = 3                                   -- chỉ đơn hoàn thành (đổi theo hệ thống bạn)
     AND hd.ngay_tao >= DATEADD(DAY, -90, GETDATE())         -- tuỳ chọn: 90 ngày gần nhất
   GROUP BY sp.id
   HAVING SUM(hdct.so_luong) > 0
   ORDER BY tongBan DESC, sp.id DESC
   """, nativeQuery = true)
    List<Object[]> findSanPhamHotIds(@Param("limit") int limit);

    /** Đếm tổng (dùng cho thống kê) */
    long countByTrangThaiTrue();
}