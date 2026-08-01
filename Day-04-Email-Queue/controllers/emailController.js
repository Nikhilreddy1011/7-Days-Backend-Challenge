const emailQueue = require("../queues/emailQueue");

const addEmailJob = async (req, res) => {
  try {
    const { email, subject, message } = req.body;

    if (!email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Email, subject and message are required",
      });
    }

  const job = await emailQueue.add(
  "sendEmail",
  {
    email,
    subject,
    message,
  },
  {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
  }
);

    res.status(201).json({
      success: true,
      message: "Email job added to queue",
      jobId: job.id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const addDelayedEmailJob = async (req, res) => {
  try {
    const { email, subject, message } = req.body;

    if (!email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Email, subject and message are required",
      });
    }

    const job = await emailQueue.add(
      "sendDelayedEmail",
      {
        email,
        subject,
        message,
      },
      {
        delay: 10000,
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
      }
    );

    res.status(201).json({
      success: true,
      message: "Delayed email job added to queue",
      jobId: job.id,
      delay: "10 seconds",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  addEmailJob,
  addDelayedEmailJob,
};