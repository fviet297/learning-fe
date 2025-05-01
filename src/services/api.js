import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const createFlashcard = (flashcard) => axios.post(`${API_URL}/flashcards`, flashcard);
export const getRandomFlashcard = () => axios.get(`${API_URL}/flashcards/random`);
export const updateFlashcard = (id, flashcard) => axios.put(`${API_URL}/flashcards/${id}`, flashcard);
export const createQuiz = (quiz) => axios.post(`${API_URL}/quizzes`, quiz);
export const getQuizzes = () => axios.get(`${API_URL}/quizzes`);
export const submitQuiz = (submission) => axios.post(`${API_URL}/quizzes/submit`, submission);