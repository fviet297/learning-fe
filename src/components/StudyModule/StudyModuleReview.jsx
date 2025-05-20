import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getStudyModuleById } from '../../services/api';
import StudyModuleCard from './StudyModuleCard';

function StudyModuleReview({ moduleId }) {
  const [studyModule, setStudyModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchStudyModule = async () => {
    try {
      setLoading(true);
      const response = await getStudyModuleById(moduleId);
      console.log('Study Module Response:', response); // Debug log
      setStudyModule(response);
    } catch (error) {
      toast.error('Error fetching study module!');
      console.error('Error fetching study module:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFlashcard = () => {
    navigate(`/study-modules/${moduleId}/create-flashcard`);
  };

  const handleReviewFlashcard = () => {
    navigate(`/study-modules/${moduleId}/review-flashcard`);
  };

  const handleCreateQuiz = () => {
    navigate(`/study-modules/${moduleId}/create-quiz`);
  };

  const handleTakeQuiz = () => {
    navigate(`/study-modules/${moduleId}/take-quiz`);
  };

  const handleBackToList = () => {
    navigate('/study-modules');
  };

  useEffect(() => {
    fetchStudyModule();
  }, [moduleId]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg text-center text-gray-500"
      >
        Loading study module...
      </motion.div>
    );
  }

  if (!studyModule) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg text-center text-gray-500"
      >
        Study module not found
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBackToList}
            className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded shadow-sm"
          >
            ← Back
          </motion.button>
          <h2 className="text-2xl font-semibold text-primary">Study Module Details</h2>
        </div>
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateFlashcard}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded shadow-sm"
          >
            Create Flashcard
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateQuiz}
            className="bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-2 rounded shadow-sm"
          >
            Create Quiz
          </motion.button>
        </div>
      </div>

      <StudyModuleCard module={studyModule} />

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Flashcards Section */}
        <div className="bg-gray-50 p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Flashcards</h3>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReviewFlashcard}
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded shadow-sm"
              >
                Review
              </motion.button>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {studyModule.flashcards?.length || 0} cards
              </span>
            </div>
          </div>
          <div className="space-y-3">
            {studyModule.flashcards?.map((flashcard) => (
              <motion.div
                key={flashcard.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
              >
                <p className="text-gray-700">{flashcard.content}</p>
              </motion.div>
            ))}
            {(!studyModule.flashcards || studyModule.flashcards.length === 0) && (
              <p className="text-gray-500 text-center py-4">No flashcards available</p>
            )}
          </div>
        </div>

        {/* Quizzes Section */}
        <div className="bg-gray-50 p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Quizzes</h3>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleTakeQuiz}
                className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded shadow-sm"
              >
                Take Quiz
              </motion.button>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                {studyModule.quizzes?.length || 0} quizzes
              </span>
            </div>
          </div>
          <div className="space-y-3">
            {studyModule.quizzes?.map((quiz) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
              >
                <p className="text-gray-700 font-medium">{quiz.question}</p>
                <div className="mt-2 text-sm text-gray-500">
                  {quiz.options?.length || 0} options
                </div>
              </motion.div>
            ))}
            {(!studyModule.quizzes || studyModule.quizzes.length === 0) && (
              <p className="text-gray-500 text-center py-4">No quizzes available</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default StudyModuleReview; 