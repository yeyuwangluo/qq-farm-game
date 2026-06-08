/**
 * Redis客户端配置
 */
import { createClient, RedisClientType } from 'redis';
import config from './index.js';

let client: RedisClientType | null = null;

/**
 * 创建Redis客户端
 */
export async function createRedisClient(): Promise<RedisClientType> {
  if (client) {
    return client;
  }

  client = createClient({
    socket: {
      host: config.redis.host,
      port: config.redis.port,
      reconnectStrategy: retries => {
        if (retries > config.redis.maxRetries) {
          return new Error('Max retries reached');
        }
        return config.redis.retryDelay;
      },
    },
    password: config.redis.password || undefined,
    database: config.redis.db,
  });

  client.on('error', err => {
    console.error('Redis Client Error:', err);
  });

  client.on('connect', () => {
    console.log('Redis Client Connected');
  });

  client.on('disconnect', () => {
    console.log('Redis Client Disconnected');
  });

  await client.connect();
  return client;
}

/**
 * 获取Redis客户端
 */
export async function getRedisClient(): Promise<RedisClientType> {
  if (!client) {
    client = await createRedisClient();
  }
  return client;
}

/**
 * 设置键值对
 */
export async function set(key: string, value: string, seconds?: number): Promise<void> {
  const redis = await getRedisClient();
  if (seconds) {
    await redis.setEx(key, seconds, value);
  } else {
    await redis.set(key, value);
  }
}

/**
 * 获取键值
 */
export async function get(key: string): Promise<string | null> {
  const redis = await getRedisClient();
  return await redis.get(key);
}

/**
 * 删除键
 */
export async function del(key: string): Promise<number> {
  const redis = await getRedisClient();
  return await redis.del(key);
}

/**
 * 检查键是否存在
 */
export async function exists(key: string): Promise<number> {
  const redis = await getRedisClient();
  return await redis.exists(key);
}

/**
 * 设置过期时间
 */
export async function expire(key: string, seconds: number): Promise<boolean> {
  const redis = await getRedisClient();
  return await redis.expire(key, seconds);
}

/**
 * 获取剩余过期时间
 */
export async function ttl(key: string): Promise<number> {
  const redis = await getRedisClient();
  return await redis.ttl(key);
}

/**
 * 设置哈希字段
 */
export async function hset(key: string, field: string, value: string): Promise<number> {
  const redis = await getRedisClient();
  return await redis.hSet(key, field, value);
}

/**
 * 获取哈希字段
 */
export async function hget(key: string, field: string): Promise<string | null> {
  const redis = await getRedisClient();
  const result = await redis.hGet(key, field);
  return result;
}

/**
 * 获取哈希所有字段
 */
export async function hgetall(key: string): Promise<Record<string, string>> {
  const redis = await getRedisClient();
  return await redis.hGetAll(key);
}

/**
 * 删除哈希字段
 */
export async function hdel(key: string, field: string): Promise<number> {
  const redis = await getRedisClient();
  return await redis.hDel(key, field);
}

/**
 * 列表左侧推入
 */
export async function lpush(key: string, ...values: string[]): Promise<number> {
  const redis = await getRedisClient();
  return await redis.lPush(key, values);
}

/**
 * 列表右侧推入
 */
export async function rpush(key: string, ...values: string[]): Promise<number> {
  const redis = await getRedisClient();
  return await redis.rPush(key, values);
}

/**
 * 列表左侧弹出
 */
export async function lpop(key: string): Promise<string | null> {
  const redis = await getRedisClient();
  return await redis.lPop(key);
}

/**
 * 列表右侧弹出
 */
export async function rpop(key: string): Promise<string | null> {
  const redis = await getRedisClient();
  return await redis.rPop(key);
}

/**
 * 获取列表长度
 */
export async function llen(key: string): Promise<number> {
  const redis = await getRedisClient();
  return await redis.lLen(key);
}

/**
 * 获取列表范围
 */
export async function lrange(key: string, start: number, stop: number): Promise<string[]> {
  const redis = await getRedisClient();
  return await redis.lRange(key, start, stop);
}

/**
 * 集合添加成员
 */
export async function sadd(key: string, ...members: string[]): Promise<number> {
  const redis = await getRedisClient();
  return await redis.sAdd(key, members);
}

/**
 * 集合移除成员
 */
export async function srem(key: string, ...members: string[]): Promise<number> {
  const redis = await getRedisClient();
  return await redis.sRem(key, members);
}

/**
 * 集合检查成员是否存在
 */
export async function sismember(key: string, member: string): Promise<number> {
  const redis = await getRedisClient();
  return await redis.sIsMember(key, member);
}

/**
 * 获取集合所有成员
 */
export async function smembers(key: string): Promise<string[]> {
  const redis = await getRedisClient();
  return await redis.sMembers(key);
}

/**
 * 有序集合添加成员
 */
export async function zadd(key: string, score: number, member: string): Promise<number> {
  const redis = await getRedisClient();
  return await redis.zAdd(key, { score, value: member });
}

/**
 * 有序集合移除成员
 */
export async function zrem(key: string, ...members: string[]): Promise<number> {
  const redis = await getRedisClient();
  return await redis.zRem(key, members);
}

/**
 * 有序集合获取成员分数
 */
export async function zscore(key: string, member: string): Promise<number | null> {
  const redis = await getRedisClient();
  return await redis.zScore(key, member);
}

/**
 * 有序集合获取排名
 */
export async function zrank(key: string, member: string): Promise<number | null> {
  const redis = await getRedisClient();
  return await redis.zRank(key, member);
}

/**
 * 有序集合获取范围
 */
export async function zrange(key: string, start: number, stop: number): Promise<string[]> {
  const redis = await getRedisClient();
  return await redis.zRange(key, start, stop);
}

/**
 * 关闭Redis客户端
 */
export async function closeRedis(): Promise<void> {
  if (client) {
    await client.quit();
    client = null;
  }
}
