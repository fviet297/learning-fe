import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiCheck, FiX, FiAward, FiClock } from 'react-icons/fi';
import { getQuizzes, submitQuiz, submitQuizResult } from '../../services/api';
import PremiumCard from '../common/PremiumCard';
import PremiumButton from '../common/PremiumButton';

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

  // Shuffle array function
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Reset quiz state
  const restartQuiz = async () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setCurrentScore(0);
    setResults([]);
    setShowingResult(false);
    setLastAnswerCorrect(null);

    // Re-fetch and shuffle questions
    try {
      setLoading(true);
      const response = await getQuizzes(moduleId);
      if (response && response.data && Array.isArray(response.data)) {
        const shuffledQuestions = shuffleArray(response.data);
        setQuiz({
          questions: shuffledQuestions.map(item => ({
            id: item.id,
            text: item.question,
            answers: (Array.isArray(item.options) ? item.options : JSON.parse(item.options)).map((option, index) => ({
              id: index,
              text: option
            })),
            correctAnswer: item.correctAnswer
          }))
        });
      }
    } catch (error) {
      console.error('Error restarting quiz:', error);
      toast.error('Failed to restart quiz');
      navigate(`/study-modules/${moduleId}`);
    } finally {
      setLoading(false);
    }
  };

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
        if (response && response.data && Array.isArray(response.data)) {
          // Shuffle questions before setting the quiz state
          const shuffledQuestions = shuffleArray(response.data);
          setQuiz({
            questions: shuffledQuestions.map(item => ({
              id: item.id,
              text: item.question,
              answers: (Array.isArray(item.options) ? item.options : JSON.parse(item.options)).map((option, index) => ({
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

    // Cập nhật điểm ngay lập tức
    let newScore = currentScore;
    if (isCorrect) {
      newScore = currentScore + 10;
      setCurrentScore(newScore);
    }

    // Xử lý sau 1.5 giây (nhanh hơn xíu)
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
            score: newScore  // Sử dụng newScore thay vì currentScore
          };
          await submitQuizResult(quizResult);
          setIsSubmitted(true);
          toast.success(`Hoàn thành! Kết quả: ${newScore} điểm`);
        } catch (error) {
          console.error('Error submitting quiz result:', error);
          // Vẫn hiển thị kết quả cho user dù có lỗi
          setIsSubmitted(true);
        }
      }
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="text-center p-6">
        <h2 className="text-xl text-rose-400">{!quiz ? 'Không có bài kiểm tra' : 'Bài kiểm tra không có câu hỏi'}</h2>
        <PremiumButton
          variant="primary"
          className="mt-6 mx-auto"
          onClick={() => navigate(`/study-modules/${moduleId}`)}
        >
          Quay lại Module
        </PremiumButton>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / quiz.questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

      <div className="flex items-center mb-6">
        <motion.button
          whileHover={{ scale: 1.1, x: -2 }}
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={() => navigate(`/study-modules/${moduleId}`)}
          className="flex items-center justify-center w-10 h-10 bg-slate-800 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-all shadow-sm border border-slate-700"
          title="Back to Module"
        >
          <FiArrowLeft size={20} />
        </motion.button>
        <span className="ml-4 text-slate-400 font-medium">Quay lại</span>
      </div>

      {!isSubmitted ? (
        // Hiển thị câu hỏi và đáp án
        <>
          <div className="mb-8">
            <div className="flex justify-between items-end mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Kiểm tra kiến thức</h2>
                <p className="text-slate-400 text-sm">Câu hỏi {currentQuestionIndex + 1} / {quiz.questions.length}</p>
              </div>
              <div className="text-right">
                <div className="text-xs uppercase font-bold text-slate-500 mb-1">Điểm hiện tại</div>
                <div className="text-2xl font-black text-indigo-400">{currentScore}</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <PremiumCard className="relative overflow-hidden">
            {/* Question Visual */}
            <div className="absolute top-0 right-0 p-32 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

            <div className="relative z-10">
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-8 leading-relaxed">
                {currentQuestion.text}
              </h3>

              <div className="space-y-3">
                {currentQuestion.answers.map((answer) => {
                  const isSelected = selectedAnswers[currentQuestion.id] === answer.id;
                  const showResult = showingResult;
                  const isCorrect = answer.id === currentQuestion.correctAnswer;

                  let buttonClass = 'relative w-full text-left p-5 rounded-2xl border transition-all duration-200 group ';

                  if (showResult) {
                    if (isCorrect) {
                      buttonClass += 'border-emerald-500 bg-emerald-500/10 text-emerald-300';
                    } else if (isSelected && !isCorrect) {
                      buttonClass += 'border-rose-500 bg-rose-500/10 text-rose-300';
                    } else {
                      buttonClass += 'border-slate-700 bg-slate-800/50 text-slate-500 opacity-50';
                    }
                  } else if (isSelected) {
                    buttonClass += 'border-indigo-500 bg-indigo-500/10 text-indigo-300 scale-[0.99]';
                  } else {
                    buttonClass += 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-indigo-500/50 hover:bg-slate-800';
                  }

                  return (
                    <motion.button
                      key={answer.id}
                      whileHover={!showingResult ? { scale: 1.01 } : {}}
                      whileTap={!showingResult ? { scale: 0.99 } : {}}
                      className={buttonClass}
                      onClick={() => !showingResult && handleAnswerSelect(currentQuestion.id, answer.id)}
                      disabled={showingResult || selectedAnswers[currentQuestion.id] !== undefined}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-lg">{answer.text}</span>
                        {showResult && (
                          <span className="ml-3 shrink-0">
                            {isCorrect && <FiCheck className="text-emerald-400 text-xl" />}
                            {isSelected && !isCorrect && <FiX className="text-rose-400 text-xl" />}
                          </span>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </PremiumCard>

          {showingResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 mx-auto max-w-sm text-center font-bold p-2 px-4 rounded-xl ${lastAnswerCorrect ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}
            >
              {lastAnswerCorrect ? 'Chính xác! +10 điểm' : 'Tiếc quá, sai rồi!'}
            </motion.div>
          )}
        </>
      ) : (
        // Hiển thị kết quả cuối cùng
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <PremiumCard className="text-center p-12 overflow-hidden relative border-indigo-500/30">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none"></div>

            <div className="relative z-10">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/20">
                <FiAward className="text-white text-5xl" />
              </div>

              <h2 className="text-3xl font-black text-white mb-2">Hoàn thành bài kiểm tra!</h2>
              <div className="text-slate-400 mb-8">Bạn đã làm rất tốt</div>

              <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 mb-4 tracking-tighter">
                {currentScore}
              </div>
              <div className="text-sm font-bold uppercase tracking-widest text-indigo-400 mb-8">Tổng Điểm</div>

              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-10">
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5">
                  <div className="text-2xl font-bold text-emerald-400">{results.filter(r => r.isCorrect).length}</div>
                  <div className="text-xs text-slate-500 font-bold uppercase mt-1">Đúng</div>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5">
                  <div className="text-2xl font-bold text-white">{quiz.questions.length}</div>
                  <div className="text-xs text-slate-500 font-bold uppercase mt-1">Tổng câu</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <PremiumButton
                  variant="secondary"
                  className="justify-center"
                  onClick={() => navigate(`/study-modules/${moduleId}`)}
                >
                  Quay lại Module
                </PremiumButton>
                <PremiumButton
                  variant="primary"
                  className="justify-center"
                  onClick={restartQuiz}
                >
                  Làm lại bài
                </PremiumButton>
              </div>
            </div>
          </PremiumCard>
        </motion.div>
      )}
    </div>
  );
}

export default QuizTest;
