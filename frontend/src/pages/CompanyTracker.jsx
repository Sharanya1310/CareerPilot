import React, { useState, useEffect } from 'react';
import { 
  Building2, Globe, Star, Plus, Search, Sliders, ChevronRight, Bookmark, 
  MapPin, Clock, Calendar, CheckCircle2, TrendingUp, Sparkles, MoreHorizontal,
  ExternalLink, X
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useData } from '../context/DataContext';

export default function CompanyTracker() {
  const { trackedCompanies, trackCompany, untrackCompany, jobs, applications } = useData();
  const [activeTab, setActiveTab] = useState('Recently Posted');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);

  const jobsList = jobs || [];
  const appsList = applications || [];

  // Client-side search filters for followed companies list
  const filteredTracked = trackedCompanies.filter(comp =>
    comp.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sync selected company object when trackedCompanies refreshes
  useEffect(() => {
    if (selectedCompany) {
      const updated = trackedCompanies.find(c => c.name.toLowerCase() === selectedCompany.name.toLowerCase());
      if (updated) {
        setSelectedCompany(updated);
      }
    }
  }, [trackedCompanies]);

  // Set default selected company on load if followed companies exist
  useEffect(() => {
    if (!selectedCompany && trackedCompanies.length > 0) {
      setSelectedCompany(trackedCompanies[0]);
    }
  }, [trackedCompanies]);

  // Compute dynamic openings list from followed companies (or fallback if empty)
  const followedNames = trackedCompanies.map(c => c.name.toLowerCase());
  const followedCompanyJobs = jobsList.filter(job => 
    followedNames.includes(job.company.toLowerCase())
  );

  const displayJobsList = followedCompanyJobs.length > 0 ? followedCompanyJobs : jobsList;

  // Filter jobs by active tab
  const filteredJobs = displayJobsList.filter(job => {
    if (activeTab === 'Matched for you') {
      return job.match >= 85;
    }
    return true; // Recently Posted tab shows all
  });

  // Analytics aggregations for selected company
  const getSelectedCompanyAnalytics = () => {
    if (!selectedCompany) return { avgMatch: 85, openingsCount: 0, activeAppsCount: 0 };
    
    const compJobs = jobsList.filter(j => j.company.toLowerCase() === selectedCompany.name.toLowerCase());
    const avgMatch = compJobs.length > 0 
      ? Math.round(compJobs.reduce((acc, j) => acc + j.match, 0) / compJobs.length) 
      : 80;

    const openingsCount = compJobs.length > 0 ? compJobs.length : selectedCompany.openings || 2;
    
    const activeAppsCount = appsList.filter(a => 
      a.company.toLowerCase() === selectedCompany.name.toLowerCase()
    ).length;

    return { avgMatch, openingsCount, activeAppsCount };
  };

  const { avgMatch, openingsCount, activeAppsCount } = getSelectedCompanyAnalytics();

  // Dynamic Hiring updates feed based on followed companies list
  const getHiringUpdates = () => {
    if (trackedCompanies.length === 0) {
      return [
        {
          company: "CareerPilot AI",
          text: "Follow your target companies to start receiving hiring Surge updates.",
          time: "Just now",
          logo: "C",
          logoBg: "bg-indigo-600 text-white"
        }
      ];
    }

    return trackedCompanies.map((comp, idx) => {
      const compJobs = jobsList.filter(j => j.company.toLowerCase() === comp.name.toLowerCase());
      const count = compJobs.length > 0 ? compJobs.length : comp.openings || (idx + 1) * 2;
      return {
        company: comp.name,
        text: `${comp.name} has ${count} active opening${count === 1 ? '' : 's'} aligned with your tech stack.`,
        time: `${idx + 1}h ago`,
        logo: comp.name.substring(0, 1),
        logoBg: comp.name === 'Google' ? 'bg-white text-zinc-900 border border-zinc-200' : comp.name === 'Microsoft' ? 'bg-blue-600 text-white' : 'bg-amber-600 text-white'
      };
    });
  };

  const hiringUpdates = getHiringUpdates();

  const handleFollowPrompt = () => {
    const name = prompt("Enter company name to follow (e.g. Stripe, Netflix, Google):");
    if (name && name.trim()) {
      trackCompany(name.trim());
    }
  };

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
                <span className="text-xl font-bold text-white">{trackedCompanies.length}</span>
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
                <span className="text-xl font-bold text-white">{jobsList.length * 2}</span>
                <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-bold tracking-wide uppercase">
                  ~ 12%
                </span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#0f1115] border border-[#1e222b] rounded-xl p-4 flex flex-col justify-between hover:border-zinc-700 transition shadow-sm">
              <div className="flex items-center justify-between text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
                <span>Hiring Surges</span>
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-xl font-bold text-white">{trackedCompanies.length > 0 ? Math.round(trackedCompanies.length / 2) + 1 : 1}</span>
                <span className="text-[9px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20 font-bold tracking-wide uppercase">
                  Surge
                </span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-[#0f1115] border border-[#1e222b] rounded-xl p-4 flex flex-col justify-between hover:border-zinc-700 transition shadow-sm">
              <div className="flex items-center justify-between text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
                <span>Total Jobs Tracked</span>
                <Globe className="w-3.5 h-3.5 text-zinc-400" />
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-xl font-bold text-white">{jobsList.length}</span>
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
                  placeholder="Search followed companies by name..." 
                  className="w-full bg-[#161920] border border-[#232936] rounded-lg pl-10 pr-4 py-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition"
                />
              </div>
              
              <button className="bg-[#09090b] hover:bg-[#1f2430] border border-[#1e222b] text-zinc-400 hover:text-zinc-200 px-4 rounded-lg text-xs font-semibold flex items-center gap-2 transition">
                <Sliders className="w-3.5 h-3.5 text-zinc-500" /> Tech Match
              </button>
            </div>
            
            {/* Suggested quick searches */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mr-1">Suggested Targets:</span>
              
              {['Google', 'Microsoft', 'Amazon', 'Stripe', 'Airbnb'].map((tag) => (
                <div 
                  key={tag}
                  onClick={() => setSearchQuery(tag)}
                  className="bg-[#161920] border border-[#232936] hover:bg-[#1f2430] text-zinc-300 text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1.5 transition cursor-pointer"
                >
                  <div className={`w-2 h-2 rounded-full ${
                    tag === 'Google' ? 'bg-white' : 
                    tag === 'Microsoft' ? 'bg-blue-650' : 
                    tag === 'Amazon' ? 'bg-amber-650' : 
                    tag === 'Stripe' ? 'bg-[#635bff]' : 'bg-[#ff5a5f]'
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
              <button 
                onClick={handleFollowPrompt}
                className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition hover:underline"
              >
                + Follow Company
              </button>
            </div>

            {/* 3 cards company grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {filteredTracked.map((comp) => {
                const isSelected = selectedCompany?.name.toLowerCase() === comp.name.toLowerCase();
                const compJobs = jobsList.filter(j => j.company.toLowerCase() === comp.name.toLowerCase());
                const openings = compJobs.length > 0 ? compJobs.length : comp.openings || 2;
                
                let logoLetter = comp.name.substring(0, 1);
                let logoBg = "bg-zinc-800";
                let logoTextColor = "text-white";
                
                if (comp.name === 'Google') {
                  logoBg = "bg-white";
                  logoTextColor = "text-zinc-900 border border-zinc-200";
                } else if (comp.name === 'Microsoft') {
                  logoBg = "bg-blue-600";
                } else if (comp.name === 'Amazon') {
                  logoBg = "bg-amber-600";
                } else if (comp.name === 'Stripe') {
                  logoBg = "bg-[#635bff]";
                } else if (comp.name === 'Airbnb') {
                  logoBg = "bg-[#ff5a5f]";
                }

                return (
                  <div 
                    key={comp.name} 
                    onClick={() => setSelectedCompany(comp)}
                    className={`bg-[#0f1115] border rounded-xl p-5 space-y-4 hover:border-zinc-700 transition relative cursor-pointer ${
                      isSelected ? 'border-indigo-500 shadow-md ring-1 ring-indigo-500/30' : 'border-[#1e222b]'
                    }`}
                  >
                    {openings > 0 && (
                      <span className="absolute top-4 right-4 text-[9px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 uppercase tracking-wide">
                        {openings} Openings
                      </span>
                    )}

                    <div className="flex items-start gap-3.5">
                      <div className={`w-10 h-10 rounded-xl ${logoBg} flex items-center justify-center font-bold text-lg ${logoTextColor} shadow-sm`}>
                        {logoLetter}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-zinc-100">{comp.name}</h4>
                        <p className="text-[10px] text-zinc-400 mt-0.5">{comp.domain || `${comp.name.toLowerCase().replace(/\s+/g, '')}.com`}</p>
                      </div>
                    </div>

                    <div className="text-[11px] text-zinc-500 flex items-center gap-1.5 pt-1">
                      <Building2 className="w-4 h-4 text-zinc-600" />
                      <span className="text-zinc-300 font-semibold">{openings} Tracked Positions</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1e222b]/50">
                      <Button variant="secondary" className="h-8 text-[11px] font-semibold py-0">
                        View Analytics
                      </Button>
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          untrackCompany(comp.name);
                        }}
                        variant="ghost" 
                        className="h-8 text-[11px] font-semibold py-0 text-zinc-500 hover:text-zinc-350"
                      >
                        Unfollow
                      </Button>
                    </div>
                  </div>
                );
              })}
              
              {/* If search returns 0 results, offer to follow the query */}
              {filteredTracked.length === 0 && searchQuery.trim() !== "" && (
                <div className="bg-[#0f1115] border border-dashed border-[#232936] rounded-xl p-5 flex flex-col items-center justify-center text-center space-y-3 col-span-3 py-8 hover:border-zinc-700 transition">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center font-bold text-lg text-indigo-400 border border-indigo-500/20">
                    {searchQuery.substring(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-100">Follow "{searchQuery}"?</h4>
                    <p className="text-[10px] text-zinc-400 mt-1">Track openings, news, and tech stacks for this company.</p>
                  </div>
                  <Button 
                    onClick={() => {
                      trackCompany(searchQuery.trim());
                      setSearchQuery('');
                    }}
                    variant="brand" 
                    className="h-8 text-[11px] font-semibold px-4"
                  >
                    Follow Company
                  </Button>
                </div>
              )}

              {trackedCompanies.length === 0 && searchQuery.trim() === "" && (
                <p className="text-xs text-zinc-500 italic py-4 col-span-3 text-center">No companies followed yet. Click "+ Follow Company" above to add.</p>
              )}
            </div>
          </div>

          {/* Latest Openings Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#1e222b] pb-2 px-1">
              <h3 className="text-sm font-bold text-zinc-100">Company Openings</h3>
              
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
              {filteredJobs.length === 0 ? (
                <p className="text-xs text-zinc-500 italic py-4 pl-1">No openings matching requirements.</p>
              ) : (
                filteredJobs.map((job) => (
                  <div 
                    key={job.id} 
                    className="bg-[#0f1115] border border-[#1e222b] rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-zinc-700 transition"
                  >
                    
                    <div className="flex items-start gap-4">
                      {/* Company Logo Indicator */}
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 ${
                        job.logoBg || 'bg-blue-600 text-white'
                      }`}>
                        {job.logo || job.company.substring(0, 1)}
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
                        <p className="text-[11px] text-zinc-350 font-semibold pt-1">
                          {job.salary}
                        </p>
                      </div>
                    </div>

                    {/* Right hand details and actions */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full md:w-auto gap-4 pt-3 md:pt-0 border-t border-[#1e222b]/50 md:border-t-0">
                      <div className="text-left md:text-right">
                        <p className="text-[9px] text-zinc-550">{job.posted || 'Just now'}</p>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 mt-1 uppercase tracking-wide">
                          {job.match}% Match
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5 w-full sm:w-auto">
                        <Button 
                          onClick={() => {
                            const matchedComp = trackedCompanies.find(c => c.name.toLowerCase() === job.company.toLowerCase());
                            if (matchedComp) {
                              setSelectedCompany(matchedComp);
                            } else {
                              setSelectedCompany({
                                name: job.company,
                                domain: `${job.company.toLowerCase().replace(/\s+/g, '')}.com`,
                                openings: 1
                              });
                            }
                          }}
                          variant="secondary" 
                          className="h-8 text-[11px] font-semibold flex-1 sm:flex-none"
                        >
                          View Company
                        </Button>
                      </div>
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right Side: Detailed Company Overview & Analytics (OR default Updates/Insights Feed) */}
        <div className="lg:col-span-1 space-y-6">
          
          {selectedCompany ? (
            <div className="bg-[#0f1115] border border-[#1e222b] rounded-xl p-5 shadow-sm space-y-5 flex flex-col sticky top-[84px] max-h-[calc(100vh-120px)] overflow-y-auto">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#1e222b] pb-3 flex-shrink-0">
                <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  Company Details
                </h3>
                
                <button 
                  onClick={() => setSelectedCompany(null)}
                  className="text-zinc-500 hover:text-zinc-300 p-1 rounded hover:bg-[#161920] transition"
                  title="Close details"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Overview Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm ${
                    selectedCompany.name === 'Google' ? 'bg-white text-zinc-900 border border-zinc-200' : 'bg-blue-600 text-white'
                  }`}>
                    {selectedCompany.name.substring(0, 1)}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-zinc-100 leading-none">{selectedCompany.name}</h4>
                    <p className="text-[10px] text-zinc-400 mt-1.5">{selectedCompany.domain || `${selectedCompany.name.toLowerCase().replace(/\s+/g, '')}.com`}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Overview</p>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {selectedCompany.name === 'Google' 
                      ? "Google's mission is to organize the world's information and make it universally accessible and useful. Known for search, cloud computing, online advertising technologies, and hardware."
                      : selectedCompany.name === 'Microsoft'
                      ? "Microsoft enables digital transformation for the era of an intelligent cloud and an intelligent edge. Its mission is to empower every person and every organization on the planet to achieve more."
                      : selectedCompany.name === 'Stripe'
                      ? "Stripe is a financial infrastructure platform for the internet. Millions of businesses—from startup ventures to large enterprises—use Stripe to accept payments, send payouts, and manage online businesses."
                      : selectedCompany.name === 'Airbnb'
                      ? "Airbnb operates an online marketplace for lodging, primarily homestays for vacation rentals, and tourism activities. Based in San Francisco, California, the platform is accessible via website and mobile app."
                      : `${selectedCompany.name} is a high-preference target company tracked in your career pipeline. Follow to see surges, technology alignments, and open roles.`
                    }
                  </p>
                </div>
              </div>

              {/* Company Analytics Widget */}
              <div className="bg-[#13161c] border border-[#232936] rounded-xl p-4 space-y-4">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider">Company Analytics</h3>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Match Strength</span>
                    <span className="font-semibold text-indigo-400">{avgMatch}%</span>
                  </div>
                  <div className="w-full bg-[#1b1f29] rounded-full h-1.5">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full" 
                      style={{ width: `${avgMatch}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-zinc-500 block text-[9px] uppercase font-semibold">Openings</span>
                    <span className="text-zinc-200 font-semibold">{openingsCount} active</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[9px] uppercase font-semibold">Applications</span>
                    <span className="text-zinc-200 font-semibold">{activeAppsCount} tracked</span>
                  </div>
                </div>
              </div>

              {/* highlights details */}
              <div className="space-y-3">
                <h5 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Target Highlights</h5>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#161920] border border-[#232936] rounded p-2.5">
                    <span className="text-zinc-500 block text-[9px] uppercase font-semibold">Rating</span>
                    <span className="text-zinc-200 font-medium">{selectedCompany.name === 'Google' ? '4.6 ★' : '4.4 ★'}</span>
                  </div>
                  <div className="bg-[#161920] border border-[#232936] rounded p-2.5">
                    <span className="text-zinc-500 block text-[9px] uppercase font-semibold">Industry</span>
                    <span className="text-zinc-200 font-medium truncate block">
                      {selectedCompany.name === 'Google' ? 'Cloud & Search' : selectedCompany.name === 'Microsoft' ? 'Software & Games' : 'Technology'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-[#1e222b]">
                <button 
                  onClick={() => {
                    untrackCompany(selectedCompany.name);
                    setSelectedCompany(null);
                  }}
                  className="w-full bg-[#1b1f29] hover:bg-red-900/20 hover:text-red-400 hover:border-red-950 border border-[#232936] text-zinc-300 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <span>Unfollow Company</span>
                </button>
              </div>

            </div>
          ) : (
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
                {hiringUpdates.map((update, idx) => (
                  <div key={idx} className={`flex items-start gap-3 ${idx > 0 ? 'border-t border-[#1e222b]/50 pt-3' : ''}`}>
                    <div className={`w-7 h-7 rounded flex items-center justify-center font-bold text-xs flex-shrink-0 ${update.logoBg || 'bg-zinc-800 text-white'}`}>
                      {update.logo || 'C'}
                    </div>
                    <div>
                      <p className="text-xs text-zinc-300 leading-snug">
                        <span className="font-semibold text-zinc-100">{update.company}</span>: {update.text}
                      </p>
                      <span className="text-[9px] text-zinc-500 mt-1 block">{update.time}</span>
                    </div>
                  </div>
                ))}

                {/* AI Insight Box card matching mockup */}
                <div className="bg-[#13161c] border border-[#232936] rounded-xl p-4 space-y-3 shadow-inner relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-indigo-500" />
                  
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-wider">AI Insight</span>
                  </div>
                  
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Based on your profile, tech companies in Bangalore are seeing a 24% surge in TypeScript and Node.js openings.
                  </p>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
