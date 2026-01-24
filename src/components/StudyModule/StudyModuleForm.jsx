import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiType, FiAlignLeft, FiX, FiCheck } from 'react-icons/fi';
import { createStudyModule } from '../../services/api';
import { showError, showSuccess } from '../../services/toastService';

function StudyModuleForm() {
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
      const response = await createStudyModule({
        name: name.trim(),
        description: description.trim()
      });
      const moduleId = response.data.id;
      showSuccess('Tạo module học tập thành công!');
      navigate(`/study-modules/${moduleId}`);
    } catch (error) {
      showError('Không thể tạo module. Vui lòng thử lại!');
      console.error('Error creating study module:', error);
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
        className="glass-card rounded-[2rem] overflow-hidden shadow-2xl border border-white/50"
      >
        {/* Header Decor */}
        <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-800 relative flex items-end p-8">
          <div className="absolute top-0 right-0 w-64 h-full bg-white/10 skew-x-12 translate-x-32"></div>
          <div className="relative z-10 flex items-center gap-4 text-white">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white shadow-lg border border-white/20">
              <FiPlus size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Tạo Module Mới</h2>
              <p className="text-indigo-100 text-sm">Bắt đầu hành trình chinh phục kiến thức mới</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-8">
          {/* Module Name Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 ml-1">
              <FiType className="text-indigo-600" />
              Tên module học tập
            </label>
            <div className="relative group">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Tiếng Anh chuyên ngành, Lịch sử triết học..."
                className="input-field pl-5 pr-5"
                required
              />
            </div>
          </div>

          {/* Module Description Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 ml-1">
              <FiAlignLeft className="text-indigo-600" />
              Mô tả ngắn gọn
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Module này giúp bạn nắm vững các kiến thức về..."
              className="input-field pl-5 pr-5 min-h-[120px] resize-none"
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
              className="btn-primary flex-1 flex items-center justify-center gap-2 py-4"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <FiCheck className="text-xl" />
                  <span>Xác Nhận Tạo</span>
                </>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-4 px-6 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
              <FiX className="text-xl" />
              <span>Hủy Bỏ</span>
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Helper Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center text-slate-400 text-sm mt-8"
      >
        Sau khi tạo, bạn có thể bắt đầu thêm Flashcards và Quizzes cho module này.
      </motion.p>
    </div>
  );
}

export default StudyModuleForm;