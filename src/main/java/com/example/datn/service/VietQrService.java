package com.example.datn.service;

import com.example.datn.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Tạo mã QR chuyển khoản bằng VietQR Quick Link (API public, không cần API key):
 *   {base-url}/{bankBin}-{accountNo}-{template}.png?amount=&addInfo=&accountName=
 * Ảnh QR theo chuẩn NAPAS 247 — app ngân hàng nào quét cũng điền sẵn số tiền + nội dung.
 *
 * Lưu ý: Quick Link chỉ TẠO mã QR, không xác nhận tiền đã về. Thu ngân kiểm tra app
 * ngân hàng rồi mới bấm hoàn tất. Muốn tự động cần webhook ngân hàng (Casso, SePay, ...).
 */
@Service
public class VietQrService {

    private static final String KY_TU = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // bỏ ký tự dễ nhầm O/0/I/1
    private static final SecureRandom RANDOM = new SecureRandom();

    @Value("${vietqr.base-url:https://img.vietqr.io/image}")
    private String baseUrl;
    @Value("${vietqr.bank-bin}")
    private String bankBin;
    @Value("${vietqr.account-no}")
    private String accountNo;
    @Value("${vietqr.account-name}")
    private String accountName;
    @Value("${vietqr.template:compact2}")
    private String template;

    /**
     * @param soTien  số tiền cần thu (VND, > 0)
     * @return qrUrl + nội dung chuyển khoản (maThamChieu) + thông tin tài khoản nhận
     */
    public Map<String, Object> taoMaQr(BigDecimal soTien) {
        if (soTien == null || soTien.signum() <= 0) throw new BadRequestException("Số tiền chuyển khoản phải lớn hơn 0");
        long amount = soTien.setScale(0, RoundingMode.HALF_UP).longValueExact();

        // Nội dung CK: không dấu, ngắn (nhiều ngân hàng giới hạn ~25 ký tự) → dùng làm mã giao dịch đối soát
        String maThamChieu = "VF" + ngauNhien(8);

        String qrUrl = UriComponentsBuilder.fromUriString(baseUrl)
                .pathSegment(bankBin + "-" + accountNo + "-" + template + ".png")
                .queryParam("amount", amount)
                .queryParam("addInfo", maThamChieu)
                .queryParam("accountName", accountName)
                .encode(StandardCharsets.UTF_8)
                .toUriString();

        Map<String, Object> m = new LinkedHashMap<>();
        m.put("qrUrl", qrUrl);
        m.put("maThamChieu", maThamChieu);
        m.put("soTien", amount);
        m.put("bankBin", bankBin);
        m.put("soTaiKhoan", accountNo);
        m.put("tenTaiKhoan", accountName);
        return m;
    }

    private static String ngauNhien(int n) {
        StringBuilder sb = new StringBuilder(n);
        for (int i = 0; i < n; i++) sb.append(KY_TU.charAt(RANDOM.nextInt(KY_TU.length())));
        return sb.toString();
    }
}
