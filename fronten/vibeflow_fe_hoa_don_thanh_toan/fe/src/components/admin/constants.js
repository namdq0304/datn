// ── Hằng số mặc định cho POS VibeFlow ──

export const DEFAULT_WALK_IN_CUSTOMER = {
  id: 'WALK_IN',
  name: 'Khách vãng lai',
  phone: '',
  rank: 'Khách lẻ',
  points: 0
};

export const DEFAULT_BEST_VOUCHER = {
  code: 'VCH65FFTO',
  name: 'Voucher Khách Hàng Thân Thiết',
  discountPercent: 60,
  maxDiscount: 1500000,
  title: 'Đang áp dụng voucher tốt nhất'
};

export const DEFAULT_POS_PRODUCT = {
  id: 5,
  sku: 'G57664',
  barcode: '89385012305',
  name: 'New Balance 530',
  brand: 'New Balance',
  price: 2500000,
  originalPrice: 2800000,
  cost: 1600000,
  image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
  colors: ['Đỏ', 'Trắng Xanh', 'Xám Be'],
  sizes: ['36', '37', '38', '39', '40', '41', '42'],
  stock: 25,
  supplier: 'New Balance Global Trading',
  isFlashSale: false
};

// Mock Weekly Revenue Chart Data
export const weeklyRevenue = [
  { day: "Thứ 2", value: 4850000, height: "45%" },
  { day: "Thứ 3", value: 6200000, height: "58%" },
  { day: "Thứ 4", value: 5100000, height: "48%" },
  { day: "Thứ 5", value: 7900000, height: "74%" },
  { day: "Thứ 6", value: 9450000, height: "88%" },
  { day: "Thứ 7", value: 12800000, height: "100%", isPeak: true },
  { day: "Chủ Nhật", value: 10550000, height: "82%" }
];
