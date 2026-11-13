import React from 'react';

export default function DeliveryModal({
  showDeliveryModal,
  setShowDeliveryModal,
  deliveryForm,
  setDeliveryForm,
  handleSaveDeliveryModal,
}) {
  if (!showDeliveryModal) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-violet-50 text-violet-600 border border-violet-200 flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
              <span className="italic font-serif">i</span>
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 leading-tight">
                Chỉnh sửa thông tin giao hàng
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                Cập nhật người nhận và địa chỉ giao hàng
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowDeliveryModal(false)}
            className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer p-1"
          >
            ✕
          </button>
        </div>

        {/* Khung 1: Thông tin liên hệ */}
        <div className="border border-slate-200/90 rounded-2xl p-4 bg-white space-y-3 shadow-2xs">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-500 flex items-center justify-center text-sm">
              👤
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-800 leading-none">Thông tin liên hệ</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Thông tin dùng khi giao và liên hệ nhận hàng</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Tên người nhận <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={deliveryForm.recipientName}
                onChange={(e) => setDeliveryForm({ ...deliveryForm, recipientName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50/80 border border-slate-200 focus:bg-white focus:border-violet-500 focus:ring-1 focus:ring-violet-200 rounded-xl text-xs text-slate-800 focus:outline-none transition font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Số điện thoại <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={deliveryForm.recipientPhone}
                onChange={(e) => setDeliveryForm({ ...deliveryForm, recipientPhone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50/80 border border-slate-200 focus:bg-white focus:border-violet-500 focus:ring-1 focus:ring-violet-200 rounded-xl text-xs text-slate-800 focus:outline-none transition font-medium"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Email</label>
            <input
              type="email"
              placeholder="Nhập email nếu có"
              value={deliveryForm.email}
              onChange={(e) => setDeliveryForm({ ...deliveryForm, email: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50/80 border border-slate-200 focus:bg-white focus:border-violet-500 focus:ring-1 focus:ring-violet-200 rounded-xl text-xs text-slate-800 focus:outline-none transition font-medium"
            />
          </div>
        </div>

        {/* Khung 2: Địa chỉ giao hàng */}
        <div className="border border-slate-200/90 rounded-2xl p-4 bg-white space-y-3 shadow-2xs">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">
              📍
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-800 leading-none">Địa chỉ giao hàng</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Chọn địa chỉ đã lưu hoặc nhập địa chỉ khác</p>
            </div>
          </div>

          {/* Lựa chọn 1: Địa chỉ đã lưu mặc định */}
          <div
            onClick={() => setDeliveryForm({ ...deliveryForm, addressMode: 'default' })}
            className={`p-3 rounded-2xl border transition cursor-pointer flex items-start gap-3 ${
              deliveryForm.addressMode === 'default'
                ? 'border-violet-400 bg-violet-50/20 shadow-2xs'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <input
              type="radio"
              name="deliveryAddressChoice"
              checked={deliveryForm.addressMode === 'default'}
              onChange={() => setDeliveryForm({ ...deliveryForm, addressMode: 'default' })}
              className="accent-violet-600 mt-1 cursor-pointer"
            />
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-xs text-slate-900">
                  {deliveryForm.recipientName || 'Trần Vũ Tùng Anh'}
                </span>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Mặc định
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {deliveryForm.recipientPhone || '0383854485'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Chung cư Tỉnh Đội, đường Lam Sơn, Phường Vĩnh Yên, Tỉnh Phú Thọ
              </p>
            </div>
          </div>

          {/* Lựa chọn 2: Sử dụng địa chỉ khác (Tone tím đồng bộ hệ thống VibeFlow) */}
          <div
            onClick={() => setDeliveryForm({ ...deliveryForm, addressMode: 'custom' })}
            className={`p-3 rounded-2xl border transition cursor-pointer flex items-center gap-3 ${
              deliveryForm.addressMode === 'custom'
                ? 'border-violet-300 bg-violet-50/40 shadow-2xs'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <input
              type="radio"
              name="deliveryAddressChoice"
              checked={deliveryForm.addressMode === 'custom'}
              onChange={() => setDeliveryForm({ ...deliveryForm, addressMode: 'custom' })}
              className="accent-violet-600 w-4 h-4 cursor-pointer"
            />
            <span className="text-xs font-bold text-slate-800">
              Sử dụng địa chỉ khác
            </span>
          </div>

          {/* Form chọn Tỉnh / Phường / Địa chỉ cụ thể */}
          <div className="space-y-3 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Tỉnh/Thành phố <span className="text-rose-500">*</span>
                </label>
                <select
                  value={deliveryForm.province}
                  disabled={deliveryForm.addressMode === 'default'}
                  onChange={(e) => setDeliveryForm({ ...deliveryForm, province: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50/80 border border-slate-200 focus:bg-white focus:border-violet-500 focus:ring-1 focus:ring-violet-200 rounded-xl text-xs text-slate-800 focus:outline-none transition font-medium cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <option value="Tỉnh Phú Thọ">Tỉnh Phú Thọ</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Hải Phòng">Hải Phòng</option>
                  <option value="Bắc Ninh">Bắc Ninh</option>
                  <option value="Vĩnh Phúc">Vĩnh Phúc</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Phường/Xã <span className="text-rose-500">*</span>
                </label>
                <select
                  value={deliveryForm.ward}
                  disabled={deliveryForm.addressMode === 'default'}
                  onChange={(e) => setDeliveryForm({ ...deliveryForm, ward: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50/80 border border-slate-200 focus:bg-white focus:border-violet-500 focus:ring-1 focus:ring-violet-200 rounded-xl text-xs text-slate-800 focus:outline-none transition font-medium cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <option value="Phường Vĩnh Yên">Phường Vĩnh Yên</option>
                  <option value="Phường Khai Quang">Phường Khai Quang</option>
                  <option value="Phường Liên Bảo">Phường Liên Bảo</option>
                  <option value="Phường Tích Sơn">Phường Tích Sơn</option>
                  <option value="Phường Tiên Cát">Phường Tiên Cát</option>
                  <option value="Phường Nông Trang">Phường Nông Trang</option>
                  <option value="Phường Gia Cẩm">Phường Gia Cẩm</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Địa chỉ cụ thể <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={deliveryForm.specificAddress}
                disabled={deliveryForm.addressMode === 'default'}
                onChange={(e) => setDeliveryForm({ ...deliveryForm, specificAddress: e.target.value })}
                placeholder="Số nhà, tên đường, tòa nhà..."
                className="w-full px-3.5 py-2.5 bg-slate-50/80 border border-slate-200 focus:bg-white focus:border-violet-500 focus:ring-1 focus:ring-violet-200 rounded-xl text-xs text-slate-800 focus:outline-none transition font-medium disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Footer Modal: Hủy & Lưu thay đổi */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setShowDeliveryModal(false)}
            className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSaveDeliveryModal}
            className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 active:scale-[0.99] text-white font-bold text-xs shadow-md shadow-violet-600/30 transition cursor-pointer"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}
