import React, { useState, useMemo } from 'react';

// Dữ liệu mẫu danh sách hóa đơn chuẩn theo hệ thống VibeFlow & ảnh tham chiếu chi tiết
const INITIAL_INVOICES = [
  {
    id: "HDMSVNRIJ3030",
    code: "HDMSVNRIJ3030",
    customer: "Trần Vũ Tùng Anh",
    isVip: false,
    phone: "0383854485",
    email: "tunganht26@gmail.com",
    employee: "Trần Vũ Tùng Anh",
    creator: "Trần Vũ Tùng Anh",
    createdAt: "16/08/2026",
    time: "17:24:41",
    date: "2026-08-16",
    lastUpdated: "17:25:38 16/08/2026 - Khách hàng",
    total: 4580500,
    subtotal: 6064000,
    voucherCode: "VCH4TJWFW",
    voucherDiscountPercent: 60,
    voucherDiscountAmount: 1500000,
    shippingFee: 16500,
    carrier: "GHN",
    orderType: "Trực tuyến",
    channel: "Trực tuyến",
    status: "pending",
    statusText: "Chờ xác nhận",
    payment: "COD",
    paymentNote: "Thanh toán COD",
    paymentSubnote: "Chờ thanh toán khi nhận hàng",
    paymentTime: "17:24:41 16/08/2026",
    paymentStatus: "Chờ thanh toán",
    paymentAmount: 4595000,
    address: "Chung cư Sông Hồng, Phường Đống Đa, Thành phố Hà Nội",
    note: "-",
    items: [
      {
        id: 101,
        sku: "G57664-MS03-37",
        name: "New Balance 530",
        category: "Sneakers",
        color: "Đỏ",
        size: "37",
        qty: 2,
        time: "17:24:41 16/08/2026",
        discount: "-",
        price: 2500000,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&auto=format&fit=crop&q=80",
      },
      {
        id: 102,
        sku: "SP02-UB-40",
        name: "Adidas Ultraboost 22",
        category: "Sneakers",
        color: "Đen",
        size: "40",
        qty: 1,
        time: "17:24:41 16/08/2026",
        discount: "-",
        price: 1064000,
        image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=200&auto=format&fit=crop&q=80",
      }
    ],
    operationsHistory: [
      {
        id: 1,
        actorType: "customer",
        actor: "Trần Vũ Tùng Anh",
        role: "KHÁCH HÀNG",
        time: "17:25:38 16/08/2026",
        action: "Cập nhật thông tin giao hàng",
        details: [
          "Khách hàng cập nhật thông tin giao hàng:",
          "- Địa chỉ: 'Chung cư Tỉnh Đội, đường Lam Sơn, Phường Vĩnh Yên, Tỉnh Phú Thọ' -> 'Chung cư Sông Hồng, Phường Đống Đa, Thành phố Hà Nội'",
          "- Phí ship: '31000đ' -> '16500đ'"
        ]
      }
    ]
  },
  {
    id: "1706450020242",
    code: "1706450020242",
    customer: "Khách vãng lai",
    isVip: false,
    phone: "",
    email: "Không có",
    employee: "ADMIN_TA",
    createdAt: "16/08/2026",
    time: "17:11:34",
    date: "2026-08-16",
    total: 1000000,
    subtotal: 2500000,
    voucherCode: "VCH4TJWFW",
    voucherDiscountPercent: 60,
    voucherDiscountAmount: 1500000,
    shippingFee: 0,
    orderType: "Cửa hàng",
    status: "completed",
    statusText: "Hoàn thành",
    channel: "Tại cửa hàng",
    payment: "Chuyển khoản",
    paymentNote: "Thanh toán đơn của hàng",
    paymentTime: "17:13:22 16/08/2026",
    address: "-",
    note: "-",
    items: [
      {
        id: 1,
        sku: "G57664-MS03-37",
        name: "New Balance 530",
        category: "Sneakers",
        color: "Đỏ",
        size: "37",
        qty: 1,
        time: "17:11:34 16/08/2026",
        discount: "-",
        price: 2500000,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&auto=format&fit=crop&q=80",
      }
    ],
    timeline: [
      {
        title: "Hóa đơn chờ",
        icon: "hourglass",
        time: "17:11:34 16/08/2026",
        actor: "ADMIN_TA",
        done: true,
      },
      {
        title: "Hoàn Thành",
        icon: "flag",
        time: "17:13:22 16/08/2026",
        actor: "ADMIN_TA",
        done: true,
      }
    ],
    operationsHistory: [
      { id: 1, action: "Tạo hóa đơn chờ thanh toán", actor: "ADMIN_TA", time: "17:11:34 16/08/2026", note: "Khách mua trực tiếp tại quầy" },
      { id: 2, action: "Áp dụng phiếu giảm giá VCH4TJWFW", actor: "ADMIN_TA", time: "17:12:05 16/08/2026", note: "Giảm 60% (-1.500.000 đ)" },
      { id: 3, action: "Thanh toán thành công qua Chuyển khoản", actor: "ADMIN_TA", time: "17:13:22 16/08/2026", note: "Giao dịch mã QR 1.000.000 đ" },
      { id: 4, action: "Chuyển trạng thái đơn sang Hoàn thành", actor: "ADMIN_TA", time: "17:13:22 16/08/2026", note: "Đã xuất hóa đơn bán lẻ" },
    ]
  },
  {
    id: "1706085040749",
    code: "1706085040749",
    customer: "Đỗ Đức Thể",
    isVip: false,
    phone: "0329875432",
    email: "the.dduc@gmail.com",
    employee: "Quản lý",
    createdAt: "23/12/2025",
    time: "14:15:00",
    date: "2025-12-23",
    total: 360000,
    subtotal: 360000,
    voucherCode: "",
    voucherDiscountPercent: 0,
    voucherDiscountAmount: 0,
    shippingFee: 0,
    orderType: "Online",
    status: "pending",
    statusText: "Chờ Xác Nhận",
    channel: "TikTok Shop",
    payment: "COD tận nơi",
    paymentNote: "Thanh toán khi nhận hàng",
    paymentTime: "Chờ thanh toán",
    address: "Số 48 Ngõ 175 Cầu Giấy, Dịch Vọng, Cầu Giấy, Hà Nội",
    note: "Kiểm tra kỹ trước khi nhận hàng",
    items: [
      {
        id: 2,
        sku: "ACC-CLEAN-01",
        name: "Bộ Vệ Sinh Sneaker Crep Protect Cure",
        category: "Phụ kiện",
        color: "Đen Vàng",
        size: "Bộ 3 món",
        qty: 1,
        time: "14:15:00 23/12/2025",
        discount: "-",
        price: 360000,
        image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=200&auto=format&fit=crop&q=80",
      }
    ],
    timeline: [
      { title: "Hóa đơn chờ", icon: "hourglass", time: "14:15:00 23/12/2025", actor: "TikTok Shop", done: true },
      { title: "Chờ xác nhận", icon: "check", time: "Đang chờ xử lý", actor: "Quản lý", done: false },
      { title: "Hoàn Thành", icon: "flag", time: "--", actor: "Quản lý", done: false },
    ],
    operationsHistory: [
      { id: 1, action: "Đồng bộ đơn hàng từ TikTok Shop", actor: "Hệ thống", time: "14:15:00 23/12/2025", note: "Tạo đơn hàng chờ xác nhận" }
    ]
  },
  {
    id: "1706085040112",
    code: "1706085040112",
    customer: "Trần Thị Mai",
    isVip: true,
    phone: "0912.333.444",
    email: "mai.tran@gmail.com",
    employee: "Thu Ngân Linh",
    createdAt: "23/12/2025",
    time: "10:00:15",
    date: "2025-12-23",
    total: 3790000,
    subtotal: 3790000,
    voucherCode: "",
    voucherDiscountPercent: 0,
    voucherDiscountAmount: 0,
    shippingFee: 0,
    orderType: "Cửa hàng",
    status: "confirmed",
    statusText: "Đã Xác Nhận",
    channel: "Quầy POS #01",
    payment: "Tiền mặt",
    paymentNote: "Khách VIP thanh toán tại quầy",
    paymentTime: "10:05:00 23/12/2025",
    address: "Mua trực tiếp tại cửa hàng VibeFlow Cầu Giấy",
    note: "Khách VIP mua hàng tại quầy",
    items: [
      {
        id: 3,
        sku: "G66748-MS05-41",
        name: "ASICS GEL-Kayano 31",
        category: "Sneakers",
        color: "Xám Bạc",
        size: "41",
        qty: 1,
        time: "10:00:15 23/12/2025",
        discount: "-",
        price: 3790000,
        image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=200&auto=format&fit=crop&q=80",
      }
    ],
    timeline: [
      { title: "Hóa đơn chờ", icon: "hourglass", time: "10:00:15 23/12/2025", actor: "Thu Ngân Linh", done: true },
      { title: "Đã xác nhận", icon: "check", time: "10:05:00 23/12/2025", actor: "Thu Ngân Linh", done: true },
      { title: "Hoàn Thành", icon: "flag", time: "--", actor: "Thu Ngân Linh", done: false },
    ],
    operationsHistory: [
      { id: 1, action: "Tạo hóa đơn tại quầy POS", actor: "Thu Ngân Linh", time: "10:00:15 23/12/2025", note: "Khách chọn ASICS GEL-Kayano 31" },
      { id: 2, action: "Thu tiền mặt 3.790.000 đ", actor: "Thu Ngân Linh", time: "10:05:00 23/12/2025", note: "Xác nhận đơn thành công" },
    ]
  },
  {
    id: "1706085040998",
    code: "1706085040998",
    customer: "Nguyễn Văn An",
    isVip: false,
    phone: "0987.654.321",
    email: "an.nguyen@vibe.vn",
    employee: "ADMIN_TA",
    createdAt: "22/12/2025",
    time: "11:00:00",
    date: "2025-12-22",
    total: 4850000,
    subtotal: 4850000,
    voucherCode: "",
    voucherDiscountPercent: 0,
    voucherDiscountAmount: 0,
    shippingFee: 0,
    orderType: "Online",
    status: "processing",
    statusText: "Đang Chuẩn Bị",
    channel: "Website Store",
    payment: "Chuyển khoản VietQR",
    paymentNote: "Đã nhận tiền tài khoản",
    paymentTime: "11:05:00 22/12/2025",
    address: "Tòa Keangnam Landmark 72, Phạm Hùng, Nam Từ Liêm, Hà Nội",
    note: "Đóng gói bọc bóng khí cẩn thận hộp giày",
    items: [
      {
        id: 4,
        sku: "IMG-AJ1-01-42",
        name: "Air Jordan 1 High Shadow 2.0",
        category: "Sneakers",
        color: "Đen / Xám Shadow",
        size: "42",
        qty: 1,
        time: "11:00:00 22/12/2025",
        discount: "-",
        price: 4850000,
        image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=200&auto=format&fit=crop&q=80",
      }
    ],
    timeline: [
      { title: "Hóa đơn chờ", icon: "hourglass", time: "11:00:00 22/12/2025", actor: "Website", done: true },
      { title: "Đã xác nhận", icon: "check", time: "11:05:00 22/12/2025", actor: "ADMIN_TA", done: true },
      { title: "Đang chuẩn bị", icon: "box", time: "13:30:00 22/12/2025", actor: "Kho VibeFlow", done: true },
      { title: "Hoàn Thành", icon: "flag", time: "--", actor: "ADMIN_TA", done: false },
    ],
    operationsHistory: [
      { id: 1, action: "Khách đặt hàng qua Website", actor: "Khách hàng", time: "11:00:00 22/12/2025", note: "Đơn thanh toán VietQR" },
      { id: 2, action: "Xác nhận tiền về tài khoản", actor: "ADMIN_TA", time: "11:05:00 22/12/2025", note: "Chuyển kho soạn hàng" },
    ]
  }
];

