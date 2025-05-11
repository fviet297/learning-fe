import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getRandomFlashcard, updateFlashcard } from '../../services/api';

function FlashcardReview() {
  const [flashcard, setFlashcard] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const fetchRandomFlashcard = async () => {
    try {
      const response = await getRandomFlashcard();
      setFlashcard(response);
      setIsFlipped(false);
    } catch (error) {
      toast.error('Error fetching flashcard!');
      console.error('Error fetching flashcard:', error);
    }
  };

  const handleStatusUpdate = async (status) => {
    if (!flashcard) return;
    try {
      await updateFlashcard(flashcard.id, { ...flashcard, status });
      toast.success(`Marked as ${status}!`);
      fetchRandomFlashcard();
    } catch (error) {
      toast.error('Error updating flashcard!');
      console.error('Error updating flashcard:', error);
    }
  };

  useEffect(() => {
    fetchRandomFlashcard();
  }, []);

  if (!flashcard) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className=" mx-auto bg-white p-6 rounded-lg shadow-lg text-center text-gray-500"
      >
        No flashcards to review.
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className=" mx-auto bg-white p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-xl font-semibold mb-4 text-primary">Review Flashcard</h2>
      <motion.div
        className="bg-gray-100 p-6 rounded-md text-center text-lg mb-4 cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5 }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {flashcard.content}
      </motion.div>
      <div className="flex justify-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleStatusUpdate('LEARN')}
          className="bg-yellow-500 text-white px-6 py-2 rounded-md hover:bg-yellow-600 transition-colors"
        >
          Learn Again
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleStatusUpdate('KNOWN')}
          className="bg-accent text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors"
        >
          Known
        </motion.button>
      </div>
    </motion.div>
  );
}

export default FlashcardReview;