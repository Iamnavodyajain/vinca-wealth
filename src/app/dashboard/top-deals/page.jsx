'use client';

import { useState } from 'react';
import TopAssetsOverview from '@/components/top-assets/TopAssetsOverview';
import AssetLeaderboard from '@/components/top-assets/AssetLeaderboard';
import AssetCharts from '@/components/top-assets/AssetCharts';
import HistoricalPlanComparison from '@/components/PlanComparison';
import PremiumRetirementImpact from '@/components/PremiumRetirementImpact';
import { Target, BarChart3, TrendingUp, Shield, Crown } from 'lucide-react';
import { usePremium } from '@/lib/premium';

export default function TopDealsPage() {
  const { isPremium, upgradeToPremium } = usePremium();
  const [formData] = useState({
    retirementAge: 60,
    lifespan: 85,
    monthlyExpenses: 50000,
    corpusAtRetirement: 20000000
  });

  const [results] = useState({
    corpusAtRetirement: 20000000,
    withdrawalRate: 4
  });

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-semibold text-slate-900">
          Top Asset Analysis (Retirement Context)
        </h1>
        <p className="text-slate-600 mt-2 text-base">
          Educational analysis of how asset classes historically behaved during retirement periods
        </p>
      </div>

      {/* Premium Feature Card */}
      {!isPremium && (
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <Crown size={24} className="text-amber-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Unlock Personalized Retirement Analysis
                </h3>
                <p className="text-slate-600">
                  See how historical patterns could affect YOUR retirement plan. Understand survival probabilities, sequence risk, and confidence scores based on your specific inputs.
                </p>
              </div>
            </div>
            <button
              onClick={upgradeToPremium}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-md hover:shadow-lg whitespace-nowrap"
            >
              Unlock Premium Analysis
            </button>
          </div>
        </div>
      )}

      {/* Section 1: Premium Analysis */}
      <div className="mb-10">
        <PremiumRetirementImpact
          formData={formData}
          results={results}
        />
      </div>

      {/* Section 2: Educational Asset Analysis */}
      <div className="bg-slate-50/60 rounded-2xl p-6 lg:p-8 mb-10">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-slate-200 rounded-lg">
              <BarChart3 size={20} className="text-slate-700" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Educational Asset Analysis
              </h2>
              <p className="text-slate-600 text-sm">
                Historical patterns and rankings for educational purposes only
              </p>
            </div>
          </div>
          
          {/* Disclaimer Banner */}
          <div className="mb-6 p-4 bg-white border border-slate-300 rounded-lg">
            <p className="text-sm text-slate-700 font-medium">
              ⚠️ Educational Content – Not Investment Advice
            </p>
            <p className="text-sm text-slate-600 mt-1">
              This analysis uses historical data to show patterns, not to recommend investments. 
              Past performance does not guarantee future results. Consult a SEBI-registered advisor for personal advice.
            </p>
          </div>
        </div>

        {/* Overview Metrics */}
        <div className="mb-8">
          <TopAssetsOverview />
        </div>

        {/* Horizontal Flow Content */}
        <div className="space-y-8">
          {/* Asset Leaderboard */}
          <div>
            <AssetLeaderboard />
          </div>

          {/* Historical Pattern Analysis */}
          <div>
            <AssetCharts />
          </div>

          {/* Historical Plan Comparison */}
          <div>
            <HistoricalPlanComparison />
          </div>

          {/* Educational Insights */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">
              Key Retirement Planning Insights
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-5 bg-slate-50 rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Target size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">Historical Patterns Matter</h4>
                    <p className="text-sm text-slate-600">
                      Different asset classes have behaved differently during past retirement periods. 
                      Understanding these patterns helps set realistic expectations.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-slate-50 rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-100 rounded-lg">
                    <TrendingUp size={20} className="text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">Sequence of Returns Risk</h4>
                    <p className="text-sm text-slate-600">
                      The order in which returns occur can significantly impact retirement outcomes, 
                      even with the same average returns over time.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-slate-50 rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-100 rounded-lg">
                    <BarChart3 size={20} className="text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">Diversification Trade-offs</h4>
                    <p className="text-sm text-slate-600">
                      Different asset allocations have historically offered different trade-offs 
                      between growth potential and stability during retirement.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-slate-50 rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Shield size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">Building Confidence</h4>
                    <p className="text-sm text-slate-600">
                      Historical analysis helps build evidence-based understanding, not predictions. 
                      Use this to inform conversations with your financial advisor.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Disclaimer */}
      <div className="border-t border-slate-200 pt-8">
        <div className="text-sm text-slate-600 bg-slate-50 p-6 rounded-xl">
          <p className="font-medium text-slate-900 mb-3">Important Educational Information:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>This analysis uses historical data and is for educational purposes only</li>
            <li>Past performance does not indicate future results</li>
            <li>Different asset classes may behave differently in various economic conditions</li>
            <li>This analysis shows historical patterns, NOT investment recommendations</li>
            <li>No asset class or investment is being recommended or endorsed</li>
            <li>Consult with a SEBI-registered investment advisor before making any investment decisions</li>
            <li>This is not investment advice, recommendation, or solicitation to buy/sell any securities</li>
          </ul>
        </div>
      </div>
    </div>
  );
}