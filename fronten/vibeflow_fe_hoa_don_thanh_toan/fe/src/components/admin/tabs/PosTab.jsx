import React from 'react';
import { DEFAULT_BEST_VOUCHER } from '../constants';
import { playBeep, formatCountdown } from '../utils';
import { AdminPageHeader } from '../common';

export default function PosTab({
  posBills,
  activeBillId,
  setActiveBillId,
  currentBillObj,
  currentBill,
  currentCustomer,
  totalItemCount,
  billSubtotal,
  voucherDiscount,
  totalDiscount,
  billTotal,
  changeDue,
  posCustomerSearch,
  setPosCustomerSearch,
  showCustomerDropdown,
  setShowCustomerDropdown,
  customerDropdownRef,
  filteredPosCustomers,
  qrCountdown,
  setQrCountdown,
  isQrPaid,
  handleCreateNewBill,
  handleCloseBill,
  handleUpdatePosQty,
  handleRemovePosItem,
  handleOpenEditItemModal,
  handleOpenDeliveryModal,
  updateCurrentBillField,
  handleConfirmQrPayment,
  handleCancelCurrentBill,
  handlePosCheckout,
  setShowBarcodeModal,
  setShowProductSelectModal,
  setShowAddCustomerModal,
}) {
  return (
    <div className="space-y-5 max-w-[1600px] mx-auto pb-12">
      {/* ── TIÊU ĐỀ TRANG ĐỒNG BỘ TONE TÍM VIBEFLOW ── */}
      <AdminPageHeader
        category="Bán Hàng & Thu Ngân"
        title="Bán Hàng Tại Quầy"
        badgeVariant="violet"
        subtitle="Giao dịch quét mã Barcode, chọn kích cỡ, thanh toán VietQR động và in hóa đơn tại quầy."
        metrics={[
          { label: 'Hóa đơn chờ', value: `${posBills.length}/5`, highlight: true },
          { label: 'Hệ thống', value: 'Sẵn sàng', dotColor: 'bg-emerald-500', pulse: true },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* ── CỘT TRÁI: HÓA ĐƠN CHỜ & BẢNG GIỎ HÀNG ── */}
      <div className="lg:col-span-8 space-y-4">
        {/* CARD 1: HÓA ĐƠN CHỜ */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleCreateNewBill}
              disabled={posBills.length >= 5}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
            >
              <span className="text-sm font-bold leading-none">+</span>
              <span>Thêm hóa đơn chờ</span>
            </button>
            <span className="text-xs text-slate-500 bg-slate-100 rounded-full px-3 py-1 font-medium">
              {posBills.length}/5 hóa đơn
            </span>
          </div>

          {/* Danh sách tab hóa đơn chờ */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {posBills.map((b) => {
              const isActive = activeBillId === b.id;
              const totalQty = b.items.reduce((s, i) => s + i.qty, 0);
              return (
                <div
                  key={b.id}
                  onClick={() => setActiveBillId(b.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer select-none shrink-0 ${
                    isActive
                      ? 'border-2 border-violet-500 bg-violet-50/50 text-violet-900 shadow-xs'
                      : 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span>{b.code} ({totalQty}SP)</span>
                  {posBills.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => handleCloseBill(b.id, e)}
                      title="Đóng hóa đơn này"
                      className="text-slate-400 hover:text-violet-700 font-bold ml-1 text-xs cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CARD 2: GIỎ HÀNG DẠNG BẢNG CHI TIẾT */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4 min-h-[480px] flex flex-col justify-between">
          <div className="space-y-4">
            {/* Header Giỏ hàng */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <h3 className="font-bold text-slate-900 text-base">Giỏ hàng</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200">
                  {totalItemCount} sản phẩm
                </span>
              </div>
              <div className="flex items-center gap-2">
                {/* Nút Barcode / Máy quét ảnh */}
                <button
                  type="button"
                  onClick={() => setShowBarcodeModal(true)}
                  title="Quét Barcode / QR máy ảnh"
                  className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-300 hover:border-violet-400 bg-white hover:bg-slate-50 text-slate-700 hover:text-violet-600 transition cursor-pointer shadow-2xs"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </button>
                {/* Nút + Chọn sản phẩm (Đồng bộ tone tím) */}
                <button
                  type="button"
                  onClick={() => setShowProductSelectModal(true)}
                  className="px-3.5 py-2 rounded-xl border border-violet-300 hover:border-violet-500 bg-white hover:bg-violet-50/50 text-violet-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                >
                  <span className="text-sm leading-none">+</span>
                  <span>Chọn sản phẩm</span>
                </button>
              </div>
            </div>

            {/* Bảng Giỏ hàng */}
            {currentBill.length === 0 ? (
              <div className="py-24 text-center text-slate-400 text-xs space-y-2">
                <div className="text-4xl mb-1">🛒</div>
                <p className="font-semibold text-slate-600">Giỏ hàng đang trống</p>
                <p className="text-[11px] text-slate-400">
                  Bấm "+ Chọn sản phẩm" hoặc nút quét Barcode để thêm sản phẩm vào đơn
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                      <th className="py-3 px-3 text-center w-12 rounded-l-xl">STT</th>
                      <th className="py-3 px-3">Mã sản phẩm</th>
                      <th className="py-3 px-3">Tên sản phẩm</th>
                      <th className="py-3 px-3">Màu sắc</th>
                      <th className="py-3 px-3">Kích cỡ</th>
                      <th className="py-3 px-3 text-center">Số lượng</th>
                      <th className="py-3 px-3">Đơn giá</th>
                      <th className="py-3 px-3 text-center rounded-r-xl">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentBill.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 transition">
                        <td className="py-3.5 px-3 text-center text-slate-500 font-medium">{idx + 1}</td>
                        <td className="py-3.5 px-3 font-mono font-medium text-slate-700">
                          {item.product.sku || `G${item.product.id}7664`}
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-8 h-8 rounded-lg object-cover bg-slate-100 shrink-0"
                            />
                            <span className="font-semibold text-slate-800 line-clamp-1">{item.product.name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-slate-600 font-medium">{item.color}</td>
                        <td className="py-3.5 px-3 font-medium text-slate-800">{item.size}</td>
                        <td className="py-3.5 px-3">
                          <div className="flex items-center justify-center space-x-1.5">
                            <button
                              type="button"
                              onClick={() => handleUpdatePosQty(idx, -1)}
                              className="w-5 h-5 bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-100 font-bold flex items-center justify-center transition cursor-pointer"
                            >
                              -
                            </button>
                            <span className="w-6 text-center font-bold text-slate-900">{item.qty}</span>
                            <button
                              type="button"
                              onClick={() => handleUpdatePosQty(idx, 1)}
                              className="w-5 h-5 bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-100 font-bold flex items-center justify-center transition cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 font-semibold text-slate-800">
                          {(item.unitPrice * item.qty).toLocaleString('vi-VN')} đ
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <div className="flex items-center justify-center gap-2.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditItemModal(idx)}
                              title="Chỉnh sửa size / màu sắc"
                              className="text-slate-400 hover:text-violet-700 text-xs transition cursor-pointer p-1"
                            >
                              ✏️
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemovePosItem(idx)}
                              title="Xóa sản phẩm"
                              className="text-slate-400 hover:text-red-500 text-xs transition cursor-pointer p-1"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* CARD 3: THÔNG TIN GIAO HÀNG (Hiển thị khi bật Giao hàng) */}
        {currentBillObj.isDelivery && (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center space-x-2">
                <span className="text-violet-600 text-base">🚚</span>
                <h4 className="font-bold text-slate-900 text-sm">Thông tin giao hàng</h4>
              </div>
              <button
                type="button"
                onClick={handleOpenDeliveryModal}
                className="text-xs font-bold text-violet-600 hover:text-violet-700 hover:underline cursor-pointer"
              >
                Chỉnh sửa
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-xs text-slate-500 font-medium">Người nhận</label>
                <div className="w-full px-3.5 py-2.5 rounded-xl text-xs text-slate-800 bg-slate-50/80 border border-slate-200/80 font-medium">
                  {currentBillObj.deliveryInfo?.recipientName || (currentCustomer?.id !== 'WALK_IN' ? currentCustomer?.name : 'Trần Vũ Tùng Anh')}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-500 font-medium">Số điện thoại</label>
                <div className="w-full px-3.5 py-2.5 rounded-xl text-xs text-slate-800 bg-slate-50/80 border border-slate-200/80 font-medium">
                  {currentBillObj.deliveryInfo?.recipientPhone || (currentCustomer?.id !== 'WALK_IN' ? currentCustomer?.phone : '0383854485')}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-500 font-medium">Địa chỉ giao hàng</label>
              <div className="w-full px-3.5 py-2.5 rounded-xl text-xs text-slate-800 bg-slate-50/80 border border-slate-200/80 font-medium">
                {currentBillObj.deliveryInfo?.address || 'Chung cư Tỉnh Đội, đường Lam Sơn, Phường Vĩnh Yên, Tỉnh Phú Thọ'}
              </div>
              <div className="text-[11px] text-slate-400 pt-0.5">
                Phí GHN ước tính theo các tuyến có...
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── CỘT PHẢI: KHÁCH HÀNG & THÔNG TIN ĐƠN HÀNG (Chuẩn ảnh 100%) ── */}
      <div className="lg:col-span-4 space-y-4 h-fit">
        {/* CARD 1: KHÁCH HÀNG */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold text-slate-900">Khách hàng</div>
            {currentBillObj.customer && (
              <button
                type="button"
                onClick={() => {
                  updateCurrentBillField({ customer: null });
                  setPosCustomerSearch('');
                }}
                className="text-xs font-medium text-slate-500 hover:text-violet-600 transition cursor-pointer"
              >
                Bỏ chọn
              </button>
            )}
          </div>

          {currentBillObj.customer ? (
            <div className="space-y-0.5 pt-1">
              <div className="font-bold text-slate-900 text-sm">
                {currentBillObj.customer.name}
              </div>
              <div className="text-xs text-slate-500 font-medium">
                {currentBillObj.customer.phone}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="relative flex-1" ref={customerDropdownRef}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Nhập tên hoặc số điện thoại khách hàng"
                    value={posCustomerSearch}
                    onFocus={() => setShowCustomerDropdown(true)}
                    onChange={(e) => {
                      setPosCustomerSearch(e.target.value);
                      setShowCustomerDropdown(true);
                    }}
                    className="w-full pl-3.5 pr-8 py-2.5 bg-white border border-slate-200 hover:border-violet-300 focus:border-violet-500 focus:ring-1 focus:ring-violet-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none transition shadow-2xs font-medium"
                  />
                  {posCustomerSearch && (
                    <button
                      type="button"
                      onClick={() => {
                        setPosCustomerSearch('');
                        updateCurrentBillField({ customer: null });
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-600 text-xs font-bold cursor-pointer p-0.5"
                      title="Xóa lựa chọn khách hàng"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Dropdown danh sách khách hàng chuẩn 100% theo ảnh */}
                {showCustomerDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl z-30 max-h-64 overflow-y-auto divide-y divide-slate-100">
                    {filteredPosCustomers.length > 0 ? (
                      filteredPosCustomers.map((c) => (
                        <div
                          key={c.id}
                          onClick={() => {
                            updateCurrentBillField({
                              customer: c,
                              deliveryInfo: {
                                ...currentBillObj.deliveryInfo,
                                recipientName: c.name,
                                recipientPhone: c.phone
                              }
                            });
                            setPosCustomerSearch('');
                            setShowCustomerDropdown(false);
                          }}
                          className="px-4 py-3 hover:bg-slate-50 cursor-pointer transition text-left"
                        >
                          <div className="font-bold text-slate-900 text-xs sm:text-sm leading-tight">
                            {c.name}
                          </div>
                          <div className="text-[11px] sm:text-xs text-slate-500 mt-1 font-medium">
                            {c.phone}{c.email ? ` - ${c.email}` : ''}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-slate-400">
                        Không tìm thấy khách hàng nào với "{posCustomerSearch}"
                      </div>
                    )}

                    {/* Thêm mới nhanh */}
                    <div
                      onClick={() => {
                        setShowCustomerDropdown(false);
                        setShowAddCustomerModal(true);
                      }}
                      className="p-2.5 bg-slate-50 hover:bg-violet-50 text-violet-600 rounded-b-2xl text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer transition border-t border-slate-100"
                    >
                      <span>+</span>
                      <span>Thêm mới khách hàng</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Nút + viền tím nhạt đồng bộ hệ thống VibeFlow */}
              <button
                type="button"
                onClick={() => setShowAddCustomerModal(true)}
                title="Thêm mới thông tin khách hàng"
                className="w-10 h-10 rounded-xl border border-violet-200 bg-violet-50 hover:bg-violet-100 text-violet-600 hover:text-violet-700 font-bold text-xl flex items-center justify-center transition shadow-2xs cursor-pointer shrink-0"
              >
                +
              </button>
            </div>
          )}
        </div>

        {/* CARD 2: THÔNG TIN ĐƠN HÀNG */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="text-sm font-bold text-slate-900">Thông tin đơn hàng</div>

          {/* Block Voucher: Màu xanh mint chuẩn ảnh */}
          {currentBillObj.appliedVoucher ? (
            <div className="bg-[#f2faf5] border border-emerald-200/60 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-emerald-800 font-bold">
                  <span className="w-4 h-4 rounded-full border border-emerald-600 flex items-center justify-center text-[10px] text-emerald-700 font-bold">
                    ✓
                  </span>
                  <span>{currentBillObj.appliedVoucher.title || 'Đang áp dụng voucher tốt nhất'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => updateCurrentBillField({ appliedVoucher: null })}
                  className="text-emerald-600/70 hover:text-emerald-900 font-bold text-xs cursor-pointer p-0.5"
                  title="Bỏ áp dụng voucher"
                >
                  ✕
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="font-mono font-bold text-slate-800 text-sm tracking-wide">
                  {currentBillObj.appliedVoucher.code}
                </span>
                <span className="bg-emerald-100/90 text-emerald-800 font-bold text-xs px-2 py-0.5 rounded-md">
                  {currentBillObj.appliedVoucher.discountPercent
                    ? `${currentBillObj.appliedVoucher.discountPercent}%`
                    : `${(currentBillObj.appliedVoucher.discount || 0).toLocaleString('vi-VN')} đ`}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-emerald-100/80">
                <span className="text-slate-500">Giá trị giảm:</span>
                <span className="text-emerald-700 font-bold">
                  -{voucherDiscount.toLocaleString('vi-VN')} đ
                </span>
              </div>
            </div>
          ) : (
            <div
              onClick={() => updateCurrentBillField({ appliedVoucher: DEFAULT_BEST_VOUCHER })}
              className="p-3 bg-slate-50 hover:bg-emerald-50/50 border border-dashed border-slate-300 hover:border-emerald-300 rounded-2xl flex items-center justify-between text-xs transition cursor-pointer"
            >
              <span className="text-slate-500 font-medium">🎟️ Chưa áp dụng mã giảm giá</span>
              <span className="text-emerald-700 font-bold hover:underline">+ Áp dụng voucher tốt nhất</span>
            </div>
          )}

          {/* Dòng Tiêu đề phụ xanh lá "Thông tin đơn hàng" & Switch "Giao hàng" */}
          <div className="flex items-center justify-between pt-1">
            <span className="font-bold text-emerald-700 text-xs">Thông tin đơn hàng</span>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500">Giao hàng</span>
              <button
                type="button"
                onClick={() => updateCurrentBillField({ isDelivery: !currentBillObj.isDelivery })}
                className={`w-9 h-5 rounded-full transition-colors relative focus:outline-none cursor-pointer ${
                  currentBillObj.isDelivery ? 'bg-emerald-500' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-white shadow-xs transform transition-transform ${
                    currentBillObj.isDelivery ? 'translate-x-4.5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Tổng tiền hàng, Tiền giảm, GHN Phí vận chuyển, Khách cần trả */}
          <div className="space-y-2 text-xs pt-1">
            <div className="flex items-center justify-between text-slate-600">
              <span>Tổng tiền hàng ({totalItemCount} sản phẩm):</span>
              <span className="font-bold text-slate-900">{billSubtotal.toLocaleString('vi-VN')} đ</span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>Tiền giảm</span>
              <span className="font-bold text-emerald-700">
                {totalDiscount > 0 ? `-${totalDiscount.toLocaleString('vi-VN')} đ` : '0 đ'}
              </span>
            </div>

            {/* GHN Phí vận chuyển */}
            {currentBillObj.isDelivery && (
              <div className="flex items-center justify-between text-xs py-1 border-y border-slate-100">
                <div className="flex items-center space-x-1.5">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-[10px] tracking-tight italic shadow-2xs">
                    GHN
                  </span>
                  <span className="text-slate-600 font-medium">Phí vận chuyển</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="px-2.5 py-0.5 rounded-lg border border-emerald-300 bg-emerald-50/50 text-emerald-800 font-bold text-xs font-mono">
                    {(currentBillObj.deliveryInfo?.fee || 31000).toLocaleString('vi-VN')} đ
                  </span>
                  <button
                    type="button"
                    title="Tính lại phí vận chuyển GHN"
                    onClick={() => playBeep()}
                    className="text-orange-500 hover:text-orange-600 font-bold text-xs cursor-pointer p-0.5 hover:rotate-180 transition duration-300"
                  >
                    🔄
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-slate-900 pt-1">
              <span className="font-medium text-slate-700">Khách cần trả</span>
              <span className="font-bold text-slate-900 text-sm sm:text-base">
                {billTotal.toLocaleString('vi-VN')} đ
              </span>
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* Hình thức thanh toán (Radio: Tiền mặt, Chuyển khoản, Kết hợp) */}
          <div className="space-y-2">
            <div className="text-xs text-slate-600 font-medium">Hình thức thanh toán</div>
            <div className="flex items-center gap-4 text-xs text-slate-700">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name={`paymentMethod-${activeBillId}`}
                  value="cash"
                  checked={currentBillObj.paymentMethod === 'cash'}
                  onChange={() => updateCurrentBillField({ paymentMethod: 'cash' })}
                  className="accent-violet-600 w-3.5 h-3.5 cursor-pointer"
                />
                <span className={currentBillObj.paymentMethod === 'cash' ? 'font-bold text-slate-900' : ''}>
                  Tiền mặt
                </span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name={`paymentMethod-${activeBillId}`}
                  value="transfer"
                  checked={currentBillObj.paymentMethod === 'transfer'}
                  onChange={() => {
                    updateCurrentBillField({ paymentMethod: 'transfer' });
                    setQrCountdown(297);
                  }}
                  className="accent-violet-600 w-3.5 h-3.5 cursor-pointer"
                />
                <span className={currentBillObj.paymentMethod === 'transfer' ? 'font-bold text-slate-900' : ''}>
                  Chuyển khoản
                </span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name={`paymentMethod-${activeBillId}`}
                  value="split"
                  checked={currentBillObj.paymentMethod === 'split'}
                  onChange={() => updateCurrentBillField({ paymentMethod: 'split' })}
                  className="accent-violet-600 w-3.5 h-3.5 cursor-pointer"
                />
                <span className={currentBillObj.paymentMethod === 'split' ? 'font-bold text-slate-900' : ''}>
                  Kết hợp
                </span>
              </label>
            </div>
          </div>

          {/* KHI CHỌN CHUYỂN KHOẢN: HIỂN THỊ TRỰC TIẾP KHUNG QUÉT MÃ VIETQR TRONG SIDEBAR */}
          {currentBillObj.paymentMethod === 'transfer' ? (
            <div className="w-full bg-slate-50/50 border border-slate-200/90 rounded-2xl p-4 flex flex-col items-center text-center shadow-2xs space-y-2 animate-in fade-in duration-200">
              <h4 className="font-bold text-slate-800 text-xs sm:text-sm">
                Quét mã QR để thanh toán
              </h4>

              {/* Logo VietQR */}
              <div className="flex items-center justify-center gap-0.5 pt-0.5">
                <span className="text-[#e60012] font-black italic tracking-tighter text-lg sm:text-xl">Viet</span>
                <span className="text-[#005baa] font-black tracking-tight text-lg sm:text-xl">QR</span>
              </div>

              {/* Khung mã QR code */}
              <div className="relative w-40 h-40 sm:w-44 sm:h-44 bg-white flex items-center justify-center p-1 rounded-xl shadow-2xs border border-slate-100">
                <img
                  src={`https://img.vietqr.io/image/MB-094502828-qr_only.png?amount=${billTotal}&addInfo=${encodeURIComponent(currentBillObj.code || 'HD')}&accountName=TRAN%20VU%20TUNG%20ANH`}
                  alt="VietQR MBBank"
                  onError={(e) => {
                    e.currentTarget.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`2|99|094502828|TRAN VU TUNG ANH|MB|0|0|${billTotal}|${currentBillObj.code}`)}`;
                  }}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Thông tin chuyển khoản dưới mã QR */}
              <div className="flex flex-col items-center text-center space-y-0.5 pt-1">
                <div className="flex items-center justify-center gap-2 mb-0.5">
                  <span className="font-bold text-xs tracking-tight">
                    <span className="italic text-[#0066b2]">napas</span>
                    <span className="italic text-[#00a3e0] ml-0.5">247</span>
                  </span>
                  <span className="text-slate-300 font-light">|</span>
                  <div className="flex items-center gap-1">
                    <span className="text-red-500 font-bold text-xs">★</span>
                    <span className="font-black text-xs text-[#002855] tracking-tight">MB</span>
                  </div>
                </div>

                <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wide">
                  TRAN VU TUNG ANH
                </div>
                <div className="text-[11px] text-slate-500 font-mono font-medium">
                  094502828
                </div>
                <div className="text-[11px] text-slate-700 font-medium pt-0.5">
                  Số tiền: <span className="font-bold text-slate-900">{billTotal.toLocaleString('vi-VN')} VND</span>
                </div>
              </div>

              {/* Countdown hết hạn */}
              <div className="pt-1 text-xs text-slate-700 font-medium flex items-center gap-1">
                <span>QR sẽ hết hạn sau:</span>
                <span className="text-[#e60012] font-bold font-mono text-xs">
                  {formatCountdown(qrCountdown)}
                </span>
              </div>

              {/* Nút "Đã thanh toán" đỏ rực */}
              <button
                type="button"
                onClick={handleConfirmQrPayment}
                className={`w-full py-2.5 rounded-xl text-white font-bold text-xs sm:text-sm shadow-md transition cursor-pointer text-center active:scale-[0.99] ${
                  isQrPaid
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25'
                    : 'bg-violet-600 hover:bg-violet-700 shadow-violet-600/25'
                }`}
              >
                {isQrPaid ? '✓ Đã thanh toán thành công' : 'Đã thanh toán'}
              </button>
            </div>
          ) : (
            <>
              {/* Khách thanh toán */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                  <span>Khách thanh toán</span>
                  {billTotal > 0 && (
                    <button
                      type="button"
                      onClick={() => updateCurrentBillField({ customerPaid: String(billTotal) })}
                      className="text-[10px] text-violet-600 hover:underline font-bold cursor-pointer"
                    >
                      Đưa đúng tiền
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Nhập số tiền khách đưa"
                  value={currentBillObj.customerPaid ? Number(currentBillObj.customerPaid).toLocaleString('vi-VN') : ''}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '');
                    updateCurrentBillField({ customerPaid: raw });
                  }}
                  className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none transition shadow-2xs"
                />
              </div>

              {/* Tiền thừa trả khách */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Tiền thừa trả khách</span>
                <span className="font-bold text-slate-900">{changeDue.toLocaleString('vi-VN')} đ</span>
              </div>
            </>
          )}

          {/* Ghi chú thanh toán */}
          <div className="space-y-1.5">
            <div className="text-xs text-slate-600 font-medium">Ghi chú thanh toán</div>
            <textarea
              rows={2}
              placeholder="Ghi chú thêm nếu cần"
              value={currentBillObj.note || ''}
              onChange={(e) => updateCurrentBillField({ note: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none transition shadow-2xs resize-none"
            />
          </div>

          {/* Nút hành động: Hủy hóa đơn (Xám) & Thanh toán (Tím VibeFlow chuẩn thương hiệu) */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancelCurrentBill}
              className="flex-1 py-3 px-4 bg-[#e2e8f0] hover:bg-slate-300 active:scale-[0.99] text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer shadow-2xs text-center border border-slate-200"
            >
              Hủy hóa đơn
            </button>
            <button
              type="button"
              onClick={handlePosCheckout}
              className="flex-1 py-3 px-4 bg-violet-600 hover:bg-violet-700 active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-md shadow-violet-600/30 transition cursor-pointer text-center"
            >
              Thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  );


}
