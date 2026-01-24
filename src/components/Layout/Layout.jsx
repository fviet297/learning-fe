import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { FiMenu } from 'react-icons/fi';

function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      if (isMobileView && isSidebarOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = 'auto';
    };
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    if (isMobile) {
      document.body.style.overflow = !isSidebarOpen ? 'hidden' : 'auto';
    }
  };

  const handleNavigation = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
      document.body.style.overflow = 'auto';
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Background blobs for consistency with LoginPage */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 bg-slate-900 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Mobile overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky lg:top-0 z-50 h-screen transition-all duration-300 ease-in-out ${isMobile
          ? (isSidebarOpen ? 'translate-x-0 w-[280px]' : '-translate-x-full w-[280px]')
          : 'w-72 translate-x-0'
          }`}
      >
        <div className="h-full bg-slate-800/50 backdrop-blur-xl border-r border-white/5 rounded-r-[2rem] lg:rounded-r-none lg:rounded-none shadow-2xl lg:shadow-none">
          {/* Pass className to Sidebar if it accepts it to styling, or we assume Sidebar is largely transparent */}
          <Sidebar onNavigate={handleNavigation} isSidebarOpen={true} />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative z-10 transition-all duration-300">
        {/* Mobile header (Sticky) */}
        <header className="lg:hidden sticky top-0 z-30 bg-slate-800/80 backdrop-blur-xl border-b border-white/5 p-4 flex items-center justify-between shadow-lg">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-xl bg-slate-700 shadow-sm border border-slate-600 text-slate-200 hover:text-indigo-400 focus:outline-none transition-all active:scale-95"
          >
            <FiMenu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <span className="font-bold text-xs">L</span>
            </div>
            <span className="font-bold text-slate-100">Learning App</span>
          </div>
          <div className="w-10"></div> {/* Spacer */}
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
