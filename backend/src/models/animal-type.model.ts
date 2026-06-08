/**
 * 动物类型数据模型
 */

import Database from '../utils/database';
import { AnimalType } from '../types/animal.types';

class AnimalTypeModel {
  /**
   * 根据ID查询动物类型
   */
  async findById(id: number): Promise<AnimalType | null> {
    return await Database.findById<AnimalType>('animal_types', id);
  }

  /**
   * 查询所有动物类型
   */
  async findAll(): Promise<AnimalType[]> {
    return await Database.select<AnimalType>('animal_types', {
      orderBy: { field: 'level_requirement', direction: 'ASC' },
    });
  }

  /**
   * 根据等级查询动物类型
   */
  async findByLevel(level: number): Promise<AnimalType[]> {
    const result = await Database.query<AnimalType>(
      'SELECT * FROM animal_types WHERE level_requirement <= ? ORDER BY level_requirement ASC',
      [level]
    );
    return result.rows;
  }

  /**
   * 查询用户可购买的动物类型
   */
  async findAvailableForUser(userLevel: number): Promise<AnimalType[]> {
    const result = await Database.query<AnimalType>(
      'SELECT * FROM animal_types WHERE level_requirement <= ? ORDER BY level_requirement ASC, purchase_price ASC',
      [userLevel]
    );
    return result.rows;
  }

  /**
   * 创建动物类型
   */
  async create(data: Partial<AnimalType>): Promise<number> {
    return await Database.insert('animal_types', data);
  }

  /**
   * 更新动物类型
   */
  async update(id: number, data: Partial<AnimalType>): Promise<boolean> {
    const affectedRows = await Database.update(
      'animal_types',
      data,
      { field: 'id', value: id }
    );
    return affectedRows > 0;
  }

  /**
   * 删除动物类型
   */
  async delete(id: number): Promise<boolean> {
    const affectedRows = await Database.delete(
      'animal_types',
      { field: 'id', value: id }
    );
    return affectedRows > 0;
  }
}

export default new AnimalTypeModel();