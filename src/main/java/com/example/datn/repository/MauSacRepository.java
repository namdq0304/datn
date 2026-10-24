package com.example.datn.repository;

import com.example.datn.entity.MauSacEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MauSacRepository extends JpaRepository<MauSacEntity, Long> {

    Optional<MauSacEntity> findByMaMau(String maMau);

    boolean existsByMaMau(String maMau);

    List<MauSacEntity> findByTrangThaiTrueOrderByIdAsc();

    Optional<MauSacEntity> findByIdAndTrangThaiTrue(Long id);
}