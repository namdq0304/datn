import React from 'react';

export default function EditItemModal({
  editingCartItemIdx,
  setEditingCartItemIdx,
  currentBill,
  editItemSize,
  setEditItemSize,
  editItemColor,
  setEditItemColor,
  handleSaveEditItem,
}) {
  if (editingCartItemIdx === null || !currentBill || !currentBill[editingCartItemIdx]) {
    return null;
  }

  const item = currentBill[editingCartItemIdx];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-sm text-slate-900">Chỉnh Sửa Sản Phẩm</h3>
          <button
            onClick={() => setEditingCartItemIdx(null)}
            className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="flex items-center space-x-3 p-2 bg-slate-50 rounded-xl">
          <img
            src={item.product?.image}
            alt=""
            className="w-12 h-12 rounded-lg object-cover shrink-0"
          />
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-900 truncate">
              {item.product?.name}
            </div>
            <div className="text-[11px] text-violet-700 font-bold">
              {item.unitPrice?.toLocaleString('vi-VN')} đ
            </div>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-600 font-semibold mb-1">Kích cỡ (Size):</label>
            <div className="flex flex-wrap gap-1.5">
              {(item.product?.sizes || ['36', '37', '38', '39', '40', '41', '42']).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setEditItemSize(sz)}
                  className={`px-3 py-1.5 rounded-lg font-bold border transition cursor-pointer ${
                    editItemSize === sz
                      ? 'bg-violet-600 text-white border-violet-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Màu sắc:</label>
            <div className="flex flex-wrap gap-1.5">
              {(item.product?.colors || ['Đỏ', 'Trắng', 'Đen']).map((col) => (
                <button
                  key={col}
                  type="button"
                  onClick={() => setEditItemColor(col)}
                  className={`px-3 py-1.5 rounded-lg font-bold border transition cursor-pointer ${
                    editItemColor === col
                      ? 'bg-violet-600 text-white border-violet-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {col}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setEditingCartItemIdx(null)}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSaveEditItem}
            className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs transition shadow-2xs"
          >
            Lưu Thay Đổi
          </button>
        </div>
      </div>
    </div>
  );
}
