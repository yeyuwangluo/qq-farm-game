/**
 * Redis配置测试
 */
import { describe, it, expect } from 'vitest';
import {
  createRedisClient,
  getRedisClient,
  set,
  get,
  del,
  exists,
  expire,
  ttl,
  hset,
  hget,
  hgetall,
  hdel,
  lpush,
  rpush,
  lpop,
  rpop,
  llen,
  lrange,
  sadd,
  srem,
  sismember,
  smembers,
  zadd,
  zrem,
  zscore,
  zrank,
  zrange,
  closeRedis,
} from '../src/config/redis';

describe('Redis Configuration', () => {
  describe('导出函数', () => {
    it('应该导出createRedisClient函数', () => {
      expect(createRedisClient).toBeDefined();
      expect(typeof createRedisClient).toBe('function');
    });

    it('应该导出getRedisClient函数', () => {
      expect(getRedisClient).toBeDefined();
      expect(typeof getRedisClient).toBe('function');
    });

    it('应该导出set函数', () => {
      expect(set).toBeDefined();
      expect(typeof set).toBe('function');
    });

    it('应该导出get函数', () => {
      expect(get).toBeDefined();
      expect(typeof get).toBe('function');
    });

    it('应该导出del函数', () => {
      expect(del).toBeDefined();
      expect(typeof del).toBe('function');
    });

    it('应该导出exists函数', () => {
      expect(exists).toBeDefined();
      expect(typeof exists).toBe('function');
    });

    it('应该导出expire函数', () => {
      expect(expire).toBeDefined();
      expect(typeof expire).toBe('function');
    });

    it('应该导出ttl函数', () => {
      expect(ttl).toBeDefined();
      expect(typeof ttl).toBe('function');
    });

    it('应该导出hset函数', () => {
      expect(hset).toBeDefined();
      expect(typeof hset).toBe('function');
    });

    it('应该导出hget函数', () => {
      expect(hget).toBeDefined();
      expect(typeof hget).toBe('function');
    });

    it('应该导出hgetall函数', () => {
      expect(hgetall).toBeDefined();
      expect(typeof hgetall).toBe('function');
    });

    it('应该导出hdel函数', () => {
      expect(hdel).toBeDefined();
      expect(typeof hdel).toBe('function');
    });

    it('应该导出lpush函数', () => {
      expect(lpush).toBeDefined();
      expect(typeof lpush).toBe('function');
    });

    it('应该导出rpush函数', () => {
      expect(rpush).toBeDefined();
      expect(typeof rpush).toBe('function');
    });

    it('应该导出lpop函数', () => {
      expect(lpop).toBeDefined();
      expect(typeof lpop).toBe('function');
    });

    it('应该导出rpop函数', () => {
      expect(rpop).toBeDefined();
      expect(typeof rpop).toBe('function');
    });

    it('应该导出llen函数', () => {
      expect(llen).toBeDefined();
      expect(typeof llen).toBe('function');
    });

    it('应该导出lrange函数', () => {
      expect(lrange).toBeDefined();
      expect(typeof lrange).toBe('function');
    });

    it('应该导出sadd函数', () => {
      expect(sadd).toBeDefined();
      expect(typeof sadd).toBe('function');
    });

    it('应该导出srem函数', () => {
      expect(srem).toBeDefined();
      expect(typeof srem).toBe('function');
    });

    it('应该导出sismember函数', () => {
      expect(sismember).toBeDefined();
      expect(typeof sismember).toBe('function');
    });

    it('应该导出smembers函数', () => {
      expect(smembers).toBeDefined();
      expect(typeof smembers).toBe('function');
    });

    it('应该导出zadd函数', () => {
      expect(zadd).toBeDefined();
      expect(typeof zadd).toBe('function');
    });

    it('应该导出zrem函数', () => {
      expect(zrem).toBeDefined();
      expect(typeof zrem).toBe('function');
    });

    it('应该导出zscore函数', () => {
      expect(zscore).toBeDefined();
      expect(typeof zscore).toBe('function');
    });

    it('应该导出zrank函数', () => {
      expect(zrank).toBeDefined();
      expect(typeof zrank).toBe('function');
    });

    it('应该导出zrange函数', () => {
      expect(zrange).toBeDefined();
      expect(typeof zrange).toBe('function');
    });

    it('应该导出closeRedis函数', () => {
      expect(closeRedis).toBeDefined();
      expect(typeof closeRedis).toBe('function');
    });
  });
});