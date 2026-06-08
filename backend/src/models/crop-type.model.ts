/**
 * 作物类型数据模型
 */

import Database from '../utils/database';
import { CropType } from '../types/crop.types';

class CropTypeModel {
  /**
   * 查询所有作物类型
   */
  async findAll(): Promise<CropType[]> {
    const result = await Database.query<CropType>(
      'SELECT * FROM crop_types ORDER BY required_level, name'
    );
    return result.rows;
  }

  /**
   * 根据ID查询作物类型
   */
  async findById(id: number): Promise<CropType | null> {
    return await Database.findById<CropType>('crop_types', id);
  }

  /**
   * 根据等级查询可种植的作物类型
   */
  async findByLevel(level: number): Promise<CropType[]> {
    const result = await Database.query<CropType>(
      'SELECT * FROM crop_types WHERE required_level <= ? ORDER BY required_level, name',
      [level]
    );
    return result.rows;
  }

  /**
   * 根据季节查询作物类型
   */
  async findBySeason(seasonId: number): Promise<CropType[]> {
    const result = await Database.query<CropType>(
      'SELECT * FROM crop_types WHERE is_seasonal = true AND season_id = ? ORDER BY required_level, name',
      [seasonId]
    );
    return result.rows;
  }

  /**
   * 查询基础作物类型（非季节性）
   */
  async findBasicCrops(): Promise<CropType[]> {
    const result = await Database.query<CropType>(
      'SELECT * FROM crop_types WHERE is_seasonal = false ORDER BY required_level, name'
    );
    return result.rows;
  }

  /**
   * 统计作物类型数量
   */
  async count(): Promise<number> {
    return await Database.count('crop_types');
  }

  /**
   * 检查作物类型是否存在
   */
  async exists(id: number): Promise<boolean> {
    return await Database.exists('crop_types', { field: 'id', value: id });
  }
}

export default new CropTypeModel();