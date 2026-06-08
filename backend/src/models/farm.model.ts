/**
 * 农场数据模型
 */

import Database from '../utils/database';

/**
 * 农场数据接口（对应数据库farms表）
 */
export interface Farm {
  id: number;
  user_id: number;
  name: string;
  level: number;
  experience: number;
  max_plots: number;
  max_animal_pens: number;
  decoration_points: number;
  created_at: Date;
  updated_at: Date;
}

/**
 * 土地数据接口（对应数据库plots表）
 */
export interface Plot {
  id: number;
  farm_id: number;
  plot_index: number;
  state: 'idle' | 'planted' | 'ready' | 'withered';
  crop_id: number | null;
  planted_at: Date | null;
  ready_at: Date | null;
  harvested_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * 动物栏数据接口（对应数据库animal_pens表）
 */
export interface AnimalPen {
  id: number;
  farm_id: number;
  pen_index: number;
  level: number;
  capacity: number;
  created_at: Date;
  updated_at: Date;
}

class FarmModel {
  /**
   * 根据用户ID查询农场
   */
  async findByUserId(userId: number): Promise<Farm | null> {
    return await Database.queryOne<Farm>(
      'SELECT * FROM farms WHERE user_id = ?',
      [userId]
    );
  }

  /**
   * 创建新农场
   */
  async create(userId: number, name: string = '我的农场'): Promise<number> {
    const farmId = await Database.insert('farms', {
      user_id: userId,
      name,
      level: 1,
      experience: 0,
      max_plots: 6,
      max_animal_pens: 1,
      decoration_points: 0,
    });

    await this.createInitialPlots(farmId, 6);
    await this.createInitialAnimalPens(farmId, 1);

    return farmId;
  }

  /**
   * 创建初始土地
   */
  private async createInitialPlots(farmId: number, count: number): Promise<void> {
    const plots: Plot[] = [];
    for (let i = 0; i < count; i++) {
      plots.push({
        id: 0,
        farm_id: farmId,
        plot_index: i,
        state: 'idle',
        crop_id: null,
        planted_at: null,
        ready_at: null,
        harvested_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await Database.batchInsert('plots', plots.map(plot => ({
      farm_id: plot.farm_id,
      plot_index: plot.plot_index,
      state: plot.state,
      crop_id: plot.crop_id,
      planted_at: plot.planted_at,
      ready_at: plot.ready_at,
      harvested_at: plot.harvested_at,
    })));
  }

  /**
   * 创建初始动物栏
   */
  private async createInitialAnimalPens(farmId: number, count: number): Promise<void> {
    const pens: AnimalPen[] = [];
    for (let i = 0; i < count; i++) {
      pens.push({
        id: 0,
        farm_id: farmId,
        pen_index: i,
        level: 1,
        capacity: 2,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await Database.batchInsert('animal_pens', pens.map(pen => ({
      farm_id: pen.farm_id,
      pen_index: pen.pen_index,
      level: pen.level,
      capacity: pen.capacity,
    })));
  }

  /**
   * 更新农场名称
   */
  async updateName(farmId: number, name: string): Promise<boolean> {
    const affectedRows = await Database.update(
      'farms',
      { name },
      { field: 'id', value: farmId }
    );
    return affectedRows > 0;
  }

  /**
   * 增加农场经验
   */
  async addExperience(farmId: number, amount: number): Promise<boolean> {
    const affectedRows = await Database.query(
      'UPDATE farms SET experience = experience + ? WHERE id = ?',
      [amount, farmId]
    );
    return (affectedRows.affectedRows || 0) > 0;
  }

  /**
   * 升级农场
   */
  async levelUp(farmId: number): Promise<boolean> {
    const affectedRows = await Database.query(
      'UPDATE farms SET level = level + 1 WHERE id = ?',
      [farmId]
    );
    return (affectedRows.affectedRows || 0) > 0;
  }

  /**
   * 扩容土地
   */
  async expandPlots(farmId: number, newMax: number): Promise<boolean> {
    const affectedRows = await Database.update(
      'farms',
      { max_plots: newMax },
      { field: 'id', value: farmId }
    );
    return affectedRows > 0;
  }

  /**
   * 扩容动物栏
   */
  async expandAnimalPens(farmId: number, newMax: number): Promise<boolean> {
    const affectedRows = await Database.update(
      'farms',
      { max_animal_pens: newMax },
      { field: 'id', value: farmId }
    );
    return affectedRows > 0;
  }

  /**
   * 增加装饰点数
   */
  async addDecorationPoints(farmId: number, amount: number): Promise<boolean> {
    const affectedRows = await Database.query(
      'UPDATE farms SET decoration_points = decoration_points + ? WHERE id = ?',
      [amount, farmId]
    );
    return (affectedRows.affectedRows || 0) > 0;
  }

  /**
   * 获取农场的土地列表
   */
  async getPlots(farmId: number): Promise<Plot[]> {
    const result = await Database.query<Plot>(
      'SELECT * FROM plots WHERE farm_id = ? ORDER BY plot_index',
      [farmId]
    );
    return result.rows;
  }

  /**
   * 获取农场的动物栏列表
   */
  async getAnimalPens(farmId: number): Promise<AnimalPen[]> {
    const result = await Database.query<AnimalPen>(
      'SELECT * FROM animal_pens WHERE farm_id = ? ORDER BY pen_index',
      [farmId]
    );
    return result.rows;
  }
}

export default new FarmModel();