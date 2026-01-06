export function calculateSipGrowth({
  initialInvestment,
  monthlySIP,
  years,
  annualReturn,
  sipIncreaseRate
}) {
  const data = [];
  let corpus = initialInvestment;
  let currentSIP = monthlySIP * 12; // Annual SIP
  
  for (let year = 1; year <= years; year++) {
    // Add annual SIP at the beginning of the year
    corpus += currentSIP;
    
    // Apply returns
    corpus *= (1 + annualReturn / 100);
    
    // Increase SIP for next year
    currentSIP *= (1 + sipIncreaseRate / 100);
    
    data.push({
      age: year + 29, // Starting from age 30
      year,
      startingCorpus: corpus - currentSIP/(1 + sipIncreaseRate/100),
      monthlySIP: currentSIP / 12,
      monthlySWP: 0,
      returnRate: annualReturn,
      endingCorpus: corpus,
      totalInvested: initialInvestment + monthlySIP * 12 * year,
      totalWealth: corpus
    });
  }
  
  return data;
}

export function calculateCorpusAtRetirement(sipData) {
  return sipData[sipData.length - 1]?.endingCorpus || 0;
}

export function calculateWithdrawalPhase({
  initialCorpus,
  currentAge,
  lifespan,
  monthlyExpenses,
  inflationRate,
  withdrawalIncrease,
  annualReturn
}) {
  const data = [];
  let corpus = initialCorpus;
  let currentAgeVar = currentAge;
  let monthlyWithdrawal = monthlyExpenses;
  
  for (let year = 1; year <= (lifespan - currentAge); year++) {
    const annualWithdrawal = monthlyWithdrawal * 12;
    
    // Withdraw at the beginning of the year
    corpus -= annualWithdrawal;
    
    // Apply returns on remaining corpus
    if (corpus > 0) {
      corpus *= (1 + annualReturn / 100);
    }
    
    // Increase withdrawal for next year
    monthlyWithdrawal *= (1 + Math.max(inflationRate, withdrawalIncrease) / 100);
    
    data.push({
      age: currentAgeVar + year,
      year: year + 30, // Offset for accumulation years
      startingCorpus: corpus + annualWithdrawal,
      monthlySIP: 0,
      monthlySWP: monthlyWithdrawal,
      returnRate: annualReturn,
      endingCorpus: Math.max(corpus, 0),
      totalInvested: 0,
      totalWealth: Math.max(corpus, 0)
    });
    
    if (corpus <= 0) break;
  }
  
  return data;
}

export function calculateDepletionAge(withdrawalData) {
  const lastEntry = withdrawalData[withdrawalData.length - 1];
  return lastEntry?.endingCorpus <= 0 ? lastEntry.age : 'Never';
}

export function calculateSipGap(currentSIP, monthlyExpenses, returns, yearsToRetirement) {
  const requiredSIP = (monthlyExpenses * 300) / yearsToRetirement; // Simplified rule
  return Math.max(0, requiredSIP - currentSIP);
}