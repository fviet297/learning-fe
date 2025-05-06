import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';
import { getQuizzes, submitQuiz } from '../../services/api';

function QuizTest() {
  const { user } = useContext(AuthContext);
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);

  const fetchQuizzes = async () => {
    try {
      const response = await getQuizzes();
      setQuizzes(response.data);
      if (response.data.length > 0) setCurrentQuiz(response.data[0]);
    } catch (error) {
      toast.error('Error fetching quizzes!');
      console.error('Error fetching quizzes:', error);
    }
  };

  const handleSubmit = async () => {
    if (!currentQuiz || selectedOption === null) {
      toast.error('Please select an option!');
      return;
    }
    try {
      const response = await submitQuiz({
        quizId: currentQuiz.id,
        userId: user.userId,
        selectedOption,
      });
      const newScore = score + response.data.score;
      setScore(newScore);
      toast.success(`Score: ${response.data.score} points!`);
      setSelectedOption(null);
      const nextQuiz = quizzes[quizzes.indexOf(currentQuiz) + 1];
      setCurrentQuiz(nextQuiz || null);
    } catch (error) {
      toast.error('Error submitting quiz!');
      console.error('Error submitting quiz:', error);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  if (!currentQuiz) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg text-center text-gray-500"
      >
        No quizzes available.
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-xl font-semibold mb-4 text-primary">Take Quiz</h2>
      <p className="text-lg mb-4">Current Score: {score}</p>
      <p className="text-lg mb-4">{currentQuiz.question}</p>
      {JSON.parse(currentQuiz.options).map((option, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.02 }}
          className="flex items-center mb-2"
        >
          <input
            type="radio"
            name="option"
            checked={selectedOption === index}
            onChange={() => setSelectedOption(index)}
            className="mr-2"
          />
          <label className="text-gray-700">{option}</label>
        </motion.div>
      ))}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSubmit}
        className="bg-secondary text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors mt-4"
      >
        Submit
      </motion.button>
    </motion.div>
  );
}

export default QuizTest;