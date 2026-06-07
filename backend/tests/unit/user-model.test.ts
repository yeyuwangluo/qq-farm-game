/**
 * 用户模型单元测试（不依赖真实数据库）
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import UserModel from '../../src/models/user.model';
import Database from '../../src/utils/database';
import { UserStatus, UserRole } from '../../src/types/user.types';

describe('UserModel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('existsByUsername', () => {
    it('应该返回true当用户名存在时', async () => {
      vi.spyOn(Database, 'exists').mockResolvedValue(true);

      const result = await UserModel.existsByUsername('testuser');

      expect(result).toBe(true);
      expect(Database.exists).toHaveBeenCalledWith('users', {
        field: 'username',
        value: 'testuser',
      });
    });

    it('应该返回false当用户名不存在时', async () => {
      vi.spyOn(Database, 'exists').mockResolvedValue(false);

      const result = await UserModel.existsByUsername('nonexistent');

      expect(result).toBe(false);
      expect(Database.exists).toHaveBeenCalledWith('users', {
        field: 'username',
        value: 'nonexistent',
      });
    });
  });

  describe('existsByEmail', () => {
    it('应该返回true当邮箱存在时', async () => {
      vi.spyOn(Database, 'exists').mockResolvedValue(true);

      const result = await UserModel.existsByEmail('test@example.com');

      expect(result).toBe(true);
      expect(Database.exists).toHaveBeenCalledWith('users', {
        field: 'email',
        value: 'test@example.com',
      });
    });

    it('应该返回false当邮箱不存在时', async () => {
      vi.spyOn(Database, 'exists').mockResolvedValue(false);

      const result = await UserModel.existsByEmail('nonexistent@example.com');

      expect(result).toBe(false);
      expect(Database.exists).toHaveBeenCalledWith('users', {
        field: 'email',
        value: 'nonexistent@example.com',
      });
    });
  });

  describe('create', () => {
    it('应该成功创建用户', async () => {
      vi.spyOn(Database, 'insert').mockResolvedValue(1);

      const result = await UserModel.create({
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'hashedpassword',
      });

      expect(result).toBe(1);
      expect(Database.insert).toHaveBeenCalledWith('users', {
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
        role: UserRole.PLAYER,
        last_login_at: expect.any(Date),
      });
    });
  });

  describe('updateLastLogin', () => {
    it('应该成功更新最后登录时间', async () => {
      vi.spyOn(Database, 'update').mockResolvedValue(1);

      await UserModel.updateLastLogin(1);

      expect(Database.update).toHaveBeenCalledWith(
        'users',
        { last_login_at: expect.any(Date) },
        { field: 'id', value: 1 }
      );
    });
  });

  describe('update', () => {
    it('应该成功更新用户信息', async () => {
      vi.spyOn(Database, 'update').mockResolvedValue(1);

      const result = await UserModel.update(1, {
        username: 'newusername',
        bio: 'new bio',
      });

      expect(result).toBe(true);
      expect(Database.update).toHaveBeenCalledWith(
        'users',
        { username: 'newusername', bio: 'new bio' },
        { field: 'id', value: 1 }
      );
    });
  });

  describe('addGold', () => {
    it('应该成功增加金币', async () => {
      vi.spyOn(Database, 'query').mockResolvedValue({ rows: [], affectedRows: 1 });

      const result = await UserModel.addGold(1, 100);

      expect(result).toBe(true);
      expect(Database.query).toHaveBeenCalledWith(
        'UPDATE users SET gold = gold + ? WHERE id = ?',
        [100, 1]
      );
    });
  });

  describe('reduceGold', () => {
    it('应该成功减少金币', async () => {
      vi.spyOn(Database, 'query').mockResolvedValue({ rows: [], affectedRows: 1 });

      const result = await UserModel.reduceGold(1, 50);

      expect(result).toBe(true);
      expect(Database.query).toHaveBeenCalledWith(
        'UPDATE users SET gold = GREATEST(0, gold - ?) WHERE id = ?',
        [50, 1]
      );
    });
  });

  describe('addVouchers', () => {
    it('应该成功增加点券', async () => {
      vi.spyOn(Database, 'query').mockResolvedValue({ rows: [], affectedRows: 1 });

      const result = await UserModel.addVouchers(1, 10);

      expect(result).toBe(true);
      expect(Database.query).toHaveBeenCalledWith(
        'UPDATE users SET vouchers = vouchers + ? WHERE id = ?',
        [10, 1]
      );
    });
  });

  describe('addExperience', () => {
    it('应该成功增加经验', async () => {
      vi.spyOn(Database, 'query').mockResolvedValue({ rows: [], affectedRows: 1 });

      const result = await UserModel.addExperience(1, 50);

      expect(result).toBe(true);
      expect(Database.query).toHaveBeenCalledWith(
        'UPDATE users SET experience = experience + ? WHERE id = ?',
        [50, 1]
      );
    });
  });

  describe('levelUp', () => {
    it('应该成功升级', async () => {
      vi.spyOn(Database, 'query').mockResolvedValue({ rows: [], affectedRows: 1 });

      const result = await UserModel.levelUp(1);

      expect(result).toBe(true);
      expect(Database.query).toHaveBeenCalledWith(
        'UPDATE users SET level = level + 1 WHERE id = ?',
        [1]
      );
    });
  });

  describe('findById', () => {
    it('应该成功找到用户', async () => {
      const mockUser = {
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
        role: UserRole.PLAYER,
        last_login_at: new Date(),
        last_logout_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      vi.spyOn(Database, 'queryOne').mockResolvedValue(mockUser);

      const result = await UserModel.findById(1);

      expect(result).toEqual(mockUser);
      expect(Database.queryOne).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE id = ?',
        [1]
      );
    });

    it('应该返回null当用户不存在时', async () => {
      vi.spyOn(Database, 'queryOne').mockResolvedValue(null);

      const result = await UserModel.findById(999);

      expect(result).toBe(null);
    });
  });

  describe('findByUsername', () => {
    it('应该成功找到用户', async () => {
      const mockUser = {
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
        role: UserRole.PLAYER,
        last_login_at: new Date(),
        last_logout_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      vi.spyOn(Database, 'queryOne').mockResolvedValue(mockUser);

      const result = await UserModel.findByUsername('testuser');

      expect(result).toEqual(mockUser);
      expect(Database.queryOne).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE username = ?',
        ['testuser']
      );
    });
  });

  describe('findByEmail', () => {
    it('应该成功找到用户', async () => {
      const mockUser = {
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
        role: UserRole.PLAYER,
        last_login_at: new Date(),
        last_logout_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      vi.spyOn(Database, 'queryOne').mockResolvedValue(mockUser);

      const result = await UserModel.findByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(Database.queryOne).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE email = ?',
        ['test@example.com']
      );
    });
  });
});