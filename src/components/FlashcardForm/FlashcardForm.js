import React, { useState } from 'react';
import { createFlashcard } from '../../services/api';
import styles from './FlashcardForm.module.css';

function FlashcardForm() {
  const [content, setContent] = useState('');

  const handleSubmit = async () => {
    if (!content) return;
    try {
      await createFlashcard({ content, status: 'LEARN' });
      setContent('');
      alert('Flashcard created!');
    } catch (error) {
      console.error('Error creating flashcard:', error);
    }
  };

  return (
    <div className={styles.section}>
      <h2>Create Flashcard</h2>
      <input
        className={styles.input}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter flashcard content"
      />
      <button className={styles.button} onClick={handleSubmit}>
        Create
      </button>
    </div>
  );
}

export default FlashcardForm;