package com.example.datn.controller;

import com.example.datn.dto.ChatLieuDTO;
import com.example.datn.entity.ChatLieuEntity;
import com.example.datn.repository.ChatLieuRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/chat-lieu")
public class ChatLieuController {

    private final ChatLieuRepository chatLieuRepository;

    public ChatLieuController(ChatLieuRepository chatLieuRepository) {
        this.chatLieuRepository = chatLieuRepository;
    }

    // ── Danh sách chất liệu đang hoạt động ──
    @GetMapping
    public ResponseEntity<List<ChatLieuDTO>> getAll() {
        List<ChatLieuDTO> list = chatLieuRepository
                .findByTrangThaiTrueOrderByIdAsc()
                .stream()
                .map(this::toDTO)
                .toList();
        return ResponseEntity.ok(list);
    }

    // ── Chi tiết 1 chất liệu ──
    @GetMapping("/{id}")
    public ResponseEntity<ChatLieuDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(toDTO(findActive(id)));
    }

    // ── Thêm mới ──
    @PostMapping
    @Transactional
    public ResponseEntity<ChatLieuDTO> create(@Valid @RequestBody ChatLieuDTO dto) {
        String ma = dto.getMaChatLieu().trim();
        if (chatLieuRepository.existsByMaChatLieu(ma)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Mã chất liệu đã tồn tại");
        }

        ChatLieuEntity entity = ChatLieuEntity.builder()
                .maChatLieu(ma)
                .tenChatLieu(dto.getTenChatLieu().trim())
                .moTa(dto.getMoTa())
                .trangThai(true)
                .build();

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(toDTO(chatLieuRepository.save(entity)));
    }

    // ── Cập nhật ──
    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<ChatLieuDTO> update(@PathVariable Integer id,
                                              @Valid @RequestBody ChatLieuDTO dto) {
        ChatLieuEntity entity = findActive(id);

        String ma = dto.getMaChatLieu().trim();
        if (chatLieuRepository.existsByMaChatLieuAndIdNot(ma, id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Mã chất liệu đã tồn tại");
        }

        entity.setMaChatLieu(ma);
        entity.setTenChatLieu(dto.getTenChatLieu().trim());
        entity.setMoTa(dto.getMoTa());

        return ResponseEntity.ok(toDTO(chatLieuRepository.save(entity)));
    }

    // ── Xóa mềm ──
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        ChatLieuEntity entity = findActive(id);
        entity.setTrangThai(false);
        chatLieuRepository.save(entity);
        return ResponseEntity.noContent().build();
    }

    private ChatLieuEntity findActive(Integer id) {
        return chatLieuRepository.findByIdAndTrangThaiTrue(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Không tìm thấy chất liệu"));
    }

    private ChatLieuDTO toDTO(ChatLieuEntity e) {
        return ChatLieuDTO.builder()
                .id(e.getId())
                .maChatLieu(e.getMaChatLieu())
                .tenChatLieu(e.getTenChatLieu())
                .moTa(e.getMoTa())
                .trangThai(e.getTrangThai())
                .build();
    }
}