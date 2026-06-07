/**
 * 点券类型定义
 */

/**
 * 点券交易类型
 */
export enum VoucherTransactionType {
  EARN = 'earn',
  SPEND = 'spend',
  ADMIN_ADD = 'admin_add',
  ADMIN_SUBTRACT = 'admin_subtract',
}

/**
 * 点券交易请求
 */
export interface VoucherTransactionRequest {
  type: VoucherTransactionType;
  amount: number;
  reason?: string;
}

/**
 * 点券交易结果
 */
export interface VoucherTransactionResult {
  user_id: number;
  type: VoucherTransactionType;
  amount: number;
  balance_before: number;
  balance_after: number;
  reason?: string;
  transaction_id?: number;
}