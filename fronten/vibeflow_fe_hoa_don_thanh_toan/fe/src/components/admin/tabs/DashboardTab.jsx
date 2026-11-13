import React, { useState, useMemo } from 'react';
import { AdminPageHeader } from '../common';

// Dữ liệu 23 sản phẩm mẫu chuẩn theo giao diện ảnh tham chiếu
const INITIAL_PRODUCT_STATS = [
  {
    stt: 1,
    code: 'G57664',
    name: 'New Balance 530',
    brand: 'New Balance',
    sold: 16,
    returned: 0,
    revenue: 40248000,
    stock: 588,
  },
  {
    stt: 2,
    code: 'G66748',
    name: 'ASICS GEL-Kayano 31',
    brand: 'Asics',
    sold: 4,
    returned: 0,
    revenue: 12128000,
    stock: 299,
  },
  {
    stt: 3,
    code: 'G86428',
    name: 'Air Jordan 1 Low G',
    brand: 'Nike',
    sold: 4,
    returned: 0,
    revenue: 6800000,
    stock: 394,
  },
  {
    stt: 4,
    code: 'SP10',
    name: 'Fila Disruptor 2',
    brand: 'Fila',
    sold: 1,
    returned: 0,
    revenue: 2350000,
    stock: 299,
  },
  {
    stt: 5,
    code: 'SP02',
    name: 'Adidas Ultraboost 22',
    brand: 'Adidas',
    sold: 1,
    returned: 0,
    revenue: 977500,
    stock: 295,
  },
  {
    stt: 6,
    code: 'SP03',
    name: 'Nike Air Force 1 07',
    brand: 'Nike',
    sold: 1,
    returned: 0,
    revenue: 2900000,
    stock: 145,
  },
  {
    stt: 7,
    code: 'SP04',
    name: 'New Balance 550 White Green',
    brand: 'New Balance',
    sold: 1,
    returned: 0,
    revenue: 3200000,
    stock: 19,
  },
  {
    stt: 8,
    code: 'SP05',
    name: 'Adidas Yeezy Boost 350 V2',
    brand: 'Adidas',
    sold: 0,
    returned: 0,
    revenue: 0,
    stock: 8,
  },
  {
    stt: 9,
    code: 'SP06',
    name: 'Puma Suede Classic XXI',
    brand: 'Thương hiệu khác',
    sold: 0,
    returned: 0,
    revenue: 0,
    stock: 120,
  },
  {
    stt: 10,
    code: 'SP07',
    name: 'Converse Chuck 70 Classic High',
    brand: 'Thương hiệu khác',
    sold: 0,
    returned: 0,
    revenue: 0,
    stock: 210,
  },
  {
    stt: 11,
    code: 'SP08',
    name: 'Vans Old Skool Core Classics',
    brand: 'Thương hiệu khác',
    sold: 0,
    returned: 0,
    revenue: 0,
    stock: 180,
  },
  {
    stt: 12,
    code: 'SP09',
    name: 'Reebok Club C 85 Vintage',
    brand: 'Thương hiệu khác',
    sold: 0,
    returned: 0,
    revenue: 0,
    stock: 95,
  },
  {
    stt: 13,
    code: 'SP11',
    name: 'ASICS GT-2000 12',
    brand: 'Asics',
    sold: 0,
    returned: 0,
    revenue: 0,
    stock: 75,
  },
  {
    stt: 14,
    code: 'SP12',
    name: 'Nike Dunk Low Retro Panda',
    brand: 'Nike',
    sold: 0,
    returned: 0,
    revenue: 0,
    stock: 64,
  },
  {
    stt: 15,
    code: 'SP13',
    name: 'Adidas Samba OG White Black',
    brand: 'Adidas',
    sold: 0,
    returned: 0,
    revenue: 0,
    stock: 150,
  },
  {
    stt: 16,
    code: 'SP14',
    name: 'New Balance 2002R Protection Pack',
    brand: 'New Balance',
    sold: 0,
    returned: 0,
    revenue: 0,
    stock: 82,
  },
  {
    stt: 17,
    code: 'SP15',
    name: 'Nike ZoomX Vaporfly NEXT% 3',
    brand: 'Nike',
    sold: 0,
    returned: 0,
    revenue: 0,
    stock: 45,
  },
  {
    stt: 18,
    code: 'SP16',
    name: 'Adidas Forum Low White Royal',
    brand: 'Adidas',
    sold: 0,
    returned: 0,
    revenue: 0,
    stock: 110,
  },
  {
    stt: 19,
    code: 'SP17',
    name: 'ASICS GEL-NYC Grey Silver',
    brand: 'Asics',
    sold: 0,
    returned: 0,
    revenue: 0,
    stock: 50,
  },
  {
    stt: 20,
    code: 'SP18',
    name: 'Fila Ray Tracer Sneaker',
    brand: 'Fila',
    sold: 0,
    returned: 0,
    revenue: 0,
    stock: 35,
  },
  {
    stt: 21,
    code: 'SP19',
    name: 'Salomon XT-6 Black Phantom',
    brand: 'Thương hiệu khác',
    sold: 0,
    returned: 0,
    revenue: 0,
    stock: 28,
  },
  {
    stt: 22,
    code: 'SP20',
    name: 'Mizuno Wave Rider 10',
    brand: 'Thương hiệu khác',
    sold: 0,
    returned: 0,
    revenue: 0,
    stock: 40,
  },
  {
    stt: 23,
    code: 'SP21',
    name: 'On Cloudmonster All Black',
    brand: 'Thương hiệu khác',
    sold: 0,
    returned: 0,
    revenue: 0,
    stock: 30,
  },
];

