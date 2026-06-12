import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { useData } from '../../../context/DataContext';

export default function RecentApplications() {
  const { recentApplications } = useData();
  return (
    <Card className="bg-[#121214] border border-[#1e222b]">
      <CardHeader className="pb-3">
        <CardTitle className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase">Recent Applications</CardTitle>
      </CardHeader>
      <CardContent className="pt-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead>
              <tr className="border-b border-[#1e222b] text-zinc-500 uppercase tracking-wider font-semibold text-[10px]">
                <th className="pb-3 font-medium">Company</th>
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e222b]/50">
              {recentApplications.map((app) => (
                <tr key={app.id} className="hover:bg-zinc-900/30 transition-colors group">
                  <td className="py-3 font-semibold text-zinc-200 group-hover:text-indigo-400 transition">{app.company}</td>
                  <td className="py-3 text-zinc-400">{app.role}</td>
                  <td className="py-3">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-semibold ${app.color}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="py-3 text-right text-zinc-500">{app.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}