package com.example.datn.controller;

import com.example.datn.entity.NhanVienEntity;
import com.example.datn.repository.NhanVienRepository;
import com.example.datn.security.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private NhanVienRepository nhanVienRepository;

    /**
     * API 1: Đăng nhập Nhân Viên và trả về JWT Token
     * URL: POST http://localhost:8080/api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestParam String username,
            @RequestParam String password
    ) {
        logger.info("Yêu cầu đăng nhập cho tài khoản: {}", username);

        Authentication authentication;
        try {
            // 1. Xác thực tài khoản & mật khẩu qua Spring Security
                authentication = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(username, password)
                );
        } catch (BadCredentialsException e) {
            logger.warn("Đăng nhập thất bại: Sai thông tin đăng nhập cho user {}", username);
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Sai tên đăng nhập hoặc mật khẩu!");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        } catch (Exception e) {
            logger.error("Lỗi xác thực: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Lỗi xác thực: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        // 2. Tìm thông tin nhân viên trong CSDL
        Optional<NhanVienEntity> nvOpt = nhanVienRepository.findByEmail(username);
        if (nvOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", "Không tìm thấy thông tin nhân viên!"));
        }

        NhanVienEntity nv = nvOpt.get();

        // Kiểm tra trạng thái hoạt động (nếu trangThai == false thì chặn)
        if (nv.getTrangThai() != null && !nv.getTrangThai()) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Tài khoản nhân viên này đã bị khóa hoặc ngừng hoạt động!");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
        }

        // Lấy thông tin vai trò
        String maVaiTro = (nv.getVaiTro() != null && nv.getVaiTro().getMaVaiTro() != null)
                ? nv.getVaiTro().getMaVaiTro()
                : "NHANVIEN";
        String tenVaiTro = (nv.getVaiTro() != null && nv.getVaiTro().getTenVaiTro() != null)
                ? nv.getVaiTro().getTenVaiTro()
                : "Nhân viên";
        Long idVaiTro = (nv.getVaiTro() != null) ? nv.getVaiTro().getId() : null;

        // 3. Sinh JWT Token (Access Token và Refresh Token 7 ngày)
        String accessToken = jwtUtil.generateToken(username, maVaiTro);
        String refreshToken = jwtUtil.generateRefreshToken(username);

        // 4. Trả về kết quả JSON
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Đăng nhập thành công!");
        response.put("id", nv.getId());
        response.put("maNhanVien", nv.getMaNhanVien());
        response.put("hoTen", nv.getHoTen());
        response.put("email", nv.getEmail());
        response.put("sdt", nv.getSdt());
        response.put("role", maVaiTro);          // Ví dụ: "ADMIN", "QUANLY", "NHANVIEN"
        response.put("tenVaiTro", tenVaiTro);  // Ví dụ: "Quản trị viên", "Nhân viên"
        response.put("idVaiTro", idVaiTro);
        response.put("accessToken", accessToken);
        response.put("refreshToken", refreshToken); // <-- Trả thêm Refresh Token hạn 7 ngày

        logger.info("Nhân viên {} đăng nhập thành công, vai trò: {}", username, maVaiTro);
        return ResponseEntity.ok(response);
    }

    /**
     * API Cấp lại Access Token mới bằng Refresh Token
     * URL: POST http://localhost:8080/api/auth/refresh
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestParam String refreshToken) {
        try {
            String email = jwtUtil.extractUsername(refreshToken);
            if (email != null && !jwtUtil.isTokenExpired(refreshToken)) {
                Optional<NhanVienEntity> nvOpt = nhanVienRepository.findByEmail(email);
                if (nvOpt.isPresent()) {
                    NhanVienEntity nv = nvOpt.get();
                    String role = (nv.getVaiTro() != null && nv.getVaiTro().getMaVaiTro() != null)
                            ? nv.getVaiTro().getMaVaiTro()
                            : "NHANVIEN";

                    // Cấp lại access token mới
                    String newAccessToken = jwtUtil.generateToken(email, role);

                    Map<String, Object> res = new HashMap<>();
                    res.put("success", true);
                    res.put("accessToken", newAccessToken);
                    res.put("message", "Cấp lại token thành công!");
                    return ResponseEntity.ok(res);
                }
            }
        } catch (Exception e) {
            logger.warn("Refresh token không hợp lệ: {}", e.getMessage());
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Collections.singletonMap("message", "Refresh token không hợp lệ hoặc đã hết hạn!"));
    }

    /**
     * API 2: Lấy thông tin chi tiết Nhân Viên sau khi đăng nhập (kèm vai trò)
     * URL: GET http://localhost:8080/api/auth/me
     * Header: Authorization: Bearer <accessToken>
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", "Chưa đăng nhập hoặc Token không hợp lệ!"));
        }

        String email = authentication.getName();

        Optional<NhanVienEntity> nvOpt = nhanVienRepository.findByEmail(email);
        if (nvOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("message", "Không tìm thấy thông tin nhân viên!"));
        }

        NhanVienEntity nv = nvOpt.get();

        String maVaiTro = (nv.getVaiTro() != null && nv.getVaiTro().getMaVaiTro() != null)
                ? nv.getVaiTro().getMaVaiTro()
                : "NHANVIEN";
        String tenVaiTro = (nv.getVaiTro() != null && nv.getVaiTro().getTenVaiTro() != null)
                ? nv.getVaiTro().getTenVaiTro()
                : "Nhân viên";

        Map<String, Object> res = new HashMap<>();
        res.put("id", nv.getId());
        res.put("maNhanVien", nv.getMaNhanVien());
        res.put("hoTen", nv.getHoTen());
        res.put("email", nv.getEmail());
        res.put("sdt", nv.getSdt());
        res.put("trangThai", nv.getTrangThai());

        // Thông tin vai trò chi tiết
        Map<String, Object> vaiTroInfo = new HashMap<>();
        if (nv.getVaiTro() != null) {
            vaiTroInfo.put("id", nv.getVaiTro().getId());
            vaiTroInfo.put("maVaiTro", nv.getVaiTro().getMaVaiTro());
            vaiTroInfo.put("tenVaiTro", nv.getVaiTro().getTenVaiTro());
            vaiTroInfo.put("moTa", nv.getVaiTro().getMoTa());
        } else {
            vaiTroInfo.put("maVaiTro", "NHANVIEN");
            vaiTroInfo.put("tenVaiTro", "Nhân viên");
        }
        res.put("vaiTro", vaiTroInfo);
        res.put("role", maVaiTro);
        res.put("tenVaiTro", tenVaiTro);

        return ResponseEntity.ok(res);
    }
}
