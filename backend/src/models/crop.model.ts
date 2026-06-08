/**
 * 作物数据模型
 */

import Database from '../utils/database';
import { Crop, CropState } from '../types/crop.types';

class CropModel {
  /**
   * 根据土地ID查询作物
   */
  async findByPlotId(plotId: number): Promise<Crop | null> {
    return await Database.queryOne<Crop>(
      'SELECT * FROM crops WHERE plot_id = ?',
      [plotId]
    );
  }

  /**
   * 根据ID查询作物
   */
  async findById(id: number): Promise<Crop | null> {
    return await Database.findById<Crop>('crops', id);
  }

  /**
   * 创建作物
   */
  async create(plotId: number, cropTypeId: number, plantedAt: Date, readyAt: Date): Promise<number> {
    return await Database.insert('crops', {
      plot_id: plotId,
      crop_type_id: cropTypeId,
      state: CropState.GROWING,
      planted_at: plantedAt,
      growth_progress: 0,
      harvest_count: 0,
      last_harvested_at: null,
      withered_at: null,
    });
  }

  /**
   * 更新作物状态
   */
  async updateState(cropId: number, state: CropState): Promise<boolean> {
    const affectedRows = await Database.update(
      'crops',
      { state },
      { field: 'id', value: cropId }
    );
    return affectedRows > 0;
  }

  /**
   * 更新生长进度
   */
  async updateGrowthProgress(cropId: number, progress: number): Promise<boolean> {
    const affectedRows = await Database.update(
      'crops',
      { growth_progress: progress },
      { field: 'id', value: cropId }
    );
    return affectedRows > 0;
  }

  /**
   * 更新收获信息
   */
  async updateHarvest(cropId: number, harvestCount: number): Promise<boolean> {
    const affectedRows = await Database.update(
      'crops',
      {
        harvest_count: harvestCount,
        last_harvested_at: new Date(),
        state: CropState.SEED,
        growth_progress: 0,
      },
      { field: 'id', value: cropId }
    );
    return affectedRows > 0;
  }

  /**
   * 更新为枯萎状态
   */
  async updateWithered(cropId: number): Promise<boolean> {
    const affectedRows = await Database.update(
      'crops',
      {
        state: CropState.WITHERED,
        withered_at: new Date(),
      },
      { field: 'id', value: cropId }
    );
    return affectedRows > 0;
  }

  /**
   * 删除作物
   */
  async delete(cropId: number): Promise<boolean> {
    const affectedRows = await Database.delete('crops', { field: 'id', value: cropId });
    return affectedRows > 0;
  }

  /**
   * 批量查询作物详情（包含作物类型信息）
   */
  async findCropDetailsByFarmId(farmId: number): Promise<any[]> {
    const result = await Database.query(`
      SELECT
        c.id,
        c.plot_id,
        p.plot_index,
        c.crop_type_id,
        ct.name as crop_type_name,
        ct.description as crop_type_description,
        ct.growth_time,
        ct.harvest_time,
        c.state,
        c.planted_at,
        c.growth_progress,
        c.harvest_count,
        c.last_harvested_at,
        c.withered_at,
        c.created_at,
        c.updated_at
      FROM crops c
      INNER JOIN plots p ON c.plot_id = p.id
      INNER JOIN crop_types ct ON c.crop_type_id = ct.id
      WHERE p.farm_id = ?
      ORDER BY p.plot_index
    `, [farmId]);

    return result.rows;
  }

  /**
   * 查询需要收获的作物
   */
  async findReadyCrops(farmId: number): Promise<any[]> {
    const result = await Database.query(`
      SELECT
        c.id,
        c.plot_id,
        p.plot_index,
        c.crop_type_id,
        ct.name as crop_type_name,
        c.state,
        c.planted_at,
        c.growth_progress,
        c.harvest_count,
        c.last_harvested_at
      FROM crops c
      INNER JOIN plots p ON c.plot_id = p.id
      INNER JOIN crop_types ct ON c.crop_type_id = ct.id
      WHERE p.farm_id = ? AND c.state = ?
      ORDER BY p.plot_index
    `, [farmId, CropState.READY]);

    return result.rows;
  }

  /**
   * 查询枯萎的作物
   */
  async findWitheredCrops(farmId: number): Promise<any[]> {
    const result = await Database.query(`
      SELECT
        c.id,
        c.plot_id,
        p.plot_index,
        c.crop_type_id,
        ct.name as crop_type_name,
        c.state,
        c.planted_at,
        c.withered_at
      FROM crops c
      INNER JOIN plots p ON c.plot_id = p.id
      INNER JOIN crop_types ct ON c.crop_type_id = ct.id
      WHERE p.farm_id = ? AND c.state = ?
      ORDER BY p.plot_index
    `, [farmId, CropState.WITHERED]);

    return result.rows;
  }

  /**
   * 查询需要检查枯萎的作物（超过收获时间2小时）
   */
  async findCropsToCheckWither(): Promise<any[]> {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const result = await Database.query(`
      SELECT c.id, c.plot_id, c.planted_at, ct.growth_time, ct.harvest_time
      FROM crops c
      INNER JOIN crop_types ct ON c.crop_type_id = ct.id
      WHERE c.state = ? AND c.withered_at IS NULL
      AND DATE_ADD(c.planted_at, INTERVAL SECOND(ct.growth_time + ct.harvest_time) SECOND) < ?
    `, [CropState.READY, twoHoursAgo]);

    return result.rows;
  }
}

export default new CropModel();