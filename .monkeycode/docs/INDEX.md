# QQ农场游戏 - 项目文档

欢迎来到QQ农场游戏项目文档。这是一个多人在线的社交农场游戏，支持移动端和桌面端访问。

## 快速导航

- [系统架构](ARCHITECTURE.md) - 了解系统的整体架构设计
- [接口文档](INTERFACES.md) - 查看API和数据接口定义
- [开发指南](DEVELOPER_GUIDE.md) - 了解如何参与开发

## 项目概述

QQ农场游戏是一个基于Web的社交农场模拟游戏，玩家可以：

- 🌱 种植和收获作物
- 🐄 养殖动物并收集产品
- 🏠 装饰和自定义农场
- 👥 与好友互动（访问、帮忙、偷菜）
- 🎯 完成任务和成就
- 📅 参与季节活动
- 💰 赚取金币和点券

## 技术栈

### 前端
- **框架**: React 19 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **HTTP客户端**: Axios
- **WebSocket**: Socket.io-client
- **测试**: Vitest + @testing-library/react

### 后端
- **框架**: Node.js + Express.js + TypeScript
- **WebSocket**: Socket.io
- **数据库**: MySQL 8.0 + Redis 7.0
- **认证**: JWT
- **进程管理**: PM2
- **测试**: Vitest

## 项目结构

```
workspace/
├── frontend/              # 前端项目
│   ├── src/
│   │   ├── components/   # React组件
│   │   ├── services/     # 服务层（API、WebSocket）
│   │   ├── hooks/        # React Hooks
│   │   ├── types/        # TypeScript类型定义
│   │   ├── utils/        # 工具函数
│   │   └── test/         # 测试配置
│   ├── .env              # 环境变量
│   ├── package.json      # 依赖配置
│   └── vite.config.ts    # Vite配置
└── .monkeycode/          # 项目文档
    ├── specs/            # 需求和设计文档
    └── docs/             # 项目文档（本目录）
```

## 核心功能模块

1. **认证系统** - 用户注册、登录、JWT认证
2. **农场管理** - 土地、作物、动物养殖
3. **经济系统** - 金币、点券、等级、经验
4. **商店系统** - 购买种子、动物、装饰物
5. **背包系统** - 物品管理和使用
6. **社交系统** - 好友、访问、帮忙、偷菜
7. **任务系统** - 日常任务、成就任务
8. **季节活动** - 季节性种子和活动
9. **通知系统** - 实时通知推送
10. **新手引导** - 游戏教程

## 开发状态

### 已完成
- ✅ 前端项目基础结构搭建
- ✅ Tailwind CSS响应式配置
- ✅ API客户端和WebSocket客户端
- ✅ 完整的TypeScript类型定义
- ✅ 工具函数库
- ✅ 单元测试框架（31个测试通过）
- ✅ 后端项目基础结构搭建
- ✅ TypeScript配置
- ✅ 项目目录结构
- ✅ Express.js服务器和中间件
- ✅ TypeScript热重载（tsx watch）
- ✅ ESLint和Prettier配置
- ✅ 开发环境测试（24个测试通过）
- ✅ 开发服务器启动（端口3001）

### 进行中
- 🔄 后端依赖安装（Express、Socket.io、数据库等）

### 待开发
- ⏳ 数据库Schema设计
- ⏳ 认证系统
- ⏳ 农场核心功能
- ⏳ 经济和等级系统
- ⏳ 社交功能
- ⏳ 季节活动系统

## 文档索引

- [需求文档](../specs/qq-style-farm-game/requirements.md) - 完整的功能需求规格
- [设计文档](../specs/qq-style-farm-game/design.md) - 技术设计和架构
- [实施计划](../specs/qq-style-farm-game/tasklist.md) - 开发任务列表

## 快速开始

### 后端开发

```bash
cd backend
npm install
npm run dev
```

### 运行测试

```bash
# 前端测试
cd frontend
npm run test:run

# 后端测试
cd backend
npm run test:run
```

## 贡献指南

请查看[开发指南](DEVELOPER_GUIDE.md)了解如何参与项目开发。

## 许可证

MIT License