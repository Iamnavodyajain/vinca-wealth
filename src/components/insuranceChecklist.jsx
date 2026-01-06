'use client';

import { useState } from 'react';

const defaultChecklist = [
  { id: 1, title: 'Term Life Insurance', description: '10-15x annual income coverage', checked: false },
  { id: 2, title: 'Health Insurance', description: '₹10L+ coverage for family', checked: false },
  { id: 3, title: 'Emergency Fund', description: '6-12 months of expenses', checked: false },
  { id: 4, title: 'Critical Illness Cover', description: 'Additional ₹10L+ coverage', checked: false },
  { id: 5, title: 'Personal Accident Cover', description: '₹50L+ accidental death benefit', checked: false },
  { id: 6, title: 'Disability Insurance', description: 'Income replacement coverage', checked: false },
];

export default function InsuranceChecklist() {
  const [checklist, setChecklist] = useState(defaultChecklist);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleCheck = (id) => {
    setChecklist(prev => 
      prev.map(item => 
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      // Store in localStorage
      localStorage.setItem('vincaUserEmail', email);
      localStorage.setItem('vincaChecklist', JSON.stringify(checklist));
    }
  };

  const checkedCount = checklist.filter(item => item.checked).length;
  const progress = (checkedCount / checklist.length) * 100;

  return (
    <div className="card">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Financial Essentials Checklist
        </h3>
        <p className="text-sm text-slate-500">
          Ensure you're covered with these essential protections
        </p>
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">
            Progress: {checkedCount} of {checklist.length} completed
          </span>
          <span className="text-sm font-medium text-green-600">
            {Math.round(progress)}%
          </span>
        </div>
        
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="space-y-3">
          {checklist.map((item) => (
            <div
              key={item.id}
              className={`flex items-start p-3 rounded-lg border transition-colors ${
                item.checked 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <button
                onClick={() => handleCheck(item.id)}
                className={`w-5 h-5 rounded border flex-shrink-0 mt-0.5 mr-3 flex items-center justify-center ${
                  item.checked 
                    ? 'bg-green-500 border-green-500' 
                    : 'border-slate-300'
                }`}
              >
                {item.checked && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${
                    item.checked ? 'text-green-700' : 'text-slate-700'
                  }`}>
                    {item.title}
                  </span>
                </div>
                <p className={`text-sm mt-1 ${
                  item.checked ? 'text-green-600' : 'text-slate-500'
                }`}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              Get personalized recommendations
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 input-field"
                required
              />
              <button
                type="submit"
                className="btn-primary whitespace-nowrap"
              >
                Save Progress
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              We'll save your checklist and send you tailored recommendations.
            </p>
          </div>
        </form>
      ) : (
        <div className="text-center py-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-slate-900 mb-2">
            Checklist Saved!
          </h4>
          <p className="text-sm text-slate-600">
            Your progress has been saved. We've sent recommendations to {email}
          </p>
        </div>
      )}
    </div>
  );
}