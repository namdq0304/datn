package com.example.datn.repository;

import com.example.datn.entity.XuatXuEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface XuatXuRepository extends JpaRepository<XuatXuEntity, Long> {
    List<XuatXuEntity> findByTrangThaiTrueOrderByIdAsc();
    Optional<XuatXuEntity> findByIdAndTrangThaiTrue(Long id);
    boolean existsByMaXuatXu(String maXuatXu);
    boolean existsByMaXuatXuAndIdNot(String maXuatXu, Long id);
}