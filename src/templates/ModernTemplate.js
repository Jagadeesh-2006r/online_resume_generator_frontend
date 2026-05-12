import React from 'react';
import { Mail, Phone, MapPin, Globe, Link2, GitBranch } from 'lucide-react';

// Safe helpers — handle both plain strings and objects from DB
const getName = (item) => (typeof item === 'string' ? item : (item?.name || item?.title || ''));
const getLevel = (item) => (item && typeof item === 'object' ? item.level : null);
const getProficiency = (item) => (item && typeof item === 'object' ? item.proficiency : null);

const Section = ({ title, children, color }) => (
  <div className="mb-5">
    <h2 className="text-sm font-bold uppercase tracking-widest mb-2 pb-1 border-b-2" style={{ color, borderColor: color }}>{title}</h2>
    {children}
  </div>
);

export default function ModernTemplate({ resume }) {
  const {
    personal_info: p = {}, career_objective,
    education = [], experience = [], skills = [],
    projects = [], certifications = [], achievements = [], languages = [], interests = [],
    workshops = [], internships = [], publications = [], custom_sections = [],
    theme_color = '#3B82F6', font_family = 'Inter',
  } = resume;

  return (
    <div className="bg-white text-gray-800 min-h-[297mm] w-full" style={{ fontFamily: font_family }}>
      {/* Header */}
      <div className="p-8 pb-6" style={{ backgroundColor: theme_color }}>
        <div className="flex items-start gap-6">
          {p.photo && <img src={p.photo} alt="profile" className="w-24 h-24 rounded-full object-cover border-4 border-white/30 flex-shrink-0" />}
          <div className="text-white flex-1">
            <h1 className="text-3xl font-bold mb-1">{p.name || 'Your Name'}</h1>
            {p.title && <p className="text-lg opacity-90 mb-3">{p.title}</p>}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm opacity-80">
              {p.email && <span className="flex items-center gap-1"><Mail size={13} />{p.email}</span>}
              {p.phone && <span className="flex items-center gap-1"><Phone size={13} />{p.phone}</span>}
              {p.location && <span className="flex items-center gap-1"><MapPin size={13} />{p.location}</span>}
              {p.website && <span className="flex items-center gap-1"><Globe size={13} />{p.website}</span>}
              {p.linkedin && <span className="flex items-center gap-1"><Link2 size={13} />{p.linkedin}</span>}
              {p.github && <span className="flex items-center gap-1"><GitBranch size={13} />{p.github}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 pt-6">
        {career_objective && (
          <Section title="Career Objective" color={theme_color}>
            <p className="text-sm text-gray-600 leading-relaxed">{career_objective}</p>
          </Section>
        )}

        {experience.length > 0 && (
          <Section title="Work Experience" color={theme_color}>
            {experience.map((exp, i) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                    <p className="text-sm font-medium" style={{ color: theme_color }}>{exp.company}</p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{exp.start_date} – {exp.end_date || 'Present'}</span>
                </div>
                {exp.location && <p className="text-xs text-gray-500">{exp.location}</p>}
                {exp.description && <p className="text-sm text-gray-600 mt-1 leading-relaxed">{exp.description}</p>}
              </div>
            ))}
          </Section>
        )}

        {education.length > 0 && (
          <Section title="Education" color={theme_color}>
            {education.map((edu, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                    <p className="text-sm" style={{ color: theme_color }}>{edu.institution}</p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{edu.start_year} – {edu.end_year || 'Present'}</span>
                </div>
                {edu.grade && <p className="text-xs text-gray-500">Grade: {edu.grade}</p>}
              </div>
            ))}
          </Section>
        )}

        {skills.length > 0 && (
          <Section title="Skills" color={theme_color}>
            <div className="grid grid-cols-2 gap-2">
              {skills.map((skill, i) => {
                const name = getName(skill);
                const level = getLevel(skill);
                return (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="font-medium">{name}</span>
                      {level && <span className="text-gray-500">{level}%</span>}
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
          </Section>
        )}

        {projects.length > 0 && (
          <Section title="Projects" color={theme_color}>
            {projects.map((proj, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-900">{proj.name}</h3>
                  {proj.link && <a href={proj.link} className="text-xs underline" style={{ color: theme_color }}>View</a>}
                </div>
                {proj.technologies && <p className="text-xs text-gray-500 mb-1">Tech: {proj.technologies}</p>}
                {proj.description && <p className="text-sm text-gray-600 leading-relaxed">{proj.description}</p>}
              </div>
            ))}
          </Section>
        )}

        {certifications.length > 0 && (
          <Section title="Certifications" color={theme_color}>
            {certifications.map((cert, i) => (
              <div key={i} className="flex justify-between items-center mb-2">
                <div>
                  <p className="font-medium text-sm">{cert.name}</p>
                  <p className="text-xs text-gray-500">{cert.issuer}</p>
                </div>
                <span className="text-xs text-gray-500">{cert.date}</span>
              </div>
            ))}
          </Section>
        )}

        {achievements.length > 0 && (
          <Section title="Achievements" color={theme_color}>
            <ul className="list-disc list-inside space-y-1">
              {achievements.map((a, i) => <li key={i} className="text-sm text-gray-600">{getName(a)}</li>)}
            </ul>
          </Section>
        )}

        {internships.length > 0 && (
          <Section title="Internships" color={theme_color}>
            {internships.map((intern, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold text-sm">{intern.role}</h3>
                    <p className="text-xs" style={{ color: theme_color }}>{intern.company}</p>
                  </div>
                  <span className="text-xs text-gray-500">{intern.duration}</span>
                </div>
                {intern.description && <p className="text-xs text-gray-600 mt-1">{intern.description}</p>}
              </div>
            ))}
          </Section>
        )}

        {workshops.length > 0 && (
          <Section title="Workshops & Training" color={theme_color}>
            {workshops.map((w, i) => (
              <div key={i} className="flex justify-between mb-1">
                <p className="text-sm font-medium">{w.name}</p>
                <span className="text-xs text-gray-500">{w.date}</span>
              </div>
            ))}
          </Section>
        )}

        {publications.length > 0 && (
          <Section title="Publications" color={theme_color}>
            {publications.map((pub, i) => (
              <div key={i} className="mb-2">
                <p className="font-medium text-sm">{pub.title}</p>
                <p className="text-xs text-gray-500">{pub.journal} • {pub.date}</p>
              </div>
            ))}
          </Section>
        )}

        <div className="grid grid-cols-2 gap-6">
          {languages.length > 0 && (
            <Section title="Languages" color={theme_color}>
              {languages.map((lang, i) => (
                <div key={i} className="flex justify-between text-sm mb-1">
                  <span>{getName(lang)}</span>
                  {getProficiency(lang) && <span className="text-gray-500 text-xs">{getProficiency(lang)}</span>}
                </div>
              ))}
            </Section>
          )}
          {interests.length > 0 && (
            <Section title="Interests" color={theme_color}>
              <div className="flex flex-wrap gap-1.5">
                {interests.map((interest, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: theme_color }}>
                    {getName(interest)}
                  </span>
                ))}
              </div>
            </Section>
          )}
        </div>

        {custom_sections.map((section, i) => section.title && (
          <Section key={i} title={section.title} color={theme_color}>
            <p className="text-sm text-gray-600">{section.content}</p>
          </Section>
        ))}
      </div>
    </div>
  );
}
