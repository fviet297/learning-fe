import axios from 'axios';

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

export const getRandomFlashcard = async () => {
  const response = await api.get('/flashcards/random');
  return response.data;
};

export const updateFlashcard = async (id, flashcard) => {
  const response = await api.put(`/flashcards/${id}`, flashcard);
  return response.data;
};



export const createBulkQuizzes = async (payload) => {
  const response = await api.post('/quizzes', payload);
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