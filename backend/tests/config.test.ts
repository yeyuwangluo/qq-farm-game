/**
 * 数据库连接配置测试
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { config } from '../src/config/database';

describe('Database Configuration', () => {
  it('应该有正确的配置结构', () => {
    expect(config).toHaveProperty('database');
    expect(config).toHaveProperty('redis');
    expect(config).toHaveProperty('jwt');
    expect(config).toHaveProperty('cors');
  });

  it('数据库配置应该包含必要字段', () => {
    expect(config.database).toHaveProperty('host');
    expect(config.database).toHaveProperty('port');
    expect(config.database).toHaveProperty('user');
    expect(config.database).toHaveProperty('name');
  });

  it('应该从环境变量读取配置', () => {
    expect(config.port).toBeGreaterThan(0);
    expect(config.env).toBeDefined();
  });

  it('应该有默认值', () => {
    expect(config.database.host).toBe('localhost');
    expect(config.database.port).toBe(3306);
    expect(config.redis.port).toBe(6379);
  });
});