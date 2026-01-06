import { formatCurrency } from '../lib/formatters';

export default function StatusBanner({ status, freedomAge, expectedCorpus, requiredCorpus }) {
  const isAchieved = status === 'Achieved';
  const isAtRisk = !isAchieved && freedomAge < 85;
  const isCritical = !isAchieved && freedomAge >= 85;

  const getStatusConfig = () => {
    if (isAchieved) {
      return {
        title: '🎉 Financial Freedom Achievable!',
        description: `You're on track to achieve financial freedom by age ${freedomAge || 60}`,
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-800'
      };
    } else if (isAtRisk) {
      return {
        title: '⚠️ Freedom at Risk',
        description: `Your corpus may deplete by age ${freedomAge}. Consider increasing your investments.`,
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        textColor: 'text-orange-800'
      };
    } else {
      return {
        title: '🚨 Action Required',
        description: 'Your current plan may not sustain through retirement. Immediate adjustments needed.',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-800'
      };
    }
  };

  const config = getStatusConfig();
  const corpusGap = requiredCorpus - expectedCorpus;

  return (
    <div className={`rounded-2xl border ${config.borderColor} ${config.bgColor} p-6 mb-8`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className={`text-lg font-semibold ${config.textColor} mb-2`}>
            {config.title}
          </h3>
          <p className={`text-sm ${config.textColor.replace('800', '700')}`}>
            {config.description}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="text-center">
            <div className="text-xs text-slate-500 mb-1">Freedom Age</div>
            <div className={`text-xl font-semibold ${config.textColor}`}>
              {isAchieved ? '✓ Achieved' : `${freedomAge} years`}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-xs text-slate-500 mb-1">Corpus Gap</div>
            <div className={`text-xl font-semibold ${
              corpusGap > 0 ? 'text-red-600' : 'text-green-600'
            }`}>
              {formatCurrency(Math.abs(corpusGap))}
              {corpusGap > 0 ? ' short' : ' surplus'}
            </div>
          </div>
        </div>
      </div>
      
      {!isAchieved && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Expected Corpus at Retirement</span>
            <span className="font-medium">{formatCurrency(expectedCorpus)}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-slate-600">Required Corpus for Sustainability</span>
            <span className="font-medium">{formatCurrency(requiredCorpus)}</span>
          </div>
        </div>
      )}
    </div>
  );
}