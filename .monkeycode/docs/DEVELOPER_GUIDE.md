# 开发指南

本文档提供QQ农场游戏项目的开发指南，帮助开发者快速上手。

## 环境要求

### 前端开发
- Node.js >= 18.0.0
- npm >= 9.0.0
- 现代浏览器（Chrome、Firefox、Safari、Edge）

### 后端开发（规划中）
- Node.js >= 18.0.0
- MySQL >= 8.0
- Redis >= 7.0
- PM2

## 快速开始

### 1. 克隆仓库

```bash
git clone https://github.com/yeyuwangluo/qq-farm-game.git
cd qq-farm-game
```

### 2. 安装依赖

```bash
# 前端依赖
cd frontend
npm install

# 后端依赖（规划中）
cd ../backend
npm install
```

### 3. 配置环境变量

```bash
# 前端环境变量
cd frontend
cp .env.example .env
# 编辑 .env 文件

# 后端环境变量（规划中）
cd ../backend
cp .env.example .env
# 编辑 .env 文件
```

### 4. 启动开发服务器

```bash
# 前端开发服务器
cd frontend
npm run dev
# 访问 http://localhost:5173

# 后端开发服务器（规划中）
cd ../backend
npm run dev
# 后端运行在 http://localhost:3001
```

### 5. 运行测试

```bash
# 前端测试
cd frontend
npm run test:run

# 后端测试（规划中）
cd ../backend
npm run test
```

## 项目结构

### 前端项目结构

```
frontend/
├── src/
│   ├── components/       # React组件
│   │   ├── FarmView/    # 农场主视图组件
│   │   ├── LandPlot/    # 土地组件
│   │   ├── AnimalPen/   # 动物栏组件
│   │   ├── Shop/        # 商店组件
│   │   ├── Inventory/   # 背包组件
│   │   ├── SocialPanel/ # 社交面板
│   │   ├── QuestPanel/  # 任务面板
│   │   ├── BottomNav/   # 底部导航
│   │   └── ...         # 其他组件
│   ├── services/         # 服务层
│   │   ├── api.ts       # API客户端
│   │   └── socket.ts    # WebSocket客户端
│   ├── hooks/            # React Hooks
│   │   ├── useAuth.ts   # 认证Hook
│   │   ├── useFarm.ts   # 农场Hook
│   │   ├── useSocket.ts # WebSocket Hook
│   │   └── ...         # 其他Hooks
│   ├── types/            # TypeScript类型定义
│   │   └── index.ts     # 所有接口定义
│   ├── utils/            # 工具函数
│   │   └── index.ts     # 通用工具函数
│   ├── test/             # 测试配置
│   │   └── setup.ts     # Vitest设置
│   ├── App.tsx           # 根组件
│   ├── main.tsx          # 入口文件
│   └── index.css         # 全局样式
├── public/               # 静态资源
│   ├── favicon.svg       # 网站图标
│   └── ...             # 其他静态文件
├── .env                  # 环境变量
├── .env.production       # 生产环境变量
├── package.json          # 依赖配置
├── vite.config.ts        # Vite配置
├── tailwind.config.js    # Tailwind配置
├── tsconfig.json         # TypeScript配置
└── eslint.config.js      # ESLint配置
```

### 后端项目结构（规划中）

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
│   ├── config/           # 配置文件
│   │   ├── database.ts
│   │   └── redis.ts
│   └── app.ts            # Express应用
├── tests/                # 测试文件
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── migrations/           # 数据库迁移
├── seeds/                # 初始数据
├── package.json
└── tsconfig.json
```

## 开发规范

### 代码风格

#### TypeScript
- 使用TypeScript进行类型检查
- 避免使用`any`类型
- 使用接口定义数据结构
- 使用枚举定义常量

#### React
- 使用函数组件 + Hooks
- 组件名使用PascalCase
- 文件名使用kebab-case或PascalCase
- Props接口定义在组件文件内部或单独文件

#### 样式
- 优先使用Tailwind CSS
- 特殊样式使用CSS Modules或styled-components
- 避免内联样式

### 命名规范

#### 变量和函数
- 使用camelCase命名
- 变量名要有意义
- 避免缩写（除通用缩写如id、url）

#### 组件
- 使用PascalCase命名
- 组件名要表达功能
- 使用描述性名称

#### 常量
- 使用UPPER_SNAKE_CASE
- 常量文件名使用kebab-case

#### 文件
- 使用kebab-case命名
- 文件名要表达内容
- 保持文件简洁

### Git提交规范

#### 提交信息格式
```
<type>(<scope>): <subject>

<body>

<footer>
```

#### 类型（type）
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具相关

#### 示例
```
feat(auth): 添加用户注册功能

- 实现用户注册API端点
- 添加邮箱验证
- 添加用户名唯一性检查

Closes #123
```

### 分支策略

#### 分支命名
```
YYMMDD-(feat|fix|chore|refactor)-description
```

#### 示例
```
260607-feat-add-user-registration
260607-fix-authentication-error
```

#### 分支工作流
1. 从master创建功能分支
2. 在功能分支上开发
3. 提交代码到功能分支
4. 创建Pull Request到master
5. 代码审查后合并到master

## 开发工作流

### 1. 创建功能分支

```bash
git checkout -b 260607-feat-new-feature master
```

### 2. 开发功能

```bash
# 编写代码
# 编写测试
# 运行测试
npm run test:run

