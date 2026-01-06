// Round to nearest 1,000 INR (conservative rounding)
function roundThousand(x) {
  if (x == null || Number.isNaN(x) || typeof x !== 'number') return null;
  return Math.round(x / 1000) * 1000;
}

/**
 * Determine severity level for each blind spot
 * @param {object} spot - Blind spot data
 * @param {object} context - Calculator context
 * @returns {string} - 'at-risk', 'needs-attention', or 'on-track'
 */
function determineSeverity(spot, context) {
  const { formData, results } = context;
  
  // If no results or data, return neutral
  if (!results || !formData) return 'needs-attention';

  switch (spot.id) {
    case 'retirement-timeline':
      // If freedomAge is Achieved or far beyond retirement, on track
      if (results.freedomAge === 'Achieved') return 'on-track';
      if (typeof results.freedomAge === 'number' && results.freedomAge >= formData.retirementAge + 10) {
        return 'on-track';
      }
      // If depletion age is before life expectancy (90), at risk
      if (typeof results.freedomAge === 'number' && results.freedomAge < 90) {
        return 'at-risk';
      }
      return 'needs-attention';

    case 'corpus-gap':
      const expected = parseFloat(results.expectedCorpus) || 0;
      const required = parseFloat(results.requiredCorpus) || 0;
      const gap = required - expected;
      const gapPercentage = expected > 0 ? (gap / expected) * 100 : 100;
      
      if (gap <= 0) return 'on-track';
      if (gapPercentage > 20) return 'at-risk';
      return 'needs-attention';

    case 'sustainability':
      if (!results.depletionAge) return 'needs-attention';
      // If funds last beyond age 90, on track
      if (results.depletionAge >= 90) return 'on-track';
      // If funds deplete before age 80, at risk
      if (results.depletionAge < 80) return 'at-risk';
      return 'needs-attention';

    case 'sip-adequacy':
      if (results.sipGap == null) return 'needs-attention';
      if (results.sipGap <= 0) return 'on-track';
      // Large SIP gap indicates at-risk
      const monthlySIP = formData.monthlySIP || 0;
      const sipGapPercentage = monthlySIP > 0 ? (results.sipGap / monthlySIP) * 100 : 100;
      if (sipGapPercentage > 50) return 'at-risk';
      return 'needs-attention';

    case 'inflation-lifestyle':
      const currentExpenses = formData.monthlyExpenses || 0;
      const projectedExpenses = spot.value || 0;
      const inflationFactor = currentExpenses > 0 ? (projectedExpenses / currentExpenses) : 1;
      if (inflationFactor > 3) return 'at-risk'; // Expenses triple or more
      if (inflationFactor > 2) return 'needs-attention';
      return 'on-track';

    default:
      return 'needs-attention';
  }
}

/**
 * Generate resolution text based on blind spot type and severity
 */
function generateResolutionText(spotId, severity, value) {
  const baseResolutions = {
    'retirement-timeline': {
      'at-risk': 'Consider adjusting your retirement age, increasing monthly contributions, or revisiting expected returns.',
      'needs-attention': 'Small improvements in savings rate or investment horizon can better align your timeline.',
      'on-track': 'Your current timeline appears sustainable under these assumptions.'
    },
    'corpus-gap': {
      'at-risk': 'This gap can be closed by increasing monthly SIP, extending investment horizon, or revisiting return assumptions.',
      'needs-attention': 'Minor adjustments to contributions or timeline can help close this gap.',
      'on-track': 'Your expected corpus meets your retirement needs under current assumptions.'
    },
    'sustainability': {
      'at-risk': 'Consider creating a withdrawal buffer, planning for lower expenses, or adding a post-retirement income stream.',
      'needs-attention': 'Adding a safety margin to your withdrawal plan can improve sustainability.',
      'on-track': 'Your withdrawal strategy appears sustainable through retirement.'
    },
    'sip-adequacy': {
      'at-risk': 'Gradually increasing your monthly SIP or starting earlier can materially improve outcomes.',
      'needs-attention': 'Small, regular increases to your SIP can compound significantly over time.',
      'on-track': 'Your current SIP appears adequate for your retirement goals.'
    },
    'inflation-lifestyle': {
      'at-risk': 'Plan for conservative inflation assumptions and consider building an inflation-protected income stream.',
      'needs-attention': 'Regularly reviewing and adjusting for inflation helps maintain lifestyle expectations.',
      'on-track': 'Your inflation planning appears aligned with lifestyle expectations.'
    }
  };

  return baseResolutions[spotId]?.[severity] || 'Reviewing and adjusting inputs can help address this consideration.';
}

/**
 * Generate impact explanation for each blind spot
 */
function generateImpactText(spotId, value) {
  const impacts = {
    'retirement-timeline': 'Delaying retirement affects not just finances, but freedom, health, and quality of life during your most valuable years.',
    'corpus-gap': 'Even small gaps today can become significant shortfalls over decades, potentially reducing retirement lifestyle choices.',
    'sustainability': 'Running out of funds later in life creates dependency risk when you have fewer options to recover.',
    'sip-adequacy': 'Insufficient savings today compounds into large future gaps, making later corrections much more difficult.',
    'inflation-lifestyle': 'Inflation silently erodes purchasing power, meaning today\'s comfortable expenses may not sustain tomorrow\'s lifestyle.'
  };

  return impacts[spotId] || 'This factor influences long-term retirement readiness and deserves regular review.';
}

/**
 * Get which calculator inputs to highlight for each blind spot
 */
