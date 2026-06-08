/**
 * 土地相关类型定义
 */

/**
 * 土地状态枚举
 */
export enum PlotState {
  IDLE = 'idle',
  PLANTED = 'planted',
  READY = 'ready',
  WITHERED = 'withered',
}

/**
 * 土地数据接口（对应数据库plots表）
 */
export interface Plot {
  id: number;
  farm_id: number;
  plot_index: number;
  state: PlotState;
  crop_id: number | null;
  planted_at: Date | null;
  ready_at: Date | null;
  harvested_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * 土地详情接口
 */
export interface PlotDetail {
  id: number;
  farm_id: number;
  plot_index: number;
  state: PlotState;
  crop_id: number | null;
  crop_name: string | null;
  planted_at: string | null;
  ready_at: string | null;
  harvested_at: string | null;
  remaining_time: number | null; // 剩余生长时间（秒）
  is_ready: boolean;
  is_withered: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * 土地升级请求
 */
export interface PlotUpgradeRequest {
  plot_id: number;
}

/**
 * 土地解锁请求
 */
export interface PlotUnlockRequest {
  plot_index: number;
}

/**
 * 土地状态更新请求
 */
export interface PlotStateUpdateRequest {
  plot_id: number;
  state: PlotState;
}

/**
 * 土地信息
 */
export interface PlotInfo {
  id: number;
  plot_index: number;
  state: PlotState;
  crop_id: number | null;
  crop_name: string | null;
  planted_at: string | null;
  ready_at: string | null;
  remaining_time: number | null;
  is_ready: boolean;
  is_withered: boolean;
}