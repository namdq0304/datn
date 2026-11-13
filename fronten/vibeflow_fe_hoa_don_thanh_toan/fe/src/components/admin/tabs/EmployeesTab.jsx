import React, { useState, useMemo } from 'react';
import { AdminPageHeader } from '../common';

// Danh sách Tỉnh / Thành phố mẫu phục vụ chọn nhanh
const PROVINCES_DATA = [
  { name: 'Tỉnh Phú Thọ', wards: ['Phường Vĩnh Yên', 'Phường Tiên Cát', 'Phường Gia Cẩm', 'Xã Trưng Vương'] },
  { name: 'Thành phố Hà Nội', wards: ['Phường Cầu Giấy', 'Phường Dịch Vọng', 'Phường Mỹ Đình', 'Phường Hàng Bạc', 'Phường Khương Mai'] },
  { name: 'Thành phố Hồ Chí Minh', wards: ['Phường Bến Nghé', 'Phường Đa Kao', 'Phường 1 (Quận 3)', 'Phường Tân Định'] },
  { name: 'Thành phố Đà Nẵng', wards: ['Phường Hải Châu 1', 'Phường Thạch Thang', 'Phường Hòa Thuận Đông'] },
  { name: 'Thành phố Hải Phòng', wards: ['Phường Hoàng Văn Thụ', 'Phường Minh Khai', 'Phường Lê Lợi'] },
];

