/**
 * 动物数据模型
 */

import Database from '../utils/database';
import { Animal, AnimalState } from '../types/animal.types';

class AnimalModel {
  /**
   * 根据ID查询动物
   */
  async findById(id: number): Promise<Animal | null> {
    return await Database.findById<Animal>('animals', id);
  }

  /**
   * 根据用户ID查询动物列表
   */
  async findByUserId(userId: number): Promise<Animal[]> {
    const result = await Database.query<Animal>(
      'SELECT * FROM animals WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  }

  /**
   * 根据动物栏ID查询动物列表
   */
  async findByPenId(penId: number): Promise<Animal[]> {
    const result = await Database.query<Animal>(
      'SELECT * FROM animals WHERE animal_pen_id = ? ORDER BY created_at ASC',
      [penId]
    );
    return result.rows;
  }

  /**
   * 查询用户的动物详情（包含动物类型信息）
   */
  async findUserAnimalsWithDetails(userId: number): Promise<any[]> {
    const result = await Database.query<any>(
      `SELECT 
        a.*,
        at.name as animal_type_name,
        at.description as animal_type_description,
        at.product_name,
        at.product_price,
        at.product_time,
        at.product_yield,
        at.experience_reward,
        at.food_type,
        at.food_consumption
       FROM animals a
       JOIN animal_types at ON a.animal_type_id = at.id
       WHERE a.user_id = ?
       ORDER BY a.created_at DESC`,
      [userId]
    );
    return result.rows;
  }

  /**
   * 查询动物栏的动物详情
   */
  async findPenAnimalsWithDetails(penId: number): Promise<any[]> {
    const result = await Database.query<any>(
      `SELECT 
        a.*,
        at.name as animal_type_name,
        at.description as animal_type_description,
        at.product_name,
        at.product_price,
        at.product_time,
        at.product_yield,
        at.experience_reward,
        at.food_type,
        at.food_consumption
       FROM animals a
       JOIN animal_types at ON a.animal_type_id = at.id
       WHERE a.animal_pen_id = ?
       ORDER BY a.created_at ASC`,
      [penId]
    );
    return result.rows;
  }

  /**
   * 创建动物
   */
  async create(data: {
    user_id: number;
    animal_pen_id: number;
    animal_type_id: number;
    name?: string;
  }): Promise<number> {
    return await Database.insert('animals', {
      user_id: data.user_id,
      animal_pen_id: data.animal_pen_id,
      animal_type_id: data.animal_type_id,
      name: data.name || null,
      hunger_level: 100,
      product_progress: 0,
      state: AnimalState.HUNGRY,
      last_fed_at: new Date(),
      last_product_at: null,
    });
  }

  /**
   * 更新动物
   */
  async update(id: number, data: Partial<Animal>): Promise<boolean> {
    const affectedRows = await Database.update(
      'animals',
      data,
      { field: 'id', value: id }
    );
    return affectedRows > 0;
  }

  /**
   * 更新动物状态
   */
  async updateState(id: number, state: AnimalState): Promise<boolean> {
    const affectedRows = await Database.update(
      'animals',
      { state, updated_at: new Date() },
      { field: 'id', value: id }
    );
    return affectedRows > 0;
  }

  /**
   * 喂养动物
   */
  async feed(id: number, foodConsumption: number): Promise<boolean> {
    const affectedRows = await Database.update(
      'animals',
      {
        hunger_level: 100,
        last_fed_at: new Date(),
        state: AnimalState.PRODUCING,
        updated_at: new Date(),
      },
      { field: 'id', value: id }
    );
    return affectedRows > 0;
  }

  /**
   * 更新动物产出进度
   */
  async updateProductProgress(id: number, progress: number): Promise<boolean> {
    const affectedRows = await Database.update(
      'animals',
      { product_progress: progress, updated_at: new Date() },
      { field: 'id', value: id }
    );
    return affectedRows > 0;
  }

  /**
   * 设置产品就绪
   */
  async setProductReady(id: number): Promise<boolean> {
    const affectedRows = await Database.update(
      'animals',
      {
        product_progress: 100,
        state: AnimalState.READY,
        updated_at: new Date(),
      },
      { field: 'id', value: id }
    );
    return affectedRows > 0;
  }

  /**
   * 重置产品进度
   */
  async resetProductProgress(id: number): Promise<boolean> {
    const affectedRows = await Database.update(
      'animals',
      {
        product_progress: 0,
        last_product_at: new Date(),
        state: AnimalState.PRODUCING,
        updated_at: new Date(),
      },
      { field: 'id', value: id }
    );
    return affectedRows > 0;
  }

  /**
   * 删除动物
   */
  async delete(id: number): Promise<boolean> {
    const affectedRows = await Database.delete(
      'animals',
      { field: 'id', value: id }
    );
    return affectedRows > 0;
  }

  /**
   * 查询需要检查饥饿度的动物
   */
  async findAnimalsToCheckHunger(): Promise<Animal[]> {
    const result = await Database.query<Animal>(
      'SELECT * FROM animals WHERE state IN (?, ?)',
      [AnimalState.PRODUCING, AnimalState.READY]
    );
    return result.rows;
  }

  /**
   * 查询需要更新产出进度的动物
   */
  async findProducingAnimals(): Promise<any[]> {
    const result = await Database.query<any>(
      `SELECT a.*, at.product_time 
       FROM animals a
       JOIN animal_types at ON a.animal_type_id = at.id
       WHERE a.state = ? AND a.last_fed_at IS NOT NULL`,
      [AnimalState.PRODUCING]
    );
    return result.rows;
  }

  /**
   * 查询需要重置为饥饿状态的动物
   */
  async findStarvingAnimals(): Promise<Animal[]> {
    const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);
    const result = await Database.query<Animal>(
      'SELECT * FROM animals WHERE state = ? AND last_fed_at < ?',
      [AnimalState.PRODUCING, fourHoursAgo]
    );
    return result.rows;
  }
}

export default new AnimalModel();