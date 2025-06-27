import redisClient from './utils/redis.js';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
    console.log(`Is Redis alive? ${redisClient.isAlive()}`);
    await sleep(1000); // Give some time for connection to establish
    console.log(`Is Redis alive after 1s? ${redisClient.isAlive()}`);
    console.log(`Value of myKey: ${await redisClient.get('myKey')}`);
    await redisClient.set('myKey', 12, 5);
    console.log(`Value of myKey after set: ${await redisClient.get('myKey')}`);

    await sleep(6000); // Wait for key to expire
    console.log(`Value of myKey after 6s: ${await redisClient.get('myKey')}`);
})();


