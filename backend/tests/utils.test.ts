/**
 * 工具函数测试
 */
import { describe, it, expect } from 'vitest';

describe('Utility Functions', () => {
  describe('格式化函数', () => {
    it('应该能够格式化货币', () => {
      const amount = 1234.56;
      const formatted = new Intl.NumberFormat('zh-CN', {
        style: 'currency',
        currency: 'CNY',
      }).format(amount);
      expect(formatted).toContain('1,234.56');
    });

    it('应该能够格式化时间', () => {
      const date = new Date('2024-01-01T00:00:00Z');
      const formatted = new Intl.DateTimeFormat('zh-CN').format(date);
      expect(formatted).toBeTruthy();
    });
  });

  describe('验证函数', () => {
    it('应该能够验证邮箱格式', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(emailRegex.test('test@example.com')).toBe(true);
      expect(emailRegex.test('invalid-email')).toBe(false);
    });

    it('应该能够验证手机号格式', () => {
      const phoneRegex = /^1[3-9]\d{9}$/;
      expect(phoneRegex.test('13800138000')).toBe(true);
      expect(phoneRegex.test('12345678901')).toBe(false);
    });
  });

  describe('加密函数', () => {
    it('应该能够生成随机字符串', () => {
      const generateId = () => Math.random().toString(36).substr(2, 9);
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
      expect(id1.length).toBeGreaterThan(0);
    });
  });
});