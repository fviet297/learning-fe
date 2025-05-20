import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import { getStudyModuleById } from '../services/api';

function StudyModuleReview() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    const fetchModuleDetails = async () => {
      try {
        setLoading(true);
        const response = await getStudyModuleById(moduleId);
        if (response.status === 'Success') {
          setModule(response.data);
        } else {
          toast.error('Failed to fetch module details');
        }
      } catch (error) {
        toast.error('Error fetching module details!');
        console.error('Error fetching module details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchModuleDetails();
  }, [moduleId]);

  const handleNext = () => {
    if (module && currentFlashcardIndex < module.flashcards.length - 1) {
      setCurrentFlashcardIndex(prev => prev + 1);
      setShowAnswer(false);
    }
  };

  const handlePrevious = () => {
    if (currentFlashcardIndex > 0) {
      setCurrentFlashcardIndex(prev => prev - 1);
      setShowAnswer(false);
    }
  };

  const toggleAnswer = () => {
    setShowAnswer(prev => !prev);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="text-center p-6">
        <h2 className="text-xl text-red-600">Module not found</h2>
      </div>
    );
  }

  if (!module.flashcards || module.flashcards.length === 0) {
    return (
      <div className="text-center p-6">
        <h2 className="text-xl text-gray-600">No flashcards available in this module</h2>
        <button
          className="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          onClick={() => navigate('/study-modules')}
        >
          Back to Modules
        </button>
      </div>
    );
  }

  const currentFlashcard = module.flashcards[currentFlashcardIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-primary mb-2">{module.name}</h2>
        <p className="text-gray-600">{module.description}</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500">
            Flashcard {currentFlashcardIndex + 1} of {module.flashcards.length}
          </span>
          <span className="text-sm text-gray-500">
            Status: {currentFlashcard?.status || 'Unknown'}
          </span>
        </div>

        <motion.div
          key={currentFlashcardIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="mb-6"
        >
          <div className="text-xl font-medium mb-4">{currentFlashcard.question}</div>
          {showAnswer && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg text-gray-700 bg-gray-50 p-4 rounded-md"
            >
              {currentFlashcard.answer}
            </motion.div>
          )}
        </motion.div>

        <div className="flex justify-between items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-md ${
              currentFlashcardIndex === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-secondary text-white hover:bg-blue-600'
            }`}
            onClick={handlePrevious}
            disabled={currentFlashcardIndex === 0}
          >
            Previous
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            onClick={toggleAnswer}
          >
            {showAnswer ? 'Hide Answer' : 'Show Answer'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-md ${
              currentFlashcardIndex === module.flashcards.length - 1
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-secondary text-white hover:bg-blue-600'
            }`}
            onClick={handleNext}
            disabled={currentFlashcardIndex === module.flashcards.length - 1}
          >
            Next
          </motion.button>
        </div>
      </div>

      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors"
          onClick={() => navigate('/study-modules')}
        >
          Back to Modules
        </motion.button>
      </div>
    </motion.div>
  );
}

export default StudyModuleReview; 