import React from 'react';

export default function AddEmployeeModal({
  showAddEmployeeModal,
  setShowAddEmployeeModal,
  newEmployee,
  setNewEmployee,
  handleAddEmployee,
}) {
  if (!showAddEmployeeModal) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-black text-base uppercase text-slate-900">Thêm Nhân Viên Mới</h3>
          <button
            onClick={() => setShowAddEmployeeModal(false)}
            className="text-slate-400 hover:text-slate-600 font-bold text-lg"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleAddEmployee} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Họ Và Tên *</label>
            <input
              type="text"
              required
              placeholder="ví dụ: Nguyễn Văn Bảo"
              value={newEmployee.name}
              onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-semibold focus:outline-none focus:border-violet-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Số Điện Thoại *</label>
              <input
                type="tel"
                required
                placeholder="0912.345.678"
                value={newEmployee.phone}
                onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Công Vụ</label>
              <input
                type="email"
                placeholder="nhanvien@vibeflow.vn"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Chức Vụ</label>
              <select
                value={newEmployee.role}
                onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-bold focus:outline-none focus:border-violet-500"
              >
                <option value="NHAN_VIEN">Nhân Viên Thu Ngân POS</option>
                <option value="ADMIN">Quản Trị Viên (ADMIN)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Chi Nhánh</label>
              <select
                value={newEmployee.branch}
                onChange={(e) => setNewEmployee({ ...newEmployee, branch: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-violet-500"
              >
                <option value="298 Cầu Giấy">298 Cầu Giấy (Hà Nội)</option>
                <option value="128 Phố Huế">128 Phố Huế (Hà Nội)</option>
                <option value="256 Lê Văn Sỹ">256 Lê Văn Sỹ (TP.HCM)</option>
                <option value="Online Store">Online Store Omnichannel</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowAddEmployeeModal(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-600 hover:bg-slate-100 transition"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold transition shadow-violet"
            >
              Lưu Nhân Viên
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
