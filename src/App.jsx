import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
// import { ThemeProvider } from './context/ThemeContext';

import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Layout from './components/Layout/Layout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreateFlashcardPage from './pages/CreateFlashcardPage';
import ReviewFlashcardPage from './pages/ReviewFlashcardPage';
import CreateQuizPage from './pages/CreateQuizPage';
import TakeQuizPage from './pages/TakeQuizPage';
import CreateStudyModulePage from './pages/CreateStudyModulePage';
import EditStudyModulePage from './pages/EditStudyModulePage';
import StudyModuleDetails from './pages/StudyModuleDetails';
import LearnClockPage from './pages/LearnClockPage';

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <AuthProvider>

      <div className="grain-overlay" />
      <ToastContainer position="top-right" autoClose={3000} />

      {isAuthPage ? (
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          </Routes>
        </AnimatePresence>
      ) : (
        <Layout>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />

              {/* Learn Clock */}
              <Route path="/learn-clock" element={<ProtectedRoute><LearnClockPage /></ProtectedRoute>} />

              {/* Module Management */}
              <Route path="/create-study-module" element={<ProtectedRoute><CreateStudyModulePage /></ProtectedRoute>} />
              <Route path="/edit-study-module/:moduleId" element={<ProtectedRoute><EditStudyModulePage /></ProtectedRoute>} />
              <Route path="/study-modules/:moduleId" element={<ProtectedRoute><StudyModuleDetails /></ProtectedRoute>} />

              {/* Flashcard Management */}
              <Route path="/study-modules/:moduleId/create-flashcard" element={<ProtectedRoute><CreateFlashcardPage /></ProtectedRoute>} />
              <Route path="/study-modules/:moduleId/review-flashcard" element={<ProtectedRoute><ReviewFlashcardPage /></ProtectedRoute>} />

              {/* Quiz Management */}
              <Route path="/study-modules/:moduleId/create-quiz" element={<ProtectedRoute><CreateQuizPage /></ProtectedRoute>} />
              <Route path="/study-modules/:moduleId/take-quiz" element={<ProtectedRoute><TakeQuizPage /></ProtectedRoute>} />

              {/* Fallback */}
              <Route path="*" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            </Routes>
          </AnimatePresence>
        </Layout>
      )}

    </AuthProvider>
  );
}

export default App;