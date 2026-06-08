/**
 * 动物路由
 */

import { Router } from 'express';
import AnimalController from '../controllers/animal.controller';
import AuthMiddleware from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import {
  buyAnimalValidation,
  feedAnimalValidation,
  collectProductValidation,
  upgradeAnimalPenValidation,
} from '../validators/animal.validator';

const router = Router();
const animalController = AnimalController;
const authMiddleware = AuthMiddleware;

/**
 * @route   GET /api/animals/pens
 * @desc    获取用户的动物栏列表
 * @access  Private
 */
router.get('/pens', authMiddleware.authenticate, animalController.getAnimalPens);

/**
 * @route   GET /api/animals
 * @desc    获取用户的动物列表
 * @access  Private
 */
router.get('/', authMiddleware.authenticate, animalController.getUserAnimals);

/**
 * @route   GET /api/animals/types
 * @desc    获取可购买的动物类型
 * @access  Private
 */
router.get('/types', authMiddleware.authenticate, animalController.getAvailableAnimalTypes);

/**
 * @route   POST /api/animals/buy
 * @desc    购买动物
 * @access  Private
 */
router.post('/buy', authMiddleware.authenticate, validateRequest(buyAnimalValidation), animalController.buyAnimal);

/**
 * @route   POST /api/animals/feed
 * @desc    喂养动物
 * @access  Private
 */
router.post('/feed', authMiddleware.authenticate, validateRequest(feedAnimalValidation), animalController.feedAnimal);

/**
 * @route   POST /api/animals/collect
 * @desc    收集产品
 * @access  Private
 */
router.post('/collect', authMiddleware.authenticate, validateRequest(collectProductValidation), animalController.collectProduct);

/**
 * @route   POST /api/animals/upgrade-pen
 * @desc    升级动物栏
 * @access  Private
 */
router.post('/upgrade-pen', authMiddleware.authenticate, validateRequest(upgradeAnimalPenValidation), animalController.upgradeAnimalPen);

/**
 * @route   GET /api/animals/cron/hunger
 * @desc    检查并更新动物饥饿状态（定时任务）
 * @access  Private
 */
router.get('/cron/hunger', authMiddleware.authenticate, animalController.checkAndUpdateHunger);

/**
 * @route   GET /api/animals/cron/progress
 * @desc    检查并更新动物产出进度（定时任务）
 * @access  Private
 */
router.get('/cron/progress', authMiddleware.authenticate, animalController.checkAndUpdateProductProgress);

/**
 * @route   GET /api/animals/cron/starving
 * @desc    检查并处理饥饿动物（定时任务）
 * @access  Private
 */
router.get('/cron/starving', authMiddleware.authenticate, animalController.checkAndHandleStarvingAnimals);

export default router;