// Danh sách dữ liệu nhân viên
const INITIAL_EMPLOYEES_STATS = [
  {
    stt: 1,
    code: 'NV001',
    name: 'Nguyễn Văn A (Admin)',
    soldQty: 26,
    ordersCount: 22,
    revenue: 40346250,
  },
];

// Dữ liệu thương hiệu theo ảnh tham chiếu
const BRAND_STATS = [
  { name: 'New Balance', revenue: 40248000, qty: 16, color: '#ef4444' }, // Red
  { name: 'Asics', revenue: 12128000, qty: 4, color: '#f97316' },        // Orange
  { name: 'Nike', revenue: 6800000, qty: 4, color: '#f59e0b' },         // Amber
  { name: 'Fila', revenue: 2350000, qty: 1, color: '#14b8a6' },         // Teal
  { name: 'Adidas', revenue: 977500, qty: 1, color: '#0ea5e9' },        // Sky
  { name: 'Thương hiệu khác', revenue: 0, qty: 0, color: '#94a3b8' },    // Slate
];

// Cơ cấu trạng thái đơn hàng theo ảnh tham chiếu
const ORDER_STATUS_BREAKDOWN = [
  { label: 'Chờ xác nhận', count: 1, color: '#ef4444' },
  { label: 'Chờ lấy hàng', count: 1, color: '#f97316' },
  { label: 'Hoàn thành', count: 22, color: '#eab308' },
  { label: 'Hủy', count: 3, color: '#10b981' },
  { label: 'Đã xác nhận', count: 4, color: '#06b6d4' },
  { label: 'Giao hàng thất bại', count: 1, color: '#3b82f6' },
  { label: 'Khác', count: 1, color: '#8b5cf6' },
];

// Chu kỳ thời gian
const PERIOD_BREAKDOWN = [
  { period: 'Hôm nay', revenue: 33029000, orders: 16, aov: 2064313, growth: '+100%' },
  { period: 'Tuần này', revenue: 40346250, orders: 22, aov: 1833920, growth: '+100%' },
  { period: 'Tháng này', revenue: 40346250, orders: 22, aov: 1833920, growth: '+100%' },
  { period: 'Năm nay', revenue: 40346250, orders: 22, aov: 1833920, growth: '+100%' },
];

// Dữ liệu biểu đồ bán theo ngày (tháng 8/2026)
const DAILY_SALES_DATA = [
  { date: '01/08/2026', qty: 0 },
  { date: '04/08/2026', qty: 0 },
  { date: '07/08/2026', qty: 0 },
  { date: '10/08/2026', qty: 0 },
  { date: '12/08/2026', qty: 3 },
  { date: '13/08/2026', qty: 1 },
  { date: '14/08/2026', qty: 1 },
  { date: '16/08/2026', qty: 20 },
];

