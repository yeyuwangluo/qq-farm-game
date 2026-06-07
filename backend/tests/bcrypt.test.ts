/**
 * Bcrypt密码加密测试
 */
import { describe, it, expect } from 'vitest';
import bcrypt from 'bcrypt';

describe('Bcrypt Password Encryption', () => {
  it('应该能够加密密码', async () => {
    const password = 'test-password-123';
    const hashedPassword = await bcrypt.hash(password, 10);
    expect(hashedPassword).toBeDefined();
    expect(hashedPassword).not.toBe(password);
    expect(hashedPassword.length).toBeGreaterThan(50);
  });

  it('应该能够验证密码', async () => {
    const password = 'test-password-123';
    const hashedPassword = await bcrypt.hash(password, 10);
    const isValid = await bcrypt.compare(password, hashedPassword);
    expect(isValid).toBe(true);
  });

  it('应该能够识别错误密码', async () => {
    const password = 'test-password-123';
    const wrongPassword = 'wrong-password';
    const hashedPassword = await bcrypt.hash(password, 10);
    const isValid = await bcrypt.compare(wrongPassword, hashedPassword);
    expect(isValid).toBe(false);
  });

  it('不同的密码应该生成不同的hash', async () => {
    const password1 = 'password-1';
    const password2 = 'password-2';
    const hashedPassword1 = await bcrypt.hash(password1, 10);
    const hashedPassword2 = await bcrypt.hash(password2, 10);
    expect(hashedPassword1).not.toBe(hashedPassword2);
  });

  it('相同密码不同salt应该生成不同的hash', async () => {
    const password = 'test-password';
    const hashedPassword1 = await bcrypt.hash(password, 10);
    const hashedPassword2 = await bcrypt.hash(password, 10);
    expect(hashedPassword1).not.toBe(hashedPassword2);
  });

  it('应该能够生成salt', async () => {
    const salt = await bcrypt.genSalt(10);
    expect(salt).toBeDefined();
    expect(salt.startsWith('$2b$10$')).toBe(true);
  });

  it('应该能够使用自定义salt加密密码', async () => {
    const password = 'test-password';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    expect(hashedPassword).toBeDefined();
    expect(hashedPassword.startsWith('$2b$10$')).toBe(true);
  });
});