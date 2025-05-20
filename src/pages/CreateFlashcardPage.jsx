import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { createFlashcard } from '../services/api';

function CreateFlashcardPage() {
  const [content, setContent] = useState('');
  const { moduleId } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error('Please enter flashcard content!');
      return;
    }

    try {
      await createFlashcard({
        content,
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
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="content" className="block text-gray-700 font-medium mb-2">
            Flashcard Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            rows="4"
            placeholder="Enter flashcard content..."
          />
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
            Create Flashcard
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}

export default CreateFlashcardPage;