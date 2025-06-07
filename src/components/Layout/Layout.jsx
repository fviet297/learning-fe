import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import SearchBar from './SearchBar';
import { FiMenu } from 'react-icons/fi';

function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Update isMobile state on window resize
  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 1024;
      setIsMobile(isMobileView);
      
      // Auto-close sidebar when switching to mobile view
      if (isMobileView && isSidebarOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Check initial size
    
    return () => {
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = 'auto';
    };
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    if (!isMobile) return;
    
    if (!isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  // Close sidebar when clicking on a link (for mobile)
  const handleNavigation = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
      document.body.style.overflow = 'auto';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      {/* Mobile overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed lg:static z-30 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <Sidebar onNavigate={handleNavigation} />
      </div>
      
      {/* Main content */}
      <div className={`flex-1 min-w-0 transition-all duration-300 ${
        isSidebarOpen && !isMobile ? 'ml-64' : 'ml-0 lg:ml-64'
      }`}>
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-20 bg-white shadow-sm p-4 flex items-center">
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle menu"
          >
            <FiMenu className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="hidden lg:block ml-4 text-xl font-semibold text-gray-800">Learning App</h1>
        </div>
        
        <div className="p-4 lg:p-6">
          <SearchBar />
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}

export default Layout;
