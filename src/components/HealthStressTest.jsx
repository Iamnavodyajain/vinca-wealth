'use client';

import { useState, useEffect } from 'react';
import { 
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { TrendingDown, Calendar, Shield, DollarSign } from 'lucide-react';
import { calculateHealthImpact } from '@/lib/healthStressEngine';

export default function HealthStressTest({ scenario, userInputs }) {
  const [analysis, setAnalysis] = useState(null);
  const [corpusData, setCorpusData] = useState([]);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    if (!scenario || !userInputs) return;

    // Calculate health impact
    const result = calculateHealthImpact(userInputs, scenario);
    setAnalysis(result);
    setMetrics(result.metrics);

    // Generate corpus projection data
    const projectionData = [];
    const startAge = userInputs.currentAge;
    const endAge = Math.max(userInputs.lifespan, result.metrics.depletionAge) + 5;

    for (let age = startAge; age <= endAge; age += 5) {
      const yearsFromNow = age - startAge;
      
      // Calculate baseline corpus at this age
      const baselineCorpus = calculateBaselineCorpus(userInputs, yearsFromNow);
      
      // Calculate health-adjusted corpus
      const healthAdjustedCorpus = calculateHealthAdjustedCorpus(
        baselineCorpus,
        yearsFromNow,
        scenario,
        userInputs
      );

      projectionData.push({
        age,
        baseline: Math.round(baselineCorpus),
        healthAdjusted: Math.round(healthAdjustedCorpus),
        difference: Math.round(baselineCorpus - healthAdjustedCorpus)
      });
    }

    setCorpusData(projectionData);
  }, [scenario, userInputs]);

  const calculateBaselineCorpus = (inputs, years) => {
    // Simplified baseline calculation
    const { moneySaved, monthlySIP, expectedReturns } = inputs;
    const monthlyRate = expectedReturns / 100 / 12;
    const months = years * 12;
    
    // Future value of lump sum
    const fvLumpSum = moneySaved * Math.pow(1 + expectedReturns/100, years);
    
    // Future value of SIP (simplified)
    const fvSIP = monthlySIP * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    
    return fvLumpSum + fvSIP;
  };

  const calculateHealthAdjustedCorpus = (baseline, years, scenario, inputs) => {
    // Apply health cost impact based on scenario
    let healthCostMultiplier = 1;
    
    switch(scenario.id) {
      case 'everyday':
        healthCostMultiplier = 0.95; // 5% annual health costs
        break;
      case 'planned':
        healthCostMultiplier = 0.85; // 15% impact (event-based)
        break;
      case 'high-impact':
        healthCostMultiplier = 0.70; // 30% significant impact
        break;
      default:
        healthCostMultiplier = 1;
    }
    
    // Apply compounding impact over years
    const impact = Math.pow(healthCostMultiplier, Math.min(years, 10));
    return baseline * impact;
  };

  if (!analysis || !metrics) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign size={20} className="text-green-600" />
            </div>
            <div>
              <div className="text-sm text-slate-500">Health-Adjusted Corpus</div>
              <div className="text-2xl font-bold text-slate-900">
                ₹{(metrics.healthAdjustedCorpus / 10000000).toFixed(1)} Cr
              </div>
            </div>
          </div>
          <div className="text-sm text-slate-600">
            vs ₹{(metrics.baselineCorpus / 10000000).toFixed(1)} Cr baseline
            <span className="ml-2 text-rose-600 font-medium">
              ({(metrics.corpusReduction * 100).toFixed(0)}% reduction)
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Calendar size={20} className="text-amber-600" />
            </div>
            <div>
              <div className="text-sm text-slate-500">Depletion Age</div>
              <div className="text-2xl font-bold text-slate-900">
                {metrics.depletionAge} years
              </div>
            </div>
          </div>
          <div className="text-sm text-slate-600">
            vs {metrics.baselineDepletionAge} years baseline
            <span className="ml-2 text-rose-600 font-medium">
              ({metrics.yearsEarlier} years earlier)
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield size={20} className="text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-slate-500">Hospitalization Coverage</div>
              <div className="text-2xl font-bold text-slate-900">
                {metrics.hospitalizationDays} days
              </div>
            </div>
          </div>
          <div className="text-sm text-slate-600">
            At ₹20,000/day private hospital
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-rose-100 rounded-lg">
              <TrendingDown size={20} className="text-rose-600" />
            </div>
            <div>
              <div className="text-sm text-slate-500">Annual Health Cost</div>
              <div className="text-2xl font-bold text-slate-900">
                ₹{(metrics.annualHealthCost / 100000).toFixed(1)}L
              </div>
            </div>
          </div>
          <div className="text-sm text-slate-600">
            Growing at 9% annually
          </div>
        </div>
      </div>

      {/* Corpus Projection Chart */}
      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <h4 className="text-lg font-semibold text-slate-800 mb-6">
          Retirement Corpus Projection: Baseline vs Health-Adjusted
        </h4>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={corpusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="age" 
                stroke="#64748b"
                label={{ value: 'Age', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                stroke="#64748b"
                tickFormatter={(value) => `₹${(value/10000000).toFixed(0)}Cr`}
                width={80}
              />
              <Tooltip 
                formatter={(value) => [`₹${(value/10000000).toFixed(2)} Cr`, '']}
                labelFormatter={(label) => `Age ${label}`}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="baseline"
                name="Baseline Corpus"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="healthAdjusted"
                name="Health-Adjusted Corpus"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-sm text-slate-600">
          <p>
            Shows how your retirement corpus might be affected by health-related expenses. 
            The shaded area represents the potential impact of "{scenario.title.toLowerCase()}" 
            on your long-term financial independence.
          </p>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h5 className="font-semibold text-slate-800 mb-4">
            Impact Breakdown
          </h5>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-slate-600">Corpus Reduction</span>
                <span className="text-sm font-medium text-slate-900">
                  {(metrics.corpusReduction * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-rose-500 h-2 rounded-full"
                  style={{ width: `${metrics.corpusReduction * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-slate-600">Years of Retirement Lost</span>
                <span className="text-sm font-medium text-slate-900">
                  {metrics.yearsEarlier} years
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-amber-500 h-2 rounded-full"
                  style={{ width: `${Math.min(metrics.yearsEarlier * 10, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-slate-600">Additional Annual Expense</span>
                <span className="text-sm font-medium text-slate-900">
                  ₹{(metrics.annualHealthCost / 12000).toFixed(0)}K/month
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${Math.min(metrics.annualHealthCost / userInputs.monthlyExpenses / 10, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h5 className="font-semibold text-slate-800 mb-4">
            Considerations
          </h5>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-green-500 flex-shrink-0"></div>
              <p className="text-sm text-slate-600">
                Consider building a separate health emergency fund covering 6-12 months of potential medical costs
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-green-500 flex-shrink-0"></div>
              <p className="text-sm text-slate-600">
                Review health insurance coverage adequacy periodically as healthcare costs rise
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-green-500 flex-shrink-0"></div>
              <p className="text-sm text-slate-600">
                Factor healthcare inflation (8-10%) separately from general inflation in retirement planning
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-green-500 flex-shrink-0"></div>
              <p className="text-sm text-slate-600">
                Maintain lifestyle flexibility to adjust spending if major health events occur
              </p>
            </div>
          </div>
          <div className="mt-6 p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 italic">
              Note: This analysis is educational. Consult with financial and healthcare professionals 
              for personalized advice. We do not recommend specific insurance products or treatments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}