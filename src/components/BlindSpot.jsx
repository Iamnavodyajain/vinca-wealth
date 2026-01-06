"use client";

import { useState, useEffect } from 'react';
import { useCalculator } from '../context/CalculatorContext';
import computeBlindSpots from '../lib/blindspots';
import { useScrollToInput } from '../hooks/useScrollToInput';

export default function BlindSpot() {
  const { formData, results, calculateResults } = useCalculator();
  const { scrollToInput } = useScrollToInput();
  const [blindSpots, setBlindSpots] = useState(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState(null);
  const [resolvedCount, setResolvedCount] = useState(0);

  // Clear blind spots when results change
  useEffect(() => {
    setBlindSpots(null);
    setError(null);
  }, [results]);

  // Update resolved count when blind spots change
  useEffect(() => {
    if (blindSpots) {
      const resolved = blindSpots.filter(spot => spot.isResolved).length;
      setResolvedCount(resolved);
    }
  }, [blindSpots]);

  const runAnalysis = async () => {
    if (!formData) {
      setError('Please complete the retirement calculator first.');
      return;
    }

    setRunning(true);
    setError(null);

    try {
      // If `results` already exists, reuse it. Otherwise call calculateResults()
      const computedResults = results || calculateResults();
      
      if (!computedResults) {
        throw new Error('Unable to calculate retirement results.');
      }

      // computeBlindSpots expects an object { formData, results }
      const spots = computeBlindSpots({ 
        formData, 
        results: computedResults 
      });
      
      if (!spots) {
        throw new Error('Unable to compute blind spots with current data.');
      }
      
      setBlindSpots(spots);
    } catch (err) {
      console.error('Blind spot analysis failed:', err);
      setError('Analysis failed. Please check your calculator inputs and try again.');
    } finally {
      setRunning(false);
    }
  };

  const handleEditInputs = (spot) => {
    // Scroll to calculator and highlight relevant inputs
    scrollToInput(spot.editTargets);
  };

  // Determine if we have valid data for analysis
  const hasValidData = formData && 
    formData.currentAge != null && 
    formData.retirementAge != null && 
    formData.monthlyExpenses != null;

  // Helper function to format currency
  const formatCurrency = (value) => {
    if (value == null || value === '' || value === undefined) return '—';
    if (typeof value === 'string') return value;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Helper function to format age values
  const formatAge = (value) => {
    if (value == null || value === undefined) return '—';
    if (typeof value === 'string') return value;
    return `${value} years`;
  };

  // Helper function to get severity badge styles
  const getSeverityStyles = (severity, isResolved) => {
    if (isResolved) {
      return {
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        icon: '✓',
        label: 'Resolved'
      };
    }

    switch (severity) {
      case 'at-risk':
        return {
          badgeClass: 'bg-red-100 text-red-800 border-red-200',
          icon: '⚠',
          label: 'At Risk'
        };
      case 'needs-attention':
        return {
          badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
          icon: 'ℹ',
          label: 'Needs Attention'
        };
      case 'on-track':
        return {
          badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          icon: '✓',
          label: 'On Track'
        };
      default:
        return {
          badgeClass: 'bg-slate-100 text-slate-800 border-slate-200',
          icon: 'ℹ',
          label: 'Review'
        };
    }
  };

  // Blind Spot Card Component
  const BlindSpotCard = ({ spot }) => {
    const severityStyles = getSeverityStyles(spot.severity, spot.isResolved);
    
    // Format value based on unit
    const displayValue = spot.unit === 'currency' 
      ? formatCurrency(spot.value)
      : spot.unit === 'age'
      ? formatAge(spot.value)
      : spot.value || '—';

    return (
      <div className={`bg-white rounded-xl border ${spot.isResolved ? 'border-emerald-200' : 'border-slate-200'} p-6 shadow-sm hover:shadow-md transition-all duration-200`}>
        {/* Header with title and severity badge */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-slate-900">{spot.title}</h3>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${severityStyles.badgeClass}`}>
            <span className="text-sm">{severityStyles.icon}</span>
            {severityStyles.label}
          </span>
        </div>

        {/* Primary metric */}
        <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
          <p className="text-sm text-slate-600 mb-1">Quantified impact</p>
          <p className="text-2xl font-bold text-slate-900">{displayValue}</p>
          <p className="text-sm text-slate-600 mt-2">{spot.message}</p>
        </div>

        {/* Why this matters */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-slate-900 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Why this matters
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed">{spot.impact}</p>
        </div>

        {/* How this can be resolved */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-slate-900 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            How this can be addressed
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed mb-3">{spot.resolution}</p>
          {!spot.isResolved && (
            <div className="mt-3">
              <p className="text-xs text-slate-500 mb-2">Consider adjusting:</p>
              <div className="flex flex-wrap gap-2">
                {spot.editTargets.map((target) => (
                  <span key={target} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-md">
                    {target}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="pt-4 border-t border-slate-100">
          {!spot.isResolved ? (
            <button
              onClick={() => handleEditInputs(spot)}
              className="w-full px-4 py-2.5 bg-white border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors text-sm"
            >
              Review & Adjust Inputs
            </button>
          ) : (
            <div className="text-center py-2">
              <p className="text-sm text-emerald-600 font-medium">
                ✓ This area appears on track
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Analysis Summary Component
  const AnalysisSummary = ({ spots }) => {
    const total = spots.length;
    const resolved = spots.filter(s => s.isResolved).length;
    const atRisk = spots.filter(s => s.severity === 'at-risk').length;
    
    const getSummaryColor = () => {
      if (resolved === total) return 'text-emerald-700 bg-emerald-100 border-emerald-200';
      if (atRisk > 0) return 'text-amber-700 bg-amber-100 border-amber-200';
      return 'text-blue-700 bg-blue-100 border-blue-200';
    };

    const getSummaryMessage = () => {
      if (resolved === total) return 'All areas appear on track under current assumptions.';
      if (atRisk > 0) return `${atRisk} area${atRisk > 1 ? 's' : ''} need${atRisk === 1 ? 's' : ''} immediate attention.`;
      return 'Review these considerations to strengthen your retirement plan.';
    };

    return (
      <div className={`rounded-xl border p-5 mb-8 ${getSummaryColor()}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">Retirement Readiness Summary</h3>
            <p className="text-sm opacity-90">{getSummaryMessage()}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{resolved}/{total}</div>
              <div className="text-xs opacity-80">On Track</div>
            </div>
            {atRisk > 0 && (
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{atRisk}</div>
                <div className="text-xs opacity-80">At Risk</div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-slate-900">Retirement Blind Spot Analysis</h2>
            <p className="text-slate-600 mt-1">
              Identify hidden risks and opportunities in your retirement plan. Small adjustments today can create significant impact over decades.
            </p>
          </div>

          <div className="flex-shrink-0">
            <button
              onClick={runAnalysis}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto flex items-center justify-center gap-2"
              type="button"
              disabled={running || !hasValidData}
            >
              {running ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Run Analysis
                </>
              )}
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-700">
                This analysis helps you identify potential gaps in your retirement plan. It does not provide investment advice but highlights areas where small adjustments can create significant long-term impact.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="mb-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!blindSpots && !hasValidData && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Start Your Retirement Analysis</h3>
            <p className="text-slate-600 mb-6">
              Complete the retirement calculator with your current age, retirement age, and monthly expenses to uncover potential blind spots in your plan.
            </p>
          </div>
        </div>
      )}

      {/* Ready to Analyze State */}
      {!blindSpots && hasValidData && !results && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Generate Retirement Results</h3>
            <p className="text-slate-600 mb-6">
              Complete the retirement calculator to generate results, then run Blind Spot Analysis to identify hidden risks and opportunities.
            </p>
          </div>
        </div>
      )}

      {/* Results Available State */}
      {!blindSpots && results && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Results Ready for Analysis</h3>
            <p className="text-slate-600 mb-6">
              Retirement calculations are complete. Click "Run Analysis" to identify potential blind spots and areas for improvement.
            </p>
            <button
              onClick={runAnalysis}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors"
            >
              Run Analysis
            </button>
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {blindSpots && (
        <div>
          <AnalysisSummary spots={blindSpots} />

          {/* Success Message if all resolved */}
          {resolvedCount === blindSpots.length && (
            <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-emerald-900">All areas appear on track</h4>
                  <p className="text-sm text-emember-700 mt-1">
                    Your retirement plan appears sustainable under current assumptions. Regular reviews help maintain this alignment as life circumstances change.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {blindSpots.map((spot) => (
              <BlindSpotCard key={spot.id} spot={spot} />
            ))}
          </div>

          {/* Footer Note */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="text-sm text-slate-500">
              <p className="mb-2">
                <strong>Important:</strong> This analysis is based on your current inputs and assumptions. It highlights potential retirement readiness considerations without providing investment advice. Small gaps today can become significant issues over decades.
              </p>
              <p>
                Review your assumptions regularly and consider consulting with a financial advisor for personalized guidance.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}