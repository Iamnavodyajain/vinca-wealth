'use client';

import { useState, useEffect } from 'react';

export default function InputField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  min,
  max,
  prefix,
  suffix,
  helper,
  className = ''
}) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setDisplayValue(newValue);
    
    if (type === 'number' || type === 'currency' || type === 'percentage') {
      const numValue = parseFloat(newValue) || 0;
      onChange(numValue);
    } else {
      onChange(newValue);
    }
  };

  const handleIncrement = () => {
    const newValue = (parseFloat(value) || 0) + 1;
    if (max === undefined || newValue <= max) {
      onChange(newValue);
    }
  };

  const handleDecrement = () => {
    const newValue = (parseFloat(value) || 0) - 1;
    if (min === undefined || newValue >= min) {
      onChange(newValue);
    }
  };

  const getInputType = () => {
    if (type === 'currency' || type === 'percentage') return 'number';
    return type;
  };

  const formatDisplayValue = (val) => {
    if (type === 'currency') {
      return new Intl.NumberFormat('en-IN').format(val);
    }
    return val;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
            {prefix}
          </span>
        )}
        
        <input
          id={id}
          type={getInputType()}
          value={formatDisplayValue(displayValue)}
          onChange={handleChange}
          min={min}
          max={max}
          className={`input-field ${prefix ? 'pl-8' : ''} ${suffix ? 'pr-16' : ''}`}
        />
        
        {(type === 'number' || type === 'currency' || type === 'percentage') && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
            <button
              type="button"
              onClick={handleDecrement}
              className="w-6 h-6 flex items-center justify-center rounded-lg border border-slate-300 hover:bg-slate-50"
            >
              <span className="text-slate-500">−</span>
            </button>
            <button
              type="button"
              onClick={handleIncrement}
              className="w-6 h-6 flex items-center justify-center rounded-lg border border-slate-300 hover:bg-slate-50"
            >
              <span className="text-slate-500">+</span>
            </button>
          </div>
        )}
        
        {suffix && !(type === 'number' || type === 'currency' || type === 'percentage') && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
            {suffix}
          </span>
        )}
        
        {type === 'percentage' && (
          <span className="absolute right-12 top-1/2 -translate-y-1/2 text-slate-500">
            %
          </span>
        )}
      </div>
      
      {helper && (
        <p className="text-xs text-slate-500">
          {helper}
        </p>
      )}
    </div>
  );
}