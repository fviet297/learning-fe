import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { createQuiz } from '../services/api';

function CreateQuizPage() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const { moduleId } = useParams();
  const navigate = useNavigate();

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) {
      toast.error('Please enter a question!');
      return;
    }
    if (options.some(option => !option.trim())) {
      toast.error('Please fill in all options!');
      return;
    }

    try {
      await createQuiz({
        question,
        options: JSON.stringify(options),
        correctAnswer,
        studyModuleId: moduleId
      });
      toast.success('Quiz created successfully!');
      navigate(`/study-modules/${moduleId}`);
    } catch (error) {
      toast.error('Error creating quiz!');
      console.error('Error creating quiz:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-semibold mb-6 text-primary">Create Quiz</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="question" className="block text-gray-700 font-medium mb-2">
            Question
          </label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            rows="3"
            placeholder="Enter your question..."
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Options</label>
          {options.map((option, index) => (
            <div key={index} className="mb-2">
              <input
                type="radio"
                id={`option${index}`}
                name="correctAnswer"
                checked={correctAnswer === index}
                onChange={() => setCorrectAnswer(index)}
                className="mr-2"
              />
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder={`Option ${index + 1}`}
              />
            </div>
          ))}
        </div>

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
            Create Quiz
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}

export default CreateQuizPage;