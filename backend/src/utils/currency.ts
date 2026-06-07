/**
 * 货币格式化工具函数
 */
/**
 * 格式化货币（中文）
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
  }).format(amount);
}

/**
 * 格式化金币
 */
export function formatGold(amount: number): string {
  return `${amount.toLocaleString('zh-CN')} 金币`;
}

/**
 * 格式化点券
 */
export function formatVoucher(amount: number): string {
  return `${amount.toLocaleString('zh-CN')} 点券`;
}

/**
 * 格式化经验值
 */
export function formatExperience(amount: number): string {
  return `${amount.toLocaleString('zh-CN')} 经验`;
}

/**
 * 计算等级
 */
export function calculateLevel(experience: number): number {
  let level = 1;
  let requiredExp = 100;

  while (experience >= requiredExp) {
    experience -= requiredExp;
    level++;
    requiredExp = Math.floor(requiredExp * 1.2);
  }

  return level;
}

/**
 * 计算等级所需经验
 */
export function getExperienceForLevel(level: number): number {
  if (level <= 1) return 0;

  let totalExp = 0;
  for (let i = 1; i < level; i++) {
    totalExp += Math.floor(100 * Math.pow(1.2, i - 1));
  }

  return totalExp;
}

/**
 * 获取当前等级进度
 */
export function getLevelProgress(currentExp: number, level: number): {
  current: number;
  required: number;
  percentage: number;
} {
  const prevLevelExp = getExperienceForLevel(level);
  const nextLevelExp = getExperienceForLevel(level + 1);

  const current = currentExp - prevLevelExp;
  const required = nextLevelExp - prevLevelExp;
  const percentage = Math.floor((current / required) * 100);

  return { current, required, percentage };
}