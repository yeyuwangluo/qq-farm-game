/**
 * Socket.io服务器配置
 */
import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import config from './index.js';

let io: SocketIOServer | null = null;

/**
 * 创建Socket.io服务器
 */
export function createSocketServer(httpServer: HTTPServer): SocketIOServer {
  if (io) {
    return io;
  }

  io = new SocketIOServer(httpServer, {
    cors: {
      origin: config.socket.corsOrigin,
      credentials: true,
    },
    path: config.socket.path,
    transports: ['websocket', 'polling'],
    allowUpgrades: true,
    pingTimeout: 60000,
    pingInterval: 25000,
    maxHttpBufferSize: 1e6,
  });

  // 连接管理
  io.on('connection', socket => {
    console.log(`Client connected: ${socket.id}`);

    // 监听断开连接
    socket.on('disconnect', reason => {
      console.log(`Client disconnected: ${socket.id}, reason: ${reason}`);
    });

    // 监听错误
    socket.on('error', error => {
      console.error(`Socket error for ${socket.id}:`, error);
    });
  });

  return io;
}

/**
 * 获取Socket.io服务器实例
 */
export function getSocketServer(): SocketIOServer | null {
  return io;
}

/**
 * 广播消息到所有客户端
 */
export function broadcast(event: string, data: any): void {
  if (io) {
    io.emit(event, data);
  }
}

/**
 * 向指定房间发送消息
 */
export function emitToRoom(room: string, event: string, data: any): void {
  if (io) {
    io.to(room).emit(event, data);
  }
}

/**
 * 向指定客户端发送消息
 */
export function emitToClient(socketId: string, event: string, data: any): void {
  if (io) {
    io.to(socketId).emit(event, data);
  }
}

/**
 * 将客户端加入房间
 */
export function joinRoom(socketId: string, room: string): void {
  if (io) {
    io.to(socketId).socketsJoin(room);
  }
}

/**
 * 将客户端移出房间
 */
export function leaveRoom(socketId: string, room: string): void {
  if (io) {
    io.to(socketId).socketsLeave(room);
  }
}

/**
 * 获取房间内所有客户端ID
 */
export function getRoomClients(room: string): string[] {
  if (!io) {
    return [];
  }
  const sockets = io.in(room).fetchSockets();
  return Array.from(sockets).map((socket: any) => socket.id);
}

/**
 * 获取所有房间
 */
export function getAllRooms(): string[] {
  if (!io) {
    return [];
  }
  return Array.from(io.sockets.adapter.rooms.keys());
}

/**
 * 获取所有连接的客户端ID
 */
export function getAllClients(): string[] {
  if (!io) {
    return [];
  }
  return Array.from(io.sockets.sockets.keys());
}

/**
 * 关闭Socket.io服务器
 */
export function closeSocketServer(): void {
  if (io) {
    io.close();
    io = null;
  }
}
