import React, { useState } from 'react';
import { 
  Search, Plus, Bell, Filter, Clock, AlertTriangle, 
  Users, Calendar, FileText, ChevronRight, Download, MoreHorizontal,
  ArrowUpRight, CheckCircle2, TrendingUp, Sparkles, Star, ThumbsUp, ThumbsDown, Video, FolderOpen
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export default function ApplicationTracker() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Heatmap configuration (matching the layout in the mockup)
  const heatmapRows = 7;
  const heatmapCols = 44; // Adjusted to fit perfectly alongside the Success Funnel
  
  const getHeatmapColor = (w, d) => {
    // Semi-random deterministic pattern for natural distribution
    const val = (w * 5 + d * 3) % 13;
    if (val === 0 || val === 4 || val === 8) return 'bg-zinc-100 dark:bg-[#161920] border border-zinc-200 dark:border-zinc-900'; // Less
    if (val === 1 || val === 5 || val === 9) return 'bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200/50 dark:border-indigo-950/20';
    if (val === 2 || val === 6 || val === 10) return 'bg-indigo-300 dark:bg-indigo-800/40 border border-indigo-300/30 dark:border-indigo-800/10';
    if (val === 3 || val === 7 || val === 11) return 'bg-indigo-500/80 dark:bg-indigo-600/70 border border-indigo-500/40 dark:border-indigo-600/20';
    return 'bg-indigo-600 dark:bg-indigo-500 border border-indigo-600/20 dark:border-indigo-400/20'; // More
  };

  const funnelStages = [
    { label: "Applied", percentage: 100, color: "bg-indigo-600" },
    { label: "Assessment", percentage: 65, color: "bg-indigo-500/80" },
    { label: "Interview", percentage: 28, color: "bg-indigo-400/60" },
    { label: "Offer", percentage: 12, color: "bg-indigo-300/40" }
  ];

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-indigo-400" />
          Application Tracker
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Monitor your active applications and track your progress in real-time.
        </p>
      </div>

      {/* Top Search Bar & Page Control Header */}
      <div className="flex items-center justify-between gap-4 pb-1 border-b border-[#e2e8f0] dark:border-[#1e222b]">
        {/* Search bar matching style */}
        <div className="relative w-96 max-w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search applications, companies, or tasks..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#f8fafc] dark:bg-[#161920] border border-[#e2e8f0] dark:border-[#232936] rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-700 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        {/* Action Widgets */}
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition">
            <Bell className="w-4 h-4" />
          </button>
          
          <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Top Grid: Heatmap (Job Hunt Activity) & Success Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Job Hunt Activity Heatmap */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0f1115] border border-[#e2e8f0] dark:border-[#1e222b] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-extrabold text-zinc-800 dark:text-zinc-100">Job Hunt Activity</h3>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Last 90 Days</span>
          </div>

          {/* Grid display */}
          <div className="overflow-x-auto pb-2">
            <div className="flex flex-col gap-[3.5px] min-w-[500px]">
              {Array.from({ length: heatmapRows }).map((_, rIdx) => (
                <div key={rIdx} className="flex gap-[3.5px]">
                  {Array.from({ length: heatmapCols }).map((_, cIdx) => (
                    <div 
                      key={cIdx} 
                      className={`w-[9px] h-[9px] rounded-[1.5px] flex-shrink-0 transition-all ${getHeatmapColor(cIdx, rIdx)}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom legend & total indicator */}
          <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-zinc-400 uppercase tracking-wider">Less</span>
              <div className="w-[9px] h-[9px] rounded-[1.5px] bg-zinc-100 dark:bg-[#161920]" />
              <div className="w-[9px] h-[9px] rounded-[1.5px] bg-indigo-100 dark:bg-indigo-950/60" />
              <div className="w-[9px] h-[9px] rounded-[1.5px] bg-indigo-300 dark:bg-indigo-800/40" />
              <div className="w-[9px] h-[9px] rounded-[1.5px] bg-indigo-500/80 dark:bg-indigo-600/70" />
              <div className="w-[9px] h-[9px] rounded-[1.5px] bg-indigo-600 dark:bg-indigo-500" />
              <span className="font-semibold text-zinc-400 uppercase tracking-wider">More</span>
            </div>
            
            <span className="font-bold text-indigo-600 dark:text-indigo-400">
              142 total applications this season
            </span>
          </div>
        </div>

        {/* Success Funnel Card */}
        <div className="lg:col-span-1 bg-white dark:bg-[#0f1115] border border-[#e2e8f0] dark:border-[#1e222b] rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-zinc-800 dark:text-zinc-100">Success Funnel</h3>
          
          <div className="space-y-3 pt-1">
            {funnelStages.map((stage) => (
              <div key={stage.label} className="flex items-center gap-4">
                <div className="flex-1 bg-zinc-100 dark:bg-zinc-800 h-6 rounded-md overflow-hidden">
                  <div className={`h-full ${stage.color} rounded-md transition-all`} style={{ width: `${stage.percentage}%` }} />
                </div>
                <span className="text-[10px] font-black text-zinc-600 dark:text-zinc-300 w-24 text-left flex-shrink-0">
                  {stage.percentage}% {stage.label}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Live Pipeline Action Header */}
      <div className="flex items-center justify-between pt-4 border-t border-[#e2e8f0] dark:border-[#1e222b]">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-black text-zinc-800 dark:text-zinc-100">Live Pipeline</h2>
          
          {/* Overlapping small avatar stack */}
          <div className="flex -space-x-2">
            <img 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80" 
              alt="Team 1" 
              className="w-5 h-5 rounded-full object-cover border border-white dark:border-[#0f1115]"
            />
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" 
              alt="Team 2" 
              className="w-5 h-5 rounded-full object-cover border border-white dark:border-[#0f1115]"
            />
          </div>
        </div>

        {/* Filter / New Buttons */}
        <div className="flex items-center gap-2.5">
          <Button variant="brand" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-8 px-4 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition">
            <Plus className="w-4 h-4" /> New Application
          </Button>
          <button className="bg-white dark:bg-[#161920] border border-[#e2e8f0] dark:border-[#232936] text-zinc-700 dark:text-zinc-300 hover:bg-[#f8fafc] dark:hover:bg-[#1f2430] font-bold h-8 px-3 rounded-xl text-xs flex items-center gap-1.5 transition">
            <Filter className="w-3.5 h-3.5 text-zinc-500" /> Filter
          </button>
        </div>
      </div>

      {/* Kanban Board Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Applied Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#e2e8f0] dark:border-[#1e222b] pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Applied</span>
              <span className="text-[9px] bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-2 py-0.5 rounded-full font-black">12</span>
            </div>
            <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            
            {/* Linear Card */}
            <div className="bg-white dark:bg-[#0f1115] border border-[#e2e8f0] dark:border-[#1e222b] hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all p-4 rounded-2xl shadow-sm space-y-3 cursor-pointer">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-indigo-500 uppercase tracking-wider">Product Design</span>
                <span className="text-[9px] text-zinc-400 font-semibold">Oct 12</span>
              </div>
              <div>
                <h4 className="text-sm font-black text-zinc-850 dark:text-zinc-100">Linear</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-0.5">Senior Product Designer</p>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-zinc-100 dark:border-zinc-800/50">
                <span className="text-[9px] text-zinc-400 flex items-center gap-1 font-semibold">
                  <Clock className="w-3 h-3 text-zinc-400" /> 2d left
                </span>
                <FolderOpen className="w-3.5 h-3.5 text-zinc-400 hover:text-zinc-600" />
              </div>
            </div>

            {/* Vercel Card */}
            <div className="bg-white dark:bg-[#0f1115] border border-[#e2e8f0] dark:border-[#1e222b] hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all p-4 rounded-2xl shadow-sm space-y-3 cursor-pointer">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-indigo-500 uppercase tracking-wider">Engineering</span>
                <span className="text-[9px] text-zinc-400 font-semibold">Oct 14</span>
              </div>
              <div>
                <h4 className="text-sm font-black text-zinc-850 dark:text-zinc-100">Vercel</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-0.5">Frontend Engineer</p>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-zinc-100 dark:border-zinc-800/50">
                <span className="text-[9px] text-zinc-400 flex items-center gap-1 font-semibold">
                  <Clock className="w-3 h-3 text-zinc-400" /> 5d left
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Assessment Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#e2e8f0] dark:border-[#1e222b] pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Assessment</span>
              <span className="text-[9px] bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-2 py-0.5 rounded-full font-black">4</span>
            </div>
            <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            
            {/* Datadog Card */}
            <div className="bg-white dark:bg-[#0f1115] border border-[#e2e8f0] dark:border-[#1e222b] hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all p-4 rounded-2xl shadow-sm space-y-3 cursor-pointer">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-indigo-500 uppercase tracking-wider">Hackerrank</span>
                <span className="text-[9px] text-zinc-400 font-semibold">Oct 10</span>
              </div>
              <div>
                <h4 className="text-sm font-black text-zinc-850 dark:text-zinc-100">Datadog</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-0.5">Backend Systems Eng</p>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-zinc-100 dark:border-zinc-800/50">
                <span className="text-[9px] text-red-500 flex items-center gap-1 font-bold">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-500 animate-pulse" /> Expires in 18h
                </span>
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              </div>
            </div>

          </div>
        </div>

        {/* Interview Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#e2e8f0] dark:border-[#1e222b] pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Interview</span>
              <span className="text-[9px] bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-2 py-0.5 rounded-full font-black">3</span>
            </div>
            <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            
            {/* Stripe Card */}
            <div className="bg-white dark:bg-[#0f1115] border border-[#e2e8f0] dark:border-[#1e222b] hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all p-4 rounded-2xl shadow-sm space-y-3 cursor-pointer">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-indigo-500 uppercase tracking-wider">Technical Round</span>
                <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-bold">Tomorrow</span>
              </div>
              <div>
                <h4 className="text-sm font-black text-zinc-850 dark:text-zinc-100">Stripe</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-0.5">Full Stack Developer</p>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-zinc-100 dark:border-zinc-800/50">
                <div className="flex items-center gap-1.5">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=80&q=80" 
                    alt="Sarah K" 
                    className="w-4.5 h-4.5 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                  />
                  <span className="text-[9px] text-zinc-500 font-semibold">with Sarah K.</span>
                </div>
                
                <a 
                  href="#join"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="flex items-center gap-1 text-[9px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:underline"
                >
                  <Video className="w-3.5 h-3.5" /> Join Call
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
