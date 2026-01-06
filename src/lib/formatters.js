export function formatCurrency(amount) {
  if (!amount && amount !== 0) return '₹0';
  
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  } else {
    return `₹${Math.round(amount).toLocaleString('en-IN')}`;
  }
}

export function formatPercentage(value) {
  return `${Number(value).toFixed(1)}%`;
}

export function formatAge(age) {
  return age === 'Never' ? 'Never (Sustainable)' : `${age} years`;
}