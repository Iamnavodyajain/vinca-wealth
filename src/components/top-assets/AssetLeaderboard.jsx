'use client';

import React, { useState } from 'react';
import { assetClasses, getSuitabilityColor, formatPercentage, formatScore } from '@/lib/retirementAssetMetrics';
import { Info, ChevronUp, ChevronDown } from 'lucide-react';
import AssetMetricCard from './AssetMetricCard';
import AssetScoreBadge from './AssetScoreBadge';

export default function AssetLeaderboard() {
  const [sortBy, setSortBy] = useState('suitabilityScore');
  const [sortOrder, setSortOrder] = useState('desc');
  const [expandedRow, setExpandedRow] = useState(null);

  const sortedAssets = [...assetClasses].sort((a, b) => {
    const aValue = a.metrics[sortBy];
    const bValue = b.metrics[sortBy];
    return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
  });

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const SortIcon = ({ column }) => (
    <span className="ml-1">
      {sortBy === column ? (sortOrder === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />) : '⇅'}
    </span>
  );

  const toggleRowExpansion = (assetId) => {
    setExpandedRow(expandedRow === assetId ? null : assetId);
  };

  return (
    <div className="card overflow-hidden">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Asset Class Leaderboard</h2>
            <p className="text-sm text-slate-600 mt-1">
              Historical ranking by retirement suitability metrics
            </p>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <Info size={14} />
            Educational analysis only
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-6 text-sm font-medium text-slate-700">
                Asset Class
              </th>
              <th 
                className="text-left py-3 px-6 text-sm font-medium text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => handleSort('realReturnScore')}
              >
                <div className="flex items-center">
                  Real Return Score
                  <SortIcon column="realReturnScore" />
                </div>
              </th>
              <th 
                className="text-left py-3 px-6 text-sm font-medium text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => handleSort('volatility')}
              >
                <div className="flex items-center">
                  Volatility
                  <SortIcon column="volatility" />
                </div>
              </th>
              <th 
                className="text-left py-3 px-6 text-sm font-medium text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => handleSort('maxDrawdown')}
              >
                <div className="flex items-center">
                  Max Drawdown
                  <SortIcon column="maxDrawdown" />
                </div>
              </th>
              <th 
                className="text-left py-3 px-6 text-sm font-medium text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => handleSort('suitabilityScore')}
              >
                <div className="flex items-center">
                  Retirement Suitability
                  <SortIcon column="suitabilityScore" />
                </div>
              </th>
              <th className="text-left py-3 px-6 text-sm font-medium text-slate-700 w-20">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedAssets.map((asset) => {
              const isExpanded = expandedRow === asset.id;
              
              return (
                <React.Fragment key={asset.id}>
                  <tr 
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => toggleRowExpansion(asset.id)}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: asset.color }}
                        />
                        <div>
                          <div className="font-medium text-slate-900">{asset.name}</div>
                          <div className="text-xs text-slate-500">{asset.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-slate-900">
                        {formatPercentage(asset.metrics.realReturnScore)}
                      </div>
                      <div className="text-xs text-slate-500">
                        {asset.metrics.inflationBeatingYears}% years beating inflation
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-slate-900">
                        {formatPercentage(asset.metrics.volatility)}
                      </div>
                      <div className="text-xs text-slate-500">
                        Annual standard deviation
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-slate-900">
                        {formatPercentage(asset.metrics.maxDrawdown)}
                      </div>
                      <div className="text-xs text-slate-500">
                        Peak-to-trough decline
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <AssetScoreBadge score={asset.metrics.suitabilityScore} />
                    </td>
                    <td className="py-4 px-6">
                      <button 
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRowExpansion(asset.id);
                        }}
                      >
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                    </td>
                  </tr>
                  
                  {/* Expanded Details Row */}
                  {isExpanded && (
                    <tr key={`${asset.id}-details`} className="bg-slate-50">
                      <td colSpan={6} className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <AssetMetricCard
                            title="Rolling 10Y Returns"
                            value={formatPercentage(asset.metrics.rolling10YReturns)}
                            description="Average over last decade"
                            tooltip="Historical 10-year rolling returns provide insight into medium-term performance patterns"
                            color="blue"
                            compact
                          />
                          <AssetMetricCard
                            title="Rolling 20Y Returns"
                            value={formatPercentage(asset.metrics.rolling20YReturns)}
                            description="Long-term perspective"
                            tooltip="20-year rolling returns show performance through multiple economic cycles"
                            color="emerald"
                            compact
                          />
                          <AssetMetricCard
                            title="Recovery Time"
                            value={`${asset.metrics.recoveryTime} months`}
                            description="From max drawdown"
                            tooltip="Time taken to recover from the largest historical decline"
                            color="amber"
                            compact
                          />
                          <AssetMetricCard
                            title="Inflation Beating"
                            value={`${asset.metrics.inflationBeatingYears}%`}
                            description="Of years analyzed"
                            tooltip="Percentage of years where returns exceeded inflation rate"
                            color="purple"
                            compact
                          />
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-slate-200">
                          <p className="text-sm text-slate-700">
                            <strong>Historical Context:</strong> {asset.description}
                          </p>
                          <p className="text-xs text-slate-500 mt-2">
                            Analysis period: 1995-2023. Past performance is not indicative of future results.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-slate-700 mb-2">Suitability Score Legend:</p>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1 text-xs">
                <div className="w-3 h-3 rounded-full bg-emerald-100 border border-emerald-300"></div>
                <span className="text-emerald-700">8.0+ (High)</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-300"></div>
                <span className="text-blue-700">6.0-7.9 (Medium)</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <div className="w-3 h-3 rounded-full bg-amber-100 border border-amber-300"></div>
                <span className="text-amber-700">4.0-5.9 (Moderate)</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <div className="w-3 h-3 rounded-full bg-slate-100 border border-slate-300"></div>
                <span className="text-slate-700">Below 4.0 (Low)</span>
              </div>
            </div>
          </div>
          
          <div>
            <p className="text-xs text-slate-600">
              Note: Scores are based on historical analysis (1995-2023) and consider multiple retirement factors including 
              inflation-adjusted returns, volatility, drawdown recovery, and consistency. Not predictive of future performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}