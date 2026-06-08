# 系统架构

QQ农场游戏采用前后端分离架构，支持实时通信和跨设备访问。

## 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                        客户端层                              │
├─────────────────────────────────────────────────────────────┤
│  Web浏览器          │  移动端浏览器                          │
│  React + TypeScript  │  响应式设计                            │
│  Tailwind CSS       │  触摸优化                              │
└─────────────────────┴──────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                        API网关层                             │
├─────────────────────────────────────────────────────────────┤
│  Nginx反向代理       │  WebSocket服务                       │
│  静态文件服务        │  实时事件推送                          │
│  SSL/TLS加密        │  连接管理                              │
└─────────────────────┴──────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      应用服务层                              │
├─────────────────────────────────────────────────────────────┤
│  认证服务           │  游戏服务                              │
│  用户注册/登录      │  作物种植/收获                          │
│  JWT认证            │  动物养殖                              │
│  会话管理            │  等级和经验                            │
│                     │                                        │
│  社交服务           │  通知服务                              │
│  好友管理           │  实时通知                              │
│  访问农场           │  通知历史                              │
│  帮忙/偷菜          │                                        │
│                     │  商店服务                              │
│  任务服务           │  商品管理                              │
│  日常任务           │  购买/出售                             │
│  成就任务           │                                        │
│  季节活动服务       │                                        │
│  季节切换           │                                        │
└─────────────────────┴──────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                        数据层                                │
├─────────────────────────────────────────────────────────────┤
│  MySQL 8.0         │  Redis 7.0                             │
│  关系型数据         │  缓存                                  │
│  用户、农场数据     │  会话管理                              │
│  作物、动物数据     │  排行榜                                │
│  社交数据           │  实时数据                              │
│  任务、成就数据     │                                        │
│  通知数据           │  文件存储                              │
│  游戏配置           │  图片资源                              │
└─────────────────────┴──────────────────────────────────────┘
```

## 前端架构

### 技术栈
- **框架**: React 19.2.6 + TypeScript 6.0.2
- **构建工具**: Vite 8.0.12
- **样式**: Tailwind CSS 4.3.0
- **HTTP客户端**: Axios 1.17.0
- **WebSocket**: Socket.io-client 4.8.3
- **测试**: Vitest 4.1.8 + @testing-library/react 16.3.2

### 目录结构
```
frontend/
├── src/
│   ├── components/       # React组件
│   │   ├── FarmView/    # 农场主视图
│   │   ├── LandPlot/    # 土地组件
│   │   ├── AnimalPen/   # 动物栏组件
│   │   ├── Shop/        # 商店组件
│   │   ├── Inventory/   # 背包组件
│   │   └── SocialPanel/ # 社交面板
│   ├── services/         # 服务层
│   │   ├── api.ts       # API客户端
│   │   └── socket.ts    # WebSocket客户端
│   ├── hooks/            # React Hooks
│   │   ├── useAuth.ts   # 认证Hook
│   │   ├── useFarm.ts   # 农场Hook
│   │   └── useSocket.ts # WebSocket Hook
│   ├── types/            # TypeScript类型定义
│   │   └── index.ts     # 所有接口定义
│   ├── utils/            # 工具函数
│   │   └── index.ts     # 通用工具函数
│   ├── test/             # 测试配置
│   │   └── setup.ts     # Vitest设置
│   ├── App.tsx           # 根组件
│   └── main.tsx          # 入口文件
├── public/               # 静态资源
├── .env                  # 环境变量
├── vite.config.ts        # Vite配置
├── tailwind.config.js    # Tailwind配置
└── package.json          # 依赖配置
```

### 响应式断点
```javascript
screens: {
  'xs': '320px',   // 手机竖屏
  'sm': '640px',   // 大屏手机
  'md': '768px',   // 平板
  'lg': '1024px',  // 小屏笔记本
  'xl': '1280px',  // 桌面
  '2xl': '1440px', // 大屏桌面
  '3xl': '1920px', // 超大屏
}
```

### 状态管理
- **认证状态**: Context API + localStorage
- **农场状态**: React Hooks + WebSocket实时更新
- **通知状态**: WebSocket + 本地状态

### 开发配置
```typescript
// vite.config.ts
{
  server: {
    allowedHosts: ['.monkeycode-ai.online'],
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
}
```

## 后端架构（规划中）

### 技术栈
- **框架**: Node.js + Express.js
- **WebSocket**: Socket.io
- **数据库**: MySQL 8.0 + Redis 7.0
- **认证**: JWT (jsonwebtoken)
- **密码加密**: bcrypt
- **进程管理**: PM2

### 服务划分
```
backend/
├── src/
│   ├── controllers/      # 控制器层
│   │   ├── AuthController.ts
│   │   ├── GameController.ts
│   │   ├── SocialController.ts
│   │   └── NotificationController.ts
│   ├── services/         # 业务逻辑层
│   │   ├── AuthService.ts
│   │   ├── GameService.ts
│   │   ├── SocialService.ts
│   │   └── NotificationService.ts
│   ├── models/           # 数据模型
│   │   ├── User.ts
│   │   ├── Farm.ts
│   │   ├── Crop.ts
│   │   └── ...
│   ├── middleware/       # 中间件
│   │   ├── auth.ts       # JWT认证
│   │   ├── error.ts      # 错误处理
│   │   └── validation.ts # 数据验证
│   ├── routes/           # 路由定义
│   │   ├── auth.ts
│   │   ├── game.ts
│   │   └── ...
│   ├── utils/            # 工具函数
│   │   ├── jwt.ts
│   │   ├── crypto.ts
│   │   └── logger.ts
│   └── app.ts            # Express应用
├── config/               # 配置文件
├── tests/                # 测试文件
└── package.json
```

## 数据库设计

### MySQL数据库表

| 表名 | 描述 | 主要字段 |
|-----|------|---------|
| users | 用户数据 | id, username, email, password_hash, level, experience, coins, vouchers |
| farms | 农场数据 | id, user_id, name, decoration_theme |
| plots | 土地数据 | id, farm_id, position_x, position_y, level, crop_id |
| crops | 作物类型 | id, name, level_required, seed_price, voucher_price, growth_time, season |
| animal_pens | 动物栏 | id, farm_id, level, max_capacity |
| animals | 动物数据 | id, pen_id, animal_type_id, hunger_level, product_progress |
| decorations | 装饰物 | id, farm_id, decoration_type_id, position_x, position_y |
| inventory | 背包物品 | id, user_id, item_id, quantity |
| friendships | 好友关系 | id, user_id, friend_id, intimacy, status |
| quests | 任务 | id, title, type, condition, target_value, rewards |
| user_quests | 用户任务 | id, user_id, quest_id, progress, status |
| achievements | 成就 | id, title, category, condition, target_value, rewards |
| notifications | 通知 | id, user_id, type, title, message, is_read |
| game_config | 游戏配置 | id, key, value |

### Redis数据结构

| 类型 | Key | 描述 |
|-----|-----|------|
| String | `session:{userId}` | 用户会话数据 |
| String | `token:{tokenId}` | JWT token黑名单 |
| List | `notifications:{userId}` | 用户通知队列 |
| Sorted Set | `leaderboard:level` | 等级排行榜 |
| Sorted Set | `leaderboard:coins` | 金币排行榜 |
| Hash | `user:{userId}:farm` | 农场缓存数据 |
| Hash | `user:{userId}:inventory` | 背包缓存数据 |

## 通信协议

### HTTP API
- **Base URL**: `/api`
- **Content-Type**: `application/json`
- **认证**: Bearer Token (JWT)

### WebSocket
- **协议**: `ws://` 或 `wss://`
- **认证**: JWT token in auth object
- **重连**: 自动重连，最多10次

## 部署架构

### 开发环境
```
┌─────────────────────────────────┐
│  本地开发                        │
├─────────────────────────────────┤
│  前端: http://localhost:5173    │
│  后端: http://localhost:3001    │
│  数据库: localhost:3306         │
│  Redis: localhost:6379          │
└─────────────────────────────────┘
```

### 生产环境
```
┌─────────────────────────────────────┐
│  Nginx (反向代理 + SSL)             │
│  ↓                                  │
│  ├── 前端静态文件 (React Build)     │
│  └── /api → 后端服务               │
│  ↓                                  │
│  后端集群 (PM2)                     │
│  ├── 认证服务                       │
│  ├── 游戏服务                       │
│  └── ...                            │
│  ↓                                  │
│  MySQL集群 (主从复制)               │
│  Redis集群 (哨兵模式)               │
└─────────────────────────────────────┘
```

## 安全架构

### 认证与授权
- **JWT Token**: 用户身份认证
- **Token刷新**: 自动刷新机制
- **密码加密**: bcrypt哈希
- **会话管理**: Redis存储会话

### 数据传输
- **HTTPS**: TLS 1.3加密
- **WSS**: WebSocket安全连接
- **CORS**: 严格的跨域控制

### 数据安全
- **SQL注入防护**: 参数化查询
- **XSS防护**: 输入验证和转义
- **CSRF防护**: Token验证
- **敏感数据**: AES-256加密

## 性能架构

### 前端优化
- **代码分割**: 路由级别懒加载
- **图片优化**: WebP格式 + 懒加载
- **缓存策略**: Service Worker + HTTP缓存
- **虚拟滚动**: 长列表优化

### 后端优化
- **缓存**: Redis缓存热点数据
- **数据库索引**: 优化查询性能
- **连接池**: MySQL连接池管理
- **CDN**: 静态资源分发

### WebSocket优化
- **心跳检测**: 保持连接活跃
- **消息压缩**: 减少传输数据量
- **负载均衡**: 多节点支持

## 监控与日志

### 日志系统
- **应用日志**: Winston
- **访问日志**: Nginx access.log
- **错误日志**: Sentry集成

### 监控指标
- **性能监控**: 响应时间、吞吐量
- **资源监控**: CPU、内存、磁盘
- **业务监控**: 在线用户、交易量
- **错误监控**: 异常追踪

## 扩展性设计

### 水平扩展
- **无状态服务**: 后端服务无状态化
- **负载均衡**: Nginx + 多节点
- **数据库集群**: MySQL主从 + Redis哨兵

### 垂直扩展
- **配置优化**: 调整服务器参数
- **缓存优化**: 增加Redis容量
- **数据库优化**: 分库分表

## 技术债务

### 待优化项
- [ ] 添加服务发现机制
- [ ] 实现分布式会话
- [ ] 优化数据库查询
- [ ] 完善错误处理机制
- [ ] 增加单元测试覆盖率