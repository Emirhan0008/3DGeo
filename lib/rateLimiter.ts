import { NextRequest } from 'next/server';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory sliding window rate limiter store
const ipCache = new Map<string, RateLimitRecord>();

// Periodically clean up expired entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of ipCache.entries()) {
      if (record.resetTime <= now) {
        ipCache.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * Extracts client IP from request headers or falls back to 'unknown'.
 */
export function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}

export interface RateLimitOptions {
  limit?: number; // max allowed requests within window
  windowSeconds?: number; // window size in seconds
}

export interface RateLimitResult {
  isAllowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

/**
 * Enforces sliding window rate limit per client IP.
 */
export function checkRateLimit(
  req: NextRequest,
  options: RateLimitOptions = {}
): RateLimitResult {
  const limit = options.limit || 15; // 15 requests default
  const windowMs = (options.windowSeconds || 60) * 1000; // 60 seconds default
  const ip = getClientIp(req);
  const now = Date.now();

  const record = ipCache.get(ip);

  if (!record || record.resetTime <= now) {
    // New or expired window
    ipCache.set(ip, {
      count: 1,
      resetTime: now + windowMs
    });
    return {
      isAllowed: true,
      remaining: limit - 1,
      retryAfterSeconds: 0
    };
  }

  if (record.count >= limit) {
    const retryAfterSeconds = Math.max(1, Math.ceil((record.resetTime - now) / 1000));
    return {
      isAllowed: false,
      remaining: 0,
      retryAfterSeconds
    };
  }

  record.count += 1;
  return {
    isAllowed: true,
    remaining: limit - record.count,
    retryAfterSeconds: 0
  };
}
