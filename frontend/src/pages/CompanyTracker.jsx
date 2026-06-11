import React, { useState } from 'react';
import { 
  Building2, Globe, Star, Plus, Search, Sliders, ChevronRight, Bookmark, 
  MapPin, Clock, Calendar, CheckCircle2, TrendingUp, Sparkles, MoreHorizontal,
  ExternalLink
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

// Mock detailed jobs list for Latest Openings
const latestJobs = [
  {
    id: 1,
    title: "Software Engineer",
    company: "Google",
    location: "Bangalore",
    experience: "0-2 Years",
    salary: "₹12-18 LPA",
    posted: "Posted 2h ago",
    match: 98,
    matchType: "Skill Match",
    tags: ["React", "Node.js", "TypeScript"]
  },
  {
    id: 2,
    title: "Data Analyst",
    company: "Microsoft",
    location: "Hyderabad",
    experience: "1-3 Years",
    salary: "₹14-20 LPA",
    posted: "Posted 5h ago",
    match: 85,
    matchType: "Match",
    tags: ["Python", "SQL", "PowerBI"]
  }
];

export default function CompanyTracker() {
  const [activeTab, setActiveTab] = useState('Recently Posted');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-indigo-400" />
          Company Tracker
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Monitor openings, tech stacks, and hiring surges at your high-preference companies.
        </p>
      </div>

      {/* Main Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Side: Stats, Search, Followed, Latest (Takes 3/4 cols) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Stats metrics row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Card 1 */}
            <div className="bg-[#0f1115] border border-[#1e222b] rounded-xl p-4 flex flex-col justify-between hover:border-zinc-700 transition shadow-sm">
              <div className="flex items-center justify-between text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
                <span>Followed Companies</span>
                <Bookmark className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-xl font-bold text-white">12</span>
                <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20 font-bold tracking-wide uppercase">
                  Active
                </span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#0f1115] border border-[#1e222b] rounded-xl p-4 flex flex-col justify-between hover:border-zinc-700 transition shadow-sm">
              <div className="flex items-center justify-between text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
                <span>New Openings (Wk)</span>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-xl font-bold text-white">34</span>
                <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-bold tracking-wide uppercase">
                  ~ 12%
                </span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#0f1115] border border-[#1e222b] rounded-xl p-4 flex flex-col justify-between hover:border-zinc-700 transition shadow-sm">
              <div className="flex items-center justify-between text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
                <span>Hiring Companies</span>
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-xl font-bold text-white">8</span>
                <span className="text-[9px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20 font-bold tracking-wide uppercase">
                  Target
                </span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-[#0f1115] border border-[#1e222b] rounded-xl p-4 flex flex-col justify-between hover:border-zinc-700 transition shadow-sm">
              <div className="flex items-center justify-between text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
                <span>Total Open Roles</span>
                <Globe className="w-3.5 h-3.5 text-zinc-400" />
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-xl font-bold text-white">156</span>
                <span className="text-[9px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded border border-zinc-700 font-bold tracking-wide uppercase">
                  Total
                </span>
              </div>
            </div>

          </div>

          {/* Search bar & filter tag badges */}
          <div className="bg-[#0f1115] border border-[#1e222b] rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Explore 5,000+ companies by name or industry..." 
                  className="w-full bg-[#161920] border border-[#232936] rounded-lg pl-10 pr-4 py-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition"
                />
              </div>
              
              <button className="bg-[#09090b] hover:bg-[#1f2430] border border-[#1e222b] text-zinc-400 hover:text-zinc-200 px-4 rounded-lg text-xs font-semibold flex items-center gap-2 transition">
                <Sliders className="w-3.5 h-3.5 text-zinc-500" /> Industry
              </button>
            </div>
            
            {/* Suggested quick searches */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mr-1">Suggested:</span>
              
              {['Google', 'Microsoft', 'Amazon', 'Accenture', 'Infosys'].map((tag) => (
                <div 
                  key={tag}
                  onClick={() => setSearchQuery(tag)}
                  className="bg-[#161920] border border-[#232936] hover:bg-[#1f2430] text-zinc-300 text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1.5 transition cursor-pointer"
                >
                  <div className={`w-2 h-2 rounded-full ${
                    tag === 'Google' ? 'bg-white' : 
                    tag === 'Microsoft' ? 'bg-blue-600' : 
                    tag === 'Amazon' ? 'bg-amber-600' : 
                    tag === 'Accenture' ? 'bg-purple-600' : 'bg-green-600'
                  }`} />
                  <span>{tag}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Followed Companies Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Followed Companies</h3>
              <a href="#view-all" className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition">
                View all
              </a>
            </div>

            {/* 3 cards company grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Card 1: Google */}
              <div className="bg-[#0f1115] border border-[#1e222b] rounded-xl p-5 space-y-4 hover:border-zinc-700 transition relative">
                <span className="absolute top-4 right-4 text-[9px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 uppercase tracking-wide">
                  5 New
                </span>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center font-bold text-lg text-zinc-900 shadow-sm border border-zinc-200">
                    G
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-100">Google</h4>
                    <p className="text-[10px] text-zinc-400 mt-0.5">Technology • Internet</p>
                  </div>
                </div>

                <div className="text-[11px] text-zinc-500 flex items-center gap-1.5 pt-1">
                  <Building2 className="w-4 h-4 text-zinc-600" />
                  <span className="text-zinc-300 font-semibold">23 Open Roles</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1e222b]/50">
                  <Button variant="secondary" className="h-8 text-[11px] font-semibold py-0">
                    View Jobs
                  </Button>
                  <Button variant="ghost" className="h-8 text-[11px] font-semibold py-0 text-zinc-500 hover:text-zinc-300">
                    Unfollow
                  </Button>
                </div>
              </div>

              {/* Card 2: Microsoft */}
              <div className="bg-[#0f1115] border border-[#1e222b] rounded-xl p-5 space-y-4 hover:border-zinc-700 transition relative">
                <span className="absolute top-4 right-4 text-[9px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 uppercase tracking-wide">
                  2 New
                </span>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-lg text-white shadow-sm border border-blue-500/30">
                    M
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-100">Microsoft</h4>
                    <p className="text-[10px] text-zinc-400 mt-0.5">Software • Cloud</p>
                  </div>
                </div>

                <div className="text-[11px] text-zinc-500 flex items-center gap-1.5 pt-1">
                  <Building2 className="w-4 h-4 text-zinc-600" />
                  <span className="text-zinc-300 font-semibold">18 Open Roles</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1e222b]/50">
                  <Button variant="secondary" className="h-8 text-[11px] font-semibold py-0">
                    View Jobs
                  </Button>
                  <Button variant="ghost" className="h-8 text-[11px] font-semibold py-0 text-zinc-500 hover:text-zinc-300">
                    Unfollow
                  </Button>
                </div>
              </div>

              {/* Card 3: Amazon */}
              <div className="bg-[#0f1115] border border-[#1e222b] rounded-xl p-5 space-y-4 hover:border-zinc-700 transition relative">
                <span className="absolute top-4 right-4 text-[9px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 uppercase tracking-wide">
                  12 New
                </span>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center font-bold text-lg text-white shadow-sm border border-amber-500/20">
                    A
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-100">Amazon</h4>
                    <p className="text-[10px] text-zinc-400 mt-0.5">E-commerce • AI</p>
                  </div>
                </div>

                <div className="text-[11px] text-zinc-500 flex items-center gap-1.5 pt-1">
                  <Building2 className="w-4 h-4 text-zinc-600" />
                  <span className="text-zinc-300 font-semibold">42 Open Roles</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1e222b]/50">
                  <Button variant="secondary" className="h-8 text-[11px] font-semibold py-0">
                    View Jobs
                  </Button>
                  <Button variant="ghost" className="h-8 text-[11px] font-semibold py-0 text-zinc-500 hover:text-zinc-300">
                    Unfollow
                  </Button>
                </div>
              </div>

            </div>
          </div>

          {/* Latest Openings Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#1e222b] pb-2 px-1">
              <h3 className="text-sm font-bold text-zinc-100">Latest Openings</h3>
              
              <div className="flex items-center bg-[#0f1115] border border-[#1e222b] rounded-lg p-0.5">
                {['Recently Posted', 'Matched for you'].map((tab) => {
                  const isActive = activeTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`text-[10px] font-semibold px-3 py-1 rounded-md transition-all ${
                        isActive 
                          ? 'bg-[#1b1f29] text-zinc-100 shadow' 
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Vertical list of jobs */}
            <div className="space-y-3">
              {latestJobs.map((job) => (
                <div key={job.id} className="bg-[#0f1115] border border-[#1e222b] rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-zinc-700 transition cursor-pointer">
                  
                  <div className="flex items-start gap-4">
                    {/* Company Logo Indicator */}
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 ${
                      job.company === 'Google' ? 'bg-white text-zinc-900 border border-zinc-200' : 'bg-blue-600 text-white'
                    }`}>
                      {job.company.substring(0, 1)}
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-zinc-100">{job.title}</h4>
                      <p className="text-xs text-zinc-400 flex flex-wrap items-center gap-1.5">
                        <span>{job.company}</span>
                        <span className="text-zinc-600">•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                          {job.location}
                        </span>
                        <span className="text-zinc-600">•</span>
                        <span>{job.experience}</span>
                      </p>
                      <p className="text-[11px] text-zinc-300 font-semibold pt-1">
                        {job.salary}
                      </p>

                      {/* Stack badges */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {job.tags.map((tag) => (
                          <span key={tag} className="text-[9px] font-medium bg-[#161920] border border-[#232936] text-zinc-300 px-2 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right hand details and actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full md:w-auto gap-4 pt-3 md:pt-0 border-t border-[#1e222b]/50 md:border-t-0">
                    <div className="text-left md:text-right">
                      <p className="text-[9px] text-zinc-500">{job.posted}</p>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 mt-1 uppercase tracking-wide">
                        {job.match}% {job.matchType}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 w-full sm:w-auto">
                      <button className="p-2 border border-[#1e222b] bg-[#09090b] hover:bg-[#1f2430] rounded-lg text-zinc-400 hover:text-zinc-200 transition">
                        <Bookmark className="w-4 h-4" />
                      </button>
                      <Button variant="secondary" className="h-8 text-[11px] font-semibold flex-1 sm:flex-none">
                        Details
                      </Button>
                      <Button variant="brand" className="h-8 text-[11px] font-semibold flex-1 sm:flex-none">
                        Apply Now
                      </Button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Hiring Updates Feed & Insights (Takes 1/4 col) */}
        <div className="lg:col-span-1 space-y-6">
          
          <div className="bg-[#0f1115] border border-[#1e222b] rounded-xl p-5 shadow-sm space-y-5 flex flex-col">
            <div className="flex items-center justify-between border-b border-[#1e222b] pb-3 flex-shrink-0">
              <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-zinc-500" />
                Hiring Updates
              </h3>
              
              <button className="text-zinc-500 hover:text-zinc-300">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* News/Updates list */}
            <div className="space-y-4 flex-1">
              
              {/* Update 1 */}
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded bg-white flex items-center justify-center font-bold text-xs text-zinc-900 border border-zinc-200 flex-shrink-0">
                  G
                </div>
                <div>
                  <p className="text-xs text-zinc-300 leading-snug">
                    <span className="font-semibold text-zinc-100">Google</span> posted 3 new openings
                  </p>
                  <span className="text-[9px] text-zinc-500 mt-1 block">2 hours ago</span>
                  <a href="#see-roles" className="text-[10px] text-indigo-400 hover:underline mt-1 inline-flex items-center gap-0.5 font-medium transition">
                    See roles <ChevronRight className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>

              {/* Update 2 */}
              <div className="flex items-start gap-3 border-t border-[#1e222b]/50 pt-3">
                <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center font-bold text-xs text-white border border-blue-500/20 flex-shrink-0">
                  M
                </div>
                <div>
                  <p className="text-xs text-zinc-300 leading-snug">
                    <span className="font-semibold text-zinc-100">Microsoft</span> started hiring for <span className="font-semibold text-zinc-200">Cloud Architects</span>
                  </p>
                  <span className="text-[9px] text-zinc-500 mt-1 block">4 hours ago</span>
                </div>
              </div>

              {/* Update 3 */}
              <div className="flex items-start gap-3 border-t border-[#1e222b]/50 pt-3">
                <div className="w-7 h-7 rounded bg-purple-600 flex items-center justify-center font-bold text-xs text-white border border-purple-500/20 flex-shrink-0">
                  A
                </div>
                <div>
                  <p className="text-xs text-zinc-300 leading-snug">
                    <span className="font-semibold text-zinc-100">Accenture</span> updated their <span className="italic text-zinc-300 font-medium">Culture Handbook</span>
                  </p>
                  <span className="text-[9px] text-zinc-500 mt-1 block">1 day ago</span>
                </div>
              </div>

              {/* AI Insight Box card matching mockup */}
              <div className="bg-[#13161c] border border-[#232936] rounded-xl p-4 space-y-3 shadow-inner relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-indigo-500" />
                
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-wider">AI Insight</span>
                </div>
                
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Based on your profile, FinTech startups in Bangalore are seeing a 24% hiring surge.
                </p>

                <div className="pt-1">
                  <Button variant="secondary" className="h-7 text-[10px] font-bold py-0 w-full">
                    Explore Trend
                  </Button>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
