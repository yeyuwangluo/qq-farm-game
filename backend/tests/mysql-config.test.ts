/**
 * MySQL配置测试
 */
import { describe, it, expect } from 'vitest';
import {
  createPool,
  getPool,
  query,
  queryOne,
  insert,
  update,
  deleteRow,
  beginTransaction,
  commitTransaction,
  rollbackTransaction,
  closeDatabase,
} from '../src/config/mysql';

describe('MySQL Configuration', () => {
  describe('导出函数', () => {
    it('应该导出createPool函数', () => {
      expect(createPool).toBeDefined();
      expect(typeof createPool).toBe('function');
    });

    it('应该导出getPool函数', () => {
      expect(getPool).toBeDefined();
      expect(typeof getPool).toBe('function');
    });

    it('应该导出query函数', () => {
      expect(query).toBeDefined();
      expect(typeof query).toBe('function');
    });

    it('应该导出queryOne函数', () => {
      expect(queryOne).toBeDefined();
      expect(typeof queryOne).toBe('function');
    });

    it('应该导出insert函数', () => {
      expect(insert).toBeDefined();
      expect(typeof insert).toBe('function');
    });

    it('应该导出update函数', () => {
      expect(update).toBeDefined();
      expect(typeof update).toBe('function');
    });

    it('应该导出deleteRow函数', () => {
      expect(deleteRow).toBeDefined();
      expect(typeof deleteRow).toBe('function');
    });

    it('应该导出beginTransaction函数', () => {
      expect(beginTransaction).toBeDefined();
      expect(typeof beginTransaction).toBe('function');
    });

    it('应该导出commitTransaction函数', () => {
      expect(commitTransaction).toBeDefined();
      expect(typeof commitTransaction).toBe('function');
    });

    it('应该导出rollbackTransaction函数', () => {
      expect(rollbackTransaction).toBeDefined();
      expect(typeof rollbackTransaction).toBe('function');
    });

    it('应该导出closeDatabase函数', () => {
      expect(closeDatabase).toBeDefined();
      expect(typeof closeDatabase).toBe('function');
    });
  });
});