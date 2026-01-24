import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiBook, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

function Sidebar({ onNavigate, isSidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const username = user?.fullName || "Người dùng";
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Đảm bảo luôn hiển thị đầy đủ khi sidebar được mở hoặc trên desktop
  const showFullSidebar = !isMobile || isSidebarOpen;

  // Theo dõi kích thước màn hình để phát hiện mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Kiểm tra kích thước ban đầu
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle navigation with callback
  const handleNavigation = (path) => {
    navigate(path);
    if (onNavigate) onNavigate();
  };

  const menuItems = [
    { id: 'home', icon: <FiHome className="w-5 h-5" />, label: 'Trang chủ', path: '/' },
  ];

  const handleLogout = () => {
    logout();
    if (onNavigate) onNavigate();
  };

  // Animation variants
  const menuItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="h-full w-full flex flex-col py-4 border-r border-white/5 bg-slate-800/50 backdrop-blur-xl">
      {/* Logo và tên ứng dụng */}
      <div className="px-4 py-2 mb-4">
        <div className="text-xl font-bold flex items-center gap-3 w-full">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg text-white shadow-lg shadow-indigo-500/20">
            <FiBook className="w-5 h-5" />
          </div>
          {showFullSidebar && (
            <span className="text-white text-lg">Learning App</span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-1 space-y-1">
        {menuItems.map((item) => (
          <div key={item.id}>
            <motion.button
              variants={menuItemVariants}
              whileHover={{ x: !showFullSidebar ? 0 : 4 }}
              onClick={() => handleNavigation(item.path)}
              className={`flex items-center justify-between ${!showFullSidebar ? 'px-2' : 'px-4 sm:px-6'} py-3 text-left w-full rounded-r-full transition-all ${location.pathname === item.path
                  ? 'bg-indigo-500/10 text-indigo-400 font-medium border-l-2 border-indigo-500'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className={`flex items-center justify-center ${!showFullSidebar ? 'w-8 h-8' : ''}`}>
                  {item.icon}
                </div>
                {showFullSidebar && <span className="text-sm sm:text-base">{item.label}</span>}
              </div>
            </motion.button>
          </div>
        ))}
      </div>

      <div className={`mt-auto px-4 pt-4 border-t border-white/5 ${!showFullSidebar ? 'hidden' : 'block'}`}>
        <div className="mb-4 px-2">
          <div className="text-xs text-slate-500 mb-1">Đang đăng nhập là</div>
          <div className="text-sm font-medium text-slate-300 truncate">{username}</div>
        </div>
        <motion.button
          variants={menuItemVariants}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            handleLogout();
            if (onNavigate) onNavigate();
          }}
          className="flex items-center gap-3 px-6 py-3 text-left w-full rounded-2xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors border border-transparent hover:border-rose-500/20"
        >
          <FiLogOut className="w-5 h-5" />
          <span className="font-medium">Đăng xuất</span>
        </motion.button>
      </div>
    </div>
  );
}

export default Sidebar;
