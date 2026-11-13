package com.example.datn.repository;
import com.example.datn.entity.HinhThucThanhToanEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface HinhThucThanhToanRepository extends JpaRepository<HinhThucThanhToanEntity,Long> {
 List<HinhThucThanhToanEntity> findByTrangThaiTrue();
}
