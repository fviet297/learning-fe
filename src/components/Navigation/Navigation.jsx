import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

function Navigation() {
  return (
    <nav className="flex justify-around bg-white p-4 rounded-lg shadow-md mb-6">
      {[
        { to: '/', label: 'Create Flashcard' },
        { to: '/review-flashcard', label: 'Review Flashcard' },
        { to: '/create-quiz', label: 'Create Quiz' },
        { to: '/take-quiz', label: 'Take Quiz' },
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
    </nav>
  );
}

export default Navigation;