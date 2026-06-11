import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';

export default function DashboardLayout({ children, currentPage, onPageChange, theme, onThemeToggle }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground antialiased selection:bg-zinc-800 transition-colors">
      <Sidebar currentPage={currentPage} onPageChange={onPageChange} theme={theme} onThemeToggle={onThemeToggle} />
      
      <div className="flex-1 flex flex-col min-w-0 pl-16">
        <Navbar />
        <main className="flex-1 p-6 md:p-8 w-full mx-auto overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}

