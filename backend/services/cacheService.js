import { logger } from '../utils/logger.js';

class MemoryCacheStore {
  constructor() {
    this.store = new Map();
  }

  get(key) {
    const entry = this.store.get(key);
    if (!entry) return null;
    
    // Check expiration
    if (entry.expiresAt && entry.expiresAt < Date.now()) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  set(key, value, ttlSeconds) {
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
    this.store.set(key, { value, expiresAt });
  }

  del(key) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }
}

class CacheService {
  constructor() {
    this.provider = 'memory';
    this.store = new MemoryCacheStore();
    logger.info('CacheService initialized with Local Memory Provider.');
  }

  async get(key) {
    try {
      return this.store.get(key);
    } catch (err) {
      logger.warn(`Cache GET error: ${err.message}`);
      return null;
    }
  }

  async set(key, value, ttlSeconds = 3600) {
    try {
      this.store.set(key, value, ttlSeconds);
    } catch (err) {
      logger.warn(`Cache SET error: ${err.message}`);
    }
  }

  async del(key) {
    try {
      this.store.del(key);
    } catch (err) {
      logger.warn(`Cache DEL error: ${err.message}`);
    }
  }

  async clear() {
    try {
      this.store.clear();
    } catch (err) {
      logger.warn(`Cache CLEAR error: ${err.message}`);
    }
  }
}

const cacheServiceInstance = new CacheService();
export default cacheServiceInstance;
