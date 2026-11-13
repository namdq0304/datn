package com.example.datn.repository;

import com.example.datn.entity.HinhThucThanhToanEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HinhThucThanhToanRepository extends JpaRepository<HinhThucThanhToanEntity, Integer> {

    Optional<HinhThucThanhToanEntity> findByMaHinhThuc(String maHinhThuc);
}
