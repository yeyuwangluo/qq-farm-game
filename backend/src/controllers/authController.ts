/**
 * 认证控制器
 */
import { Request, Response, NextFunction } from 'express';
import authService from '../services/authService.js';
import { successResponse } from '../utils/response.js';
import type { RegisterRequest, LoginRequest, RefreshTokenRequest } from '../types/user.js';

/**
 * 用户注册
 */
export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const data: RegisterRequest = req.body;
    const result = await authService.register(data);
    res.json(successResponse(result));
  } catch (error) {
    next(error);
  }
}

/**
 * 用户登录
 */
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const data: LoginRequest = req.body;
    const result = await authService.login(data);
    res.json(successResponse(result));
  } catch (error) {
    next(error);
  }
}

/**
 * 获取当前用户信息
 */
export async function getCurrentUser(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).userId;
    const user = await authService.getUserById(userId);
    res.json(successResponse(user));
  } catch (error) {
    next(error);
  }
}

/**
 * 刷新token
 */
export async function refreshToken(req: Request, res: Response, next: NextFunction) {
  try {
    const data: RefreshTokenRequest = req.body;
    const result = await authService.refreshToken(data.refreshToken);
    res.json(successResponse(result));
  } catch (error) {
    next(error);
  }
}

/**
 * 用户登出
 */
export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(successResponse({ message: '登出成功' }));
  } catch (error) {
    next(error);
  }
}