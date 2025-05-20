import React from 'react';

const StudyModuleCard = ({ module }) => {
  return (
    <div className="border p-4 rounded shadow-md hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-semibold">{module.name}</h2>
      <p className="text-gray-600 mt-2">{module.description}</p>
    </div>
  );
};

export default StudyModuleCard; 