import React, { useState } from 'react';

export default function AdminSidebar({
  isAdmin,
  activeTab,
  setActiveTab,
  discountSubTab = 'vouchers',
  setDiscountSubTab,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
}) {
  // Trạng thái đóng/mở menu con "Quản lý giảm giá"
  const [isDiscountsOpen, setIsDiscountsOpen] = useState(true);

  // Danh sách các tab độc lập phía trên
  const topTabs = [
    { id: 'pos', label: 'Bán Hàng Tại Quầy', icon: '⚡' },
    { id: 'orders', label: 'Quản Lý Hóa Đơn', icon: '📦' },
    { id: 'products', label: 'Quản Lý Sản Phẩm', icon: '👟' },
    { id: 'categories', label: 'Danh Mục Thuộc Tính', icon: '🏷️' },
  ];

  // Danh sách các tab phía dưới
  const bottomTabs = [
    { id: 'employees', label: 'Quản Lý Nhân Viên', icon: '👥' },
    { id: 'customers', label: 'Quản Lý Khách Hàng', icon: '👤' },
    { id: 'chat', label: 'Live Chat CSKH', icon: '💬' },
  ];

  return (
    <aside
      className={`${
        isSidebarCollapsed ? 'w-20' : 'w-60'
      } bg-white border-r border-slate-200 p-3 space-y-2 shrink-0 hidden md:flex flex-col justify-between shadow-xs transition-all duration-300 ease-in-out`}
    >
      <div className="space-y-1.5">
        {/* Dashboard / Thống kê — chỉ ADMIN */}
        {isAdmin && (
          <button
            onClick={() => setActiveTab('dashboard')}
            title="Dashboard / Thống Kê"
            className={`w-full flex items-center ${
              isSidebarCollapsed ? 'justify-center p-3' : 'space-x-3 px-3.5 py-2.5'
            } rounded-xl text-xs font-bold transition-all duration-200 group relative ${
              activeTab === 'dashboard'
                ? 'bg-violet-600 text-white shadow-violet'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span className="text-base shrink-0 group-hover:scale-110 transition-transform">📊</span>
            {!isSidebarCollapsed && <span className="truncate">Thống Kê</span>}
            {isSidebarCollapsed && activeTab === 'dashboard' && (
              <span className="absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white" />
            )}
          </button>
        )}

        {/* Các Tab nhóm 1 */}
        {topTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            title={tab.label}
            className={`w-full flex items-center ${
              isSidebarCollapsed ? 'justify-center p-3' : 'space-x-3 px-3.5 py-2.5'
            } rounded-xl text-xs font-bold transition-all duration-200 group relative ${
              activeTab === tab.id
                ? 'bg-violet-600 text-white shadow-violet'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span className="text-base shrink-0 group-hover:scale-110 transition-transform">{tab.icon}</span>
            {!isSidebarCollapsed && <span className="truncate">{tab.label}</span>}
            {isSidebarCollapsed && activeTab === tab.id && (
              <span className="absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white" />
            )}
          </button>
        ))}

        {/* ── MỤC QUẢN LÝ GIẢM GIÁ VỚI MENU CON (Khớp 100% ảnh tham chiếu) ── */}
        {isSidebarCollapsed ? (
          // Khi Sidebar thu gọn
          <button
            onClick={() => {
              setActiveTab('discounts');
              if (setDiscountSubTab) setDiscountSubTab('vouchers');
            }}
            title="Quản Lý Giảm Giá"
            className={`w-full flex items-center justify-center p-3 rounded-xl text-xs font-bold transition-all duration-200 group relative ${
              activeTab === 'discounts'
                ? 'bg-violet-600 text-white shadow-violet'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span className="text-base shrink-0 group-hover:scale-110 transition-transform">🎟️</span>
            {activeTab === 'discounts' && (
              <span className="absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white" />
            )}
          </button>
        ) : (
          // Khi Sidebar mở rộng đầy đủ
          <div className="space-y-1">
            {/* Header Menu Cha: "Quản lý giảm giá" kèm chevron */}
            <button
              type="button"
              onClick={() => {
                setIsDiscountsOpen((prev) => !prev);
                if (activeTab !== 'discounts') {
                  setActiveTab('discounts');
                  if (setDiscountSubTab) setDiscountSubTab('vouchers');
                }
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer group ${
                activeTab === 'discounts'
                  ? 'bg-violet-50/80 text-violet-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <span className="text-sm shrink-0">🎟️</span>
                <span className="truncate font-bold">Quản lý giảm giá</span>
              </div>
              <svg
                className={`w-3.5 h-3.5 text-violet-600 transition-transform duration-200 ${
                  isDiscountsOpen ? 'rotate-180' : ''
                }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Danh sách Menu con: "Phiếu giảm giá" & "Đợt giảm giá" */}
            {isDiscountsOpen && (
              <div className="pl-3 pr-1 space-y-1 pt-0.5 animate-in slide-in-from-top-1 duration-150">
                {/* Menu con 1: Phiếu giảm giá */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('discounts');
                    if (setDiscountSubTab) setDiscountSubTab('vouchers');
                  }}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs transition cursor-pointer ${
                    activeTab === 'discounts' && discountSubTab === 'vouchers'
                      ? 'bg-violet-100/90 text-violet-800 font-bold border border-violet-200/80 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
                  }`}
                >
                  <svg
                    className={`w-4 h-4 shrink-0 ${
                      activeTab === 'discounts' && discountSubTab === 'vouchers'
                        ? 'text-violet-700'
                        : 'text-slate-400'
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                    />
                  </svg>
                  <span className="truncate">Phiếu giảm giá</span>
                </button>

                {/* Menu con 2: Đợt giảm giá */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('discounts');
                    if (setDiscountSubTab) setDiscountSubTab('campaigns');
                  }}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs transition cursor-pointer ${
                    activeTab === 'discounts' && discountSubTab === 'campaigns'
                      ? 'bg-violet-100/90 text-violet-800 font-bold border border-violet-200/80 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
                  }`}
                >
                  <svg
                    className={`w-4 h-4 shrink-0 ${
                      activeTab === 'discounts' && discountSubTab === 'campaigns'
                        ? 'text-violet-700'
                        : 'text-slate-400'
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  <span className="truncate">Đợt giảm giá</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Các Tab nhóm 2 */}
        {bottomTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            title={tab.label}
            className={`w-full flex items-center ${
              isSidebarCollapsed ? 'justify-center p-3' : 'space-x-3 px-3.5 py-2.5'
            } rounded-xl text-xs font-bold transition-all duration-200 group relative ${
              activeTab === tab.id
                ? 'bg-violet-600 text-white shadow-violet'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span className="text-base shrink-0 group-hover:scale-110 transition-transform">{tab.icon}</span>
            {!isSidebarCollapsed && <span className="truncate">{tab.label}</span>}
            {isSidebarCollapsed && activeTab === tab.id && (
              <span className="absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white" />
            )}
          </button>
        ))}
      </div>
    </aside>
  );
}
