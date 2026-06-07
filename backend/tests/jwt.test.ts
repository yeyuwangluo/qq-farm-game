/**
 * JWT工具函数测试
 */
import { describe, it, expect } from 'vitest';
import jwt from 'jsonwebtoken';

describe('JWT Tools', () => {
  const secret = 'test-secret-key';

  it('应该能够生成JWT token', () => {
    const payload = { userId: 1, username: 'test' };
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3);
  });

  it('应该能够验证JWT token', () => {
    const payload = { userId: 1, username: 'test' };
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    const decoded = jwt.verify(token, secret);
    expect(decoded).toHaveProperty('userId', 1);
    expect(decoded).toHaveProperty('username', 'test');
  });

  it('应该能够解析JWT token', () => {
    const payload = { userId: 1, username: 'test' };
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    const decoded = jwt.decode(token);
    expect(decoded).toHaveProperty('userId', 1);
    expect(decoded).toHaveProperty('username', 'test');
  });

  it('应该能够处理过期的token', () => {
    const payload = { userId: 1, username: 'test' };
    const token = jwt.sign(payload, secret, { expiresIn: '0s' });
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        try {
          jwt.verify(token, secret);
          throw new Error('Should throw error for expired token');
        } catch (error: any) {
          expect(error.name).toBe('TokenExpiredError');
          resolve();
        }
      }, 1000);
    });
  });
});