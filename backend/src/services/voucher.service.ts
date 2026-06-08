/**
 * 点券服务
 */

import UserModel from '../models/user.model';
import {
  VoucherTransactionType,
  VoucherTransactionRequest,
  VoucherTransactionResult,
} from '../types/voucher.types';
import { AppError } from '../utils/response';

class VoucherService {
  /**
   * 获取用户点券余额
   */
  async getBalance(userId: number): Promise<{ user_id: number; balance: number }> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw AppError.notFound('用户不存在');
    }

    return {
      user_id: userId,
      balance: user.vouchers || 0,
    };
  }

  /**
   * 增加点券
   */
  async addVouchers(
    userId: number,
    amount: number,
    reason: string = ''
  ): Promise<VoucherTransactionResult> {
    if (amount <= 0) {
      throw AppError.badRequest('点券数量必须大于0');
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      throw AppError.notFound('用户不存在');
    }

    const balanceBefore = user.vouchers || 0;
    await UserModel.addVouchers(userId, amount);

    const updatedUser = await UserModel.findById(userId);
    const balanceAfter = updatedUser?.vouchers || 0;

    return {
      user_id: userId,
      type: VoucherTransactionType.EARN,
      amount,
      balance_before: balanceBefore,
      balance_after: balanceAfter,
      reason,
    };
  }

  /**
   * 扣除点券
   */
  async subtractVouchers(
    userId: number,
    amount: number,
    reason: string = ''
  ): Promise<VoucherTransactionResult> {
    if (amount <= 0) {
      throw AppError.badRequest('点券数量必须大于0');
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      throw AppError.notFound('用户不存在');
    }

    const balanceBefore = user.vouchers || 0;

    if (balanceBefore < amount) {
      throw AppError.badRequest('点券不足');
    }

    await UserModel.reduceVouchers(userId, amount);

    const updatedUser = await UserModel.findById(userId);
    const balanceAfter = updatedUser?.vouchers || 0;

    return {
      user_id: userId,
      type: VoucherTransactionType.SPEND,
      amount,
      balance_before: balanceBefore,
      balance_after: balanceAfter,
      reason,
    };
  }

  /**
   * 处理点券交易
   */
  async processTransaction(
    userId: number,
    request: VoucherTransactionRequest
  ): Promise<VoucherTransactionResult> {
    const { type, amount, reason } = request;

    switch (type) {
      case VoucherTransactionType.EARN:
      case VoucherTransactionType.ADMIN_ADD:
        return await this.addVouchers(userId, amount, reason);

      case VoucherTransactionType.SPEND:
      case VoucherTransactionType.ADMIN_SUBTRACT:
        return await this.subtractVouchers(userId, amount, reason);

      default:
        throw AppError.badRequest('无效的交易类型');
    }
  }

  /**
   * 验证点券余额
   */
  async validateBalance(userId: number, requiredAmount: number): Promise<boolean> {
    const user = await UserModel.findById(userId);
    if (!user) {
      return false;
    }

    return (user.vouchers || 0) >= requiredAmount;
  }

  /**
   * 批量给用户增加点券（管理员功能）
   */
  async bulkAddVouchers(
    userIds: number[],
    amount: number,
    reason: string = ''
  ): Promise<VoucherTransactionResult[]> {
    if (amount <= 0) {
      throw AppError.badRequest('点券数量必须大于0');
    }

    const results: VoucherTransactionResult[] = [];

    for (const userId of userIds) {
      try {
        const result = await this.addVouchers(userId, amount, reason);
        results.push(result);
      } catch (error) {
        console.error(`Failed to add vouchers for user ${userId}:`, error);
      }
    }

    return results;
  }
}

export default new VoucherService();