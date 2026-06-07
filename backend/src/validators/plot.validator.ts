/**
 * 土地相关的验证器
 */

import { body, param } from 'express-validator';

/**
 * 升级土地验证
 */
export const upgradePlotValidation = [
  param('plotId')
    .isInt({ min: 1 }).withMessage('土地ID必须是正整数'),
];

/**
 * 解锁土地验证
 */
export const unlockPlotValidation = [
  body('plot_index')
    .isInt({ min: 0 }).withMessage('土地索引必须是非负整数'),
];

/**
 * 更新土地状态验证
 */
export const updatePlotStateValidation = [
  param('plotId')
    .isInt({ min: 1 }).withMessage('土地ID必须是正整数'),
  body('state')
    .isIn(['idle', 'planted', 'ready', 'withered']).withMessage('状态必须是 idle, planted, ready 或 withered'),
];