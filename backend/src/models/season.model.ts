/**
 * 季节数据模型
 */

import Database from '../utils/database';
import { Season } from '../types/season.types';

class SeasonModel {
  /**
   * 获取当前活跃的季节
   */
  async getCurrentSeason(): Promise<any | null> {
    const now = new Date();
    const result = await Database.queryOne(`
      SELECT * FROM seasons
      WHERE is_active = TRUE
      AND start_date <= ? AND end_date >= ?
      ORDER BY start_date DESC
      LIMIT 1
    `, [now, now]);

    return result;
  }

  /**
   * 根据ID查询季节
   */
  async findById(id: number): Promise<any | null> {
    return await Database.findById('seasons', id);
  }

  /**
   * 查询所有季节
   */
  async findAll(): Promise<any[]> {
    const result = await Database.query(`
      SELECT * FROM seasons
      ORDER BY start_date DESC
    `);
    return result.rows;
  }

  /**
   * 创建新季节
   */
  async create(data: {
    name: string;
    description: string;
    start_date: Date;
    end_date: Date;
  }): Promise<number> {
    return await Database.insert('seasons', {
      ...data,
      is_active: false,
    });
  }

  /**
   * 更新季节
   */
  async update(id: number, data: Partial<any>): Promise<boolean> {
    const affectedRows = await Database.update(
      'seasons',
      data,
      { field: 'id', value: id }
    );
    return affectedRows > 0;
  }

  /**
   * 激活季节（标记为当前季节）
   */
  async activate(id: number): Promise<boolean> {
    // 先禁用所有季节
    await Database.query('UPDATE seasons SET is_active = FALSE');

    // 激活指定季节
    const affectedRows = await Database.update(
      'seasons',
      { is_active: true },
      { field: 'id', value: id }
    );
    return affectedRows > 0;
  }

  /**
   * 获取季节剩余天数
   */
  async getRemainingDays(seasonId: number): Promise<number> {
    const season = await this.findById(seasonId);
    if (!season || !season.is_active) {
      return 0;
    }

    const now = new Date();
    const endDate = new Date(season.end_date);
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(0, diffDays);
  }

  /**
   * 检查是否需要切换季节
   */
  async shouldSwitchSeason(): Promise<boolean> {
    const currentSeason = await this.getCurrentSeason();
    if (!currentSeason) {
      return true;
    }

    const now = new Date();
    const endDate = new Date(currentSeason.end_date);
    return now >= endDate;
  }

  /**
   * 自动切换到下一个季节
   */
  async switchToNextSeason(): Promise<any> {
    const currentSeason = await this.getCurrentSeason();
    const seasons = await this.findAll();

    if (seasons.length === 0) {
      return null;
    }

    // 找到下一个季节
    let nextSeason: any = null;
    const seasonOrder = [Season.SPRING, Season.SUMMER, Season.AUTUMN, Season.WINTER];

    if (!currentSeason) {
      // 如果没有当前季节，使用第一个
      nextSeason = seasons[0];
    } else {
      // 找到当前季节的下一个
      const currentIndex = seasonOrder.findIndex(
        (s) => s === currentSeason.name.toLowerCase()
      );
      const nextSeasonName = seasonOrder[(currentIndex + 1) % 4];

      nextSeason = seasons.find(
        (s) => s.name.toLowerCase() === nextSeasonName
      );

      // 如果找不到下一个季节，使用第一个
      if (!nextSeason) {
        nextSeason = seasons[0];
      }
    }

    if (nextSeason) {
      await this.activate(nextSeason.id);
      return nextSeason;
    }

    return null;
  }
}

export default new SeasonModel();