import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { createQuiz } from '../../services/api';

function QuizForm() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(0);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async () => {
    if (!question || options.some((opt) => !opt)) {
      toast.error('Please fill in all fields!');
      return;
    }
    try {
      await createQuiz({
        question,
        options: JSON.stringify(options),
        correctAnswer,
      });
      setQuestion('');
      setOptions(['', '', '', '']);
      setCorrectAnswer(0);
      toast.success('Quiz created successfully!');
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
      <h2 className="text-xl font-semibold mb-4 text-primary">Create Quiz</h2>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Enter question"
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary mb-4"
      />
      {options.map((opt, index) => (
        <input
          key={index}
          type="text"
          value={opt}
          onChange={(e) => handleOptionChange(index, e.target.value)}
          placeholder={`Option ${index + 1}`}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary mb-2"
        />
      ))}
      <select
        value={correctAnswer}
        onChange={(e) => setCorrectAnswer(parseInt(e.target.value))}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary mb-4"
      >
        {options.map((_, index) => (
          <option key={index} value={index}>
            Option {index + 1}
          </option>
        ))}
      </select>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSubmit}
        className="bg-secondary text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
      >
        Create
      </motion.button>
    </motion.div>
  );
}

export default QuizForm;