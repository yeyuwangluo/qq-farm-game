/**
 * 农场数据模型
 */
import { insert } from '../config/database.js';

export interface Farm {
  id: number;
  userId: number;
  name: string;
  level: number;
  experience: number;
  maxPlots: number;
  unlockedPlots: number;
  createdAt: Date;
  updatedAt: Date;
}

export class FarmModel {
  private tableName = 'farms';

  /**
   * 为用户创建初始农场
   */
  async createForUser(userId: number, farmName?: string): Promise<Farm> {
    const now = new Date();

    const farm = await insert<Farm>(this.tableName, {
      userId,
      name: farmName || '我的农场',
      level: 1,
      experience: 0,
      maxPlots: 12,
      unlockedPlots: 6,
      createdAt: now,
      updatedAt: now,
    });

    return farm;
  }

  /**
   * 根据用户ID查询农场
   */
  async findByUserId(userId: number): Promise<Farm | null> {
    const sql = `SELECT * FROM ${this.tableName} WHERE userId = ?`;
    const farm = await import('../config/database.js').then(m => m.queryOne<Farm>(sql, [userId]));
    return farm;
  }
}

export default new FarmModel();