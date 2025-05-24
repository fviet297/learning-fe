import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { createBulkQuizzes } from '../services/api';

function CreateQuizPage() {
  const [quizzes, setQuizzes] = useState([
    {
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    }
  ]);
  const { moduleId } = useParams();
  const navigate = useNavigate();

  const handleQuestionChange = (quizIndex, value) => {
    const newQuizzes = [...quizzes];
    newQuizzes[quizIndex].question = value;
    setQuizzes(newQuizzes);
  };

  const handleOptionChange = (quizIndex, optionIndex, value) => {
    const newQuizzes = [...quizzes];
    newQuizzes[quizIndex].options[optionIndex] = value;
    setQuizzes(newQuizzes);
  };

  const handleCorrectAnswerChange = (quizIndex, optionIndex) => {
    const newQuizzes = [...quizzes];
    newQuizzes[quizIndex].correctAnswer = optionIndex;
    setQuizzes(newQuizzes);
  };

  const handleAddQuiz = () => {
    if (quizzes.length < 20) {
      setQuizzes([...quizzes, { question: '', options: ['', '', '', ''], correctAnswer: 0 }]);
    } else {
      toast.warning('Maximum 20 quizzes allowed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all quizzes
    const validQuizzes = quizzes.filter(quiz => {
      return quiz.question.trim() && !quiz.options.some(option => !option.trim());
    });
    
    if (validQuizzes.length === 0) {
      toast.error('Please enter at least one quiz with question and all options filled!');
      return;
    }

    try {
      // Prepare the payload with the requested structure
      const payload = {
        studyModuleId: moduleId,
        quizRequests: validQuizzes.map(quiz => ({
          question: quiz.question,
          options: JSON.stringify(quiz.options),
          correctAnswer: quiz.correctAnswer
        }))
      };

      await createBulkQuizzes(payload);
      toast.success(`${validQuizzes.length} quiz(zes) created successfully!`);
      navigate(`/study-modules/${moduleId}`);
    } catch (error) {
      toast.error('Error creating quizzes!');
      console.error('Error creating quizzes:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-semibold mb-6 text-primary">Create Quizzes</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {quizzes.map((quiz, quizIndex) => (
          <motion.div 
            key={quizIndex} 
            className="p-4 border-2 border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 bg-gray-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-medium mb-3 text-primary">Quiz #{quizIndex + 1}</h3>
            
            <div className="mb-4">
              <label htmlFor={`question-${quizIndex}`} className="block text-gray-700 font-medium mb-2">
                Questions
              </label>
              <textarea
                id={`question-${quizIndex}`}
                value={quiz.question}
                onChange={(e) => handleQuestionChange(quizIndex, e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary bg-white"
                rows="3"
                placeholder="Enter your question..."
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Options</label>
              {quiz.options.map((option, optionIndex) => (
                <div key={optionIndex} className="mb-2 flex items-center">
                  <input
                    type="radio"
                    id={`quiz-${quizIndex}-option-${optionIndex}`}
                    name={`quiz-${quizIndex}-correctAnswer`}
                    checked={quiz.correctAnswer === optionIndex}
                    onChange={() => handleCorrectAnswerChange(quizIndex, optionIndex)}
                    className="mr-2"
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(quizIndex, optionIndex, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary bg-white"
                    placeholder={`Option ${optionIndex + 1}`}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddQuiz}
          className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors font-medium"
        >
          + Add Another Quiz
        </motion.button>

        <div className="flex justify-end gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => navigate(`/study-modules/${moduleId}`)}
            className="px-6 py-2 rounded-md font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-secondary text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Create Quizzes
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}

export default CreateQuizPage;