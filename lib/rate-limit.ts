import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

function createRedisClient() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url?.trim() && token?.trim()) {
    return new Redis({ url, token });
  }
  return null;
}

const redisClient = createRedisClient();

type RateLimitResult = {
  success: boolean;
  remaining: number;
  reset: number;
  limit: number;
};

function createUpstashLimiter(maxRequests: number, windowMs: number, prefix: string) {
  const ratelimit = new Ratelimit({
    redis: redisClient!,
    limiter: Ratelimit.slidingWindow(maxRequests, `${windowMs}ms`),
    prefix,
  });
  return {
    limit: async (identifier: string): Promise<RateLimitResult> => {
      const { success, limit, remaining, reset } = await ratelimit.limit(identifier);
      return { success, remaining, reset: reset ?? Date.now() + windowMs, limit };
    },
  };
}

function createInMemoryLimiter(maxRequests: number, windowMs: number, prefix: string) {
  const stores = new Map<string, { count: number; resetAt: number }>();
  return {
    limit: async (identifier: string): Promise<RateLimitResult> => {
      const now = Date.now();
      const key = `${prefix}:${identifier}`;
      const entry = stores.get(key);
      if (!entry || entry.resetAt < now) {
        stores.set(key, { count: 1, resetAt: now + windowMs });
        return { success: true, remaining: maxRequests - 1, reset: now + windowMs, limit: maxRequests };
      }
      entry.count += 1;
      if (entry.count > maxRequests) {
        return { success: false, remaining: 0, reset: entry.resetAt, limit: maxRequests };
      }
      return { success: true, remaining: maxRequests - entry.count, reset: entry.resetAt, limit: maxRequests };
    },
  };
}

function createLimiter(maxRequests: number, windowMs: number, prefix: string) {
  if (redisClient) {
    return createUpstashLimiter(maxRequests, windowMs, prefix);
  }
  return createInMemoryLimiter(maxRequests, windowMs, prefix);
}

const TEN_MIN = 10 * 60 * 1000;
const FIVE_MIN = 5 * 60 * 1000;

export const loginLimiter = createLimiter(10, TEN_MIN, "login");
export const signupLimiter = createLimiter(5, TEN_MIN, "signup");
export const forgotPasswordLimiter = createLimiter(3, FIVE_MIN, "forgot-pw");
export const resetPasswordLimiter = createLimiter(3, FIVE_MIN, "reset-pw");
export const resendVerificationLimiter = createLimiter(3, TEN_MIN, "resend-verify");
