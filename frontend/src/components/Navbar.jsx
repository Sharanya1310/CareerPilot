import { useState, useRef, useEffect } from 'react';
import { Search, Bell, X, Briefcase, Calendar, Award, Building, CheckCheck, Mail, BellOff, LogOut, ChevronDown } from 'lucide-react';
import { useData } from '../context/DataContext';

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
}

function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl px-2 py-1.5 transition-all duration-200"
      >
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-[10px] font-black text-white select-none shadow-sm shadow-indigo-200 dark:shadow-indigo-900/30">
          {getInitials(user?.name)}
        </div>
        <span className="text-[11px] font-semibold text-slate-700 dark:text-zinc-300 max-md:hidden max-w-[90px] truncate">
          {user?.name || 'Account'}
        </span>
        <ChevronDown className="w-3 h-3 text-slate-400 dark:text-zinc-500 max-md:hidden" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#0c0d10]/95 backdrop-blur-md border border-slate-100 dark:border-[#1e222b] rounded-xl shadow-lg shadow-indigo-100/50 dark:shadow-black/80 overflow-hidden z-50 animate-slide-down">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-[#1e222b]">
            <p className="text-[11px] font-bold text-slate-800 dark:text-zinc-200 truncate">{user?.name || '—'}</p>
            <p className="text-[10px] text-slate-400 dark:text-zinc-500 truncate mt-0.5">{user?.email || '—'}</p>
          </div>
          <button
            onClick={() => { setOpen(false); onLogout?.(); }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[11px] font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}

