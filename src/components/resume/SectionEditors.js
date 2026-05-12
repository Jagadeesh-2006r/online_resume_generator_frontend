import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Mic, MicOff } from 'lucide-react';

// Generic collapsible section wrapper
export function SectionWrapper({ title, icon, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="card mb-4">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 text-left">
        <div className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
          <span>{icon}</span> {title}
        </div>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

// Voice input hook
export function useVoiceInput(onResult) {
  const [listening, setListening] = useState(false);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice input not supported in this browser');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (e) => onResult(e.results[0][0].transcript);
    recognition.start();
  };

  return { listening, startListening };
}

export function VoiceButton({ onResult }) {
  const { listening, startListening } = useVoiceInput(onResult);
  return (
    <button type="button" onClick={startListening} title="Voice input"
      className={`p-1.5 rounded-lg transition-colors ${listening ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'}`}>
      {listening ? <MicOff size={16} /> : <Mic size={16} />}
    </button>
  );
}

// Personal Info Section
export function PersonalInfoSection({ data, onChange }) {
  const fields = [
    { key: 'name', label: 'Full Name', placeholder: 'John Doe', col: 2 },
    { key: 'title', label: 'Job Title', placeholder: 'Software Engineer', col: 2 },
    { key: 'email', label: 'Email', placeholder: 'john@example.com', type: 'email' },
    { key: 'phone', label: 'Phone', placeholder: '+1 234 567 8900' },
    { key: 'location', label: 'Location', placeholder: 'New York, USA' },
    { key: 'website', label: 'Website', placeholder: 'https://yoursite.com' },
    { key: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/username' },
    { key: 'github', label: 'GitHub', placeholder: 'github.com/username' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {fields.map(({ key, label, placeholder, type, col }) => (
        <div key={key} className={col === 2 ? 'col-span-2' : ''}>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</label>
          <div className="flex gap-1">
            <input type={type || 'text'} value={data[key] || ''} onChange={(e) => onChange(key, e.target.value)}
              className="input-field text-sm" placeholder={placeholder} />
            <VoiceButton onResult={(text) => onChange(key, text)} />
          </div>
        </div>
      ))}
    </div>
  );
}

// Dynamic list section (education, experience, etc.)
export function DynamicSection({ items, onChange, fields, addLabel }) {
  // Ensure items is always an array of objects
  const safeItems = (items || []).map((item) =>
    typeof item === 'object' && item !== null ? item : {}
  );

  const addItem = () => {
    const newItem = fields.reduce((acc, f) => ({ ...acc, [f.key]: '' }), {});
    onChange([...safeItems, newItem]);
  };

  const removeItem = (idx) => onChange(safeItems.filter((_, i) => i !== idx));

  const updateItem = (idx, key, value) => {
    const updated = [...safeItems];
    updated[idx] = { ...updated[idx], [key]: value };
    onChange(updated);
  };

  return (
    <div>
      {safeItems.map((item, idx) => (
        <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-3 relative">
          <button onClick={() => removeItem(idx)} className="absolute top-3 right-3 text-red-400 hover:text-red-600 p-1">
            <Trash2 size={15} />
          </button>
          <div className="grid grid-cols-2 gap-3 pr-6">
            {fields.map(({ key, label, placeholder, type, col, multiline }) => (
              <div key={key} className={col === 2 ? 'col-span-2' : ''}>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</label>
                <div className="flex gap-1">
                  {multiline ? (
                    <textarea value={item[key] || ''} onChange={(e) => updateItem(idx, key, e.target.value)}
                      className="input-field text-sm resize-none" rows={3} placeholder={placeholder} />
                  ) : (
                    <input type={type || 'text'} value={item[key] || ''} onChange={(e) => updateItem(idx, key, e.target.value)}
                      className="input-field text-sm" placeholder={placeholder} />
                  )}
                  {!multiline && <VoiceButton onResult={(text) => updateItem(idx, key, text)} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <button onClick={addItem} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium mt-2">
        <Plus size={16} /> {addLabel}
      </button>
    </div>
  );
}

// Normalize a skill entry — handles both string and object formats
const normalizeSkill = (skill) =>
  typeof skill === 'string' ? { name: skill, level: 80, category: '' } : { name: '', level: 80, category: '', ...skill };

// Skills Section with progress bars
export function SkillsSection({ skills, onChange }) {
  // Normalize all incoming skills so they are always objects
  const normalized = (skills || []).map(normalizeSkill);

  const addSkill = () => onChange([...normalized, { name: '', level: 80, category: '' }]);
  const removeSkill = (idx) => onChange(normalized.filter((_, i) => i !== idx));
  const updateSkill = (idx, key, value) => {
    const updated = [...normalized];
    updated[idx] = { ...updated[idx], [key]: value };
    onChange(updated);
  };

  return (
    <div>
      {normalized.map((skill, idx) => (
        <div key={idx} className="flex items-center gap-3 mb-3">
          <div className="flex-1">
            <div className="flex gap-2 mb-1">
              <input value={skill.name || ''} onChange={(e) => updateSkill(idx, 'name', e.target.value)}
                className="input-field text-sm flex-1" placeholder="Skill name (e.g. React.js)" />
              <input value={skill.category || ''} onChange={(e) => updateSkill(idx, 'category', e.target.value)}
                className="input-field text-sm w-28" placeholder="Category" />
            </div>
            <div className="flex items-center gap-2">
              <input type="range" min="10" max="100" step="5" value={skill.level || 80}
                onChange={(e) => updateSkill(idx, 'level', parseInt(e.target.value))}
                className="flex-1 accent-blue-600" />
              <span className="text-xs text-gray-500 w-8">{skill.level || 80}%</span>
            </div>
          </div>
          <button onClick={() => removeSkill(idx)} className="text-red-400 hover:text-red-600 p-1 flex-shrink-0">
            <Trash2 size={15} />
          </button>
        </div>
      ))}
      <button onClick={addSkill} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium mt-2">
        <Plus size={16} /> Add Skill
      </button>
    </div>
  );
}

// Normalize a simple list item — handles both string and object formats
const normalizeItem = (item) => {
  if (typeof item === 'string') return { name: item };
  if (item && typeof item === 'object') return { name: item.name || item.title || '' };
  return { name: '' };
};

// Simple list section (interests, achievements)
export function SimpleListSection({ items, onChange, placeholder }) {
  const normalized = (items || []).map(normalizeItem);

  const addItem = () => onChange([...normalized, { name: '' }]);
  const removeItem = (idx) => onChange(normalized.filter((_, i) => i !== idx));
  const updateItem = (idx, value) => {
    const updated = [...normalized];
    updated[idx] = { name: value };
    onChange(updated);
  };

  return (
    <div>
      {normalized.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2 mb-2">
          <input value={item.name || ''} onChange={(e) => updateItem(idx, e.target.value)}
            className="input-field text-sm flex-1" placeholder={placeholder} />
          <button onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-600 p-1">
            <Trash2 size={15} />
          </button>
        </div>
      ))}
      <button onClick={addItem} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium mt-2">
        <Plus size={16} /> Add Item
      </button>
    </div>
  );
}

// Custom Sections
export function CustomSectionsEditor({ sections, onChange }) {
  const addSection = () => onChange([...sections, { title: '', content: '' }]);
  const removeSection = (idx) => onChange(sections.filter((_, i) => i !== idx));
  const updateSection = (idx, key, value) => {
    const updated = [...sections];
    updated[idx] = { ...updated[idx], [key]: value };
    onChange(updated);
  };

  return (
    <div>
      {sections.map((section, idx) => (
        <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-3">
          <div className="flex justify-between mb-2">
            <input value={section.title || ''} onChange={(e) => updateSection(idx, 'title', e.target.value)}
              className="input-field text-sm font-medium flex-1 mr-2" placeholder="Section Title" />
            <button onClick={() => removeSection(idx)} className="text-red-400 hover:text-red-600 p-1">
              <Trash2 size={15} />
            </button>
          </div>
          <textarea value={section.content || ''} onChange={(e) => updateSection(idx, 'content', e.target.value)}
            className="input-field text-sm resize-none w-full" rows={3} placeholder="Section content..." />
        </div>
      ))}
      <button onClick={addSection} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
        <Plus size={16} /> Add Custom Section
      </button>
    </div>
  );
}
