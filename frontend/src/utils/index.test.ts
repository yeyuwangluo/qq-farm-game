import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatTime,
  formatDate,
  formatDateTime,
  getRemainingTime,
  generateId,
  debounce,
  throttle,
  deepClone,
  isMobile,
  isTablet,
  isDesktop,
} from '../utils/index';

describe('Utils - formatCurrency', () => {
  it('应该正确格式化金币金额', () => {
    expect(formatCurrency(1000, 'coins')).toBe('1,000 金币');
    expect(formatCurrency(0, 'coins')).toBe('0 金币');
    expect(formatCurrency(1000000, 'coins')).toBe('1,000,000 金币');
  });

  it('应该正确格式化点券金额', () => {
    expect(formatCurrency(100, 'vouchers')).toBe('100 点券');
    expect(formatCurrency(0, 'vouchers')).toBe('0 点券');
    expect(formatCurrency(5000, 'vouchers')).toBe('5,000 点券');
  });

  it('默认应该使用金币', () => {
    expect(formatCurrency(100)).toBe('100 金币');
  });
});

describe('Utils - formatTime', () => {
  it('应该正确格式化分钟数', () => {
    expect(formatTime(30)).toBe('30分钟');
    expect(formatTime(59)).toBe('59分钟');
  });

  it('应该正确格式化小时数', () => {
    expect(formatTime(60)).toBe('1小时');
    expect(formatTime(90)).toBe('1小时30分钟');
    expect(formatTime(120)).toBe('2小时');
  });

  it('应该正确格式化天数', () => {
    expect(formatTime(1440)).toBe('1天');
    expect(formatTime(1500)).toBe('1天1小时');
    expect(formatTime(2880)).toBe('2天');
  });
});

describe('Utils - formatDate', () => {
  it('应该正确格式化日期', () => {
    const date = new Date('2024-01-15');
    expect(formatDate(date)).toContain('2024年');
    expect(formatDate(date)).toContain('1月');
    expect(formatDate(date)).toContain('15日');
  });

  it('应该接受字符串日期', () => {
    const dateStr = '2024-06-07';
    expect(formatDate(dateStr)).toContain('2024年');
  });
});

describe('Utils - formatDateTime', () => {
  it('应该正确格式化日期时间', () => {
    const date = new Date('2024-01-15T14:30:00');
    const result = formatDateTime(date);
    expect(result).toContain('2024年');
    expect(result).toContain('1月');
    expect(result).toContain('15日');
  });
});

describe('Utils - getRemainingTime', () => {
  it('应该正确计算剩余时间', () => {
    const futureDate = new Date(Date.now() + 60 * 60 * 1000); // 1小时后
    const remaining = getRemainingTime(futureDate.toISOString());
    // 由于时间计算精度，允许1分钟的误差
    expect(remaining).toBeGreaterThanOrEqual(59);
    expect(remaining).toBeLessThanOrEqual(60);
  });

  it('应该返回0如果时间已过期', () => {
    const pastDate = new Date(Date.now() - 60 * 1000); // 1分钟前
    const remaining = getRemainingTime(pastDate.toISOString());
    expect(remaining).toBe(0);
  });
});

describe('Utils - generateId', () => {
  it('应该生成唯一ID', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
    expect(typeof id1).toBe('string');
  });

  it('ID应该包含时间戳', () => {
    const id = generateId();
    const parts = id.split('-');
    expect(parts.length).toBe(2);
    expect(parts[0]).toMatch(/^\d+$/); // 时间戳
  });
});

describe('Utils - debounce', () => {
  it('应该防抖函数调用', () => {
    vi.useFakeTimers();
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn();
    debouncedFn();
    debouncedFn();

    expect(mockFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });
});

describe('Utils - throttle', () => {
  it('应该节流函数调用', () => {
    vi.useFakeTimers();
    const mockFn = vi.fn();
    const throttledFn = throttle(mockFn, 100);

    throttledFn();
    throttledFn();
    throttledFn();

    expect(mockFn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);
    throttledFn();
    expect(mockFn).toHaveBeenCalledTimes(2);

    vi.useRealTimers();
  });
});

describe('Utils - deepClone', () => {
  it('应该深拷贝对象', () => {
    const obj = { a: 1, b: { c: 2 } };
    const cloned = deepClone(obj);
    expect(cloned).toEqual(obj);
    expect(cloned).not.toBe(obj);
    expect(cloned.b).not.toBe(obj.b);
  });

  it('应该深拷贝数组', () => {
    const arr = [1, 2, { a: 3 }];
    const cloned = deepClone(arr);
    expect(cloned).toEqual(arr);
    expect(cloned).not.toBe(arr);
    expect(cloned[2]).not.toBe(arr[2]);
  });

  it('应该处理null和基本类型', () => {
    expect(deepClone(null)).toBe(null);
    expect(deepClone(42)).toBe(42);
    expect(deepClone('test')).toBe('test');
  });

  it('应该处理Date对象', () => {
    const date = new Date('2024-01-15');
    const cloned = deepClone(date);
    expect(cloned).toEqual(date);
    expect(cloned).not.toBe(date);
  });
});

describe('Utils - Device Detection', () => {
  it('应该检测移动设备', () => {
    // 需要模拟window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    expect(isMobile()).toBe(true);
    expect(isTablet()).toBe(false);
    expect(isDesktop()).toBe(false);
  });

  it('应该检测平板设备', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 800,
    });
    expect(isMobile()).toBe(false);
    expect(isTablet()).toBe(true);
    expect(isDesktop()).toBe(false);
  });

  it('应该检测桌面设备', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200,
    });
    expect(isMobile()).toBe(false);
    expect(isTablet()).toBe(false);
    expect(isDesktop()).toBe(true);
  });
});