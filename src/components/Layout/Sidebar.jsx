import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiBook, FiUser, FiLogOut, FiLayers, FiBookOpen, FiBriefcase, FiSettings, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

function Sidebar({ onNavigate, isSidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const username = user?.fullName || "Người dùng";
  const [expandedMenu, setExpandedMenu] = useState(null);
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

  const toggleSubmenu = (menuId) => {
    setExpandedMenu(expandedMenu === menuId ? null : menuId);
  };

  // Handle navigation with callback
  const handleNavigation = (path) => {
    navigate(path);
    if (onNavigate) onNavigate();
  };

  const menuItems = [
    { id: 'home', icon: <FiHome className="w-5 h-5" />, label: 'Trang chủ', path: '/' },
    {
      id: 'modules',
      icon: <FiBook className="w-5 h-5" />,
      label: 'Học tập',
      hasSubmenu: true,
      submenu: [
        { icon: <FiLayers className="w-4 h-4" />, label: 'Module học tập', path: '/study-modules' },
        { icon: <FiBookOpen className="w-4 h-4" />, label: 'Flashcards', path: '/flashcards' },
        { icon: <FiBriefcase className="w-4 h-4" />, label: 'Quiz', path: '/quizzes' }
      ]
    },
    { id: 'profile', icon: <FiUser className="w-5 h-5" />, label: username, path: '/profile' },
    { id: 'settings', icon: <FiSettings className="w-5 h-5" />, label: 'Cài đặt', path: '/settings' },
  ];

  const handleLogout = () => {
    logout();
    if (onNavigate) onNavigate();
  };

  // Animation variants - Đơn giản hóa để đảm bảo hiển thị đúng
  const menuItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  const submenuVariants = {
    hidden: { height: 0, opacity: 0, overflow: 'hidden' },
    visible: {
      height: 'auto',
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
        staggerChildren: 0.05
      }
    }
  };

  const submenuItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="h-full w-full flex flex-col py-4 border-r border-gray-100">
      {/* Logo và tên ứng dụng */}
      <div className="px-4 py-2 mb-4">
        <div className="text-xl font-bold text-primary flex items-center gap-3 w-full">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg text-blue-600">
            <FiBook className="w-5 h-5" />
          </div>
          {showFullSidebar && (
            <span className="text-gray-800 text-lg">Learning App</span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-1">
        {menuItems.map((item) => (
          <div key={item.id} className="mb-1">
            <motion.button
              variants={menuItemVariants}
              whileHover={{ x: !showFullSidebar ? 0 : 4 }}
              onClick={() => item.hasSubmenu ? toggleSubmenu(item.id) : handleNavigation(item.path)}
              className={`flex items-center justify-between ${!showFullSidebar ? 'px-2' : 'px-4 sm:px-6'} py-3 text-left w-full rounded-r-full hover:bg-blue-50 transition-all ${(location.pathname === item.path || (item.hasSubmenu && expandedMenu === item.id))
                ? 'bg-blue-100 text-primary font-medium'
                : 'text-gray-600'
                }`}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className={`flex items-center justify-center ${!showFullSidebar ? 'w-8 h-8' : ''} ${(location.pathname === item.path || (item.hasSubmenu && expandedMenu === item.id)) ? 'text-primary' : 'text-gray-500'}`}>
                  {item.icon}
                </div>
                {showFullSidebar && <span className="text-sm sm:text-base">{item.label}</span>}
              </div>
              {item.hasSubmenu && (
                <motion.div
                  animate={{ rotate: expandedMenu === item.id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiChevronDown className="w-4 h-4" />
                </motion.div>
              )}
            </motion.button>

            {item.hasSubmenu && (
              <AnimatePresence>
                {expandedMenu === item.id && (
                  <motion.div
                    variants={submenuVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="ml-8 overflow-hidden"
                  >
                    {item.submenu.map((subItem) => (
                      <motion.button
                        key={subItem.path}
                        variants={submenuItemVariants}
                        whileHover={{ x: 2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleNavigation(subItem.path)}
                        className={`flex items-center gap-3 px-5 py-2 text-left w-full rounded-r-full hover:bg-blue-50 ${location.pathname === subItem.path ? 'text-primary font-medium' : 'text-gray-500'}`}
                      >
                        {subItem.icon}
                        <span className="text-sm">{subItem.label}</span>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        ))}
      </div>

      <div className={`mt-auto px-4 pt-4 border-t border-gray-100 ${!showFullSidebar ? 'hidden' : 'block'}`}>
        <motion.button
          variants={menuItemVariants}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            handleLogout();
            if (onNavigate) onNavigate();
          }}
          className="flex items-center gap-3 px-6 py-3 text-left w-full rounded-full text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors"
        >
          <FiLogOut className="w-5 h-5" />
          <span className="font-medium">Đăng xuất</span>
        </motion.button>
      </div>
    </div>
  );
}

export default Sidebar;
