/**
 * Socket.io服务器配置测试
 */
import { describe, it, expect } from 'vitest';
import {
  createSocketServer,
  getSocketServer,
  broadcast,
  emitToRoom,
  emitToClient,
  joinRoom,
  leaveRoom,
  getRoomClients,
  getAllRooms,
  getAllClients,
  closeSocketServer,
} from '../src/config/socket';

describe('Socket.io Configuration', () => {
  describe('导出函数', () => {
    it('应该导出createSocketServer函数', () => {
      expect(createSocketServer).toBeDefined();
      expect(typeof createSocketServer).toBe('function');
    });

    it('应该导出getSocketServer函数', () => {
      expect(getSocketServer).toBeDefined();
      expect(typeof getSocketServer).toBe('function');
    });

    it('应该导出broadcast函数', () => {
      expect(broadcast).toBeDefined();
      expect(typeof broadcast).toBe('function');
    });

    it('应该导出emitToRoom函数', () => {
      expect(emitToRoom).toBeDefined();
      expect(typeof emitToRoom).toBe('function');
    });

    it('应该导出emitToClient函数', () => {
      expect(emitToClient).toBeDefined();
      expect(typeof emitToClient).toBe('function');
    });

    it('应该导出joinRoom函数', () => {
      expect(joinRoom).toBeDefined();
      expect(typeof joinRoom).toBe('function');
    });

    it('应该导出leaveRoom函数', () => {
      expect(leaveRoom).toBeDefined();
      expect(typeof leaveRoom).toBe('function');
    });

    it('应该导出getRoomClients函数', () => {
      expect(getRoomClients).toBeDefined();
      expect(typeof getRoomClients).toBe('function');
    });

    it('应该导出getAllRooms函数', () => {
      expect(getAllRooms).toBeDefined();
      expect(typeof getAllRooms).toBe('function');
    });

    it('应该导出getAllClients函数', () => {
      expect(getAllClients).toBeDefined();
      expect(typeof getAllClients).toBe('function');
    });

    it('应该导出closeSocketServer函数', () => {
      expect(closeSocketServer).toBeDefined();
      expect(typeof closeSocketServer).toBe('function');
    });
  });
});