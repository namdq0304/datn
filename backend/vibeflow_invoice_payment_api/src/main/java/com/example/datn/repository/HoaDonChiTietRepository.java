package com.example.datn.repository;
import com.example.datn.entity.HoaDonChiTietEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface HoaDonChiTietRepository extends JpaRepository<HoaDonChiTietEntity,Long> {
 List<HoaDonChiTietEntity> findByHoaDon_Id(Long hoaDonId);
}
