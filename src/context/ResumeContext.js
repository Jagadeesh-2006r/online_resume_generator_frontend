import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { updateResume } from '../services/api';
import toast from 'react-hot-toast';

const ResumeContext = createContext();

export const defaultResume = {
  title: 'My Resume',
  template_id: null,
  theme_color: '#3B82F6',
  font_family: 'Inter',
  language: 'en',
  is_public: false,
  personal_info: { name: '', email: '', phone: '', location: '', website: '', linkedin: '', github: '', summary: '' },
  career_objective: '',
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications: [],
  achievements: [],
  languages: [],
  interests: [],
  workshops: [],
  internships: [],
  publications: [],
  custom_sections: [],
  section_order: ['personal_info', 'career_objective', 'experience', 'education', 'skills', 'projects', 'certifications', 'achievements', 'languages', 'interests'],
};

export const ResumeProvider = ({ children }) => {
  const [resume, setResume] = useState(defaultResume);
  const [saving, setSaving] = useState(false);
  const autoSaveTimer = useRef(null);

  const updateField = useCallback((field, value) => {
    setResume((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updatePersonalInfo = useCallback((field, value) => {
    setResume((prev) => ({
      ...prev,
      personal_info: { ...prev.personal_info, [field]: value },
    }));
  }, []);

  const autoSave = useCallback(async (resumeId, data) => {
    if (!resumeId) return;
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(async () => {
      setSaving(true);
      try {
        await updateResume(resumeId, data);
      } catch (err) {
        console.error('Auto-save failed:', err.message);
      } finally {
        setSaving(false);
      }
    }, 1500);
  }, []);

  // Ensure all array fields are actually arrays when loading from DB
  const safeArrayFields = ['education','experience','skills','projects','certifications',
    'achievements','languages','interests','workshops','internships','publications','custom_sections','section_order'];

  const loadResume = useCallback((data) => {
    const safe = { ...defaultResume, ...data };
    safeArrayFields.forEach((field) => {
      if (!Array.isArray(safe[field])) {
        try { safe[field] = JSON.parse(safe[field]) || []; } catch { safe[field] = []; }
      }
    });
    if (!safe.personal_info || typeof safe.personal_info !== 'object') {
      try { safe.personal_info = JSON.parse(safe.personal_info) || {}; } catch { safe.personal_info = {}; }
    }
    setResume(safe);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ResumeContext.Provider value={{ resume, setResume, updateField, updatePersonalInfo, autoSave, saving, loadResume }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => useContext(ResumeContext);
