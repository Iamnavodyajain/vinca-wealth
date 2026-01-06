'use client';

import { useState } from 'react';
import { formatCurrency } from '../lib/formatters';
import {
  calculateFinancialReality,
  calculateSurvivalMode,
  calculateRealisticOptimization,
  calculateAggressiveFantasy,
  calculateRealityConfidence
} from '../lib/realisticRetirement';

const RealityConfidenceGauge = ({ score, label, components }) => {
  const getColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  const getBgColor = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 50) return 'bg-amber-100';
    return 'bg-red-100';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <svg className="w-20 h-20" viewBox="0 0 36 36">
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="3"
            />
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke={score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'}
              strokeWidth="3"
              strokeDasharray={`${score}, 100`}
              strokeLinecap="round"
            />
            <text x="18" y="22" textAnchor="middle" className="text-lg font-semibold fill-slate-900">
              {score}
            </text>
          </svg>
        </div>
        <div>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getBgColor(score)} ${getColor(score)}`}>
            {label}
          </div>
          <p className="text-sm text-slate-600 mt-2">
            Reality check based on your income, expenses, and savings
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Income-Expense Health</span>
          <span className="font-medium text-slate-900">{components.incomeExpenseHealth}/100</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-1.5">
          <div 
            className="bg-blue-600 h-1.5 rounded-full" 
            style={{ width: `${components.incomeExpenseHealth}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Lifespan Coverage</span>
          <span className="font-medium text-slate-900">{components.lifespanCoverage}/100</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-1.5">
          <div 
            className="bg-blue-600 h-1.5 rounded-full" 
            style={{ width: `${components.lifespanCoverage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const FinancialRealityCard = ({ financialReality, onUpdateIncome }) => {
  const [showIncomeInput, setShowIncomeInput] = useState(false);
  const [incomeInput, setIncomeInput] = useState(financialReality.monthlyIncome || '');

  const handleSaveIncome = () => {
    const income = parseFloat(incomeInput);
    if (!isNaN(income) && income > 0) {
      onUpdateIncome(income);
      setShowIncomeInput(false);
    }
  };

  return (
    <div className="card mb-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Your Financial Reality</h3>
        <button
          onClick={() => setShowIncomeInput(!showIncomeInput)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {showIncomeInput ? 'Cancel' : 'Edit income'}
        </button>
      </div>
      
      {/* Income Input Field */}
      {showIncomeInput && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-slate-900 mb-3">Update Your Monthly Income</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Net Monthly Income (Post-tax)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">₹</span>
                <input
                  type="number"
                  value={incomeInput}
                  onChange={(e) => setIncomeInput(e.target.value)}
                  className="pl-8 w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your monthly take-home pay"
                  min="0"
                  step="1000"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Your net income after all deductions (taxes, PF, etc.)
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleSaveIncome}
                className="btn-primary flex-1"
              >
                Save Income
              </button>
              <button
                onClick={() => {
                  setShowIncomeInput(false);
                  setIncomeInput(financialReality.monthlyIncome || '');
                }}
                className="btn-outline flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Income → Expenses → Surplus Flow */}
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <span className="text-green-600 text-sm font-medium">₹</span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Monthly Income</p>
                <p className="text-sm text-slate-600">
                  {financialReality.monthlyIncome > 0 ? 'Net take-home pay' : 'Click "Edit income" to add'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-slate-900">
                {financialReality.monthlyIncome > 0 ? formatCurrency(financialReality.monthlyIncome) : '—'}
              </p>
              {financialReality.monthlyIncome === 0 && (
                <button
                  onClick={() => setShowIncomeInput(true)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Add income
                </button>
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <span className="text-slate-400">↓</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                <span className="text-red-600 text-sm font-medium">→</span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Monthly Expenses</p>
                <p className="text-sm text-slate-600">From your retirement calculator inputs</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-slate-900">{formatCurrency(financialReality.monthlyExpenses)}</p>
              <p className="text-sm text-slate-600">
                {financialReality.monthlyIncome > 0 
                  ? `${Math.round((financialReality.monthlyExpenses / financialReality.monthlyIncome) * 100)}% of income`
                  : ''}
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <span className="text-slate-400">↓</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <span className="text-blue-600 text-sm font-medium">+</span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Current Monthly SIP</p>
                <p className="text-sm text-slate-600">Retirement savings</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-slate-900">{formatCurrency(financialReality.currentSIP)}</p>
              <p className="text-sm text-slate-600">
                {financialReality.monthlyIncome > 0 
                  ? `${Math.round(financialReality.currentSIPIncomeRatio * 100)}% of income`
                  : ''}
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <span className="text-slate-400">=</span>
          </div>

          <div className={`p-4 rounded-lg border ${
            financialReality.monthlySurplus >= 10000 
              ? 'bg-green-50 border-green-200' 
              : financialReality.monthlySurplus >= 0
                ? 'bg-amber-50 border-amber-200'
                : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-slate-900">Monthly Surplus</p>
                <p className="text-sm text-slate-600">
                  {financialReality.monthlyIncome > 0 ? (
                    financialReality.monthlySurplus >= 0 
                      ? 'Available for optimization'
                      : 'Deficit - Plan needs adjustment'
                  ) : 'Add income to see surplus'}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-xl font-bold ${
                  financialReality.monthlyIncome > 0 ? (
                    financialReality.monthlySurplus >= 10000 
                      ? 'text-green-700' 
                      : financialReality.monthlySurplus >= 0
                        ? 'text-amber-700'
                        : 'text-red-700'
                  ) : 'text-slate-700'
                }`}>
                  {financialReality.monthlyIncome > 0 
                    ? formatCurrency(financialReality.monthlySurplus)
                    : '—'
                  }
                </p>
                {financialReality.monthlyIncome === 0 && (
                  <button
                    onClick={() => setShowIncomeInput(true)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Add income to calculate
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Warnings */}
        {financialReality.warnings.length > 0 && (
          <div className="mt-4">
            {financialReality.warnings.map((warning, index) => (
              <div key={index} className={`p-3 rounded-lg mb-2 ${
                warning.type === 'critical' 
                  ? 'bg-red-50 border border-red-200' 
                  : warning.type === 'warning'
                  ? 'bg-amber-50 border border-amber-200'
                  : 'bg-blue-50 border border-blue-200'
              }`}>
                <div className="flex items-start">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-0.5 ${
                    warning.type === 'critical' ? 'bg-red-100 text-red-600' : 
                    warning.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {warning.type === 'critical' ? '!' : 'i'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{warning.message}</p>
                    <p className="text-sm text-slate-600 mt-1">{warning.fix}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const SurvivalModeCard = ({ survivalMode }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'safe': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-amber-100 text-amber-800';
      case 'danger': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="card mb-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">1. Survival Check</h3>
      <div className="space-y-4">
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-start">
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
              <span className="text-slate-700">①</span>
            </div>
            <div>
              <h4 className="font-medium text-slate-900 mb-1">Will I run out of money?</h4>
              <p className="text-slate-700">{survivalMode.survivalMessage}</p>
              
              <div className="mt-3 flex items-center">
                <span className="text-sm text-slate-600 mr-3">Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(survivalMode.survivalStatus)}`}>
                  {survivalMode.survivalStatus === 'safe' ? 'Safe' : 
                   survivalMode.survivalStatus === 'warning' ? 'At Risk' : 
                   survivalMode.survivalStatus === 'danger' ? 'High Risk' : 'Unknown'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-sm text-slate-600">
          <p><strong>Note:</strong> This checks basic sustainability, not early retirement. Survival is cheap, early retirement is expensive.</p>
        </div>
      </div>
    </div>
  );
};

const RealisticOptimizationCard = ({ realisticMode, financialReality }) => {
  if (financialReality.monthlyIncome === 0) {
    return (
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">2. Realistic Optimization</h3>
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
              <span className="text-blue-600">ℹ</span>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Add income to see realistic optimization</h4>
              <p className="text-blue-800">
                We need to know your monthly income to show what's realistically possible within your budget.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!realisticMode.isRealistic) {
    return (
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">2. Realistic Optimization</h3>
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
          <div className="flex items-start">
            <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
              <span className="text-amber-600">⚠</span>
            </div>
            <div>
              <h4 className="font-medium text-amber-900 mb-1">Fix cash flow first</h4>
              <p className="text-amber-800">{realisticMode.message}</p>
              <p className="text-sm text-amber-700 mt-1">{realisticMode.requires}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card mb-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">2. Realistic Optimization</h3>
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
              <span className="text-blue-600">②</span>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 mb-1">What is the best I can realistically do?</h4>
              <p className="text-blue-800 mb-3">Based on your income and expenses</p>
              
              {realisticMode.yearsEarlier > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded border">
                    <span className="text-slate-700">Monthly action needed</span>
                    <span className="text-lg font-bold text-blue-700">+{formatCurrency(realisticMode.usedSurplus)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-white rounded border">
                    <span className="text-slate-700">Earliest realistic retirement</span>
                    <span className="text-lg font-bold text-blue-700">Age {realisticMode.earliestRetirementAge}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-white rounded border">
                    <span className="text-slate-700">Years earlier</span>
                    <span className="text-lg font-bold text-green-700">-{realisticMode.yearsEarlier} years</span>
                  </div>
                  
                  <p className="text-sm text-slate-700 mt-2">
                    <strong>Note:</strong> {realisticMode.note}
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-white rounded border">
                  <p className="text-slate-800">
                    Your current plan of {formatCurrency(financialReality.currentSIP)}/month 
                    is already optimal within realistic constraints.
                  </p>
                  <p className="text-sm text-slate-600 mt-1">
                    You could increase to {formatCurrency(financialReality.maxPossibleSIP)}/month for faster results, 
                    but that would eliminate your surplus completely.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-sm text-slate-600">
          <p><strong>How this works:</strong> We use only your available surplus (₹{formatCurrency(financialReality.monthlySurplus)}) 
          to find improvements that don't break your cash flow.</p>
        </div>
      </div>
    </div>
  );
};

const AggressiveFantasyCard = ({ aggressiveMode, onExploreFantasy, financialReality }) => {
  if (financialReality.monthlyIncome === 0) {
    return (
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">3. Aggressive Fantasy</h3>
        <div className="p-4 bg-slate-100 rounded-lg border border-slate-300 opacity-75">
          <div className="flex items-start">
            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
              <span className="text-slate-600">③</span>
            </div>
            <div>
              <h4 className="font-medium text-slate-700 mb-1">Add income to see aggressive scenarios</h4>
              <p className="text-slate-600">
                We need your current income to show what it would mathematically take to retire early.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card mb-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">3. Aggressive Fantasy</h3>
      <div className="space-y-4">
        <div className="p-4 bg-slate-100 rounded-lg border border-slate-300 opacity-75">
          <div className="flex items-start">
            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
              <span className="text-slate-600">③</span>
            </div>
            <div>
              <h4 className="font-medium text-slate-700 mb-1">What would it take to retire very early?</h4>
              <p className="text-slate-600 mb-3">These scenarios are mathematically possible but financially unrealistic today.</p>
              
              <div className="space-y-3">
                {aggressiveMode.fantasies.slice(0, 2).map((fantasy, index) => (
                  <div key={index} className={`p-3 rounded border ${
                    fantasy.isRealistic ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-slate-900">Retire at {fantasy.targetAge}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        fantasy.isRealistic ? 'bg-green-100 text-green-800' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {fantasy.isRealistic ? 'Borderline possible' : 'Not realistic today'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700">{fantasy.message}</p>
                    {!fantasy.isRealistic && (
                      <p className="text-xs text-slate-500 mt-1">
                        Requires {fantasy.incomeMultiplier.toFixed(1)}× your current income
                      </p>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <button
                  onClick={onExploreFantasy}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  See more aggressive scenarios
                  <span className="ml-1">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-sm text-slate-600">
          <p><strong>Important:</strong> Early retirement requires exponential increases in savings. 
          These scenarios show what's mathematically possible, not what's financially prudent.</p>
        </div>
      </div>
    </div>
  );
};

const PremiumFeaturesCard = ({ onUpgrade }) => {
  return (
    <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-semibold text-blue-900 text-lg">Unlock Premium Reality Analysis</h4>
          <p className="text-blue-700 text-sm mt-1">Get deeper insights and personalized action plans</p>
        </div>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
          Premium
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-white/70 rounded-lg border border-blue-100">
          <div className="flex items-start space-x-3">
            <span className="text-xl flex-shrink-0">📊</span>
            <div>
              <h5 className="font-medium text-slate-900">Multiple Optimization Paths</h5>
              <p className="text-sm text-slate-600 mt-1">Compare different income-expense scenarios</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-white/70 rounded-lg border border-blue-100">
          <div className="flex items-start space-x-3">
            <span className="text-xl flex-shrink-0">📈</span>
            <div>
              <h5 className="font-medium text-slate-900">Income Growth Scenarios</h5>
              <p className="text-sm text-slate-600 mt-1">What happens if your income grows by 10%, 20%, etc.</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-white/70 rounded-lg border border-blue-100">
          <div className="flex items-start space-x-3">
            <span className="text-xl flex-shrink-0">📥</span>
            <div>
              <h5 className="font-medium text-slate-900">Reality Action Plan</h5>
              <p className="text-sm text-slate-600 mt-1">Downloadable plan with specific steps</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-white/70 rounded-lg border border-blue-100">
          <div className="flex items-start space-x-3">
            <span className="text-xl flex-shrink-0">🤝</span>
            <div>
              <h5 className="font-medium text-slate-900">Advisor-Ready Reality Report</h5>
              <p className="text-sm text-slate-600 mt-1">Pre-filled analysis for financial advisor</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="pt-4 border-t border-blue-200">
        <button
          onClick={onUpgrade}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow"
        >
          Upgrade to Premium Reality Analysis — ₹999/year
        </button>
        <p className="text-xs text-blue-700 text-center mt-3">
          Cancel anytime • 7-day money-back guarantee
        </p>
      </div>
    </div>
  );
};

export default function RealisticRetirementOptimizer({ formData, results, onExploreScenarios, onUpgradeToPremium }) {
  const [userIncome, setUserIncome] = useState(formData?.monthlyIncome || 0);

  // Update the formData with user's income for calculations
  const enhancedFormData = {
    ...formData,
    monthlyIncome: userIncome,
    monthlyExpenses: formData?.monthlyExpenses || 0,
    monthlySIP: formData?.monthlySIP || 0,
    currentAge: formData?.currentAge || 30,
    retirementAge: formData?.retirementAge || 60,
    lifespan: formData?.lifespan || 85,
    inflationRate: formData?.inflationRate || 6,
    expectedReturns: formData?.expectedReturns || 12,
    moneySaved: formData?.moneySaved || 0
  };

  // Calculate all modes
  const financialReality = calculateFinancialReality(enhancedFormData);
  const survivalMode = calculateSurvivalMode(enhancedFormData, results);
  const realisticMode = calculateRealisticOptimization(enhancedFormData, results, financialReality);
  const aggressiveMode = calculateAggressiveFantasy(enhancedFormData, results);
  const confidence = calculateRealityConfidence(financialReality, survivalMode, realisticMode);

  const handleUpdateIncome = (newIncome) => {
    setUserIncome(newIncome);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-slate-900">Realistic Retirement Optimizer</h3>
          <p className="text-slate-600 mt-2">
            Given my income and expenses, what is the smartest, realistic way to improve my retirement outcome without lying to me?
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Financial Reality */}
          <div className="space-y-6">
            <FinancialRealityCard 
              financialReality={financialReality} 
              onUpdateIncome={handleUpdateIncome}
            />
            <RealisticOptimizationCard 
              realisticMode={realisticMode} 
              financialReality={financialReality} 
            />
            <AggressiveFantasyCard 
              aggressiveMode={aggressiveMode} 
              onExploreFantasy={onExploreScenarios}
              financialReality={financialReality}
            />
          </div>

          {/* Right Column: Confidence & Analysis */}
          <div className="space-y-6">
            <div className="card">
              <h4 className="font-semibold text-slate-900 mb-4">Reality Confidence Score</h4>
              <RealityConfidenceGauge 
                score={confidence.score} 
                label={confidence.label}
                components={confidence.components}
              />
            </div>

            <SurvivalModeCard survivalMode={survivalMode} />

            <div className="card">
              <h4 className="font-semibold text-slate-900 mb-4">How This Works</h4>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                    <span className="text-slate-700 text-xs">1</span>
                  </div>
                  <p className="text-sm text-slate-700">
                    <span className="font-medium">Survival is cheap:</span> We first check if you'll run out of money.
                  </p>
                </div>
                
                <div className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                    <span className="text-slate-700 text-xs">2</span>
                  </div>
                  <p className="text-sm text-slate-700">
                    <span className="font-medium">Optimization is realistic:</span> We only use your actual surplus money.
                  </p>
                </div>
                
                <div className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                    <span className="text-slate-700 text-xs">3</span>
                  </div>
                  <p className="text-sm text-slate-700">
                    <span className="font-medium">Early retirement is expensive:</span> We show what it mathematically takes, even if unrealistic.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Features */}
        <PremiumFeaturesCard onUpgrade={onUpgradeToPremium} />

        {/* Disclaimer */}
        <div className="mt-6 pt-6 border-t border-slate-200">
          <p className="text-xs text-slate-500 text-center">
            <strong>Note:</strong> This is an income-aware, mathematically realistic analysis based on your inputs. 
            Survival and optimization are treated separately. Early retirement requires exponential increases in savings. 
            This is not investment advice.
          </p>
        </div>
      </div>
    </div>
  );
}