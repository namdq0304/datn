package com.example.datn.controller;

import com.example.datn.entity.KichThuocEntity;
import com.example.datn.repository.KichThuocRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/kich-thuoc")
public class KichThuocController {
    private final KichThuocRepository repo;
    public KichThuocController(KichThuocRepository repo) { this.repo = repo; }

    @GetMapping
    public List<KichThuocEntity> getAll() {
        return repo.findByTrangThaiTrueOrderByIdAsc();
    }
}
