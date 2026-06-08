/**
 * JWT认证中间件单元测试
 */
import { describe, it, expect, vi } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { authenticateToken, optionalAuth } from '../../src/middleware/auth.js';
import { generateToken } from '../../src/utils/jwt.js';

describe('authenticateToken', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    mockNext = vi.fn();
  });

  it('应该验证有效的token并调用next', () => {
    const payload = {
      userId: 1,
      username: 'testuser',
      email: 'test@example.com',
    };

    const token = generateToken(payload);
    mockReq.headers = { authorization: `Bearer ${token}` };

    authenticateToken(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockReq.userId).toBe(1);
    expect(mockReq.username).toBe('testuser');
    expect(mockReq.email).toBe('test@example.com');
  });

  it('应该拒绝缺少的token', () => {
    mockReq.headers = {};

    authenticateToken(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'NO_TOKEN',
        message: '未提供认证token',
        timestamp: expect.any(Number),
      },
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('应该拒绝无效的token', () => {
    mockReq.headers = { authorization: 'Bearer invalidtoken' };

    authenticateToken(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: '无效或过期的token',
        timestamp: expect.any(Number),
      },
    });
    expect(mockNext).not.toHaveBeenCalled();
  });
});

describe('optionalAuth', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {};
    mockRes = {};
    mockNext = vi.fn();
  });

  it('应该使用有效的token', () => {
    const payload = {
      userId: 1,
      username: 'testuser',
      email: 'test@example.com',
    };

    const token = generateToken(payload);
    mockReq.headers = { authorization: `Bearer ${token}` };

    optionalAuth(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockReq.userId).toBe(1);
    expect(mockReq.username).toBe('testuser');
    expect(mockReq.email).toBe('test@example.com');
  });

  it('应该在没有token时继续执行', () => {
    mockReq.headers = {};

    optionalAuth(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockReq.userId).toBeUndefined();
    expect(mockReq.username).toBeUndefined();
    expect(mockReq.email).toBeUndefined();
  });

  it('应该忽略无效的token并继续执行', () => {
    mockReq.headers = { authorization: 'Bearer invalidtoken' };

    optionalAuth(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockReq.userId).toBeUndefined();
    expect(mockReq.username).toBeUndefined();
    expect(mockReq.email).toBeUndefined();
  });
});