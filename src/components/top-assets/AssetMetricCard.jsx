'use client';

import { Info } from 'lucide-react';

export default function AssetMetricCard({ 
  title, 
  value, 
  description, 
  trend, 
  tooltip,
  color = 'blue',
  compact = false
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    slate: 'bg-slate-50 text-slate-700 border-slate-200'
  };

  return (
    <div className={`relative group ${compact ? 'p-3' : 'p-4'} rounded-lg border ${colorClasses[color]}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <h3 className={`font-medium ${compact ? 'text-xs' : 'text-sm'}`}>{title}</h3>
          {tooltip && (
            <Info size={compact ? 12 : 14} className="text-current opacity-60 cursor-help" />
          )}
        </div>
        {trend !== undefined && (
          <span className={`${compact ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2 py-1'} rounded-full ${
            trend > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
          }`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}
          </span>
        )}
      </div>
      
      <div className="mb-1">
        <span className={`font-semibold ${compact ? 'text-lg' : 'text-2xl'}`}>{value}</span>
      </div>
      
      {description && (
        <p className={`${compact ? 'text-xs' : 'text-sm'} opacity-90`}>{description}</p>
      )}
      
      {/* Tooltip for desktop */}
      {tooltip && (
        <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-48 z-10">
          {tooltip}
          <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-slate-900"></div>
        </div>
      )}
    </div>
  );
}