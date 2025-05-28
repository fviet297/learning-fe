import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getStudyModuleById, updateModule } from '../services/api';
import { FiArrowLeft } from 'react-icons/fi';

function EditStudyModulePage() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModuleData = async () => {
      try {
        setLoading(true);
        const response = await getStudyModuleById(moduleId);
        const moduleData = response.data;
        setName(moduleData.name || '');
        setDescription(moduleData.description || '');
      } catch (error) {
        toast.error('Không thể tải thông tin module!');
        console.error('Error fetching module data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchModuleData();
  }, [moduleId]);

  const handleSubmit = async () => {
    if (!name) {
      toast.error('Vui lòng nhập tên module!');
      return;
    }
    try {
      await updateModule(moduleId, {id: moduleId, name, description });
      toast.success('Cập nhật module thành công!');
      navigate(`/study-modules/${moduleId}`);
    } catch (error) {
      toast.error('Lỗi khi cập nhật module!');
      console.error('Error updating module:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg"
    >
      <div className="flex items-center mb-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={() => navigate('/study-modules')}
          className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-all shadow-sm"
          title="Quay lại"
        >
          <FiArrowLeft size={20} />
        </motion.button>
        <h2 className="text-xl font-semibold ml-4 text-primary">Chỉnh sửa Module</h2>
      </div>
      
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nhập tên module"
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary mb-4"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Nhập mô tả module"
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary mb-4"
        rows="4"
      />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSubmit}
        className="bg-secondary text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
      >
        Cập nhật
      </motion.button>
    </motion.div>
  );
}

export default EditStudyModulePage;
