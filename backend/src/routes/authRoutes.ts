/**
 * 认证路由
 */
import { Router } from 'express';
import { register, login, getCurrentUser, refreshToken, logout } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.get('/me', authenticateToken, getCurrentUser);

export default router;