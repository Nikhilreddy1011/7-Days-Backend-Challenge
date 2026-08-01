require("dotenv").config();

const { Worker } = require("bullmq");
const redisConnection = require("../config/redis");

const deadLetterWorker = new Worker(
  "deadLetterQueue",
  async (job) => {
    console.log("\nDead Letter Job Received");
    console.log("------------------------");
    console.log("Original Job ID:", job.data.originalJobId);
    console.log("Email:", job.data.email);
    console.log("Subject:", job.data.subject);
    console.log("Error:", job.data.error);
    console.log("------------------------");

    return {
      status: "recorded",
    };
  },
  {
    connection: redisConnection,
  }
);

deadLetterWorker.on("completed", (job) => {
  console.log(`Dead Letter Job ${job.id} processed`);
});

console.log("Dead Letter Queue worker started...");