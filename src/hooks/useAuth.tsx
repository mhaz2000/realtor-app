import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth';
import type { LoginRequest } from '../types/auth';

export const useAuth = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const login = async (credentials: LoginRequest) => {
    setIsPending(true);
    setError(null);

    try {
      const token = await loginUser(credentials);
      localStorage.setItem('token', token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsPending(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isAuthenticated = Boolean(localStorage.getItem('token'));

  return {
    login,
    logout,
    isAuthenticated,
    isPending,
    error,
  };
};
