package com.example.datn.repository;

import com.example.datn.entity.HinhThucThanhToanEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HinhThucThanhToanRepository extends JpaRepository<HinhThucThanhToanEntity, Integer> {

    Optional<HinhThucThanhToanEntity> findByMaHinhThuc(String maHinhThuc);

    /** Hình thức đang hoạt động — dropdown thanh toán ở màn Quản lý hóa đơn. */
    List<HinhThucThanhToanEntity> findByTrangThaiTrue();
}
