/**
 * 点券服务单元测试
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import VoucherService from '../../src/services/voucher.service';
import UserModel from '../../src/models/user.model';
import { VoucherTransactionType } from '../../src/types/voucher.types';
import { AppError } from '../../src/utils/response';

describe('VoucherService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getBalance', () => {
    it('应该成功获取用户点券余额', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        vouchers: 100,
      };

      vi.spyOn(UserModel, 'findById').mockResolvedValue(mockUser as any);

      const result = await VoucherService.getBalance(1);

      expect(result).toHaveProperty('user_id', 1);
      expect(result).toHaveProperty('balance', 100);
    });

    it('当用户不存在时应该抛出错误', async () => {
      vi.spyOn(UserModel, 'findById').mockResolvedValue(null);

      await expect(VoucherService.getBalance(1)).rejects.toThrow('用户不存在');
    });
  });

  describe('addVouchers', () => {
    it('应该成功增加点券', async () => {
      const mockUser = {
        id: 1,
        vouchers: 100,
      };

      const mockUpdatedUser = {
        id: 1,
        vouchers: 150,
      };

      vi.spyOn(UserModel, 'findById').mockResolvedValueOnce(mockUser as any);
      vi.spyOn(UserModel, 'addVouchers').mockResolvedValue(true);
      vi.spyOn(UserModel, 'findById').mockResolvedValueOnce(mockUpdatedUser as any);

      const result = await VoucherService.addVouchers(1, 50, '完成任务奖励');

      expect(result).toHaveProperty('user_id', 1);
      expect(result).toHaveProperty('type', VoucherTransactionType.EARN);
      expect(result).toHaveProperty('amount', 50);
      expect(result).toHaveProperty('balance_before', 100);
      expect(result).toHaveProperty('balance_after', 150);
      expect(result).toHaveProperty('reason', '完成任务奖励');
    });

    it('当点券数量小于等于0时应该抛出错误', async () => {
      await expect(VoucherService.addVouchers(1, 0, '')).rejects.toThrow('点券数量必须大于0');
      await expect(VoucherService.addVouchers(1, -10, '')).rejects.toThrow('点券数量必须大于0');
    });

    it('当用户不存在时应该抛出错误', async () => {
      vi.spyOn(UserModel, 'findById').mockResolvedValue(null);

      await expect(VoucherService.addVouchers(1, 50, '')).rejects.toThrow('用户不存在');
    });
  });

  describe('subtractVouchers', () => {
    it('应该成功扣除点券', async () => {
      const mockUser = {
        id: 1,
        vouchers: 100,
      };

      const mockUpdatedUser = {
        id: 1,
        vouchers: 50,
      };

      vi.spyOn(UserModel, 'findById').mockResolvedValueOnce(mockUser as any);
      vi.spyOn(UserModel, 'reduceVouchers').mockResolvedValue(true);
      vi.spyOn(UserModel, 'findById').mockResolvedValueOnce(mockUpdatedUser as any);

      const result = await VoucherService.subtractVouchers(1, 50, '购买道具');

      expect(result).toHaveProperty('user_id', 1);
      expect(result).toHaveProperty('type', VoucherTransactionType.SPEND);
      expect(result).toHaveProperty('amount', 50);
      expect(result).toHaveProperty('balance_before', 100);
      expect(result).toHaveProperty('balance_after', 50);
      expect(result).toHaveProperty('reason', '购买道具');
    });

    it('当点券不足时应该抛出错误', async () => {
      const mockUser = {
        id: 1,
        vouchers: 30,
      };

      vi.spyOn(UserModel, 'findById').mockResolvedValue(mockUser as any);

      await expect(VoucherService.subtractVouchers(1, 50, '')).rejects.toThrow('点券不足');
    });

    it('当点券数量小于等于0时应该抛出错误', async () => {
      await expect(VoucherService.subtractVouchers(1, 0, '')).rejects.toThrow('点券数量必须大于0');
      await expect(VoucherService.subtractVouchers(1, -10, '')).rejects.toThrow('点券数量必须大于0');
    });
  });

  describe('processTransaction', () => {
    it('应该正确处理收入交易', async () => {
      const mockUser = {
        id: 1,
        vouchers: 100,
      };

      const mockUpdatedUser = {
        id: 1,
        vouchers: 150,
      };

      vi.spyOn(UserModel, 'findById').mockResolvedValueOnce(mockUser as any);
      vi.spyOn(UserModel, 'addVouchers').mockResolvedValue(true);
      vi.spyOn(UserModel, 'findById').mockResolvedValueOnce(mockUpdatedUser as any);

      const request = {
        type: VoucherTransactionType.EARN,
        amount: 50,
        reason: '任务奖励',
      };

      const result = await VoucherService.processTransaction(1, request);

      expect(result.type).toBe(VoucherTransactionType.EARN);
      expect(result.amount).toBe(50);
    });

    it('应该正确处理支出交易', async () => {
      const mockUser = {
        id: 1,
        vouchers: 100,
      };

      const mockUpdatedUser = {
        id: 1,
        vouchers: 50,
      };

      vi.spyOn(UserModel, 'findById').mockResolvedValueOnce(mockUser as any);
      vi.spyOn(UserModel, 'reduceVouchers').mockResolvedValue(true);
      vi.spyOn(UserModel, 'findById').mockResolvedValueOnce(mockUpdatedUser as any);

      const request = {
        type: VoucherTransactionType.SPEND,
        amount: 50,
        reason: '购买道具',
      };

      const result = await VoucherService.processTransaction(1, request);

      expect(result.type).toBe(VoucherTransactionType.SPEND);
      expect(result.amount).toBe(50);
    });

    it('当交易类型无效时应该抛出错误', async () => {
      const request = {
        type: 'invalid_type' as any,
        amount: 50,
      };

      await expect(VoucherService.processTransaction(1, request)).rejects.toThrow('无效的交易类型');
    });
  });

  describe('validateBalance', () => {
    it('应该正确验证充足的余额', async () => {
      const mockUser = {
        id: 1,
        vouchers: 100,
      };

      vi.spyOn(UserModel, 'findById').mockResolvedValue(mockUser as any);

      const isValid = await VoucherService.validateBalance(1, 50);

      expect(isValid).toBe(true);
    });

    it('应该正确验证不足的余额', async () => {
      const mockUser = {
        id: 1,
        vouchers: 30,
      };

      vi.spyOn(UserModel, 'findById').mockResolvedValue(mockUser as any);

      const isValid = await VoucherService.validateBalance(1, 50);

      expect(isValid).toBe(false);
    });

    it('当用户不存在时应该返回false', async () => {
      vi.spyOn(UserModel, 'findById').mockResolvedValue(null);

      const isValid = await VoucherService.validateBalance(1, 50);

      expect(isValid).toBe(false);
    });
  });

  describe('bulkAddVouchers', () => {
    it('应该成功批量增加点券', async () => {
      const mockUser = {
        id: 1,
        vouchers: 100,
      };

      const mockUpdatedUser = {
        id: 1,
        vouchers: 150,
      };

      vi.spyOn(UserModel, 'findById').mockResolvedValue(mockUser as any);
      vi.spyOn(UserModel, 'addVouchers').mockResolvedValue(true);
      vi.spyOn(UserModel, 'findById').mockResolvedValue(mockUpdatedUser as any);

      const results = await VoucherService.bulkAddVouchers([1, 2, 3], 50, '活动奖励');

      expect(results).toHaveLength(3);
      results.forEach((result) => {
        expect(result).toHaveProperty('amount', 50);
        expect(result).toHaveProperty('type', VoucherTransactionType.EARN);
      });
    });

    it('当点券数量小于等于0时应该抛出错误', async () => {
      await expect(VoucherService.bulkAddVouchers([1, 2], 0, '')).rejects.toThrow('点券数量必须大于0');
    });
  });
});