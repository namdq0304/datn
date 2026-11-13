package com.example.datn.repository;
import com.example.datn.entity.HoaDonEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface HoaDonRepository extends JpaRepository<HoaDonEntity,Long> {
 Optional<HoaDonEntity> findByMaHoaDon(String maHoaDon);
 boolean existsByMaHoaDon(String maHoaDon);
 List<HoaDonEntity> findAllByOrderByNgayTaoDesc();
}
