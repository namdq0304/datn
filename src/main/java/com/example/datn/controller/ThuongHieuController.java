package com.example.datn.controller;

import com.example.datn.dto.SanPhamDTO;
import com.example.datn.entity.ThuongHieuEntity;
import com.example.datn.repository.ThuongHieuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/thuong-hieu")
public class ThuongHieuController {
    @Autowired
    private ThuongHieuRepository thuongHieuRepository;

    @GetMapping
    public ResponseEntity<List<ThuongHieuEntity>> getAll() {
        return ResponseEntity.ok(thuongHieuRepository.findAll());
    }

}
