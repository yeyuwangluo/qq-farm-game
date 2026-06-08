/**
 * JWT工具函数测试
 */
import { describe, it, expect } from 'vitest';
import {
  generateToken,
  verifyToken,
  decodeToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../../src/utils/jwt';

describe('JWT Utils', () => {
  const testPayload = {
    userId: 1,
    username: 'testuser',
    email: 'test@example.com',
  };

  describe('generateToken', () => {
    it('应该生成有效的JWT token', () => {
      const token = generateToken(testPayload);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });
  });

  describe('verifyToken', () => {
    it('应该验证有效的JWT token', () => {
      const token = generateToken(testPayload);
      const decoded = verifyToken(token);
      expect(decoded.userId).toBe(testPayload.userId);
      expect(decoded.username).toBe(testPayload.username);
      expect(decoded.email).toBe(testPayload.email);
      expect(decoded).toHaveProperty('iat');
      expect(decoded).toHaveProperty('exp');
    });

    it('应该拒绝无效的token', () => {
      expect(() => verifyToken('invalid.token.here')).toThrow('Invalid token');
    });
  });

  describe('decodeToken', () => {
    it('应该解析JWT token', () => {
      const token = generateToken(testPayload);
      const decoded = decodeToken(token);
      expect(decoded.userId).toBe(testPayload.userId);
      expect(decoded.username).toBe(testPayload.username);
      expect(decoded.email).toBe(testPayload.email);
      expect(decoded).toHaveProperty('iat');
      expect(decoded).toHaveProperty('exp');
    });

    it('应该返回null给无效的token', () => {
      const decoded = decodeToken('invalid.token.here');
      expect(decoded).toBeNull();
    });
  });

  describe('generateRefreshToken', () => {
    it('应该生成有效的刷新token', () => {
      const token = generateRefreshToken(1);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });
  });

  describe('verifyRefreshToken', () => {
    it('应该验证有效的刷新token', () => {
      const token = generateRefreshToken(1);
      const decoded = verifyRefreshToken(token);
      expect(decoded.userId).toBe(1);
      expect(decoded).toHaveProperty('iat');
      expect(decoded).toHaveProperty('exp');
    });

    it('应该拒绝无效的刷新token', () => {
      expect(() => verifyRefreshToken('invalid.token.here')).toThrow('Invalid refresh token');
    });
  });
});
