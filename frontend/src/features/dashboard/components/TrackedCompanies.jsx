import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { useData } from '../../../context/DataContext';
import { Building, Plus } from 'lucide-react';

export default function TrackedCompanies() {
  const { trackedCompanies, trackCompany } = useData();

  return (
    <Card className="bg-[#121214] border border-[#1e222b]">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase">Tracked Companies</CardTitle>
        <span className="text-[10px] font-semibold text-zinc-500">{trackedCompanies.length} Followed</span>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-1">
        {trackedCompanies.map((comp) => {
          let logoLetter = comp.name.substring(0, 1);
          let logoBg = "bg-zinc-800";
          let logoTextColor = "text-white";
          
          if (comp.name === 'Google') {
            logoBg = "bg-white/95";
            logoTextColor = "text-zinc-900";
          } else if (comp.name === 'Microsoft') {
            logoBg = "bg-blue-600";
          } else if (comp.name === 'Amazon') {
            logoBg = "bg-amber-600";
          }

          return (
            <div key={comp.name} className="p-3 bg-[#0f1115] border border-[#1e222b] rounded-xl flex items-center gap-3 hover:border-zinc-700 transition">
              <div className={`w-9 h-9 ${logoBg} rounded-lg flex items-center justify-center ${logoTextColor} font-black text-sm border border-[#1e222b]`}>
                {logoLetter}
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-200">{comp.name}</h4>
                <p className="text-[10px] text-zinc-500 mt-0.5">
                  {comp.openings > 0 ? `${comp.openings} New Openings` : 'No new activity'}
                </p>
              </div>
            </div>
          );
        })}

        {/* Follow More card */}
        <div 
          onClick={() => {
            const name = prompt("Enter company name to track:");
            if (name) trackCompany(name);
          }}
          className="p-3 bg-[#0f1115]/50 border border-dashed border-[#1e222b] rounded-xl flex items-center justify-center gap-2 hover:border-zinc-650 transition cursor-pointer text-zinc-500 hover:text-zinc-300"
        >
          <Plus className="w-4 h-4" />
          <span className="text-xs font-semibold">Follow More</span>
        </div>
      </CardContent>
    </Card>
  );
}