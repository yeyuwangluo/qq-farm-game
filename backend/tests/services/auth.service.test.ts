/**
 * 认证服务单元测试
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import AuthService from '../../src/services/auth.service';
import UserModel from '../../src/models/user.model';
import FarmModel from '../../src/models/farm.model';
import Database from '../../src/utils/database';
import { hashPassword } from '../../src/utils';
import { RegisterRequest, LoginRequest, UserStatus } from '../../src/types/user.types';
import { AppError } from '../../src/utils/response';
import * as jwtUtils from '../../src/utils/jwt';

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('应该成功注册新用户', async () => {
      const userData: RegisterRequest = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      vi.spyOn(UserModel, 'existsByUsername').mockResolvedValue(false);
      vi.spyOn(UserModel, 'existsByEmail').mockResolvedValue(false);
      vi.spyOn(Database, 'beginTransaction').mockResolvedValue();
      vi.spyOn(Database, 'commitTransaction').mockResolvedValue();
      vi.spyOn(UserModel, 'create').mockResolvedValue(1);
      vi.spyOn(FarmModel, 'create').mockResolvedValue(1);
      vi.spyOn(UserModel, 'findById').mockResolvedValue({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'hashedpassword',
        gold: 1000,
        experience: 0,
        level: 1,
        vouchers: 0,
        avatar: null,
        bio: null,
        state: UserStatus.ACTIVE,
        role: 'player',
        last_login_at: new Date(),
        last_logout_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      });

      const result = await AuthService.register(userData);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user.username).toBe('testuser');
      expect(result.user.email).toBe('test@example.com');
      expect(result.token).toBeTruthy();
    });

    it('当用户名已存在时应该抛出错误', async () => {
      const userData: RegisterRequest = {
        username: 'existinguser',
        email: 'test@example.com',
        password: 'password123',
      };

      vi.spyOn(UserModel, 'existsByUsername').mockResolvedValue(true);

      await expect(AuthService.register(userData)).rejects.toThrow('用户名已存在');
    });

    it('当邮箱已存在时应该抛出错误', async () => {
      const userData: RegisterRequest = {
        username: 'testuser',
        email: 'existing@example.com',
        password: 'password123',
      };

      vi.spyOn(UserModel, 'existsByUsername').mockResolvedValue(false);
      vi.spyOn(UserModel, 'existsByEmail').mockResolvedValue(true);

      await expect(AuthService.register(userData)).rejects.toThrow('邮箱已被注册');
    });

    it('当用户名太短时应该抛出错误', async () => {
      const userData: RegisterRequest = {
        username: 'ab',
        email: 'test@example.com',
        password: 'password123',
      };

      await expect(AuthService.register(userData)).rejects.toThrow('用户名长度必须在3-20个字符之间');
    });

    it('当用户名太长时应该抛出错误', async () => {
      const userData: RegisterRequest = {
        username: 'a'.repeat(21),
        email: 'test@example.com',
        password: 'password123',
      };

      await expect(AuthService.register(userData)).rejects.toThrow('用户名长度必须在3-20个字符之间');
    });

    it('当用户名包含非法字符时应该抛出错误', async () => {
      const userData: RegisterRequest = {
        username: 'test@user',
        email: 'test@example.com',
        password: 'password123',
      };

      await expect(AuthService.register(userData)).rejects.toThrow('用户名只能包含字母、数字和下划线');
    });

    it('当邮箱格式不正确时应该抛出错误', async () => {
      const userData: RegisterRequest = {
        username: 'testuser',
        email: 'invalidemail',
        password: 'password123',
      };

      await expect(AuthService.register(userData)).rejects.toThrow('邮箱格式不正确');
    });

    it('当密码太短时应该抛出错误', async () => {
      const userData: RegisterRequest = {
        username: 'testuser',
        email: 'test@example.com',
        password: '12345',
      };

      await expect(AuthService.register(userData)).rejects.toThrow('密码长度至少6个字符');
    });

    it('当缺少必填字段时应该抛出错误', async () => {
      const userData: Partial<RegisterRequest> = {
        username: 'testuser',
        email: 'test@example.com',
      };

      await expect(AuthService.register(userData as RegisterRequest)).rejects.toThrow('用户名、邮箱和密码不能为空');
    });
  });

  describe('login', () => {
    it('应该成功登录', async () => {
      const loginData: LoginRequest = {
        username: 'testuser',
        password: 'password123',
      };

      const passwordHash = await hashPassword('password123');

      vi.spyOn(UserModel, 'findByUsername').mockResolvedValue({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password_hash: passwordHash,
        gold: 1000,
        experience: 0,
        level: 1,
        vouchers: 0,
        avatar: null,
        bio: null,
        state: UserStatus.ACTIVE,
        role: 'player',
        last_login_at: new Date(),
        last_logout_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      });

      vi.spyOn(UserModel, 'updateLastLogin').mockResolvedValue();

      const result = await AuthService.login(loginData);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user.username).toBe('testuser');
      expect(result.token).toBeTruthy();
    });

    it('当用户不存在时应该抛出错误', async () => {
      const loginData: LoginRequest = {
        username: 'nonexistent',
        password: 'password123',
      };

      vi.spyOn(UserModel, 'findByUsername').mockResolvedValue(null);

      await expect(AuthService.login(loginData)).rejects.toThrow('用户名或密码错误');
    });

    it('当密码错误时应该抛出错误', async () => {
      const loginData: LoginRequest = {
        username: 'testuser',
        password: 'wrongpassword',
      };

      const passwordHash = await hashPassword('password123');

      vi.spyOn(UserModel, 'findByUsername').mockResolvedValue({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password_hash: passwordHash,
        gold: 1000,
        experience: 0,
        level: 1,
        vouchers: 0,
        avatar: null,
        bio: null,
        state: UserStatus.ACTIVE,
        role: 'player',
        last_login_at: new Date(),
        last_logout_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      });

      await expect(AuthService.login(loginData)).rejects.toThrow('用户名或密码错误');
    });

    it('当账号被封禁时应该抛出错误', async () => {
      const loginData: LoginRequest = {
        username: 'banneduser',
        password: 'password123',
      };

      const passwordHash = await hashPassword('password123');

      vi.spyOn(UserModel, 'findByUsername').mockResolvedValue({
        id: 1,
        username: 'banneduser',
        email: 'banned@example.com',
        password_hash: passwordHash,
        gold: 1000,
        experience: 0,
        level: 1,
        vouchers: 0,
        avatar: null,
        bio: null,
        state: UserStatus.BANNED,
        role: 'player',
        last_login_at: new Date(),
        last_logout_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      });

      await expect(AuthService.login(loginData)).rejects.toThrow('账号已被封禁');
    });

    it('当账号被暂停时应该抛出错误', async () => {
      const loginData: LoginRequest = {
        username: 'suspendeduser',
        password: 'password123',
      };

      const passwordHash = await hashPassword('password123');

      vi.spyOn(UserModel, 'findByUsername').mockResolvedValue({
        id: 1,
        username: 'suspendeduser',
        email: 'suspended@example.com',
        password_hash: passwordHash,
        gold: 1000,
        experience: 0,
        level: 1,
        vouchers: 0,
        avatar: null,
        bio: null,
        state: UserStatus.SUSPENDED,
        role: 'player',
        last_login_at: new Date(),
        last_logout_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      });

      await expect(AuthService.login(loginData)).rejects.toThrow('账号已被暂停');
    });
  });

  describe('verifyTokenAndGetUser', () => {
    it('应该成功验证Token并返回用户信息', async () => {
      const token = 'valid.token.here';

      vi.spyOn(jwtUtils, 'verifyToken').mockReturnValue({
        userId: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'player',
      });

      vi.spyOn(UserModel, 'findById').mockResolvedValue({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'hashedpassword',
        gold: 1000,
        experience: 0,
        level: 1,
        vouchers: 0,
        avatar: null,
        bio: null,
        state: UserStatus.ACTIVE,
        role: 'player',
        last_login_at: new Date(),
        last_logout_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      });

      const user = await AuthService.verifyTokenAndGetUser(token);

      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('username');
      expect(user.username).toBe('testuser');
    });

    it('当Token过期时应该抛出错误', async () => {
      const expiredToken = 'expired.token.here';

      vi.spyOn(jwtUtils, 'verifyToken').mockImplementation(() => {
        const error = new Error();
        error.name = 'TokenExpiredError';
        throw error;
      });

      await expect(AuthService.verifyTokenAndGetUser(expiredToken)).rejects.toThrow();
    });

    it('当用户不存在时应该抛出错误', async () => {
      const token = 'valid.token.here';

      vi.spyOn(jwtUtils, 'verifyToken').mockReturnValue({
        userId: 999,
        username: 'testuser',
        email: 'test@example.com',
        role: 'player',
      });

      vi.spyOn(UserModel, 'findById').mockResolvedValue(null);

      await expect(AuthService.verifyTokenAndGetUser(token)).rejects.toThrow('用户不存在');
    });

    it('当用户状态异常时应该抛出错误', async () => {
      const token = 'valid.token.here';

      vi.spyOn(jwtUtils, 'verifyToken').mockReturnValue({
        userId: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'player',
      });

      vi.spyOn(UserModel, 'findById').mockResolvedValue({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'hashedpassword',
        gold: 1000,
        experience: 0,
        level: 1,
        vouchers: 0,
        avatar: null,
        bio: null,
        state: UserStatus.BANNED,
        role: 'player',
        last_login_at: new Date(),
        last_logout_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      });

      await expect(AuthService.verifyTokenAndGetUser(token)).rejects.toThrow('账号状态异常');
    });
  });

  describe('getCurrentUser', () => {
    it('应该成功获取当前用户信息', async () => {
      vi.spyOn(UserModel, 'findById').mockResolvedValue({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'hashedpassword',
        gold: 1000,
        experience: 0,
        level: 1,
        vouchers: 0,
        avatar: null,
        bio: null,
        state: UserStatus.ACTIVE,
        role: 'player',
        last_login_at: new Date(),
        last_logout_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      });

      const user = await AuthService.getCurrentUser(1);

      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('username');
      expect(user.username).toBe('testuser');
    });

    it('当用户不存在时应该抛出错误', async () => {
      vi.spyOn(UserModel, 'findById').mockResolvedValue(null);

      await expect(AuthService.getCurrentUser(999)).rejects.toThrow('用户不存在');
    });
  });

  describe('logout', () => {
    it('应该成功登出', async () => {
      vi.spyOn(UserModel, 'updateLastLogout').mockResolvedValue();

      await expect(AuthService.logout(1)).resolves.not.toThrow();
    });
  });
});