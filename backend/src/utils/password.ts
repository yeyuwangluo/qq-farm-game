/**
 * 密码加密工具函数
 */
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * 加密密码
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * 验证密码
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * 生成salt
 */
export async function generateSalt(): Promise<string> {
  return bcrypt.genSalt(SALT_ROUNDS);
}
