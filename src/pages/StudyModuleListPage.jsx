import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { showError, showSuccess } from '../services/toastService';
import { getAllStudyModule, deleteModule } from '../services/api';
import { FiTrash2, FiEdit } from 'react-icons/fi';
import ConfirmModal from '../components/common/ConfirmModal';

function StudyModuleListPage() {
  const [modules, setModules] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState(null);
  const navigate = useNavigate();

  const fetchModules = async (page = 0, append = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      const response = await getAllStudyModule(page);
      const { content, total_page } = response.data;
      if (append) {
        setModules(prev => [...prev, ...content]);
      } else {
        setModules(content);
      }
      setTotalPages(total_page);
    } catch (error) {
      showError('Error fetching study modules!');
      console.error('Error fetching study modules:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchModules(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    if (nextPage < totalPages) {
      fetchModules(nextPage, true);
      setCurrentPage(nextPage);
    }
  };

  const handleModuleClick = (moduleId) => {
    navigate(`/study-modules/${moduleId}`, { replace: false });
  };

  const handleDeleteModule = (e, moduleId) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click lan tỏa đến phần tử cha
    setModuleToDelete(moduleId);
    setDeleteModalOpen(true);
  };

  const confirmDeleteModule = async () => {
    if (!moduleToDelete) return;
    
    try {
      await deleteModule(moduleToDelete);
      showSuccess('Module đã được xóa thành công!');
      // Cập nhật lại danh sách module sau khi xóa
      fetchModules(currentPage);
    } catch (error) {
      showError('Không thể xóa module. Vui lòng thử lại sau!');
      console.error('Error deleting module:', error);
    }
    
    // Reset state
    setModuleToDelete(null);
  };

  const handleEditModule = (e, moduleId) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click lan tỏa đến phần tử cha
    navigate(`/edit-study-module/${moduleId}`);
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
      className="max-w-4xl mx-auto p-6"
    >
      <ConfirmModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDeleteModule}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa module này không? Hành động này không thể hoàn tác."
      />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-primary">Study Modules</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/create-study-module')}
          className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm flex items-center gap-2 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Module
        </motion.button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((module) => (
          <motion.div
            key={module.id}
            whileHover={{ scale: 1.02 }}
            className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow relative"
            onClick={() => handleModuleClick(module.id)}
          >
            <div className="absolute top-2 right-2 flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors"
                onClick={(e) => handleEditModule(e, module.id)}
                title="Chỉnh sửa module"
              >
                <FiEdit size={16} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                onClick={(e) => handleDeleteModule(e, module.id)}
                title="Xóa module"
              >
                <FiTrash2 size={16} />
              </motion.button>
            </div>
            <h3 className="text-lg font-semibold mb-2 pr-8">{module.name}</h3>
            <p className="text-gray-600">{module.description}</p>
          </motion.div>
        ))}
      </div>


      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {currentPage > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-md bg-secondary text-white hover:bg-blue-600"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </motion.button>
          )}
          
          <span className="px-4 py-2">
             {currentPage + 1} / {totalPages}
          </span>

          {currentPage < totalPages - 1 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-md bg-secondary text-white hover:bg-blue-600"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </motion.button>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default StudyModuleListPage; 