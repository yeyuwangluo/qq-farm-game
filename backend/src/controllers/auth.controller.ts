/**
 * 认证控制器
 */

import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/auth.service';
import { RegisterRequest, LoginRequest, UpdateUserRequest } from '../types/user.types';
import { successResponse } from '../utils/response';

class AuthController {
  /**
   * 用户注册
   */
  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: RegisterRequest = req.body;
      const result = await AuthService.register(data);

      successResponse(res, '注册成功', result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 用户登录
   */
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: LoginRequest = req.body;
      const result = await AuthService.login(data);

      successResponse(res, '登录成功', result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 获取当前用户信息
   */
  getCurrentUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.auth) {
        throw new Error('未认证');
      }

      const user = await AuthService.getCurrentUser(req.auth.userId);
      successResponse(res, '获取用户信息成功', user);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 刷新Token
   */
  refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token } = req.body;

      if (!token) {
        throw new Error('Refresh Token不能为空');
      }

      const result = await AuthService.refreshToken(token);
      successResponse(res, '刷新Token成功', result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 用户登出
   */
  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.auth) {
        throw new Error('未认证');
      }

      await AuthService.logout(req.auth.userId);
      successResponse(res, '登出成功');
    } catch (error) {
      next(error);
    }
  };
}

export default new AuthController();