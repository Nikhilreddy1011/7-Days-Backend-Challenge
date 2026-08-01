const { Queue } = require("bullmq");
const redisConnection = require("../config/redis");

const cronQueue = new Queue("cronEmailQueue", {
  connection: redisConnection,
});

const setupCronJob = async () => {
  await cronQueue.upsertJobScheduler(
    "scheduled-email",
    {
      every: 30000,
    },
    {
      name: "scheduledEmail",
      data: {
        email: "scheduled@example.com",
        subject: "Scheduled Email",
        message: "This email job runs every 30 seconds",
      },
    }
  );

  console.log("Cron job scheduled - runs every 30 seconds");
};

module.exports = {
  cronQueue,
  setupCronJob,
};