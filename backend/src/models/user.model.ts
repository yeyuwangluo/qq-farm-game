/**
 * 用户数据模型
 */

import Database from '../utils/database';
import { User, UserInfo, RegisterRequest, UpdateUserRequest, UserStatus, UserRole } from '../types/user.types';

class UserModel {
  /**
   * 根据用户名查询用户
   */
  async findByUsername(username: string): Promise<User | null> {
    return await Database.queryOne<User>(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
  }

  /**
   * 根据邮箱查询用户
   */
  async findByEmail(email: string): Promise<User | null> {
    return await Database.queryOne<User>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
  }

  /**
   * 根据ID查询用户
   */
  async findById(id: number): Promise<User | null> {
    return await Database.findById<User>('users', id);
  }

  /**
   * 检查用户名是否存在
   */
  async existsByUsername(username: string): Promise<boolean> {
    return await Database.exists('users', { field: 'username', value: username });
  }

  /**
   * 检查邮箱是否存在
   */
  async existsByEmail(email: string): Promise<boolean> {
    return await Database.exists('users', { field: 'email', value: email });
  }

  /**
   * 创建新用户
   */
  async create(data: RegisterRequest & { password_hash: string }): Promise<number> {
    return await Database.insert('users', {
      username: data.username,
      email: data.email,
      password_hash: data.password_hash,
      gold: 1000,
      experience: 0,
      level: 1,
      vouchers: 0,
      avatar: data.avatar || null,
      bio: data.bio || null,
      state: UserStatus.ACTIVE,
      role: UserRole.PLAYER,
      last_login_at: new Date(),
    });
  }

  /**
   * 更新用户最后登录时间
   */
  async updateLastLogin(userId: number): Promise<void> {
    await Database.update(
      'users',
      { last_login_at: new Date() },
      { field: 'id', value: userId }
    );
  }

  /**
   * 更新用户最后登出时间
   */
  async updateLastLogout(userId: number): Promise<void> {
    await Database.update(
      'users',
      { last_logout_at: new Date() },
      { field: 'id', value: userId }
    );
  }

  /**
   * 更新用户信息
   */
  async update(userId: number, data: UpdateUserRequest): Promise<boolean> {
    const affectedRows = await Database.update(
      'users',
      data,
      { field: 'id', value: userId }
    );
    return affectedRows > 0;
  }

  /**
   * 更新用户状态
   */
  async updateState(userId: number, state: UserStatus): Promise<boolean> {
    const affectedRows = await Database.update(
      'users',
      { state },
      { field: 'id', value: userId }
    );
    return affectedRows > 0;
  }

  /**
   * 更新用户角色
   */
  async updateRole(userId: number, role: UserRole): Promise<boolean> {
    const affectedRows = await Database.update(
      'users',
      { role },
      { field: 'id', value: userId }
    );
    return affectedRows > 0;
  }

  /**
   * 增加金币
   */
  async addGold(userId: number, amount: number): Promise<boolean> {
    const affectedRows = await Database.query(
      'UPDATE users SET gold = gold + ? WHERE id = ?',
      [amount, userId]
    );
    return (affectedRows.affectedRows || 0) > 0;
  }

  /**
   * 减少金币
   */
  async reduceGold(userId: number, amount: number): Promise<boolean> {
    const affectedRows = await Database.query(
      'UPDATE users SET gold = GREATEST(0, gold - ?) WHERE id = ?',
      [amount, userId]
    );
    return (affectedRows.affectedRows || 0) > 0;
  }

  /**
   * 增加点券
   */
  async addVouchers(userId: number, amount: number): Promise<boolean> {
    const affectedRows = await Database.query(
      'UPDATE users SET vouchers = vouchers + ? WHERE id = ?',
      [amount, userId]
    );
    return (affectedRows.affectedRows || 0) > 0;
  }

  /**
   * 减少点券
   */
  async reduceVouchers(userId: number, amount: number): Promise<boolean> {
    const affectedRows = await Database.query(
      'UPDATE users SET vouchers = GREATEST(0, vouchers - ?) WHERE id = ?',
      [amount, userId]
    );
    return (affectedRows.affectedRows || 0) > 0;
  }

  /**
   * 增加经验
   */
  async addExperience(userId: number, amount: number): Promise<boolean> {
    const affectedRows = await Database.query(
      'UPDATE users SET experience = experience + ? WHERE id = ?',
      [amount, userId]
    );
    return (affectedRows.affectedRows || 0) > 0;
  }

  /**
   * 升级用户
   */
  async levelUp(userId: number): Promise<boolean> {
    const affectedRows = await Database.query(
      'UPDATE users SET level = level + 1 WHERE id = ?',
      [userId]
    );
    return (affectedRows.affectedRows || 0) > 0;
  }

  /**
   * 获取用户信息（不包含密码）
   */
  async getUserInfo(userId: number): Promise<UserInfo | null> {
    const user = await this.findById(userId);
    if (!user) return null;

    return this.toUserInfo(user);
  }

  /**
   * 转换为用户信息（不包含密码）
   */
  private toUserInfo(user: User): UserInfo {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      gold: user.gold,
      experience: user.experience,
      level: user.level,
      vouchers: user.vouchers,
      avatar: user.avatar,
      bio: user.bio,
      state: user.state,
      role: user.role,
      last_login_at: user.last_login_at ? user.last_login_at.toISOString() : null,
      created_at: user.created_at.toISOString(),
      updated_at: user.updated_at.toISOString(),
    };
  }

  /**
   * 分页查询用户列表
   */
  async findAll(options: {
    limit?: number;
    offset?: number;
    state?: UserStatus;
    role?: UserRole;
  } = {}): Promise<UserInfo[]> {
    let sql = 'SELECT id, username, email, gold, experience, level, vouchers, avatar, bio, state, role, last_login_at, created_at, updated_at FROM users';
    const params: any[] = [];
    const conditions: string[] = [];

    if (options.state) {
      conditions.push('state = ?');
      params.push(options.state);
    }

    if (options.role) {
      conditions.push('role = ?');
      params.push(options.role);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY created_at DESC';

    if (options.limit) {
      sql += ' LIMIT ?';
      params.push(options.limit);

      if (options.offset) {
        sql += ' OFFSET ?';
        params.push(options.offset);
      }
    }

    const result = await Database.query<User>(sql, params);
    return result.rows.map(user => this.toUserInfo(user));
  }

  /**
   * 统计用户数量
   */
  async count(options: {
    state?: UserStatus;
    role?: UserRole;
  } = {}): Promise<number> {
    return await Database.count('users', [
      ...(options.state ? [{ field: 'state', value: options.state }] : []),
      ...(options.role ? [{ field: 'role', value: options.role }] : []),
    ]);
  }
}

export default new UserModel();