/**
 * 土地相关类型定义
 */

/**
 * 土地状态枚举
 */
export enum PlotState {
  EMPTY = 'empty',
  SEED = 'seed',
  GROWING = 'growing',
  READY = 'ready',
  WITHERED = 'withered',
}

/**
 * 土地详情接口
 */
export interface Plot {
  id: number;
  farm_id: number;
  plot_index: number;
  level: number;
  state: PlotState;
  crop_id: number | null;
  crop_name: string | null;
  planted_at: string | null;
  ready_at: string | null;
  harvested_at: string | null;
  remaining_time: number | null;
  is_ready: boolean;
  is_withered: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * 作物类型接口
 */
export interface CropType {
  id: number;
  name: string;
  description: string;
  seed_price: number;
  sell_price: number;
  growth_time: number;
  yield_base: number;
  experience_reward: number;
  level_requirement: number;
  image_url: string | null;
  is_seasonal: boolean;
  season_id: number | null;
  voucher_drop_chance: number;
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
 * 升级土地请求
 */
export interface UpgradePlotRequest {
  plot_id: number;
}

/**
 * 解锁土地请求
 */
export interface UnlockPlotRequest {
  plot_index: number;
}

/**
 * 种植作物结果
 */
export interface PlantCropResult {
  plot_id: number;
  crop_id: number;
  crop_name: string;
  planted_at: string;
  ready_at: string;
  growth_time: number;
}

/**
 * 收获作物结果
 */
export interface HarvestCropResult {
  plot_id: number;
  crop_name: string;
  yield: number;
  gold_gained: number;
  experience_gained: number;
  vouchers_gained: number;
}

/**
 * 升级土地结果
 */
export interface UpgradePlotResult {
  plot_id: number;
  plot_index: number;
  new_level: number;
  max_plots: number;
  upgrade_cost: number;
  remaining_gold: number;
}

/**
 * 解锁土地结果
 */
export interface UnlockPlotResult {
  plot_id: number;
  plot_index: number;
  unlock_cost: number;
  remaining_gold: number;
}