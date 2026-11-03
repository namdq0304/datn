package com.example.datn.repository;

import com.example.datn.entity.GioHangEntity;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface GioHangRepository extends JpaRepository<GioHangEntity, Long> {

    interface GioHangView {
        Long getId();
        Integer getChiTietSanPhamId();
        Integer getSanPhamId();
        String getTenSanPham();
        String getMauSac();
        String getKichThuoc();
        String getUrlAnh();
        BigDecimal getDonGia();
        Integer getSoLuong();
        Integer getTonKho();
    }

    @Query(value = """
        SELECT gh.id                              AS id,
               ctsp.id                            AS chiTietSanPhamId,
               sp.id                              AS sanPhamId,
               sp.ten_san_pham                    AS tenSanPham,
               ms.ten_mau                         AS mauSac,
               kt.ten_kich_thuoc                  AS kichThuoc,
               (SELECT TOP 1 ha.url_anh FROM HINH_ANH ha
                 WHERE ha.san_pham_id = sp.id AND ha.trang_thai = 1
                 ORDER BY ha.anh_chinh DESC, ha.id) AS urlAnh,
               ctsp.gia_ban AS donGia,
               gh.so_luong                        AS soLuong,
               ctsp.so_luong                      AS tonKho
        FROM GIO_HANG gh
        JOIN CHI_TIET_SAN_PHAM ctsp ON ctsp.id = gh.chi_tiet_san_pham_id AND ctsp.trang_thai = 1
        JOIN SAN_PHAM sp            ON sp.id = ctsp.san_pham_id AND sp.trang_thai = 1
        LEFT JOIN MAU_SAC ms        ON ms.id = ctsp.mau_sac_id
        LEFT JOIN KICH_THUOC kt     ON kt.id = ctsp.kich_thuoc_id
        WHERE gh.khach_hang_id = :khachHangId AND gh.trang_thai = 1
        ORDER BY gh.created_at DESC
        """, nativeQuery = true)
    List<GioHangView> findGioHang(@Param("khachHangId") Integer khachHangId);

    @Query(value = "SELECT so_luong FROM CHI_TIET_SAN_PHAM WHERE id = :id AND trang_thai = 1",
            nativeQuery = true)
    Optional<Integer> findTonKho(@Param("id") Integer chiTietSanPhamId);

    Optional<GioHangEntity> findByKhachHangIdAndChiTietSanPhamIdAndTrangThaiTrue(
            Integer khachHangId, Integer chiTietSanPhamId);

    Optional<GioHangEntity> findByIdAndKhachHangIdAndTrangThaiTrue(Long id, Integer khachHangId);

    long countByKhachHangIdAndTrangThaiTrue(Integer khachHangId);

    @Modifying
    @Query("UPDATE GioHangEntity g SET g.trangThai = false WHERE g.khachHangId = :kh AND g.trangThai = true")
    void clearByKhachHang(@Param("kh") Integer khachHangId);
}