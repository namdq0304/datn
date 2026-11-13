import React from 'react';

export default function ProductDetailModal({ product, onClose }) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold text-sm">
              👁
            </span>
            <h3 className="font-bold text-base text-slate-900">Chi Tiết Sản Phẩm</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-2xl flex items-center space-x-3 border border-slate-100">
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
              />
            )}
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 font-bold">
                {product.sku}
              </span>
              <h4 className="font-bold text-sm text-slate-900 mt-1 line-clamp-1">{product.name}</h4>
              <p className="text-[11px] text-slate-500">{product.brand} • {product.category || 'Sneakers'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-slate-600">
            <div className="p-2.5 bg-slate-50 rounded-xl">
              <span className="text-[10px] text-slate-400 block">Số lượng tồn kho</span>
              <b className="text-slate-900 text-sm">{product.stock} đôi</b>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl">
              <span className="text-[10px] text-slate-400 block">Trạng thái</span>
              <b className={product.status === 'Kinh doanh' ? 'text-emerald-600' : 'text-slate-500'}>
                {product.status || 'Kinh doanh'}
              </b>
            </div>
          </div>

          <div className="p-3 bg-violet-50/60 border border-violet-100 rounded-2xl">
            <span className="text-[10px] text-violet-600 font-semibold block">Giá bán</span>
            <div className="flex items-baseline space-x-2">
              <span className="font-bold text-base text-violet-600">
                {product.priceFormatted || `${product.price?.toLocaleString('vi-VN')} đ`}
              </span>
              {product.originalPriceFormatted && (
                <span className="text-xs text-slate-400 line-through">{product.originalPriceFormatted}</span>
              )}
            </div>
          </div>

          {product.description && (
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
              <span className="text-[10px] text-slate-400 font-semibold block mb-1">Mô tả sản phẩm</span>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{product.description}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-xs transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
