import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { createBulkQuizzes, getQuizzes, deleteQuiz, generateQuizzesFromContent } from '../services/api';

function CreateQuizPage() {
  const [newQuizzes, setNewQuizzes] = useState([
    {
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    }
  ]);
  const [existingQuizzes, setExistingQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [activeTab, setActiveTab] = useState('manual'); // 'manual' hoặc 'fromText'
  const [textContent, setTextContent] = useState('');
  const [generatingQuizzes, setGeneratingQuizzes] = useState(false);
  const { moduleId } = useParams();
  const navigate = useNavigate();
  
  // Fetch existing quizzes when component mounts
  useEffect(() => {
    fetchQuizzes();
  }, [moduleId]);
  
  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await getQuizzes(moduleId);
      if (Array.isArray(response)) {
        setExistingQuizzes(response);
      } else if (response && response.data) {
        setExistingQuizzes(response.data);
      } else {
        setExistingQuizzes([]);
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      toast.error('Error loading quizzes!');
      setExistingQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionChange = (quizIndex, value) => {
    const updatedQuizzes = [...newQuizzes];
    updatedQuizzes[quizIndex].question = value;
    setNewQuizzes(updatedQuizzes);
  };

  const handleOptionChange = (quizIndex, optionIndex, value) => {
    const updatedQuizzes = [...newQuizzes];
    updatedQuizzes[quizIndex].options[optionIndex] = value;
    setNewQuizzes(updatedQuizzes);
  };

  const handleCorrectAnswerChange = (quizIndex, optionIndex) => {
    const updatedQuizzes = [...newQuizzes];
    updatedQuizzes[quizIndex].correctAnswer = optionIndex;
    setNewQuizzes(updatedQuizzes);
  };

  // handleAddQuiz được định nghĩa ở bên dưới
  
  const handleEditQuiz = (quiz) => {
    setEditMode(true);
    setShowForm(true);
    setEditingQuiz(quiz);
    const editableQuiz = {
      id: quiz.id,
      question: quiz.question,
      options: Array.isArray(quiz.options) ? quiz.options : JSON.parse(quiz.options),
      correctAnswer: quiz.correctAnswer
    };
    setNewQuizzes([editableQuiz]);
  };
  
  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await deleteQuiz(quizId);
        toast.success('Quiz deleted successfully!');
        fetchQuizzes(); // Refresh the list
      } catch (error) {
        console.error('Error deleting quiz:', error);
        toast.error('Error deleting quiz!');
      }
    }
  };
  
  const handleAddQuiz = () => {
    setEditMode(false);
    setEditingQuiz(null);
    setShowForm(true);
    setActiveTab('manual');
    setNewQuizzes([{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };
  
  const handleAddQuizFromText = () => {
    setEditMode(false);
    setEditingQuiz(null);
    setShowForm(true);
    setActiveTab('fromText');
    setTextContent('');
  };
  
  const handleCancelEdit = () => {
    setEditMode(false);
    setShowForm(false);
    setEditingQuiz(null);
    setNewQuizzes([{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all quizzes
    const validQuizzes = newQuizzes.filter(quiz => {
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
          ...(editMode && quiz.id ? { id: quiz.id } : {}),
          question: quiz.question,
          options: JSON.stringify(quiz.options),
          correctAnswer: quiz.correctAnswer
        }))
      };

      await createBulkQuizzes(payload);
      toast.success(`${validQuizzes.length} quiz(zes) ${editMode ? 'updated' : 'created'} successfully!`);
      setEditMode(false);
      setShowForm(false);
      setEditingQuiz(null);
      setNewQuizzes([{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]);
      fetchQuizzes(); // Refresh the list
    } catch (error) {
      toast.error(`Error ${editMode ? 'updating' : 'creating'} quizzes!`);
      console.error(`Error ${editMode ? 'updating' : 'creating'} quizzes:`, error);
    }
  };

  const handleGenerateQuizzes = async (e) => {
    e.preventDefault();
    if (!textContent.trim()) {
      toast.error('Vui lòng nhập nội dung văn bản để tạo quiz!');
      return;
    }
    
    try {
      setGeneratingQuizzes(true);
      const payload = {
        studyModuleId: moduleId,
        quizRequests: [
          {
            question: null,
            options: null,
            correctAnswer: 0
          }
        ],
        content: textContent
      };
      
      const response = await generateQuizzesFromContent(payload);
      toast.success('Tạo quiz thành công!');
      setTextContent('');
      setActiveTab('manual'); // Chuyển về tab danh sách sau khi tạo thành công
      fetchQuizzes(); // Cập nhật danh sách quiz
    } catch (error) {
      console.error('Lỗi khi tạo quiz từ nội dung:', error);
      toast.error('Không thể tạo quiz từ nội dung này!');
    } finally {
      setGeneratingQuizzes(false);
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
      
      {/* Existing quizzes */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-primary">Quizzes</h3>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleAddQuiz}
              className="bg-secondary text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              + Thêm quiz mới
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleAddQuizFromText}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Tạo từ văn bản
            </motion.button>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : existingQuizzes.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No quizzes yet. Create your first quiz!</p>
        ) : (
          <div className="space-y-4">
            {existingQuizzes.map((quiz) => (
              <motion.div 
                key={quiz.id} 
                className="p-4 border-2 border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 bg-gray-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium mb-3 text-primary">{quiz.question}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditQuiz(quiz)}
                      className="flex items-center justify-center w-24 h-8 bg-blue-100 text-blue-600 rounded-md border border-blue-300 hover:bg-blue-200 transition-colors shadow-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 0L11.5 10.5M14 14l-4 1 1-4 9.5-9.5a2 2 0 012.828 0"/>
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteQuiz(quiz.id)}
                      className="flex items-center justify-center w-24 h-8 bg-red-100 text-red-600 rounded-md border border-red-300 hover:bg-red-200 transition-colors shadow-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {Array.isArray(quiz.options) 
                    ? quiz.options.map((option, idx) => (
                        <div 
                          key={idx} 
                          className={`p-2 border rounded ${idx === quiz.correctAnswer ? 'bg-green-100 border-green-500 font-medium' : 'bg-white border-gray-200'}`}
                        >
                          {option}
                        </div>
                      ))
                    : JSON.parse(quiz.options).map((option, idx) => (
                        <div 
                          key={idx} 
                          className={`p-2 border rounded ${idx === quiz.correctAnswer ? 'bg-green-100 border-green-500 font-medium' : 'bg-white border-gray-200'}`}
                        >
                          {option}
                        </div>
                      ))
                  }
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      {/* Form for creating/editing quizzes */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-50 p-6 rounded-lg shadow-md mb-8"
        >
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'manual' ? 'text-secondary border-b-2 border-secondary' : 'text-gray-500'}`}
              onClick={() => setActiveTab('manual')}
            >
              Tạo thủ công
            </button>
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'fromText' ? 'text-secondary border-b-2 border-secondary' : 'text-gray-500'}`}
              onClick={() => setActiveTab('fromText')}
            >
              Tạo từ nội dung văn bản
            </button>
          </div>
          
          {activeTab === 'manual' ? (
            <>
              <h3 className="text-xl font-semibold mb-4 text-primary">
                {editMode ? 'Sửa Quiz' : 'Thêm Quiz Mới'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {newQuizzes.map((quiz, quizIndex) => (
                  <motion.div 
                    key={quizIndex} 
                    className="p-4 border-2 border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 bg-gray-50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-4">
                      <label htmlFor={`question-${quizIndex}`} className="block text-gray-700 font-medium mb-2">
                        Câu hỏi
                      </label>
                      <textarea
                        id={`question-${quizIndex}`}
                        value={quiz.question}
                        onChange={(e) => handleQuestionChange(quizIndex, e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary bg-white"
                        rows="3"
                        placeholder="Nhập câu hỏi của bạn..."
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 font-medium mb-2">Các lựa chọn</label>
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
                            placeholder={`Lựa chọn ${optionIndex + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}

                {!editMode && (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setNewQuizzes([...newQuizzes, { question: '', options: ['', '', '', ''], correctAnswer: 0 }])}
                    className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors font-medium"
                  >
                    + Thêm quiz khác
                  </motion.button>
                )}

                <div className="flex justify-end gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-6 py-2 rounded-md font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    Hủy
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="bg-secondary text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    {editMode ? 'Lưu thay đổi' : 'Tạo quiz'}
                  </motion.button>
                </div>
              </form>
            </>
          ) : (
            <>
              <h3 className="text-xl font-semibold mb-4 text-primary">
                Tạo quiz từ nội dung văn bản
              </h3>
              
              <form onSubmit={handleGenerateQuizzes} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="text-content" className="block text-gray-700 font-medium mb-2">
                      Nội dung văn bản
                    </label>
                    <textarea
                      id="text-content"
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary bg-white"
                      placeholder="Nhập nội dung văn bản để tạo quiz..."
                      rows="10"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-6 py-2 rounded-md font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    Hủy
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={generatingQuizzes}
                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
                  >
                    {generatingQuizzes ? (
                      <>
                        <span className="mr-2 animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                        Đang tạo...
                      </>
                    ) : (
                      'Tạo quiz từ văn bản'
                    )}
                  </motion.button>
                </div>
              </form>
            </>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default CreateQuizPage;