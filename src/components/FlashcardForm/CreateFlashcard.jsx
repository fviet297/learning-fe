import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import FlashcardForm from './FlashcardForm';

function CreateFlashcard() {
  const { moduleId } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(`/study-modules/${moduleId}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBack}
          className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded shadow-sm"
        >
          ← Back
        </motion.button>
        <h2 className="text-2xl font-semibold text-primary">Create New Flashcard</h2>
      </div>

      <FlashcardForm studyModuleId={moduleId} />
    </div>
  );
}

export default CreateFlashcard;
