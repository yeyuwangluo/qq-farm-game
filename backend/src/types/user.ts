/**
 * 用户相关类型定义
 */

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  nickname?: string;
  avatar?: string;
  phone?: string;
  status: 'active' | 'inactive' | 'banned';
  level: number;
  experience: number;
  coins: number;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreate {
  username: string;
  email: string;
  password: string;
  nickname?: string;
  phone?: string;
}

export interface UserUpdate {
  nickname?: string;
  avatar?: string;
  phone?: string;
  status?: 'active' | 'inactive' | 'banned';
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  nickname?: string;
  phone?: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}