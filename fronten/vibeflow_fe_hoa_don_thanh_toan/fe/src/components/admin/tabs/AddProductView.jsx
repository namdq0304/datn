import React, { useState } from 'react';
import SearchableCreatableSelect from '../common/SearchableCreatableSelect';

// Danh sách các tùy chọn mặc định chuẩn giày sneaker
const AVAILABLE_BRANDS = [
  'Nike',
  'Adidas',
  'New Balance',
  'Jordan',
  'Puma',
  'Brooks',
  'Hoka',
  'Salomon',
  'Asics',
  'Converse',
  'Vans',
];

const AVAILABLE_CATEGORIES = [
  'Sneakers',
  'Running',
  'Walking',
  'Hiking',
  'Basketball',
  'Training',
  'Skateboarding',
];

const AVAILABLE_GENDERS = ['Tất cả', 'Nam', 'Nữ', 'Unisex'];

const AVAILABLE_MATERIALS = [
  'Da thật cao cấp (Genuine Leather)',
  'Da lộn mềm (Suede)',
  'Vải dệt thoáng khí (Mesh / Flyknit)',
  'Vải Canvas bền bỉ',
  'Da tổng hợp nhân tạo (Synthetic Leather)',
  'Gore-Tex chống thấm nước',
  'Cao su & TPU gia cố',
];

const AVAILABLE_SOLES = [
  'Cao su chống trượt nguyên khối (Rubber)',
  'Đệm EVA êm ái siêu nhẹ',
  'Polyurethane (PU) chống mài mòn',
  'Đệm khí Air-Sole / Zoom Air',
  'Đệm bọt Boost Foam đàn hồi cao',
  'Vibram Megagrip chuyên địa hình',
];

const AVAILABLE_COLLARS = [
  'Cổ thấp (Low-top)',
  'Cổ lửng / Cổ trung (Mid-top)',
  'Cổ cao (High-top)',
];

const AVAILABLE_CUSHIONS = [
  'Nike Zoom Air / Max Air',
  'Adidas Boost / Lightstrike Pro',
  'New Balance Fresh Foam X / FuelCell',
  'Asics GEL Technology',
  'Hoka ProFly+ Siêu êm',
  'Brooks DNA LOFT v3',
  'Đệm OrthoLite kháng khuẩn',
];

const AVAILABLE_WEIGHTS = [
  'Siêu nhẹ (< 230g)',
  'Nhẹ tiêu chuẩn (230g - 300g)',
  'Trung bình (300g - 380g)',
  'Đầm chắc thể thao (> 380g)',
];

const DEFAULT_COLORS = [
  { name: 'Trắng', hex: '#FFFFFF', border: true },
  { name: 'Đen', hex: '#111827' },
  { name: 'Xám Wolf Grey', hex: '#9CA3AF' },
  { name: 'Đỏ Varsity Red', hex: '#EF4444' },
  { name: 'Xanh Navy', hex: '#1E3A8A' },
  { name: 'Xanh Mint', hex: '#6EE7B7' },
  { name: 'Hồng Pastel', hex: '#F472B6' },
  { name: 'Vàng Mustard', hex: '#F59E0B' },
  { name: 'Kem Sand / Sail', hex: '#F5F5DC', border: true },
];

const DEFAULT_SIZES = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];

