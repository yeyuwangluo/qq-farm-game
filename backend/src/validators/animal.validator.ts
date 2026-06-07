/**
 * 动物相关的验证器
 */

import { body } from 'express-validator';

/**
 * 购买动物验证
 */
export const buyAnimalValidation = [
  body('animal_type_id')
    .isInt({ min: 1 }).withMessage('动物类型ID必须是正整数'),
  body('name')
    .optional()
    .isLength({ max: 50 }).withMessage('动物名称不能超过50个字符'),
];

/**
 * 喂养动物验证
 */
export const feedAnimalValidation = [
  body('animal_id')
    .isInt({ min: 1 }).withMessage('动物ID必须是正整数'),
];

/**
 * 收集产品验证
 */
export const collectProductValidation = [
  body('animal_id')
    .isInt({ min: 1 }).withMessage('动物ID必须是正整数'),
];

/**
 * 升级动物栏验证
 */
export const upgradeAnimalPenValidation = [
  body('pen_id')
    .isInt({ min: 1 }).withMessage('动物栏ID必须是正整数'),
];