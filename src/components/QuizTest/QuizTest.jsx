import React, { useState, useEffect } from 'react';
import { getQuizzes, submitQuiz } from '../../services/api';
import styles from './QuizTest.module.css';

function QuizTest() {
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);

  const fetchQuizzes = async () => {
    try {
      const response = await getQuizzes();
      setQuizzes(response.data);
      if (response.data.length > 0) setCurrentQuiz(response.data[0]);
    } catch (error) {
      console .error('Error fetching quizzes:', error);
    }
  };

  const handleSubmit = async () => {
    if (!currentQuiz || selectedOption === null) return;
    try {
      const response = await submitQuiz({
        quizId: currentQuiz.id,
        userId: 1, // Hardcoded for simplicity
        selectedOption,
      });
      setScore(score + response.data.score);
      setSelectedOption(null);
      const nextQuiz = quizzes[quizzes.indexOf(currentQuiz) + 1];
      setCurrentQuiz(nextQuiz || null);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  if (!currentQuiz) return <div className={styles.section}>No quizzes available.</div>;

  return (
    <div className={styles.section}>
      <h2>Take Quiz</h2>
      <p>Current Score: {score}</p>
      <p>{currentQuiz.question}</p>
      {JSON.parse(currentQuiz.options).map((option, index) => (
        <div key={index}>
          <input
            type="radio"
            name="option"
            checked={selectedOption === index}
            onChange={() => setSelectedOption(index)}
          />
          <label>{option}</label>
        </div>
      ))}
      <button className={styles.button} onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}

export default QuizTest;