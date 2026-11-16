package com.example.datn.controller;

import com.example.datn.security.PublicApi;
import com.example.datn.service.VnPayThanhToanService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.HtmlUtils;

import java.util.Map;

/**
 * Điểm VNPay gọi về — KHÔNG cần đăng nhập (@PublicApi), an toàn nhờ kiểm tra chữ ký HMAC-SHA512.
 *
 * GET /api/vnpay/return → trình duyệt của khách được VNPay chuyển về sau khi thanh toán (hiện trang kết quả)
 * GET /api/vnpay/ipn    → VNPay gọi server-to-server (khai báo URL IPN trong trang quản trị sandbox;
 *                         máy local cần URL public, vd ngrok: https://xxxx.ngrok-free.app/api/vnpay/ipn)
 */
@RestController
@RequestMapping("/vnpay")
@RequiredArgsConstructor
@Slf4j
public class VnPayController {

    private final VnPayThanhToanService service;

    @PublicApi
    @GetMapping("/ipn")
    public Map<String, String> ipn(@RequestParam Map<String, String> params) {
        try {
            var kq = service.xuLyKetQua(params);
            return Map.of("RspCode", kq.rspCode(), "Message", kq.message());
        } catch (Exception e) {
            log.error("VNPay IPN lỗi", e);
            return Map.of("RspCode", "99", "Message", "Unknown error");
        }
    }

    @PublicApi
    @GetMapping(value = "/return", produces = MediaType.TEXT_HTML_VALUE + ";charset=UTF-8")
    public ResponseEntity<String> traVe(@RequestParam Map<String, String> params) {
        String tieuDe;
        String noiDung;
        String mau;
        try {
            var kq = service.xuLyKetQua(params);
            String ma = HtmlUtils.htmlEscape(String.valueOf(kq.maHoaDon()));
            if ("97".equals(kq.rspCode())) {
                tieuDe = "Dữ liệu không hợp lệ"; mau = "#dc2626";
                noiDung = "Chữ ký VNPay không đúng. Giao dịch không được ghi nhận.";
            } else if (kq.thanhCong()) {
                tieuDe = "Thanh toán thành công"; mau = "#16a34a";
                noiDung = "Hóa đơn " + ma + " đã được thanh toán qua VNPay. Quầy POS sẽ tự in bill.";
            } else {
                tieuDe = "Thanh toán không thành công"; mau = "#dc2626";
                noiDung = "Hóa đơn " + ma + " chưa được thanh toán (mã " + HtmlUtils.htmlEscape(
                        String.valueOf(params.get("vnp_ResponseCode"))) + "). Hàng đã được hoàn lại kho.";
            }
        } catch (Exception e) {
            log.error("VNPay Return lỗi", e);
            tieuDe = "Có lỗi xảy ra"; mau = "#dc2626";
            noiDung = "Không xử lý được kết quả thanh toán. Vui lòng kiểm tra lại hóa đơn ở quầy.";
        }
        String html = """
                <!doctype html><html lang="vi"><head><meta charset="utf-8">
                <meta name="viewport" content="width=device-width,initial-scale=1"><title>%s</title></head>
                <body style="font-family:system-ui,sans-serif;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0;background:#f8fafc">
                <div style="background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:32px;max-width:420px;text-align:center">
                <h1 style="color:%s;font-size:22px;margin:0 0 12px">%s</h1>
                <p style="color:#334155;line-height:1.5">%s</p>
                <p style="color:#94a3b8;font-size:13px">Cửa sổ sẽ tự đóng sau 5 giây.</p>
                <button onclick="window.close()" style="padding:10px 20px;border:0;border-radius:10px;background:#c6f500;font-weight:700;cursor:pointer">Đóng</button>
                </div><script>setTimeout(function(){window.close()},5000)</script></body></html>
                """.formatted(tieuDe, mau, tieuDe, noiDung);
        return ResponseEntity.ok(html);
    }
}