// Danh sách các tab trạng thái ngang chuẩn theo hệ thống
const STATUS_TABS = [
  { id: 'all', label: 'TẤT CẢ' },
  { id: 'pending', label: 'CHỜ XÁC NHẬN' },
  { id: 'confirmed', label: 'ĐÃ XÁC NHẬN' },
  { id: 'processing', label: 'ĐANG CHUẨN BỊ' },
  { id: 'shipping', label: 'ĐANG GIAO' },
  { id: 'failed', label: 'GIAO HÀNG THẤT BẠI' },
  { id: 'completed', label: 'HOÀN THÀNH' },
  { id: 'cancelled', label: 'ĐÃ HỦY' },
];

export default function OrdersTab({
  orderFilter = 'pending',
  setOrderFilter,
  setActiveTab,
}) {
  // Danh sách hóa đơn
  const [invoicesList, setInvoicesList] = useState(INITIAL_INVOICES);

  // Tab trạng thái đang chọn
  const [activeTabStatus, setActiveTabStatus] = useState('pending');

  // Các trường bộ lọc danh sách
  const [searchCode, setSearchCode] = useState('');
  const [orderTypeFilter, setOrderTypeFilter] = useState('all');
  const [fromDate, setFromDate] = useState('2025-12-23');
  const [toDate, setToDate] = useState('2026-08-16');

  // Phân trang danh sách
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Xem Chi Tiết Hóa Đơn (Full view chuẩn theo ảnh chụp tham chiếu)
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);

  // Modal Lịch sử thao tác & Modal In hóa đơn
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [invoiceToPrint, setInvoiceToPrint] = useState(null);

  // Modal Cập nhật thông tin đơn hàng (Chỉnh sửa đơn hàng - Ảnh 3, 4, 5)
  const [showEditOrderModal, setShowEditOrderModal] = useState(false);
  const [editModalTab, setEditModalTab] = useState('order'); // 'order' | 'customer'
  const [editOrderStatus, setEditOrderStatus] = useState('pending');
  const [editCustomerName, setEditCustomerName] = useState('');
  const [editCustomerPhone, setEditCustomerPhone] = useState('');
  const [editCustomerEmail, setEditCustomerEmail] = useState('');
  const [editCustomerAddress, setEditCustomerAddress] = useState('');
  const [editCustomerNote, setEditCustomerNote] = useState('');

  // Modal Hủy đơn hàng
  const [showCancelOrderModal, setShowCancelOrderModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('Khách yêu cầu hủy');

  // Bộ lọc bên trong bảng "Danh Sách Sản Phẩm" của Chi Tiết Hóa Đơn (Khớp 100% ảnh 2)
  const [detailProductSearch, setDetailProductSearch] = useState('');
  const [detailCategoryFilter, setDetailCategoryFilter] = useState('all');
  const [detailSort, setDetailSort] = useState('default');
  const [detailPriceRange, setDetailPriceRange] = useState(2500000);

  // Toast feedback nhẹ nhàng
  const [toastMessage, setToastMessage] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  // Ánh xạ trạng thái đơn hàng sang text tiếng Việt
  const STATUS_LABEL_MAP = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    picking: 'Chờ lấy hàng',
    shipping: 'Đang giao hàng',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy',
  };

  // Lấy các lựa chọn trạng thái theo quy trình kế tiếp (Khớp Ảnh 3, 4, 5)
  const getStatusOptions = (status) => {
    switch (status) {
      case 'pending':
      case 'Chờ xác nhận':
        return [
          { value: 'pending', label: 'Chờ xác nhận' },
          { value: 'confirmed', label: 'Đã xác nhận' },
        ];
      case 'confirmed':
      case 'Đã xác nhận':
        return [
          { value: 'confirmed', label: 'Đã xác nhận' },
          { value: 'picking', label: 'Chờ lấy hàng' },
        ];
      case 'picking':
      case 'Chờ lấy hàng':
        return [
          { value: 'picking', label: 'Chờ lấy hàng' },
          { value: 'shipping', label: 'Đang giao hàng' },
        ];
      case 'shipping':
      case 'Đang giao hàng':
        return [
          { value: 'shipping', label: 'Đang giao hàng' },
          { value: 'completed', label: 'Hoàn thành' },
        ];
      case 'completed':
      case 'Hoàn thành':
        return [{ value: 'completed', label: 'Hoàn thành' }];
      default:
        return [
          { value: status, label: STATUS_LABEL_MAP[status] || status },
          { value: 'cancelled', label: 'Đã hủy' },
        ];
    }
  };

  // Mở modal Chỉnh sửa đơn hàng
  const handleOpenEditModal = () => {
    if (!selectedOrderDetail) return;
    setEditOrderStatus(selectedOrderDetail.status || 'pending');
    setEditCustomerName(selectedOrderDetail.customer || '');
    setEditCustomerPhone(selectedOrderDetail.phone || '');
    setEditCustomerEmail(selectedOrderDetail.email || '');
    setEditCustomerAddress(selectedOrderDetail.address || '');
    setEditCustomerNote(selectedOrderDetail.note || '-');
    setEditModalTab('order');
    setShowEditOrderModal(true);
  };

  // Lưu thông tin từ Modal Chỉnh Sửa
  const handleSaveOrderModal = () => {
    if (!selectedOrderDetail) return;
    const now = new Date();
    const timeStr = `${now.toTimeString().split(' ')[0]} 16/08/2026`;
    let newHistory = [...(selectedOrderDetail.operationsHistory || [])];
    let updatedDetail = { ...selectedOrderDetail };

    if (editModalTab === 'order') {
      const oldStatus = selectedOrderDetail.status;
      const newStatus = editOrderStatus;
      if (oldStatus !== newStatus) {
        const oldText = STATUS_LABEL_MAP[oldStatus] || oldStatus;
        const newText = STATUS_LABEL_MAP[newStatus] || newStatus;
        newHistory.unshift({
          id: Date.now(),
          actorType: 'admin',
          actor: 'ADMIN_TA',
          role: 'ADMIN',
          time: timeStr,
          action: 'Cập nhật trạng thái đơn hàng',
          details: [
            `Quản trị viên cập nhật trạng thái đơn hàng:`,
            `- Trạng thái: '${oldText}' -> '${newText}'`,
          ],
        });
        updatedDetail.status = newStatus;
        updatedDetail.statusText = newText;
        updatedDetail.lastUpdated = `${timeStr} - ADMIN_TA`;
      }
    } else {
      // Tab thông tin khách hàng
      const detailsList = ['Khách hàng cập nhật thông tin giao hàng:'];
      let hasChanges = false;

      if (editCustomerAddress !== selectedOrderDetail.address) {
        detailsList.push(`- Địa chỉ: '${selectedOrderDetail.address}' -> '${editCustomerAddress}'`);
        hasChanges = true;
      }
      if (editCustomerPhone !== selectedOrderDetail.phone) {
        detailsList.push(`- Số điện thoại: '${selectedOrderDetail.phone}' -> '${editCustomerPhone}'`);
        hasChanges = true;
      }
      if (editCustomerName !== selectedOrderDetail.customer) {
        detailsList.push(`- Tên khách hàng: '${selectedOrderDetail.customer}' -> '${editCustomerName}'`);
        hasChanges = true;
      }

      if (hasChanges) {
        newHistory.unshift({
          id: Date.now(),
          actorType: 'customer',
          actor: editCustomerName || selectedOrderDetail.customer,
          role: 'KHÁCH HÀNG',
          time: timeStr,
          action: 'Cập nhật thông tin giao hàng',
          details: detailsList,
        });
        updatedDetail.customer = editCustomerName;
        updatedDetail.phone = editCustomerPhone;
        updatedDetail.email = editCustomerEmail;
        updatedDetail.address = editCustomerAddress;
        updatedDetail.note = editCustomerNote;
        updatedDetail.lastUpdated = `${timeStr} - Khách hàng`;
      }
    }

    updatedDetail.operationsHistory = newHistory;
    setSelectedOrderDetail(updatedDetail);
    setInvoicesList((prev) =>
      prev.map((inv) => (inv.code === updatedDetail.code ? updatedDetail : inv))
    );
    setShowEditOrderModal(false);
    showToast('Cập nhật thông tin đơn hàng thành công!');
  };

  // Xác nhận Hủy đơn hàng
  const handleConfirmCancelOrder = () => {
    if (!selectedOrderDetail) return;
    const now = new Date();
    const timeStr = `${now.toTimeString().split(' ')[0]} 16/08/2026`;
    const newHistory = [
      {
        id: Date.now(),
        actorType: 'admin',
        actor: 'ADMIN_TA',
        role: 'ADMIN',
        time: timeStr,
        action: 'Hủy đơn hàng',
        details: [
          `Đơn hàng đã được hủy bởi Quản trị viên.`,
          `- Lý do hủy: ${cancelReason || 'Khách yêu cầu hủy'}`,
        ],
      },
      ...(selectedOrderDetail.operationsHistory || []),
    ];

    const updatedDetail = {
      ...selectedOrderDetail,
      status: 'cancelled',
      statusText: 'Đã hủy',
      lastUpdated: `${timeStr} - ADMIN_TA`,
      operationsHistory: newHistory,
    };

    setSelectedOrderDetail(updatedDetail);
    setInvoicesList((prev) =>
      prev.map((inv) => (inv.code === updatedDetail.code ? updatedDetail : inv))
    );
    setShowCancelOrderModal(false);
    showToast('Đã hủy đơn hàng thành công!', 'error');
  };

  // Đếm số lượng hóa đơn theo từng tab trạng thái
  const countsByStatus = useMemo(() => {
    const counts = { all: invoicesList.length };
    STATUS_TABS.forEach((t) => {
      if (t.id !== 'all') {
        counts[t.id] = invoicesList.filter((inv) => inv.status === t.id).length;
      }
    });
    return counts;
  }, [invoicesList]);

  // Lọc dữ liệu danh sách hóa đơn ngoài
  const filteredInvoices = useMemo(() => {
    return invoicesList.filter((inv) => {
      if (activeTabStatus !== 'all') {
        if (inv.status !== activeTabStatus) return false;
      }
      if (searchCode.trim()) {
        const q = searchCode.toLowerCase().trim();
        const matchCode = (inv.code || '').toLowerCase().includes(q);
        const matchCustomer = (inv.customer || '').toLowerCase().includes(q);
        const matchPhone = (inv.phone || '').toLowerCase().includes(q);
        if (!matchCode && !matchCustomer && !matchPhone) return false;
      }
      if (orderTypeFilter !== 'all') {
        if (inv.orderType !== orderTypeFilter) return false;
      }
      if (fromDate && inv.date && inv.date < fromDate) return false;
      if (toDate && inv.date && inv.date > toDate) return false;
      return true;
    });
  }, [invoicesList, activeTabStatus, searchCode, orderTypeFilter, fromDate, toDate]);

  // Phân trang
  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + pageSize);

  // Reset bộ lọc danh sách
  const handleResetFilters = () => {
    setSearchCode('');
    setOrderTypeFilter('all');
    setFromDate('');
    setToDate('');
    setActiveTabStatus('all');
    if (setOrderFilter) setOrderFilter('all');
    setCurrentPage(1);
    showToast('Đã đặt lại toàn bộ bộ lọc hóa đơn');
  };

  // Cập nhật trạng thái đơn hàng
  const handleUpdateStatus = (id, newStatus, newStatusText) => {
    setInvoicesList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedHistory = [
            ...(item.operationsHistory || []),
            {
              id: Date.now(),
              action: `Cập nhật trạng thái: ${newStatusText}`,
              actor: 'ADMIN_TA',
              time: `Vừa xong - 16/08/2026`,
              note: `Chuyển sang ${newStatusText}`,
            },
          ];
          return {
            ...item,
            status: newStatus,
            statusText: newStatusText,
            operationsHistory: updatedHistory,
          };
        }
        return item;
      })
    );

    if (selectedOrderDetail && selectedOrderDetail.id === id) {
      setSelectedOrderDetail((prev) => ({
        ...prev,
        status: newStatus,
        statusText: newStatusText,
      }));
    }

    showToast(`Đã chuyển đơn hàng sang: ${newStatusText}`);
  };

  // Sao chép mã hóa đơn
  const handleCopyCode = (code, e) => {
    e?.stopPropagation();
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    showToast(`Đã sao chép mã đơn #${code}`);
    setTimeout(() => setCopiedCode(null), 1800);
  };

  // Hàm tạo avatar viết tắt từ tên khách hàng
  const getInitials = (name) => {
    if (!name || name === 'Khách vãng lai') return 'KV';
    const words = name.trim().split(/\s+/);
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  // Lọc sản phẩm trong trang Chi Tiết Hóa Đơn
  const detailFilteredItems = useMemo(() => {
    if (!selectedOrderDetail || !selectedOrderDetail.items) return [];
    let items = [...selectedOrderDetail.items];

    // Lọc theo từ khóa
    if (detailProductSearch.trim()) {
      const q = detailProductSearch.toLowerCase().trim();
      items = items.filter(
        (it) =>
          it.name.toLowerCase().includes(q) ||
          it.sku.toLowerCase().includes(q) ||
          it.color.toLowerCase().includes(q) ||
          it.size.toLowerCase().includes(q)
      );
    }

    // Lọc theo loại sản phẩm
    if (detailCategoryFilter !== 'all') {
      items = items.filter((it) => it.category === detailCategoryFilter);
    }

    // Lọc theo khoảng giá tối đa
    items = items.filter((it) => it.price <= detailPriceRange);

    // Sắp xếp
    if (detailSort === 'priceAsc') {
      items.sort((a, b) => a.price - b.price);
    } else if (detailSort === 'priceDesc') {
      items.sort((a, b) => b.price - a.price);
    }

    return items;
  }, [selectedOrderDetail, detailProductSearch, detailCategoryFilter, detailSort, detailPriceRange]);

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER: NẾU ĐANG CHỌN XEM CHI TIẾT HÓA ĐƠN -> HIỂN THỊ TRANG CHI TIẾT (CHUẨN 100% ẢNH THAM CHIẾU)
  // ─────────────────────────────────────────────────────────────────────────────
  if (selectedOrderDetail) {
    const isOnlineOrder =
      selectedOrderDetail.orderType === 'Trực tuyến' ||
      selectedOrderDetail.orderType === 'Online' ||
      selectedOrderDetail.channel === 'Trực tuyến';

    const currentStatus = selectedOrderDetail.status || 'pending';
    const isPending = currentStatus === 'pending';
    const isConfirmed = currentStatus === 'confirmed';
    const isPicking = currentStatus === 'picking';
    const isShipping = currentStatus === 'shipping';
    const isCompleted = currentStatus === 'completed';
    const isCancelled = currentStatus === 'cancelled';

    return (
      <div className="space-y-6 max-w-[1600px] mx-auto pb-24 animate-in fade-in duration-200 font-sans text-slate-800">
        {/* ── THANH TIÊU ĐỀ TRÊN CÙNG (KHỚP 100% ẢNH 1) ── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-200/90">
          <div>
            <div className="flex items-center space-x-3 text-xs text-slate-700 font-semibold flex-wrap gap-y-1">
              <span>
                Mã Đơn Hàng: <b className="text-slate-900 font-mono font-bold">{selectedOrderDetail.code}</b>
              </span>
              <span className="text-slate-300 hidden sm:inline">|</span>
              <span className="text-slate-500">
                Ngày Tạo: <b className="text-slate-700">{selectedOrderDetail.time || '17:24:41'} {selectedOrderDetail.createdAt || '16/08/2026'}</b>
              </span>
            </div>
            <div className="flex items-center space-x-3 text-[11px] text-slate-500 mt-1 flex-wrap gap-y-1">
              <span>
                Tạo Bởi: <b className="text-slate-700">{selectedOrderDetail.creator || selectedOrderDetail.customer || 'Trần Vũ Tùng Anh'}</b>
              </span>
              <span className="text-slate-300 hidden sm:inline">|</span>
              <span>
                Cập Nhật Gần Nhất: <b className="text-slate-700">{selectedOrderDetail.lastUpdated || `${selectedOrderDetail.time || '17:25:38'} ${selectedOrderDetail.createdAt || '16/08/2026'} - Khách hàng`}</b>
              </span>
            </div>
          </div>

          {/* 2 Nút Hành Động Trên Cùng (Ảnh 1) */}
          <div className="flex items-center space-x-2.5 self-start lg:self-auto">
            <button
              type="button"
              onClick={() => {
                if (typeof setActiveTab === 'function') {
                  setActiveTab('pos');
                } else {
                  showToast('Đang chuyển hướng sang quầy bán hàng POS...');
                }
              }}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl transition shadow-violet-600/20 cursor-pointer active:scale-95"
            >
              Quay lại Bán hàng tại quầy
            </button>

            <button
              type="button"
              onClick={() => setSelectedOrderDetail(null)}
              className="px-4 py-2 bg-white hover:bg-violet-50 text-violet-700 border border-violet-200 font-bold text-xs rounded-xl transition shadow-2xs cursor-pointer flex items-center space-x-1.5 active:scale-95"
            >
              <span>←</span>
              <span>Quay Lại Danh Sách</span>
            </button>
          </div>
        </div>

        {/* ── HÀNG 1: TRẠNG THÁI ĐƠN HÀNG (TRÁI) & TỔNG KẾT THANH TOÁN (PHẢI) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Card 1: Trạng Thái Đơn Hàng (col-span-8) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 flex flex-col justify-between relative overflow-hidden">
            {/* Header Card */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm">
                <svg className="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>Trạng Thái Đơn Hàng</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                isCancelled
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : 'bg-emerald-50 text-emerald-600 border-emerald-100'
              }`}>
                {selectedOrderDetail.statusText || STATUS_LABEL_MAP[currentStatus] || currentStatus}
              </span>
            </div>

            {/* Stepper Timeline Tiến Trình Đơn Hàng Online */}
            <div className="py-10 px-4 sm:px-12">
              <div className="relative flex items-center justify-between max-w-xl mx-auto">
                {/* Đường nối giữa các bước */}
                <div className="absolute top-1/2 left-12 right-12 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />

                {/* Điểm 1: Chờ Xác Nhận */}
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-base transition ring-4 ${
                    isPending
                      ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25 ring-violet-50'
                      : isCancelled
                      ? 'bg-slate-300 text-white ring-slate-100'
                      : 'bg-emerald-500 text-white ring-emerald-50'
                  }`}>
                    {isPending ? (
                      <span className="text-lg">⏳</span>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className={`font-bold text-xs mt-2.5 ${isPending ? 'text-violet-700' : 'text-slate-800'}`}>
                    Chờ Xác Nhận
                  </span>
                  <div className="text-[10px] text-slate-400 mt-0.5 leading-tight font-mono">
                    <div>{selectedOrderDetail.time || '17:24:41'}</div>
                    <div>{selectedOrderDetail.createdAt || '16/08/2026'}</div>
                    <div className="text-slate-400 font-sans">Chưa cập nhật</div>
                  </div>
                </div>

                {/* Điểm 2: Đã Xác Nhận */}
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-base transition ring-4 ${
                    isConfirmed
                      ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25 ring-violet-50'
                      : isPicking || isShipping || isCompleted
                      ? 'bg-emerald-500 text-white ring-emerald-50'
                      : 'bg-white border-2 border-violet-500 text-violet-600 ring-violet-50/50'
                  }`}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <span className={`font-bold text-xs mt-2.5 ${isConfirmed ? 'text-violet-700' : 'text-slate-800'}`}>
                    Đã Xác Nhận
                  </span>
                  <div className="text-[10px] text-slate-400 mt-0.5 leading-tight font-mono">
                    {isConfirmed || isPicking || isShipping || isCompleted ? (
                      <div>{selectedOrderDetail.lastUpdated?.split(' ')[0] || '17:25:38'}</div>
                    ) : (
                      <div>Chờ xác nhận</div>
                    )}
                  </div>
                </div>

                {/* Nếu trạng thái tiếp theo là Đang giao hoặc Hoàn thành */}
                {(isPicking || isShipping || isCompleted) && (
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-base transition ring-4 ${
                      isCompleted ? 'bg-emerald-500 text-white ring-emerald-50' : 'bg-violet-600 text-white ring-violet-50'
                    }`}>
                      {isCompleted ? '✓' : '🚚'}
                    </div>
                    <span className="font-bold text-xs mt-2.5 text-slate-800">
                      {isCompleted ? 'Hoàn Thành' : 'Đang Giao'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 2 Nút: Hủy Đơn Hàng & Lịch Sử Thao Tác */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowCancelOrderModal(true)}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl flex items-center space-x-1.5 transition active:scale-95 shadow-2xs cursor-pointer"
              >
                <span>🚫</span>
                <span>Hủy Đơn Hàng</span>
              </button>

              <button
                type="button"
                onClick={() => setShowHistoryModal(true)}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 transition active:scale-95 shadow-violet-600/25 cursor-pointer"
              >
                <span>🕒</span>
                <span>Lịch Sử Thao Tác</span>
              </button>
            </div>
          </div>

          {/* Card 2: Tổng Kết Thanh Toán (col-span-4) (Khớp 100% Ảnh 1) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm border-b border-slate-100 pb-3">
                <svg className="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
                <span>Tổng Kết Thanh Toán</span>
              </div>

              <div className="space-y-3.5 text-xs">
                {/* Tổng Tiền Hàng */}
                <div className="flex justify-between items-center text-slate-600">
                  <span className="font-medium">Tổng Tiền Hàng</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {Number(selectedOrderDetail.subtotal || 6064000).toLocaleString('vi-VN')} đ
                  </span>
                </div>

                {/* Phiếu Giảm Giá */}
                <div className="flex justify-between items-center text-slate-600">
                  <span className="font-medium flex items-center space-x-1.5">
                    <span>Phiếu Giảm Giá</span>
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded text-[11px] border border-slate-200">
                      {selectedOrderDetail.voucherCode || 'VCH4TJWFW'}
                    </span>
                  </span>
                  <span className="font-bold text-emerald-600 text-xs font-mono">
                    {selectedOrderDetail.voucherDiscountPercent || 60}% (- {Number(selectedOrderDetail.voucherDiscountAmount || 1500000).toLocaleString('vi-VN')} đ)
                  </span>
                </div>

                {/* Phí Vận Chuyển với Logo GHN */}
                <div className="flex justify-between items-center text-slate-600">
                  <span className="font-medium flex items-center space-x-1.5">
                    <span>Phí Vận Chuyển</span>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-black bg-orange-500 text-white italic tracking-wider">
                      GHN
                    </span>
                  </span>
                  <span className="font-bold text-slate-900 font-mono">
                    + {Number(selectedOrderDetail.shippingFee || 16500).toLocaleString('vi-VN')} đ
                  </span>
                </div>

                {/* Divider & Tổng Tiền chữ đỏ đậm */}
                <div className="pt-4 border-t border-slate-100 flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-sm">Tổng Tiền</span>
                  <span className="font-black text-2xl text-violet-700 tracking-tight font-mono">
                    {Number(selectedOrderDetail.total || 4580500).toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400">
              <span>Đơn vị giao: <b className="text-slate-700">Giao Hàng Nhanh (GHN)</b></span>
              <span>Mã tra cứu: <b className="text-slate-700 font-mono">GHN9821374</b></span>
            </div>
          </div>
        </div>

        {/* ── HÀNG 2: THÔNG TIN KHÁCH HÀNG (TRÁI) - THÔNG TIN GIAO HÀNG (GIỮA) - LỊCH SỬ THANH TOÁN (PHẢI) ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Cột 1: Thông Tin Khách Hàng (Ảnh 1) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm border-b border-slate-100 pb-3">
              <svg className="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Thông Tin Khách Hàng</span>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Tên Khách Hàng</span>
                <span className="font-bold text-slate-900">{selectedOrderDetail.customer || 'Trần Vũ Tùng Anh'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Số Điện Thoại</span>
                <span className="font-medium text-slate-800 font-mono">{selectedOrderDetail.phone || '0383854485'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Email</span>
                <span className="font-medium text-slate-900">{selectedOrderDetail.email || 'tunganht26@gmail.com'}</span>
              </div>
            </div>
          </div>

          {/* Cột 2: Thông Tin Giao Hàng (Ảnh 1) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm border-b border-slate-100 pb-3">
              <svg className="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Thông Tin Giao Hàng</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-start">
                <span className="text-slate-400 whitespace-nowrap mr-2">Địa Chỉ</span>
                <span className="font-medium text-slate-800 text-right">
                  {selectedOrderDetail.address || 'Chung cư Sông Hồng, Phường Đống Đa, Thành phố Hà Nội'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Loại Đơn</span>
                <span className="font-bold text-slate-900">{selectedOrderDetail.orderType || 'Trực tuyến'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Ghi Chú</span>
                <span className="font-medium text-slate-800">{selectedOrderDetail.note || '-'}</span>
              </div>
            </div>
          </div>

          {/* Cột 3: Lịch Sử Thanh Toán & Nút Chỉnh Sửa Đơn Hàng (Ảnh 1) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm border-b border-slate-100 pb-3">
                <svg className="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Lịch Sử Thanh Toán</span>
              </div>

              {/* Thông tin thanh toán COD */}
              <div className="space-y-1.5 pt-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">
                    {selectedOrderDetail.payment || 'COD'}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                    {selectedOrderDetail.paymentStatus || 'Chờ thanh toán'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  {selectedOrderDetail.paymentNote || 'Thanh toán COD'}
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {selectedOrderDetail.paymentTime || `${selectedOrderDetail.time || '17:24:41'} ${selectedOrderDetail.createdAt || '16/08/2026'}`}
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-500">
                    {selectedOrderDetail.paymentSubnote || 'Chờ thanh toán khi nhận hàng'}
                  </span>
                  <span className="font-bold text-slate-900 text-xs font-mono">
                    {Number(selectedOrderDetail.paymentAmount || selectedOrderDetail.total || 4595000).toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>
            </div>

            {/* Nút Chỉnh Sửa Đơn Hàng màu đỏ viền (Ảnh 1) */}
            <button
              type="button"
              onClick={handleOpenEditModal}
              className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition active:scale-95 cursor-pointer shadow-violet-600/25"
            >
              <span>✏️</span>
              <span>Chỉnh Sửa Đơn Hàng</span>
            </button>
          </div>
        </div>

        {/* ── HÀNG 3: DANH SÁCH SẢN PHẨM (BẢNG 10 CỘT VỚI BỘ LỌC) ── */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-5">
          {/* Header Bảng Sản Phẩm */}
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
            <svg className="w-4 h-4 text-violet-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span>Danh Sách Sản Phẩm ({selectedOrderDetail.items?.length || 0})</span>
          </div>

          {/* Thanh Công Cụ Bộ Lọc: Tìm kiếm, Loại SP, Sắp xếp, Khoảng giá */}
          <div className="space-y-4 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* 1. Tìm kiếm */}
              <div className="space-y-1">
                <label className="block text-[11px] font-medium text-slate-500">Tìm kiếm</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={detailProductSearch}
                    onChange={(e) => setDetailProductSearch(e.target.value)}
                    placeholder="Tên sản phẩm, màu, size..."
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-200 transition"
                  />
                </div>
              </div>

              {/* 2. Loại sản phẩm */}
              <div className="space-y-1">
                <label className="block text-[11px] font-medium text-slate-500">Loại sản phẩm</label>
                <select
                  value={detailCategoryFilter}
                  onChange={(e) => setDetailCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-200 transition cursor-pointer"
                >
                  <option value="all">Tất cả loại</option>
                  <option value="Sneakers">Sneakers</option>
                  <option value="Phụ kiện">Phụ kiện</option>
                </select>
              </div>

              {/* 3. Sắp xếp */}
              <div className="space-y-1">
                <label className="block text-[11px] font-medium text-slate-500">Sắp xếp</label>
                <select
                  value={detailSort}
                  onChange={(e) => setDetailSort(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-200 transition cursor-pointer"
                >
                  <option value="default">Mặc định</option>
                  <option value="priceAsc">Giá tăng dần</option>
                  <option value="priceDesc">Giá giảm dần</option>
                </select>
              </div>
            </div>

            {/* Thanh trượt khoảng giá */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[11px] font-medium text-slate-500">Khoảng giá</span>
                <span className="font-bold text-violet-700 text-[11px]">
                  0 - {Number(detailPriceRange).toLocaleString('vi-VN')} (Max: 2.500.000)
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="2500000"
                step="50000"
                value={detailPriceRange}
                onChange={(e) => setDetailPriceRange(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
              />
            </div>
          </div>

          {/* Bảng Sản Phẩm 10 Cột */}
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px]">
                  <th className="py-3 px-3 text-center w-12">STT</th>
                  <th className="py-3 px-4 font-bold">Mã SPCT</th>
                  <th className="py-3 px-3 text-center">Ảnh</th>
                  <th className="py-3 px-4 font-bold">Sản Phẩm</th>
                  <th className="py-3 px-4 font-bold">Màu Sắc</th>
                  <th className="py-3 px-4 text-center font-bold">Size</th>
                  <th className="py-3 px-4 text-center font-bold">Số Lượng</th>
                  <th className="py-3 px-4 font-bold">Thời Gian</th>
                  <th className="py-3 px-4 text-center font-bold">Giảm Giá</th>
                  <th className="py-3 px-4 text-right font-bold">Đơn Giá</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {detailFilteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-10 text-center text-slate-400">
                      Không tìm thấy sản phẩm nào phù hợp với bộ lọc tìm kiếm.
                    </td>
                  </tr>
                ) : (
                  detailFilteredItems.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-violet-50/30 transition">
                      {/* STT */}
                      <td className="py-3.5 px-3 text-center text-slate-500 font-medium">
                        {idx + 1}
                      </td>

                      {/* Mã SPCT */}
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                        {item.sku}
                      </td>

                      {/* Ảnh */}
                      <td className="py-3.5 px-3 text-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200 mx-auto shadow-2xs"
                        />
                      </td>

                      {/* Sản Phẩm */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{item.name}</div>
                        <div className="text-[10px] text-slate-400">{item.category}</div>
                      </td>

                      {/* Màu Sắc */}
                      <td className="py-3.5 px-4 font-medium text-slate-700">
                        {item.color}
                      </td>

                      {/* Size */}
                      <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                        {item.size}
                      </td>

                      {/* Số Lượng */}
                      <td className="py-3.5 px-4 text-center font-bold text-slate-900">
                        {item.qty}
                      </td>

                      {/* Thời Gian */}
                      <td className="py-3.5 px-4 text-slate-500 text-[11px] leading-tight font-mono">
                        <div>{item.time?.split(' ')[0] || '17:24:41'}</div>
                        <div className="text-slate-400">{item.time?.split(' ')[1] || '16/08/2026'}</div>
                      </td>

                      {/* Giảm Giá */}
                      <td className="py-3.5 px-4 text-center text-slate-400">
                        {item.discount || '-'}
                      </td>

                      {/* Đơn Giá */}
                      <td className="py-3.5 px-4 text-right font-black text-violet-700 text-sm font-mono">
                        {Number(item.price).toLocaleString('vi-VN')} đ
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── NÚT TRÒN NỔI GÓC DƯỚI PHẢI (ẢNH 1) ── */}
        <div className="fixed bottom-6 right-6 z-40">
          <button
            type="button"
            onClick={() => {
              if (typeof setActiveTab === 'function') {
                setActiveTab('pos');
              } else {
                showToast('Chuyển tới giao diện bán hàng tại quầy');
              }
            }}
            className="w-12 h-12 rounded-full bg-violet-600 hover:bg-violet-700 text-white shadow-xl flex items-center justify-center text-xl transition transform hover:scale-110 active:scale-95 cursor-pointer shadow-violet-600/30"
            title="Quay lại bán hàng tại quầy"
          >
            <span>🛍️</span>
          </button>
        </div>

        {/* ── MODAL 1: LỊCH SỬ THAO TÁC (CHUẨN 100% THEO ẢNH 2) ── */}
        {showHistoryModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150">
              {/* Header Modal */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-2xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center font-bold">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-base text-slate-900">Lịch sử thao tác</h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-50 text-violet-700 border border-violet-200">
                        {(selectedOrderDetail.operationsHistory || []).length} hoạt động
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">Theo dõi người thực hiện và nội dung thay đổi trên hóa đơn</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowHistoryModal(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Nội dung dòng thời gian (Khớp 100% Ảnh 2) */}
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 pt-2">
                {(selectedOrderDetail.operationsHistory || []).map((op, idx) => (
                  <div key={op.id || idx} className="relative pl-6 pb-2 border-l-2 border-emerald-400 ml-3 space-y-2">
                    {/* Chấm tròn xanh lá */}
                    <span className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />

                    {/* Dòng người thực hiện + Nhãn + Thời gian */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                          👤
                        </div>
                        <span className="font-bold text-slate-900">
                          {op.actorType === 'customer' ? 'Khách hàng' : 'Quản trị viên'} · {op.actor || selectedOrderDetail.customer}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                          {op.role || 'KHÁCH HÀNG'}
                        </span>
                      </div>
                      <span className="text-slate-400 font-mono text-[11px] flex items-center space-x-1">
                        <span>🕒</span>
                        <span>{op.time}</span>
                      </span>
                    </div>

                    {/* Tiêu đề hành động */}
                    <div className="font-bold text-xs text-slate-800">{op.action}</div>

                    {/* Khung xám chi tiết nội dung thay đổi (Khớp 100% Ảnh 2) */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs text-slate-600 space-y-1 font-sans">
                      {Array.isArray(op.details) ? (
                        op.details.map((line, lIdx) => (
                          <div key={lIdx} className={lIdx === 0 ? "font-medium text-slate-700" : "text-slate-600 pl-1"}>
                            {line}
                          </div>
                        ))
                      ) : (
                        <div>{op.note || op.action}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowHistoryModal(false)}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── MODAL 2: CẬP NHẬT THÔNG TIN ĐƠN HÀNG (CHUẨN 100% THEO ẢNH 3, 4, 5) ── */}
        {showEditOrderModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-150">
              {/* Header Modal */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-base text-slate-900">Cập nhật thông tin đơn hàng</h3>
                <button
                  type="button"
                  onClick={() => setShowEditOrderModal(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* 2 Tabs: Thông tin đơn hàng & Thông tin khách hàng */}
              <div className="flex items-center space-x-6 border-b border-slate-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setEditModalTab('order')}
                  className={`pb-2.5 transition border-b-2 ${
                    editModalTab === 'order'
                      ? 'border-violet-600 text-violet-700'
                      : 'border-transparent text-slate-500 hover:text-violet-700'
                  }`}
                >
                  Thông tin đơn hàng
                </button>
                <button
                  type="button"
                  onClick={() => setEditModalTab('customer')}
                  className={`pb-2.5 transition border-b-2 ${
                    editModalTab === 'customer'
                      ? 'border-violet-600 text-violet-700'
                      : 'border-transparent text-slate-500 hover:text-violet-700'
                  }`}
                >
                  Thông tin khách hàng
                </button>
              </div>

              {/* Tab 1: Thông tin đơn hàng (Ảnh 3, 4, 5) */}
              {editModalTab === 'order' && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Mã đơn hàng</label>
                      <input
                        type="text"
                        value={selectedOrderDetail.code}
                        disabled
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-bold select-none cursor-not-allowed font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Ngày tạo</label>
                      <input
                        type="text"
                        value={`${selectedOrderDetail.time || '17:24:41'} ${selectedOrderDetail.createdAt || '16/08/2026'}`}
                        disabled
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium select-none cursor-not-allowed font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">Trạng thái</label>
                    <div className="relative">
                      <select
                        value={editOrderStatus}
                        onChange={(e) => setEditOrderStatus(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-slate-200 focus:border-violet-500 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-200 cursor-pointer appearance-none"
                      >
                        {getStatusOptions(selectedOrderDetail.status).map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Thông tin khách hàng */}
              {editModalTab === 'customer' && (
                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">Tên khách hàng</label>
                    <input
                      type="text"
                      value={editCustomerName}
                      onChange={(e) => setEditCustomerName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Số điện thoại</label>
                      <input
                        type="text"
                        value={editCustomerPhone}
                        onChange={(e) => setEditCustomerPhone(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-violet-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Email</label>
                      <input
                        type="email"
                        value={editCustomerEmail}
                        onChange={(e) => setEditCustomerEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">Địa chỉ nhận hàng</label>
                    <textarea
                      rows={2}
                      value={editCustomerAddress}
                      onChange={(e) => setEditCustomerAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">Ghi chú đơn hàng</label>
                    <input
                      type="text"
                      value={editCustomerNote}
                      onChange={(e) => setEditCustomerNote(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                </div>
              )}

              {/* Nút Hủy & Lưu (Ảnh 3, 4, 5) */}
              <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditOrderModal(false)}
                  className="px-5 py-2 bg-slate-500 hover:bg-slate-600 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleSaveOrderModal}
                  className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-violet-600/25"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── MODAL 3: XÁC NHẬN HỦY ĐƠN HÀNG ── */}
        {showCancelOrderModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150">
              <div className="flex items-center space-x-3 text-rose-600">
                <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-xl font-bold">
                  ⚠️
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Xác nhận hủy đơn hàng</h3>
                  <p className="text-xs text-slate-500">Mã đơn: #{selectedOrderDetail.code}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <label className="block font-medium text-slate-700">Lý do hủy đơn:</label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer"
                >
                  <option value="Khách yêu cầu hủy">Khách yêu cầu hủy</option>
                  <option value="Hết hàng tồn kho">Hết hàng tồn kho</option>
                  <option value="Không liên lạc được khách hàng">Không liên lạc được khách hàng</option>
                  <option value="Sai thông tin giao hàng">Sai thông tin giao hàng</option>
                  <option value="Khách đổi ý muốn đặt lại">Khách đổi ý muốn đặt lại</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCancelOrderModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancelOrder}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-xs"
                >
                  Xác nhận hủy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── MODAL 4: IN HÓA ĐƠN BIÊN LAI (PRINT RECEIPT) ── */}
        {invoiceToPrint && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150">
              <div className="bg-white p-5 border border-dashed border-slate-300 rounded-xl font-mono text-xs text-slate-800 space-y-3">
                <div className="text-center space-y-1 border-b border-dashed border-slate-200 pb-3">
                  <div className="font-black text-sm tracking-widest text-violet-700">VIBEFLOW SNEAKERS</div>
                  <div className="text-[10px] text-slate-500">123 Đường Cầu Giấy, Q. Cầu Giấy, Hà Nội</div>
                  <div className="text-[10px] text-slate-500">Hotline: 1900 6868 - vibeflow.vn</div>
                  <div className="text-xs font-black uppercase text-violet-700 pt-1">HÓA ĐƠN GIAO HÀNG</div>
                </div>

                <div className="space-y-1 text-[11px] text-slate-600 border-b border-dashed border-slate-200 pb-2">
                  <div className="flex justify-between">
                    <span>Mã HĐ:</span>
                    <b className="text-slate-900">{invoiceToPrint.code}</b>
                  </div>
                  <div className="flex justify-between">
                    <span>Ngày tạo:</span>
                    <span>{invoiceToPrint.createdAt} {invoiceToPrint.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Khách hàng:</span>
                    <span className="font-bold text-slate-900">{invoiceToPrint.customer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Số điện thoại:</span>
                    <span>{invoiceToPrint.phone || '0383854485'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Giao tới:</span>
                    <span className="text-right truncate max-w-[170px]">{invoiceToPrint.address}</span>
                  </div>
                </div>

                <div className="space-y-2 border-b border-dashed border-slate-200 pb-2">
                  {(invoiceToPrint.items || []).map((it, i) => (
                    <div key={i} className="text-[11px]">
                      <div className="font-bold text-slate-900">{it.name}</div>
                      <div className="flex justify-between text-slate-500 text-[10px]">
                        <span>{it.qty} x {it.price.toLocaleString('vi-VN')} đ (Sz {it.size} - {it.color})</span>
                        <span className="font-bold text-slate-800">{(it.qty * it.price).toLocaleString('vi-VN')} đ</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-1 text-[11px] border-b border-dashed border-slate-200 pb-2">
                  <div className="flex justify-between">
                    <span>Tổng tiền hàng:</span>
                    <span>{Number(invoiceToPrint.subtotal || invoiceToPrint.total).toLocaleString('vi-VN')} đ</span>
                  </div>
                  {invoiceToPrint.voucherCode && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Phiếu giảm giá ({invoiceToPrint.voucherCode}):</span>
                      <span>-{Number(invoiceToPrint.voucherDiscountAmount || 0).toLocaleString('vi-VN')} đ</span>
                    </div>
                  )}
                  {invoiceToPrint.shippingFee > 0 && (
                    <div className="flex justify-between text-slate-700">
                      <span>Phí vận chuyển (GHN):</span>
                      <span>+{Number(invoiceToPrint.shippingFee).toLocaleString('vi-VN')} đ</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-black text-slate-900 pt-1">
                    <span>TỔNG CỘNG:</span>
                    <span className="text-violet-700">{Number(invoiceToPrint.total).toLocaleString('vi-VN')} đ</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Thanh toán:</span>
                    <span>{invoiceToPrint.payment}</span>
                  </div>
                </div>

                <div className="text-center text-[10px] text-slate-400 pt-1 space-y-0.5">
                  <div>Cảm ơn Quý khách & Hẹn gặp lại!</div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition cursor-pointer shadow-violet-600/25"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  <span>Xác nhận In</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInvoiceToPrint(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
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

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER: DANH SÁCH TỔNG QUAN HÓA ĐƠN
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5 max-w-[1600px] mx-auto pb-16 animate-in fade-in duration-150">
      {/* ── TOAST THÔNG BÁO TINH TẾ ── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 px-4 py-3 bg-slate-900/95 text-white text-xs font-semibold rounded-xl shadow-xl backdrop-blur-md border border-slate-800 animate-in slide-in-from-bottom-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse"></span>
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* ── TIÊU ĐỀ TRANG ĐỒNG BỘ TONE TÍM VIBEFLOW ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-medium text-slate-500 mb-1">
            <span>Bán Hàng & Doanh Thu</span>
            <span>/</span>
            <span className="text-violet-600 font-bold">Quản Lý Hóa Đơn</span>
          </div>
          <h2 className="text-xl font-black uppercase text-slate-900 flex items-center space-x-2.5">
            <span>Quản Lý Hóa Đơn</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">Theo dõi, kiểm duyệt và quản lý toàn bộ hóa đơn bán lẻ đa kênh thời gian thực.</p>
        </div>

        {/* Quick summary metrics */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-violet-600"></span>
            <span className="text-slate-500 font-medium">Tổng hóa đơn:</span>
            <span className="font-extrabold text-slate-900">{invoicesList.length}</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-violet-50/70 border border-violet-200 text-violet-700 shadow-2xs flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-violet-600 animate-pulse"></span>
            <span className="font-medium">Chờ xác nhận:</span>
            <span className="font-black text-violet-700">{countsByStatus.pending || 0}</span>
          </div>
        </div>
      </div>

      {/* ── KHUNG 1: BỘ LỌC ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center font-bold shadow-2xs">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
            </div>
            <div>
              <span className="font-bold text-sm text-slate-900 tracking-tight block leading-tight">Bộ Lọc Hóa Đơn</span>
              <span className="text-[11px] text-slate-400">Tìm kiếm hóa đơn theo mã, loại đơn và khoảng ngày</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-medium hidden sm:block">
            Tự động lọc tức thì theo dữ liệu
          </div>
        </div>

        {/* 4 Ô Input lọc */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {/* 1. Mã hóa đơn */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Mã hóa đơn</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                value={searchCode}
                onChange={(e) => {
                  setSearchCode(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Nhập mã đơn, tên, sđt..."
                className="w-full pl-10 pr-8 py-2.5 bg-slate-50/70 hover:bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 focus:bg-white transition"
              />
              {searchCode && (
                <button
                  type="button"
                  onClick={() => setSearchCode('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* 2. Loại đơn */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Loại đơn</label>
            <div className="relative">
              <select
                value={orderTypeFilter}
                onChange={(e) => {
                  setOrderTypeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50/70 hover:bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 focus:bg-white transition cursor-pointer appearance-none pr-8 font-medium"
              >
                <option value="all">Tất cả loại đơn</option>
                <option value="Online">🌐 Đơn Online (Giao hàng)</option>
                <option value="Cửa hàng">🏪 Mua tại cửa hàng / quầy</option>
              </select>
              <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 text-xs">
                ▼
              </span>
            </div>
          </div>

          {/* 3. Từ ngày */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Từ ngày</label>
            <div className="relative">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50/70 hover:bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 focus:bg-white transition cursor-pointer font-medium"
              />
            </div>
          </div>

          {/* 4. Đến ngày */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Đến ngày</label>
            <div className="relative">
              <input
                type="date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50/70 hover:bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 focus:bg-white transition cursor-pointer font-medium"
              />
            </div>
          </div>
        </div>

        {/* Hàng dưới: Số lượng kết quả & 3 Nút hành động */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3.5 border-t border-slate-100">
          <div className="text-xs text-slate-600 font-medium flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-violet-600"></span>
            <span>
              Tìm thấy <b className="text-violet-700 font-black text-sm px-0.5">{filteredInvoices.length}</b> kết quả phù hợp
            </span>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              type="button"
              onClick={() => showToast(`Đang kết xuất ${filteredInvoices.length} hóa đơn sang tệp Microsoft Excel (.xlsx)...`)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 transition active:scale-95 cursor-pointer shadow-xs"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Xuất Excel</span>
            </button>

            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 transition active:scale-95 cursor-pointer shadow-xs"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Đặt lại bộ lọc</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCurrentPage(1);
                showToast(`Tìm kiếm: ${filteredInvoices.length} kết quả`);
              }}
              className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl flex items-center space-x-2 transition active:scale-95 cursor-pointer shadow-violet"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Tìm kiếm</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── KHUNG 2: DANH SÁCH HÓA ĐƠN ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="font-black text-sm text-slate-900 tracking-tight flex items-center space-x-2">
            <span>Danh Sách Hóa Đơn</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {filteredInvoices.length} đơn
            </span>
          </div>
        </div>

        {/* Thanh Tabs phân loại trạng thái */}
        <div className="flex items-center space-x-6 overflow-x-auto border-b border-slate-200 text-xs font-bold pb-0 scrollbar-none">
          {STATUS_TABS.map((tab) => {
            const isActive = activeTabStatus === tab.id;
            const count = countsByStatus[tab.id] || 0;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTabStatus(tab.id);
                  if (setOrderFilter) setOrderFilter(tab.id);
                  setCurrentPage(1);
                }}
                className={`pb-3 whitespace-nowrap transition cursor-pointer relative flex items-center space-x-1.5 ${
                  isActive ? 'text-violet-600 font-black' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive
                        ? 'bg-violet-100 text-violet-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {count}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Bảng dữ liệu hóa đơn (10 cột) */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-3 text-center w-12 rounded-l-xl">STT</th>
                <th className="py-3 px-4 font-bold">MÃ</th>
                <th className="py-3 px-4 font-bold">KHÁCH HÀNG</th>
                <th className="py-3 px-4 font-bold">SĐT</th>
                <th className="py-3 px-4 font-bold">NHÂN VIÊN</th>
                <th className="py-3 px-4 font-bold">NGÀY TẠO</th>
                <th className="py-3 px-4 font-bold">TỔNG TIỀN</th>
                <th className="py-3 px-4 font-bold">LOẠI ĐƠN</th>
                <th className="py-3 px-4 text-center font-bold">TRẠNG THÁI</th>
                <th className="py-3 px-4 text-center font-bold w-28 rounded-r-xl">HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedInvoices.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-14 text-center text-slate-400 space-y-2">
                    <div className="w-12 h-12 mx-auto rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center text-xl shadow-2xs">
                      📄
                    </div>
                    <div className="font-bold text-slate-800 text-sm">Không tìm thấy hóa đơn nào</div>
                    <p className="text-xs text-slate-400">
                      Vui lòng thử chọn tab khác hoặc ấn nút "Đặt lại bộ lọc" ở phía trên.
                    </p>
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="mt-2 inline-flex items-center space-x-1 px-4 py-2 rounded-xl bg-violet-50 text-violet-700 font-bold text-xs hover:bg-violet-100 transition cursor-pointer border border-violet-200"
                    >
                      <span>Khôi phục danh sách</span>
                    </button>
                  </td>
                </tr>
              ) : (
                paginatedInvoices.map((inv, idx) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-violet-50/30 transition group cursor-pointer"
                    onClick={() => setSelectedOrderDetail(inv)}
                  >
                    {/* STT */}
                    <td className="py-3.5 px-3 text-center">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold text-[11px] group-hover:bg-violet-100 group-hover:text-violet-700 transition">
                        {startIndex + idx + 1}
                      </span>
                    </td>

                    {/* MÃ */}
                    <td className="py-3.5 px-4 font-mono font-bold text-violet-700">
                      <div className="flex items-center space-x-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-violet-50/70 border border-violet-200/60 font-mono">
                          {inv.code}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleCopyCode(inv.code, e)}
                          title="Sao chép mã đơn"
                          className="text-slate-400 hover:text-violet-700 transition p-0.5 rounded cursor-pointer"
                        >
                          {copiedCode === inv.code ? (
                            <span className="text-[10px] text-emerald-600 font-sans font-bold">✓</span>
                          ) : (
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>

                    {/* KHÁCH HÀNG */}
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-full bg-violet-100 text-violet-700 border border-violet-200 flex items-center justify-center font-bold text-[11px] shrink-0">
                          {getInitials(inv.customer)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="font-bold text-slate-900">{inv.customer}</span>
                            {inv.isVip && (
                              <span className="px-1.5 py-0.2 rounded bg-violet-600 text-white text-[9px] font-black tracking-wider">
                                VIP
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* SĐT */}
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      <span className="hover:text-violet-600 transition">{inv.phone || '-'}</span>
                    </td>

                    {/* NHÂN VIÊN */}
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      <span className="inline-flex items-center space-x-1">
                        <span className="text-slate-400 text-xs">👤</span>
                        <span>{inv.employee}</span>
                      </span>
                    </td>

                    {/* NGÀY TẠO */}
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      <span className="inline-flex items-center space-x-1">
                        <span className="text-slate-400 text-xs">📅</span>
                        <span>{inv.createdAt}</span>
                      </span>
                    </td>

                    {/* TỔNG TIỀN */}
                    <td className="py-3.5 px-4 font-black text-violet-700 font-mono">
                      {Number(inv.total).toLocaleString('vi-VN')} đ
                    </td>

                    {/* LOẠI ĐƠN */}
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {inv.orderType === 'Online' ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-violet-50 text-violet-700 border border-violet-200/70">
                          <span>🌐</span>
                          <span>Online</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                          <span>🏪</span>
                          <span>Cửa hàng</span>
                        </span>
                      )}
                    </td>

                    {/* TRẠNG THÁI */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full text-[11px] font-bold bg-violet-600 text-white shadow-violet">
                        {inv.status === 'pending' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                        )}
                        <span>{inv.statusText}</span>
                      </span>
                    </td>

                    {/* HÀNH ĐỘNG */}
                    <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center space-x-1.5">
                        {/* Nút Xem chi tiết */}
                        <button
                          type="button"
                          onClick={() => setSelectedOrderDetail(inv)}
                          className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-600 hover:text-white transition flex items-center justify-center cursor-pointer shadow-2xs group/btn"
                          title="Xem chi tiết hóa đơn toàn diện"
                        >
                          <svg className="w-4 h-4 transition group-hover/btn:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>

                        {/* Nút In hóa đơn */}
                        <button
                          type="button"
                          onClick={() => setInvoiceToPrint(inv)}
                          className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition flex items-center justify-center cursor-pointer shadow-2xs group/btn"
                          title="In hóa đơn bán hàng"
                        >
                          <svg className="w-4 h-4 transition group-hover/btn:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Thanh Phân Trang */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-center space-x-2">
            <span>Hiển thị</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-violet-500 cursor-pointer shadow-2xs"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <span>kết quả / trang</span>
          </div>

          <div className="flex items-center space-x-1 font-semibold">
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              disabled={safePage === 1}
              className="w-7 h-7 rounded-lg border border-slate-200 text-slate-500 hover:border-violet-300 hover:text-violet-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold"
              title="Trang đầu"
            >
              «
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={safePage === 1}
              className="w-7 h-7 rounded-lg border border-slate-200 text-slate-500 hover:border-violet-300 hover:text-violet-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold"
              title="Trang trước"
            >
              ‹
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setCurrentPage(num)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                  safePage === num
                    ? 'bg-violet-600 text-white shadow-violet'
                    : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {num}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={safePage === totalPages}
              className="w-7 h-7 rounded-lg border border-slate-200 text-slate-500 hover:border-violet-300 hover:text-violet-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold"
              title="Trang tiếp"
            >
              ›
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(totalPages)}
              disabled={safePage === totalPages}
              className="w-7 h-7 rounded-lg border border-slate-200 text-slate-500 hover:border-violet-300 hover:text-violet-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold"
              title="Trang cuối"
            >
              »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
