import React, { useState, useMemo } from 'react';
import { INITIAL_CAMPAIGNS } from '../initialData';
import { AdminPageHeader } from '../common';

// Danh sách sản phẩm mẫu chuẩn phục vụ chọn áp dụng cho Đợt giảm giá
const CAMPAIGN_SAMPLE_PRODUCTS = [
  {
    id: 1,
    sku: 'G66748',
    name: 'ASICS GEL-Kayano 31',
    brand: 'ASICS',
    price: 3790000,
    image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=300&auto=format&fit=crop&q=80',
    colors: [
      { name: 'Xám', code: 'MS05' },
      { name: 'Đen', code: 'MS01' },
      { name: 'Trắng', code: 'MS02' },
    ],
    sizes: ['36', '37', '40', '41'],
  },
  {
    id: 2,
    sku: 'G57664',
    name: 'New Balance 530',
    brand: 'New Balance',
    price: 2750000,
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=300&auto=format&fit=crop&q=80',
    colors: [
      { name: 'Trắng Bạc', code: 'MS01' },
      { name: 'Trắng Đen', code: 'MS02' },
    ],
    sizes: ['39', '40', '41'],
  },
  {
    id: 3,
    sku: 'G86428',
    name: 'Air Jordan 1 Low G',
    brand: 'Nike',
    price: 3850000,
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=300&auto=format&fit=crop&q=80',
    colors: [
      { name: 'Trắng Xanh', code: 'MS01' },
      { name: 'Xám Wolf', code: 'MS02' },
    ],
    sizes: ['40', '41', '42', '43'],
  },
  {
    id: 4,
    sku: 'SP20',
    name: 'Brooks Ghost 14',
    brand: 'Brooks',
    price: 2950000,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&auto=format&fit=crop&q=80',
    colors: [
      { name: 'Đen', code: 'MS01' },
      { name: 'Xanh Navy', code: 'MS02' },
    ],
    sizes: ['41', '42', '43'],
  },
  {
    id: 5,
    sku: 'SP19',
    name: 'Hoka Clifton 8',
    brand: 'Hoka',
    price: 3450000,
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300&auto=format&fit=crop&q=80',
    colors: [
      { name: 'Cam Đen', code: 'MS01' },
      { name: 'Trắng', code: 'MS02' },
    ],
    sizes: ['40', '41', '42'],
  },
  {
    id: 6,
    sku: 'SP18',
    name: 'Nike Air Zoom Pegasus 40',
    brand: 'Nike',
    price: 3100000,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop&q=80',
    colors: [
      { name: 'Trắng', code: 'MS01' },
      { name: 'Đen', code: 'MS02' },
    ],
    sizes: ['39', '40', '41', '42'],
  },
  {
    id: 7,
    sku: 'SP17',
    name: 'Adidas Ultraboost Light',
    brand: 'Adidas',
    price: 4200000,
    image: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=300&auto=format&fit=crop&q=80',
    colors: [
      { name: 'Đen', code: 'MS01' },
      { name: 'Xám Khói', code: 'MS02' },
    ],
    sizes: ['40', '41', '42', '43'],
  },
  {
    id: 8,
    sku: 'SP16',
    name: 'Saucony Triumph 21',
    brand: 'Saucony',
    price: 3350000,
    image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=300&auto=format&fit=crop&q=80',
    colors: [
      { name: 'Xanh Dương', code: 'MS01' },
      { name: 'Đỏ', code: 'MS02' },
    ],
    sizes: ['41', '42'],
  },
];

// 4 biến thể ban đầu chuẩn theo ảnh chụp tham chiếu của người dùng
const INITIAL_SELECTED_VARIANTS = [
  {
    key: 'G66748-Xám-37',
    variantSku: 'G66748-MS05-37',
    productSku: 'G66748',
    productName: 'ASICS GEL-Kayano 31',
    image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=300&auto=format&fit=crop&q=80',
    color: 'Xám',
    size: '37',
    originalPrice: 3790000,
    quantity: 100,
  },
  {
    key: 'G66748-Xám-36',
    variantSku: 'G66748-MS05-36',
    productSku: 'G66748',
    productName: 'ASICS GEL-Kayano 31',
    image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=300&auto=format&fit=crop&q=80',
    color: 'Xám',
    size: '36',
    originalPrice: 3790000,
    quantity: 100,
  },
  {
    key: 'G66748-Đen-37',
    variantSku: 'G66748-MS01-37',
    productSku: 'G66748',
    productName: 'ASICS GEL-Kayano 31',
    image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=300&auto=format&fit=crop&q=80',
    color: 'Đen',
    size: '37',
    originalPrice: 3790000,
    quantity: 100,
  },
  {
    key: 'G66748-Đen-36',
    variantSku: 'G66748-MS01-36',
    productSku: 'G66748',
    productName: 'ASICS GEL-Kayano 31',
    image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=300&auto=format&fit=crop&q=80',
    color: 'Đen',
    size: '36',
    originalPrice: 3790000,
    quantity: 100,
  },
];

