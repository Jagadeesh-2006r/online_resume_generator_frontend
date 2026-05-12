import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile, uploadAvatar, getUserBadges } from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import toast from 'react-hot-toast';
import { User, Camera, Save, Loader2 } from 'lucide-react';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: '', phone: '', location: '', website: '', linkedin: '', github: '', portfolio: '', bio: '',
  });
  const [badges, setBadges] = useState([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        phone: user.phone || '',
        location: user.location || '',
        website: user.website || '',
        linkedin: user.linkedin || '',
        github: user.github || '',
        portfolio: user.portfolio || '',
        bio: user.bio || '',
      });
    }
    getUserBadges().then(({ data }) => setBadges(data.badges)).catch(() => {});
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await updateProfile(form);
      setUser((prev) => ({ ...prev, ...data.user }));
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);
    setUploading(true);
    try {
      const { data } = await uploadAvatar(formData);
      setUser((prev) => ({ ...prev, avatar: data.avatar }));
      toast.success('Avatar updated!');
    } catch {
      toast.error('Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  const fields = [
    { key: 'name', label: 'Full Name', placeholder: 'John Doe' },
    { key: 'phone', label: 'Phone', placeholder: '+1 234 567 8900' },
    { key: 'location', label: 'Location', placeholder: 'New York, USA' },
    { key: 'website', label: 'Website', placeholder: 'https://yoursite.com' },
    { key: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/username' },
    { key: 'github', label: 'GitHub', placeholder: 'github.com/username' },
    { key: 'portfolio', label: 'Portfolio', placeholder: 'https://portfolio.com' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Profile Settings</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Avatar Card */}
          <div className="card p-6 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <img
                src={user?.avatar ? `http://localhost:5000${user.avatar}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=3B82F6&color=fff&size=128`}
                alt="avatar" className="w-28 h-28 rounded-full object-cover border-4 border-blue-100 dark:border-blue-900"
              />
              <label className="absolute bottom-0 right-0 w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                {uploading ? <Loader2 size={16} className="text-white animate-spin" /> : <Camera size={16} className="text-white" />}
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={uploading} />
              </label>
            </div>
            <h2 className="font-bold text-gray-900 dark:text-white">{user?.name}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className={`mt-2 text-xs px-2 py-0.5 rounded-full font-medium ${user?.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
              {user?.role}
            </span>

            {/* Badges */}
            {badges.length > 0 && (
              <div className="mt-6 w-full">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Badges</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {badges.map((badge) => (
                    <div key={badge.id} title={badge.description} className="flex flex-col items-center gap-1 cursor-help">
                      <span className="text-2xl">{badge.icon}</span>
                      <span className="text-xs text-gray-500">{badge.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Form Card */}
          <div className="card p-6 lg:col-span-2">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <User size={18} /> Personal Information
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fields.map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
                    <input value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className="input-field" placeholder={placeholder} />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="input-field resize-none" rows={3} placeholder="Tell us about yourself..." />
              </div>
              <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
