// Mock data for retirement suitability analysis
// Historical data for educational purposes only

export const assetClasses = [
  {
    id: 1,
    name: 'Equity (Large Cap)',
    category: 'Growth',
    color: '#3B82F6',
    metrics: {
      realReturnScore: 8.7,
      volatility: 18.2,
      maxDrawdown: -52.3,
      suitabilityScore: 7.9,
      inflationBeatingYears: 72,
      recoveryTime: 42,
      rolling10YReturns: 11.4,
      rolling20YReturns: 10.2
    },
    description: 'Historically provided growth but with significant volatility during market cycles'
  },
  {
    id: 2,
    name: 'Government Bonds',
    category: 'Income',
    color: '#10B981',
    metrics: {
      realReturnScore: 3.2,
      volatility: 5.8,
      maxDrawdown: -12.1,
      suitabilityScore: 6.5,
      inflationBeatingYears: 65,
      recoveryTime: 18,
      rolling10YReturns: 6.8,
      rolling20YReturns: 5.9
    },
    description: 'Lower volatility with consistent income, but may not outpace inflation significantly'
  },
  {
    id: 3,
    name: 'Corporate Bonds',
    category: 'Income',
    color: '#84CC16',
    metrics: {
      realReturnScore: 4.1,
      volatility: 7.4,
      maxDrawdown: -15.8,
      suitabilityScore: 6.8,
      inflationBeatingYears: 68,
      recoveryTime: 22,
      rolling10YReturns: 7.2,
      rolling20YReturns: 6.3
    },
    description: 'Moderate returns with slightly higher volatility than government bonds'
  },
  {
    id: 4,
    name: 'Gold',
    category: 'Hedge',
    color: '#F59E0B',
    metrics: {
      realReturnScore: 2.8,
      volatility: 15.6,
      maxDrawdown: -44.2,
      suitabilityScore: 5.9,
      inflationBeatingYears: 58,
      recoveryTime: 64,
      rolling10YReturns: 6.1,
      rolling20YReturns: 4.7
    },
    description: 'Historical store of value with low correlation to financial markets'
  },
  {
    id: 5,
    name: 'Real Estate (REITs)',
    category: 'Income & Growth',
    color: '#8B5CF6',
    metrics: {
      realReturnScore: 5.9,
      volatility: 12.8,
      maxDrawdown: -38.7,
      suitabilityScore: 6.2,
      inflationBeatingYears: 70,
      recoveryTime: 36,
      rolling10YReturns: 8.7,
      rolling20YReturns: 7.4
    },
    description: 'Income generation with moderate growth potential and inflation linkage'
  },
  {
    id: 6,
    name: 'International Equity',
    category: 'Diversification',
    color: '#EC4899',
    metrics: {
      realReturnScore: 7.4,
      volatility: 19.8,
      maxDrawdown: -54.2,
      suitabilityScore: 6.9,
      inflationBeatingYears: 69,
      recoveryTime: 48,
      rolling10YReturns: 9.8,
      rolling20YReturns: 8.6
    },
    description: 'Geographic diversification with varying correlation to domestic markets'
  }
];

export const retirementPlans = [
  {
    id: 'conservative',
    name: 'Conservative Plan',
    description: 'Emphasis on capital preservation with moderate growth',
    allocation: {
      equity: 30,
      bonds: 50,
      gold: 10,
      realEstate: 10
    },
    metrics: {
      expectedRealReturn: 4.2,
      volatility: 8.4,
      maxDrawdown: -22.5,
      suitabilityScore: 6.8,
      inflationBeatingProbability: 78
    }
  },
  {
    id: 'balanced',
    name: 'Balanced Plan',
    description: 'Mix of growth and income for retirement accumulation',
    allocation: {
      equity: 50,
      bonds: 30,
      gold: 10,
      realEstate: 10
    },
    metrics: {
      expectedRealReturn: 5.8,
      volatility: 11.2,
      maxDrawdown: -32.7,
      suitabilityScore: 7.2,
      inflationBeatingProbability: 82
    }
  },
  {
    id: 'growth',
    name: 'Growth Plan',
    description: 'Higher growth potential for longer time horizons',
    allocation: {
      equity: 70,
      bonds: 20,
      gold: 5,
      realEstate: 5
    },
    metrics: {
      expectedRealReturn: 7.1,
      volatility: 15.8,
      maxDrawdown: -42.3,
      suitabilityScore: 7.5,
      inflationBeatingProbability: 85
    }
  }
];

export const historicalMetrics = {
  rollingReturns: Array.from({ length: 30 }, (_, i) => ({
    year: 1995 + i,
    equity: 8 + Math.random() * 12,
    bonds: 5 + Math.random() * 4,
    gold: 3 + Math.random() * 8,
    inflation: 4 + Math.random() * 3
  })),
  drawdownRecovery: [
    { asset: 'Equity', drawdown: -52.3, recoveryMonths: 42, period: '2008-2011' },
    { asset: 'Bonds', drawdown: -12.1, recoveryMonths: 18, period: '2013-2014' },
    { asset: 'Gold', drawdown: -44.2, recoveryMonths: 64, period: '2012-2017' },
    { asset: 'Real Estate', drawdown: -38.7, recoveryMonths: 36, period: '2008-2011' }
  ]
};

// Helper functions
export const formatPercentage = (value) => `${value.toFixed(1)}%`;
export const formatScore = (value) => value.toFixed(1);
export const getSuitabilityColor = (score) => {
  if (score >= 8) return 'text-emerald-600 bg-emerald-50';
  if (score >= 6) return 'text-blue-600 bg-blue-50';
  if (score >= 4) return 'text-amber-600 bg-amber-50';
  return 'text-slate-600 bg-slate-50';
};