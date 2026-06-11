import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { recommendedJobs } from '../../../mock/dashboardData';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function RecommendedJobs() {
  return (
    <Card className="bg-[#121214] border border-[#1e222b] h-full">
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <CardTitle className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase">Recommended Jobs</CardTitle>
        </div>
        <button className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center transition-colors">
          Explore All <ArrowRight className="ml-1 w-3 h-3" />
        </button>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {recommendedJobs.map((job) => (
          <div 
            key={job.id} 
            className="p-4 bg-[#0f1115] border border-[#1e222b] rounded-xl flex flex-col justify-between hover:border-zinc-700 transition group cursor-pointer h-28"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-indigo-400 transition">{job.title}</h4>
                <p className="text-[10px] text-zinc-400 mt-1">{job.company} • {job.location} • {job.salary}</p>
              </div>
              <Badge variant="success" className="text-[10px] py-0.5 px-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                {job.match}% Match
              </Badge>
            </div>
            
            <div className="flex gap-1.5 mt-3">
              {job.tags.map((tag) => (
                <span key={tag} className="text-[9px] font-semibold text-zinc-500 bg-[#161a23] px-2 py-0.5 rounded border border-[#1e222b]">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
