import React from 'react';

export default function AdminFooter({ currentClock, session }) {
  return (
    <footer className="px-5 py-2.5 bg-white border-t border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 z-20 shrink-0">
      {/* Trái: Trạng thái & Đồng hồ */}
      <div className="flex items-center space-x-3 divide-x divide-slate-200">
        <div className="flex items-center space-x-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wide">
            Hệ Thống Trực Tuyến
          </span>
        </div>

        <div className="pl-3 hidden sm:flex items-center space-x-1.5 text-slate-600 font-mono text-[11px]">
          <span>🕒</span>
          <span className="font-semibold text-slate-800">
            {currentClock.toLocaleTimeString('vi-VN')}
          </span>
          <span className="text-slate-400">|</span>
          <span>{currentClock.toLocaleDateString('vi-VN')}</span>
        </div>

        <div className="pl-3 hidden md:flex items-center space-x-1 text-slate-500 text-[11px]">
          <span>🏢</span>
          <span>{session?.branch || 'Chi nhánh 298 Cầu Giấy'}</span>
        </div>
      </div>

      {/* Giữa: Phím tắt nhanh Hotkeys */}
      <div className="hidden xl:flex items-center space-x-2 text-[11px]">
        <span className="text-slate-400 font-medium">Hotkeys:</span>
        <div className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-300 font-mono text-[10px] text-slate-700 font-semibold">[F2] Tìm kiếm</span>
          <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-300 font-mono text-[10px] text-slate-700 font-semibold">[F3] Barcode</span>
          <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-300 font-mono text-[10px] text-slate-700 font-semibold">[F9] Thanh toán</span>
        </div>
      </div>

      {/* Phải: Thông tin phiên bản & Hotline */}
      <div className="flex items-center space-x-4 text-[11px]">
        <div className="flex items-center space-x-1 text-slate-500">
          <span>Ca làm việc:</span>
          <span className="font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-md border border-violet-200">
            {session?.shift || 'Ca Sáng (08:30 - 15:30)'}
          </span>
        </div>

        <div className="hidden sm:flex items-center space-x-1.5 text-slate-400">
          <span>Hỗ trợ:</span>
          <a href="tel:19006868" className="font-bold text-slate-700 hover:text-violet-600 transition">
            1900 6868
          </a>
        </div>

        <span className="text-[10px] text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 font-semibold">
          v1.2.4
        </span>
      </div>
    </footer>
  );
}
