import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPlus, FiBook, FiPlay, FiCpu, FiCheck, FiInfo, FiZap, FiLayers, FiEdit } from 'react-icons/fi';
import { getStudyModuleById, getQuizzes, generateCombinedContent } from '../services/api';
import { showError, showSuccess } from '../services/toastService';
import PremiumCard from '../components/common/PremiumCard';
import PremiumButton from '../components/common/PremiumButton';

function StudyModuleDetails() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for AI Generation
  const [generationContent, setGenerationContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const moduleResponse = await getStudyModuleById(moduleId);
      setModule(moduleResponse.data);

      const quizzesResponse = await getQuizzes(moduleId);
      setQuizzes(Array.isArray(quizzesResponse) ? quizzesResponse : (quizzesResponse?.data || []));
    } catch (error) {
      showError('Không thể tải thông tin chi tiết module');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [moduleId]);

  const handleCombineGenerate = async () => {
    if (!generationContent.trim()) {
      showError('Vui lòng nhập nội dung để tạo!');
      return;
    }

    setIsGenerating(true);
    try {
      const payload = {
        id: moduleId,
        name: module.name,
        description: module.description,
        content: generationContent.trim()
      };
      await generateCombinedContent(payload);
      showSuccess('Đã tạo Flashcard và Quiz thông minh!');
      setGenerationContent('');
      fetchData(); // Refresh data
    } catch (error) {
      showError('Lỗi trong quá trình tạo nội dung thông minh');
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!module) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-slate-800 border border-white/5 shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 pointer-events-none" />
        <div className="relative p-8 md:p-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium mb-2"
              >
                <FiArrowLeft /> Quay lại danh sách
              </button>
              <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400">
                {module.name}
              </h1>
              <p className="text-slate-300 text-lg max-w-2xl leading-relaxed">
                {module.description || "Mô tả ngắn về học phần này..."}
              </p>
              <div className="flex gap-4 pt-2">
                <div className="px-4 py-2 bg-slate-900/50 rounded-xl border border-white/5 flex items-center gap-2">
                  <FiLayers className="text-indigo-400" />
                  <span className="font-bold text-white">{module.flashcards?.length || 0}</span>
                  <span className="text-slate-500 text-sm">Flashcards</span>
                </div>
                <div className="px-4 py-2 bg-slate-900/50 rounded-xl border border-white/5 flex items-center gap-2">
                  <FiCheck className="text-purple-400" />
                  <span className="font-bold text-white">{quizzes.length}</span>
                  <span className="text-slate-500 text-sm">Quizzes</span>
                </div>
              </div>
            </div>

            {/* Decorative Element */}
            <div className="hidden lg:block relative">
              <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <FiBook className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/10 text-9xl" />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Areas */}
        <div className="lg:col-span-2 space-y-8">
          {/* Flashcards Section */}
          <PremiumCard className="p-0 overflow-hidden group">
            <div className="p-8 border-b border-white/5 bg-gradient-to-r from-slate-800 to-slate-800/50 group-hover:from-indigo-900/20 transition-colors duration-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
                    <FiLayers size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Flashcards</h2>
                    <p className="text-slate-400 text-sm">Thẻ ghi nhớ thông minh</p>
                  </div>
                </div>
                <PremiumButton
                  variant="ghost"
                  onClick={() => navigate(`/study-modules/${moduleId}/create-flashcard`)}
                  className="text-sm"
                >
                  <FiEdit className="mr-1" /> Quản lý
                </PremiumButton>
              </div>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PremiumButton
                  variant="primary"
                  onClick={() => navigate(`/study-modules/${moduleId}/review-flashcard`)}
                  disabled={!(module.flashcards?.length > 0)}
                  className="w-full justify-center py-4"
                >
                  <FiPlay className="mr-2" /> Bắt đầu ôn tập
                </PremiumButton>
                <div className="bg-slate-900/50 rounded-xl border border-white/5 flex items-center justify-center p-4 text-slate-400 text-sm">
                  {module.flashcards?.length || 0} thẻ hiện có
                </div>
              </div>
            </div>
          </PremiumCard>

          {/* Quizzes Section */}
          <PremiumCard className="p-0 overflow-hidden group">
            <div className="p-8 border-b border-white/5 bg-gradient-to-r from-slate-800 to-slate-800/50 group-hover:from-purple-900/20 transition-colors duration-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
                    <FiCheck size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Quizzes</h2>
                    <p className="text-slate-400 text-sm">Bài kiểm tra trắc nghiệm</p>
                  </div>
                </div>
                <PremiumButton
                  variant="ghost"
                  onClick={() => navigate(`/study-modules/${moduleId}/create-quiz`)}
                  className="text-sm"
                >
                  <FiEdit className="mr-1" /> Quản lý
                </PremiumButton>
              </div>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PremiumButton
                  onClick={() => navigate(`/study-modules/${moduleId}/take-quiz`)}
                  disabled={!(quizzes.length > 0)}
                  className="w-full justify-center py-4 !bg-gradient-to-r !from-purple-600 !to-pink-600 !shadow-purple-500/20"
                >
                  <FiZap className="mr-2" /> Làm bài kiểm tra
                </PremiumButton>
                <div className="bg-slate-900/50 rounded-xl border border-white/5 flex items-center justify-center p-4 text-slate-400 text-sm">
                  {quizzes.length} bài kiểm tra
                </div>
              </div>
            </div>
          </PremiumCard>
        </div>

        {/* Sidebar: AI Combine Generation */}
        <div className="lg:col-span-1">
          <PremiumCard className="sticky top-8 !bg-slate-800/80 !backdrop-blur-xl border-emerald-500/20">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/5">
              <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                <FiCpu size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">AI Generator</h2>
                <p className="text-slate-400 text-xs">Tự động tạo nội dung</p>
              </div>
            </div>

            <div className="mb-4">
              <textarea
                value={generationContent}
                onChange={(e) => setGenerationContent(e.target.value)}
                placeholder="Dán nội dung bài học vào đây (văn bản, ghi chú, tóm tắt...). AI sẽ tự động tạo Flashcards và Quizzes cho bạn."
                className="w-full min-h-[250px] p-4 bg-slate-900/50 border border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all resize-none text-sm text-slate-300 placeholder-slate-600 leading-relaxed"
              />
            </div>

            <PremiumButton
              onClick={handleCombineGenerate}
              disabled={isGenerating || !generationContent.trim()}
              className="w-full justify-center !bg-gradient-to-r !from-emerald-600 !to-teal-600 !shadow-emerald-500/20"
            >
              {isGenerating ? "Đang phân tích..." : "Tạo nội dung ngay"}
            </PremiumButton>

            <div className="mt-4 flex items-start gap-2 text-xs text-slate-500 px-2">
              <FiInfo className="mt-0.5 shrink-0" />
              <p>Hệ thống sẽ phân tích văn bản và trích xuất các ý chính quan trọng nhất.</p>
            </div>
          </PremiumCard>
        </div>
      </div>
    </div>
  );
}

export default StudyModuleDetails;
