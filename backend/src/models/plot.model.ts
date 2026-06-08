/**
 * 土地数据模型
 */

import Database from '../utils/database';
import { Plot, PlotState } from '../types/plot.types';

class PlotModel {
  /**
   * 根据农场ID查询所有土地
   */
  async findByFarmId(farmId: number): Promise<Plot[]> {
    const result = await Database.query<Plot>(
      'SELECT * FROM plots WHERE farm_id = ? ORDER BY plot_index',
      [farmId]
    );
    return result.rows;
  }

  /**
   * 根据ID查询土地
   */
  async findById(id: number): Promise<Plot | null> {
    return await Database.findById<Plot>('plots', id);
  }

  /**
   * 根据农场ID和土地索引查询土地
   */
  async findByFarmIdAndIndex(farmId: number, plotIndex: number): Promise<Plot | null> {
    return await Database.queryOne<Plot>(
      'SELECT * FROM plots WHERE farm_id = ? AND plot_index = ?',
      [farmId, plotIndex]
    );
  }

  /**
   * 创建新土地
   */
  async create(farmId: number, plotIndex: number): Promise<number> {
    return await Database.insert('plots', {
      farm_id: farmId,
      plot_index: plotIndex,
      state: PlotState.IDLE,
      crop_id: null,
      planted_at: null,
      ready_at: null,
      harvested_at: null,
    });
  }

  /**
   * 更新土地状态
   */
  async updateState(plotId: number, state: PlotState): Promise<boolean> {
    const affectedRows = await Database.update(
      'plots',
      { state },
      { field: 'id', value: plotId }
    );
    return affectedRows > 0;
  }

  /**
   * 更新作物信息
   */
  async updateCrop(plotId: number, cropId: number | null, plantedAt: Date | null, readyAt: Date | null): Promise<boolean> {
    const affectedRows = await Database.update(
      'plots',
      {
        crop_id: cropId,
        planted_at: plantedAt,
        ready_at: readyAt,
        state: cropId ? PlotState.PLANTED : PlotState.IDLE,
      },
      { field: 'id', value: plotId }
    );
    return affectedRows > 0;
  }

  /**
   * 更新收获时间
   */
  async updateHarvestedAt(plotId: number): Promise<boolean> {
    const affectedRows = await Database.update(
      'plots',
      {
        harvested_at: new Date(),
        state: PlotState.IDLE,
        crop_id: null,
        planted_at: null,
        ready_at: null,
      },
      { field: 'id', value: plotId }
    );
    return affectedRows > 0;
  }

  /**
   * 批量查询土地详情（包含作物信息）
   */
  async findPlotDetailsByFarmId(farmId: number): Promise<any[]> {
    const result = await Database.query(`
      SELECT
        p.id,
        p.farm_id,
        p.plot_index,
        p.state,
        p.crop_id,
        ct.name as crop_name,
        p.planted_at,
        p.ready_at,
        p.harvested_at,
        p.created_at,
        p.updated_at
      FROM plots p
      LEFT JOIN crop_types ct ON p.crop_id = ct.id
      WHERE p.farm_id = ?
      ORDER BY p.plot_index
    `, [farmId]);

    return result.rows;
  }

  /**
   * 统计农场的土地数量
   */
  async countByFarmId(farmId: number): Promise<number> {
    return await Database.count('plots', { field: 'farm_id', value: farmId });
  }

  /**
   * 统计各种状态的土地数量
   */
  async countByState(farmId: number, state: PlotState): Promise<number> {
    return await Database.count('plots', [
      { field: 'farm_id', value: farmId },
      { field: 'state', value: state },
    ]);
  }

  /**
   * 查询需要收获的土地
   */
  async findReadyPlots(farmId: number): Promise<Plot[]> {
    const result = await Database.query<Plot>(
      'SELECT * FROM plots WHERE farm_id = ? AND state = ?',
      [farmId, PlotState.READY]
    );
    return result.rows;
  }

  /**
   * 查询枯萎的土地
   */
  async findWitheredPlots(farmId: number): Promise<Plot[]> {
    const result = await Database.query<Plot>(
      'SELECT * FROM plots WHERE farm_id = ? AND state = ?',
      [farmId, PlotState.WITHERED]
    );
    return result.rows;
  }

  /**
   * 查询需要检查枯萎的土地（超过收获时间2小时）
   */
  async findPlotsToCheckWither(): Promise<Plot[]> {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const result = await Database.query<Plot>(
      `SELECT * FROM plots
       WHERE state = ? AND ready_at < ?
       AND harvested_at IS NULL`,
      [PlotState.READY, twoHoursAgo]
    );
    return result.rows;
  }

  /**
   * 查找所有已经成熟但未通知的作物
   */
  async findReadyPlotsWithoutNotification(): Promise<any[]> {
    const result = await Database.query(`
      SELECT p.*, ct.name as crop_name, ct.id as crop_type_id
      FROM plots p
      JOIN crop_types ct ON p.crop_id = ct.id
      WHERE p.state = ? AND p.notified_at IS NULL
    `, [PlotState.READY]);
    return result.rows;
  }

  /**
   * 标记作物为已通知
   */
  async markCropAsNotified(plotId: number): Promise<boolean> {
    const affectedRows = await Database.update(
      'plots',
      { notified_at: new Date() },
      { field: 'id', value: plotId }
    );
    return affectedRows > 0;
  }

  /**
   * 获取作物类型信息
   */
  async getCropTypeById(cropId: number): Promise<any> {
    return await Database.findById('crop_types', cropId);
  }

  /**
   * 删除土地
   */
  async delete(plotId: number): Promise<boolean> {
    const affectedRows = await Database.delete('plots', { field: 'id', value: plotId });
    return affectedRows > 0;
  }
}

export default new PlotModel();