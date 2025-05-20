import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getQuizzes, submitQuiz } from '../services/api';

function QuizTest() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!moduleId) {
        toast.error('Module ID is missing');
        navigate('/study-modules');
        return;
      }

      try {
        setLoading(true);
        const response = await getQuizzes(moduleId);
        console.log('Quiz response:', response); // Debug log
        if (Array.isArray(response)) {
          setQuiz(response[0]); // Take the first quiz
        } else if (response && response.data) {
          setQuiz(response.data[0]); // Take the first quiz from data array
        } else {
          toast.error('No quiz available');
          navigate(`/study-modules/${moduleId}`);
        }
      } catch (error) {
        console.error('Error fetching quiz:', error);
        toast.error('Failed to load quiz');
        navigate(`/study-modules/${moduleId}`);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [moduleId, navigate]);

  const handleAnswerSelect = (questionId, answerId) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const handleSubmit = async () => {
    if (!moduleId) {
      toast.error('Module ID is missing');
      return;
    }

    try {
      setSubmitting(true);
      const submission = {
        quizId: quiz.id,
        answers: Object.entries(selectedAnswers).map(([questionId, answerId]) => ({
          questionId: parseInt(questionId),
          answerId: parseInt(answerId)
        }))
      };

      const result = await submitQuiz(moduleId, submission);
      toast.success('Quiz submitted successfully!');
      navigate(`/study-modules/${moduleId}/quiz-result`, { state: { result } });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="text-center p-6">
        <h2 className="text-xl text-red-600">No quiz available</h2>
        <button
          className="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          onClick={() => navigate(`/study-modules/${moduleId}`)}
        >
          Back to Module
        </button>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-primary mb-2">{quiz.title}</h2>
        <p className="text-gray-600">Question {currentQuestionIndex + 1} of {quiz.questions.length}</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">{currentQuestion.text}</h3>
        <div className="space-y-4">
          {currentQuestion.answers.map((answer) => (
            <motion.button
              key={answer.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                selectedAnswers[currentQuestion.id] === answer.id
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-200 hover:border-primary/50'
              }`}
              onClick={() => handleAnswerSelect(currentQuestion.id, answer.id)}
            >
              {answer.text}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors"
          onClick={() => navigate(`/study-modules/${moduleId}`)}
        >
          Exit Quiz
        </motion.button>

        <div className="space-x-4">
          {currentQuestionIndex > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-secondary text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
              onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
            >
              Previous
            </motion.button>
          )}

          {!isLastQuestion ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
            >
              Next
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
              onClick={handleSubmit}
              disabled={submitting || Object.keys(selectedAnswers).length !== quiz.questions.length}
            >
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default QuizTest; 