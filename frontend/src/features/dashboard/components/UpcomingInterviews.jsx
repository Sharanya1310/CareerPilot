import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { upcomingInterviews } from '../../../mock/dashboardData';
import { Video } from 'lucide-react';

export default function UpcomingInterviews() {
  return (
    <Card className="bg-[#121214] border border-[#1e222b] h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase">Upcoming Interviews</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-1">
        {upcomingInterviews.map((int) => {
          // split date like "June 12, 2026" or "Oct 27" to get "Oct" and "27"
          const dateParts = int.date.split(' ');
          const month = dateParts[0] ? dateParts[0].substring(0, 3) : 'Oct';
          const day = dateParts[1] ? dateParts[1].replace(',', '') : '27';
          
          return (
            <div key={int.id} className="p-3 bg-[#0f1115] rounded-xl border border-[#1e222b] flex items-center justify-between hover:border-zinc-700 transition">
              <div className="flex items-center gap-3">
                {/* Custom Calendar Date Block */}
                <div className="w-10 h-10 bg-[#161a23] border border-[#1e222b] rounded-lg flex flex-col items-center justify-center text-center">
                  <span className="text-[8px] font-bold text-zinc-500 uppercase">{month}</span>
                  <span className="text-sm font-extrabold text-indigo-400 -mt-1">{day}</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-200">{int.company}</h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5">{int.role} • {int.time}</p>
                </div>
              </div>
              <button className="p-1 text-zinc-500 hover:text-zinc-300">
                <Video className="w-4 h-4 text-zinc-500 hover:text-indigo-400 transition" />
              </button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}