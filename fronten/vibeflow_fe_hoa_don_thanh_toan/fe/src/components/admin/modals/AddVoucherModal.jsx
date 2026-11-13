import React from 'react';

export default function AddVoucherModal({
  showAddVoucherModal,
  setShowAddVoucherModal,
  discountSubTab,
  newVoucher,
  setNewVoucher,
  handleAddVoucher,
}) {
  if (!showAddVoucherModal) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-black text-base uppercase text-slate-900">
            Tạo {discountSubTab === 'vouchers' ? 'Phiếu Giảm Giá (Voucher)' : 'Đợt Khuyến Mãi (Campaign)'}
          </h3>
          <button
            onClick={() => setShowAddVoucherModal(false)}
            className="text-slate-400 hover:text-slate-600 font-bold text-lg"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleAddVoucher} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {discountSubTab === 'vouchers' ? 'Mã Voucher (Code) *' : 'Nhóm Sản Phẩm Áp Dụng'}
              </label>
              <input
                type="text"
                required={discountSubTab === 'vouchers'}
                placeholder={discountSubTab === 'vouchers' ? 'ví dụ: FLASH100K' : 'ví dụ: Dòng Air Jordan'}
                value={newVoucher.code}
                onChange={(e) => setNewVoucher({ ...newVoucher, code: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono font-bold uppercase focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tên Chương Trình / Voucher *</label>
              <input
                type="text"
                required
                placeholder="ví dụ: Giảm giá Giáng Sinh 2026"
                value={newVoucher.name}
                onChange={(e) => setNewVoucher({ ...newVoucher, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {discountSubTab === 'vouchers' ? 'Mức Giảm Giá (VNĐ)' : 'Phần Trăm Giảm Giá (%)'}
              </label>
              <input
                type="number"
                required
                placeholder={discountSubTab === 'vouchers' ? '100000' : '20'}
                value={newVoucher.discount}
                onChange={(e) => setNewVoucher({ ...newVoucher, discount: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Đơn Tối Thiểu (VNĐ)</label>
              <input
                type="number"
                placeholder="1500000"
                value={newVoucher.minOrder}
                onChange={(e) => setNewVoucher({ ...newVoucher, minOrder: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Ngày Hết Hạn</label>
              <input
                type="text"
                placeholder="31/12/2026"
                value={newVoucher.endDate}
                onChange={(e) => setNewVoucher({ ...newVoucher, endDate: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Số Lượng Lượt Áp Dụng</label>
              <input
                type="number"
                placeholder="100"
                value={newVoucher.usageLeft}
                onChange={(e) => setNewVoucher({ ...newVoucher, usageLeft: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowAddVoucherModal(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-600 hover:bg-slate-100 transition"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold transition shadow-violet"
            >
              Phát Hành Giảm Giá
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
