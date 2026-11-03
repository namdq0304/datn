package com.example.datn.controller;

import com.example.datn.dto.SanPhamDTO;
import com.example.datn.entity.HinhAnhEntity;
import com.example.datn.entity.SanPhamEntity;
import com.example.datn.repository.HinhAnhRepository;
import com.example.datn.repository.SanPhamChiTietRepository;
import com.example.datn.repository.SanPhamRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.JpaSort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Quản lý Sản Phẩm — Base URL: /api/san-pham (context-path /api đã được strip)
 *
 * GET    /san-pham          → Danh sách sản phẩm đang hoạt động (đã đăng nhập)
 * GET    /san-pham/search   → Tìm kiếm theo q (tên hoặc mã)
 * GET    /san-pham/{id}     → Chi tiết
 * POST   /san-pham          → Thêm mới  (ADMIN)
 * PUT    /san-pham/{id}     → Cập nhật  (ADMIN)
 * DELETE /san-pham/{id}     → Xóa mềm   (ADMIN)
 */
@Slf4j
@RestController
@RequestMapping("/san-pham")
@RequiredArgsConstructor
public class SanPhamController {
    @Autowired
    private  SanPhamRepository sanPhamRepository;
    @Autowired
    private  SanPhamChiTietRepository chiTietRepository;
    @Autowired
    private  HinhAnhRepository hinhAnhRepository;

    // ------------------------------------------------------------------ helper

    private SanPhamDTO toDTO(SanPhamEntity e) {
        return SanPhamDTO.builder()
                .id(e.getId())
                .maSanPham(e.getMaSanPham())
                .tenSanPham(e.getTenSanPham())
                .danhMucId(e.getDanhMucId())
                .thuongHieuId(e.getThuongHieuId())
                .xuatXuId(e.getXuatXuId())
                .chatLieuId(e.getChatLieuId())
                .moTa(e.getMoTa())
                .gioiTinh(e.getGioiTinh())
                .trangThai(Boolean.TRUE.equals(e.getTrangThai()))
                .ngayTao(e.getNgayTao() != null ? e.getNgayTao().toString() : null)
                .build();
    }

    /** Enrich DTO với tồn kho, ảnh chính và số lượng bán */
    private SanPhamDTO toDTOFull(SanPhamEntity e,
                                  Map<Long, Long> tonKhoMap,
                                  Map<Long, String> anhMap,
                                  Map<Long, Long> tongBanMap) {
        SanPhamDTO dto = toDTO(e);
        dto.setTongTonKho(tonKhoMap.getOrDefault(e.getId(), 0L));
        dto.setTongBan(tongBanMap.getOrDefault(e.getId(), 0L));
        dto.setUrlAnhChinh(anhMap.getOrDefault(e.getId(), null));
        return dto;
    }

    /** Sinh mã dạng SP + 8 ký tự ngẫu nhiên (tối đa 10 ký tự, cột DB cho phép 20), kiểm tra trùng. */
    private String generateMaSanPham() {
        String ma;
        do {
            ma = "SP" + UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
        } while (sanPhamRepository.existsByMaSanPham(ma));
        return ma;
    }

    private ResponseEntity<Map<String, Object>> notFound() {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("success", false, "message", "Không tìm thấy sản phẩm!"));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PUBLIC ENDPOINTS — không yêu cầu đăng nhập
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * GET /api/san-pham/public
     * Danh sách sản phẩm đang bán dành cho trang khách hàng (không cần token).
     *
     * Query params:
     *   q           — tìm kiếm tên / mã sản phẩm
     *   thuongHieuId — lọc theo thương hiệu
     *   danhMucId   — lọc theo danh mục
     *   gioiTinh    — 0=nam, 1=nữ (bỏ qua = tất cả)
     *   page / size — phân trang
     */

