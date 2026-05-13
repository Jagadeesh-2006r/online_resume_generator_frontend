import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import { getResumes, createResume, deleteResume, duplicateResume, getTemplates } from '../services/api';
import toast from 'react-hot-toast';
import { Plus, FileText, Trash2, Copy, Edit, Eye, MoreVertical, Calendar, TrendingUp } from 'lucide-react';

function ResumeCard({ resume, onDelete, onDuplicate, onEdit }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const scoreColor = resume.ats_score >= 70 ? 'text-green-500' : resume.ats_score >= 40 ? 'text-yellow-500' : 'text-red-500';

  return (
    <div className="card p-5 hover:shadow-md transition-all group fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
          <FileText size={24} className="text-blue-600" />
        </div>
        <div className="relative">
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreVertical size={18} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-10 min-w-[160px] py-1">
              <button onClick={() => { onEdit(resume.id); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
                <Edit size={15} /> Edit Resume
              </button>
              <button onClick={() => { onDuplicate(resume.id); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
                <Copy size={15} /> Duplicate
              </button>
              {resume.is_public && (
                <a href={`/r/${resume.share_token}`} target="_blank" rel="noreferrer"
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
                  <Eye size={15} /> View Public
                </a>
              )}
              <button onClick={() => { onDelete(resume.id); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                <Trash2 size={15} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">{resume.title}</h3>
      <p className="text-xs text-gray-500 mb-3 capitalize">{resume.template_name || 'Modern'} Template</p>

      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
        <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(resume.updated_at).toLocaleDateString()}</span>
        <span className="flex items-center gap-1"><Eye size={12} /> {resume.view_count || 0} views</span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-gray-500">ATS Score</span>
        <span className={`text-sm font-bold ${scoreColor}`}>{resume.ats_score || 0}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-4">
        <div className={`h-1.5 rounded-full transition-all ${resume.ats_score >= 70 ? 'bg-green-500' : resume.ats_score >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
          style={{ width: `${resume.ats_score || 0}%` }} />
      </div>

      <button onClick={() => onEdit(resume.id)} className="btn-primary w-full text-sm py-2">
        Edit Resume
      </button>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [r, t] = await Promise.all([getResumes(), getTemplates()]);
        setResumes(r.data.resumes || r.data || []);
        setTemplates(t.data.templates || t.data || []);
        if ((t.data.templates || t.data || [])[0]) setSelectedTemplate((t.data.templates || t.data || [])[0].id);
      } catch { toast.error('Failed to load data'); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const handleCreate = async () => {
    if (!newTitle.trim()) return toast.error('Enter a resume title');
    try {
      const { data } = await createResume({ title: newTitle, template_id: selectedTemplate });
      setResumes([data.resume, ...resumes]);
      setShowCreate(false);
      setNewTitle('');
      toast.success('Resume created!');
      navigate(`/resume/${data.resume.id}`);
    } catch { toast.error('Failed to create resume'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resume?')) return;
    try {
      await deleteResume(id);
      setResumes(resumes.filter((r) => r.id !== id));
      toast.success('Resume deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const handleDuplicate = async (id) => {
    try {
      const { data } = await duplicateResume(id);
      setResumes([data.resume, ...resumes]);
      toast.success('Resume duplicated!');
    } catch { toast.error('Failed to duplicate'); }
  };

  const safeResumes = Array.isArray(resumes)
  ? resumes.filter(Boolean)
  : [];

const stats = [
  {
    label: 'Total Resumes',
    value: safeResumes.length,
    icon: FileText,
    color: 'bg-blue-500'
  },
  {
    label: 'Avg ATS Score',
    value: `${
      safeResumes.length
        ? Math.round(
            safeResumes.reduce(
              (s, r) => s + (r.ats_score || 0),
              0
            ) / safeResumes.length
          )
        : 0
    }%`,
    icon: TrendingUp,
    color: 'bg-green-500'
  },
  {
    label: 'Total Views',
    value: safeResumes.reduce(
      (s, r) => s + (r.view_count || 0),
      0
    ),
    icon: Eye,
    color: 'bg-purple-500'
  },
];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
            <p className="text-gray-500 mt-1">Manage and build your professional resumes</p>
          </div>
          <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2">
            <Plus size={18} /> New Resume
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card p-5 flex items-center gap-4">
              <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
                <Icon size={22} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Create Modal */}
        {showCreate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <h2 className="text-xl font-bold mb-4">Create New Resume</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Resume Title</label>
                  <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
                    className="input-field" placeholder="e.g. Software Engineer Resume" onKeyDown={(e) => e.key === 'Enter' && handleCreate()} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Template</label>
                  <select value={selectedTemplate} onChange={(e) => setSelectedTemplate(e.target.value)} className="input-field">
                    {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowCreate(false)} className="btn-secondary flex-1">Cancel</button>
                  <button onClick={handleCreate} className="btn-primary flex-1">Create</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resumes Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <div key={i} className="card p-5 h-64 animate-pulse bg-gray-200 dark:bg-gray-700" />)}
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold mb-2">No resumes yet</h3>
            <p className="text-gray-500 mb-6">Create your first professional resume</p>
            <button onClick={() => setShowCreate(true)} className="btn-primary inline-flex items-center gap-2">
              <Plus size={18} /> Create Resume
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} onDelete={handleDelete} onDuplicate={handleDuplicate} onEdit={(id) => navigate(`/resume/${id}`)} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
