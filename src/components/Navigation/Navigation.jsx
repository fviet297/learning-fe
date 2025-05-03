import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Navigation.module.css';

function Navigation() {
  return (
    <nav className={styles.nav}>
      <NavLink
        to="/"
        className={({ isActive }) => (isActive ? styles.active : styles.link)}
      >
        Create Flashcard
      </NavLink>
      <NavLink
        to="/review-flashcard"
        className={({ isActive }) => (isActive ? styles.active : styles.link)}
      >
        Review Flashcard
      </NavLink>
      <NavLink
        to="/create-quiz"
        className={({ isActive }) => (isActive ? styles.active : styles.link)}
      >
        Create Quiz
      </NavLink>
      <NavLink
        to="/take-quiz"
        className={({ isActive }) => (isActive ? styles.active : styles.link)}
      >
        Take Quiz
      </NavLink>
    </nav>
  );
}

export default Navigation;