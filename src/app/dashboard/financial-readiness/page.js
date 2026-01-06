// src/app/dashboard/financial-readiness/page.js
'use client';

import { useEffect, useState } from 'react';
import { useCalculator } from '../../../context/CalculatorContext';
import { useRouter } from 'next/navigation';
import CorpusChart from '../../../components/CorpusChart';
import CorpusTable from '../../../components/CorpusTable';
import CTASection from '../../../components/CTASection';
import StatCard from '../../../components/StatCard';
import StatusBanner from '../../../components/StatusBanner';
import SIPAccelerator from '../../../components/SIPAccelerator';
import { formatCurrency } from '../../../lib/formatters';

// Scenario Exploration Modal Component
const ScenarioModal = ({ isOpen, onClose, formData, results, onUpgrade }) => {
  const [selectedIncrease, setSelectedIncrease] = useState(5000);
  const [showPremiumPreview, setShowPremiumPreview] = useState(false);
  
  if (!isOpen) return null;

  const currentSIP = formData.monthlySIP || 0;
  const currentAge = formData.currentAge || 30;
  const retirementAge = formData.retirementAge || 60;
  const yearsToRetirement = retirementAge - currentAge;
  
  // Calculate time impact for different SIP increases
  const calculateImpact = (increaseAmount) => {
    if (increaseAmount <= 0) return { monthsSaved: 0, yearsSaved: 0 };
    
    const percentageIncrease = increaseAmount / currentSIP;
    const monthsSaved = Math.round(percentageIncrease * yearsToRetirement * 12 * 0.25);
    const yearsSaved = Math.round(monthsSaved / 12);
    
    return { monthsSaved, yearsSaved };
  };

  // Free tier scenarios (limited)
  const freeScenarios = [
    { amount: 2000, label: 'Small adjustment', isPremium: false },
    { amount: 5000, label: 'Moderate increase', isPremium: false }
  ].map(item => {
    const impact = calculateImpact(item.amount);
    return { ...item, ...impact };
  });

  // Premium scenarios (locked)
  const premiumScenarios = [
    { amount: 10000, label: 'Significant boost', isPremium: true },
    { amount: 15000, label: 'Aggressive growth', isPremium: true },
    { amount: 25000, label: 'Maximum acceleration', isPremium: true }
  ].map(item => {
    const impact = calculateImpact(item.amount);
    return { ...item, ...impact };
  });

  const allScenarios = [...freeScenarios, ...premiumScenarios];

  const YearByYearPreview = () => {
    const selectedScenario = allScenarios.find(s => s.amount === selectedIncrease);
    if (!selectedScenario) return null;

    return (
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <h5 className="font-medium text-blue-900">Year-by-Year Breakdown Preview</h5>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
            Premium Feature
          </span>
        </div>
        
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-white rounded border">
              <div className="text-xs text-slate-600">Year 1</div>
              <div className="font-semibold text-slate-900 mt-1">+{formatCurrency(selectedScenario.amount * 12)}</div>
              <div className="text-xs text-slate-500">Additional invested</div>
            </div>
            <div className="text-center p-3 bg-white rounded border">
              <div className="text-xs text-slate-600">Year 5</div>
              <div className="font-semibold text-slate-900 mt-1">₹{formatCurrency(Math.round(selectedScenario.amount * 12 * 5 * 1.6))}</div>
              <div className="text-xs text-slate-500">Estimated value</div>
            </div>
            <div className="text-center p-3 bg-white rounded border">
              <div className="text-xs text-slate-600">Retirement</div>
              <div className="font-semibold text-slate-900 mt-1">{selectedScenario.yearsSaved}y</div>
              <div className="text-xs text-slate-500">Timeline saved</div>
            </div>
          </div>
          
          <div className="text-xs text-blue-700 text-center">
            Upgrade to see full year-by-year breakdown with compound growth projections
          </div>
        </div>
      </div>
    );
  };

  const DownloadPlanPreview = () => {
    return (
      <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
        <div className="flex items-center justify-between mb-3">
          <h5 className="font-medium text-green-900">Downloadable Action Plan</h5>
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
            Premium Feature
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-2 flex-shrink-0">
              <span className="text-green-600 text-xs">✓</span>
            </span>
            <span className="text-green-800">Personalized SIP increase schedule</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-2 flex-shrink-0">
              <span className="text-green-600 text-xs">✓</span>
            </span>
            <span className="text-green-800">Quarterly review calendar</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-2 flex-shrink-0">
              <span className="text-green-600 text-xs">✓</span>
            </span>
            <span className="text-green-800">Risk assessment and mitigation steps</span>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <button
            onClick={onUpgrade}
            className="text-sm px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Upgrade to Download Plan
          </button>
        </div>
      </div>
    );
  };

  const AdvisorHandoffPreview = () => {
    return (
      <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-200">
        <div className="flex items-center justify-between mb-3">
          <h5 className="font-medium text-purple-900">Advisor Handoff Preparation</h5>
          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
            Premium Feature
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <span className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center mr-2 flex-shrink-0">
              <span className="text-purple-600 text-xs">✓</span>
            </span>
            <span className="text-purple-800">Pre-filled financial advisor questionnaire</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center mr-2 flex-shrink-0">
              <span className="text-purple-600 text-xs">✓</span>
            </span>
            <span className="text-purple-800">Investment analysis summary</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center mr-2 flex-shrink-0">
              <span className="text-purple-600 text-xs">✓</span>
            </span>
            <span className="text-purple-800">Priority consultation scheduling</span>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <button
            onClick={onUpgrade}
            className="text-sm px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Get Advisor-Ready Report
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Explore SIP Scenarios</h3>
              <p className="text-slate-600 text-sm mt-1">
                See how different SIP increases affect your retirement timeline
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
            {/* Scenario Selection */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-slate-900">Select SIP Increase Amount</h4>
                <div className="flex items-center space-x-2">
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">Free</span>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">Premium</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {allScenarios.map((scenario, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg border cursor-pointer transition-all relative ${
                      selectedIncrease === scenario.amount 
                        ? scenario.isPremium ? 'border-blue-500 bg-blue-50' : 'border-green-500 bg-green-50'
                        : 'border-slate-200 hover:border-slate-300'
                    } ${scenario.isPremium ? 'opacity-100' : ''}`}
                    onClick={() => {
                      if (scenario.isPremium) {
                        setShowPremiumPreview(true);
                        return;
                      }
                      setSelectedIncrease(scenario.amount);
                      setShowPremiumPreview(false);
                    }}
                  >
                    {scenario.isPremium && (
                      <div className="absolute -top-2 -right-2">
                        <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                          Premium
                        </span>
                      </div>
                    )}
                    
                    <div className="text-center mb-3">
                      <div className="text-2xl font-bold text-slate-900">
                        +{formatCurrency(scenario.amount)}
                      </div>
                      <div className="text-sm text-slate-600">{scenario.label}</div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Months saved:</span>
                        <span className="font-medium text-slate-900">{scenario.monthsSaved}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Years saved:</span>
                        <span className="font-medium text-slate-900">{scenario.yearsSaved}</span>
                      </div>
                    </div>
                    
                    {scenario.isPremium && (
                      <div className="mt-3 pt-3 border-t border-slate-200">
                        <div className="text-xs text-blue-600 text-center font-medium">
                          Upgrade to unlock
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {showPremiumPreview && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                      <span className="text-blue-600">🔒</span>
                    </div>
                    <div>
                      <p className="font-medium text-blue-900">Premium Feature Locked</p>
                      <p className="text-sm text-blue-700 mt-1">
                        Upgrade to access advanced scenarios, detailed projections, and personalized action plans.
                      </p>
                      <button
                        onClick={onUpgrade}
                        className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Upgrade Now — ₹999/year
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Premium Feature Previews */}
            {!showPremiumPreview && selectedIncrease > 0 && (
              <>
                <YearByYearPreview />
                <DownloadPlanPreview />
                <AdvisorHandoffPreview />
              </>
            )}

            {/* Phased Increase Approach */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <h5 className="font-medium text-slate-900 mb-3">Phased Increase Approach</h5>
              <p className="text-sm text-slate-700 mb-4">
                Consider increasing your SIP gradually over time instead of making one large change.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mr-3">
                    <span className="text-blue-600 text-sm font-medium">1</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Next 3 months</p>
                    <p className="text-sm text-slate-600">
                      Increase by {formatCurrency(selectedIncrease / 3)}/month
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mr-3">
                    <span className="text-blue-600 text-sm font-medium">2</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Months 4-6</p>
                    <p className="text-sm text-slate-600">
                      Reach full increase of {formatCurrency(selectedIncrease)}/month
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
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
                  Update Calculator Inputs
                </button>
                <button
                  onClick={() => {
                    setShowPremiumPreview(true);
                  }}
                  className="btn-outline flex-1 border-blue-500 text-blue-600 hover:bg-blue-50"
                >
                  View Premium Features
                </button>
                <button
                  onClick={onClose}
                  className="btn-outline flex-1"
                >
                  Close
                </button>
              </div>
              
              <p className="text-xs text-slate-500 mt-4 text-center">
                Re-run the calculator after making changes to see updated projections.
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
  const [showScenarios, setShowScenarios] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleUpgradeToPremium = () => {
    setShowUpgradeModal(true);
  };

  const handleExploreScenarios = () => {
    setShowScenarios(true);
  };

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
  const currentResults = results || formData;

  return (
    <>
      {/* Header */}
      <div className="mb-12 text-left pt-8">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Your Financial Dashboard
        </h1>
        <p className="text-slate-600 mt-2">
          Track your journey to financial freedom with detailed projections and insights
        </p>
      </div>

      {/* Status Banner */}
      {((results && Object.keys(results).length) || formData.freedomAge) ? (
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
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">Premium: SIP Scenarios</span>
              </div>
            </div>
            <CorpusTable data={data} />
            <p className="text-sm text-slate-600 mt-3 text-center">
              This table shows your projected growth year-by-year under current assumptions.
              <br />
              <span className="text-blue-600 font-medium">
                Upgrade to Premium to compare different SIP increase scenarios side-by-side.
              </span>
            </p>
          </div>

          {/* SIP Accelerator - Moved below year-by-year breakdown for better storytelling */}
          <div className="mt-8">
            <SIPAccelerator 
              formData={formData}
              results={currentResults}
              onExploreScenarios={handleExploreScenarios}
              onUpgradeToPremium={handleUpgradeToPremium}
            />
          </div>

          {/* Scenario Exploration Modal */}
          <ScenarioModal 
            isOpen={showScenarios}
            onClose={() => setShowScenarios(false)}
            formData={formData}
            results={currentResults}
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
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">Upgrade to Premium</h3>
                    <p className="text-slate-600 mb-8">
                      Get deeper insights, detailed projections, and personalized action plans
                    </p>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center">
                      <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mr-3">
                        <span className="text-green-600 text-sm">✓</span>
                      </span>
                      <span className="text-slate-700">What-if scenario comparisons</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mr-3">
                        <span className="text-green-600 text-sm">✓</span>
                      </span>
                      <span className="text-slate-700">Detailed year-by-year breakdown</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mr-3">
                        <span className="text-green-600 text-sm">✓</span>
                      </span>
                      <span className="text-slate-700">Downloadable action plan</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mr-3">
                        <span className="text-green-600 text-sm">✓</span>
                      </span>
                      <span className="text-slate-700">Advisor handoff preparation</span>
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
                        // In real app, this would trigger payment flow
                        alert('Redirecting to payment...');
                        setShowUpgradeModal(false);
                      }}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                    >
                      Upgrade Now
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

      {/* Financial Essentials - horizontal 2x2 grid */}
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

      {/* CTA Section (aligned with Financial Essentials) */}
      <div className="mt-6">
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
    </>
  );
}