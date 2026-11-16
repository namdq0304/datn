package com.example.datn.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

/** Kiểm tra ký / xác minh chữ ký VNPay (không cần DB, không gọi mạng). */
class VnPayServiceTest {

    private VnPayService svc;

    @BeforeEach
    void setUp() {
        svc = new VnPayService();
        ReflectionTestUtils.setField(svc, "tmnCode", "TESTCODE");
        ReflectionTestUtils.setField(svc, "hashSecret", "TESTSECRETKEY1234567890");
        ReflectionTestUtils.setField(svc, "payUrl", "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html");
        ReflectionTestUtils.setField(svc, "returnUrl", "http://localhost:8080/api/vnpay/return");
        ReflectionTestUtils.setField(svc, "hetHanPhut", 15);
    }

    private static Map<String, String> thamSo(String url) {
        Map<String, String> m = new HashMap<>();
        for (String cap : URI.create(url).getRawQuery().split("&")) {
            String[] kv = cap.split("=", 2);
            m.put(URLDecoder.decode(kv[0], StandardCharsets.US_ASCII), URLDecoder.decode(kv[1], StandardCharsets.US_ASCII));
        }
        return m;
    }

    @Test
    void taoUrl_dungThamSoVaSoTienNhan100() {
        Map<String, String> p = thamSo(svc.taoUrlThanhToan("POS261116000001", new BigDecimal("2490000.00"), "127.0.0.1"));
        assertEquals("249000000", p.get("vnp_Amount"));
        assertEquals("POS261116000001", p.get("vnp_TxnRef"));
        assertEquals("TESTCODE", p.get("vnp_TmnCode"));
        assertEquals("2.1.0", p.get("vnp_Version"));
        assertEquals("http://localhost:8080/api/vnpay/return", p.get("vnp_ReturnUrl"));
        assertEquals(128, p.get("vnp_SecureHash").length()); // SHA-512 hex
    }

    @Test
    void chuKyTuUrlTaoRa_hopLe() {
        Map<String, String> p = thamSo(svc.taoUrlThanhToan("POS261116000001", new BigDecimal("150000"), "127.0.0.1"));
        assertTrue(svc.chuKyHopLe(p));
    }

    @Test
    void suaSoTien_chuKyKhongHopLe() {
        Map<String, String> p = thamSo(svc.taoUrlThanhToan("POS261116000001", new BigDecimal("150000"), "127.0.0.1"));
        p.put("vnp_Amount", "100");
        assertFalse(svc.chuKyHopLe(p));
    }

    @Test
    void thieuChuKy_khongHopLe() {
        Map<String, String> p = thamSo(svc.taoUrlThanhToan("POS261116000001", new BigDecimal("150000"), "127.0.0.1"));
        p.remove("vnp_SecureHash");
        assertFalse(svc.chuKyHopLe(p));
    }

    @Test
    void hmac_dungVectorChuan() {
        // RFC 4231 test case 2: key "Jefe", data "what do ya want for nothing?"
        assertEquals("164b7a7bfcf819e2e395fbe73b56e0a387bd64222e831fd610270cd7ea2505549758bf75c05a994a6d034f65f8f0e6fdcaeab1a34d4a6b4b636e070a38bce737",
                VnPayService.hmacSha512("Jefe", "what do ya want for nothing?"));
    }

    @Test
    void chuaCauHinh_baoLoi() {
        ReflectionTestUtils.setField(svc, "tmnCode", "CHUA_CAU_HINH");
        assertThrows(RuntimeException.class,
                () -> svc.taoUrlThanhToan("POS1", new BigDecimal("10000"), "127.0.0.1"));
    }
}
