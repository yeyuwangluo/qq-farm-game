/**
 * 日期时间工具函数
 */
/**
 * 格式化日期为YYYY-MM-DD HH:mm:ss
 */
export function formatDateTime(date: Date): string {
  const pad = (num: number) => String(num).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

/**
 * 格式化日期为YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  const pad = (num: number) => String(num).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * 获取当前时间戳（秒）
 */
export function getCurrentTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

/**
 * 获取当前时间戳（毫秒）
 */
export function getCurrentTimestampMs(): number {
  return Date.now();
}

/**
 * 判断日期是否过期
 */
export function isExpired(expiresAt: number): boolean {
  return getCurrentTimestamp() > expiresAt;
}

/**
 * 获取过期时间戳
 */
export function getExpirationTimestamp(seconds: number): number {
  return getCurrentTimestamp() + seconds;
}

/**
 * 计算两个日期之间的天数差
 */
export function getDaysDiff(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
}

/**
 * 获取日期的开始时间（00:00:00）
 */
export function getStartOfDay(date: Date): Date {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}

/**
 * 获取日期的结束时间（23:59:59）
 */
export function getEndOfDay(date: Date): Date {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
}