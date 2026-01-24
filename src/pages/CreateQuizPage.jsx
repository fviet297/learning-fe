import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiPlus, FiCpu, FiTrash2, FiEdit, FiSave, FiCheck, FiLayers } from 'react-icons/fi';
import { createBulkQuizzes, getQuizzes, deleteQuiz, generateQuizzesFromContent } from '../services/api';
import PremiumCard from '../components/common/PremiumCard';
import PremiumButton from '../components/common/PremiumButton';
import PremiumInput from '../components/common/PremiumInput';

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
  const [activeTab, setActiveTab] = useState('manual');
  const [textContent, setTextContent] = useState('');
  const [generatingQuizzes, setGeneratingQuizzes] = useState(false);
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const formRef = useRef(null);

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
      toast.error('Không thể tải danh sách câu hỏi!');
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
    setActiveTab('manual');
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) {
      try {
        await deleteQuiz(quizId);
        toast.success('Đã xóa câu hỏi!');
        fetchQuizzes();
      } catch (error) {
        console.error('Error deleting quiz:', error);
        toast.error('Lỗi khi xóa câu hỏi!');
      }
    }
  };

  const handleAddQuiz = () => {
    setEditMode(false);
    setEditingQuiz(null);
    setShowForm(true);
    setActiveTab('manual');
    setNewQuizzes([{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setShowForm(false);
    setEditingQuiz(null);
    setNewQuizzes([{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validQuizzes = newQuizzes.filter(quiz => {
      return quiz.question.trim() && !quiz.options.some(option => !option.trim());
    });

    if (validQuizzes.length === 0) {
      toast.error('Vui lòng nhập câu hỏi và đầy đủ 4 đáp án!');
      return;
    }

    try {
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
      toast.success(editMode ? 'Cập nhật thành công!' : `Đã tạo ${validQuizzes.length} câu hỏi!`);
      setEditMode(false);
      setShowForm(false);
      setEditingQuiz(null);
      setNewQuizzes([{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]);
      fetchQuizzes();
    } catch (error) {
      toast.error('Có lỗi xảy ra!');
      console.error(error);
    }
  };

  const handleGenerateQuizzes = async (e) => {
    e.preventDefault();
    if (!textContent.trim()) {
      toast.error('Vui lòng nhập nội dung văn bản!');
      return;
    }

    try {
      setGeneratingQuizzes(true);
      const payload = {
        studyModuleId: moduleId,
        quizRequests: [{ question: null, options: null, correctAnswer: 0 }],
        content: textContent
      };

      await generateQuizzesFromContent(payload);
      toast.success('Tạo quiz bằng AI thành công!');
      setTextContent('');
      setActiveTab('manual');
      setShowForm(false);
      fetchQuizzes();
    } catch (error) {
      console.error('Lỗi khi tạo quiz từ nội dung:', error);
      toast.error('Không thể tạo quiz từ nội dung này!');
    } finally {
      setGeneratingQuizzes(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1, x: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(`/study-modules/${moduleId}`)}
            className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 border border-slate-700 hover:text-white hover:bg-slate-700 transition-all"
          >
            <FiArrowLeft size={20} />
          </motion.button>
          <div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Quản lý Quiz
            </h1>
            <p className="text-slate-400 text-sm">Thêm câu hỏi trắc nghiệm thủ công hoặc bằng AI</p>
          </div>
        </div>

        <div className="flex gap-3">
          <PremiumButton
            onClick={() => {
              setActiveTab('fromText');
              setShowForm(true);
              setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
            }}
            variant="ghost"
            className="!bg-purple-500/10 !text-purple-400 border border-purple-500/20 hover:!bg-purple-500/20"
          >
            <FiCpu className="mr-2" /> AI Generator
          </PremiumButton>

          <PremiumButton onClick={handleAddQuiz} variant="primary">
            <FiPlus className="mr-2" /> Thêm câu hỏi
          </PremiumButton>
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
            animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
            exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
            className="mb-8"
          >
            <PremiumCard className="border-indigo-500/30">
              <div className="flex border-b border-white/10 mb-6">
                <button
                  className={`py-3 px-6 font-medium text-sm transition-all relative ${activeTab === 'manual' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
                  onClick={() => setActiveTab('manual')}
                >
                  {editMode ? 'Chỉnh sửa câu hỏi' : 'Tạo thủ công'}
                  {activeTab === 'manual' && <motion.div layoutId="activeTabQuiz" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />}
                </button>
                {!editMode && (
                  <button
                    className={`py-3 px-6 font-medium text-sm transition-all relative ${activeTab === 'fromText' ? 'text-purple-400' : 'text-slate-500 hover:text-slate-300'}`}
                    onClick={() => setActiveTab('fromText')}
                  >
                    Tạo bằng AI
                    {activeTab === 'fromText' && <motion.div layoutId="activeTabQuiz" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />}
                  </button>
                )}
              </div>

              {activeTab === 'manual' ? (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {newQuizzes.map((quiz, quizIndex) => (
                    <div key={quizIndex} className="p-6 rounded-xl bg-slate-900/50 border border-white/5 space-y-6">
                      <PremiumInput
                        label="Câu hỏi"
                        value={quiz.question}
                        onChange={(e) => handleQuestionChange(quizIndex, e.target.value)}
                        placeholder="Nhập nội dung câu hỏi..."
                      />

                      <div>
                        <label className="text-sm font-medium text-slate-300 mb-3 block">Các phương án (Chọn đáp án đúng)</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {quiz.options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${quiz.correctAnswer === optionIndex
                                  ? 'bg-emerald-500/10 border-emerald-500/50'
                                  : 'bg-slate-800 border-slate-700'
                                }`}
                            >
                              <input
                                type="radio"
                                name={`quiz-${quizIndex}-correct`}
                                checked={quiz.correctAnswer === optionIndex}
                                onChange={() => handleCorrectAnswerChange(quizIndex, optionIndex)}
                                className="w-5 h-5 text-emerald-500 focus:ring-emerald-500 bg-slate-700 border-slate-600"
                              />
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => handleOptionChange(quizIndex, optionIndex, e.target.value)}
                                className="flex-1 bg-transparent border-none focus:ring-0 text-slate-200 placeholder-slate-500 text-sm"
                                placeholder={`Đáp án ${optionIndex + 1}`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}

                  {!editMode && (
                    <button
                      type="button"
                      onClick={() => setNewQuizzes([...newQuizzes, { question: '', options: ['', '', '', ''], correctAnswer: 0 }])}
                      className="w-full py-3 border border-dashed border-slate-600 rounded-xl text-slate-400 hover:text-white hover:border-slate-400 hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                      <FiPlus /> Thêm câu hỏi khác
                    </button>
                  )}

                  <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                    <PremiumButton type="button" variant="ghost" onClick={handleCancelEdit}>
                      Hủy bỏ
                    </PremiumButton>
                    <PremiumButton type="submit" variant="primary">
                      {editMode ? <><FiSave className="mr-2" /> Lưu thay đổi</> : <><FiPlus className="mr-2" /> Tạo câu hỏi</>}
                    </PremiumButton>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleGenerateQuizzes} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">Nội dung bài học</label>
                    <textarea
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                      className="w-full p-4 bg-slate-900/50 border border-slate-700 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-slate-300 placeholder-slate-600 min-h-[200px]"
                      placeholder="Dán nội dung văn bản vào đây để AI tự động tạo các câu hỏi trắc nghiệm..."
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <PremiumButton type="button" variant="ghost" onClick={() => setShowForm(false)}>
                      Hủy
                    </PremiumButton>
                    <PremiumButton
                      type="submit"
                      disabled={generatingQuizzes}
                      className="!bg-gradient-to-r !from-purple-600 !to-pink-600"
                    >
                      {generatingQuizzes ? "Đang xử lý..." : "Tạo với AI"}
                    </PremiumButton>
                  </div>
                </form>
              )}
            </PremiumCard>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
        ) : existingQuizzes.length === 0 ? (
          <div className="text-center py-16 bg-slate-800/30 rounded-3xl border border-dashed border-slate-700">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
              <FiLayers size={32} />
            </div>
            <p className="text-slate-500">Chưa có câu hỏi nào. Hãy tạo mới ngay!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {existingQuizzes.map((quiz, idx) => (
              <motion.div
                layout
                key={quiz.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="group relative bg-slate-800 border border-white/5 rounded-2xl p-6 hover:bg-slate-800/80 transition-all"
              >
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div className="flex gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-700 text-slate-400 font-bold text-sm shrink-0">
                      {idx + 1}
                    </span>
                    <h3 className="text-lg font-medium text-slate-200 mt-0.5">{quiz.question}</h3>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditQuiz(quiz)}
                      className="p-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors"
                      title="Sửa"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteQuiz(quiz.id)}
                      className="p-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-rose-600 hover:text-white transition-colors"
                      title="Xóa"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-11">
                  {Array.isArray(quiz.options)
                    ? quiz.options.map((option, optionIdx) => (
                      <div
                        key={optionIdx}
                        className={`px-4 py-3 rounded-xl border text-sm flex items-center justify-between ${optionIdx === quiz.correctAnswer
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                            : 'bg-slate-900/50 border-white/5 text-slate-400'
                          }`}
                      >
                        <span>{option}</span>
                        {optionIdx === quiz.correctAnswer && <FiCheck />}
                      </div>
                    ))
                    : JSON.parse(quiz.options).map((option, optionIdx) => (
                      <div
                        key={optionIdx}
                        className={`px-4 py-3 rounded-xl border text-sm flex items-center justify-between ${optionIdx === quiz.correctAnswer
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                            : 'bg-slate-900/50 border-white/5 text-slate-400'
                          }`}
                      >
                        <span>{option}</span>
                        {optionIdx === quiz.correctAnswer && <FiCheck />}
                      </div>
                    ))
                  }
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateQuizPage;