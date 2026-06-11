import React from 'react';
import { UploadCloud, Search, PlusCircle, Share2 } from 'lucide-react';

export default function QuickActions() {
  const actions = [
    { 
      id: 1, 
      title: "Upload Resume", 
      desc: "Parse matching vectors", 
      icon: UploadCloud, 
      bgStyle: "bg-[#c3cdff] text-[#2c3875] border-transparent",
      iconColor: "text-[#2c3875]",
      descColor: "text-[#4a5596]"
    },
    { 
      id: 2, 
      title: "Search Jobs", 
      desc: "Discover active pipelines", 
      icon: Search, 
      bgStyle: "bg-[#e5d4ff] text-[#4b1d96] border-transparent",
      iconColor: "text-[#4b1d96]",
      descColor: "text-[#623da3]"
    },
    { 
      id: 3, 
      title: "Add Application", 
      desc: "Track custom vectors manually", 
      icon: PlusCircle, 
      bgStyle: "bg-[#ffecc7] text-[#8c5200] border-transparent hover:scale-[1.01] hover:bg-[#ffe0b2] transition-all dark:bg-[#ffd993]/10 dark:text-[#ffd993] dark:hover:bg-[#ffd993]/20",
      iconColor: "text-[#b26a00] dark:text-[#ffd993]",
      descColor: "text-[#a0661a] dark:text-[#ffd993]/75"
    },
    { 
      id: 4, 
      title: "Post Experience", 
      desc: "Log interview transcripts", 
      icon: Share2, 
      bgStyle: "bg-[#d1fae5] text-[#065f46] border-transparent hover:scale-[1.01] hover:bg-[#c8e6c9] transition-all dark:bg-[#6ee7b7]/10 dark:text-[#6ee7b7] dark:hover:bg-[#6ee7b7]/20",
      iconColor: "text-[#059669] dark:text-[#6ee7b7]",
      descColor: "text-[#047857] dark:text-[#6ee7b7]/75"
    }
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider pl-1">Quick Actions</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((act) => (
          <button 
            key={act.id}
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
