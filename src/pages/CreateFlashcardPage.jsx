import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { createBulkFlashcards } from '../services/api';

function CreateFlashcardPage() {
  const [flashcards, setFlashcards] = useState([{ question: '', answer: '' }]);
  const { moduleId } = useParams();
  const navigate = useNavigate();

  const handleAddFlashcard = () => {
    if (flashcards.length < 50) {
      setFlashcards([...flashcards, { question: '', answer: '' }]);
    } else {
      toast.warning('Maximum 50 flashcards allowed');
    }
  };

  const handleChange = (index, field, value) => {
    const newFlashcards = [...flashcards];
    newFlashcards[index][field] = value;
    setFlashcards(newFlashcards);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validFlashcards = flashcards.filter(card => card.question.trim() && card.answer.trim());
    if (validFlashcards.length === 0) {
      toast.error('Please enter at least one flashcard with both question and answer!');
      return;
    }

    try {
      // Structure payload according to required format
      const payload = {
        studyModuleId: moduleId,
        flashcardRequests: validFlashcards.map(({ question, answer }) => ({
          question,
          answer
        }))
      };
      
      await createBulkFlashcards(payload);
      toast.success(`${validFlashcards.length} flashcard(s) created successfully!`);
      navigate(`/study-modules/${moduleId}`);
    } catch (error) {
      toast.error('Error creating flashcards!');
      console.error('Error creating flashcards:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-semibold mb-6 text-primary">Create Flashcards</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {flashcards.map((flashcard, index) => (
          <motion.div 
            key={index} 
            className="p-4 border-2 border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 bg-gray-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-medium mb-3 text-primary">Flashcard #{index + 1}</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor={`question-${index}`} className="block text-gray-700 font-medium mb-2">
                  Question
                </label>
                <input
                  id={`question-${index}`}
                  type="text"
                  value={flashcard.question}
                  onChange={(e) => handleChange(index, 'question', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary bg-white"
                  placeholder="Enter your question..."
                />
              </div>

              <div>
                <label htmlFor={`answer-${index}`} className="block text-gray-700 font-medium mb-2">
                  Answer
                </label>
                <textarea
                  id={`answer-${index}`}
                  value={flashcard.answer}
                  onChange={(e) => handleChange(index, 'answer', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary bg-white"
                  placeholder="Enter your answer..."
                  rows="3"
                />
              </div>
            </div>
          </motion.div>
        ))}

        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddFlashcard}
          className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors font-medium"
        >
          + Add Another Flashcard
        </motion.button>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-secondary text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors font-medium"
        >
          Create Flashcards
        </motion.button>
      </form>
    </motion.div>
  );
}

export default CreateFlashcardPage;