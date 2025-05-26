import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login, register } from '../services/api';

export const AuthContext = createContext();

// Custom hook để sử dụng AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if (token && userId) {
          // Verify token validity here if needed
          setCurrentUser({ token, userId: parseInt(userId) });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const handleLogin = async (username, password) => {
    try {
      const response = await login({ username, password });
      const { token, userId } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      setCurrentUser({ token, userId });
      toast.success('Logged in successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Invalid credentials!');
      throw error;
    }
  };

  const handleRegister = async (username, password, email, fullName) => {
    try {
      const response = await register({ username, password, email, fullName });
      const { token, userId } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      setCurrentUser({ token, userId });
      toast.success('Registered successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Username already exists!');
      throw error;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ 
      user: currentUser, 
      currentUser,
      handleLogin, 
      handleRegister, 
      logout 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};