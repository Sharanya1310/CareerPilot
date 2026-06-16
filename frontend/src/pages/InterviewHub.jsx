import { useState } from 'react';
import {
  CalendarDays, Plus, Search, ChevronRight,
  CheckCircle2, PenSquare,
  Award, Globe, BookOpen, X, ChevronDown
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';

export default function InterviewHub() {
  const toast = useToast();
  const { experiences, trendingCompanies, addExperience } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [expandedExperienceId, setExpandedExperienceId] = useState(null);

  // Modal form states
  const [showPostModal, setShowPostModal] = useState(false);
  const [formCompany, setFormCompany] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formDifficulty, setFormDifficulty] = useState('Medium');
  const [formOutcome, setFormOutcome] = useState('Selected');
  const [formTags, setFormTags] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formRounds, setFormRounds] = useState([
    { title: 'Round 1: Technical Screening', focus: 'Basic algorithms, data structures, and resume review' }
  ]);
  const [formPrepTips, setFormPrepTips] = useState('');

  // Filtering experiences list
  const filteredExperiences = experiences.filter(exp => {
    // 1. Search Query Match
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchComp = exp.company?.toLowerCase().includes(q);
      const matchRole = exp.role?.toLowerCase().includes(q);
      const matchDesc = exp.description?.toLowerCase().includes(q);
      const matchTags = exp.tags?.some(tag => tag.toLowerCase().includes(q));
      if (!matchComp && !matchRole && !matchDesc && !matchTags) return false;
    }

    // 2. Difficulty Filter Match
    if (difficultyFilter !== 'All') {
      if (exp.difficulty?.toLowerCase() !== difficultyFilter.toLowerCase()) return false;
    }

    return true;
  });

  const handleAddRoundField = () => {
    setFormRounds([
      ...formRounds,
      { title: `Round ${formRounds.length + 1}: `, focus: '' }
    ]);
  };

  const handleRoundFieldChange = (index, field, value) => {
    const updated = formRounds.map((r, i) => i === index ? { ...r, [field]: value } : r);
    setFormRounds(updated);
  };

  const handleRemoveRoundField = (index) => {
    setFormRounds(formRounds.filter((_, i) => i !== index));
  };

  const handleSubmitExperience = async (e) => {
    e.preventDefault();
    if (!formCompany || !formRole || !formDescription) {
      toast({ type: 'error', title: 'Missing fields', message: 'Please fill out Company, Role, and Description.' });
      return;
    }

    // Process tags
    const processedTags = formTags
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean)
      .map(tag => tag.startsWith('#') ? tag : `#${tag}`);

    // Process prep tips
    const processedTips = formPrepTips
      .split('\n')
      .map(tip => tip.trim())
      .filter(Boolean);

    const payload = {
      company: formCompany,
      role: formRole,
      difficulty: formDifficulty,
      outcome: formOutcome,
      tags: processedTags,
      description: formDescription,
      rounds: formRounds.filter(r => r.title.trim() !== ''),
      prepTips: processedTips
    };

    try {
      await addExperience(payload);
      setShowPostModal(false);
      // Reset form
      setFormCompany('');
      setFormRole('');
      setFormDifficulty('Medium');
      setFormOutcome('Selected');
      setFormTags('');
      setFormDescription('');
      setFormRounds([{ title: 'Round 1: Technical Screening', focus: 'Basic algorithms, data structures, and resume review' }]);
      setFormPrepTips('');
      toast({ type: 'success', title: 'Experience posted!', message: 'Your interview experience has been shared.' });
    } catch (err) {
      toast({ type: 'error', title: 'Submission failed', message: 'Make sure you are logged in and try again.' });
    }
  };

  const handleTrendingCompanyClick = (companyName) => {
    setSearchQuery(companyName);
  };

  const handleToggleExpand = (id) => {
    setExpandedExperienceId(expandedExperienceId === id ? null : id);
  };

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
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-[10px] text-zinc-300 bg-[#09090b] hover:bg-[#161920] border border-[#1e222b] px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition"
                >
                  <span>Reset Search</span>
                </button>
                <button 
                  onClick={() => setDifficultyFilter('All')}
                  className={`text-[9px] font-bold px-2.5 py-1 rounded-full border transition ${
                    difficultyFilter === 'All' 
                      ? 'bg-zinc-700/35 text-zinc-200 border-zinc-500' 
                      : 'bg-[#161920] border-[#232936] text-zinc-400 hover:text-zinc-200 hover:bg-[#1f2430]'
                  }`}
                >
                  All Difficulties
                </button>
              </div>

              {/* Difficulty level chips */}
              <div className="flex items-center gap-2">
                {['Easy', 'Medium', 'Hard', 'Extreme'].map((diff) => {
                  const isActive = difficultyFilter === diff;
                  let colorClass = 'bg-zinc-800 border-[#232936] text-zinc-400 hover:text-zinc-200 hover:bg-[#1f2430]';
                  if (isActive) {
                    if (diff === 'Easy') colorClass = 'bg-blue-500/10 text-blue-400 border-blue-500/30';
                    else if (diff === 'Medium') colorClass = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
                    else if (diff === 'Hard') colorClass = 'bg-red-500/10 text-red-400 border-red-500/30';
                    else if (diff === 'Extreme') colorClass = 'bg-purple-500/10 text-purple-400 border-purple-500/30';
                  }

                  return (
                    <button 
                      key={diff}
                      onClick={() => setDifficultyFilter(diff)}
                      className={`text-[9px] font-bold px-2.5 py-1 rounded-full border transition ${colorClass}`}
                    >
                      {diff}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Trending Companies Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Trending Companies</h3>
              <button 
                onClick={() => setSearchQuery('')} 
                className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition"
              >
                Clear Filter
              </button>
            </div>

            {/* Trending company list */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {trendingCompanies.map((comp) => (
                <div 
                  key={comp.name} 
                  onClick={() => handleTrendingCompanyClick(comp.name)}
                  className="bg-[#0f1115] border border-[#1e222b] rounded-xl p-4 space-y-3.5 hover:border-zinc-700 transition cursor-pointer relative"
                >
                  <span className={`absolute top-4 right-4 w-1.5 h-1.5 rounded-full ${comp.dotColor || 'bg-emerald-500'}`} />
                  
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${comp.bg || 'bg-zinc-800 text-white'}`}>
                    {comp.logo || comp.name.substring(0,1)}
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
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Crowdsourced Experiences</h3>
              <span className="text-[10px] text-zinc-500 font-semibold">{filteredExperiences.length} Experiences Found</span>
            </div>

            <div className="space-y-4">
              {filteredExperiences.map((exp) => {
                const isExpanded = expandedExperienceId === exp.id;
                
                // Color difficulty mapping
                let diffBadge = "bg-amber-500/10 text-amber-400 border border-amber-500/20";
                if (exp.difficulty === 'Easy') diffBadge = "bg-blue-500/10 text-blue-400 border border-blue-500/20";
                else if (exp.difficulty === 'Hard') diffBadge = "bg-red-500/10 text-red-400 border border-red-500/20";
                else if (exp.difficulty === 'Extreme') diffBadge = "bg-purple-500/10 text-purple-400 border border-purple-500/20";

                let logoBg = "bg-zinc-800";
                let logoText = "text-white";
                if (exp.company.toLowerCase() === 'google') {
                  logoBg = "bg-white";
                  logoText = "text-zinc-900 border border-zinc-200 shadow-sm";
                } else if (exp.company.toLowerCase() === 'microsoft') {
                  logoBg = "bg-blue-600";
                } else if (exp.company.toLowerCase() === 'accenture') {
                  logoBg = "bg-purple-650/10 text-purple-400 border border-purple-500/20";
                } else if (exp.company.toLowerCase() === 'amazon') {
                  logoBg = "bg-amber-600/15 text-amber-500 border border-amber-500/20";
                }

                return (
                  <div key={exp.id} className="bg-[#0f1115] border border-[#1e222b] rounded-xl p-5 space-y-4 hover:border-zinc-700 transition">
                    
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm ${logoBg} ${logoText}`}>
                          {exp.company.substring(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-zinc-100">{exp.role}</h4>
                          <p className="text-[10px] text-zinc-400 mt-0.5">{exp.company} • Outcome: <span className="text-emerald-400 font-semibold">{exp.outcome}</span></p>
                        </div>
                      </div>
                      <span className={`text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded ${diffBadge}`}>
                        {exp.difficulty}
                      </span>
                    </div>

                    {/* Tags */}
                    {exp.tags && exp.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {exp.tags.map((tag) => (
                          <span key={tag} className="text-[9px] font-medium text-zinc-500 bg-[#161920] px-2 py-0.5 rounded border border-[#232936]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {exp.description}
                    </p>

                    {/* Expansion details rounds */}
                    {isExpanded && (
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 pt-3 border-t border-[#1e222b]/50">
                        {/* Roadmap of rounds */}
                        <div className="md:col-span-3 space-y-3">
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Interview Rounds Breakdown</span>
                          
                          {exp.rounds && exp.rounds.length > 0 ? (
                            <div className="relative pl-5 border-l border-zinc-800 space-y-4">
                              {exp.rounds.map((round, rIdx) => (
                                <div key={round.id || rIdx} className="relative">
                                  <div className="absolute -left-[24.5px] top-0.5 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-[#0f1115]" />
                                  <h5 className="text-[11px] font-semibold text-zinc-200">{round.title}</h5>
                                  <p className="text-[10px] text-zinc-400 mt-0.5">{round.focus}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[10px] text-zinc-500 italic">No detailed rounds specified.</p>
                          )}
                        </div>

                        {/* Tips */}
                        <div className="md:col-span-2 bg-[#13161c] border border-[#232936] rounded-xl p-4 space-y-3">
                          <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider block flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-zinc-500" />
                            Preparation Advice
                          </span>
                          {exp.prepTips && exp.prepTips.length > 0 ? (
                            <ul className="space-y-2">
                              {exp.prepTips.map((tip, tIdx) => (
                                <li key={tIdx} className="flex items-start gap-2 text-[10px] text-zinc-400 leading-relaxed">
                                  <CheckCircle2 className="w-3 h-3 text-indigo-500 mt-0.5 flex-shrink-0" />
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-[10px] text-zinc-500 italic">No prep advice provided.</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end border-t border-[#1e222b]/50 pt-4 text-[10px]">
                      <button
                        onClick={() => handleToggleExpand(exp.id)}
                        className="text-indigo-400 hover:text-indigo-300 font-bold transition flex items-center gap-0.5"
                      >
                        <span>{isExpanded ? 'Collapse' : 'Read Rounds Details'}</span>
                        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Side: Share Journey, Recommended, Recent Activity */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Share Your Journey Card */}
          <div className="bg-[#0f1115] border border-[#1e222b] rounded-xl p-5 space-y-4 shadow-sm text-center">
            <div className="space-y-1.5 text-left">
              <h3 className="text-sm font-bold text-zinc-100">Share Your Journey</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Your experience can be the bridge for someone else's career success.
              </p>
            </div>
            <Button 
              onClick={() => setShowPostModal(true)}
              variant="brand" 
              className="h-9 w-full text-xs font-semibold gap-1.5"
            >
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
              <div 
                onClick={() => setSearchQuery('Amazon')}
                className="flex items-start justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded bg-[#ff9900]/15 text-[#ff9900] border border-[#ff9900]/25 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    Am
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-zinc-200 group-hover:text-zinc-100 transition">SDE-II at Amazon</h4>
                    <p className="text-[9px] text-zinc-500 mt-0.5">Explore target stack prep</p>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 transition mt-1" />
              </div>

              <div 
                onClick={() => setSearchQuery('Meta')}
                className="flex items-start justify-between group cursor-pointer border-t border-[#1e222b]/50 pt-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    Me
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-zinc-200 group-hover:text-zinc-100 transition">Designer at Meta</h4>
                    <p className="text-[9px] text-zinc-500 mt-0.5">Explore design roadmap</p>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 transition mt-1" />
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
              <div className="flex gap-2.5">
                <div className="w-6 h-6 rounded-full bg-indigo-900/50 flex items-center justify-center text-[8px] font-bold text-indigo-300 flex-shrink-0">
                  RK
                </div>
                <div>
                  <p className="text-[11px] text-zinc-300 leading-snug">
                    <span className="font-semibold text-zinc-200">Rahul K.</span> shared an interview for <span className="font-medium text-zinc-100">Accenture</span>.
                  </p>
                  <span className="text-[8px] text-zinc-500 block mt-0.5">15 mins ago</span>
                </div>
              </div>

              <div className="flex gap-2.5 border-t border-[#1e222b]/50 pt-3.5">
                <div className="w-6 h-6 rounded-full bg-amber-900/40 flex items-center justify-center text-[8px] font-bold text-amber-300 flex-shrink-0">
                  SW
                </div>
                <div>
                  <p className="text-[11px] text-zinc-300 leading-snug">
                    <span className="font-semibold text-zinc-200">Sarah W.</span> upvoted <span className="font-medium text-zinc-100">Google Data Scientist</span>.
                  </p>
                  <span className="text-[8px] text-zinc-500 block mt-0.5">42 mins ago</span>
                </div>
              </div>

              <div className="flex gap-2.5 border-t border-[#1e222b]/50 pt-3.5">
                <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[8px] font-bold text-zinc-400 flex-shrink-0">
                  An
                </div>
                <div>
                  <p className="text-[11px] text-zinc-300 leading-snug">
                    <span className="font-semibold text-zinc-200">Anonymous</span> posted a tip for <span className="font-medium text-zinc-100">Microsoft Azure</span>.
                  </p>
                  <span className="text-[8px] text-zinc-500 block mt-0.5">2 hours ago</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* MODAL FORM: POST MY EXPERIENCE */}
      {showPostModal && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-16 px-4 pb-4" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPostModal(false)} />

          {/* Modal */}
          <div className="relative bg-[#0f1115] border border-[#1e222b] rounded-xl w-full max-w-2xl shadow-2xl flex flex-col animate-scale-in"
               style={{ maxHeight: 'calc(100vh - 2rem)' }}>

            {/* Sticky Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e222b] flex-shrink-0">
              <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-1.5">
                <PenSquare className="w-4 h-4 text-indigo-400" />
                Share Interview Experience
              </h2>
              <button
                onClick={() => setShowPostModal(false)}
                className="text-zinc-500 hover:text-zinc-300 transition p-1.5 rounded hover:bg-[#161920]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmitExperience} className="flex flex-col flex-1 min-h-0">
              <div className="overflow-y-auto flex-1 px-5 py-4 space-y-3.5">

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Company *</label>
                    <input
                      type="text" required value={formCompany}
                      onChange={e => setFormCompany(e.target.value)}
                      placeholder="Google, Microsoft…"
                      className="w-full bg-[#161920] border border-[#232936] rounded px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Role *</label>
                    <input
                      type="text" required value={formRole}
                      onChange={e => setFormRole(e.target.value)}
                      placeholder="Software Engineer…"
                      className="w-full bg-[#161920] border border-[#232936] rounded px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Difficulty</label>
                    <select value={formDifficulty} onChange={e => setFormDifficulty(e.target.value)}
                      className="w-full bg-[#161920] border border-[#232936] rounded px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600 transition">
                      <option>Easy</option><option>Medium</option><option>Hard</option><option>Extreme</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Outcome</label>
                    <select value={formOutcome} onChange={e => setFormOutcome(e.target.value)}
                      className="w-full bg-[#161920] border border-[#232936] rounded px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600 transition">
                      <option>Selected</option><option>Rejected</option><option>No Offer</option><option>Pending</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Tags (comma-separated)</label>
                  <input type="text" value={formTags} onChange={e => setFormTags(e.target.value)}
                    placeholder="Frontend, React, JavaScript"
                    className="w-full bg-[#161920] border border-[#232936] rounded px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Description *</label>
                  <textarea required rows="2" value={formDescription} onChange={e => setFormDescription(e.target.value)}
                    placeholder="Describe the overall process, timeline, and feel…"
                    className="w-full bg-[#161920] border border-[#232936] rounded px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition resize-none"
                  />
                </div>

                {/* Interview Rounds */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Interview Rounds</span>
                    <button type="button" onClick={handleAddRoundField}
                      className="text-[9px] font-bold text-indigo-400 hover:text-indigo-300 transition flex items-center gap-1">
                      <Plus className="w-3 h-3" /> Add Round
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formRounds.map((round, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 items-center bg-[#13161c] border border-[#232936] px-3 py-2 rounded">
                        <div className="col-span-5">
                          <input type="text" value={round.title}
                            onChange={e => handleRoundFieldChange(index, 'title', e.target.value)}
                            placeholder="Round 1: Screening…"
                            className="w-full bg-[#161920] border border-[#232936] rounded px-2 py-1 text-[11px] text-zinc-200 placeholder-zinc-600 focus:outline-none"
                          />
                        </div>
                        <div className="col-span-6">
                          <input type="text" value={round.focus}
                            onChange={e => handleRoundFieldChange(index, 'focus', e.target.value)}
                            placeholder="Topics covered…"
                            className="w-full bg-[#161920] border border-[#232936] rounded px-2 py-1 text-[11px] text-zinc-200 placeholder-zinc-600 focus:outline-none"
                          />
                        </div>
                        <div className="col-span-1 flex justify-center">
                          <button type="button" onClick={() => handleRemoveRoundField(index)}
                            className="text-zinc-600 hover:text-red-400 transition">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Prep Tips (one per line)</label>
                  <textarea rows="2" value={formPrepTips} onChange={e => setFormPrepTips(e.target.value)}
                    placeholder={"LeetCode Medium-Hard was key\nStudy core company principles"}
                    className="w-full bg-[#161920] border border-[#232936] rounded px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition resize-none"
                  />
                </div>

              </div>

              {/* Sticky Footer */}
              <div className="flex gap-3 justify-end px-5 py-3.5 border-t border-[#1e222b] flex-shrink-0">
                <Button type="button" onClick={() => setShowPostModal(false)} variant="secondary" className="h-8 font-semibold text-xs py-0">
                  Cancel
                </Button>
                <Button type="submit" variant="brand" className="h-8 font-semibold text-xs py-0">
                  Post Experience
                </Button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
