/**
 * 季节路由
 */

import { Router } from 'express';
import SeasonController from '../controllers/season.controller';
import AuthMiddleware from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { body } from 'express-validator';

const router = Router();
const seasonController = SeasonController;
const authMiddleware = AuthMiddleware;

/**
 * @route   GET /api/game/season
 * @desc    获取当前季节信息
 * @access  Private
 */
router.get('/', authMiddleware.authenticate, seasonController.getCurrentSeason);

/**
 * @route   GET /api/game/season/activities
 * @desc    获取季节活动信息
 * @access  Private
 */
router.get('/activities', authMiddleware.authenticate, seasonController.getSeasonActivities);

/**
 * @route   GET /api/seasons
 * @desc    获取所有季节（管理员）
 * @access  Private (Admin)
 */
router.get('/all', authMiddleware.authenticate, seasonController.getAllSeasons);

/**
 * @route   POST /api/seasons/switch
 * @desc    切换季节（管理员）
 * @access  Private (Admin)
 */
router.post(
  '/switch',
  authMiddleware.authenticate,
  validateRequest([body('season_id').isInt({ min: 1 }).withMessage('季节ID必须是正整数')]),
  seasonController.switchSeason
);

export default router;