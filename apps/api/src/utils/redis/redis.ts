import { Redis } from 'ioredis';
import { env } from '$src/config/env';

// Only create Redis connection if REDIS_URL is provided
export const redis = env.REDIS_URL
    ? new Redis(env.REDIS_URL)
    : new Redis({
        lazyConnect: true,
        retryStrategy: () => null, // Don't retry if Redis is not available
        enableOfflineQueue: false
    });
