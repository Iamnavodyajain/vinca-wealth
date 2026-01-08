'use client';

import { Check, Lock } from 'lucide-react';

const SCENARIOS = [
  {
    id: 'everyday',
    title: 'Everyday Health Conditions',
    description: 'Common, manageable conditions with ongoing care',
    examples: ['Diabetes (managed)', 'Blood pressure', 'Joint pain', 'Minor allergies'],
    costRange: '₹15,000 - ₹50,000/year',
    access: 'free',
    color: 'blue',
    impactLevel: 'low'
  },
  {
    id: 'planned',
    title: 'Planned Medical Events',
    description: 'Situations that may require hospitalization or surgery',
    examples: ['Orthopedic surgery', 'Gall bladder removal', 'Minor cardiac procedures', 'Cataract surgery'],
    costRange: '₹1.5L - ₹5L per event',
    access: 'free',
    color: 'amber',
    impactLevel: 'medium'
  },
  {
    id: 'high-impact',
    title: 'High-Impact Health Events',
    description: 'Rare but financially significant medical events',
    examples: ['Cancer treatment', 'Major cardiac surgery', 'Long ICU stay', 'Multiple surgeries'],
    costRange: '₹10L - ₹30L+ total',
    access: 'premium',
    color: 'rose',
    impactLevel: 'high'
  }
];

const colorClasses = {
  blue: 'border-blue-200 hover:border-blue-300 bg-blue-50',
  amber: 'border-amber-200 hover:border-amber-300 bg-amber-50',
  rose: 'border-rose-200 hover:border-rose-300 bg-rose-50'
};

const selectedColorClasses = {
  blue: 'border-blue-500 bg-blue-100 ring-2 ring-blue-200',
  amber: 'border-amber-500 bg-amber-100 ring-2 ring-amber-200',
  rose: 'border-rose-500 bg-rose-100 ring-2 ring-rose-200'
};

export default function HealthScenarioCards({ onSelect, selectedScenario, isPremium }) {
  const handleClick = (scenario) => {
    if (scenario.access === 'premium' && !isPremium) {
      return; // Don't select premium-locked scenarios
    }
    onSelect(scenario);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {SCENARIOS.map((scenario) => {
        const isSelected = selectedScenario?.id === scenario.id;
        const isLocked = scenario.access === 'premium' && !isPremium;
        
        return (
          <button
            key={scenario.id}
            onClick={() => handleClick(scenario)}
            disabled={isLocked}
            className={`
              relative text-left p-5 rounded-xl border-2 transition-all duration-200
              ${isSelected ? selectedColorClasses[scenario.color] : colorClasses[scenario.color]}
              ${isLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}
              flex flex-col h-full
            `}
          >
            {/* Premium lock badge */}
            {scenario.access === 'premium' && !isPremium && (
              <div className="absolute top-3 right-3">
                <Lock size={16} className="text-slate-400" />
              </div>
            )}

            {/* Selection indicator */}
            {isSelected && (
              <div className="absolute top-3 right-3 bg-white p-1 rounded-full">
                <Check size={16} className="text-green-600" />
              </div>
            )}

            {/* Impact level indicator */}
            <div className="flex items-center gap-2 mb-4">
              <div className={`
                w-3 h-3 rounded-full
                ${scenario.impactLevel === 'low' ? 'bg-green-500' : ''}
                ${scenario.impactLevel === 'medium' ? 'bg-amber-500' : ''}
                ${scenario.impactLevel === 'high' ? 'bg-rose-500' : ''}
              `}></div>
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                {scenario.impactLevel} Impact
              </span>
            </div>

            {/* Title and description */}
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              {scenario.title}
            </h3>
            <p className="text-sm text-slate-600 mb-4 flex-1">
              {scenario.description}
            </p>

            {/* Examples */}
            <div className="mb-4">
              <div className="text-xs font-medium text-slate-500 mb-2">Examples include:</div>
              <div className="flex flex-wrap gap-2">
                {scenario.examples.slice(0, 3).map((example, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-white/70 text-xs text-slate-700 rounded-md"
                  >
                    {example}
                  </span>
                ))}
              </div>
            </div>

            {/* Cost range */}
            <div className="mt-auto pt-4 border-t border-white/50">
              <div className="text-xs text-slate-500">Typical cost range:</div>
              <div className="text-sm font-medium text-slate-800">
                {scenario.costRange}
              </div>
            </div>

            {/* Premium lock overlay */}
            {isLocked && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] rounded-xl flex items-center justify-center">
                <div className="text-center p-4">
                  <Lock size={24} className="mx-auto text-slate-400 mb-2" />
                  <div className="text-sm font-medium text-slate-700">Premium Feature</div>
                  <div className="text-xs text-slate-500">Upgrade to analyze</div>
                </div>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}