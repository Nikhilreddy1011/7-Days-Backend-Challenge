require("dotenv").config();

const { Worker } = require("bullmq");
const redisConnection = require("../config/redis");
const deadLetterQueue = require("../queues/deadLetterQueue");

const emailWorker = new Worker(
  "emailQueue",

  async (job) => {
    console.log(`Processing Job ${job.id}`);

    console.log("Email Details:");
    console.log("To:", job.data.email);
    console.log("Subject:", job.data.subject);
    console.log("Message:", job.data.message);
    if (job.data.email === "fail@example.com") {
  throw new Error("Simulated email sending failure");
}

    // Simulating email processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log(`Email sent successfully to ${job.data.email}`);

    return {
      status: "sent",
      email: job.data.email,
    };
  },

  {
    connection: redisConnection,
  }
);

emailWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

emailWorker.on("failed", async (job, error) => {
  console.log(
    `Job ${job?.id} failed - Attempt ${job?.attemptsMade}/${job?.opts.attempts}`
  );

  if (job && job.attemptsMade >= job.opts.attempts) {
    console.log(`Job ${job.id} exhausted all retries`);

    await deadLetterQueue.add("failedEmail", {
      originalJobId: job.id,
      email: job.data.email,
      subject: job.data.subject,
      message: job.data.message,
      error: error.message,
    });

    console.log(`Job ${job.id} moved to Dead Letter Queue`);
  }
});

console.log("Email worker started...");