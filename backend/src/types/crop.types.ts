/**
 * 作物相关类型定义
 */

/**
 * 作物状态枚举
 */
export enum CropState {
  SEED = 'seed',
  GROWING = 'growing',
  READY = 'ready',
  WITHERED = 'withered',
}

/**
 * 作物类型数据接口（对应数据库crop_types表）
 */
export interface CropType {
  id: number;
  name: string;
  description: string;
  required_level: number;
  growth_time: number; // 生长时间（秒）
  harvest_time: number; // 收获时间（秒）
  base_yield: number; // 基础产量
  price: number; // 种子价格
  sell_price: number; // 作物售价
  experience: number; // 种植经验
  icon: string | null;
  is_seasonal: boolean;
  season_id: number | null;
  drop_voucher_prob: number; // 点券掉落概率（0-1）
  created_at: Date;
  updated_at: Date;
}

/**
 * 作物数据接口（对应数据库crops表）
 */
export interface Crop {
  id: number;
  plot_id: number;
  crop_type_id: number;
  state: CropState;
  planted_at: Date;
  growth_progress: number; // 生长进度（0-100）
  harvest_count: number; // 收获次数
  last_harvested_at: Date | null;
  withered_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * 作物详情接口
 */
export interface CropDetail {
  id: number;
  plot_id: number;
  plot_index: number;
  crop_type_id: number;
  crop_type_name: string;
  crop_type_description: string;
  state: CropState;
  planted_at: string;
  ready_at: string;
  growth_progress: number;
  harvest_count: number;
  last_harvested_at: string | null;
  remaining_time: number | null;
  is_ready: boolean;
  is_withered: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * 种植作物请求
 */
export interface PlantCropRequest {
  plot_id: number;
  crop_type_id: number;
}

/**
 * 收获作物请求
 */
export interface HarvestCropRequest {
  plot_id: number;
}

/**
 * 使用化肥请求
 */
export interface UseFertilizerRequest {
  plot_id: number;
  fertilizer_id: number;
}

/**
 * 使用加速剂请求
 */
export interface UseAcceleratorRequest {
  plot_id: number;
  accelerator_id: number;
}

/**
 * 作物收获结果
 */
export interface CropHarvestResult {
  crop_name: string;
  yield: number;
  gold_gained: number;
  experience_gained: number;
  vouchers_gained: number;
}