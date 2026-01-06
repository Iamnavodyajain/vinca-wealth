'use client';

import StepIndicator from '../../components/StepIndicator';
import FormSection from '../../components/FormSection';

export default function CalculatorPage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 mb-4">
            Financial Freedom Calculator
          </h1>
          <p className="text-lg text-slate-600">
            Answer a few questions to discover when you can achieve financial freedom
          </p>
        </div>

        <StepIndicator />
        <FormSection />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="font-semibold text-slate-900 mb-2">How it works</h3>
            <p className="text-sm text-slate-600">
              Our calculator uses advanced Monte Carlo simulations to project your wealth journey based on your inputs and market assumptions.
            </p>
          </div>
          
          <div className="card">
            <h3 className="font-semibold text-slate-900 mb-2">Your data is safe</h3>
            <p className="text-sm text-slate-600">
              All calculations happen locally in your browser. We never store your personal information on any server.
            </p>
          </div>
          
          <div className="card">
            <h3 className="font-semibold text-slate-900 mb-2">Need help?</h3>
            <p className="text-sm text-slate-600">
              If you're unsure about any input, use our default values or consult with our financial advisors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}