    @GetMapping("/public")
     @Transactional(readOnly = true)
     public ResponseEntity<Map<String, Object>> getPublic(
             @RequestParam(defaultValue = "0")      int page,
             @RequestParam(defaultValue = "12")     int size,
             @RequestParam(defaultValue = "")       String q,
             // Nhiều thương hiệu: ?thuongHieuId=1&thuongHieuId=2
             @RequestParam(required = false)        List<Integer> thuongHieuId,
             @RequestParam(required = false)        Integer danhMucId,
             @RequestParam(required = false)        Integer chatLieuId,
             @RequestParam(required = false)        Integer xuatXuId,
             @RequestParam(required = false)        Integer gioiTinh,
             @RequestParam(required = false)        Integer mauSacId,
             @RequestParam(required = false)        Integer kichThuocId,
             @RequestParam(required = false)        BigDecimal minPrice,
             @RequestParam(required = false)        BigDecimal maxPrice,
             @RequestParam(defaultValue = "false")  boolean onSale,
             @RequestParam(defaultValue = "true")   boolean inStock,
             @RequestParam(defaultValue = "newest") String sort) {

         size = Math.min(Math.max(size, 1), 100);
         page = Math.max(page, 0);
         if (minPrice != null && maxPrice != null && minPrice.compareTo(maxPrice) > 0) {
             BigDecimal t = minPrice; minPrice = maxPrice; maxPrice = t;
         }

         Sort order = switch (sort) {
             case "price_asc"  -> JpaSort.unsafe(Sort.Direction.ASC,  "min(ct.giaBan)", "sp.id");
             case "price_desc" -> JpaSort.unsafe(Sort.Direction.DESC, "min(ct.giaBan)", "sp.id");
             default           -> JpaSort.unsafe(Sort.Direction.DESC, "sp.ngayTao", "sp.id");
         };

         Pageable pageable = PageRequest.of(page, size, order);

         // 1) Lấy ID của trang — phân nhánh theo số lượng thương hiệu
         Page<Integer> idPage;
         if (thuongHieuId != null && thuongHieuId.size() > 1) {
             // Nhiều thương hiệu → dùng query IN
             idPage = sanPhamRepository.findPublicIdsMultiBrand(
                     q.trim(), thuongHieuId, danhMucId, chatLieuId, xuatXuId, gioiTinh,
                     mauSacId, kichThuocId, minPrice, maxPrice, onSale, inStock, pageable);
         } else {
             // 0 hoặc 1 thương hiệu → dùng query cũ (tương thích ngược)
             Integer singleBrand = (thuongHieuId != null && !thuongHieuId.isEmpty()) ? thuongHieuId.get(0) : null;
             idPage = sanPhamRepository.findPublicIds(
                     q.trim(), singleBrand, danhMucId, chatLieuId, xuatXuId, gioiTinh,
                     mauSacId, kichThuocId, minPrice, maxPrice, onSale, inStock, pageable);
         }

         List<Integer> ids = idPage.getContent();

         // 2) Tải sản phẩm, giá, ảnh theo ID (mỗi loại 1 query)
         Map<Long, SanPhamEntity> spMap = ids.isEmpty() ? Map.of()
                 : sanPhamRepository.findAllById(ids).stream()
                     .collect(Collectors.toMap(SanPhamEntity::getId, Function.identity()));
         Map<Integer, SanPhamChiTietRepository.GiaTongHop> giaMap = ids.isEmpty() ? Map.of()
                 : chiTietRepository.tongHopGia(ids).stream()
                     .collect(Collectors.toMap(SanPhamChiTietRepository.GiaTongHop::getSanPhamId, Function.identity()));
         Map<Integer, String> anhMap = new HashMap<>();
         if (!ids.isEmpty()) {
             for (var h : hinhAnhRepository.findAnhDaiDien(ids)) {
                 anhMap.putIfAbsent(h.getSanPhamId(), h.getUrlAnh());   // dòng đầu = ảnh chính / ảnh đầu tiên
             }
         }

         // 3) Ghép kết quả, giữ đúng thứ tự đã sort
         List<Map<String, Object>> content = new ArrayList<>();
        for (Object rawId : ids) {
            Integer id = ((Number) rawId).intValue();

            // Chuyển Integer sang Long vì spMap có key là Long
            Long idLong = id.longValue();

            SanPhamEntity sp = spMap.get(idLong);
            if (sp == null) continue;

            var g = giaMap.get(id);

            BigDecimal giaMin = g != null ? g.getGiaMin() : null;
            BigDecimal giaGocMax = g != null ? g.getGiaGocMax() : null;

            boolean coGiamGia = g != null
                    && g.getSoBienTheGiamGia() != null
                    && g.getSoBienTheGiamGia() > 0;

            Integer phanTram = null;

            if (coGiamGia && giaMin != null
                    && giaGocMax != null
                    && giaGocMax.signum() > 0) {

                phanTram = giaGocMax.subtract(giaMin)
                        .multiply(BigDecimal.valueOf(100))
                        .divide(giaGocMax, 0, RoundingMode.HALF_UP)
                        .intValue();
            }

             Map<String, Object> m = new LinkedHashMap<>();
             m.put("id", sp.getId());
             m.put("maSanPham", sp.getMaSanPham());
             m.put("tenSanPham", sp.getTenSanPham());
             m.put("danhMucId", sp.getDanhMucId());
             m.put("thuongHieuId", sp.getThuongHieuId());
             m.put("xuatXuId", sp.getXuatXuId());
             m.put("chatLieuId", sp.getChatLieuId());
             m.put("gioiTinh", sp.getGioiTinh());
             m.put("giaMin", giaMin);                                   // "từ ... ₫"
             m.put("giaMax", g != null ? g.getGiaMax() : null);
             m.put("giaBan", giaMin);                                   // tương thích code cũ dùng p.giaBan
//             m.put("giaGoc", coGiamGia ? giaGocMax : null);
             m.put("coGiamGia", coGiamGia);
             m.put("phanTramGiam", phanTram);
             m.put("tongTonKho", g != null ? g.getTonKho() : 0L);
             m.put("urlAnhChinh", anhMap.get(id));
             m.put("ngayTao", sp.getNgayTao());
             content.add(m);
         }

         Map<String, Object> body = new LinkedHashMap<>();
         body.put("content", content);
         body.put("page", idPage.getNumber());
         body.put("size", idPage.getSize());
         body.put("totalPages", idPage.getTotalPages());
         body.put("totalElements", idPage.getTotalElements());
         return ResponseEntity.ok(body);
     }
    private List<Map<String, Object>> buildCards(List<Integer> ids, Map<Integer, Long> tongBanMap) {
        if (ids.isEmpty()) return new ArrayList<>();

        Map<Long, SanPhamEntity> spMap = sanPhamRepository.findAllById(ids).stream()
                .collect(Collectors.toMap(SanPhamEntity::getId, Function.identity()));
        Map<Integer, SanPhamChiTietRepository.GiaTongHop> giaMap = chiTietRepository.tongHopGia(ids).stream()
                .collect(Collectors.toMap(SanPhamChiTietRepository.GiaTongHop::getSanPhamId, Function.identity()));
        Map<Integer, String> anhMap = new HashMap<>();
        for (var h : hinhAnhRepository.findAnhDaiDien(ids)) {
            anhMap.putIfAbsent(h.getSanPhamId(), h.getUrlAnh());
        }

        List<Map<String, Object>> content = new ArrayList<>();
        for (Integer id : ids) {                       // giữ đúng thứ tự ids
            SanPhamEntity sp = spMap.get(id.longValue());
            if (sp == null) continue;

            var g = giaMap.get(id);
            BigDecimal giaMin = g != null ? g.getGiaMin() : null;
            BigDecimal giaGocMax = g != null ? g.getGiaGocMax() : null;
            boolean coGiamGia = g != null && g.getSoBienTheGiamGia() != null && g.getSoBienTheGiamGia() > 0;

            Integer phanTram = null;
            if (coGiamGia && giaMin != null && giaGocMax != null && giaGocMax.signum() > 0) {
                phanTram = giaGocMax.subtract(giaMin).multiply(BigDecimal.valueOf(100))
                        .divide(giaGocMax, 0, RoundingMode.HALF_UP).intValue();
            }

            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", sp.getId());
            m.put("maSanPham", sp.getMaSanPham());
            m.put("tenSanPham", sp.getTenSanPham());
            m.put("danhMucId", sp.getDanhMucId());
            m.put("thuongHieuId", sp.getThuongHieuId());
            m.put("xuatXuId", sp.getXuatXuId());
            m.put("chatLieuId", sp.getChatLieuId());
            m.put("gioiTinh", sp.getGioiTinh());
            m.put("giaMin", giaMin);
            m.put("giaMax", g != null ? g.getGiaMax() : null);
            m.put("giaBan", giaMin);
            m.put("giaGoc", coGiamGia ? giaGocMax : null);
            m.put("coGiamGia", coGiamGia);
            m.put("phanTramGiam", phanTram);
            m.put("tongTonKho", g != null ? g.getTonKho() : 0L);
            m.put("urlAnhChinh", anhMap.get(id));
            m.put("ngayTao", sp.getNgayTao());
            m.put("tongBan", tongBanMap != null ? tongBanMap.getOrDefault(id, 0L) : 0L);
            content.add(m);
        }
        return content;
    }
    @GetMapping("/hot")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Map<String, Object>>> getHot(
            @RequestParam(defaultValue = "8") int limit) {
        limit = Math.min(Math.max(limit, 1), 50);

        List<Object[]> rows = sanPhamRepository.findSanPhamHotIds(limit);

        List<Integer> ids = new ArrayList<>();
        Map<Integer, Long> tongBanMap = new HashMap<>();
        for (Object[] r : rows) {
            Integer id = ((Number) r[0]).intValue();
            ids.add(id);
            tongBanMap.put(id, r[1] != null ? ((Number) r[1]).longValue() : 0L);
        }

        // Chưa có đơn hoàn thành nào (hoặc chưa đủ limit) -> bù bằng sản phẩm mới nhất
        if (ids.size() < limit) {
            Page<?> moiNhat = sanPhamRepository.findPublicIds(
                    "", null, null, null, null, null,
                    null, null, null, null,
                    false,   // onSale
                    true,    // inStock
                    PageRequest.of(0, limit,
                            JpaSort.unsafe(Sort.Direction.DESC, "sp.ngayTao", "sp.id")));

            for (Object raw : moiNhat.getContent()) {
                Integer id = ((Number) raw).intValue();   // Long hay Integer đều chạy được
                if (ids.size() >= limit) break;
                if (!ids.contains(id)) ids.add(id);
            }
        }

        return ResponseEntity.ok(buildCards(ids, tongBanMap));
    }

