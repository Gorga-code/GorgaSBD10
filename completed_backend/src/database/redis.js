const Redis = require('ioredis');
const client = new Redis({
    host: '127.0.0.1',
    port: 6379,
});

client.on('error', (err) => {
    console.error('Redis Client Error', err);
});

module.exports = client;