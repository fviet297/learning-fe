import React, { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';

function Navigation() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="flex justify-around bg-white p-4 rounded-lg shadow-md mb-6">
      {user ? (
        <>
          <NavLink
  to="/"
  className={({ isActive }) =>
    `px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
      isActive ? 'bg-secondary text-white' : 'text-primary hover:bg-gray-100'
    }`
  }
>
  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
    Home
  </motion.div>
</NavLink>
<NavLink
  to="/study-modules"
  className={({ isActive }) =>
    `px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
      isActive ? 'bg-secondary text-white' : 'text-primary hover:bg-gray-100'
    }`
  }
>
  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
    Study Modules
  </motion.div>
</NavLink>
          <div className="flex items-center gap-3">
  {user && (
    <>
      {/* Hiển thị avatar nếu có */}
      {user.avatarUrl ? (
        <img src={user.avatarUrl} alt="avatar" className="w-8 h-8 rounded-full object-cover border-2 border-white" />
      ) : (
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-lg font-bold text-primary">
          {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
        </div>
      )}
      {/* Hiển thị tên người dùng */}
      <span className="font-medium text-primary bg-white px-2 py-1 rounded-md">{user.username || 'User'}</span>
    </>
  )}
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={logout}
    className="px-4 py-2 rounded-md font-medium text-white bg-red-500 hover:bg-red-600 transition-colors"
  >
    Logout
  </motion.button>
</div>
        </>
      ) : (
        <>
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                isActive ? 'bg-secondary text-white' : 'text-primary hover:bg-gray-100'
              }`
            }
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Login
            </motion.div>
          </NavLink>
          <NavLink
            to="/register"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                isActive ? 'bg-secondary text-white' : 'text-primary hover:bg-gray-100'
              }`
            }
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Register
            </motion.div>
          </NavLink>
        </>
      )}
    </nav>
  );
}

export default Navigation;