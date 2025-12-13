// backend/src/utils/cache.js
class SimpleCache {
  constructor(ttlSeconds = 300) {
    this.cache = new Map();
    this.ttl = ttlSeconds * 1000;
  }

  set(key, value) {
    this.cache.set(key, {
      value,
      expiry: Date.now() + this.ttl,
    });
  }

  get(key) {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  delete(key) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  // Clear expired entries periodically
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

export const analyticsCache = new SimpleCache(60); // 1 minute TTL
export const userCache = new SimpleCache(300); // 5 minute TTL

// Cleanup every 5 minutes
setInterval(() => {
  analyticsCache.cleanup();
  userCache.cleanup();
}, 5 * 60 * 1000);