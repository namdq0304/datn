package com.example.datn.dto.hoadon;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
public record HoaDonResponse(
 Long id, String maHoaDon, Long khachHangId, String tenKhachHang,
 Long nhanVienId, String tenNhanVien, LocalDateTime ngayTao,
 BigDecimal tongTien, BigDecimal tienGiam, BigDecimal thanhTien,
 BigDecimal daThanhToan, BigDecimal conPhaiTra, Integer trangThai,
 List<ChiTietResponse> chiTiet
) {
 public record ChiTietResponse(Long id, Long chiTietSanPhamId, String maChiTiet,
  String tenSanPham, String mauSac, String kichThuoc, Integer soLuong,
  BigDecimal donGia, BigDecimal thanhTien) {}
}
