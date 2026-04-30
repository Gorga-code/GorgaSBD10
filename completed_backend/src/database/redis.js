let client;

try {
  if (process.env.REDIS_URL) {
    // Cloud Redis (e.g. Upstash)
    const Redis = require('ioredis');
    client = new Redis(process.env.REDIS_URL);
    client.on('error', (err) => {
      console.error('Redis Client Error', err);
    });
  } else if (process.env.NODE_ENV !== 'production') {
    // Local development: try connecting to local Redis
    const Redis = require('ioredis');
    client = new Redis({ host: '127.0.0.1', port: 6379 });
    client.on('error', (err) => {
      console.error('Redis Client Error (local)', err);
    });
  }
} catch (err) {
  console.warn('Redis not available, caching disabled:', err.message);
  client = null;
}

// No-op fallback when Redis is not available
if (!client) {
  client = {
    get: async () => null,
    set: async () => 'OK',
    setex: async () => 'OK',
    del: async () => 0,
    xadd: async () => null,
  };
  console.log('Redis not configured — running without cache');
}

module.exports = client;