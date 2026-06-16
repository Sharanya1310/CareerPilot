import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { useData } from '../../../context/DataContext';
import { Zap } from 'lucide-react';

export default function MissingSkills() {
  const { missingSkills } = useData();

  if (!missingSkills || missingSkills.length === 0) {
    return (
      <Card className="bg-[#121214] border border-[#1e222b] h-full">
        <CardContent className="flex flex-col items-center justify-center h-full py-8 px-6 text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-zinc-300">No Skill Gaps Yet</p>
            <p className="text-[10px] text-zinc-500 leading-relaxed max-w-[180px]">
              Analyze your resume against a job description to discover missing keywords.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#121214] border border-[#1e222b] h-full flex flex-col justify-between">
      <CardHeader className="pb-2">
        <CardTitle className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase">Top Missing Skills</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pt-2">
        <div className="flex flex-wrap gap-2.5">
          {missingSkills.map((skill) => (
            <Badge key={skill} variant="brand" className="text-xs py-1 px-3 border border-indigo-500/25 bg-indigo-500/5 font-semibold text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-1.5" />
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
