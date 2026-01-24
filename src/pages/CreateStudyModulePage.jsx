import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createStudyModule } from '../services/api';
import { FiArrowLeft, FiType, FiAlignLeft, FiPlus, FiX } from 'react-icons/fi';
import { showError, showSuccess } from '../services/toastService';

function CreateStudyModulePage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showError('Vui lòng nhập tên module!');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createStudyModule({ name: name.trim(), description: description.trim() });
      if (response && response.data) {
        showSuccess('Tạo module thành công!');
        navigate(`/study-modules/${response.data.id}`);
      } else {
        showError('Không nhận được phản hồi hợp lệ từ server.');
      }
    } catch (error) {
      showError('Lỗi khi tạo module!');
      console.error('Error creating module:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-[2rem] bg-slate-800 border border-white/5 shadow-2xl"
      >
        {/* Header Decor */}
        <div className="h-32 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 relative flex items-end p-8">
          <div className="absolute top-0 right-0 w-64 h-full bg-white/10 skew-x-12 translate-x-32"></div>
          <div className="relative z-10 flex items-center justify-between w-full text-white">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1, x: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate(-1)}
                className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/20 hover:bg-white/30 transition-all"
              >
                <FiArrowLeft size={20} />
              </motion.button>
              <div>
                <h2 className="text-2xl font-bold">Tạo Module Mới</h2>
                <p className="text-emerald-100 text-sm opacity-80">Bắt đầu hành trình học tập mới</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-8">
          {/* Module Name Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-300 ml-1">
              <FiType className="text-emerald-500" />
              Tên module học tập
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Lập trình Java căn bản..."
              className="w-full p-4 bg-slate-900/50 border border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-200 placeholder-slate-500 transition-all"
              required
            />
          </div>

          {/* Module Description Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-300 ml-1">
              <FiAlignLeft className="text-emerald-500" />
              Mô tả module
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả ngắn gọn về nội dung học phần..."
              className="w-full p-4 bg-slate-900/50 border border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-200 placeholder-slate-500 min-h-[120px] resize-none transition-all"
              rows="4"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              type="submit"
              className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <FiPlus className="text-xl" />
                  <span>Tạo Module</span>
                </>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-4 px-6 border border-slate-600 text-slate-400 font-bold rounded-xl hover:bg-slate-700 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <FiX className="text-xl" />
              <span>Hủy Bỏ</span>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default CreateStudyModulePage;