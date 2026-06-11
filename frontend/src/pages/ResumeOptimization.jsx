import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Progress } from '../components/ui/Progress';
import { 
  UploadCloud, FileText, CheckCircle2, AlertTriangle, 
  Sparkles, Plus, Download, Copy 
} from 'lucide-react';
import { resumeOptimizationData } from '../mock/dashboardData';

export default function ResumeOptimization() {
  const { 
    compatibilityScore, percentile, sectionScores, 
    myResumes, jobMatch, optimizerResults 
  } = resumeOptimizationData;

  const strokeWidth = 6;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (compatibilityScore / 100) * circumference;

  return (
    <div className="space-y-6">
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
              <div className="border border-dashed border-[#1e222b] rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-zinc-700 transition bg-[#0f1115]/45">
                <UploadCloud className="w-8 h-8 text-indigo-400 mb-3" />
                <h4 className="text-xs font-bold text-zinc-200">Upload your resume</h4>
                <p className="text-[10px] text-zinc-500 mt-1">PDF, DOCX up to 10MB</p>
              </div>
            </CardContent>
          </Card>

          {/* Target Job Description Card */}
          <Card className="bg-[#121214] border border-[#1e222b]">
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-xs font-bold text-zinc-200">Target Job Description</CardTitle>
              <div className="flex gap-2">
                <button className="text-[10px] font-semibold text-zinc-400 hover:text-zinc-200 px-2 py-1 rounded bg-[#1c1f28]/60 border border-[#1e222b]/50">
                  Paste to analyze
                </button>
                <Button variant="brand" className="h-7 text-[10px] font-bold py-0 px-3">
                  Analyze Match
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-1">
              <textarea
                placeholder="Paste the job description here to optimize your resume for specific keywords and ATS requirements..."
                className="w-full h-28 bg-[#0f1115] border border-[#1e222b] rounded-lg p-3 text-[11px] text-zinc-350 focus:outline-none focus:border-zinc-700 resize-none placeholder:text-zinc-600"
              />
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
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2 border-t border-[#1e222b]/50">
              {/* Missing Skills */}
              <div className="space-y-2">
                <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Missing Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {jobMatch.missingSkills.map((sk) => (
                    <span key={sk} className="text-[9px] font-bold px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
              {/* Match Summary */}
              <div className="md:col-span-2 space-y-2">
                <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Match Summary</p>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
                  {jobMatch.summary}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* AI Optimizer Results */}
          <Card className="bg-[#121214] border border-[#1e222b]">
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-1.5 text-indigo-400">
                <Sparkles className="w-4 h-4" />
                <CardTitle className="text-xs font-bold text-zinc-200">AI Optimizer Results</CardTitle>
              </div>
              <button className="text-[10px] font-semibold text-zinc-400 hover:text-zinc-200 flex items-center gap-1.5 bg-[#1c1f28]/60 border border-[#1e222b]/50 px-2.5 py-1 rounded">
                <Copy className="w-3.5 h-3.5" /> Copy
              </button>
            </CardHeader>
            <CardContent className="space-y-4 pt-2 border-t border-[#1e222b]/50">
              {/* Rewritten Experience */}
              <div className="space-y-2">
                <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Rewritten Experience</p>
                <div className="bg-[#0f1115] border border-[#1e222b] p-3 rounded-lg text-[11px] text-zinc-350 space-y-2.5 font-medium leading-relaxed">
                  {optimizerResults.rewrittenExperience.map((bullet, idx) => (
                    <div key={idx} className="flex gap-2">
                      <span className="text-indigo-500">•</span>
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
                  <circle cx="56" cy="56" r={radius} stroke="#27272a" strokeWidth={strokeWidth} fill="transparent" />
                  <circle 
                    cx="56" 
                    cy="56" 
                    r={radius} 
                    stroke="#6366f1" 
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
              <p className="text-[10px] text-zinc-400 text-center leading-normal max-w-[180px] font-medium pt-2">
                Your resume performs better than <span className="text-indigo-400 font-bold">{percentile}%</span> of applicants in this category.
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
                  <div className="flex justify-between items-center text-[10px] font-medium text-zinc-400">
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
              <button className="text-zinc-400 hover:text-white transition">
                <Plus className="w-4 h-4" />
              </button>
            </CardHeader>
            <CardContent className="py-3 space-y-2">
              {myResumes.map((res) => (
                <div key={res.name} className="p-3 bg-[#0f1115] border border-[#1e222b] rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-zinc-500" />
                    <div>
                      <h5 className="text-[10px] font-bold text-zinc-200">{res.name}</h5>
                      <p className="text-[8px] text-zinc-500 mt-0.5">{res.status}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-extrabold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                      {res.score}
                    </span>
                    <button className="p-1 hover:bg-[#13161c] rounded text-zinc-500 hover:text-zinc-300">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              <button className="border border-dashed border-[#1e222b] hover:border-zinc-600 text-zinc-500 hover:text-zinc-300 transition text-center py-2.5 rounded-xl text-[10px] font-bold w-full mt-3 flex items-center justify-center gap-1.5 bg-[#0f1115]/30">
                <Plus className="w-3.5 h-3.5" /> Upload New Resume
              </button>
            </CardContent>
          </Card>

        </div>
        
      </div>
    </div>
  );
}
