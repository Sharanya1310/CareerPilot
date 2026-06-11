import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { missingSkills } from '../../../mock/dashboardData';

export default function MissingSkills() {
  return (
    <Card className="bg-[#121214] border border-[#1e222b] h-full flex flex-col justify-between">
      <CardHeader className="pb-2">
        <CardTitle className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase">Top Missing Skills</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between pt-2">
        <div className="flex flex-wrap gap-2.5 my-3">
          {missingSkills.map((skill) => (
            <Badge key={skill} variant="brand" className="text-xs py-1 px-3 border border-indigo-500/25 bg-indigo-500/5 font-semibold text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-1.5" />
              {skill}
            </Badge>
          ))}
        </div>
        <p className="text-[10px] text-zinc-500 font-medium leading-relaxed border-t border-zinc-800/60 pt-3">
          Found in <span className="text-indigo-400 font-bold">72%</span> of job descriptions you've viewed.
        </p>
      </CardContent>
    </Card>
  );
}