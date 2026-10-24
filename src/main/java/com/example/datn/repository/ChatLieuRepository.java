package com.example.datn.repository;

import com.example.datn.entity.ChatLieuEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatLieuRepository extends JpaRepository<ChatLieuEntity, Long> {

    List<ChatLieuEntity> findByTrangThaiTrueOrderByIdAsc();

    Optional<ChatLieuEntity> findByIdAndTrangThaiTrue(Integer id);

    boolean existsByMaChatLieu(String maChatLieu);

    boolean existsByMaChatLieuAndIdNot(String maChatLieu, Integer id);
}