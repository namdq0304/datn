package com.example.datn.repository;
import com.example.datn.entity.LichSuHoaDonEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface LichSuHoaDonRepository extends JpaRepository<LichSuHoaDonEntity,Long> {
 List<LichSuHoaDonEntity> findByHoaDon_IdOrderByThoiGianDesc(Long hoaDonId);
}
