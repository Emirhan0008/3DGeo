import { NextRequest } from 'next/server';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory sliding window rate limiter store with bounded size to prevent memory exhaustion DoS
const MAX_CACHE_SIZE = 5000;
const ipCache = new Map<string, RateLimitRecord>();

// Periodically clean up expired entries every 2 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of ipCache.entries()) {
      if (record.resetTime <= now) {
        ipCache.delete(key);
      }
    }
  }, 2 * 60 * 1000);
}

/**
 * Validates if an IP string is well-formed IPv4 or IPv6.
 */
function isValidIp(ip: string): boolean {
  if (!ip || ip.length > 45) return false;
  // Basic IPv4 or IPv6 validation
  const ipv4Regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
  const ipv6Regex = /^[a-fA-F0-9:]+$/;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

/**
 * Extracts and sanitizes client IP from edge headers.
 * Prioritizes trusted provider headers (Vercel, Cloud Run, Cloudflare) over user-controllable headers.
 */
export function getClientIp(req: NextRequest): string {
  // 1. Edge-provided trusted headers
  const realIp = req.headers.get('x-real-ip');
  if (realIp && isValidIp(realIp.trim())) {
    return realIp.trim();
  }

  const vercelIp = req.headers.get('x-vercel-ip');
  if (vercelIp && isValidIp(vercelIp.trim())) {
    return vercelIp.trim();
  }

  const cfIp = req.headers.get('cf-connecting-ip');
  if (cfIp && isValidIp(cfIp.trim())) {
    return cfIp.trim();
  }

  // 2. X-Forwarded-For fallback: in reverse proxies, the rightmost non-internal IP is added by the proxy
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const ips = forwardedFor.split(',').map(s => s.trim()).filter(Boolean);
    // Take rightmost valid IP to avoid spoofed leftmost headers
    for (let i = ips.length - 1; i >= 0; i--) {
      if (isValidIp(ips[i])) {
        return ips[i];
      }
    }
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
 * Enforces sliding window rate limit per client IP with DoS protection.
 */
export function checkRateLimit(
  req: NextRequest,
  options: RateLimitOptions = {}
): RateLimitResult {
  const limit = options.limit || 15; // 15 requests default
  const windowMs = (options.windowSeconds || 60) * 1000; // 60 seconds default
  const ip = getClientIp(req);
  const now = Date.now();

  // Guard against cache overflow
  if (ipCache.size >= MAX_CACHE_SIZE) {
    // Purge expired records immediately
    for (const [key, record] of ipCache.entries()) {
      if (record.resetTime <= now) {
        ipCache.delete(key);
      }
    }
    // If still at capacity, drop the oldest entry
    if (ipCache.size >= MAX_CACHE_SIZE) {
      const firstKey = ipCache.keys().next().value;
      if (firstKey) ipCache.delete(firstKey);
    }
  }

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
