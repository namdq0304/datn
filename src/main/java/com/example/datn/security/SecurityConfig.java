package com.example.datn.security;

import com.example.datn.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
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
                        // Tất cả các request còn lại bắt buộc phải có Token hợp lệ
                        .anyRequest().authenticated()
                );

        // 4. Nếu đã có JwtAuthenticationFilter, thêm vào trước UsernamePasswordAuthenticationFilter
        if (jwtAuthFilter != null) {
            http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        }

        return http.build();
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
