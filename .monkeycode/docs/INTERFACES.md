# 接口文档

本文档定义了QQ农场游戏的API接口和数据结构。

## API端点

### 认证接口

#### 用户注册
```typescript
POST /api/auth/register

Request:
{
  username: string;
  email: string;
  password: string;
}

Response:
{
  success: boolean;
  data: {
    user: User;
    token: string;
  };
}

Error:
{
  success: false;
  error: {
    code: 'AUTH_001';
    message: string;
    timestamp: number;
  };
}
```

#### 用户登录
```typescript
POST /api/auth/login

Request:
{
  username: string;
  password: string;
}

Response:
{
  success: boolean;
  data: {
    user: User;
    token: string;
  };
}
```

#### 获取用户信息
```typescript
GET /api/auth/me

Headers:
Authorization: Bearer {token}

Response:
{
  success: boolean;
  data: User;
}
```

### 农场接口

#### 获取农场土地列表
```typescript
GET /api/farm/plots

Headers:
Authorization: Bearer {token}

Response:
{
  success: boolean;
  data: Plot[];
}
```

#### 种植作物
```typescript
POST /api/game/plant

Request:
{
  plotId: string;
  seedId: string;
  fertilizerId?: string;
}

Response:
{
  success: boolean;
  data: Plot;
}
```

#### 收获作物
```typescript
POST /api/game/harvest

Request:
{
  plotId: string;
}

Response:
{
  success: boolean;
  data: {
    plot: Plot;
    rewards: Reward[];
  };
}
```

#### 土地升级
```typescript
POST /api/farm/plots/:id/upgrade

Response:
{
  success: boolean;
  data: Plot;
}
```

### 动物接口

#### 获取动物栏列表
```typescript
GET /api/farm/animal-pens

Response:
{
  success: boolean;
  data: AnimalPen[];
}
```

#### 购买动物
```typescript
POST /api/game/buy-animal

Request:
{
  penId: string;
  animalTypeId: string;
}

Response:
{
  success: boolean;
  data: Animal;
}
```

#### 喂养动物
```typescript
POST /api/game/feed-animal

Request:
{
  animalId: string;
  feedId: string;
}

Response:
{
  success: boolean;
  data: Animal;
}
```

#### 收集动物产品
```typescript
POST /api/game/collect-product

Request:
{
  animalId: string;
}

Response:
{
  success: boolean;
  data: {
    product: Product;
    rewards: Reward[];
  };
}
```

### 商店接口

#### 获取商品列表
```typescript
GET /api/shop/items?category={category}&season={season}

Query Parameters:
- category: 'seeds' | 'animals' | 'decorations' | 'items'
- season: 'spring' | 'summer' | 'autumn' | 'winter'

Response:
{
  success: boolean;
  data: ShopItem[];
}
```

#### 购买物品
```typescript
POST /api/shop/purchase

Request:
{
  itemId: string;
  quantity: number;
}

Response:
{
  success: boolean;
  data: {
    items: InventoryItem[];
    balance: {
      coins: number;
      vouchers: number;
    };
  };
}
```

#### 出售物品
```typescript
POST /api/shop/sell

Request:
{
  itemId: string;
  quantity: number;
}

Response:
{
  success: boolean;
  data: {
    coins: number;
    items: InventoryItem[];
  };
}
```

### 背包接口

#### 获取背包物品
```typescript
GET /api/inventory

Response:
{
  success: boolean;
  data: InventoryItem[];
}
```

#### 使用物品
```typescript
POST /api/inventory/use

Request:
{
  itemId: string;
  targetId?: string;
}

Response:
{
  success: boolean;
  data: {
    item: InventoryItem;
    effect?: any;
  };
}
```

### 社交接口

#### 获取好友列表
```typescript
GET /api/social/friends

Response:
{
  success: boolean;
  data: Friend[];
}
```

#### 添加好友
```typescript
POST /api/social/add-friend

Request:
{
  username: string;
}

Response:
{
  success: boolean;
  data: Friendship;
}
```

#### 访问好友农场
```typescript
POST /api/social/visit

Request:
{
  friendId: string;
}

Response:
{
  success: boolean;
  data: {
    farm: FarmData;
    remainingTime: number; // 剩余访问时间（秒）
  };
}
```

#### 帮忙好友
```typescript
POST /api/social/help

Request:
{
  friendId: string;
  targetId: string;
  targetType: 'crop' | 'animal';
}

Response:
{
  success: boolean;
  data: {
    reward: Reward;
    intimacyGain: number;
  };
}
```

