const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 120;

const requestStore = new Map<string, number[]>();

export function rateLimit(
  ip: string,
  maxRequests = 120,
  windowMs = 60 * 1000
): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;

  const requestTimestamps = requestStore.get(ip) || [];

  const recentRequests = requestTimestamps.filter(
    (timestamp) => timestamp > windowStart
  );

  if (recentRequests.length >= maxRequests) {
    requestStore.set(ip, recentRequests);
    return false;
  }

  recentRequests.push(now);
  requestStore.set(ip, recentRequests);

  return true;
}

export function cleanupOldEntries(): void {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;

  for (const [ip, timestamps] of requestStore.entries()) {
    const recentRequests = timestamps.filter(
      (timestamp) => timestamp > windowStart
    );

    if (recentRequests.length === 0) {
      requestStore.delete(ip);
    } else {
      requestStore.set(ip, recentRequests);
    }
  }
}

export function getRemainingRequests(ip: string): number {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;

  const requestTimestamps = requestStore.get(ip) || [];
  const recentRequests = requestTimestamps.filter(
    (timestamp) => timestamp > windowStart
  );

  return Math.max(0, MAX_REQUESTS_PER_WINDOW - recentRequests.length);
}

export function resetRateLimit(ip: string): void {
  requestStore.delete(ip);
}