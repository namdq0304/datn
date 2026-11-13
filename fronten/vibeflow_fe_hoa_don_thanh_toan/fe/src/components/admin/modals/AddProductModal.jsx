import React, { useState } from 'react';

export default function AddProductModal({ isOpen, onClose, onAddProduct }) {
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    brand: 'Nike',
    category: 'Sneakers',
    stock: 100,
    price: '',
    originalPrice: '',
    status: 'Kinh doanh',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;
    onAddProduct({
      ...formData,
      id: Date.now(),
      sku: formData.sku || `SP${Math.floor(1000 + Math.random() * 9000)}`,
      stock: Number(formData.stock) || 0,
      price: Number(formData.price) || 0,
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
      priceFormatted: `${Number(formData.price || 0).toLocaleString('vi-VN')} đ`,
      originalPriceFormatted: formData.originalPrice ? `${Number(formData.originalPrice).toLocaleString('vi-VN')} đ` : null,
      status: formData.status || 'Kinh doanh',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold text-sm">
              👟
            </span>
            <h3 className="font-bold text-base text-slate-900">Thêm Sản Phẩm Mới</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Mã sản phẩm (SKU)</label>
              <input
                type="text"
                placeholder="ví dụ: G57664"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-violet-500 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Thương hiệu *</label>
              <select
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-violet-500 focus:outline-none"
              >
                <option value="New Balance">New Balance</option>
                <option value="Nike">Nike</option>
                <option value="Adidas">Adidas</option>
                <option value="Brooks">Brooks</option>
                <option value="Hoka">Hoka</option>
                <option value="Salomon">Salomon</option>
                <option value="Jordan">Jordan</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Tên sản phẩm *</label>
            <input
              type="text"
              required
              placeholder="ví dụ: New Balance 530 Triple White"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-violet-500 focus:outline-none font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Loại giày</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-violet-500 focus:outline-none"
              >
                <option value="Sneakers">Sneakers</option>
                <option value="Running">Running</option>
                <option value="Walking">Walking</option>
                <option value="Hiking">Hiking</option>
                <option value="Basketball">Basketball</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Số lượng tồn kho</label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-violet-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Giá bán (VNĐ) *</label>
              <input
                type="number"
                required
                placeholder="2500000"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-violet-500 focus:outline-none font-bold text-violet-600"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Giá niêm yết cũ (nếu có)</label>
              <input
                type="number"
                placeholder="3000000"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-violet-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Trạng thái kinh doanh</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-violet-500 focus:outline-none"
            >
              <option value="Kinh doanh">Kinh doanh</option>
              <option value="Ngừng kinh doanh">Ngừng kinh doanh</option>
            </select>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold transition shadow-md shadow-violet-600/25 cursor-pointer"
            >
              Thêm sản phẩm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
