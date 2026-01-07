'use client';

import { assetClasses } from '@/lib/retirementAssetMetrics';
import AssetMetricCard from './AssetMetricCard';

export default function TopAssetsOverview() {
  const avgSuitability = assetClasses.reduce((acc, asset) => 
    acc + asset.metrics.suitabilityScore, 0) / assetClasses.length;
  
  const bestPerformer = assetClasses.reduce((best, asset) => 
    asset.metrics.realReturnScore > best.metrics.realReturnScore ? asset : best
  );
  
  const lowestVolatility = assetClasses.reduce((lowest, asset) => 
    asset.metrics.volatility < lowest.metrics.volatility ? asset : lowest
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Metric Card 1 - Average Suitability */}
      <AssetMetricCard
        title="Average Suitability Score"
        value={`${avgSuitability.toFixed(1)}/10`}
        description="Across all asset classes based on historical retirement factors"
        tooltip="Composite score considering real returns, volatility, drawdown recovery, and consistency"
        color="blue"
      />

      {/* Metric Card 2 - Historically Resilient */}
      <AssetMetricCard
        title="Historically Resilient"
        value={bestPerformer.name}
        description={`Real Return: ${bestPerformer.metrics.realReturnScore.toFixed(1)}% | Suitability: ${bestPerformer.metrics.suitabilityScore.toFixed(1)}`}
        tooltip="Asset class with highest historical inflation-adjusted returns over 20+ years"
        color="emerald"
        trend={2.1}
      />

      {/* Metric Card 3 - Most Stable */}
      <AssetMetricCard
        title="Most Stable Historically"
        value={lowestVolatility.name}
        description={`Volatility: ${lowestVolatility.metrics.volatility.toFixed(1)}% | Drawdown: ${lowestVolatility.metrics.maxDrawdown.toFixed(1)}%`}
        tooltip="Asset class with lowest historical volatility and smoothest returns"
        color="amber"
      />
    </div>
  );
}