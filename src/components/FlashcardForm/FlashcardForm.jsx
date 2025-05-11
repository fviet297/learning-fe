import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { createFlashcard } from '../../services/api';

function FlashcardForm() {
  const [content, setContent] = useState('');

  const handleSubmit = async () => {
    if (!content) {
      toast.error('Please enter flashcard content!');
      return;
    }
    try {
      await createFlashcard({ content, status: 'LEARN' });
      setContent('');
      toast.success('Flashcard created successfully!');
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
      className=" mx-auto bg-white p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-xl font-semibold mb-4 text-primary">Create Flashcard</h2>
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter flashcard content"
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary mb-4"
      />
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

export default FlashcardForm;