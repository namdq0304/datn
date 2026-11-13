import React from 'react';
import { AdminPageHeader } from '../common';

export default function CategoriesTab({
  setShowAddCategoryModal,
  categorySubTab,
  setCategorySubTab,
  categorySearch,
  setCategorySearch,
  colorsList,
  setColorsList,
  materialsList,
  setMaterialsList,
  brandsList,
  setBrandsList,
  sizesList,
  setSizesList,
  imagesList,
  setImagesList,
}) {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── TIÊU ĐỀ TRANG ĐỒNG BỘ TONE TÍM VIBEFLOW ── */}
      <AdminPageHeader
        category="Sản Phẩm & Kho Hàng"
        title="Danh Mục & Thuộc Tính"
        badgeVariant="violet"
        subtitle="Cấu hình phân loại màu sắc, chất liệu, thương hiệu và size giày chuẩn hệ thống."
        metrics={[
          { label: 'Tổng thuộc tính', value: colorsList.length + materialsList.length + brandsList.length + sizesList.length, highlight: true },
          { label: 'Thư viện ảnh', value: imagesList.length },
        ]}
        action={
          <button
            onClick={() => setShowAddCategoryModal(true)}
            className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-violet flex items-center space-x-2 cursor-pointer"
          >
            <span>+</span>
            <span>{categorySubTab === 'images' ? 'Thêm Hình Ảnh Mới' : 'Thêm Thuộc Tính Mới'}</span>
          </button>
        }
      />


      {/* Sub-tab Pills */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'colors', label: 'Màu Sắc', icon: '🎨', count: colorsList.length },
          { id: 'materials', label: 'Chất Liệu', icon: '🧵', count: materialsList.length },
          { id: 'brands', label: 'Thương Hiệu', icon: '🏷️', count: brandsList.length },
          { id: 'sizes', label: 'Kích Cỡ (Size)', icon: '📐', count: sizesList.length },
          { id: 'images', label: 'Hình Ảnh', icon: '🖼️', count: imagesList.length },
        ].map((st) => (
          <button
            key={st.id}
            onClick={() => {
              setCategorySubTab(st.id);
              setCategorySearch('');
            }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              categorySubTab === st.id
                ? 'bg-violet-600 text-white shadow-violet'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>{st.icon}</span>
            <span>{st.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                categorySubTab === st.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {st.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search filter within sub-tab */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-2xs">
        <input
          type="text"
          placeholder={`Tìm kiếm trong ${
            categorySubTab === 'colors'
              ? 'màu sắc'
              : categorySubTab === 'materials'
              ? 'chất liệu'
              : categorySubTab === 'brands'
              ? 'thương hiệu'
              : categorySubTab === 'sizes'
              ? 'kích cỡ size'
              : 'thư viện hình ảnh'
          }...`}
          value={categorySearch}
          onChange={(e) => setCategorySearch(e.target.value)}
          className="w-full max-w-sm bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-violet-500"
        />
        <span className="text-xs text-slate-400 hidden sm:inline">
          Tổng cộng:{' '}
          <strong>
            {categorySubTab === 'colors'
              ? colorsList.length
              : categorySubTab === 'materials'
              ? materialsList.length
              : categorySubTab === 'brands'
              ? brandsList.length
              : categorySubTab === 'sizes'
              ? sizesList.length
              : imagesList.length}
          </strong>{' '}
          mục
        </span>
      </div>

      {/* Content 1: Màu Sắc */}
      {categorySubTab === 'colors' && (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Mã Màu</th>
                  <th className="py-3 px-4">Xem Trước</th>
                  <th className="py-3 px-4">Tên Màu Sắc</th>
                  <th className="py-3 px-4">Mã HEX</th>
                  <th className="py-3 px-4">Số Sản Phẩm</th>
                  <th className="py-3 px-4">Trạng Thái</th>
                  <th className="py-3 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {colorsList
                  .filter(
                    (c) =>
                      !categorySearch ||
                      c.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
                      c.code.toLowerCase().includes(categorySearch.toLowerCase())
                  )
                  .map((col) => (
                    <tr key={col.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{col.code}</td>
                      <td className="py-3.5 px-4">
                        <div
                          className="w-7 h-7 rounded-full border-2 border-white shadow-xs ring-1 ring-slate-200"
                          style={{ backgroundColor: col.hex }}
                          title={col.hex}
                        />
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{col.name}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">
                        <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: col.hex }} />
                          <span>{col.hex}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-violet-700">{col.count} mẫu</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          ● Đang dùng
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => alert(`Sửa thông tin màu ${col.name}`)}
                          className="text-violet-600 hover:text-violet-800 font-bold cursor-pointer"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => setColorsList((prev) => prev.filter((x) => x.id !== col.id))}
                          className="text-red-500 hover:text-red-700 font-bold cursor-pointer"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Content 2: Chất Liệu */}
      {categorySubTab === 'materials' && (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Mã Chất Liệu</th>
                  <th className="py-3 px-4">Tên Chất Liệu</th>
                  <th className="py-3 px-4">Đặc Tính / Mô Tả</th>
                  <th className="py-3 px-4">Số Sản Phẩm</th>
                  <th className="py-3 px-4">Trạng Thái</th>
                  <th className="py-3 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {materialsList
                  .filter(
                    (m) =>
                      !categorySearch ||
                      m.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
                      m.code.toLowerCase().includes(categorySearch.toLowerCase())
                  )
                  .map((mat) => (
                    <tr key={mat.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{mat.code}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{mat.name}</td>
                      <td className="py-3.5 px-4 text-slate-500 max-w-md">{mat.desc}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-violet-700">{mat.count} mẫu</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          ● Đang dùng
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => alert(`Sửa chất liệu ${mat.name}`)}
                          className="text-violet-600 hover:text-violet-800 font-bold cursor-pointer"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => setMaterialsList((prev) => prev.filter((x) => x.id !== mat.id))}
                          className="text-red-500 hover:text-red-700 font-bold cursor-pointer"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Content 3: Thương Hiệu */}
      {categorySubTab === 'brands' && (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Mã</th>
                  <th className="py-3 px-4">Thương Hiệu</th>
                  <th className="py-3 px-4">Xuất Xứ</th>
                  <th className="py-3 px-4">Năm Sáng Lập</th>
                  <th className="py-3 px-4">Mẫu Giày</th>
                  <th className="py-3 px-4">Trạng Thái</th>
                  <th className="py-3 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {brandsList
                  .filter((b) => !categorySearch || b.name.toLowerCase().includes(categorySearch.toLowerCase()))
                  .map((br) => (
                    <tr key={br.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{br.code}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <div className="flex items-center space-x-2.5">
                          <span className="w-8 h-8 rounded-lg bg-slate-900 text-white font-black text-[11px] flex items-center justify-center shadow-2xs">
                            {br.code.replace('BRD-', '').slice(0, 3)}
                          </span>
                          <span>{br.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{br.origin}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">{br.founder}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-violet-700">{br.count} dòng</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          ● Chính Hãng
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => alert(`Sửa thương hiệu ${br.name}`)}
                          className="text-violet-600 hover:text-violet-800 font-bold cursor-pointer"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => setBrandsList((prev) => prev.filter((x) => x.id !== br.id))}
                          className="text-red-500 hover:text-red-700 font-bold cursor-pointer"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Content 4: Size */}
      {categorySubTab === 'sizes' && (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Size EU (Việt Nam)</th>
                  <th className="py-3 px-4">Size US</th>
                  <th className="py-3 px-4">Chiều Dài Chân (cm)</th>
                  <th className="py-3 px-4">Tổng Tồn Kho</th>
                  <th className="py-3 px-4">Trạng Thái</th>
                  <th className="py-3 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {sizesList
                  .filter((s) => !categorySearch || s.eu.includes(categorySearch))
                  .map((sz) => (
                    <tr key={sz.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-black text-slate-900 text-sm">Size {sz.eu}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-violet-600">{sz.us} US</td>
                      <td className="py-3.5 px-4 text-slate-600">{sz.cm} cm</td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900">{sz.stock} đôi</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          ● Đang bán
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => alert(`Cập nhật kích cỡ ${sz.eu}`)}
                          className="text-violet-600 hover:text-violet-800 font-bold cursor-pointer"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => setSizesList((prev) => prev.filter((x) => x.id !== sz.id))}
                          className="text-red-500 hover:text-red-700 font-bold cursor-pointer"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Content 5: Hình Ảnh (Media Library) */}
      {categorySubTab === 'images' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {imagesList
              .filter(
                (img) =>
                  !categorySearch ||
                  img.title.toLowerCase().includes(categorySearch.toLowerCase()) ||
                  img.code.toLowerCase().includes(categorySearch.toLowerCase()) ||
                  img.product.toLowerCase().includes(categorySearch.toLowerCase())
              )
              .map((img) => (
                <div
                  key={img.id}
                  className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xs hover:shadow-md transition group flex flex-col justify-between"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                    <img
                      src={img.url}
                      alt={img.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-lg bg-black/60 text-white backdrop-blur-xs font-mono">
                      {img.code}
                    </span>
                    <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-lg bg-violet-600/90 text-white backdrop-blur-xs">
                      {img.type}
                    </span>
                  </div>

                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 line-clamp-1" title={img.title}>
                        {img.title}
                      </h4>
                      <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                        Liên kết: <b className="text-slate-700">{img.product}</b>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <span>{img.size}</span>
                      <div className="space-x-2">
                        <button
                          onClick={() => {
                            navigator.clipboard?.writeText(img.url);
                            alert(`Đã sao chép link ảnh:\n${img.url}`);
                          }}
                          className="text-violet-600 hover:text-violet-800 font-bold cursor-pointer"
                        >
                          Copy Link
                        </button>
                        <button
                          onClick={() => setImagesList((prev) => prev.filter((x) => x.id !== img.id))}
                          className="text-red-500 hover:text-red-700 font-bold cursor-pointer"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {imagesList.filter(
            (img) =>
              !categorySearch ||
              img.title.toLowerCase().includes(categorySearch.toLowerCase()) ||
              img.code.toLowerCase().includes(categorySearch.toLowerCase()) ||
              img.product.toLowerCase().includes(categorySearch.toLowerCase())
          ).length === 0 && (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-400">
              <div className="text-3xl mb-2">🖼️</div>
              <div className="font-semibold text-xs text-slate-600">Không tìm thấy hình ảnh nào phù hợp.</div>
              <div className="text-[11px] text-slate-400 mt-1">Bấm "+ Thêm Thuộc Tính Mới" để thêm hình ảnh vào thư viện.</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
