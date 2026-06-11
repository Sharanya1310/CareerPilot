import { 
  LayoutDashboard, FileText, Compass, Briefcase, 
  Building2, CalendarDays, User, Moon, Sun 
} from 'lucide-react';

export default function Sidebar({ currentPage = 'Resume Optimization', onPageChange, theme = 'dark', onThemeToggle }) {
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Resume Optimization', icon: FileText },
    { name: 'Job Discovery', icon: Compass },
    { name: 'Application Tracker', icon: Briefcase },
    { name: 'Company Tracker', icon: Building2 },
    { name: 'Interview Hub', icon: CalendarDays },
    { name: 'Profile', icon: User },
  ];

  const ThemeIcon = theme === 'dark' ? Moon : Sun;

  return (
    <aside className="w-16 hover:w-56 bg-[#0f1115] border-r border-[#1e222b] flex flex-col h-screen fixed left-0 top-0 z-50 select-none transition-all duration-300 ease-in-out group/sidebar shadow-md hover:shadow-2xl overflow-hidden">
      {/* Brand Header */}
      <div className="pt-5 pb-4 px-6 flex flex-col justify-center overflow-hidden whitespace-nowrap">
        <h1 className="text-sm font-black tracking-tight text-indigo-600 dark:text-white flex items-center justify-center group-hover/sidebar:justify-start gap-0 group-hover/sidebar:gap-2">
          <svg className="w-7 h-7 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7c4dff" />
                <stop offset="100%" stopColor="#64b5f6" />
              </linearGradient>
            </defs>
            <path 
              d="M17 7.5A7.5 7.5 0 1 0 17 16.5M12 7.5V17.5M12 7.5H16A3 3 0 0 1 19 10.5A3 3 0 0 1 16 13.5H12" 
              stroke="url(#logo-grad)" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          <span className="w-0 opacity-0 group-hover/sidebar:w-auto group-hover/sidebar:opacity-100 transition-all duration-300 font-black">areerPilot AI</span>
        </h1>
        <p className="text-[9px] text-zinc-500 font-extrabold mt-1 pl-1 w-0 opacity-0 group-hover/sidebar:w-auto group-hover/sidebar:opacity-100 transition-all duration-300">
          Pro Edition
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-3 space-y-[6px]">
        {navItems.map((item) => {
          const isActive = currentPage === item.name;
          return (
            <button
              key={item.name}
              onClick={() => onPageChange && onPageChange(item.name)}
              className={`w-full flex items-center justify-center group-hover/sidebar:justify-start gap-0 group-hover/sidebar:gap-3.5 px-6 py-2.5 rounded-r-lg text-[11px] font-semibold transition-all ${
                isActive 
                  ? 'bg-indigo-50/80 dark:bg-[#1b1f29] text-indigo-600 dark:text-white border-l-2 border-indigo-500' 
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-[#13161c]'
              }`}
            >
              <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-indigo-500 dark:text-indigo-400' : 'text-zinc-400 dark:text-zinc-500'}`} />
              <span className="w-0 opacity-0 group-hover/sidebar:w-auto group-hover/sidebar:opacity-100 transition-all duration-300 whitespace-nowrap overflow-hidden">
                {item.name}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Bottom section with Theme toggler */}
      <div className="border-t border-[#1e222b] overflow-hidden whitespace-nowrap">
        <button
          onClick={onThemeToggle}
          className="w-full flex items-center justify-center group-hover/sidebar:justify-start gap-0 group-hover/sidebar:gap-3.5 px-6 py-4 rounded-r-lg text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-[#13161c] transition-all"
        >
          <ThemeIcon className="w-4 h-4 text-zinc-400 dark:text-zinc-500 flex-shrink-0" />
          <span className="w-0 opacity-0 group-hover/sidebar:w-auto group-hover/sidebar:opacity-100 transition-all duration-300 whitespace-nowrap overflow-hidden">
            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </span>
        </button>
      </div>

    </aside>
  );
}


