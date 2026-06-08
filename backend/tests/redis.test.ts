/**
 * Redis客户端测试
 */
import { describe, it, expect } from 'vitest';

describe('Redis Client', () => {
  it('应该能够导入Redis客户端', () => {
    expect(() => require('redis')).not.toThrow();
  });

  it('应该能够创建Redis客户端', () => {
    const redis = require('redis');
    expect(redis.createClient).toBeDefined();
    expect(typeof redis.createClient).toBe('function');
  });
});