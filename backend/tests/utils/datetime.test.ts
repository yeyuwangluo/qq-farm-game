/**
 * 日期时间工具函数测试
 */
import { describe, it, expect } from 'vitest';
import {
  formatDateTime,
  formatDate,
  getCurrentTimestamp,
  getCurrentTimestampMs,
  isExpired,
  getExpirationTimestamp,
  getDaysDiff,
  getStartOfDay,
  getEndOfDay,
} from '../../src/utils/datetime';

describe('DateTime Utils', () => {
  describe('formatDateTime', () => {
    it('应该格式化日期时间', () => {
      const date = new Date('2024-01-01T12:30:45Z');
      const formatted = formatDateTime(date);
      expect(formatted).toMatch(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/);
    });
  });

  describe('formatDate', () => {
    it('应该格式化日期', () => {
      const date = new Date('2024-01-01T12:30:45Z');
      const formatted = formatDate(date);
      expect(formatted).toBe('2024-01-01');
    });
  });

  describe('getCurrentTimestamp', () => {
    it('应该返回当前时间戳（秒）', () => {
      const timestamp = getCurrentTimestamp();
      expect(timestamp).toBeGreaterThan(0);
      expect(timestamp).toBeLessThan(Date.now() / 1000 + 10);
    });
  });

  describe('getCurrentTimestampMs', () => {
    it('应该返回当前时间戳（毫秒）', () => {
      const timestamp = getCurrentTimestampMs();
      expect(timestamp).toBeGreaterThan(0);
      expect(timestamp).toBeLessThan(Date.now() + 10);
    });
  });

  describe('isExpired', () => {
    it('应该判断时间是否过期', () => {
      const expiredTimestamp = getCurrentTimestamp() - 100;
      const futureTimestamp = getCurrentTimestamp() + 100;
      expect(isExpired(expiredTimestamp)).toBe(true);
      expect(isExpired(futureTimestamp)).toBe(false);
    });
  });

  describe('getExpirationTimestamp', () => {
    it('应该计算过期时间戳', () => {
      const timestamp = getCurrentTimestamp();
      const expiration = getExpirationTimestamp(60);
      expect(expiration).toBe(timestamp + 60);
    });
  });

  describe('getDaysDiff', () => {
    it('应该计算日期差', () => {
      const date1 = new Date('2024-01-01');
      const date2 = new Date('2024-01-02');
      const diff = getDaysDiff(date1, date2);
      expect(diff).toBe(1);
    });
  });

  describe('getStartOfDay', () => {
    it('应该获取日期的开始时间', () => {
      const date = new Date('2024-01-01T12:30:45');
      const startOfDay = getStartOfDay(date);
      expect(startOfDay.getHours()).toBe(0);
      expect(startOfDay.getMinutes()).toBe(0);
      expect(startOfDay.getSeconds()).toBe(0);
    });
  });

  describe('getEndOfDay', () => {
    it('应该获取日期的结束时间', () => {
      const date = new Date('2024-01-01T12:30:45');
      const endOfDay = getEndOfDay(date);
      expect(endOfDay.getHours()).toBe(23);
      expect(endOfDay.getMinutes()).toBe(59);
      expect(endOfDay.getSeconds()).toBe(59);
    });
  });
});
