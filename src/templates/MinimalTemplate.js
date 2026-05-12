import React from 'react';
import { Mail, Phone, MapPin, Globe, Link2, GitBranch } from 'lucide-react';

const getName = (item) => (typeof item === 'string' ? item : (item?.name || item?.title || ''));
const getLevel = (item) => (item && typeof item === 'object' ? item.level : null);
const getProficiency = (item) => (item && typeof item === 'object' ? item.proficiency : null);

export default function MinimalTemplate({ resume }) {
  const {
    personal_info: p = {}, career_objective,
    education = [], experience = [], skills = [],
    projects = [], certifications = [], achievements = [], languages = [], interests = [],
     font_family = 'Inter',
  } = resume;

  return (
    <div className="bg-white text-gray-800 min-h-[297mm] w-full p-10" style={{ fontFamily: font_family }}>
      {/* Header */}
      <div className="mb-8 pb-6 border-b-2 border-gray-900">
        <h1 className="text-4xl font-light tracking-tight text-gray-900 mb-1">{p.name || 'Your Name'}</h1>
        {p.title && <p className="text-lg text-gray-500 mb-3">{p.title}</p>}
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-500">
          {p.email && <span className="flex items-center gap-1"><Mail size={13} />{p.email}</span>}
          {p.phone && <span className="flex items-center gap-1"><Phone size={13} />{p.phone}</span>}
          {p.location && <span className="flex items-center gap-1"><MapPin size={13} />{p.location}</span>}
          {p.website && <span className="flex items-center gap-1"><Globe size={13} />{p.website}</span>}
          {p.linkedin && <span className="flex items-center gap-1"><Link2 size={13} />{p.linkedin}</span>}
          {p.github && <span className="flex items-center gap-1"><GitBranch size={13} />{p.github}</span>}
        </div>
      </div>

      {career_objective && (
        <div className="mb-6">
          <p className="text-sm text-gray-600 leading-relaxed">{career_objective}</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="col-span-2 space-y-6">
          {experience.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Experience</h2>
              {experience.map((exp, i) => (
                <div key={i} className="mb-4">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold">{exp.position}</h3>
                    <span className="text-xs text-gray-400">{exp.start_date} – {exp.end_date || 'Present'}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                  {exp.description && <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>}
                </div>
              ))}
            </div>
          )}

          {education.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Education</h2>
              {education.map((edu, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                    <span className="text-xs text-gray-400">{edu.start_year} – {edu.end_year || 'Present'}</span>
                  </div>
                  <p className="text-sm text-gray-500">{edu.institution}</p>
                  {edu.grade && <p className="text-xs text-gray-400">Grade: {edu.grade}</p>}
                </div>
              ))}
            </div>
          )}

          {projects.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Projects</h2>
              {projects.map((proj, i) => (
                <div key={i} className="mb-3">
                  <h3 className="font-semibold">{proj.name}</h3>
                  {proj.technologies && <p className="text-xs text-gray-400 mb-1">{proj.technologies}</p>}
                  {proj.description && <p className="text-sm text-gray-600">{proj.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {skills.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Skills</h2>
              <div className="space-y-2">
                {skills.map((skill, i) => {
                  const name = getName(skill);
                  const level = getLevel(skill);
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="font-medium">{name}</span>
                        {level && <span className="text-gray-400">{level}%</span>}
                      </div>
                      {level && (
                        <div className="w-full bg-gray-100 rounded-full h-1">
                          <div className="h-1 rounded-full bg-gray-800" style={{ width: `${level}%` }} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {certifications.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Certifications</h2>
              {certifications.map((cert, i) => (
                <div key={i} className="mb-2">
                  <p className="text-sm font-medium">{cert.name}</p>
                  <p className="text-xs text-gray-400">{cert.issuer} • {cert.date}</p>
                </div>
              ))}
            </div>
          )}

          {languages.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Languages</h2>
              {languages.map((lang, i) => (
                <div key={i} className="flex justify-between text-sm mb-1">
                  <span>{getName(lang)}</span>
                  {getProficiency(lang) && <span className="text-xs text-gray-400">{getProficiency(lang)}</span>}
                </div>
              ))}
            </div>
          )}

          {interests.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Interests</h2>
              <div className="flex flex-wrap gap-1">
                {interests.map((interest, i) => (
                  <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                    {getName(interest)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {achievements.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Achievements</h2>
              <ul className="space-y-1">
                {achievements.map((a, i) => <li key={i} className="text-xs text-gray-600">• {getName(a)}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
