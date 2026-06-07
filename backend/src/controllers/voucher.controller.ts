/**
 * 点券控制器
 */

import { Request, Response, NextFunction } from 'express';
import VoucherService from '../services/voucher.service';
import { successResponse } from '../utils/response';
import {
  VoucherTransactionRequest,
  VoucherTransactionType,
} from '../types/voucher.types';

class VoucherController {
  /**
   * 获取点券余额
   */
  getBalance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.auth) {
        throw new Error('未认证');
      }

      const balance = await VoucherService.getBalance(req.auth.userId);
      successResponse(res, '获取点券余额成功', balance);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 处理点券交易
   */
  processTransaction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.auth) {
        throw new Error('未认证');
      }

      const { type, amount, reason } = req.body;
      const request: VoucherTransactionRequest = {
        type,
        amount,
        reason,
      };

      const result = await VoucherService.processTransaction(
        req.auth.userId,
        request
      );
      successResponse(res, '点券交易成功', result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 验证点券余额
   */
  validateBalance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.auth) {
        throw new Error('未认证');
      }

      const { amount } = req.body;
      const isValid = await VoucherService.validateBalance(
        req.auth.userId,
        amount
      );

      successResponse(res, '点券余额验证完成', {
        is_valid: isValid,
        required_amount: amount,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 批量增加点券（管理员）
   */
  bulkAddVouchers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { user_ids, amount, reason } = req.body;

      const results = await VoucherService.bulkAddVouchers(
        user_ids,
        amount,
        reason
      );

      successResponse(res, '批量增加点券成功', {
        total_users: user_ids.length,
        successful: results.length,
        failed: user_ids.length - results.length,
        transactions: results,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new VoucherController();