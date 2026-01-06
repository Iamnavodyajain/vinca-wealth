'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CTASection({ title, description, ctaText, ctaLink, secondaryCta }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      localStorage.setItem('vincaGuidanceRequest', JSON.stringify({
        email,
        timestamp: new Date().toISOString()
      }));
    }
  };

  return (
    <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
      <div className="text-center max-w-2xl mx-auto">
        <h3 className="text-2xl font-semibold text-slate-900 mb-4">
          {title || "Take the next step with professional guidance"}
        </h3>
        
        <p className="text-slate-600 mb-8">
          {description || "Our certified financial planners can help you optimize your strategy and ensure you're on track to achieve financial freedom."}
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full input-field"
                required
              />
              <p className="text-xs text-slate-500 mt-2">
                No spam, just personalized financial guidance.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="submit"
                className="btn-cta"
              >
                {ctaText || "Get Free Consultation"}
              </button>
              
              {secondaryCta && (
                <Link href={ctaLink || '/calculator'} className="btn-secondary text-center">
                  {secondaryCta}
                </Link>
              )}
            </div>
          </form>
        ) : (
          <div className="py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="text-xl font-semibold text-slate-900 mb-2">
              Thank You!
            </h4>
            <p className="text-slate-600 mb-6">
              We've sent a consultation request to {email}. Our team will contact you within 24 hours.
            </p>
            <Link href="/dashboard" className="btn-primary inline-block">
              Back to Dashboard
            </Link>
          </div>
        )}

        <div className="mt-8 pt-8 border-t border-green-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-semibold">1</span>
              </div>
              <div>
                <h4 className="font-medium text-slate-900 mb-1">Personalized Plan</h4>
                <p className="text-xs text-slate-500">Tailored to your goals and risk profile</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-semibold">2</span>
              </div>
              <div>
                <h4 className="font-medium text-slate-900 mb-1">Tax Optimization</h4>
                <p className="text-xs text-slate-500">Maximize savings with smart tax planning</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-semibold">3</span>
              </div>
              <div>
                <h4 className="font-medium text-slate-900 mb-1">Regular Reviews</h4>
                <p className="text-xs text-slate-500">Quarterly portfolio reviews and adjustments</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}