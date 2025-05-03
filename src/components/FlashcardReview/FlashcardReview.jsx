import React, { useState, useEffect } from 'react';
import { getRandomFlashcard, updateFlashcard } from '../../services/api';
import styles from './FlashcardReview.module.css';

function FlashcardReview() {
  const [flashcard, setFlashcard] = useState(null);

  const fetchRandomFlashcard = async () => {
    try {
      const response = await getRandomFlashcard();
      setFlashcard(response.data);
    } catch (error) {
      console.error('Error fetching flashcard:', error);
    }
  };

  const handleStatusUpdate = async (status) => {
    if (!flashcard) return;
    try {
      await updateFlashcard(flashcard.id, { ...flashcard, status });
      fetchRandomFlashcard();
    } catch (error) {
      console.error('Error updating flashcard:', error);
    }
  };

  useEffect(() => {
    fetchRandomFlashcard();
  }, []);

  if (!flashcard) return <div className={styles.section}>No flashcards to review.</div>;

  return (
    <div className={styles.section}>
      <h2>Review Flashcard</h2>
      <div className={styles.flashcard}>{flashcard.content}</div>
      <button className={styles.button} onClick={() => handleStatusUpdate('LEARN')}>
        Learn Again
      </button>
      <button className={styles.button} onClick={() => handleStatusUpdate('KNOWN')}>
        Known
      </button>
    </div>
  );
}

export default FlashcardReview;