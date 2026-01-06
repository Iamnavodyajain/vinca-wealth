import { formatCurrency, formatPercentage } from '../lib/formatters';
import { useState } from 'react';

export default function CorpusTable({ data }) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  if (!data || data.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <p className="text-slate-500">No data available. Complete the calculator first.</p>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const formatPhase = (phase) => {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        phase === 'Accumulation' 
          ? 'bg-green-100 text-green-700' 
          : 'bg-orange-100 text-orange-700'
      }`}>
        {phase}
      </span>
    );
  };

  return (
    <div className="card overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">Year-by-Year Breakdown</h3>
        <p className="text-sm text-slate-500">Detailed financial projection across your journey</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase tracking-wider">
                Age
              </th>
              <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase tracking-wider">
                Phase
              </th>
              <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase tracking-wider">
                Starting Corpus
              </th>
              <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase tracking-wider">
                Monthly SIP
              </th>
              <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase tracking-wider">
                Monthly SWP
              </th>
              <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase tracking-wider">
                Return %
              </th>
              <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase tracking-wider">
                Ending Corpus
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {currentData.map((row, index) => (
              <tr key={index} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-6 text-sm font-medium text-slate-900">
                  {row.age}
                </td>
                <td className="py-3 px-6 text-sm">
                  {formatPhase(row.phase)}
                </td>
                <td className="py-3 px-6 text-sm text-slate-600">
                  {formatCurrency(row.startingCorpus)}
                </td>
                <td className="py-3 px-6 text-sm text-slate-600">
                  {row.monthlySIP > 0 ? formatCurrency(row.monthlySIP) : '-'}
                </td>
                <td className="py-3 px-6 text-sm text-slate-600">
                  {row.monthlySWP > 0 ? formatCurrency(row.monthlySWP) : '-'}
                </td>
                <td className="py-3 px-6 text-sm text-slate-600">
                  {formatPercentage(row.returnRate)}
                </td>
                <td className="py-3 px-6 text-sm font-medium text-slate-900">
                  {formatCurrency(row.endingCorpus)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <div className="text-sm text-slate-500">
            Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} entries
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg border border-slate-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-slate-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg border border-slate-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}