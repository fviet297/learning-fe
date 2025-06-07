import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import SearchBar from './SearchBar';
import { FiMenu } from 'react-icons/fi';

function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Update isMobile state on window resize
  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 768;
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
    // Đơn giản chỉ chuyển trạng thái
    setIsSidebarOpen(!isSidebarOpen);
    
    // Xử lý overflow cho body
    if (isMobile) {
      if (!isSidebarOpen) {
        // Khi mở sidebar: chặn scroll body
        document.body.style.overflow = 'hidden';
      } else {
        // Khi đóng sidebar: cho phép scroll body
        document.body.style.overflow = 'auto';
      }
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
      
      {/* Sidebar - Tiếp cận đơn giản hóa để đảm bảo hiển thị đầy đủ */}
      <div 
        className={`fixed lg:static z-30 h-screen bg-white border-r shadow-lg transition-transform duration-300 ${isSidebarOpen || !isMobile ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ width: '240px' }}
      >
        <Sidebar onNavigate={handleNavigation} isSidebarOpen={isSidebarOpen} />
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
          <h1 className="hidden lg:block ml-4 text-xl font-semibold text-gray-800">Learnindg App</h1>
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
