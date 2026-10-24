package com.example.datn.repository;

import com.example.datn.entity.KichThuocEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface KichThuocRepository extends JpaRepository<KichThuocEntity, Long> {

    Optional<KichThuocEntity> findByMaKichThuoc(String maKichThuoc);

    boolean existsByMaKichThuoc(String maKichThuoc);

    List<KichThuocEntity> findByTrangThaiTrueOrderByIdAsc();

    Optional<KichThuocEntity> findByIdAndTrangThaiTrue(Long id);
}

