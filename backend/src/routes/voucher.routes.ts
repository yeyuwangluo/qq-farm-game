/**
 * 点券路由
 */

import { Router } from 'express';
import VoucherController from '../controllers/voucher.controller';
import AuthMiddleware from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { body } from 'express-validator';

const router = Router();
const voucherController = VoucherController;
const authMiddleware = AuthMiddleware;

/**
 * @route   GET /api/game/vouchers
 * @desc    获取点券余额
 * @access  Private
 */
router.get('/', authMiddleware.authenticate, voucherController.getBalance);

/**
 * @route   POST /api/game/vouchers/transaction
 * @desc    处理点券交易
 * @access  Private
 */
router.post(
  '/transaction',
  authMiddleware.authenticate,
  validateRequest([
    body('type')
      .isIn(['earn', 'spend', 'admin_add', 'admin_subtract'])
      .withMessage('无效的交易类型'),
    body('amount')
      .isInt({ min: 1 })
      .withMessage('点券数量必须是正整数'),
    body('reason')
      .optional()
      .isString()
      .withMessage('交易原因必须是字符串'),
  ]),
  voucherController.processTransaction
);

/**
 * @route   POST /api/game/vouchers/validate
 * @desc    验证点券余额
 * @access  Private
 */
router.post(
  '/validate',
  authMiddleware.authenticate,
  validateRequest([
    body('amount')
      .isInt({ min: 1 })
      .withMessage('点券数量必须是正整数'),
  ]),
  voucherController.validateBalance
);

/**
 * @route   POST /api/game/vouchers/bulk-add
 * @desc    批量增加点券（管理员）
 * @access  Private (Admin)
 */
router.post(
  '/bulk-add',
  authMiddleware.authenticate,
  validateRequest([
    body('user_ids')
      .isArray()
      .withMessage('用户ID列表必须是数组'),
    body('user_ids.*')
      .isInt({ min: 1 })
      .withMessage('用户ID必须是正整数'),
    body('amount')
      .isInt({ min: 1 })
      .withMessage('点券数量必须是正整数'),
    body('reason')
      .optional()
      .isString()
      .withMessage('交易原因必须是字符串'),
  ]),
  voucherController.bulkAddVouchers
);

export default router;