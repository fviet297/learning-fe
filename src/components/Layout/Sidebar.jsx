import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiBook, FiUser, FiLogOut, FiLayers, FiBookOpen, FiBriefcase, FiSettings, FiChevronDown } from 'react-icons/fi';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const username = "Người dùng"; // Thay thế bằng tên user thực từ context hoặc state
  const [expandedMenu, setExpandedMenu] = useState(null);

  const toggleSubmenu = (menuId) => {
    setExpandedMenu(expandedMenu === menuId ? null : menuId);
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
    // Thêm logic logout ở đây
    console.log('Đăng xuất');
    navigate('/login');
  };

  // Animation variants
  const sidebarVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        when: "beforeChildren", 
        staggerChildren: 0.1,
        duration: 0.3,
        type: "spring", 
        stiffness: 300,
        damping: 24
      } 
    }
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
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
    <motion.div 
      className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl flex flex-col py-6 border-r border-gray-100"
      initial="hidden"
      animate="visible"
      variants={sidebarVariants}
    >
      <div className="px-6 mb-6">
        <motion.div 
          className="text-xl font-bold text-primary flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <FiBook className="w-6 h-6" />
          <span>Learning App</span>
        </motion.div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.id} className="mb-1">
            <motion.button
              variants={menuItemVariants}
              whileHover={{ x: 4 }}
              onClick={() => item.hasSubmenu ? toggleSubmenu(item.id) : navigate(item.path)}
              className={`flex items-center justify-between px-6 py-3 text-left w-full rounded-r-full hover:bg-blue-50 transition-all ${
                (location.pathname === item.path || (item.hasSubmenu && expandedMenu === item.id)) 
                  ? 'bg-blue-100 text-primary font-medium' 
                  : 'text-gray-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`${(location.pathname === item.path || (item.hasSubmenu && expandedMenu === item.id)) ? 'text-primary' : 'text-gray-500'}`}>
                  {item.icon}
                </div>
                <span>{item.label}</span>
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
                        onClick={() => navigate(subItem.path)}
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

      <div className="mt-auto px-4 pt-4 border-t border-gray-100">
        <motion.button
          variants={menuItemVariants}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="flex items-center gap-3 px-6 py-3 text-left w-full rounded-full text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors"
        >
          <FiLogOut className="w-5 h-5" />
          <span className="font-medium">Đăng xuất</span>
        </motion.button>
      </div>
    </motion.div>
  );
}

export default Sidebar;
