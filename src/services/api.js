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

export const login = async (username, password) => {
  const response = await api.post('/auth/login', { username, password });
  return response.data;
};

export const register = async (username, password) => {
  const response = await api.post('/auth/register', { username, password });
  return response.data;
};

export const createFlashcard = async (flashcard) => {
  const response = await api.post('/flashcards', flashcard);
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

export const createQuiz = async (quiz) => {
  const response = await api.post('/quizzes', quiz);
  return response.data;
};

export const getQuizzes = async () => {
  const response = await api.get('/quizzes');
  return response.data;
};

export const submitQuiz = async (submission) => {
  const response = await api.post('/quizzes/submit', submission);
  return response.data;
};