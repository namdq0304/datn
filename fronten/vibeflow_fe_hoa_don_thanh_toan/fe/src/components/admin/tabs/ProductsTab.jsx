import React, { useState } from 'react';
import AddProductModal from '../modals/AddProductModal';
import ProductDetailModal from '../modals/ProductDetailModal';
import AddProductView from './AddProductView';
import ProductVariantsView from './ProductVariantsView';
import { AdminPageHeader } from '../common';

// Dữ liệu mẫu chuẩn hệ thống VibeFlow
const DEFAULT_PRODUCTS = [
  {
    id: 1,
    sku: 'G66748',
    name: 'ASICS GEL-Kayano 31',
    brand: 'Asics',
    category: 'Running',
    stock: 400,
    priceFormatted: '3.790.000 đ',
    originalPriceFormatted: null,
    status: 'Kinh doanh',
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    sku: 'G57664',
    name: 'New Balance 530 Triple White',
    brand: 'New Balance',
    category: 'Sneakers',
    stock: 588,
    priceFormatted: '2.000.000 đ - 2.500.000 đ',
    originalPriceFormatted: '2.000.000 đ - 3.000.000 đ',
    status: 'Kinh doanh',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    sku: 'G86428',
    name: 'Air Jordan 1 Low Golf Wolf Grey',
    brand: 'Nike',
    category: 'Walking',
    stock: 394,
    priceFormatted: '2.000.000 đ',
    originalPriceFormatted: null,
    status: 'Kinh doanh',
    image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    sku: 'SP20',
    name: 'Brooks Ghost 14 Cushion Running',
    brand: 'Brooks',
    category: 'Running',
    stock: 300,
    priceFormatted: '3.080.000 đ',
    originalPriceFormatted: '3.850.000 đ',
    status: 'Kinh doanh',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 4,
    sku: 'SP19',
    name: 'Hoka Clifton 8 Cloud White',
    brand: 'Hoka',
    category: 'Running',
    stock: 300,
    priceFormatted: '2.960.000 đ',
    originalPriceFormatted: '3.700.000 đ',
    status: 'Kinh doanh',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 5,
    sku: 'SP18',
    name: 'Salomon Speedcross 5 Trail',
    brand: 'Salomon',
    category: 'Hiking',
    stock: 300,
    priceFormatted: '2.840.000 đ',
    originalPriceFormatted: null,
    status: 'Kinh doanh',
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 6,
    sku: 'SP17',
    name: 'Nike Air Force 1 07 Low Triple White',
    brand: 'Nike',
    category: 'Sneakers',
    stock: 450,
    priceFormatted: '2.690.000 đ',
    originalPriceFormatted: '2.990.000 đ',
    status: 'Kinh doanh',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 7,
    sku: 'SP16',
    name: 'Adidas Ultraboost Light Core Black',
    brand: 'Adidas',
    category: 'Running',
    stock: 220,
    priceFormatted: '3.500.000 đ',
    originalPriceFormatted: '4.200.000 đ',
    status: 'Kinh doanh',
    image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 8,
    sku: 'SP15',
    name: 'Air Jordan 4 Retro Military Black',
    brand: 'Jordan',
    category: 'Basketball',
    stock: 125,
    priceFormatted: '5.800.000 đ',
    originalPriceFormatted: null,
    status: 'Kinh doanh',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 9,
    sku: 'SP14',
    name: 'New Balance 990v5 Made in USA',
    brand: 'New Balance',
    category: 'Walking',
    stock: 85,
    priceFormatted: '4.950.000 đ',
    originalPriceFormatted: '5.500.000 đ',
    status: 'Kinh doanh',
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 10,
    sku: 'SP13',
    name: 'Hoka Bondi 8 Black White',
    brand: 'Hoka',
    category: 'Running',
    stock: 190,
    priceFormatted: '3.650.000 đ',
    originalPriceFormatted: null,
    status: 'Ngừng kinh doanh',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 11,
    sku: 'SP12',
    name: 'Salomon XT-6 Advanced Safari',
    brand: 'Salomon',
    category: 'Hiking',
    stock: 140,
    priceFormatted: '4.200.000 đ',
    originalPriceFormatted: '4.800.000 đ',
    status: 'Kinh doanh',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 12,
    sku: 'SP11',
    name: 'Brooks Adrenaline GTS 22',
    brand: 'Brooks',
    category: 'Running',
    stock: 75,
    priceFormatted: '2.950.000 đ',
    originalPriceFormatted: null,
    status: 'Ngừng kinh doanh',
    image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80',
  },
];

