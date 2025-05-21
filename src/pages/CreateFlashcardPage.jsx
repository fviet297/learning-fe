import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { createFlashcard } from '../services/api';

function CreateFlashcardPage() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const { moduleId } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      toast.error('Please enter both question and answer!');
      return;
    }

    try {
      await createFlashcard({
        question,
        answer,
        studyModuleId: moduleId
      });
      toast.success('Flashcard created successfully!');
      navigate(`/study-modules/${moduleId}`);
    } catch (error) {
      toast.error('Error creating flashcard!');
      console.error('Error creating flashcard:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-semibold mb-6 text-primary">Create Flashcard</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="question" className="block text-gray-700 font-medium mb-2">
            Question
          </label>
          <input
            id="question"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            placeholder="Enter your question..."
          />
        </div>

        <div>
          <label htmlFor="answer" className="block text-gray-700 font-medium mb-2">
            Answer
          </label>
          <textarea
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            rows="4"
            placeholder="Enter the answer..."
          />
        </div>

        <div className="flex justify-end gap-4 pt-4">
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
            className="bg-secondary text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors font-medium"
          >
            Create Flashcard
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}

export default CreateFlashcardPage;