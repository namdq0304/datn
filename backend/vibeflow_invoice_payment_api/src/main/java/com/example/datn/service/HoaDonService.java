package com.example.datn.service;

import com.example.datn.dto.hoadon.*;
import com.example.datn.entity.*;
import com.example.datn.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class HoaDonService {
    // 0: Chờ thanh toán, 1: Đã thanh toán, 2: Đang chuẩn bị,
    // 3: Đang giao, 4: Giao thất bại, 5: Hoàn thành, 6: Đã hủy
    public static final int CHO_THANH_TOAN=0, DA_THANH_TOAN=1, DANG_CHUAN_BI=2,
            DANG_GIAO=3, GIAO_THAT_BAI=4, HOAN_THANH=5, DA_HUY=6;

    private final HoaDonRepository hoaDonRepo;
    private final HoaDonChiTietRepository chiTietRepo;
    private final ChiTietThanhToanRepository thanhToanRepo;
    private final HinhThucThanhToanRepository hinhThucRepo;
    private final LichSuHoaDonRepository lichSuRepo;
    private final SanPhamChiTietRepository sanPhamChiTietRepo;
    private final KhachHangRepository khachHangRepo;
    private final NhanVienRepository nhanVienRepo;

    public HoaDonService(HoaDonRepository hoaDonRepo, HoaDonChiTietRepository chiTietRepo,
        ChiTietThanhToanRepository thanhToanRepo, HinhThucThanhToanRepository hinhThucRepo,
        LichSuHoaDonRepository lichSuRepo, SanPhamChiTietRepository sanPhamChiTietRepo,
        KhachHangRepository khachHangRepo, NhanVienRepository nhanVienRepo) {
        this.hoaDonRepo=hoaDonRepo; this.chiTietRepo=chiTietRepo; this.thanhToanRepo=thanhToanRepo;
        this.hinhThucRepo=hinhThucRepo; this.lichSuRepo=lichSuRepo; this.sanPhamChiTietRepo=sanPhamChiTietRepo;
        this.khachHangRepo=khachHangRepo; this.nhanVienRepo=nhanVienRepo;
    }

    @Transactional
    public HoaDonResponse taoHoaDon(TaoHoaDonRequest req, String emailNhanVien) {
        NhanVienEntity nv=nhanVienRepo.findByEmail(emailNhanVien)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN,"Tài khoản không phải nhân viên"));
        KhachHangEntity kh=null;
        if(req.khachHangId()!=null) kh=khachHangRepo.findById(req.khachHangId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Không tìm thấy khách hàng"));

        Map<Long,Integer> soLuongTheoId=new LinkedHashMap<>();
        for(var item:req.sanPham()) soLuongTheoId.merge(item.chiTietSanPhamId(),item.soLuong(),Integer::sum);

        BigDecimal tong=BigDecimal.ZERO;
        List<SanPhamChiTietEntity> variants=new ArrayList<>();
        for(var e:soLuongTheoId.entrySet()) {
            SanPhamChiTietEntity spct=sanPhamChiTietRepo.findByIdAndTrangThaiTrue(e.getKey())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Không tìm thấy sản phẩm chi tiết ID "+e.getKey()));
            if(spct.getSoLuong()==null || spct.getSoLuong()<e.getValue())
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Sản phẩm "+spct.getMaChiTiet()+" không đủ tồn kho");
            BigDecimal gia=giaBan(spct);
            tong=tong.add(gia.multiply(BigDecimal.valueOf(e.getValue())));
            variants.add(spct);
        }
        BigDecimal giam=req.tienGiam()==null?BigDecimal.ZERO:req.tienGiam();
        if(giam.compareTo(tong)>0) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Tiền giảm không được lớn hơn tổng tiền");
        LocalDateTime now=LocalDateTime.now();
        String ma="HD"+now.format(DateTimeFormatter.ofPattern("yyMMddHHmmss"));
        HoaDonEntity hd=HoaDonEntity.builder().maHoaDon(ma).khachHang(kh).nhanVien(nv)
            .ngayTao(now).tongTien(tong).tienGiam(giam).thanhTien(tong.subtract(giam))
            .trangThai(CHO_THANH_TOAN).build();
        hd=hoaDonRepo.save(hd);
        for(int i=0;i<variants.size();i++) {
            SanPhamChiTietEntity spct=variants.get(i);
            int sl=soLuongTheoId.get(spct.getId());
            BigDecimal gia=giaBan(spct);
            chiTietRepo.save(HoaDonChiTietEntity.builder().hoaDon(hd).chiTietSanPham(spct)
                .soLuong(sl).donGia(gia).thanhTien(gia.multiply(BigDecimal.valueOf(sl))).build());
            spct.setSoLuong(spct.getSoLuong()-sl);
            sanPhamChiTietRepo.save(spct);
        }
        ghiLichSu(hd,nv,null,CHO_THANH_TOAN,"Tạo hóa đơn");
        return toResponse(hd);
    }

    @Transactional(readOnly=true)
    public List<HoaDonResponse> danhSach() {
        return hoaDonRepo.findAllByOrderByNgayTaoDesc().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly=true)
    public HoaDonResponse chiTiet(Long id) { return toResponse(layHoaDon(id)); }

    @Transactional
    public HoaDonResponse capNhatTrangThai(Long id, CapNhatTrangThaiRequest req, String email) {
        if(req.trangThai()<0 || req.trangThai()>6)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Trạng thái hóa đơn không hợp lệ");
        HoaDonEntity hd=layHoaDon(id);
        if(hd.getTrangThai()==DA_HUY) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Hóa đơn đã hủy");
        if(hd.getTrangThai()==CHO_THANH_TOAN && req.trangThai()!=DA_HUY && req.trangThai()!=CHO_THANH_TOAN)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Hóa đơn chưa thanh toán");
        NhanVienEntity nv=nhanVienRepo.findByEmail(email).orElse(null);
        int old=hd.getTrangThai();
        hd.setTrangThai(req.trangThai());
        hoaDonRepo.save(hd);
        ghiLichSu(hd,nv,old,req.trangThai(),req.lyDo());
        return toResponse(hd);
    }

    @Transactional
    public HoaDonResponse huyHoaDon(Long id, String email, String lyDo) {
        HoaDonEntity hd=layHoaDon(id);
        if(hd.getTrangThai()==DA_HUY) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Hóa đơn đã được hủy");
        if(hd.getTrangThai()==HOAN_THANH) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Không thể hủy hóa đơn đã hoàn thành");
        NhanVienEntity nv=nhanVienRepo.findByEmail(email).orElse(null);
        for(HoaDonChiTietEntity ct:chiTietRepo.findByHoaDon_Id(id)) {
            SanPhamChiTietEntity spct=ct.getChiTietSanPham();
            spct.setSoLuong((spct.getSoLuong()==null?0:spct.getSoLuong())+ct.getSoLuong());
            sanPhamChiTietRepo.save(spct);
        }
        int old=hd.getTrangThai(); hd.setTrangThai(DA_HUY); hoaDonRepo.save(hd);
        ghiLichSu(hd,nv,old,DA_HUY,lyDo==null?"Hủy hóa đơn":lyDo);
        return toResponse(hd);
    }

    @Transactional
    public ThanhToanResponse thanhToan(Long hoaDonId, ThanhToanRequest req) {
        HoaDonEntity hd=layHoaDon(hoaDonId);
        if(hd.getTrangThai()==DA_HUY) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Hóa đơn đã hủy");
        if(hd.getTrangThai()==HOAN_THANH) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Hóa đơn đã hoàn thành");
        HinhThucThanhToanEntity hinhThuc=hinhThucRepo.findById(req.hinhThucThanhToanId())
            .filter(x -> !Boolean.FALSE.equals(x.getTrangThai()))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Hình thức thanh toán không tồn tại hoặc đã khóa"));
        BigDecimal daTra=tongDaThanhToan(hoaDonId);
        BigDecimal conLai=hd.getThanhTien().subtract(daTra);
        if(req.soTien().compareTo(conLai)>0)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Số tiền thanh toán vượt quá số tiền còn phải trả: "+conLai);
        ChiTietThanhToanEntity tt=thanhToanRepo.save(ChiTietThanhToanEntity.builder()
            .hoaDon(hd).hinhThucThanhToan(hinhThuc).soTien(req.soTien())
            .ngayThanhToan(LocalDateTime.now()).maGiaoDich(req.maGiaoDich()).trangThai(1).build());
        BigDecimal daTraMoi=daTra.add(req.soTien());
        if(daTraMoi.compareTo(hd.getThanhTien())>=0) {
            int old=hd.getTrangThai(); hd.setTrangThai(DA_THANH_TOAN); hoaDonRepo.save(hd);
            ghiLichSu(hd,hd.getNhanVien(),old,DA_THANH_TOAN,"Thanh toán đủ hóa đơn");
        }
        return toThanhToanResponse(tt);
    }

    @Transactional(readOnly=true)
    public List<ThanhToanResponse> lichSuThanhToan(Long hoaDonId) {
        layHoaDon(hoaDonId);
        return thanhToanRepo.findByHoaDon_IdOrderByNgayThanhToanDesc(hoaDonId).stream().map(this::toThanhToanResponse).toList();
    }

    @Transactional(readOnly=true)
    public List<Map<String,Object>> danhSachHinhThuc() {
        return hinhThucRepo.findByTrangThaiTrue().stream().map(x -> {
            Map<String,Object> m=new LinkedHashMap<>(); m.put("id",x.getId());
            m.put("maHinhThuc",x.getMaHinhThuc()); m.put("tenHinhThuc",x.getTenHinhThuc()); m.put("moTa",x.getMoTa()); return m;
        }).toList();
    }

    private HoaDonEntity layHoaDon(Long id) {
        return hoaDonRepo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Không tìm thấy hóa đơn"));
    }
    private BigDecimal giaBan(SanPhamChiTietEntity x) {
        if(x.getGiaBan()!=null) return x.getGiaBan();
        if(x.getSanPham()!=null && x.getSanPham().getGiaBan()!=null) return x.getSanPham().getGiaBan();
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Sản phẩm chưa được thiết lập giá bán");
    }
    private BigDecimal tongDaThanhToan(Long id) {
        return thanhToanRepo.findByHoaDon_IdOrderByNgayThanhToanDesc(id).stream()
            .filter(x -> Objects.equals(x.getTrangThai(),1))
            .map(ChiTietThanhToanEntity::getSoTien).filter(Objects::nonNull)
            .reduce(BigDecimal.ZERO,BigDecimal::add);
    }
    private void ghiLichSu(HoaDonEntity hd,NhanVienEntity nv,Integer cu,Integer moi,String lyDo) {
        lichSuRepo.save(LichSuHoaDonEntity.builder().hoaDon(hd).nhanVien(nv).trangThaiCu(cu)
            .trangThaiMoi(moi).lyDo(lyDo).thoiGian(LocalDateTime.now()).build());
    }
    private HoaDonResponse toResponse(HoaDonEntity hd) {
        List<HoaDonResponse.ChiTietResponse> ds=chiTietRepo.findByHoaDon_Id(hd.getId()).stream().map(ct -> {
            SanPhamChiTietEntity sp=ct.getChiTietSanPham();
            String ten=sp.getSanPham()==null?"":sp.getSanPham().getTenSanPham();
            String mau=sp.getMauSac()==null?"":sp.getMauSac().getTenMau();
            String size=sp.getKichThuoc()==null?"":sp.getKichThuoc().getTenKichThuoc();
            return new HoaDonResponse.ChiTietResponse(ct.getId(),sp.getId(),sp.getMaChiTiet(),ten,mau,size,
                ct.getSoLuong(),ct.getDonGia(),ct.getThanhTien());
        }).toList();
        BigDecimal daTra=tongDaThanhToan(hd.getId());
        return new HoaDonResponse(hd.getId(),hd.getMaHoaDon(),
            hd.getKhachHang()==null?null:hd.getKhachHang().getId(),
            hd.getKhachHang()==null?"Khách vãng lai":hd.getKhachHang().getHoTen(),
            hd.getNhanVien()==null?null:hd.getNhanVien().getId(),
            hd.getNhanVien()==null?"":hd.getNhanVien().getHoTen(),hd.getNgayTao(),
            hd.getTongTien(),hd.getTienGiam(),hd.getThanhTien(),daTra,
            hd.getThanhTien().subtract(daTra),hd.getTrangThai(),ds);
    }
    private ThanhToanResponse toThanhToanResponse(ChiTietThanhToanEntity x) {
        return new ThanhToanResponse(x.getId(),x.getHoaDon().getId(),x.getHoaDon().getMaHoaDon(),
            x.getHinhThucThanhToan().getId(),x.getHinhThucThanhToan().getTenHinhThuc(),
            x.getSoTien(),x.getNgayThanhToan(),x.getMaGiaoDich(),x.getTrangThai());
    }
}