export default function ProductsTab() {
  const [productsList, setProductsList] = useState(DEFAULT_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [currentView, setCurrentView] = useState('list'); // 'list' | 'create' | 'variants'

  // Phân trang: tối đa 5 sản phẩm 1 trang
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Xử lý đặt lại bộ lọc
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedBrand('all');
    setSelectedCategory('all');
    setSelectedStatus('all');
    setCurrentPage(1);
  };

  // Xuất file Excel
  const handleExportExcel = () => {
    alert('Đang xuất danh sách sản phẩm ra tệp tin Excel...');
  };

  // Đổi trạng thái kinh doanh của sản phẩm
  const handleToggleStatus = (id) => {
    setProductsList((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === 'Kinh doanh' ? 'Ngừng kinh doanh' : 'Kinh doanh',
            }
          : item
      )
    );
  };

  // Thêm sản phẩm mới vào danh sách
  const handleAddProduct = (newProd) => {
    setProductsList((prev) => [newProd, ...prev]);
    setCurrentPage(1);
  };

  // Lọc sản phẩm theo các tiêu chí
  const filteredProducts = productsList.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      item.sku.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q) ||
      item.brand.toLowerCase().includes(q);

    const matchBrand = selectedBrand === 'all' || item.brand === selectedBrand;
    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchStatus = selectedStatus === 'all' || item.status === selectedStatus;

    return matchSearch && matchBrand && matchCategory && matchStatus;
  });

  // Tính toán dữ liệu phân trang (tối đa 5 sp / trang)
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + pageSize);
  const startItem = filteredProducts.length === 0 ? 0 : startIndex + 1;
  const endItem = Math.min(startIndex + pageSize, filteredProducts.length);

  // Chế độ tạo sản phẩm chuyên sâu (theo đúng giao diện thực tế)
  if (currentView === 'create') {
    return (
      <AddProductView
        onBack={() => setCurrentView('list')}
        onSaveProduct={(newProd) => {
          setProductsList((prev) => [newProd, ...prev]);
          setCurrentPage(1);
          setCurrentView('list');
        }}
      />
    );
  }

  // Chế độ xem biến thể chi tiết sản phẩm (CTSP) chuẩn giao diện thực tế
  if (currentView === 'variants' && viewingProduct) {
    return (
      <ProductVariantsView
        product={viewingProduct}
        onBack={() => {
          setViewingProduct(null);
          setCurrentView('list');
        }}
        onUpdateProduct={(updated) => {
          setProductsList((prev) =>
            prev.map((item) => (item.id === updated.id ? updated : item))
          );
        }}
      />
    );
  }

  return (
    <div className="space-y-5 max-w-[1600px] mx-auto pb-12 relative">
      {/* ── TIÊU ĐỀ TRANG ĐỒNG BỘ TONE TÍM VIBEFLOW ── */}
      <AdminPageHeader
        category="Sản Phẩm & Kho Hàng"
        title="Quản Lý Sản Phẩm"
        badgeVariant="violet"
        subtitle="Danh mục giày thể thao, tra cứu tồn kho, cấu hình chi tiết biến thể và trạng thái kinh doanh."
        metrics={[
          { label: 'Tổng sản phẩm', value: productsList.length },
          { label: 'Đang kinh doanh', value: productsList.filter((p) => p.status === 'Kinh doanh').length, highlight: true },
        ]}
      />

      {/* ── KHUNG 1: BỘ LỌC ── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
        {/* Header Bộ lọc */}
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-md bg-violet-50 flex items-center justify-center text-violet-600 text-xs">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </div>
          <h3 className="font-bold text-sm text-slate-900">Bộ lọc</h3>
        </div>

        {/* Hàng 1: Tìm kiếm & Các nút hành động */}
        <div className="flex flex-col lg:flex-row gap-3 items-end lg:items-center justify-between">
          <div className="w-full lg:max-w-xl space-y-1">
            <label className="text-xs font-semibold text-slate-600">Tìm kiếm</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Tìm theo mã SP / tên sản phẩm..."
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

            {/* Nút + Thêm sản phẩm */}
            <button
              type="button"
              onClick={() => setCurrentView('create')}
              className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 active:scale-[0.99] text-white text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer shadow-sm shadow-violet-500/25"
            >
              <span className="text-sm font-bold leading-none">+</span>
              <span>Thêm sản phẩm</span>
            </button>
          </div>
        </div>

        {/* Hàng 2: Bộ 3 Select lọc theo Thương hiệu, Loại giày, Trạng thái */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Thương hiệu</label>
            <select
              value={selectedBrand}
              onChange={(e) => {
                setSelectedBrand(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-violet-500 rounded-xl text-xs text-slate-800 focus:outline-none transition cursor-pointer"
            >
              <option value="all">Tất cả thương hiệu</option>
              <option value="New Balance">New Balance</option>
              <option value="Nike">Nike</option>
              <option value="Brooks">Brooks</option>
              <option value="Hoka">Hoka</option>
              <option value="Salomon">Salomon</option>
              <option value="Adidas">Adidas</option>
              <option value="Jordan">Jordan</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Loại giày</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-violet-500 rounded-xl text-xs text-slate-800 focus:outline-none transition cursor-pointer"
            >
              <option value="all">Tất cả loại giày</option>
              <option value="Sneakers">Sneakers</option>
              <option value="Walking">Walking</option>
              <option value="Running">Running</option>
              <option value="Hiking">Hiking</option>
              <option value="Basketball">Basketball</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Trạng thái</label>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-violet-500 rounded-xl text-xs text-slate-800 focus:outline-none transition cursor-pointer"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Kinh doanh">Kinh doanh</option>
              <option value="Ngừng kinh doanh">Ngừng kinh doanh</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── KHUNG 2: DANH SÁCH SẢN PHẨM ── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {/* Header Danh sách */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-md bg-violet-50 text-violet-600 flex items-center justify-center text-xs font-bold">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="font-bold text-sm text-slate-900">Danh sách sản phẩm</h3>
          </div>
          <div className="text-xs text-slate-500">
            Tổng cộng: <span className="font-bold text-violet-600">{filteredProducts.length}</span> sản phẩm
          </div>
        </div>

        {/* Bảng Dữ Liệu Sản Phẩm */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-600 font-bold">
                <th className="py-3 px-4 text-center w-14">STT</th>
                <th className="py-3 px-4">Mã SP</th>
                <th className="py-3 px-4">Tên SP</th>
                <th className="py-3 px-4">Thương hiệu</th>
                <th className="py-3 px-4">Loại giày</th>
                <th className="py-3 px-4">Số lượng</th>
                <th className="py-3 px-4">Giá bán</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedProducts.map((p, idx) => (
                <tr key={p.id} className="hover:bg-violet-50/20 transition">
                  <td className="py-4 px-4 text-center text-slate-500 font-medium">
                    {startIndex + idx + 1}
                  </td>
                  <td className="py-4 px-4 font-mono font-medium text-slate-800">
                    {p.sku}
                  </td>
                  <td className="py-4 px-4 font-semibold text-slate-900 max-w-xs truncate">
                    {p.name}
                  </td>
                  <td className="py-4 px-4 text-slate-700">
                    {p.brand}
                  </td>
                  <td className="py-4 px-4 text-slate-700">
                    {p.category || 'Sneakers'}
                  </td>
                  <td className="py-4 px-4 font-medium text-slate-800">
                    {p.stock}
                  </td>
                  <td className="py-4 px-4 space-y-0.5">
                    <div className="font-bold text-violet-600">
                      {p.priceFormatted || `${p.price?.toLocaleString('vi-VN')} đ`}
                    </div>
                    {p.originalPriceFormatted && (
                      <div className="text-[11px] text-slate-400 line-through">
                        {p.originalPriceFormatted}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`font-semibold ${
                        p.status === 'Kinh doanh' ? 'text-emerald-500' : 'text-slate-400'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      {/* Nút Power / Đổi trạng thái */}
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(p.id)}
                        title={p.status === 'Kinh doanh' ? 'Chuyển sang ngừng kinh doanh' : 'Kích hoạt kinh doanh'}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition cursor-pointer ${
                          p.status === 'Kinh doanh'
                            ? 'bg-violet-50 text-violet-600 hover:bg-violet-100'
                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        }`}
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 11-12.728 0M12 2v10" />
                        </svg>
                      </button>

                      {/* Nút Xem chi tiết biến thể (CTSP) */}
                      <button
                        type="button"
                        onClick={() => {
                          setViewingProduct(p);
                          setCurrentView('variants');
                        }}
                        title="Xem biến thể chi tiết sản phẩm (CTSP)"
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
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <div className="text-3xl mb-1.5">👟</div>
                    <div className="font-semibold text-slate-600 text-xs">Không tìm thấy sản phẩm nào phù hợp</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Vui lòng thử lại với từ khóa hoặc bộ lọc khác.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── THANH PHÂN TRANG (Tối đa 5 sp / 1 trang) ── */}
        {filteredProducts.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="text-slate-500">
              Hiển thị <span className="font-semibold text-slate-800">{startItem} - {endItem}</span> trên tổng <span className="font-semibold text-slate-800">{filteredProducts.length}</span> sản phẩm (Tối đa 5 sp/trang)
            </div>

            <div className="flex items-center space-x-1.5">
              {/* Nút Trang trước */}
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={safeCurrentPage === 1}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:border-violet-200 hover:text-violet-600 hover:bg-violet-50/60 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-600 disabled:hover:border-slate-200 disabled:cursor-not-allowed transition font-medium cursor-pointer flex items-center space-x-1"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                <span>Trước</span>
              </button>

              {/* Các nút số trang */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center ${
                      pageNum === safeCurrentPage
                        ? 'bg-violet-600 text-white shadow-xs shadow-violet-500/30'
                        : 'border border-slate-200 text-slate-600 hover:border-violet-200 hover:text-violet-600 hover:bg-violet-50/60'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              {/* Nút Trang sau */}
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={safeCurrentPage === totalPages}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:border-violet-200 hover:text-violet-600 hover:bg-violet-50/60 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-600 disabled:hover:border-slate-200 disabled:cursor-not-allowed transition font-medium cursor-pointer flex items-center space-x-1"
              >
                <span>Sau</span>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Nút nổi Floating Action Button ở góc dưới phải (Tone Tím VibeFlow) ── */}
      <button
        type="button"
        onClick={() => setCurrentView('create')}
        title="Thêm sản phẩm mới"
        className="fixed bottom-6 right-6 w-12 h-12 bg-violet-600 hover:bg-violet-700 active:scale-95 text-white rounded-full flex items-center justify-center shadow-lg shadow-violet-600/30 transition cursor-pointer z-40"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      </button>

      {/* ── Modal Thêm Sản Phẩm ── */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProduct={handleAddProduct}
      />

      {/* ── Modal Chi Tiết Sản Phẩm ── */}
      <ProductDetailModal
        product={selectedProductDetail}
        onClose={() => setSelectedProductDetail(null)}
      />
    </div>
  );
}
