import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Plus, Bell, Clock, Briefcase, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';

export default function ApplicationTracker() {
  const toast = useToast();
  const {
    applications, addApplication, updateApplicationStage, deleteApplication,
    pendingAction, setPendingAction, profile,
  } = useData();

  const initials = (profile?.name || 'U').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  useEffect(() => {
    if (pendingAction === 'open_add_application') {
      setIsModalOpen(true);
      setPendingAction(null);
    }
  }, [pendingAction, setPendingAction]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newCategory, setNewCategory] = useState('Engineering');
  const [newStage, setNewStage] = useState('Applied');
  const [newDeadline, setNewDeadline] = useState('2d left');
  const [newInterviewer, setNewInterviewer] = useState('');

  // Heatmap: 26 columns (≈6 months), cell size fills container width
  const COLS = 32;
  const GAP  = 2;
  const heatmapRef = useRef(null);
  const [numCols, setNumCols]   = useState(COLS);
  const [cellSize, setCellSize] = useState(11);

  useEffect(() => {
    const el = heatmapRef.current;
    if (!el) return;
    const update = () => {
      const w    = el.clientWidth;
      const cols = Math.min(COLS, Math.max(12, Math.floor((w + GAP) / (11 + GAP))));
      const size = Math.max(8, Math.floor((w - (cols - 1) * GAP) / cols));
      setNumCols(cols);
      setCellSize(size);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { heatmapWeeks, heatmapMaxCount } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // last 7 months is the "active" window (includes November)
    const activeStart = new Date(today);
    activeStart.setMonth(today.getMonth() - 7);

    // grid starts numCols weeks back, aligned to Sunday of that week
    const todaySunday = new Date(today);
    todaySunday.setDate(today.getDate() - today.getDay());
    const gridStart = new Date(todaySunday);
    gridStart.setDate(todaySunday.getDate() - (numCols - 1) * 7);

    const countMap = {};
    applications.forEach(app => {
      const ts = app.createdAt || app.updatedAt;
      if (ts) {
        const d = new Date(ts);
        d.setHours(0, 0, 0, 0);
        const key = d.toISOString().slice(0, 10);
        countMap[key] = (countMap[key] || 0) + 1;
      }
    });

    let maxCount = 0;
    const weeks = [];
    for (let w = 0; w < numCols; w++) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        const day = new Date(gridStart);
        day.setDate(gridStart.getDate() + w * 7 + d);
        const key = day.toISOString().slice(0, 10);
        const count = countMap[key] || 0;
        const active = day >= activeStart && day <= today;
        if (active && count > maxCount) maxCount = count;
        week.push({ date: new Date(day), count, active });
      }
      weeks.push(week);
    }
    return { heatmapWeeks: weeks, heatmapMaxCount: maxCount };
  }, [applications, numCols]);

  const isDark = document.documentElement.classList.contains('dark');

  const getHeatmapColor = (day) => {
    if (!day.active) return isDark ? 'bg-[#0d1117]' : 'bg-transparent';
    if (day.count === 0) return isDark ? 'bg-[#161f1a]' : 'bg-[#ebedf0]';
    const ratio = day.count / Math.max(heatmapMaxCount, 1);
    if (isDark) {
      if (ratio <= 0.25) return 'bg-[#1a5c30]';
      if (ratio <= 0.5)  return 'bg-[#27a044]';
      if (ratio <= 0.75) return 'bg-[#2dc653]';
      return 'bg-[#39d353]';
    } else {
      if (ratio <= 0.25) return 'bg-[#9be9a8]';
      if (ratio <= 0.5)  return 'bg-[#40c463]';
      if (ratio <= 0.75) return 'bg-[#30a14e]';
      return 'bg-[#216e39]';
    }
  };

  const totalAppsCount = applications.length;
  const pct = (n) => totalAppsCount > 0 ? Math.round((n / totalAppsCount) * 100) : 0;

  const funnelStages = [
    { label: "Applied",    percentage: pct(applications.filter(a => a.stage === 'Applied').length),                       color: "bg-indigo-600" },
    { label: "Assessment", percentage: pct(applications.filter(a => a.stage === 'Assessment' || a.stage === 'OA').length), color: "bg-indigo-500/80" },
    { label: "Interview",  percentage: pct(applications.filter(a => a.stage === 'Interview').length),                     color: "bg-indigo-400/60" },
    { label: "Offer",      percentage: pct(applications.filter(a => a.stage === 'Offer').length),                         color: "bg-indigo-300/40" },
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
      toast({ type: 'error', title: 'Missing fields', message: 'Company and Role are required.' });
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
          
          <div className="w-8 h-8 rounded-full border border-indigo-500/30 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-[11px] font-bold text-indigo-300 select-none">{initials}</span>
          </div>
        </div>
      </div>

      {/* Top Grid: Heatmap (Job Hunt Activity) & Success Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Job Hunt Activity Heatmap */}
        <div className="lg:col-span-2 bg-[#0f1115] border border-[#1e222b] rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-extrabold text-zinc-100">Job Hunt Activity</h3>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Last 6 Months</span>
          </div>

          {/* GitHub-style heatmap */}
          <div ref={heatmapRef} className="w-full">
            {/* Month labels */}
            <div className="flex mb-2" style={{ gap: GAP }}>
              {heatmapWeeks.map((week, wIdx) => {
                const first = week[0].date;
                const prev  = wIdx > 0 ? heatmapWeeks[wIdx - 1][0].date : null;
                const show  = !prev || first.getMonth() !== prev.getMonth();
                return (
                  <div key={wIdx} style={{ width: cellSize, flexShrink: 0, height: 14, overflow: 'visible' }}>
                    {show && (
                      <span className="text-[9px] text-zinc-400 font-medium leading-none whitespace-nowrap block">
                        {first.toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Cell grid */}
            <div className="flex" style={{ gap: GAP }}>
              {heatmapWeeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col" style={{ gap: GAP }}>
                  {week.map((day, dIdx) => (
                    <div
                      key={dIdx}
                      style={{ width: cellSize, height: cellSize }}
                      title={day.active && day.count > 0
                        ? `${day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: ${day.count} application${day.count !== 1 ? 's' : ''}`
                        : undefined}
                      className={`rounded-[2px] transition-colors ${getHeatmapColor(day)}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-1.5 text-[10px] text-zinc-400 pt-1">
            <span className="font-medium">Less</span>
            {(isDark
              ? ['#161f1a', '#1a5c30', '#27a044', '#2dc653', '#39d353']
              : ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39']
            ).map(color => (
              <div key={color} className="w-[10px] h-[10px] rounded-[2px]" style={{ backgroundColor: color }} />
            ))}
            <span className="font-medium">More</span>
          </div>
        </div>

        {/* Success Funnel Card */}
        <div className="lg:col-span-1 bg-white dark:bg-[#0f1115] border border-[#e2e8f0] dark:border-[#1e222b] rounded-2xl p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-extrabold text-zinc-800 dark:text-zinc-100">Success Funnel</h3>
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">{totalAppsCount} total</span>
          </div>

          <div className="flex flex-col gap-2">
            {funnelStages.map((stage) => (
              <div key={stage.label} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">{stage.label}</span>
                  <span className="text-[10px] font-black text-indigo-500">{stage.percentage}%</span>
                </div>
                <div className="w-full bg-zinc-100 dark:bg-zinc-800/60 rounded-full h-5 overflow-hidden">
                  <div
                    className={`h-full ${stage.color} rounded-full transition-all duration-700`}
                    style={{ width: `${Math.max(stage.percentage, stage.percentage > 0 ? 4 : 0)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {totalAppsCount === 0 && (
            <p className="text-[10px] text-zinc-400 text-center mt-4 italic">Add applications to see funnel data</p>
          )}
        </div>

      </div>

      {/* Live Pipeline Action Header */}
      <div className="flex items-center justify-between pt-4 border-t border-[#e2e8f0] dark:border-[#1e222b]">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-black text-zinc-850 dark:text-zinc-100">Live Pipeline</h2>
          
          <div className="flex -space-x-2">
            <div className="w-5 h-5 rounded-full border border-white dark:border-[#0f1115] bg-indigo-500/20 flex items-center justify-center">
              <span className="text-[8px] font-bold text-indigo-300 select-none">{initials[0]}</span>
            </div>
            <div className="w-5 h-5 rounded-full border border-white dark:border-[#0f1115] bg-purple-500/20 flex items-center justify-center">
              <span className="text-[8px] font-bold text-purple-300 select-none">{initials[1] || initials[0]}</span>
            </div>
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
  const confirm = useConfirm();
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
              confirm({
                title: `Delete ${app.company}?`,
                message: 'This application will be permanently removed from your tracker.',
                confirmLabel: 'Delete',
                onConfirm: () => onDelete(app.id),
              });
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
