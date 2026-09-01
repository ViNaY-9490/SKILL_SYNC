'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Bell, Shield, Moon, Save, Check, Upload, Github, Linkedin } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { ThemeToggle } from '@/components/theme-toggle';

export default function SettingsPage() {
  const { user, updateProfile } = useAuthStore();
  const [saved, setSaved] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || 'Vinay');
  const [lastName, setLastName] = useState(user?.lastName || 'Kumar Reddy');
  const [githubUrl, setGithubUrl] = useState(user?.githubUrl || 'https://github.com/ViNaY-9490');
  const [linkedinUrl, setLinkedinUrl] = useState(user?.linkedinUrl || 'https://www.linkedin.com/in/n-vinay-kumar-reddy/');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');

  const [emailNotifs, setEmailNotifs] = useState(true);
  const [matchAlerts, setMatchAlerts] = useState(true);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarUrl(result);
        updateProfile({ avatarUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      firstName,
      lastName,
      githubUrl,
      linkedinUrl,
      avatarUrl,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1
          className="text-h2 tracking-tight text-[var(--text-primary)]"
        >
          Account Settings
        </h1>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5">
          Manage your profile picture, personal credentials, and system preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Picture Upload & Personal Info */}
        <div
          className="p-6 rounded-xl border surface-card bg-[var(--surface-paper)] border-[var(--border-warm)]"
        >
          <div className="flex items-center gap-3 mb-6">
            <User className="w-5 h-5 text-[var(--primary-dark)]" />
            <h2 className="text-sm font-bold text-[var(--text-primary)]">
              Personal Information & Profile Picture
            </h2>
          </div>

          {/* Profile Picture Preview & Upload */}
          <div className="flex items-center gap-5 mb-6 pb-6 border-b border-[var(--border-warm)]">
            <div className="relative">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile Avatar"
                  className="w-16 h-16 rounded-xl object-cover border-2 border-[var(--primary-dark)] shadow-sm"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-[var(--primary-dark)] text-[var(--text-inverse)] font-bold text-xl flex items-center justify-center border border-[var(--border-warm)] shadow-sm">
                  {firstName.charAt(0)}{lastName.charAt(0)}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="avatar-upload"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--primary-dark)] text-[var(--text-inverse)] text-xs font-semibold hover:bg-[var(--primary-green)] transition-colors cursor-pointer shadow-sm"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload New Profile Picture
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <p className="text-[11px] text-[var(--text-tertiary)] mt-1">
                JPG, PNG, or GIF up to 5MB. Photo updates live across your dashboard.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg text-xs bg-[var(--surface-bg)] border border-[var(--border-warm)] text-[var(--text-primary)] outline-none focus:border-[var(--primary-dark)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg text-xs bg-[var(--surface-bg)] border border-[var(--border-warm)] text-[var(--text-primary)] outline-none focus:border-[var(--primary-dark)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1 flex items-center gap-1">
                <Github className="w-3.5 h-3.5 text-[var(--primary-dark)]" />
                GitHub Profile URL
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg text-xs bg-[var(--surface-bg)] border border-[var(--border-warm)] text-[var(--text-primary)] outline-none focus:border-[var(--primary-dark)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1 flex items-center gap-1">
                <Linkedin className="w-3.5 h-3.5 text-[var(--primary-dark)]" />
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg text-xs bg-[var(--surface-bg)] border border-[var(--border-warm)] text-[var(--text-primary)] outline-none focus:border-[var(--primary-dark)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-tertiary)] mb-1">
                Institutional Email Address
              </label>
              <input
                type="email"
                disabled
                value={user?.email || 'student@skillsync.local'}
                className="w-full px-3.5 py-2.5 rounded-lg text-xs bg-[var(--surface-bg)] border border-[var(--border-warm)] text-[var(--text-tertiary)] cursor-not-allowed opacity-75"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-tertiary)] mb-1">
                Account Role
              </label>
              <input
                type="text"
                disabled
                value={user?.role || 'STUDENT'}
                className="w-full px-3.5 py-2.5 rounded-lg text-xs bg-[var(--surface-bg)] border border-[var(--border-warm)] text-[var(--primary-dark)] font-bold cursor-not-allowed opacity-75"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div
          className="p-6 rounded-2xl border"
          style={{ background: 'var(--surface-0)', borderColor: 'var(--border-subtle)' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5" style={{ color: 'var(--brand)' }} />
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Notification Preferences
            </h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl border" style={{ borderColor: 'var(--border-subtle)' }}>
              <div>
                <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Opportunity Match Alerts</div>
                <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Receive instant notifications when new high-match opportunities are posted</div>
              </div>
              <input
                type="checkbox"
                checked={matchAlerts}
                onChange={(e) => setMatchAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl border" style={{ borderColor: 'var(--border-subtle)' }}>
              <div>
                <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Email Digest & Reminders</div>
                <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Weekly skill gap summary and application status updates</div>
              </div>
              <input
                type="checkbox"
                checked={emailNotifs}
                onChange={(e) => setEmailNotifs(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </label>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-end gap-3">
          {saved && (
            <span className="text-sm font-semibold flex items-center gap-1 text-emerald-600">
              <Check className="w-4 h-4" /> Settings saved successfully
            </span>
          )}
          <button
            type="submit"
            className="flex items-center gap-2 py-2.5 px-6 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 shadow-md"
            style={{ background: 'var(--brand)' }}
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
