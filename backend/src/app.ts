/**
 * Express应用程序入口
 */
import express from 'express';
import cors from 'cors';

const app = express();

// 基础中间件
// app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 健康检查端点
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API路由
// app.use('/api', routes);

// 404处理
app.use((_req, res) => {
  res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Route not found', timestamp: Date.now() } });
});

// 错误处理
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'SRV_001',
      message: err.message || 'Internal server error',
      timestamp: Date.now(),
    },
  });
});

export default app;