package com.example.datn.repository;
import com.example.datn.entity.ChiTietThanhToanEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ChiTietThanhToanRepository extends JpaRepository<ChiTietThanhToanEntity,Long> {
 List<ChiTietThanhToanEntity> findByHoaDon_IdOrderByNgayThanhToanDesc(Long hoaDonId);
}
