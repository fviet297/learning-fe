import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { createBulkFlashcards, getFlashcardsByModule, deleteFlashcard, updateFlashcard } from '../services/api';

function CreateFlashcardPage() {
  const [newFlashcards, setNewFlashcards] = useState([{ question: '', answer: '' }]);
  const [existingFlashcards, setExistingFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingContent, setEditingContent] = useState({ question: '', answer: '' });
  const { moduleId } = useParams();
  const navigate = useNavigate();
  
  // Fetch existing flashcards when component mounts
  useEffect(() => {
    fetchFlashcards();
  }, [moduleId]);
  
  const fetchFlashcards = async () => {
    try {
      setLoading(true);
      const response = await getFlashcardsByModule(moduleId);
      if (Array.isArray(response)) {
        setExistingFlashcards(response);
      } else if (response && response.data) {
        setExistingFlashcards(response.data);
      } else {
        setExistingFlashcards([]);
      }
    } catch (error) {
      console.error('Error fetching flashcards:', error);
      toast.error('Error loading flashcards!');
      setExistingFlashcards([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFlashcard = () => {
    setEditingId(null);
    setShowForm(true);
    setNewFlashcards([{ question: '', answer: '' }]);
  };
  
  const handleAddAnotherFlashcard = () => {
    if (newFlashcards.length < 50) {
      setNewFlashcards([...newFlashcards, { question: '', answer: '' }]);
    } else {
      toast.warning('Maximum 50 flashcards allowed');
    }
  };

  const handleChange = (index, field, value) => {
    const updatedFlashcards = [...newFlashcards];
    updatedFlashcards[index][field] = value;
    setNewFlashcards(updatedFlashcards);
  };
  
  const handleEditFlashcard = (flashcard) => {
    setEditingId(flashcard.id);
    setEditingContent({
      question: flashcard.question,
      answer: flashcard.answer,
      status: flashcard.status || 'NEW'
    });
  };
  
  const handleDeleteFlashcard = async (flashcardId) => {
    if (window.confirm('Are you sure you want to delete this flashcard?')) {
      try {
        await deleteFlashcard(flashcardId);
        toast.success('Flashcard deleted successfully!');
        fetchFlashcards(); // Refresh the list
      } catch (error) {
        console.error('Error deleting flashcard:', error);
        toast.error('Error deleting flashcard!');
      }
    }
  };
  
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingContent({ question: '', answer: '' });
  };

  const handleCreateFlashcards = async (e) => {
    e.preventDefault();
    const validFlashcards = newFlashcards.filter(card => card.question.trim() && card.answer.trim());
    if (validFlashcards.length === 0) {
      toast.error('Please enter at least one flashcard with both question and answer!');
      return;
    }

    try {
      // Create new flashcards
      const payload = {
        studyModuleId: moduleId,
        flashcardRequests: validFlashcards.map(card => ({
          question: card.question,
          answer: card.answer
        }))
      };
      await createBulkFlashcards(payload);
      toast.success(`${validFlashcards.length} flashcard(s) created successfully!`);
      setShowForm(false);
      setNewFlashcards([{ question: '', answer: '' }]);
      fetchFlashcards(); // Refresh the list
    } catch (error) {
      console.error('Error creating flashcards:', error);
      toast.error('Error creating flashcards!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg"
    >
      <div className="flex items-center mb-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={() => navigate(`/study-modules/${moduleId}`)}
          className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-all shadow-sm"
          title="Back to Module"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </motion.button>
      </div>
      
      {/* Existing flashcards */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-primary">Flashcards</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handleAddFlashcard}
            className="bg-secondary text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            + Add New Flashcard
          </motion.button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : existingFlashcards.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No flashcards yet. Create your first flashcard!</p>
        ) : (
          <div className="space-y-6">
            {existingFlashcards.map((flashcard) => (
              <motion.div 
                key={flashcard.id} 
                className="p-4 border-2 border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 bg-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {editingId === flashcard.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-lg font-medium text-primary mb-2">Question:</label>
                      <textarea
                        value={editingContent.question}
                        onChange={(e) => setEditingContent(prev => ({ ...prev, question: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary bg-white"
                        rows="3"
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-primary mb-2">Answer:</label>
                      <textarea
                        value={editingContent.answer}
                        onChange={(e) => setEditingContent(prev => ({ ...prev, answer: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary bg-white"
                        rows="3"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCancelEdit}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={async () => {
                          try {
                            await updateFlashcard({
                              id: flashcard.id,
                              question: editingContent.question,
                              answer: editingContent.answer,
                              status: editingContent.status || 'LEARN'
                            });
                            toast.success('Flashcard updated successfully!');
                            setEditingId(null);
                            fetchFlashcards();
                          } catch (error) {
                            console.error('Error updating flashcard:', error);
                            toast.error('Error updating flashcard!');
                          }
                        }}
                        className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-blue-600 transition-colors font-medium"
                      >
                        Save
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium text-primary">Question:</h3>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEditFlashcard(flashcard)}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
                        >
                          Edit
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeleteFlashcard(flashcard.id)}
                          className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors font-medium"
                        >
                          Delete
                        </motion.button>
                      </div>
                    </div>
                    <p className="text-gray-800 mb-4 whitespace-pre-wrap">{flashcard.question}</p>
                    <h3 className="text-lg font-medium text-primary mb-2">Answer:</h3>
                    <p className="text-gray-800 whitespace-pre-wrap">{flashcard.answer}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      {/* Form for creating/editing flashcards */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="border-t-2 pt-6 mt-8"
        >
          <h3 className="text-xl font-semibold mb-4 text-primary">
            Add New Flashcard
          </h3>
          
          <form onSubmit={handleCreateFlashcards} className="space-y-6">
            {newFlashcards.map((flashcard, index) => (
              <motion.div 
                key={index} 
                className="p-4 border-2 border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 bg-gray-50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-medium mb-3 text-primary">
                  Flashcard #{index + 1}
                </h3>
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
              onClick={handleAddAnotherFlashcard}
              className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors font-medium"
            >
              + Add Another Flashcard
            </motion.button>

            <div className="flex justify-end gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleCancelEdit}
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
                Create Flashcards
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}
    </motion.div>
  );
}

export default CreateFlashcardPage;