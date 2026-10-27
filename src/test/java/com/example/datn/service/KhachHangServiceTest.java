package com.example.datn.service;

import com.example.datn.dto.khachhang.KhachHangRequest;
import com.example.datn.entity.KhachHangEntity;
import com.example.datn.exception.ConflictException;
import com.example.datn.exception.NotFoundException;
import com.example.datn.repository.KhachHangRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

/**
 * Quy tắc ADR-002: mật khẩu mặc định "1", email (không phân biệt hoa thường) + SĐT không trùng,
 * PUT không đổi trạng thái, mã KH tuần tự.
 */
@ExtendWith(MockitoExtension.class)
class KhachHangServiceTest {

    @Mock
    private KhachHangRepository khachHangRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @InjectMocks
    private KhachHangService service;

    private static KhachHangRequest req(String email, Boolean trangThai) {
        return new KhachHangRequest(" Nguyễn Minh Anh ", "0912345671", email, null, false, trangThai);
    }

    @Test
    void create_matKhauMacDinh1_emailChuThuong_maTuanTu() {
        when(khachHangRepository.count()).thenReturn(1L);
        when(khachHangRepository.existsByMaKhachHang("KH0002")).thenReturn(true); // mã đã có → nhảy sang KH0003
        when(passwordEncoder.encode("1")).thenReturn("$2a$encoded-1");
        when(khachHangRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        var res = service.create(req("MinhAnh@Gmail.com", null));

        assertThat(res.maKhachHang()).isEqualTo("KH0003");
        assertThat(res.email()).isEqualTo("minhanh@gmail.com");
        assertThat(res.hoTen()).isEqualTo("Nguyễn Minh Anh");
        assertThat(res.trangThai()).isTrue();
    }

    @Test
    void create_trungEmail_409() {
        when(khachHangRepository.existsByEmail("minhanh@gmail.com")).thenReturn(true);
        assertThatThrownBy(() -> service.create(req("MINHANH@gmail.com", true)))
                .isInstanceOf(ConflictException.class).hasMessage("Email đã được sử dụng!");
    }

    @Test
    void create_trungSdt_409() {
        when(khachHangRepository.existsBySdt("0912345671")).thenReturn(true);
        assertThatThrownBy(() -> service.create(req(null, true)))
                .isInstanceOf(ConflictException.class).hasMessage("Số điện thoại đã được sử dụng!");
    }

    @Test
    void update_khongDoiTrangThai() {
        KhachHangEntity kh = KhachHangEntity.builder().id(5L).maKhachHang("KH0005").hoTen("Cũ").sdt("0900000000").trangThai(true).build();
        when(khachHangRepository.findById(5L)).thenReturn(Optional.of(kh));

        service.update(5L, req("", false));

        assertThat(kh.getTrangThai()).isTrue();
        assertThat(kh.getEmail()).isNull();
        assertThat(kh.getHoTen()).isEqualTo("Nguyễn Minh Anh");
    }

    @Test
    void update_khongTonTai_404() {
        when(khachHangRepository.findById(99L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> service.update(99L, req(null, true))).isInstanceOf(NotFoundException.class);
    }
}
