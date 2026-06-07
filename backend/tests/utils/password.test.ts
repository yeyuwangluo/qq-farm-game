/**
 * 密码加密工具函数测试
 */
import { describe, it, expect } from 'vitest';
import { hashPassword, comparePassword, generateSalt } from '../../src/utils/password';

describe('Password Utils', () => {
  describe('hashPassword', () => {
    it('应该加密密码', async () => {
      const password = 'test-password-123';
      const hashedPassword = await hashPassword(password);
      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(50);
    });
  });

  describe('comparePassword', () => {
    it('应该验证正确的密码', async () => {
      const password = 'test-password-123';
      const hashedPassword = await hashPassword(password);
      const isValid = await comparePassword(password, hashedPassword);
      expect(isValid).toBe(true);
    });

    it('应该拒绝错误的密码', async () => {
      const password = 'test-password-123';
      const wrongPassword = 'wrong-password';
      const hashedPassword = await hashPassword(password);
      const isValid = await comparePassword(wrongPassword, hashedPassword);
      expect(isValid).toBe(false);
    });
  });

  describe('generateSalt', () => {
    it('应该生成salt', async () => {
      const salt = await generateSalt();
      expect(salt).toBeDefined();
      expect(salt.startsWith('$2b$10$')).toBe(true);
    });

    it('应该生成不同的salt', async () => {
      const salt1 = await generateSalt();
      const salt2 = await generateSalt();
      expect(salt1).not.toBe(salt2);
    });
  });
});
