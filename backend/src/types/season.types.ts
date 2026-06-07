/**
 * 季节相关类型定义
 */

/**
 * 季节类型枚举
 */
export enum Season {
  SPRING = 'spring',
  SUMMER = 'summer',
  AUTUMN = 'autumn',
  WINTER = 'winter',
}

/**
 * 季节数据接口
 */
export interface SeasonInfo {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * 当前季节信息
 */
export interface CurrentSeason {
  season: Season;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  remaining_days: number;
}

/**
 * 季节活动信息
 */
export interface SeasonActivity {
  id: number;
  name: string;
  description: string;
  season: Season;
  activity_type: string;
  bonus_multiplier: number;
  special_items: string[];
  start_date: string;
  end_date: string;
  is_active: boolean;
}