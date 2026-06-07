/**
 * Socket.io服务器配置
 */
import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import config from './index.js';
import { verifyToken } from '../utils/jwt';

let io: SocketIOServer | null = null;
const userSockets = new Map<number, Set<string>>();

interface AuthenticatedSocket extends Socket {
  userId?: number;
}

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

  // 认证中间件
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = verifyToken(token);

      if (!decoded || !decoded.userId) {
        return next(new Error('Authentication error: Invalid token'));
      }

      socket.userId = decoded.userId;
      next();
    } catch (error: any) {
      next(new Error(`Authentication error: ${error.message}`));
    }
  });

  // 连接管理
  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`Client connected: ${socket.id}, userId: ${socket.userId}`);

    if (socket.userId) {
      // 将用户加入个人房间
      socket.join(`user_${socket.userId}`);

      // 记录用户的socket连接
      if (!userSockets.has(socket.userId)) {
        userSockets.set(socket.userId, new Set());
      }
      userSockets.get(socket.userId)!.add(socket.id);

      // 发送连接成功确认
      socket.emit('connected', {
        socketId: socket.id,
        userId: socket.userId,
        timestamp: new Date().toISOString(),
      });
    }

    // 监听断开连接
    socket.on('disconnect', (reason) => {
      console.log(`Client disconnected: ${socket.id}, userId: ${socket.userId}, reason: ${reason}`);

      if (socket.userId) {
        const sockets = userSockets.get(socket.userId);
        if (sockets) {
          sockets.delete(socket.id);

          // 如果用户没有其他连接，清理记录
          if (sockets.size === 0) {
            userSockets.delete(socket.userId);
          }
        }
      }
    });

    // 监听错误
    socket.on('error', (error) => {
      console.error(`Socket error for ${socket.id}:`, error);
    });

    // 心跳检测
    socket.on('ping', () => {
      socket.emit('pong', {
        timestamp: new Date().toISOString(),
      });
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
 * 向指定用户发送通知
 */
export function notifyUser(userId: number, notification: {
  id?: number;
  type: string;
  title: string;
  message: string;
  data?: any;
  is_read?: boolean;
  created_at?: string;
}): void {
  if (!io || !userId) return;

  const room = `user_${userId}`;
  io.to(room).emit('notification', {
    ...notification,
    id: notification.id || Date.now(),
    is_read: notification.is_read || false,
    created_at: notification.created_at || new Date().toISOString(),
  });
}

/**
 * 发送作物成熟通知
 */
export function notifyCropReady(userId: number, data: {
  crop_id: number;
  crop_name: string;
  plot_id: number;
}): void {
  if (!io || !userId) return;

  notifyUser(userId, {
    type: 'crop_ready',
    title: '作物成熟',
    message: `${data.crop_name} 已经成熟，快去收获吧！`,
    data,
  });

  io.to(`user_${userId}`).emit('crop_ready', {
    ...data,
    timestamp: new Date().toISOString(),
  });
}

/**
 * 发送动物产品就绪通知
 */
export function notifyAnimalProductReady(userId: number, data: {
  animal_id: number;
  animal_name: string;
  product_name: string;
  pen_id: number;
}): void {
  if (!io || !userId) return;

  notifyUser(userId, {
    type: 'animal_product_ready',
    title: '产品就绪',
    message: `${data.animal_name} 的 ${data.product_name} 已经准备好收集了！`,
    data,
  });

  io.to(`user_${userId}`).emit('animal_product_ready', {
    ...data,
    timestamp: new Date().toISOString(),
  });
}

/**
 * 发送好友来访通知
 */
export function notifyFriendVisit(userId: number, data: {
  visitor_id: number;
  visitor_name: string;
  visit_time: string;
}): void {
  if (!io || !userId) return;

  notifyUser(userId, {
    type: 'friend_visit',
    title: '好友来访',
    message: `${data.visitor_name} 来访问你的农场了`,
    data,
  });

  io.to(`user_${userId}`).emit('friend_visit', {
    ...data,
    timestamp: new Date().toISOString(),
  });
}

/**
 * 发送作物被偷通知
 */
export function notifyCropStolen(userId: number, data: {
  crop_id: number;
  crop_name: string;
  thief_id: number;
  thief_name: string;
  stolen_amount: number;
}): void {
  if (!io || !userId) return;

  notifyUser(userId, {
    type: 'crop_stolen',
    title: '作物被偷',
    message: `${data.thief_name} 偷走了你的 ${data.crop_name} x${data.stolen_amount}`,
    data,
  });

  io.to(`user_${userId}`).emit('crop_stolen', {
    ...data,
    timestamp: new Date().toISOString(),
  });
}

/**
 * 发送任务完成通知
 */
export function notifyQuestComplete(userId: number, data: {
  quest_id: number;
  quest_title: string;
  rewards: any;
}): void {
  if (!io || !userId) return;

  notifyUser(userId, {
    type: 'quest_complete',
    title: '任务完成',
    message: `任务「${data.quest_title}」已完成！`,
    data,
  });

  io.to(`user_${userId}`).emit('quest_complete', {
    ...data,
    timestamp: new Date().toISOString(),
  });
}

/**
 * 发送成就解锁通知
 */
export function notifyAchievementUnlock(userId: number, data: {
  achievement_id: number;
  achievement_title: string;
  rewards: any;
}): void {
  if (!io || !userId) return;

  notifyUser(userId, {
    type: 'achievement_unlock',
    title: '成就解锁',
    message: `恭喜获得成就「${data.achievement_title}」！`,
    data,
  });

  io.to(`user_${userId}`).emit('achievement_unlock', {
    ...data,
    timestamp: new Date().toISOString(),
  });
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
 * 获取在线用户数量
 */
export function getOnlineUserCount(): number {
  return userSockets.size;
}

/**
 * 获取在线用户ID列表
 */
export function getOnlineUserIds(): number[] {
  return Array.from(userSockets.keys());
}

/**
 * 检查用户是否在线
 */
export function isUserOnline(userId: number): boolean {
  const sockets = userSockets.get(userId);
  return sockets !== undefined && sockets.size > 0;
}

/**
 * 关闭Socket.io服务器
 */
export function closeSocketServer(): void {
  if (io) {
    io.close();
    io = null;
    userSockets.clear();
  }
}
