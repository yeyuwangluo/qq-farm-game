/**
 * MySQL数据库连接配置
 */
import mysql from 'mysql2/promise';
import config from './index.js';

let pool: mysql.Pool | null = null;

/**
 * 创建数据库连接池
 */
export function createPool(): mysql.Pool {
  if (pool) {
    return pool;
  }

  pool = mysql.createPool({
    host: config.database.host,
    port: config.database.port,
    user: config.database.user,
    password: config.database.password,
    database: config.database.name,
    waitForConnections: true,
    connectionLimit: config.database.connectionLimit,
    queueLimit: config.database.queueLimit,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });

  return pool;
}

/**
 * 获取数据库连接池
 */
export function getPool(): mysql.Pool {
  if (!pool) {
    pool = createPool();
  }
  return pool;
}

/**
 * 执行查询
 */
export async function query<T = any>(sql: string, params?: any[]): Promise<T[]> {
  const pool = getPool();
  const [rows] = await pool.execute(sql, params);
  return rows as T[];
}

/**
 * 执行查询并返回单行
 */
export async function queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * 执行插入操作
 */
export async function insert<T = any>(table: string, data: Record<string, any>): Promise<T> {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map(() => '?').join(',');

  const sql = `INSERT INTO ${table} (${keys.join(',')}) VALUES (${placeholders})`;
  const result = await query<{ insertId: number }>(sql, values);

  return {
    id: result.insertId,
    ...data,
  } as T;
}

/**
 * 执行更新操作
 */
export async function update(
  table: string,
  data: Record<string, any>,
  where: Record<string, any>
): Promise<number> {
  const keys = Object.keys(data);
  const whereKeys = Object.keys(where);
  const values = [...Object.values(data), ...Object.values(where)];

  const setClause = keys.map(key => `${key} = ?`).join(',');
  const whereClause = whereKeys.map(key => `${key} = ?`).join(' AND ');

  const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;
  const result = await query<{ affectedRows: number }>(sql, values);

  return result.affectedRows;
}

/**
 * 执行删除操作
 */
export async function deleteRow(table: string, where: Record<string, any>): Promise<number> {
  const whereKeys = Object.keys(where);
  const values = Object.values(where);

  const whereClause = whereKeys.map(key => `${key} = ?`).join(' AND ');

  const sql = `DELETE FROM ${table} WHERE ${whereClause}`;
  const result = await query<{ affectedRows: number }>(sql, values);

  return result.affectedRows;
}

/**
 * 开始事务
 */
export async function beginTransaction(): Promise<mysql.PoolConnection> {
  const pool = getPool();
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  return connection;
}

/**
 * 提交事务
 */
export async function commitTransaction(connection: mysql.PoolConnection): Promise<void> {
  await connection.commit();
  connection.release();
}

/**
 * 回滚事务
 */
export async function rollbackTransaction(connection: mysql.PoolConnection): Promise<void> {
  await connection.rollback();
  connection.release();
}

/**
 * 关闭数据库连接
 */
export async function closeDatabase(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