export default function AddProductView({ onBack, onSaveProduct }) {
  // Thông tin cơ bản (Khung 1)
  const [productCode, setProductCode] = useState(() => `G${Math.floor(10000 + Math.random() * 90000)}`);
  const [productName, setProductName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [gender, setGender] = useState('Tất cả');
  const [material, setMaterial] = useState('');
  const [sole, setSole] = useState('');
  const [collar, setCollar] = useState('');
  const [cushion, setCushion] = useState('');
  const [weight, setWeight] = useState('');
  const [description, setDescription] = useState('');

  // Danh sách các tùy chọn có thể mở rộng nhanh
  const [brandsList, setBrandsList] = useState(AVAILABLE_BRANDS);
  const [categoriesList, setCategoriesList] = useState(AVAILABLE_CATEGORIES);
  const [gendersList, setGendersList] = useState(AVAILABLE_GENDERS);
  const [materialsList, setMaterialsList] = useState(AVAILABLE_MATERIALS);
  const [solesList, setSolesList] = useState(AVAILABLE_SOLES);
  const [collarsList, setCollarsList] = useState(AVAILABLE_COLLARS);
  const [cushionsList, setCushionsList] = useState(AVAILABLE_CUSHIONS);
  const [weightsList, setWeightsList] = useState(AVAILABLE_WEIGHTS);

  // Thuộc tính biến thể (Khung 2)
  const [allColors, setAllColors] = useState(DEFAULT_COLORS);
  const [allSizes, setAllSizes] = useState(DEFAULT_SIZES);

  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false);
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);

  // Modal / Prompt thêm nhanh thuộc tính
  const [showQuickAddModal, setShowQuickAddModal] = useState(null); // 'color' | 'size' | null
  const [quickAddValue, setQuickAddValue] = useState('');

  // Biến thể đã sinh tự động & danh sách đã chọn
  const [generatedVariants, setGeneratedVariants] = useState([]);
  const [selectedVariantIds, setSelectedVariantIds] = useState([]);

  // Giá và tồn kho mặc định khi sinh hàng loạt
  const [batchPrice, setBatchPrice] = useState('2000000');
  const [batchStock, setBatchStock] = useState('50');

  // Bộ ảnh chi tiết theo từng màu sắc (Biến thể đại diện)
  const [colorImages, setColorImages] = useState({});
  const fileInputRefs = React.useRef({});

  const handleTriggerUpload = (colorName) => {
    if (fileInputRefs.current[colorName]) {
      fileInputRefs.current[colorName].click();
    }
  };

  const handleFilesSelected = (colorName, files) => {
    if (!files || files.length === 0) return;
    const newUrls = Array.from(files).map((f) => URL.createObjectURL(f));
    setColorImages((prev) => ({
      ...prev,
      [colorName]: [...(prev[colorName] || []), ...newUrls],
    }));
  };

  const handleRemoveImage = (colorName, index) => {
    setColorImages((prev) => ({
      ...prev,
      [colorName]: (prev[colorName] || []).filter((_, i) => i !== index),
    }));
  };

  const handleResetColorImages = (colorName) => {
    setColorImages((prev) => ({
      ...prev,
      [colorName]: [],
    }));
  };

  // Toggle chọn màu
  const toggleSelectColor = (colorName) => {
    setSelectedColors((prev) =>
      prev.includes(colorName) ? prev.filter((c) => c !== colorName) : [...prev, colorName]
    );
  };

  // Toggle chọn size
  const toggleSelectSize = (sizeVal) => {
    setSelectedSizes((prev) =>
      prev.includes(sizeVal) ? prev.filter((s) => s !== sizeVal) : [...prev, sizeVal]
    );
  };

  // Thêm nhanh màu hoặc size mới
  const handleQuickAdd = (e) => {
    e.preventDefault();
    const val = quickAddValue.trim();
    if (!val) return;

    if (showQuickAddModal === 'color') {
      if (!allColors.some((c) => c.name.toLowerCase() === val.toLowerCase())) {
        const newColor = { name: val, hex: '#8B5CF6' };
        setAllColors((prev) => [...prev, newColor]);
        setSelectedColors((prev) => [...prev, val]);
      }
    } else if (showQuickAddModal === 'size') {
      if (!allSizes.includes(val)) {
        setAllSizes((prev) => [...prev, val].sort((a, b) => Number(a) - Number(b)));
        setSelectedSizes((prev) => [...prev, val]);
      }
    }

    setQuickAddValue('');
    setShowQuickAddModal(null);
  };

  // Sinh biến thể tự động
  const handleGenerateVariants = () => {
    if (!productName.trim()) {
      alert('Vui lòng nhập tên sản phẩm trước khi tạo biến thể!');
      return;
    }
    if (selectedColors.length === 0) {
      alert('Vui lòng chọn ít nhất 1 màu sắc!');
      return;
    }
    if (selectedSizes.length === 0) {
      alert('Vui lòng chọn ít nhất 1 kích cỡ!');
      return;
    }

    const variants = [];
    selectedColors.forEach((color) => {
      selectedSizes.forEach((size) => {
        variants.push({
          id: `${productCode}-${color}-${size}-${Date.now()}`,
          sku: `${productCode}-${color.substring(0, 3).toUpperCase()}-${size}`,
          color,
          size,
          price: Number(batchPrice) || 2000000,
          stock: Number(batchStock) || 50,
        });
      });
    });

    setGeneratedVariants(variants);
    setSelectedVariantIds(variants.map((v) => v.id));
  };

  // Trạng thái chọn tất cả biến thể
  const isAllSelected =
    generatedVariants.length > 0 && selectedVariantIds.length === generatedVariants.length;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedVariantIds([]);
    } else {
      setSelectedVariantIds(generatedVariants.map((v) => v.id));
    }
  };

  const handleToggleSelectVariant = (id) => {
    setSelectedVariantIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedVariantIds.length === 0) return;
    if (confirm(`Bạn có chắc muốn xóa ${selectedVariantIds.length} biến thể đã chọn?`)) {
      setGeneratedVariants((prev) => prev.filter((v) => !selectedVariantIds.includes(v.id)));
      setSelectedVariantIds([]);
    }
  };

  // Cập nhật giá/tồn kho từng biến thể
  const handleUpdateVariant = (id, field, value) => {
    setGeneratedVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: Number(value) || 0 } : v))
    );
  };

  // Xóa 1 biến thể
  const handleRemoveVariant = (id) => {
    setGeneratedVariants((prev) => prev.filter((v) => v.id !== id));
    setSelectedVariantIds((prev) => prev.filter((i) => i !== id));
  };

  // Áp dụng hàng loạt giá và tồn kho cho các biến thể đã chọn
  const handleApplyBatch = () => {
    const p = Number(batchPrice) || 0;
    const s = Number(batchStock) || 0;
    const targetIds =
      selectedVariantIds.length > 0
        ? selectedVariantIds
        : generatedVariants.map((v) => v.id);

    setGeneratedVariants((prev) =>
      prev.map((v) => (targetIds.includes(v.id) ? { ...v, price: p, stock: s } : v))
    );
  };

  // Lưu sản phẩm hoàn chỉnh
  const handleSubmitProduct = (e) => {
    e.preventDefault();
    if (!productName.trim()) {
      alert('Vui lòng nhập tên sản phẩm!');
      return;
    }

    // Tính tổng tồn kho và khoảng giá
    const totalStock = generatedVariants.reduce((sum, v) => sum + v.stock, 0);
    const prices = generatedVariants.map((v) => v.price);
    const minPrice = prices.length > 0 ? Math.min(...prices) : Number(batchPrice) || 2000000;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : Number(batchPrice) || 2000000;

    const priceFormatted =
      minPrice === maxPrice
        ? `${minPrice.toLocaleString('vi-VN')} đ`
        : `${minPrice.toLocaleString('vi-VN')} đ - ${maxPrice.toLocaleString('vi-VN')} đ`;

    const newProduct = {
      id: Date.now(),
      sku: productCode,
      name: productName,
      description,
      brand: brand || 'VibeFlow',
      category: category || 'Sneakers',
      gender,
      material,
      sole,
      collar,
      cushion,
      weight,
      colorImages,
      stock: totalStock > 0 ? totalStock : 100,
      price: minPrice,
      priceFormatted,
      status: 'Kinh doanh',
      variants: generatedVariants.map((v) => ({
        ...v,
        images: colorImages[v.color] || [],
      })),
      image:
        (selectedColors[0] && colorImages[selectedColors[0]]?.[0]) ||
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    };

    onSaveProduct(newProduct);
  };

  return (
    <div className="space-y-5 max-w-[1600px] mx-auto pb-16 animate-in fade-in duration-150">
      {/* ── THANH ĐIỀU HƯỚNG & NÚT QUAY LẠI ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1.5 text-xs text-slate-500">
          <span>Quản lý sản phẩm</span>
          <span>/</span>
          <span>Sản phẩm</span>
          <span>/</span>
          <span className="font-bold text-slate-900">Thêm sản phẩm</span>
        </div>

        {/* Nút Quay lại danh sách chuẩn góc trên phải */}
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-xl border border-violet-200 text-violet-600 hover:bg-violet-50/70 hover:border-violet-300 font-semibold text-xs flex items-center space-x-1.5 transition cursor-pointer shadow-2xs"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Quay lại danh sách</span>
        </button>
      </div>

      <form onSubmit={handleSubmitProduct} className="space-y-5">
        {/* ── KHUNG 1: THÔNG TIN CƠ BẢN SẢN PHẨM ── */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
          {/* Hàng 1: Mã sản phẩm & Tên sản phẩm */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Mã sản phẩm</label>
              <input
                type="text"
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
                placeholder="G66748"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:bg-white focus:border-violet-500 focus:ring-1 focus:ring-violet-100 focus:outline-none transition"
              />
            </div>
            <div className="md:col-span-3 space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Sản phẩm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Nhập tên sản phẩm..."
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:border-violet-500 focus:ring-1 focus:ring-violet-100 focus:outline-none transition font-medium"
              />
            </div>
          </div>

          {/* Hàng 2: Thương hiệu & Loại giày (Dropdown Tìm kiếm + Thêm nhanh) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SearchableCreatableSelect
              label="Thương hiệu"
              required
              value={brand}
              onChange={setBrand}
              options={brandsList}
              placeholder="Chọn thương hiệu..."
              onAddNewOption={(val) => setBrandsList((prev) => [val, ...prev])}
            />

            <SearchableCreatableSelect
              label="Loại giày"
              required
              value={category}
              onChange={setCategory}
              options={categoriesList}
              placeholder="Chọn loại giày..."
              onAddNewOption={(val) => setCategoriesList((prev) => [val, ...prev])}
            />
          </div>

          {/* Hàng 3: Giới tính & Chất liệu (Dropdown Tìm kiếm + Thêm nhanh) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SearchableCreatableSelect
              label="Giới tính"
              required
              value={gender}
              onChange={setGender}
              options={gendersList}
              placeholder="Chọn giới tính..."
              onAddNewOption={(val) => setGendersList((prev) => [val, ...prev])}
            />

            <SearchableCreatableSelect
              label="Chất liệu"
              required
              value={material}
              onChange={setMaterial}
              options={materialsList}
              placeholder="Chọn chất liệu giày..."
              onAddNewOption={(val) => setMaterialsList((prev) => [val, ...prev])}
            />
          </div>

          {/* Hàng 4: Đế giày & Cổ giày (Dropdown Tìm kiếm + Thêm nhanh) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SearchableCreatableSelect
              label="Đế giày"
              required
              value={sole}
              onChange={setSole}
              options={solesList}
              placeholder="Chọn đế giày..."
              onAddNewOption={(val) => setSolesList((prev) => [val, ...prev])}
            />

            <SearchableCreatableSelect
              label="Cổ giày"
              required
              value={collar}
              onChange={setCollar}
              options={collarsList}
              placeholder="Chọn cổ giày..."
              onAddNewOption={(val) => setCollarsList((prev) => [val, ...prev])}
            />
          </div>

          {/* Hàng 5: Công nghệ đệm & Trọng lượng (Dropdown Tìm kiếm + Thêm nhanh) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SearchableCreatableSelect
              label="Công nghệ đệm"
              required
              value={cushion}
              onChange={setCushion}
              options={cushionsList}
              placeholder="Chọn công nghệ đệm..."
              onAddNewOption={(val) => setCushionsList((prev) => [val, ...prev])}
            />

            <SearchableCreatableSelect
              label="Trọng lượng"
              required
              value={weight}
              onChange={setWeight}
              options={weightsList}
              placeholder="Chọn trọng lượng..."
              onAddNewOption={(val) => setWeightsList((prev) => [val, ...prev])}
            />
          </div>
        </div>

        {/* ── KHUNG 2: THUỘC TÍNH & BIẾN THỂ ── */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-5">
          {/* Dòng 1: Chọn Màu sắc + Thêm nhanh */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <label className="w-24 text-xs font-bold text-slate-800 shrink-0">
              Màu sắc <span className="text-red-500">*</span>
            </label>

            <div className="relative flex-1">
              <div
                onClick={() => setIsColorDropdownOpen(!isColorDropdownOpen)}
                className="min-h-[42px] px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer hover:border-violet-300 transition"
              >
                <div className="flex flex-wrap gap-1.5 py-0.5">
                  {selectedColors.length === 0 ? (
                    <span className="text-slate-400 text-xs py-1">Chọn màu</span>
                  ) : (
                    selectedColors.map((c) => (
                      <span
                        key={c}
                        className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-violet-50 text-violet-700 text-xs font-semibold border border-violet-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelectColor(c);
                        }}
                      >
                        <span>{c}</span>
                        <span className="text-violet-400 hover:text-violet-700 text-xs font-bold">✕</span>
                      </span>
                    ))
                  )}
                </div>
                <span className="text-slate-400 text-xs shrink-0 ml-2">▼</span>
              </div>

              {/* Popover danh sách màu sắc */}
              {isColorDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-1.5 p-3 bg-white border border-slate-200 rounded-2xl shadow-xl z-30 max-h-56 overflow-y-auto space-y-1 animate-in fade-in zoom-in-95 duration-100">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Chọn một hoặc nhiều màu:
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {allColors.map((c) => {
                      const isSelected = selectedColors.includes(c.name);
                      return (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => toggleSelectColor(c.name)}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium text-left transition cursor-pointer border ${
                            isSelected
                              ? 'bg-violet-50 border-violet-300 text-violet-700 font-bold'
                              : 'border-slate-100 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full shrink-0 shadow-2xs"
                            style={{
                              backgroundColor: c.hex || '#6B7280',
                              border: c.border ? '1px solid #D1D5DB' : 'none',
                            }}
                          />
                          <span className="truncate">{c.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Nút + Thêm nhanh Màu */}
            <button
              type="button"
              onClick={() => {
                setShowQuickAddModal('color');
                setQuickAddValue('');
              }}
              className="px-3.5 py-2.5 rounded-xl border border-violet-200 hover:border-violet-300 hover:bg-violet-50/70 text-violet-600 text-xs font-semibold flex items-center justify-center space-x-1 transition cursor-pointer shrink-0"
            >
              <span className="text-sm font-bold leading-none">+</span>
              <span>Thêm nhanh</span>
            </button>
          </div>

          {/* Dòng 2: Chọn Kích cỡ + Thêm nhanh */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <label className="w-24 text-xs font-bold text-slate-800 shrink-0">
              Kích cỡ <span className="text-red-500">*</span>
            </label>

            <div className="relative flex-1">
              <div
                onClick={() => setIsSizeDropdownOpen(!isSizeDropdownOpen)}
                className="min-h-[42px] px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer hover:border-violet-300 transition"
              >
                <div className="flex flex-wrap gap-1.5 py-0.5">
                  {selectedSizes.length === 0 ? (
                    <span className="text-slate-400 text-xs py-1">Chọn size</span>
                  ) : (
                    selectedSizes.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-violet-50 text-violet-700 text-xs font-bold border border-violet-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelectSize(s);
                        }}
                      >
                        <span>Size {s}</span>
                        <span className="text-violet-400 hover:text-violet-700 text-xs font-bold">✕</span>
                      </span>
                    ))
                  )}
                </div>
                <span className="text-slate-400 text-xs shrink-0 ml-2">▼</span>
              </div>

              {/* Popover danh sách size */}
              {isSizeDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-1.5 p-3 bg-white border border-slate-200 rounded-2xl shadow-xl z-30 max-h-56 overflow-y-auto space-y-1 animate-in fade-in zoom-in-95 duration-100">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Chọn một hoặc nhiều size EU:
                  </div>
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
                    {allSizes.map((s) => {
                      const isSelected = selectedSizes.includes(s);
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleSelectSize(s)}
                          className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer border text-center ${
                            isSelected
                              ? 'bg-violet-600 text-white border-violet-600 shadow-2xs'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Nút + Thêm nhanh Size */}
            <button
              type="button"
              onClick={() => {
                setShowQuickAddModal('size');
                setQuickAddValue('');
              }}
              className="px-3.5 py-2.5 rounded-xl border border-violet-200 hover:border-violet-300 hover:bg-violet-50/70 text-violet-600 text-xs font-semibold flex items-center justify-center space-x-1 transition cursor-pointer shrink-0"
            >
              <span className="text-sm font-bold leading-none">+</span>
              <span>Thêm nhanh</span>
            </button>
          </div>

          {/* Dòng 3: Nút Tạo biến thể tự động (Góc dưới phải chuẩn VibeFlow Violet) */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleGenerateVariants}
              className="px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 active:scale-[0.99] text-white font-bold text-xs flex items-center space-x-2 transition cursor-pointer shadow-md shadow-violet-600/30"
            >
              <span>Tạo biến thể tự động</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* ── KHUNG 3: MÔ TẢ SẢN PHẨM (Chuẩn theo ảnh mẫu) ── */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-2">
          <label className="text-xs font-semibold text-slate-700 block">
            Mô tả
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mô tả sản phẩm"
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:border-violet-500 focus:ring-1 focus:ring-violet-100 focus:outline-none transition resize-y font-medium min-h-[95px]"
          />
        </div>

        {/* ── KHUNG 4: DANH SÁCH BIẾN THỂ (Chuẩn theo ảnh mẫu) ── */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden animate-in fade-in duration-200 space-y-4 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            {/* Checkbox Chọn tất cả biến thể */}
            <div className="flex items-center space-x-2.5">
              <input
                type="checkbox"
                id="selectAllVariants"
                checked={isAllSelected}
                onChange={handleToggleSelectAll}
                className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 border-slate-300 cursor-pointer accent-violet-600"
              />
              <label
                htmlFor="selectAllVariants"
                className="text-xs font-semibold text-slate-800 cursor-pointer select-none"
              >
                Chọn tất cả biến thể
              </label>

              {generatedVariants.length > 0 && (
                <span className="text-[11px] font-medium text-violet-700 bg-violet-50 px-2 py-0.5 rounded-md border border-violet-100">
                  Đã chọn {selectedVariantIds.length}/{generatedVariants.length}
                </span>
              )}
            </div>

            {/* Thanh công cụ gán giá & kho hàng loạt */}
            {generatedVariants.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center space-x-1">
                  <span className="text-[11px] text-slate-500 font-medium">Giá:</span>
                  <input
                    type="number"
                    value={batchPrice}
                    onChange={(e) => setBatchPrice(e.target.value)}
                    className="w-28 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-violet-600 focus:bg-white focus:border-violet-500 focus:outline-none"
                    placeholder="2000000"
                  />
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-[11px] text-slate-500 font-medium">Kho:</span>
                  <input
                    type="number"
                    value={batchStock}
                    onChange={(e) => setBatchStock(e.target.value)}
                    className="w-20 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:bg-white focus:border-violet-500 focus:outline-none"
                    placeholder="50"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleApplyBatch}
                  className="px-3 py-1.5 rounded-lg bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs font-bold transition cursor-pointer border border-violet-200"
                >
                  Áp dụng {selectedVariantIds.length > 0 && `(${selectedVariantIds.length})`}
                </button>
                {selectedVariantIds.length > 0 && (
                  <button
                    type="button"
                    onClick={handleDeleteSelected}
                    className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition cursor-pointer border border-red-200"
                  >
                    Xóa ({selectedVariantIds.length})
                  </button>
                )}
              </div>
            )}
          </div>

          {generatedVariants.length === 0 ? (
            <div className="py-8 text-center text-slate-400 space-y-1">
              <div className="text-2xl">👟</div>
              <div className="text-xs font-semibold text-slate-600">Chưa có biến thể nào được tạo</div>
              <div className="text-[11px] text-slate-400">Chọn màu sắc và kích cỡ ở trên rồi ấn "Tạo biến thể tự động"</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-600 font-bold">
                    <th className="py-2.5 px-3 text-center w-10">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleToggleSelectAll}
                        className="w-3.5 h-3.5 rounded text-violet-600 focus:ring-violet-500 border-slate-300 cursor-pointer accent-violet-600"
                      />
                    </th>
                    <th className="py-2.5 px-3 text-center w-12">STT</th>
                    <th className="py-2.5 px-3">Mã SKU Biến Thể</th>
                    <th className="py-2.5 px-3">Màu Sắc</th>
                    <th className="py-2.5 px-3">Kích Cỡ</th>
                    <th className="py-2.5 px-3">Giá Bán (VNĐ)</th>
                    <th className="py-2.5 px-3">Số Lượng Kho</th>
                    <th className="py-2.5 px-3 text-center w-16">Xóa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {generatedVariants.map((v, idx) => {
                    const isChecked = selectedVariantIds.includes(v.id);
                    return (
                      <tr
                        key={v.id}
                        className={`hover:bg-violet-50/20 transition ${
                          isChecked ? 'bg-violet-50/30' : ''
                        }`}
                      >
                        <td className="py-2.5 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleSelectVariant(v.id)}
                            className="w-3.5 h-3.5 rounded text-violet-600 focus:ring-violet-500 border-slate-300 cursor-pointer accent-violet-600"
                          />
                        </td>
                        <td className="py-2.5 px-3 text-center text-slate-400 font-medium">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                          {v.sku}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 font-semibold text-slate-700">
                            {v.color}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 font-bold text-slate-800">
                            Size {v.size}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <input
                            type="number"
                            value={v.price}
                            onChange={(e) => handleUpdateVariant(v.id, 'price', e.target.value)}
                            className="w-32 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-violet-600 focus:border-violet-500 focus:outline-none"
                          />
                        </td>
                        <td className="py-2.5 px-3">
                          <input
                            type="number"
                            value={v.stock}
                            onChange={(e) => handleUpdateVariant(v.id, 'stock', e.target.value)}
                            className="w-24 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:border-violet-500 focus:outline-none"
                          />
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveVariant(v.id)}
                            className="text-slate-400 hover:text-red-500 font-bold text-sm transition cursor-pointer"
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

          {/* Nút Hoàn tất lưu */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onBack}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 active:scale-[0.99] text-white font-bold text-xs transition shadow-md shadow-violet-600/30 flex items-center space-x-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              <span>Lưu sản phẩm và CTSP</span>
            </button>
          </div>
        </div>

        {/* ── KHUNG 5: ẢNH SẢN PHẨM CHI TIẾT (Chuẩn theo ảnh mẫu) ── */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Ảnh sản phẩm chi tiết</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Thêm ảnh cho từng màu sắc (biến thể đại diện) để tự động đồng bộ cho toàn bộ kích cỡ.
            </p>
          </div>

          {/* Grid thẻ ảnh theo từng màu sắc */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {(selectedColors.length > 0 ? selectedColors : ['Đen', 'Xám']).map((colorName) => {
              const images = colorImages[colorName] || [];
              const sizeCount = selectedSizes.length > 0 ? selectedSizes.length : 2;
              const sizeLabel = selectedSizes.length > 0 ? `Size ${selectedSizes.join(', ')}` : 'Size 36';

              return (
                <div
                  key={colorName}
                  className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-3"
                >
                  {/* Header thẻ màu */}
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-xs text-slate-800">
                        Ảnh sản phẩm màu {colorName.toLowerCase()}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Áp dụng cho {sizeCount} kích cỡ cùng màu • {sizeLabel}
                      </p>
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0">
                      {/* Nút làm mới / xóa ảnh nhóm màu */}
                      <button
                        type="button"
                        onClick={() => handleResetColorImages(colorName)}
                        title="Làm mới ảnh nhóm màu này"
                        className="w-7 h-7 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-300 transition cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>

                      {/* Nút + Thêm ảnh */}
                      <button
                        type="button"
                        onClick={() => handleTriggerUpload(colorName)}
                        className="px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 active:scale-[0.99] text-white font-bold text-xs flex items-center space-x-1 transition cursor-pointer shadow-xs shadow-violet-500/25"
                      >
                        <span className="text-sm leading-none">+</span>
                        <span>Thêm ảnh</span>
                      </button>

                      {/* Hidden File Input */}
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        ref={(el) => (fileInputRefs.current[colorName] = el)}
                        onChange={(e) => handleFilesSelected(colorName, e.target.files)}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Vùng Dropzone / Hiển thị ảnh */}
                  {images.length === 0 ? (
                    <div
                      onClick={() => handleTriggerUpload(colorName)}
                      className="border-2 border-dashed border-slate-200 rounded-2xl p-7 min-h-[140px] flex flex-col items-center justify-center text-center bg-slate-50/40 hover:bg-violet-50/20 hover:border-violet-300 transition cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-violet-600 group-hover:border-violet-300 transition mb-2 shadow-2xs">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-xs font-semibold text-slate-700 group-hover:text-violet-700 transition">
                        Nhóm màu này chưa có ảnh
                      </span>
                      <span className="text-[11px] text-slate-400 mt-0.5">
                        Thêm một bộ ảnh để áp dụng cho toàn bộ kích cỡ cùng màu.
                      </span>
                    </div>
                  ) : (
                    <div className="border border-slate-200/90 rounded-2xl p-3 bg-slate-50/30">
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                        {images.map((imgUrl, imgIdx) => (
                          <div key={imgIdx} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-square">
                            <img src={imgUrl} alt={`Ảnh ${colorName} ${imgIdx + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(colorName, imgIdx)}
                              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-slate-900/70 hover:bg-red-600 text-white text-[10px] flex items-center justify-center transition cursor-pointer"
                              title="Xóa ảnh"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => handleTriggerUpload(colorName)}
                          className="border border-dashed border-slate-300 hover:border-violet-400 hover:bg-violet-50/40 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:text-violet-600 transition cursor-pointer aspect-square"
                        >
                          <span className="text-lg font-bold leading-none">+</span>
                          <span className="text-[10px] font-semibold mt-0.5">Thêm tiếp</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Nút Hoàn tất lưu cuối trang */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onBack}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 active:scale-[0.99] text-white font-bold text-xs transition shadow-md shadow-violet-600/30 flex items-center space-x-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              <span>Lưu sản phẩm và CTSP</span>
            </button>
          </div>
        </div>
      </form>

      {/* ── MODAL THÊM NHANH THUỘC TÍNH ── */}
      {showQuickAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="font-bold text-sm text-slate-900">
                {showQuickAddModal === 'color' ? 'Thêm Nhanh Màu Sắc' : 'Thêm Nhanh Kích Cỡ'}
              </h3>
              <button
                type="button"
                onClick={() => setShowQuickAddModal(null)}
                className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleQuickAdd} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  {showQuickAddModal === 'color' ? 'Tên màu sắc mới' : 'Kích cỡ size mới (EU)'}
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  placeholder={showQuickAddModal === 'color' ? 'ví dụ: Xanh Olive, Beige...' : 'ví dụ: 42.5, 46...'}
                  value={quickAddValue}
                  onChange={(e) => setQuickAddValue(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-violet-500 focus:outline-none font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowQuickAddModal(null)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold transition cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold transition shadow-sm shadow-violet-600/30 cursor-pointer"
                >
                  Xác nhận thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
