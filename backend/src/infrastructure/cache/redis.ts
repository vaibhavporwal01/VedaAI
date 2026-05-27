import { Redis } from "ioredis";
import { env } from "../../config/env.js";
import { logger } from "../../config/logger.js";

let redis: Redis | null = null;

export function getRedis() {
  if (!redis) {
    redis = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false
    });

    redis.on("error", (error: Error) => {
      logger.error("Redis error", error.message);
    });
  }

  return redis;
}

export async function assertRedisReady() {
  try {
    const response = await getRedis().ping();
    if (response !== "PONG") {
      throw new Error("Redis ping failed");
    }
  } catch (error) {
    logger.error("Redis unavailable", error);
    throw new Error("Redis unavailable");
  }
}

export async function cacheJson(key: string, value: unknown, ttlSeconds: number) {
  await getRedis().set(key, JSON.stringify(value), "EX", ttlSeconds);
}

export async function getCachedJson<T>(key: string) {
  const cached = await getRedis().get(key);
  return cached ? (JSON.parse(cached) as T) : null;
}

export async function removeCache(key: string) {
  await getRedis().del(key);
}

export function getBullConnectionOptions() {
  const redisUrl = new URL(env.REDIS_URL);

  return {
    host: redisUrl.hostname,
    port: Number(redisUrl.port || 6379),
    username: redisUrl.username || undefined,
    password: redisUrl.password || undefined,
    tls: redisUrl.protocol === "rediss:" ? {} : undefined,
    maxRetriesPerRequest: null
  };
}
