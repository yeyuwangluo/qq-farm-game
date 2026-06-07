/**
 * MySQL2客户端测试
 */
import { describe, it, expect } from 'vitest';

describe('MySQL2 Client', () => {
  it('应该能够导入MySQL2', () => {
    expect(() => require('mysql2/promise')).not.toThrow();
  });

  it('应该能够创建连接池', () => {
    const mysql = require('mysql2/promise');
    expect(mysql.createPool).toBeDefined();
    expect(typeof mysql.createPool).toBe('function');
  });
});