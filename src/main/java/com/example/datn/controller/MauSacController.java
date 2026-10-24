package com.example.datn.controller;

import com.example.datn.entity.MauSacEntity;
import com.example.datn.repository.MauSacRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/mau-sac")
public class MauSacController {
    private final MauSacRepository repo;
    public MauSacController(MauSacRepository repo) { this.repo = repo; }

    @GetMapping
    public List<MauSacEntity> getAll() {
        return repo.findByTrangThaiTrueOrderByIdAsc();
    }
}