export default function DiscountsTab({
  vouchersList = [],
  setVouchersList,
  discountSubTab = 'vouchers',
  setDiscountSubTab,
  campaignsList = INITIAL_CAMPAIGNS,
  setCampaignsList,
}) {
  // Chế độ xem phiếu giảm giá: 'list' | 'create'
  const [voucherFormMode, setVoucherFormMode] = useState('list');

  // Chế độ xem đợt giảm giá: 'list' | 'create'
  const [campaignViewMode, setCampaignViewMode] = useState('list');

  // ─────────────────────────────────────────────────────────────────────────
  // PHẦN 1: DỮ LIỆU & BỘ LỌC CHO "PHIẾU GIẢM GIÁ" (VOUCHERS)
  // ─────────────────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAudience, setSelectedAudience] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedDiscountType, setSelectedDiscountType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const [voucherForm, setVoucherForm] = useState({
    code: 'VCH8H5TG9',
    name: '',
    audience: 'public',
    discountType: 'percent',
    discountValue: 0,
    minOrder: 0,
    maxDiscount: 0,
    quantity: '',
    isUnlimitedQuantity: false,
    startDate: '2026-08-16',
    endDate: '',
  });

  const [selectedVoucherDetail, setSelectedVoucherDetail] = useState(null);

  const handleGenerateRandomVoucherCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let rand = '';
    for (let i = 0; i < 6; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setVoucherForm((prev) => ({ ...prev, code: `VCH${rand}` }));
  };

  const handleResetVoucherFilters = () => {
    setSearchQuery('');
    setSelectedAudience('all');
    setStartDate('');
    setEndDate('');
    setSelectedDiscountType('all');
    setSelectedStatus('all');
    setCurrentPage(1);
  };

  const handleToggleVoucherStatus = (id) => {
    if (setVouchersList) {
      setVouchersList((prev) =>
        prev.map((v) => {
          if (v.id === id) {
            const nextStatus = v.status === 'Đang hoạt động' ? 'Ngừng hoạt động' : 'Đang hoạt động';
            return { ...v, status: nextStatus };
          }
          return v;
        })
      );
    }
  };

  const handleSubmitCreateVoucher = (e) => {
    e.preventDefault();
    if (!voucherForm.name.trim()) {
      alert('Vui lòng nhập tên phiếu giảm giá!');
      return;
    }

    const discountVal =
      voucherForm.discountType === 'percent'
        ? `${voucherForm.discountValue}%`
        : `${Number(voucherForm.discountValue || 0).toLocaleString('vi-VN')}đ`;

    const code = voucherForm.code.trim().toUpperCase() || `VCH${Math.floor(100000 + Math.random() * 900000)}`;

    const newVoucher = {
      id: Date.now(),
      code,
      name: voucherForm.name.trim(),
      audience: voucherForm.audience,
      audienceLabel: voucherForm.audience === 'public' ? 'Công khai' : 'Cá nhân',
      discountVal,
      discountType: voucherForm.discountType,
      discountNumber: Number(voucherForm.discountValue) || 0,
      minOrder: Number(voucherForm.minOrder) || 0,
      maxDiscount: Number(voucherForm.maxDiscount) || 0,
      quantity: voucherForm.isUnlimitedQuantity ? 'Vô hạn' : Number(voucherForm.quantity) || 100,
      startDate: voucherForm.startDate
        ? new Date(voucherForm.startDate).toLocaleDateString('vi-VN')
        : '16/8/2026',
      endDate: voucherForm.endDate
        ? new Date(voucherForm.endDate).toLocaleDateString('vi-VN')
        : '1/9/2026',
      status: 'Đang hoạt động',
    };

    if (setVouchersList) {
      setVouchersList((prev) => [newVoucher, ...prev]);
    }
    setVoucherFormMode('list');
    setCurrentPage(1);
    setVoucherForm({
      code: '',
      name: '',
      audience: 'public',
      discountType: 'percent',
      discountValue: 0,
      minOrder: 0,
      maxDiscount: 0,
      quantity: '',
      isUnlimitedQuantity: false,
      startDate: '2026-08-16',
      endDate: '',
    });
  };

  const filteredVouchers = useMemo(() => {
    return vouchersList.filter((v) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchCode = (v.code || '').toLowerCase().includes(q);
        const matchName = (v.name || '').toLowerCase().includes(q);
        if (!matchCode && !matchName) return false;
      }
      if (selectedAudience !== 'all') {
        if (v.audience !== selectedAudience && v.audienceLabel !== selectedAudience) return false;
      }
      if (selectedDiscountType !== 'all') {
        if (v.discountType !== selectedDiscountType) return false;
      }
      if (selectedStatus !== 'all') {
        if (v.status !== selectedStatus) return false;
      }
      return true;
    });
  }, [vouchersList, searchQuery, selectedAudience, selectedDiscountType, selectedStatus]);

  const totalPages = Math.max(1, Math.ceil(filteredVouchers.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedVouchers = filteredVouchers.slice(startIndex, startIndex + pageSize);

  // ─────────────────────────────────────────────────────────────────────────
  // PHẦN 2: DỮ LIỆU & BỘ LỌC CHO "ĐỢT GIẢM GIÁ" (CAMPAIGNS)
  // ─────────────────────────────────────────────────────────────────────────
  const [campaignSearch, setCampaignSearch] = useState('');
  const [campaignStartDate, setCampaignStartDate] = useState('');
  const [campaignEndDate, setCampaignEndDate] = useState('');
  const [campaignStatus, setCampaignStatus] = useState('all');
  const [campaignPage, setCampaignPage] = useState(1);
  const [campaignPageSize, setCampaignPageSize] = useState(5);
  const [selectedCampaignDetail, setSelectedCampaignDetail] = useState(null);

  // Form Thêm Đợt Giảm Giá (Khung 1 Bên Trái)
  const [addCampaignForm, setAddCampaignForm] = useState({
    code: 'DGGD5OY17',
    name: '',
    discountPercent: 20, // Mặc định 20% khớp với ảnh: 3.790.000 -> 3.032.000 đ
    startDate: '2026-08-16',
    endDate: '',
    description: '',
  });

  // State chọn sản phẩm & biến thể áp dụng cho đợt giảm (Khung 2 & Khung 3)
  const [productSearch, setProductSearch] = useState('');
  const [productColorFilter, setProductColorFilter] = useState('all');
  const [productSizeFilter, setProductSizeFilter] = useState('all');
  const [productPage, setProductPage] = useState(1);
  const [productPageSize, setProductPageSize] = useState(5);
  const [expandedProductIds, setExpandedProductIds] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState(INITIAL_SELECTED_VARIANTS);

  // Bộ lọc cho Khung 3 (Sản phẩm & biến thể đã chọn áp dụng)
  const [bottomSearch, setBottomSearch] = useState('');
  const [bottomColorFilter, setBottomColorFilter] = useState('all');
  const [bottomSizeFilter, setBottomSizeFilter] = useState('all');
  const [bottomPage, setBottomPage] = useState(1);
  const [bottomPageSize, setBottomPageSize] = useState(10);

  const handleGenerateCampaignCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let rand = '';
    for (let i = 0; i < 6; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setAddCampaignForm((prev) => ({ ...prev, code: `DGG${rand}` }));
  };

  const handleResetCampaignFilters = () => {
    setCampaignSearch('');
    setCampaignStartDate('');
    setCampaignEndDate('');
    setCampaignStatus('all');
    setCampaignPage(1);
  };

  const handleToggleCampaignStatus = (id) => {
    if (setCampaignsList) {
      setCampaignsList((prev) =>
        prev.map((c) => {
          if (c.id === id) {
            const next = c.status === 'Đang hoạt động' ? 'Ngừng hoạt động' : 'Đang hoạt động';
            return { ...c, status: next };
          }
          return c;
        })
      );
    }
  };

  const filteredCampaigns = useMemo(() => {
    const list = campaignsList && campaignsList.length > 0 ? campaignsList : INITIAL_CAMPAIGNS;
    return list.filter((c) => {
      if (campaignSearch.trim()) {
        const q = campaignSearch.toLowerCase().trim();
        const matchCode = (c.code || '').toLowerCase().includes(q);
        const matchName = (c.name || '').toLowerCase().includes(q);
        const matchVal = (c.discountVal || `${c.discountNumber || ''}%`).toLowerCase().includes(q);
        if (!matchCode && !matchName && !matchVal) return false;
      }
      if (campaignStatus !== 'all') {
        if (c.status !== campaignStatus) return false;
      }
      return true;
    });
  }, [campaignsList, campaignSearch, campaignStatus]);

  const campaignTotalPages = Math.max(1, Math.ceil(filteredCampaigns.length / campaignPageSize));
  const safeCampaignPage = Math.min(campaignPage, campaignTotalPages);
  const campaignStartIndex = (safeCampaignPage - 1) * campaignPageSize;
  const paginatedCampaigns = filteredCampaigns.slice(campaignStartIndex, campaignStartIndex + campaignPageSize);

  const getColorName = (c) => (typeof c === 'object' && c !== null ? c.name : c);
  const getColorCode = (c) => (typeof c === 'object' && c !== null ? c.code : 'MS01');

  // Lọc sản phẩm ở Khung 2 (Chọn sản phẩm áp dụng)
  const filteredSelectableProducts = useMemo(() => {
    return CAMPAIGN_SAMPLE_PRODUCTS.filter((p) => {
      if (productSearch.trim()) {
        const q = productSearch.toLowerCase().trim();
        const matchSku = p.sku.toLowerCase().includes(q);
        const matchName = p.name.toLowerCase().includes(q);
        if (!matchSku && !matchName) return false;
      }
      if (productColorFilter !== 'all') {
        const hasColor = p.colors.some((c) => getColorName(c) === productColorFilter);
        if (!hasColor) return false;
      }
      if (productSizeFilter !== 'all') {
        if (!p.sizes.includes(productSizeFilter)) return false;
      }
      return true;
    });
  }, [productSearch, productColorFilter, productSizeFilter]);

  const productTotalPages = Math.max(1, Math.ceil(filteredSelectableProducts.length / productPageSize));
  const productStartIndex = (productPage - 1) * productPageSize;
  const paginatedSelectableProducts = filteredSelectableProducts.slice(productStartIndex, productStartIndex + productPageSize);

  // Toggle chọn toàn bộ biến thể của 1 sản phẩm
  const handleToggleSelectProduct = (product) => {
    const productVariantKeys = [];
    product.colors.forEach((col) => {
      const colName = getColorName(col);
      product.sizes.forEach((sz) => {
        productVariantKeys.push(`${product.sku}-${colName}-${sz}`);
      });
    });

    const isAllSelected = productVariantKeys.every((key) =>
      selectedVariants.some((v) => v.key === key)
    );

    if (isAllSelected) {
      // Bỏ chọn tất cả biến thể của sản phẩm này
      setSelectedVariants((prev) => prev.filter((v) => v.productSku !== product.sku));
    } else {
      // Chọn tất cả biến thể của sản phẩm này
      const newVars = [];
      product.colors.forEach((col) => {
        const colName = getColorName(col);
        const colCode = getColorCode(col);
        product.sizes.forEach((sz) => {
          const key = `${product.sku}-${colName}-${sz}`;
          if (!selectedVariants.some((v) => v.key === key)) {
            newVars.push({
              key,
              variantSku: `${product.sku}-${colCode}-${sz}`,
              productSku: product.sku,
              productName: product.name,
              image: product.image,
              color: colName,
              size: sz,
              originalPrice: product.price,
              quantity: 100,
            });
          }
        });
      });
      setSelectedVariants((prev) => [...prev, ...newVars]);
    }
  };

  // Toggle mở rộng hàng biến thể
  const handleToggleExpandProduct = (productId) => {
    setExpandedProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // Xóa 1 biến thể khỏi danh sách đã chọn
  const handleRemoveSelectedVariant = (variantKey) => {
    setSelectedVariants((prev) => prev.filter((v) => v.key !== variantKey));
  };

  // Danh sách màu sắc và kích cỡ có sẵn trong các biến thể đã chọn
  const availableBottomColors = useMemo(() => {
    const set = new Set();
    selectedVariants.forEach((v) => {
      if (v.color) set.add(v.color);
    });
    return Array.from(set);
  }, [selectedVariants]);

  const availableBottomSizes = useMemo(() => {
    const set = new Set();
    selectedVariants.forEach((v) => {
      if (v.size) set.add(v.size);
    });
    return Array.from(set);
  }, [selectedVariants]);

  // Bộ lọc dữ liệu Khung 3
  const filteredBottomVariants = useMemo(() => {
    return selectedVariants.filter((item) => {
      if (bottomSearch.trim()) {
        const q = bottomSearch.toLowerCase().trim();
        const matchName = (item.productName || '').toLowerCase().includes(q);
        const matchSku = (item.productSku || '').toLowerCase().includes(q);
        const matchVariantSku = (item.variantSku || '').toLowerCase().includes(q);
        const matchColor = (item.color || '').toLowerCase().includes(q);
        const matchSize = (item.size || '').toLowerCase().includes(q);
        if (!matchName && !matchSku && !matchVariantSku && !matchColor && !matchSize) return false;
      }
      if (bottomColorFilter !== 'all') {
        if (item.color !== bottomColorFilter) return false;
      }
      if (bottomSizeFilter !== 'all') {
        if (item.size !== bottomSizeFilter) return false;
      }
      return true;
    });
  }, [selectedVariants, bottomSearch, bottomColorFilter, bottomSizeFilter]);

  const bottomTotalPages = Math.max(1, Math.ceil(filteredBottomVariants.length / bottomPageSize));
  const safeBottomPage = Math.min(bottomPage, bottomTotalPages);
  const bottomStartIndex = (safeBottomPage - 1) * bottomPageSize;
  const paginatedBottomVariants = filteredBottomVariants.slice(bottomStartIndex, bottomStartIndex + bottomPageSize);

  // Xử lý Lưu đợt giảm giá mới
  const handleSubmitCreateCampaign = (e) => {
    e.preventDefault();
    if (!addCampaignForm.name.trim()) {
      alert('Vui lòng nhập tên đợt giảm giá!');
      return;
    }
    const code = addCampaignForm.code.trim().toUpperCase() || `DGG${Math.floor(100000 + Math.random() * 900000)}`;
    const newCamp = {
      id: Date.now(),
      code,
      name: addCampaignForm.name.trim(),
      discountVal: `${addCampaignForm.discountPercent}%`,
      discountNumber: Number(addCampaignForm.discountPercent) || 20,
      startDate: addCampaignForm.startDate
        ? new Date(addCampaignForm.startDate).toLocaleDateString('vi-VN')
        : '16/8/2026',
      endDate: addCampaignForm.endDate
        ? new Date(addCampaignForm.endDate).toLocaleDateString('vi-VN')
        : '31/8/2026',
      appliedVariantsCount: selectedVariants.length,
      status: 'Đang hoạt động',
    };

    if (setCampaignsList) {
      setCampaignsList((prev) => [newCamp, ...prev]);
    }
    setCampaignViewMode('list');
    setCampaignPage(1);
    setAddCampaignForm({
      code: '',
      name: '',
      discountPercent: 0,
      startDate: '2026-08-16',
      endDate: '',
      description: '',
    });
    setSelectedVariants([]);
  };

  // =========================================================================
  // GIAO DIỆN TẠO PHIẾU GIẢM GIÁ (voucherFormMode === 'create')
  // =========================================================================
  if (discountSubTab === 'vouchers' && voucherFormMode === 'create') {
    return (
      <div className="space-y-4 max-w-[1500px] mx-auto pb-16 animate-in fade-in duration-150">
        <div>
          <button
            type="button"
            onClick={() => setVoucherFormMode('list')}
            className="w-9 h-9 rounded-full bg-white border border-slate-200 hover:bg-violet-50 hover:border-violet-200 text-slate-700 hover:text-violet-600 shadow-2xs flex items-center justify-center transition cursor-pointer"
            title="Quay lại danh sách phiếu"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center shadow-2xs">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <h3 className="font-bold text-base text-slate-900">Thông tin phiếu</h3>
          </div>

          <form onSubmit={handleSubmitCreateVoucher} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Mã phiếu <span className="text-rose-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={voucherForm.code}
                    onChange={(e) => setVoucherForm({ ...voucherForm, code: e.target.value.toUpperCase() })}
                    placeholder="VCH8H5TG9"
                    className="w-full px-3.5 py-2.5 pr-10 bg-white border border-slate-200 rounded-xl focus:border-violet-500 focus:ring-1 focus:ring-violet-100 focus:outline-none font-mono font-bold text-slate-800 text-xs transition"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateRandomVoucherCode}
                    title="Sinh mã ngẫu nhiên mới"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-violet-600 transition cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Tên phiếu <span className="text-rose-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={voucherForm.name}
                  onChange={(e) => setVoucherForm({ ...voucherForm, name: e.target.value })}
                  placeholder="Ví dụ: Giảm giá hè 2024"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-violet-500 focus:ring-1 focus:ring-violet-100 focus:outline-none text-slate-800 text-xs placeholder:text-slate-400 font-medium transition"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Hình thức phiếu <span className="text-rose-500 font-bold">*</span>
                </label>
                <div className="flex items-center space-x-6 pt-1">
                  <label className="inline-flex items-center space-x-2 cursor-pointer text-xs text-slate-800 font-medium select-none">
                    <input
                      type="radio"
                      name="formAudience"
                      checked={voucherForm.audience === 'public'}
                      onChange={() => setVoucherForm({ ...voucherForm, audience: 'public' })}
                      className="w-4 h-4 text-violet-600 border-slate-300 focus:ring-violet-500 cursor-pointer"
                    />
                    <span>Công khai</span>
                  </label>
                  <label className="inline-flex items-center space-x-2 cursor-pointer text-xs text-slate-800 font-medium select-none">
                    <input
                      type="radio"
                      name="formAudience"
                      checked={voucherForm.audience === 'personal'}
                      onChange={() => setVoucherForm({ ...voucherForm, audience: 'personal' })}
                      className="w-4 h-4 text-violet-600 border-slate-300 focus:ring-violet-500 cursor-pointer"
                    />
                    <span>Cá nhân</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Loại giảm <span className="text-rose-500 font-bold">*</span>
                </label>
                <div className="flex items-center space-x-6 pt-1">
                  <label className="inline-flex items-center space-x-2 cursor-pointer text-xs text-slate-800 font-medium select-none">
                    <input
                      type="radio"
                      name="formDiscountType"
                      checked={voucherForm.discountType === 'percent'}
                      onChange={() => setVoucherForm({ ...voucherForm, discountType: 'percent' })}
                      className="w-4 h-4 text-violet-600 border-slate-300 focus:ring-violet-500 cursor-pointer"
                    />
                    <span>Phần trăm (%)</span>
                  </label>
                  <label className="inline-flex items-center space-x-2 cursor-pointer text-xs text-slate-800 font-medium select-none">
                    <input
                      type="radio"
                      name="formDiscountType"
                      checked={voucherForm.discountType === 'fixed'}
                      onChange={() => setVoucherForm({ ...voucherForm, discountType: 'fixed' })}
                      className="w-4 h-4 text-violet-600 border-slate-300 focus:ring-violet-500 cursor-pointer"
                    />
                    <span>Tiền mặt (VNĐ)</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Giá trị giảm ({voucherForm.discountType === 'percent' ? '%' : 'VNĐ'}){' '}
                  <span className="text-rose-500 font-bold">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    min="0"
                    max={voucherForm.discountType === 'percent' ? 100 : undefined}
                    value={voucherForm.discountValue}
                    onChange={(e) => setVoucherForm({ ...voucherForm, discountValue: e.target.value })}
                    className="w-full px-3.5 py-2.5 pr-8 bg-white border border-slate-200 rounded-xl focus:border-violet-500 focus:ring-1 focus:ring-violet-100 focus:outline-none text-slate-800 text-xs font-bold transition"
                  />
                  <span className="absolute right-3.5 text-xs font-semibold text-slate-400 pointer-events-none">
                    {voucherForm.discountType === 'percent' ? '%' : 'VNĐ'}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Giá trị đơn tối thiểu (VNĐ)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={voucherForm.minOrder}
                  onChange={(e) => setVoucherForm({ ...voucherForm, minOrder: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-violet-500 focus:ring-1 focus:ring-violet-100 focus:outline-none text-slate-800 text-xs font-medium transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Giảm tối đa (VNĐ)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={voucherForm.maxDiscount}
                  onChange={(e) => setVoucherForm({ ...voucherForm, maxDiscount: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-violet-500 focus:ring-1 focus:ring-violet-100 focus:outline-none text-slate-800 text-xs font-medium transition"
                />
                {(Number(voucherForm.maxDiscount) === 0 || !voucherForm.maxDiscount) && (
                  <div className="flex items-center space-x-1.5 text-[11px] text-amber-600 font-medium pt-0.5">
                    <span className="text-xs">⚠️</span>
                    <span>Lưu ý: Voucher này sẽ không giới hạn số tiền giảm tối đa.</span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Số lượng còn lại <span className="text-rose-500 font-bold">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  disabled={voucherForm.isUnlimitedQuantity}
                  value={voucherForm.isUnlimitedQuantity ? '' : voucherForm.quantity}
                  onChange={(e) => setVoucherForm({ ...voucherForm, quantity: e.target.value })}
                  placeholder="Nhập số lượng còn lại"
                  className="w-full px-3.5 py-2.5 bg-white disabled:bg-slate-50 disabled:text-slate-400 border border-slate-200 rounded-xl focus:border-violet-500 focus:ring-1 focus:ring-violet-100 focus:outline-none text-slate-800 text-xs placeholder:text-slate-400 font-medium transition"
                />
                <div className="pt-0.5">
                  <label className="inline-flex items-center space-x-2 cursor-pointer text-xs text-slate-700 font-medium select-none">
                    <input
                      type="checkbox"
                      checked={voucherForm.isUnlimitedQuantity}
                      onChange={(e) => setVoucherForm({ ...voucherForm, isUnlimitedQuantity: e.target.checked })}
                      className="w-4 h-4 rounded text-violet-600 border-slate-300 focus:ring-violet-500 cursor-pointer"
                    />
                    <span>Vô hạn số lượng</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Ngày bắt đầu <span className="text-rose-500 font-bold">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={voucherForm.startDate}
                  onChange={(e) => setVoucherForm({ ...voucherForm, startDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-violet-500 focus:ring-1 focus:ring-violet-100 focus:outline-none text-slate-800 text-xs font-medium transition cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Ngày kết thúc <span className="text-rose-500 font-bold">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={voucherForm.endDate}
                  onChange={(e) => setVoucherForm({ ...voucherForm, endDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-violet-500 focus:ring-1 focus:ring-violet-100 focus:outline-none text-slate-800 text-xs font-medium transition cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-3">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 active:scale-[0.99] text-white font-bold text-xs flex items-center space-x-2 transition shadow-sm shadow-violet-500/25 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                <span>Tạo phiếu giảm giá</span>
              </button>

              <button
                type="button"
                onClick={() => setVoucherFormMode('list')}
                className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // =========================================================================
  // GIAO DIỆN TẠO MỚI "ĐỢT GIẢM GIÁ" (campaignViewMode === 'create')
  // Chuẩn 100% theo ảnh tham chiếu: 2 Khung trên (Thông tin & Chọn SP) + Khung dưới (Biến thể đã chọn)
  // =========================================================================
  if (discountSubTab === 'campaigns' && campaignViewMode === 'create') {
    return (
      <div className="space-y-5 max-w-[1600px] mx-auto pb-16 animate-in fade-in duration-150">
        {/* Nút quay lại danh sách đợt giảm giá */}
        <div>
          <button
            type="button"
            onClick={() => setCampaignViewMode('list')}
            className="w-9 h-9 rounded-full bg-white border border-slate-200 hover:bg-violet-50 hover:border-violet-200 text-slate-700 hover:text-violet-600 shadow-2xs flex items-center justify-center transition cursor-pointer"
            title="Quay lại danh sách đợt giảm giá"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </div>

        {/* HÀNG TRÊN: 2 CỘT (Cột trái: Thông tin đợt giảm | Cột phải: Chọn sản phẩm áp dụng) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* ── CỘT TRÁI (4 cols): KHUNG THÔNG TIN ĐỢT GIẢM ── */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Header Thông tin đợt giảm */}
              <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
                <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center shadow-2xs">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <h3 className="font-bold text-sm text-slate-900">Thông tin đợt giảm</h3>
              </div>

              {/* 1. Mã đợt * */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Mã đợt <span className="text-rose-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={addCampaignForm.code}
                    onChange={(e) => setAddCampaignForm({ ...addCampaignForm, code: e.target.value.toUpperCase() })}
                    placeholder="DGGD5OY17"
                    className="w-full px-3 py-2 pr-9 bg-white border border-slate-200 rounded-xl focus:border-violet-500 focus:outline-none font-mono font-bold text-slate-800 text-xs transition"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateCampaignCode}
                    title="Sinh mã ngẫu nhiên mới"
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-violet-600 transition cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* 2. Tên đợt * */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Tên đợt <span className="text-rose-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={addCampaignForm.name}
                  onChange={(e) => setAddCampaignForm({ ...addCampaignForm, name: e.target.value })}
                  placeholder="Ví dụ: Siêu giảm giá mùa hè"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-violet-500 focus:outline-none text-slate-800 text-xs placeholder:text-slate-400 font-medium transition"
                />
              </div>

              {/* 3. Giá trị giảm (%) * */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Giá trị giảm (%) <span className="text-rose-500 font-bold">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={addCampaignForm.discountPercent}
                    onChange={(e) => setAddCampaignForm({ ...addCampaignForm, discountPercent: e.target.value })}
                    className="w-full px-3 py-2 pr-7 bg-white border border-slate-200 rounded-xl focus:border-violet-500 focus:outline-none text-slate-800 text-xs font-bold transition"
                  />
                  <span className="absolute right-2.5 text-xs font-semibold text-slate-400 pointer-events-none">%</span>
                </div>
              </div>

              {/* 4. Từ ngày * & Đến ngày * */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Từ ngày <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={addCampaignForm.startDate}
                    onChange={(e) => setAddCampaignForm({ ...addCampaignForm, startDate: e.target.value })}
                    className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-xl focus:border-violet-500 focus:outline-none text-slate-800 text-xs font-medium transition cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Đến ngày <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={addCampaignForm.endDate}
                    onChange={(e) => setAddCampaignForm({ ...addCampaignForm, endDate: e.target.value })}
                    className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-xl focus:border-violet-500 focus:outline-none text-slate-800 text-xs font-medium transition cursor-pointer"
                  />
                </div>
              </div>

              {/* 5. Mô tả */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Mô tả</label>
                <textarea
                  rows={3}
                  value={addCampaignForm.description}
                  onChange={(e) => setAddCampaignForm({ ...addCampaignForm, description: e.target.value })}
                  placeholder="Nhập mô tả..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-violet-500 focus:outline-none text-slate-800 text-xs placeholder:text-slate-400 font-medium transition resize-none"
                />
              </div>
            </div>

            {/* Bộ 2 Nút hành động */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSubmitCreateCampaign}
                className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 active:scale-[0.99] text-white font-bold text-xs flex items-center justify-center space-x-2 transition shadow-sm shadow-violet-500/25 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                <span>Tạo đợt giảm giá</span>
              </button>

              <button
                type="button"
                onClick={() => setCampaignViewMode('list')}
                className="w-full py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Hủy
              </button>
            </div>
          </div>

          {/* ── CỘT PHẢI (8 cols): KHUNG CHỌN SẢN PHẨM ÁP DỤNG ── */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
            {/* Header Chọn sản phẩm áp dụng */}
            <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center shadow-2xs">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 leading-none">Chọn sản phẩm áp dụng</h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  Đã chọn <span className="font-bold text-violet-700">{selectedVariants.length}</span> biến thể
                </p>
              </div>
            </div>

            {/* Hàng lọc sản phẩm (Tìm kiếm, Màu sắc, Kích cỡ, Nút Tìm kiếm) */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
              <div className="sm:col-span-5 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Tìm theo tên hoặc mã sản phẩm..."
                  className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-violet-500 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none transition font-medium"
                />
              </div>

              <div className="sm:col-span-3">
                <select
                  value={productColorFilter}
                  onChange={(e) => setProductColorFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-violet-500 transition cursor-pointer"
                >
                  <option value="all">Tất cả màu sắc</option>
                  <option value="Trắng">Trắng</option>
                  <option value="Đen">Đen</option>
                  <option value="Xám">Xám</option>
                  <option value="Xanh Navy">Xanh Navy</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <select
                  value={productSizeFilter}
                  onChange={(e) => setProductSizeFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-violet-500 transition cursor-pointer"
                >
                  <option value="all">Tất cả kích cỡ</option>
                  <option value="39">39</option>
                  <option value="40">40</option>
                  <option value="41">41</option>
                  <option value="42">42</option>
                  <option value="43">43</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <button
                  type="button"
                  className="w-full py-2 bg-violet-600 hover:bg-violet-700 active:scale-[0.99] text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition shadow-2xs cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Tìm kiếm</span>
                </button>
              </div>
            </div>

            {/* Bảng Danh sách Sản Phẩm để chọn */}
            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-600 font-bold">
                    <th className="py-3 px-3 text-center w-10">
                      <input
                        type="checkbox"
                        checked={
                          paginatedSelectableProducts.length > 0 &&
                          paginatedSelectableProducts.every((p) =>
                            p.colors.every((c) => {
                              const cName = getColorName(c);
                              return p.sizes.every((s) => selectedVariants.some((v) => v.key === `${p.sku}-${cName}-${s}`));
                            })
                          )
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            const newVars = [];
                            paginatedSelectableProducts.forEach((p) => {
                              p.colors.forEach((c) => {
                                const cName = getColorName(c);
                                const cCode = getColorCode(c);
                                p.sizes.forEach((s) => {
                                  const key = `${p.sku}-${cName}-${s}`;
                                  if (!selectedVariants.some((v) => v.key === key)) {
                                    newVars.push({
                                      key,
                                      variantSku: `${p.sku}-${cCode}-${s}`,
                                      productSku: p.sku,
                                      productName: p.name,
                                      image: p.image,
                                      color: cName,
                                      size: s,
                                      originalPrice: p.price,
                                      quantity: 100,
                                    });
                                  }
                                });
                              });
                            });
                            setSelectedVariants((prev) => [...prev, ...newVars]);
                          } else {
                            const skusOnPage = paginatedSelectableProducts.map((p) => p.sku);
                            setSelectedVariants((prev) => prev.filter((v) => !skusOnPage.includes(v.productSku)));
                          }
                        }}
                        className="w-4 h-4 rounded text-violet-600 border-slate-300 focus:ring-violet-500 cursor-pointer"
                      />
                    </th>
                    <th className="py-3 px-3 text-center w-12">STT</th>
                    <th className="py-3 px-4 font-bold">Mã SP</th>
                    <th className="py-3 px-4 font-bold">Tên sản phẩm</th>
                    <th className="py-3 px-4 text-center w-12">+</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {paginatedSelectableProducts.map((prod, idx) => {
                    const isAllSelected = prod.colors.every((c) => {
                      const cName = getColorName(c);
                      return prod.sizes.every((s) => selectedVariants.some((v) => v.key === `${prod.sku}-${cName}-${s}`));
                    });
                    const isExpanded = expandedProductIds.includes(prod.id);

                    return (
                      <React.Fragment key={prod.id}>
                        <tr className="hover:bg-violet-50/20 transition">
                          <td className="py-3 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={isAllSelected}
                              onChange={() => handleToggleSelectProduct(prod)}
                              className="w-4 h-4 rounded text-violet-600 border-slate-300 focus:ring-violet-500 cursor-pointer"
                            />
                          </td>
                          <td className="py-3 px-3 text-center text-slate-400 font-medium">
                            {productStartIndex + idx + 1}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-slate-900">
                            {prod.sku}
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-800">
                            {prod.name}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleExpandProduct(prod.id)}
                              className="w-6 h-6 rounded-lg border border-slate-200 hover:border-violet-200 hover:text-violet-600 hover:bg-violet-50 flex items-center justify-center font-bold text-slate-500 transition cursor-pointer"
                              title="Xem chi tiết các biến thể"
                            >
                              {isExpanded ? '−' : '+'}
                            </button>
                          </td>
                        </tr>

                        {/* Mở rộng xem từng biến thể chi tiết */}
                        {isExpanded && (
                          <tr className="bg-slate-50/60">
                            <td colSpan={5} className="py-3 px-6">
                              <div className="space-y-2">
                                <div className="text-[11px] font-bold text-violet-700 uppercase tracking-wider">
                                  Danh sách biến thể của {prod.name}:
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                  {prod.colors.map((colorObj) => {
                                    const colName = getColorName(colorObj);
                                    const colCode = getColorCode(colorObj);
                                    return prod.sizes.map((size) => {
                                      const key = `${prod.sku}-${colName}-${size}`;
                                      const isChecked = selectedVariants.some((v) => v.key === key);
                                      return (
                                        <label
                                          key={key}
                                          className={`flex items-center space-x-2 p-2 rounded-xl border text-xs cursor-pointer transition select-none ${
                                            isChecked
                                              ? 'bg-violet-50 border-violet-200 text-violet-800 font-bold'
                                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                                          }`}
                                        >
                                          <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={(e) => {
                                              if (e.target.checked) {
                                                setSelectedVariants((prev) => [
                                                  ...prev,
                                                  {
                                                    key,
                                                    variantSku: `${prod.sku}-${colCode}-${size}`,
                                                    productSku: prod.sku,
                                                    productName: prod.name,
                                                    image: prod.image,
                                                    color: colName,
                                                    size,
                                                    originalPrice: prod.price,
                                                    quantity: 100,
                                                  },
                                                ]);
                                              } else {
                                                handleRemoveSelectedVariant(key);
                                              }
                                            }}
                                            className="w-3.5 h-3.5 rounded text-violet-600 border-slate-300 focus:ring-violet-500 cursor-pointer"
                                          />
                                          <span>
                                            {colName} • Size {size}
                                          </span>
                                        </label>
                                      );
                                    });
                                  })}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Phân trang chọn sản phẩm */}
            <div className="flex items-center justify-between pt-2 text-xs font-semibold text-slate-600">
              <select
                value={productPageSize}
                onChange={(e) => {
                  setProductPageSize(Number(e.target.value));
                  setProductPage(1);
                }}
                className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-violet-500 cursor-pointer shadow-2xs"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
              </select>

              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => setProductPage(1)}
                  disabled={productPage === 1}
                  className="w-6 h-6 rounded border border-slate-200 text-slate-500 hover:border-violet-200 hover:text-violet-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold"
                >
                  ⮜⮜
                </button>
                <button
                  type="button"
                  onClick={() => setProductPage((p) => Math.max(p - 1, 1))}
                  disabled={productPage === 1}
                  className="w-6 h-6 rounded border border-slate-200 text-slate-500 hover:border-violet-200 hover:text-violet-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold"
                >
                  ‹
                </button>

                {Array.from({ length: productTotalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setProductPage(num)}
                    className={`w-6 h-6 rounded text-xs font-bold transition flex items-center justify-center ${
                      productPage === num
                        ? 'bg-violet-600 text-white shadow-xs'
                        : 'border border-slate-200 text-slate-600 hover:bg-violet-50'
                    }`}
                  >
                    {num}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setProductPage((p) => Math.min(p + 1, productTotalPages))}
                  disabled={productPage === productTotalPages}
                  className="w-6 h-6 rounded border border-slate-200 text-slate-500 hover:border-violet-200 hover:text-violet-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold"
                >
                  ›
                </button>
                <button
                  type="button"
                  onClick={() => setProductPage(productTotalPages)}
                  disabled={productPage === productTotalPages}
                  className="w-6 h-6 rounded border border-slate-200 text-slate-500 hover:border-violet-200 hover:text-violet-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold"
                >
                  ⮞⮞
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── HÀNG DƯỚI: KHUNG 3: SẢN PHẨM & BIẾN THỂ ĐÃ CHỌN ÁP DỤNG ── */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
            {/* Header bên trái: Icon + Tiêu đề + Phụ đề */}
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center shadow-2xs">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 leading-none">Sản phẩm & biến thể đã chọn áp dụng</h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  Danh sách chi tiết gồm <span className="font-bold text-slate-700">{selectedVariants.length}</span> biến thể đã chọn
                </p>
              </div>
            </div>

            {/* Bộ lọc bên phải: Màu sắc, Kích cỡ, Tìm trong danh sách */}
            <div className="flex flex-wrap items-end gap-2.5">
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-semibold text-slate-600 leading-none">Màu sắc</label>
                <select
                  value={bottomColorFilter}
                  onChange={(e) => {
                    setBottomColorFilter(e.target.value);
                    setBottomPage(1);
                  }}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-violet-500 cursor-pointer min-w-[130px] font-medium"
                >
                  <option value="all">Tất cả màu sắc</option>
                  {availableBottomColors.map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-semibold text-slate-600 leading-none">Kích cỡ</label>
                <select
                  value={bottomSizeFilter}
                  onChange={(e) => {
                    setBottomSizeFilter(e.target.value);
                    setBottomPage(1);
                  }}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-violet-500 cursor-pointer min-w-[120px] font-medium"
                >
                  <option value="all">Tất cả kích cỡ</option>
                  {availableBottomSizes.map((sz) => (
                    <option key={sz} value={sz}>
                      {sz}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={bottomSearch}
                  onChange={(e) => {
                    setBottomSearch(e.target.value);
                    setBottomPage(1);
                  }}
                  placeholder="Tìm trong danh sách..."
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-violet-500 transition min-w-[170px] font-medium"
                />
              </div>
            </div>
          </div>

          {filteredBottomVariants.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-xl">
                🏷️
              </div>
              <div className="text-xs font-semibold text-slate-600">
                {selectedVariants.length === 0
                  ? 'Chưa có sản phẩm hoặc biến thể nào được chọn áp dụng'
                  : 'Không tìm thấy biến thể phù hợp với bộ lọc'}
              </div>
              <p className="text-[11px] text-slate-400">
                {selectedVariants.length === 0
                  ? 'Vui lòng tích chọn các sản phẩm ở bảng bên trên để đưa vào đợt giảm giá này.'
                  : 'Vui lòng kiểm tra lại từ khóa tìm kiếm hoặc tùy chọn màu sắc, kích cỡ.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-600 font-bold">
                    <th className="py-3 px-3 text-center w-12">STT</th>
                    <th className="py-3 px-4 font-bold">Sản phẩm</th>
                    <th className="py-3 px-4 font-bold">Biến thể</th>
                    <th className="py-3 px-4 font-bold">Giá bán</th>
                    <th className="py-3 px-4 font-bold">Giá sau giảm</th>
                    <th className="py-3 px-4 text-center font-bold">Số lượng</th>
                    <th className="py-3 px-4 text-center font-bold w-16">Xóa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {paginatedBottomVariants.map((item, idx) => {
                    const discountPct = Number(addCampaignForm.discountPercent) || 0;
                    const salePrice = item.originalPrice * (1 - discountPct / 100);
                    return (
                      <tr key={item.key} className="hover:bg-slate-50/60 transition">
                        {/* STT */}
                        <td className="py-3.5 px-3 text-center text-slate-400 font-medium">
                          {bottomStartIndex + idx + 1}
                        </td>

                        {/* Sản phẩm: Thumbnail + Tên + Mã */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={item.image || 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=300&auto=format&fit=crop&q=80'}
                              alt={item.productName}
                              className="w-10 h-10 rounded-lg object-cover border border-slate-200 bg-slate-50 flex-shrink-0"
                            />
                            <div>
                              <div className="font-bold text-slate-900 text-xs">{item.productName}</div>
                              <div className="text-[11px] text-slate-400 font-mono">{item.productSku}</div>
                            </div>
                          </div>
                        </td>

                        {/* Biến thể: Mã SKU biến thể + Pill badges Màu sắc & Kích cỡ */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            <div className="font-mono font-medium text-slate-700 text-xs">
                              {item.variantSku || `${item.productSku}-MS01-${item.size}`}
                            </div>
                            <div className="flex items-center space-x-1.5">
                              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium">
                                {item.color}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium">
                                {item.size}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Giá bán gốc */}
                        <td className="py-3.5 px-4 font-medium text-slate-800 text-xs">
                          {Number(item.originalPrice || 0).toLocaleString('vi-VN')} đ
                        </td>

                        {/* Giá sau giảm (màu đỏ nổi bật chuẩn theo ảnh) */}
                        <td className="py-3.5 px-4 font-bold text-red-600 text-xs">
                          {Math.round(salePrice).toLocaleString('vi-VN')} đ
                        </td>

                        {/* Số lượng */}
                        <td className="py-3.5 px-4 text-center font-medium text-slate-800 text-xs">
                          {item.quantity || 100}
                        </td>

                        {/* Nút Xóa */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveSelectedVariant(item.key)}
                            className="text-slate-400 hover:text-red-500 font-bold text-base transition cursor-pointer p-1"
                            title="Xóa biến thể này"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Phân trang Khung 3 (Chuẩn [ 10 v ] và nút trang ⮜⮜ ‹ 1 › ⮞⮞) */}
          {filteredBottomVariants.length > 0 && (
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-semibold text-slate-600">
              <div className="flex items-center space-x-2">
                <select
                  value={bottomPageSize}
                  onChange={(e) => {
                    setBottomPageSize(Number(e.target.value));
                    setBottomPage(1);
                  }}
                  className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-violet-500 cursor-pointer shadow-2xs"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => setBottomPage(1)}
                  disabled={bottomPage === 1}
                  className="w-7 h-7 rounded border border-slate-200 text-slate-500 hover:border-violet-200 hover:text-violet-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold"
                >
                  ⮜⮜
                </button>
                <button
                  type="button"
                  onClick={() => setBottomPage((p) => Math.max(p - 1, 1))}
                  disabled={bottomPage === 1}
                  className="w-7 h-7 rounded border border-slate-200 text-slate-500 hover:border-violet-200 hover:text-violet-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold"
                >
                  ‹
                </button>

                {Array.from({ length: bottomTotalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setBottomPage(num)}
                    className={`w-7 h-7 rounded text-xs font-bold transition flex items-center justify-center ${
                      bottomPage === num
                        ? 'bg-violet-600 text-white shadow-xs'
                        : 'border border-slate-200 text-slate-600 hover:bg-violet-50'
                    }`}
                  >
                    {num}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setBottomPage((p) => Math.min(p + 1, bottomTotalPages))}
                  disabled={bottomPage === bottomTotalPages}
                  className="w-7 h-7 rounded border border-slate-200 text-slate-500 hover:border-violet-200 hover:text-violet-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold"
                >
                  ›
                </button>
                <button
                  type="button"
                  onClick={() => setBottomPage(bottomTotalPages)}
                  disabled={bottomPage === bottomTotalPages}
                  className="w-7 h-7 rounded border border-slate-200 text-slate-500 hover:border-violet-200 hover:text-violet-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold"
                >
                  ⮞⮞
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // GIAO DIỆN DANH SÁCH "ĐỢT GIẢM GIÁ" (discountSubTab === 'campaigns' && campaignViewMode === 'list')
  // =========================================================================
  if (discountSubTab === 'campaigns') {
    return (
      <div className="space-y-5 max-w-[1600px] mx-auto pb-16 relative animate-in fade-in duration-150">
        {/* ── TIÊU ĐỀ TRANG ĐỒNG BỘ TONE TÍM VIBEFLOW ── */}
        <AdminPageHeader
          category="Marketing & Khuyến Mãi"
          title="Đợt Giảm Giá"
          badgeVariant="violet"
          subtitle="Thiết lập các đợt giảm giá theo mùa, sự kiện và chương trình ưu đãi sản phẩm."
          metrics={[
            { label: 'Tổng chiến dịch', value: filteredCampaigns.length },
            { label: 'Đang hoạt động', value: filteredCampaigns.filter((c) => c.status === 'Đang hoạt động').length, highlight: true },
          ]}
        />

        {/* Khung 1: Bộ lọc Đợt giảm giá (4 inputs chuẩn theo ảnh chụp) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center text-xs font-bold shadow-2xs">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 leading-none">Bộ lọc</h3>
              <p className="text-[11px] text-slate-400 mt-1">Tra cứu nhanh dữ liệu.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">Tìm kiếm</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={campaignSearch}
                  onChange={(e) => {
                    setCampaignSearch(e.target.value);
                    setCampaignPage(1);
                  }}
                  placeholder="Mã, tên, giá trị..."
                  className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-100 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none transition font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">Ngày bắt đầu</label>
              <input
                type="date"
                value={campaignStartDate}
                onChange={(e) => {
                  setCampaignStartDate(e.target.value);
                  setCampaignPage(1);
                }}
                className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-violet-500 rounded-xl text-xs text-slate-800 focus:outline-none transition cursor-pointer font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">Ngày kết thúc</label>
              <input
                type="date"
                value={campaignEndDate}
                onChange={(e) => {
                  setCampaignEndDate(e.target.value);
                  setCampaignPage(1);
                }}
                className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-violet-500 rounded-xl text-xs text-slate-800 focus:outline-none transition cursor-pointer font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">Trạng thái</label>
              <select
                value={campaignStatus}
                onChange={(e) => {
                  setCampaignStatus(e.target.value);
                  setCampaignPage(1);
                }}
                className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-violet-500 rounded-xl text-xs text-slate-800 focus:outline-none transition cursor-pointer"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="Đang hoạt động">Đang hoạt động</option>
                <option value="Ngừng hoạt động">Ngừng hoạt động</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleResetCampaignFilters}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-violet-200 hover:bg-violet-50/60 text-violet-600 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer shadow-2xs"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Đặt lại bộ lọc</span>
            </button>

            <button
              type="button"
              onClick={() => alert(`Đang xuất ${filteredCampaigns.length} đợt giảm giá ra tệp tin Excel...`)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-violet-200 hover:bg-violet-50/60 text-violet-600 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer shadow-2xs"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Xuất Excel</span>
            </button>

            <button
              type="button"
              onClick={() => {
                handleGenerateCampaignCode();
                setCampaignViewMode('create');
              }}
              className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 active:scale-[0.99] text-white text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer shadow-sm shadow-violet-600/25"
            >
              <span className="text-sm font-bold leading-none">+</span>
              <span>Tạo đợt giảm giá</span>
            </button>
          </div>
        </div>

        {/* Khung 2: Bảng Danh sách các đợt giảm giá (8 cột chuẩn theo ảnh) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">Danh sách các đợt giảm giá</h3>
            <div className="text-xs text-slate-500 font-medium">
              <span className="font-bold text-slate-800">{filteredCampaigns.length}</span> bản ghi hiển thị.
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-600 font-bold">
                  <th className="py-3.5 px-4 text-center w-14">STT</th>
                  <th className="py-3.5 px-4 font-bold">Mã</th>
                  <th className="py-3.5 px-4 font-bold">Tên</th>
                  <th className="py-3.5 px-4">Giá trị</th>
                  <th className="py-3.5 px-4">Ngày bắt đầu</th>
                  <th className="py-3.5 px-4">Ngày kết thúc</th>
                  <th className="py-3.5 px-4 text-center">Trạng thái</th>
                  <th className="py-3.5 px-4 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {paginatedCampaigns.map((c, idx) => (
                  <tr key={c.id} className="hover:bg-violet-50/20 transition">
                    <td className="py-4 px-4 text-center text-slate-400 font-medium">
                      {campaignStartIndex + idx + 1}
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-slate-900">
                      {c.code}
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-800 max-w-xs truncate">
                      {c.name}
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-800">
                      {c.discountVal || `${c.discountNumber || 20}%`}
                    </td>
                    <td className="py-4 px-4 text-slate-600 font-medium">{c.startDate}</td>
                    <td className="py-4 px-4 text-slate-600 font-medium">{c.endDate}</td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold ${
                          c.status === 'Đang hoạt động'
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            : 'bg-rose-50 text-rose-500 border border-rose-100'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          type="button"
                          onClick={() => handleToggleCampaignStatus(c.id)}
                          title={
                            c.status === 'Đang hoạt động'
                              ? 'Chuyển sang ngừng hoạt động'
                              : 'Kích hoạt đợt giảm giá'
                          }
                          className={`w-7 h-7 rounded-full flex items-center justify-center transition cursor-pointer ${
                            c.status === 'Đang hoạt động'
                              ? 'bg-slate-50 text-slate-400 hover:text-violet-600 hover:bg-violet-50'
                              : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                          }`}
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 11-12.728 0M12 2v10" />
                          </svg>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedCampaignDetail(c)}
                          title="Xem chi tiết đợt giảm giá"
                          className="w-7 h-7 rounded-full flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-violet-50 hover:text-violet-600 transition cursor-pointer"
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
              </tbody>
            </table>
          </div>

          <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 bg-white">
            <div className="flex items-center space-x-2">
              <select
                value={campaignPageSize}
                onChange={(e) => {
                  setCampaignPageSize(Number(e.target.value));
                  setCampaignPage(1);
                }}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:border-violet-500 transition cursor-pointer shadow-2xs"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>

            <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600">
              <button
                type="button"
                onClick={() => setCampaignPage(1)}
                disabled={safeCampaignPage === 1}
                className="w-7 h-7 rounded-lg border border-slate-200 text-slate-500 hover:border-violet-200 hover:text-violet-600 hover:bg-violet-50/60 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center justify-center font-bold"
                title="Trang đầu"
              >
                ⮜⮜
              </button>

              <button
                type="button"
                onClick={() => setCampaignPage((prev) => Math.max(prev - 1, 1))}
                disabled={safeCampaignPage === 1}
                className="w-7 h-7 rounded-lg border border-slate-200 text-slate-500 hover:border-violet-200 hover:text-violet-600 hover:bg-violet-50/60 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center justify-center font-bold"
                title="Trang trước"
              >
                ‹
              </button>

              {Array.from({ length: campaignTotalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCampaignPage(pageNum)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                    safeCampaignPage === pageNum
                      ? 'bg-violet-600 text-white shadow-xs'
                      : 'border border-slate-200 text-slate-600 hover:border-violet-200 hover:bg-violet-50/50'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCampaignPage((prev) => Math.min(prev + 1, campaignTotalPages))}
                disabled={safeCampaignPage === campaignTotalPages}
                className="w-7 h-7 rounded-lg border border-slate-200 text-slate-500 hover:border-violet-200 hover:text-violet-600 hover:bg-violet-50/60 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center justify-center font-bold"
                title="Trang sau"
              >
                ›
              </button>

              <button
                type="button"
                onClick={() => setCampaignPage(campaignTotalPages)}
                disabled={safeCampaignPage === campaignTotalPages}
                className="w-7 h-7 rounded-lg border border-slate-200 text-slate-500 hover:border-violet-200 hover:text-violet-600 hover:bg-violet-50/60 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center justify-center font-bold"
                title="Trang cuối"
              >
                ⮞⮞
              </button>
            </div>
          </div>
        </div>

        {/* Modal Xem Chi Tiết Đợt Giảm Giá */}
        {selectedCampaignDetail && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold text-sm">
                    🏷️
                  </span>
                  <h3 className="font-bold text-base text-slate-900">Chi Tiết Đợt Giảm Giá</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCampaignDetail(null)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-4 bg-violet-50/60 border border-violet-100 rounded-2xl text-center space-y-1">
                  <div className="text-[10px] uppercase font-bold text-violet-600 tracking-wider">Mã Đợt Giảm Giá</div>
                  <div className="text-xl font-mono font-black text-violet-800 tracking-widest">{selectedCampaignDetail.code}</div>
                  <div className="text-xs font-semibold text-slate-700 mt-1">{selectedCampaignDetail.name}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">Mức giảm</span>
                    <b className="text-violet-700 text-xs font-black">{selectedCampaignDetail.discountVal || `${selectedCampaignDetail.discountNumber}%`}</b>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">Trạng thái</span>
                    <span className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold ${
                      selectedCampaignDetail.status === 'Đang hoạt động'
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        : 'bg-rose-50 text-rose-500 border border-rose-100'
                    }`}>
                      {selectedCampaignDetail.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">Ngày bắt đầu</span>
                    <b className="text-slate-900 text-xs">{selectedCampaignDetail.startDate}</b>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">Ngày kết thúc</span>
                    <b className="text-slate-900 text-xs">{selectedCampaignDetail.endDate}</b>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedCampaignDetail(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-xs transition cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // GIAO DIỆN DANH SÁCH "PHIẾU GIẢM GIÁ" (discountSubTab === 'vouchers' && voucherFormMode === 'list')
  // =========================================================================
  return (
    <div className="space-y-5 max-w-[1600px] mx-auto pb-16 relative animate-in fade-in duration-150">
      {/* ── TIÊU ĐỀ TRANG ĐỒNG BỘ TONE TÍM VIBEFLOW ── */}
      <AdminPageHeader
        category="Marketing & Khuyến Mãi"
        title="Phiếu Giảm Giá"
        badgeVariant="violet"
        subtitle="Quản lý mã phiếu giảm giá, điều kiện áp dụng mức giảm và giá trị đơn hàng tối thiểu."
        metrics={[
          { label: 'Tổng phiếu giảm', value: vouchersList.length },
          { label: 'Đang hoạt động', value: vouchersList.filter((v) => v.status === 'Đang hoạt động').length, highlight: true },
        ]}
      />

      {/* Khung 1: Bộ lọc Phiếu giảm giá */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center text-xs font-bold shadow-2xs">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 leading-none">Bộ lọc</h3>
            <p className="text-[11px] text-slate-400 mt-1">Tra cứu nhanh dữ liệu.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Tìm kiếm</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                placeholder="Mã, tên phiếu..."
                className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-100 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none transition font-medium"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Hình thức</label>
            <select
              value={selectedAudience}
              onChange={(e) => {
                setSelectedAudience(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-violet-500 rounded-xl text-xs text-slate-800 focus:outline-none transition cursor-pointer"
            >
              <option value="all">Tất cả hình thức</option>
              <option value="public">Công khai</option>
              <option value="personal">Cá nhân</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Ngày bắt đầu</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-violet-500 rounded-xl text-xs text-slate-800 focus:outline-none transition cursor-pointer font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Ngày kết thúc</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-violet-500 rounded-xl text-xs text-slate-800 focus:outline-none transition cursor-pointer font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Loại giảm</label>
            <select
              value={selectedDiscountType}
              onChange={(e) => {
                setSelectedDiscountType(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-violet-500 rounded-xl text-xs text-slate-800 focus:outline-none transition cursor-pointer"
            >
              <option value="all">Tất cả loại giảm</option>
              <option value="percent">Theo phần trăm (%)</option>
              <option value="fixed">Theo số tiền (VNĐ)</option>
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
              <option value="Đang hoạt động">Đang hoạt động</option>
              <option value="Chưa bắt đầu">Chưa bắt đầu</option>
              <option value="Đã kết thúc">Đã kết thúc</option>
              <option value="Ngừng hoạt động">Ngừng hoạt động</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-1">
          <button
            type="button"
            onClick={handleResetVoucherFilters}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-violet-200 hover:bg-violet-50/60 text-violet-600 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer shadow-2xs"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Đặt lại bộ lọc</span>
          </button>

          <button
            type="button"
            onClick={() => alert(`Đang xuất ${filteredVouchers.length} phiếu giảm giá ra tệp tin Excel...`)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-violet-200 hover:bg-violet-50/60 text-violet-600 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer shadow-2xs"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Xuất Excel</span>
          </button>

          <button
            type="button"
            onClick={() => {
              handleGenerateRandomVoucherCode();
              setVoucherFormMode('create');
            }}
            className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 active:scale-[0.99] text-white text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer shadow-sm shadow-violet-600/25"
          >
            <span className="text-sm font-bold leading-none">+</span>
            <span>Tạo phiếu mới</span>
          </button>
        </div>
      </div>

      {/* Khung 2: Bảng Danh sách phiếu giảm giá */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-100">
          <h3 className="font-bold text-sm text-slate-900">Danh sách phiếu giảm giá</h3>
          <div className="text-xs text-slate-500 font-medium">
            <span className="font-bold text-slate-800">{filteredVouchers.length}</span> bản ghi hiển thị.
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-600 font-bold">
                <th className="py-3.5 px-4 text-center w-14">STT</th>
                <th className="py-3.5 px-4 font-bold">Mã</th>
                <th className="py-3.5 px-4 font-bold">Tên phiếu</th>
                <th className="py-3.5 px-4">Hình thức</th>
                <th className="py-3.5 px-4">Giá trị giảm</th>
                <th className="py-3.5 px-4">Ngày bắt đầu</th>
                <th className="py-3.5 px-4">Ngày kết thúc</th>
                <th className="py-3.5 px-4 text-center">Trạng thái</th>
                <th className="py-3.5 px-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedVouchers.map((v, idx) => (
                <tr key={v.id} className="hover:bg-violet-50/20 transition">
                  <td className="py-4 px-4 text-center text-slate-400 font-medium">
                    {startIndex + idx + 1}
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-slate-900">{v.code}</td>
                  <td className="py-4 px-4 font-semibold text-slate-800 max-w-xs truncate">{v.name}</td>
                  <td className="py-4 px-4">
                    {v.audience === 'personal' || v.audienceLabel === 'Cá nhân' ? (
                      <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
                        <span>👤</span>
                        <span>Cá nhân</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-violet-50 text-violet-700 border border-violet-200/80">
                        <span>🌐</span>
                        <span>Công khai</span>
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-800">
                    {v.discountVal ||
                      (v.discountType === 'percent'
                        ? `${v.discountNumber || v.discount}%`
                        : `${(v.discountNumber || v.discount || 0).toLocaleString('vi-VN')}đ`)}
                  </td>
                  <td className="py-4 px-4 text-slate-600 font-medium">{v.startDate}</td>
                  <td className="py-4 px-4 text-slate-600 font-medium">{v.endDate}</td>
                  <td className="py-4 px-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold ${
                        v.status === 'Đang hoạt động'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          : v.status === 'Chưa bắt đầu'
                          ? 'bg-blue-50 text-blue-600 border border-blue-100'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {v.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleToggleVoucherStatus(v.id)}
                        className="w-7 h-7 rounded-full flex items-center justify-center bg-slate-50 text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition cursor-pointer"
                        title="Bật/Tắt trạng thái phiếu"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 11-12.728 0M12 2v10" />
                        </svg>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedVoucherDetail(v)}
                        className="w-7 h-7 rounded-full flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-violet-50 hover:text-violet-600 transition cursor-pointer"
                        title="Xem chi tiết phiếu"
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
            </tbody>
          </table>
        </div>

        <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 bg-white">
          <div className="flex items-center space-x-2">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:border-violet-500 transition cursor-pointer shadow-2xs"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              disabled={safeCurrentPage === 1}
              className="w-7 h-7 rounded-lg border border-slate-200 text-slate-500 hover:border-violet-200 hover:text-violet-600 hover:bg-violet-50/60 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center justify-center font-bold"
              title="Trang đầu"
            >
              ⮜⮜
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={safeCurrentPage === 1}
              className="w-7 h-7 rounded-lg border border-slate-200 text-slate-500 hover:border-violet-200 hover:text-violet-600 hover:bg-violet-50/60 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center justify-center font-bold"
              title="Trang trước"
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                  safeCurrentPage === pageNum
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'border border-slate-200 text-slate-600 hover:border-violet-200 hover:bg-violet-50/50'
                }`}
              >
                {pageNum}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={safeCurrentPage === totalPages}
              className="w-7 h-7 rounded-lg border border-slate-200 text-slate-500 hover:border-violet-200 hover:text-violet-600 hover:bg-violet-50/60 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center justify-center font-bold"
              title="Trang sau"
            >
              ›
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(totalPages)}
              disabled={safeCurrentPage === totalPages}
              className="w-7 h-7 rounded-lg border border-slate-200 text-slate-500 hover:border-violet-200 hover:text-violet-600 hover:bg-violet-50/60 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center justify-center font-bold"
              title="Trang cuối"
            >
              ⮞⮞
            </button>
          </div>
        </div>
      </div>

      {/* Nút nổi Floating Action Button (FAB) */}
      <button
        type="button"
        onClick={() => {
          handleGenerateRandomVoucherCode();
          setVoucherFormMode('create');
        }}
        title="Tạo phiếu giảm giá mới"
        className="fixed bottom-6 right-6 w-12 h-12 bg-violet-600 hover:bg-violet-700 active:scale-95 text-white rounded-full flex items-center justify-center shadow-lg shadow-violet-600/30 transition cursor-pointer z-40"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>

      {/* Modal Chi Tiết Phiếu Giảm Giá */}
      {selectedVoucherDetail && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold text-sm">
                  🎫
                </span>
                <h3 className="font-bold text-base text-slate-900">Chi Tiết Phiếu Giảm Giá</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedVoucherDetail(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-violet-50/60 border border-violet-100 rounded-2xl text-center space-y-1">
                <div className="text-[10px] uppercase font-bold text-violet-600 tracking-wider">Mã Voucher</div>
                <div className="text-xl font-mono font-black text-violet-800 tracking-widest">{selectedVoucherDetail.code}</div>
                <div className="text-xs font-semibold text-slate-700 mt-1">{selectedVoucherDetail.name}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Hình thức</span>
                  <b className="text-slate-900 text-xs">
                    {selectedVoucherDetail.audienceLabel || (selectedVoucherDetail.audience === 'personal' ? 'Cá nhân' : 'Công khai')}
                  </b>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Mức giảm</span>
                  <b className="text-violet-700 text-xs font-black">{selectedVoucherDetail.discountVal}</b>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Ngày bắt đầu</span>
                  <b className="text-slate-900 text-xs">{selectedVoucherDetail.startDate}</b>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Ngày kết thúc</span>
                  <b className="text-slate-900 text-xs">{selectedVoucherDetail.endDate}</b>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between">
                <span className="text-slate-500 font-medium">Trạng thái</span>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  {selectedVoucherDetail.status}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedVoucherDetail(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-xs transition cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
