import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPublicResume } from '../services/api';
import TemplateRenderer from '../templates/TemplateRenderer';
import { FileText, Loader2, Lock } from 'lucide-react';

export default function PublicResume() {
  const { token } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getPublicResume(token)
      .then(({ data }) => setResume(data.resume))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 size={32} className="animate-spin text-blue-600" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-6">
        <Lock size={48} className="text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Resume Not Found</h1>
        <p className="text-gray-500 mb-6">This resume is either private or doesn't exist.</p>
        <Link to="/" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <FileText size={16} className="text-white" />
          </div>
          <span className="font-bold text-gray-900">ResumeAI</span>
        </Link>
        <div className="text-sm text-gray-500">
          Shared by <span className="font-medium text-gray-700">{resume.user_name}</span>
        </div>
      </div>

      {/* Resume */}
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        <TemplateRenderer resume={resume} />
      </div>

      {/* Footer CTA */}
      <div className="max-w-4xl mx-auto mt-8 text-center">
        <p className="text-gray-500 text-sm mb-3">Want to create your own professional resume?</p>
        <Link to="/register" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
          <FileText size={16} /> Build Your Resume Free
        </Link>
      </div>
    </div>
  );
}
