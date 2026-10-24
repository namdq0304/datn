package com.example.datn.controller;

import com.example.datn.dto.XuatXuDTO;
import com.example.datn.entity.XuatXuEntity;
import com.example.datn.repository.XuatXuRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/xuat-xu")
public class XuatXuController {

    @Autowired
    private  XuatXuRepository repo;

    public XuatXuController(XuatXuRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public ResponseEntity<List<XuatXuDTO>> getAll() {
        return ResponseEntity.ok(
                repo.findByTrangThaiTrueOrderByIdAsc().stream().map(this::toDTO).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<XuatXuDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(toDTO(findActive(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<XuatXuDTO> create(@Valid @RequestBody XuatXuDTO dto) {
        String ma = dto.getMaXuatXu().trim();
        if (repo.existsByMaXuatXu(ma)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Mã xuất xứ đã tồn tại");
        }
        XuatXuEntity e = XuatXuEntity.builder()
                .maXuatXu(ma)
                .tenXuatXu(dto.getTenXuatXu().trim())
                .moTa(dto.getMoTa())
                .trangThai(true)
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(repo.save(e)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<XuatXuDTO> update(@PathVariable Long id, @Valid @RequestBody XuatXuDTO dto) {
        XuatXuEntity e = findActive(id);
        String ma = dto.getMaXuatXu().trim();
        if (repo.existsByMaXuatXuAndIdNot(ma, id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Mã xuất xứ đã tồn tại");
        }
        e.setMaXuatXu(ma);
        e.setTenXuatXu(dto.getTenXuatXu().trim());
        e.setMoTa(dto.getMoTa());
        return ResponseEntity.ok(toDTO(repo.save(e)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        XuatXuEntity e = findActive(id);
        e.setTrangThai(false);
        repo.save(e);
        return ResponseEntity.noContent().build();
    }

    private XuatXuEntity findActive(Long id) {
        return repo.findByIdAndTrangThaiTrue(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy xuất xứ"));
    }

    private XuatXuDTO toDTO(XuatXuEntity e) {
        return XuatXuDTO.builder()
                .id(e.getId())
                .maXuatXu(e.getMaXuatXu())
                .tenXuatXu(e.getTenXuatXu())
                .moTa(e.getMoTa())
                .trangThai(e.getTrangThai())
                .build();
    }
}