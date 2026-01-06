import { formatCurrency, formatPercentage } from '../lib/formatters';

export default function StatCard({
  title,
  value,
  type = 'currency',
  trend,
  description,
  icon,
  color = 'primary'
}) {
  const colorClasses = {
    primary: 'bg-green-100 text-green-700',
    warning: 'bg-orange-100 text-orange-700',
    danger: 'bg-red-100 text-red-700',
    slate: 'bg-slate-100 text-slate-700'
  };

  const formatValue = () => {
    if (type === 'currency') return formatCurrency(value);
    if (type === 'percentage') return formatPercentage(value);
    if (type === 'age') return `${value} years`;
    return value;
  };

  return (
    <div className="card hover:-translate-y-0.5 transition-transform">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-slate-500 mb-1">{title}</p>
          <p className="text-2xl font-semibold text-slate-900">{formatValue()}</p>
        </div>
        
        {icon && (
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            {icon}
          </div>
        )}
      </div>
      
      {trend && (
        <div className={`inline-flex items-center text-sm px-2 py-1 rounded ${
          trend > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          <span className={trend > 0 ? 'text-green-600' : 'text-red-600'}>
            {trend > 0 ? '↗' : '↘'}
          </span>
          <span className="ml-1 font-medium">
            {Math.abs(trend)}%
          </span>
        </div>
      )}
      
      {description && (
        <p className="text-xs text-slate-500 mt-2">{description}</p>
      )}
    </div>
  );
}