/**
 * 用户数据模型
 */
import { query, queryOne, insert, update, deleteRow, beginTransaction, commitTransaction, rollbackTransaction } from '../config/database.js';
import type { User, UserCreate, UserUpdate } from '../types/user.js';
import { hashPassword, comparePassword } from '../utils/password.js';

export class UserModel {
  private tableName = 'users';

  /**
   * 根据ID查询用户
   */
  async findById(id: number): Promise<User | null> {
    const sql = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    return queryOne<User>(sql, [id]);
  }

  /**
   * 根据用户名查询用户
   */
  async findByUsername(username: string): Promise<User | null> {
    const sql = `SELECT * FROM ${this.tableName} WHERE username = ?`;
    return queryOne<User>(sql, [username]);
  }

  /**
   * 根据邮箱查询用户
   */
  async findByEmail(email: string): Promise<User | null> {
    const sql = `SELECT * FROM ${this.tableName} WHERE email = ?`;
    return queryOne<User>(sql, [email]);
  }

  /**
   * 创建用户
   */
  async create(userData: UserCreate): Promise<User> {
    const hashedPassword = await hashPassword(userData.password);
    const now = new Date();

    const newUser = await insert<User>(this.tableName, {
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      nickname: userData.nickname || userData.username,
      phone: userData.phone || null,
      status: 'active',
      level: 1,
      experience: 0,
      coins: 1000,
      createdAt: now,
      updatedAt: now,
    });

    return newUser;
  }

  /**
   * 更新用户信息
   */
  async update(id: number, userData: UserUpdate): Promise<number> {
    const updatedData: any = { ...userData };
    if (userData) {
      updatedData.updatedAt = new Date();
    }
    return update(this.tableName, updatedData, { id });
  }

  /**
   * 更新最后登录时间
   */
  async updateLastLogin(id: number): Promise<number> {
    return update(this.tableName, { lastLoginAt: new Date() }, { id });
  }

  /**
   * 删除用户
   */
  async delete(id: number): Promise<number> {
    return deleteRow(this.tableName, { id });
  }

  /**
   * 验证用户密码
   */
  async verifyPassword(username: string, password: string): Promise<User | null> {
    const user = await this.findByUsername(username);
    if (!user) {
      return null;
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return null;
    }

    return user;
  }

  /**
   * 检查用户名是否存在
   */
  async usernameExists(username: string): Promise<boolean> {
    const user = await this.findByUsername(username);
    return user !== null;
  }

  /**
   * 检查邮箱是否存在
   */
  async emailExists(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    return user !== null;
  }

  /**
   * 获取用户列表（分页）
   */
  async findAll(page: number = 1, pageSize: number = 10): Promise<{ users: User[]; total: number }> {
    const offset = (page - 1) * pageSize;

    const users = await query<User>(
      `SELECT * FROM ${this.tableName} ORDER BY createdAt DESC LIMIT ? OFFSET ?`,
      [pageSize, offset]
    );

    const totalResult = await query<{ total: number }>(`SELECT COUNT(*) as total FROM ${this.tableName}`);
    const total = totalResult[0]?.total || 0;

    return { users, total };
  }

  /**
   * 更新用户金币
   */
  async updateCoins(id: number, amount: number): Promise<number> {
    const connection = await beginTransaction();
    try {
      const user = await queryOne<User>(`SELECT coins FROM ${this.tableName} WHERE id = ? FOR UPDATE`, [id]);
      if (!user) {
        throw new Error('User not found');
      }

      const newCoins = Math.max(0, user.coins + amount);
      await connection.execute(`UPDATE ${this.tableName} SET coins = ?, updatedAt = ? WHERE id = ?`, [
        newCoins,
        new Date(),
        id,
      ]);

      await commitTransaction(connection);
      return newCoins;
    } catch (error) {
      await rollbackTransaction(connection);
      throw error;
    }
  }

  /**
   * 更新用户经验值
   */
  async updateExperience(id: number, experience: number): Promise<number> {
    const connection = await beginTransaction();
    try {
      const user = await queryOne<User>(
        `SELECT experience, level FROM ${this.tableName} WHERE id = ? FOR UPDATE`,
        [id]
      );
      if (!user) {
        throw new Error('User not found');
      }

      const newExperience = user.experience + experience;
      const newLevel = Math.floor(newExperience / 1000) + 1;

      await connection.execute(
        `UPDATE ${this.tableName} SET experience = ?, level = ?, updatedAt = ? WHERE id = ?`,
        [newExperience, newLevel, new Date(), id]
      );

      await commitTransaction(connection);
      return newExperience;
    } catch (error) {
      await rollbackTransaction(connection);
      throw error;
    }
  }
}

export default new UserModel();