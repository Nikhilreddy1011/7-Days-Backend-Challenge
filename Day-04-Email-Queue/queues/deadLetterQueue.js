const { Queue } = require("bullmq");
const redisConnection = require("../config/redis");

const deadLetterQueue = new Queue("deadLetterQueue", {
  connection: redisConnection,
});

module.exports = deadLetterQueue;