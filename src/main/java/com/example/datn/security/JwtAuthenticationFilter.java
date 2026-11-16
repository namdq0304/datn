package com.example.datn.security;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String uri = request.getRequestURI();

        log.debug("JWT Filter - URI: {}, hasAuth: {}", uri, authHeader != null);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {            log.debug("No Bearer token, passing through");
            filterChain.doFilter(request, response);
            return;
        }

        final String token = authHeader.substring(7);
        log.debug("No Bearer token, passing through  ==" + token);
        try {
            final String username = jwtUtil.extractUsername(token);
            log.debug("Extracted username: {}", username);

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                log.debug("UserDetails loaded, authorities: {}", userDetails.getAuthorities());

                if (jwtUtil.validateToken(token, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    log.debug("Authentication set for user: {}", username);
                } else {
                    log.warn("Token validation FAILED for user: {}", username);
                }
            }
        } catch (ExpiredJwtException e) {
            // Token hết hạn → coi như KHÁCH VÃNG LAI (không chặn ở đây):
            //  - API công khai (sản phẩm, danh mục...) vẫn trả dữ liệu → khách không bị đá ra trang đăng nhập
            //  - API cần đăng nhập → Spring Security trả 401 qua authenticationEntryPoint → FE tự refresh token
            log.debug("Token expired for URI: {} → xử lý như chưa đăng nhập", uri);
            SecurityContextHolder.clearContext();
        } catch (JwtException | IllegalArgumentException
                 | org.springframework.security.core.userdetails.UsernameNotFoundException e) {
            log.warn("Invalid token for URI: {}, error: {} → xử lý như chưa đăng nhập", uri, e.getMessage());
            SecurityContextHolder.clearContext();
        }
        filterChain.doFilter(request, response);
    }

    private void sendError(HttpServletResponse response, HttpStatus status, String message)
            throws IOException {
        response.setStatus(status.value());
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(
                "{\"success\":false,\"status\":" + status.value() + ",\"message\":\"" + message + "\"}"
        );
    }
}
