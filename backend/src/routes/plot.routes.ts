/**
 * 土地路由
 */

import { Router } from 'express';
import PlotController from '../controllers/plot.controller';
import AuthMiddleware from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { upgradePlotValidation, unlockPlotValidation, updatePlotStateValidation } from '../validators/plot.validator';

const router = Router();
const plotController = PlotController;
const authMiddleware = AuthMiddleware;

/**
 * @route   GET /api/plots
 * @desc    获取农场的所有土地
 * @access  Private
 */
router.get('/', authMiddleware.authenticate, plotController.getFarmPlots);

/**
 * @route   GET /api/plots/:plotId
 * @desc    获取土地详细信息
 * @access  Private
 */
router.get('/:plotId', authMiddleware.authenticate, plotController.getPlotDetail);

/**
 * @route   POST /api/plots/:plotId/upgrade
 * @desc    升级土地
 * @access  Private
 */
router.post('/:plotId/upgrade', authMiddleware.authenticate, validateRequest(upgradePlotValidation), plotController.upgradePlot);

/**
 * @route   POST /api/plots/unlock
 * @desc    解锁土地
 * @access  Private
 */
router.post('/unlock', authMiddleware.authenticate, validateRequest(unlockPlotValidation), plotController.unlockPlot);

/**
 * @route   PUT /api/plots/:plotId/state
 * @desc    更新土地状态
 * @access  Private
 */
router.put('/:plotId/state', authMiddleware.authenticate, validateRequest(updatePlotStateValidation), plotController.updatePlotState);

export default router;