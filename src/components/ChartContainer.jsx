// components/ChartContainer.jsx

'use client';

export default function ChartContainer({ children, height = '400px', className = '' }) {
  return (
    <div
      className={`relative min-h-0 ${className}`}
      style={{ height, minHeight: '300px' }}
    >
      <div className="absolute inset-0">
        {children}
      </div>
    </div>
  );
}