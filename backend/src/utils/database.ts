/**
 * 数据库操作工具类
 */

import { getMySQLConnection } from '../config/mysql';
import { QueryResult, QueryParams, WhereCondition, OrderByCondition, QueryOptions } from '../types/database.types';

class Database {
  /**
   * 执行查询
   */
  async query<T = any>(sql: string, params?: QueryParams): Promise<QueryResult<T>> {
    const connection = getMySQLConnection();
    try {
      const [rows, fields] = await connection.execute(sql, params || []);
      return {
        rows: rows as T[],
        fields: fields as any[],
      };
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  /**
   * 查询单条记录
   */
  async queryOne<T = any>(sql: string, params?: QueryParams): Promise<T | null> {
    const result = await this.query<T>(sql, params);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  /**
   * 插入数据
   */
  async insert(table: string, data: Record<string, any>): Promise<number> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');

    const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
    const result = await this.query(sql, values);

    if (result.insertId !== undefined) {
      return result.insertId;
    }

    throw new Error('Failed to insert data');
  }

  /**
   * 批量插入数据
   */
  async batchInsert(table: string, data: Record<string, any>[]): Promise<void> {
    if (data.length === 0) return;

    const keys = Object.keys(data[0]);
    const placeholders = keys.map(() => '?').join(', ');
    const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;

    const connection = getMySQLConnection();
    await connection.beginTransaction();

    try {
      for (const row of data) {
        const values = keys.map(key => row[key]);
        await connection.execute(sql, values);
      }
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  }

  /**
   * 更新数据
   */
  async update(table: string, data: Record<string, any>, where: WhereCondition | WhereCondition[]): Promise<number> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const whereConditions = Array.isArray(where) ? where : [where];
    const whereClause = whereConditions.map(cond => {
      if (cond.operator === 'IS NULL' || cond.operator === 'IS NOT NULL') {
        return `${cond.field} ${cond.operator}`;
      }
      return `${cond.field} ${cond.operator || '='} ?`;
    }).join(' AND ');

    const whereValues = whereConditions
      .filter(cond => cond.value !== undefined && cond.operator !== 'IS NULL' && cond.operator !== 'IS NOT NULL')
      .map(cond => cond.value);

    const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;
    const result = await this.query(sql, [...values, ...whereValues]);

    return result.affectedRows || 0;
  }

  /**
   * 删除数据
   */
  async delete(table: string, where: WhereCondition | WhereCondition[]): Promise<number> {
    const whereConditions = Array.isArray(where) ? where : [where];
    const whereClause = whereConditions.map(cond => {
      if (cond.operator === 'IS NULL' || cond.operator === 'IS NOT NULL') {
        return `${cond.field} ${cond.operator}`;
      }
      return `${cond.field} ${cond.operator || '='} ?`;
    }).join(' AND ');

    const whereValues = whereConditions
      .filter(cond => cond.value !== undefined && cond.operator !== 'IS NULL' && cond.operator !== 'IS NOT NULL')
      .map(cond => cond.value);

    const sql = `DELETE FROM ${table} WHERE ${whereClause}`;
    const result = await this.query(sql, whereValues);

    return result.affectedRows || 0;
  }

  /**
   * 查询是否存在记录
   */
  async exists(table: string, where: WhereCondition | WhereCondition[]): Promise<boolean> {
    const whereConditions = Array.isArray(where) ? where : [where];
    const whereClause = whereConditions.map(cond => {
      if (cond.operator === 'IS NULL' || cond.operator === 'IS NOT NULL') {
        return `${cond.field} ${cond.operator}`;
      }
      return `${cond.field} ${cond.operator || '='} ?`;
    }).join(' AND ');

    const whereValues = whereConditions
      .filter(cond => cond.value !== undefined && cond.operator !== 'IS NULL' && cond.operator !== 'IS NOT NULL')
      .map(cond => cond.value);

    const sql = `SELECT COUNT(*) as count FROM ${table} WHERE ${whereClause}`;
    const result = await this.queryOne<{ count: number }>(sql, whereValues);

    return result ? result.count > 0 : false;
  }

  /**
   * 计数记录数
   */
  async count(table: string, where?: WhereCondition | WhereCondition[]): Promise<number> {
    let sql = `SELECT COUNT(*) as count FROM ${table}`;
    const params: QueryParams = [];

    if (where) {
      const whereConditions = Array.isArray(where) ? where : [where];
      const whereClause = whereConditions.map(cond => {
        if (cond.operator === 'IS NULL' || cond.operator === 'IS NOT NULL') {
          return `${cond.field} ${cond.operator}`;
        }
        return `${cond.field} ${cond.operator || '='} ?`;
      }).join(' AND ');

      const whereValues = whereConditions
        .filter(cond => cond.value !== undefined && cond.operator !== 'IS NULL' && cond.operator !== 'IS NOT NULL')
        .map(cond => cond.value);

      sql += ` WHERE ${whereClause}`;
      params.push(...whereValues);
    }

    const result = await this.queryOne<{ count: number }>(sql, params);
    return result ? result.count : 0;
  }

  /**
   * 通用查询方法
   */
  async select<T = any>(
    table: string,
    options?: QueryOptions
  ): Promise<T[]> {
    let sql = `SELECT * FROM ${table}`;
    const params: QueryParams = [];

    if (options?.where) {
      const whereConditions = Array.isArray(options.where) ? options.where : [options.where];
      const whereClause = whereConditions.map(cond => {
        if (cond.operator === 'IS NULL' || cond.operator === 'IS NOT NULL') {
          return `${cond.field} ${cond.operator}`;
        }
        return `${cond.field} ${cond.operator || '='} ?`;
      }).join(' AND ');

      const whereValues = whereConditions
        .filter(cond => cond.value !== undefined && cond.operator !== 'IS NULL' && cond.operator !== 'IS NOT NULL')
        .map(cond => cond.value);

      sql += ` WHERE ${whereClause}`;
      params.push(...whereValues);
    }

    if (options?.groupBy) {
      sql += ` GROUP BY ${options.groupBy}`;
      if (options?.having) {
        sql += ` HAVING ${options.having}`;
      }
    }

    if (options?.orderBy) {
      const orderConditions = Array.isArray(options.orderBy) ? options.orderBy : [options.orderBy];
      const orderClause = orderConditions.map(cond => `${cond.field} ${cond.direction}`).join(', ');
      sql += ` ORDER BY ${orderClause}`;
    }

    if (options?.limit) {
      sql += ` LIMIT ?`;
      params.push(options.limit);

      if (options?.offset) {
        sql += ` OFFSET ?`;
        params.push(options.offset);
      }
    }

    const result = await this.query<T>(sql, params);
    return result.rows;
  }

  /**
   * 根据ID查询
   */
  async findById<T = any>(table: string, id: number): Promise<T | null> {
    const sql = `SELECT * FROM ${table} WHERE id = ?`;
    return await this.queryOne<T>(sql, [id]);
  }

  /**
   * 开始事务
   */
  async beginTransaction(): Promise<void> {
    const connection = getMySQLConnection();
    await connection.beginTransaction();
  }

  /**
   * 提交事务
   */
  async commitTransaction(): Promise<void> {
    const connection = getMySQLConnection();
    await connection.commit();
  }

  /**
   * 回滚事务
   */
  async rollbackTransaction(): Promise<void> {
    const connection = getMySQLConnection();
    await connection.rollback();
  }
}

export default new Database();