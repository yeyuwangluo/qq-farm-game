/**
 * 认证Context类型定义
 */
import { ReactNode } from 'react';

export interface User {
  id: number;
  username: string;
  email: string;
  gold: number;
  experience: number;
  level: number;
  vouchers: number;
  avatar: string | null;
  bio: string | null;
  state: string;
  role: string;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextValue extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  clearError: () => void;
}

export type AuthProviderProps = {
  children: ReactNode;
};