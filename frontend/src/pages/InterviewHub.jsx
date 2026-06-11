import React, { useState } from 'react';
import { 
  CalendarDays, Clock, Video, User, Plus, Search, Sliders, ChevronRight, 
  ThumbsUp, MessageSquare, Sparkles, CheckCircle2, MoreHorizontal, PenSquare,
  Award, Globe, BookOpen, AlertCircle
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

// Mock trending companies
const trendingCompanies = [
  { name: 'Accenture', count: 42, dotColor: 'bg-emerald-500', logo: 'A', bg: 'bg-purple-600/10 text-purple-400 border-purple-500/20' },
  { name: 'Google', count: 31, dotColor: 'bg-emerald-500', logo: 'G', bg: 'bg-white text-zinc-900' },
  { name: 'Microsoft', count: 15, dotColor: 'bg-amber-500', logo: 'M', bg: 'bg-blue-600 text-white' },
  { name: 'Amazon', count: 28, dotColor: 'bg-emerald-500', logo: 'Am', bg: 'bg-amber-600/15 text-amber-500 border-amber-500/20' },
  { name: 'Meta', count: 12, dotColor: 'bg-emerald-500', logo: 'Me', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
];

export default function InterviewHub() {
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-indigo-400" />
          Interview Hub
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Coordinate calendars, review prep roadmap telemetry, and study crowdsourced interview questions.
        </p>
      </div>

      {/* Main Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Side: Filter, Trending, Logs, Roadmap (Takes 3/4 cols) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Search bar & filter tag badges */}
          <div className="bg-[#0f1115] border border-[#1e222b] rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Company, Role or Interview Experience..." 
                  className="w-full bg-[#161920] border border-[#232936] rounded-lg pl-10 pr-4 py-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition"
                />
              </div>
            </div>
            
            {/* Filter Dropdowns and Difficulty Badges */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
              <div className="flex items-center gap-2.5">
                <button className="text-[10px] text-zinc-300 bg-[#09090b] hover:bg-[#161920] border border-[#1e222b] px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition">
                  <span>Company: All</span>
                  <ChevronRight className="w-3 h-3 text-zinc-500 rotate-90" />
                </button>
                <button className="text-[10px] text-zinc-300 bg-[#09090b] hover:bg-[#161920] border border-[#1e222b] px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition">
                  <span>Role: Engineering</span>
                  <ChevronRight className="w-3 h-3 text-zinc-500 rotate-90" />
                </button>
                <button className="text-[10px] text-zinc-300 bg-[#09090b] hover:bg-[#161920] border border-[#1e222b] px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition">
                  <Sliders className="w-3 h-3 text-zinc-500" />
                  <span>Difficulty</span>
                </button>
              </div>

              {/* Difficulty level chips */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setDifficultyFilter('Easy')}
                  className={`text-[9px] font-bold px-2.5 py-1 rounded-full border transition ${
                    difficultyFilter === 'Easy' 
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' 
                      : 'bg-[#161920] border-[#232936] text-zinc-400 hover:text-zinc-200 hover:bg-[#1f2430]'
                  }`}
                >
                  Easy
                </button>
                <button 
                  onClick={() => setDifficultyFilter('Medium')}
                  className={`text-[9px] font-bold px-2.5 py-1 rounded-full border transition ${
                    difficultyFilter === 'Medium' 
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 font-semibold' 
                      : 'bg-[#161920] border-[#232936] text-zinc-400 hover:text-zinc-200 hover:bg-[#1f2430]'
                  }`}
                >
                  Medium
                </button>
                <button 
                  onClick={() => setDifficultyFilter('Hard')}
                  className={`text-[9px] font-bold px-2.5 py-1 rounded-full border transition ${
                    difficultyFilter === 'Hard' 
                      ? 'bg-red-500/10 text-red-400 border-red-500/30 font-semibold' 
                      : 'bg-[#161920] border-[#232936] text-zinc-400 hover:text-zinc-200 hover:bg-[#1f2430]'
                  }`}
                >
                  Hard
                </button>
                <button 
                  onClick={() => setDifficultyFilter('Extreme')}
                  className={`text-[9px] font-bold px-2.5 py-1 rounded-full border transition ${
                    difficultyFilter === 'Extreme' 
                      ? 'bg-purple-500/10 text-purple-400 border-purple-500/30 font-semibold' 
                      : 'bg-[#161920] border-[#232936] text-zinc-400 hover:text-zinc-200 hover:bg-[#1f2430]'
                  }`}
                >
                  Extreme
                </button>
              </div>
            </div>
          </div>

          {/* Trending Companies Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Trending Companies</h3>
              <a href="#view-all" className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition">
                View All
              </a>
            </div>

            {/* Trending company list */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {trendingCompanies.map((comp) => (
                <div key={comp.name} className="bg-[#0f1115] border border-[#1e222b] rounded-xl p-4 space-y-3.5 hover:border-zinc-700 transition cursor-pointer relative">
                  <span className={`absolute top-4 right-4 w-1.5 h-1.5 rounded-full ${comp.dotColor}`} />
                  
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${comp.bg}`}>
                    {comp.logo}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-200 leading-tight">{comp.name}</h4>
                    <p className="text-[9px] text-zinc-500 mt-0.5">{comp.count} Experiences</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Latest Experiences Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1 border-b border-[#1e222b] pb-2">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Latest Experiences</h3>
              <button className="text-zinc-500 hover:text-zinc-300">
                <Sliders className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              
              {/* Card 1: Accenture */}
              <div className="bg-[#0f1115] border border-[#1e222b] rounded-xl p-5 space-y-4 hover:border-zinc-700 transition">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-purple-600/10 text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold text-sm">
                      A
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-100">Software Engineer - Frontend</h4>
                      <p className="text-[10px] text-zinc-400 mt-0.5">Accenture • Posted 2 days ago</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase tracking-wide">
                    Medium
                  </span>
                </div>

                {/* Tags */}
                <div className="flex gap-2">
                  {['#Frontend', '#ReactJS', '#FTE'].map((t) => (
                    <span key={t} className="text-[9px] font-medium text-zinc-500 bg-[#161920] px-2 py-0.5 rounded border border-[#232936]">
                      {t}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  The process was quite structured. Started with an online assessment focused on data structures and general coding aptitude. The second round was a deep dive into React and system design for a scalable dashboard. Finally, an HR round focusing on cultural fit and...
                </p>

                <div className="flex items-center justify-between border-t border-[#1e222b]/50 pt-4 text-[10px] text-zinc-500">
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-1 hover:text-zinc-300 transition">
                      <ThumbsUp className="w-3.5 h-3.5 text-zinc-500" />
                      <span>42 Helpful</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-zinc-300 transition">
                      <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />
                      <span>8 Comments</span>
                    </button>
                  </div>
                  
                  <a href="#read" className="text-indigo-400 hover:text-indigo-300 font-bold transition flex items-center gap-0.5">
                    <span>Read More</span>
                    <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Card 2: Google */}
              <div className="bg-[#0f1115] border border-[#1e222b] rounded-xl p-5 space-y-4 hover:border-zinc-700 transition">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center font-bold text-sm text-zinc-900 border border-zinc-200">
                      G
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-100">Senior Data Scientist</h4>
                      <p className="text-[10px] text-zinc-400 mt-0.5">Google • Posted 5 days ago</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 uppercase tracking-wide">
                    Hard
                  </span>
                </div>

                {/* Tags */}
                <div className="flex gap-2">
                  {['#MachineLearning', '#Statistics', '#Python'].map((t) => (
                    <span key={t} className="text-[9px] font-medium text-zinc-500 bg-[#161920] px-2 py-0.5 rounded border border-[#232936]">
                      {t}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  Six rounds total. One phone screen, four technical interviews (Coding, ML Theory, Case Study, Applied Stats), and one Googley/Leadership round. The technical depth required was significant, especially in bayesian statistics...
                </p>

                <div className="flex items-center justify-between border-t border-[#1e222b]/50 pt-4 text-[10px] text-zinc-500">
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-1 hover:text-zinc-300 transition">
                      <ThumbsUp className="w-3.5 h-3.5 text-zinc-500" />
                      <span>126 Helpful</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-zinc-300 transition">
                      <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />
                      <span>24 Comments</span>
                    </button>
                  </div>
                  
                  <a href="#read" className="text-indigo-400 hover:text-indigo-300 font-bold transition flex items-center gap-0.5">
                    <span>Read More</span>
                    <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Card 3: Detailed Process Breakdown - Cloud Architect */}
              <div className="bg-[#0f1115] border border-[#1e222b] rounded-xl p-5 space-y-5 hover:border-zinc-700 transition">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-sm text-white">
                      M
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-100">Cloud Architect</h4>
                      <p className="text-[10px] text-zinc-400 mt-0.5">Detailed Process Breakdown - Microsoft Azure Team</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-wide">
                      Outcome: Selected
                    </span>
                    <span className="text-[8px] text-zinc-500 uppercase tracking-wider font-semibold">May 2026</span>
                  </div>
                </div>

                {/* Sub-grid of Roadmap on left, tips on right */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 pt-1">
                  
                  {/* Left Column (Roadmap) - takes 3/5 */}
                  <div className="md:col-span-3 space-y-4">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Interview Roadmap</span>
                    
                    <div className="relative pl-5 border-l border-zinc-800 space-y-5">
                      
                      {/* Round 1 */}
                      <div className="relative">
                        <div className="absolute -left-[24.5px] top-0.5 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-[#0f1115]" />
                        <h5 className="text-[11px] font-semibold text-zinc-200">Round 1: Technical Screening</h5>
                        <p className="text-[10px] text-zinc-400 mt-0.5">Focus: Core Azure services, Kubernetes, Networking.</p>
                      </div>

                      {/* Round 2 */}
                      <div className="relative">
                        <div className="absolute -left-[24.5px] top-0.5 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-[#0f1115]" />
                        <h5 className="text-[11px] font-semibold text-zinc-200">Round 2: Architecture Deep-Dive</h5>
                        <p className="text-[10px] text-zinc-400 mt-0.5">Focus: Scalability, Security, Migration strategies.</p>
                      </div>

                      {/* Round 3 */}
                      <div className="relative">
                        <div className="absolute -left-[24.5px] top-0.5 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-[#0f1115]" />
                        <h5 className="text-[11px] font-semibold text-zinc-200">Round 3: Behavioral & HR</h5>
                        <p className="text-[10px] text-zinc-400 mt-0.5">Focus: Leadership principles and conflict resolution.</p>
                      </div>

                    </div>
                  </div>

                  {/* Right Column (Preparation Tips) - takes 2/5 */}
                  <div className="md:col-span-2 bg-[#13161c] border border-[#232936] rounded-xl p-4 space-y-3.5">
                    <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider block flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-zinc-500" />
                      Preparation Tips
                    </span>
                    
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-[10px] text-zinc-400 leading-relaxed">
                        <CheckCircle2 className="w-3 h-3 text-indigo-500 mt-0.5 flex-shrink-0" />
                        <span>Know the CAP theorem and how Azure SQL handles it.</span>
                      </li>
                      <li className="flex items-start gap-2 text-[10px] text-zinc-400 leading-relaxed">
                        <CheckCircle2 className="w-3 h-3 text-indigo-500 mt-0.5 flex-shrink-0" />
                        <span>Practice STAR method for all behavioral questions.</span>
                      </li>
                      <li className="flex items-start gap-2 text-[10px] text-zinc-400 leading-relaxed">
                        <CheckCircle2 className="w-3 h-3 text-indigo-500 mt-0.5 flex-shrink-0" />
                        <span>Understand hybrid cloud connectivity (ExpressRoute).</span>
                      </li>
                    </ul>
                  </div>

                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Right Side: Share Journey, Recommended, Recent Activity (Takes 1/4 col) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Share Your Journey Card */}
          <div className="bg-[#0f1115] border border-[#1e222b] rounded-xl p-5 space-y-4 shadow-sm text-center">
            <div className="space-y-1.5 text-left">
              <h3 className="text-sm font-bold text-zinc-100">Share Your Journey</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Your experience can be the bridge for someone else's career success.
              </p>
            </div>
            <Button variant="brand" className="h-9 w-full text-xs font-semibold gap-1.5">
              <PenSquare className="w-4 h-4" /> Post My Experience
            </Button>
          </div>

          {/* Recommended For You Panel */}
          <div className="bg-[#0f1115] border border-[#1e222b] rounded-xl p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-zinc-500" />
              Recommended For You
            </h3>
            
            <div className="space-y-3.5">
              {/* Rec 1 */}
              <div className="flex items-start justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded bg-[#ff9900]/15 text-[#ff9900] border border-[#ff9900]/25 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    Am
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-zinc-200 group-hover:text-zinc-100 transition">SDE-II at Amazon</h4>
                    <p className="text-[9px] text-zinc-500 mt-0.5">8 New experiences this week</p>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-650 group-hover:text-zinc-400 transition mt-1" />
              </div>

              {/* Rec 2 */}
              <div className="flex items-start justify-between group cursor-pointer border-t border-[#1e222b]/50 pt-3">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    Me
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-zinc-200 group-hover:text-zinc-100 transition">Product Designer at Meta</h4>
                    <p className="text-[9px] text-zinc-500 mt-0.5">3 New experiences this week</p>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-650 group-hover:text-zinc-400 transition mt-1" />
              </div>
            </div>
          </div>

          {/* Recent Activity feed logs */}
          <div className="bg-[#0f1115] border border-[#1e222b] rounded-xl p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-zinc-500" />
              Recent Activity
            </h3>
            
            <div className="space-y-4">
              {/* Act 1 */}
              <div className="flex gap-2.5">
                <div className="w-6 h-6 rounded-full bg-indigo-900/50 flex items-center justify-center text-[8px] font-bold text-indigo-300 flex-shrink-0">
                  RK
                </div>
                <div>
                  <p className="text-[11px] text-zinc-300 leading-snug">
                    <span className="font-semibold text-zinc-200">Rahul K.</span> shared an interview for <span className="font-medium text-zinc-100">Stripe</span>.
                  </p>
                  <span className="text-[8px] text-zinc-550 block mt-0.5">15 mins ago</span>
                </div>
              </div>

              {/* Act 2 */}
              <div className="flex gap-2.5 border-t border-[#1e222b]/50 pt-3.5">
                <div className="w-6 h-6 rounded-full bg-amber-900/40 flex items-center justify-center text-[8px] font-bold text-amber-300 flex-shrink-0">
                  SW
                </div>
                <div>
                  <p className="text-[11px] text-zinc-300 leading-snug">
                    <span className="font-semibold text-zinc-200">Sarah W.</span> upvoted <span className="font-medium text-zinc-100">Google SDE-II</span> experience.
                  </p>
                  <span className="text-[8px] text-zinc-550 block mt-0.5">42 mins ago</span>
                </div>
              </div>

              {/* Act 3 */}
              <div className="flex gap-2.5 border-t border-[#1e222b]/50 pt-3.5">
                <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[8px] font-bold text-zinc-400 flex-shrink-0">
                  An
                </div>
                <div>
                  <p className="text-[11px] text-zinc-300 leading-snug">
                    <span className="font-semibold text-zinc-200">Anonymous</span> posted a tip for <span className="font-medium text-zinc-100">Adobe</span>.
                  </p>
                  <span className="text-[8px] text-zinc-550 block mt-0.5">2 hours ago</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
