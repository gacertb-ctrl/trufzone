"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ioredis_1 = require("ioredis");
// @ts-ignore
var ioredis_mock_1 = require("ioredis-mock");
var redisInstance;
try {
    if (process.env.NODE_ENV === 'test' || process.env.USE_REDIS_MOCK === 'true' || !process.env.REDIS_URL) {
        redisInstance = new ioredis_mock_1.default();
        console.log('Redis: Running in-memory mock (ioredis-mock)');
    }
    else {
        redisInstance = new ioredis_1.default(process.env.REDIS_URL, {
            maxRetriesPerRequest: 1,
            retryStrategy: function () { return null; }, // don't retry endlessly if redis not running
        });
        redisInstance.on('error', function (err) {
            console.warn('Redis warning (using fallback mock if offline):', err.message);
        });
    }
}
catch (e) {
    console.warn('Falling back to RedisMock due to error:', e);
    redisInstance = new ioredis_mock_1.default();
}
exports.default = redisInstance;
