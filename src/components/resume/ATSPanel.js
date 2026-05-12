import React, { useState } from 'react';
import { getATSScore } from '../../services/api';
import { Target, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

export default function ATSPanel({ resumeId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const check = async () => {
    setLoading(true);
    try {
      const { data: res } = await getATSScore(resumeId);
      setData(res);
    } catch { }
    finally { setLoading(false); }
  };

  const scoreColor = data?.score >= 70 ? 'text-green-500' : data?.score >= 40 ? 'text-yellow-500' : 'text-red-500';
  const barColor = data?.score >= 70 ? 'bg-green-500' : data?.score >= 40 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold flex items-center gap-2"><Target size={18} className="text-blue-600" /> ATS Score</h3>
        <button onClick={check} disabled={loading} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Check
        </button>
      </div>

      {data ? (
        <>
          <div className="text-center mb-3">
            <span className={`text-4xl font-bold ${scoreColor}`}>{data.score}</span>
            <span className="text-gray-400 text-lg">/100</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
            <div className={`h-2 rounded-full transition-all ${barColor}`} style={{ width: `${data.score}%` }} />
          </div>
          {data.suggestions?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Improvements:</p>
              <ul className="space-y-1.5">
                {data.suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <AlertCircle size={13} className="text-yellow-500 flex-shrink-0 mt-0.5" /> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {data.suggestions?.length === 0 && (
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <CheckCircle size={16} /> Great! Your resume is well-optimized.
            </div>
          )}
        </>
      ) : (
        <p className="text-sm text-gray-500 text-center py-2">Click "Check" to analyze your resume</p>
      )}
    </div>
  );
}
