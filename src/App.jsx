import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Layout from './components/Layout/Layout';
import CreateFlashcardPage from './pages/CreateFlashcardPage';
import ReviewFlashcardPage from './pages/ReviewFlashcardPage';
import CreateQuizPage from './pages/CreateQuizPage';
import TakeQuizPage from './pages/TakeQuizPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreateStudyModulePage from './pages/CreateStudyModulePage';
import EditStudyModulePage from './pages/EditStudyModulePage';
import StudyModuleListPage from './pages/StudyModuleListPage';
import StudyModuleDetails from './pages/StudyModuleDetails';
import StudyModuleReview from './pages/StudyModuleReview';
import HomePage from './pages/HomePage';

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  return (
    <AuthProvider>
      <ToastContainer />
      {!isAuthPage ? (
        <Layout>
          <AnimatePresence>
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } />
              <Route path="/register" element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              } />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <motion.div
                      initial={{ opacity: 0, x: -100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CreateFlashcardPage />
                    </motion.div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-quiz"
                element={
                  <ProtectedRoute>
                    <motion.div
                      initial={{ opacity: 0, x: -100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CreateQuizPage />
                    </motion.div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/take-quiz"
                element={
                  <ProtectedRoute>
                    <motion.div
                      initial={{ opacity: 0, x: -100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TakeQuizPage />
                    </motion.div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-study-module"
                element={
                  <ProtectedRoute>
                    <motion.div
                      initial={{ opacity: 0, x: -100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CreateStudyModulePage />
                    </motion.div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-study-module/:moduleId"
                element={
                  <ProtectedRoute>
                    <motion.div
                      initial={{ opacity: 0, x: -100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      transition={{ duration: 0.3 }}
                    >
                      <EditStudyModulePage />
                    </motion.div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/study-modules"
                element={
                  <ProtectedRoute>
                    <motion.div
                      initial={{ opacity: 0, x: -100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      transition={{ duration: 0.3 }}
                    >
                      <StudyModuleListPage />
                    </motion.div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/study-modules/:moduleId"
                element={
                  <ProtectedRoute>
                    <motion.div
                      initial={{ opacity: 0, x: -100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      transition={{ duration: 0.3 }}
                    >
                      <StudyModuleDetails />
                    </motion.div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/study-modules/:moduleId/create-flashcard"
                element={
                  <ProtectedRoute>
                    <motion.div
                      initial={{ opacity: 0, x: -100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CreateFlashcardPage />
                    </motion.div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/study-modules/:moduleId/review-flashcard"
                element={
                  <ProtectedRoute>
                    <motion.div
                      initial={{ opacity: 0, x: -100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ReviewFlashcardPage />
                    </motion.div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/study-modules/:moduleId/create-quiz"
                element={
                  <ProtectedRoute>
                    <motion.div
                      initial={{ opacity: 0, x: -100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CreateQuizPage />
                    </motion.div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/study-modules/:moduleId/take-quiz"
                element={
                  <ProtectedRoute>
                    <motion.div
                      initial={{ opacity: 0, x: -100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TakeQuizPage />
                    </motion.div>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AnimatePresence>
        </Layout>
      ) : (
        <div className="max-w-4xl mx-auto p-6">
          <main>
            <AnimatePresence>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Routes>
            </AnimatePresence>
          </main>
        </div>
      )}
    </AuthProvider>
  );
}

export default App;