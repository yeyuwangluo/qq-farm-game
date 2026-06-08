/**
 * 季节服务
 */

import SeasonModel from '../models/season.model';
import { Season } from '../types/season.types';
import { AppError } from '../utils/response';

class SeasonService {
  /**
   * 获取当前季节信息
   */
  async getCurrentSeason() {
    const season = await SeasonModel.getCurrentSeason();
    if (!season) {
      // 如果没有当前季节，自动切换到第一个季节
      await SeasonModel.switchToNextSeason();
      const newSeason = await SeasonModel.getCurrentSeason();
      if (!newSeason) {
        throw AppError.notFound('没有可用的季节');
      }
      return this.formatSeasonInfo(newSeason);
    }

    return this.formatSeasonInfo(season);
  }

  /**
   * 获取季节活动信息
   */
  async getSeasonActivities() {
    const currentSeason = await SeasonModel.getCurrentSeason();
    if (!currentSeason) {
      throw AppError.notFound('当前没有活跃的季节');
    }

    // 这里可以返回与当前季节相关的活动信息
    // 暂时返回基本信息
    return {
      season: currentSeason.name,
      season_name: currentSeason.name,
      activities: [
        {
          id: 1,
          name: '季节作物',
          description: `${currentSeason.name}季节专属作物，产量加成20%`,
          activity_type: 'crop_bonus',
          bonus_multiplier: 1.2,
        },
        {
          id: 2,
          name: '点券掉落',
          description: '收获季节作物有概率获得点券',
          activity_type: 'voucher_drop',
          bonus_multiplier: 0.1,
        },
      ],
    };
  }

  /**
   * 手动切换季节（管理员功能）
   */
  async switchSeason(seasonId: number) {
    const season = await SeasonModel.findById(seasonId);
    if (!season) {
      throw AppError.notFound('季节不存在');
    }

    await SeasonModel.activate(seasonId);

    return {
      message: '季节已切换',
      season_id: season.id,
      season_name: season.name,
    };
  }

  /**
   * 获取所有季节列表
   */
  async getAllSeasons() {
    const seasons = await SeasonModel.findAll();
    return seasons.map((season) => this.formatSeasonInfo(season));
  }

  /**
   * 格式化季节信息
   */
  private formatSeasonInfo(season: any): any {
    const remainingDays = SeasonModel.getRemainingDays(season.id);

    return {
      id: season.id,
      name: season.name,
      description: season.description,
      season: season.name.toLowerCase() as Season,
      start_date: season.start_date.toISOString(),
      end_date: season.end_date.toISOString(),
      is_active: season.is_active,
      remaining_days: remainingDays,
      created_at: season.created_at.toISOString(),
      updated_at: season.updated_at.toISOString(),
    };
  }
}

export default new SeasonService();