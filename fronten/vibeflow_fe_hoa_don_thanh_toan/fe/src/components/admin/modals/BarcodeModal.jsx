import React from 'react';
import { INITIAL_PRODUCTS } from '../../../data/mockData';

export default function BarcodeModal({
  showBarcodeModal,
  setShowBarcodeModal,
  currentBillObj,
  barcodeInput,
  setBarcodeInput,
  handleBarcodeScan,
}) {
  if (!showBarcodeModal) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-violet-600 text-white flex items-center justify-center text-lg shadow-violet">
              📷
            </div>
            <div>
              <h3 className="font-black text-base uppercase text-slate-900">
                Máy Quét Barcode POS
              </h3>
              <p className="text-[11px] text-slate-400">
                Đang thêm vào đơn tạm: <b className="text-violet-600 font-mono">{currentBillObj?.code}</b>
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowBarcodeModal(false)}
            className="text-slate-400 hover:text-slate-600 font-bold text-xl cursor-pointer p-1"
          >
            ✕
          </button>
        </div>

        {/* Mô phỏng khung ngắm Camera / Scanner Viewfinder */}
        <div className="relative bg-slate-950 rounded-2xl p-6 text-center text-white overflow-hidden border border-slate-800 shadow-inner">
          <div className="absolute inset-0 bg-radial from-violet-900/20 to-transparent pointer-events-none" />

          {/* Animated Laser Scan Line */}
          <div className="absolute left-6 right-6 top-1/2 h-0.5 bg-rose-500 shadow-[0_0_12px_#f43f5e] animate-pulse" />

          <div className="relative z-10 flex flex-col items-center justify-center space-y-2 py-4">
            <span className="font-mono text-3xl tracking-widest text-slate-400 select-none">
              ||| | |||| | ||| | ||
            </span>
            <div className="text-xs font-semibold text-slate-300">
              Hướng máy quét hoặc nhập mã vạch trên hộp giày
            </div>
            <div className="text-[10px] text-emerald-400 font-mono flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span>Sẵn sàng nhận tín hiệu quét tự động</span>
            </div>
          </div>

          {/* 4 Góc ngắm camera viewfinder */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-violet-400" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-violet-400" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-violet-400" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-violet-400" />
        </div>

        {/* Form nhập mã vạch thủ công */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleBarcodeScan();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            placeholder="Nhập hoặc dán mã vạch Barcode (ví dụ: 89385012301)..."
            value={barcodeInput}
            onChange={(e) => setBarcodeInput(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-violet-500"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl shadow-violet transition cursor-pointer"
          >
            Bắn Mã
          </button>
        </form>

        {/* Danh sách mã Barcode mẫu để test nhanh 1-Click */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">
              Mã vạch mẫu các mẫu giày có sẵn (Click để quét thử):
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              {INITIAL_PRODUCTS.length} mẫu
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
            {INITIAL_PRODUCTS.map((prod) => (
              <div
                key={prod.id}
                onClick={() => {
                  handleBarcodeScan(prod.barcode);
                }}
                className="p-2.5 rounded-2xl bg-slate-50 hover:bg-violet-50/80 border border-slate-200 hover:border-violet-300 transition cursor-pointer flex items-center justify-between group shadow-2xs"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate group-hover:text-violet-600 transition">
                      {prod.name}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono flex items-center space-x-1">
                      <span>Mã:</span>
                      <b className="text-violet-700 font-mono">{prod.barcode}</b>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="px-2.5 py-1 bg-white group-hover:bg-violet-600 group-hover:text-white border border-slate-200 group-hover:border-violet-600 rounded-lg text-[10px] font-bold text-slate-700 transition shrink-0 ml-2"
                >
                  Bắn mã
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={() => setShowBarcodeModal(false)}
            className="px-5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 transition text-xs cursor-pointer"
          >
            Đóng Máy Quét
          </button>
        </div>
      </div>
    </div>
  );
}
