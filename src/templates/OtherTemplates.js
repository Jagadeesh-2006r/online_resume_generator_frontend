import React from 'react';
import { Mail, Phone, MapPin, Link2, GitBranch } from 'lucide-react';

const getName = (item) => (typeof item === 'string' ? item : (item?.name || item?.title || ''));
const getLevel = (item) => (item && typeof item === 'object' ? item.level : null);
const getProficiency = (item) => (item && typeof item === 'object' ? item.proficiency : null);

export function CorporateTemplate({ resume }) {
  const {
    personal_info: p = {}, career_objective,
    education = [], experience = [], skills = [],
    projects = [], certifications = [], achievements = [], languages = [], interests = [],
    theme_color = '#1E40AF', font_family = 'Inter',
  } = resume;

  return (
    <div className="bg-white text-gray-800 min-h-[297mm] w-full" style={{ fontFamily: font_family }}>
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-1/3 min-h-[297mm] p-6 text-white" style={{ backgroundColor: theme_color }}>
          {p.photo && (
            <img src={p.photo} alt="profile"
              className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-white/30" />
          )}
          <h1 className="text-xl font-bold text-center mb-1">{p.name || 'Your Name'}</h1>
          {p.title && <p className="text-sm text-center opacity-80 mb-6">{p.title}</p>}

          <div className="space-y-2 mb-6 text-sm">
            {p.email && <div className="flex items-center gap-2 opacity-90"><Mail size={13} /><span className="break-all">{p.email}</span></div>}
            {p.phone && <div className="flex items-center gap-2 opacity-90"><Phone size={13} /><span>{p.phone}</span></div>}
            {p.location && <div className="flex items-center gap-2 opacity-90"><MapPin size={13} /><span>{p.location}</span></div>}
            {p.linkedin && <div className="flex items-center gap-2 opacity-90"><Link2 size={13} /><span className="break-all">{p.linkedin}</span></div>}
            {p.github && <div className="flex items-center gap-2 opacity-90"><GitBranch size={13} /><span>{p.github}</span></div>}
          </div>

          {skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest opacity-70 mb-3">Skills</h2>
              {skills.map((skill, i) => {
                const name = getName(skill);
                const level = getLevel(skill);
                return (
                  <div key={i} className="mb-2">
                    <div className="flex justify-between text-xs mb-0.5">
                      <span>{name}</span>
                      {level && <span className="opacity-70">{level}%</span>}
                    </div>
                    {level && (
                      <div className="w-full bg-white/20 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-white" style={{ width: `${level}%` }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {languages.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest opacity-70 mb-3">Languages</h2>
              {languages.map((lang, i) => (
                <div key={i} className="flex justify-between text-sm mb-1 opacity-90">
                  <span>{getName(lang)}</span>
                  {getProficiency(lang) && <span className="text-xs opacity-70">{getProficiency(lang)}</span>}
                </div>
              ))}
            </div>
          )}

          {interests.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest opacity-70 mb-3">Interests</h2>
              <div className="flex flex-wrap gap-1">
                {interests.map((interest, i) => (
                  <span key={i} className="text-xs bg-white/20 px-2 py-0.5 rounded">{getName(interest)}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Content */}
        <div className="flex-1 p-6">
          {career_objective && (
            <div className="mb-5">
              <h2 className="text-sm font-bold uppercase tracking-widest mb-2 pb-1 border-b" style={{ color: theme_color, borderColor: theme_color }}>Profile</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{career_objective}</p>
            </div>
          )}

          {experience.length > 0 && (
            <div className="mb-5">
              <h2 className="text-sm font-bold uppercase tracking-widest mb-3 pb-1 border-b" style={{ color: theme_color, borderColor: theme_color }}>Experience</h2>
              {experience.map((exp, i) => (
                <div key={i} className="mb-4 pl-3 border-l-2" style={{ borderColor: theme_color }}>
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                    <span className="text-xs text-gray-400">{exp.start_date} – {exp.end_date || 'Present'}</span>
                  </div>
                  <p className="text-sm font-medium mb-1" style={{ color: theme_color }}>{exp.company}</p>
                  {exp.description && <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>}
                </div>
              ))}
            </div>
          )}

          {education.length > 0 && (
            <div className="mb-5">
              <h2 className="text-sm font-bold uppercase tracking-widest mb-3 pb-1 border-b" style={{ color: theme_color, borderColor: theme_color }}>Education</h2>
              {education.map((edu, i) => (
                <div key={i} className="mb-3 pl-3 border-l-2" style={{ borderColor: theme_color }}>
                  <div className="flex justify-between">
                    <h3 className="font-semibold">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                    <span className="text-xs text-gray-400">{edu.start_year} – {edu.end_year || 'Present'}</span>
                  </div>
                  <p className="text-sm" style={{ color: theme_color }}>{edu.institution}</p>
                  {edu.grade && <p className="text-xs text-gray-400">Grade: {edu.grade}</p>}
                </div>
              ))}
            </div>
          )}

          {projects.length > 0 && (
            <div className="mb-5">
              <h2 className="text-sm font-bold uppercase tracking-widest mb-3 pb-1 border-b" style={{ color: theme_color, borderColor: theme_color }}>Projects</h2>
              {projects.map((proj, i) => (
                <div key={i} className="mb-3">
                  <h3 className="font-semibold">{proj.name}</h3>
                  {proj.technologies && <p className="text-xs text-gray-400 mb-1">{proj.technologies}</p>}
                  {proj.description && <p className="text-sm text-gray-600">{proj.description}</p>}
                </div>
              ))}
            </div>
          )}

          {certifications.length > 0 && (
            <div className="mb-5">
              <h2 className="text-sm font-bold uppercase tracking-widest mb-3 pb-1 border-b" style={{ color: theme_color, borderColor: theme_color }}>Certifications</h2>
              {certifications.map((cert, i) => (
                <div key={i} className="flex justify-between mb-2">
                  <div>
                    <p className="font-medium text-sm">{cert.name}</p>
                    <p className="text-xs text-gray-400">{cert.issuer}</p>
                  </div>
                  <span className="text-xs text-gray-400">{cert.date}</span>
                </div>
              ))}
            </div>
          )}

          {achievements.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest mb-3 pb-1 border-b" style={{ color: theme_color, borderColor: theme_color }}>Achievements</h2>
              <ul className="list-disc list-inside space-y-1">
                {achievements.map((a, i) => <li key={i} className="text-sm text-gray-600">{getName(a)}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function CreativeTemplate({ resume }) {
  const {
    personal_info: p = {}, career_objective,
    education = [], experience = [], skills = [],
    projects = [], certifications = [], achievements = [], languages = [], interests = [],
    theme_color = '#7C3AED', font_family = 'Poppins',
  } = resume;

  return (
    <div className="bg-white text-gray-800 min-h-[297mm] w-full" style={{ fontFamily: font_family }}>
      {/* Creative Header */}
      <div className="relative overflow-hidden p-8 pb-12"
        style={{ background: `linear-gradient(135deg, ${theme_color}, ${theme_color}99)` }}>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 bg-white -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex items-center gap-6">
          {p.photo && (
            <img src={p.photo} alt="profile"
              className="w-28 h-28 rounded-2xl object-cover border-4 border-white/30 flex-shrink-0" />
          )}
          <div className="text-white">
            <h1 className="text-4xl font-bold mb-1">{p.name || 'Your Name'}</h1>
            {p.title && <p className="text-xl opacity-90 mb-3">{p.title}</p>}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm opacity-80">
              {p.email && <span>{p.email}</span>}
              {p.phone && <span>{p.phone}</span>}
              {p.location && <span>{p.location}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 -mt-6">
        <div className="grid grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="col-span-2 space-y-5">
            {career_objective && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h2 className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: theme_color }}>About Me</h2>
                <p className="text-sm text-gray-600 leading-relaxed">{career_objective}</p>
              </div>
            )}

            {experience.length > 0 && (
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: theme_color }}>Experience</h2>
                {experience.map((exp, i) => (
                  <div key={i} className="mb-4 relative pl-4">
                    <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: theme_color }} />
                    <div className="flex justify-between">
                      <h3 className="font-bold">{exp.position}</h3>
                      <span className="text-xs text-gray-400">{exp.start_date} – {exp.end_date || 'Present'}</span>
                    </div>
                    <p className="text-sm font-medium mb-1" style={{ color: theme_color }}>{exp.company}</p>
                    {exp.description && <p className="text-sm text-gray-600">{exp.description}</p>}
                  </div>
                ))}
              </div>
            )}

            {education.length > 0 && (
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: theme_color }}>Education</h2>
                {education.map((edu, i) => (
                  <div key={i} className="mb-3 relative pl-4">
                    <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: theme_color }} />
                    <div className="flex justify-between">
                      <h3 className="font-bold">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                      <span className="text-xs text-gray-400">{edu.start_year} – {edu.end_year || 'Present'}</span>
                    </div>
                    <p className="text-sm" style={{ color: theme_color }}>{edu.institution}</p>
                  </div>
                ))}
              </div>
            )}

            {projects.length > 0 && (
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: theme_color }}>Projects</h2>
                <div className="grid grid-cols-2 gap-3">
                  {projects.map((proj, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-3">
                      <h3 className="font-bold text-sm mb-1">{proj.name}</h3>
                      {proj.technologies && <p className="text-xs text-gray-400 mb-1">{proj.technologies}</p>}
                      {proj.description && <p className="text-xs text-gray-600">{proj.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Side Column */}
          <div className="space-y-5">
            {skills.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h2 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: theme_color }}>Skills</h2>
                {skills.map((skill, i) => {
                  const name = getName(skill);
                  const level = getLevel(skill);
                  return (
                    <div key={i} className="mb-2">
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="font-medium">{name}</span>
                        {level && <span className="text-gray-400">{level}%</span>}
                      </div>
                      {level && (
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full" style={{ width: `${level}%`, backgroundColor: theme_color }} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {certifications.length > 0 && (
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: theme_color }}>Certifications</h2>
                {certifications.map((cert, i) => (
                  <div key={i} className="mb-2 bg-gray-50 rounded-lg p-2">
                    <p className="text-xs font-bold">{cert.name}</p>
                    <p className="text-xs text-gray-400">{cert.issuer} • {cert.date}</p>
                  </div>
                ))}
              </div>
            )}

            {languages.length > 0 && (
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: theme_color }}>Languages</h2>
                {languages.map((lang, i) => (
                  <div key={i} className="flex justify-between text-sm mb-1">
                    <span>{getName(lang)}</span>
                    {getProficiency(lang) && <span className="text-xs text-gray-400">{getProficiency(lang)}</span>}
                  </div>
                ))}
              </div>
            )}

            {achievements.length > 0 && (
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: theme_color }}>Achievements</h2>
                {achievements.map((a, i) => (
                  <div key={i} className="flex items-start gap-2 mb-1">
                    <span style={{ color: theme_color }}>★</span>
                    <p className="text-xs text-gray-600">{getName(a)}</p>
                  </div>
                ))}
              </div>
            )}

            {interests.length > 0 && (
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: theme_color }}>Interests</h2>
                <div className="flex flex-wrap gap-1">
                  {interests.map((interest, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: theme_color }}>
                      {getName(interest)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
