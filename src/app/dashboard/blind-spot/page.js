"use client";

import BlindSpot from '../../../components/BlindSpot';

export default function BlindSpotPage() {
  return (
    <div className="pt-8">
      <div className="mb-6 text-left">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Blind Spot Analysis</h1>
        <p className="text-slate-600 mt-2">
          Identify hidden risks and opportunities in your financial plan. Discover where small adjustments today can create significant impact over decades.
        </p>
      </div>

      <BlindSpot />
    </div>
  );
}