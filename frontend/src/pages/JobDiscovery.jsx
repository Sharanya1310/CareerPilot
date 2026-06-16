import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Search, MapPin, Sparkles, X, Share2, Flag,
  ChevronRight, CheckCircle2, TrendingUp, Cpu, Briefcase,
  Bookmark, ExternalLink, RefreshCw, Zap
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Progress } from '../components/ui/Progress';
import { Button } from '../components/ui/Button';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { api } from '../utils/api';

export default function JobDiscovery() {
  const toast = useToast();
  const { jobs, savedJobs, refreshJobs, saveJob, unsaveJob, addApplication } = useData();

  const [selectedJob, setSelectedJob] = useState(null);
  const [searchInputValue, setSearchInputValue] = useState('');
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('');
  const [searchApiResults, setSearchApiResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [locationFilter, setLocationFilter] = useState('All');
  const [expFilter, setExpFilter] = useState('All');
  const [salaryFilter, setSalaryFilter] = useState('All');
  const [activeFilter, setActiveFilter] = useState(null); // 'location' | 'exp' | 'salary'
  const [filterInput, setFilterInput] = useState('');
  const filterRef = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (filterRef.current && !filterRef.current.contains(e.target)) setActiveFilter(null);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const openFilter = (key, current) => {
    setFilterInput(current === 'All' ? '' : current);
    setActiveFilter(prev => prev === key ? null : key);
  };

  const applyFilter = (key, val) => {
    const v = val.trim() || 'All';
    if (key === 'location') setLocationFilter(v);
    if (key === 'exp') setExpFilter(v);
    if (key === 'salary') setSalaryFilter(v);
    setActiveFilter(null);
  };

  const FILTER_CONFIG = {
    location: { label: 'Location', current: locationFilter, placeholder: 'e.g. Bangalore, Mumbai…', chips: ['Bangalore', 'Hyderabad', 'Mumbai', 'Pune', 'Delhi', 'Chennai', 'Remote'] },
    exp:      { label: 'Experience', current: expFilter,   placeholder: 'e.g. 3-5 Years…',          chips: ['Fresher', '0-1 Years', '1-3 Years', '3-5 Years', '5+ Years'] },
    salary:   { label: 'Salary',    current: salaryFilter, placeholder: 'e.g. ₹12-20 LPA…',        chips: ['₹3-6 LPA', '₹6-12 LPA', '₹12-20 LPA', '₹20-30 LPA', '₹30+ LPA'] },
  };

  // Pagination state
  const JOBS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page to 1 when filters or search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [appliedSearchQuery, remoteOnly, locationFilter, expFilter, salaryFilter]);

  // Resume-based recommendations (fetched fresh from external APIs)
  const [resumeRecs, setResumeRecs] = useState([]);
  const [recsSkills, setRecsSkills] = useState([]);
  const [recsLoading, setRecsLoading] = useState(false);
  const [recsPage, setRecsPage] = useState(1);
  const RECS_PER_PAGE = 4;

  const { recommendedJobs, profile } = useData();

  const fetchRecommendations = useCallback(async () => {
    setRecsLoading(true);
    try {
      const result = await api.getRecommendedJobs();
      // Deduplicate by id, then by title+company
      const seen = new Set();
      const deduped = (result.jobs || []).filter(j => {
        const key = j.id ?? `${j.title}|${j.company}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      setResumeRecs(deduped.length > 0 ? deduped : recommendedJobs);
      setRecsSkills(result.skills || [...(profile.frontendSkills || []), ...(profile.backendSkills || []), ...(profile.toolsSkills || [])]);
      setRecsPage(1);
    } catch (err) {
      console.warn('Could not fetch recommendations, using client-side fallback:', err);
      setResumeRecs(recommendedJobs);
      setRecsSkills([...(profile.frontendSkills || []), ...(profile.backendSkills || []), ...(profile.toolsSkills || [])]);
      setRecsPage(1);
    } finally {
      setRecsLoading(false);
    }
  }, [recommendedJobs, profile]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  // Re-aggregate at most once per hour to backfill URLs and refresh INR salaries
  useEffect(() => {
    const HOUR = 3_600_000;
    const last = parseInt(localStorage.getItem('cp_lastAgg') || '0');
    if (Date.now() - last > HOUR) {
      localStorage.setItem('cp_lastAgg', Date.now().toString());
      api.aggregateJobs()
        .then(() => refreshJobs())
        .catch(console.warn);
    }
  }, [refreshJobs]);

  const isFiltered = !!(appliedSearchQuery || remoteOnly || locationFilter !== 'All' || expFilter !== 'All' || salaryFilter !== 'All');

  const applyNonSearchFilters = (job) => {
    if (remoteOnly) {
      const isRemote = job.workType?.toLowerCase() === 'remote' || job.location?.toLowerCase().includes('remote');
      if (!isRemote) return false;
    }
    if (locationFilter && locationFilter !== 'All') {
      const loc = locationFilter.toLowerCase();
      const matchLoc      = job.location?.toLowerCase().includes(loc);
      const matchWorkType = loc === 'remote' && job.workType?.toLowerCase() === 'remote';
      if (!matchLoc && !matchWorkType) return false;
    }
    if (expFilter && expFilter !== 'All') {
      if (!job.experience?.toLowerCase().includes(expFilter.toLowerCase())) return false;
    }
    if (salaryFilter && salaryFilter !== 'All') {
      if (!job.salary?.toLowerCase().includes(salaryFilter.toLowerCase())) return false;
    }
    return true;
  };

  // When a search query is active, prefer API results; otherwise filter the local jobs cache
  const filteredJobs = isFiltered ? (() => {
    if (appliedSearchQuery && searchApiResults !== null) {
      return searchApiResults.filter(applyNonSearchFilters);
    }
    return jobs.filter(job => {
      if (appliedSearchQuery) {
        const q = appliedSearchQuery.toLowerCase();
        const matchTitle   = job.title?.toLowerCase().includes(q);
        const matchCompany = job.company?.toLowerCase().includes(q);
        const matchTeam    = job.team?.toLowerCase().includes(q);
        const matchDesc    = job.description?.toLowerCase().includes(q);
        if (!matchTitle && !matchCompany && !matchTeam && !matchDesc) return false;
      }
      return applyNonSearchFilters(job);
    });
  })() : [];

  // Pagination calculations
  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * JOBS_PER_PAGE,
    currentPage * JOBS_PER_PAGE
  );

  // Set selected job on load; when filters change keep current if still visible
  useEffect(() => {
    if (filteredJobs.length > 0) {
      const stillAvailable = filteredJobs.find(j => j.id === selectedJob?.id);
      if (!stillAvailable && !resumeRecs.find(j => j.id === selectedJob?.id)) {
        setSelectedJob(filteredJobs[0]);
      }
    } else if (!resumeRecs.find(j => j.id === selectedJob?.id)) {
      setSelectedJob(null);
    }
  }, [jobs, appliedSearchQuery, remoteOnly, locationFilter, expFilter, salaryFilter]);

  const activeJob = selectedJob
    ? filteredJobs.find(j => j.id === selectedJob.id)
      || resumeRecs.find(j => j.id === selectedJob.id)
      || selectedJob
    : null;

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
      toast({ type: 'success', title: 'Added to Tracker', message: `"${job.title}" at ${job.company} moved to Application Tracker.` });
    } catch (err) {
      console.error("Failed to move saved job to tracker:", err);
    }
  };

  const handleSearchSubmit = async (e) => {
    if (e) e.preventDefault();
    const query = searchInputValue.trim();
    setAppliedSearchQuery(query);

    if (!query) {
      setSearchApiResults(null);
      return;
    }

    setSearchLoading(true);
    try {
      const results = await api.getJobs({ search: query });
      setSearchApiResults(Array.isArray(results) ? results : []);
    } catch (err) {
      console.warn('Search API failed, falling back to local filter:', err);
      setSearchApiResults(null);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleApply = (job) => {
    if (job.url) {
      window.open(job.url, '_blank', 'noopener,noreferrer');
    }
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
        <div className={`space-y-6 transition-all duration-300 sticky top-[84px] h-[calc(100vh-120px)] overflow-y-auto pr-1 ${activeJob ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          
          {/* Search bar & Filter Badges Card */}
          <div className="bg-[#0f1115] border border-[#1e222b] rounded-xl p-5 shadow-lg space-y-4">
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={searchInputValue}
                  onChange={(e) => {
                    setSearchInputValue(e.target.value);
                    if (!e.target.value.trim()) { setAppliedSearchQuery(''); setSearchApiResults(null); }
                  }}
                  placeholder="Search Full Stack Developer, Software Engineer..."
                  className="w-full bg-[#161920] border border-[#232936] rounded-lg pl-10 pr-4 py-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition"
                />
              </div>
              <Button type="submit" variant="brand" className="px-5 py-2.5 text-xs h-auto shrink-0 flex items-center gap-1.5" disabled={searchLoading}>
                {searchLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : null}
                {searchLoading ? 'Searching…' : 'Search'}
              </Button>
            </form>
            
            {/* Filter Tags Row + Inline Popover */}
            <div ref={filterRef} className="space-y-2">
              <div className="flex flex-wrap gap-2 items-center">
                {/* Remote toggle */}
                <button
                  onClick={() => setRemoteOnly(!remoteOnly)}
                  className={`text-[10px] px-2.5 py-1 rounded-full transition border ${
                    remoteOnly
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-[#1b1f29] dark:border-indigo-500/30 dark:text-zinc-200'
                      : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:bg-[#161920] dark:border-[#232936] dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-[#1f2430]'
                  }`}
                >
                  Remote Only
                </button>

                {/* Location / Exp / Salary pills */}
                {(['location', 'exp', 'salary']).map(key => {
                  const cfg = FILTER_CONFIG[key];
                  const isActive = cfg.current !== 'All';
                  const isOpen = activeFilter === key;
                  return (
                    <button
                      key={key}
                      onClick={() => openFilter(key, cfg.current)}
                      className={`border text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1.5 transition ${
                        isOpen
                          ? 'bg-indigo-50 border-indigo-400 text-indigo-600 dark:bg-indigo-500/15 dark:border-indigo-500/50 dark:text-indigo-300'
                          : isActive
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-[#1b1f29] dark:border-indigo-500/30 dark:text-zinc-200'
                          : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:bg-[#161920] dark:border-[#232936] dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-[#1f2430]'
                      }`}
                    >
                      <span>{cfg.label}: {cfg.current}</span>
                      {isActive && (
                        <X
                          className="w-3 h-3 text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-white"
                          onClick={e => { e.stopPropagation(); applyFilter(key, ''); }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Inline filter popover */}
              {activeFilter && (() => {
                const cfg = FILTER_CONFIG[activeFilter];
                return (
                  <div className="
                    bg-white border border-slate-200 shadow-lg
                    dark:bg-[#111318] dark:border-[#1e2235] dark:shadow-none
                    rounded-xl p-3 space-y-2 animate-slide-down
                  ">
                    <input
                      autoFocus
                      value={filterInput}
                      onChange={e => setFilterInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') applyFilter(activeFilter, filterInput); if (e.key === 'Escape') setActiveFilter(null); }}
                      placeholder={cfg.placeholder}
                      className="
                        w-full rounded-lg px-3 py-1.5 text-[11px] outline-none transition
                        bg-slate-50 border border-slate-200 text-slate-700 placeholder-slate-400 focus:border-indigo-400
                        dark:bg-[#0d0f1a] dark:border-[#1e2235] dark:text-zinc-200 dark:placeholder-zinc-600 dark:focus:border-indigo-500/50
                      "
                    />
                    <div className="flex flex-wrap gap-1.5">
                      {cfg.chips.map(c => (
                        <button
                          key={c}
                          onClick={() => applyFilter(activeFilter, c)}
                          className="
                            text-[10px] px-2.5 py-1 rounded-full border transition
                            bg-slate-100 border-slate-200 text-slate-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50
                            dark:bg-[#1b1f29] dark:border-[#232936] dark:text-zinc-400 dark:hover:border-indigo-500/40 dark:hover:text-indigo-300
                          "
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Stats bar */}
          <div className="flex items-center gap-3 px-1">
            <div className="flex items-center gap-2 bg-[#0f1115] border border-[#1e222b] rounded-lg px-3 py-2">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="text-xs font-bold text-white">{isFiltered ? filteredJobs.length : jobs.length}</span>
              <span className="text-[10px] text-zinc-500">{isFiltered ? 'results' : 'jobs available'}</span>
            </div>
            <div className="flex items-center gap-2 bg-[#0f1115] border border-[#1e222b] rounded-lg px-3 py-2">
              <Cpu className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span className="text-[10px] text-zinc-400">AI match active</span>
              <Badge variant="success">Live</Badge>
            </div>
          </div>

          {/* ── Search / Filter Results ─────────────────────────────── */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <Search className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                {appliedSearchQuery ? 'Search Results' : 'Search Jobs'}
              </h3>
              {isFiltered && appliedSearchQuery && (
                <span className="text-[10px] text-zinc-600 italic">for "{appliedSearchQuery}"</span>
              )}
            </div>

            {filteredJobs.length === 0 ? (
              <div className="bg-[#0f1115] border border-[#1e222b] rounded-xl p-5 text-center">
                {!appliedSearchQuery ? (
                  <>
                    <p className="text-xs text-zinc-400">Search for jobs to get started.</p>
                    <p className="text-[10px] text-zinc-600 mt-1">Enter a query above to see matching listings.</p>
                  </>
                ) : (
                  <>
                    <p className="text-xs text-zinc-400">No jobs match your search.</p>
                    <p className="text-[10px] text-zinc-600 mt-1">Try different keywords or clear the filters.</p>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-2.5">
                {paginatedJobs.map((job) => {
                  const isSelected = activeJob?.id === job.id;
                  return (
                    <div
                      key={job.id}
                      onClick={() => setSelectedJob(job)}
                      className={`bg-[#0f1115] border p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition duration-200 cursor-pointer ${
                        isSelected
                          ? 'border-indigo-500 shadow-md ring-1 ring-indigo-500/30'
                          : 'border-[#1e222b] hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${job.logoBg || 'bg-blue-600 text-white'}`}>
                          {job.logo || job.company?.substring(0, 1) || 'J'}
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-xs font-semibold text-zinc-100">{job.title}</h4>
                            <span className="text-[9px] text-zinc-500 bg-zinc-800/80 px-1.5 py-0.5 rounded border border-zinc-700/60 shrink-0">
                              {job.posted || 'Recently'}
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-400">
                            {job.company}
                            {job.team ? <span className="text-zinc-600"> • {job.team}</span> : null}
                          </p>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 pt-0.5 text-[10px] text-zinc-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-2.5 h-2.5 text-zinc-600" />
                              {job.location}
                            </span>
                            <span className="text-zinc-700">•</span>
                            <span>{job.experience}</span>
                            <span className="text-zinc-700">•</span>
                            <span className="text-zinc-300 font-medium">{job.salary}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 sm:shrink-0 border-t border-zinc-800/50 sm:border-0 pt-2.5 sm:pt-0">
                        <div className="flex flex-col items-center border border-indigo-500/20 bg-indigo-500/5 px-2 py-1 rounded-lg min-w-[48px] text-center">
                          <span className="text-[11px] font-bold text-indigo-400">{job.match}%</span>
                          <span className="text-[8px] text-zinc-600 uppercase font-semibold tracking-wide">Match</span>
                        </div>
                        <Button
                          variant={isSelected ? 'brand' : 'secondary'}
                          className="h-7 text-[10px] font-semibold py-0 px-3 disabled:opacity-40 disabled:cursor-not-allowed"
                          disabled={!job.url}
                          onClick={(e) => { e.stopPropagation(); handleApply(job); }}
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  );
                })}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-4 border-t border-zinc-800/40">
                    <Button
                      variant="secondary"
                      className="h-8 px-3 text-xs flex items-center gap-1 hover:text-white"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    >
                      &larr; Prev
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                        const isActive = pageNum === currentPage;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
                              isActive
                                ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/60 text-indigo-400 font-bold shadow-md shadow-indigo-500/10'
                                : 'bg-[#161920] border border-[#232936] text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <Button
                      variant="secondary"
                      className="h-8 px-3 text-xs flex items-center gap-1 hover:text-white"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    >
                      Next &rarr;
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Recommended for You (resume-based, from external APIs) ── */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Recommended for You</h3>
                {recsLoading && <span className="text-[10px] text-zinc-500 italic">Fetching…</span>}
              </div>
              <button
                onClick={fetchRecommendations}
                disabled={recsLoading}
                className="flex items-center gap-1 text-[10px] text-zinc-500 hover:text-zinc-300 transition disabled:opacity-40"
              >
                <RefreshCw className={`w-3 h-3 ${recsLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            {recsSkills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 px-1">
                <span className="text-[9px] text-zinc-600 uppercase tracking-wider self-center">Matched on:</span>
                {recsSkills.slice(0, 8).map((sk, i) => (
                  <span key={i} className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">
                    {sk}
                  </span>
                ))}
              </div>
            )}

            {recsLoading ? (
              <div className="space-y-2.5">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-[#0f1115] border border-[#1e222b] rounded-xl p-4 animate-pulse h-16" />
                ))}
              </div>
            ) : resumeRecs.length === 0 ? (
              <div className="bg-[#0f1115] border border-[#1e222b] rounded-xl p-5 text-center">
                <p className="text-xs text-zinc-400">No recommendations yet.</p>
                <p className="text-[10px] text-zinc-600 mt-1">Add skills to your profile or run a resume analysis to get personalised matches.</p>
              </div>
            ) : (() => {
              const totalPages = Math.ceil(resumeRecs.length / RECS_PER_PAGE);
              const pageJobs = resumeRecs.slice((recsPage - 1) * RECS_PER_PAGE, recsPage * RECS_PER_PAGE);
              return (
                <div className="space-y-2.5">
                  {pageJobs.map((job) => {
                    const isSelected = activeJob?.id === job.id;
                    return (
                      <div
                        key={job.id}
                        onClick={() => setSelectedJob(job)}
                        className={`bg-[#0f1115] border p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition duration-200 cursor-pointer ${
                          isSelected
                            ? 'border-amber-500/60 shadow-md ring-1 ring-amber-500/20'
                            : 'border-[#1e222b] hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${job.logoBg || 'bg-zinc-700 text-white'}`}>
                            {job.logo || job.company?.substring(0, 1) || 'J'}
                          </div>
                          <div className="space-y-0.5 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-xs font-semibold text-zinc-100">{job.title}</h4>
                              <span className="text-[9px] text-zinc-500 bg-zinc-800/80 px-1.5 py-0.5 rounded border border-zinc-700/60 shrink-0">
                                {job.posted || 'Recently'}
                              </span>
                            </div>
                            <p className="text-[10px] text-zinc-400">{job.company}</p>
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 pt-0.5 text-[10px] text-zinc-500">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-2.5 h-2.5 text-zinc-600" />
                                {job.location}
                              </span>
                              <span className="text-zinc-700">•</span>
                              <span className="text-zinc-300 font-medium">{job.salary}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 sm:shrink-0 border-t border-zinc-800/50 sm:border-0 pt-2.5 sm:pt-0">
                          <div className="flex flex-col items-center border border-amber-500/20 bg-amber-500/5 px-2 py-1 rounded-lg min-w-[48px] text-center">
                            <span className="text-[11px] font-bold text-amber-400">{job.match}%</span>
                            <span className="text-[8px] text-zinc-600 uppercase font-semibold tracking-wide">Match</span>
                          </div>
                          <Button
                            variant="secondary"
                            className="h-7 text-[10px] font-semibold py-0 px-3 disabled:opacity-40 disabled:cursor-not-allowed"
                            disabled={!job.url}
                            onClick={(e) => { e.stopPropagation(); handleApply(job); }}
                          >
                            Apply
                          </Button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-1.5 pt-1">
                      <button
                        onClick={() => setRecsPage(p => Math.max(1, p - 1))}
                        disabled={recsPage === 1}
                        className="w-7 h-7 rounded-lg text-[10px] font-bold border border-[#232936] bg-[#161920] text-zinc-400 hover:text-zinc-200 hover:bg-[#1f2430] disabled:opacity-30 disabled:cursor-not-allowed transition"
                      >
                        ‹
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <button
                          key={p}
                          onClick={() => setRecsPage(p)}
                          className={`w-7 h-7 rounded-lg text-[10px] font-bold border transition ${
                            p === recsPage
                              ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                              : 'border-[#232936] bg-[#161920] text-zinc-500 hover:text-zinc-200 hover:bg-[#1f2430]'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                      <button
                        onClick={() => setRecsPage(p => Math.min(totalPages, p + 1))}
                        disabled={recsPage === totalPages}
                        className="w-7 h-7 rounded-lg text-[10px] font-bold border border-[#232936] bg-[#161920] text-zinc-400 hover:text-zinc-200 hover:bg-[#1f2430] disabled:opacity-30 disabled:cursor-not-allowed transition"
                      >
                        ›
                      </button>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {/* ── Saved Roles ──────────────────────────────────────────── */}
          {savedJobs.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 px-1">
                <Bookmark className="w-4 h-4 text-zinc-400" />
                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Saved Roles</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {savedJobs.map((role) => (
                  <div key={role.id} className="bg-[#0f1115] border border-[#1e222b] rounded-xl p-3.5 flex items-center justify-between hover:border-zinc-700 transition">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${role.logoBg || 'bg-indigo-600 text-white'}`}>
                        {role.logo || role.company?.substring(0, 1) || 'J'}
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
                ))}
              </div>
            </div>
          )}

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
              {activeJob.url ? (
                <a
                  href={activeJob.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#5865f2] hover:bg-[#4752c4] active:bg-[#3c45a3] text-white py-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition duration-200 shadow-md"
                >
                  <span>Apply to this Position</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <button disabled className="w-full bg-zinc-800 text-zinc-500 py-3 rounded-lg text-xs font-semibold cursor-not-allowed">
                  Link loading — check back shortly
                </button>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