#### 偷取作物
```typescript
POST /api/social/steal

Request:
{
  friendId: string;
  targetId: string;
  targetType: 'crop';
}

Response:
{
  success: boolean;
  data: {
    stolenItem: any;
    reward: Reward;
  };
}
```

### 任务接口

#### 获取任务列表
```typescript
GET /api/quests?type={type}

Query Parameters:
- type: 'daily' | 'achievement' | 'special'

Response:
{
  success: boolean;
  data: Quest[];
}
```

#### 接受任务
```typescript
POST /api/quests/:id/accept

Response:
{
  success: boolean;
  data: UserQuest;
}
```

#### 提交任务
```typescript
POST /api/quests/:id/submit

Response:
{
  success: boolean;
  data: {
    quest: UserQuest;
    rewards: Reward[];
  };
}
```

### 成就接口

#### 获取成就列表
```typescript
GET /api/achievements?category={category}

Response:
{
  success: boolean;
  data: Achievement[];
}
```

### 通知接口

#### 获取通知列表
```typescript
GET /api/notifications

Response:
{
  success: boolean;
  data: {
    notifications: Notification[];
    unreadCount: number;
  };
}
```

#### 标记已读
```typescript
PUT /api/notifications/:id/read

Response:
{
  success: boolean;
}
```

### 季节接口

#### 获取当前季节
```typescript
GET /api/game/season

Response:
{
  success: boolean;
  data: SeasonInfo;
}
```

#### 获取季节活动
```typescript
GET /api/game/season/activities

Response:
{
  success: boolean;
  data: {
    currentSeason: Season;
    activities: ShopItem[];
  };
}
```

### 等级接口

#### 增加经验
```typescript
POST /api/game/add-experience

Request:
{
  amount: number;
  source: string;
}

Response:
{
  success: boolean;
  data: {
    user: User;
    levelUp: boolean;
    rewards?: Reward[];
  };
}
```

#### 使用技能点
```typescript
POST /api/game/use-skill-point

Request:
{
  skillType: 'yield' | 'experience' | 'speed';
}

Response:
{
  success: boolean;
  data: User;
}
```

### 货币接口

#### 获取点券余额
```typescript
GET /api/game/vouchers

Response:
{
  success: boolean;
  data: {
    vouchers: number;
  };
}
```

#### 点券交易
```typescript
POST /api/game/vouchers/transaction

Request:
{
  amount: number;
  type: 'earn' | 'spend';
  reason: string;
}

Response:
{
  success: boolean;
  data: {
    vouchers: number;
    transaction: Transaction;
  };
}
```

## WebSocket事件

### 客户端 → 服务器

#### 加入游戏
```typescript
socket.emit('join-game', { userId: string })
```

#### 种植作物
```typescript
socket.emit('plant-crop', {
  plotId: string;
  seedId: string;
  fertilizerId?: string;
})
```

#### 收获作物
```typescript
socket.emit('harvest-crop', { plotId: string })
```

#### 喂养动物
```typescript
socket.emit('feed-animal', {
  animalId: string;
  feedId: string;
})
```

#### 收集产品
```typescript
socket.emit('collect-product', { animalId: string })
```

#### 访问农场
```typescript
socket.emit('visit-farm', { friendId: string })
```

#### 帮忙好友
```typescript
socket.emit('help-friend', {
  friendId: string;
  targetId: string;
  targetType: 'crop' | 'animal';
})
```

#### 偷取作物
```typescript
socket.emit('steal-crop', {
  friendId: string;
  targetId: string;
  targetType: 'crop';
})
```

### 服务器 → 客户端

#### 作物成熟
```typescript
socket.on('crop-mature', (data: { plotId: string }) => {
  // 处理作物成熟
})
```

#### 动物产品就绪
```typescript
socket.on('animal-product-ready', (data: { animalId: string }) => {
  // 处理动物产品就绪
})
```

#### 好友来访
```typescript
socket.on('friend-visit', (data: { friendId: string; friendName: string }) => {
  // 处理好友来访
})
```

#### 作物被偷
```typescript
socket.on('stolen-crop', (data: { plotId: string; thiefName: string }) => {
  // 处理作物被偷
})
```

#### 任务完成
```typescript
socket.on('quest-completed', (data: { questId: string }) => {
  // 处理任务完成
})
```

#### 升级
```typescript
socket.on('level-up', (data: { newLevel: number; rewards: Reward[] }) => {
  // 处理升级
})
```

