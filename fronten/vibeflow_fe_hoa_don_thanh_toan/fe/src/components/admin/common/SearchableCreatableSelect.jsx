import React, { useState, useRef, useEffect } from 'react';

/**
 * Dropdown tìm kiếm thông minh kết hợp Thêm Nhanh (Creatable Combobox)
 * Chuẩn giao diện VibeFlow theo yêu cầu ảnh mẫu.
 */
export default function SearchableCreatableSelect({
  label,
  required,
  value,
  onChange,
  options = [],
  placeholder = 'Chọn...',
  onAddNewOption,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lọc các tùy chọn theo từ khóa tìm kiếm
  const cleanSearch = searchTerm.trim().toLowerCase();
  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(cleanSearch)
  );

  // Kiểm tra từ khóa có trùng khớp chính xác với tùy chọn nào chưa
  const hasExactMatch = options.some(
    (opt) => opt.toLowerCase() === cleanSearch
  );

  // Xử lý chọn mục có sẵn
  const handleSelectOption = (opt) => {
    onChange(opt);
    setSearchTerm('');
    setIsOpen(false);
  };

  // Xử lý thêm nhanh tùy chọn mới
  const handleQuickCreate = (newVal) => {
    const trimmed = newVal.trim();
    if (!trimmed) return;

    if (onAddNewOption) {
      onAddNewOption(trimmed);
    }
    onChange(trimmed);
    setSearchTerm('');
    setIsOpen(false);
  };

  // Xử lý phím Enter / Escape
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchTerm.trim()) {
        if (!hasExactMatch) {
          handleQuickCreate(searchTerm.trim());
        } else if (filteredOptions.length > 0) {
          handleSelectOption(filteredOptions[0]);
        }
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  return (
    <div className="space-y-1 relative" ref={wrapperRef}>
      {label && (
        <label className="text-xs font-semibold text-slate-700 block">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* ── Ô Input tìm kiếm / kích hoạt ── */}
      <div className="relative">
        {/* Icon kính lúp tìm kiếm */}
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={isOpen ? searchTerm : value || ''}
          placeholder={value ? value : placeholder}
          onFocus={() => {
            setIsOpen(true);
            setSearchTerm('');
          }}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className={`w-full pl-9 pr-9 py-2.5 bg-white border rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none transition font-medium ${
            isOpen
              ? 'border-violet-300 ring-2 ring-violet-100 shadow-2xs'
              : 'border-slate-200 hover:border-violet-200'
          }`}
        />

        {/* Nút mũi tên hoặc nút xóa */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {value && !isOpen ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
                setSearchTerm('');
              }}
              className="text-slate-300 hover:text-slate-500 p-0.5 rounded cursor-pointer"
              title="Xóa lựa chọn"
            >
              ✕
            </button>
          ) : (
            <svg
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 pointer-events-none ${
                isOpen ? 'rotate-180 text-violet-600' : ''
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>
      </div>

      {/* ── Dropdown danh sách & banner Thêm nhanh ── */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 p-2 bg-white border border-slate-200/90 rounded-2xl shadow-xl z-50 max-h-64 overflow-y-auto space-y-1 animate-in fade-in zoom-in-95 duration-100">
          {/* Banner Thêm nhanh (Chuẩn 100% theo ảnh mẫu với tone VibeFlow) */}
          {searchTerm.trim() && !hasExactMatch && (
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault(); // Tránh blur input trước khi click
                handleQuickCreate(searchTerm.trim());
              }}
              className="w-full text-left p-3 rounded-xl bg-violet-50/80 hover:bg-violet-100/90 active:scale-[0.99] text-violet-700 border border-dashed border-violet-300 text-xs font-semibold flex items-center justify-between transition cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center space-x-1.5 truncate">
                <span>Thêm nhanh</span>
                <span className="font-bold text-violet-800 truncate">
                  "{searchTerm.trim()}"
                </span>
              </div>
              <span className="text-base font-bold text-violet-600 group-hover:scale-125 transition shrink-0 ml-2 leading-none">
                +
              </span>
            </button>
          )}

          {/* Danh sách các tùy chọn có sẵn / khớp từ khóa */}
          <div className="space-y-0.5 pt-0.5">
            {filteredOptions.map((opt) => {
              const isSelected = opt === value;
              return (
                <div
                  key={opt}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelectOption(opt);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs transition cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-violet-50 text-violet-700 font-bold border border-violet-200/80'
                      : 'text-slate-700 hover:bg-violet-50/60 hover:text-violet-700'
                  }`}
                >
                  <span className="truncate">{opt}</span>
                  {isSelected && (
                    <span className="text-violet-600 font-bold text-xs">✓</span>
                  )}
                </div>
              );
            })}

            {/* Trạng thái không tìm thấy tùy chọn nào khác */}
            {filteredOptions.length === 0 && !searchTerm.trim() && (
              <div className="py-4 text-center text-slate-400 text-xs">
                Chưa có lựa chọn nào trong danh sách
              </div>
            )}

            {filteredOptions.length === 0 && searchTerm.trim() && hasExactMatch && (
              <div className="py-2.5 px-3 text-slate-500 text-xs text-center font-medium">
                Đã có trong danh sách
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
