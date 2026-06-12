import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { useData } from '../../../context/DataContext';
import { Sparkles } from 'lucide-react';

export default function ATSWidget() {
  const { atsScore } = useData();
  const strokeWidth = 6;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (atsScore.score / 100) * circumference;

  return (
    <Card className="bg-[#121214] border border-[#1e222b] flex flex-col justify-between h-full">
      <CardContent className="flex items-center justify-between py-6 h-full gap-6">
        {/* Left Circular Gauge */}
        <div className="relative flex items-center justify-center flex-shrink-0">
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
            <span className="text-2xl font-black text-white">{atsScore.score}</span>
            <span className="text-[9px] text-zinc-500 block">/ 100</span>
          </div>
        </div>

        {/* Right Info Details */}
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-zinc-200">ATS Score</span>
          </div>
          <h4 className="text-[13px] font-semibold text-white leading-snug">High compatibility with target roles.</h4>
          <p className="text-[10px] font-medium text-emerald-400 flex items-center gap-1">
            <span className="bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold">{atsScore.trend}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
