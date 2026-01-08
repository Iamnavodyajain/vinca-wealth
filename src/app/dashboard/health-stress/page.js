'use client';

import { useState, useEffect } from 'react';
import { usePremium } from '@/lib/premium';
import HealthStressTest from '@/components/HealthStressTest';
import HealthScenarioCards from '@/components/HealthScenarioCards';
import HealthImpactCharts from '@/components/HealthImpactCharts';
import { Shield, AlertCircle, HeartPulse } from 'lucide-react';

export default function HealthStressPage() {
  const { isPremium, upgradeToPremium } = usePremium();
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [userInputs, setUserInputs] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user's retirement inputs from Financial Readiness calculator
  useEffect(() => {
    const loadUserInputs = () => {
      try {
        // Try to get from localStorage (where Financial Readiness stores data)
        const savedInputs = localStorage.getItem('financialReadinessInputs') || 
                           localStorage.getItem('retirementInputs') ||
                           localStorage.getItem('calculatorInputs');
        
        if (savedInputs) {
          const parsedInputs = JSON.parse(savedInputs);
          setUserInputs(formatInputs(parsedInputs));
        } else {
          // Use mock data with the exact same field names as Financial Readiness
          setUserInputs(getMockInputs());
        }
      } catch (error) {
        console.error('Error loading user inputs:', error);
        setUserInputs(getMockInputs());
      } finally {
        setLoading(false);
      }
    };

    loadUserInputs();
  }, []);

  // Format inputs to match Financial Readiness calculator exactly
  const formatInputs = (inputs) => {
    return {
      // Exact same field names as your Financial Readiness calculator
      currentAge: inputs.currentAge || 35,
      retirementAge: inputs.retirementAge || 60,
      lifespan: inputs.lifespan || 90,
      monthlyExpenses: inputs.monthlyExpenses || 50000,
      monthlySIP: inputs.monthlySIP || 20000,
      moneySaved: inputs.moneySaved || 1500000,
      expectedReturns: inputs.expectedReturns || 12,
      inflationRate: inputs.inflationRate || 6,
      emergencyFund: inputs.emergencyFund || 300000,
      // Additional fields that might exist
      investmentYears: inputs.investmentYears || (inputs.retirementAge - inputs.currentAge) || 25,
      withdrawalIncrease: inputs.withdrawalIncrease || 0,
      retirementReturns: inputs.retirementReturns || 8
    };
  };

  // Mock data matching Financial Readiness calculator exactly
  const getMockInputs = () => {
    return {
      currentAge: 35,
      retirementAge: 60,
      lifespan: 90,
      monthlyExpenses: 50000,
      monthlySIP: 20000,
      moneySaved: 1500000,
      expectedReturns: 12,
      inflationRate: 6,
      emergencyFund: 300000,
      investmentYears: 25,
      withdrawalIncrease: 0,
      retirementReturns: 8
    };
  };

  const handleScenarioSelect = (scenario) => {
    setSelectedScenario(scenario);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your retirement data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Main Container - Horizontal layout only */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Will your retirement plan support your health?
              </h1>
              <p className="mt-3 text-lg text-slate-600 max-w-3xl">
                We simulate common health scenarios to understand how medical expenses may affect long-term financial independence.
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
              <Shield size={18} />
              <span className="text-sm font-medium">Educational tool only</span>
            </div>
          </div>

          {/* Educational Disclaimer */}
          <div className="mt-6 p-4 bg-slate-100 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-slate-500 mt-0.5" />
              <div className="text-sm text-slate-600">
                <p className="font-medium mb-1">Important: This is an educational analysis tool, not financial or medical advice.</p>
                <p>We use historical healthcare cost patterns and conservative inflation assumptions to show potential impacts. 
                Actual medical costs vary significantly based on location, hospital choice, and individual circumstances. 
                This tool does not recommend insurance products or treatment options.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Inputs Summary */}
        <div className="mb-8 p-6 bg-white rounded-xl border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Your Current Retirement Plan
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-slate-500">Current Age</div>
              <div className="font-medium">{userInputs.currentAge} years</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Retirement Age</div>
              <div className="font-medium">{userInputs.retirementAge} years</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Monthly Expenses</div>
              <div className="font-medium">₹{userInputs.monthlyExpenses.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Monthly SIP</div>
              <div className="font-medium">₹{userInputs.monthlySIP.toLocaleString()}</div>
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-600">
            <p>These inputs are taken from your Financial Readiness calculator. 
            <button 
              onClick={() => window.open('/dashboard/financial-readiness', '_blank')}
              className="ml-2 text-green-600 hover:text-green-700 underline"
            >
              Update them here
            </button></p>
          </div>
        </div>

        {/* Scenario Selection - Horizontal Card Grid */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">
            Select a health scenario to analyze
          </h2>
          <HealthScenarioCards 
            onSelect={handleScenarioSelect}
            selectedScenario={selectedScenario}
            isPremium={isPremium}
          />
        </div>

        {/* Analysis Section - Single column, horizontal stacking */}
        {selectedScenario ? (
          <div className="space-y-8">
            {/* Freemium Analysis - Available to all */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                General Impact Analysis
              </h3>
              <HealthImpactCharts 
                scenario={selectedScenario}
                userInputs={userInputs}
                isPremium={isPremium}
              />
            </div>

            {/* Premium Gate or Premium Analysis */}
            {!isPremium ? (
              <div className="relative bg-white rounded-xl border border-slate-200 p-8">
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                  <div className="text-center p-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full mb-4">
                      <HeartPulse size={28} className="text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">
                      Unlock Personalized Health Stress Test
                    </h3>
                    <p className="text-slate-600 mb-6 max-w-md mx-auto">
                      Get detailed analysis of how health scenarios specifically impact your retirement plan, 
                      with personalized projections and affordability metrics.
                    </p>
                    <button
                      onClick={upgradeToPremium}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
                    >
                      Upgrade to Premium - ₹499/year
                    </button>
                    <p className="text-xs text-slate-500 mt-4">
                      Includes all premium features across the platform
                    </p>
                  </div>
                </div>
                
                {/* Blurred preview content */}
                <div className="opacity-40">
                  <h4 className="text-lg font-semibold text-slate-800 mb-4">
                    Premium Analysis Preview
                  </h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <div className="text-sm text-slate-600">Health-Adjusted Retirement Corpus</div>
                        <div className="text-2xl font-bold text-slate-800">₹2.8 Cr</div>
                        <div className="text-sm text-slate-500">vs ₹3.2 Cr baseline</div>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <div className="text-sm text-slate-600">Depletion Age</div>
                        <div className="text-2xl font-bold text-slate-800">82 years</div>
                        <div className="text-sm text-slate-500">vs 87 years baseline</div>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <div className="text-sm text-slate-600 mb-2">Hospitalization Affordability</div>
                      <div className="h-40 flex items-center justify-center text-slate-400">
                        [Premium chart preview]
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Premium User Analysis */
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-6 bg-green-500 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    Personalized Health Impact Analysis
                  </h3>
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                    PREMIUM
                  </span>
                </div>
                <HealthStressTest 
                  scenario={selectedScenario}
                  userInputs={userInputs}
                />
              </div>
            )}
          </div>
        ) : (
          /* Prompt to select scenario */
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <HeartPulse size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-700 mb-2">
              Select a health scenario to begin analysis
            </h3>
            <p className="text-slate-500">
              Choose from the scenario cards above to see how different health situations might impact retirement planning
            </p>
          </div>
        )}

        {/* Methodology & Assumptions */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">
            Methodology & Assumptions
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="text-sm font-medium text-slate-800 mb-2">Healthcare Inflation</div>
              <div className="text-sm text-slate-600">
                Assumed at 8-10% annually, based on historical Indian healthcare cost trends (NSSO, NHA data)
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="text-sm font-medium text-slate-800 mb-2">Cost Ranges</div>
              <div className="text-sm text-slate-600">
                Based on typical urban private hospital costs across major Indian cities (2023-24 estimates)
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="text-sm font-medium text-slate-800 mb-2">Retirement Simulation</div>
              <div className="text-sm text-slate-600">
                Uses same inputs as Financial Readiness calculator. Health costs added as additional annual expenses.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}