'use client';

import { useCalculator } from '../context/CalculatorContext';

const steps = [
  { number: 1, title: 'Current Situation' },
  { number: 2, title: 'Investment Plan' },
  { number: 3, title: 'Retirement Goals' }
];

export default function StepIndicator() {
  const { currentStep } = useCalculator();

  return (
    <div className="flex items-center justify-between mb-12">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
            currentStep >= step.number 
              ? 'bg-green-600 border-green-600 text-white' 
              : 'border-slate-300 text-slate-400'
          } font-semibold`}>
            {step.number}
          </div>
          
          <div className="ml-3 hidden sm:block">
            <div className="text-xs text-slate-500">Step {step.number}</div>
            <div className={`text-sm font-medium ${
              currentStep >= step.number ? 'text-slate-900' : 'text-slate-400'
            }`}>
              {step.title}
            </div>
          </div>
          
          {index < steps.length - 1 && (
            <div className={`h-0.5 w-16 sm:w-24 mx-4 ${
              currentStep > step.number ? 'bg-green-600' : 'bg-slate-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
}