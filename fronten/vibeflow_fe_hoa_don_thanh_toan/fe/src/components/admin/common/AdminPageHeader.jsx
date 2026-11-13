import React from 'react';

/**
 * Standard Admin Page Header Component
 * Provides unified breadcrumb, icon badge, uppercase title, subtitle and quick summary metrics.
 */
export default function AdminPageHeader({
  category = 'Hệ Thống',
  title = 'Trang Quản Trị',
  icon = null,
  badge = null,
  badgeVariant = 'violet', // 'violet' | 'emerald' | 'amber' | 'blue'
  subtitle = '',
  metrics = [],
  action = null,
}) {
  const getBadgeStyle = () => {
    switch (badgeVariant) {
      case 'emerald':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'amber':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'blue':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'violet':
      default:
        return 'bg-violet-50 text-violet-700 border-violet-200';
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200">
      <div>
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-[11px] font-medium text-slate-500 mb-1">
          <span>{category}</span>
          <span>/</span>
          <span className="text-violet-600 font-bold">{title}</span>
        </div>

        {/* Title + Icon + Badge */}
        <h2 className="text-xl font-black uppercase text-slate-900 flex items-center flex-wrap gap-2.5">
          {icon && <span className="text-2xl leading-none">{icon}</span>}
          <span>{title}</span>
          {badge && (
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border shadow-2xs ${getBadgeStyle()}`}>
              {badge}
            </span>
          )}
        </h2>

        {/* Subtitle */}
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </div>

      {/* Right side: Quick summary metrics or Actions */}
      <div className="flex items-center gap-3 flex-wrap text-xs">
        {metrics && metrics.length > 0 && (
          <div className="flex items-center space-x-2.5">
            {metrics.map((m, idx) => (
              <div
                key={idx}
                className={`px-3.5 py-2 rounded-xl border shadow-2xs flex items-center space-x-2 ${
                  m.highlight
                    ? 'bg-violet-50/70 border-violet-200 text-violet-700'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    m.dotColor || (m.highlight ? 'bg-violet-600' : 'bg-slate-400')
                  } ${m.pulse ? 'animate-pulse' : ''}`}
                ></span>
                <span className="text-slate-500 font-medium">{m.label}:</span>
                <span className={`font-extrabold ${m.highlight ? 'text-violet-700' : 'text-slate-900'}`}>
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {action && <div>{action}</div>}
      </div>
    </div>
  );
}
