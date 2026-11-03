package com.example.datn.service;

import com.example.datn.dto.*;
import com.example.datn.entity.GioHangEntity;
import com.example.datn.repository.GioHangRepository;
import com.example.datn.repository.GioHangRepository.GioHangView;
import com.example.datn.repository.KhachHangRepository; // repo có sẵn của bạn
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GioHangService {

    private final GioHangRepository gioHangRepo;
    private final KhachHangRepository khachHangRepo;

    /** Lấy id khách hàng từ người đang đăng nhập (JWT -> email). */
    private Integer currentKhachHangId() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return khachHangRepo.findByEmail(email)
                .map(k -> k.getId().intValue())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.FORBIDDEN, "Tài khoản không phải khách hàng"));
    }

    public List<GioHangView> xemGioHang() {
        return gioHangRepo.findGioHang(currentKhachHangId());
    }

    public long demSoDong() {
        return gioHangRepo.countByKhachHangIdAndTrangThaiTrue(currentKhachHangId());
    }

    @Transactional
    public void them(ThemGioHangRequest req) {
        Integer khId = currentKhachHangId();

        Integer tonKho = gioHangRepo.findTonKho(req.chiTietSanPhamId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Sản phẩm không tồn tại hoặc đã ngừng bán"));

        var existing = gioHangRepo
                .findByKhachHangIdAndChiTietSanPhamIdAndTrangThaiTrue(khId, req.chiTietSanPhamId());

        int soLuongMoi = req.soLuong() + existing.map(GioHangEntity::getSoLuong).orElse(0);
        if (soLuongMoi > tonKho) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Chỉ còn " + tonKho + " sản phẩm trong kho");
        }

        GioHangEntity item = existing.orElseGet(() -> GioHangEntity.builder()
                .khachHangId(khId)
                .chiTietSanPhamId(req.chiTietSanPhamId())
                .trangThai(true)
                .build());
        item.setSoLuong(soLuongMoi);
        gioHangRepo.save(item);
    }

    @Transactional
    public void capNhatSoLuong(Long id, CapNhatGioHangRequest req) {
        Integer khId = currentKhachHangId();
        GioHangEntity item = gioHangRepo.findByIdAndKhachHangIdAndTrangThaiTrue(id, khId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm trong giỏ"));

        if (req.soLuong() == 0) {            // số lượng 0 = xóa khỏi giỏ
            item.setTrangThai(false);
        } else {
            Integer tonKho = gioHangRepo.findTonKho(item.getChiTietSanPhamId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.BAD_REQUEST, "Sản phẩm đã ngừng bán"));
            if (req.soLuong() > tonKho) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Chỉ còn " + tonKho + " sản phẩm trong kho");
            }
            item.setSoLuong(req.soLuong());
        }
        gioHangRepo.save(item);
    }

    @Transactional
    public void xoa(Long id) {
        Integer khId = currentKhachHangId();
        GioHangEntity item = gioHangRepo.findByIdAndKhachHangIdAndTrangThaiTrue(id, khId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm trong giỏ"));
        item.setTrangThai(false);
        gioHangRepo.save(item);
    }

    @Transactional
    public void xoaTatCa() {
        gioHangRepo.clearByKhachHang(currentKhachHangId());
    }
}