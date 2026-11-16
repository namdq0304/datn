package com.example.datn.service;

import com.example.datn.exception.ConflictException;
import com.example.datn.repository.HoaDonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

/**
 * Sinh mã hóa đơn dùng chung cho POS và màn Quản lý hóa đơn.
 * Dạng: PREFIX + yyMMdd + 6 số ngẫu nhiên (vd POS261116048213, 15 ký tự ≤ VARCHAR(20)).
 * Kiểm tra trùng trước khi trả về; UNIQUE ở DB (UQ_HOA_DON_MA) là chốt chặn cuối.
 */
@Component
@RequiredArgsConstructor
public class MaHoaDonGenerator {

    public static final String PREFIX_POS = "POS";
    public static final String PREFIX_HOA_DON = "HD";

    private static final SecureRandom RANDOM = new SecureRandom();
    private static final DateTimeFormatter NGAY = DateTimeFormatter.ofPattern("yyMMdd");

    private final HoaDonRepository hoaDonRepo;

    public String sinh(String prefix) {
        String dau = prefix + LocalDate.now().format(NGAY);
        for (int i = 0; i < 20; i++) {
            String ma = dau + String.format("%06d", RANDOM.nextInt(1_000_000));
            if (!hoaDonRepo.existsByMaHoaDon(ma)) return ma;
        }
        throw new ConflictException("Không sinh được mã hóa đơn, vui lòng thử lại!");
    }
}
