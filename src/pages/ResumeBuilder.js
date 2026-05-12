import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import { getResume, updateResume, saveVersion, getVersions, restoreVersion, generateQRCode, trackDownload } from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import TemplateRenderer from '../templates/TemplateRenderer';
import ATSPanel from '../components/resume/ATSPanel';
import AIToolsPanel from '../components/resume/AIToolsPanel';
import {
  SectionWrapper, PersonalInfoSection, DynamicSection,
  SkillsSection, SimpleListSection, CustomSectionsEditor,
} from '../components/resume/SectionEditors';
import { exportToPDF, exportToTXT, exportToDOCX } from '../utils/exportUtils';
import toast from 'react-hot-toast';
import {
  Save, Download, Share2, Eye , Palette, Type,
  QrCode, History, RotateCcw, ChevronLeft, Loader2, Globe, Lock,
} from 'lucide-react';

const FONTS = ['Inter', 'Poppins', 'Georgia', 'Times New Roman', 'Arial', 'Roboto'];
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#1E40AF', '#1F2937'];

const educationFields = [
  { key: 'degree', label: 'Degree', placeholder: 'B.Sc. Computer Science', col: 2 },
  { key: 'field', label: 'Field of Study', placeholder: 'Computer Science' },
  { key: 'institution', label: 'Institution', placeholder: 'MIT' },
  { key: 'start_year', label: 'Start Year', placeholder: '2018' },
  { key: 'end_year', label: 'End Year', placeholder: '2022' },
  { key: 'grade', label: 'Grade/GPA', placeholder: '3.8 / 4.0' },
];

const experienceFields = [
  { key: 'position', label: 'Position', placeholder: 'Software Engineer', col: 2 },
  { key: 'company', label: 'Company', placeholder: 'Google' },
  { key: 'location', label: 'Location', placeholder: 'New York, USA' },
  { key: 'start_date', label: 'Start Date', placeholder: 'Jan 2022' },
  { key: 'end_date', label: 'End Date', placeholder: 'Present' },
  { key: 'description', label: 'Description', placeholder: 'Describe your responsibilities...', col: 2, multiline: true },
];

const projectFields = [
  { key: 'name', label: 'Project Name', placeholder: 'E-Commerce App', col: 2 },
  { key: 'technologies', label: 'Technologies', placeholder: 'React, Node.js, MongoDB', col: 2 },
  { key: 'link', label: 'Project Link', placeholder: 'https://github.com/...' },
  { key: 'date', label: 'Date', placeholder: '2023' },
  { key: 'description', label: 'Description', placeholder: 'Describe the project...', col: 2, multiline: true },
];

const certFields = [
  { key: 'name', label: 'Certificate Name', placeholder: 'AWS Solutions Architect', col: 2 },
  { key: 'issuer', label: 'Issuer', placeholder: 'Amazon Web Services' },
  { key: 'date', label: 'Date', placeholder: 'Dec 2023' },
  { key: 'link', label: 'Credential URL', placeholder: 'https://...' },
];

const internshipFields = [
  { key: 'role', label: 'Role', placeholder: 'Frontend Intern', col: 2 },
  { key: 'company', label: 'Company', placeholder: 'Startup Inc.' },
  { key: 'duration', label: 'Duration', placeholder: 'Jun 2022 – Aug 2022' },
  { key: 'description', label: 'Description', placeholder: 'What you did...', col: 2, multiline: true },
];

const workshopFields = [
  { key: 'name', label: 'Workshop/Training Name', placeholder: 'React Advanced Workshop', col: 2 },
  { key: 'organizer', label: 'Organizer', placeholder: 'Udemy' },
  { key: 'date', label: 'Date', placeholder: 'Mar 2023' },
];

const publicationFields = [
  { key: 'title', label: 'Title', placeholder: 'Research Paper Title', col: 2 },
  { key: 'journal', label: 'Journal/Conference', placeholder: 'IEEE' },
  { key: 'date', label: 'Date', placeholder: '2023' },
  { key: 'link', label: 'Link', placeholder: 'https://...' },
];

