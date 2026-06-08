/**
 * 作物相关的验证器
 */

import { body, param } from 'express-validator';

/**
 * 种植作物验证
 */
export const plantCropValidation = [
  body('plot_id')
    .isInt({ min: 1 }).withMessage('土地ID必须是正整数'),
  body('crop_type_id')
    .isInt({ min: 1 }).withMessage('作物类型ID必须是正整数'),
];

/**
 * 收获作物验证
 */
export const harvestCropValidation = [
  body('plot_id')
    .isInt({ min: 1 }).withMessage('土地ID必须是正整数'),
];

/**
 * 使用化肥验证
 */
export const useFertilizerValidation = [
  body('plot_id')
    .isInt({ min: 1 }).withMessage('土地ID必须是正整数'),
  body('fertilizer_id')
    .isInt({ min: 1 }).withMessage('化肥ID必须是正整数'),
];

/**
 * 使用加速剂验证
 */
export const useAcceleratorValidation = [
  body('plot_id')
    .isInt({ min: 1 }).withMessage('土地ID必须是正整数'),
  body('accelerator_id')
    .isInt({ min: 1 }).withMessage('加速剂ID必须是正整数'),
];