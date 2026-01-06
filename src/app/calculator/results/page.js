'use client';

import { useEffect } from 'react';
import { useCalculator } from '../../../context/CalculatorContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import StatusBanner from '../../../components/StatusBanner';
import StatCard from '../../../components/StatCard';
import CTASection from '../../../components/CTASection';
import { formatCurrency, formatAge } from '../../../lib/formatters';

export default function ResultsPage() {
  const { results, formData } = useCalculator();
  const router = useRouter();

  useEffect(() => {
    // Redirect to calculator if no results
    if (!results && !formData.freedomAge) {
      router.push('/calculator');
    }
  }, [results, formData, router]);

  if (!results && !formData.freedomAge) {
    return (
      <div className="py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-slate-600">Loading your results...</p>
      </div>
    );
  }

  const data = results || formData;
  const isAchieved = data.freedomAge === 'Achieved';

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 mb-4">
            Your Financial Freedom Results
          </h1>
          <p className="text-lg text-slate-600">
            Here's your personalized roadmap to financial independence
          </p>
        </div>

        <StatusBanner 
          status={isAchieved ? 'Achieved' : 'Pending'}
          freedomAge={isAchieved ? 60 : data.depletionAge}
          expectedCorpus={data.expectedCorpus}
          requiredCorpus={data.requiredCorpus}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            title="Freedom Age"
            value={isAchieved ? 'Achieved' : data.depletionAge}
            type="age"
            description="Age when you achieve full financial freedom"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            color={isAchieved ? 'primary' : 'warning'}
          />
          
          <StatCard
            title="Expected Corpus"
            value={data.expectedCorpus}
            type="currency"
            description="Projected wealth at retirement"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          
          <StatCard
            title="Required Corpus"
            value={data.requiredCorpus}
            type="currency"
            description="Amount needed for sustainable retirement"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          
          <StatCard
            title="Monthly SIP Gap"
            value={data.sipGap}
            type="currency"
            description="Additional investment needed monthly"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            }
            color={data.sipGap > 0 ? 'danger' : 'primary'}
          />
        </div>

        <div className="card mb-12">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Key Insights</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                isAchieved ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
              }`}>
                {isAchieved ? '✓' : '!'}
              </div>
              <div>
                <p className="font-medium text-slate-900">
                  {isAchieved 
                    ? 'Congratulations! Your current plan leads to sustainable financial freedom.' 
                    : 'Your current plan needs adjustment to achieve sustainable financial freedom.'}
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  {isAchieved
                    ? 'Your retirement corpus is projected to last beyond your expected lifespan.'
                    : `Based on current projections, your corpus may deplete by age ${data.depletionAge}.`}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                ₹
              </div>
              <div>
                <p className="font-medium text-slate-900">
                  {data.sipGap > 0 
                    ? `Consider increasing your monthly SIP by ${formatCurrency(data.sipGap)}`
                    : 'Your current SIP rate is sufficient for your goals'}
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  {data.sipGap > 0
                    ? 'This adjustment will help bridge the gap between your expected and required corpus.'
                    : 'Continue with your current investment discipline to stay on track.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Link 
            href="/dashboard" 
            className="btn-cta flex-1 text-center"
          >
            View Detailed Dashboard
          </Link>
          
          <Link 
            href="/calculator" 
            className="btn-secondary flex-1 text-center"
          >
            Adjust My Plan
          </Link>
        </div>

        <CTASection 
          title="Want to optimize your financial plan?"
          description="Our certified financial planners can help you fine-tune your strategy, explore tax-efficient options, and ensure you're maximizing your wealth-building potential."
          ctaText="Get Personalized Advice"
          secondaryCta="Recalculate"
        />
      </div>
    </div>
  );
}