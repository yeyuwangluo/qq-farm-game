/**
 * 响应工具函数测试
 */
import { describe, it, expect } from 'vitest';
import {
  successResponse,
  errorResponse,
  paginatedResponse,
  noDataResponse,
} from '../../src/utils/response';

describe('Response Utils', () => {
  describe('successResponse', () => {
    it('应该生成成功响应', () => {
      const data = { id: 1, name: 'Test' };
      const response = successResponse('Success', data);
      expect(response.success).toBe(true);
      expect(response.message).toBe('Success');
      expect(response.data).toEqual(data);
      expect(response.timestamp).toBeDefined();
    });

    it('应该生成成功响应（无数据）', () => {
      const response = successResponse('Success');
      expect(response.success).toBe(true);
      expect(response.message).toBe('Success');
      expect(response.data).toBeUndefined();
      expect(response.timestamp).toBeDefined();
    });
  });

  describe('errorResponse', () => {
    it('应该生成错误响应', () => {
      const response = errorResponse('ERR_001', 'Test error');
      expect(response.success).toBe(false);
      expect(response.error.code).toBe('ERR_001');
      expect(response.error.message).toBe('Test error');
      expect(response.error.timestamp).toBeDefined();
    });
  });

  describe('paginatedResponse', () => {
    it('应该生成分页响应', () => {
      const items = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const response = paginatedResponse(items, 1, 10, 30);
      expect(response.success).toBe(true);
      expect(response.data.items).toEqual(items);
      expect(response.data.pagination.page).toBe(1);
      expect(response.data.pagination.pageSize).toBe(10);
      expect(response.data.pagination.total).toBe(30);
      expect(response.data.pagination.totalPages).toBe(3);
      expect(response.timestamp).toBeDefined();
    });
  });

  describe('noDataResponse', () => {
    it('应该生成无数据响应', () => {
      const response = noDataResponse();
      expect(response.success).toBe(true);
      expect(response.data).toBeNull();
      expect(response.timestamp).toBeDefined();
    });
  });
});
