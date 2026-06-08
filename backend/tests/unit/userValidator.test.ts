/**
 * 用户验证工具单元测试
 */
import { describe, it, expect } from 'vitest';
import { validateRegisterRequest, validateLoginRequest } from '../../src/utils/userValidator.js';
import type { RegisterRequest, LoginRequest } from '../../src/types/user.js';

describe('validateRegisterRequest', () => {
  it('应该验证有效的注册数据', () => {
    const data: RegisterRequest = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
    };

    const result = validateRegisterRequest(data);

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('应该拒绝空用户名', () => {
    const data: RegisterRequest = {
      username: '',
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
    };

    const result = validateRegisterRequest(data);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('用户名不能为空');
  });

  it('应该拒绝无效的用户名格式', () => {
    const data: RegisterRequest = {
      username: 'ab',
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
    };

    const result = validateRegisterRequest(data);

    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.includes('用户名格式不正确'))).toBe(true);
  });

  it('应该拒绝空邮箱', () => {
    const data: RegisterRequest = {
      username: 'testuser',
      email: '',
      password: 'Password123',
      confirmPassword: 'Password123',
    };

    const result = validateRegisterRequest(data);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('邮箱不能为空');
  });

  it('应该拒绝无效的邮箱格式', () => {
    const data: RegisterRequest = {
      username: 'testuser',
      email: 'invalid-email',
      password: 'Password123',
      confirmPassword: 'Password123',
    };

    const result = validateRegisterRequest(data);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('邮箱格式不正确');
  });

  it('应该拒绝空密码', () => {
    const data: RegisterRequest = {
      username: 'testuser',
      email: 'test@example.com',
      password: '',
      confirmPassword: '',
    };

    const result = validateRegisterRequest(data);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('密码不能为空');
  });

  it('应该拒绝太短的密码', () => {
    const data: RegisterRequest = {
      username: 'testuser',
      email: 'test@example.com',
      password: '12345',
      confirmPassword: '12345',
    };

    const result = validateRegisterRequest(data);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('密码长度至少6位');
  });

  it('应该拒绝不匹配的密码', () => {
    const data: RegisterRequest = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'Different123',
    };

    const result = validateRegisterRequest(data);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('两次密码输入不一致');
  });

  it('应该拒绝无效的手机号', () => {
    const data: RegisterRequest = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
      phone: 'invalid-phone',
    };

    const result = validateRegisterRequest(data);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('手机号格式不正确');
  });
});

describe('validateLoginRequest', () => {
  it('应该验证有效的登录数据', () => {
    const data: LoginRequest = {
      username: 'testuser',
      password: 'Password123',
    };

    const result = validateLoginRequest(data);

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('应该拒绝空用户名', () => {
    const data: LoginRequest = {
      username: '',
      password: 'Password123',
    };

    const result = validateLoginRequest(data);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('用户名不能为空');
  });

  it('应该拒绝空密码', () => {
    const data: LoginRequest = {
      username: 'testuser',
      password: '',
    };

    const result = validateLoginRequest(data);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('密码不能为空');
  });
});