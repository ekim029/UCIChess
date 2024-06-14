const redis = require('redis');
require('dotenv').config();

const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
})

redisClient.on('error', (err) => {
    console.log(err);
})

redisClient.on('connect', () => {
    console.log("Connected to Redis");
})


module.exports = redisClient;