const languageFields = [
  { key: 'name', label: 'Language', placeholder: 'English' },
  { key: 'proficiency', label: 'Proficiency', placeholder: 'Native / Fluent / Intermediate' },
];

export default function ResumeBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { resume , updateField, updatePersonalInfo, saving, autoSave, loadResume } = useResume();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('edit');
  const [showExport, setShowExport] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [showStyle, setShowStyle] = useState(false);
  const [versions, setVersions] = useState([]);
  const [qrCode, setQrCode] = useState(null);
  const [exporting, setExporting] = useState(false);
  const previewRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getResume(id);
        loadResume(data.resume);
      } catch {
        toast.error('Failed to load resume');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, loadResume, navigate]);

  const handleChange = useCallback((field, value) => {
    updateField(field, value);
    autoSave(id, { ...resume, [field]: value });
  }, [updateField, autoSave, id, resume]);

  const handlePersonalChange = useCallback((field, value) => {
    updatePersonalInfo(field, value);
    autoSave(id, { ...resume, personal_info: { ...resume.personal_info, [field]: value } });
  }, [updatePersonalInfo, autoSave, id, resume]);

  const handleSave = async () => {
    try {
      await updateResume(id, resume);
      toast.success('Saved!');
    } catch {
      toast.error('Save failed');
    }
  };

  const handleExport = async (type) => {
    setExporting(true);
    try {
      if (type === 'pdf') {
        await exportToPDF('resume-preview', resume.personal_info?.name || 'resume');
        await trackDownload(id);
      } else if (type === 'txt') {
        exportToTXT(resume);
      } else if (type === 'docx') {
        await exportToDOCX(resume);
      }
      toast.success(`Exported as ${type.toUpperCase()}!`);
    } catch {
      toast.error('Export failed');
    } finally {
      setExporting(false);
      setShowExport(false);
    }
  };

  const handleTogglePublic = async () => {
    const newVal = !resume.is_public;
    handleChange('is_public', newVal);
    await updateResume(id, { is_public: newVal });
    toast.success(newVal ? 'Resume is now public!' : 'Resume is now private');
  };

  const handleGetQR = async () => {
    try {
      const { data } = await generateQRCode(id);
      setQrCode(data.qrCode);
    } catch {
      toast.error('Failed to generate QR code');
    }
  };

  const handleSaveVersion = async () => {
    try {
      await saveVersion(id);
      toast.success('Version saved!');
    } catch {
      toast.error('Failed to save version');
    }
  };

  const handleLoadVersions = async () => {
    try {
      const { data } = await getVersions(id);
      setVersions(data.versions);
      setShowVersions(true);
    } catch {
      toast.error('Failed to load versions');
    }
  };

  const handleRestoreVersion = async (versionId) => {
    if (!window.confirm('Restore this version? Current changes will be overwritten.')) return;
    try {
      await restoreVersion(id, versionId);
      const { data } = await getResume(id);
      loadResume(data.resume);
      setShowVersions(false);
      toast.success('Version restored!');
    } catch {
      toast.error('Failed to restore version');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 size={32} className="animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">{resume.title}</h1>
            <p className="text-xs text-gray-500">{saving ? 'Saving...' : 'All changes saved'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Style */}
          <button onClick={() => setShowStyle(!showStyle)} className="btn-secondary flex items-center gap-1.5 text-sm py-1.5 px-3">
            <Palette size={15} /> Style
          </button>

          {/* Versions */}
          <button onClick={handleLoadVersions} className="btn-secondary flex items-center gap-1.5 text-sm py-1.5 px-3">
            <History size={15} /> Versions
          </button>

          {/* Share */}
          <button onClick={() => setShowShare(!showShare)} className="btn-secondary flex items-center gap-1.5 text-sm py-1.5 px-3">
            <Share2 size={15} /> Share
          </button>

          {/* Export */}
          <div className="relative">
            <button onClick={() => setShowExport(!showExport)} className="btn-secondary flex items-center gap-1.5 text-sm py-1.5 px-3">
              <Download size={15} /> Export
            </button>
            {showExport && (
              <div className="absolute right-0 top-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-20 min-w-[140px] py-1">
                {['pdf', 'docx', 'txt'].map((type) => (
                  <button key={type} onClick={() => handleExport(type)} disabled={exporting}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 uppercase font-medium">
                    {exporting ? <Loader2 size={14} className="animate-spin inline mr-2" /> : null}
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Save */}
          <button onClick={handleSave} className="btn-primary flex items-center gap-1.5 text-sm py-1.5 px-3">
            <Save size={15} /> Save
          </button>
        </div>
      </div>

      {/* Style Panel */}
      {showStyle && (
        <div className="card p-4 mb-4 flex flex-wrap gap-6 items-center">
          <div>
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1"><Palette size={13} /> Theme Color</p>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map((c) => (
                <button key={c} onClick={() => handleChange('theme_color', c)}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${resume.theme_color === c ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: c }} />
              ))}
              <input type="color" value={resume.theme_color} onChange={(e) => handleChange('theme_color', e.target.value)}
                className="w-7 h-7 rounded-full cursor-pointer border-0 p-0" title="Custom color" />
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1"><Type size={13} /> Font</p>
            <select value={resume.font_family} onChange={(e) => handleChange('font_family', e.target.value)} className="input-field text-sm py-1.5 w-40">
              {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Resume Title</p>
            <input value={resume.title} onChange={(e) => handleChange('title', e.target.value)} className="input-field text-sm py-1.5 w-48" />
          </div>
        </div>
      )}

      {/* Share Panel */}
      {showShare && (
        <div className="card p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Share Resume</h3>
            <button onClick={handleTogglePublic} className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg font-medium transition-all ${resume.is_public ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>
              {resume.is_public ? <><Globe size={14} /> Public</> : <><Lock size={14} /> Private</>}
            </button>
          </div>
          {resume.is_public && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input readOnly value={`${window.location.origin}/r/${resume.share_token}`} className="input-field text-sm" />
                <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/r/${resume.share_token}`); toast.success('Copied!'); }}
                  className="btn-secondary text-sm px-3 whitespace-nowrap">Copy</button>
              </div>
              <button onClick={handleGetQR} className="btn-secondary flex items-center gap-2 text-sm">
                <QrCode size={15} /> Generate QR Code
              </button>
              {qrCode && <img src={qrCode} alt="QR Code" className="w-32 h-32 border rounded-lg" />}
            </div>
          )}
          {!resume.is_public && <p className="text-sm text-gray-500">Make your resume public to share it with others.</p>}
        </div>
      )}

      {/* Versions Modal */}
      {showVersions && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Version History</h2>
              <button onClick={() => setShowVersions(false)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>
            <button onClick={handleSaveVersion} className="btn-primary w-full mb-4 text-sm flex items-center justify-center gap-2">
              <Save size={15} /> Save Current Version
            </button>
            {versions.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No saved versions yet</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {versions.map((v) => (
                  <div key={v.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Version {v.version_number}</p>
                      <p className="text-xs text-gray-500">{new Date(v.created_at).toLocaleString()}</p>
                    </div>
                    <button onClick={() => handleRestoreVersion(v.id)} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                      <RotateCcw size={12} /> Restore
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex gap-4 h-[calc(100vh-200px)]">
        {/* Editor Panel */}
        <div className="w-full lg:w-[420px] flex-shrink-0 overflow-y-auto space-y-0 pr-1">
          {/* Tabs */}
          <div className="flex gap-1 mb-4 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            {['edit', 'ai', 'ats'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg capitalize transition-all ${activeTab === tab ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
                {tab === 'ai' ? '✨ AI Tools' : tab === 'ats' ? '🎯 ATS' : '✏️ Edit'}
              </button>
            ))}
          </div>

          {activeTab === 'ats' && <ATSPanel resumeId={id} />}
          {activeTab === 'ai' && <AIToolsPanel resume={resume} />}

          {activeTab === 'edit' && (
            <>
              <SectionWrapper title="Personal Info" icon="👤">
                <PersonalInfoSection data={resume.personal_info} onChange={handlePersonalChange} />
              </SectionWrapper>

              <SectionWrapper title="Career Objective" icon="🎯" defaultOpen={false}>
                <textarea value={resume.career_objective || ''} onChange={(e) => handleChange('career_objective', e.target.value)}
                  className="input-field text-sm resize-none w-full" rows={4} placeholder="Write a compelling career objective..." />
              </SectionWrapper>

              <SectionWrapper title="Work Experience" icon="💼" defaultOpen={false}>
                <DynamicSection items={resume.experience} onChange={(v) => handleChange('experience', v)} fields={experienceFields} addLabel="Add Experience" />
              </SectionWrapper>

              <SectionWrapper title="Education" icon="🎓" defaultOpen={false}>
                <DynamicSection items={resume.education} onChange={(v) => handleChange('education', v)} fields={educationFields} addLabel="Add Education" />
              </SectionWrapper>

              <SectionWrapper title="Skills" icon="⚡" defaultOpen={false}>
                <SkillsSection skills={resume.skills} onChange={(v) => handleChange('skills', v)} />
              </SectionWrapper>

              <SectionWrapper title="Projects" icon="🚀" defaultOpen={false}>
                <DynamicSection items={resume.projects} onChange={(v) => handleChange('projects', v)} fields={projectFields} addLabel="Add Project" />
              </SectionWrapper>

              <SectionWrapper title="Certifications" icon="🏆" defaultOpen={false}>
                <DynamicSection items={resume.certifications} onChange={(v) => handleChange('certifications', v)} fields={certFields} addLabel="Add Certification" />
              </SectionWrapper>

              <SectionWrapper title="Internships" icon="🏢" defaultOpen={false}>
                <DynamicSection items={resume.internships} onChange={(v) => handleChange('internships', v)} fields={internshipFields} addLabel="Add Internship" />
              </SectionWrapper>

              <SectionWrapper title="Workshops & Training" icon="📚" defaultOpen={false}>
                <DynamicSection items={resume.workshops} onChange={(v) => handleChange('workshops', v)} fields={workshopFields} addLabel="Add Workshop" />
              </SectionWrapper>

              <SectionWrapper title="Publications" icon="📰" defaultOpen={false}>
                <DynamicSection items={resume.publications} onChange={(v) => handleChange('publications', v)} fields={publicationFields} addLabel="Add Publication" />
              </SectionWrapper>

              <SectionWrapper title="Languages" icon="🌍" defaultOpen={false}>
                <DynamicSection items={resume.languages} onChange={(v) => handleChange('languages', v)} fields={languageFields} addLabel="Add Language" />
              </SectionWrapper>

              <SectionWrapper title="Achievements" icon="⭐" defaultOpen={false}>
                <SimpleListSection items={resume.achievements} onChange={(v) => handleChange('achievements', v)} placeholder="e.g. Won Hackathon 2023" />
              </SectionWrapper>

              <SectionWrapper title="Interests" icon="❤️" defaultOpen={false}>
                <SimpleListSection items={resume.interests} onChange={(v) => handleChange('interests', v)} placeholder="e.g. Open Source, Photography" />
              </SectionWrapper>

              <SectionWrapper title="Custom Sections" icon="➕" defaultOpen={false}>
                <CustomSectionsEditor sections={resume.custom_sections} onChange={(v) => handleChange('custom_sections', v)} />
              </SectionWrapper>
            </>
          )}
        </div>

        {/* Preview Panel */}
        <div className="hidden lg:flex flex-1 flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Live Preview</p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Eye size={13} /> A4 Format
            </div>
          </div>
          <div className="flex-1 overflow-auto bg-gray-200 dark:bg-gray-900 rounded-xl p-4">
            <div id="resume-preview" ref={previewRef}
              className="bg-white shadow-xl mx-auto resume-preview"
              style={{ width: '210mm', minHeight: '297mm', maxWidth: '100%' }}>
              <TemplateRenderer resume={resume} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
