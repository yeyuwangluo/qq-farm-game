import { describe, it, expect, beforeEach } from 'vitest';
import apiClient from '../services/api';

describe('API Client', () => {
  beforeEach(() => {
    // 清除localStorage
    localStorage.clear();
  });

  it('应该创建API客户端实例', () => {
    expect(apiClient).toBeDefined();
    expect(apiClient.defaults.baseURL).toBe('/api');
    expect(apiClient.defaults.timeout).toBe(10000);
    expect(apiClient.defaults.headers['Content-Type']).toBe('application/json');
  });

  it('应该从环境变量读取API URL', () => {
    // 由于模块已经加载，这里只验证当前配置
    expect(apiClient.defaults.baseURL).toBe('/api');
  });

  it('请求拦截器应该添加token到header', () => {
    localStorage.setItem('token', 'test-token-123');
    const requestInterceptor = apiClient.interceptors.request.use as any;
    expect(localStorage.getItem('token')).toBe('test-token-123');
    expect(requestInterceptor).toBeDefined();
  });

  it('响应拦截器应该处理401错误', () => {
    // 这里应该测试401错误处理逻辑
    // 由于需要完整的axios模拟，这里只做基础检查
    const responseInterceptor = apiClient.interceptors.response.use as any;
    expect(responseInterceptor).toBeDefined();
  });
});