#### 通知
```typescript
socket.on('notification', (notification: Notification) => {
  // 处理通知
})
```

## 数据类型

### User（用户）
```typescript
interface User {
  id: string;
  username: string;
  email: string;
  level: number;
  experience: number;
  coins: number;
  vouchers: number;
  skill_points: number;
  created_at: string;
  last_login?: string;
  settings: Record<string, any>;
}
```

### Plot（土地）
```typescript
interface Plot {
  id: string;
  level: number;
  crop: Crop | null;
  plant_time: string | null;
  harvest_time: string | null;
  fertilizer_used: boolean;
  is_withered: boolean;
}
```

### Crop（作物）
```typescript
interface Crop {
  id: string;
  name: string;
  level_required: number;
  seed_price: number;
  voucher_price: number;
  sell_price: number;
  growth_time: number;
  base_yield: number;
  season: string;
  currency_type: 'coins' | 'vouchers' | 'mixed';
  voucher_drop_rate?: number;
  icon: string;
}
```

### Animal（动物）
```typescript
interface Animal {
  id: string;
  animal_type_id: string;
  hunger_level: number;
  last_fed: string | null;
  product_progress: number;
  product_ready_time: string | null;
}
```

### AnimalPen（动物栏）
```typescript
interface AnimalPen {
  id: string;
  level: number;
  max_capacity: number;
  animals: Animal[];
}
```

### AnimalType（动物类型）
```typescript
interface AnimalType {
  id: string;
  name: string;
  level_required: number;
  buy_price: number;
  feed_cost: number;
  production_time: number;
  product_id: string;
  icon: string;
}
```

### InventoryItem（背包物品）
```typescript
interface InventoryItem {
  id: string;
  item_id: string;
  quantity: number;
}
```

### Item（物品）
```typescript
interface Item {
  id: string;
  name: string;
  category: string;
  type_id: string;
  base_price: number;
  voucher_price: number;
  stackable: boolean;
  icon: string;
}
```

### ShopItem（商店商品）
```typescript
interface ShopItem {
  id: string;
  name: string;
  price: number;
  voucher_price: number;
  level_required: number;
  category: string;
  icon: string;
  currency_type: 'coins' | 'vouchers' | 'mixed';
}
```

### Friend（好友）
```typescript
interface Friend {
  id: string;
  username: string;
  level: number;
  intimacy: number;
  status: 'pending' | 'accepted' | 'blocked';
  last_online?: string;
}
```

### Quest（任务）
```typescript
interface Quest {
  id: string;
  type: 'daily' | 'achievement' | 'special';
  category: string;
  title: string;
  description: string;
  condition: Record<string, any>;
  target_value: number;
  rewards: Reward[];
  level_required: number;
  progress: number;
  status: 'active' | 'completed' | 'claimed' | 'expired';
  start_time: string;
  completion_time?: string;
}
```

### Achievement（成就）
```typescript
interface Achievement {
  id: string;
  title: string;
  description: string;
  category: string;
  condition: Record<string, any>;
  target_value: number;
  rewards: Reward[];
  stages?: Array<{
    target_value: number;
    rewards: Reward[];
  }>;
  icon: string;
  progress: number;
  stage: number;
  unlocked: boolean;
  unlocked_at?: string;
}
```

### Notification（通知）
```typescript
interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  is_read: boolean;
  created_at: string;
}
```

### SeasonInfo（季节信息）
```typescript
interface SeasonInfo {
  current_season: 'spring' | 'summer' | 'autumn' | 'winter';
  start_time: string;
  end_time: string;
  remaining_days: number;
}
```

### Reward（奖励）
```typescript
interface Reward {
  type: 'coins' | 'vouchers' | 'experience' | 'item' | 'decoration';
  value: number | string;
  name?: string;
}
```

## 错误码

| 错误码 | 描述 | HTTP状态码 |
|-------|------|----------|
| AUTH_001 | 认证失败 | 401 |
| PERM_001 | 权限不足 | 403 |
| RES_001 | 资源不足 | 400 |
| RES_002 | 资源已存在 | 409 |
| RES_003 | 资源未找到 | 404 |
| BIZ_001 | 业务规则错误 | 400 |
| NET_001 | 网络错误 | 500 |
| CON_001 | 并发冲突 | 409 |
| VAL_001 | 数据验证错误 | 400 |
| SRV_001 | 服务器错误 | 500 |

## 错误响应格式

```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
    timestamp: number;
  };
}
```