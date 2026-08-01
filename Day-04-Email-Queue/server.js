require("dotenv").config();

const app = require("./app");
const { setupCronJob } = require("./queues/cronQueue");

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  await setupCronJob();
});