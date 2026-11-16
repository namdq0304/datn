package com.example.datn.config;

import com.example.datn.service.VnPayThanhToanService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

/**
 * Mỗi phút hủy các giao dịch VNPay khách bỏ dở (quá hạn link + 5 phút) → hoàn kho, hoàn lượt KM.
 * Gọi huy() qua bean khác để mỗi hóa đơn là 1 transaction riêng (1 cái lỗi không ảnh hưởng cái khác).
 */
@Configuration
@EnableScheduling
@RequiredArgsConstructor
@Slf4j
public class VnPayDonDepJob {

    private final VnPayThanhToanService vnPayThanhToanService;

    @Scheduled(fixedDelay = 60_000, initialDelay = 60_000)
    public void donGiaoDichQuaHan() {
        for (Integer hoaDonId : vnPayThanhToanService.hoaDonChoQuaHan()) {
            try {
                vnPayThanhToanService.huy(hoaDonId, null, "VNPay quá hạn thanh toán - tự động hủy");
                log.info("VNPay: đã hủy giao dịch quá hạn, hóa đơn id={}", hoaDonId);
            } catch (Exception e) {
                log.warn("VNPay: không hủy được giao dịch quá hạn hóa đơn id={}: {}", hoaDonId, e.getMessage());
            }
        }
    }
}