    // ── helpers dùng chung ──────────────────────────────────────────────────

    private ResponseEntity<Map<String, Object>> buildPageResponse(Page<SanPhamEntity> result) {
        List<Long> ids = result.getContent().stream().map(SanPhamEntity::getId).toList();
        Map<Long, Long>   tonKhoMap = getTonKhoMap(ids);
        Map<Long, String> anhMap    = getAnhChinhMap(ids);
        Map<Long, Long>   tongBanMap = new HashMap<>(); // public list không cần tongBan

        List<SanPhamDTO> content = result.getContent().stream()
                .map(e -> toDTOFull(e, tonKhoMap, anhMap, tongBanMap))
                .toList();

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("content",       content);
        response.put("page",          result.getNumber());
        response.put("size",          result.getSize());
        response.put("totalElements", result.getTotalElements());
        response.put("totalPages",    result.getTotalPages());
        response.put("first",         result.isFirst());
        response.put("last",          result.isLast());
        return ResponseEntity.ok(response);
    }

    private Map<Long, Long> getTonKhoMap(List<Long> ids) {
        Map<Long, Long> map = new HashMap<>();
        if (!ids.isEmpty()) {
            for (Object[] r : chiTietRepository.sumSoLuongBySanPhamIds(ids)) {
                map.put(((Number) r[0]).longValue(), ((Number) r[1]).longValue());
            }
        }
        return map;
    }

