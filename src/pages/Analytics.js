import React, { useEffect, useState } from 'react';
import { getMyAnalytics } from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import { BarChart2, Eye, Download, TrendingUp, FileText, Loader2 } from 'lucide-react';

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyAnalytics()
      .then(({ data: res }) => setData(res.analytics))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 size={32} className="animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  const stats = [
    { label: 'Total Views', value: data?.totalViews || 0, icon: Eye, color: 'bg-blue-500' },
    { label: 'Total Downloads', value: data?.totalDownloads || 0, icon: Download, color: 'bg-green-500' },
    { label: 'Resumes', value: data?.resumes?.length || 0, icon: FileText, color: 'bg-purple-500' },
    {
      label: 'Avg ATS Score',
      value: data?.resumes?.length
        ? `${Math.round(data.resumes.reduce((s, r) => s + (r.ats_score || 0), 0) / data.resumes.length)}%`
        : '0%',
      icon: TrendingUp,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <BarChart2 size={24} /> Analytics
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card p-5 flex items-center gap-4">
              <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Icon size={20} className="text-white" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Resume Performance Table */}
        <div className="card overflow-hidden mb-6">
          <div className="p-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-white">Resume Performance</h2>
          </div>
          {data?.resumes?.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No resumes yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    {['Resume', 'ATS Score', 'Views', 'Downloads', 'Created'].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {data?.resumes?.map((r) => {
                    const scoreColor = r.ats_score >= 70 ? 'text-green-600' : r.ats_score >= 40 ? 'text-yellow-600' : 'text-red-600';
                    return (
                      <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                        <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">{r.title}</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <span className={`font-bold ${scoreColor}`}>{r.ats_score || 0}%</span>
                            <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                              <div className={`h-1.5 rounded-full ${r.ats_score >= 70 ? 'bg-green-500' : r.ats_score >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                style={{ width: `${r.ats_score || 0}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-gray-600 dark:text-gray-400">{r.view_count || 0}</td>
                        <td className="px-5 py-3 text-gray-600 dark:text-gray-400">{r.download_count || 0}</td>
                        <td className="px-5 py-3 text-gray-500 text-xs">{new Date(r.created_at).toLocaleDateString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Events */}
        {data?.events?.length > 0 && (
          <div className="card overflow-hidden">
            <div className="p-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.events.slice(0, 10).map((event, i) => (
                <div key={i} className="px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${event.event_type === 'view' ? 'bg-blue-500' : event.event_type === 'download' ? 'bg-green-500' : 'bg-purple-500'}`} />
                    <span className="text-sm capitalize text-gray-700 dark:text-gray-300">{event.event_type.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="font-medium text-gray-700 dark:text-gray-300">{event.count}x</span>
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
