import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import CreateFlashcardPage from './pages/CreateFlashcardPage';
import ReviewFlashcardPage from './pages/ReviewFlashcardPage';
import CreateQuizPage from './pages/CreateQuizPage';
import TakeQuizPage from './pages/TakeQuizPage';
import './App.css';

function App() {
  return (
    <div className="container">
      <header className="header">
        <h1>Learning App</h1>
      </header>
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={<CreateFlashcardPage />} />
          <Route path="/review-flashcard" element={<ReviewFlashcardPage />} />
          <Route path="/create-quiz" element={<CreateQuizPage />} />
          <Route path="/take-quiz" element={<TakeQuizPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;