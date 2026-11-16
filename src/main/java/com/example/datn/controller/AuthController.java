package com.example.datn.controller;

import com.example.datn.entity.KhachHangEntity;
import com.example.datn.entity.NhanVienEntity;
import com.example.datn.repository.KhachHangRepository;
import com.example.datn.repository.NhanVienRepository;
import com.example.datn.security.JwtUtil;
import com.example.datn.security.GoogleTokenVerifier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
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

    @Autowired
    private KhachHangRepository khachHangRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private GoogleTokenVerifier googleTokenVerifier;

    // =========================================================================
    // I. PHẦN DÀNH CHO NHÂN VIÊN / QUẢN TRỊ (ADMIN & NHÂN VIÊN)
    // =========================================================================

    /**
     * API: Đăng nhập Quản Trị / Nhân Viên
     * URL: POST http://localhost:8080/api/auth/admin/login (hoặc /api/auth/login)
     */
    @PostMapping({"/admin/login", "/login"})
    public ResponseEntity<?> loginAdmin(
            @RequestParam String username,
            @RequestParam String password
    ) {

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );
        } catch (BadCredentialsException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Sai tên đăng nhập hoặc mật khẩu!");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Lỗi xác thực: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        // Kiểm tra xem có phải tài khoản trong bảng Nhân Viên không
        Optional<NhanVienEntity> nvOpt = nhanVienRepository.findByEmail(username);
        if (nvOpt.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Tài khoản này không có quyền truy cập hệ thống quản trị!");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
        }

        NhanVienEntity nv = nvOpt.get();

        // Kiểm tra trạng thái hoạt động
        if (nv.getTrangThai() != null && !nv.getTrangThai()) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Tài khoản nhân viên này đã bị khóa hoặc ngừng hoạt động!");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
        }

        // Lấy thông tin vai trò
        String maVaiTro = (nv.getVaiTro() != null && nv.getVaiTro().getMaVaiTro() != null)
                ? nv.getVaiTro().getMaVaiTro().toUpperCase()
                : "NHANVIEN";
        String tenVaiTro = (nv.getVaiTro() != null && nv.getVaiTro().getTenVaiTro() != null)
                ? nv.getVaiTro().getTenVaiTro()
                : "Nhân viên";
        Long idVaiTro = (nv.getVaiTro() != null) ? nv.getVaiTro().getId() : null;

        // Sinh JWT Token (Access Token và Refresh Token 7 ngày)
        String accessToken = jwtUtil.generateToken(username, maVaiTro);
        String refreshToken = jwtUtil.generateRefreshToken(username);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Đăng nhập nhân viên thành công!");
        response.put("id", nv.getId());
        response.put("maNhanVien", nv.getMaNhanVien());
        response.put("hoTen", nv.getHoTen());
        response.put("email", nv.getEmail());
        response.put("sdt", nv.getSdt());
        response.put("role", maVaiTro);
        response.put("tenVaiTro", tenVaiTro);
        response.put("idVaiTro", idVaiTro);
        response.put("accessToken", accessToken);
        response.put("refreshToken", refreshToken);

        logger.info("Nhân viên {} đăng nhập thành công, role={}", username, maVaiTro);
        return ResponseEntity.ok(response);
    }

    /**
     * API: Lấy thông tin chi tiết Nhân Viên đang đăng nhập
     * URL: GET http://localhost:8080/api/auth/admin/me
     * Header: Authorization: Bearer <accessToken>
     */
    @GetMapping("/admin/me")
    public ResponseEntity<?> getAdminProfile(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", "Chưa đăng nhập!"));
        }

        String email = authentication.getName();
        Optional<NhanVienEntity> nvOpt = nhanVienRepository.findByEmail(email);
        if (nvOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("message", "Không tìm thấy thông tin nhân viên!"));
        }

        NhanVienEntity nv = nvOpt.get();
        Map<String, Object> res = new HashMap<>();
        res.put("id", nv.getId());
        res.put("maNhanVien", nv.getMaNhanVien());
        res.put("hoTen", nv.getHoTen());
        res.put("email", nv.getEmail());
        res.put("sdt", nv.getSdt());
        res.put("trangThai", nv.getTrangThai());

        if (nv.getVaiTro() != null) {
            Map<String, Object> vaiTroInfo = new HashMap<>();
            vaiTroInfo.put("id", nv.getVaiTro().getId());
            vaiTroInfo.put("maVaiTro", nv.getVaiTro().getMaVaiTro());
            vaiTroInfo.put("tenVaiTro", nv.getVaiTro().getTenVaiTro());
            vaiTroInfo.put("moTa", nv.getVaiTro().getMoTa());
            res.put("vaiTro", vaiTroInfo);
            res.put("role", nv.getVaiTro().getMaVaiTro());
            res.put("tenVaiTro", nv.getVaiTro().getTenVaiTro());
        }

        return ResponseEntity.ok(res);
    }

    // =========================================================================
    // II. PHẦN DÀNH CHO KHÁCH HÀNG (CUSTOMER)
    // =========================================================================

    /**
     * API: Đăng nhập Khách Hàng
     * URL: POST http://localhost:8080/api/auth/customer/login
     */
    @PostMapping("/customer/login")
    public ResponseEntity<?> loginCustomer(
            @RequestParam String username,
            @RequestParam String password
    ) {
        logger.info("Yêu cầu đăng nhập cho khách hàng: {}", username);

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );
        } catch (BadCredentialsException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Sai email hoặc mật khẩu!");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Lỗi xác thực: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        // Tìm trong bảng Khách Hàng
        Optional<KhachHangEntity> khOpt = khachHangRepository.findByEmail(username);
        if (khOpt.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Không tìm thấy thông tin tài khoản khách hàng!");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        KhachHangEntity kh = khOpt.get();

        // Kiểm tra trạng thái hoạt động của khách hàng
        if (kh.getTrangThai() != null && !kh.getTrangThai()) {
            return loiKhachHang(HttpStatus.FORBIDDEN, "Tài khoản khách hàng này đã bị khóa!", null);
        }

        logger.info("Khách hàng {} đăng nhập thành công", username);
        return ResponseEntity.ok(phienKhachHang(kh, "Đăng nhập khách hàng thành công!"));
    }

    private static final java.util.regex.Pattern EMAIL_REGEX =
            java.util.regex.Pattern.compile("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    private static final java.util.regex.Pattern SDT_REGEX = java.util.regex.Pattern.compile("^0\\d{9}$");

    /**
     * API: Đăng ký tài khoản Khách Hàng mới — đăng ký xong ĐĂNG NHẬP LUÔN (trả accessToken như /customer/login).
     * URL: POST http://localhost:8080/api/auth/customer/register
     * Lỗi theo ô: { success:false, message, errors: { email | password | hoTen | sdt } }
     */
    @PostMapping("/customer/register")
    public ResponseEntity<?> registerCustomer(
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String password,
            @RequestParam(required = false) String hoTen,
            @RequestParam(required = false) String sdt
    ) {
        String em = email == null ? "" : email.trim().toLowerCase();
        String ten = hoTen == null ? "" : hoTen.trim().replaceAll("\\s+", " ");
        String dt = sdt == null || sdt.isBlank() ? null : sdt.trim();
        logger.info("Yêu cầu đăng ký khách hàng mới: email={}", em);

        Map<String, String> errors = new java.util.LinkedHashMap<>();
        if (ten.isEmpty()) errors.put("hoTen", "Vui lòng nhập họ tên!");
        else if (ten.length() > 100) errors.put("hoTen", "Họ tên tối đa 100 ký tự!");
        if (em.isEmpty()) errors.put("email", "Vui lòng nhập email!");
        else if (em.length() > 100 || !EMAIL_REGEX.matcher(em).matches()) errors.put("email", "Email không đúng định dạng!");
        else if (khachHangRepository.existsByEmail(em) || nhanVienRepository.existsByEmail(em))
            errors.put("email", "Email này đã được sử dụng!");
        if (dt != null) {
            if (!SDT_REGEX.matcher(dt).matches()) errors.put("sdt", "Số điện thoại gồm 10 chữ số, bắt đầu bằng 0!");
            else if (khachHangRepository.existsBySdt(dt)) errors.put("sdt", "Số điện thoại này đã được sử dụng!");
        }
        if (password == null || password.length() < 6) errors.put("password", "Mật khẩu phải có ít nhất 6 ký tự!");
        else if (password.length() > 100) errors.put("password", "Mật khẩu tối đa 100 ký tự!");
        if (!errors.isEmpty()) {
            return loiKhachHang(HttpStatus.BAD_REQUEST, errors.values().iterator().next(), errors);
        }

        KhachHangEntity kh = khachHangRepository.save(KhachHangEntity.builder()
                .maKhachHang(sinhMaKhachHang())
                .hoTen(ten)
                .email(em)
                .sdt(dt)
                .matKhau(passwordEncoder.encode(password)) // Mã hóa mật khẩu
                .trangThai(true)
                .build());

        logger.info("Đăng ký khách hàng {} thành công ({})", kh.getMaKhachHang(), em);
        return ResponseEntity.ok(phienKhachHang(kh, "Đăng ký thành công! Chào mừng bạn đến với VibeFlow."));
    }

    /**
     * API: Đăng nhập / đăng ký Khách Hàng bằng Google (Google Identity Services).
     * URL: POST http://localhost:8080/api/auth/customer/google   body: { "credential": "<Google ID token>" }
     * - Email đã có tài khoản khách hàng → đăng nhập vào tài khoản đó.
     * - Chưa có → tự tạo tài khoản khách hàng (mật khẩu ngẫu nhiên, chỉ đăng nhập qua Google).
     */
    @PostMapping("/customer/google")
    public ResponseEntity<?> loginGoogle(@RequestBody(required = false) Map<String, String> body) {
        GoogleTokenVerifier.GoogleUser gu = googleTokenVerifier.xacMinh(body == null ? null : body.get("credential"));

        if (nhanVienRepository.existsByEmail(gu.email())) {
            return loiKhachHang(HttpStatus.CONFLICT,
                    "Email này là tài khoản nhân viên — vui lòng đăng nhập ở Cổng Nhân Viên.", null);
        }

        KhachHangEntity kh = khachHangRepository.findByEmail(gu.email()).orElse(null);
        boolean moi = kh == null;
        if (moi) {
            String ten = gu.hoTen() == null || gu.hoTen().isBlank() ? gu.email().split("@")[0] : gu.hoTen().trim();
            kh = khachHangRepository.save(KhachHangEntity.builder()
                    .maKhachHang(sinhMaKhachHang())
                    .hoTen(ten.length() > 100 ? ten.substring(0, 100) : ten)
                    .email(gu.email())
                    // Mật khẩu ngẫu nhiên: tài khoản tạo qua Google không đăng nhập bằng mật khẩu được
                    .matKhau(passwordEncoder.encode(java.util.UUID.randomUUID().toString()))
                    .trangThai(true)
                    .build());
            logger.info("Tạo khách hàng mới qua Google: {} ({})", kh.getMaKhachHang(), gu.email());
        }
        if (kh.getTrangThai() != null && !kh.getTrangThai()) {
            return loiKhachHang(HttpStatus.FORBIDDEN, "Tài khoản khách hàng này đã bị khóa!", null);
        }

        Map<String, Object> res = phienKhachHang(kh, moi
                ? "Đã tạo tài khoản bằng Google. Chào mừng bạn đến với VibeFlow!"
                : "Đăng nhập bằng Google thành công!");
        res.put("taiKhoanMoi", moi);
        if (gu.anh() != null) res.put("anhDaiDien", gu.anh());
        return ResponseEntity.ok(res);
    }

    /** Phản hồi đăng nhập khách hàng dùng chung (mật khẩu / đăng ký / Google): thông tin + JWT. */
    private Map<String, Object> phienKhachHang(KhachHangEntity kh, String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", message);
        response.put("id", kh.getId());
        response.put("maKhachHang", kh.getMaKhachHang());
        response.put("hoTen", kh.getHoTen());
        response.put("email", kh.getEmail());
        response.put("sdt", kh.getSdt());
        response.put("gioiTinh", kh.getGioiTinh());
        response.put("ngaySinh", kh.getNgaySinh());
        response.put("role", "KHACH_HANG");
        response.put("accessToken", jwtUtil.generateToken(kh.getEmail(), "KHACH_HANG"));
        response.put("refreshToken", jwtUtil.generateRefreshToken(kh.getEmail()));
        return response;
    }

    private ResponseEntity<Map<String, Object>> loiKhachHang(HttpStatus status, String message, Map<String, String> errors) {
        Map<String, Object> error = new HashMap<>();
        error.put("success", false);
        error.put("message", message);
        if (errors != null) error.put("errors", errors);
        return ResponseEntity.status(status).body(error);
    }

    /** Mã khách hàng KH + 6 số, không trùng. */
    private String sinhMaKhachHang() {
        java.security.SecureRandom rd = new java.security.SecureRandom();
        for (int i = 0; i < 20; i++) {
            String ma = "KH" + (100000 + rd.nextInt(900000));
            if (!khachHangRepository.existsByMaKhachHang(ma)) return ma;
        }
        throw new com.example.datn.exception.ConflictException("Không sinh được mã khách hàng, vui lòng thử lại!");
    }

    /**
     * API: Lấy thông tin chi tiết Khách Hàng đang đăng nhập
     * URL: GET http://localhost:8080/api/auth/customer/me
     * Header: Authorization: Bearer <accessToken>
     */
    @GetMapping("/customer/me")
    public ResponseEntity<?> getCustomerProfile(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", "Chưa đăng nhập!"));
        }

        String email = authentication.getName();
        Optional<KhachHangEntity> khOpt = khachHangRepository.findByEmail(email);
        if (khOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("message", "Không tìm thấy thông tin khách hàng!"));
        }

        KhachHangEntity kh = khOpt.get();
        Map<String, Object> res = new HashMap<>();
        res.put("id", kh.getId());
        res.put("maKhachHang", kh.getMaKhachHang());
        res.put("hoTen", kh.getHoTen());
        res.put("email", kh.getEmail());
        res.put("sdt", kh.getSdt());
        res.put("gioiTinh", kh.getGioiTinh());
        res.put("ngaySinh", kh.getNgaySinh());
        res.put("trangThai", kh.getTrangThai());
        res.put("role", "KHACH_HANG");

        return ResponseEntity.ok(res);
    }

    // =========================================================================
    // III. API CHUNG (DÙNG CHO CẢ 2 BÊN)
    // =========================================================================

    /**
     * API: Lấy thông tin người dùng hiện tại (Tự nhận diện Nhân viên hoặc Khách hàng)
     * URL: GET http://localhost:8080/api/auth/me
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", "Chưa đăng nhập hoặc Token không hợp lệ!"));
        }

        String email = authentication.getName();

        // 1. Kiểm tra Nhân Viên trước
        Optional<NhanVienEntity> nvOpt = nhanVienRepository.findByEmail(email);
        if (nvOpt.isPresent()) {
            return getAdminProfile(authentication);
        }

        // 2. Kiểm tra Khách Hàng
        Optional<KhachHangEntity> khOpt = khachHangRepository.findByEmail(email);
        if (khOpt.isPresent()) {
            return getCustomerProfile(authentication);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Collections.singletonMap("message", "Không tìm thấy thông tin tài khoản!"));
    }

    /**
     * API: Cấp lại Access Token mới bằng Refresh Token
     * URL: POST http://localhost:8080/api/auth/refresh
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestParam String refreshToken) {
        try {
            String email = jwtUtil.extractUsername(refreshToken);
            if (email != null && !jwtUtil.isTokenExpired(refreshToken)) {

                // Kiểm tra Nhân viên
                Optional<NhanVienEntity> nvOpt = nhanVienRepository.findByEmail(email);
                if (nvOpt.isPresent()) {
                    String role = (nvOpt.get().getVaiTro() != null && nvOpt.get().getVaiTro().getMaVaiTro() != null)
                            ? nvOpt.get().getVaiTro().getMaVaiTro()
                            : "NHANVIEN";
                    String newAccessToken = jwtUtil.generateToken(email, role);

                    Map<String, Object> res = new HashMap<>();
                    res.put("success", true);
                    res.put("accessToken", newAccessToken);
                    return ResponseEntity.ok(res);
                }

                // Kiểm tra Khách hàng
                Optional<KhachHangEntity> khOpt = khachHangRepository.findByEmail(email);
                if (khOpt.isPresent()) {
                    String newAccessToken = jwtUtil.generateToken(email, "KHACH_HANG");

                    Map<String, Object> res = new HashMap<>();
                    res.put("success", true);
                    res.put("accessToken", newAccessToken);
                    return ResponseEntity.ok(res);
                }
            }
        } catch (Exception e) {
            logger.warn("Refresh token không hợp lệ: {}", e.getMessage());
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Collections.singletonMap("message", "Refresh token không hợp lệ hoặc đã hết hạn!"));
    }
}
