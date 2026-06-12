import React, { useState, useEffect } from 'react';
import { 
  Search, MapPin, DollarSign, Sparkles, X, Share2, Flag, 
  ChevronRight, CheckCircle2, TrendingUp, Cpu, Briefcase, 
  Bookmark, ExternalLink 
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Progress } from '../components/ui/Progress';
import { Button } from '../components/ui/Button';
import { useData } from '../context/DataContext';

export default function JobDiscovery() {
  const { jobs, savedJobs, saveJob, unsaveJob, addApplication } = useData();

  const [selectedJob, setSelectedJob] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [locationFilter, setLocationFilter] = useState('All');
  const [expFilter, setExpFilter] = useState('All');
  const [salaryFilter, setSalaryFilter] = useState('All');

  // Filter jobs based on active filters
  const filteredJobs = jobs.filter(job => {
    // 1. Search Query (Title, Company, Team, Description)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = job.title?.toLowerCase().includes(q);
      const matchCompany = job.company?.toLowerCase().includes(q);
      const matchTeam = job.team?.toLowerCase().includes(q);
      const matchDesc = job.description?.toLowerCase().includes(q);
      if (!matchTitle && !matchCompany && !matchTeam && !matchDesc) return false;
    }

    // 2. Remote Only Filter
    if (remoteOnly) {
      const isRemote = job.workType?.toLowerCase() === 'remote' || job.location?.toLowerCase().includes('remote');
      if (!isRemote) return false;
    }

    // 3. Location Filter
    if (locationFilter && locationFilter !== 'All') {
      if (!job.location?.toLowerCase().includes(locationFilter.toLowerCase())) {
        return false;
      }
    }

    // 4. Experience Filter
    if (expFilter && expFilter !== 'All') {
      if (!job.experience?.toLowerCase().includes(expFilter.toLowerCase())) {
        return false;
      }
    }

    // 5. Salary Filter
    if (salaryFilter && salaryFilter !== 'All') {
      if (!job.salary?.toLowerCase().includes(salaryFilter.toLowerCase())) {
        return false;
      }
    }

    return true;
  });

  // Split filtered jobs into top matches and premium listings
  const topMatches = filteredJobs.filter(j => j.match >= 85);
  const premiumListings = filteredJobs.filter(j => j.isPremium);
  // Fallbacks to display all results if filters result in narrow categories
  const displayedTopMatches = topMatches.length > 0 ? topMatches : filteredJobs.filter(j => !j.isPremium).slice(0, 2);
  const displayedPremiumListings = premiumListings.length > 0 ? premiumListings : filteredJobs;

  // Set selected job by default on page load or when jobs list changes
  useEffect(() => {
    if (filteredJobs.length > 0) {
      // Keep selected job if it is still in filtered results
      const stillAvailable = filteredJobs.find(j => j.id === selectedJob?.id);
      if (!stillAvailable) {
        const premium = filteredJobs.find(j => j.isPremium);
        setSelectedJob(premium || filteredJobs[0]);
      }
    } else {
      setSelectedJob(null);
    }
  }, [jobs, searchQuery, remoteOnly, locationFilter, expFilter, salaryFilter]);

  const activeJob = selectedJob ? filteredJobs.find(j => j.id === selectedJob.id) || selectedJob : null;

  const handleSaveToggle = async (job, e) => {
    if (e) e.stopPropagation();
    if (job.isSaved) {
      await unsaveJob(job.id);
    } else {
      await saveJob(job.id);
    }
  };

  const handleMoveToTracker = async (job, e) => {
    if (e) e.stopPropagation();
    try {
      await addApplication({
        company: job.company,
        role: job.title || "Software Engineer",
        stage: "Applied",
        category: "Engineering",
        notes: "Moved from saved jobs in Job Discovery."
      });
      // Unsave the job once moved
      await unsaveJob(job.id);
      alert(`"${job.title}" at ${job.company} moved to Application Tracker!`);
    } catch (err) {
      console.error("Failed to move saved job to tracker:", err);
    }
  };

  const handleApply = async (job) => {
    try {
      await addApplication({
        company: job.company,
        role: job.title,
        stage: "Applied",
        category: "Engineering",
        notes: `Applied via Job Discovery. Match strength: ${job.match}%.`
      });
      alert(`Applied to ${job.title} at ${job.company}! We've automatically added this to your Application Tracker.`);
    } catch (err) {
      console.error("Failed to automatically track job:", err);
    }
  };

  // Helper trigger filter prompts
  const handleLocationClick = () => {
    const loc = prompt("Enter location to filter (e.g. Mountain View, Redmond) or leave empty for All:", locationFilter === "All" ? "" : locationFilter);
    if (loc === null) return;
    setLocationFilter(loc.trim() || "All");
  };

  const handleExpClick = () => {
    const exp = prompt("Enter experience level to filter (e.g. 5+ Years Exp, 3-5 Years) or leave empty for All:", expFilter === "All" ? "" : expFilter);
    if (exp === null) return;
    setExpFilter(exp.trim() || "All");
  };

  const handleSalaryClick = () => {
    const sal = prompt("Enter salary to filter (e.g. $160k, $180k) or leave empty for All:", salaryFilter === "All" ? "" : salaryFilter);
    if (sal === null) return;
    setSalaryFilter(sal.trim() || "All");
  };

  return (
    <div className="space-y-6">
      {/* Header title */}
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
        
        {/* Left Side: Filter, Search, Stats, Lists */}
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
              <div 
                onClick={handleLocationClick}
                className={`border text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1.5 transition cursor-pointer ${
                  locationFilter !== 'All'
                    ? 'bg-[#1b1f29] border-indigo-500/30 text-zinc-200' 
                    : 'bg-[#161920] border-[#232936] text-zinc-400 hover:text-zinc-200 hover:bg-[#1f2430]'
                }`}
              >
                <span>Location: {locationFilter}</span>
                {locationFilter !== 'All' && (
                  <X 
                    className="w-3 h-3 text-zinc-500 hover:text-white" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setLocationFilter('All');
                    }}
                  />
                )}
              </div>
              <div 
                onClick={() => setRemoteOnly(!remoteOnly)}
                className={`text-[10px] px-2.5 py-1 rounded-full transition cursor-pointer border ${
                  remoteOnly 
                    ? 'bg-[#1b1f29] border-indigo-500/30 text-zinc-200' 
                    : 'bg-[#161920] border-[#232936] text-zinc-400 hover:text-zinc-200 hover:bg-[#1f2430]'
                }`}
              >
                Remote Only
              </div>
              <div 
                onClick={handleExpClick}
                className={`border text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1.5 transition cursor-pointer ${
                  expFilter !== 'All'
                    ? 'bg-[#1b1f29] border-indigo-500/30 text-zinc-200' 
                    : 'bg-[#161920] border-[#232936] text-zinc-400 hover:text-zinc-200 hover:bg-[#1f2430]'
                }`}
              >
                <span>Experience: {expFilter}</span>
                {expFilter !== 'All' && (
                  <X 
                    className="w-3 h-3 text-zinc-500 hover:text-white" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpFilter('All');
                    }}
                  />
                )}
              </div>
              <div 
                onClick={handleSalaryClick}
                className={`border text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1.5 transition cursor-pointer ${
                  salaryFilter !== 'All'
                    ? 'bg-[#1b1f29] border-indigo-500/30 text-zinc-200' 
                    : 'bg-[#161920] border-[#232936] text-zinc-400 hover:text-zinc-200 hover:bg-[#1f2430]'
                }`}
              >
                <span>Salary: {salaryFilter}</span>
                {salaryFilter !== 'All' && (
                  <X 
                    className="w-3 h-3 text-zinc-500 hover:text-white" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSalaryFilter('All');
                    }}
                  />
                )}
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
                  <span className="text-xl font-bold text-white">{filteredJobs.length}</span>
                  <span className="text-xs text-zinc-400">Jobs Found</span>
                </div>
                <p className="text-[10px] text-zinc-500 mt-1">
                  <span className="text-emerald-400 font-medium">+12% vs. last week</span> • Live matching enabled
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
                  Dynamic calculations relative to active resume skills
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
              {displayedTopMatches.length === 0 ? (
                <p className="text-xs text-zinc-500 italic col-span-2 pl-1">No matches found matching active filters.</p>
              ) : (
                displayedTopMatches.map((job) => {
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
                          job.logoBg || 'bg-blue-600 text-white'
                        }`}>
                          {job.logo || (job.company ? job.company.substring(0, 1) : 'J')}
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-zinc-100">{job.title}</h4>
                          <p className="text-[10px] text-zinc-400">{job.company} • <span className="text-zinc-500">{job.location}</span></p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                          {job.match}% Match
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Premium Listings Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider pl-1">Premium Listings</h3>
            
            <div className="space-y-3">
              {displayedPremiumListings.length === 0 ? (
                <p className="text-xs text-zinc-500 italic pl-1">No listings found matching active filters.</p>
              ) : (
                displayedPremiumListings.map((job) => {
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
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                          job.logoBg || 'bg-blue-600 text-white'
                        }`}>
                          {job.logo || (job.company ? job.company.substring(0, 1) : 'J')}
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold text-zinc-100">{job.title}</h4>
                            <span className="text-[9px] text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700">
                              {job.posted || 'Just now'}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400">{job.company} • <span className="text-zinc-500">{job.team || 'Engineering Team'}</span></p>
                          
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
                        <div className="flex flex-col items-center justify-center border border-indigo-500/20 bg-indigo-500/5 px-2.5 py-1.5 rounded-lg text-center min-w-[55px]">
                          <span className="text-xs font-bold text-indigo-400">{job.match}%</span>
                          <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wide">Match</span>
                        </div>
                        
                        <Button 
                          variant={isSelected ? "brand" : "secondary"} 
                          className="h-8 text-[11px] font-semibold py-0 px-3"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApply(job);
                          }}
                        >
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Saved Roles Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 px-1">
              <Bookmark className="w-4 h-4 text-zinc-400" />
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Saved Roles</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedJobs.length === 0 ? (
                <p className="text-xs text-zinc-500 italic col-span-2 pl-1">No saved jobs yet. Bookmarked jobs will appear here.</p>
              ) : (
                savedJobs.map((role) => (
                  <div key={role.id} className="bg-[#0f1115] border border-[#1e222b] rounded-xl p-3.5 flex items-center justify-between hover:border-zinc-700 transition">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${role.logoBg || 'bg-indigo-600 text-white'}`}>
                        {role.logo || (role.company ? role.company.substring(0, 1) : 'J')}
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-zinc-100">{role.title}</h4>
                        <p className="text-[10px] text-zinc-400">{role.company}</p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={(e) => handleMoveToTracker(role, e)}
                      className="text-[10px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition"
                    >
                      <span>Move to Tracker</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right Side: Detailed Drawer overlay column */}
        {activeJob && (
          <div className="lg:col-span-1 bg-[#0f1115] border border-[#1e222b] rounded-xl p-5 space-y-6 shadow-xl sticky top-[84px] h-[calc(100vh-120px)] overflow-y-auto transition-all duration-300">
            
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
                <button 
                  onClick={(e) => handleSaveToggle(activeJob, e)}
                  className={`p-1.5 rounded-md transition ${
                    activeJob.isSaved 
                      ? 'text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20' 
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#161920]'
                  }`}
                  title={activeJob.isSaved ? "Unsave Job" : "Save Job"}
                >
                  <Bookmark className={`w-4 h-4 ${activeJob.isSaved ? 'fill-indigo-400' : ''}`} />
                </button>
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
                  {activeJob.logo || (activeJob.company ? activeJob.company.substring(0, 1) : 'J')}
                </div>
              </div>
              <div className="space-y-1">
                <h2 className="text-base font-bold text-zinc-100 leading-snug">{activeJob.title}</h2>
                <p className="text-xs text-zinc-300 font-medium">{activeJob.company} • <span className="text-zinc-500">{activeJob.team || "Engineering Group"}</span></p>
              </div>
            </div>

            {/* Job Metadata Highlights */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-[#161920] border border-[#232936] rounded-lg p-2.5">
                <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-wide">Est. Salary</p>
                <p className="text-xs font-semibold text-zinc-200 mt-0.5">{activeJob.salary || 'Competitive'}</p>
              </div>
              <div className="bg-[#161920] border border-[#232936] rounded-lg p-2.5">
                <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-wide">Job Type</p>
                <p className="text-xs font-semibold text-zinc-200 mt-0.5">{activeJob.jobType || "Full Time"}</p>
              </div>
            </div>

            {/* CareerPilot AI Score and Missing Skills Widget */}
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

            {/* Company Highlights Block */}
            {activeJob.companyHighlights && (
              <div className="bg-[#13161c] border border-[#232936] rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider">Company Highlights</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  <div>
                    <span className="text-zinc-500 block text-[9px] uppercase font-semibold">Rating</span>
                    <span className="text-zinc-300 font-medium">{activeJob.companyHighlights.rating} ★</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[9px] uppercase font-semibold">Size</span>
                    <span className="text-zinc-300 font-medium">{activeJob.companyHighlights.size}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[9px] uppercase font-semibold">Industry</span>
                    <span className="text-zinc-300 font-medium">{activeJob.companyHighlights.industry}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[9px] uppercase font-semibold">Culture</span>
                    <span className="text-zinc-300 font-medium truncate block" title={activeJob.companyHighlights.culture}>
                      {activeJob.companyHighlights.culture}
                    </span>
                  </div>
                </div>

                {activeJob.companyHighlights.benefits && activeJob.companyHighlights.benefits.length > 0 && (
                  <div className="border-t border-zinc-800/60 pt-2.5 space-y-1.5">
                    <span className="text-zinc-500 block text-[9px] uppercase font-semibold">Key Benefits</span>
                    <div className="flex flex-wrap gap-1">
                      {activeJob.companyHighlights.benefits.map((benefit, idx) => (
                        <span key={idx} className="bg-zinc-800/80 text-zinc-300 text-[9px] px-2 py-0.5 rounded border border-zinc-700/50">
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

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
              <button 
                onClick={() => handleApply(activeJob)}
                className="w-full bg-[#5865f2] hover:bg-[#4752c4] active:bg-[#3c45a3] text-white py-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition duration-200 shadow-md"
              >
                <span>Apply to this Position</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
