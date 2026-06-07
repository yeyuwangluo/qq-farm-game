// 用户相关类型
export interface User {
  id: string;
  username: string;
  email: string;
  level: number;
  experience: number;
  coins: number;
  vouchers: number; // 点券
  skill_points: number;
  created_at: string;
  last_login?: string;
  settings: Record<string, any>;
}

export interface UserProfile {
  user: User;
  token: string;
}

// 认证相关类型
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: UserProfile;
}

export interface RegisterResponse {
  success: boolean;
  data: UserProfile;
}

// API响应通用类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
    timestamp: number;
  };
}

// 农场相关类型
export interface Plot {
  id: string;
  level: number;
  crop: Crop | null;
  plant_time: string | null;
  harvest_time: string | null;
  fertilizer_used: boolean;
  is_withered: boolean;
}

export interface Crop {
  id: string;
  name: string;
  level_required: number;
  seed_price: number;
  voucher_price: number; // 点券价格
  sell_price: number;
  growth_time: number; // 分钟
  base_yield: number;
  season: string;
  currency_type: 'coins' | 'vouchers' | 'mixed'; // 货币类型
  voucher_drop_rate?: number; // 点券掉落率
  icon: string;
}

export interface AnimalPen {
  id: string;
  level: number;
  max_capacity: number;
  animals: Animal[];
}

export interface Animal {
  id: string;
  animal_type_id: string;
  hunger_level: number;
  last_fed: string | null;
  product_progress: number;
  product_ready_time: string | null;
}

export interface AnimalType {
  id: string;
  name: string;
  level_required: number;
  buy_price: number;
  feed_cost: number;
  production_time: number;
  product_id: string;
  icon: string;
}

export interface Decoration {
  id: string;
  decoration_type_id: string;
  position_x: number;
  position_y: number;
  rotation: number;
}

export interface DecorationType {
  id: string;
  name: string;
  category: string;
  price: number;
  voucher_price: number; // 点券价格
  level_required: number;
  icon: string;
  effect: Record<string, any>;
}

// 背包相关类型
export interface InventoryItem {
  id: string;
  item_id: string;
  quantity: number;
}

export interface Item {
  id: string;
  name: string;
  category: string;
  type_id: string;
  base_price: number;
  voucher_price: number; // 点券价格
  stackable: boolean;
  icon: string;
}

// 商店相关类型
export interface ShopItem {
  id: string;
  name: string;
  price: number;
  voucher_price: number; // 点券价格
  level_required: number;
  category: string;
  icon: string;
  currency_type: 'coins' | 'vouchers' | 'mixed'; // 货币类型
}

// 社交相关类型
export interface Friend {
  id: string;
  username: string;
  level: number;
  intimacy: number;
  status: 'pending' | 'accepted' | 'blocked';
  last_online?: string;
}

export interface SocialActivity {
  id: string;
  user_id: string;
  target_user_id: string | null;
  activity_type: 'visit' | 'help' | 'steal' | 'gift';
  target_id: string | null;
  timestamp: string;
}

// 任务相关类型
export interface Quest {
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

export interface Reward {
  type: 'coins' | 'vouchers' | 'experience' | 'item' | 'decoration';
  value: number | string;
  name?: string;
}

// 成就相关类型
export interface Achievement {
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

// 通知相关类型
export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  is_read: boolean;
  created_at: string;
}

// 季节相关类型
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export interface SeasonInfo {
  current_season: Season;
  start_time: string;
  end_time: string;
  remaining_days: number;
}

// 土地升级成本
export interface PlotUpgradeCost {
  level: number;
  coins: number;
  vouchers: number;
}