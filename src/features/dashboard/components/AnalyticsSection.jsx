import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Progress } from '../../../components/ui/Progress';
import { applicationStatusData, monthlyChartData } from '../../../mock/dashboardData';

export default function AnalyticsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Monthly Pipeline Activity Metric Recharts Linechart Box */}
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <div>
            <CardTitle className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">Monthly Applications</CardTitle>
            <p className="text-lg font-bold text-zinc-100 mt-0.5">Application Outbound Velocity</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[240px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyChartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                  labelStyle={{ color: '#a1a1aa', fontSize: '11px' }}
                  itemStyle={{ color: '#fafafa', fontSize: '12px' }}
                />
                <Line
                  type="monotone"
                  dataKey="applications"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  dot={{ fill: '#6366f1', strokeWidth: 1, r: 3 }}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Application Stage Multi-Progress Area */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">Pipeline Efficiency</CardTitle>
          <p className="text-lg font-bold text-zinc-100 mt-0.5">Application Status</p>
        </CardHeader>
        <CardContent className="space-y-4 pt-1">
          {applicationStatusData.map((item) => {
            const pct = (item.count / item.total) * 100;
            return (
              <div key={item.label} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-300 font-medium">{item.label}</span>
                  <span className="text-zinc-400 font-semibold">{item.count} <span className="text-zinc-600 text-[10px]">/ pool</span></span>
                </div>
                <Progress value={pct} indicatorColor={item.color} />
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}