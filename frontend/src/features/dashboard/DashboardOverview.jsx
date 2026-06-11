import React from 'react';
import { LayoutDashboard } from 'lucide-react';
import StatsGrid from './components/StatsGrid';
import AnalyticsSection from './components/AnalyticsSection';
import ATSWidget from './components/ATSWidget';
import MissingSkills from './components/MissingSkills';
import RecommendedJobs from './components/RecommendedJobs';
import RecentApplications from './components/RecentApplications';
import TrackedCompanies from './components/TrackedCompanies';
import QuickActions from './components/QuickActions';
import UpcomingInterviews from './components/UpcomingInterviews';

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5 text-indigo-400" />
          Dashboard
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Overview of your career pipelines, matches, and tracker telemetry.
        </p>
      </div>

      {/* Executive Key Metrics Funnel Row */}
      <StatsGrid />

      {/* Row 2: Application Status (left) & Monthly Applications Chart (right) */}
      <AnalyticsSection />

      {/* Row 3: ATS Score (left) & Missing Skills (right) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <ATSWidget />
        <MissingSkills />
      </div>

      {/* Row 4: Recommended Jobs */}
      <RecommendedJobs />

      {/* Row 5: Recent Applications (left) & Upcoming Interviews (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <RecentApplications />
        </div>
        <div>
          <UpcomingInterviews />
        </div>
      </div>

      {/* Row 6: Tracked Companies */}
      <TrackedCompanies />
      
      {/* Row 7: Quick Actions */}
      <QuickActions />
    </div>
  );
}