export default function EmployeesTab({
  setShowAddEmployeeModal,
  employeeSearch,
  setEmployeeSearch,
  employeeRoleFilter,
  setEmployeeRoleFilter,
  employeesList,
  setEmployeesList,
}) {
  // Chế độ xem: 'list' (Danh sách) | 'detail' (Chi tiết nhân viên) | 'create' (Thêm mới nhân viên)
  const [viewMode, setViewMode] = useState('list');
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Bộ lọc danh sách nhân viên
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Phân trang
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Toast thông báo
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // State đổi mật khẩu modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirmPassword: '' });

  // State quét CCCD modal
  const [showCccdModal, setShowCccdModal] = useState(false);
  const [cccdScanTarget, setCccdScanTarget] = useState('create'); // 'create' | 'detail'

  // State Form Thêm Nhân Viên Mới
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'NHAN_VIEN',
    roleName: 'Nhân viên',
    gender: 'Nam',
    dob: '',
    province: '',
    district: '',
    specificAddress: '',
    avatar: null,
  });

  // State Form Chỉnh Sửa / Chi Tiết Nhân Viên
  const [editForm, setEditForm] = useState({
    id: null,
    code: '',
    name: '',
    email: '',
    phone: '',
    role: 'NHAN_VIEN',
    roleName: 'Nhân viên',
    gender: 'Nam',
    dob: '',
    province: '',
    district: '',
    specificAddress: '',
    avatar: null,
    status: true,
  });

  // Mở màn hình Chi Tiết Nhân Viên
  const handleOpenDetail = (emp) => {
    setSelectedEmployee(emp);
    setEditForm({
      ...emp,
      province: emp.province || 'Tỉnh Phú Thọ',
      district: emp.district || 'Phường Vĩnh Yên',
      specificAddress: emp.specificAddress || 'Chung cư Tỉnh Đội, đường Lam Sơn',
      dob: emp.dob || '2006-05-15',
    });
    setViewMode('detail');
  };

  // Chuyển sang màn hình Thêm Nhân Viên
  const handleOpenCreate = () => {
    setCreateForm({
      name: '',
      email: '',
      phone: '',
      role: 'NHAN_VIEN',
      roleName: 'Nhân viên',
      gender: 'Nam',
      dob: '',
      province: '',
      district: '',
      specificAddress: '',
      avatar: null,
    });
    setViewMode('create');
  };

  // Khóa / Mở khóa trạng thái nhân viên
  const handleToggleStatus = (id) => {
    setEmployeesList((prev) =>
      prev.map((emp) => {
        if (emp.id === id) {
          const nextStatus = !emp.status;
          showToast(nextStatus ? `Đã mở khóa tài khoản ${emp.code}!` : `Đã tạm khóa tài khoản ${emp.code}!`);
          return { ...emp, status: nextStatus };
        }
        return emp;
      })
    );
    if (selectedEmployee && selectedEmployee.id === id) {
      setSelectedEmployee((prev) => ({ ...prev, status: !prev.status }));
      setEditForm((prev) => ({ ...prev, status: !prev.status }));
    }
  };

  // Lưu chỉnh sửa nhân viên (Screen 2)
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) {
      alert('Vui lòng nhập họ và tên nhân viên!');
      return;
    }
    const fullAddress = [editForm.specificAddress, editForm.district, editForm.province]
      .filter(Boolean)
      .join(', ');

    const updated = {
      ...editForm,
      address: fullAddress,
      roleName:
        editForm.role === 'ADMIN'
          ? 'Quản trị viên'
          : editForm.role === 'MANAGER'
          ? 'Quản lý'
          : 'Nhân viên',
    };

    setEmployeesList((prev) => prev.map((emp) => (emp.id === updated.id ? updated : emp)));
    setSelectedEmployee(updated);
    showToast(`Đã lưu thay đổi thông tin nhân viên ${updated.code}!`);
    setViewMode('list');
  };

  // Tạo nhân viên mới (Screen 3)
  const handleSaveCreate = (e) => {
    e.preventDefault();
    if (!createForm.name.trim()) {
      alert('Vui lòng nhập họ và tên nhân viên!');
      return;
    }
    const newId = Date.now();
    const newCode = `NV${Math.floor(10000 + Math.random() * 90000)}`;
    const fullAddress = [createForm.specificAddress, createForm.district, createForm.province]
      .filter(Boolean)
      .join(', ');

    const newEmp = {
      id: newId,
      code: newCode,
      name: createForm.name,
      email: createForm.email,
      phone: createForm.phone,
      role: createForm.role,
      roleName:
        createForm.role === 'ADMIN'
          ? 'Quản trị viên'
          : createForm.role === 'MANAGER'
          ? 'Quản lý'
          : 'Nhân viên',
      gender: createForm.gender,
      dob: createForm.dob,
      province: createForm.province,
      district: createForm.district,
      specificAddress: createForm.specificAddress,
      address: fullAddress || 'Chưa cập nhật địa chỉ',
      status: true,
      avatar: createForm.avatar,
      branch: '298 Cầu Giấy',
    };

    setEmployeesList((prev) => [newEmp, ...prev]);
    showToast(`Tạo mới thành công nhân viên: ${newEmp.name} (${newEmp.code})!`);
    setViewMode('list');
  };

  // Giả lập quét mã CCCD gắn chip tự động điền form
  const handleApplyCccdScan = () => {
    const mockCccd = {
      name: 'Trần Vũ Tùng Anh',
      dob: '2006-05-15',
      gender: 'Nam',
      phone: '0383854485',
      province: 'Tỉnh Phú Thọ',
      district: 'Phường Vĩnh Yên',
      specificAddress: 'Chung cư Tỉnh Đội, đường Lam Sơn',
    };

    if (cccdScanTarget === 'create') {
      setCreateForm((prev) => ({
        ...prev,
        ...mockCccd,
        email: prev.email || 'tunganhqwqkawaii@gmail.com',
      }));
    } else {
      setEditForm((prev) => ({
        ...prev,
        ...mockCccd,
      }));
    }

    setShowCccdModal(false);
    showToast('✓ Quét mã CCCD thành công! Đã tự động cập nhật thông tin cá nhân.');
  };

  // Xử lý đổi mật khẩu
  const handleSubmitChangePassword = (e) => {
    e.preventDefault();
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
      alert('Mật khẩu mới phải có tối thiểu 6 ký tự!');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Xác nhận mật khẩu mới không trùng khớp!');
      return;
    }
    setShowPasswordModal(false);
    setPasswordForm({ newPassword: '', confirmPassword: '' });
    showToast('✓ Đổi mật khẩu tài khoản thành công!');
  };

  // Reset bộ lọc danh sách
  const handleResetFilters = () => {
    setSearchQuery('');
    setRoleFilter('all');
    setStatusFilter('all');
    setCurrentPage(1);
    showToast('Đã đặt lại bộ lọc về mặc định');
  };

  // Xuất file Excel
  const handleExportExcel = () => {
    showToast('Đang xuất danh sách nhân viên ra tệp Excel...');
  };

  // Dữ liệu lọc cho bảng nhân viên
  const filteredEmployees = useMemo(() => {
    return employeesList.filter((emp) => {
      // 1. Tìm kiếm theo mã, họ tên, email, SĐT
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchCode = (emp.code || '').toLowerCase().includes(q);
        const matchName = (emp.name || '').toLowerCase().includes(q);
        const matchEmail = (emp.email || '').toLowerCase().includes(q);
        const matchPhone = (emp.phone || '').toLowerCase().includes(q);
        if (!matchCode && !matchName && !matchEmail && !matchPhone) return false;
      }
      // 2. Lọc vai trò
      if (roleFilter !== 'all') {
        if (emp.role !== roleFilter) return false;
      }
      // 3. Lọc trạng thái
      if (statusFilter !== 'all') {
        const isAct = statusFilter === 'active';
        if (emp.status !== isAct) return false;
      }
      return true;
    });
  }, [employeesList, searchQuery, roleFilter, statusFilter]);

  // Phân trang
  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + pageSize);

  // =========================================================================
  // GIAO DIỆN 2: CHI TIẾT NHÂN VIÊN (viewMode === 'detail')
  // =========================================================================
  if (viewMode === 'detail' && selectedEmployee) {
    return (
      <div className="space-y-5 max-w-[1500px] mx-auto pb-16 animate-in fade-in duration-150">
        {/* Nút quay lại & Tiêu đề mã nhân viên */}
        <div className="flex items-center space-x-3 pb-2">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className="w-9 h-9 rounded-full bg-white border border-slate-200 hover:bg-violet-50 hover:border-violet-200 text-slate-700 hover:text-violet-600 shadow-2xs flex items-center justify-center transition cursor-pointer"
            title="Quay lại danh sách nhân viên"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-bold text-slate-800">Mã nhân viên:</span>
            <span className="font-mono font-black text-sm text-violet-700 bg-violet-50 px-2.5 py-0.5 rounded-lg border border-violet-200">
              {selectedEmployee.code}
            </span>
          </div>
        </div>

        {/* 2 Cột layout: Trái (Avatar, Đổi MK, Khóa TK) - Phải (Thông tin cơ bản & Địa chỉ) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* ── CỘT TRÁI (3 cols) ── */}
          <div className="lg:col-span-3 space-y-4">
            {/* Card 1: Avatar Profile */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 flex flex-col items-center text-center space-y-3">
              <div className="relative">
                {editForm.avatar ? (
                  <img
                    src={editForm.avatar}
                    alt={editForm.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-violet-100 shadow-sm"
                  />
                ) : (
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-slate-100 text-slate-400 font-bold text-3xl flex items-center justify-center border-4 border-slate-200 shadow-sm">
                    {editForm.name ? editForm.name.charAt(0).toUpperCase() : 'N'}
                  </div>
                )}
                <span
                  className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-white ${
                    editForm.status ? 'bg-emerald-500' : 'bg-slate-400'
                  }`}
                  title={editForm.status ? 'Hoạt động' : 'Tạm khóa'}
                ></span>
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-900">{editForm.name || 'Nhân viên'}</h3>
                <p className="text-xs text-slate-400 mt-0.5 break-all">{editForm.email || 'Chưa cập nhật email'}</p>
              </div>

              <div>
                {editForm.status ? (
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

            {/* Card 2: Đổi mật khẩu */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
              <h4 className="text-xs font-bold text-slate-800">Đổi mật khẩu</h4>
              <button
                type="button"
                onClick={() => setShowPasswordModal(true)}
                className="w-full py-2.5 px-4 bg-white hover:bg-violet-50 text-slate-700 hover:text-violet-700 font-bold text-xs rounded-xl border border-slate-200 hover:border-violet-300 transition shadow-2xs cursor-pointer text-center"
              >
                Đổi mật khẩu
              </button>
            </div>

            {/* Card 3: Trạng thái tài khoản */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
              <h4 className="text-xs font-bold text-slate-800">Trạng thái tài khoản</h4>
              <button
                type="button"
                onClick={() => handleToggleStatus(selectedEmployee.id)}
                className={`w-full py-2.5 px-4 font-bold text-xs rounded-xl border transition shadow-2xs cursor-pointer flex items-center justify-center space-x-1.5 ${
                  editForm.status
                    ? 'bg-white hover:bg-rose-50 text-rose-600 border-rose-200 hover:border-rose-300'
                    : 'bg-white hover:bg-emerald-50 text-emerald-600 border-emerald-200 hover:border-emerald-300'
                }`}
              >
                <span>{editForm.status ? '🔒 Khóa tài khoản' : '🔓 Kích hoạt tài khoản'}</span>
              </button>
            </div>
          </div>

          {/* ── CỘT PHẢI (9 cols): Form Thông Tin Cơ Bản & Địa Chỉ ── */}
          <div className="lg:col-span-9 space-y-5">
            <form onSubmit={handleSaveEdit} className="space-y-5">
              {/* Card 1: Thông tin cơ bản */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center text-sm font-bold shadow-2xs">
                      👤
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 leading-none">Thông tin cơ bản</h3>
                      <p className="text-[11px] text-slate-400 mt-1">Họ tên, email, liên hệ và tài khoản.</p>
                    </div>
                  </div>

                  {/* Nút Quét mã CCCD */}
                  <button
                    type="button"
                    onClick={() => {
                      setCccdScanTarget('detail');
                      setShowCccdModal(true);
                    }}
                    className="px-4 py-2 bg-white hover:bg-violet-50 border border-slate-300 hover:border-violet-300 text-slate-700 hover:text-violet-700 text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition cursor-pointer shadow-2xs"
                  >
                    <span>⛶</span>
                    <span>Quét mã CCCD</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Họ và tên <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-violet-500 transition"
                      placeholder="Nhập họ và tên"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-violet-500 transition"
                      placeholder="Nhập email"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Số điện thoại <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-violet-500 transition font-mono"
                      placeholder="Nhập số điện thoại"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Vai trò <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={editForm.role}
                      onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-violet-500 transition cursor-pointer"
                    >
                      <option value="ADMIN">Quản trị viên</option>
                      <option value="MANAGER">Quản lý</option>
                      <option value="NHAN_VIEN">Nhân viên</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Giới tính <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={editForm.gender}
                      onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-violet-500 transition cursor-pointer"
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Ngày sinh <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={editForm.dob}
                      onChange={(e) => setEditForm({ ...editForm, dob: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-violet-500 transition cursor-pointer font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: Địa chỉ */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
                <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
                  <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center text-sm shadow-2xs">
                    📍
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 leading-none">Địa chỉ</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tỉnh/Thành phố <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={editForm.province}
                      onChange={(e) => {
                        const prov = e.target.value;
                        const match = PROVINCES_DATA.find((p) => p.name === prov);
                        setEditForm({
                          ...editForm,
                          province: prov,
                          district: match && match.wards.length > 0 ? match.wards[0] : '',
                        });
                      }}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-violet-500 transition cursor-pointer font-medium"
                    >
                      <option value="">Chọn tỉnh thành</option>
                      {PROVINCES_DATA.map((p) => (
                        <option key={p.name} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Xã/Phường/Thị trấn <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={editForm.district}
                      onChange={(e) => setEditForm({ ...editForm, district: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-violet-500 transition cursor-pointer font-medium"
                    >
                      <option value="">Chọn xã phường</option>
                      {(
                        PROVINCES_DATA.find((p) => p.name === editForm.province)?.wards || [
                          'Phường Vĩnh Yên',
                          'Phường Cầu Giấy',
                        ]
                      ).map((w) => (
                        <option key={w} value={w}>
                          {w}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Địa chỉ cụ thể</label>
                    <input
                      type="text"
                      value={editForm.specificAddress}
                      onChange={(e) => setEditForm({ ...editForm, specificAddress: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-violet-500 transition"
                      placeholder="Nhập địa chỉ cụ thể (Số nhà, đường...)"
                    />
                  </div>
                </div>
              </div>

              {/* Hàng nút bấm Hành Động */}
              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-md shadow-violet-600/30 transition cursor-pointer flex items-center space-x-2"
                >
                  <span>💾</span>
                  <span>Lưu thay đổi</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Modal Đổi mật khẩu */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="font-bold text-sm text-slate-900">Đổi mật khẩu tài khoản</h4>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-base cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleSubmitChangePassword} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mật khẩu mới *</label>
                  <input
                    type="password"
                    required
                    placeholder="Tối thiểu 6 ký tự"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Xác nhận mật khẩu mới *</label>
                  <input
                    type="password"
                    required
                    placeholder="Nhập lại mật khẩu mới"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer hover:bg-slate-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold cursor-pointer shadow-violet"
                  >
                    Cập nhật mật khẩu
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Quét CCCD */}
        {showCccdModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center mx-auto text-xl shadow-2xs">
                ⛶
              </div>
              <div>
                <h4 className="font-bold text-base text-slate-900">Quét mã QR Thẻ CCCD gắn chip</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Đưa mã QR trên thẻ Căn cước công dân vào khung hình máy quét để tự động điền dữ liệu.
                </p>
              </div>
              <div className="w-56 h-36 mx-auto rounded-xl border-2 border-dashed border-violet-400 bg-violet-50/40 flex flex-col items-center justify-center space-y-1.5 p-4">
                <span className="text-2xl animate-pulse">📷</span>
                <span className="text-[11px] font-semibold text-violet-700">Khung camera nhận diện QR</span>
              </div>
              <div className="flex items-center justify-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCccdModal(false)}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-xs cursor-pointer hover:bg-slate-50"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={handleApplyCccdScan}
                  className="px-5 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold text-xs cursor-pointer shadow-violet"
                >
                  Nhận diện tự động mẫu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // GIAO DIỆN 3: THÊM NHÂN VIÊN MỚI (viewMode === 'create')
  // =========================================================================
  if (viewMode === 'create') {
    return (
      <div className="space-y-5 max-w-[1500px] mx-auto pb-16 animate-in fade-in duration-150">
        {/* Nút quay lại & Breadcrumb */}
        <div className="flex items-center space-x-3 pb-2">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className="w-9 h-9 rounded-full bg-white border border-slate-200 hover:bg-violet-50 hover:border-violet-200 text-slate-700 hover:text-violet-600 shadow-2xs flex items-center justify-center transition cursor-pointer"
            title="Quay lại danh sách nhân viên"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
            <span>Nhân viên</span>
            <span>/</span>
            <span className="font-bold text-violet-700">Thêm nhân viên</span>
          </div>
        </div>

        {/* 2 Cột layout: Trái (Avatar placeholder) - Phải (Form tạo nhân viên) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* ── CỘT TRÁI (3 cols) ── */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 flex flex-col items-center text-center space-y-3">
              <div className="relative group cursor-pointer">
                {createForm.avatar ? (
                  <img
                    src={createForm.avatar}
                    alt="Avatar"
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-violet-100 shadow-sm"
                  />
                ) : (
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-slate-100 text-slate-400 font-bold text-3xl flex items-center justify-center border-4 border-dashed border-slate-300 shadow-xs">
                    {createForm.name ? createForm.name.charAt(0).toUpperCase() : 'N'}
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-900">{createForm.name || 'Nhân viên mới'}</h3>
                <p className="text-xs text-slate-400 mt-0.5 break-all">{createForm.email || 'Chưa cập nhật email'}</p>
                <p className="text-[11px] text-violet-600 font-medium mt-1">(Bấm vào ảnh để chọn avatar)</p>
              </div>

              <div className="w-full pt-2">
                <input
                  type="text"
                  placeholder="Dán link ảnh avatar (tùy chọn)..."
                  value={createForm.avatar || ''}
                  onChange={(e) => setCreateForm({ ...createForm, avatar: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-700 focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>
          </div>

          {/* ── CỘT PHẢI (9 cols): Form Nhập Liệu ── */}
          <div className="lg:col-span-9 space-y-5">
            <form onSubmit={handleSaveCreate} className="space-y-5">
              {/* Card 1: Thông tin cơ bản */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center text-sm font-bold shadow-2xs">
                      👤
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 leading-none">Thông tin cơ bản</h3>
                      <p className="text-[11px] text-slate-400 mt-1">Họ tên, email, liên hệ và tài khoản.</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setCccdScanTarget('create');
                      setShowCccdModal(true);
                    }}
                    className="px-4 py-2 bg-white hover:bg-violet-50 border border-slate-300 hover:border-violet-300 text-slate-700 hover:text-violet-700 text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition cursor-pointer shadow-2xs"
                  >
                    <span>⛶</span>
                    <span>Quét mã CCCD</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Họ và tên <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={createForm.name}
                      onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-violet-500 transition"
                      placeholder="Nhập họ và tên"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={createForm.email}
                      onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-violet-500 transition"
                      placeholder="Nhập email"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Số điện thoại <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={createForm.phone}
                      onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-violet-500 transition font-mono"
                      placeholder="Nhập số điện thoại"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Vai trò <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={createForm.role}
                      onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-violet-500 transition cursor-pointer"
                    >
                      <option value="NHAN_VIEN">Nhân viên</option>
                      <option value="ADMIN">Quản trị viên</option>
                      <option value="MANAGER">Quản lý</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Giới tính <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={createForm.gender}
                      onChange={(e) => setCreateForm({ ...createForm, gender: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-violet-500 transition cursor-pointer"
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Ngày sinh <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={createForm.dob}
                      onChange={(e) => setCreateForm({ ...createForm, dob: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-violet-500 transition cursor-pointer font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: Địa chỉ */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
                <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
                  <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center text-sm shadow-2xs">
                    📍
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 leading-none">Địa chỉ</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tỉnh/Thành phố <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={createForm.province}
                      onChange={(e) => {
                        const prov = e.target.value;
                        const match = PROVINCES_DATA.find((p) => p.name === prov);
                        setCreateForm({
                          ...createForm,
                          province: prov,
                          district: match && match.wards.length > 0 ? match.wards[0] : '',
                        });
                      }}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-violet-500 transition cursor-pointer font-medium"
                    >
                      <option value="">Chọn tỉnh thành</option>
                      {PROVINCES_DATA.map((p) => (
                        <option key={p.name} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Xã/Phường/Thị trấn <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={createForm.district}
                      onChange={(e) => setCreateForm({ ...createForm, district: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-violet-500 transition cursor-pointer font-medium"
                    >
                      <option value="">Chọn xã phường</option>
                      {(
                        PROVINCES_DATA.find((p) => p.name === createForm.province)?.wards || [
                          'Phường Vĩnh Yên',
                          'Phường Cầu Giấy',
                        ]
                      ).map((w) => (
                        <option key={w} value={w}>
                          {w}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Địa chỉ cụ thể</label>
                    <input
                      type="text"
                      value={createForm.specificAddress}
                      onChange={(e) => setCreateForm({ ...createForm, specificAddress: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-violet-500 transition"
                      placeholder="Nhập địa chỉ cụ thể"
                    />
                  </div>
                </div>
              </div>

              {/* Nút hành động */}
              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-md shadow-violet-600/30 transition cursor-pointer flex items-center space-x-2"
                >
                  <span>💾</span>
                  <span>Tạo nhân viên</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Modal Quét CCCD */}
        {showCccdModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center mx-auto text-xl shadow-2xs">
                ⛶
              </div>
              <div>
                <h4 className="font-bold text-base text-slate-900">Quét mã QR Thẻ CCCD gắn chip</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Đưa mã QR trên thẻ Căn cước công dân vào khung hình máy quét để tự động điền dữ liệu.
                </p>
              </div>
              <div className="w-56 h-36 mx-auto rounded-xl border-2 border-dashed border-violet-400 bg-violet-50/40 flex flex-col items-center justify-center space-y-1.5 p-4">
                <span className="text-2xl animate-pulse">📷</span>
                <span className="text-[11px] font-semibold text-violet-700">Khung camera nhận diện QR</span>
              </div>
              <div className="flex items-center justify-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCccdModal(false)}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-xs cursor-pointer hover:bg-slate-50"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={handleApplyCccdScan}
                  className="px-5 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold text-xs cursor-pointer shadow-violet"
                >
                  Nhận diện tự động mẫu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // GIAO DIỆN 1: DANH SÁCH NHÂN VIÊN (viewMode === 'list')
  // Chuẩn 100% theo Screenshot 1 của người dùng
  // =========================================================================
  return (
    <div className="space-y-5 max-w-[1600px] mx-auto pb-16 relative animate-in fade-in duration-150 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/90 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 border border-slate-700/60 animate-bounce">
          <span className="text-emerald-400 text-lg">✓</span>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* ── TIÊU ĐỀ TRANG ĐỒNG BỘ TONE TÍM VIBEFLOW ── */}
      <AdminPageHeader
        category="Hệ Thống & Nhân Sự"
        title="Nhân Viên & Phân Quyền"
        badgeVariant="violet"
        subtitle="Danh sách nhân sự hệ thống, phân quyền quản trị viên và thu ngân chi nhánh."
        metrics={[
          { label: 'Tổng nhân sự', value: employeesList.length },
          { label: 'Quản trị viên', value: employeesList.filter((e) => e.role === 'ADMIN').length, highlight: true },
        ]}
      />

      {/* ── KHUNG 1: BỘ LỌC (Chuẩn theo ảnh 1) ── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
        {/* Header Bộ lọc */}
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center text-xs font-bold shadow-2xs">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </div>
          <h3 className="font-bold text-sm text-slate-900 leading-none">Bộ lọc</h3>
        </div>

        {/* Hàng 1: Tìm kiếm, Chọn vai trò, Chọn trạng thái */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Input Tìm kiếm (6 cols) */}
          <div className="lg:col-span-6">
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
                placeholder="Tìm theo mã, họ tên, tài khoản, SĐT..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-violet-500 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Select Tất cả vai trò (3 cols) */}
          <div className="lg:col-span-3">
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-violet-500 cursor-pointer shadow-2xs"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="ADMIN">Quản trị viên</option>
              <option value="MANAGER">Quản lý</option>
              <option value="NHAN_VIEN">Nhân viên</option>
            </select>
          </div>

          {/* Select Tất cả trạng thái (3 cols) */}
          <div className="lg:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-violet-500 cursor-pointer shadow-2xs"
            >
              <option value="all">Tất cả</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Tạm khóa</option>
            </select>
          </div>
        </div>

        {/* Hàng 2: Các nút hành động bên phải */}
        <div className="flex items-center justify-end gap-2.5 pt-1 flex-wrap">
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center space-x-1.5 transition cursor-pointer shadow-2xs hover:border-violet-300"
          >
            <span className="text-violet-600 font-bold">↻</span>
            <span>Đặt lại bộ lọc</span>
          </button>

          <button
            type="button"
            onClick={handleExportExcel}
            className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center space-x-1.5 transition cursor-pointer shadow-2xs hover:border-violet-300"
          >
            <span>📊</span>
            <span>Xuất Excel</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-5 py-2 bg-violet-600 hover:bg-violet-700 active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-md shadow-violet-600/25 flex items-center space-x-1.5 transition cursor-pointer"
          >
            <span className="text-base leading-none font-black">+</span>
            <span>Thêm nhân viên</span>
          </button>
        </div>
      </div>

      {/* ── KHUNG 2: DANH SÁCH NHÂN VIÊN ── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-4 p-5 sm:p-6">
        <div className="flex items-center space-x-2.5 pb-2">
          <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center text-sm shadow-2xs">
            👥
          </div>
          <h3 className="font-bold text-sm text-slate-900 leading-none">Danh sách nhân viên</h3>
        </div>

        {/* Bảng Dữ Liệu Nhân Viên */}
        <div className="overflow-x-auto border border-slate-100 rounded-xl">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-600 font-bold">
                <th className="py-3 px-3 text-center w-12">STT</th>
                <th className="py-3 px-3 text-center w-14">Ảnh</th>
                <th className="py-3 px-3.5 font-bold">Mã NV</th>
                <th className="py-3 px-4 font-bold">Họ tên</th>
                <th className="py-3 px-4 font-bold">Email</th>
                <th className="py-3 px-3 font-bold text-center">Giới tính</th>
                <th className="py-3 px-3.5 font-bold">SĐT</th>
                <th className="py-3 px-4 font-bold min-w-[220px]">Địa chỉ</th>
                <th className="py-3 px-3 font-bold">Vai trò</th>
                <th className="py-3 px-3 font-bold text-center">Trạng thái</th>
                <th className="py-3 px-3.5 font-bold text-center w-24">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedEmployees.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <span className="text-3xl">👥</span>
                      <p className="text-xs font-semibold">Không tìm thấy nhân viên nào phù hợp với bộ lọc.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedEmployees.map((emp, index) => {
                  const stt = startIndex + index + 1;
                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* STT */}
                      <td className="py-3.5 px-3 text-center font-bold text-slate-500">{stt}</td>

                      {/* Ảnh Avatar */}
                      <td className="py-3.5 px-3 text-center">
                        {emp.avatar ? (
                          <img
                            src={emp.avatar}
                            alt={emp.name}
                            className="w-8 h-8 rounded-full object-cover mx-auto border border-slate-200 shadow-2xs"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold text-xs flex items-center justify-center mx-auto border border-slate-200 shadow-2xs">
                            {emp.name ? emp.name.charAt(0).toUpperCase() : 'N'}
                          </div>
                        )}
                      </td>

                      {/* Mã NV */}
                      <td className="py-3.5 px-3.5 font-mono font-bold text-slate-900">{emp.code}</td>

                      {/* Họ tên */}
                      <td className="py-3.5 px-4 font-bold text-slate-900">{emp.name}</td>

                      {/* Email */}
                      <td className="py-3.5 px-4 text-slate-600 text-[11px] max-w-[150px] truncate" title={emp.email}>
                        {emp.email}
                      </td>

                      {/* Giới tính */}
                      <td className="py-3.5 px-3 text-center text-slate-700 font-medium">{emp.gender || 'Nam'}</td>

                      {/* SĐT */}
                      <td className="py-3.5 px-3.5 font-mono text-slate-800">{emp.phone}</td>

                      {/* Địa chỉ */}
                      <td className="py-3.5 px-4 text-slate-600 text-[11px] max-w-[260px] truncate" title={emp.address}>
                        {emp.address}
                      </td>

                      {/* Vai trò */}
                      <td className="py-3.5 px-3 text-slate-800 font-medium">
                        {emp.roleName || (emp.role === 'ADMIN' ? 'Quản trị viên' : 'Nhân viên')}
                      </td>

                      {/* Trạng thái */}
                      <td className="py-3.5 px-3 text-center">
                        {emp.status ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                            Hoạt động
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                            Tạm khóa
                          </span>
                        )}
                      </td>

                      {/* Hành động (Nút Power & Nút Con Mắt) */}
                      <td className="py-3.5 px-3.5 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          {/* Nút Bật/Tắt Trạng Thái (Power icon) */}
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(emp.id)}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition cursor-pointer ${
                              emp.status
                                ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                                : 'text-slate-300 hover:text-emerald-600 hover:bg-emerald-50'
                            }`}
                            title={emp.status ? 'Tạm khóa tài khoản' : 'Kích hoạt tài khoản'}
                          >
                            ⏻
                          </button>

                          {/* Nút Xem Chi Tiết (Con Mắt Eye Icon) */}
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(emp)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-violet-600 hover:bg-violet-50 text-xs transition cursor-pointer"
                            title="Xem chi tiết nhân viên"
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

        {/* Phân trang chuẩn */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-600">
          <div className="flex items-center space-x-2">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-violet-500 cursor-pointer shadow-2xs"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="text-slate-400 text-[11px]">bản ghi mỗi trang</span>
          </div>

          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              disabled={safePage === 1}
              className="w-7 h-7 rounded-lg border border-slate-200 text-slate-500 hover:border-violet-200 hover:text-violet-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold"
            >
              ⇤
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={safePage === 1}
              className="w-7 h-7 rounded-lg border border-slate-200 text-slate-500 hover:border-violet-200 hover:text-violet-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold"
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
                    ? 'bg-violet-600 text-white shadow-2xs'
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
              className="w-7 h-7 rounded-lg border border-slate-200 text-slate-500 hover:border-violet-200 hover:text-violet-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold"
            >
              ›
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(totalPages)}
              disabled={safePage === totalPages}
              className="w-7 h-7 rounded-lg border border-slate-200 text-slate-500 hover:border-violet-200 hover:text-violet-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold"
            >
              ⇥
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
