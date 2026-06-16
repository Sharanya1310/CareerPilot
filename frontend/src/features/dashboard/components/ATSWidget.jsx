import { Card, CardContent } from '../../../components/ui/Card';
import { useData } from '../../../context/DataContext';
import { Sparkles, UploadCloud, ArrowRight, ShieldCheck } from 'lucide-react';

export default function ATSWidget({ onPageChange }) {
  const { atsScore } = useData();
  const hasScore = atsScore?.score > 0;

  /* ── Empty / not-tested state ── */
  if (!hasScore) {
    return (
      <Card className="bg-[#121214] border border-[#1e222b] h-full">
        <CardContent className="flex flex-col items-center justify-center h-full py-8 px-6 text-center gap-4">

          {/* Pulsing icon ring */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping" />
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-indigo-400" />
            </div>
          </div>

          {/* Text */}
          <div className="space-y-1">
            <p className="text-sm font-bold text-zinc-100">No ATS Score Yet</p>
            <p className="text-[11px] text-zinc-500 leading-relaxed max-w-[200px]">
              Upload your resume to get an AI-powered ATS compatibility score.
            </p>
          </div>

          {/* Benefit pills */}
          <div className="flex flex-wrap justify-center gap-1.5">
            {['Keyword Match', 'Format Check', 'Skills Gap'].map(tag => (
              <span key={tag} className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {tag}
              </span>
            ))}
          </div>

          {/* CTA button */}
          <button
            onClick={() => onPageChange?.('Resume Optimization')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.03] active:scale-100 transition-all duration-200"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            Upload Resume
            <ArrowRight className="w-3 h-3" />
          </button>
        </CardContent>
      </Card>
    );
  }

  /* ── Score state ── */
  const strokeWidth = 6;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (atsScore.score / 100) * circumference;

  const scoreColor = atsScore.score >= 75 ? '#6366f1'
    : atsScore.score >= 50 ? '#f59e0b'
    : '#ef4444';

  return (
    <Card className="bg-[#121214] border border-[#1e222b] flex flex-col justify-between h-full">
      <CardContent className="flex items-center justify-between py-6 h-full gap-6">
        {/* Circular gauge */}
        <div className="relative flex items-center justify-center flex-shrink-0">
          <svg className="w-28 h-28 transform -rotate-90">
            <circle cx="56" cy="56" r={radius} stroke="#27272a" strokeWidth={strokeWidth} fill="transparent" />
            <circle
              cx="56" cy="56" r={radius}
              stroke={scoreColor}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute text-center">
            <span className="text-2xl font-black text-zinc-100">{atsScore.score}</span>
            <span className="text-[9px] text-zinc-500 block">/ 100</span>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-zinc-200">ATS Score</span>
          </div>
          <h4 className="text-[13px] font-semibold text-zinc-100 leading-snug">
            {atsScore.score >= 75 ? 'High compatibility with target roles.'
              : atsScore.score >= 50 ? 'Moderate match — room to improve.'
              : 'Low match — resume needs optimizing.'}
          </h4>
          <p className="text-[10px] font-medium text-emerald-400 flex items-center gap-1">
            <span className="bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold">{atsScore.trend}</span>
          </p>

          <button
            onClick={() => onPageChange?.('Resume Optimization')}
            className="mt-2 flex items-center gap-1.5 text-[10px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <UploadCloud className="w-3 h-3" />
            Re-scan resume
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
