"use client";

import { useRouter } from 'next/navigation';

export function useScrollToInput() {
  const router = useRouter();

  const scrollToInput = (inputNames) => {
    // Navigate back to calculator page
    router.push('/dashboard/calculator');
    
    // Store which inputs to highlight in session storage
    if (inputNames && inputNames.length > 0) {
      sessionStorage.setItem('highlightInputs', JSON.stringify(inputNames));
      
      // Set a flag to scroll after navigation
      sessionStorage.setItem('shouldScrollToCalculator', 'true');
    }
    
    // The actual scrolling will be handled by the Calculator component
    // by checking sessionStorage on mount
  };

  return { scrollToInput };
}