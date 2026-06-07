/**
 * 认证Context
 */
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthContextValue, AuthProviderProps, User } from '../types/auth.types';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const isAuthenticated = !!token && !!user;

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    try {
      setError(null);
      const response = await api.post('/auth/login', { username, password });

      const { user, token } = response.data.data;

      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      navigate('/');
    } catch (error: any) {
      const message = error.response?.data?.message || '登录失败';
      setError(message);
      throw new Error(message);
    }
  };

  const register = async (username: string, email: string, password: string): Promise<void> => {
    try {
      setError(null);
      const response = await api.post('/auth/register', { username, email, password });

      const { user, token } = response.data.data;

      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      navigate('/');
    } catch (error: any) {
      const message = error.response?.data?.message || '注册失败';
      setError(message);
      throw new Error(message);
    }
  };

  const logout = (): void => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  const refreshToken = async (): Promise<void> => {
    try {
      const currentToken = localStorage.getItem('token');
      if (!currentToken) {
        return;
      }

      const response = await api.post('/auth/refresh', { token: currentToken });
      const { user, token } = response.data.data;

      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      logout();
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  const value: AuthContextValue = {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshToken,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};