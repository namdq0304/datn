import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';

const STAFF_ROLES = ['ADMIN', 'NHAN_VIEN'];

export default function ProtectedRoute({ children, allowedRoles }) {
  const session     = useAuthStore((s) => s.session);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);

  // ── 1. Chờ persist đọc xong localStorage ──────────────────────────────────
  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-500 font-semibold">Đang khôi phục phiên đăng nhập...</span>
        </div>
      </div>
    );
  }

  // ── 2. Chưa đăng nhập → chuyển đến /admin/login ───────────────────────────
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-violet-50/50 to-indigo-50/40 text-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-200/60 text-center space-y-5">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 border border-violet-200 flex items-center justify-center text-3xl shadow-sm">
            🛡️
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">Yêu Cầu Đăng Nhập</h2>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Khu vực này dành riêng cho <b className="text-slate-700">Quản trị viên</b> và <b className="text-slate-700">Nhân viên</b>.
            </p>
          </div>
          <Link
            to="/admin/login"
            className="block w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold uppercase text-xs rounded-xl transition shadow-violet"
          >
            🔑 Đăng Nhập Nhân Viên ➔
          </Link>
          <Link to="/" className="block text-xs text-slate-400 hover:text-slate-600 transition">
            ← Về trang cửa hàng
          </Link>
        </div>
      </div>
    );
  }

  // ── 3. Kiểm tra role ───────────────────────────────────────────────────────
  const userRole = (session.role || '').toUpperCase();
  const allowed  = allowedRoles ?? STAFF_ROLES;
  const hasPermission = allowed.some((r) => r.toUpperCase() === userRole);

  if (!hasPermission) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-rose-50/40 to-slate-100 text-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-200/60 text-center space-y-4">
          <div className="text-4xl">🚫</div>
          <h2 className="text-lg font-black uppercase text-rose-600">Không Đủ Quyền Truy Cập</h2>
          <p className="text-xs text-slate-600">
            Tài khoản <b className="text-slate-900">{session.name}</b> (vai trò: <b className="text-rose-600">{session.role}</b>) không có quyền vào khu vực này.
          </p>
          <div className="pt-3 flex gap-3">
            <Link to="/" className="flex-1 py-2.5 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-xs font-bold text-slate-700 rounded-xl transition">
              Về Cửa Hàng
            </Link>
            <Link to="/admin/login" className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl transition shadow-violet">
              Đổi Tài Khoản
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
