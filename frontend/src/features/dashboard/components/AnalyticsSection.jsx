import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Progress } from '../../../components/ui/Progress';
import { useData } from '../../../context/DataContext';

const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function AnalyticsSection() {
  const { stats, applications } = useData();
  const activeStatus = stats.activeStatus || { applied: 0, oa: 0, interview: 0, offer: 0 };
  const total = Math.max(stats.totalApplications?.count || 0, 1);

  /* Build last-6-months chart from real application data */
  const monthlyChartData = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      const yr = d.getFullYear();
      const mo = d.getMonth();
      const apps = applications.filter(a => {
        const date = new Date(a.createdAt || a.date);
        return date.getFullYear() === yr && date.getMonth() === mo;
      });
      const interviews = apps.filter(a =>
        a.stage === 'Interview' || a.stage === 'interview'
      ).length;
      return {
        name: MONTH_LABELS[mo],
        applications: apps.length,
        interviews,
      };
    });
  }, [applications]);

  const applicationStatusData = [
    { label: "Applied", count: activeStatus.applied, total, color: "bg-indigo-500" },
    { label: "OA", count: activeStatus.oa, total, color: "bg-[#2e3545]" },
    { label: "Interview", count: activeStatus.interview, total, color: "bg-[#3f2f6a]" },
    { label: "Offer", count: activeStatus.offer, total, color: "bg-emerald-500" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Left Column: Application Stage Multi-Progress Area */}
      <Card className="bg-[#121214] border border-[#1e222b] h-full flex flex-col justify-between">
        <CardHeader className="pb-4">
          <CardTitle className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase">Application Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-1 flex-1 flex flex-col justify-between mb-2">
          {applicationStatusData.map((item) => {
            const pct = (item.count / item.total) * 100;
            return (
              <div key={item.label} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-300 font-medium">{item.label}</span>
                  <span className="text-zinc-400 font-bold">
                    {item.count} <span className="text-zinc-600 text-[10px] ml-1">({Math.round(pct)}%)</span>
                  </span>
                </div>
                <Progress value={pct} indicatorColor={item.color} className="h-6 rounded bg-[#1b1f29]" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Right Column: Monthly Pipeline Activity Chart */}
      <Card className="lg:col-span-2 bg-[#121214] border border-[#1e222b]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <div>
            <CardTitle className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase">Monthly Applications</CardTitle>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-semibold text-zinc-500">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500" /> Total</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Interviews</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[240px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyChartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2430" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                  labelStyle={{ color: 'var(--muted-foreground)', fontSize: '11px' }}
                  itemStyle={{ color: 'var(--foreground)', fontSize: '12px' }}
                />
                <Line
                  type="monotone"
                  dataKey="applications"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  dot={{ fill: '#6366f1', strokeWidth: 1, r: 3 }}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                  name="Applications"
                />
                <Line
                  type="monotone"
                  dataKey="interviews"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ fill: '#f59e0b', strokeWidth: 1, r: 3 }}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                  name="Interviews"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
