/**
 * JWT认证中间件
 */
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      username?: string;
      email?: string;
    }
  }
}

/**
 * JWT认证中间件
 */
export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'NO_TOKEN',
        message: '未提供认证token',
        timestamp: Date.now(),
      },
    });
  }

  try {
    const payload = verifyToken(token);
    req.userId = payload.userId;
    req.username = payload.username;
    req.email = payload.email;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: '无效或过期的token',
        timestamp: Date.now(),
      },
    });
  }
}

/**
 * 可选认证中间件（不强制要求token）
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next();
  }

  try {
    const payload = verifyToken(token);
    req.userId = payload.userId;
    req.username = payload.username;
    req.email = payload.email;
  } catch (error) {
  }

  next();
}