import { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { ConfirmProvider } from './context/ConfirmContext';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardOverview from './features/dashboard/DashboardOverview';
import ResumeOptimization from './pages/ResumeOptimization';
import JobDiscovery from './pages/JobDiscovery';
import ApplicationTracker from './pages/ApplicationTracker';
import InterviewHub from './pages/InterviewHub';
import Profile from './pages/Profile';
import LandingPage from './pages/LandingPage';
import { useData } from './context/DataContext';

export default function App() {
  const { resetAllData, refreshAll } = useData();
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('authUser')); } catch { return null; }
  });

  const [currentPage, setCurrentPage] = useState(() =>
    localStorage.getItem('authToken') ? 'Dashboard' : 'Landing'
  );

  // Handle OAuth redirect: ?token=xxx&user=yyy or ?oauth_error=xxx
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userParam = params.get('user');
    const oauthError = params.get('oauth_error');
    if (token && userParam) {
      try {
        const userData = JSON.parse(decodeURIComponent(userParam));
        localStorage.setItem('authToken', token);
        localStorage.setItem('authUser', JSON.stringify(userData));
        setUser(userData);
        resetAllData();
        refreshAll();
        setCurrentPage('Dashboard');
        window.history.replaceState({}, '', window.location.pathname);
      } catch { /* malformed params — ignore */ }
    } else if (oauthError) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.classList.toggle('light', theme !== 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleLogin = (userData, token) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('authUser', JSON.stringify(userData));
    setUser(userData);
    resetAllData();
    refreshAll();
    setCurrentPage('Dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setUser(null);
    resetAllData();
    setCurrentPage('Landing');
  };

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  if (currentPage === 'Landing') {
    return <LandingPage onLogin={handleLogin} />;
  }

  return (
    <ConfirmProvider>
    <ToastProvider>
      <DashboardLayout
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        theme={theme}
        onThemeToggle={toggleTheme}
        user={user}
        onLogout={handleLogout}
      >
        {currentPage === 'Dashboard'            && <DashboardOverview onPageChange={setCurrentPage} />}
        {currentPage === 'Resume Optimization'  && <ResumeOptimization />}
        {currentPage === 'Job Discovery'        && <JobDiscovery />}
        {currentPage === 'Application Tracker'  && <ApplicationTracker />}
        {currentPage === 'Interview Hub'        && <InterviewHub />}
        {currentPage === 'Profile'              && <Profile onPageChange={setCurrentPage} />}
      </DashboardLayout>
    </ToastProvider>
    </ConfirmProvider>
  );
}
