import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navigation from './components/Navigation/Navigation';
import CreateFlashcardPage from './pages/CreateFlashcardPage';
import ReviewFlashcardPage from './pages/ReviewFlashcardPage';
import CreateQuizPage from './pages/CreateQuizPage';
import TakeQuizPage from './pages/TakeQuizPage';

function App() {
  const location = useLocation();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="bg-primary text-white p-4 rounded-lg shadow-md mb-6">
        <h1 className="text-2xl font-bold text-center">Learning App</h1>
      </header>
      <Navigation />
      <main>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <motion.div
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ duration: 0.3 }}
                >
                  <CreateFlashcardPage />
                </motion.div>
              }
            />
            <Route
              path="/review-flashcard"
              element={
                <motion.div
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ duration: 0.3 }}
                >
                  <ReviewFlashcardPage />
                </motion.div>
              }
            />
            <Route
              path="/create-quiz"
              element={
                <motion.div
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ duration: 0.3 }}
                >
                  <CreateQuizPage />
                </motion.div>
              }
            />
            <Route
              path="/take-quiz"
              element={
                <motion.div
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ duration: 0.3 }}
                >
                  <TakeQuizPage />
                </motion.div>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;