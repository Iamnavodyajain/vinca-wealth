'use client';

import { useEffect, useState } from 'react';
import { useCalculator } from '../../context/CalculatorContext';
import { useRouter } from 'next/navigation';
import CorpusChart from '../../components/CorpusChart';
import CorpusTable from '../../components/CorpusTable';
import InsuranceChecklist from '../../components/insuranceChecklist';
import CTASection from '../../components/CTASection';
import StatCard from '../../components/StatCard';
import { formatCurrency } from '../../lib/formatters';

export default function DashboardPage() {
  const { dashboardData, formData, results } = useCalculator();
  const router = useRouter();
  const [readinessScore, setReadinessScore] = useState(0);

  useEffect(() => {
    // Calculate financial readiness score
    if (formData) {
      let score = 0;
      
      // SIP to expense ratio (ideal: 20%+)
      const sipRatio = (formData.monthlySIP / formData.monthlyExpenses) * 100;
      score += Math.min(sipRatio / 20 * 25, 25); // Max 25 points
      
      // Savings to expense ratio (ideal: 12x)
      const savingsRatio = formData.moneySaved / (formData.monthlyExpenses * 12);
      score += Math.min(savingsRatio / 12 * 25, 25); // Max 25 points
      
      // Age to retirement gap (ideal: 30+ years)
      const yearsToRetirement = formData.retirementAge - formData.currentAge;
      score += Math.min(yearsToRetirement / 30 * 25, 25); // Max 25 points
      
      // Expected returns vs inflation (ideal: 6%+ gap)
      const returnGap = formData.expectedReturns - formData.inflationRate;
      score += Math.min(returnGap / 6 * 25, 25); // Max 25 points
      
      setReadinessScore(Math.round(score));
    }
  }, [formData]);

  const getReadinessLevel = (score) => {
    if (score >= 80) return { level: 'Excellent', color: 'primary' };
    if (score >= 60) return { level: 'Good', color: 'warning' };
    return { level: 'Needs Work', color: 'danger' };
  };

  const readiness = getReadinessLevel(readinessScore);

  if (!dashboardData && !formData.yearlyData) {
    return (
      <div className="py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">
            Dashboard Not Available
          </h2>
          <p className="text-slate-600 mb-8">
            Complete the financial freedom calculator to see your personalized dashboard.
          </p>
          <button
            onClick={() => router.push('/calculator')}
            className="btn-primary"
          >
            Go to Calculator
          </button>
        </div>
      </div>
    );
  }

  const data = dashboardData || formData.yearlyData;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Your Financial Dashboard
          </h1>
          <p className="text-slate-600 mt-2">
            Track your journey to financial freedom with detailed projections and insights
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Financial Readiness Summary */}
            <div className="card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Financial Readiness</h3>
                  <p className="text-sm text-slate-500">Your overall preparedness for financial freedom</p>
                </div>
                <div className={`mt-2 sm:mt-0 px-4 py-2 rounded-full ${
                  readiness.color === 'primary' ? 'bg-green-100 text-green-700' :
                  readiness.color === 'warning' ? 'bg-orange-100 text-orange-700' :
                  'bg-red-100 text-red-700'
                } font-medium`}>
                  {readiness.level}
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-700">Readiness Score</span>
                    <span className="font-medium">{readinessScore}/100</span>
                  </div>
                  <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        readiness.color === 'primary' ? 'bg-green-500' :
                        readiness.color === 'warning' ? 'bg-orange-500' :
                        'bg-red-500'
                      } transition-all duration-500`}
                      style={{ width: `${readinessScore}%` }}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <StatCard
                    title="SIP/Expense Ratio"
                    value={`${((formData.monthlySIP / formData.monthlyExpenses) * 100).toFixed(1)}%`}
                    type="percentage"
                    description="Target: 20% or higher"
                    color={formData.monthlySIP / formData.monthlyExpenses >= 0.2 ? 'primary' : 'warning'}
                  />
                  
                  <StatCard
                    title="Emergency Fund"
                    value={`${Math.round(formData.moneySaved / (formData.monthlyExpenses * 12))} months`}
                    description="Target: 12 months expenses"
                    color={formData.moneySaved >= formData.monthlyExpenses * 12 ? 'primary' : 'warning'}
                  />
                </div>
              </div>
            </div>

            {/* Corpus Chart */}
            <CorpusChart data={data} />

            {/* Corpus Table */}
            <CorpusTable data={data} />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Insurance Checklist */}
            <InsuranceChecklist />

            {/* Quick Stats */}
            <div className="card">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-slate-500 mb-1">Years to Retirement</div>
                  <div className="text-2xl font-semibold text-slate-900">
                    {formData.retirementAge - formData.currentAge} years
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-slate-500 mb-1">Total Investment Period</div>
                  <div className="text-2xl font-semibold text-slate-900">
                    {formData.investmentYears} years
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-slate-500 mb-1">Post-Retirement Years</div>
                  <div className="text-2xl font-semibold text-slate-900">
                    {formData.lifespan - formData.retirementAge} years
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-slate-500 mb-1">Real Returns (After Inflation)</div>
                  <div className="text-2xl font-semibold text-slate-900">
                    {(formData.expectedReturns - formData.inflationRate).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Action Items */}
            <div className="card">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Recommended Actions</h3>
              <div className="space-y-3">
                {formData.sipGap > 0 && (
                  <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                    <div className="w-5 h-5 bg-red-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-sm">!</span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Increase Monthly SIP</p>
                      <p className="text-sm text-slate-600">
                        Add {formatCurrency(formData.sipGap)} to your monthly investments
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm">✓</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Review Asset Allocation</p>
                    <p className="text-sm text-slate-600">
                      Ensure proper diversification across equity, debt, and other assets
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-sm">↑</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Annual SIP Increase</p>
                    <p className="text-sm text-slate-600">
                      Maintain {formData.sipIncreaseRate}% annual increase in your SIP
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12">
          <CTASection />
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-slate-50 rounded-xl text-center">
          <p className="text-sm text-slate-500">
            <strong>Disclaimer:</strong> This tool provides projections based on your inputs and assumptions. 
            Actual results may vary due to market conditions, inflation changes, and personal circumstances. 
            This is not financial advice. Please consult with a certified financial planner for personalized guidance.
          </p>
        </div>
      </div>
    </div>
  );
}