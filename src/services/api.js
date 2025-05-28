import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để thêm token vào header nếu có
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor để xử lý lỗi 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Xóa thông tin đăng nhập trong localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Chuyển hướng về trang đăng nhập
      window.location.href = '/login';
      
      // Hiển thị thông báo nếu cần
      toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }
    return Promise.reject(error);
  }
);

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const createFlashcard = async (flashcard) => {
  const response = await api.post('/flashcards', flashcard, {
    question: flashcard.question,
    answer: flashcard.answer
  });
  return response.data;
};

export const createBulkFlashcards = async (payload) => {
  const response = await api.post('/flashcards', payload);
  return response.data;
};

export const getRandomFlashcard = async (moduleId) => {
  const response = await api.get(`/flashcards/random/${moduleId}`);
  return response.data;
};

export const getFlashcardsByModule = async (moduleId) => {
  const response = await api.get(`/flashcards/${moduleId}`);
  return response.data;
};

export const updateFlashcardStatus = async (id, flashcard) => {
  const response = await api.put(`/flashcards/${id}`, flashcard);
  return response.data;
};

export const updateFlashcard = async (flashcard) => {
  const response = await api.put('/flashcards', flashcard);
  return response.data;
};

export const deleteFlashcard = async (flashcardId) => {
  const response = await api.delete(`/flashcards/${flashcardId}`);
  return response.data;
};



export const createBulkQuizzes = async (payload) => {
  const response = await api.post('/quizzes', payload);
  return response.data;
};

export const deleteQuiz = async (quizId) => {
  const response = await api.delete(`/quizzes/${quizId}`);
  return response.data;
};

export const getQuizzes = async (moduleId) => {
  if (!moduleId || typeof moduleId !== 'string') {
    throw new Error('Invalid moduleId');
  }
  const response = await api.get(`/quizzes/${moduleId}`);
  return response.data;
};

export const submitQuizResult = async (result) => {
  const response = await api.post('/quiz-result', result);
  return response.data;
};

export const submitQuiz = async (moduleId, submission) => {
  const response = await api.post('/quizzes/submit', submission);
  return response.data;
};

export const createStudyModule = async (studyModule) => {
  const response = await api.post(`${API_URL}/study-modules`, studyModule);
  return response.data;
};

export const getAllStudyModules = async () => {
  try {
    const response = await api.get('/study-modules');
    console.log('API Response:', response); // Debug log
    return response.data.content;
  } catch (error) {
    console.error('Error in getAllStudyModules:', error);
    throw error;
  }
};

export const getStudyModuleById = async (moduleId) => {
  try {
    const response = await api.get(`${API_URL}/study-modules/${moduleId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllStudyModule = async (page = 0, size = 10) => {
  const response = await api.get(`/study-modules?page=${page}&size=${size}`);
  return response.data;
}; 