/**
 * JWT工具函数完整测试
 */
import { describe, it, expect } from 'vitest';
import {
  generateToken,
  verifyToken,
  decodeToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../src/utils/jwt';

describe('JWT Utils - Complete Tests', () => {
  const testPayload = {
    userId: 1,
    username: 'testuser',
    email: 'test@example.com',
  };

  describe('token生成', () => {
    it('应该生成有效的JWT token', () => {
      const token = generateToken(testPayload);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    it('应该生成不同payload的token', () => {
      const token1 = generateToken({ userId: 1, username: 'user1' });
      const token2 = generateToken({ userId: 2, username: 'user2' });
      expect(token1).not.toBe(token2);
    });

    it('应该生成刷新token', () => {
      const token = generateRefreshToken(1);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });
  });

  describe('token验证', () => {
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

    it('应该拒绝空token', () => {
      expect(() => verifyToken('')).toThrow();
    });

    it('应该拒绝undefined token', () => {
      expect(() => verifyToken(undefined as any)).toThrow();
    });

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

  describe('token解析', () => {
    it('应该解析JWT token', () => {
      const token = generateToken(testPayload);
      const decoded = decodeToken(token);
      expect(decoded).not.toBeNull();
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

    it('应该返回null给空token', () => {
      const decoded = decodeToken('');
      expect(decoded).toBeNull();
    });

    it('应该返回null给undefined token', () => {
      const decoded = decodeToken(undefined as any);
      expect(decoded).toBeNull();
    });
  });

  describe('token过期', () => {
    it('应该生成短期token', () => {
      process.env.JWT_EXPIRES_IN = '1s';
      const token = generateToken(testPayload);
      expect(token).toBeDefined();
      process.env.JWT_EXPIRES_IN = '24h';
    });

    it('应该生成长期刷新token', () => {
      process.env.JWT_REFRESH_EXPIRES_IN = '30d';
      const token = generateRefreshToken(1);
      expect(token).toBeDefined();
      process.env.JWT_REFRESH_EXPIRES_IN = '7d';
    });
  });

  describe('token内容', () => {
    it('应该正确编码数字', () => {
      const token = generateToken({ userId: 12345, value: 67.89 });
      const decoded = verifyToken(token);
      expect(decoded.userId).toBe(12345);
      expect(decoded.value).toBe(67.89);
    });

    it('应该正确编码字符串', () => {
      const token = generateToken({ username: 'test-user-123', email: 'user@test.com' });
      const decoded = verifyToken(token);
      expect(decoded.username).toBe('test-user-123');
      expect(decoded.email).toBe('user@test.com');
    });

    it('应该正确编码布尔值', () => {
      const token = generateToken({ isAdmin: true, isActive: false });
      const decoded = verifyToken(token);
      expect(decoded.isAdmin).toBe(true);
      expect(decoded.isActive).toBe(false);
    });

    it('应该正确编码嵌套对象', () => {
      const token = generateToken({
        profile: {
          name: 'Test User',
          age: 25,
        },
      });
      const decoded = verifyToken(token);
      expect(decoded.profile).toBeDefined();
      expect(decoded.profile.name).toBe('Test User');
      expect(decoded.profile.age).toBe(25);
    });

    it('应该正确编码数组', () => {
      const token = generateToken({ roles: ['admin', 'user'], permissions: ['read', 'write'] });
      const decoded = verifyToken(token);
      expect(decoded.roles).toEqual(['admin', 'user']);
      expect(decoded.permissions).toEqual(['read', 'write']);
    });
  });

  describe('边界情况', () => {
    it('应该处理空payload', () => {
      const token = generateToken({} as any);
      const decoded = verifyToken(token);
      expect(decoded).toBeDefined();
    });

    it('应该处理大payload', () => {
      const largePayload = {
        data: 'x'.repeat(1000),
        items: Array.from({ length: 100 }, (_, i) => ({ id: i, value: `item${i}` })),
      };
      const token = generateToken(largePayload as any);
      const decoded = verifyToken(token);
      expect(decoded.data).toBe('x'.repeat(1000));
      expect(decoded.items).toHaveLength(100);
    });

    it('应该处理特殊字符', () => {
      const token = generateToken({
        name: '测试用户',
        email: '用户@example.com',
        special: '!@#$%^&*()',
      });
      const decoded = verifyToken(token);
      expect(decoded.name).toBe('测试用户');
      expect(decoded.email).toBe('用户@example.com');
      expect(decoded.special).toBe('!@#$%^&*()');
    });
  });

  describe('刷新token特性', () => {
    it('应该生成不同用户的刷新token', () => {
      const token1 = generateRefreshToken(1);
      const token2 = generateRefreshToken(2);
      expect(token1).not.toBe(token2);
    });

    it('应该验证刷新token的用户ID', () => {
      const userId = 999;
      const token = generateRefreshToken(userId);
      const decoded = verifyRefreshToken(token);
      expect(decoded.userId).toBe(userId);
    });
  });
});