import React from 'react';
import { Search, Bell } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Search Input Box */}
      <div className="relative w-full max-w-sm max-md:max-w-[180px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
        <input
          type="text"
          placeholder="Search companies, jobs, or tags..."
          className="w-full bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-border rounded-lg pl-9 pr-4 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-700 transition"
        />
      </div>

      {/* Control Actions & Identity Profile */}
      <div className="flex items-center gap-3.5">
        <button className="text-[11px] text-zinc-400 hover:text-zinc-200 transition font-medium">
          Feedback
        </button>
        <button className="text-[11px] text-zinc-400 hover:text-zinc-200 transition font-medium mr-1.5">
          Docs
        </button>
        
        <button className="p-1.5 hover:bg-[#13161c] rounded-lg text-zinc-400 hover:text-zinc-200 relative transition">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
        </button>

        <button className="bg-[#5865f2] hover:bg-[#4752c4] active:bg-[#3c45a3] text-white font-medium text-[10px] h-7 px-3.5 rounded shadow-sm transition">
          New Application
        </button>

        <div className="h-px w-2 bg-border max-md:hidden" />
        
        <div className="flex items-center gap-2">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
            alt="User profile pointer"
            className="w-7 h-7 rounded-full object-cover border border-zinc-700"
          />
        </div>
      </div>
    </header>
  );
}