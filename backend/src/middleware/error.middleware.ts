/**
 * 错误处理中间件
 */

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/response';

class ErrorHandler {
  /**
   * 处理404错误
   */
  notFound = (req: Request, res: Response, next: NextFunction): void => {
    const error = AppError.notFound(`Route ${req.originalUrl} not found`);
    next(error);
  };

  /**
   * 全局错误处理器
   */
  errorHandler = (error: Error | AppError, req: Request, res: Response, next: NextFunction): void => {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors,
      });
    } else {
      console.error('Unexpected error:', error);
      res.status(500).json({
        success: false,
        message: '服务器内部错误',
        errors: process.env.NODE_ENV === 'development' ? [error.message] : undefined,
      });
    }
  };
}

export default new ErrorHandler();