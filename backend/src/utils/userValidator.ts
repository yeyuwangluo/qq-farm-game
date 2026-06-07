/**
 * 用户验证工具
 */
import { isValidEmail, isValidUsername, validatePassword } from '../utils/validator.js';
import type { RegisterRequest, LoginRequest } from '../types/user.js';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * 验证注册请求
 */
export function validateRegisterRequest(data: RegisterRequest): ValidationResult {
  const errors: string[] = [];

  if (!data.username) {
    errors.push('用户名不能为空');
  } else if (!isValidUsername(data.username)) {
    errors.push('用户名格式不正确，3-20个字符，只能包含字母、数字和下划线');
  }

  if (!data.email) {
    errors.push('邮箱不能为空');
  } else if (!isValidEmail(data.email)) {
    errors.push('邮箱格式不正确');
  }

  if (!data.password) {
    errors.push('密码不能为空');
  } else {
    const passwordResult = validatePassword(data.password);
    if (!passwordResult.isValid) {
      errors.push(passwordResult.message);
    }
  }

  if (!data.confirmPassword) {
    errors.push('确认密码不能为空');
  } else if (data.password !== data.confirmPassword) {
    errors.push('两次密码输入不一致');
  }

  if (data.phone && !/^[0-9]*$/.test(data.phone)) {
    errors.push('手机号格式不正确');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * 验证登录请求
 */
export function validateLoginRequest(data: LoginRequest): ValidationResult {
  const errors: string[] = [];

  if (!data.username) {
    errors.push('用户名不能为空');
  }

  if (!data.password) {
    errors.push('密码不能为空');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}