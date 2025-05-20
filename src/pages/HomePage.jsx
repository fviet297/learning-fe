import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-4">Welcome to Learning App</h1>
        <p className="text-gray-600 text-lg">
          Your personal learning companion for effective study and review
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-lg shadow-md cursor-pointer"
          onClick={() => navigate('/study-modules')}
        >
          <h2 className="text-xl font-semibold text-primary mb-3">Study Modules</h2>
          <p className="text-gray-600">
            Access your study modules, review flashcards, and take quizzes to test your knowledge.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-lg shadow-md cursor-pointer"
          onClick={() => navigate('/create-study-module')}
        >
          <h2 className="text-xl font-semibold text-primary mb-3">Create Module</h2>
          <p className="text-gray-600">
            Create new study modules, add flashcards, and design quizzes for your learning journey.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default HomePage; 