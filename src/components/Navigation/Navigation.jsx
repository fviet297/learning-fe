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
          {[
            { to: '/create-study-module', label: 'Create Study Module' },
            { to: '/study-modules', label: 'Study Modules' },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                  isActive ? 'bg-secondary text-white' : 'text-primary hover:bg-gray-100'
                }`
              }
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                {item.label}
              </motion.div>
            </NavLink>
          ))}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={logout}
            className="px-4 py-2 rounded-md font-medium text-white bg-red-500 hover:bg-red-600 transition-colors"
          >
            Logout
          </motion.button>
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