    private Map<Long, String> getAnhChinhMap(List<Long> ids) {
        Map<Long, String> map = new HashMap<>();
        if (!ids.isEmpty()) {
            for (Long id : ids) {
                hinhAnhRepository.findFirstBySanPham_IdAndTrangThaiTrueOrderByIdAsc(id)
                        .ifPresent(h -> map.put(id, h.getUrlAnh()));
            }
        }
        return map;
    }
    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<Map<String, Object>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String q,
            @RequestParam(required = false) Integer thuongHieuId) {

        size = Math.min(Math.max(size, 1), 100);
        page = Math.max(page, 0);

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "ngayTao"));
        Page<SanPhamEntity> result = sanPhamRepository.findWithPaging(q.trim(), thuongHieuId, pageable);

        List<SanPhamEntity> items = result.getContent();
        List<Long> ids = items.stream().map(SanPhamEntity::getId).toList();

        // Tồn kho và ảnh chính của cả trang: 2 query duy nhất
        Map<Long, Long> tonKho = new HashMap<>();
        Map<Long, String> anhChinh = new HashMap<>();

        if (!ids.isEmpty()) {   // IN () với list rỗng sẽ lỗi trên SQL Server
            for (Object[] r : chiTietRepository.sumSoLuongBySanPhamIds(ids)) {
                tonKho.put(((Number) r[0]).longValue(), ((Number) r[1]).longValue());
            }

        }

        List<SanPhamDTO> content = items.stream().map(e -> {
            SanPhamDTO dto = toDTO(e);
            dto.setTongTonKho(tonKho.getOrDefault(e.getId(), 0L));
            return dto;
        }).toList();

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("content", content);
        response.put("page", result.getNumber());
        response.put("size", result.getSize());
        response.put("totalElements", result.getTotalElements());
        response.put("totalPages", result.getTotalPages());
        response.put("first", result.isFirst());
        response.put("last", result.isLast());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<List<SanPhamDTO>> search(@RequestParam(defaultValue = "") String q) {
        List<SanPhamDTO> list = sanPhamRepository
                .search(q.trim())
                .stream()
                .map(this::toDTO)
                .toList();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Integer id) {
        return sanPhamRepository.findByIdAndTrangThaiTrue(id)
                .<ResponseEntity<?>>map(e -> ResponseEntity.ok(toDTO(e)))
                .orElseGet(this::notFound);
    }

    // -------------------------------------------------------------------- POST

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> create(@Valid @RequestBody SanPhamDTO dto) {
        SanPhamEntity entity = SanPhamEntity.builder()
                .maSanPham(generateMaSanPham())
                .tenSanPham(dto.getTenSanPham().trim())
                .danhMucId(dto.getDanhMucId())
                .thuongHieuId(dto.getThuongHieuId())
                .xuatXuId(dto.getXuatXuId())
                .moTa(dto.getMoTa())
                .trangThai(true)
                .chatLieuId(dto.getChatLieuId())
                .build();

        SanPhamEntity saved = sanPhamRepository.save(entity);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                Map.of("success", true, "message", "Thêm sản phẩm thành công!", "data", toDTO(saved)));
    }

    // --------------------------------------------------------------------- PUT

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> update(@PathVariable Integer id, @Valid @RequestBody SanPhamDTO dto) {
        return sanPhamRepository.findById(id)
                .<ResponseEntity<?>>map(entity -> {
                    entity.setTenSanPham(dto.getTenSanPham().trim());
                    if (dto.getDanhMucId()    != null) entity.setDanhMucId(dto.getDanhMucId());
                    if (dto.getThuongHieuId() != null) entity.setThuongHieuId(dto.getThuongHieuId());
                    if (dto.getXuatXuId()     != null) entity.setXuatXuId(dto.getXuatXuId());
                    if (dto.getMoTa()         != null) entity.setMoTa(dto.getMoTa());
                    if (dto.getTrangThai()    != null) entity.setTrangThai(dto.getTrangThai());
                    if (dto.getChatLieuId()    != null) entity.setChatLieuId(dto.getChatLieuId());

                    SanPhamEntity saved = sanPhamRepository.save(entity);
                    return ResponseEntity.ok(Map.of(
                            "success", true, "message", "Cập nhật sản phẩm thành công!", "data", toDTO(saved)));
                })
                .orElseGet(this::notFound);
    }

    // ------------------------------------------------------------------ DELETE

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        return sanPhamRepository.findById(id)
                .<ResponseEntity<?>>map(entity -> {
                    entity.setTrangThai(false); // xóa mềm
                    sanPhamRepository.save(entity);
                    return ResponseEntity.ok(
                            Map.of("success", true, "message", "Đã xóa sản phẩm thành công!"));
                })
                .orElseGet(this::notFound);
    }

    @PatchMapping("/{id}/trang-thai")
    public ResponseEntity<SanPhamDTO> updateStatus(
            @PathVariable Integer id,
            @RequestBody Map<String, Boolean> body) {

        SanPhamEntity e = sanPhamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));
        e.setTrangThai(Boolean.TRUE.equals(body.get("trangThai")));
        return ResponseEntity.ok(toDTO(sanPhamRepository.save(e)));
    }
}