import {
  LayoutDashboard, FileText, Compass, Briefcase,
  CalendarDays, User, Moon, Sun
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard',            icon: LayoutDashboard, color: 'text-indigo-500' },
  { name: 'Resume Optimization',  icon: FileText,         color: 'text-violet-500' },
  { name: 'Job Discovery',        icon: Compass,          color: 'text-sky-500' },
  { name: 'Application Tracker',  icon: Briefcase,        color: 'text-emerald-500' },
  { name: 'Interview Hub',        icon: CalendarDays,     color: 'text-rose-500' },
  { name: 'Profile',              icon: User,             color: 'text-purple-500' },
];

export default function Sidebar({ currentPage = 'Dashboard', onPageChange, theme = 'light', onThemeToggle }) {
  const isDark = theme === 'dark';

  return (
    <aside className={`
      w-16 hover:w-56 flex flex-col h-screen fixed left-0 top-0 z-50 select-none
      transition-all duration-300 ease-in-out group/sidebar overflow-hidden
      ${isDark
        ? 'bg-[#0d0d0f] border-r border-[#1e222b] shadow-xl shadow-black/30'
        : 'bg-white border-r border-slate-100 shadow-[2px_0_20px_rgba(99,102,241,0.06)]'
      }
    `}>

      {/* Brand Logo */}
      <div
        onClick={() => onPageChange?.('Landing')}
        className="pt-5 pb-4 px-4 flex flex-col justify-center overflow-hidden whitespace-nowrap cursor-pointer hover:opacity-80 transition-opacity"
      >
        <div className="flex items-center justify-center group-hover/sidebar:justify-start gap-0 group-hover/sidebar:gap-2.5">
          {/* Gradient icon mark */}
          <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 animate-float">
            <svg className="w-6.5 h-6.5 text-[#4c1dff]" viewBox="0 0 24 24" fill="none">
              <defs>
                <mask id="sidebarLogoMask">
                  <rect x="0" y="0" width="24" height="24" fill="white" />
                  <rect x="6" y="6" width="12" height="12" fill="black" />
                  <line x1="0" y1="0" x2="8" y2="8" stroke="black" strokeWidth="2.5" strokeLinecap="square" />
                  <line x1="16" y1="16" x2="24" y2="24" stroke="black" strokeWidth="2.5" strokeLinecap="square" />
                </mask>
              </defs>
              <rect x="0" y="0" width="24" height="24" fill="currentColor" mask="url(#sidebarLogoMask)" />
            </svg>
          </div>
          <div className="w-0 opacity-0 group-hover/sidebar:w-auto group-hover/sidebar:opacity-100 transition-all duration-300 overflow-hidden">
            <p className="text-sm font-bold text-[#4c1dff] whitespace-nowrap"
              style={{ fontFamily: "'Comfortaa', 'Plus Jakarta Sans', sans-serif" }}>
              CareerPilot AI
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className={`mx-3 h-px mb-2 ${isDark ? 'bg-zinc-800' : 'bg-slate-100'}`} />

      {/* Navigation */}
      <nav className="flex-1 py-2 space-y-0.5 px-2">
        {NAV_ITEMS.map((item, idx) => {
          const isActive = currentPage === item.name;
          return (
            <button
              key={item.name}
              onClick={() => onPageChange?.(item.name)}
              style={{ animationDelay: `${idx * 40}ms` }}
              className={`
                animate-fade-in-up w-full flex items-center justify-center group-hover/sidebar:justify-start
                gap-0 group-hover/sidebar:gap-3 px-3 py-2.5 rounded-xl text-[11px] font-semibold
                transition-all duration-200 group/nav-item relative overflow-hidden
                ${isActive
                  ? isDark
                    ? 'bg-indigo-500/10 text-indigo-400 shadow-sm'
                    : 'bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-600 shadow-sm shadow-indigo-100'
                  : isDark
                    ? 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }
              `}
            >
              {/* Active left indicator bar */}
              {isActive && (
                <span className={`
                  absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full
                  ${isDark ? 'bg-indigo-400' : 'bg-indigo-500'}
                `} />
              )}

              <item.icon className={`
                w-4 h-4 flex-shrink-0 transition-transform duration-200
                group-hover/nav-item:scale-110
                ${isActive
                  ? isDark ? 'text-indigo-400' : item.color
                  : isDark ? 'text-zinc-500' : 'text-slate-400 group-hover/nav-item:' + item.color
                }
              `} />

              <span className="w-0 opacity-0 group-hover/sidebar:w-auto group-hover/sidebar:opacity-100 transition-all duration-300 whitespace-nowrap overflow-hidden">
                {item.name}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Divider */}
      <div className={`mx-3 h-px ${isDark ? 'bg-zinc-800' : 'bg-slate-100'}`} />

      {/* Theme Toggle */}
      <div className="p-2">
        <button
          onClick={onThemeToggle}
          className={`
            w-full flex items-center justify-center group-hover/sidebar:justify-start
            gap-0 group-hover/sidebar:gap-3 px-3 py-2.5 rounded-xl text-[11px] font-semibold
            transition-all duration-200
            ${isDark
              ? 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
              : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
            }
          `}
        >
          {isDark
            ? <Moon className="w-4 h-4 flex-shrink-0 text-indigo-400" />
            : <Sun className="w-4 h-4 flex-shrink-0 text-amber-400" />
          }
          <span className="w-0 opacity-0 group-hover/sidebar:w-auto group-hover/sidebar:opacity-100 transition-all duration-300 whitespace-nowrap overflow-hidden">
            {isDark ? 'Dark Mode' : 'Light Mode'}
          </span>
        </button>
      </div>

    </aside>
  );
}
