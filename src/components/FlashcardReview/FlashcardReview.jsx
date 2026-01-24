import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { FiRefreshCw, FiArrowLeft, FiCheck, FiX, FiInfo, FiTrendingUp } from 'react-icons/fi';
import { getRandomFlashcard, updateFlashcardStatus } from '../../services/api';
import { showError, showSuccess } from '../../services/toastService';
import PremiumCard from '../common/PremiumCard';
import PremiumButton from '../common/PremiumButton';

function FlashcardReview() {
  const navigate = useNavigate();
  const { moduleId } = useParams();
  const [flashcard, setFlashcard] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    known: 0,
    learning: 0
  });

  const fetchRandomFlashcard = async (id) => {
    try {
      setLoading(true);
      const response = await getRandomFlashcard(id);

      if (!response || !response.data) {
        setFlashcard(null);
        return;
      }

      setFlashcard(response.data);
      setIsFlipped(false);
    } catch (error) {
      showError('Không thể tải thẻ ghi nhớ mới');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status) => {
    if (!flashcard) return;
    try {
      await updateFlashcardStatus(flashcard.id, { ...flashcard, status });

      // Update statistics
      setStats(prev => ({
        ...prev,
        total: prev.total + 1,
        known: status === 'KNOWN' ? prev.known + 1 : prev.known,
        learning: status === 'LEARN' ? prev.learning + 1 : prev.learning
      }));

      // Less intrusive notification
      // showSuccess(status === 'KNOWN' ? 'Đã thuộc!' : 'Cần học lại!');
      fetchRandomFlashcard(moduleId);
    } catch (error) {
      showError('Lỗi cập nhật trạng thái thẻ');
    }
  };

  useEffect(() => {
    fetchRandomFlashcard(moduleId);
  }, [moduleId]);

  if (loading && !flashcard && stats.total === 0) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Study Summary View
  if (!flashcard && stats.total > 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto space-y-8 py-10"
      >
        <PremiumCard className="p-12 text-center overflow-hidden relative border-emerald-500/20">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>

          <div className="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <FiTrendingUp size={48} />
          </div>

          <h2 className="text-4xl font-black text-white mb-2">Tuyệt vời!</h2>
          <p className="text-slate-400 mb-10">Bạn đã hoàn thành phiên ôn tập này.</p>

          <div className="grid grid-cols-3 gap-6 mb-10">
            <div className="p-6 bg-slate-800/50 rounded-[2rem] border border-white/5">
              <div className="text-3xl font-black text-white">{stats.total}</div>
              <div className="text-xs uppercase font-bold text-slate-500 mt-1">Đã học</div>
            </div>
            <div className="p-6 bg-emerald-500/10 rounded-[2rem] border border-emerald-500/20">
              <div className="text-3xl font-black text-emerald-400">{stats.known}</div>
              <div className="text-xs uppercase font-bold text-emerald-500/60 mt-1">Đã thuộc</div>
            </div>
            <div className="p-6 bg-amber-500/10 rounded-[2rem] border border-amber-500/20">
              <div className="text-3xl font-black text-amber-400">{stats.learning}</div>
              <div className="text-xs uppercase font-bold text-amber-500/60 mt-1">Cần học</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <PremiumButton
              variant="secondary"
              onClick={() => navigate(`/study-modules/${moduleId}`)}
              className="flex-1 justify-center py-4"
            >
              Quay lại Module
            </PremiumButton>
            <PremiumButton
              variant="primary"
              onClick={() => {
                setStats({ total: 0, known: 0, learning: 0 });
                fetchRandomFlashcard(moduleId);
              }}
              className="flex-1 justify-center py-4"
            >
              Học tiếp
            </PremiumButton>
          </div>
        </PremiumCard>
      </motion.div>
    );
  }

  if (!flashcard) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-500 border border-slate-700">
          <FiInfo size={32} />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Chưa có Flashcard nào</h3>
        <p className="text-slate-400 mb-8">Hãy tạo thêm thẻ ghi nhớ để bắt đầu ôn tập!</p>
        <PremiumButton
          variant="primary"
          onClick={() => navigate(`/study-modules/${moduleId}`)}
          className="max-w-xs mx-auto"
        >
          Quay lại
        </PremiumButton>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1, x: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(`/study-modules/${moduleId}`)}
            className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all shadow-sm"
          >
            <FiArrowLeft size={24} />
          </motion.button>
          <div>
            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Ôn tập Flashcard</h1>
            <p className="text-sm text-slate-500">Chạm vào thẻ để lật xem đáp án</p>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="px-4 py-2 bg-slate-800 rounded-xl border border-slate-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            <span className="text-sm font-bold text-slate-300">{stats.total} thẻ</span>
          </div>
          <motion.button
            whileHover={{ rotate: 180 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={() => fetchRandomFlashcard(moduleId)}
            className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-400 border border-slate-700 hover:bg-slate-700 hover:text-indigo-300 transition-all shadow-sm"
          >
            <FiRefreshCw size={20} />
          </motion.button>
        </div>
      </div>

      {/* 3D Flashcard */}
      <div className="perspective-1000 py-6 min-h-[450px] flex items-center justify-center">
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20
          }}
          className="preserve-3d relative w-full h-[400px] cursor-pointer"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Front Side */}
          <div className="backface-hidden absolute inset-0 w-full h-full bg-slate-800 bg-opacity-80 backdrop-blur-xl rounded-[3rem] shadow-2xl border border-white/10 flex flex-col items-center justify-center p-12 text-center group hover:bg-slate-800 transition-colors">
            <div className="absolute top-10 left-10 opacity-20 group-hover:opacity-40 transition-opacity">
              <FiInfo size={40} className="text-indigo-400" />
            </div>
            <p className="text-indigo-400 uppercase tracking-widest text-xs font-black mb-6">CÂU HỎI</p>
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight break-words max-w-full">
              {flashcard.question}
            </h2>
            <div className="absolute bottom-10 left-0 right-0 text-center text-slate-500 text-sm font-bold animate-bounce flex items-center justify-center gap-2">
              Lật thẻ <FiRefreshCw />
            </div>
          </div>

          {/* Back Side */}
          <div className="backface-hidden absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-900 to-purple-900 rounded-[3rem] shadow-2xl border border-white/20 flex flex-col items-center justify-center p-12 text-center rotate-y-180">
            <p className="text-indigo-200 uppercase tracking-widest text-xs font-black mb-6">ĐÁP ÁN</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white italic leading-tight break-words max-w-full">
              {flashcard.answer}
            </h2>
          </div>
        </motion.div>
      </div>

      {/* Control Buttons */}
      <div className="min-h-[120px] flex items-start justify-center">
        <AnimatePresence mode="wait">
          {isFlipped ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex flex-col sm:flex-row gap-6 w-full justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => { e.stopPropagation(); handleStatusUpdate('LEARN'); }}
                className="flex-1 sm:max-w-xs flex flex-col items-center gap-2 p-6 rounded-[2.5rem] bg-slate-800 border border-amber-500/30 hover:bg-slate-700 transition-all shadow-lg group"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FiX size={24} className="text-amber-500" />
                </div>
                <span className="font-black text-lg text-amber-500">Cần học lại</span>
                <span className="text-[10px] uppercase font-bold text-slate-500">Chưa nắm vững</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => { e.stopPropagation(); handleStatusUpdate('KNOWN'); }}
                className="flex-1 sm:max-w-xs flex flex-col items-center gap-2 p-6 rounded-[2.5rem] bg-slate-800 border border-emerald-500/30 hover:bg-slate-700 transition-all shadow-lg group"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FiCheck size={24} className="text-emerald-500" />
                </div>
                <span className="font-black text-lg text-emerald-500">Đã thuộc</span>
                <span className="text-[10px] uppercase font-bold text-slate-500">Thanh thạo rồi</span>
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-slate-500 font-medium italic pt-4"
            >
              Giao diện sẽ hiện các lựa chọn sau khi bạn lật thẻ
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default FlashcardReview;
