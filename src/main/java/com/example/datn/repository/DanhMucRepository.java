package com.example.datn.repository;

import com.example.datn.entity.DanhMucEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DanhMucRepository extends JpaRepository<DanhMucEntity, Long> {

    List<DanhMucEntity> findByTrangThaiTrueOrderByIdAsc();
    Optional<DanhMucEntity> findByIdAndTrangThaiTrue(Long id);
    boolean existsByMaDanhMuc(String maDanhMuc);
    boolean existsByMaDanhMucAndIdNot(String maDanhMuc, Long id);
}