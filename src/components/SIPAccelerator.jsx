// src/components/SIPAccelerator.js
'use client';

import { useState } from 'react';
import { formatCurrency } from '../lib/formatters';

const computeSIPAccelerator = (formData, results) => {
  if (!formData || !results) return null;

  const {
    monthlySIP = 0,
    currentAge = 30,
    retirementAge = 60,
    expectedReturns = 12,
    inflationRate = 6
  } = formData;

  const {
    requiredCorpus = 0,
    expectedCorpus = 0,
    sipGap = 0
  } = results;

  // Calculate required monthly SIP to reach required corpus by retirement
  const yearsToRetirement = retirementAge - currentAge;
  
  if (yearsToRetirement <= 0 || requiredCorpus <= 0) {
    return {
      requiredMonthlySIP: monthlySIP,
      acceleratorAmount: 0,
      confidenceScore: 100,
      confidenceLabel: 'Strong',
      actionSummary: 'Your plan is already aligned with your retirement goals.',
      currentSIP: monthlySIP,
      yearsToRetirement
    };
  }

  // Calculate required monthly SIP using annuity formula
  const monthlyRate = Math.pow(1 + expectedReturns / 100, 1/12) - 1;
  const monthsToRetirement = yearsToRetirement * 12;
  
  const futureValueFactor = (Math.pow(1 + monthlyRate, monthsToRetirement) - 1) / monthlyRate;
  const requiredMonthlySIP = Math.max(0, requiredCorpus / futureValueFactor);

  // Calculate accelerator amount (positive only)
  const acceleratorAmount = Math.max(0, Math.round(requiredMonthlySIP - monthlySIP));

  // Calculate confidence score (0-100 heuristic)
  let confidenceScore = 0;
  
  // 1. Corpus Coverage (40% weight)
  const corpusRatio = expectedCorpus > 0 ? expectedCorpus / requiredCorpus : 0;
  const corpusScore = Math.min(100, Math.round(corpusRatio * 100));
  
  // 2. Time to Retirement Buffer (15% weight)
  const timeBufferScore = yearsToRetirement >= 30 ? 100 : 
                         yearsToRetirement >= 20 ? 80 :
                         yearsToRetirement >= 10 ? 60 : 30;
  
  // 3. Return Sensitivity Buffer (20% weight)
  const realReturns = expectedReturns - inflationRate;
  const returnScore = realReturns >= 8 ? 100 :
                      realReturns >= 6 ? 80 :
                      realReturns >= 4 ? 60 :
                      realReturns >= 2 ? 40 : 20;
  
  // 4. SIP Adequacy (15% weight)
  const sipAdequacyScore = acceleratorAmount <= 0 ? 100 :
                           (acceleratorAmount / monthlySIP) <= 0.1 ? 90 :
                           (acceleratorAmount / monthlySIP) <= 0.25 ? 70 :
                           (acceleratorAmount / monthlySIP) <= 0.5 ? 50 : 30;
  
  // 5. Expense Inflation Awareness (10% weight)
  const inflationAwarenessScore = inflationRate > 0 ? 100 : 50;
  
  // Calculate weighted score
  confidenceScore = Math.round(
    (corpusScore * 0.4) +
    (timeBufferScore * 0.15) +
    (returnScore * 0.2) +
    (sipAdequacyScore * 0.15) +
    (inflationAwarenessScore * 0.1)
  );

  // Clamp between 0-100
  confidenceScore = Math.max(0, Math.min(100, confidenceScore));

  // Determine confidence label
  let confidenceLabel = 'Low';
  if (confidenceScore >= 75) confidenceLabel = 'Strong';
  else if (confidenceScore >= 50) confidenceLabel = 'Moderate';

  // Generate action summary based on accelerator amount
  let actionSummary = '';
  if (acceleratorAmount <= 0) {
    actionSummary = 'Your current SIP is sufficient to reach your retirement goal.';
  } else {
    const monthsImpact = Math.round((acceleratorAmount / monthlySIP) * monthsToRetirement * 0.2);
    const yearsImpact = Math.floor(monthsImpact / 12);
    const remainingMonths = monthsImpact % 12;
    
    if (yearsImpact > 0 && remainingMonths > 0) {
      actionSummary = `Adding ${formatCurrency(acceleratorAmount)}/month may reduce your timeline by approximately ${yearsImpact} years and ${remainingMonths} months.`;
    } else if (yearsImpact > 0) {
      actionSummary = `Adding ${formatCurrency(acceleratorAmount)}/month may reduce your timeline by approximately ${yearsImpact} years.`;
    } else {
      actionSummary = `Adding ${formatCurrency(acceleratorAmount)}/month may reduce your timeline by approximately ${monthsImpact} months.`;
    }
  }

  return {
    requiredMonthlySIP: Math.round(requiredMonthlySIP),
    acceleratorAmount,
    confidenceScore,
    confidenceLabel,
    actionSummary,
    currentSIP: monthlySIP,
    yearsToRetirement,
    scoreComponents: {
      corpusScore,
      timeBufferScore,
      returnScore,
      sipAdequacyScore,
      inflationAwarenessScore
    }
  };
};

