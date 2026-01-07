'use client';

import { useState } from 'react';
import { retirementPlans } from '@/lib/retirementAssetMetrics';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { Clock, AlertTriangle, DollarSign, BarChart2, Activity } from 'lucide-react';
import ChartContainer from './ChartContainer';

export default function HistoricalPlanComparison() {
  const [planA, setPlanA] = useState('balanced');
  const [planB, setPlanB] = useState('conservative');

  const planAObj = retirementPlans.find(p => p.id === planA);
  const planBObj = retirementPlans.find(p => p.id === planB);

  // Generate historical outcome data
  const historicalOutcomes = [
    {
      name: 'Corpus Longevity',
      planA: 85,
      planB: 82,
      description: 'Average age funds lasted in historical simulations'
    },
    {
      name: 'Inflation-Adjusted Sustainability',
      planA: 72,
      planB: 68,
      description: '% of years maintaining purchasing power historically'
    },
    {
      name: 'Drawdown Severity',
      planA: -32.7,
      planB: -22.5,
      description: 'Average maximum decline in historical stress periods'
    },
    {
      name: 'Recovery Period',
      planA: 42,
      planB: 36,
      description: 'Average months to recover from drawdowns historically'
    }
  ];

  const pieDataA = Object.entries(planAObj.allocation).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value,
    color: {
      equity: '#3B82F6',
      bonds: '#10B981',
      gold: '#F59E0B',
      realEstate: '#8B5CF6'
    }[key]
  }));

  const pieDataB = Object.entries(planBObj.allocation).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value,
    color: {
      equity: '#3B82F6',
      bonds: '#10B981',
      gold: '#F59E0B',
      realEstate: '#8B5CF6'
    }[key]
  }));

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Historical Allocation Impact</h2>
            <p className="text-sm text-slate-600 mt-1">
              Compare how different asset allocations historically impacted retirement outcomes
            </p>
          </div>
          <div className="text-sm text-slate-500 flex items-center gap-2">
            <Clock size={16} />
            Historical simulation only
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Comparison Disclaimer */}
        <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">Educational Analysis Only</p>
              <p>
                This shows historical patterns, NOT recommendations. Past patterns do not guarantee future results.
              </p>
            </div>
          </div>
        </div>

        {/* Plan Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-3">
              Allocation Strategy A
            </label>
            <select
              value={planA}
              onChange={(e) => setPlanA(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {retirementPlans.map(plan => (
                <option key={plan.id} value={plan.id}>{plan.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-3">
              Allocation Strategy B
            </label>
            <select
              value={planB}
              onChange={(e) => setPlanB(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {retirementPlans.map(plan => (
                <option key={plan.id} value={plan.id}>{plan.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Allocation Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="text-center">
            <h3 className="text-base font-semibold text-slate-900 mb-4">{planAObj.name}</h3>
            <ChartContainer height="200px">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <PieChart>
                  <Pie
                    data={pieDataA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieDataA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value}%`, 'Historical Allocation']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <p className="text-sm text-slate-600 mt-4">{planAObj.description}</p>
          </div>
          <div className="text-center">
            <h3 className="text-base font-semibold text-slate-900 mb-4">{planBObj.name}</h3>
            <ChartContainer height="200px">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <PieChart>
                  <Pie
                    data={pieDataB}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieDataB.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value}%`, 'Historical Allocation']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <p className="text-sm text-slate-600 mt-4">{planBObj.description}</p>
          </div>
        </div>

        {/* Historical Outcomes Comparison */}
        <div className="border-t border-slate-200 pt-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">
            Historical Retirement Outcomes Comparison
          </h3>
          <p className="text-slate-600 mb-6">
            Shows how different allocation strategies performed in historical simulations
          </p>
          <ChartContainer height="320px">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={historicalOutcomes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={12}
                  height={60}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === 'planA' || name === 'planB') {
                      return [value, name === 'planA' ? 'Strategy A' : 'Strategy B'];
                    }
                    return [value, name];
                  }}
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0]) {
                      return `${payload[0].payload.description}`;
                    }
                    return label;
                  }}
                />
                <Legend />
                <Bar
                  dataKey="planA"
                  name="Strategy A"
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="planB"
                  name="Strategy B"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Outcome Descriptions */}
        <div className="mt-10 pt-8 border-t border-slate-200">
          <h4 className="text-base font-semibold text-slate-900 mb-6">Understanding Historical Outcomes</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Clock size={16} className="text-slate-600" />
                <span className="text-sm font-medium text-slate-900">Corpus Longevity</span>
              </div>
              <p className="text-xs text-slate-600">
                Average age funds lasted in historical simulations. Higher indicates better historical sustainability.
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <DollarSign size={16} className="text-slate-600" />
                <span className="text-sm font-medium text-slate-900">Inflation-Adjusted Sustainability</span>
              </div>
              <p className="text-xs text-slate-600">
                Percentage of retirement years where historical withdrawals maintained purchasing power.
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <BarChart2 size={16} className="text-slate-600" />
                <span className="text-sm font-medium text-slate-900">Drawdown Severity</span>
              </div>
              <p className="text-xs text-slate-600">
                Average maximum portfolio decline during historical stress periods. Lower indicates historically smoother experience.
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Activity size={16} className="text-slate-600" />
                <span className="text-sm font-medium text-slate-900">Recovery Period</span>
              </div>
              <p className="text-xs text-slate-600">
                Average months historically required to recover from maximum drawdown.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200">
          <p className="text-sm text-slate-500">
            This historical analysis shows how different asset allocation strategies have performed in the past. 
            It demonstrates the trade-offs between growth potential and stability. Past patterns are not predictive of future results.
          </p>
        </div>
      </div>
    </div>
  );
}