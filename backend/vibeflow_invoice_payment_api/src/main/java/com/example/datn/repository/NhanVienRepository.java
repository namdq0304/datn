package com.example.datn.repository;

import com.example.datn.entity.NhanVienEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface NhanVienRepository extends JpaRepository<NhanVienEntity, Long> {

    Optional<NhanVienEntity> findByEmail(String email);

}

