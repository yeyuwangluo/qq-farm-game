/**
 * 认证相关的验证器
 */

import { body } from 'express-validator';

/**
 * 注册请求验证
 */
export const registerValidation = [
  body('username')
    .trim()
    .notEmpty().withMessage('用户名不能为空')
    .isLength({ min: 3, max: 20 }).withMessage('用户名长度必须在3-20个字符之间')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('用户名只能包含字母、数字和下划线'),

  body('email')
    .trim()
    .notEmpty().withMessage('邮箱不能为空')
    .isEmail().withMessage('邮箱格式不正确')
    .normalizeEmail(),

  body('password')
    .trim()
    .notEmpty().withMessage('密码不能为空')
    .isLength({ min: 6 }).withMessage('密码长度至少6个字符'),

  body('avatar')
    .optional()
    .isURL().withMessage('头像必须是有效的URL'),

  body('bio')
    .optional()
    .isLength({ max: 200 }).withMessage('个人简介不能超过200个字符'),
];

/**
 * 登录请求验证
 */
export const loginValidation = [
  body('username')
    .trim()
    .notEmpty().withMessage('用户名不能为空'),

  body('password')
    .trim()
    .notEmpty().withMessage('密码不能为空'),
];

/**
 * 刷新Token验证
 */
export const refreshTokenValidation = [
  body('token')
    .trim()
    .notEmpty().withMessage('Token不能为空'),
];

/**
 * 更新用户信息验证
 */
export const updateUserValidation = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 }).withMessage('用户名长度必须在3-20个字符之间')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('用户名只能包含字母、数字和下划线'),

  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('邮箱格式不正确')
    .normalizeEmail(),

  body('avatar')
    .optional()
    .isURL().withMessage('头像必须是有效的URL'),

  body('bio')
    .optional()
    .isLength({ max: 200 }).withMessage('个人简介不能超过200个字符'),
];

/**
 * 修改密码验证
 */
export const changePasswordValidation = [
  body('oldPassword')
    .trim()
    .notEmpty().withMessage('旧密码不能为空'),

  body('newPassword')
    .trim()
    .notEmpty().withMessage('新密码不能为空')
    .isLength({ min: 6 }).withMessage('新密码长度至少6个字符'),

  body('confirmPassword')
    .trim()
    .notEmpty().withMessage('确认密码不能为空')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('两次输入的密码不一致');
      }
      return true;
    }),
];