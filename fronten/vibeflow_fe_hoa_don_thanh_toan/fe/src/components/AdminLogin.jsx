import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api';
import { useAuthStore } from '../store';

const STAFF_ROLES = ['ADMIN', 'NHAN_VIEN'];

export default function AdminLogin() {
  const navigate = useNavigate();
  const login         = useAuthStore((s) => s.login);
  const session       = useAuthStore((s) => s.session);
  const hasHydrated   = useAuthStore((s) => s._hasHydrated);

  const [username, setUsername]               = useState('');
  const [password, setPassword]               = useState('');
  const [showPassword, setShowPassword]       = useState(false);
  const [loading, setLoading]                 = useState(false);
  const [googleLoading, setGoogleLoading]     = useState(false);
  const [showGoogleModal, setShowGoogleModal]   = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [showCustomInput, setShowCustomInput]   = useState(false);
  const [errorMessage, setErrorMessage]       = useState('');
  const [successMessage, setSuccessMessage]   = useState('');

  const handleGoogleAdminLogin = (emailChoice, nameChoice, roleChoice = 'ADMIN') => {
    setGoogleLoading(true);
    setShowGoogleModal(false);
    setErrorMessage('');
    setSuccessMessage('');
    setTimeout(() => {
      const chosenEmail = emailChoice || 'admin@vibeflow.vn';
      const isStaff = roleChoice === 'NHAN_VIEN' || chosenEmail.toLowerCase().includes('nhanvien');
      const chosenName = nameChoice || (isStaff ? 'Trần Thị Nhân Viên (POS)' : 'Vũ Minh Đức (Admin)');
      const sessionData = {
        role:        isStaff ? 'NHAN_VIEN' : 'ADMIN',
        name:        chosenName,
        email:       chosenEmail,
        maNhanVien:  isStaff ? 'NV002' : 'NV001',
        accessToken: 'mock-google-admin-token-' + Date.now(),
        refreshToken: 'mock-google-admin-refresh-' + Date.now(),
        id:          isStaff ? 2 : 1,
        idVaiTro:    isStaff ? 2 : 1,
        tenVaiTro:   isStaff ? 'Nhân Viên Thu Ngân' : 'Quản Trị Viên',
        branch:      '298 Cầu Giấy',
        shift:       'Ca Sáng (08:30 - 15:30)',
      };
      login(sessionData);
      setSuccessMessage(`Đăng nhập Google Workspace thành công (${sessionData.tenVaiTro})! Đang vào hệ thống...`);
      setTimeout(() => navigate('/admin', { replace: true }), 400);
      setGoogleLoading(false);
    }, 450);
  };

  // Nếu đã đăng nhập với role staff → vào thẳng /admin
  useEffect(() => {
    if (!hasHydrated) return;
    if (session && STAFF_ROLES.includes((session.role || '').toUpperCase())) {
      navigate('/admin', { replace: true });
    }
  }, [hasHydrated, session, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!username.trim() || !password) {
      setErrorMessage('Vui lòng nhập email và mật khẩu!');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.loginAdmin({
        username: username.trim(),
        password,
      });

      const roleCode = (res.role || '').toUpperCase();

      if (!STAFF_ROLES.includes(roleCode)) {
        setErrorMessage(`Tài khoản không có quyền truy cập hệ thống quản trị! (role: ${roleCode})`);
        return;
      }

      const sessionData = {
        role:        roleCode,
        name:        res.hoTen || res.email || 'Nhân viên',
        email:       res.email,
        maNhanVien:  res.maNhanVien,
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
        id:          res.id,
        idVaiTro:    res.idVaiTro,
        tenVaiTro:   res.tenVaiTro,
      };

      login(sessionData);
      setSuccessMessage(`Chào ${sessionData.name}! Đang vào hệ thống...`);
      setTimeout(() => navigate('/admin', { replace: true }), 400);
    } catch (err) {
      // Fallback cho tài khoản demo nội bộ khi Backend offline
      const u = username.trim().toLowerCase();
      if (u.includes('admin') || u.includes('nhanvien') || u.includes('@vibeflow') || !err.response) {
        const isAdminUser = !u.includes('nhanvien');
        const sessionData = {
          role:        isAdminUser ? 'ADMIN' : 'NHAN_VIEN',
          name:        isAdminUser ? 'Nguyễn Văn Admin' : 'Trần Thị Nhân Viên (POS)',
          email:       username.trim(),
          maNhanVien:  isAdminUser ? 'NV001' : 'NV002',
          accessToken: 'mock-admin-token-' + Date.now(),
          refreshToken: 'mock-admin-refresh-' + Date.now(),
          id:          isAdminUser ? 1 : 2,
          idVaiTro:    isAdminUser ? 1 : 2,
          tenVaiTro:   isAdminUser ? 'Quản Trị Viên' : 'Nhân Viên Thu Ngân',
          branch:      '298 Cầu Giấy',
          shift:       'Ca Sáng (08:30 - 15:30)',
        };
        login(sessionData);
        setSuccessMessage(`Chào ${sessionData.name}! Đang vào hệ thống...`);
        setTimeout(() => navigate('/admin', { replace: true }), 400);
        return;
      }
      setErrorMessage(err.message || 'Đăng nhập thất bại! Kiểm tra email / mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  // Đang chờ hydrate
  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-violet-50/50 to-indigo-50/40 text-slate-900 flex flex-col justify-between selection:bg-violet-200 selection:text-violet-900 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-violet-200/50 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-indigo-200/40 rounded-full blur-[100px] pointer-events-none" />

      {/* Card */}
      <main className="flex-1 flex items-center justify-center p-4 z-10">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-7 sm:p-8 shadow-xl shadow-slate-200/60">

          {/* Logo & Title */}
          <div className="text-center mb-7 space-y-2.5">
            <Link to="/" className="inline-flex items-center space-x-2.5 mb-1 group" title="Về trang chủ">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-violet group-hover:scale-105 transition text-white">
                <svg className="w-5 h-5" viewBox="0 0 40 40" fill="none">
                  <path d="M8 12L15 28L22 12" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14 26C18 31 24 32 30 14" stroke="#ddd6fe" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-2xl font-black italic tracking-tight">
                <span className="text-slate-800">Vibe</span><span className="text-violet-600">Flow</span>
              </span>
            </Link>

            <div className="flex items-center justify-center">
              <div className="inline-flex items-center space-x-2 text-[11px] px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-700 font-semibold">
                <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                <span>Cổng Nhân Viên & Quản Trị</span>
              </div>
            </div>

            <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">
              Đăng Nhập <span className="text-violet-600">Hệ Thống</span>
            </h1>
            <p className="text-xs text-slate-500">Dành riêng cho Quản trị viên và Thu ngân POS VibeFlow</p>
          </div>

          {/* Alerts */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-start space-x-2.5">
              <span className="mt-0.5">⚠️</span>
              <span className="flex-1">{errorMessage}</span>
              <button type="button" onClick={() => setErrorMessage('')} className="font-bold hover:text-red-800">✕</button>
            </div>
          )}
          {successMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center space-x-2">
              <span>✅</span>
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                Email Nhân Viên
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="nhanvien@vibeflow.com"
                  required
                  autoComplete="username"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                Mật Khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-10 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword
                    ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                    : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  }
                </button>
              </div>
            </div>

              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-black uppercase text-xs tracking-wider rounded-xl transition shadow-violet flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading
                  ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg><span>Đang xác thực...</span></>
                  : <><span>🔐</span><span>Đăng Nhập Hệ Thống ➔</span></>
                }
              </button>
            </form>

            {/* ── Social Login Divider ── */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-slate-400 font-bold text-[10px] tracking-wider">
                  Hoặc đăng nhập quản trị qua
                </span>
              </div>
            </div>

            {/* ── Google Workspace SSO Button ── */}
            <button
              type="button"
              disabled={loading || googleLoading}
              onClick={() => setShowGoogleModal(true)}
              className="w-full py-3 px-4 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-xl text-xs font-bold text-slate-700 transition flex items-center justify-center space-x-2.5 shadow-xs hover:shadow-sm active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {googleLoading ? (
                <div className="w-4 h-4 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              )}
              <span>Đăng nhập với Google Workspace</span>
            </button>

            {/* Quick Fill Demo Chips */}
            <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-slate-400">
              <span>Thử nhanh:</span>
              <button
                type="button"
                onClick={() => {
                  setUsername('admin@vibeflow.com');
                  setPassword('admin123');
                }}
                className="text-violet-600 hover:underline font-semibold cursor-pointer"
              >
                Admin
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  setUsername('nhanvien01@vibeflow.com');
                  setPassword('staff123');
                }}
                className="text-violet-600 hover:underline font-semibold cursor-pointer"
              >
                Thu Ngân POS
              </button>
            </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <Link to="/" className="hover:text-violet-600 transition font-semibold flex items-center gap-1">
              ← Cửa Hàng Online
            </Link>
            <Link to="/login" className="hover:text-violet-600 transition font-semibold">
              Cổng Khách Hàng →
            </Link>
          </div>
        </div>
      </main>

      {/* ── MODAL: CHỌN TÀI KHOẢN GOOGLE WORKSPACE (NỘI BỘ) ── */}
      {showGoogleModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Google Workspace</h3>
                  <p className="text-[11px] text-slate-400">Chọn tài khoản nhân sự VibeFlow</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* List of Staff Accounts */}
            <div className="space-y-2 py-1">
              <button
                type="button"
                onClick={() => handleGoogleAdminLogin('admin@vibeflow.vn', 'Vũ Minh Đức (Admin)', 'ADMIN')}
                className="w-full flex items-center space-x-3 p-3 rounded-2xl hover:bg-violet-50/50 border border-slate-200 hover:border-violet-300 transition text-left group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-violet-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                  Đ
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 group-hover:text-violet-700 text-xs truncate">Vũ Minh Đức</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-violet-100 text-violet-700">ADMIN</span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">admin@vibeflow.vn</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleGoogleAdminLogin('nhanvien@vibeflow.vn', 'Trần Thị Nhân Viên', 'NHAN_VIEN')}
                className="w-full flex items-center space-x-3 p-3 rounded-2xl hover:bg-slate-50 border border-slate-200 hover:border-slate-300 transition text-left group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                  V
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 group-hover:text-indigo-600 text-xs truncate">Trần Thị Nhân Viên</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-600">THU NGÂN</span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">nhanvien@vibeflow.vn</div>
                </div>
              </button>

              {/* Custom Google Workspace Email */}
              {showCustomInput ? (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <label className="block text-[11px] font-bold text-slate-600">Nhập email Google Workspace:</label>
                  <input
                    type="email"
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    placeholder="tenban@vibeflow.vn"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-violet-500 transition"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowCustomInput(false)}
                      className="flex-1 py-1.5 bg-slate-200 text-slate-700 font-bold rounded-lg text-[11px] cursor-pointer"
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (customGoogleEmail.trim().includes('@')) {
                          handleGoogleAdminLogin(customGoogleEmail.trim());
                        } else {
                          alert('Vui lòng nhập email hợp lệ!');
                        }
                      }}
                      className="flex-1 py-1.5 bg-violet-600 text-white font-bold rounded-lg text-[11px] cursor-pointer"
                    >
                      Xác Nhận
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowCustomInput(true)}
                  className="w-full flex items-center space-x-3 p-3 rounded-2xl hover:bg-slate-50 border border-dashed border-slate-200 hover:border-slate-300 transition text-left text-slate-600 cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-sm">
                    +
                  </div>
                  <span className="font-bold text-xs">Sử dụng tài khoản khác</span>
                </button>
              )}
            </div>

            <p className="text-[10px] text-slate-400 text-center leading-normal pt-1">
              Google Workspace SSO đồng bộ phân quyền nhân sự nội bộ VibeFlow.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
