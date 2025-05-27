import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiBook, FiUser, FiLogOut } from 'react-icons/fi';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const username = "John Doe"; // Thay thế bằng tên user thực từ context hoặc state

  const menuItems = [
    { icon: <FiHome className="w-6 h-6" />, label: 'Home', path: '/' },
    { icon: <FiBook className="w-6 h-6" />, label: 'Study Modules', path: '/study-modules' },
    { icon: <FiUser className="w-6 h-6" />, label: username, path: '/profile' },
  ];

  const handleLogout = () => {
    // Thêm logic logout ở đây
    navigate('/login');
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg flex flex-col py-6">
      {menuItems.map((item) => (
        <motion.button
          key={item.path}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(item.path)}
          className={`flex items-center gap-4 px-6 py-3 text-left w-full hover:bg-gray-50 transition-colors ${
            location.pathname === item.path ? 'bg-gray-100 text-primary' : 'text-gray-600'
          }`}
        >
          {item.icon}
          <span className="font-medium">{item.label}</span>
        </motion.button>
      ))}

      <div className="mt-auto">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="flex items-center gap-4 px-6 py-3 text-left w-full text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <FiLogOut className="w-6 h-6" />
          <span className="font-medium">Logout</span>
        </motion.button>
      </div>
    </div>
  );
}

export default Sidebar;
