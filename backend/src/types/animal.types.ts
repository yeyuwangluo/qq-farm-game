/**
 * 动物相关类型定义
 */

/**
 * 动物状态枚举
 */
export enum AnimalState {
  HUNGRY = 'hungry',
  PRODUCING = 'producing',
  READY = 'ready',
  STARVING = 'starving',
}

/**
 * 动物类型数据接口（对应数据库animal_types表）
 */
export interface AnimalType {
  id: number;
  name: string;
  description: string;
  purchase_price: number;
  product_name: string;
  product_price: number;
  product_time: number; // 产出时间（分钟）
  product_yield: number;
  experience_reward: number;
  level_requirement: number;
  image_url: string | null;
  food_type: string;
  food_consumption: number;
  created_at: Date;
  updated_at: Date;
}

/**
 * 动物栏数据接口（对应数据库animal_pens表）
 */
export interface AnimalPen {
  id: number;
  farm_id: number;
  level: number;
  capacity: number;
  created_at: Date;
  updated_at: Date;
}

/**
 * 动物数据接口（对应数据库animals表）
 */
export interface Animal {
  id: number;
  user_id: number;
  animal_pen_id: number;
  animal_type_id: number;
  name: string | null;
  hunger_level: number; // 饥饿度 0-100
  last_fed_at: Date | null;
  product_progress: number; // 产出进度 0-100
  last_product_at: Date | null;
  state: AnimalState;
  created_at: Date;
  updated_at: Date;
}

/**
 * 动物栏详情接口
 */
export interface AnimalPenDetail {
  id: number;
  farm_id: number;
  level: number;
  capacity: number;
  upgrade_cost: number;
  animal_count: number;
  animals: AnimalDetail[];
  created_at: string;
  updated_at: string;
}

/**
 * 动物详情接口
 */
export interface AnimalDetail {
  id: number;
  user_id: number;
  animal_pen_id: number;
  animal_type_id: number;
  animal_type_name: string;
  animal_type_description: string;
  name: string | null;
  hunger_level: number;
  last_fed_at: string | null;
  product_progress: number;
  last_product_at: string | null;
  product_time: number;
  state: AnimalState;
  remaining_time: number | null;
  is_ready: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * 购买动物请求
 */
export interface BuyAnimalRequest {
  animal_type_id: number;
  name?: string;
}

/**
 * 喂养动物请求
 */
export interface FeedAnimalRequest {
  animal_id: number;
}

/**
 * 收集产品请求
 */
export interface CollectProductRequest {
  animal_id: number;
}

/**
 * 升级动物栏请求
 */
export interface UpgradeAnimalPenRequest {
  pen_id: number;
}

/**
 * 购买动物结果
 */
export interface BuyAnimalResult {
  animal_id: number;
  animal_name: string;
  cost: number;
  remaining_gold: number;
}

/**
 * 喂养动物结果
 */
export interface FeedAnimalResult {
  animal_id: number;
  animal_name: string;
  food_consumed: number;
  remaining_hunger_level: number;
}

/**
 * 收集产品结果
 */
export interface CollectProductResult {
  animal_id: number;
  animal_name: string;
  product_name: string;
  product_yield: number;
  gold_gained: number;
  experience_gained: number;
}

/**
 * 升级动物栏结果
 */
export interface UpgradeAnimalPenResult {
  pen_id: number;
  new_level: number;
  new_capacity: number;
  cost: number;
  remaining_gold: number;
}