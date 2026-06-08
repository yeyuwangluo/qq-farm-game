/**
 * 物品数据模型
 */

import Database from '../utils/database';

/**
 * 物品类型枚举
 */
export enum ItemType {
  SEED = 'seed',
  FERTILIZER = 'fertilizer',
  ACCELERATOR = 'accelerator',
  FOOD = 'food',
  TOOL = 'tool',
  SPECIAL = 'special',
  PRODUCT = 'product',
}

/**
 * 物品类型接口（对应数据库item_types表）
 */
export interface ItemTypeModel {
  id: number;
  name: string;
  description: string;
  type: ItemType;
  effect: string; // 效果描述（JSON格式）
  price: number; // 购买价格
  sellable: boolean;
  created_at: Date;
  updated_at: Date;
}

/**
 * 物品接口（对应数据库items表）
 */
export interface Item {
  id: number;
  user_id: number;
  item_type_id: number;
  quantity: number;
  created_at: Date;
  updated_at: Date;
}

class ItemModel {
  /**
   * 查询用户物品
   */
  async findByUserId(userId: number): Promise<Item[]> {
    const result = await Database.query<Item>(
      'SELECT * FROM items WHERE user_id = ? ORDER BY item_type_id',
      [userId]
    );
    return result.rows;
  }

  /**
   * 查询用户特定物品
   */
  async findByUserIdAndItemTypeId(userId: number, itemTypeId: number): Promise<Item | null> {
    return await Database.queryOne<Item>(
      'SELECT * FROM items WHERE user_id = ? AND item_type_id = ?',
      [userId, itemTypeId]
    );
  }

  /**
   * 根据类型查询用户物品
   */
  async findByUserIdAndType(userId: number, type: ItemType): Promise<Item[]> {
    const result = await Database.query<Item>(`
      SELECT i.*
      FROM items i
      INNER JOIN item_types it ON i.item_type_id = it.id
      WHERE i.user_id = ? AND it.type = ?
      ORDER BY i.item_type_id
    `, [userId, type]);

    return result.rows;
  }

  /**
   * 添加物品
   */
  async add(userId: number, itemTypeId: number, quantity: number = 1): Promise<boolean> {
    const existingItem = await this.findByUserIdAndItemTypeId(userId, itemTypeId);

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      const affectedRows = await Database.update(
        'items',
        { quantity: newQuantity },
        { field: 'id', value: existingItem.id }
      );
      return (affectedRows || 0) > 0;
    } else {
      await Database.insert('items', {
        user_id: userId,
        item_type_id: itemTypeId,
        quantity: quantity,
      });
      return true;
    }
  }

  /**
   * 减少物品
   */
  async reduce(userId: number, itemTypeId: number, quantity: number = 1): Promise<boolean> {
    const existingItem = await this.findByUserIdAndItemTypeId(userId, itemTypeId);

    if (!existingItem) {
      return false;
    }

    if (existingItem.quantity < quantity) {
      return false;
    }

    const newQuantity = existingItem.quantity - quantity;

    if (newQuantity === 0) {
      const affectedRows = await Database.delete('items', { field: 'id', value: existingItem.id });
      return (affectedRows || 0) > 0;
    } else {
      const affectedRows = await Database.update(
        'items',
        { quantity: newQuantity },
        { field: 'id', value: existingItem.id }
      );
      return (affectedRows || 0) > 0;
    }
  }

  /**
   * 检查物品数量
   */
  async getQuantity(userId: number, itemTypeId: number): Promise<number> {
    const item = await this.findByUserIdAndItemTypeId(userId, itemTypeId);
    return item ? item.quantity : 0;
  }

  /**
   * 根据ID查询物品类型
   */
  async findItemTypeById(id: number): Promise<ItemTypeModel | null> {
    return await Database.findById<ItemTypeModel>('item_types', id);
  }

  /**
   * 查询所有物品类型
   */
  async findAllItemTypes(): Promise<ItemTypeModel[]> {
    const result = await Database.query<ItemTypeModel>(
      'SELECT * FROM item_types ORDER BY type, name'
    );
    return result.rows;
  }

  /**
   * 根据类型查询物品类型
   */
  async findItemTypesByType(type: ItemType): Promise<ItemTypeModel[]> {
    const result = await Database.query<ItemTypeModel>(
      'SELECT * FROM item_types WHERE type = ? ORDER BY name',
      [type]
    );
    return result.rows;
  }
}

export default new ItemModel();