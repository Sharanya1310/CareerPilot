import React from 'react';
import { UploadCloud, Search, PlusCircle, Share2 } from 'lucide-react';

export default function QuickActions({ onPageChange }) {
  const actions = [
    {
      id: 1,
      title: "Upload Resume",
      desc: "Parse matching vectors",
      icon: UploadCloud,
      page: "Resume Optimization",
      bgStyle: "bg-gradient-to-br from-indigo-400 to-violet-500 text-white border-transparent hover:scale-[1.01] hover:brightness-110 transition-all",
      iconColor: "text-white/90",
      descColor: "text-white/75"
    },
    {
      id: 2,
      title: "Search Jobs",
      desc: "Discover active pipelines",
      icon: Search,
      page: "Job Discovery",
      bgStyle: "bg-gradient-to-br from-sky-400 to-blue-500 text-white border-transparent hover:scale-[1.01] hover:brightness-110 transition-all",
      iconColor: "text-white/90",
      descColor: "text-white/75"
    },
    {
      id: 3,
      title: "Add Application",
      desc: "Track custom vectors manually",
      icon: PlusCircle,
      page: "Application Tracker",
      bgStyle: "bg-gradient-to-br from-orange-400 to-pink-500 text-white border-transparent hover:scale-[1.01] hover:brightness-110 transition-all",
      iconColor: "text-white/90",
      descColor: "text-white/75"
    },
    {
      id: 4,
      title: "Post Experience",
      desc: "Log interview transcripts",
      icon: Share2,
      page: "Interview Hub",
      bgStyle: "bg-gradient-to-br from-emerald-400 to-cyan-500 text-white border-transparent hover:scale-[1.01] hover:brightness-110 transition-all",
      iconColor: "text-white/90",
      descColor: "text-white/75"
    }
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider pl-1">Quick Actions</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((act) => (
          <button
            key={act.id}
            onClick={() => onPageChange?.(act.page)}
            className={`p-4 border rounded-xl text-left hover:border-zinc-500 hover:scale-[1.01] transition-all flex flex-col justify-between group h-28 ${act.bgStyle}`}
          >
            <act.icon className={`w-5 h-5 ${act.iconColor} transition-transform group-hover:scale-105 duration-200`} />
            <div>
              <h4 className="text-xs font-extrabold tracking-tight">{act.title}</h4>
              <p className={`text-[10px] mt-0.5 font-medium line-clamp-1 ${act.descColor}`}>{act.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
