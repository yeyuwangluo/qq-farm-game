/**
 * 用户相关的TypeScript类型定义
 */

/**
 * 用户状态枚举
 */
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
  SUSPENDED = 'suspended'
}

/**
 * 用户角色枚举
 */
export enum UserRole {
  PLAYER = 'player',
  VIP = 'vip',
  MODERATOR = 'moderator',
  ADMIN = 'admin'
}

/**
 * 用户数据接口（对应数据库users表）
 */
export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  gold: number;
  experience: number;
  level: number;
  vouchers: number;
  avatar: string | null;
  bio: string | null;
  state: UserStatus;
  role: UserRole;
  last_login_at: Date | null;
  last_logout_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * 用户注册请求数据
 */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
}

/**
 * 用户登录请求数据
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * 用户登录响应数据
 */
export interface LoginResponse {
  user: UserInfo;
  token: string;
  refreshToken?: string;
}

/**
 * 用户信息（不包含敏感数据）
 */
export interface UserInfo {
  id: number;
  username: string;
  email: string;
  gold: number;
  experience: number;
  level: number;
  vouchers: number;
  avatar: string | null;
  bio: string | null;
  state: UserStatus;
  role: UserRole;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * 用户更新请求数据
 */
export interface UpdateUserRequest {
  username?: string;
  email?: string;
  avatar?: string;
  bio?: string;
}

/**
 * 用户统计数据
 */
export interface UserStats {
  totalGoldEarned: number;
  totalCropsHarvested: number;
  totalAnimalsRaised: number;
  totalFriends: number;
  totalAchievements: number;
  loginDays: number;
}

/**
 * JWT Payload
 */
export interface JWTPayload {
  userId: number;
  username: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

/**
 * 认证上下文（从JWT token中提取的信息）
 */
export interface AuthContext {
  userId: number;
  username: string;
  email: string;
  role: UserRole;
}