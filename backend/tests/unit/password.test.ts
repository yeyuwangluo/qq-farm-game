/**
 * 密码工具单元测试
 */
import { describe, it, expect } from 'vitest';
import { hashPassword, comparePassword, generateSalt } from '../../src/utils/password.js';

describe('password utils', () => {
  describe('hashPassword', () => {
    it('应该成功哈希密码', async () => {
      const password = 'Password123';
      const hashed = await hashPassword(password);

      expect(hashed).toBeDefined();
      expect(hashed).not.toBe(password);
      expect(hashed.length).toBeGreaterThan(0);
    });

    it('应该为相同的密码生成不同的哈希值', async () => {
      const password = 'Password123';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });

    it('应该处理空密码', async () => {
      const password = '';
      const hashed = await hashPassword(password);

      expect(hashed).toBeDefined();
      expect(hashed.length).toBeGreaterThan(0);
    });
  });

  describe('comparePassword', () => {
    it('应该验证正确的密码', async () => {
      const password = 'Password123';
      const hashed = await hashPassword(password);
      const isValid = await comparePassword(password, hashed);

      expect(isValid).toBe(true);
    });

    it('应该拒绝错误的密码', async () => {
      const password = 'Password123';
      const hashed = await hashPassword(password);
      const isValid = await comparePassword('WrongPassword', hashed);

      expect(isValid).toBe(false);
    });

    it('应该拒绝空密码', async () => {
      const password = 'Password123';
      const hashed = await hashPassword(password);
      const isValid = await comparePassword('', hashed);

      expect(isValid).toBe(false);
    });
  });

  describe('generateSalt', () => {
    it('应该生成salt', async () => {
      const salt = await generateSalt();

      expect(salt).toBeDefined();
      expect(salt.length).toBeGreaterThan(0);
    });

    it('应该生成不同的salt', async () => {
      const salt1 = await generateSalt();
      const salt2 = await generateSalt();

      expect(salt1).not.toBe(salt2);
    });
  });
});