function getEditTargets(spotId) {
  const targets = {
    'retirement-timeline': ['monthlySIP', 'retirementAge', 'investmentYears'],
    'corpus-gap': ['monthlySIP', 'expectedReturns', 'sipIncreaseRate'],
    'sustainability': ['monthlyExpenses', 'inflationRate', 'retirementReturns'],
    'sip-adequacy': ['monthlySIP', 'sipIncreaseRate'],
    'inflation-lifestyle': ['inflationRate', 'monthlyExpenses']
  };

  return targets[spotId] || [];
}

/**
 * computeBlindSpots
 * - Accepts the calculator `formData` and `results` objects and returns
 *   an array of five enhanced blind-spot objects with storytelling elements.
 */
export function computeBlindSpots({ formData, results }) {
  if (!results || !formData) return null;

  const {
    currentAge,
    monthlyExpenses,
    retirementAge,
    inflationRate,
  } = formData || {};

  // Validate required inputs
  if (currentAge == null || retirementAge == null || 
      monthlyExpenses == null || inflationRate == null) {
    console.warn('Missing required formData for blind spot analysis');
    return null;
  }

  const {
    expectedCorpus,
    requiredCorpus,
    depletionAge,
    sipGap,
    freedomAge,
  } = results || {};

  const context = { formData, results };

  // 1) Retirement timeline
  const retirementTimeline = {
    id: 'retirement-timeline',
    title: 'Retirement Timeline Risk',
    value: freedomAge !== undefined ? freedomAge : null,
    unit: 'age',
    rawValue: freedomAge,
    // Neutral descriptive message
    message: (freedomAge === 'Achieved' || freedomAge == null)
      ? 'Your plan indicates sustainability through your expected lifespan.'
      : `Based on current inputs, your corpus may deplete by age ${freedomAge}.`,
    // Additional fields for enhanced UI
    impact: generateImpactText('retirement-timeline', freedomAge),
    editTargets: getEditTargets('retirement-timeline'),
    isResolvable: true
  };

  // 2) Corpus gap
  const expectedNum = parseFloat(expectedCorpus) || 0;
  const requiredNum = parseFloat(requiredCorpus) || 0;
  const rawGap = requiredNum - expectedNum;
  const corpusGap = {
    id: 'corpus-gap',
    title: 'Corpus Shortfall Risk',
    value: roundThousand(Math.abs(rawGap)),
    unit: 'currency',
    rawValue: rawGap,
    message: rawGap > 0
      ? `Shortfall of approximately ₹${roundThousand(Math.abs(rawGap)).toLocaleString('en-IN')} between required and expected corpus.`
      : 'Expected corpus meets or exceeds required amount under current assumptions.',
    impact: generateImpactText('corpus-gap', rawGap),
    editTargets: getEditTargets('corpus-gap'),
    isResolvable: true
  };

  // 3) Sustainability
  const sustainability = {
    id: 'sustainability',
    title: 'Sustainability Risk',
    value: depletionAge || null,
    unit: 'age',
    rawValue: depletionAge,
    message: depletionAge
      ? `Under current assumptions, funds may last until age ${depletionAge}.` 
      : 'Unable to determine sustainability with available data.',
    impact: generateImpactText('sustainability', depletionAge),
    editTargets: getEditTargets('sustainability'),
    isResolvable: true
  };

  // 4) SIP adequacy
  const sipAdequacy = {
    id: 'sip-adequacy',
    title: 'Savings Adequacy Risk',
    value: sipGap != null ? roundThousand(Math.abs(sipGap)) : null,
    unit: 'currency',
    rawValue: sipGap,
    message: sipGap == null
      ? 'Savings adequacy not available.'
      : (sipGap > 0
          ? `Monthly savings may need to increase by ₹${roundThousand(Math.abs(sipGap)).toLocaleString('en-IN')} to meet targets.`
          : 'Current monthly savings appear sufficient under these assumptions.'),
    impact: generateImpactText('sip-adequacy', sipGap),
    editTargets: getEditTargets('sip-adequacy'),
    isResolvable: true
  };

  // 5) Inflation & lifestyle
  const yearsToRetire = Math.max(0, retirementAge - currentAge);
  const inflationDecimal = (inflationRate || 0) / 100;
  const projectedMonthly = monthlyExpenses * Math.pow(1 + inflationDecimal, yearsToRetire);
  const inflationLifestyle = {
    id: 'inflation-lifestyle',
    title: 'Inflation Risk',
    value: roundThousand(projectedMonthly),
    unit: 'currency',
    rawValue: projectedMonthly,
    message: `Monthly expenses could grow to ₹${roundThousand(projectedMonthly).toLocaleString('en-IN')} by retirement due to inflation.`,
    impact: generateImpactText('inflation-lifestyle', projectedMonthly),
    editTargets: getEditTargets('inflation-lifestyle'),
    isResolvable: true
  };

  // Create array and add severity to each spot
  const spots = [retirementTimeline, corpusGap, sustainability, sipAdequacy, inflationLifestyle];
  
  // Add severity and resolution text to each spot
  spots.forEach(spot => {
    const severity = determineSeverity(spot, context);
    spot.severity = severity;
    spot.severityLabel = {
      'at-risk': 'At Risk',
      'needs-attention': 'Needs Attention',
      'on-track': 'On Track'
    }[severity];
    spot.resolution = generateResolutionText(spot.id, severity, spot.value);
    
    // Check if already resolved (based on severity)
    spot.isResolved = severity === 'on-track';
  });

  return spots;
}

export default computeBlindSpots;