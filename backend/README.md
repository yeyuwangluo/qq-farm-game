# QQ农场游戏 - 后端服务

基于Node.js + Express.js + TypeScript + Socket.io + MySQL + Redis的后端服务。

## 技术栈

- Node.js 18+
- Express.js
- TypeScript
- Socket.io
- MySQL 8.0
- Redis 7.0
- JWT认证
- Bcrypt密码加密

## 快速开始

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建
```bash
npm run build
```

### 生产环境
```bash
npm start
```

### 运行测试
```bash
npm test
```

## 项目结构

```
src/
├── config/          # 配置文件
├── controllers/     # 控制器
├── services/        # 业务逻辑
├── models/          # 数据模型
├── middleware/      # 中间件
├── routes/          # 路由
├── utils/           # 工具函数
├── app.ts           # Express应用
└── server.ts        # 服务器入口
```

## 环境变量

复制`.env.example`为`.env`并配置：
- DB_HOST - 数据库主机
- DB_PORT - 数据库端口
- DB_USER - 数据库用户
- DB_PASSWORD - 数据库密码
- DB_NAME - 数据库名称
- REDIS_HOST - Redis主机
- REDIS_PORT - Redis端口
- JWT_SECRET - JWT密钥
- CORS_ORIGIN - CORS允许的源

## API文档

详见项目文档：[../.monkeycode/docs/INTERFACES.md](../.monkeycode/docs/INTERFACES.md)