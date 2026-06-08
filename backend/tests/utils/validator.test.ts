/**
 * 验证工具函数测试
 */
import { describe, it, expect } from 'vitest';
import {
  isValidEmail,
  isValidPhoneNumber,
  isValidUsername,
  validatePassword,
  isValidIP,
  isValidURL,
  isInRange,
} from '../../src/utils/validator';

describe('Validator Utils', () => {
  describe('isValidEmail', () => {
    it('应该验证有效的邮箱', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name+tag@example.co.uk')).toBe(true);
    });

    it('应该拒绝无效的邮箱', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
    });
  });

  describe('isValidPhoneNumber', () => {
    it('应该验证有效的手机号', () => {
      expect(isValidPhoneNumber('13800138000')).toBe(true);
      expect(isValidPhoneNumber('18612345678')).toBe(true);
    });

    it('应该拒绝无效的手机号', () => {
      expect(isValidPhoneNumber('12345678901')).toBe(false);
      expect(isValidPhoneNumber('1380013800')).toBe(false);
      expect(isValidPhoneNumber('abc12345678')).toBe(false);
    });
  });

  describe('isValidUsername', () => {
    it('应该验证有效的用户名', () => {
      expect(isValidUsername('user123')).toBe(true);
      expect(isValidUsername('test_user')).toBe(true);
      expect(isValidUsername('ABC123')).toBe(true);
    });

    it('应该拒绝无效的用户名', () => {
      expect(isValidUsername('ab')).toBe(false);
      expect(isValidUsername('user-name')).toBe(false);
      expect(isValidUsername('user@name')).toBe(false);
      expect(isValidUsername('a'.repeat(21))).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('应该验证密码强度', () => {
      const weakResult = validatePassword('123456');
      const mediumResult = validatePassword('password123');
      const strongResult = validatePassword('Password@123');

      expect(weakResult.isValid).toBe(true);
      expect(weakResult.strength).toBe('weak');
      
      expect(mediumResult.isValid).toBe(true);
      expect(mediumResult.strength).toBe('medium');
      
      expect(strongResult.isValid).toBe(true);
      expect(strongResult.strength).toBe('strong');
    });

    it('应该拒绝过短的密码', () => {
      const result = validatePassword('12345');
      expect(result.isValid).toBe(false);
    });
  });

  describe('isValidIP', () => {
    it('应该验证有效的IP地址', () => {
      expect(isValidIP('192.168.1.1')).toBe(true);
      expect(isValidIP('127.0.0.1')).toBe(true);
    });

    it('应该拒绝无效的IP地址', () => {
      expect(isValidIP('256.1.1.1')).toBe(false);
      expect(isValidIP('192.168.1')).toBe(false);
    });
  });

  describe('isValidURL', () => {
    it('应该验证有效的URL', () => {
      expect(isValidURL('https://example.com')).toBe(true);
      expect(isValidURL('http://localhost:3000')).toBe(true);
    });

    it('应该拒绝无效的URL', () => {
      expect(isValidURL('not-a-url')).toBe(false);
      expect(isValidURL('://example.com')).toBe(false);
    });
  });

  describe('isInRange', () => {
    it('应该验证数字范围', () => {
      expect(isInRange(5, 1, 10)).toBe(true);
      expect(isInRange(1, 1, 10)).toBe(true);
      expect(isInRange(10, 1, 10)).toBe(true);
      expect(isInRange(0, 1, 10)).toBe(false);
      expect(isInRange(11, 1, 10)).toBe(false);
    });
  });
});
