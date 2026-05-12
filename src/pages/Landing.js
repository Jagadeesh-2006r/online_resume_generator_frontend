import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Zap, Shield, Download, Star, ChevronRight, Check } from 'lucide-react';

const features = [
  { icon: Zap, title: 'AI-Powered', desc: 'Auto-generate summaries, skills & project descriptions' },
  { icon: Shield, title: 'ATS Optimized', desc: 'Real-time ATS score with improvement suggestions' },
  { icon: Download, title: 'Export Anywhere', desc: 'Download as PDF, DOCX, or share online' },
  { icon: Star, title: '4 Pro Templates', desc: 'Modern, Minimal, Corporate & Creative designs' },
];

const plans = [
  { name: 'Free', price: '$0', features: ['3 Resumes', '2 Templates', 'PDF Export', 'ATS Score'] },
  { name: 'Pro', price: '$9/mo', features: ['Unlimited Resumes', 'All Templates', 'All Exports', 'AI Features', 'Analytics', 'QR Code'], popular: true },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center">
            <FileText size={20} />
          </div>
          <span className="text-xl font-bold">ResumeAI</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="px-4 py-2 text-gray-300 hover:text-white transition-colors">Login</Link>
          <Link to="/register" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors">Get Started Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center px-6 py-20 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 rounded-full px-4 py-1.5 text-sm text-blue-300 mb-6">
          <Zap size={14} /> AI-Powered Resume Builder
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent leading-tight">
          Build Your Dream Resume in Minutes
        </h1>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Create ATS-optimized resumes with AI assistance, beautiful templates, real-time preview, and one-click PDF export.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register" className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-lg transition-all hover:scale-105">
            Start Building Free <ChevronRight size={20} />
          </Link>
          <Link to="/login" className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-semibold text-lg transition-all">
            View Demo
          </Link>
        </div>
        <p className="text-gray-500 text-sm mt-4">No credit card required • Free forever plan</p>
      </section>

      {/* Features */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Everything You Need</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                <Icon size={24} className="text-blue-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <p className="text-gray-400 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Templates Preview */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">Professional Templates</h2>
        <p className="text-gray-400 text-center mb-12">Choose from 4 professionally designed templates</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Modern', 'Minimal', 'Corporate', 'Creative'].map((t, i) => (
            <div key={t} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all cursor-pointer group">
              <div className={`h-40 flex items-center justify-center text-4xl ${['bg-blue-500/20', 'bg-gray-500/20', 'bg-green-500/20', 'bg-purple-500/20'][i]}`}>
                📄
              </div>
              <div className="p-3 text-center">
                <p className="font-medium">{t}</p>
                <p className="text-xs text-gray-500">Free</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Simple Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div key={plan.name} className={`rounded-2xl p-8 border ${plan.popular ? 'bg-blue-600 border-blue-500' : 'bg-white/5 border-white/10'}`}>
              {plan.popular && <div className="text-xs font-bold bg-yellow-400 text-yellow-900 rounded-full px-3 py-1 inline-block mb-4">MOST POPULAR</div>}
              <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
              <p className="text-4xl font-extrabold mb-6">{plan.price}</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check size={16} className="text-green-400 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/register" className={`block text-center py-3 rounded-xl font-semibold transition-all ${plan.popular ? 'bg-white text-blue-600 hover:bg-gray-100' : 'bg-blue-600 hover:bg-blue-500'}`}>
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8 text-center text-gray-500 text-sm">
        <p>© 2024 ResumeAI. Built with ❤️ using PERN Stack.</p>
      </footer>
    </div>
  );
}
