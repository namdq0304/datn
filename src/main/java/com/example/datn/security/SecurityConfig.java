package com.example.datn.security;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerExecutionChain;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    /**
     * Ngăn Spring Boot tự đăng ký JwtAuthenticationFilter như servlet filter thông thường.
     * Filter này chỉ nên chạy trong Security filter chain, không phải ngoài.
     * Nếu không disable, filter bị chạy 2 lần và gây ra 401 ngay cả khi token hợp lệ.
     */
    @Bean
    public FilterRegistrationBean<JwtAuthenticationFilter> jwtFilterRegistration() {
        FilterRegistrationBean<JwtAuthenticationFilter> reg = new FilterRegistrationBean<>(jwtAuthFilter);
        reg.setEnabled(false);
        return reg;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http
    , @Qualifier("requestMappingHandlerMapping") RequestMappingHandlerMapping handlerMapping
    ) throws Exception {
//     Request nào trỏ tới method có @PublicApi thì cho qua
        RequestMatcher publicApiMatcher = request -> {
            try {
                HandlerExecutionChain chain = handlerMapping.getHandler(request);
                return chain != null
                        && chain.getHandler() instanceof HandlerMethod hm
                        && hm.hasMethodAnnotation(PublicApi.class);
            } catch (Exception e) {
                return false;
            }
        };

        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json;charset=UTF-8");
                    response.getWriter().write(
                        "{\"success\":false,\"status\":401," +
                        "\"message\":\"Chưa xác thực, vui lòng đăng nhập!\"}"
                    );
                })
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.setContentType("application/json;charset=UTF-8");
                    response.getWriter().write(
                        "{\"success\":false,\"status\":403," +
                        "\"message\":\"Bạn không có quyền thực hiện thao tác này!\"}"
                    );
                })
            )

                .authorizeHttpRequests(auth -> auth
                        // 1. Endpoint xác thực & tài nguyên ảnh public
                        .requestMatchers("/auth/**", "/hinh-anh/file/**", "/error").permitAll()

                        // 2. Cho phép khách hàng xem công khai (GET) chất liệu, loại giày (danh mục), thương hiệu và sản phẩm
                        .requestMatchers(HttpMethod.GET,
                                "/danh-muc/**",
                                "/thuong-hieu/**",
                                "/chat-lieu/**",
                                "/mau-sac/**",
                                "/kich-thuoc/**",
                                "/xuat-xu/**",
                                "/san-pham/**",
                                "/san-pham-chi-tiet/**"
                        ).permitAll()
                         .requestMatchers(publicApiMatcher).permitAll()    // <-- thay cho khối GET dài
                        // 3. Mọi thao tác ghi (POST/PUT/DELETE/PATCH) và các endpoint quản trị bắt buộc phải xác thực
                        .anyRequest().authenticated()
                )

            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new CustomPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }
}
