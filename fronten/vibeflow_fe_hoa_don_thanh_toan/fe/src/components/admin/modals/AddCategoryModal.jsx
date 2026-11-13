import React from 'react';

export default function AddCategoryModal({
  showAddCategoryModal,
  setShowAddCategoryModal,
  categorySubTab,
  newCatItem,
  setNewCatItem,
  handleAddCategory,
}) {
  if (!showAddCategoryModal) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-black text-base uppercase text-slate-900">
            Thêm{' '}
            {categorySubTab === 'colors'
              ? 'Màu Sắc Mới'
              : categorySubTab === 'materials'
              ? 'Chất Liệu Mới'
              : categorySubTab === 'brands'
              ? 'Thương Hiệu Mới'
              : categorySubTab === 'sizes'
              ? 'Kích Cỡ Size Mới'
              : 'Hình Ảnh Thư Viện'}
          </h3>
          <button
            onClick={() => setShowAddCategoryModal(false)}
            className="text-slate-400 hover:text-slate-600 font-bold text-lg"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleAddCategory} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              {categorySubTab === 'sizes'
                ? 'Kích Cỡ Size EU (ví dụ: 41, 42.5)'
                : categorySubTab === 'images'
                ? 'Tiêu Đề / Tên Bức Ảnh *'
                : 'Tên Thuộc Tính *'}
            </label>
            <input
              type="text"
              required
              placeholder={
                categorySubTab === 'colors'
                  ? 'ví dụ: Vàng Mustard'
                  : categorySubTab === 'materials'
                  ? 'ví dụ: Da Lộn Premium'
                  : categorySubTab === 'brands'
                  ? 'ví dụ: Asics'
                  : categorySubTab === 'sizes'
                  ? '42'
                  : 'ví dụ: Air Jordan 1 High góc nghiêng 45°'
              }
              value={newCatItem.name}
              onChange={(e) => setNewCatItem({ ...newCatItem, name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-semibold focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              {categorySubTab === 'sizes'
                ? 'Size US quy đổi (ví dụ: 8.5)'
                : categorySubTab === 'images'
                ? 'Mã Ảnh (ví dụ: IMG-AJ1-07)'
                : 'Mã Định Danh (Tùy chọn)'}
            </label>
            <input
              type="text"
              placeholder={
                categorySubTab === 'colors'
                  ? 'COL-YEL'
                  : categorySubTab === 'materials'
                  ? 'MAT-SUE'
                  : categorySubTab === 'brands'
                  ? 'BRD-ASC'
                  : categorySubTab === 'sizes'
                  ? '8.5'
                  : 'IMG-AJ1-07'
              }
              value={newCatItem.code}
              onChange={(e) => setNewCatItem({ ...newCatItem, code: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-violet-500 font-mono"
            />
          </div>

          {categorySubTab === 'images' && (
            <>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Sản Phẩm Hoặc Thuộc Tính Liên Kết</label>
                <input
                  type="text"
                  placeholder="ví dụ: Nike Dunk Low Panda / Chi tiết đế giày"
                  value={newCatItem.extra}
                  onChange={(e) => setNewCatItem({ ...newCatItem, extra: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-violet-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">URL Hình Ảnh Sneaker *</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/photo-..."
                    value={newCatItem.image}
                    onChange={(e) => setNewCatItem({ ...newCatItem, image: e.target.value })}
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-violet-500 font-mono text-[11px]"
                  />
                  {newCatItem.image && (
                    <img
                      src={newCatItem.image}
                      alt="Preview"
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                  )}
                </div>
              </div>
            </>
          )}

          {categorySubTab === 'colors' && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">Mã Màu HEX</label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={newCatItem.hex}
                  onChange={(e) => setNewCatItem({ ...newCatItem, hex: e.target.value })}
                  className="w-10 h-10 rounded-xl border border-slate-300 cursor-pointer p-0.5 bg-white"
                />
                <input
                  type="text"
                  value={newCatItem.hex}
                  onChange={(e) => setNewCatItem({ ...newCatItem, hex: e.target.value })}
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-mono text-slate-900"
                />
              </div>
            </div>
          )}

          {categorySubTab === 'materials' && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">Mô Tả / Đặc Tính</label>
              <textarea
                rows={2}
                placeholder="Mô tả bề mặt, độ đàn hồi, khả năng chống nước..."
                value={newCatItem.extra}
                onChange={(e) => setNewCatItem({ ...newCatItem, extra: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-violet-500"
              />
            </div>
          )}

          {categorySubTab === 'brands' && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">Xuất Xứ & Quốc Gia</label>
              <input
                type="text"
                placeholder="ví dụ: Nhật Bản (Japan)"
                value={newCatItem.extra}
                onChange={(e) => setNewCatItem({ ...newCatItem, extra: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-violet-500"
              />
            </div>
          )}

          {categorySubTab === 'sizes' && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">Chiều Dài Chân (cm)</label>
              <input
                type="number"
                step="0.5"
                placeholder="ví dụ: 26.5"
                value={newCatItem.extra}
                onChange={(e) => setNewCatItem({ ...newCatItem, extra: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-violet-500"
              />
            </div>
          )}

          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowAddCategoryModal(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-600 hover:bg-slate-100 transition"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold transition shadow-violet"
            >
              {categorySubTab === 'images' ? 'Lưu Hình Ảnh' : 'Lưu Thuộc Tính'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
