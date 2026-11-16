package com.example.datn.security;

import io.jsonwebtoken.Jwts;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.security.Key;
import java.security.KeyPair;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Kiểm tra xác minh Google ID token mà không gọi mạng:
 * nạp sẵn 1 khóa RSA "giả làm Google" vào cache JWKS, ký token bằng khóa đó.
 */
class GoogleTokenVerifierTest {

    private static final String CLIENT_ID = "123456789-test.apps.googleusercontent.com";
    private static final String KID = "kid-test";

    private GoogleTokenVerifier verifier;
    private KeyPair keyPair;

    @BeforeEach
    void setUp() {
        verifier = new GoogleTokenVerifier();
        ReflectionTestUtils.setField(verifier, "clientId", CLIENT_ID);
        keyPair = Jwts.SIG.RS256.keyPair().build();
        ReflectionTestUtils.setField(verifier, "khoaTheoKid", Map.<String, Key>of(KID, keyPair.getPublic()));
        ReflectionTestUtils.setField(verifier, "taiLuc", Instant.now());
    }

    private String token(String aud, String iss, Object emailVerified, Instant exp, KeyPair kp) {
        return Jwts.builder()
                .header().keyId(KID).and()
                .subject("10987654321")
                .issuer(iss)
                .audience().add(aud).and()
                .issuedAt(new Date())
                .expiration(Date.from(exp))
                .claim("email", "Khach.Google@Gmail.com")
                .claim("email_verified", emailVerified)
                .claim("name", "Khách Google")
                .signWith(kp.getPrivate(), Jwts.SIG.RS256)
                .compact();
    }

    private String hopLe() {
        return token(CLIENT_ID, "https://accounts.google.com", true, Instant.now().plusSeconds(3600), keyPair);
    }

    @Test
    void tokenHopLe_layDungThongTin() {
        var u = verifier.xacMinh(hopLe());
        assertEquals("khach.google@gmail.com", u.email()); // chuẩn hóa chữ thường
        assertEquals("Khách Google", u.hoTen());
        assertEquals("10987654321", u.sub());
    }

    @Test
    void issKhongCoHttps_vanHopLe() {
        assertDoesNotThrow(() -> verifier.xacMinh(
                token(CLIENT_ID, "accounts.google.com", true, Instant.now().plusSeconds(3600), keyPair)));
    }

    @Test
    void saiAudience_tuChoi() {
        assertThrows(RuntimeException.class, () -> verifier.xacMinh(
                token("client-khac.apps.googleusercontent.com", "https://accounts.google.com", true,
                        Instant.now().plusSeconds(3600), keyPair)));
    }

    @Test
    void saiIssuer_tuChoi() {
        assertThrows(RuntimeException.class, () -> verifier.xacMinh(
                token(CLIENT_ID, "https://evil.example.com", true, Instant.now().plusSeconds(3600), keyPair)));
    }

    @Test
    void hetHan_tuChoi() {
        assertThrows(RuntimeException.class, () -> verifier.xacMinh(
                token(CLIENT_ID, "https://accounts.google.com", true, Instant.now().minusSeconds(3600), keyPair)));
    }

    @Test
    void emailChuaXacMinh_tuChoi() {
        assertThrows(RuntimeException.class, () -> verifier.xacMinh(
                token(CLIENT_ID, "https://accounts.google.com", false, Instant.now().plusSeconds(3600), keyPair)));
    }

    @Test
    void kyBangKhoaKhac_tuChoi() {
        KeyPair khoaLa = Jwts.SIG.RS256.keyPair().build();
        assertThrows(RuntimeException.class, () -> verifier.xacMinh(
                token(CLIENT_ID, "https://accounts.google.com", true, Instant.now().plusSeconds(3600), khoaLa)));
    }

    @Test
    void chuaCauHinhClientId_baoLoi() {
        ReflectionTestUtils.setField(verifier, "clientId", "CHUA_CAU_HINH");
        assertFalse(verifier.daCauHinh());
        assertThrows(RuntimeException.class, () -> verifier.xacMinh(hopLe()));
    }
}
