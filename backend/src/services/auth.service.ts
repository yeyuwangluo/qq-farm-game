/**
 * 认证服务
 */

import Database from '../utils/database';
import UserModel from '../models/user.model';
import FarmModel from '../models/farm.model';
import { RegisterRequest, LoginRequest, LoginResponse, UserInfo, UserStatus, JWTPayload } from '../types/user.types';
import { hashPassword, comparePassword, generateToken, verifyToken } from '../utils';
import { AppError } from '../utils/response';

class AuthService {
  /**
   * 用户注册
   */
  async register(data: RegisterRequest): Promise<LoginResponse> {
    const { username, email, password } = data;

    if (!username || !email || !password) {
      throw AppError.badRequest('用户名、邮箱和密码不能为空');
    }

    if (username.length < 3 || username.length > 20) {
      throw AppError.badRequest('用户名长度必须在3-20个字符之间');
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      throw AppError.badRequest('用户名只能包含字母、数字和下划线');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw AppError.badRequest('邮箱格式不正确');
    }

    if (password.length < 6) {
      throw AppError.badRequest('密码长度至少6个字符');
    }

    const usernameExists = await UserModel.existsByUsername(username);
    if (usernameExists) {
      throw AppError.conflict('用户名已存在');
    }

    const emailExists = await UserModel.existsByEmail(email);
    if (emailExists) {
      throw AppError.conflict('邮箱已被注册');
    }

    const passwordHash = await hashPassword(password);

    await Database.beginTransaction();

    try {
      const userId = await UserModel.create({
        ...data,
        password_hash: passwordHash,
      });

      const farmName = `${username}的农场`;
      await FarmModel.create(userId, farmName);

      await Database.commitTransaction();

      const user = await UserModel.findById(userId);
      if (!user) {
        throw AppError.internal('创建用户失败');
      }

      const userInfo = this.getUserInfo(user);
      const token = this.generateToken(userInfo);

      return {
        user: userInfo,
        token,
      };
    } catch (error) {
      await Database.rollbackTransaction();
      throw error;
    }
  }

  /**
   * 用户登录
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    const { username, password } = data;

    if (!username || !password) {
      throw AppError.badRequest('用户名和密码不能为空');
    }

    const user = await UserModel.findByUsername(username);
    if (!user) {
      throw AppError.unauthorized('用户名或密码错误');
    }

    if (user.state === UserStatus.BANNED) {
      throw AppError.forbidden('账号已被封禁');
    }

    if (user.state === UserStatus.SUSPENDED) {
      throw AppError.forbidden('账号已被暂停');
    }

    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      throw AppError.unauthorized('用户名或密码错误');
    }

    await UserModel.updateLastLogin(user.id);

    const userInfo = this.getUserInfo(user);
    const token = this.generateToken(userInfo);

    return {
      user: userInfo,
      token,
    };
  }

  /**
   * 生成JWT Token
   */
  private generateToken(userInfo: UserInfo): string {
    const payload: JWTPayload = {
      userId: userInfo.id,
      username: userInfo.username,
      email: userInfo.email,
      role: userInfo.role,
    };

    return generateToken(payload);
  }

  /**
   * 验证Token并获取用户信息
   */
  async verifyTokenAndGetUser(token: string): Promise<UserInfo> {
    try {
      const payload = verifyToken(token) as JWTPayload;

      const user = await UserModel.findById(payload.userId);
      if (!user) {
        throw AppError.unauthorized('用户不存在');
      }

      if (user.state !== UserStatus.ACTIVE) {
        throw AppError.forbidden('账号状态异常');
      }

      return this.getUserInfo(user);
    } catch (error) {
      if (error instanceof Error && error.name === 'TokenExpiredError') {
        throw AppError.unauthorized('Token已过期');
      }
      if (error instanceof Error && error.name === 'JsonWebTokenError') {
        throw AppError.unauthorized('Token无效');
      }
      throw error;
    }
  }

  /**
   * 刷新Token
   */
  async refreshToken(token: string): Promise<LoginResponse> {
    try {
      const payload = verifyToken(token, true) as JWTPayload;

      const user = await UserModel.findById(payload.userId);
      if (!user) {
        throw AppError.unauthorized('用户不存在');
      }

      if (user.state !== UserStatus.ACTIVE) {
        throw AppError.forbidden('账号状态异常');
      }

      const userInfo = this.getUserInfo(user);
      const newToken = this.generateToken(userInfo);

      return {
        user: userInfo,
        token: newToken,
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'TokenExpiredError') {
        throw AppError.unauthorized('Refresh Token已过期');
      }
      if (error instanceof Error && error.name === 'JsonWebTokenError') {
        throw AppError.unauthorized('Refresh Token无效');
      }
      throw error;
    }
  }

  /**
   * 获取当前用户信息
   */
  async getCurrentUser(userId: number): Promise<UserInfo> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw AppError.notFound('用户不存在');
    }

    return this.getUserInfo(user);
  }

  /**
   * 用户登出
   */
  async logout(userId: number): Promise<void> {
    await UserModel.updateLastLogout(userId);
  }

  /**
   * 转换为用户信息（不包含密码）
   */
  private getUserInfo(user: any): UserInfo {
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
}

export default new AuthService();