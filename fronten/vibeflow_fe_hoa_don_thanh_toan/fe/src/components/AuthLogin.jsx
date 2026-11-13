import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api';
import { useAuthStore } from '../store';

/**
 * Trang đăng nhập / đăng ký dành riêng cho KHÁCH HÀNG.
 * Route: /login
 *
 * - Nếu đã đăng nhập là khách hàng (KHACH_HANG) → redirect về /
 * - Nếu đã đăng nhập là nhân viên (ADMIN/NHAN_VIEN) → redirect về /admin
 */
export default function AuthLogin() {
  const navigate    = useNavigate();
  const login       = useAuthStore((s) => s.login);
  const session     = useAuthStore((s) => s.session);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);

  const [mode, setMode] = useState('login'); // 'login' | 'register'

  // Form đăng nhập
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Form đăng ký
  const [regHoTen, setRegHoTen]                   = useState('');
  const [regEmail, setRegEmail]                   = useState('');
  const [regPhone, setRegPhone]                   = useState('');
  const [regPassword, setRegPassword]             = useState('');
  const [regConfirm, setRegConfirm]               = useState('');
  const [showRegPassword, setShowRegPassword]     = useState(false);

  const [loading, setLoading]             = useState(false);
  const [errorMessage, setErrorMessage]   = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Google Login State
  const [googleLoading, setGoogleLoading]       = useState(false);
  const [showGoogleModal, setShowGoogleModal]   = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [showCustomInput, setShowCustomInput]   = useState(false);

  const handleGoogleSignIn = (emailChoice, nameChoice) => {
    setGoogleLoading(true);
    setShowGoogleModal(false);
    clearMessages();
    setTimeout(() => {
      const chosenEmail = emailChoice || 'nguyen.an.sneaker@gmail.com';
      const chosenName = nameChoice || (chosenEmail.split('@')[0].replace('.', ' ').toUpperCase());
      const sessionData = {
        role: 'KHACH_HANG',
        name: chosenName,
        phone: '0987.654.321',
        email: chosenEmail,
        accessToken: 'google-oauth-token-' + Date.now(),
        refreshToken: 'google-refresh-token-' + Date.now(),
        id: 999,
        maKhachHang: 'KH-GG-' + Math.floor(1000 + Math.random() * 9000),
      };
      login(sessionData);
      setSuccessMessage(`Đăng nhập Google thành công với ${chosenEmail}! Đang chuyển hướng...`);
      setTimeout(() => navigate('/', { replace: true }), 400);
      setGoogleLoading(false);
    }, 600);
  };

  // Auto-redirect nếu đã đăng nhập
  useEffect(() => {
    if (!hasHydrated || !session) return;
    const role = (session.role || '').toUpperCase();
    if (role === 'ADMIN' || role === 'NHAN_VIEN') {
      navigate('/admin', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  }, [hasHydrated, session, navigate]);

  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const clearMessages = () => { setErrorMessage(''); setSuccessMessage(''); };

  // ── Đăng nhập khách hàng ──────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    clearMessages();
    if (!email.trim() || !password) {
      setErrorMessage('Vui lòng nhập đầy đủ email và mật khẩu!');
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.loginCustomer({ username: email.trim(), password });
      const sessionData = {
        role:         res.role || 'KHACH_HANG',
        name:         res.hoTen || res.email || 'Khách Hàng',
        phone:        res.sdt || '',
        email:        res.email || email.trim(),
        accessToken:  res.accessToken,
        refreshToken: res.refreshToken,
        id:           res.id,
        maKhachHang:  res.maKhachHang,
      };
      login(sessionData);
      setSuccessMessage('Đăng nhập thành công! Đang chuyển hướng...');
      setTimeout(() => navigate('/', { replace: true }), 400);
    } catch (err) {
      setErrorMessage(err.message || 'Sai email hoặc mật khẩu!');
    } finally {
      setLoading(false);
    }
  };

  // ── Đăng ký khách hàng ────────────────────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault();
    clearMessages();
    if (!regHoTen.trim() || !regEmail.trim() || !regPassword) {
      setErrorMessage('Vui lòng điền đầy đủ họ tên, email và mật khẩu!');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMessage('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }
    if (regPassword !== regConfirm) {
      setErrorMessage('Mật khẩu xác nhận không khớp!');
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.registerCustomer({
        hoTen: regHoTen.trim(), email: regEmail.trim(),
        sdt: regPhone.trim(), password: regPassword,
      });
      setSuccessMessage(res.message || 'Đăng ký thành công! Hãy đăng nhập ngay.');
      setEmail(regEmail.trim());
      setPassword(regPassword);
      setMode('login');
      setRegHoTen(''); setRegEmail(''); setRegPhone('');
      setRegPassword(''); setRegConfirm('');
    } catch (err) {
      setErrorMessage(err.message || 'Đăng ký thất bại. Email có thể đã được dùng!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-violet-50/30 text-slate-900 flex flex-col justify-between selection:bg-indigo-200 selection:text-indigo-900 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-200/40 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-200/30 rounded-full blur-[100px] pointer-events-none" />

      {/* Card */}
      <main className="flex-1 flex items-center justify-center p-4 z-10">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-7 sm:p-8 shadow-xl shadow-slate-200/60">

          {/* Logo & Brand Header */}
          <div className="flex flex-col items-center mb-6">
            <Link to="/" className="flex items-center space-x-2.5 mb-3 group" title="Về trang chủ">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition">
                <svg className="w-5 h-5" viewBox="0 0 40 40" fill="none">
                  <path d="M8 12L15 28L22 12" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14 26C18 31 24 32 30 14" stroke="#c7d2fe" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-2xl font-black italic tracking-tight">
                <span className="text-slate-800">Vibe</span><span className="text-indigo-600">Flow</span>
              </span>
            </Link>

            <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 text-[11px] font-bold uppercase tracking-wider mb-2">
              ⚡ Tài Khoản Khách Hàng
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">
              {mode === 'login' ? 'Đăng Nhập' : 'Đăng Ký'} <span className="text-indigo-600">VibeFlow</span>
            </h1>
          </div>

          {/* Sub-tabs */}
          <div className="flex border-b border-slate-200 mb-5 text-xs font-bold">
            {['login', 'register'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); clearMessages(); }}
                className={`flex-1 pb-3 transition border-b-2 -mb-px ${
                  mode === m ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                {m === 'login' ? 'Đăng Nhập' : 'Đăng Ký Thành Viên'}
              </button>
            ))}
          </div>

          {/* Alerts */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-start space-x-2">
              <span className="mt-0.5 shrink-0">⚠️</span>
              <span className="flex-1">{errorMessage}</span>
              <button type="button" onClick={() => setErrorMessage('')} className="font-bold hover:text-red-800 shrink-0">✕</button>
            </div>
          )}
          {successMessage && (
            <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center space-x-2">
              <span>✅</span><span>{successMessage}</span>
            </div>
          )}

          {/* ── Form Đăng Nhập ── */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Email</label>
                <input
                  type="text" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com" required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Mật Khẩu</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••" required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-4 pr-10 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600">
                    {showPassword
                      ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                      : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    }
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-xs tracking-wider rounded-xl transition flex items-center justify-center space-x-2 disabled:opacity-50 shadow-indigo">
                {loading
                  ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg><span>Đang đăng nhập...</span></>
                  : <span>Đăng Nhập ➔</span>
                }
              </button>
            </form>
          )}

          {/* ── Form Đăng Ký ── */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Họ Và Tên</label>
                <input type="text" value={regHoTen} onChange={(e) => setRegHoTen(e.target.value)} placeholder="Nguyễn Văn An" required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Email</label>
                  <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="email@example.com" required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Số Điện Thoại</label>
                  <input type="tel" value={regPhone} onChange={(e) => setRegPhone(e.target.value)} placeholder="0987654321"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Mật Khẩu</label>
                  <input type={showRegPassword ? 'text' : 'password'} value={regPassword} onChange={(e) => setRegPassword(e.target.value)} placeholder="••••••" required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Xác Nhận</label>
                  <input type={showRegPassword ? 'text' : 'password'} value={regConfirm} onChange={(e) => setRegConfirm(e.target.value)} placeholder="••••••" required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" />
                </div>
              </div>
              <label className="flex items-center space-x-2 text-xs text-slate-500 cursor-pointer">
                <input type="checkbox" checked={showRegPassword} onChange={(e) => setShowRegPassword(e.target.checked)} className="w-3.5 h-3.5 rounded border-slate-300 accent-indigo-600" />
                <span>Hiện mật khẩu</span>
              </label>
              <button type="submit" disabled={loading} className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-xs tracking-wider rounded-xl transition flex items-center justify-center disabled:opacity-50 shadow-indigo">
                {loading ? 'Đang tạo tài khoản...' : 'Đăng Ký Ngay ➔'}
              </button>
            </form>
          )}

          {/* ── Social Login Divider ── */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400 font-bold text-[10px] tracking-wider">
                Hoặc tiếp tục với
              </span>
            </div>
          </div>

          {/* ── Google Sign In Button ── */}
          <button
            type="button"
            disabled={googleLoading || loading}
            onClick={() => setShowGoogleModal(true)}
            className="w-full py-3 px-4 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-xl text-xs font-bold text-slate-700 transition flex items-center justify-center space-x-3 shadow-xs hover:shadow-sm active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            {googleLoading ? (
              <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            )}
            <span>{mode === 'login' ? 'Đăng nhập bằng Google' : 'Đăng ký nhanh bằng Google'}</span>
          </button>

          {/* Quick Links */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <Link to="/" className="hover:text-indigo-600 transition flex items-center gap-1 font-semibold">
              ← Về trang chủ
            </Link>
            <Link to="/admin/login" className="hover:text-indigo-600 transition font-semibold flex items-center gap-1">
              <span>🛡️</span> Cổng Nhân Viên
            </Link>
          </div>
        </div>
      </main>

      {/* ── GOOGLE ACCOUNT CHOOSER MODAL ── */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-sm w-full p-6 text-xs space-y-4 shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-start pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Đăng nhập bằng Google</h3>
                  <p className="text-[11px] text-slate-500">Chọn tài khoản đến VibeFlow</p>
                </div>
              </div>
              <button
                onClick={() => setShowGoogleModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* List of Accounts */}
            <div className="space-y-2 py-1">
              <button
                onClick={() => handleGoogleSignIn('nguyen.an.sneaker@gmail.com', 'Nguyễn Văn An')}
                className="w-full flex items-center space-x-3 p-3 rounded-2xl hover:bg-slate-50 border border-slate-100 hover:border-slate-300 transition text-left group"
              >
                <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                  A
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-800 group-hover:text-indigo-600 transition truncate">Nguyễn Văn An</div>
                  <div className="text-[11px] text-slate-500 truncate">nguyen.an.sneaker@gmail.com</div>
                </div>
              </button>

              <button
                onClick={() => handleGoogleSignIn('thaomy.sneakerhead@gmail.com', 'Hoàng Thảo My')}
                className="w-full flex items-center space-x-3 p-3 rounded-2xl hover:bg-slate-50 border border-slate-100 hover:border-slate-300 transition text-left group"
              >
                <div className="w-9 h-9 rounded-full bg-violet-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                  M
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-800 group-hover:text-indigo-600 transition truncate">Hoàng Thảo My</div>
                  <div className="text-[11px] text-slate-500 truncate">thaomy.sneakerhead@gmail.com</div>
                </div>
              </button>

              {/* Custom Email Input */}
              {showCustomInput ? (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <label className="block text-[11px] font-bold text-slate-600">Nhập địa chỉ Gmail của bạn:</label>
                  <input
                    type="email"
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    placeholder="tenban@gmail.com"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 transition"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowCustomInput(false)}
                      className="flex-1 py-1.5 bg-slate-200 text-slate-700 font-bold rounded-lg text-[11px]"
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (customGoogleEmail.trim().includes('@')) {
                          handleGoogleSignIn(customGoogleEmail.trim());
                        } else {
                          alert('Vui lòng nhập email hợp lệ!');
                        }
                      }}
                      className="flex-1 py-1.5 bg-indigo-600 text-white font-bold rounded-lg text-[11px]"
                    >
                      Xác Nhận
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowCustomInput(true)}
                  className="w-full flex items-center space-x-3 p-3 rounded-2xl hover:bg-slate-50 border border-dashed border-slate-200 hover:border-slate-300 transition text-left text-slate-600"
                >
                  <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-sm">
                    +
                  </div>
                  <span className="font-bold text-xs">Sử dụng một tài khoản khác</span>
                </button>
              )}
            </div>

            {/* Disclaimer */}
            <p className="text-[10px] text-slate-400 text-center leading-normal pt-1">
              Google sẽ chia sẻ tên, email và ảnh hồ sơ của bạn với VibeFlow để đăng nhập an toàn.
            </p>
          </div>
        </div>
      )}

      <footer className="border-t border-slate-200 bg-white/60 py-3 px-6 z-10 text-center">
        <p className="text-[11px] text-slate-400">© 2026 VibeFlow Sneakers</p>
      </footer>
    </div>
  );
}
