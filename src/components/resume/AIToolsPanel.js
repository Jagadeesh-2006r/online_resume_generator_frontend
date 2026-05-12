import React, { useState } from 'react';
import { generateSummary, generateSkillSuggestions, generateInterviewQuestions, generateProjectDescription } from '../../services/api';
import { Sparkles, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

function AITool({ title, onGenerate, result, loading, children }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(typeof result === 'string' ? result : result?.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden mb-3">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50">
        <span className="text-sm font-medium">{title}</span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && (
        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          {children}
          <button onClick={onGenerate} disabled={loading} className="btn-primary text-xs py-1.5 px-3 mt-2 w-full">
            {loading ? 'Generating...' : '✨ Generate'}
          </button>
          {result && (
            <div className="mt-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 relative">
              <button onClick={copy} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
              </button>
              {typeof result === 'string' ? (
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed pr-6">{result}</p>
              ) : (
                <ul className="space-y-1">
                  {result.map((item, i) => <li key={i} className="text-xs text-gray-700 dark:text-gray-300">• {item}</li>)}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AIToolsPanel({ resume }) {
  const [summaryResult, setSummaryResult] = useState('');
  const [skillsResult, setSkillsResult] = useState([]);
  const [questionsResult, setQuestionsResult] = useState([]);
  const [projDescResult, setProjDescResult] = useState('');
  const [projName, setProjName] = useState('');
  const [projTech, setProjTech] = useState('');
  const [loading, setLoading] = useState({});

  const run = async (key, fn, setter) => {
    setLoading((p) => ({ ...p, [key]: true }));
    try {
      const { data } = await fn();
      setter(data[key] || data.summary || data.suggestions || data.questions || data.description);
    } catch { toast.error('AI generation failed'); }
    finally { setLoading((p) => ({ ...p, [key]: false })); }
  };

  return (
    <div className="card p-4">
      <h3 className="font-semibold flex items-center gap-2 mb-3">
        <Sparkles size={18} className="text-purple-600" /> AI Tools
      </h3>

      <AITool title="Generate Career Summary" loading={loading.summary} result={summaryResult}
        onGenerate={() => run('summary', () => generateSummary({
          name: resume.personal_info?.name,
          role: resume.personal_info?.title,
          experience: resume.experience,
          skills: resume.skills,
          education: resume.education,
        }), setSummaryResult)}>
        <p className="text-xs text-gray-500">Auto-generate a professional career summary based on your resume data.</p>
      </AITool>

      <AITool title="Skill Suggestions" loading={loading.skills} result={skillsResult}
        onGenerate={() => run('skills', () => generateSkillSuggestions({
          role: resume.personal_info?.title,
          currentSkills: resume.skills,
        }), setSkillsResult)}>
        <p className="text-xs text-gray-500">Get skill suggestions based on your job role.</p>
      </AITool>

      <AITool title="Interview Questions" loading={loading.questions} result={questionsResult}
        onGenerate={() => run('questions', () => generateInterviewQuestions({
          skills: resume.skills,
          role: resume.personal_info?.title,
        }), setQuestionsResult)}>
        <p className="text-xs text-gray-500">Generate interview questions based on your skills.</p>
      </AITool>

      <AITool title="Project Description" loading={loading.description} result={projDescResult}
        onGenerate={() => run('description', () => generateProjectDescription({
          projectName: projName,
          technologies: projTech,
          role: resume.personal_info?.title,
        }), setProjDescResult)}>
        <div className="space-y-2">
          <input value={projName} onChange={(e) => setProjName(e.target.value)}
            className="input-field text-xs" placeholder="Project name" />
          <input value={projTech} onChange={(e) => setProjTech(e.target.value)}
            className="input-field text-xs" placeholder="Technologies (e.g. React, Node.js)" />
        </div>
      </AITool>
    </div>
  );
}
