/**
 * 动物栏数据模型
 */

import Database from '../utils/database';
import { AnimalPen } from '../types/animal.types';

class AnimalPenModel {
  /**
   * 根据ID查询动物栏
   */
  async findById(id: number): Promise<AnimalPen | null> {
    return await Database.findById<AnimalPen>('animal_pens', id);
  }

  /**
   * 根据农场ID查询动物栏
   */
  async findByFarmId(farmId: number): Promise<AnimalPen[]> {
    const result = await Database.query<AnimalPen>(
      'SELECT * FROM animal_pens WHERE farm_id = ? ORDER BY id ASC',
      [farmId]
    );
    return result.rows;
  }

  /**
   * 创建动物栏
   */
  async create(farmId: number, level: number = 1): Promise<number> {
    const capacity = this.calculateCapacity(level);
    return await Database.insert('animal_pens', {
      farm_id: farmId,
      level: level,
      capacity: capacity,
    });
  }

  /**
   * 升级动物栏
   */
  async upgrade(penId: number): Promise<boolean> {
    const pen = await this.findById(penId);
    if (!pen) {
      return false;
    }

    const newLevel = pen.level + 1;
    const newCapacity = this.calculateCapacity(newLevel);

    const affectedRows = await Database.update(
      'animal_pens',
      { level: newLevel, capacity: newCapacity },
      { field: 'id', value: penId }
    );

    return affectedRows > 0;
  }

  /**
   * 获取动物栏的动物数量
   */
  async getAnimalCount(penId: number): Promise<number> {
    const result = await Database.queryOne<{ count: number }>(
      'SELECT COUNT(*) as count FROM animals WHERE animal_pen_id = ?',
      [penId]
    );
    return result ? result.count : 0;
  }

  /**
   * 获取动物栏详情（包含动物数量）
   */
  async getDetail(penId: number): Promise<AnimalPen & { animal_count: number } | null> {
    const pen = await this.findById(penId);
    if (!pen) {
      return null;
    }

    const animalCount = await this.getAnimalCount(penId);
    return {
      ...pen,
      animal_count: animalCount,
    };
  }

  /**
   * 计算容量
   */
  private calculateCapacity(level: number): number {
    return 3 + (level - 1) * 2;
  }

  /**
   * 计算升级费用
   */
  calculateUpgradeCost(level: number): number {
    return Math.floor(200 * Math.pow(1.5, level - 1));
  }
}

export default new AnimalPenModel();