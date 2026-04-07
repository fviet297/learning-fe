import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiBook, FiMoreVertical, FiClock } from 'react-icons/fi';
import { getAllStudyModule, deleteModule } from '../services/api';
import { showError, showSuccess } from '../services/toastService';
import PremiumCard from '../components/common/PremiumCard';
import PremiumInput from '../components/common/PremiumInput';
import PremiumButton from '../components/common/PremiumButton';
import ConfirmModal from '../components/common/ConfirmModal';

function HomePage() {
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState(null);

  const fetchModules = async (page = 0) => {
    try {
      setLoading(true);
      const response = await getAllStudyModule(page);
      const { content, total_page } = response.data;
      setModules(content);
      setTotalPages(total_page);
    } catch (error) {
      showError('Không thể tải danh sách học phần!');
      console.error('Error fetching modules:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules(currentPage);
  }, [currentPage]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredModules = modules.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.description && m.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setModuleToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!moduleToDelete) return;
    try {
      await deleteModule(moduleToDelete);
      showSuccess('Đã xóa học phần thành công');
      fetchModules(currentPage);
    } catch (error) {
      showError('Xóa thất bại');
    } finally {
      setDeleteModalOpen(false);
      setModuleToDelete(null);
    }
  };

  return (
    <div className="space-y-8">
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa học phần này? Hành động này không thể hoàn tác."
      />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            Học Phần Của Bạn
          </h1>
          <p className="text-slate-400 mt-1">Quản lý và ôn tập các kiến thức đã tạo</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <PremiumButton
            onClick={() => navigate('/learn-clock')}
            icon={FiClock}
            variant="secondary"
          >
            Học Xem Đồng Hồ
          </PremiumButton>
          <PremiumButton
            onClick={() => navigate('/create-study-module')}
            icon={FiPlus}
            variant="primary"
          >
            Tạo Học Phần Mới
          </PremiumButton>
        </div>
      </div>

      {/* Search Bar Section */}
      <div className="bg-slate-800/50 backdrop-blur-md p-4 rounded-2xl border border-white/5 shadow-lg">
        <PremiumInput
          placeholder="Tìm kiếm học phần theo tên..."
          icon={FiSearch}
          value={searchTerm}
          onChange={handleSearch}
          className="w-full"
        />
      </div>

      {/* Module List Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {filteredModules.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {filteredModules.map((module) => (
                  <PremiumCard
                    key={module.id}
                    onClick={() => navigate(`/study-modules/${module.id}`)}
                    className="relative group h-full flex flex-col"
                  >
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 z-10">
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/edit-study-module/${module.id}`); }}
                        className="p-2 bg-slate-700 hover:bg-indigo-600 text-white rounded-full shadow-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <FiEdit size={14} />
                      </button>
                      <button
                        onClick={(e) => handleDeleteClick(e, module.id)}
                        className="p-2 bg-slate-700 hover:bg-rose-600 text-white rounded-full shadow-lg transition-colors"
                        title="Xóa"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>

                    <div className="mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                        <FiBook size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-100 mb-2 line-clamp-2" title={module.name}>
                        {module.name}
                      </h3>
                      <p className="text-slate-400 text-sm line-clamp-3">
                        {module.description || "Chưa có mô tả"}
                      </p>
                    </div>

                    <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center text-xs text-slate-500">
                      <span>{new Date(module.createdDate || Date.now()).toLocaleDateString('vi-VN')}</span>
                      <span className="bg-slate-700/50 px-2 py-1 rounded text-slate-300">Module</span>
                    </div>
                  </PremiumCard>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="text-center py-16 bg-slate-800/30 rounded-3xl border border-dashed border-slate-700">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                <FiBook size={32} />
              </div>
              <h3 className="text-xl font-medium text-slate-300 mb-2">Chưa tìm thấy học phần nào</h3>
              <p className="text-slate-500 max-w-sm mx-auto mb-6">
                {searchTerm ? `Không có kết quả nào cho "${searchTerm}"` : "Hãy tạo học phần đầu tiên của bạn để bắt đầu học tập!"}
              </p>
              {!searchTerm && (
                <PremiumButton
                  onClick={() => navigate('/create-study-module')}
                  variant="primary"
                  className="mx-auto"
                >
                  Tạo mới ngay
                </PremiumButton>
              )}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <button
                disabled={currentPage === 0}
                onClick={() => setCurrentPage(p => p - 1)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Trước
              </button>
              <span className="px-4 py-2 text-slate-400">
                Trang {currentPage + 1} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages - 1}
                onClick={() => setCurrentPage(p => p + 1)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sau
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default HomePage;
