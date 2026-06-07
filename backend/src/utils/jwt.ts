/**
 * JWT工具函数
 */
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export interface JWTPayload {
  userId: number;
  username: string;
  email: string;
}

/**
 * 生成JWT token
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * 验证JWT token
 */
export function verifyToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    throw new Error('Invalid token');
  }
}

/**
 * 解析JWT token（不验证签名）
 */
export function decodeToken(token: string): JWTPayload | null {
  const decoded = jwt.decode(token) as JWTPayload | null;
  return decoded;
}

/**
 * 生成刷新token
 */
export function generateRefreshToken(userId: number): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

/**
 * 验证刷新token
 */
export function verifyRefreshToken(token: string): { userId: number } {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number };
  } catch {
    throw new Error('Invalid refresh token');
  }
}
