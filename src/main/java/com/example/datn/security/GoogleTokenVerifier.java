package com.example.datn.security;

import com.example.datn.exception.BadRequestException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwsHeader;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.LocatorAdapter;
import io.jsonwebtoken.security.Jwk;
import io.jsonwebtoken.security.JwkSet;
import io.jsonwebtoken.security.Jwks;
import io.jsonwebtoken.security.PublicJwk;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.security.Key;
import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * Xác minh Google ID token (credential do nút "Đăng nhập với Google" — Google Identity Services trả về).
 *
 * Kiểm tra đầy đủ theo hướng dẫn của Google:
 *  - chữ ký RS256 bằng khóa công khai của Google (JWKS, cache 6 giờ, tải lại khi gặp kid lạ)
 *  - aud = Client ID của mình, iss = accounts.google.com, còn hạn (exp)
 *  - email_verified = true
 */
@Component
@Slf4j
public class GoogleTokenVerifier {

    private static final String JWKS_URL = "https://www.googleapis.com/oauth2/v3/certs";
    private static final Set<String> ISSUERS = Set.of("accounts.google.com", "https://accounts.google.com");
    private static final Duration CACHE = Duration.ofHours(6);

    private final HttpClient http = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(10)).build();

    @Value("${google.client-id:}")
    private String clientId;

    private volatile Map<String, Key> khoaTheoKid = Map.of();
    private volatile Instant taiLuc = Instant.EPOCH;

    /** Thông tin người dùng lấy từ token đã xác minh. */
    public record GoogleUser(String sub, String email, String hoTen, String anh) {}

    public boolean daCauHinh() {
        return clientId != null && !clientId.isBlank() && !clientId.startsWith("CHUA_CAU_HINH");
    }

    public GoogleUser xacMinh(String idToken) {
        if (!daCauHinh()) {
            throw new BadRequestException("Chưa cấu hình đăng nhập Google (google.client-id trong application.properties)");
        }
        if (idToken == null || idToken.isBlank()) throw new BadRequestException("Thiếu Google credential");

        Claims c;
        try {
            c = Jwts.parser()
                    .keyLocator(new LocatorAdapter<Key>() {
                        @Override
                        protected Key locate(JwsHeader header) {
                            return layKhoa(header.getKeyId());
                        }
                    })
                    .requireAudience(clientId)
                    .clockSkewSeconds(60)
                    .build()
                    .parseSignedClaims(idToken)
                    .getPayload();
        } catch (JwtException | IllegalArgumentException e) {
            log.warn("Google ID token không hợp lệ: {}", e.getMessage());
            throw new BadRequestException("Phiên đăng nhập Google không hợp lệ hoặc đã hết hạn, vui lòng thử lại!");
        }

        if (!ISSUERS.contains(c.getIssuer())) throw new BadRequestException("Token không do Google phát hành!");
        String email = c.get("email", String.class);
        Object verified = c.get("email_verified");
        if (email == null || email.isBlank()) throw new BadRequestException("Tài khoản Google không có email!");
        if (!(Boolean.TRUE.equals(verified) || "true".equals(String.valueOf(verified)))) {
            throw new BadRequestException("Email Google chưa được xác minh!");
        }
        return new GoogleUser(c.getSubject(), email.trim().toLowerCase(),
                c.get("name", String.class), c.get("picture", String.class));
    }

    private Key layKhoa(String kid) {
        if (kid == null) throw new JwtException("Token thiếu kid");
        boolean hetHan = Instant.now().isAfter(taiLuc.plus(CACHE));
        if (hetHan || !khoaTheoKid.containsKey(kid)) taiLaiKhoa();
        Key k = khoaTheoKid.get(kid);
        if (k == null) throw new JwtException("Không tìm thấy khóa Google cho kid=" + kid);
        return k;
    }

    private synchronized void taiLaiKhoa() {
        try {
            HttpResponse<String> res = http.send(
                    HttpRequest.newBuilder(URI.create(JWKS_URL)).timeout(Duration.ofSeconds(10)).GET().build(),
                    HttpResponse.BodyHandlers.ofString());
            if (res.statusCode() != 200) throw new IllegalStateException("HTTP " + res.statusCode());
            JwkSet set = Jwks.setParser().build().parse(res.body());
            Map<String, Key> moi = new HashMap<>();
            for (Jwk<?> jwk : set.getKeys()) {
                if (jwk instanceof PublicJwk<?> pub && jwk.getId() != null) moi.put(jwk.getId(), pub.toKey());
            }
            khoaTheoKid = Map.copyOf(moi);
            taiLuc = Instant.now();
        } catch (Exception e) {
            log.error("Không tải được khóa công khai của Google: {}", e.getMessage());
            throw new JwtException("Không kết nối được tới Google để xác minh đăng nhập");
        }
    }
}
