'use client';

import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { formatCurrency } from '../lib/formatters';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl shadow-md p-3 text-sm border border-slate-200">
        <p className="font-semibold text-slate-900 mb-2">Age {label}</p>
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-slate-600">Total Wealth</span>
            <span className="font-medium text-green-600">
              {formatCurrency(payload[0].value)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-600">Total Invested</span>
            <span className="font-medium text-blue-600">
              {formatCurrency(payload[1]?.value || 0)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-600">Phase</span>
            <span className={`font-medium px-2 py-0.5 rounded ${
              payload[0]?.payload?.phase === 'Accumulation' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-orange-100 text-orange-700'
            }`}>
              {payload[0]?.payload?.phase}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function CorpusChart({ data }) {
  const [showInvested, setShowInvested] = useState(true);

  if (!data || data.length === 0) {
    return (
      <div className="card h-96 flex items-center justify-center">
        <p className="text-slate-500">No data available. Complete the calculator first.</p>
      </div>
    );
  }

  const chartData = data.map(item => ({
    ...item,
    age: item.age,
    totalWealth: item.endingCorpus,
    totalInvested: item.totalInvested
  }));

  const formatYAxis = (value) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(0)}L`;
    return `₹${(value / 1000).toFixed(0)}K`;
  };

  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Wealth Journey</h3>
          <p className="text-sm text-slate-500">Projection of your corpus over time</p>
        </div>
        
        <div className="flex items-center space-x-4 mt-2 sm:mt-0">
          <button
            onClick={() => setShowInvested(!showInvested)}
            className={`text-sm px-3 py-1 rounded-lg transition-colors ${
              showInvested 
                ? 'bg-green-100 text-green-700' 
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            Show Invested Amount
          </button>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#E2E8F0" 
              horizontal={true}
              vertical={false}
            />
            
            <XAxis 
              dataKey="age" 
              stroke="#64748B"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
            />
            
            <YAxis 
              stroke="#64748B"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
              tickFormatter={formatYAxis}
            />
            
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            <Area
              type="monotone"
              dataKey="totalWealth"
              stroke="#22C55E"
              strokeWidth={2}
              fill="url(#colorWealth)"
              fillOpacity={0.25}
              name="Total Wealth"
            />
            
            {showInvested && (
              <Area
                type="monotone"
                dataKey="totalInvested"
                stroke="#6366F1"
                strokeWidth={1.5}
                strokeDasharray="3 3"
                fill="transparent"
                name="Total Invested"
              />
            )}
            
            <defs>
              <linearGradient id="colorWealth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22C55E" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-slate-200">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <span className="text-sm text-slate-600">Accumulation Phase (Growing Wealth)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
          <span className="text-sm text-slate-600">Withdrawal Phase (Retirement)</span>
        </div>
      </div>
    </div>
  );
}