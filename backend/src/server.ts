/**
 * 服务器启动入口
 */
import { createServer } from 'http';
import app from './app.js';
import config from './config/index.js';
import { createSocketServer, closeSocketServer } from './config/socket.js';
import { createPool, closeDatabase } from './config/mysql.js';

const httpServer = createServer(app);

// 初始化Socket.io服务器
createSocketServer(httpServer);

// 初始化数据库连接池
createPool();

// 启动服务器
httpServer.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
  console.log(`Environment: ${config.env}`);
  console.log(`Database: ${config.database.host}:${config.database.port}/${config.database.name}`);
  console.log(`Redis: ${config.redis.host}:${config.redis.port}`);
});

// 优雅关闭
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

async function gracefulShutdown() {
  console.log('Starting graceful shutdown...');

  // 关闭HTTP服务器
  httpServer.close(() => {
    console.log('HTTP server closed');
  });

  // 关闭Socket.io服务器
  closeSocketServer();
  console.log('Socket.io server closed');

  // 关闭数据库连接
  await closeDatabase();
  console.log('Database connection closed');

  console.log('Graceful shutdown completed');
  process.exit(0);
}

// 处理未捕获的异常
process.on('uncaughtException', error => {
  console.error('Uncaught Exception:', error);
  gracefulShutdown();
});

// 处理未处理的Promise拒绝
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown();
});
