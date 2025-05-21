import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getQuizzes, submitQuiz, submitQuizResult } from '../../services/api';

function QuizTest() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [results, setResults] = useState([]);
  const [showingResult, setShowingResult] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!moduleId) {
        toast.error('Module ID is missing');
        navigate('/study-modules');
        return;
      }

      try {
        setLoading(true);
        const response = await getQuizzes(moduleId);
        console.log('Quiz response:', response);
        if (response && response.data && Array.isArray(response.data)) {
          setQuiz({
            questions: response.data.map(item => ({
              id: item.id,
              text: item.question,
              answers: JSON.parse(item.options).map((option, index) => ({
                id: index,
                text: option
              })),
              correctAnswer: item.correctAnswer
            }))
          });
        } else {
          toast.error('No quiz available');
          navigate(`/study-modules/${moduleId}`);
        }
      } catch (error) {
        console.error('Error fetching quiz:', error);
        toast.error('Failed to load quiz');
        navigate(`/study-modules/${moduleId}`);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [moduleId, navigate]);

  const handleAnswerSelect = async (questionId, answerId) => {
    // Nếu đã chọn câu trả lời cho câu hỏi này, không cho chọn lại
    if (selectedAnswers[questionId] !== undefined) {
      return;
    }

    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const isCorrect = answerId === currentQuestion.correctAnswer;
    
    // Cập nhật kết quả
    const newResult = {
      questionId: questionId,
      question: currentQuestion.text,
      selectedAnswer: answerId,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect: isCorrect
    };

    setResults(prev => [...prev, newResult]);
    setShowingResult(true);
    setLastAnswerCorrect(isCorrect);

    // Cập nhật điểm
    if (isCorrect) {
      setCurrentScore(prev => prev + 10);
    }

    // Không gửi API ở đây nữa

    // Xử lý sau 2 giây
    setTimeout(async () => {
      if (currentQuestionIndex < quiz.questions.length - 1) {
        // Nếu không phải câu cuối, chuyển sang câu tiếp theo
        setShowingResult(false);
        setLastAnswerCorrect(null);
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        // Nếu là câu cuối, gửi kết quả lên API và hiển thị màn hình hoàn thành
        try {
          const quizResult = {
            userId: localStorage.getItem('userId'),
            studyModuleId: moduleId,
            score: currentScore
          };
          await submitQuizResult(quizResult);
          setIsSubmitted(true);
          toast.success(`Quiz completed! Final score: ${currentScore} points`);
        } catch (error) {
          console.error('Error submitting quiz result:', error);
          toast.error('Failed to save quiz result');
          // Vẫn hiển thị kết quả cho user dù có lỗi
          setIsSubmitted(true);
        }
      }
    }, 2000);
  };

  const handleSubmit = async () => {
    if (!moduleId) {
      toast.error('Module ID is missing');
      return;
    }

    try {
      setSubmitting(true);
      
      // Lấy user ID từ localStorage hoặc context
      const userId = localStorage.getItem('userId');
      if (!userId) {
        toast.error('Please login to submit quiz');
        return;
      }

      // Kiểm tra xem đã trả lời hết các câu hỏi chưa
      if (Object.keys(selectedAnswers).length !== quiz.questions.length) {
        toast.error('Please answer all questions before submitting');
        return;
      }

      // Tính toán kết quả ngay lập tức từ dữ liệu có sẵn
      const quizResults = [];
      let totalCorrect = 0;

      for (const question of quiz.questions) {
        const selectedAnswer = selectedAnswers[question.id];
        const isCorrect = selectedAnswer === question.correctAnswer;
        
        quizResults.push({
          questionId: question.id,
          question: question.text,
          selectedAnswer: selectedAnswer,
          correctAnswer: question.correctAnswer,
          isCorrect: isCorrect
        });

        if (isCorrect) {
          totalCorrect++;
        }
      }

      const finalScore = (totalCorrect / quiz.questions.length) * 100;
      
      // Cập nhật UI ngay lập tức
      setScore(finalScore);
      setResults(quizResults);
      setIsSubmitted(true);
      
      toast.success(`Quiz completed! Your score: ${finalScore.toFixed(1)}%`);

      // Gửi kết quả lên API
      try {
        const apiSubmissions = quizResults.map(result => ({
          quizId: result.questionId,
          userId: userId,
          selectedOption: result.selectedAnswer
        }));

        // Gửi tất cả các submission cùng lúc
        await Promise.all(
          apiSubmissions.map(submission =>
            submitQuiz(moduleId, submission).catch(error => {
              console.error(`Error submitting answer for question ${submission.quizId}:`, error);
              // Không throw error để tiếp tục xử lý các submission khác
              return null;
            })
          )
        );

        console.log('All quiz results submitted to API successfully');
      } catch (error) {
        console.error('Error submitting some quiz results:', error);
        // Không hiển thị lỗi cho user vì UI đã hiển thị kết quả thành công
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="text-center p-6">
        <h2 className="text-xl text-red-600">{!quiz ? 'No quiz available' : 'No questions available for this quiz'}</h2>
        <button
          className="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          onClick={() => navigate(`/study-modules/${moduleId}`)}
        >
          Back to Module
        </button>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6"
    >
      {!isSubmitted ? (
        // Hiển thị câu hỏi và đáp án
        <>
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold text-primary mb-2">{quiz.title}</h2>
              <p className="text-gray-600">Question {currentQuestionIndex + 1} of {quiz.questions.length}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-primary">Current Score: {currentScore}</p>
              {showingResult && (
                <div className={`mt-2 text-lg font-semibold ${lastAnswerCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {lastAnswerCorrect ? '+10 points!' : 'No points awarded'}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">{currentQuestion.text}</h3>
            <div className="space-y-4">
              {currentQuestion.answers.map((answer) => {
                const isSelected = selectedAnswers[currentQuestion.id] === answer.id;
                const showResult = showingResult;
                const isCorrect = answer.id === currentQuestion.correctAnswer;
                
                let buttonClass = 'w-full text-left p-4 rounded-lg border-2 transition-colors';
                if (showResult) {
                  if (isCorrect) {
                    buttonClass += ' border-green-500 bg-green-50';
                  } else if (isSelected && !isCorrect) {
                    buttonClass += ' border-red-500 bg-red-50';
                  } else {
                    buttonClass += ' border-gray-200';
                  }
                } else if (isSelected) {
                  buttonClass += ' border-primary bg-primary/10';
                } else {
                  buttonClass += ' border-gray-200 hover:border-primary/50';
                }
                
                return (
                  <motion.button
                    key={answer.id}
                    whileHover={{ scale: (showingResult || selectedAnswers[currentQuestion.id] !== undefined) ? 1 : 1.02 }}
                    whileTap={{ scale: (showingResult || selectedAnswers[currentQuestion.id] !== undefined) ? 1 : 0.98 }}
                    className={buttonClass}
                    onClick={() => !showingResult && handleAnswerSelect(currentQuestion.id, answer.id)}
                    disabled={showingResult || selectedAnswers[currentQuestion.id] !== undefined}
                    onDoubleClick={() => !showingResult && !selectedAnswers[currentQuestion.id] && handleAnswerSelect(currentQuestion.id, answer.id)}
                  >
                    <div className="flex justify-between items-center">
                      <span>{answer.text}</span>
                      {showResult && (
                        <span className={`ml-2 ${isCorrect ? 'text-green-600' : (isSelected ? 'text-red-600' : '')}`}>
                          {isCorrect && '✓'}
                          {isSelected && !isCorrect && '✗'}
                        </span>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        // Hiển thị kết quả cuối cùng
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-8 text-center"
        >
          <h2 className="text-3xl font-bold text-primary mb-6">Quiz Completed!</h2>
          <div className="mb-8">
            <p className="text-4xl font-bold text-primary mb-4">{currentScore} points</p>
            <p className="text-xl text-gray-600">Correct answers: {results.filter(r => r.isCorrect).length} / {quiz.questions.length}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            onClick={() => navigate(`/study-modules/${moduleId}`)}
          >
            Back to Module
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}

export default QuizTest; 