require("dotenv").config();

const { Worker } = require("bullmq");
const redisConnection = require("../config/redis");

const cronWorker = new Worker(
  "cronEmailQueue",
  async (job) => {
    console.log("\nScheduled Job Started");
    console.log("Job ID:", job.id);
    console.log("To:", job.data.email);
    console.log("Subject:", job.data.subject);
    console.log("Message:", job.data.message);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Scheduled email processed successfully");
  },
  {
    connection: redisConnection,
  }
);

cronWorker.on("completed", (job) => {
  console.log(`Scheduled Job ${job.id} completed`);
});

cronWorker.on("failed", (job, error) => {
  console.log(`Scheduled Job ${job?.id} failed: ${error.message}`);
});

console.log("Cron worker started...");