/**
 * 数据库操作类型定义
 */

/**
 * 数据库查询结果
 */
export interface QueryResult<T = any> {
  rows: T[];
  fields?: any[];
  affectedRows?: number;
  insertId?: number;
}

/**
 * 数据库查询参数
 */
export type QueryParams = (string | number | boolean | null | Date)[];

/**
 * WHERE条件
 */
export interface WhereCondition {
  field: string;
  operator?: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'LIKE' | 'IN' | 'NOT IN' | 'IS NULL' | 'IS NOT NULL';
  value?: any;
}

/**
 * ORDER BY条件
 */
export interface OrderByCondition {
  field: string;
  direction: 'ASC' | 'DESC';
}

/**
 * 查询选项
 */
export interface QueryOptions {
  where?: WhereCondition | WhereCondition[];
  orderBy?: OrderByCondition | OrderByCondition[];
  limit?: number;
  offset?: number;
  groupBy?: string;
  having?: string;
}