import React from 'react';
import { Card, CardContent } from '../../../components/ui/Card';
import { useData } from '../../../context/DataContext';
import { Send, TrendingUp, Layers, Award } from 'lucide-react';

export default function StatsGrid() {
  const { stats } = useData();
  const { totalApplications, activeStatus, offersReceived } = stats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 select-none">
      {/* Total Applications Card */}
      <Card className="bg-[#121214] border border-[#1e222b]">
        <CardContent className="pt-2">
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase">Total Applications</p>
            <div className="p-1.5 bg-[#1b1f29] rounded text-indigo-500 dark:text-indigo-400">
              <Send className="w-3.5 h-3.5 transform rotate-45" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-zinc-850 dark:text-white">{totalApplications.count}</span>
            <span className="text-xs font-semibold text-indigo-650 dark:text-indigo-400 flex items-center gap-0.5 bg-indigo-50 dark:bg-indigo-500/10 px-1.5 py-0.5 rounded">
              <TrendingUp className="w-3 h-3" /> {totalApplications.growth} {totalApplications.timeline}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Active Pipeline Funnel Status */}
      <Card className="bg-[#121214] border border-[#1e222b]">
        <CardContent className="pt-2">
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase">Active Status</p>
            <div className="p-1.5 bg-[#1b1f29] rounded text-indigo-500 dark:text-indigo-400">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold tracking-tight text-zinc-850 dark:text-white">
              {(activeStatus?.applied || 0) + (activeStatus?.oa || 0) + (activeStatus?.interview || 0)}{" "}
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Applied / OA / Interview</span>
            </span>
          </div>
          <div className="flex gap-3 mt-1.5 text-[9px] text-zinc-500 dark:text-zinc-450 font-semibold uppercase">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-650" /> {activeStatus.applied} Applied</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> {activeStatus.oa} OA</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> {activeStatus.interview} Interview</span>
          </div>
        </CardContent>
      </Card>

      {/* Offers Tracking */}
      <Card className="bg-[#121214] border border-[#1e222b]">
        <CardContent className="pt-2">
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase">Offers Received</p>
            <div className="p-1.5 bg-[#1b1f29] rounded text-amber-600 dark:text-amber-500">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-zinc-850 dark:text-white">{offersReceived.count}</span>
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-1.5 py-0.5 rounded">
              {offersReceived.status}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
