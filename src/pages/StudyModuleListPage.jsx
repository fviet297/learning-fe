import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getAllStudyModule } from '../services/api';

function StudyModuleListPage() {
  const [modules, setModules] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
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
      toast.error('Error fetching study modules!');
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
      <h2 className="text-2xl font-semibold mb-6 text-primary">Study Modules</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((module) => (
          <motion.div
            key={module.id}
            whileHover={{ scale: 1.02 }}
            className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleModuleClick(module.id)}
          >
            <h3 className="text-lg font-semibold mb-2">{module.name}</h3>
            <p className="text-gray-600">{module.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Load More Button */}
      {currentPage < totalPages - 1 && (
        <div className="flex justify-center mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-secondary text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
            onClick={handleLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </motion.button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-md ${
              currentPage === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-secondary text-white hover:bg-blue-600'
            }`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
          >
            Previous
          </motion.button>
          
          <span className="px-4 py-2">
            Page {currentPage + 1} of {totalPages}
          </span>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-md ${
              currentPage === totalPages - 1
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-secondary text-white hover:bg-blue-600'
            }`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
          >
            Next
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}

export default StudyModuleListPage; 