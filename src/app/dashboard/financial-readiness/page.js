'use client';

import { useState } from 'react';
import { useCalculator } from '../../../context/CalculatorContext';
import { useRouter } from 'next/navigation';
import CorpusChart from '../../../components/CorpusChart';
import CorpusTable from '../../../components/CorpusTable';
import CTASection from '../../../components/CTASection';
import StatCard from '../../../components/StatCard';
import StatusBanner from '../../../components/StatusBanner';
import RealisticRetirementOptimizer from '../../../components/RealisticRetirementOptimizer';
import { formatCurrency } from '../../../lib/formatters';

// Scenario Modal for aggressive fantasies
const AggressiveScenarioModal = ({ isOpen, onClose, formData, onUpgrade }) => {
  const [scenarios, setScenarios] = useState([]);
  
  if (!isOpen) return null;

  const calculateAggressiveScenarios = () => {
    const {
      currentAge = 30,
      monthlyExpenses = 0,
      expectedReturns = 12,
      inflationRate = 6,
      lifespan = 85,
      monthlyIncome = 0,
      moneySaved = 0
    } = formData;

    const targetAges = [55, 50, 45, 40, 35];
    const scenarios = [];

    for (const targetAge of targetAges) {
      if (targetAge <= currentAge) continue;

      const yearsToTarget = targetAge - currentAge;
      if (yearsToTarget < 5) continue;

      // Simplified calculation
      const annualExpense = monthlyExpenses * 12;
      const requiredCorpus = annualExpense * 25 * Math.pow(1 + inflationRate/100, yearsToTarget);
      
      const monthlyRate = Math.pow(1 + expectedReturns/100, 1/12) - 1;
      const monthsToTarget = yearsToTarget * 12;
      
      const futureValueFactor = (Math.pow(1 + monthlyRate, monthsToTarget) - 1) / monthlyRate;
      const requiredSIP = Math.round((requiredCorpus - (moneySaved || 0)) / futureValueFactor);
      
      const requiredIncome = requiredSIP + monthlyExpenses + 20000;
      const isRealistic = requiredIncome <= monthlyIncome * 1.3;
      const incomeGap = requiredIncome - monthlyIncome;

      scenarios.push({
        targetAge,
        requiredSIP,
        requiredIncome,
        currentIncome: monthlyIncome,
        incomeGap,
        isRealistic,
        yearsToTarget,
        message: isRealistic
          ? `Possible with ${Math.round((requiredIncome/monthlyIncome - 1) * 100)}% income growth`
          : `Requires ₹${formatCurrency(incomeGap)}/month additional income`
      });
    }

    return scenarios;
  };

  const calculatedScenarios = calculateAggressiveScenarios();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Aggressive Early Retirement Scenarios</h3>
              <p className="text-slate-600 text-sm mt-1">
                Mathematically possible, but financially challenging
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                  <span className="text-amber-600">⚠</span>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Reality Check</p>
                  <p className="text-sm text-slate-700 mt-1">
                    These scenarios show what's mathematically required for early retirement. 
                    They are NOT recommendations. Early retirement requires exponential increases in savings.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {calculatedScenarios.map((scenario, index) => (
                <div key={index} className={`p-4 rounded-lg border ${
                  scenario.isRealistic ? 'border-green-200 bg-green-50' : 'border-slate-200 bg-slate-50'
                }`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="text-lg font-bold text-slate-900">Retire at {scenario.targetAge}</div>
                      <div className="text-sm text-slate-600">{scenario.yearsToTarget} years from now</div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      scenario.isRealistic ? 'bg-green-100 text-green-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {scenario.isRealistic ? 'Borderline possible' : 'Challenging'}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Required SIP:</span>
                      <span className="font-medium text-slate-900">{formatCurrency(scenario.requiredSIP)}/month</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Required income:</span>
                      <span className="font-medium text-slate-900">{formatCurrency(scenario.requiredIncome)}/month</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Your current income:</span>
                      <span className="font-medium text-slate-900">{formatCurrency(scenario.currentIncome)}/month</span>
                    </div>
                    
                    {scenario.incomeGap > 0 && (
                      <div className="mt-3 p-2 bg-red-50 rounded border border-red-100">
                        <p className="text-xs text-red-700">
                          <strong>Gap:</strong> Need ₹{formatCurrency(scenario.incomeGap)}/month more income
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-xs text-slate-600 mt-3">{scenario.message}</p>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200">
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    const calculatorSection = document.getElementById('calculator-inputs');
                    if (calculatorSection) {
                      calculatorSection.scrollIntoView({ behavior: 'smooth' });
                    }
                    onClose();
                  }}
                  className="btn-primary flex-1"
                >
                  Update Income Details
                </button>
                <button
                  onClick={onUpgrade}
                  className="btn-outline flex-1 border-blue-500 text-blue-600 hover:bg-blue-50"
                >
                  Get Premium Income Analysis
                </button>
                <button
                  onClick={onClose}
                  className="btn-outline flex-1"
                >
                  Close
                </button>
              </div>
              
              <p className="text-xs text-slate-500 mt-4 text-center">
                Remember: Survival is cheap. Early retirement is expensive. Focus on realistic optimization first.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function FinancialReadinessPage() {
  const { dashboardData, formData, results } = useCalculator();
  const router = useRouter();
  const [showAggressiveScenarios, setShowAggressiveScenarios] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleUpgradeToPremium = () => {
    setShowUpgradeModal(true);
  };

  const handleExploreScenarios = () => {
    setShowAggressiveScenarios(true);
  };

  if (!dashboardData && !formData?.yearlyData) {
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
  const currentResults = results || formData;

  return (
    <>
      {/* Header */}
      <div className="mb-12 text-left pt-8">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Your Financial Dashboard
        </h1>
        <p className="text-slate-600 mt-2">
          Track your journey to financial freedom with realistic, income-aware projections
        </p>
      </div>

      {/* Status Banner */}
      {((results && Object.keys(results).length) || formData?.freedomAge) ? (
        <>
          <StatusBanner
            status={currentResults.freedomAge === 'Achieved' ? 'Achieved' : 'Pending'}
            freedomAge={currentResults.depletionAge || currentResults.freedomAge}
            expectedCorpus={currentResults.expectedCorpus}
            requiredCorpus={currentResults.requiredCorpus}
          />

          {/* Existing Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <StatCard
              title="Freedom Age"
              value={currentResults.freedomAge === 'Achieved' ? 'Achieved' : currentResults.depletionAge || '—'}
              type="age"
              description="Age when you achieve full financial freedom"
              color={currentResults.freedomAge === 'Achieved' ? 'primary' : 'warning'}
            />
            
            <StatCard
              title="Expected Corpus"
              value={currentResults.expectedCorpus || 0}
              type="currency"
              description="Projected wealth at retirement"
            />
            
            <StatCard
              title="Required Corpus"
              value={currentResults.requiredCorpus || 0}
              type="currency"
              description="Amount needed for sustainable retirement"
            />
            
            <StatCard
              title="Monthly SIP Gap"
              value={currentResults.sipGap || 0}
              type="currency"
              description="Additional investment needed monthly"
              color={currentResults.sipGap > 0 ? 'danger' : 'primary'}
            />
          </div>

          {/* Key Insights */}
          <div className="card mt-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Key Insights</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  currentResults.freedomAge === 'Achieved' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                }`}>
                  {currentResults.freedomAge === 'Achieved' ? '✓' : '!'}
                </div>
                <div>
                  <p className="font-medium text-slate-900">
                    {currentResults.freedomAge === 'Achieved'
                      ? 'Congratulations! Your current plan leads to sustainable financial freedom.'
                      : 'Your current plan needs adjustment to achieve sustainable financial freedom.'}
                  </p>
                  <p className="text-sm text-slate-600 mt-1">
                    {currentResults.freedomAge === 'Achieved'
                      ? 'Your retirement corpus is projected to last beyond your expected lifespan.'
                      : `Based on current projections, your corpus may deplete by age ${currentResults.depletionAge || '—'}.`}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                  ₹
                </div>
                <div>
                  <p className="font-medium text-slate-900">
                    {currentResults.sipGap > 0 
                      ? `Consider increasing your monthly SIP by ${formatCurrency(currentResults.sipGap || 0)}`
                      : 'Your current SIP rate is sufficient for your goals'}
                  </p>
                  <p className="text-sm text-slate-600 mt-1">
                    {currentResults.sipGap > 0
                      ? 'This adjustment will help bridge the gap between your expected and required corpus.'
                      : 'Continue with your current investment discipline to stay on track.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Corpus Chart - Visual Timeline */}
          <CorpusChart data={data} />

          {/* Corpus Table - Year-by-Year Breakdown */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Year-by-Year Breakdown</h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">Current Plan</span>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">Premium: Income Scenarios</span>
              </div>
            </div>
            <CorpusTable data={data} />
            <p className="text-sm text-slate-600 mt-3 text-center">
              This table shows your projected growth year-by-year under current assumptions.
              <br />
              <span className="text-blue-600 font-medium">
                Upgrade to Premium to see how income changes affect these projections.
              </span>
            </p>
          </div>

          {/* Realistic Retirement Optimizer - Now with income-aware logic */}
          <div className="mt-8">
            <RealisticRetirementOptimizer 
              formData={{
                ...formData,
                monthlyExpenses: formData?.monthlyExpenses || 0,
                monthlySIP: formData?.monthlySIP || 0,
                currentAge: formData?.currentAge || 30,
                retirementAge: formData?.retirementAge || 60,
                lifespan: formData?.lifespan || 85,
                inflationRate: formData?.inflationRate || 6,
                expectedReturns: formData?.expectedReturns || 12,
                moneySaved: formData?.moneySaved || 0
              }}
              results={currentResults}
              onExploreScenarios={handleExploreScenarios}
              onUpgradeToPremium={handleUpgradeToPremium}
            />
          </div>

          {/* Aggressive Scenario Modal */}
          <AggressiveScenarioModal 
            isOpen={showAggressiveScenarios}
            onClose={() => setShowAggressiveScenarios(false)}
            formData={{
              ...formData,
              monthlyIncome: formData?.monthlyIncome || 0,
              monthlyExpenses: formData?.monthlyExpenses || 0
            }}
            onUpgrade={handleUpgradeToPremium}
          />

          {/* Upgrade Modal */}
          {showUpgradeModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl max-w-lg w-full">
                <div className="p-8">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-6">
                      <span className="text-white text-2xl">☆</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">Upgrade to Premium Reality Analysis</h3>
                    <p className="text-slate-600 mb-8">
                      Get income-aware, mathematically realistic retirement planning
                    </p>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center">
                      <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mr-3">
                        <span className="text-green-600 text-sm">✓</span>
                      </span>
                      <span className="text-slate-700">Income-expense reality analysis</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mr-3">
                        <span className="text-green-600 text-sm">✓</span>
                      </span>
                      <span className="text-slate-700">Multiple optimization paths</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mr-3">
                        <span className="text-green-600 text-sm">✓</span>
                      </span>
                      <span className="text-slate-700">Income growth scenarios</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mr-3">
                        <span className="text-green-600 text-sm">✓</span>
                      </span>
                      <span className="text-slate-700">Advisor-ready reality report</span>
                    </div>
                  </div>
                  
                  <div className="text-center mb-8">
                    <div className="text-4xl font-bold text-slate-900">₹999</div>
                    <div className="text-slate-600">per year</div>
                    <p className="text-sm text-slate-500 mt-2">Cancel anytime • 7-day money-back guarantee</p>
                  </div>
                  
                  <div className="space-y-4">
                    <button
                      onClick={() => {
                        alert('Redirecting to payment...');
                        setShowUpgradeModal(false);
                      }}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                    >
                      Upgrade to Realistic Planning
                    </button>
                    <button
                      onClick={() => setShowUpgradeModal(false)}
                      className="w-full py-3 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      Maybe Later
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="card text-center">
          <p className="text-slate-600">Complete the financial freedom calculator to see your personalized analyses.</p>
        </div>
      )}

      {/* Financial Essentials */}
      <div className="card mt-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Financial Essentials</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-lg border">
            <h4 className="font-medium text-slate-900">Life Insurance</h4>
            <p className="text-sm text-slate-600 mt-2">Protects your loved ones financially in case of unforeseen events</p>
            <div className="mt-3 text-sm font-semibold">10x Annual Income</div>
          </div>

          <div className="p-4 bg-white rounded-lg border">
            <h4 className="font-medium text-slate-900">Health Insurance</h4>
            <p className="text-sm text-slate-600 mt-2">Comprehensive health coverage for medical emergencies</p>
            <div className="mt-3 text-sm font-semibold">Coverage of 50% of Annual Income</div>
          </div>

          <div className="p-4 bg-white rounded-lg border">
            <h4 className="font-medium text-slate-900">Emergency Fund</h4>
            <p className="text-sm text-slate-600 mt-2">6-12 months of expenses as a financial safety net</p>
            <div className="mt-3 text-sm font-semibold">₹6,00,000</div>
          </div>

          <div className="p-4 bg-white rounded-lg border">
            <h4 className="font-medium text-slate-900">Required Monthly SIP</h4>
            <p className="text-sm text-slate-600 mt-2">Additional monthly SIP needed to meet your goals</p>
            <div className="mt-3 text-sm font-semibold">{currentResults.sipGap ? formatCurrency(currentResults.sipGap) : '—'}</div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-6">
        <CTASection />
      </div>

      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-slate-50 rounded-xl text-center">
        <p className="text-sm text-slate-500">
          <strong>Disclaimer:</strong> This tool provides realistic, income-aware projections based on your inputs. 
          It separates survival, optimization, and fantasy scenarios clearly. 
          This is not investment advice. Please consult with a certified financial planner for personalized guidance.
        </p>
      </div>
    </>
  );
}