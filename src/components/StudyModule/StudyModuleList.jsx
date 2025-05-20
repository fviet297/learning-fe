import React from 'react';
import { motion } from 'framer-motion';
import StudyModuleCard from './StudyModuleCard';

function StudyModuleList({ modules = [], onModuleSelect }) {
  if (!modules || modules.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-gray-500 py-8"
      >
        No study modules available
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {modules.map((module) => (
        <motion.div
          key={module.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onModuleSelect(module.id)}
          className="cursor-pointer"
        >
          <StudyModuleCard module={module} />
        </motion.div>
      ))}
    </div>
  );
}

export default StudyModuleList; 