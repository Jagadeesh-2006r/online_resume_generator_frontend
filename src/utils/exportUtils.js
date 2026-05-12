import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';

export const exportToPDF = async (elementId, filename = 'resume') => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
  const imgX = (pdfWidth - imgWidth * ratio) / 2;

  let heightLeft = imgHeight * ratio;
  let position = 0;

  pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, imgHeight * ratio);
  heightLeft -= pdfHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight * ratio;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, imgHeight * ratio);
    heightLeft -= pdfHeight;
  }

  pdf.save(`${filename}.pdf`);
};

export const exportToTXT = (resume) => {
  const { personal_info: p = {},education = [], career_objective , experience = [], skills = [], projects = [] } = resume;
  let text = '';

  if (p.name) text += `${p.name}\n`;
  if (p.title) text += `${p.title}\n`;
  if (p.email) text += `Email: ${p.email}\n`;
  if (p.phone) text += `Phone: ${p.phone}\n`;
  if (p.location) text += `Location: ${p.location}\n`;
  text += '\n';

  if (career_objective) text += `CAREER OBJECTIVE\n${career_objective}\n\n`;

  if (experience.length > 0) {
    text += 'WORK EXPERIENCE\n';
    experience.forEach((exp) => {
      text += `${exp.position} at ${exp.company} (${exp.start_date} - ${exp.end_date || 'Present'})\n`;
      if (exp.description) text += `${exp.description}\n`;
      text += '\n';
    });
  }

  if (education.length > 0) {
    text += 'EDUCATION\n';
    education.forEach((edu) => {
      text += `${edu.degree} in ${edu.field} - ${edu.institution} (${edu.start_year} - ${edu.end_year || 'Present'})\n`;
    });
    text += '\n';
  }

  if (skills.length > 0) {
    text += 'SKILLS\n';
    text += skills.map((s) => s.name || s).join(', ') + '\n\n';
  }

  if (projects.length > 0) {
    text += 'PROJECTS\n';
    projects.forEach((proj) => {
      text += `${proj.name}\n`;
      if (proj.description) text += `${proj.description}\n`;
      text += '\n';
    });
  }

  const blob = new Blob([text], { type: 'text/plain' });
  saveAs(blob, `${p.name || 'resume'}.txt`);
};

export const exportToDOCX = async (resume) => {
  const { personal_info: p = {}, career_objective, education = [], experience = [], skills = [] } = resume;

  const children = [
    new Paragraph({ text: p.name || 'Your Name', heading: HeadingLevel.HEADING_1 }),
    p.title && new Paragraph({ text: p.title }),
    p.email && new Paragraph({ children: [new TextRun(`Email: ${p.email}`)] }),
    p.phone && new Paragraph({ children: [new TextRun(`Phone: ${p.phone}`)] }),
    new Paragraph({ text: '' }),
  ].filter(Boolean);

  if (career_objective) {
    children.push(new Paragraph({ text: 'CAREER OBJECTIVE', heading: HeadingLevel.HEADING_2 }));
    children.push(new Paragraph({ text: career_objective }));
    children.push(new Paragraph({ text: '' }));
  }

  if (experience.length > 0) {
    children.push(new Paragraph({ text: 'WORK EXPERIENCE', heading: HeadingLevel.HEADING_2 }));
    experience.forEach((exp) => {
      children.push(new Paragraph({ children: [new TextRun({ text: `${exp.position} at ${exp.company}`, bold: true })] }));
      children.push(new Paragraph({ text: `${exp.start_date} - ${exp.end_date || 'Present'}` }));
      if (exp.description) children.push(new Paragraph({ text: exp.description }));
      children.push(new Paragraph({ text: '' }));
    });
  }

  if (skills.length > 0) {
    children.push(new Paragraph({ text: 'SKILLS', heading: HeadingLevel.HEADING_2 }));
    children.push(new Paragraph({ text: skills.map((s) => s.name || s).join(', ') }));
  }

  const doc = new Document({ sections: [{ properties: {}, children }] });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${p.name || 'resume'}.docx`);
};
