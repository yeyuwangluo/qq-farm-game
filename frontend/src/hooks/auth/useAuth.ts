/**
 * 认证相关Hooks
 */
import { useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export const useLogin = () => {
  const { login, error, clearError } = useAuth();

  const loginUser = useCallback(async (username: string, password: string) => {
    try {
      await login(username, password);
      return true;
    } catch (error) {
      return false;
    }
  }, [login]);

  return {
    loginUser,
    error,
    clearError,
  };
};

export const useRegister = () => {
  const { register, error, clearError } = useAuth();

  const registerUser = useCallback(async (username: string, email: string, password: string) => {
    try {
      await register(username, email, password);
      return true;
    } catch (error) {
      return false;
    }
  }, [register]);

  return {
    registerUser,
    error,
    clearError,
  };
};

export const useLogout = () => {
  const { logout } = useAuth();

  return {
    logout,
  };
};

export const useAuthUser = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  return {
    user,
    isAuthenticated,
    isLoading,
  };
};