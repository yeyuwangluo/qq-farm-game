/**
 * Socket.io配置测试
 */
import { describe, it, expect } from 'vitest';

describe('Socket.io Configuration', () => {
  it('应该能够导入Socket.io', () => {
    expect(() => require('socket.io')).not.toThrow();
  });

  it('应该能够导入Socket.io客户端', () => {
    expect(() => require('socket.io-client')).not.toThrow();
  });
});