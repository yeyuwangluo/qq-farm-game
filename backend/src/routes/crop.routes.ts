/**
 * 作物路由
 */

import { Router } from 'express';
import CropController from '../controllers/crop.controller';
import AuthMiddleware from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import {
  plantCropValidation,
  harvestCropValidation,
  useFertilizerValidation,
  useAcceleratorValidation,
} from '../validators/crop.validator';

const router = Router();
const cropController = CropController;
const authMiddleware = AuthMiddleware;

/**
 * @route   GET /api/crops
 * @desc    获取农场的所有作物
 * @access  Private
 */
router.get('/', authMiddleware.authenticate, cropController.getFarmCrops);

/**
 * @route   GET /api/crops/types
 * @desc    获取可种植的作物类型
 * @access  Private
 */
router.get('/types', authMiddleware.authenticate, cropController.getPlantableCropTypes);

/**
 * @route   POST /api/crops/plant
 * @desc    种植作物
 * @access  Private
 */
router.post('/plant', authMiddleware.authenticate, validateRequest(plantCropValidation), cropController.plantCrop);

/**
 * @route   POST /api/crops/harvest
 * @desc    收获作物
 * @access  Private
 */
router.post('/harvest', authMiddleware.authenticate, validateRequest(harvestCropValidation), cropController.harvestCrop);

/**
 * @route   POST /api/crops/fertilizer
 * @desc    使用化肥
 * @access  Private
 */
router.post('/fertilizer', authMiddleware.authenticate, validateRequest(useFertilizerValidation), cropController.useFertilizer);

/**
 * @route   POST /api/crops/accelerator
 * @desc    使用加速剂
 * @access  Private
 */
router.post('/accelerator', authMiddleware.authenticate, validateRequest(useAcceleratorValidation), cropController.useAccelerator);

/**
 * @route   DELETE /api/crops/withered/:plotId
 * @desc    清除枯萎作物
 * @access  Private
 */
router.delete('/withered/:plotId', authMiddleware.authenticate, cropController.clearWitheredCrop);

export default router;