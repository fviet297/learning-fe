import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login, register } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (token && userId) {
      setUser({ token, userId: parseInt(userId) });
    }
  }, []);

  const handleLogin = async (username, password) => {
    try {
      const response = await login({ username, password });
      const { token, userId } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      setUser({ token, userId });
      toast.success('Logged in successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Invalid credentials!');
    }
  };

  const handleRegister = async (username, password) => {
    try {
      const response = await register({ username, password });
      const { token, userId } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      setUser({ token, userId });
      toast.success('Registered successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Username already exists!');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUser(null);
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, handleLogin, handleRegister, logout }}>
      {children}
    </AuthContext.Provider>
  );
};