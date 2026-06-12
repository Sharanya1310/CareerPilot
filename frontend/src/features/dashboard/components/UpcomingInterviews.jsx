import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { useData } from '../../../context/DataContext';
import { Video, Plus, X } from 'lucide-react';

export default function UpcomingInterviews() {
  const { upcomingInterviews, scheduleInterview, deleteInterview } = useData();

  const handleAddInterview = async () => {
    const company = prompt("Enter company name:");
    if (!company) return;
    const role = prompt("Enter role (e.g., L3 Backend):");
    if (!role) return;
    const date = prompt("Enter date (e.g., Oct 27):");
    if (!date) return;
    const time = prompt("Enter time (e.g., 2:00 PM):");
    if (!time) return;

    await scheduleInterview({
      company,
      role,
      date,
      time
    });
  };

  return (
    <Card className="bg-[#121214] border border-[#1e222b] h-full">
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase">Upcoming Interviews</CardTitle>
        <button 
          onClick={handleAddInterview}
          className="p-1 hover:bg-[#161a23] rounded text-indigo-400 hover:text-indigo-300 transition"
        >
          <Plus className="w-4 h-4" />
        </button>
      </CardHeader>
      <CardContent className="space-y-3 pt-1">
        {upcomingInterviews.map((int) => {
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
              <div className="flex items-center gap-2">
                <button className="p-1 text-zinc-500 hover:text-indigo-400 transition">
                  <Video className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => {
                    if (confirm(`Remove interview with ${int.company}?`)) {
                      deleteInterview(int.id);
                    }
                  }}
                  className="p-1 text-zinc-500 hover:text-red-400 transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
        {upcomingInterviews.length === 0 && (
          <p className="text-[10px] text-zinc-500 italic text-center py-4">No upcoming interviews scheduled</p>
        )}
      </CardContent>
    </Card>
  );
}