export default function Navbar({ user, onLogout, onPageChange }) {
  const {
    notifications = [],
    unreadCount = 0,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    setPendingAction,
    jobs = [],
    applications = [],
  } = useData();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const FEATURES = [
    { label: 'Dashboard',            sub: 'Overview, stats, recent activity',                     page: 'Dashboard',            keywords: ['dashboard', 'overview', 'home', 'stats', 'summary'],                                              icon: <Award   className="w-3.5 h-3.5 text-indigo-500" /> },
    { label: 'ATS Checker',          sub: 'Resume Optimization · AI resume scoring',              page: 'Resume Optimization',  keywords: ['ats', 'ats checker', 'resume', 'score', 'optimize', 'cv', 'optimization', 'ai resume'],             icon: <Award   className="w-3.5 h-3.5 text-violet-500" /> },
    { label: 'Resume Optimization',  sub: 'Upload & optimize your resume with AI',                page: 'Resume Optimization',  keywords: ['resume', 'upload', 'optimize', 'optimization', 'cv', 'jd', 'job description'],                      icon: <Award   className="w-3.5 h-3.5 text-violet-500" /> },
    { label: 'Job Discovery',        sub: 'Browse & filter job openings',                         page: 'Job Discovery',        keywords: ['job', 'jobs', 'discover', 'search jobs', 'openings', 'listings', 'apply', 'find job'],              icon: <Briefcase className="w-3.5 h-3.5 text-sky-500" /> },
    { label: 'Job Recommendations',  sub: 'Job Discovery · AI-matched roles for your skills',     page: 'Job Discovery',        keywords: ['recommend', 'recommendations', 'match', 'ai match', 'suggested jobs', 'for you'],                   icon: <Briefcase className="w-3.5 h-3.5 text-sky-500" /> },
    { label: 'Application Tracker',  sub: 'Kanban board for your applications',                   page: 'Application Tracker',  keywords: ['application', 'tracker', 'pipeline', 'kanban', 'applied', 'status', 'follow up', 'track'],          icon: <Building className="w-3.5 h-3.5 text-emerald-500" /> },
    { label: 'Success Funnel',       sub: 'Application Tracker · Conversion rate by stage',       page: 'Application Tracker',  keywords: ['funnel', 'success', 'conversion', 'offer', 'assessment', 'stages'],                                  icon: <Building className="w-3.5 h-3.5 text-emerald-500" /> },
    { label: 'Interview Hub',        sub: 'Schedule & prepare for interviews',                    page: 'Interview Hub',        keywords: ['interview', 'hub', 'schedule', 'prep', 'prepare', 'mock', 'upcoming', 'calendar'],                   icon: <Calendar className="w-3.5 h-3.5 text-rose-500" /> },
    { label: 'Interview Experiences', sub: 'Interview Hub · Community shared experiences',        page: 'Interview Hub',        keywords: ['experience', 'community', 'shared', 'stories', 'interview tips'],                                    icon: <Calendar className="w-3.5 h-3.5 text-rose-500" /> },
    { label: 'Profile',              sub: 'Edit skills, preferences and account settings',        page: 'Profile',              keywords: ['profile', 'account', 'settings', 'skills', 'preferences', 'edit', 'name', 'email', 'followed'],     icon: <Mail    className="w-3.5 h-3.5 text-purple-500" /> },
  ];

  const searchResults = searchQuery.trim().length < 2 ? [] : (() => {
    const q = searchQuery.toLowerCase();
    const results = [];

    // Feature / page results
    const seen = new Set();
    FEATURES.forEach(f => {
      if (f.keywords.some(k => k.includes(q) || q.includes(k.split(' ')[0])) && !seen.has(f.label)) {
        seen.add(f.label);
        results.push({ ...f, type: 'Feature' });
      }
    });

    // Job results
    jobs.filter(j =>
      j.title?.toLowerCase().includes(q) || j.company?.toLowerCase().includes(q)
    ).slice(0, 3).forEach(j => results.push({
      type: 'Job',
      label: j.title,
      sub: j.company,
      page: 'Job Discovery',
      icon: <Briefcase className="w-3.5 h-3.5 text-sky-500" />,
    }));

    // Application results
    applications.filter(a =>
      a.role?.toLowerCase().includes(q) || a.company?.toLowerCase().includes(q)
    ).slice(0, 3).forEach(a => results.push({
      type: 'Application',
      label: a.role,
      sub: a.company,
      page: 'Application Tracker',
      icon: <Building className="w-3.5 h-3.5 text-emerald-500" />,
    }));

    return results.slice(0, 7);
  })();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const NOTIF_META = {
    job_match:           { icon: Briefcase, bg: 'bg-indigo-100 dark:bg-indigo-500/15', fg: 'text-indigo-600 dark:text-indigo-400', ring: 'ring-indigo-200 dark:ring-indigo-500/20', dot: 'bg-indigo-500' },
    upcoming_interview:  { icon: Calendar,  bg: 'bg-amber-100  dark:bg-amber-500/15',  fg: 'text-amber-600  dark:text-amber-400',  ring: 'ring-amber-200  dark:ring-amber-500/20',  dot: 'bg-amber-500'  },
    application_followup:{ icon: Mail,      bg: 'bg-emerald-100 dark:bg-emerald-500/15',fg: 'text-emerald-600 dark:text-emerald-400',ring:'ring-emerald-200 dark:ring-emerald-500/20',dot:'bg-emerald-500'},
    ats_improvement:     { icon: Award,     bg: 'bg-violet-100 dark:bg-violet-500/15', fg: 'text-violet-600 dark:text-violet-400', ring: 'ring-violet-200 dark:ring-violet-500/20', dot: 'bg-violet-500' },
    company_activity:    { icon: Building,  bg: 'bg-sky-100    dark:bg-sky-500/15',    fg: 'text-sky-600    dark:text-sky-400',    ring: 'ring-sky-200    dark:ring-sky-500/20',    dot: 'bg-sky-500'    },
  };

  const getNotifMeta = (type) => NOTIF_META[type] || { icon: Bell, bg: 'bg-slate-100 dark:bg-zinc-800', fg: 'text-slate-500 dark:text-zinc-400', ring: 'ring-slate-200 dark:ring-zinc-700', dot: 'bg-slate-400' };

  // Helper to format timestamps
  const formatTimeLabel = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = new Date(timestamp);
    const diffMs = new Date() - date;
    const diffMin = Math.round(diffMs / (60 * 1000));
    const diffHrs = Math.round(diffMs / (60 * 60 * 1000));
    const diffDays = Math.round(diffMs / (24 * 60 * 60 * 1000));

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHrs < 24) return `${diffHrs}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  };

  return (
    <header className="h-16 border-b border-slate-100 dark:border-[#1e222b] bg-white/90 dark:bg-[#09090b]/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm shadow-indigo-50/50 dark:shadow-none">
      {/* Search */}
      <div className="relative w-full max-w-sm max-md:max-w-[180px]" ref={searchRef}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => { setSearchQuery(e.target.value); setSearchOpen(true); }}
          onFocus={() => setSearchOpen(true)}
          placeholder="Search jobs, companies, applications..."
          className="w-full bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-[#1e222b] rounded-xl pl-9 pr-4 py-2 text-xs text-slate-700 dark:text-zinc-200 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-indigo-300 dark:focus:border-zinc-700 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-zinc-800 transition-all"
        />

        {/* Results dropdown */}
        {searchOpen && searchQuery.trim().length >= 2 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-[#0c0d10] border border-slate-100 dark:border-[#1e222b] rounded-xl shadow-lg shadow-indigo-100/40 dark:shadow-black/60 overflow-hidden z-50 animate-slide-down">
            {searchResults.length === 0 ? (
              <div className="px-4 py-3 text-[11px] text-slate-400 dark:text-zinc-500 text-center">No results for "{searchQuery}"</div>
            ) : (
              <>
                {searchResults.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => { onPageChange?.(r.page); setSearchQuery(''); setSearchOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left"
                  >
                    <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                      {r.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold text-slate-800 dark:text-zinc-200 truncate">{r.label}</p>
                      <p className="text-[10px] text-slate-400 dark:text-zinc-500 truncate">{r.sub} · {r.type}</p>
                    </div>
                  </button>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">

        {/* Notification Bell */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200 relative transition-all duration-200"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-sm shadow-indigo-300" />
            )}
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-[340px] rounded-2xl overflow-hidden z-50 flex flex-col max-h-[500px] animate-slide-down
              bg-white border border-slate-200/80 shadow-xl shadow-slate-200/60
              dark:bg-[#0b0c1a] dark:border-white/[0.06] dark:shadow-black/60">

              {/* Header */}
              <div className="px-4 pt-4 pb-3 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center shadow-sm shadow-indigo-300 dark:shadow-indigo-900/50">
                    <Bell className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-white leading-none">Notifications</p>
                    <p className="text-[9px] text-slate-400 dark:text-zinc-500 mt-0.5">
                      {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
                    </p>
                  </div>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllNotificationsRead()}
                    className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-lg transition
                      bg-indigo-50 text-indigo-600 hover:bg-indigo-100
                      dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20"
                  >
                    <CheckCheck className="w-3 h-3" /> Mark all read
                  </button>
                )}
              </div>

              {/* Divider */}
              <div className="mx-4 h-px bg-slate-100 dark:bg-white/[0.05] mb-1" />

              {/* Items */}
              <div className="overflow-y-auto flex-1 px-2 pb-2 space-y-0.5">
                {notifications.length > 0 ? notifications.map((n) => {
                  const meta = getNotifMeta(n.type);
                  const Icon = meta.icon;
                  return (
                    <div
                      key={n.id || n._id}
                      onClick={() => markNotificationRead(n.id || n._id)}
                      className={`relative flex gap-3 px-3 py-3 rounded-xl cursor-pointer group transition-all duration-150
                        ${!n.isRead
                          ? 'bg-indigo-50/70 dark:bg-indigo-500/[0.07]'
                          : 'hover:bg-slate-50 dark:hover:bg-white/[0.04]'
                        }`}
                    >
                      {/* Unread bar */}
                      {!n.isRead && (
                        <span className={`absolute left-0 top-3 bottom-3 w-0.5 rounded-full ${meta.dot}`} />
                      )}

                      {/* Icon */}
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ring-1 ${meta.bg} ${meta.fg} ${meta.ring}`}>
                        <Icon className="w-4 h-4" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[11px] font-bold leading-snug text-slate-800 dark:text-zinc-100 truncate">{n.title}</p>
                          <span className="text-[9px] text-slate-400 dark:text-zinc-500 whitespace-nowrap flex-shrink-0">{formatTimeLabel(n.createdAt)}</span>
                        </div>
                        <p className="text-[10px] mt-0.5 leading-relaxed text-slate-500 dark:text-zinc-400 line-clamp-2">{n.message}</p>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteNotification(n.id || n._id); }}
                        className="absolute top-2.5 right-2.5 p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all
                          hover:bg-red-50 dark:hover:bg-red-500/15 text-slate-300 dark:text-zinc-600 hover:text-red-500 dark:hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                }) : (
                  <div className="py-10 flex flex-col items-center justify-center text-center">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/[0.04] flex items-center justify-center mb-3">
                      <BellOff className="w-6 h-6 text-slate-300 dark:text-zinc-600" />
                    </div>
                    <p className="text-xs font-bold text-slate-500 dark:text-zinc-400">You're all caught up!</p>
                    <p className="text-[10px] text-slate-400 dark:text-zinc-600 mt-1 max-w-[160px] leading-relaxed">No new notifications right now.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => { setPendingAction('open_add_application'); onPageChange?.('Application Tracker'); }}
          className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-semibold text-[10px] h-7 px-4 rounded-lg shadow-sm shadow-indigo-200 dark:shadow-indigo-900/30 transition-all duration-200 hover:shadow-md hover:shadow-indigo-200/50 hover:-translate-y-px active:translate-y-0"
        >
          New Application
        </button>

        <div className="w-px h-5 bg-slate-200 dark:bg-zinc-800 max-md:hidden" />
        <UserMenu user={user} onLogout={onLogout} />
      </div>
    </header>
  );
}