# 代码格式化
npm run lint
```

### 3. 提交代码

```bash
git add .
git commit -m "feat: 添加新功能"
```

### 4. 推送到远程

```bash
git push -u origin 260607-feat-new-feature
```

### 5. 创建Pull Request

使用GitHub或GitLab创建Pull Request到master分支。

### 6. 代码审查

等待团队成员审查代码，根据反馈修改。

### 7. 合并代码

审查通过后，合并到master分支。

## 测试指南

### 前端测试

#### 单元测试
```typescript
// src/components/ComponentName.test.ts
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ComponentName from './ComponentName';

describe('ComponentName', () => {
  it('应该正确渲染', () => {
    render(<ComponentName />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

#### 运行测试
```bash
# 运行所有测试
npm run test:run

# 运行特定测试文件
npm test ComponentName.test.ts

# 监听模式
npm test
```

### 后端测试（规划中）

#### 单元测试
```typescript
// tests/unit/AuthService.test.ts
import { describe, it, expect } from 'vitest';
import AuthService from '../../src/services/AuthService';

describe('AuthService', () => {
  it('应该正确注册用户', async () => {
    const service = new AuthService();
    const result = await service.register({
      username: 'test',
      email: 'test@example.com',
      password: 'password123',
    });
    expect(result).toBeDefined();
  });
});
```

## 调试指南

### 前端调试

#### Chrome DevTools
1. 打开Chrome DevTools（F12）
2. 使用React DevTools扩展
3. 查看组件状态和props
4. 使用Console.log调试

#### Vite调试
```bash
# 启动开发服务器
npm run dev

# Vite会提供调试信息
# 在浏览器中设置断点
```

### 后端调试（规划中）

#### VS Code调试
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Server",
      "program": "${workspaceFolder}/src/app.ts",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"]
    }
  ]
}
```

## 性能优化

### 前端优化

#### 代码分割
```typescript
// 使用React.lazy进行代码分割
const LazyComponent = React.lazy(() => import('./LazyComponent'));
```

#### 图片优化
```typescript
// 使用懒加载
<img src={imageSrc} loading="lazy" alt="description" />
```

#### 虚拟滚动
```typescript
// 使用react-window实现长列表优化
import { FixedSizeList } from 'react-window';
```

### 后端优化（规划中）

#### 数据库查询优化
- 使用索引
- 避免N+1查询
- 使用连接池

#### 缓存优化
- 使用Redis缓存热点数据
- 设置合理的过期时间

## 部署指南

### 前端部署

#### 构建生产版本
```bash
cd frontend
npm run build
```

#### 部署到服务器
```bash
# 将dist目录上传到服务器
scp -r dist/* user@server:/var/www/html/
```

#### 配置Nginx
```nginx
server {
  listen 80;
  server_name example.com;
  root /var/www/html;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location /api {
    proxy_pass http://localhost:3001;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

### 后端部署（规划中）

#### 使用PM2
```bash
# 安装PM2
npm install -g pm2

# 启动应用
pm2 start dist/app.js --name qq-farm-backend

# 保存PM2配置
pm2 save

# 设置开机自启
pm2 startup
```

## 故障排查

### 常见问题

#### 前端构建失败
```bash
# 清除缓存
rm -rf node_modules .vite
npm install

# 重新构建
npm run build
```

#### 依赖安装失败
```bash
# 清除npm缓存
npm cache clean --force

# 重新安装
rm -rf node_modules package-lock.json
npm install
```

#### 端口被占用
```bash
# 查找占用端口的进程
lsof -i :5173

# 杀死进程
kill -9 <PID>
```

## 贡献指南

### 如何贡献

1. Fork项目仓库
2. 创建功能分支
3. 提交你的改动
4. 推送到你的Fork
5. 创建Pull Request

### 代码审查清单

- [ ] 代码符合项目风格
- [ ] 所有测试通过
- [ ] 添加了必要的文档
- [ ] 更新了CHANGELOG.md
- [ ] 没有引入新的警告

### 报告问题

使用GitHub Issues报告问题，请包含：
- 问题描述
- 复现步骤
- 预期行为
- 实际行为
- 环境信息（浏览器、操作系统等）

## 参考资源

### 技术文档
- [React文档](https://react.dev/)
- [TypeScript文档](https://www.typescriptlang.org/docs/)
- [Vite文档](https://vitejs.dev/)
- [Tailwind CSS文档](https://tailwindcss.com/docs)
- [Socket.io文档](https://socket.io/docs/)

### 项目文档
- [项目需求](../specs/qq-style-farm-game/requirements.md)
- [技术设计](../specs/qq-style-farm-game/design.md)
- [实施计划](../specs/qq-style-farm-game/tasklist.md)
- [系统架构](ARCHITECTURE.md)
- [接口文档](INTERFACES.md)

## 联系方式

- 项目主页: https://github.com/yeyuwangluo/qq-farm-game
- 问题反馈: https://github.com/yeyuwangluo/qq-farm-game/issues
- 讨论区: https://github.com/yeyuwangluo/qq-farm-game/discussions