import React from 'react';
import FlashcardForm from '../FlashcardForm/FlashcardForm';
import FlashcardReview from '../FlashcardReview/FlashcardReview';
import QuizForm from '../QuizForm/QuizForm';
import QuizTest from '../QuizTest/QuizTest';
import './App.css';

function App() {
  return (
    <div className="container">
      <header className="header">
        <h1>Learning App</h1>
      </header>
      <main>
        <FlashcardForm />
        <FlashcardReview />
        <QuizForm />
        <QuizTest />
      </main>
    </div>
  );
}

export default App;