import React from 'react';
import ModernTemplate from './ModernTemplate';
import MinimalTemplate from './MinimalTemplate';
import { CorporateTemplate, CreativeTemplate } from './OtherTemplates';

export default function TemplateRenderer({ resume }) {
  const slug = resume?.template_slug || 'modern';

  switch (slug) {
    case 'minimal': return <MinimalTemplate resume={resume} />;
    case 'corporate': return <CorporateTemplate resume={resume} />;
    case 'creative': return <CreativeTemplate resume={resume} />;
    default: return <ModernTemplate resume={resume} />;
  }
}
