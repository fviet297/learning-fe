import React, { useState } from 'react';
import { createQuiz } from '../../services/api';
import styles from './QuizForm.module.css';

function QuizForm() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(0);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async () => {
    if (!question || options.some((opt) => !opt)) return;
    try {
      await createQuiz({
        question,
        options: JSON.stringify(options),
        correctAnswer,
      });
      setQuestion('');
      setOptions(['', '', '', '']);
      setCorrectAnswer(0);
      alert('Quiz created!');
    } catch (error) {
      console.error('Error creating quiz:', error);
    }
  };

  return (
    <div className={styles.section}>
      <h2>Create Quiz</h2>
      <input
        className={styles.input}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Enter question"
      />
      {options.map((opt, index) => (
        <input
          key={index}
          className={styles.input}
          value={opt}
          onChange={(e) => handleOptionChange(index, e.target.value)}
          placeholder={`Option ${index + 1}`}
        />
      ))}
      <select
        className={styles.input}
        value={correctAnswer}
        onChange={(e) => setCorrectAnswer(parseInt(e.target.value))}
      >
        {options.map((_, index) => (
          <option key={index} value={index}>
            Option {index + 1}
          </option>
        ))}
      </select>
      <button className={styles.button} onClick={handleSubmit}>
        Create
      </button>
    </div>
  );
}

export default QuizForm;