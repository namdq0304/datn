package com.example.datn.config;

import com.example.datn.service.BanHangService;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Seed dữ liệu nghiệp vụ bán hàng lúc khởi động:
 * nạp 2 hình thức thanh toán (Tiền mặt / Chuyển khoản) nếu DB còn thiếu.
 * Chỉ THÊM — không xóa, không sửa bất kỳ dòng nào có sẵn.
 */
@Configuration
public class BanHangSeedConfig {

    @Bean
    ApplicationRunner seedHinhThucThanhToan(BanHangService banHangService) {
        return (ApplicationArguments args) -> banHangService.seedHinhThucThanhToan();
    }
}
