import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function DashboardLayout({ children, currentPage, onPageChange, theme, onThemeToggle, user, onLogout }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground antialiased transition-colors duration-300">
      <Sidebar currentPage={currentPage} onPageChange={onPageChange} theme={theme} onThemeToggle={onThemeToggle} />

      <div className="flex-1 flex flex-col min-w-0 pl-16">
        <Navbar user={user} onLogout={onLogout} onPageChange={onPageChange} />
        <main key={currentPage} className="flex-1 p-6 md:p-8 w-full mx-auto overflow-y-auto bg-background animate-fade-in-up">
          {children}
        </main>
      </div>
    </div>
  );
}

