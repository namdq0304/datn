package com.example.datn.service;

import com.example.datn.dto.nhanvien.NhanVienRequest;
import com.example.datn.entity.NhanVienEntity;
import com.example.datn.entity.VaiTroEntity;
import com.example.datn.exception.BadRequestException;
import com.example.datn.exception.ConflictException;
import com.example.datn.repository.NhanVienRepository;
import com.example.datn.repository.VaiTroRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Quy tắc ADR-003: mật khẩu mặc định "1", không trùng email/SĐT, chặn tự khóa / tự hạ quyền /
 * tự đặt lại mật khẩu, chặn khóa / hạ quyền quản trị viên hoạt động cuối cùng.
 */
@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class NhanVienServiceTest {

    @Mock
    private NhanVienRepository nhanVienRepository;
    @Mock
    private VaiTroRepository vaiTroRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @InjectMocks
    private NhanVienService service;

    private final VaiTroEntity admin = VaiTroEntity.builder().id(1L).maVaiTro("ADMIN").tenVaiTro("Quản trị viên").build();
    private final VaiTroEntity nhanVien = VaiTroEntity.builder().id(2L).maVaiTro("NHAN_VIEN").tenVaiTro("Nhân viên").build();
    private final VaiTroEntity khachHang = VaiTroEntity.builder().id(3L).maVaiTro("KHACH_HANG").tenVaiTro("Khách hàng").build();

    @BeforeEach
    void setUp() {
        when(vaiTroRepository.findById(1L)).thenReturn(Optional.of(admin));
        when(vaiTroRepository.findById(2L)).thenReturn(Optional.of(nhanVien));
        when(vaiTroRepository.findById(3L)).thenReturn(Optional.of(khachHang));
        when(passwordEncoder.encode("1")).thenReturn("$2a$encoded-1");
        when(nhanVienRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
    }

    private NhanVienEntity nv(long id, String email, VaiTroEntity vt, boolean active) {
        NhanVienEntity e = NhanVienEntity.builder().id(id).maNhanVien("NV000" + id).hoTen("NV " + id)
                .sdt("090000000" + id).email(email).vaiTro(vt).trangThai(active).matKhau("x").build();
        when(nhanVienRepository.findById(id)).thenReturn(Optional.of(e));
        return e;
    }

    private static NhanVienRequest req(long vaiTroId, Boolean trangThai) {
        return new NhanVienRequest("Tên Mới", "0911111111", "a@vibeflow.com", vaiTroId, trangThai);
    }

    @Test
    void create_datMatKhauMacDinh1_vaSinhMaNV() {
        when(nhanVienRepository.count()).thenReturn(2L);
        var res = service.create(new NhanVienRequest("Lê Minh Quân", "0934567812", "Quan.Le@VibeFlow.com", 2L, null));
        assertThat(res.maNhanVien()).isEqualTo("NV0003");
        assertThat(res.email()).isEqualTo("quan.le@vibeflow.com");
        assertThat(res.trangThai()).isTrue();
        verify(passwordEncoder).encode("1");
    }

    @Test
    void create_trungEmail_409() {
        when(nhanVienRepository.existsByEmail("a@vibeflow.com")).thenReturn(true);
        assertThatThrownBy(() -> service.create(req(2L, true)))
                .isInstanceOf(ConflictException.class).hasMessage("Email đã được sử dụng!");
    }

    @Test
    void create_trungSdt_409() {
        when(nhanVienRepository.existsBySdt("0911111111")).thenReturn(true);
        assertThatThrownBy(() -> service.create(req(2L, true)))
                .isInstanceOf(ConflictException.class).hasMessage("Số điện thoại đã được sử dụng!");
    }

    @Test
    void create_vaiTroKhachHang_400() {
        assertThatThrownBy(() -> service.create(req(3L, true)))
                .isInstanceOf(BadRequestException.class).hasMessage("Vai trò không hợp lệ!");
    }

    @Test
    void updateTrangThai_tuKhoaChinhMinh_409() {
        nv(1, "admin@vibeflow.com", admin, true);
        when(nhanVienRepository.countByVaiTro_MaVaiTroAndTrangThai("ADMIN", true)).thenReturn(2L);
        assertThatThrownBy(() -> service.updateTrangThai(1L, false, "ADMIN@vibeflow.com"))
                .isInstanceOf(ConflictException.class).hasMessage("Không thể khóa tài khoản đang đăng nhập!");
    }

    @Test
    void updateTrangThai_khoaAdminCuoiCung_409() {
        nv(4, "trang@vibeflow.com", admin, true);
        when(nhanVienRepository.countByVaiTro_MaVaiTroAndTrangThai("ADMIN", true)).thenReturn(1L);
        assertThatThrownBy(() -> service.updateTrangThai(4L, false, "other@vibeflow.com"))
                .isInstanceOf(ConflictException.class).hasMessage("Không thể khóa quản trị viên cuối cùng!");
    }

    @Test
    void updateTrangThai_khoaAdminKhiConAdminKhac_ok() {
        NhanVienEntity target = nv(4, "trang@vibeflow.com", admin, true);
        when(nhanVienRepository.countByVaiTro_MaVaiTroAndTrangThai("ADMIN", true)).thenReturn(2L);
        service.updateTrangThai(4L, false, "admin@vibeflow.com");
        assertThat(target.getTrangThai()).isFalse();
    }

    @Test
    void updateTrangThai_moKhoaChinhMinh_khongBiChan() {
        NhanVienEntity self = nv(1, "admin@vibeflow.com", admin, false);
        service.updateTrangThai(1L, true, "admin@vibeflow.com");
        assertThat(self.getTrangThai()).isTrue();
    }

    @Test
    void update_tuHaQuyenChinhMinh_409() {
        nv(1, "admin@vibeflow.com", admin, true);
        assertThatThrownBy(() -> service.update(1L, req(2L, true), "admin@vibeflow.com"))
                .isInstanceOf(ConflictException.class).hasMessageContaining("đổi vai trò");
    }

    @Test
    void update_chinhMinhGiuNguyenVaiTroVaTrangThai_ok() {
        NhanVienEntity self = nv(1, "admin@vibeflow.com", admin, true);
        service.update(1L, req(1L, true), "admin@vibeflow.com");
        assertThat(self.getHoTen()).isEqualTo("Tên Mới");
    }

    @Test
    void update_haQuyenAdminCuoiCung_409() {
        nv(4, "trang@vibeflow.com", admin, true);
        when(nhanVienRepository.countByVaiTro_MaVaiTroAndTrangThai("ADMIN", true)).thenReturn(1L);
        assertThatThrownBy(() -> service.update(4L, req(2L, true), "other@vibeflow.com"))
                .isInstanceOf(ConflictException.class).hasMessage("Không thể khóa quản trị viên cuối cùng!");
    }

    @Test
    void update_trungSdtVoiNguoiKhac_409() {
        nv(5, "x@vibeflow.com", nhanVien, true);
        when(nhanVienRepository.existsBySdtAndIdNot(anyString(), anyLong())).thenReturn(true);
        assertThatThrownBy(() -> service.update(5L, req(2L, true), "admin@vibeflow.com"))
                .isInstanceOf(ConflictException.class).hasMessage("Số điện thoại đã được sử dụng!");
    }

    @Test
    void resetMatKhau_nguoiKhac_ve1() {
        NhanVienEntity target = nv(5, "x@vibeflow.com", nhanVien, true);
        service.resetMatKhau(5L, "admin@vibeflow.com");
        assertThat(target.getMatKhau()).isEqualTo("$2a$encoded-1");
    }

    @Test
    void resetMatKhau_chinhMinh_409() {
        nv(1, "admin@vibeflow.com", admin, true);
        assertThatThrownBy(() -> service.resetMatKhau(1L, "admin@vibeflow.com"))
                .isInstanceOf(ConflictException.class);
        verify(passwordEncoder, never()).encode("1");
    }
}
