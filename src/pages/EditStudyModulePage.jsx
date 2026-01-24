import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getStudyModuleById, updateModule } from '../services/api';
import { FiArrowLeft, FiType, FiAlignLeft, FiSave, FiX } from 'react-icons/fi';
import { showError, showSuccess } from '../services/toastService';

function EditStudyModulePage() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchModuleData = async () => {
      try {
        setLoading(true);
        const response = await getStudyModuleById(moduleId);
        const moduleData = response.data;
        setName(moduleData.name || '');
        setDescription(moduleData.description || '');
      } catch (error) {
        showError('Không thể tải thông tin module!');
        console.error('Error fetching module data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchModuleData();
  }, [moduleId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showError('Vui lòng nhập tên module!');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateModule(moduleId, { id: moduleId, name: name.trim(), description: description.trim() });
      showSuccess('Cập nhật module thành công!');
      navigate(`/study-modules/${moduleId}`);
    } catch (error) {
      showError('Lỗi khi cập nhật module!');
      console.error('Error updating module:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen -mt-20">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-card rounded-[2rem] overflow-hidden shadow-2xl border border-white/50"
      >
        {/* Header Decor */}
        <div className="h-32 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 relative flex items-end p-8">
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
                <h2 className="text-2xl font-bold">Chỉnh Sửa Module</h2>
                <p className="text-indigo-100 text-sm opacity-80">Cập nhật thông tin cho module của bạn</p>
              </div>
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
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên module"
              className="input-field pl-5 pr-5"
              required
            />
          </div>

          {/* Module Description Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 ml-1">
              <FiAlignLeft className="text-indigo-600" />
              Mô tả module
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập mô tả module"
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
                  <FiSave className="text-xl" />
                  <span>Lưu Thay Đổi</span>
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
    </div>
  );
}

export default EditStudyModulePage;
