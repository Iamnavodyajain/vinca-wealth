'use client';

import { useState } from 'react';
import { retirementPlans } from '@/lib/retirementAssetMetrics';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, Shield, Clock, BarChart2, Activity } from 'lucide-react';

export default function AssetComparison() {
  const [planA, setPlanA] = useState('balanced');
  const [planB, setPlanB] = useState('conservative');

  const planAObj = retirementPlans.find(p => p.id === planA);
  const planBObj = retirementPlans.find(p => p.id === planB);

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
    <div className="card">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Plan Comparison</h2>
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <Clock size={12} />
            Historical allocation impact
          </div>
        </div>
        <p className="text-sm text-slate-600 mt-1">
          Compare how different asset allocations historically impacted retirement outcomes
        </p>
      </div>

      <div className="p-6">
        {/* Plan Selectors */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Plan A
            </label>
            <select 
              value={planA}
              onChange={(e) => setPlanA(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {retirementPlans.map(plan => (
                <option key={plan.id} value={plan.id}>{plan.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Plan B
            </label>
            <select 
              value={planB}
              onChange={(e) => setPlanB(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {retirementPlans.map(plan => (
                <option key={plan.id} value={plan.id}>{plan.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Charts */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="text-center">
            <h3 className="text-sm font-medium text-slate-700 mb-3">{planAObj.name}</h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieDataA}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieDataA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Allocation']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-600 mt-2">{planAObj.description}</p>
          </div>

          <div className="text-center">
            <h3 className="text-sm font-medium text-slate-700 mb-3">{planBObj.name}</h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieDataB}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieDataB.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Allocation']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-600 mt-2">{planBObj.description}</p>
          </div>
        </div>

        {/* Comparison Metrics */}
        <div className="border-t border-slate-200 pt-6">
          <h4 className="text-sm font-medium text-slate-700 mb-4">Historical Impact Comparison</h4>
          <div className="space-y-3">
            {['expectedRealReturn', 'volatility', 'maxDrawdown', 'suitabilityScore', 'inflationBeatingProbability'].map((metric, index) => {
              const labels = {
                expectedRealReturn: 'Expected Real Return',
                volatility: 'Volatility',
                maxDrawdown: 'Max Drawdown',
                suitabilityScore: 'Suitability Score',
                inflationBeatingProbability: 'Inflation Beating Probability'
              };
              
              const icons = {
                expectedRealReturn: <TrendingUp size={14} />,
                volatility: <Activity size={14} />,
                maxDrawdown: <BarChart2 size={14} />,
                suitabilityScore: <Shield size={14} />,
                inflationBeatingProbability: <TrendingUp size={14} />
              };
              
              return (
                <div key={metric} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    {icons[metric]}
                    <span>{labels[metric]}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`px-3 py-1 rounded text-sm ${
                      planAObj.metrics[metric] > planBObj.metrics[metric] 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {metric.includes('Probability') 
                        ? `${planAObj.metrics[metric]}%`
                        : metric.includes('Score')
                        ? planAObj.metrics[metric].toFixed(1)
                        : `${planAObj.metrics[metric].toFixed(1)}%`
                      }
                    </div>
                    <div className="text-slate-400">vs</div>
                    <div className={`px-3 py-1 rounded text-sm ${
                      planBObj.metrics[metric] > planAObj.metrics[metric] 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {metric.includes('Probability') 
                        ? `${planBObj.metrics[metric]}%`
                        : metric.includes('Score')
                        ? planBObj.metrics[metric].toFixed(1)
                        : `${planBObj.metrics[metric].toFixed(1)}%`
                      }
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-200">
          <p className="text-xs text-slate-500">
            This comparison shows how different asset allocation strategies historically performed. 
            Higher real returns often came with higher volatility. Past patterns do not guarantee future results.
          </p>
        </div>
      </div>
    </div>
  );
}