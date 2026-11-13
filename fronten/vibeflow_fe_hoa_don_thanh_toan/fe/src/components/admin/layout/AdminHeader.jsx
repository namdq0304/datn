import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminHeader({ isAdmin, session, isSidebarCollapsed, setIsSidebarCollapsed, handleLogout }) {
  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 z-30 shadow-xs">
        <div className="flex items-center space-x-3">
          {/* Toggle Sidebar Button */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition shadow-2xs cursor-pointer"
            title={isSidebarCollapsed ? "Mở rộng thanh menu bên" : "Thu gọn thanh menu bên"}
          >
            <svg className="w-5 h-5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isSidebarCollapsed ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h10M4 18h16" />
              )}
            </svg>
          </button>

          <Link to="/admin" className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-violet text-white">
              <svg className="w-5 h-5" viewBox="0 0 40 40" fill="none">
                <path d="M8 12L15 28L22 12" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 26C18 31 24 32 30 14" stroke="#ddd6fe" strokeWidth="4.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-xl font-black italic tracking-tight">
              <span className="text-slate-800">Vibe</span><span className="text-violet-600">Flow</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <Link
            to="/"
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-900 font-bold transition shadow-xs"
            title="Xem giao diện Cửa Hàng Online của Khách Hàng"
          >
            <span>🛍️</span>
            <span>Cửa Hàng Online</span>
          </Link>

          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{session?.branch || 'Chi nhánh: 298 Cầu Giấy'}</span>
          </div>

          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-violet-600"></span>
            <span>{session?.name || 'Vũ Minh Đức (Admin)'}</span>
          </div>

          <button
            onClick={handleLogout}
            className="text-slate-500 hover:text-rose-600 hover:bg-rose-50 font-bold px-3 py-1.5 rounded-xl transition"
          >
            Đăng Xuất
          </button>
        </div>
      </header>
  );
}
