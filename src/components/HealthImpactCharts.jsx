'use client';

import { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { TrendingUp, AlertTriangle, Info } from 'lucide-react';
import { calculateHealthImpact } from '@/lib/healthStressEngine';

export default function HealthImpactCharts({ scenario, userInputs, isPremium }) {
  const [chartData, setChartData] = useState([]);
  const [affordabilityData, setAffordabilityData] = useState([]);

  useEffect(() => {
    if (!scenario || !userInputs) return;

    // Generate medical inflation trend data
    const medicalInflationData = [];
    const currentYear = new Date().getFullYear();
    
    for (let i = 0; i < 20; i++) {
      const year = currentYear + i;
      const baseCost = scenario.id === 'everyday' ? 30000 :
                      scenario.id === 'planned' ? 300000 :
                      1500000;
      
      // Medical inflation at 9% annually
      const cost = baseCost * Math.pow(1.09, i);
      
      medicalInflationData.push({
        year: year.toString(),
        cost: Math.round(cost / 10000) * 10000, // Round to nearest 10k
        category: scenario.title
      });
    }

    setChartData(medicalInflationData);

    // Generate affordability comparison
    const affordability = [
      { scenario: 'Current Emergency Fund', days: 7 },
      { scenario: 'With Health Buffer', days: 14 },
      { scenario: 'Ideal Coverage', days: 30 }
    ];
    
    if (isPremium) {
      // Premium gets more detailed data
      affordability.push(
        { scenario: 'This Scenario', days: scenario.id === 'high-impact' ? 5 : 10 }
      );
    }
    
    setAffordabilityData(affordability);
  }, [scenario, userInputs, isPremium]);

  if (!scenario) return null;

  return (
    <div className="space-y-8">
      {/* Medical Inflation Trend */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={20} className="text-amber-600" />
          <h4 className="text-lg font-medium text-slate-800">
            Medical Cost Growth Trend
          </h4>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="year" 
                  stroke="#64748b"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="#64748b"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `₹${(value/100000).toFixed(1)}L`}
                />
                <Tooltip 
                  formatter={(value) => [`₹${(value).toLocaleString()}`, 'Estimated Cost']}
                  labelFormatter={(label) => `Year: ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="cost"
                  name="Estimated Medical Cost"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-sm text-slate-600">
            <p>
              Healthcare costs in India have historically grown at 8-10% annually, 
              significantly higher than general inflation. This chart shows how costs for 
              "{scenario.title.toLowerCase()}" might increase over 20 years.
            </p>
          </div>
        </div>
      </div>

      {/* Comparative Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cost Ranges by Category */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Info size={20} className="text-blue-600" />
            <h4 className="text-lg font-medium text-slate-800">
              Average Cost Comparison
            </h4>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { category: 'Everyday Care', cost: 32500 },
                    { category: 'Planned Events', cost: 325000 },
                    { category: 'High Impact', cost: 2000000 }
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="category" 
                    stroke="#64748b"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#64748b"
                    tickFormatter={(value) => `₹${(value/100000).toFixed(1)}L`}
                  />
                  <Tooltip 
                    formatter={(value) => [`₹${(value).toLocaleString()}`, 'Average Cost']}
                  />
                  <Bar 
                    dataKey="cost" 
                    name="Typical Cost Range"
                    fill={scenario.id === 'everyday' ? '#3b82f6' : 
                          scenario.id === 'planned' ? '#f59e0b' : '#ef4444'}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Hospitalization Affordability */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={20} className="text-rose-600" />
            <h4 className="text-lg font-medium text-slate-800">
              Hospitalization Affordability
            </h4>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={affordabilityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="scenario" 
                    stroke="#64748b"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#64748b"
                    label={{ 
                      value: 'Days Affordable', 
                      angle: -90, 
                      position: 'insideLeft',
                      offset: 10 
                    }}
                  />
                  <Tooltip />
                  <Bar 
                    dataKey="days" 
                    name="Days of Private Hospitalization"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-slate-600">
              <p>
                Based on average private hospital costs of ₹15,000-₹25,000 per day. 
                Shows how many days of hospitalization could be covered by different funding sources.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Note */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <Info size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h5 className="font-medium text-blue-800 mb-1">
              How health costs affect retirement planning
            </h5>
            <p className="text-sm text-blue-700">
              Medical expenses in retirement can significantly accelerate corpus depletion. 
              A single major health event in early retirement can reduce your retirement corpus by 15-25%. 
              Ongoing health conditions add recurring expenses that compound with healthcare inflation. 
              This analysis helps visualize these impacts without creating unnecessary anxiety.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}