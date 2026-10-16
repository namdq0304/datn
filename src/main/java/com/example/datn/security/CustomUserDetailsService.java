package com.example.datn.security;

import com.example.datn.entity.NhanVienEntity;
import com.example.datn.repository.NhanVienRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(CustomUserDetailsService.class);

    @Autowired
    private NhanVienRepository nhanVienRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        logger.info("Đang tìm tài khoản nhân viên với email: {}", email);

        Optional<NhanVienEntity> nvOpt = nhanVienRepository.findByEmail(email);
        if (nvOpt.isEmpty()) {
            logger.warn("Không tìm thấy nhân viên với email: {}", email);
            throw new UsernameNotFoundException("Không tìm thấy nhân viên với email: " + email);
        }

        NhanVienEntity nv = nvOpt.get();

        // Lấy mã vai trò (ví dụ: "ADMIN", "NHANVIEN", "QUANLY")
        String role = (nv.getVaiTro() != null && nv.getVaiTro().getMaVaiTro() != null)
                ? nv.getVaiTro().getMaVaiTro().toUpperCase()
                : "NHANVIEN";

        // Kiểm tra trạng thái hoạt động (true: đang làm việc, false: đã nghỉ/khóa)
        boolean enabled = (nv.getTrangThai() == null || nv.getTrangThai());

        return User.builder()
                .username(nv.getEmail())
                .password(nv.getMatKhau())
                .disabled(!enabled)
                .roles(role) // Spring Security sẽ tự động thêm tiền tố "ROLE_"
                .build();
    }
}
