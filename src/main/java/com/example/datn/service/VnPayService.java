package com.example.datn.service;

import com.example.datn.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Ký / kiểm tra chữ ký VNPay (API thanh toán v2.1.0) — không chứa nghiệp vụ hóa đơn.
 *
 * Cách ký theo tài liệu VNPay:
 *  1. Lấy các tham số vnp_* (trừ vnp_SecureHash, vnp_SecureHashType), sắp xếp theo tên tăng dần.
 *  2. Ghép "tên=giá_trị_đã_URL-encode" bằng '&' → hashData.
 *  3. vnp_SecureHash = HMAC-SHA512(hashSecret, hashData) dạng hex.
 */
@Service
public class VnPayService {

    private static final String CHUA_CAU_HINH = "CHUA_CAU_HINH";

    @Value("${vnpay.tmn-code}")
    private String tmnCode;
    @Value("${vnpay.hash-secret}")
    private String hashSecret;
    @Value("${vnpay.pay-url}")
    private String payUrl;
    @Value("${vnpay.return-url}")
    private String returnUrl;
    @Value("${vnpay.het-han-phut:15}")
    private int hetHanPhut;

    public boolean daCauHinh() {
        return tmnCode != null && hashSecret != null
                && !tmnCode.isBlank() && !hashSecret.isBlank()
                && !CHUA_CAU_HINH.equals(tmnCode) && !CHUA_CAU_HINH.equals(hashSecret);
    }

    public void kiemTraCauHinh() {
        if (!daCauHinh()) {
            throw new BadRequestException("Chưa cấu hình VNPay: điền vnpay.tmn-code và vnpay.hash-secret "
                    + "(lấy ở https://pay.vnpaytest.vn/dev-registration) trong application.properties");
        }
    }

    public int getHetHanPhut() {
        return hetHanPhut;
    }

    /**
     * Tạo URL chuyển khách sang cổng VNPay.
     * @param maThamChieu vnp_TxnRef — mã hóa đơn (duy nhất trong ngày)
     * @param soTien      số tiền VND
     * @param ipKhach     IP người thanh toán
     */
    public String taoUrlThanhToan(String maThamChieu, BigDecimal soTien, String ipKhach) {
        kiemTraCauHinh();
        long amount = soTien.setScale(0, RoundingMode.HALF_UP).longValueExact() * 100; // VNPay: nhân 100

        TimeZone tz = TimeZone.getTimeZone("Asia/Ho_Chi_Minh"); // VNPay yêu cầu giờ GMT+7
        SimpleDateFormat fmt = new SimpleDateFormat("yyyyMMddHHmmss");
        fmt.setTimeZone(tz);
        Calendar now = Calendar.getInstance(tz);
        String createDate = fmt.format(now.getTime());
        now.add(Calendar.MINUTE, hetHanPhut);
        String expireDate = fmt.format(now.getTime());

        Map<String, String> p = new TreeMap<>();
        p.put("vnp_Version", "2.1.0");
        p.put("vnp_Command", "pay");
        p.put("vnp_TmnCode", tmnCode);
        p.put("vnp_Amount", String.valueOf(amount));
        p.put("vnp_CurrCode", "VND");
        p.put("vnp_TxnRef", maThamChieu);
        p.put("vnp_OrderInfo", "Thanh toan hoa don " + maThamChieu);   // không dấu theo khuyến nghị VNPay
        p.put("vnp_OrderType", "other");
        p.put("vnp_Locale", "vn");
        p.put("vnp_ReturnUrl", returnUrl);
        p.put("vnp_IpAddr", ipKhach == null || ipKhach.isBlank() ? "127.0.0.1" : ipKhach);
        p.put("vnp_CreateDate", createDate);
        p.put("vnp_ExpireDate", expireDate);

        String hashData = noiThamSo(p, false);
        String query = noiThamSo(p, true);
        return payUrl + "?" + query + "&vnp_SecureHash=" + hmacSha512(hashSecret, hashData);
    }

    /** Kiểm tra chữ ký dữ liệu VNPay gửi về (Return URL / IPN). */
    public boolean chuKyHopLe(Map<String, String> thamSo) {
        if (!daCauHinh()) return false;
        String chuKy = thamSo.get("vnp_SecureHash");
        if (chuKy == null || chuKy.isBlank()) return false;
        Map<String, String> p = new TreeMap<>();
        thamSo.forEach((k, v) -> {
            if (k.startsWith("vnp_") && !k.equals("vnp_SecureHash") && !k.equals("vnp_SecureHashType")
                    && v != null && !v.isEmpty()) {
                p.put(k, v);
            }
        });
        String tinhLai = hmacSha512(hashSecret, noiThamSo(p, false));
        return tinhLai.equalsIgnoreCase(chuKy);
    }

    /** Ghép tham số đã sắp xếp; giá trị luôn URL-encode, tên chỉ encode khi dựng query string. */
    private static String noiThamSo(Map<String, String> sorted, boolean encodeTen) {
        StringJoiner sj = new StringJoiner("&");
        sorted.forEach((k, v) -> {
            if (v == null || v.isEmpty()) return;
            String ten = encodeTen ? URLEncoder.encode(k, StandardCharsets.US_ASCII) : k;
            sj.add(ten + "=" + URLEncoder.encode(v, StandardCharsets.US_ASCII));
        });
        return sj.toString();
    }

    static String hmacSha512(String key, String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA512");
            mac.init(new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512"));
            byte[] raw = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(raw.length * 2);
            for (byte b : raw) sb.append(String.format("%02x", b & 0xff));
            return sb.toString();
        } catch (Exception e) {
            throw new IllegalStateException("Không ký được dữ liệu VNPay", e);
        }
    }
}
