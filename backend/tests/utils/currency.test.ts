/**
 * 货币格式化工具函数测试
 */
import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatGold,
  formatVoucher,
  formatExperience,
  calculateLevel,
  getExperienceForLevel,
  getLevelProgress,
} from '../../src/utils/currency';

describe('Currency Utils', () => {
  describe('formatCurrency', () => {
    it('应该格式化货币', () => {
      expect(formatCurrency(1234.56)).toContain('1,234.56');
      expect(formatCurrency(1000000)).toContain('1,000,000.00');
    });
  });

  describe('formatGold', () => {
    it('应该格式化金币', () => {
      expect(formatGold(1234)).toBe('1,234 金币');
      expect(formatGold(1000000)).toBe('1,000,000 金币');
    });
  });

  describe('formatVoucher', () => {
    it('应该格式化点券', () => {
      expect(formatVoucher(1234)).toBe('1,234 点券');
      expect(formatVoucher(1000000)).toBe('1,000,000 点券');
    });
  });

  describe('formatExperience', () => {
    it('应该格式化经验值', () => {
      expect(formatExperience(1234)).toBe('1,234 经验');
      expect(formatExperience(1000000)).toBe('1,000,000 经验');
    });
  });

  describe('calculateLevel', () => {
    it('应该计算等级', () => {
      expect(calculateLevel(0)).toBe(1);
      expect(calculateLevel(99)).toBe(1);
      expect(calculateLevel(100)).toBe(2);
      expect(calculateLevel(220)).toBe(3);
    });
  });

  describe('getExperienceForLevel', () => {
    it('应该计算等级所需经验', () => {
      expect(getExperienceForLevel(1)).toBe(0);
      expect(getExperienceForLevel(2)).toBe(100);
      expect(getExperienceForLevel(3)).toBe(220);
    });
  });

  describe('getLevelProgress', () => {
    it('应该获取等级进度', () => {
      const progress = getLevelProgress(150, 2);
      expect(progress.current).toBe(50);
      expect(progress.required).toBe(120);
      expect(progress.percentage).toBe(41);
    });
  });
});
