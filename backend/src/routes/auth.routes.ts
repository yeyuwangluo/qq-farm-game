/**
 * 认证路由
 */

import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import AuthMiddleware from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { registerValidation, loginValidation, refreshTokenValidation } from '../validators/auth.validator';

const router = Router();
const authController = AuthController;
const authMiddleware = AuthMiddleware;

/**
 * @route   POST /api/auth/register
 * @desc    用户注册
 * @access  Public
 */
router.post('/register', validateRequest(registerValidation), authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    用户登录
 * @access  Public
 */
router.post('/login', validateRequest(loginValidation), authController.login);

/**
 * @route   POST /api/auth/refresh
 * @desc    刷新Token
 * @access  Public
 */
router.post('/refresh', validateRequest(refreshTokenValidation), authController.refreshToken);

/**
 * @route   GET /api/auth/me
 * @desc    获取当前用户信息
 * @access  Private
 */
router.get('/me', authMiddleware.authenticate, authController.getCurrentUser);

/**
 * @route   POST /api/auth/logout
 * @desc    用户登出
 * @access  Private
 */
router.post('/logout', authMiddleware.authenticate, authController.logout);

export default router;