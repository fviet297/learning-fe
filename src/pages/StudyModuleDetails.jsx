import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import { getStudyModuleById, getQuizzes } from '../services/api';

function StudyModuleDetails() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!moduleId) {
        toast.error('Module ID is missing');
        navigate('/study-modules');
        return;
      }

      try {
        setLoading(true);
        // Fetch module details
        const moduleResponse = await getStudyModuleById(moduleId);
        if (moduleResponse.status === 'Success') {
          setModule(moduleResponse.data);
        } else {
          toast.error('Failed to fetch module details');
        }

        // Fetch quizzes
        try {
          const quizzesResponse = await getQuizzes(moduleId);
          console.log('Quizzes response:', quizzesResponse); // Debug log
          if (Array.isArray(quizzesResponse)) {
            setQuizzes(quizzesResponse);
          } else if (quizzesResponse && quizzesResponse.data) {
            setQuizzes(quizzesResponse.data);
          } else {
            setQuizzes([]);
          }
        } catch (quizError) {
          console.error('Error fetching quizzes:', quizError);
          setQuizzes([]);
        }
      } catch (error) {
        toast.error('Error fetching module details!');
        console.error('Error fetching module details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [moduleId, navigate]);

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
        <button
          className="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          onClick={() => navigate('/study-modules')}
        >
          Back to Modules
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6"
    >
      <div className="flex items-center mb-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={() => navigate(`/study-modules`)}
          className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-all shadow-sm"
          title="Back to Module"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </motion.button>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-primary mb-2">{module.name}</h2>
        <p className="text-gray-600">{module.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Flashcards Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-primary mb-4">Flashcards</h3>
          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-secondary text-white p-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-between"
              onClick={() => navigate(`/study-modules/${moduleId}/create-flashcard`)}
            >
              <span>Create Flashcard</span>
              <span className="text-sm bg-white text-secondary px-2 py-1 rounded">
                {module.flashcards?.length || 0} cards
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-primary text-white p-4 rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => navigate(`/study-modules/${moduleId}/review-flashcard`)}
              disabled={!module.flashcards?.length}
            >
              Review Flashcards
            </motion.button>
          </div>
        </div>

        {/* Quizzes Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-primary mb-4">Quizzes</h3>
          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-secondary text-white p-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-between"
              onClick={() => navigate(`/study-modules/${moduleId}/create-quiz`)}
            >
              <span>Create Quiz</span>
              <span className="text-sm bg-white text-secondary px-2 py-1 rounded">
                {quizzes.length} quizzes
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-primary text-white p-4 rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => navigate(`/study-modules/${moduleId}/take-quiz`)}
              disabled={quizzes.length === 0}
            >
              Take Quiz
            </motion.button>
          </div>
        </div>
      </div>

      
    </motion.div>
  );
}

export default StudyModuleDetails; 