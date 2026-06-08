/**
 * JWT认证中间件
 */

import { Request, Response, NextFunction } from 'express';
import { AuthContext } from '../types/user.types';
import AuthService from '../services/auth.service';
import { AppError } from '../utils/response';

declare global {
  namespace Express {
    interface Request {
      auth?: AuthContext;
    }
  }
}

class AuthMiddleware {
  /**
   * 验证JWT Token
   */
  authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = this.extractToken(req);

      if (!token) {
        throw AppError.unauthorized('未提供认证Token');
      }

      const user = await AuthService.verifyTokenAndGetUser(token);

      req.auth = {
        userId: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      };

      next();
    } catch (error) {
      next(error);
    }
  };

  /**
   * 可选的JWT认证（不强制要求）
   */
  optionalAuthenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = this.extractToken(req);

      if (token) {
        const user = await AuthService.verifyTokenAndGetUser(token);

        req.auth = {
          userId: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        };
      }

      next();
    } catch (error) {
      next();
    }
  };

  /**
   * 检查用户角色
   */
  requireRole = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!req.auth) {
        throw AppError.unauthorized('未提供认证Token');
      }

      if (!roles.includes(req.auth.role)) {
        throw AppError.forbidden('权限不足');
      }

      next();
    };
  };

  /**
   * 检查是否为管理员
   */
  requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.auth) {
      throw AppError.unauthorized('未提供认证Token');
    }

    if (req.auth.role !== 'admin') {
      throw AppError.forbidden('需要管理员权限');
    }

    next();
  };

  /**
   * 检查是否为管理员或版主
   */
  requireModerator = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.auth) {
      throw AppError.unauthorized('未提供认证Token');
    }

    if (!['admin', 'moderator'].includes(req.auth.role)) {
      throw AppError.forbidden('需要管理员或版主权限');
    }

    next();
  };

  /**
   * 检查是否为VIP或更高
   */
  requireVIP = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.auth) {
      throw AppError.unauthorized('未提供认证Token');
    }

    if (!['vip', 'moderator', 'admin'].includes(req.auth.role)) {
      throw AppError.forbidden('需要VIP权限');
    }

    next();
  };

  /**
   * 从请求中提取Token
   */
  private extractToken(req: Request): string | null {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    const token = req.headers['x-auth-token'] as string | undefined;
    if (token) {
      return token;
    }

    return req.query.token as string | null || null;
  }
}

export default new AuthMiddleware();