const ConfidenceGauge = ({ score, label }) => {
  const getColor = (score) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  const getBgColor = (score) => {
    if (score >= 75) return 'bg-green-100';
    if (score >= 50) return 'bg-amber-100';
    return 'bg-red-100';
  };

  return (
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
            stroke={score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'}
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
          {label} Confidence
        </div>
        <p className="text-sm text-slate-600 mt-2">
          Based on corpus coverage, time buffer, and return assumptions
        </p>
      </div>
    </div>
  );
};

const ScoreExplanation = ({ scoreComponents }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
      >
        {expanded ? 'Hide score details' : 'Show how this score is calculated'}
        <span className="ml-1">{expanded ? '↑' : '↓'}</span>
      </button>
      
      {expanded && (
        <div className="mt-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h5 className="font-medium text-slate-900 mb-3">Confidence Score Components</h5>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-slate-700">Corpus Coverage</span>
                <span className="text-sm font-medium text-slate-900">{scoreComponents.corpusScore}/100</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5">
                <div 
                  className="bg-blue-600 h-1.5 rounded-full" 
                  style={{ width: `${scoreComponents.corpusScore}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-500 mt-1">How your projected corpus compares to required amount</p>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-slate-700">Time to Retirement</span>
                <span className="text-sm font-medium text-slate-900">{scoreComponents.timeBufferScore}/100</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5">
                <div 
                  className="bg-blue-600 h-1.5 rounded-full" 
                  style={{ width: `${scoreComponents.timeBufferScore}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-500 mt-1">Available time to adjust your plan if needed</p>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-slate-700">Return Sensitivity</span>
                <span className="text-sm font-medium text-slate-900">{scoreComponents.returnScore}/100</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5">
                <div 
                  className="bg-blue-600 h-1.5 rounded-full" 
                  style={{ width: `${scoreComponents.returnScore}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-500 mt-1">Buffer between expected returns and inflation</p>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-slate-700">SIP Adequacy</span>
                <span className="text-sm font-medium text-slate-900">{scoreComponents.sipAdequacyScore}/100</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5">
                <div 
                  className="bg-blue-600 h-1.5 rounded-full" 
                  style={{ width: `${scoreComponents.sipAdequacyScore}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-500 mt-1">How close your current SIP is to required amount</p>
            </div>
            
            <div className="text-xs text-slate-500 pt-3 border-t border-slate-200">
              <p>This is a heuristic score for educational purposes. It is not a probability of success.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PremiumFeaturesCard = ({ onUpgrade }) => {
  const premiumFeatures = [
    {
      title: "What-if Scenario Comparisons",
      description: "Compare multiple SIP increase scenarios side-by-side",
      icon: "📊"
    },
    {
      title: "Year-by-Year Breakdown",
      description: "See detailed projections for every year until retirement",
      icon: "📅"
    },
    {
      title: "Downloadable Action Plan",
      description: "Get a personalized PDF plan with specific next steps",
      icon: "📥"
    },
    {
      title: "Advisor Handoff Preparation",
      description: "Pre-filled forms and analysis for financial advisor consultation",
      icon: "🤝"
    }
  ];

  return (
    <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-semibold text-blue-900 text-lg">Unlock Premium Features</h4>
          <p className="text-blue-700 text-sm mt-1">Get deeper insights and actionable plans</p>
        </div>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
          Premium
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {premiumFeatures.map((feature, index) => (
          <div key={index} className="p-4 bg-white/70 rounded-lg border border-blue-100">
            <div className="flex items-start space-x-3">
              <span className="text-xl flex-shrink-0">{feature.icon}</span>
              <div>
                <h5 className="font-medium text-slate-900">{feature.title}</h5>
                <p className="text-sm text-slate-600 mt-1">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-4 border-t border-blue-200">
        <button
          onClick={onUpgrade}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow"
        >
          Upgrade to Premium — ₹999/year
        </button>
        <p className="text-xs text-blue-700 text-center mt-3">
          Cancel anytime • 7-day money-back guarantee
        </p>
      </div>
    </div>
  );
};

export default function SIPAccelerator({ formData, results, onExploreScenarios, onUpgradeToPremium }) {
  const acceleratorData = computeSIPAccelerator(formData, results);
  
  if (!acceleratorData) {
    return null;
  }

  const { acceleratorAmount, confidenceScore, confidenceLabel, actionSummary, currentSIP, yearsToRetirement } = acceleratorData;

  return (
    <div className="card">
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">SIP Accelerator</h3>
            <p className="text-slate-600 mt-1">
              One clear monthly action to stay on track for retirement
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-800 rounded">
              Free
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Action Required */}
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-slate-600 mb-2">Additional Monthly Investment Required</h4>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-slate-900">
                {formatCurrency(acceleratorAmount)}
              </span>
              <span className="text-lg text-slate-600 ml-2">/ month</span>
            </div>
            <p className="text-sm text-slate-600 mt-2">
              {currentSIP > 0 ? (
                <>
                  Your current SIP: <span className="font-medium">{formatCurrency(currentSIP)}</span> • 
                  Years to retirement: <span className="font-medium">{yearsToRetirement}</span>
                </>
              ) : 'Update your SIP in the calculator to see detailed insights'}
            </p>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                  <span className="text-blue-600 text-sm">💡</span>
                </div>
                <p className="text-blue-800">
                  {actionSummary}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <button
              onClick={onExploreScenarios}
              className="btn-primary w-full"
            >
              Edit SIP / Explore basic scenarios
            </button>
            
            <p className="text-xs text-slate-500 mt-3 text-center">
              Free version shows limited scenarios. Upgrade for detailed comparisons.
            </p>
          </div>
        </div>

        {/* Right Column: Confidence Score */}
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-slate-600 mb-4">Your Plan Confidence Score</h4>
            <ConfidenceGauge score={confidenceScore} label={confidenceLabel} />
            
            <ScoreExplanation scoreComponents={acceleratorData.scoreComponents} />
          </div>

          <div className="pt-4 border-t border-slate-200">
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                  <span className="text-slate-700 text-xs">•</span>
                </div>
                <p className="text-sm text-slate-700">
                  <span className="font-medium">Free plan includes:</span> Basic SIP accelerator amount and confidence score
                </p>
              </div>
              
              <div className="flex items-start">
                <div className="w-5 h-5 rounded-full bg-blue-200 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                  <span className="text-blue-700 text-xs">☆</span>
                </div>
                <p className="text-sm text-slate-700">
                  <span className="font-medium">Premium adds:</span> Detailed scenarios, year-by-year breakdown, and downloadable plans
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Features Card */}
      <PremiumFeaturesCard onUpgrade={onUpgradeToPremium} />

      <div className="mt-6 pt-6 border-t border-slate-200">
        <p className="text-xs text-slate-500 text-center">
          <strong>Note:</strong> This analysis is illustrative and based on your inputs and assumptions. It is not investment advice.
        </p>
      </div>
    </div>
  );
}