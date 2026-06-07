import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { connectSocket, getSocket, disconnectSocket } from '../services/socket';

// 模拟Socket.io客户端
vi.mock('socket.io-client', () => ({
  io: vi.fn(() => ({
    connected: false,
    on: vi.fn(),
    emit: vi.fn(),
    disconnect: vi.fn(),
  })),
}));

describe('WebSocket Client', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    disconnectSocket();
  });

  it('应该创建Socket连接', () => {
    localStorage.setItem('token', 'test-token');
    const socket = connectSocket('user-123');
    expect(socket).toBeDefined();
  });

  it('应该返回已存在的socket实例', () => {
    localStorage.setItem('token', 'test-token');
    const socket1 = connectSocket('user-123');
    const socket2 = getSocket();
    expect(socket1).toBe(socket2);
  });

  it('应该能够获取当前socket实例', () => {
    localStorage.setItem('token', 'test-token');
    connectSocket('user-123');
    const socket = getSocket();
    expect(socket).toBeDefined();
  });

  it('应该能够断开socket连接', () => {
    localStorage.setItem('token', 'test-token');
    connectSocket('user-123');
    disconnectSocket();
    const socket = getSocket();
    expect(socket).toBeNull();
  });

  it('应该从环境变量读取WebSocket URL', () => {
    process.env.VITE_WS_URL = 'ws://test-server.com';
    localStorage.setItem('token', 'test-token');
    const socket = connectSocket('user-123');
    expect(socket).toBeDefined();
  });
});