import React from 'react';

export default function AddCustomerModal({
  showAddCustomerModal,
  setShowAddCustomerModal,
  newCustomer,
  setNewCustomer,
  handleAddCustomer,
}) {
  if (!showAddCustomerModal) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-black text-base uppercase text-slate-900">Thêm Khách Hàng Mới</h3>
          <button
            onClick={() => setShowAddCustomerModal(false)}
            className="text-slate-400 hover:text-slate-600 font-bold text-lg"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleAddCustomer} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Họ Và Tên *</label>
            <input
              type="text"
              required
              placeholder="ví dụ: Đỗ Gia Hưng"
              value={newCustomer.name}
              onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-semibold focus:outline-none focus:border-violet-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Số Điện Thoại *</label>
              <input
                type="tel"
                required
                placeholder="0988.777.666"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="giahung@gmail.com"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Giới Tính</label>
              <select
                value={newCustomer.gender}
                onChange={(e) => setNewCustomer({ ...newCustomer, gender: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-violet-500"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Hạng Thành Viên</label>
              <select
                value={newCustomer.rank}
                onChange={(e) => setNewCustomer({ ...newCustomer, rank: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-violet-500"
              >
                <option value="Thành Viên Đồng">Thành Viên Đồng</option>
                <option value="Thành Viên Bạc">Thành Viên Bạc</option>
                <option value="VIP Gold">VIP Gold</option>
                <option value="VIP Kim Cương">VIP Kim Cương</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowAddCustomerModal(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-600 hover:bg-slate-100 transition"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold transition shadow-violet"
            >
              Tạo Hồ Sơ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
