/**
 * Express应用程序入口
 */
import express from 'express';
import cors from 'cors';
import config from './config';
import routes from './routes';
import errorHandler from './middleware/error.middleware';

const app = express();

// 基础中间件
app.use(
  cors({
    origin: config.cors.origin,
    credentials: config.cors.credentials,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 请求日志中间件（开发环境）
if (config.env === 'development') {
  app.use((req, _res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// 健康检查端点
app.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: config.env,
      port: config.port,
      version: '1.0.0',
    },
  });
});

// API路由
app.use('/api', routes);

// 404处理
app.use(errorHandler.notFound);

// 全局错误处理
app.use(errorHandler.errorHandler);

export default app;