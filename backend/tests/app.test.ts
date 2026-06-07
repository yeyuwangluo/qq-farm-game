/**
 * Express应用基础测试
 */
import { describe, it, expect } from 'vitest';
import app from '../src/app';

describe('Express Application', () => {
  it('应该存在Express应用', () => {
    expect(app).toBeDefined();
  });

  it('应该有健康检查端点', () => {
    const routes = app._router.stack;
    const healthRoute = routes.some((route: any) => 
      route.route && route.route.path === '/health'
    );
    expect(healthRoute).toBe(true);
  });
});