import React from 'react';
import { UploadCloud, Search, PlusCircle, Share2 } from 'lucide-react';

const actions = [
  { id: 1, title: "Upload Resume", desc: "Parse matching vectors", icon: UploadCloud, color: "text-blue-400 border-blue-500/20 bg-blue-500/5" },
  { id: 2, title: "Search Jobs", desc: "Discover active pipelines", icon: Search, color: "text-indigo-400 border-indigo-500/20 bg-indigo-500/5" },
  { id: 3, title: "Add Application", desc: "Track custom vectors manually", icon: PlusCircle, color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" },
  { id: 4, title: "Post Experience", desc: "Log interview transcripts", icon: Share2, color: "text-amber-400 border-amber-500/20 bg-amber-500/5" }
];

export default function QuickActions() {
  return (
    <div className="space-y-3">
      <h3 className="text-xs uppercase tracking-wider text-zinc-400 font-semibold pl-1">Quick Actions</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((act) => (
          <button
            key={act.id}
            className={`p-4 border rounded-xl text-left hover:border-zinc-600 transition flex flex-col justify-between group h-28 ${act.color}`}
          >
            <act.icon className="w-5 h-5 transition-transform group-hover:scale-105 duration-200" />
            <div>
              <h4 className="text-xs font-bold text-zinc-100 group-hover:text-indigo-300 transition">{act.title}</h4>
              <p className="text-[10px] text-zinc-400 mt-0.5 line-clamp-1">{act.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}