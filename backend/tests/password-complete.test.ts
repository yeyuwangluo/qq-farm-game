/**
 * 密码加密工具函数完整测试
 */
import { describe, it, expect } from 'vitest';
import { hashPassword, comparePassword, generateSalt } from '../src/utils/password';

describe('Password Utils - Complete Tests', () => {
  describe('密码加密', () => {
    it('应该加密简单密码', async () => {
      const password = 'simple123';
      const hashedPassword = await hashPassword(password);
      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(50);
    });

    it('应该加密复杂密码', async () => {
      const password = 'Complex!@#Passw0rd';
      const hashedPassword = await hashPassword(password);
      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
    });

    it('应该加密长密码', async () => {
      const password = 'a'.repeat(100);
      const hashedPassword = await hashPassword(password);
      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
    });

    it('应该加密包含特殊字符的密码', async () => {
      const password = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      const hashedPassword = await hashPassword(password);
      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
    });

    it('应该加密包含Unicode字符的密码', async () => {
      const password = '密码123测试!@#';
      const hashedPassword = await hashPassword(password);
      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
    });

    it('应该生成唯一的hash', async () => {
      const password = 'test-password';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('密码验证', () => {
    it('应该验证正确的密码', async () => {
      const password = 'correct-password';
      const hashedPassword = await hashPassword(password);
      const isValid = await comparePassword(password, hashedPassword);
      expect(isValid).toBe(true);
    });

    it('应该拒绝错误的密码', async () => {
      const password = 'correct-password';
      const wrongPassword = 'wrong-password';
      const hashedPassword = await hashPassword(password);
      const isValid = await comparePassword(wrongPassword, hashedPassword);
      expect(isValid).toBe(false);
    });

    it('应该拒绝相似的密码', async () => {
      const password = 'Password123';
      const similarPassword = 'password123';
      const hashedPassword = await hashPassword(password);
      const isValid = await comparePassword(similarPassword, hashedPassword);
      expect(isValid).toBe(false);
    });

    it('应该拒绝部分匹配的密码', async () => {
      const password = 'mySecretPassword';
      const partialPassword = 'mySecret';
      const hashedPassword = await hashPassword(password);
      const isValid = await comparePassword(partialPassword, hashedPassword);
      expect(isValid).toBe(false);
    });

    it('应该处理空密码', async () => {
      const password = '';
      const hashedPassword = await hashPassword(password);
      const isValid = await comparePassword('', hashedPassword);
      expect(isValid).toBe(true);
    });

    it('应该拒绝空密码给非空hash', async () => {
      const password = 'test-password';
      const hashedPassword = await hashPassword(password);
      const isValid = await comparePassword('', hashedPassword);
      expect(isValid).toBe(false);
    });
  });

  describe('Salt生成', () => {
    it('应该生成salt', async () => {
      const salt = await generateSalt();
      expect(salt).toBeDefined();
      expect(salt.startsWith('$2b$10$')).toBe(true);
      expect(salt.length).toBeGreaterThan(20);
    });

    it('应该生成不同的salt', async () => {
      const salt1 = await generateSalt();
      const salt2 = await generateSalt();
      expect(salt1).not.toBe(salt2);
    });

    it('应该生成有效的Bcrypt salt', async () => {
      const salt = await generateSalt();
      expect(salt).toMatch(/^\$2[aby]\$\d{2}\$/);
    });

    it('应该使用默认salt rounds (10)', async () => {
      const salt = await generateSalt();
      expect(salt).toContain('$10$');
    });
  });

  describe('密码强度', () => {
    it('应该加密弱密码', async () => {
      const passwords = ['123', 'abc', 'password', '123456'];
      for (const password of passwords) {
        const hashedPassword = await hashPassword(password);
        expect(hashedPassword).toBeDefined();
        const isValid = await comparePassword(password, hashedPassword);
        expect(isValid).toBe(true);
      }
    });

    it('应该加密中等强度密码', async () => {
      const passwords = ['Password123', 'MyP@ssw0rd', 'Secure123'];
      for (const password of passwords) {
        const hashedPassword = await hashPassword(password);
        expect(hashedPassword).toBeDefined();
        const isValid = await comparePassword(password, hashedPassword);
        expect(isValid).toBe(true);
      }
    });

    it('应该加密强密码', async () => {
      const passwords = ['Str0ng!P@ssw0rd#123', 'C0mpl3x!@#$%^&*()Pass', 'Sup3rS3cur3!2024'];
      for (const password of passwords) {
        const hashedPassword = await hashPassword(password);
        expect(hashedPassword).toBeDefined();
        const isValid = await comparePassword(password, hashedPassword);
        expect(isValid).toBe(true);
      }
    });
  });

  describe('边界情况', () => {
    it('应该处理超长密码', async () => {
      const password = 'a'.repeat(1000);
      const hashedPassword = await hashPassword(password);
      expect(hashedPassword).toBeDefined();
      const isValid = await comparePassword(password, hashedPassword);
      expect(isValid).toBe(true);
    });

    it('应该处理密码中的空格', async () => {
      const password = 'my password with spaces';
      const hashedPassword = await hashPassword(password);
      expect(hashedPassword).toBeDefined();
      const isValid = await comparePassword(password, hashedPassword);
      expect(isValid).toBe(true);
    });

    it('应该处理密码中的换行符', async () => {
      const password = 'password\nwith\nnewlines';
      const hashedPassword = await hashPassword(password);
      expect(hashedPassword).toBeDefined();
      const isValid = await comparePassword(password, hashedPassword);
      expect(isValid).toBe(true);
    });

    it('应该处理密码中的制表符', async () => {
      const password = 'password\twith\ttabs';
      const hashedPassword = await hashPassword(password);
      expect(hashedPassword).toBeDefined();
      const isValid = await comparePassword(password, hashedPassword);
      expect(isValid).toBe(true);
    });
  });

  describe('性能测试', () => {
    it('应该在合理时间内加密密码', async () => {
      const start = Date.now();
      await hashPassword('test-password');
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(1000); // 应该在1秒内完成
    });

    it('应该在合理时间内验证密码', async () => {
      const password = 'test-password';
      const hashedPassword = await hashPassword(password);
      const start = Date.now();
      await comparePassword(password, hashedPassword);
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(500); // 应该在500ms内完成
    });

    it('应该处理批量密码加密', async () => {
      const passwords = Array.from({ length: 10 }, (_, i) => `password${i}`);
      const start = Date.now();
      const hashes = await Promise.all(passwords.map((p) => hashPassword(p)));
      const duration = Date.now() - start;
      expect(hashes).toHaveLength(10);
      expect(duration).toBeLessThan(5000); // 应该在5秒内完成
    });
  });

  describe('错误处理', () => {
    it('应该拒绝无效的hash', async () => {
      const password = 'test-password';
      const invalidHash = 'invalid_hash_value';
      await expect(comparePassword(password, invalidHash)).resolves.toBe(false);
    });

    it('应该拒绝空的hash', async () => {
      const password = 'test-password';
      await expect(comparePassword(password, '')).resolves.toBe(false);
    });

    it('应该抛出错误给undefined的hash', async () => {
      const password = 'test-password';
      await expect(comparePassword(password, undefined as any)).rejects.toThrow();
    });
  });

  describe('密码一致性', () => {
    it('应该多次验证相同的密码', async () => {
      const password = 'consistent-password';
      const hashedPassword = await hashPassword(password);

      const results = await Promise.all([
        comparePassword(password, hashedPassword),
        comparePassword(password, hashedPassword),
        comparePassword(password, hashedPassword),
      ]);

      expect(results).toEqual([true, true, true]);
    });

    it('应该多次拒绝错误的密码', async () => {
      const password = 'correct-password';
      const wrongPassword = 'wrong-password';
      const hashedPassword = await hashPassword(password);

      const results = await Promise.all([
        comparePassword(wrongPassword, hashedPassword),
        comparePassword(wrongPassword, hashedPassword),
        comparePassword(wrongPassword, hashedPassword),
      ]);

      expect(results).toEqual([false, false, false]);
    });
  });
});