/**
 * Express应用程序入口
 */
import express from 'express';
import cors from 'cors';
import config from './config/index.js';

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

// 健康检查端点
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.env,
    port: config.port,
  });
});

// API路由
// app.use('/api', routes);

// 404处理
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: 'Route not found', timestamp: Date.now() },
  });
});

interface ErrorResponse {
  message: string;
  status?: number;
  code?: string;
}

// 错误处理
app.use((err: ErrorResponse, _req: express.Request, res: express.Response) => {
  res.status(err.status || 500).json({
    success: false,
    error: {
      code: err.code || 'SRV_001',
      message: err.message || 'Internal server error',
      timestamp: Date.now(),
    },
  });
});

export default app;
