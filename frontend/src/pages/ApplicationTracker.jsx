import React, { useState } from 'react';
import { 
  Search, Plus, Bell, Filter, Clock, AlertTriangle, 
  Users, Calendar, FileText, ChevronRight, Download, MoreHorizontal,
  ArrowUpRight, CheckCircle2, TrendingUp, Sparkles, Star, ThumbsUp, ThumbsDown, Video, FolderOpen,
  Briefcase, X
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useData } from '../context/DataContext';

export default function ApplicationTracker() {
  const { 
    applications, addApplication, updateApplicationStage, deleteApplication, stats 
  } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newCategory, setNewCategory] = useState('Engineering');
  const [newStage, setNewStage] = useState('Applied');
  const [newDeadline, setNewDeadline] = useState('2d left');
  const [newInterviewer, setNewInterviewer] = useState('');

  // Heatmap configuration
  const heatmapRows = 7;
  const heatmapCols = 44; 
  
  const getHeatmapColor = (w, d) => {
    const val = (w * 5 + d * 3) % 13;
    if (val === 0 || val === 4 || val === 8) return 'bg-zinc-100 dark:bg-[#161920] border border-zinc-200 dark:border-zinc-900'; 
    if (val === 1 || val === 5 || val === 9) return 'bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200/50 dark:border-indigo-950/20';
    if (val === 2 || val === 6 || val === 10) return 'bg-indigo-300 dark:bg-indigo-800/40 border border-indigo-300/30 dark:border-indigo-800/10';
    if (val === 3 || val === 7 || val === 11) return 'bg-indigo-500/80 dark:bg-indigo-600/70 border border-indigo-500/40 dark:border-indigo-600/20';
    return 'bg-indigo-600 dark:bg-indigo-500 border border-indigo-600/20 dark:border-indigo-400/20'; 
  };

  const activeStatus = stats.activeStatus || { applied: 0, oa: 0, interview: 0, offer: 0 };
  const totalAppsCount = applications.length;

  const funnelStages = [
    { label: "Applied", percentage: totalAppsCount > 0 ? Math.round((activeStatus.applied / totalAppsCount) * 100) : 0, color: "bg-indigo-600" },
    { label: "Assessment", percentage: totalAppsCount > 0 ? Math.round((activeStatus.oa / totalAppsCount) * 100) : 0, color: "bg-indigo-500/80" },
    { label: "Interview", percentage: totalAppsCount > 0 ? Math.round((activeStatus.interview / totalAppsCount) * 100) : 0, color: "bg-indigo-400/60" },
    { label: "Offer", percentage: totalAppsCount > 0 ? Math.round((activeStatus.offer / totalAppsCount) * 100) : 0, color: "bg-indigo-300/40" }
  ];

  // Filter applications by search query
  const filteredApps = applications.filter(app => {
    const term = searchQuery.toLowerCase();
    return (
      app.company.toLowerCase().includes(term) ||
      app.role.toLowerCase().includes(term) ||
      app.category.toLowerCase().includes(term)
    );
  });

  const appliedCards = filteredApps.filter(a => a.stage === 'Applied');
  const assessmentCards = filteredApps.filter(a => a.stage === 'Assessment' || a.stage === 'OA');
  const interviewCards = filteredApps.filter(a => a.stage === 'Interview');
  const offerCards = filteredApps.filter(a => a.stage === 'Offer');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newCompany || !newRole) {
      alert("Company and Role are required.");
      return;
    }
    
    await addApplication({
      company: newCompany,
      role: newRole,
      stage: newStage,
      category: newCategory,
      deadline: newDeadline,
      interviewer: newInterviewer,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      timeline: `Applied on ${new Date().toLocaleDateString()}`
    });

    // Reset Form
    setNewCompany('');
    setNewRole('');
    setNewCategory('Engineering');
    setNewStage('Applied');
    setNewDeadline('2d left');
    setNewInterviewer('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 relative">
      
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
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80" 
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
              {totalAppsCount} active applications this season
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
          <h2 className="text-base font-black text-zinc-850 dark:text-zinc-100">Live Pipeline</h2>
          
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

        <div className="flex items-center gap-2.5">
          <Button 
            onClick={() => setIsModalOpen(true)}
            variant="brand" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-8 px-4 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" /> New Application
          </Button>
        </div>
      </div>

      {/* Kanban Board Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-start">
        
        {/* Applied Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#e2e8f0] dark:border-[#1e222b] pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Applied</span>
              <span className="text-[9px] bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-2 py-0.5 rounded-full font-black">{appliedCards.length}</span>
            </div>
          </div>

          <div className="space-y-4">
            {appliedCards.map(app => (
              <KanbanCard 
                key={app.id} 
                app={app} 
                onStageChange={updateApplicationStage} 
                onDelete={deleteApplication} 
              />
            ))}
            {appliedCards.length === 0 && (
              <p className="text-[10px] text-zinc-500 italic text-center py-4">No applied roles</p>
            )}
          </div>
        </div>

        {/* Assessment Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#e2e8f0] dark:border-[#1e222b] pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Assessment</span>
              <span className="text-[9px] bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-2 py-0.5 rounded-full font-black">{assessmentCards.length}</span>
            </div>
          </div>

          <div className="space-y-4">
            {assessmentCards.map(app => (
              <KanbanCard 
                key={app.id} 
                app={app} 
                onStageChange={updateApplicationStage} 
                onDelete={deleteApplication} 
              />
            ))}
            {assessmentCards.length === 0 && (
              <p className="text-[10px] text-zinc-500 italic text-center py-4">No assessments</p>
            )}
          </div>
        </div>

        {/* Interview Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#e2e8f0] dark:border-[#1e222b] pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Interview</span>
              <span className="text-[9px] bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-2 py-0.5 rounded-full font-black">{interviewCards.length}</span>
            </div>
          </div>

          <div className="space-y-4">
            {interviewCards.map(app => (
              <KanbanCard 
                key={app.id} 
                app={app} 
                onStageChange={updateApplicationStage} 
                onDelete={deleteApplication} 
              />
            ))}
            {interviewCards.length === 0 && (
              <p className="text-[10px] text-zinc-500 italic text-center py-4">No interviews</p>
            )}
          </div>
        </div>

        {/* Offer Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#e2e8f0] dark:border-[#1e222b] pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Offer</span>
              <span className="text-[9px] bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-2 py-0.5 rounded-full font-black">{offerCards.length}</span>
            </div>
          </div>

          <div className="space-y-4">
            {offerCards.map(app => (
              <KanbanCard 
                key={app.id} 
                app={app} 
                onStageChange={updateApplicationStage} 
                onDelete={deleteApplication} 
              />
            ))}
            {offerCards.length === 0 && (
              <p className="text-[10px] text-zinc-500 italic text-center py-4">No offers received yet</p>
            )}
          </div>
        </div>

      </div>

      {/* Floating Glassmorphic Modal Dialog Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0f1115] border border-[#1e222b] rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            
            <div className="flex justify-between items-center pb-2 border-b border-[#1e222b]">
              <h3 className="text-sm font-bold text-zinc-150 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-400" />
                Add New Application
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-500 hover:text-zinc-300 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Company</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Google, Stripe"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full bg-[#161920] border border-[#232936] rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Job Role</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Full Stack Engineer"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full bg-[#161920] border border-[#232936] rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Pipeline Stage</label>
                  <select 
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value)}
                    className="w-full bg-[#161920] border border-[#232936] rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 transition"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Assessment">Assessment</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Tag / Focus</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Engineering, Design"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-[#161920] border border-[#232936] rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Deadline / Timing</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 2d left, Tomorrow"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full bg-[#161920] border border-[#232936] rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Interviewer (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Sarah K."
                    value={newInterviewer}
                    onChange={(e) => setNewInterviewer(e.target.value)}
                    className="w-full bg-[#161920] border border-[#232936] rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setIsModalOpen(false)}
                  className="w-full h-9 rounded-xl border border-[#232936] hover:bg-[#161920] text-zinc-400 text-xs font-semibold"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="brand" 
                  className="w-full h-9 rounded-xl bg-indigo-650 hover:bg-indigo-750 text-white text-xs font-semibold shadow"
                >
                  Add Card
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// Kanban Card Component
function KanbanCard({ app, onStageChange, onDelete }) {
  return (
    <div className="bg-white dark:bg-[#0f1115] border border-[#e2e8f0] dark:border-[#1e222b] hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all p-4 rounded-2xl shadow-sm space-y-3 cursor-pointer group">
      <div className="flex justify-between items-center">
        <span className="text-[9px] font-black text-indigo-500 uppercase tracking-wider">{app.category || 'Focus'}</span>
        
        {/* Inline Stage Modifier Select */}
        <div className="flex items-center gap-1.5">
          <select 
            value={app.stage} 
            onChange={(e) => onStageChange(app.id, e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className="bg-transparent text-[9px] font-black text-zinc-400 hover:text-indigo-400 focus:outline-none cursor-pointer border border-[#232936] px-1 py-0.5 rounded bg-[#161920]"
          >
            <option value="Applied" className="bg-[#0f1115]">Applied</option>
            <option value="Assessment" className="bg-[#0f1115]">Assessment</option>
            <option value="Interview" className="bg-[#0f1115]">Interview</option>
            <option value="Offer" className="bg-[#0f1115]">Offer</option>
          </select>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`Delete ${app.company} application?`)) {
                onDelete(app.id);
              }
            }}
            className="text-zinc-500 hover:text-red-400 transition ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-black text-zinc-850 dark:text-zinc-100">{app.company}</h4>
        <p className="text-xs text-zinc-550 dark:text-zinc-405 font-semibold mt-0.5">{app.role}</p>
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-zinc-100 dark:border-zinc-850/50">
        <span className="text-[9px] text-zinc-450 flex items-center gap-1 font-semibold">
          <Clock className="w-3 h-3 text-zinc-500" /> {app.deadline || app.date}
        </span>
        
        {app.interviewer && (
          <span className="text-[8px] text-zinc-500 italic">
            with {app.interviewer}
          </span>
        )}
      </div>
    </div>
  );
}
