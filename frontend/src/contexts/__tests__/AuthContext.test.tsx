/**
 * 认证Context测试
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { ReactNode } from 'react';
import api from '../../services/api';

vi.mock('../../services/api', () => ({
  default: {
    post: vi.fn().mockResolvedValue({
      data: {
        data: {
          user: {},
          token: 'mock-token',
        },
      },
    }),
    defaults: {
      headers: {
        common: {},
      },
    },
  },
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

describe('AuthContext', () => {
  const createWrapper = () => {
    return ({ children }: { children: ReactNode }) => <AuthProvider>{children}</AuthProvider>;
  };

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('应该初始化为未认证状态', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
    expect(result.current.token).toBe(null);
    expect(result.current.isLoading).toBe(false);
  });

  it('应该从localStorage加载用户数据', async () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      gold: 1000,
      experience: 0,
      level: 1,
      vouchers: 0,
      avatar: null,
      bio: null,
      state: 'active',
      role: 'player',
      last_login_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    localStorage.setItem('token', 'mock-token');
    localStorage.setItem('user', JSON.stringify(mockUser));

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
    });
  });

  it('应该能够登录', async () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      gold: 1000,
      experience: 0,
      level: 1,
      vouchers: 0,
      avatar: null,
      bio: null,
      state: 'active',
      role: 'player',
      last_login_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    (api.post as any).mockResolvedValue({
      data: {
        data: {
          user: mockUser,
          token: 'mock-token',
        },
      },
    });

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await act(async () => {
      await result.current.login('testuser', 'password');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe('mock-token');
    expect(localStorage.getItem('token')).toBe('mock-token');
    expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
  });

  it('应该能够注册', async () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      gold: 1000,
      experience: 0,
      level: 1,
      vouchers: 0,
      avatar: null,
      bio: null,
      state: 'active',
      role: 'player',
      last_login_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    (api.post as any).mockResolvedValue({
      data: {
        data: {
          user: mockUser,
          token: 'mock-token',
        },
      },
    });

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await act(async () => {
      await result.current.register('testuser', 'test@example.com', 'password');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe('mock-token');
  });

  it('应该能够登出', async () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      gold: 1000,
      experience: 0,
      level: 1,
      vouchers: 0,
      avatar: null,
      bio: null,
      state: 'active',
      role: 'player',
      last_login_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    localStorage.setItem('token', 'mock-token');
    localStorage.setItem('user', JSON.stringify(mockUser));

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
    expect(result.current.token).toBe(null);
    expect(localStorage.getItem('token')).toBe(null);
    expect(localStorage.getItem('user')).toBe(null);
  });

  it('应该能够清除错误', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBe(null);
  });
});