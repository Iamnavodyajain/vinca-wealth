'use client';

import { Info } from 'lucide-react';

export default function AssetScoreBadge({ score, compact = false }) {
  const getScoreColor = (score) => {
    if (score >= 8) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (score >= 6) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (score >= 4) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-slate-50 text-slate-700 border-slate-200';
  };

  const getScoreLabel = (score) => {
    if (score >= 8) return 'High Suitability';
    if (score >= 6) return 'Medium Suitability';
    if (score >= 4) return 'Moderate Suitability';
    return 'Low Suitability';
  };

  return (
    <div className={`relative group`}>
      <div className={`px-3 py-1.5 rounded-full text-sm font-medium inline-flex items-center gap-2 border ${getScoreColor(score)}`}>
        <span className="font-semibold">{score.toFixed(1)}</span>
        <span className="text-xs opacity-80">/10</span>
        {!compact && (
          <Info size={12} className="opacity-60" />
        )}
      </div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-64 z-10">
        <div className="font-medium mb-1">{getScoreLabel(score)}</div>
        <div className="opacity-90">
          Combined score based on:
          <ul className="list-disc pl-4 mt-1 space-y-1">
            <li>Real (inflation-adjusted) returns</li>
            <li>Volatility & stability</li>
            <li>Drawdown recovery</li>
            <li>Long-term consistency</li>
          </ul>
        </div>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
      </div>
    </div>
  );
}