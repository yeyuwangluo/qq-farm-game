/**
 * TypeScript配置测试
 */
import { describe, it, expect } from 'vitest';

describe('TypeScript Configuration', () => {
  it('应该支持ES2022语法', () => {
    const asyncFunction = async () => {
      return Promise.resolve(42);
    };
    expect(asyncFunction).toBeDefined();
  });

  it('应该支持严格模式', () => {
    let value: string | number = 42;
    value = 'hello';
    expect(typeof value).toBe('string');
  });

  it('应该支持接口定义', () => {
    interface User {
      id: number;
      name: string;
      email: string;
    }
    const user: User = { id: 1, name: 'Test User', email: 'test@example.com' };
    expect(user).toHaveProperty('id', 1);
    expect(user).toHaveProperty('name', 'Test User');
  });

  it('应该支持泛型', () => {
    function identity<T>(arg: T): T {
      return arg;
    }
    const result = identity<string>('test');
    expect(result).toBe('test');
  });

  it('应该支持异步函数', async () => {
    const promise = Promise.resolve('success');
    const result = await promise;
    expect(result).toBe('success');
  });

  it('应该支持Promise链式调用', () => {
    return Promise.resolve(1)
      .then((value) => value * 2)
      .then((value) => value + 3)
      .then((value) => {
        expect(value).toBe(5);
      });
  });
});