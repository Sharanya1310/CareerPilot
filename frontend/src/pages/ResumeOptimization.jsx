import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Progress } from '../components/ui/Progress';
import { 
  UploadCloud, FileText, CheckCircle2, AlertTriangle, 
  Sparkles, Plus, Download, Copy, Trash2, Check
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { api } from '../utils/api';

export default function ResumeOptimization() {
  const { 
    resumeOptimization, runAnalysis, deleteAnalysis, loadAnalysis,
    resumes, uploadResume, activateResume, deleteResume, analysisHistory 
  } = useData();
  
  const [jobDesc, setJobDesc] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [activeHistoryId, setActiveHistoryId] = useState(null);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!selectedResumeId && resumes.length > 0) {
      const active = resumes.find(r => r.isActive);
      setSelectedResumeId(active ? active.id.toString() : resumes[0].id.toString());
    }
  }, [resumes, selectedResumeId]);

  const { 
    compatibilityScore = 0, 
    percentile = 0, 
    sectionScores = [], 
    jobMatch = { matchPercentage: 0, missingSkills: [], summary: "" }, 
    optimizerResults = { rewrittenExperience: [], skillsEnhancement: [] } 
  } = resumeOptimization || {};

  const strokeWidth = 6;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const safeScore = typeof compatibilityScore === 'number' ? compatibilityScore : 0;
  const strokeDashoffset = circumference - (safeScore / 100) * circumference;

  const handleAnalyze = async () => {
    if (!jobDesc.trim()) {
      alert("Please paste a target job description to match against.");
      return;
    }
    if (!selectedResumeId) {
      alert("Please select a resume version first.");
      return;
    }
    
    try {
      const result = await runAnalysis({
        resumeId: parseInt(selectedResumeId),
        jobDescription: jobDesc,
        jobTitle: jobTitle.trim() || undefined,
        company: company.trim() || undefined
      });
      if (result && result.id) {
        setActiveHistoryId(result.id);
      }
      alert("Analysis complete! Resume score updated.");
    } catch (err) {
      console.error("Analysis failed:", err);
      alert("Failed to run ATS analysis.");
    }
  };

  const handleLoadHistory = (entry) => {
    loadAnalysis(entry);
    setActiveHistoryId(entry.id);
    setJobTitle(entry.jobTitle || '');
    setCompany(entry.company || '');
    setJobDesc(entry.jobDescription || '');
    if (entry.resumeId) {
      setSelectedResumeId(entry.resumeId.toString());
    }
  };

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      await uploadResume(file);
      alert(`Resume "${file.name}" uploaded successfully and set as active!`);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload resume.");
    }
    // reset input
    e.target.value = null;
  };

  return (
    <div className="space-y-6">
      {/* Hidden file input */}
      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.docx"
        className="hidden"
      />

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-400" />
          Resume Optimization
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Advanced Analysis & Management
        </p>
      </div>

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Spans 2/3) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Upload Resume Card */}
          <Card className="bg-[#121214] border border-[#1e222b]">
            <CardContent className="p-1">
              <div 
                onClick={handleFileClick}
                className="border border-dashed border-[#1e222b] rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-zinc-700 transition bg-[#0f1115]/45"
              >
                <UploadCloud className="w-8 h-8 text-indigo-400 mb-3" />
                <h4 className="text-xs font-bold text-zinc-200">Upload your resume</h4>
                <p className="text-[10px] text-zinc-500 mt-1">PDF, DOCX up to 5MB</p>
              </div>
            </CardContent>
          </Card>

          {/* Target Job Description Card */}
          <Card className="bg-[#121214] border border-[#1e222b]">
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-xs font-bold text-zinc-200">Target Job Description</CardTitle>
              <div className="flex gap-2">
                <Button 
                  onClick={handleAnalyze}
                  variant="brand" 
                  className="h-7 text-[10px] font-bold py-0 px-3 bg-indigo-600 hover:bg-indigo-700"
                >
                  Analyze Match
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Target Resume</label>
                  <select 
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                    className="w-full bg-[#0f1115] border border-[#1e222b] rounded-lg p-2 text-[11px] text-zinc-300 focus:outline-none focus:border-zinc-700"
                  >
                    <option value="">-- Select Resume --</option>
                    {resumes.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.score} ATS)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Job Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Software Engineer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full bg-[#0f1115] border border-[#1e222b] rounded-lg p-2 text-[11px] text-zinc-300 focus:outline-none focus:border-zinc-700"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Company</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Target Company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-[#0f1115] border border-[#1e222b] rounded-lg p-2 text-[11px] text-zinc-300 focus:outline-none focus:border-zinc-700"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Job Description</label>
                <textarea
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  placeholder="Paste the job description here to optimize your resume for specific keywords and ATS requirements..."
                  className="w-full h-28 bg-[#0f1115] border border-[#1e222b] rounded-lg p-3 text-[11px] text-zinc-350 focus:outline-none focus:border-zinc-750 resize-none placeholder:text-zinc-600"
                />
              </div>
            </CardContent>
          </Card>

          {/* Job Match Analysis */}
          <Card className="bg-[#121214] border border-[#1e222b]">
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-1.5 text-indigo-400">
                <CheckCircle2 className="w-4 h-4" />
                <CardTitle className="text-xs font-bold text-zinc-200">Job Match Analysis</CardTitle>
              </div>
              <span className="text-lg font-black text-indigo-400">{jobMatch.matchPercentage}% <span className="text-[10px] font-bold text-zinc-500 uppercase">Match</span></span>
            </CardHeader>
            <CardContent className="space-y-4 pt-2 border-t border-[#1e222b]/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Missing Skills */}
                <div className="space-y-2">
                  <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Missing Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {jobMatch.missingSkills.map((sk) => (
                      <span key={sk} className="text-[9px] font-bold px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                        {sk}
                      </span>
                    ))}
                    {jobMatch.missingSkills.length === 0 && (
                      <span className="text-[9px] text-zinc-550 italic">No missing skills detected</span>
                    )}
                  </div>
                </div>
                {/* Match Summary */}
                <div className="md:col-span-2 space-y-2">
                  <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Match Summary</p>
                  <p className="text-[11px] text-zinc-450 leading-relaxed font-semibold">
                    {jobMatch.summary}
                  </p>
                </div>
              </div>

              {/* Improvement Suggestions */}
              {resumeOptimization.suggestions && resumeOptimization.suggestions.length > 0 && (
                <div className="pt-3 border-t border-[#1e222b]/30 space-y-2">
                  <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Improvement Suggestions</p>
                  <ul className="space-y-1.5 text-[11px] text-zinc-350 leading-relaxed">
                    {resumeOptimization.suggestions.map((sug, idx) => (
                      <li key={idx} className="flex gap-2 items-start font-semibold">
                        <AlertTriangle className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                        <span>{sug}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Optimizer Results */}
          <Card className="bg-[#121214] border border-[#1e222b]">
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-1.5 text-indigo-400">
                <Sparkles className="w-4 h-4" />
                <CardTitle className="text-xs font-bold text-zinc-200">AI Optimizer Results</CardTitle>
              </div>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(optimizerResults.rewrittenExperience.join('\n'));
                  alert("Copied to clipboard!");
                }}
                className="text-[10px] font-semibold text-zinc-400 hover:text-white flex items-center gap-1.5 bg-[#1c1f28]/60 border border-[#1e222b]/50 px-2.5 py-1 rounded"
              >
                <Copy className="w-3.5 h-3.5" /> Copy
              </button>
            </CardHeader>
            <CardContent className="space-y-4 pt-2 border-t border-[#1e222b]/50">
              {/* Rewritten Experience */}
              <div className="space-y-2">
                <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Rewritten Experience</p>
                <div className="bg-[#0f1115] border border-[#1e222b] p-3 rounded-lg text-[11px] text-zinc-350 space-y-2.5 font-semibold leading-relaxed">
                  {optimizerResults.rewrittenExperience.map((bullet, idx) => (
                    <div key={idx} className="flex gap-2">
                      <span className="text-indigo-500 font-bold">•</span>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Skills Enhancement */}
              <div className="space-y-2">
                <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Skills Enhancement</p>
                <div className="flex flex-wrap gap-1.5">
                  {optimizerResults.skillsEnhancement.map((sk) => (
                    <span key={sk} className="text-[9px] font-bold px-2.5 py-1 rounded bg-[#161920] border border-[#232936] text-zinc-400">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Column (Spans 1/3) */}
        <div className="space-y-6">

          {/* ATS Compatibility Score circular dial */}
          <Card className="bg-[#121214] border border-[#1e222b]">
            <CardHeader className="pb-3 border-b border-[#1e222b]/50">
              <CardTitle className="text-xs font-bold text-zinc-200">ATS Compatibility Score</CardTitle>
            </CardHeader>
            <CardContent className="py-6 flex flex-col items-center justify-center space-y-4">
              <div className="relative flex items-center justify-center">
                <svg className="w-28 h-28 transform -rotate-90">
                  <defs>
                    <linearGradient id="score-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#818cf8" />
                      <stop offset="100%" stopColor="#c084fc" />
                    </linearGradient>
                  </defs>
                  <circle cx="56" cy="56" r={radius} stroke="#27272a" strokeWidth={strokeWidth} fill="transparent" />
                  <circle 
                    cx="56" 
                    cy="56" 
                    r={radius} 
                    stroke="url(#score-grad)" 
                    strokeWidth={strokeWidth} 
                    fill="transparent" 
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-2xl font-black text-white">{compatibilityScore}</span>
                  <span className="text-[9px] text-zinc-500 block">of 100</span>
                </div>
              </div>
              <p className="text-[10px] text-zinc-400 text-center leading-normal max-w-[180px] font-semibold pt-2">
                Your resume performs better than <span className="text-indigo-400 font-extrabold">{percentile}%</span> of applicants in this category.
              </p>
            </CardContent>
          </Card>

          {/* ATS Section Scores */}
          <Card className="bg-[#121214] border border-[#1e222b]">
            <CardHeader className="pb-3 border-b border-[#1e222b]/50">
              <CardTitle className="text-xs font-bold text-zinc-200">ATS Section Scores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 py-4">
              {sectionScores.map((item) => (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-semibold text-zinc-400">
                    <span>{item.label}</span>
                    <span className="text-zinc-200 font-bold">{item.score}</span>
                  </div>
                  <Progress value={item.score} indicatorColor={item.color} className="h-1 bg-zinc-800" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* My Resumes List */}
          <Card className="bg-[#121214] border border-[#1e222b]">
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0 border-b border-[#1e222b]/50">
              <CardTitle className="text-xs font-bold text-zinc-200">My Resumes</CardTitle>
              <button 
                onClick={handleFileClick}
                className="text-zinc-450 hover:text-white transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </CardHeader>
            <CardContent className="py-3 space-y-2">
              {resumes.map((res) => (
                <div 
                  key={res.id} 
                  className={`p-3 bg-[#0f1115] border rounded-xl flex items-center justify-between transition-colors hover:bg-[#13161d] ${
                    res.isActive ? 'border-indigo-500/50' : 'border-[#1e222b]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                    <FileText className={`w-4 h-4 flex-shrink-0 ${res.isActive ? 'text-indigo-400' : 'text-zinc-500'}`} />
                    <div className="min-w-0 flex-1">
                      {/* Click name to view inline */}
                      <a 
                        href={api.getViewUrl(res.id)} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[10px] font-bold text-zinc-200 hover:text-indigo-400 hover:underline block truncate"
                      >
                        {res.name}
                      </a>
                      <p className="text-[8px] text-zinc-500 mt-0.5 flex items-center gap-1.5">
                        <span>{new Date(res.uploadedAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{res.size ? `${(res.size/1024).toFixed(1)} KB` : '100 KB'}</span>
                        {res.isActive && (
                          <span className="text-[8px] text-emerald-400 font-extrabold uppercase bg-emerald-500/10 px-1 rounded">Active</span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Active toggle */}
                    {!res.isActive && (
                      <button 
                        onClick={() => activateResume(res.id)}
                        className="text-[9px] text-zinc-500 hover:text-indigo-400 font-bold uppercase transition px-1.5 py-0.5 rounded border border-[#232936] bg-[#161920]"
                      >
                        Activate
                      </button>
                    )}

                    <span className="text-[10px] font-extrabold text-indigo-450 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                      {res.score}
                    </span>
                    
                    {/* Download */}
                    <a 
                      href={api.getDownloadUrl(res.id)} 
                      target="_self"
                      className="p-1 hover:bg-[#1b1f28] rounded text-zinc-500 hover:text-zinc-300 transition"
                      title="Download"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>

                    {/* Delete */}
                    <button 
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${res.name}"?`)) {
                          deleteResume(res.id);
                        }
                      }}
                      className="p-1 hover:bg-[#1b1f28] rounded text-zinc-500 hover:text-red-400 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {resumes.length === 0 && (
                <p className="text-[10px] text-zinc-500 italic text-center py-4">No resumes uploaded yet</p>
              )}

              <button 
                onClick={handleFileClick}
                className="border border-dashed border-[#1e222b] hover:border-zinc-650 text-zinc-500 hover:text-zinc-300 transition text-center py-2.5 rounded-xl text-[10px] font-bold w-full mt-3 flex items-center justify-center gap-1.5 bg-[#0f1115]/30"
              >
                <Plus className="w-3.5 h-3.5" /> Upload New Resume
              </button>
            </CardContent>
          </Card>

          {/* Analysis History */}
          <Card className="bg-[#121214] border border-[#1e222b]">
            <CardHeader className="pb-3 border-b border-[#1e222b]/50">
              <CardTitle className="text-xs font-bold text-zinc-200">Analysis History</CardTitle>
            </CardHeader>
            <CardContent className="py-3 space-y-2 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800">
              {analysisHistory.map((entry) => (
                <div 
                  key={entry.id} 
                  onClick={() => handleLoadHistory(entry)}
                  className={`p-3 bg-[#0f1115] border rounded-xl flex items-center justify-between transition-colors hover:bg-[#13161d] cursor-pointer ${
                    entry.id === activeHistoryId ? 'border-indigo-500/50 bg-[#13161d]' : 'border-[#1e222b]'
                  }`}
                >
                  <div className="flex-1 min-w-0 mr-2">
                    <p className="text-[10px] font-bold text-zinc-200 truncate">
                      {entry.jobTitle} at {entry.company}
                    </p>
                    <p className="text-[8px] text-zinc-500 mt-0.5 flex items-center gap-1.5">
                      <span className="truncate max-w-[80px]">{entry.resumeName}</span>
                      <span>•</span>
                      <span>{new Date(entry.timestamp).toLocaleDateString()}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] font-extrabold text-indigo-450 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                      {entry.atsScore}%
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // prevent loading
                        deleteAnalysis(entry.id);
                        if (entry.id === activeHistoryId) {
                          setActiveHistoryId(null);
                        }
                      }}
                      className="p-1 hover:bg-[#1b1f28] rounded text-zinc-500 hover:text-red-400 transition"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              {analysisHistory.length === 0 && (
                <p className="text-[10px] text-zinc-550 italic text-center py-4">No analysis runs yet</p>
              )}
            </CardContent>
          </Card>

        </div>
        
      </div>
    </div>
  );
}
