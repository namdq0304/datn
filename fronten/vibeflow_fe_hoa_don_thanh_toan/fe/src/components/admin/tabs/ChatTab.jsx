import React from 'react';
import { AdminPageHeader } from '../common';

export default function ChatTab() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* ── TIÊU ĐỀ TRANG ĐỒNG BỘ TONE TÍM VIBEFLOW ── */}
      <AdminPageHeader
        category="Hỗ Trợ & Chăm Sóc"
        title="Live Chat CSKH"
        badgeVariant="emerald"
        subtitle="Kênh phản hồi và tư vấn trực tiếp khách hàng trực tuyến và hỗ trợ quầy bán lẻ."
        metrics={[
          { label: 'Kênh chat', value: 'Trực tuyến', dotColor: 'bg-emerald-500', pulse: true },
          { label: 'Thời gian phản hồi', value: '< 1 phút' },
        ]}
      />

      {/* Khung chat trực quan */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 text-xs space-y-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold text-sm shadow-2xs">
              👟
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Hộp Thoại Khách Hàng Web</h3>
              <p className="text-[11px] text-slate-400">Phiên tư vấn tự động kết nối chi nhánh Cầu Giấy</p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Đang trực tuyến</span>
          </span>
        </div>

        <div className="h-64 bg-slate-50/70 rounded-xl p-4 overflow-y-auto space-y-3 border border-slate-200">
          <div className="text-slate-400 text-[10px] text-center font-mono">Hôm nay 14:10</div>
          <div className="bg-white border border-slate-200 p-3.5 rounded-2xl rounded-tl-none max-w-md text-slate-800 shadow-2xs">
            <b className="text-slate-900 block mb-0.5">Khách hàng (Trần Minh Tuấn):</b>
            Shop còn Nike Air Jordan Low Wolf Grey size 42 ở chi nhánh Cầu Giấy không ạ?
          </div>
          <div className="bg-violet-600 text-white p-3.5 rounded-2xl rounded-tr-none max-w-md ml-auto font-medium shadow-md shadow-violet-600/20">
            <b className="block text-violet-200 text-[11px] mb-0.5">Thu ngân (VibeFlow CSKH):</b>
            Dạ chào bạn Tuấn, mẫu Jordan Wolf Grey size 42 hiện chi nhánh 298 Cầu Giấy còn sẵn 2 đôi trong kho bạn nhé! Shop có thể giữ hàng cho bạn đến tối nay ạ.
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="text"
            placeholder="Nhập tin nhắn phản hồi khách hàng..."
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-violet-500 focus:bg-white transition"
          />
          <button
            type="button"
            className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl shadow-sm shadow-violet-500/25 transition cursor-pointer"
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
}
