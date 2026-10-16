package com.example.datn.repository;

import com.example.datn.entity.NhanVienEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NhanVienRepository extends JpaRepository<NhanVienEntity, Long> {

    // Tìm nhân viên theo mã nhân viên
    Optional<NhanVienEntity> findByMaNhanVien(String maNhanVien);

    // Tìm nhân viên theo email (dùng cho đăng nhập)
    Optional<NhanVienEntity> findByEmail(String email);

    // Kiểm tra tồn tại mã nhân viên
    boolean existsByMaNhanVien(String maNhanVien);

    // Kiểm tra tồn tại email
    boolean existsByEmail(String email);

}