import React, { useState } from 'react';
import { 
  Search, MapPin, DollarSign, Sparkles, X, Share2, Flag, 
  ChevronRight, CheckCircle2, TrendingUp, Cpu, Briefcase, 
  Bookmark, ExternalLink 
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Progress } from '../components/ui/Progress';
import { Button } from '../components/ui/Button';
import { jobDiscoveryData } from '../mock/dashboardData';

export default function JobDiscovery() {
  // Setup selectedJob with the first premium listing by default to match the mockup
  const [selectedJob, setSelectedJob] = useState(
    jobDiscoveryData.premiumListings && jobDiscoveryData.premiumListings.length > 0 
      ? jobDiscoveryData.premiumListings[0] 
      : null
  );
  
  const [searchQuery, setSearchQuery] = useState('');
  
  // Combine all jobs from mock data to make them selectable
  const allJobs = [
    ...(jobDiscoveryData.topMatches || []).map(job => ({
      ...job,
      // Provide fallback descriptions and requirements for top matches if not present
      team: job.team || "Engineering Group",
      jobType: job.jobType || "Full Time",
      posted: job.posted || "2d ago",
      salary: job.salary || "$150k - $190k",
      experience: job.experience || "3+ Years Exp",
      description: job.description || `${job.company} is looking for a talented ${job.title} to join our high-performing team. In this role, you will design, scale, and optimize core features used by millions of users worldwide.`,
      missingSkills: job.missingSkills || ["Kubernetes", "AWS"],
      requirements: job.requirements || [
        "Strong software design fundamentals and architecture knowledge",
        "Expertise in core stack technologies (React, Node, Go, or Python)",
        "Experience building scalable cloud infrastructures"
      ]
    })),
    ...(jobDiscoveryData.premiumListings || [])
  ];

  // Get active job from selectedJob state (matching ID to pull latest full fields)
  const activeJob = selectedJob ? allJobs.find(j => j.id === selectedJob.id) || selectedJob : null;

  return (
    <div className="space-y-6">
      {/* Header title matching top navigation title of mockup */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-indigo-400" />
          Job Discovery
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Explore AI-recommended career opportunities matching your optimized resume score.
        </p>
      </div>

      {/* Main Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Left Side: Filter, Search, Stats, Lists (Takes 2/3 cols when drawer open, otherwise takes all) */}
        <div className={`space-y-6 transition-all duration-300 ${activeJob ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          
          {/* Search bar & Filter Badges Card */}
          <div className="bg-[#0f1115] border border-[#1e222b] rounded-xl p-5 shadow-lg space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Full Stack Developer, Software Engineer..." 
                className="w-full bg-[#161920] border border-[#232936] rounded-lg pl-10 pr-4 py-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition"
              />
            </div>
            
            {/* Filter Tags Row */}
            <div className="flex flex-wrap gap-2 items-center">
              <div className="bg-[#1b1f29] border border-indigo-500/30 text-zinc-200 text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1.5 transition hover:bg-[#1f2430] cursor-pointer">
                <span>Location: All</span>
                <X className="w-3 h-3 text-zinc-500 hover:text-white" />
              </div>
              <div className="bg-[#161920] border border-[#232936] text-zinc-400 hover:text-zinc-200 text-[10px] px-2.5 py-1 rounded-full transition hover:bg-[#1f2430] cursor-pointer">
                Remote Only
              </div>
              <div className="bg-[#161920] border border-[#232936] text-zinc-400 hover:text-zinc-200 text-[10px] px-2.5 py-1 rounded-full transition hover:bg-[#1f2430] cursor-pointer">
                Experience: 2-5 yrs.
              </div>
              <div className="bg-[#161920] border border-[#232936] text-zinc-400 hover:text-zinc-200 text-[10px] px-2.5 py-1 rounded-full transition hover:bg-[#1f2430] cursor-pointer">
                Salary: $120k+
              </div>
            </div>
          </div>

          {/* Stats Summary Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0f1115] border border-[#1e222b] rounded-xl p-4 flex items-center gap-4">
              <div className="p-3 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Total Available</p>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-xl font-bold text-white">1,247</span>
                  <span className="text-xs text-zinc-400">Jobs Found</span>
                </div>
                <p className="text-[10px] text-zinc-500 mt-1">
                  <span className="text-emerald-400 font-medium">+12% vs. last week</span> • 256 new since yesterday
                </p>
              </div>
            </div>

            <div className="bg-[#0f1115] border border-[#1e222b] rounded-xl p-4 flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <Cpu className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">AI Match Profile</p>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-xl font-bold text-white">Complete</span>
                  <Badge variant="success">Active</Badge>
                </div>
                <p className="text-[10px] text-zinc-500 mt-1">
                  Pro account validation fully configured and updated
                </p>
              </div>
            </div>
          </div>

          {/* Top AI Matches Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Top AI Matches</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(jobDiscoveryData.topMatches || []).map((job) => {
                const isSelected = activeJob?.id === job.id;
                return (
                  <div 
                    key={job.id} 
                    onClick={() => setSelectedJob(job)}
                    className={`bg-[#0f1115] border rounded-xl p-4 flex items-center justify-between transition duration-200 cursor-pointer ${
                      isSelected 
                        ? 'border-indigo-500 shadow-md ring-1 ring-indigo-500/30' 
                        : 'border-[#1e222b] hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                        job.company === 'Google' ? 'bg-white text-zinc-900' : 'bg-blue-600 text-white'
                      }`}>
                        {job.company.substring(0, 1)}
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-zinc-100">{job.title}</h4>
                        <p className="text-[10px] text-zinc-400">{job.company} • <span className="text-zinc-500">{job.location}</span></p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      {job.match}% Match
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Premium Listings Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider pl-1">Premium Listings</h3>
            
            <div className="space-y-3">
              {(jobDiscoveryData.premiumListings || []).map((job) => {
                const isSelected = activeJob?.id === job.id;
                return (
                  <div 
                    key={job.id} 
                    onClick={() => setSelectedJob(job)}
                    className={`bg-[#0f1115] border p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition duration-200 cursor-pointer ${
                      isSelected 
                        ? 'border-indigo-500 shadow-md ring-1 ring-indigo-500/30' 
                        : 'border-[#1e222b] hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Company Logo representation */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                        job.company === 'Google' ? 'bg-white text-zinc-900' : 'bg-blue-600 text-white'
                      }`}>
                        {job.company === 'Google' ? (
                          <span className="text-lg">G</span>
                        ) : (
                          <span className="text-lg">M</span>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-zinc-100">{job.title}</h4>
                          <span className="text-[9px] text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700">
                            {job.posted}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400">{job.company} • <span className="text-zinc-500">{job.team}</span></p>
                        
                        {/* Meta Tags Row */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-[11px] text-zinc-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-zinc-600" />
                            {job.location}
                          </span>
                          <span>•</span>
                          <span>{job.experience}</span>
                          <span>•</span>
                          <span className="text-zinc-300 font-medium">{job.salary}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4 border-t border-zinc-900 md:border-t-0 pt-3 md:pt-0">
                      {/* Custom circular style percentage block matching mockup screen */}
                      <div className="flex flex-col items-center justify-center border border-indigo-500/20 bg-indigo-500/5 px-2.5 py-1.5 rounded-lg text-center min-w-[55px]">
                        <span className="text-xs font-bold text-indigo-400">{job.match}%</span>
                        <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wide">Match</span>
                      </div>
                      
                      <Button variant={isSelected ? "brand" : "secondary"} className="h-8 text-[11px] font-semibold py-0 px-3">
                        Apply Now
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Saved Roles Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 px-1">
              <Bookmark className="w-4 h-4 text-zinc-400" />
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Saved Roles</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(jobDiscoveryData.savedRoles || []).map((role, idx) => (
                <div key={idx} className="bg-[#0f1115] border border-[#1e222b] rounded-xl p-3.5 flex items-center justify-between hover:border-zinc-700 transition">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${role.logoBg}`}>
                      {role.logo}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-zinc-100">{role.name}</h4>
                      <p className="text-[10px] text-zinc-400">{role.company}</p>
                    </div>
                  </div>
                  
                  <button className="text-[10px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition">
                    <span>Move to Tracker</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Detailed Drawer overlay column (Takes 1/3 cols, sticky alignment) */}
        {activeJob && (
          <div className="lg:col-span-1 bg-[#0f1115] border border-[#1e222b] rounded-xl p-5 space-y-6 shadow-xl sticky top-[84px] h-full overflow-y-auto transition-all duration-300">
            
            {/* Action Bar (Close, Share, Save) */}
            <div className="flex items-center justify-between border-b border-[#1e222b] pb-3">
              <button 
                onClick={() => setSelectedJob(null)}
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-[#161920] transition"
                title="Close Details"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2">
                <button className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-[#161920] transition">
                  <Share2 className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-[#161920] transition">
                  <Flag className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Profile Overview (Gradient and job/comp details) */}
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-500 p-0.5 flex-shrink-0 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                <div className="w-full h-full bg-[#0f1115] rounded-[10px] flex items-center justify-center text-zinc-100">
                  {activeJob.company.substring(0, 1)}
                </div>
              </div>
              <div className="space-y-1">
                <h2 className="text-base font-bold text-zinc-100 leading-snug">{activeJob.title}</h2>
                <p className="text-xs text-zinc-300 font-medium">{activeJob.company} • <span className="text-zinc-500">{activeJob.team || "Cloud Platform Team"}</span></p>
              </div>
            </div>

            {/* Job Metadata Highlights */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-[#161920] border border-[#232936] rounded-lg p-2.5">
                <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-wide">Est. Salary</p>
                <p className="text-xs font-semibold text-zinc-200 mt-0.5">{activeJob.salary}</p>
              </div>
              <div className="bg-[#161920] border border-[#232936] rounded-lg p-2.5">
                <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-wide">Job Type</p>
                <p className="text-xs font-semibold text-zinc-200 mt-0.5">{activeJob.jobType || "Full Time"}</p>
              </div>
            </div>

            {/* CareerPilot AI Score and Missing Skills Widget matching mockup */}
            <div className="bg-[#13161c] border border-[#232936] rounded-xl p-4 space-y-4">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h3 className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider">CareerPilot AI Analysis</h3>
              </div>
              
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Match Strength</span>
                  <span className="font-semibold text-indigo-400">{activeJob.match}%</span>
                </div>
                {/* Gradient progress bar */}
                <Progress value={activeJob.match} indicatorColor="bg-gradient-to-r from-indigo-500 to-purple-500" />
              </div>

              {/* Missing Skills Warning Block */}
              {activeJob.missingSkills && activeJob.missingSkills.length > 0 && (
                <div className="space-y-2 pt-1">
                  <p className="text-[9px] font-semibold text-zinc-500 uppercase tracking-wider">Missing Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {activeJob.missingSkills.map((skill, idx) => (
                      <Badge key={idx} variant="warning">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Job Description Block */}
            <div className="space-y-2">
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Description</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {activeJob.description}
              </p>
            </div>

            {/* Key Requirements List */}
            {activeJob.requirements && activeJob.requirements.length > 0 && (
              <div className="space-y-2.5">
                <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Key Requirements</h3>
                <ul className="space-y-2">
                  {activeJob.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-zinc-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 mt-0.5 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bottom Apply CTA Button */}
            <div className="pt-2">
              <a 
                href="#apply" 
                className="w-full bg-[#5865f2] hover:bg-[#4752c4] active:bg-[#3c45a3] text-white py-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition duration-200 shadow-md"
              >
                <span>Apply to this Position</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
