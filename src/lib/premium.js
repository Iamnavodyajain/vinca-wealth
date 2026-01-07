// lib/premium.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

// Create a context for premium status
const PremiumContext = createContext();

export function PremiumProvider({ children }) {
  const [isPremium, setIsPremium] = useState(false);
  
  // Check localStorage on initial load
  useEffect(() => {
    const saved = localStorage.getItem('vinca_premium_demo');
    if (saved === 'true') {
      setIsPremium(true);
    }
  }, []);

  const upgradeToPremium = () => {
    setIsPremium(true);
    localStorage.setItem('vinca_premium_demo', 'true');
  };

  const downgradeToFree = () => {
    setIsPremium(false);
    localStorage.removeItem('vinca_premium_demo');
  };

  return (
    <PremiumContext.Provider value={{ isPremium, upgradeToPremium, downgradeToFree }}>
      {children}
    </PremiumContext.Provider>
  );
}

// Custom hook to use premium context
export function usePremium() {
  const context = useContext(PremiumContext);
  if (!context) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
}