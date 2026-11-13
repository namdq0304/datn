import React, { useState, useMemo } from 'react';

export default function ProductVariantsView({ product, onBack, onUpdateProduct }) {
  // Danh sách biến thể (lấy từ product hoặc sinh dữ liệu mẫu chuẩn nếu chưa có)
  const [variantsList, setVariantsList] = useState(() => {
    if (product?.variants && product.variants.length > 0) {
      return product.variants.map((v, idx) => ({
        id: v.id || `v-${idx + 1}`,
        sku: v.sku || `${product.sku}-MS0${idx + 1}-${v.size || 36}`,
        color: v.color || 'Đen',
        size: v.size || 36,
        stock: v.stock !== undefined ? v.stock : 100,
        price: v.price || 3790000,
        priceFormatted: v.priceFormatted || `${(v.price || 3790000).toLocaleString('vi-VN')} đ`,
        discount: v.discount || null,
        status: v.status || 'Đang bán',
        image:
          v.image ||
          (v.images && v.images[0]) ||
          product.image ||
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80',
      }));
    }

    // Dữ liệu mẫu chuẩn 100% theo đúng ảnh chụp thực tế của người dùng
    const pSku = product?.sku || 'G66748';
    return [
      {
        id: 'var-1',
        sku: `${pSku}-MS05-37`,
        color: 'Xám',
        size: 37,
        stock: 100,
        price: 3790000,
        priceFormatted: '3.790.000 đ',
        discount: null,
        status: 'Đang bán',
        image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&auto=format&fit=crop&q=80',
      },
      {
        id: 'var-2',
        sku: `${pSku}-MS05-36`,
        color: 'Xám',
        size: 36,
        stock: 100,
        price: 3790000,
        priceFormatted: '3.790.000 đ',
        discount: null,
        status: 'Đang bán',
        image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&auto=format&fit=crop&q=80',
      },
      {
        id: 'var-3',
        sku: `${pSku}-MS01-37`,
        color: 'Đen',
        size: 37,
        stock: 100,
        price: 3790000,
        priceFormatted: '3.790.000 đ',
        discount: null,
        status: 'Đang bán',
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&auto=format&fit=crop&q=80',
      },
      {
        id: 'var-4',
        sku: `${pSku}-MS01-36`,
        color: 'Đen',
        size: 36,
        stock: 100,
        price: 3790000,
        priceFormatted: '3.790.000 đ',
        discount: null,
        status: 'Đang bán',
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&auto=format&fit=crop&q=80',
      },
      {
        id: 'var-5',
        sku: `${pSku}-MS02-38`,
        color: 'Trắng',
        size: 38,
        stock: 85,
        price: 3790000,
        priceFormatted: '3.790.000 đ',
        discount: null,
        status: 'Đang bán',
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&auto=format&fit=crop&q=80',
      },
      {
        id: 'var-6',
        sku: `${pSku}-MS02-39`,
        color: 'Trắng',
        size: 39,
        stock: 90,
        price: 3790000,
        priceFormatted: '3.790.000 đ',
        discount: null,
        status: 'Đang bán',
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&auto=format&fit=crop&q=80',
      },
    ];
  });

  // Bộ lọc
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColor, setSelectedColor] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Checkbox chọn hàng
  const [selectedIds, setSelectedIds] = useState([]);

  // Toast thông báo trên góc phải
  const [showToast, setShowToast] = useState(true);

  // Modal chỉnh sửa biến thể
  const [editingVariant, setEditingVariant] = useState(null);

  // Modal xem chi tiết biến thể
  const [viewingVariant, setViewingVariant] = useState(null);

  // Modal mã QR
  const [showQRModal, setShowQRModal] = useState(false);

  // Danh sách các màu và size có trong biến thể để làm bộ lọc
  const availableColors = useMemo(() => {
    return Array.from(new Set(variantsList.map((v) => v.color)));
  }, [variantsList]);

  const availableSizes = useMemo(() => {
    return Array.from(new Set(variantsList.map((v) => v.size))).sort((a, b) => Number(a) - Number(b));
  }, [variantsList]);

  // Lọc biến thể
  const filteredVariants = useMemo(() => {
    return variantsList.filter((v) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        v.sku.toLowerCase().includes(q) ||
        v.color.toLowerCase().includes(q) ||
        String(v.size).includes(q);

      const matchColor = selectedColor === 'all' || v.color === selectedColor;
      const matchSize = selectedSize === 'all' || String(v.size) === String(selectedSize);
      const matchStatus = selectedStatus === 'all' || v.status === selectedStatus;

      return matchSearch && matchColor && matchSize && matchStatus;
    });
  }, [variantsList, searchQuery, selectedColor, selectedSize, selectedStatus]);

  // Chọn tất cả
  const isAllSelected =
    filteredVariants.length > 0 && selectedIds.length === filteredVariants.length;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredVariants.map((v) => v.id));
    }
  };

  const handleToggleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Đổi trạng thái biến thể (Đang bán <-> Ngừng bán)
  const handleToggleStatus = (id) => {
    setVariantsList((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              status: v.status === 'Đang bán' ? 'Ngừng bán' : 'Đang bán',
            }
          : v
      )
    );
  };

  // Đặt lại bộ lọc
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedColor('all');
    setSelectedSize('all');
    setSelectedStatus('all');
  };

  // Xuất file Excel
  const handleExportExcel = () => {
    alert(`Đang xuất ${filteredVariants.length} biến thể của sản phẩm ra file Excel...`);
  };

  // Lưu chỉnh sửa biến thể
  const handleSaveEditVariant = (e) => {
    e.preventDefault();
    if (!editingVariant) return;

    setVariantsList((prev) =>
      prev.map((v) =>
        v.id === editingVariant.id
          ? {
              ...editingVariant,
              priceFormatted: `${Number(editingVariant.price || 0).toLocaleString('vi-VN')} đ`,
            }
          : v
      )
    );
    setEditingVariant(null);
  };

  return (
    <div className="space-y-5 max-w-[1600px] mx-auto pb-16 relative animate-in fade-in duration-150">
      {/* ── HEADER & TOAST THÔNG BÁO GÓC TRÊN ── */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Biến thể của:{' '}
              <span className="font-extrabold text-violet-600">
                {product?.name || 'ASICS GEL-Kayano 31'}
              </span>
            </h2>
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            Mã sản phẩm: <span className="font-mono font-bold text-slate-800">{product?.sku || 'G66748'}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Toast thông báo chuẩn theo ảnh mẫu */}
          {showToast && (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-lg flex items-start space-x-2.5 max-w-sm animate-in slide-in-from-top-2 duration-200">
              <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1 min-w-0 pr-1">
                <div className="text-xs font-bold text-slate-900">Xem CTSP thành công</div>
                <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                  Đang xem CTSP của {product?.name || 'ASICS GEL-Kayano 31'} ({product?.sku || 'G66748'})
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowToast(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xs p-0.5 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Nút Quay lại danh sách */}
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 rounded-xl border border-violet-200 text-violet-600 hover:bg-violet-50/70 hover:border-violet-300 font-semibold text-xs flex items-center space-x-1.5 transition cursor-pointer shadow-2xs shrink-0 self-start"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Quay lại</span>
          </button>
        </div>
      </div>

      {/* ── KHUNG 1: BỘ LỌC BIẾN THỂ ── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
        {/* Hàng 1: Tìm kiếm & Các nút hành động */}
        <div className="flex flex-col lg:flex-row gap-3 items-end lg:items-center justify-between">
          <div className="w-full lg:max-w-2xl space-y-1">
            <label className="text-xs font-semibold text-slate-600">
              Tìm kiếm theo tên hoặc mã phân loại
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nhập mã sản phẩm, phân loại, màu sắc..."
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-100 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none transition font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full lg:w-auto justify-end flex-wrap">
            {/* Nút Đặt lại bộ lọc */}
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-violet-200 hover:bg-violet-50/60 text-violet-600 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer shadow-2xs"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Đặt lại bộ lọc</span>
            </button>

            {/* Nút Tải QR */}
            <button
              type="button"
              onClick={() => setShowQRModal(true)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-violet-200 hover:bg-violet-50/60 text-violet-600 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer shadow-2xs"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-3-3m3 3l3-3m-8 7h10" />
              </svg>
              <span>Tải QR</span>
            </button>

            {/* Nút Xuất Excel */}
            <button
              type="button"
              onClick={handleExportExcel}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-violet-200 hover:bg-violet-50/60 text-violet-600 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer shadow-2xs"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Xuất Excel</span>
            </button>
          </div>
        </div>

        {/* Hàng 2: Bộ 3 Select lọc theo Màu sắc, Kích cỡ, Trạng thái */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Màu sắc</label>
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-violet-500 rounded-xl text-xs text-slate-800 focus:outline-none transition cursor-pointer"
            >
              <option value="all">Tất cả màu sắc</option>
              {availableColors.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Kích cỡ</label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-violet-500 rounded-xl text-xs text-slate-800 focus:outline-none transition cursor-pointer"
            >
              <option value="all">Tất cả kích cỡ</option>
              {availableSizes.map((s) => (
                <option key={s} value={s}>
                  Size {s}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Trạng thái</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-violet-500 rounded-xl text-xs text-slate-800 focus:outline-none transition cursor-pointer"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Đang bán">Đang bán</option>
              <option value="Ngừng bán">Ngừng bán</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── KHUNG 2: BẢNG DANH SÁCH CHI TIẾT BIẾN THỂ (CTSP) ── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-600 font-bold">
                <th className="py-3 px-3.5 text-center w-10">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleToggleSelectAll}
                    className="w-3.5 h-3.5 rounded text-violet-600 focus:ring-violet-500 border-slate-300 cursor-pointer accent-violet-600"
                  />
                </th>
                <th className="py-3 px-3 text-center w-12">STT</th>
                <th className="py-3 px-3.5 font-bold">Mã SP</th>
                <th className="py-3 px-3.5 font-bold">Mã CTSP</th>
                <th className="py-3 px-3 text-center">Ảnh</th>
                <th className="py-3 px-3.5">Màu sắc</th>
                <th className="py-3 px-3 text-center">Kích cỡ</th>
                <th className="py-3 px-3.5 text-center">Số lượng</th>
                <th className="py-3 px-3.5">Giá bán</th>
                <th className="py-3 px-3 text-center">Giảm</th>
                <th className="py-3 px-3.5 text-center">Trạng thái</th>
                <th className="py-3 px-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredVariants.map((v, idx) => {
                const isChecked = selectedIds.includes(v.id);
                return (
                  <tr
                    key={v.id}
                    className={`hover:bg-violet-50/20 transition ${
                      isChecked ? 'bg-violet-50/30' : ''
                    }`}
                  >
                    <td className="py-3.5 px-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleSelectRow(v.id)}
                        className="w-3.5 h-3.5 rounded text-violet-600 focus:ring-violet-500 border-slate-300 cursor-pointer accent-violet-600"
                      />
                    </td>
                    <td className="py-3.5 px-3 text-center text-slate-400 font-medium">
                      {idx + 1}
                    </td>
                    <td className="py-3.5 px-3.5 font-mono font-medium text-slate-800">
                      {product?.sku || 'G66748'}
                    </td>
                    <td className="py-3.5 px-3.5 font-mono font-bold text-slate-900">
                      {v.sku}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <div className="w-10 h-10 mx-auto rounded-xl overflow-hidden border border-slate-200 bg-white p-0.5">
                        <img
                          src={v.image}
                          alt={v.sku}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-3.5">
                      <span className="inline-flex items-center space-x-1.5 font-semibold text-slate-800">
                        <span className="text-slate-400 text-sm leading-none">•</span>
                        <span>{v.color}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-slate-900">
                      {v.size}
                    </td>
                    <td className="py-3.5 px-3.5 text-center font-semibold text-slate-800">
                      {v.stock}
                    </td>
                    <td className="py-3.5 px-3.5 font-bold text-slate-900">
                      {v.priceFormatted || `${Number(v.price || 0).toLocaleString('vi-VN')} đ`}
                    </td>
                    <td className="py-3.5 px-3 text-center text-slate-400">
                      {v.discount || '—'}
                    </td>
                    <td className="py-3.5 px-3.5 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                          v.status === 'Đang bán'
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                        }`}
                      >
                        {v.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        {/* Nút Power / Đổi trạng thái */}
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(v.id)}
                          title={v.status === 'Đang bán' ? 'Chuyển sang ngừng bán' : 'Kích hoạt bán'}
                          className={`w-7 h-7 rounded-full flex items-center justify-center transition cursor-pointer ${
                            v.status === 'Đang bán'
                              ? 'bg-violet-50 text-violet-600 hover:bg-violet-100'
                              : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                          }`}
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 11-12.728 0M12 2v10" />
                          </svg>
                        </button>

                        {/* Nút Bút chì / Sửa biến thể */}
                        <button
                          type="button"
                          onClick={() => setEditingVariant({ ...v })}
                          title="Chỉnh sửa biến thể này"
                          className="w-7 h-7 rounded-full flex items-center justify-center bg-slate-100 text-slate-600 hover:bg-violet-50 hover:text-violet-600 transition cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>

                        {/* Nút Mắt / Xem chi tiết */}
                        <button
                          type="button"
                          onClick={() => setViewingVariant(v)}
                          title="Xem chi tiết biến thể"
                          className="w-7 h-7 rounded-full flex items-center justify-center bg-slate-100 text-slate-500 hover:bg-violet-50 hover:text-violet-600 transition cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredVariants.length === 0 && (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-slate-400">
                    <div className="text-3xl mb-1.5">👟</div>
                    <div className="font-semibold text-slate-600 text-xs">Không tìm thấy biến thể nào phù hợp</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Vui lòng thử lại với từ khóa hoặc bộ lọc khác.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODAL CHỈNH SỬA BIẾN THỂ ── */}
      {editingVariant && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold text-sm">
                  ✏️
                </span>
                <h3 className="font-bold text-base text-slate-900">Chỉnh Sửa Biến Thể</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingVariant(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditVariant} className="space-y-3.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl flex items-center space-x-3">
                <img
                  src={editingVariant.image}
                  alt={editingVariant.sku}
                  className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                />
                <div>
                  <div className="font-mono font-bold text-slate-800">{editingVariant.sku}</div>
                  <div className="text-[11px] text-slate-500">
                    Màu: <b>{editingVariant.color}</b> • Size: <b>{editingVariant.size}</b>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Giá bán (VNĐ) *</label>
                <input
                  type="number"
                  required
                  value={editingVariant.price}
                  onChange={(e) =>
                    setEditingVariant({ ...editingVariant, price: Number(e.target.value) || 0 })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-violet-600 focus:bg-white focus:border-violet-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Số lượng tồn kho *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={editingVariant.stock}
                  onChange={(e) =>
                    setEditingVariant({ ...editingVariant, stock: Number(e.target.value) || 0 })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:border-violet-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Trạng thái bán</label>
                <select
                  value={editingVariant.status}
                  onChange={(e) =>
                    setEditingVariant({ ...editingVariant, status: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-violet-500 focus:outline-none cursor-pointer"
                >
                  <option value="Đang bán">Đang bán</option>
                  <option value="Ngừng bán">Ngừng bán</option>
                </select>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingVariant(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold transition cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold transition shadow-md shadow-violet-600/25 cursor-pointer"
                >
                  Cập nhật biến thể
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL XEM CHI TIẾT BIẾN THỂ ── */}
      {viewingVariant && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold text-sm">
                  👁
                </span>
                <h3 className="font-bold text-base text-slate-900">Chi Tiết Biến Thể</h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingVariant(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="w-full aspect-video rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                <img
                  src={viewingVariant.image}
                  alt={viewingVariant.sku}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5">
                <div className="text-[11px] text-slate-400">Mã chi tiết sản phẩm:</div>
                <div className="font-mono font-bold text-sm text-slate-900">{viewingVariant.sku}</div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Màu sắc</span>
                  <b className="text-slate-800 text-xs">{viewingVariant.color}</b>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Kích cỡ</span>
                  <b className="text-slate-800 text-xs">Size {viewingVariant.size}</b>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Tồn kho</span>
                  <b className="text-slate-800 text-xs">{viewingVariant.stock} đôi</b>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Trạng thái</span>
                  <b className={viewingVariant.status === 'Đang bán' ? 'text-emerald-600' : 'text-slate-400'}>
                    {viewingVariant.status}
                  </b>
                </div>
              </div>

              <div className="p-3 bg-violet-50/70 border border-violet-100 rounded-xl">
                <span className="text-[10px] text-violet-600 font-semibold block">Giá bán</span>
                <span className="font-bold text-base text-violet-700">{viewingVariant.priceFormatted}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setViewingVariant(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-xs transition cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL MÃ QR ── */}
      {showQRModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900">Mã QR Sản Phẩm & Biến Thể</h3>
              <button
                type="button"
                onClick={() => setShowQRModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-white rounded-2xl border-2 border-dashed border-violet-200 inline-block">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                  product?.sku || 'G66748'
                )}`}
                alt="QR Code"
                className="w-44 h-44 mx-auto rounded-lg"
              />
            </div>

            <div>
              <div className="font-bold text-xs text-slate-800">{product?.name || 'ASICS GEL-Kayano 31'}</div>
              <div className="font-mono text-[11px] text-slate-500 mt-0.5">{product?.sku || 'G66748'}</div>
            </div>

            <div className="flex justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  alert('Đang tải xuống bộ mã QR cho các biến thể...');
                  setShowQRModal(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-md shadow-violet-600/30 transition cursor-pointer"
              >
                Tải ảnh QR về máy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
