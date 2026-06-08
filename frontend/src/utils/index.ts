/**
 * 格式化货币金额
 * @param amount 金额
 * @param currency 货币类型 'coins' | 'vouchers'
 */
export const formatCurrency = (amount: number, currency: 'coins' | 'vouchers' = 'coins'): string => {
  if (currency === 'vouchers') {
    return `${amount.toLocaleString()} 点券`;
  }
  return `${amount.toLocaleString()} 金币`;
};

/**
 * 格式化时间
 * @param minutes 分钟数
 */
export const formatTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}分钟`;
  } else if (minutes < 1440) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`;
  } else {
    const days = Math.floor(minutes / 1440);
    const hours = Math.floor((minutes % 1440) / 60);
    return hours > 0 ? `${days}天${hours}小时` : `${days}天`;
  }
};

/**
 * 格式化日期
 * @param date 日期字符串或Date对象
 */
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * 格式化日期时间
 * @param date 日期字符串或Date对象
 */
export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * 计算剩余时间
 * @param targetTime 目标时间字符串
 * @returns 剩余分钟数，如果已过期返回0
 */
export const getRemainingTime = (targetTime: string): number => {
  const now = new Date();
  const target = new Date(targetTime);
  const diff = target.getTime() - now.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60)));
};

/**
 * 生成唯一ID
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param wait 等待时间（毫秒）
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * 节流函数
 * @param func 要节流的函数
 * @param limit 时间限制（毫秒）
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * 深拷贝对象
 * @param obj 要拷贝的对象
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }
  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item)) as any;
  }
  const clonedObj = {} as any;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = deepClone(obj[key]);
    }
  }
  return clonedObj;
};

/**
 * 检查是否为移动设备
 */
export const isMobile = (): boolean => {
  return window.innerWidth < 768;
};

/**
 * 检查是否为平板设备
 */
export const isTablet = (): boolean => {
  return window.innerWidth >= 768 && window.innerWidth < 1024;
};

/**
 * 检查是否为桌面设备
 */
export const isDesktop = (): boolean => {
  return window.innerWidth >= 1024;
};