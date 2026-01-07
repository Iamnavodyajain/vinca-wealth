'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, Legend } from 'recharts';
import { historicalMetrics } from '@/lib/retirementAssetMetrics';
import { useState } from 'react';
import { TrendingUp, BarChart2, Activity } from 'lucide-react';
import ChartContainer from '../ChartContainer';

export default function AssetCharts() {
  const [activeChart, setActiveChart] = useState('returns');
  const chartData = historicalMetrics.rollingReturns.slice(-15); // Last 15 years

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Historical Pattern Analysis</h2>
            <p className="text-sm text-slate-600 mt-1">
              Visual comparison of how different asset classes behaved historically
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveChart('returns')}
              className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 ${activeChart === 'returns' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              <TrendingUp size={16} />
              Returns vs Inflation
            </button>
            <button
              onClick={() => setActiveChart('stability')}
              className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 ${activeChart === 'stability' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              <Activity size={16} />
              Rolling Stability
            </button>
            <button
              onClick={() => setActiveChart('drawdown')}
              className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 ${activeChart === 'drawdown' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              <BarChart2 size={16} />
              Drawdown Recovery
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {activeChart === 'returns' && (
          <div>
            <h3 className="text-base font-medium text-slate-800 mb-4">
              10-Year Rolling Real Returns (Adjusted for Inflation)
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              Shows how different asset classes historically performed relative to inflation over rolling 10-year periods
            </p>
            <ChartContainer height="320px">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="year"
                    stroke="#64748b"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={12}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    formatter={(value) => [`${value}%`, 'Return']}
                    labelFormatter={(label) => `Year: ${label}`}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="equity"
                    name="Equity"
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="bonds"
                    name="Bonds"
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="gold"
                    name="Gold"
                    fill="#F59E0B"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="inflation"
                    name="Inflation"
                    fill="#94a3b8"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        )}

        {activeChart === 'stability' && (
          <div>
            <h3 className="text-base font-medium text-slate-800 mb-4">
              Return Stability Over Time (Annual Returns)
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              Illustrates the consistency of returns year-over-year and the challenge of maintaining purchasing power
            </p>
            <ChartContainer height="320px">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="year"
                    stroke="#64748b"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={12}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    formatter={(value) => [`${value}%`, 'Return']}
                    labelFormatter={(label) => `Year: ${label}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="equity"
                    name="Equity"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="bonds"
                    name="Bonds"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="inflation"
                    name="Inflation"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        )}

        {activeChart === 'drawdown' && (
          <div>
            <h3 className="text-base font-medium text-slate-800 mb-4">
              Historical Drawdown & Recovery Patterns
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              Shows historical stress periods and recovery durations - critical for retirement withdrawal planning
            </p>
            <ChartContainer height="320px">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <AreaChart data={historicalMetrics.drawdownRecovery}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="asset"
                    stroke="#64748b"
                    fontSize={12}
                  />
                  <YAxis
                    yAxisId="left"
                    stroke="#64748b"
                    fontSize={12}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#64748b"
                    fontSize={12}
                    tickFormatter={(value) => `${value} months`}
                  />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === 'drawdown') return [`${value}%`, 'Drawdown'];
                      if (name === 'recoveryMonths') return [`${value} months`, 'Recovery Time'];
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="drawdown"
                    name="Maximum Drawdown"
                    stroke="#EF4444"
                    fill="#FEE2E2"
                    strokeWidth={2}
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="recoveryMonths"
                    name="Recovery Time"
                    stroke="#8B5CF6"
                    fill="#EDE9FE"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        )}
      </div>
    </div>
  );
}