export default function DashboardTab({ statsPeriod, setStatsPeriod }) {
  // Bộ lọc tổng quan
  const [activePreset, setActivePreset] = useState('month');
  const [fromDate, setFromDate] = useState('2026-08-01');
  const [toDate, setToDate] = useState('2026-08-16');
  const [granularity, setGranularity] = useState('day');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [brandSearchInput, setBrandSearchInput] = useState('');
  
  // Trạng thái cập nhật dữ liệu
  const [lastUpdatedTime, setLastUpdatedTime] = useState('17:20:14');
  const [isUpdating, setIsUpdating] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Tùy chọn biểu đồ
  const [chartTypeLeft, setChartTypeLeft] = useState('bar'); // 'bar' | 'line'
  const [chartTypeBrand, setChartTypeBrand] = useState('pie'); // 'pie' | 'line'
  const [brandMetric, setBrandMetric] = useState('revenue'); // 'revenue' | 'qty'
  const [hoveredDailyItem, setHoveredDailyItem] = useState(null);
  const [hoveredBrandSlice, setHoveredBrandSlice] = useState(null);
  const [hoveredStatusSlice, setHoveredStatusSlice] = useState(null);

  // Bộ lọc bảng nhân viên
  const [empSearch, setEmpSearch] = useState('');
  const [empSort, setEmpSort] = useState('revenue_desc');

  // Bộ lọc & Phân trang bảng sản phẩm
  const [prodSearch, setProdSearch] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [prodSort, setProdSort] = useState('sold_desc');
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Xử lý thông báo toast tạm thời
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Cập nhật lại dữ liệu
  const handleRefreshData = () => {
    setIsUpdating(true);
    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      setLastUpdatedTime(timeStr);
      setIsUpdating(false);
      showToast('Đã đồng bộ và cập nhật doanh thu mới nhất!');
    }, 600);
  };

  // Chọn bộ lọc nhanh
  const handleQuickPreset = (presetKey) => {
    setActivePreset(presetKey);
    if (setStatsPeriod) setStatsPeriod(presetKey);

    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;

    if (presetKey === 'today') {
      setFromDate(todayStr);
      setToDate(todayStr);
    } else if (presetKey === '7days') {
      const past = new Date();
      past.setDate(past.getDate() - 7);
      setFromDate(`${past.getFullYear()}-${String(past.getMonth() + 1).padStart(2, '0')}-${String(past.getDate()).padStart(2, '0')}`);
      setToDate(todayStr);
    } else if (presetKey === 'month') {
      setFromDate('2026-08-01');
      setToDate('2026-08-16');
    } else if (presetKey === 'lastMonth') {
      setFromDate('2026-07-01');
      setToDate('2026-07-31');
    } else if (presetKey === 'year') {
      setFromDate('2026-01-01');
      setToDate('2026-12-31');
    }
  };

  // Reset bộ lọc tổng quan
  const handleResetOverviewFilter = () => {
    setActivePreset('month');
    setFromDate('2026-08-01');
    setToDate('2026-08-16');
    setGranularity('day');
    setSelectedBrand('all');
    setBrandSearchInput('');
    showToast('Đã đặt lại bộ lọc tổng quan');
  };

  // Xuất file CSV/Excel cho các bảng
  const handleExportCSV = (tableType) => {
    let headers = [];
    let rows = [];
    let fileName = 'Bao_Cao.csv';

    if (tableType === 'period') {
      fileName = `Bao_Cao_Chu_Ky_${fromDate}_den_${toDate}.csv`;
      headers = ['Thời gian', 'Doanh thu (VND)', 'Số đơn', 'AOV (VND)', 'Tăng trưởng'];
      rows = PERIOD_BREAKDOWN.map((p) => [p.period, p.revenue, p.orders, p.aov, p.growth]);
    } else if (tableType === 'employee') {
      fileName = `Bao_Cao_Nhan_Vien_${fromDate}_den_${toDate}.csv`;
      headers = ['STT', 'Mã nhân viên', 'Tên nhân viên', 'Đã bán (đôi)', 'Số đơn bán', 'Doanh thu (VND)'];
      rows = filteredEmployees.map((e) => [e.stt, e.code, e.name, e.soldQty, e.ordersCount, e.revenue]);
    } else if (tableType === 'product') {
      fileName = `Bao_Cao_SanPham_${fromDate}_den_${toDate}.csv`;
      headers = ['STT', 'Mã sản phẩm', 'Tên sản phẩm', 'Thương hiệu', 'Đã bán', 'Số lượng trả', 'Doanh thu (VND)', 'Tồn kho'];
      rows = filteredProducts.map((p) => [p.stt, p.code, p.name, p.brand, p.sold, p.returned, p.revenue, p.stock]);
    }

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Đã xuất báo cáo ${fileName} thành công!`);
  };

  // Format ngày dd/mm/yyyy
  const formatDateDisplay = (dateString) => {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateString;
  };

  // Dữ liệu lọc cho bảng nhân viên
  const filteredEmployees = useMemo(() => {
    return INITIAL_EMPLOYEES_STATS.filter((emp) => {
      const q = empSearch.toLowerCase().trim();
      if (!q) return true;
      return emp.name.toLowerCase().includes(q) || emp.code.toLowerCase().includes(q);
    }).sort((a, b) => {
      if (empSort === 'revenue_desc') return b.revenue - a.revenue;
      if (empSort === 'orders_desc') return b.ordersCount - a.ordersCount;
      if (empSort === 'sold_desc') return b.soldQty - a.soldQty;
      if (empSort === 'name_asc') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [empSearch, empSort]);

  // Dữ liệu lọc cho bảng sản phẩm
  const filteredProducts = useMemo(() => {
    return INITIAL_PRODUCT_STATS.filter((p) => {
      // Tìm kiếm mã, tên hoặc thương hiệu
      const q = prodSearch.toLowerCase().trim();
      if (q) {
        const matchSearch =
          p.name.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q);
        if (!matchSearch) return false;
      }
      // Lọc theo tồn kho
      if (stockFilter === 'in_stock' && p.stock <= 10) return false;
      if (stockFilter === 'low_stock' && (p.stock > 10 || p.stock === 0)) return false;
      if (stockFilter === 'out_of_stock' && p.stock > 0) return false;

      // Lọc theo thương hiệu được chọn ở bộ lọc tổng quan nếu khác 'all'
      if (selectedBrand !== 'all') {
        if (selectedBrand === 'Thương hiệu khác') {
          if (['New Balance', 'Asics', 'Nike', 'Fila', 'Adidas'].includes(p.brand)) return false;
        } else if (p.brand !== selectedBrand) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (prodSort === 'sold_desc') return b.sold - a.sold;
      if (prodSort === 'revenue_desc') return b.revenue - a.revenue;
      if (prodSort === 'stock_desc') return b.stock - a.stock;
      if (prodSort === 'stock_asc') return a.stock - b.stock;
      return 0;
    });
  }, [prodSearch, stockFilter, prodSort, selectedBrand]);

  // Phân trang bảng sản phẩm
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  // Tính toán góc cho Biểu đồ Donut Thương hiệu
  const totalBrandValue = useMemo(() => {
    return BRAND_STATS.reduce((acc, curr) => acc + (brandMetric === 'revenue' ? curr.revenue : curr.qty), 0) || 1;
  }, [brandMetric]);

  const brandSlices = useMemo(() => {
    let cumulativeAngle = 0;
    return BRAND_STATS.map((b) => {
      const val = brandMetric === 'revenue' ? b.revenue : b.qty;
      const angle = (val / totalBrandValue) * 360;
      const startAngle = cumulativeAngle;
      cumulativeAngle += angle;
      return {
        ...b,
        val,
        percent: ((val / totalBrandValue) * 100).toFixed(1),
        startAngle,
        endAngle: cumulativeAngle,
      };
    });
  }, [brandMetric, totalBrandValue]);

  // Tính toán góc cho Biểu đồ Trạng thái đơn hàng
  const totalStatusCount = useMemo(() => {
    return ORDER_STATUS_BREAKDOWN.reduce((acc, curr) => acc + curr.count, 0) || 1;
  }, []);

  const statusSlices = useMemo(() => {
    let cumulativeAngle = 0;
    return ORDER_STATUS_BREAKDOWN.map((s) => {
      const angle = (s.count / totalStatusCount) * 360;
      const startAngle = cumulativeAngle;
      cumulativeAngle += angle;
      return {
        ...s,
        percent: ((s.count / totalStatusCount) * 100).toFixed(1),
        startAngle,
        endAngle: cumulativeAngle,
      };
    });
  }, [totalStatusCount]);

  // Helper hàm tạo đường dẫn SVG Arc (Donut/Pie)
  const describeArc = (x, y, radius, innerRadius, startAngle, endAngle) => {
    const polarToCartesian = (cx, cy, r, angleInDegrees) => {
      const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
      return {
        x: cx + r * Math.cos(angleInRadians),
        y: cy + r * Math.sin(angleInRadians),
      };
    };

    // Fix full circle or minimal angles
    const clampedEnd = endAngle - startAngle >= 359.99 ? startAngle + 359.99 : endAngle;
    const start = polarToCartesian(x, y, radius, clampedEnd);
    const end = polarToCartesian(x, y, radius, startAngle);
    const innerStart = polarToCartesian(x, y, innerRadius, startAngle);
    const innerEnd = polarToCartesian(x, y, innerRadius, clampedEnd);

    const largeArcFlag = clampedEnd - startAngle <= 180 ? '0' : '1';

    return [
      `M ${start.x} ${start.y}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
      `L ${innerStart.x} ${innerStart.y}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${innerEnd.x} ${innerEnd.y}`,
      'Z',
    ].join(' ');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans text-slate-800">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/90 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 border border-slate-700/60 animate-bounce">
          <span className="text-emerald-400 text-lg">✓</span>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* ── TIÊU ĐỀ TRANG ĐỒNG BỘ TONE TÍM VIBEFLOW ── */}
      <AdminPageHeader
        category="Báo Cáo & Phân Tích"
        title="Thống Kê Doanh Thu"
        badgeVariant="violet"
        subtitle="Báo cáo số liệu kinh doanh, cơ cấu thương hiệu và hiệu suất bán hàng thời gian thực."
        metrics={[
          { label: 'Hôm nay', value: '33.029.000 đ' },
          { label: 'Tháng này', value: '40.346.250 đ', highlight: true, pulse: true },
        ]}
      />

      {/* 1. BỘ LỌC TỔNG QUAN (FILTER CARD) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
        {/* Header Bộ lọc & Presets thời gian */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center font-bold">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            <h2 className="text-base font-bold text-slate-900">Bộ lọc tổng quan</h2>
          </div>

          {/* Quick preset buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'today', label: 'Hôm nay' },
              { id: '7days', label: '7 ngày qua' },
              { id: 'month', label: 'Tháng này' },
              { id: 'lastMonth', label: 'Tháng trước' },
              { id: 'year', label: 'Năm nay' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => handleQuickPreset(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  activePreset === p.id
                    ? 'bg-white text-slate-900 border-2 border-slate-300 shadow-xs'
                    : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
          {/* Từ ngày */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Từ ngày</label>
            <div className="relative">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-violet-500 focus:bg-white transition"
              />
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">📅</span>
            </div>
          </div>

          {/* Đến ngày */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Đến ngày</label>
            <div className="relative">
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-violet-500 focus:bg-white transition"
              />
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">📅</span>
            </div>
          </div>

          {/* Tổng quan (Chu kỳ) */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Tổng quan</label>
            <div className="relative">
              <select
                value={granularity}
                onChange={(e) => setGranularity(e.target.value)}
                className="w-full pl-8 pr-7 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 appearance-none focus:outline-hidden focus:ring-2 focus:ring-violet-500 focus:bg-white transition"
              >
                <option value="day">Theo ngày</option>
                <option value="week">Theo tuần</option>
                <option value="month">Theo tháng</option>
                <option value="year">Theo năm</option>
              </select>
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">📊</span>
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[10px]">▼</span>
            </div>
          </div>

          {/* Thương hiệu */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Thương hiệu</label>
            <div className="relative">
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full pl-8 pr-7 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 appearance-none focus:outline-hidden focus:ring-2 focus:ring-violet-500 focus:bg-white transition"
              >
                <option value="all">Tất cả thương hiệu</option>
                <option value="New Balance">New Balance</option>
                <option value="Asics">Asics</option>
                <option value="Nike">Nike</option>
                <option value="Fila">Fila</option>
                <option value="Adidas">Adidas</option>
                <option value="Thương hiệu khác">Thương hiệu khác</option>
              </select>
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🏪</span>
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[10px]">▼</span>
            </div>
          </div>

          {/* Tìm theo thương hiệu */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Tìm theo thương hiệu</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Nhập tên thương hiệu..."
                value={brandSearchInput}
                onChange={(e) => setBrandSearchInput(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-violet-500 focus:bg-white transition"
              />
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
            </div>
          </div>

          {/* Nút Reset */}
          <div>
            <button
              onClick={handleResetOverviewFilter}
              className="w-full py-2 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-2xs"
            >
              <span>🔄</span>
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Thanh trạng thái thông tin & nút cập nhật doanh thu */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 border-t border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="font-medium text-slate-700">
              Đang hiển thị dữ liệu tổng quan từ ngày <b className="text-slate-900">{formatDateDisplay(fromDate)}</b> đến ngày <b className="text-slate-900">{formatDateDisplay(toDate)}</b>
            </span>
          </div>

          <div className="flex items-center space-x-3 flex-wrap">
            <span className="text-[11px] text-slate-400">
              Cập nhật lúc <b className="text-slate-600 font-mono">{lastUpdatedTime}</b> · Tự động lúc <b className="text-slate-600 font-mono">22:00</b>
            </span>
            <button
              onClick={handleRefreshData}
              disabled={isUpdating}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-violet-200 text-violet-700 bg-violet-50/50 hover:bg-violet-100/70 hover:border-violet-300 font-bold text-xs transition shadow-2xs"
            >
              <span className={isUpdating ? 'animate-spin' : ''}>🔄</span>
              <span>Cập nhật doanh thu</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. 7 KPI METRIC CARDS */}
      <div className="space-y-4">
        {/* Row 1: 3 Major Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Tổng doanh thu */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:shadow-md transition space-y-3 relative overflow-hidden group">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">40.346.250 đ</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Tổng doanh thu</div>
            </div>
            <div className="absolute top-4 right-4 text-emerald-500 opacity-20 group-hover:opacity-40 transition text-3xl font-black">↗</div>
          </div>

          {/* Card 2: Tổng tiền mặt */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:shadow-md transition space-y-3 relative overflow-hidden group">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">27.081.250 đ</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Tổng tiền mặt</div>
            </div>
            <div className="absolute top-4 right-4 text-emerald-500 opacity-20 group-hover:opacity-40 transition text-3xl font-black">💵</div>
          </div>

          {/* Card 3: Tổng tiền chuyển khoản */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:shadow-md transition space-y-3 relative overflow-hidden group">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">13.265.000 đ</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Tổng tiền chuyển khoản</div>
            </div>
            <div className="absolute top-4 right-4 text-indigo-500 opacity-20 group-hover:opacity-40 transition text-3xl font-black">💳</div>
          </div>
        </div>

        {/* Row 2: 4 Minor Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 4: Tổng đơn hàng */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs hover:shadow-md transition space-y-2">
            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="text-2xl font-black text-slate-900">22</div>
            <div className="text-xs text-slate-500 font-medium">Tổng đơn hàng</div>
          </div>

          {/* Card 5: Giá trị trung bình đơn (AOV) */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs hover:shadow-md transition space-y-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
              </svg>
            </div>
            <div className="text-2xl font-black text-slate-900">1.833.920 đ</div>
            <div className="text-xs text-slate-500 font-medium">Giá trị trung bình đơn (AOV)</div>
          </div>

          {/* Card 6: Sản phẩm đã bán */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs hover:shadow-md transition space-y-2">
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="text-2xl font-black text-slate-900">26</div>
            <div className="text-xs text-slate-500 font-medium">Sản phẩm đã bán</div>
          </div>

          {/* Card 7: Khách mới */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs hover:shadow-md transition space-y-2">
            <div className="w-7 h-7 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="text-2xl font-black text-slate-900">22</div>
            <div className="text-xs text-slate-500 font-medium">Khách mới</div>
          </div>
        </div>
      </div>

      {/* 3. CHARTS ROW: SẢN PHẨM BÁN THEO NGÀY & THƯƠNG HIỆU */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Chart: Sản phẩm bán được theo ngày (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <span className="text-violet-600 text-sm">📊</span>
              <h3 className="font-bold text-sm text-slate-900">Sản phẩm bán được theo ngày</h3>
            </div>
            {/* Toggle Cột / Đường */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => setChartTypeLeft('bar')}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  chartTypeLeft === 'bar' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Cột
              </button>
              <button
                onClick={() => setChartTypeLeft('line')}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  chartTypeLeft === 'line' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Đường
              </button>
            </div>
          </div>

          {/* Biểu đồ tương tác SVG */}
          <div className="relative pt-6 pb-2 h-72">
            {/* Tooltip khi hover */}
            {hoveredDailyItem && (
              <div
                className="absolute z-20 px-3 py-1.5 bg-slate-900 text-white text-[11px] font-medium rounded-lg shadow-xl pointer-events-none -translate-x-1/2 -translate-y-full"
                style={{
                  left: `${(hoveredDailyItem.idx / (DAILY_SALES_DATA.length - 1)) * 82 + 10}%`,
                  top: `${Math.max(10, 220 - (hoveredDailyItem.qty / 20) * 180)}px`,
                }}
              >
                <div className="font-bold text-violet-300">{hoveredDailyItem.date}</div>
                <div>Đã bán: <b className="text-white">{hoveredDailyItem.qty} sản phẩm</b></div>
              </div>
            )}

            <div className="flex h-60">
              {/* Trục Y */}
              <div className="w-8 flex flex-col justify-between text-right pr-2 text-[10px] font-mono text-slate-400 select-none">
                <span>20</span>
                <span>18</span>
                <span>16</span>
                <span>14</span>
                <span>12</span>
                <span>10</span>
                <span>8</span>
                <span>6</span>
                <span>4</span>
                <span>2</span>
                <span>0</span>
              </div>

              {/* Vùng đồ thị */}
              <div className="flex-1 relative border-l border-b border-slate-200">
                {/* Horizontal Grid lines */}
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((step) => (
                  <div
                    key={step}
                    className="absolute w-full border-t border-slate-100"
                    style={{ bottom: `${step * 10}%` }}
                  />
                ))}

                {/* Render Cột hoặc Đường */}
                {chartTypeLeft === 'bar' ? (
                  <div className="absolute inset-0 flex items-end justify-between px-2 sm:px-6">
                    {DAILY_SALES_DATA.map((item, idx) => {
                      const heightPercent = (item.qty / 20) * 100;
                      return (
                        <div
                          key={idx}
                          onMouseEnter={() => setHoveredDailyItem({ ...item, idx })}
                          onMouseLeave={() => setHoveredDailyItem(null)}
                          className="flex-1 max-w-[28px] mx-1 h-full flex flex-col justify-end items-center cursor-pointer group"
                        >
                          <div
                            style={{ height: `${Math.max(item.qty > 0 ? 8 : 0, heightPercent)}%` }}
                            className={`w-full rounded-t-lg transition-all duration-300 ${
                              item.qty > 0
                                ? 'bg-violet-600 group-hover:bg-violet-500 shadow-sm shadow-violet-600/30'
                                : 'bg-transparent'
                            }`}
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <svg className="absolute inset-0 w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* SVG Spline Area */}
                    <path
                      d={`M 10 240 ${DAILY_SALES_DATA.map((d, i) => {
                        const x = 10 + (i / (DAILY_SALES_DATA.length - 1)) * 360;
                        const y = 240 - (d.qty / 20) * 220;
                        return `L ${x} ${y}`;
                      }).join(' ')} L 370 240 Z`}
                      fill="url(#areaGradient)"
                    />
                    {/* SVG Spline Line */}
                    <path
                      d={`M 10 240 ${DAILY_SALES_DATA.map((d, i) => {
                        const x = 10 + (i / (DAILY_SALES_DATA.length - 1)) * 360;
                        const y = 240 - (d.qty / 20) * 220;
                        return `L ${x} ${y}`;
                      }).join(' ')}`}
                      fill="none"
                      stroke="#7c3aed"
                      strokeWidth="3"
                    />
                    {/* Data Points */}
                    {DAILY_SALES_DATA.map((d, i) => {
                      const x = 10 + (i / (DAILY_SALES_DATA.length - 1)) * 360;
                      const y = 240 - (d.qty / 20) * 220;
                      return (
                        <circle
                          key={i}
                          cx={x}
                          cy={y}
                          r={d.qty > 0 ? 5 : 3}
                          fill="#ffffff"
                          stroke="#7c3aed"
                          strokeWidth="2.5"
                          className="cursor-pointer hover:r-6 transition"
                          onMouseEnter={() => setHoveredDailyItem({ ...d, idx: i })}
                          onMouseLeave={() => setHoveredDailyItem(null)}
                        />
                      );
                    })}
                  </svg>
                )}
              </div>
            </div>

            {/* Trục X */}
            <div className="flex justify-between pl-8 pr-1 pt-2 text-[10px] text-slate-400 font-mono">
              {DAILY_SALES_DATA.map((d, i) => (
                <span key={i} className={i % 2 === 0 ? 'inline' : 'hidden sm:inline'}>
                  {d.date}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Chart: Thương hiệu (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <span className="text-violet-600 text-sm">🥧</span>
              <h3 className="font-bold text-sm text-slate-900">Thương hiệu</h3>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs">
                <button
                  onClick={() => setChartTypeBrand('pie')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                    chartTypeBrand === 'pie' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Tròn
                </button>
                <button
                  onClick={() => setChartTypeBrand('line')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                    chartTypeBrand === 'line' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Đường
                </button>
              </div>

              <select
                value={brandMetric}
                onChange={(e) => setBrandMetric(e.target.value)}
                className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-violet-500"
              >
                <option value="revenue">Theo doanh thu</option>
                <option value="qty">Theo số lượng</option>
              </select>
            </div>
          </div>

          {/* Donut Chart Visualization */}
          <div className="flex flex-col items-center justify-center pt-2">
            <div className="relative w-44 h-44">
              <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                {brandSlices.map((slice, idx) => {
                  if (slice.val <= 0) return null;
                  const isHovered = hoveredBrandSlice?.name === slice.name;
                  const d = describeArc(100, 100, isHovered ? 92 : 88, 52, slice.startAngle, slice.endAngle);
                  return (
                    <path
                      key={idx}
                      d={d}
                      fill={slice.color}
                      className="cursor-pointer transition-all duration-200"
                      onMouseEnter={() => setHoveredBrandSlice(slice)}
                      onMouseLeave={() => setHoveredBrandSlice(null)}
                    />
                  );
                })}
              </svg>
              {/* Inner Donut Information */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-[10px] text-slate-400 font-medium">
                  {hoveredBrandSlice ? hoveredBrandSlice.name : 'Tổng'}
                </span>
                <span className="text-xs font-black text-slate-800">
                  {hoveredBrandSlice
                    ? `${hoveredBrandSlice.percent}%`
                    : brandMetric === 'revenue'
                    ? '63.5M'
                    : '26 đôi'}
                </span>
              </div>
            </div>

            {/* Brand Legend with Values */}
            <div className="w-full divide-y divide-slate-100 text-xs mt-3">
              {BRAND_STATS.map((b, idx) => (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredBrandSlice(b)}
                  onMouseLeave={() => setHoveredBrandSlice(null)}
                  className={`py-2 px-2 flex items-center justify-between rounded-xl transition ${
                    hoveredBrandSlice?.name === b.name ? 'bg-slate-50' : ''
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: b.color }} />
                    <span className="font-medium text-slate-700">{b.name}</span>
                  </div>
                  <span className="font-bold text-slate-900 font-mono">
                    {b.revenue.toLocaleString('vi-VN')} đ
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. BREAKDOWN TABLES & ORDER STATUS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Card: Tổng quan theo chu kỳ thời gian (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <span className="text-emerald-500 text-sm">📅</span>
                <h3 className="font-bold text-sm text-slate-900">Tổng quan theo chu kỳ thời gian</h3>
              </div>
              <button
                onClick={() => handleExportCSV('period')}
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl border border-violet-200 text-violet-700 bg-violet-50/50 hover:bg-violet-100/70 hover:border-violet-300 text-xs font-bold transition shadow-2xs"
              >
                <span>📥</span>
                <span>Xuất Excel</span>
              </button>
            </div>

            <div className="overflow-x-auto mt-3">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-slate-500 font-semibold border-b border-slate-100 pb-2">
                    <th className="py-2.5 px-3">Thời gian</th>
                    <th className="py-2.5 px-3 text-right">Doanh thu</th>
                    <th className="py-2.5 px-3 text-center">Số đơn</th>
                    <th className="py-2.5 px-3 text-right">AOV (Trung bình/đơn)</th>
                    <th className="py-2.5 px-3 text-center">Tăng trưởng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {PERIOD_BREAKDOWN.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3 font-bold text-slate-800">{row.period}</td>
                      <td className="py-3 px-3 text-right font-black text-slate-900 font-mono">
                        {row.revenue.toLocaleString('vi-VN')} đ
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-slate-700">{row.orders}</td>
                      <td className="py-3 px-3 text-right font-mono text-slate-700">
                        {row.aov.toLocaleString('vi-VN')} đ
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                          ↗ {row.growth}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Card: Cơ cấu trạng thái đơn hàng (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
              <span className="text-sky-500 text-sm">⏱️</span>
              <h3 className="font-bold text-sm text-slate-900">Cơ cấu trạng thái đơn hàng</h3>
            </div>

            {/* Donut Chart with Tooltip */}
            <div className="flex flex-col items-center justify-center pt-3">
              <div className="relative w-44 h-44">
                <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                  {statusSlices.map((slice, idx) => {
                    const isHovered = hoveredStatusSlice?.label === slice.label;
                    const d = describeArc(100, 100, isHovered ? 92 : 88, 48, slice.startAngle, slice.endAngle);
                    return (
                      <path
                        key={idx}
                        d={d}
                        fill={slice.color}
                        className="cursor-pointer transition-all duration-200"
                        onMouseEnter={() => setHoveredStatusSlice(slice)}
                        onMouseLeave={() => setHoveredStatusSlice(null)}
                      />
                    );
                  })}
                </svg>

                {/* Tooltip hiển thị khi hover lát cắt */}
                {hoveredStatusSlice && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center bg-white/90 backdrop-blur-xs rounded-full p-2">
                    <span className="text-[11px] font-bold text-slate-900 line-clamp-1">{hoveredStatusSlice.label}</span>
                    <span className="text-xs font-black text-violet-600">{hoveredStatusSlice.count} đơn hàng</span>
                    <span className="text-[10px] text-slate-400 font-mono">{hoveredStatusSlice.percent}%</span>
                  </div>
                )}
              </div>

              {/* Status List Legend with Counts */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full text-xs mt-4 pt-2 border-t border-slate-100">
                {ORDER_STATUS_BREAKDOWN.map((st, idx) => (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredStatusSlice(st)}
                    onMouseLeave={() => setHoveredStatusSlice(null)}
                    className={`flex items-center justify-between p-1.5 rounded-lg transition ${
                      hoveredStatusSlice?.label === st.label ? 'bg-slate-50 font-bold' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 truncate">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: st.color }} />
                      <span className="text-slate-600 truncate">{st.label}</span>
                    </div>
                    <span className="font-bold text-slate-900 font-mono ml-1">{st.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. TỔNG QUAN DOANH THU NHÂN VIÊN */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <span className="text-violet-600 text-base">👥</span>
            <h3 className="font-bold text-sm text-slate-900">Tổng quan doanh thu nhân viên</h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
              {filteredEmployees.length} nhân viên
            </span>
          </div>

          <button
            onClick={() => handleExportCSV('employee')}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-violet-200 text-violet-700 bg-violet-50/50 hover:bg-violet-100/70 hover:border-violet-300 text-xs font-bold transition shadow-2xs self-start sm:self-auto"
          >
            <span>📥</span>
            <span>Xuất Excel</span>
          </button>
        </div>

        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Mã hoặc tên nhân viên"
              value={empSearch}
              onChange={(e) => setEmpSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-violet-500 focus:bg-white transition"
            />
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
          </div>

          <div className="w-full sm:w-56">
            <select
              value={empSort}
              onChange={(e) => setEmpSort(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50/70 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-violet-500 focus:bg-white transition"
            >
              <option value="revenue_desc">Doanh thu cao nhất</option>
              <option value="orders_desc">Số đơn nhiều nhất</option>
              <option value="sold_desc">Đã bán nhiều nhất</option>
              <option value="name_asc">Tên nhân viên A-Z</option>
            </select>
          </div>

          <button
            onClick={() => {
              setEmpSearch('');
              setEmpSort('revenue_desc');
            }}
            className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center space-x-1 shadow-2xs"
          >
            <span>🔄</span>
            <span>Reset</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-slate-500 font-semibold border-b border-slate-100">
                <th className="py-2.5 px-3">STT</th>
                <th className="py-2.5 px-3">Mã nhân viên</th>
                <th className="py-2.5 px-3">Nhân viên</th>
                <th className="py-2.5 px-3 text-center">Đã bán</th>
                <th className="py-2.5 px-3 text-center">Số đơn bán</th>
                <th className="py-2.5 px-3 text-right">Doanh thu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map((emp) => (
                <tr key={emp.code} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-3 font-medium text-slate-500">{emp.stt}</td>
                  <td className="py-3 px-3">
                    <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                      {emp.code}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{emp.name}</div>
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-slate-700">{emp.soldQty}</td>
                  <td className="py-3 px-3 text-center font-bold text-slate-700">{emp.ordersCount}</td>
                  <td className="py-3 px-3 text-right font-black text-violet-700 font-mono">
                    {emp.revenue.toLocaleString('vi-VN')} đ
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. TỔNG QUAN SẢN PHẨM */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <span className="text-violet-600 text-base">📦</span>
            <h3 className="font-bold text-sm text-slate-900">Tổng quan sản phẩm</h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
              {filteredProducts.length} sản phẩm
            </span>
          </div>

          <button
            onClick={() => handleExportCSV('product')}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-violet-200 text-violet-700 bg-violet-50/50 hover:bg-violet-100/70 hover:border-violet-300 text-xs font-bold transition shadow-2xs self-start sm:self-auto"
          >
            <span>📥</span>
            <span>Xuất Excel</span>
          </button>
        </div>

        {/* Filter controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Mã, tên hoặc thương hiệu"
              value={prodSearch}
              onChange={(e) => {
                setProdSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8 pr-3 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-violet-500 focus:bg-white transition"
            />
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
          </div>

          <div>
            <select
              value={stockFilter}
              onChange={(e) => {
                setStockFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 px-3 bg-slate-50/70 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-violet-500 focus:bg-white transition"
            >
              <option value="all">Tất cả tồn kho</option>
              <option value="in_stock">Còn hàng (&gt; 10)</option>
              <option value="low_stock">Sắp hết hàng (≤ 10)</option>
              <option value="out_of_stock">Hết hàng (0)</option>
            </select>
          </div>

          <div>
            <select
              value={prodSort}
              onChange={(e) => setProdSort(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50/70 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-violet-500 focus:bg-white transition"
            >
              <option value="sold_desc">Bán chạy nhất</option>
              <option value="revenue_desc">Doanh thu cao nhất</option>
              <option value="stock_desc">Tồn kho nhiều nhất</option>
              <option value="stock_asc">Tồn kho ít nhất</option>
            </select>
          </div>

          <div>
            <button
              onClick={() => {
                setProdSearch('');
                setStockFilter('all');
                setProdSort('sold_desc');
                setCurrentPage(1);
              }}
              className="w-full py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-2xs"
            >
              <span>🔄</span>
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Product Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-slate-500 font-semibold border-b border-slate-100">
                <th className="py-2.5 px-3">STT</th>
                <th className="py-2.5 px-3">Mã sản phẩm</th>
                <th className="py-2.5 px-3">Tên sản phẩm</th>
                <th className="py-2.5 px-3">Thương hiệu</th>
                <th className="py-2.5 px-3 text-center">Đã bán</th>
                <th className="py-2.5 px-3 text-center">Số lượng trả</th>
                <th className="py-2.5 px-3 text-right">Doanh thu</th>
                <th className="py-2.5 px-3 text-center">Tồn kho</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedProducts.map((p, idx) => (
                <tr key={p.code} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-3 font-medium text-slate-500">
                    {(currentPage - 1) * pageSize + idx + 1}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-700">{p.code}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
                        👟
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{p.name}</div>
                        <div className="text-[10px] text-slate-400">Tổng dữ liệu</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center space-x-1 text-slate-700 font-medium">
                      <span>🏪</span>
                      <span>{p.brand}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-slate-800">{p.sold}</td>
                  <td className="py-3 px-3 text-center font-medium text-slate-500">{p.returned}</td>
                  <td className="py-3 px-3 text-right font-black text-slate-900 font-mono">
                    {p.revenue.toLocaleString('vi-VN')} đ
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      p.stock > 10
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : p.stock > 0
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {p.stock}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <span>Hiển thị</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="py-1 px-2 border border-slate-200 rounded-lg bg-white text-slate-700 font-bold focus:outline-hidden"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <span>/ trang</span>
          </div>

          {/* Page buttons */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition"
            >
              &laquo;
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition"
            >
              &lsaquo;
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold transition ${
                  currentPage === page
                    ? 'bg-violet-600 text-white shadow-2xs'
                    : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition"
            >
              &rsaquo;
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition"
            >
              &raquo;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
