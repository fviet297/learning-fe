import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiBook, FiPlus, FiLayers, FiAward, FiBarChart2 } from 'react-icons/fi';

function HomePage() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const cardVariants = {
    hover: { 
      scale: 1.03, 
      boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.2)",
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
      >
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16 mt-4 sm:mt-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-4 sm:mb-6 px-2"
          >
            Nền tảng học tập thông minh
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-gray-600 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto px-2"
          >
            Tối ưu hóa việc học với các study modules, flashcards và quizzes tùy chỉnh
          </motion.p>
        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
          <motion.div
            whileHover="hover"
            variants={cardVariants}
            className="bg-white p-6 sm:p-8 rounded-xl shadow-md hover:shadow-lg cursor-pointer overflow-hidden relative border border-blue-100 transition-shadow duration-300"
            onClick={() => navigate('/study-modules')}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 z-0"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-2 sm:p-3 rounded-lg mr-3 sm:mr-4">
                  <FiBook className="text-blue-600 text-xl sm:text-2xl" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-primary">Study Modules</h2>
              </div>
              <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
                Truy cập các module học tập của bạn, xem lại flashcards và làm bài kiểm tra để đánh giá kiến thức.
              </p>
              <div className="text-blue-600 font-medium flex items-center">
                Khám phá ngay
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover="hover"
            variants={cardVariants}
            className="bg-white p-6 sm:p-8 rounded-xl shadow-md hover:shadow-lg cursor-pointer overflow-hidden relative border border-green-100 transition-shadow duration-300"
            onClick={() => navigate('/create-study-module')}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16 z-0"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 md:mr-6">
                  <FiPlus className="text-green-600 text-xl sm:text-2xl md:text-3xl" />
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-primary">Tạo Module</h2>
              </div>
              <p className="text-gray-600 mb-6 md:mb-8">
                Tạo các module học tập mới, thêm flashcards và thiết kế quizzes cho hành trình học tập của bạn.
              </p>
              <div className="text-green-600 font-medium flex items-center">
                Bắt đầu tạo
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mb-16"
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-6 sm:mb-8 text-center">Tính năng nổi bật</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <motion.div 
              variants={itemVariants} 
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white p-5 sm:p-6 rounded-lg shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300"
            >
              <div className="bg-blue-50 p-2 sm:p-3 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mb-3 sm:mb-4">
                <FiLayers className="text-blue-600 text-lg sm:text-xl" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2">Quản lý Module</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Tạo và quản lý các module học tập theo chủ đề hoặc môn học của bạn.
              </p>
            </motion.div>
            
            <motion.div 
              variants={itemVariants} 
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white p-5 sm:p-6 rounded-lg shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300"
            >
              <div className="bg-green-50 p-2 sm:p-3 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mb-3 sm:mb-4">
                <FiBarChart2 className="text-green-600 text-lg sm:text-xl" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2">Flashcards thông minh</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Học với flashcards thông minh, tạo từ nội dung văn bản hoặc nhập thủ công.
              </p>
            </motion.div>
            
            <motion.div 
              variants={itemVariants} 
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white p-5 sm:p-6 rounded-lg shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300"
            >
              <div className="bg-purple-50 p-2 sm:p-3 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mb-3 sm:mb-4">
                <FiAward className="text-purple-600 text-lg sm:text-xl" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2">Quizzes tương tác</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Kiểm tra kiến thức với các bài quiz tương tác, đánh giá tiến độ học tập.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-xs sm:text-sm pt-6 sm:pt-8 border-t border-gray-200 mt-8 sm:mt-12">
          <p>© {new Date().getFullYear()} Learning App. Tất cả các quyền được bảo lưu.</p>
        </div>
      </motion.div>
    </div>
  );
}

export default HomePage;