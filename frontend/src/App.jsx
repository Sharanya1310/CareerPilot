import React, { useState, useEffect } from 'react';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardOverview from './features/dashboard/DashboardOverview';
import ResumeOptimization from './pages/ResumeOptimization';
import JobDiscovery from './pages/JobDiscovery';
import ApplicationTracker from './pages/ApplicationTracker';
import CompanyTracker from './pages/CompanyTracker';
import InterviewHub from './pages/InterviewHub';
import Profile from './pages/Profile';

export default function App() {
  const [currentPage, setCurrentPage] = useState('Profile'); // Defaulting to Profile for verification
  
  // Theme state: default to dark to preserve branding, falling back to system or localStorage
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    // Fallback: default to dark
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <DashboardLayout 
      currentPage={currentPage} 
      onPageChange={setCurrentPage}
      theme={theme}
      onThemeToggle={toggleTheme}
    >
      {currentPage === 'Dashboard' && <DashboardOverview />}
      {currentPage === 'Resume Optimization' && <ResumeOptimization />}
      {currentPage === 'Job Discovery' && <JobDiscovery />}
      {currentPage === 'Application Tracker' && <ApplicationTracker />}
      {currentPage === 'Company Tracker' && <CompanyTracker />}
      {currentPage === 'Interview Hub' && <InterviewHub />}
      {currentPage === 'Profile' && <Profile />}
    </DashboardLayout>
  );
}


