'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  CheckCircle2,
  Briefcase,
  Award,
  Zap,
  BookOpen,
  Users,
  Trash2,
  Check,
} from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'OPPORTUNITY' | 'ASSESSMENT' | 'MENTORSHIP' | 'SKILL_GAP';
  timestamp: string;
  isRead: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Shortlisted for Interview!',
    message: 'NovaStack Technologies has shortlisted your application for Backend Development Intern.',
    type: 'OPPORTUNITY',
    timestamp: '10 mins ago',
    isRead: false,
  },
  {
    id: 'n2',
    title: 'Assessment Verified Badge Earned',
    message: 'Congratulations! You passed Python Fundamentals Assessment with 90% score. Verified badge added to your portfolio.',
    type: 'ASSESSMENT',
    timestamp: '2 hours ago',
    isRead: false,
  },
  {
    id: 'n3',
    title: 'Mentorship Request Confirmed',
    message: 'Dr. Suresh Menon confirmed your 1:1 mentorship session for tomorrow at 4:00 PM.',
    type: 'MENTORSHIP',
    timestamp: '1 day ago',
    isRead: true,
  },
  {
    id: 'n4',
    title: 'Skill Gap Priority Alert',
    message: 'Target role ML Engineer requires PyTorch proficiency. Recommended course added to your Learning Plan.',
    type: 'SKILL_GAP',
    timestamp: '2 days ago',
    isRead: true,
  },
];

export default function NotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const markAllAsRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const toggleRead = (id: string) => {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n)),
    );
  };

  const deleteNotification = (id: string) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadCount = items.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Bell className="w-6 h-6 text-indigo-600" />
            Notifications & System Alerts
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Stay updated with your opportunity applications, skill assessments & mentorship requests.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-all"
          >
            <Check className="w-3.5 h-3.5" /> Mark All as Read
          </button>
        )}
      </div>

      {/* Notifications List */}
      {items.length > 0 ? (
        <div className="space-y-3">
          <AnimatePresence>
            {items.map((item) => {
              const iconMap: Record<string, any> = {
                OPPORTUNITY: Briefcase,
                ASSESSMENT: Award,
                MENTORSHIP: Users,
                SKILL_GAP: Zap,
              };
              const Icon = iconMap[item.type] || Bell;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`card p-4 flex items-start justify-between gap-4 border-l-4 transition-all ${
                    item.isRead
                      ? 'border-transparent opacity-80'
                      : 'border-indigo-600 bg-indigo-50/30 dark:bg-indigo-950/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold ${
                        item.type === 'OPPORTUNITY'
                          ? 'bg-emerald-600'
                          : item.type === 'ASSESSMENT'
                          ? 'bg-amber-500'
                          : item.type === 'MENTORSHIP'
                          ? 'bg-purple-600'
                          : 'bg-indigo-600'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                          {item.title}
                        </h3>
                        {!item.isRead && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                        {item.message}
                      </p>
                      <span className="text-[11px] text-slate-400 mt-1 block font-medium">
                        {item.timestamp}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleRead(item.id)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                      title={item.isRead ? 'Mark as Unread' : 'Mark as Read'}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteNotification(item.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Delete notification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className="card p-12 text-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">All Caught Up!</h3>
          <p className="text-sm text-slate-500 mt-1">You have no unread notifications.</p>
        </div>
      )}
    </div>
  );
}
