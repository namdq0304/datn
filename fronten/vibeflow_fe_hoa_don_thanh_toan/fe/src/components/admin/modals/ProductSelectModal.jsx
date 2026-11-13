import React from 'react';
import { INITIAL_PRODUCTS } from '../../../data/mockData';
import { playBeep } from '../utils';

export default function ProductSelectModal({
  showProductSelectModal,
  setShowProductSelectModal,
  currentBillObj,
  productModalSearch,
  setProductModalSearch,
  productModalBrand,
  setProductModalBrand,
  handleAddPosProduct,
  currentBill,
}) {
  if (!showProductSelectModal) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center text-xl font-bold border border-violet-200">
              👟
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Chọn Sản Phẩm Vào Đơn Hàng
              </h3>
              <p className="text-[11px] text-slate-500">
                Đang thêm vào: <b className="text-slate-800 font-mono">{currentBillObj?.code}</b>
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowProductSelectModal(false)}
            className="text-slate-400 hover:text-slate-600 font-bold text-xl cursor-pointer p-1"
          >
            ✕
          </button>
        </div>

        {/* Bộ lọc & Tìm kiếm sản phẩm */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-xs">
              🔍
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên giày, thương hiệu, mã SKU, barcode..."
              value={productModalSearch}
              onChange={(e) => setProductModalSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-100 rounded-xl text-xs text-slate-800 focus:outline-none transition"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {['all', 'Nike', 'Jordan', 'Adidas', 'New Balance'].map((brand) => (
              <button
                key={brand}
                type="button"
                onClick={() => setProductModalBrand(brand)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                  productModalBrand === brand
                    ? 'bg-violet-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {brand === 'all' ? 'Tất cả' : brand}
              </button>
            ))}
          </div>
        </div>

        {/* Danh sách sản phẩm dạng lưới */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto pr-1">
          {INITIAL_PRODUCTS
            .filter((p) => {
              const matchesSearch =
                !productModalSearch ||
                p.name.toLowerCase().includes(productModalSearch.toLowerCase()) ||
                p.brand.toLowerCase().includes(productModalSearch.toLowerCase()) ||
                p.sku.toLowerCase().includes(productModalSearch.toLowerCase()) ||
                p.barcode.includes(productModalSearch);
              const matchesBrand =
                productModalBrand === 'all' ||
                p.brand.toLowerCase() === productModalBrand.toLowerCase();
              return matchesSearch && matchesBrand;
            })
            .map((prod) => (
              <div
                key={prod.id}
                className="p-3 bg-white hover:bg-violet-50/20 border border-slate-200 hover:border-violet-300 rounded-2xl transition flex flex-col justify-between group shadow-2xs"
              >
                <div>
                  <div className="relative overflow-hidden rounded-xl bg-slate-100 mb-2.5 aspect-video">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <span className="absolute top-1.5 right-1.5 bg-white/90 backdrop-blur-xs text-[10px] font-mono px-2 py-0.5 rounded-lg text-slate-700 font-bold border border-slate-200">
                      {prod.sku}
                    </span>
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{prod.brand}</div>
                  <h4 className="font-bold text-xs text-slate-900 line-clamp-1 group-hover:text-violet-600 transition">
                    {prod.name}
                  </h4>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Tồn: <b className="text-emerald-700">{prod.stock} đôi</b> • Size: {prod.sizes.join(', ')}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
                  <span className="font-bold text-xs text-violet-700">
                    {prod.price.toLocaleString('vi-VN')} đ
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      handleAddPosProduct(prod);
                      playBeep();
                    }}
                    className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-2xs transition cursor-pointer flex items-center space-x-1"
                  >
                    <span>+</span>
                    <span>Chọn</span>
                  </button>
                </div>
              </div>
            ))}
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-500">
            Đã có <b>{currentBill?.length || 0}</b> mặt hàng trong giỏ
          </span>
          <button
            type="button"
            onClick={() => setShowProductSelectModal(false)}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 transition cursor-pointer"
          >
            Xong
          </button>
        </div>
      </div>
    </div>
  );
}
