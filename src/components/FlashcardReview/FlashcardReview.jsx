import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getRandomFlashcard, updateFlashcard } from '../../services/api';
import { FiRefreshCw } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

function FlashcardReview() {
  const navigate = useNavigate();
  const [flashcard, setFlashcard] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    known: 0,
    learning: 0
  });

  const fetchRandomFlashcard = async () => {
    try {
      const response = await getRandomFlashcard();
      // Kiểm tra xem response.data có tồn tại không
      if (!response || !response.data) {
        // Không còn flashcard nào, đặt flashcard thành null để hiển thị kết quả
        setFlashcard(null);
        return;
      }
      
      // Ensure we have both question and answer fields
      const flashcardData = response.data;
      
      // Khởi tạo các giá trị mặc định nếu không có
      const processedData = {
        id: flashcardData.id || 'unknown',
        question: '',
        answer: 'No answer provided',
        ...flashcardData // Giữ các trường khác
      };
      
      // If backend still returns data with only content field, extract question and answer
      if (flashcardData.content) {
        // Handle legacy format: split content into question and answer if needed
        const parts = flashcardData.content.split('\n\n');
        if (parts.length > 1) {
          processedData.question = parts[0];
          processedData.answer = parts[1];
        } else {
          processedData.question = flashcardData.content;
        }
      }
      
      // Nếu có sẵn question và answer, sử dụng chúng
      if (flashcardData.question) {
        processedData.question = flashcardData.question;
      }
      
      if (flashcardData.answer) {
        processedData.answer = flashcardData.answer;
      }
      
      setFlashcard(processedData);
      setIsFlipped(false);
    } catch (error) {
      toast.error('Error fetching flashcard!');
      console.error('Error fetching flashcard:', error);
    }
  };

  const handleStatusUpdate = async (status) => {
    if (!flashcard) return;
    try {
      await updateFlashcard(flashcard.id, { ...flashcard, status });
      toast.success(`Marked as ${status}!`);
      
      // Cập nhật thống kê
      setStats(prevStats => ({
        ...prevStats,
        total: prevStats.total + 1,
        known: status === 'KNOWN' ? prevStats.known + 1 : prevStats.known,
        learning: status === 'LEARN' ? prevStats.learning + 1 : prevStats.learning
      }));
      
      fetchRandomFlashcard();
    } catch (error) {
      toast.error('Error updating flashcard!');
      console.error('Error updating flashcard:', error);
    }
  };
  
  // Hiển thị trang kết quả học tập
  const renderResults = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg text-center"
    >
      <h2 className="text-2xl font-bold text-primary mb-6">Học tập hoàn thành!</h2>
      
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <div className="text-lg mb-4">Thống kê học tập của bạn:</div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Tổng số</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.known}</div>
            <div className="text-sm text-gray-600">Đã biết</div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{stats.learning}</div>
            <div className="text-sm text-gray-600">Cần học lại</div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/study-modules')}
          className="bg-primary text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Quay lại danh sách học phần
        </motion.button>
      </div>
    </motion.div>
  );

  useEffect(() => {
    fetchRandomFlashcard();
  }, []);

  if (!flashcard) {
    // Nếu đã học ít nhất một flashcard, hiển thị kết quả
    if (stats.total > 0) {
      return renderResults();
    }
    
    // Nếu chưa học flashcard nào
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg text-center text-gray-500"
      >
        Không có flashcard nào để ôn tập.
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-primary">Review Flashcard</h2>
        <motion.button
          whileHover={{ scale: 1.05, rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          initial={{ rotate: 0 }}
          onClick={fetchRandomFlashcard}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          title="Get another flashcard"
        >
          <FiRefreshCw className="text-gray-600" />
        </motion.button>
      </div>
      <div className="relative min-h-[180px] mb-4">
        {/* Question side */}
        <motion.div
          className="bg-gray-100 p-6 rounded-md text-center text-lg cursor-pointer w-full h-full absolute inset-0 flex items-center justify-center"
          animate={{ rotateY: isFlipped ? 180 : 0, opacity: isFlipped ? 0 : 1 }}
          transition={{ duration: 0.5 }}
          onClick={() => setIsFlipped(!isFlipped)}
          style={{ backfaceVisibility: 'hidden', display: isFlipped ? 'none' : 'flex' }}
        >
          <div className="font-semibold">
            {flashcard.question || flashcard.content}
          </div>
        </motion.div>

        {/* Answer side */}
        <motion.div
          className="bg-gray-100 p-6 rounded-md text-center text-lg cursor-pointer w-full h-full absolute inset-0 flex items-center justify-center"
          animate={{ rotateY: isFlipped ? 0 : -180, opacity: isFlipped ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => setIsFlipped(!isFlipped)}
          style={{ backfaceVisibility: 'hidden', display: isFlipped ? 'flex' : 'none' }}
        >
          <div className="font-semibold">
            {flashcard.answer || 'No answer provided'}
          </div>
        </motion.div>
      </div>
      <div className="flex justify-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleStatusUpdate('LEARN')}
          className="bg-yellow-500 text-white px-6 py-2 rounded-md hover:bg-yellow-600 transition-colors"
        >
          Learn Again
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleStatusUpdate('KNOWN')}
          className="bg-accent text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors"
        >
          Known
        </motion.button>
      </div>
    </motion.div>
  );
}

export default FlashcardReview;