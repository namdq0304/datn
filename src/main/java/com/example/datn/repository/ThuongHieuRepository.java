package com.example.datn.repository;

import com.example.datn.entity.ThuongHieuEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ThuongHieuRepository extends JpaRepository<ThuongHieuEntity, Long> {

    Optional<ThuongHieuEntity> findByMaThuongHieu(String maThuongHieu);

    boolean existsByMaThuongHieu(String maThuongHieu);
}