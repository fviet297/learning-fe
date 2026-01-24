import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiPlus, FiCpu, FiTrash2, FiEdit, FiSave, FiX, FiLayers, FiList } from 'react-icons/fi';
import { createBulkFlashcards, getFlashcardsByModule, deleteFlashcard, updateFlashcard, generateFlashcardsFromContent } from '../services/api';
import PremiumCard from '../components/common/PremiumCard';
import PremiumButton from '../components/common/PremiumButton';
import PremiumInput from '../components/common/PremiumInput';

function CreateFlashcardPage() {
  const [newFlashcards, setNewFlashcards] = useState([{ question: '', answer: '' }]);
  const [existingFlashcards, setExistingFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingContent, setEditingContent] = useState({ question: '', answer: '' });
  const [activeTab, setActiveTab] = useState('manual');
  const [textContent, setTextContent] = useState('');
  const [generatingFlashcards, setGeneratingFlashcards] = useState(false);
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const formRef = useRef(null);

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
      toast.error('Không thể tải danh sách flashcard!');
      setExistingFlashcards([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFlashcard = () => {
    setEditingId(null);
    setShowForm(true);
    setNewFlashcards([{ question: '', answer: '' }]);
    setActiveTab('manual');

    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleAddAnotherFlashcard = () => {
    if (newFlashcards.length < 50) {
      setNewFlashcards([...newFlashcards, { question: '', answer: '' }]);
    } else {
      toast.warning('Tối đa 50 thẻ mỗi lần tạo');
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
    if (window.confirm('Bạn có chắc chắn muốn xóa flashcard này?')) {
      try {
        await deleteFlashcard(flashcardId);
        toast.success('Đã xóa flashcard thành công!');
        fetchFlashcards();
      } catch (error) {
        console.error('Error deleting flashcard:', error);
        toast.error('Lỗi khi xóa flashcard!');
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
      toast.error('Vui lòng nhập ít nhất một flashcard với đầy đủ câu hỏi và câu trả lời!');
      return;
    }

    try {
      const payload = {
        studyModuleId: moduleId,
        flashcardRequests: validFlashcards.map(card => ({
          question: card.question,
          answer: card.answer
        }))
      };
      await createBulkFlashcards(payload);
      toast.success(`Đã tạo thành công ${validFlashcards.length} flashcard(s)!`);
      setShowForm(false);
      setNewFlashcards([{ question: '', answer: '' }]);
      fetchFlashcards();
    } catch (error) {
      console.error('Error creating flashcards:', error);
      toast.error('Lỗi khi tạo flashcards!');
    }
  };

  const handleGenerateFlashcards = async (e) => {
    e.preventDefault();
    if (!textContent.trim()) {
      toast.error('Vui lòng nhập nội dung văn bản để AI tạo flashcards!');
      return;
    }

    try {
      setGeneratingFlashcards(true);
      const payload = {
        studyModuleId: moduleId,
        flashcardRequests: [{ question: null, answer: null }],
        content: textContent
      };

      await generateFlashcardsFromContent(payload);
      toast.success('Tạo flashcard bằng AI thành công!');
      setTextContent('');
      setActiveTab('manual');
      setShowForm(false);
      fetchFlashcards();
    } catch (error) {
      console.error('Error generating flashcards:', error);
      toast.error('Không thể tạo flashcard từ nội dung này!');
    } finally {
      setGeneratingFlashcards(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
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
              Quản lý Flashcards
            </h1>
            <p className="text-slate-400 text-sm">Thêm, sửa, xóa hoặc tạo tự động với AI</p>
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
            className="!bg-emerald-500/10 !text-emerald-400 border border-emerald-500/20 hover:!bg-emerald-500/20"
          >
            <FiCpu className="mr-2" /> AI Generator
          </PremiumButton>

          <PremiumButton
            onClick={handleAddFlashcard}
            variant="primary"
          >
            <FiPlus className="mr-2" /> Thêm mới
          </PremiumButton>
        </div>
      </div>

      {/* Form Area */}
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
                  Tạo thủ công
                  {activeTab === 'manual' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />}
                </button>
                <button
                  className={`py-3 px-6 font-medium text-sm transition-all relative ${activeTab === 'fromText' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
                  onClick={() => setActiveTab('fromText')}
                >
                  Tạo bằng AI
                  {activeTab === 'fromText' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />}
                </button>
              </div>

              {activeTab === 'manual' ? (
                <form onSubmit={handleCreateFlashcards} className="space-y-6">
                  {newFlashcards.map((flashcard, index) => (
                    <div key={index} className="p-4 rounded-xl bg-slate-900/50 border border-white/5 space-y-4">
                      <div className="flex justify-between items-center text-xs font-bold uppercase text-slate-500 mb-2">
                        <span>Thẻ #{index + 1}</span>
                        {newFlashcards.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setNewFlashcards(newFlashcards.filter((_, i) => i !== index))}
                            className="text-rose-400 hover:text-rose-300"
                          >
                            <FiTrash2 />
                          </button>
                        )}
                      </div>
                      <PremiumInput
                        label="Câu hỏi / Thuật ngữ"
                        value={flashcard.question}
                        onChange={(e) => handleChange(index, 'question', e.target.value)}
                        placeholder="Nhập câu hỏi..."
                      />
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-300 ml-1">Câu trả lời / Định nghĩa</label>
                        <textarea
                          value={flashcard.answer}
                          onChange={(e) => handleChange(index, 'answer', e.target.value)}
                          className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-200 placeholder-slate-500 transition-all resize-none"
                          placeholder="Nhập câu trả lời..."
                          rows="2"
                        />
                      </div>
                    </div>
                  ))}

                  <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <button
                      type="button"
                      onClick={handleAddAnotherFlashcard}
                      className="flex-1 py-3 border border-dashed border-slate-600 rounded-xl text-slate-400 hover:text-white hover:border-slate-400 hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                      <FiPlus /> Thêm thẻ khác
                    </button>
                    <div className="flex gap-3 flex-1 justify-end">
                      <PremiumButton type="button" variant="ghost" onClick={() => setShowForm(false)}>
                        Hủy
                      </PremiumButton>
                      <PremiumButton type="submit" variant="primary">
                        <FiSave className="mr-2" /> Lưu tất cả
                      </PremiumButton>
                    </div>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleGenerateFlashcards} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">Nội dung bài học</label>
                    <textarea
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                      className="w-full p-4 bg-slate-900/50 border border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-300 placeholder-slate-600 min-h-[200px]"
                      placeholder="Dán nội dung văn bản vào đây để AI tự động trích xuất các ý chính và tạo Flashcards..."
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <PremiumButton type="button" variant="ghost" onClick={() => setShowForm(false)}>
                      Hủy
                    </PremiumButton>
                    <PremiumButton
                      type="submit"
                      disabled={generatingFlashcards}
                      className="!bg-gradient-to-r !from-emerald-600 !to-teal-600"
                    >
                      {generatingFlashcards ? "Đang xử lý..." : "Tạo với AI"}
                    </PremiumButton>
                  </div>
                </form>
              )}
            </PremiumCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
        ) : existingFlashcards.length === 0 ? (
          <div className="text-center py-16 bg-slate-800/30 rounded-3xl border border-dashed border-slate-700">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
              <FiLayers size={32} />
            </div>
            <p className="text-slate-500">Chưa có flashcard nào. Hãy tạo mới ngay!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {existingFlashcards.map((flashcard) => (
              <motion.div
                layout
                key={flashcard.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative bg-slate-800 border border-white/5 rounded-2xl p-6 hover:bg-slate-800/80 transition-all"
              >
                {editingId === flashcard.id ? (
                  <div className="space-y-4">
                    <PremiumInput
                      label="Câu hỏi"
                      value={editingContent.question}
                      onChange={(e) => setEditingContent(prev => ({ ...prev, question: e.target.value }))}
                    />
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-300 ml-1">Câu trả lời</label>
                      <textarea
                        value={editingContent.answer}
                        onChange={(e) => setEditingContent(prev => ({ ...prev, answer: e.target.value }))}
                        className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-200 transition-all"
                        rows="3"
                      />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <PremiumButton variant="ghost" onClick={handleCancelEdit}>Hủy</PremiumButton>
                      <PremiumButton
                        variant="primary"
                        onClick={async () => {
                          try {
                            await updateFlashcard({
                              id: flashcard.id,
                              question: editingContent.question,
                              answer: editingContent.answer,
                              status: editingContent.status
                            });
                            toast.success('Cập nhật thành công!');
                            setEditingId(null);
                            fetchFlashcards();
                          } catch (error) {
                            toast.error('Lỗi cập nhật!');
                          }
                        }}
                      >
                        Lưu thay đổi
                      </PremiumButton>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-3">
                      <div>
                        <div className="text-xs font-bold uppercase text-indigo-400 mb-1">Câu hỏi</div>
                        <p className="text-slate-200 font-medium text-lg">{flashcard.question}</p>
                      </div>
                      <div className="pt-2 border-t border-white/5">
                        <div className="text-xs font-bold uppercase text-purple-400 mb-1">Đáp án</div>
                        <p className="text-slate-400">{flashcard.answer}</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditFlashcard(flashcard)}
                        className="p-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors"
                        title="Sửa"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteFlashcard(flashcard.id)}
                        className="p-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-rose-600 hover:text-white transition-colors"
                        title="Xóa"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateFlashcardPage;
