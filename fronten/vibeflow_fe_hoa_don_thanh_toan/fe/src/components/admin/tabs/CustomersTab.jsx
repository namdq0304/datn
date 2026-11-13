import React, { useState, useMemo, useRef } from 'react';

// Danh sách Tỉnh / Thành phố mẫu phục vụ chọn nhanh
const PROVINCES_DATA = [
  {
    name: 'Tỉnh Phú Thọ',
    wards: ['Phường Vĩnh Yên', 'Phường Tiên Cát', 'Phường Gia Cẩm', 'Xã Trưng Vương', 'Phường Nông Trang'],
  },
  {
    name: 'Thành phố Hà Nội',
    wards: ['Phường Cầu Giấy', 'Phường Dương Nội', 'Phường Dịch Vọng', 'Phường Mỹ Đình', 'Phường Hàng Bạc', 'Phường Quan Hoa', 'Phường Tràng Tiền'],
  },
  {
    name: 'Thành phố Hồ Chí Minh',
    wards: ['Phường Bến Nghé', 'Phường Đa Kao', 'Phường 1 (Quận 3)', 'Phường Tân Định', 'Phường Bến Thành'],
  },
  {
    name: 'Thành phố Đà Nẵng',
    wards: ['Phường Hải Châu 1', 'Phường Thạch Thang', 'Phường Hòa Thuận Đông'],
  },
  {
    name: 'Thành phố Hải Phòng',
    wards: ['Phường Hoàng Văn Thụ', 'Phường Minh Khai', 'Phường Lê Lợi'],
  },
];

export default function CustomersTab({
  customersList = [],
  setCustomersList = () => {},
}) {
  // Chế độ xem: 'list' (Danh sách) | 'detail' (Chi tiết khách hàng dạng form) | 'create' (Thêm mới khách hàng)
  const [viewMode, setViewMode] = useState('list');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Bộ lọc danh sách khách hàng (Ảnh 1)
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'locked'

  // Phân trang (Ảnh 1)
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Toast thông báo
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // State Modal Quản lý Địa Chỉ Giao Hàng (Ảnh 3)
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [customerForAddress, setCustomerForAddress] = useState(null);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    recipientName: '',
    phone: '',
    province: 'Thành phố Hà Nội',
    district: 'Phường Dương Nội',
    specificAddress: '',
    isDefault: false,
  });

  // State Modal Xem Chi Tiết Đơn Hàng từ bảng Lịch sử đơn hàng (Ảnh 4)
  const [selectedOrderSummary, setSelectedOrderSummary] = useState(null);

  // File input ref for avatar uploads
  const avatarInputRef = useRef(null);
  const detailAvatarInputRef = useRef(null);

  // State Form Thêm Khách Hàng Mới (Ảnh 2)
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    dob: '',
    recipientName: '',
    recipientPhone: '',
    province: '',
    ward: '',
    specificAddress: '',
    avatar: null,
  });

  // State Form Chi Tiết Khách Hàng (Dạng Form tương tự Thêm Khách Hàng & Chi Tiết Nhân Viên)
  const [detailForm, setDetailForm] = useState({
    name: '',
    email: '',
    phone: '',
    gender: 'Nam',
    dob: '',
    recipientName: '',
    recipientPhone: '',
    province: 'Thành phố Hà Nội',
    ward: '',
    specificAddress: '',
    avatar: null,
    status: true,
  });

  // Khởi tạo danh sách phường/xã tương ứng với Tỉnh được chọn ở Create Form
  const availableCreateWards = useMemo(() => {
    const p = PROVINCES_DATA.find((item) => item.name === createForm.province);
    return p ? p.wards : [];
  }, [createForm.province]);

  // Khởi tạo danh sách phường/xã tương ứng với Tỉnh được chọn ở Detail Form
  const availableDetailWards = useMemo(() => {
    const p = PROVINCES_DATA.find((item) => item.name === detailForm.province);
    return p ? p.wards : [];
  }, [detailForm.province]);

  // Khởi tạo danh sách phường/xã tương ứng với Tỉnh được chọn ở Modal Địa chỉ
  const availableAddressModalWards = useMemo(() => {
    const p = PROVINCES_DATA.find((item) => item.name === addressForm.province);
    return p ? p.wards : [];
  }, [addressForm.province]);

  // Lọc danh sách khách hàng theo ô tìm kiếm và trạng thái
  const filteredCustomers = useMemo(() => {
    return customersList.filter((c) => {
      // 1. Lọc theo trạng thái
      if (statusFilter === 'active' && !c.status) return false;
      if (statusFilter === 'locked' && c.status) return false;

      // 2. Lọc theo từ khóa (tên đăng nhập, họ tên, email, SĐT)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = c.name?.toLowerCase().includes(q);
        const matchEmail = c.email?.toLowerCase().includes(q);
        const matchPhone = c.phone?.toLowerCase().includes(q);
        const matchUsername = c.username?.toLowerCase().includes(q);
        const matchCode = c.code?.toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchPhone && !matchUsername && !matchCode) {
          return false;
        }
      }
      return true;
    });
  }, [customersList, statusFilter, searchQuery]);

  // Phân trang
  const totalPages = Math.ceil(filteredCustomers.length / pageSize) || 1;
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCustomers.slice(start, start + pageSize);
  }, [filteredCustomers, currentPage, pageSize]);

  // Xử lý bật/tắt khóa tài khoản
  const handleToggleStatus = (id) => {
    setCustomersList((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updated = !c.status;
          showToast(updated ? `Đã kích hoạt khách hàng ${c.name}` : `Đã tạm khóa khách hàng ${c.name}`);
          return { ...c, status: updated };
        }
        return c;
      })
    );

    // Cập nhật selectedCustomer nếu đang mở
    if (selectedCustomer && selectedCustomer.id === id) {
      setSelectedCustomer((prev) => ({ ...prev, status: !prev.status }));
      setDetailForm((prev) => ({ ...prev, status: !prev.status }));
    }
  };

  // Mở modal quản lý địa chỉ (Ảnh 3)
  const handleOpenAddressModal = (customer) => {
    setCustomerForAddress(customer);
    setIsAddingNewAddress(false);
    setEditingAddressId(null);
    setShowAddressModal(true);
  };

  // Mở màn hình Chi tiết khách hàng (Load dữ liệu vào Detail Form)
  const handleViewCustomerDetail = (customer) => {
    const defaultAddr =
      (customer.addresses || []).find((a) => a.isDefault) ||
      (customer.addresses || [])[0] ||
      {};

    const fullAddrParts = customer.address ? customer.address.split(', ') : [];
    const inferredSpecific = defaultAddr.specificAddress || (fullAddrParts.length > 2 ? fullAddrParts.slice(0, -2).join(', ') : customer.specificAddress || '');
    const inferredWard = defaultAddr.district || customer.district || (fullAddrParts.length >= 2 ? fullAddrParts[fullAddrParts.length - 2] : '');
    const inferredProv = defaultAddr.province || customer.province || (fullAddrParts.length >= 1 ? fullAddrParts[fullAddrParts.length - 1] : 'Thành phố Hà Nội');

    setDetailForm({
      name: customer.name || '',
      email: customer.email || '',
      phone: customer.phone || '',
      gender: customer.gender || 'Nam',
      dob: customer.dob || '',
      recipientName: defaultAddr.recipientName || customer.name || '',
      recipientPhone: defaultAddr.phone || customer.phone || '',
      province: inferredProv || 'Thành phố Hà Nội',
      ward: inferredWard || '',
      specificAddress: inferredSpecific || '',
      avatar: customer.avatar || null,
      status: customer.status ?? true,
    });

    setSelectedCustomer(customer);
    setViewMode('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Đổi avatar khi thêm mới
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setCreateForm((prev) => ({ ...prev, avatar: uploadEvent.target.result }));
        showToast('Đã tải ảnh đại diện thành công');
      };
      reader.readAsDataURL(file);
    }
  };

  // Đổi avatar khi chỉnh sửa chi tiết
  const handleDetailAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setDetailForm((prev) => ({ ...prev, avatar: uploadEvent.target.result }));
        showToast('Đã cập nhật ảnh đại diện mới');
      };
      reader.readAsDataURL(file);
    }
  };

  // Xử lý tạo khách hàng mới (Ảnh 2)
  const handleCreateCustomer = (e) => {
    e.preventDefault();

    if (!createForm.name.trim()) {
      showToast('Vui lòng nhập Họ và tên khách hàng');
      return;
    }
    if (!createForm.email.trim()) {
      showToast('Vui lòng nhập Email khách hàng');
      return;
    }

    const newId = Date.now();
    const newCode = `KH${String(customersList.length + 1).padStart(3, '0')}`;
    const initials = createForm.name
      .split(' ')
      .filter(Boolean)
      .slice(-2)
      .map((w) => w[0].toUpperCase())
      .join('');

    const fullDefaultAddress = [
      createForm.specificAddress,
      createForm.ward,
      createForm.province,
    ]
      .filter(Boolean)
      .join(', ');

    const newCustomer = {
      id: newId,
      code: newCode,
      name: createForm.name.trim(),
      username: createForm.email.split('@')[0],
      initials: initials || 'KH',
      email: createForm.email.trim(),
      phone: createForm.phone.trim() || createForm.recipientPhone.trim() || 'Chưa cập nhật',
      gender: createForm.gender || 'Nam',
      dob: createForm.dob || '2000-01-01',
      rank: 'Thành Viên Mới',
      points: 0,
      totalSpent: 0,
      ordersCount: 0,
      status: true,
      avatar: createForm.avatar,
      province: createForm.province,
      district: createForm.ward,
      specificAddress: createForm.specificAddress,
      address: fullDefaultAddress || 'Chưa thiết lập địa chỉ',
      addresses: fullDefaultAddress
        ? [
            {
              id: Date.now() + 1,
              recipientName: createForm.recipientName.trim() || createForm.name.trim(),
              phone: createForm.recipientPhone.trim() || createForm.phone.trim(),
              province: createForm.province,
              district: createForm.ward,
              specificAddress: createForm.specificAddress,
              address: fullDefaultAddress,
              isDefault: true,
            },
          ]
        : [],
      orders: [],
    };

    setCustomersList([newCustomer, ...customersList]);
    showToast(`Đã thêm thành công khách hàng: ${newCustomer.name}`);

    // Reset form & chuyển về danh sách
    setCreateForm({
      name: '',
      email: '',
      phone: '',
      gender: '',
      dob: '',
      recipientName: '',
      recipientPhone: '',
      province: '',
      ward: '',
      specificAddress: '',
      avatar: null,
    });
    setViewMode('list');
  };

  // Xử lý lưu cập nhật chi tiết khách hàng từ Form Chi Tiết
  const handleSaveDetail = (e) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    if (!detailForm.name.trim()) {
      showToast('Vui lòng nhập Họ và tên khách hàng');
      return;
    }
    if (!detailForm.email.trim()) {
      showToast('Vui lòng nhập Email khách hàng');
      return;
    }

    const fullAddr = [
      detailForm.specificAddress,
      detailForm.ward,
      detailForm.province,
    ]
      .filter(Boolean)
      .join(', ');

    let updatedAddresses = selectedCustomer.addresses || [];
    if (updatedAddresses.length > 0) {
      const defaultIdx = updatedAddresses.findIndex((a) => a.isDefault);
      const targetIdx = defaultIdx >= 0 ? defaultIdx : 0;
      updatedAddresses = updatedAddresses.map((addr, idx) => {
        if (idx === targetIdx) {
          return {
            ...addr,
            recipientName: detailForm.recipientName.trim() || detailForm.name.trim(),
            phone: detailForm.recipientPhone.trim() || detailForm.phone.trim(),
            province: detailForm.province,
            district: detailForm.ward,
            specificAddress: detailForm.specificAddress,
            address: fullAddr || addr.address,
            isDefault: true,
          };
        }
        return addr;
      });
    } else if (fullAddr) {
      updatedAddresses = [
        {
          id: Date.now(),
          recipientName: detailForm.recipientName.trim() || detailForm.name.trim(),
          phone: detailForm.recipientPhone.trim() || detailForm.phone.trim(),
          province: detailForm.province,
          district: detailForm.ward,
          specificAddress: detailForm.specificAddress,
          address: fullAddr,
          isDefault: true,
        },
      ];
    }

    const initials = detailForm.name
      .split(' ')
      .filter(Boolean)
      .slice(-2)
      .map((w) => w[0].toUpperCase())
      .join('');

    const updatedCustomer = {
      ...selectedCustomer,
      name: detailForm.name.trim(),
      email: detailForm.email.trim(),
      phone: detailForm.phone.trim(),
      gender: detailForm.gender,
      dob: detailForm.dob,
      avatar: detailForm.avatar,
      initials: initials || selectedCustomer.initials,
      province: detailForm.province,
      district: detailForm.ward,
      specificAddress: detailForm.specificAddress,
      address: fullAddr || selectedCustomer.address,
      addresses: updatedAddresses,
      status: detailForm.status,
    };

    setCustomersList((prev) => prev.map((c) => (c.id === updatedCustomer.id ? updatedCustomer : c)));
    setSelectedCustomer(updatedCustomer);
    showToast(`Đã lưu thành công thông tin khách hàng: ${updatedCustomer.name}`);
  };

  // Thao tác bật/tắt khóa trực tiếp từ Detail View
  const handleToggleDetailStatus = () => {
    if (!selectedCustomer) return;
    const newStatus = !detailForm.status;
    setDetailForm((prev) => ({ ...prev, status: newStatus }));

    const updatedCustomer = { ...selectedCustomer, status: newStatus };
    setCustomersList((prev) => prev.map((c) => (c.id === updatedCustomer.id ? updatedCustomer : c)));
    setSelectedCustomer(updatedCustomer);
    showToast(newStatus ? 'Đã kích hoạt tài khoản khách hàng' : 'Đã tạm khóa tài khoản khách hàng');
  };

  // Thêm hoặc sửa địa chỉ trong Modal Địa chỉ (Ảnh 3)
  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!customerForAddress) return;

    if (!addressForm.recipientName.trim() || !addressForm.phone.trim()) {
      showToast('Vui lòng nhập tên người nhận và số điện thoại');
      return;
    }

    const fullAddr = [addressForm.specificAddress, addressForm.district, addressForm.province]
      .filter(Boolean)
      .join(', ');

    let currentAddresses = customerForAddress.addresses || [];

    if (editingAddressId) {
      // Sửa địa chỉ hiện có
      currentAddresses = currentAddresses.map((addr) => {
        if (addr.id === editingAddressId) {
          return {
            ...addr,
            recipientName: addressForm.recipientName.trim(),
            phone: addressForm.phone.trim(),
            province: addressForm.province,
            district: addressForm.district,
            specificAddress: addressForm.specificAddress,
            address: fullAddr,
            isDefault: addressForm.isDefault ? true : addr.isDefault,
          };
        }
        return addressForm.isDefault ? { ...addr, isDefault: false } : addr;
      });
    } else {
      // Thêm mới địa chỉ
      const newAddrObj = {
        id: Date.now(),
        recipientName: addressForm.recipientName.trim(),
        phone: addressForm.phone.trim(),
        province: addressForm.province,
        district: addressForm.district,
        specificAddress: addressForm.specificAddress,
        address: fullAddr,
        isDefault: addressForm.isDefault || currentAddresses.length === 0,
      };

      if (newAddrObj.isDefault) {
        currentAddresses = currentAddresses.map((a) => ({ ...a, isDefault: false }));
      }
      currentAddresses = [...currentAddresses, newAddrObj];
    }

    const defaultAddr = currentAddresses.find((a) => a.isDefault);

    const updatedCustomer = {
      ...customerForAddress,
      addresses: currentAddresses,
      address: defaultAddr ? defaultAddr.address : customerForAddress.address,
    };

    setCustomersList((prev) => prev.map((c) => (c.id === updatedCustomer.id ? updatedCustomer : c)));
    setCustomerForAddress(updatedCustomer);
    if (selectedCustomer && selectedCustomer.id === updatedCustomer.id) {
      setSelectedCustomer(updatedCustomer);
      if (defaultAddr) {
        setDetailForm((prev) => ({
          ...prev,
          recipientName: defaultAddr.recipientName || prev.recipientName,
          recipientPhone: defaultAddr.phone || prev.recipientPhone,
          province: defaultAddr.province || prev.province,
          ward: defaultAddr.district || prev.ward,
          specificAddress: defaultAddr.specificAddress || prev.specificAddress,
        }));
      }
    }

    setIsAddingNewAddress(false);
    setEditingAddressId(null);
    showToast('Đã lưu địa chỉ giao hàng thành công');
  };

  // Đặt làm địa chỉ mặc định
  const handleSetDefaultAddress = (addressId) => {
    if (!customerForAddress) return;
    const currentAddresses = (customerForAddress.addresses || []).map((a) => ({
      ...a,
      isDefault: a.id === addressId,
    }));
    const defaultAddr = currentAddresses.find((a) => a.isDefault);

    const updatedCustomer = {
      ...customerForAddress,
      addresses: currentAddresses,
      address: defaultAddr ? defaultAddr.address : customerForAddress.address,
    };

    setCustomersList((prev) => prev.map((c) => (c.id === updatedCustomer.id ? updatedCustomer : c)));
    setCustomerForAddress(updatedCustomer);
    if (selectedCustomer && selectedCustomer.id === updatedCustomer.id) {
      setSelectedCustomer(updatedCustomer);
      if (defaultAddr) {
        setDetailForm((prev) => ({
          ...prev,
          recipientName: defaultAddr.recipientName || prev.recipientName,
          recipientPhone: defaultAddr.phone || prev.recipientPhone,
          province: defaultAddr.province || prev.province,
          ward: defaultAddr.district || prev.ward,
          specificAddress: defaultAddr.specificAddress || prev.specificAddress,
        }));
      }
    }
    showToast('Đã đặt làm địa chỉ mặc định');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* ── TOAST NOTIFICATION ── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <span className="text-violet-400 text-lg">✦</span>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          CHẾ ĐỘ 1: DANH SÁCH KHÁCH HÀNG (CHUẨN 100% THEO ẢNH 1)
      ══════════════════════════════════════════════════════════════════ */}
      {viewMode === 'list' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Header Tiêu Đề */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Khách hàng</h1>
          </div>

          {/* ── KHUNG 1: BỘ LỌC (CHUẨN ẢNH 1) ── */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm">
              <svg className="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Bộ lọc</span>
            </div>

            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 pt-1">
              {/* Ô tìm kiếm theo tên đăng nhập, họ tên, email, SĐT */}
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Tìm theo tên đăng nhập, họ tên, email, SĐT..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-200 transition shadow-2xs"
                />
              </div>

              {/* Dropdown trạng thái: Tất cả / Hoạt động / Tạm khóa */}
              <div className="w-full sm:w-44">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-200 transition cursor-pointer shadow-2xs"
                >
                  <option value="all">Tất cả</option>
                  <option value="active">Hoạt động</option>
                  <option value="locked">Tạm khóa</option>
                </select>
              </div>

              {/* 3 Nút Thao Tác bên phải */}
              <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
                {/* Nút Đặt lại bộ lọc */}
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    setCurrentPage(1);
                    showToast('Đã đặt lại bộ lọc');
                  }}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-white hover:bg-violet-50/50 text-violet-700 border border-violet-200 hover:border-violet-300 font-bold text-xs rounded-xl transition shadow-2xs flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95"
                >
                  <span>↻</span>
                  <span>Đặt lại bộ lọc</span>
                </button>

                {/* Nút Xuất Excel */}
                <button
                  type="button"
                  onClick={() => showToast(`Đang xuất danh sách ${filteredCustomers.length} khách hàng ra Excel (.xlsx)...`)}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 hover:border-emerald-300 font-bold text-xs rounded-xl transition shadow-2xs flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Xuất Excel</span>
                </button>

                {/* Nút + Thêm khách hàng (Màu tím VibeFlow) */}
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('create');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl shadow-md shadow-violet-600/25 flex items-center justify-center space-x-1.5 transition active:scale-95 cursor-pointer shrink-0"
                >
                  <span>+</span>
                  <span>Thêm khách hàng</span>
                </button>
              </div>
            </div>
          </div>

          {/* ── KHUNG 2: DANH SÁCH KHÁCH HÀNG (CHUẨN ẢNH 1) ── */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            {/* Header Bảng */}
            <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center shadow-2xs font-bold">
                  👥
                </div>
                <h3 className="font-bold text-sm text-slate-900 leading-none">Danh sách khách hàng</h3>
              </div>
              <span className="text-xs text-slate-400">
                Tổng số: <b className="text-slate-800">{filteredCustomers.length}</b> khách hàng
              </span>
            </div>

            {/* Bảng Dữ Liệu 8 Cột */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/70 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
                    <th className="py-3.5 px-4 text-center w-14">STT</th>
                    <th className="py-3.5 px-4 text-center w-16">Ảnh</th>
                    <th className="py-3.5 px-4">Họ tên</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Địa chỉ</th>
                    <th className="py-3.5 px-4 font-mono">Số điện thoại</th>
                    <th className="py-3.5 px-4 text-center">Trạng thái</th>
                    <th className="py-3.5 px-4 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {paginatedCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                        Không tìm thấy khách hàng nào phù hợp với bộ lọc tìm kiếm.
                      </td>
                    </tr>
                  ) : (
                    paginatedCustomers.map((cus, idx) => {
                      const stt = (currentPage - 1) * pageSize + idx + 1;
                      return (
                        <tr key={cus.id} className="hover:bg-slate-50/70 transition">
                          {/* STT */}
                          <td className="py-3.5 px-4 text-center font-medium text-slate-500">
                            {stt}
                          </td>

                          {/* Ảnh / Avatar / Initials */}
                          <td className="py-3.5 px-4 text-center">
                            {cus.avatar ? (
                              <img
                                src={cus.avatar}
                                alt={cus.name}
                                className="w-9 h-9 rounded-full object-cover border border-slate-200 mx-auto shadow-2xs"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-bold flex items-center justify-center text-xs mx-auto shadow-2xs">
                                {cus.initials || cus.name.charAt(0)}
                              </div>
                            )}
                          </td>

                          {/* Họ tên */}
                          <td className="py-3.5 px-4">
                            <button
                              type="button"
                              onClick={() => handleViewCustomerDetail(cus)}
                              className="font-bold text-slate-900 hover:text-violet-600 transition text-left cursor-pointer"
                              title="Bấm để xem chi tiết khách hàng"
                            >
                              {cus.name}
                            </button>
                            <div className="text-[10px] text-slate-400 font-mono">@{cus.username || 'khachhang'}</div>
                          </td>

                          {/* Email */}
                          <td className="py-3.5 px-4 text-slate-600 truncate max-w-[180px]">
                            {cus.email}
                          </td>

                          {/* Địa chỉ */}
                          <td className="py-3.5 px-4 text-slate-600 truncate max-w-[260px]" title={cus.address}>
                            {cus.address || 'Chưa cập nhật'}
                          </td>

                          {/* Số điện thoại */}
                          <td className="py-3.5 px-4 font-mono font-medium text-slate-800">
                            {cus.phone}
                          </td>

                          {/* Trạng thái (Pill badge xanh / đỏ) */}
                          <td className="py-3.5 px-4 text-center">
                            {cus.status ? (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                                Hoạt động
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                                Tạm khóa
                              </span>
                            )}
                          </td>

                          {/* 4 Nút Hành động (Khớp 100% Ảnh 1) */}
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center space-x-1.5">
                              {/* 1. Nút Đổi trạng thái (Power / Lock) */}
                              <button
                                type="button"
                                onClick={() => handleToggleStatus(cus.id)}
                                className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs transition cursor-pointer shadow-2xs ${
                                  cus.status
                                    ? 'border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-300'
                                    : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                                }`}
                                title={cus.status ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                              >
                                ⏻
                              </button>

                              {/* 2. Nút Quản lý địa chỉ giao hàng (Location Pin) */}
                              <button
                                type="button"
                                onClick={() => handleOpenAddressModal(cus)}
                                className="w-7 h-7 rounded-lg border border-slate-200 text-slate-500 hover:text-violet-600 hover:bg-violet-50 hover:border-violet-300 flex items-center justify-center text-xs transition cursor-pointer shadow-2xs"
                                title="Quản lý sổ địa chỉ"
                              >
                                📍
                              </button>

                              {/* 3. Nút Lịch sử đơn hàng (Shopping Bag / Orders) */}
                              <button
                                type="button"
                                onClick={() => handleViewCustomerDetail(cus)}
                                className="w-7 h-7 rounded-lg border border-slate-200 text-slate-500 hover:text-violet-600 hover:bg-violet-50 hover:border-violet-300 flex items-center justify-center text-xs transition cursor-pointer shadow-2xs"
                                title="Xem lịch sử đơn hàng"
                              >
                                🛍️
                              </button>

                              {/* 4. Nút Chi tiết khách hàng (Eye icon) */}
                              <button
                                type="button"
                                onClick={() => handleViewCustomerDetail(cus)}
                                className="w-7 h-7 rounded-lg border border-slate-200 text-slate-500 hover:text-violet-600 hover:bg-violet-50 hover:border-violet-300 flex items-center justify-center text-xs transition cursor-pointer shadow-2xs"
                                title="Xem chi tiết khách hàng"
                              >
                                👁
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Phân trang dưới cùng (Chuẩn 100% Ảnh 1) */}
            <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Chọn số dòng mỗi trang */}
              <div className="flex items-center space-x-2">
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-violet-500 cursor-pointer"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-xs text-slate-400">dòng / trang</span>
              </div>

              {/* Dãy nút chuyển trang: |< < 1 2 3 4 5 > >| */}
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                  className="w-7 h-7 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-xs transition"
                >
                  ⇤
                </button>
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="w-7 h-7 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-xs transition"
                >
                  ‹
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`w-7 h-7 rounded-lg font-bold text-xs transition ${
                      currentPage === page
                        ? 'bg-violet-600 text-white shadow-2xs shadow-violet-600/30'
                        : 'border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="w-7 h-7 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-xs transition"
                >
                  ›
                </button>
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                  className="w-7 h-7 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-xs transition"
                >
                  ⇥
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          CHẾ ĐỘ 2: THÊM KHÁCH HÀNG (CHUẨN 100% THEO ẢNH 2)
      ══════════════════════════════════════════════════════════════════ */}
      {viewMode === 'create' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Breadcrumbs & Nút Quay Lại */}
          <div className="flex items-center space-x-3 text-slate-500 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center justify-center font-bold transition shadow-2xs cursor-pointer active:scale-95"
              title="Quay lại danh sách"
            >
              ←
            </button>
            <div className="flex items-center space-x-1.5 text-sm font-semibold text-slate-700">
              <span className="hover:text-violet-600 cursor-pointer" onClick={() => setViewMode('list')}>
                Khách hàng
              </span>
              <span>/</span>
              <span className="text-slate-900 font-bold">Thêm khách hàng</span>
            </div>
          </div>

          {/* Bố cục 2 Cột (Ảnh 2) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* ── CỘT TRÁI (3 cols): Card Avatar & Preview Khách Hàng ── */}
            <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 flex flex-col items-center text-center space-y-3">
              <input
                type="file"
                ref={avatarInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                className="hidden"
              />
              <div
                onClick={() => avatarInputRef.current?.click()}
                className="relative w-28 h-28 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 hover:border-violet-500 flex items-center justify-center cursor-pointer overflow-hidden transition shadow-inner group"
                title="Bấm vào ảnh để chọn avatar"
              >
                {createForm.avatar ? (
                  <img src={createForm.avatar} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-black text-slate-400 group-hover:text-violet-600 transition tracking-wider">
                    {createForm.name
                      ? createForm.name
                          .split(' ')
                          .filter(Boolean)
                          .slice(-2)
                          .map((w) => w[0].toUpperCase())
                          .join('') || 'KH'
                      : 'KH'}
                  </span>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition">
                  Chọn ảnh
                </div>
              </div>

              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  {createForm.name || 'Khách hàng mới'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[200px]">
                  {createForm.email || 'Chưa cập nhật email'}
                </p>
                <p className="text-[11px] text-slate-400 mt-1 italic">
                  (Bấm vào ảnh để chọn avatar)
                </p>
              </div>
            </div>

            {/* ── CỘT PHẢI (9 cols): Form 2 Khung Thông Tin & Nút Tạo ── */}
            <div className="lg:col-span-9 space-y-6">
              <form onSubmit={handleCreateCustomer} className="space-y-6">
                {/* Khung 1: Thông tin cơ bản */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
                  <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3.5">
                    <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center shadow-2xs">
                      👤
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 leading-none">Thông tin cơ bản</h3>
                      <p className="text-[11px] text-slate-400 mt-1">Họ tên, email, liên hệ và tài khoản.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    {/* Họ và tên * */}
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Họ và tên <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={createForm.name}
                        onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                        placeholder="Nhập họ tên"
                        className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-200 transition shadow-2xs"
                      />
                    </div>

                    {/* Email * */}
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Email <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={createForm.email}
                        onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                        placeholder="Nhập email"
                        className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-200 transition shadow-2xs"
                      />
                    </div>

                    {/* Số điện thoại */}
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        value={createForm.phone}
                        onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                        placeholder="VD: 0901234567"
                        className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-200 transition shadow-2xs font-mono"
                      />
                    </div>

                    {/* Giới tính */}
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Giới tính
                      </label>
                      <select
                        value={createForm.gender}
                        onChange={(e) => setCreateForm({ ...createForm, gender: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-200 transition cursor-pointer shadow-2xs"
                      >
                        <option value="">-- Chọn giới tính --</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </div>

                    {/* Ngày sinh */}
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Ngày sinh
                      </label>
                      <input
                        type="date"
                        value={createForm.dob}
                        onChange={(e) => setCreateForm({ ...createForm, dob: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-200 transition shadow-2xs cursor-pointer font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Khung 2: Địa chỉ giao hàng * */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
                  <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3.5">
                    <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center shadow-2xs">
                      📍
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 leading-none">
                        Địa chỉ giao hàng <span className="text-rose-500">*</span>
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-1">Địa chỉ mặc định của khách hàng mới.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    {/* Họ tên người nhận * */}
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Họ tên người nhận <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={createForm.recipientName}
                        onChange={(e) => setCreateForm({ ...createForm, recipientName: e.target.value })}
                        placeholder="Họ tên người nhận"
                        className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-200 transition shadow-2xs"
                      />
                    </div>

                    {/* Số điện thoại * */}
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Số điện thoại <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={createForm.recipientPhone}
                        onChange={(e) => setCreateForm({ ...createForm, recipientPhone: e.target.value })}
                        placeholder="VD: 0901234567"
                        className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-200 transition shadow-2xs font-mono"
                      />
                    </div>

                    {/* Tỉnh/Thành phố * */}
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Tỉnh/Thành phố <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={createForm.province}
                        onChange={(e) => setCreateForm({ ...createForm, province: e.target.value, ward: '' })}
                        className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-200 transition cursor-pointer shadow-2xs"
                      >
                        <option value="">-- Chọn tỉnh/thành --</option>
                        {PROVINCES_DATA.map((p) => (
                          <option key={p.name} value={p.name}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Phường/Xã * */}
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Phường/Xã <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={createForm.ward}
                        onChange={(e) => setCreateForm({ ...createForm, ward: e.target.value })}
                        disabled={!createForm.province}
                        className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-200 transition cursor-pointer shadow-2xs disabled:bg-slate-100 disabled:cursor-not-allowed"
                      >
                        <option value="">-- Chọn phường/xã --</option>
                        {availableCreateWards.map((w) => (
                          <option key={w} value={w}>
                            {w}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Địa chỉ cụ thể * */}
                    <div className="sm:col-span-2 space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Địa chỉ cụ thể <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={createForm.specificAddress}
                        onChange={(e) => setCreateForm({ ...createForm, specificAddress: e.target.value })}
                        placeholder="Số nhà, tên đường..."
                        className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-200 transition shadow-2xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Nút Tạo khách hàng */}
                <div className="flex items-center space-x-3 pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl shadow-md shadow-violet-600/25 transition active:scale-95 cursor-pointer flex items-center space-x-2"
                  >
                    <span>💾</span>
                    <span>Tạo khách hàng</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          CHẾ ĐỘ 3: CHI TIẾT KHÁCH HÀNG (DẠNG FORM CHỈNH SỬA TƯƠNG TỰ THÊM KHÁCH HÀNG & CHI TIẾT NHÂN VIÊN)
      ══════════════════════════════════════════════════════════════════ */}
      {viewMode === 'detail' && selectedCustomer && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Breadcrumbs & Nút Quay Lại */}
          <div className="flex items-center space-x-3 text-slate-500 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center justify-center font-bold transition shadow-2xs cursor-pointer active:scale-95"
              title="Quay lại danh sách"
            >
              ←
            </button>
            <div className="flex items-center space-x-1.5 text-sm font-semibold text-slate-700">
              <span className="hover:text-violet-600 cursor-pointer" onClick={() => setViewMode('list')}>
                Khách hàng
              </span>
              <span>/</span>
              <span className="text-slate-900 font-bold">Chi tiết khách hàng</span>
              <span className="text-xs text-slate-400 font-mono">({selectedCustomer.code})</span>
            </div>
          </div>

          {/* Bố cục 2 Cột giống Form Thêm KH và Form Chi tiết Nhân viên */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* ── CỘT TRÁI (3 cols): Card Avatar, Trạng thái & Sổ Địa Chỉ ── */}
            <div className="lg:col-span-3 space-y-5">
              {/* Card 1: Avatar & Preview thông tin */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 flex flex-col items-center text-center space-y-3.5">
                <input
                  type="file"
                  ref={detailAvatarInputRef}
                  onChange={handleDetailAvatarChange}
                  accept="image/*"
                  className="hidden"
                />
                <div
                  onClick={() => detailAvatarInputRef.current?.click()}
                  className="relative w-28 h-28 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 hover:border-violet-500 flex items-center justify-center cursor-pointer overflow-hidden transition shadow-inner group"
                  title="Bấm vào ảnh để thay đổi avatar"
                >
                  {detailForm.avatar ? (
                    <img src={detailForm.avatar} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-black text-slate-400 group-hover:text-violet-600 transition tracking-wider">
                      {detailForm.name
                        ? detailForm.name
                            .split(' ')
                            .filter(Boolean)
                            .slice(-2)
                            .map((w) => w[0].toUpperCase())
                            .join('') || 'KH'
                        : 'KH'}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition">
                    Đổi ảnh
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    {detailForm.name || 'Khách hàng'}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5 truncate max-w-[200px]">
                    @{selectedCustomer.username || 'khachhang'}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[210px]">
                    {detailForm.email || 'Chưa cập nhật email'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 italic">
                    (Bấm vào ảnh để đổi avatar)
                  </p>
                </div>

                <div className="pt-1">
                  {detailForm.status ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                      Hoạt động
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200">
                      Tạm khóa
                    </span>
                  )}
                </div>
              </div>

              {/* Card 2: Trạng thái tài khoản (Tương tự Chi tiết nhân viên) */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
                <h4 className="text-xs font-bold text-slate-800">Trạng thái tài khoản</h4>
                <button
                  type="button"
                  onClick={handleToggleDetailStatus}
                  className={`w-full py-2.5 px-4 font-bold text-xs rounded-xl border transition shadow-2xs cursor-pointer flex items-center justify-center space-x-1.5 active:scale-95 ${
                    detailForm.status
                      ? 'bg-white hover:bg-rose-50 text-rose-600 border-rose-200 hover:border-rose-300'
                      : 'bg-white hover:bg-emerald-50 text-emerald-600 border-emerald-200 hover:border-emerald-300'
                  }`}
                >
                  <span>{detailForm.status ? '🔒 Khóa tài khoản' : '🔓 Kích hoạt tài khoản'}</span>
                </button>
              </div>

              {/* Card 3: Thao tác nhanh Sổ địa chỉ giao hàng */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800">Sổ địa chỉ giao hàng</h4>
                  <span className="text-[11px] font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-100">
                    {(selectedCustomer.addresses || []).length} địa chỉ
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenAddressModal(selectedCustomer)}
                  className="w-full py-2.5 px-4 bg-violet-50/60 hover:bg-violet-100 text-violet-700 font-bold text-xs rounded-xl border border-violet-200 transition shadow-2xs cursor-pointer text-center flex items-center justify-center space-x-1.5 active:scale-95"
                >
                  <span>📍</span>
                  <span>Quản lý sổ địa chỉ</span>
                </button>
              </div>
            </div>

            {/* ── CỘT PHẢI (9 cols): Form Chỉnh Sửa Khách Hàng & Bảng Lịch Sử Đơn Hàng ── */}
            <div className="lg:col-span-9 space-y-6">
              <form onSubmit={handleSaveDetail} className="space-y-6">
                {/* Khung 1: Thông tin cơ bản */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
                  <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3.5">
                    <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center shadow-2xs">
                      👤
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 leading-none">Thông tin cơ bản</h3>
                      <p className="text-[11px] text-slate-400 mt-1">Họ tên, email, liên hệ và tài khoản.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    {/* Họ và tên * */}
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Họ và tên <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={detailForm.name}
                        onChange={(e) => setDetailForm({ ...detailForm, name: e.target.value })}
                        placeholder="Nhập họ tên"
                        className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-200 transition shadow-2xs font-semibold"
                      />
                    </div>

                    {/* Email * */}
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Email <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={detailForm.email}
                        onChange={(e) => setDetailForm({ ...detailForm, email: e.target.value })}
                        placeholder="Nhập email"
                        className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-200 transition shadow-2xs font-medium"
                      />
                    </div>

                    {/* Số điện thoại */}
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        value={detailForm.phone}
                        onChange={(e) => setDetailForm({ ...detailForm, phone: e.target.value })}
                        placeholder="VD: 0901234567"
                        className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-200 transition shadow-2xs font-mono"
                      />
                    </div>

                    {/* Giới tính */}
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Giới tính
                      </label>
                      <select
                        value={detailForm.gender}
                        onChange={(e) => setDetailForm({ ...detailForm, gender: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-200 transition cursor-pointer shadow-2xs"
                      >
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </div>

                    {/* Ngày sinh */}
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Ngày sinh
                      </label>
                      <input
                        type="date"
                        value={detailForm.dob}
                        onChange={(e) => setDetailForm({ ...detailForm, dob: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-200 transition shadow-2xs cursor-pointer font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Khung 2: Địa chỉ giao hàng mặc định */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
                  <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3.5">
                    <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center shadow-2xs">
                      📍
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 leading-none">
                        Địa chỉ giao hàng mặc định <span className="text-rose-500">*</span>
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-1">Địa chỉ nhận hàng chính của khách hàng.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    {/* Họ tên người nhận * */}
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Họ tên người nhận <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={detailForm.recipientName}
                        onChange={(e) => setDetailForm({ ...detailForm, recipientName: e.target.value })}
                        placeholder="Họ tên người nhận"
                        className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-200 transition shadow-2xs font-medium"
                      />
                    </div>

                    {/* Số điện thoại * */}
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Số điện thoại <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={detailForm.recipientPhone}
                        onChange={(e) => setDetailForm({ ...detailForm, recipientPhone: e.target.value })}
                        placeholder="VD: 0901234567"
                        className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-200 transition shadow-2xs font-mono"
                      />
                    </div>

                    {/* Tỉnh/Thành phố * */}
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Tỉnh/Thành phố <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={detailForm.province}
                        onChange={(e) => setDetailForm({ ...detailForm, province: e.target.value, ward: '' })}
                        className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-200 transition cursor-pointer shadow-2xs"
                      >
                        <option value="">-- Chọn tỉnh/thành --</option>
                        {PROVINCES_DATA.map((p) => (
                          <option key={p.name} value={p.name}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Phường/Xã * */}
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Phường/Xã <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={detailForm.ward}
                        onChange={(e) => setDetailForm({ ...detailForm, ward: e.target.value })}
                        disabled={!detailForm.province}
                        className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-200 transition cursor-pointer shadow-2xs disabled:bg-slate-100 disabled:cursor-not-allowed"
                      >
                        <option value="">-- Chọn phường/xã --</option>
                        {availableDetailWards.map((w) => (
                          <option key={w} value={w}>
                            {w}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Địa chỉ cụ thể * */}
                    <div className="sm:col-span-2 space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Địa chỉ cụ thể <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={detailForm.specificAddress}
                        onChange={(e) => setDetailForm({ ...detailForm, specificAddress: e.target.value })}
                        placeholder="Số nhà, tên đường..."
                        className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-200 transition shadow-2xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Nút Cập nhật thông tin */}
                <div className="flex items-center space-x-3 pt-1">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl shadow-md shadow-violet-600/25 transition active:scale-95 cursor-pointer flex items-center space-x-2"
                  >
                    <span>💾</span>
                    <span>Cập nhật thông tin</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    Quay lại danh sách
                  </button>
                </div>
              </form>

              {/* Khung 3: Bảng Lịch Sử Đơn Hàng Đã Mua */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
                <div className="p-5 pb-3 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-sm">Lịch sử đơn hàng</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-50 text-violet-700 border border-violet-200">
                      {(selectedCustomer.orders || []).length} đơn
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    Tổng chi tiêu: <b className="text-violet-700 font-mono">{(selectedCustomer.totalSpent || 0).toLocaleString('vi-VN')} đ</b>
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200/70 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
                        <th className="py-3 px-3 text-center w-10">#</th>
                        <th className="py-3 px-4">Mã đơn hàng</th>
                        <th className="py-3 px-4">Trạng thái</th>
                        <th className="py-3 px-4">Loại</th>
                        <th className="py-3 px-4 text-right">Tổng cộng</th>
                        <th className="py-3 px-4">Ngày tạo</th>
                        <th className="py-3 px-4 text-center">Chi tiết</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {(selectedCustomer.orders || []).length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-10 text-center text-slate-400 text-xs">
                            Khách hàng chưa có lịch sử đơn hàng nào.
                          </td>
                        </tr>
                      ) : (
                        (selectedCustomer.orders || []).map((ord, idx) => (
                          <tr key={ord.id || idx} className="hover:bg-slate-50/70 transition">
                            <td className="py-3 px-3 text-center font-medium text-slate-400">
                              {idx + 1}
                            </td>
                            <td className="py-3 px-4 font-mono font-bold text-slate-800">
                              {ord.code}
                            </td>
                            <td className="py-3 px-4">
                              {ord.status === 'Hoàn thành' && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                                  Hoàn thành
                                </span>
                              )}
                              {ord.status === 'Hủy' && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                                  Hủy
                                </span>
                              )}
                              {ord.status === 'Giao hàng thất bại' && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                  Giao hàng thất bại
                                </span>
                              )}
                              {ord.status === 'Chờ xác nhận' && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                  Chờ xác nhận
                                </span>
                              )}
                              {ord.status === 'Đã xác nhận' && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-50 text-orange-700 border border-orange-200">
                                  Đã xác nhận
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 font-medium text-slate-600">
                              {ord.type}
                            </td>
                            <td className="py-3 px-4 text-right font-black text-slate-900 font-mono">
                              {Number(ord.total).toLocaleString('vi-VN')} đ
                            </td>
                            <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                              {ord.createdAt}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <button
                                type="button"
                                onClick={() => setSelectedOrderSummary(ord)}
                                className="px-3 py-1 rounded-lg bg-violet-50 hover:bg-violet-100 text-violet-700 font-semibold text-xs border border-violet-200/70 transition cursor-pointer active:scale-95"
                              >
                                Xem chi tiết
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          MODAL 1: QUẢN LÝ ĐỊA CHỈ KHÁCH HÀNG (CHUẨN 100% THEO ẢNH 3)
      ══════════════════════════════════════════════════════════════════ */}
      {showAddressModal && customerForAddress && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-150 max-h-[85vh] overflow-y-auto">
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-2xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center text-lg">
                  📍
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Địa chỉ của {customerForAddress.name}
                  </h3>
                  <p className="text-xs text-slate-400">Quản lý địa chỉ giao hàng</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAddressModal(false);
                  setIsAddingNewAddress(false);
                  setEditingAddressId(null);
                }}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Danh sách thẻ Địa chỉ (Ảnh 3) */}
            <div className="space-y-3">
              {(customerForAddress.addresses || []).length === 0 ? (
                <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-400">
                  Chưa có địa chỉ nào được lưu.
                </div>
              ) : (
                (customerForAddress.addresses || []).map((addr) => (
                  <div
                    key={addr.id}
                    className={`rounded-2xl p-4 border transition ${
                      addr.isDefault
                        ? 'border-emerald-300 bg-emerald-50/20 shadow-2xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    {/* Hàng 1: Họ tên + Badge Mặc định + Nút Sửa */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-slate-900">{addr.recipientName}</span>
                        {addr.isDefault && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                            ✓ Mặc định
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingAddressId(addr.id);
                            setIsAddingNewAddress(true);
                            setAddressForm({
                              recipientName: addr.recipientName || '',
                              phone: addr.phone || '',
                              province: addr.province || 'Thành phố Hà Nội',
                              district: addr.district || '',
                              specificAddress: addr.specificAddress || '',
                              isDefault: !!addr.isDefault,
                            });
                          }}
                          className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-lg text-xs font-semibold transition cursor-pointer shadow-2xs"
                        >
                          Sửa
                        </button>
                        {!addr.isDefault && (
                          <button
                            type="button"
                            onClick={() => handleSetDefaultAddress(addr.id)}
                            className="text-[11px] text-violet-600 hover:underline font-bold cursor-pointer"
                          >
                            Thiết lập mặc định
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Hàng 2: Số điện thoại */}
                    <div className="text-xs font-mono text-slate-600 font-medium mt-1">
                      {addr.phone}
                    </div>

                    {/* Hàng 3: Địa chỉ chi tiết */}
                    <div className="text-xs text-slate-500 mt-0.5">
                      {addr.address}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Nút Khung Nét Đứt "+ Thêm địa chỉ mới" (Ảnh 3) */}
            {!isAddingNewAddress ? (
              <button
                type="button"
                onClick={() => {
                  setEditingAddressId(null);
                  setAddressForm({
                    recipientName: customerForAddress.name || '',
                    phone: customerForAddress.phone || '',
                    province: 'Thành phố Hà Nội',
                    district: 'Phường Dương Nội',
                    specificAddress: '',
                    isDefault: (customerForAddress.addresses || []).length === 0,
                  });
                  setIsAddingNewAddress(true);
                }}
                className="w-full py-3 border-2 border-dashed border-slate-200 hover:border-violet-400 rounded-2xl text-xs font-bold text-slate-600 hover:text-violet-700 flex items-center justify-center space-x-1.5 transition cursor-pointer hover:bg-violet-50/20 active:scale-[0.99]"
              >
                <span>+</span>
                <span>Thêm địa chỉ mới</span>
              </button>
            ) : (
              /* Form nhập địa chỉ mới / sửa */
              <form onSubmit={handleSaveAddress} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
                  <h4 className="font-bold text-xs text-slate-800">
                    {editingAddressId ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ giao hàng mới'}
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingNewAddress(false);
                      setEditingAddressId(null);
                    }}
                    className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    Đóng
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">Họ tên người nhận *</label>
                    <input
                      type="text"
                      required
                      value={addressForm.recipientName}
                      onChange={(e) => setAddressForm({ ...addressForm, recipientName: e.target.value })}
                      placeholder="Họ tên người nhận"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-violet-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">Số điện thoại *</label>
                    <input
                      type="tel"
                      required
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                      placeholder="0901234567"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-violet-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">Tỉnh/Thành phố *</label>
                    <select
                      value={addressForm.province}
                      onChange={(e) => setAddressForm({ ...addressForm, province: e.target.value, district: '' })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-violet-500"
                    >
                      {PROVINCES_DATA.map((p) => (
                        <option key={p.name} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">Phường/Xã *</label>
                    <select
                      value={addressForm.district}
                      onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-violet-500"
                    >
                      <option value="">-- Chọn phường/xã --</option>
                      {availableAddressModalWards.map((w) => (
                        <option key={w} value={w}>
                          {w}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">Địa chỉ cụ thể *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.specificAddress}
                    onChange={(e) => setAddressForm({ ...addressForm, specificAddress: e.target.value })}
                    placeholder="Số nhà, tên đường, KĐT..."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="isDefaultAddrCheck"
                    checked={addressForm.isDefault}
                    onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                    className="rounded accent-violet-600 cursor-pointer"
                  />
                  <label htmlFor="isDefaultAddrCheck" className="text-xs text-slate-700 font-medium cursor-pointer">
                    Đặt làm địa chỉ giao hàng mặc định
                  </label>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingNewAddress(false);
                      setEditingAddressId(null);
                    }}
                    className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                  >
                    Lưu địa chỉ
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          MODAL 2: TỔNG KẾT ĐƠN HÀNG TỪ BẢNG CHI TIẾT
      ══════════════════════════════════════════════════════════════════ */}
      {selectedOrderSummary && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-base">🧾</span>
                <h3 className="font-bold text-sm text-slate-900">Chi tiết đơn #{selectedOrderSummary.code}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrderSummary(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Trạng thái</span>
                <span className="font-bold text-slate-800">{selectedOrderSummary.status}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Hình thức</span>
                <span className="font-bold text-slate-800">{selectedOrderSummary.type}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Ngày tạo</span>
                <span className="font-mono text-slate-800">{selectedOrderSummary.createdAt}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-900">Tổng tiền</span>
                <span className="font-black text-violet-700 text-sm font-mono">
                  {Number(selectedOrderSummary.total).toLocaleString('vi-VN')} đ
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSelectedOrderSummary(null)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition cursor-pointer"
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
