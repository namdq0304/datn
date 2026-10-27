package com.example.datn.security;

import com.example.datn.security.JwtAuthenticationFilter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired(required = false)
    private JwtAuthenticationFilter jwtAuthFilter; // Bộ lọc JWT đã tạo ở bước trước

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Tắt CSRF (vì REST API dùng Token không cần CSRF)
                .csrf(csrf -> csrf.disable())

                // 2. Tắt Session (vì JWT là Stateless - không lưu trạng thái trên server)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // 3. Phân quyền các đường dẫn
                .authorizeHttpRequests(auth -> auth
                        // Các đường dẫn đăng nhập, đăng ký, quên mật khẩu được phép vào tự do
                        .requestMatchers("/auth/**", "/api/auth/**").permitAll()
                        // Khu quản trị (FE /admin/*, API /api/admin/*): Quản lý nhân viên chỉ ADMIN (ADR-003)
                        .requestMatchers("/admin/nhan-vien/**", "/admin/vai-tro/**").hasRole("ADMIN")
                        // Khóa / mở khóa khách hàng chỉ ADMIN (ADR-002)
                        .requestMatchers(HttpMethod.PATCH, "/admin/khach-hang/*/trang-thai").hasRole("ADMIN")
                        .requestMatchers("/admin/**").hasAnyRole("ADMIN", "NHAN_VIEN")
                        // Tất cả các request còn lại bắt buộc phải có Token hợp lệ
                        .anyRequest().authenticated()
                )

                // Trả lỗi dạng JSON để FE (axiosClient) đọc được message và tự refresh token khi 401
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((req, res, e) ->
                                writeJson(res, HttpServletResponse.SC_UNAUTHORIZED, "Chưa đăng nhập hoặc phiên đã hết hạn!"))
                        .accessDeniedHandler((req, res, e) ->
                                writeJson(res, HttpServletResponse.SC_FORBIDDEN, "Bạn không có quyền truy cập chức năng này!"))
                );

        // 4. Nếu đã có JwtAuthenticationFilter, thêm vào trước UsernamePasswordAuthenticationFilter
        if (jwtAuthFilter != null) {
            http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        }

        return http.build();
    }

    private static void writeJson(HttpServletResponse res, int status, String message) throws IOException {
        res.setStatus(status);
        res.setContentType("application/json;charset=UTF-8");
        res.getWriter().write("{\"success\":false,\"message\":\"" + message + "\"}");
    }

    // 5. Khởi tạo Bean mã hóa mật khẩu (dùng khi đăng ký / kiểm tra login)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new CustomPasswordEncoder();
    }

    // 6. Khởi tạo Bean AuthenticationManager (dùng ở AuthController để xác thực username/password)
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
