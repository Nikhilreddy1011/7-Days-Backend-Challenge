# 📧 Day 4 - Email Queue & Background Job Service

A backend service built using **Node.js, Express.js, BullMQ, Redis, and Docker** to understand how background jobs and message queues work in real-world applications.

Instead of performing time-consuming tasks directly inside an API request, this project adds those tasks to a queue and processes them separately using background workers.

The project demonstrates **queues, workers, producer-consumer architecture, asynchronous processing, automatic retries, delayed jobs, recurring jobs, and Dead Letter Queues**.

---

## 📌 What is this Project?

Consider an application where a user registers and the backend needs to send a welcome email.

A simple backend might work like this:

```text
User Registers
      ↓
Express API
      ↓
Create User
      ↓
Send Email
      ↓
Wait for Email
      ↓
Return Response
```

The problem is that sending an email or performing another heavy operation can take time.

If the email service is slow, the API response also becomes slow.

A better approach is:

```text
User Registers
      ↓
Express API
      ↓
Add Email Job to Queue
      ↓
Return Response Immediately

Meanwhile...

Queue
  ↓
Worker
  ↓
Process Email
  ↓
Completed
```

This is the main idea behind this project.

The API is responsible for **creating the job**, while a separate worker is responsible for **processing the job in the background**.

---

# 🚀 Features

- Redis-based job queue
- BullMQ queue management
- Background job processing
- Producer-Consumer architecture
- Separate workers for job processing
- Asynchronous task execution
- Automatic retry mechanism
- Exponential retry backoff
- Delayed jobs
- Recurring/Cron jobs
- Dead Letter Queue for permanently failed jobs
- Dockerized Redis server
- REST API for creating email jobs

---

# 🛠 Technologies Used

| Technology | Purpose |
|------------|---------|
| Node.js | Backend JavaScript runtime |
| Express.js | REST API framework |
| BullMQ | Queue and background job management |
| Redis | Stores and manages queue data |
| ioredis | Redis client for Node.js |
| Docker | Runs Redis in a container |
| dotenv | Environment variable management |
| Nodemon | Development server auto-restart |

---

# 📁 Project Structure

```text
Day-04-Email-Queue
│
├── config
│   └── redis.js
│
├── controllers
│   └── emailController.js
│
├── queues
│   ├── emailQueue.js
│   ├── cronQueue.js
│   └── deadLetterQueue.js
│
├── routes
│   └── emailRoutes.js
│
├── workers
│   ├── emailWorker.js
│   ├── cronWorker.js
│   └── deadLetterWorker.js
│
├── .env
├── .env.example
├── app.js
├── server.js
├── package.json
├── package-lock.json
└── README.md
```

---

# 🏗️ Project Architecture

The main architecture of the application is:

```text
                    Client
                      │
                      │ HTTP Request
                      ▼
                 Express API
                      │
                      │ Creates Job
                      ▼
                BullMQ Queue
                      │
                      ▼
                    Redis
                      │
                      │ Worker picks job
                      ▼
                 Email Worker
                    /     \
                   /       \
             Success       Failure
                │             │
                ▼             ▼
           Completed        Retry
                              │
                       Maximum Retries?
                         /         \
                       No           Yes
                       │             │
                     Retry           ▼
                              Dead Letter Queue
```

---

# 🔄 How the Queue Works

When the API receives an email request, it does not process the email directly.

Instead:

```text
Client
   ↓
POST /api/emails
   ↓
Email Controller
   ↓
BullMQ
   ↓
Email Queue
   ↓
Redis
```

The API immediately returns a response confirming that the job was added.

The worker then processes the job separately:

```text
Redis
  ↓
Email Queue
  ↓
Email Worker
  ↓
Process Email
  ↓
Completed
```

This allows the API and background processing system to work independently.

---

# 📦 Producer-Consumer Pattern

This project follows the **Producer-Consumer Pattern**.

## Producer

The producer creates jobs.

In this project, the Express controller acts as the producer.

```text
API Request
    ↓
Controller
    ↓
emailQueue.add()
    ↓
Redis
```

For example, when the client sends:

```json
{
  "email": "user@example.com",
  "subject": "Welcome",
  "message": "Welcome to our application"
}
```

the controller creates a BullMQ job containing this data.

---

## Consumer

The consumer processes jobs.

In this project, `emailWorker.js` acts as the consumer.

```text
Redis Queue
     ↓
Email Worker
     ↓
Read Job Data
     ↓
Process Email
     ↓
Complete Job
```

The producer and consumer do not need to run inside the same process.

This makes the system easier to scale.

---

# 🧠 Why Background Jobs?

Some operations should not block an API response.

Examples include:

- Sending emails
- Generating reports
- Processing images
- Sending notifications
- Processing uploaded files
- Creating PDFs
- Data synchronization

Without background processing:

```text
Request
   ↓
Heavy Task
   ↓
Wait...
   ↓
Response
```

With background processing:

```text
Request
   ↓
Queue Task
   ↓
Response

Background Worker
      ↓
Process Task
```

The user gets a response without waiting for the entire background operation to finish.

---

# 🗄️ Why Redis?

Redis acts as the backend storage for BullMQ.

It stores information about:

- Waiting jobs
- Active jobs
- Completed jobs
- Failed jobs
- Delayed jobs
- Scheduled jobs
- Retry information

The basic flow is:

```text
Producer
   ↓
BullMQ
   ↓
Redis
   ↓
Worker
```

If a worker is temporarily unavailable, the queued job can remain in Redis until a worker is available to process it.

---

# ⚙️ Why BullMQ?

BullMQ provides a convenient job queue system on top of Redis.

Instead of manually implementing job management using Redis, BullMQ provides features such as:

- Queues
- Workers
- Job retries
- Backoff strategies
- Delayed jobs
- Recurring jobs
- Job status management
- Failed job handling

This project uses BullMQ to manage the complete lifecycle of background jobs.

---

# 🔁 Retry Mechanism

Background tasks can fail.

For example, an external email service might temporarily become unavailable.

Instead of immediately losing the job, BullMQ can automatically retry it.

This project allows a job to be attempted up to **3 times**.

```text
Job
 ↓
Attempt 1
 ↓
Failed ❌
 ↓
Wait
 ↓
Attempt 2
 ↓
Failed ❌
 ↓
Wait
 ↓
Attempt 3
```

The queue uses an **exponential backoff** strategy.

Conceptually:

```text
Failure
   ↓
Wait
   ↓
Retry
   ↓
Failure
   ↓
Wait Longer
   ↓
Retry
```

This prevents a failing service from being continuously hit with immediate retry requests.

---

# 🧪 Testing Failed Jobs

For demonstration purposes, the project intentionally fails jobs sent to:

```text
fail@example.com
```

For example:

```json
{
  "email": "fail@example.com",
  "subject": "Retry Test",
  "message": "Testing BullMQ retry mechanism"
}
```

The worker throws a simulated error.

The result looks like:

```text
Processing Job

Attempt 1/3 ❌

Processing Job

Attempt 2/3 ❌

Processing Job

Attempt 3/3 ❌
```

After the final failed attempt, the job is sent to the **Dead Letter Queue**.

---

# ⏳ Delayed Jobs

BullMQ also allows a job to be processed after a specified delay.

For this project, delayed email jobs wait **10 seconds** before becoming available to the worker.

```text
API Request
    ↓
Create Job
    ↓
Redis
    ↓
Wait 10 Seconds
    ↓
Email Worker
    ↓
Process Job
```

Delayed jobs can be useful for:

- Reminder emails
- Follow-up notifications
- Temporary account expiration
- Scheduled messages
- Order reminders

---

# 🌐 API Endpoints

## Add Normal Email Job

```http
POST /api/emails
```

Example request:

```json
{
  "email": "test@example.com",
  "subject": "Welcome",
  "message": "Welcome to Day 4!"
}
```

Example response:

```json
{
  "success": true,
  "message": "Email job added to queue",
  "jobId": "1"
}
```

The worker processes the job as soon as it becomes available.

---

## Add Delayed Email Job

```http
POST /api/emails/delayed
```

Example:

```json
{
  "email": "delay@example.com",
  "subject": "Delayed Job",
  "message": "This email should process after 10 seconds"
}
```

Example response:

```json
{
  "success": true,
  "message": "Delayed email job added to queue",
  "jobId": "2",
  "delay": "10 seconds"
}
```

The API responds immediately, but the worker processes the job after the configured delay.

---

# ⏰ Cron / Recurring Jobs

The project also demonstrates recurring background jobs.

A scheduled job is configured to run every **30 seconds** for demonstration.

```text
Start
  ↓
Wait 30 Seconds
  ↓
Create Scheduled Job
  ↓
Worker Processes Job
  ↓
Wait 30 Seconds
  ↓
Repeat
```

The cron worker displays:

```text
Scheduled Job Started

To: scheduled@example.com
Subject: Scheduled Email
Message: This email job runs every 30 seconds

Scheduled email processed successfully
```

In real applications, recurring jobs can be used for:

- Daily reports
- Weekly emails
- Database cleanup
- Subscription reminders
- Scheduled notifications
- Periodic data synchronization

---

# ☠️ Dead Letter Queue

A **Dead Letter Queue (DLQ)** stores jobs that cannot be successfully processed even after all retry attempts.

The flow is:

```text
Email Job
    ↓
Worker
    ↓
Attempt 1 ❌
    ↓
Attempt 2 ❌
    ↓
Attempt 3 ❌
    ↓
Retries Exhausted
    ↓
Dead Letter Queue
```

The DLQ stores information about the failed job, including:

- Original Job ID
- Email
- Subject
- Message
- Error

The `deadLetterWorker.js` worker processes jobs placed in the Dead Letter Queue.

Example output:

```text
Dead Letter Job Received
------------------------
Original Job ID: 6
Email: fail@example.com
Subject: DLQ Test
Error: Simulated email sending failure
------------------------
```

A Dead Letter Queue is useful because permanently failed tasks can be inspected instead of silently disappearing.

---

# 🔄 Complete Job Lifecycle

The complete workflow implemented in this project is:

```text
                       API Request
                            │
                            ▼
                        Producer
                            │
                            ▼
                       BullMQ Queue
                            │
                            ▼
                          Redis
                            │
                            ▼
                         Worker
                       /        \
                      /          \
                 Success         Failure
                    │               │
                    ▼               ▼
               Completed         Retry
                                    │
                               Attempt 2
                                    │
                                  Failed
                                    │
                                  Retry
                                    │
                               Attempt 3
                                    │
                           ┌────────┴────────┐
                           │                 │
                        Success           Failed
                           │                 │
                           ▼                 ▼
                      Completed      Dead Letter Queue
```

---

# 🐳 Redis with Docker

Redis is run inside a Docker container.

First make sure Docker Desktop is running.

Check Docker:

```bash
docker --version
```

Pull the Redis image:

```bash
docker pull redis
```

Create the Redis container:

```bash
docker run -d --name redis-server -p 6379:6379 redis
```

If the container already exists, simply start it:

```bash
docker start redis-server
```

Check running containers:

```bash
docker ps
```

---

# 🔍 Test Redis

Open the Redis CLI:

```bash
docker exec -it redis-server redis-cli
```

Then run:

```text
PING
```

Expected response:

```text
PONG
```

Exit Redis:

```text
exit
```

---

# ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/Nikhilreddy1011/7-Days-Backend-Challenge.git
```

Move into the Day 4 project:

```bash
cd 7-Days-Backend-Challenge/Day-04-Email-Queue
```

Install dependencies:

```bash
npm install
```

---

# 🔐 Environment Variables

Create a `.env` file inside the Day 4 folder.

```env
PORT=5000

REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

An `.env.example` file is included in the project as a reference.

The actual `.env` file should never be committed to GitHub.

---

# ▶️ Running the Project

Because this project uses separate background workers, different processes need to run in separate terminals.

## Terminal 1 - Start API

```bash
npm run dev
```

Expected:

```text
Server running on port 5000
Redis connected
Cron job scheduled - runs every 30 seconds
```

---

## Terminal 2 - Start Email Worker

```bash
npm run worker
```

Expected:

```text
Email worker started...
Redis connected
```

This worker handles normal and delayed email jobs.

---

## Terminal 3 - Start Cron Worker

```bash
npm run cron
```

Expected:

```text
Cron worker started...
Redis connected
```

This worker processes recurring scheduled jobs.

---

## Terminal 4 - Start Dead Letter Worker

```bash
npm run dlq
```

Expected:

```text
Dead Letter Queue worker started...
Redis connected
```

This worker handles jobs that reach the Dead Letter Queue.

---

# 🧪 Testing the API

You can test the API using Postman, Thunder Client, curl, or PowerShell.

### Normal Job

```powershell
Invoke-RestMethod `
  -Uri "http://localhost:5000/api/emails" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"test@example.com","subject":"Welcome","message":"Welcome to Day 4!"}'
```

The API should immediately return a job ID.

The email worker will then process the job separately.

---

### Delayed Job

```powershell
Invoke-RestMethod `
  -Uri "http://localhost:5000/api/emails/delayed" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"delay@example.com","subject":"Delayed Job","message":"Testing delayed processing"}'
```

The job will be processed after approximately 10 seconds.

---

### Retry and DLQ Test

```powershell
Invoke-RestMethod `
  -Uri "http://localhost:5000/api/emails" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"fail@example.com","subject":"DLQ Test","message":"Testing Dead Letter Queue"}'
```

The job intentionally fails.

```text
Attempt 1 ❌
    ↓
Attempt 2 ❌
    ↓
Attempt 3 ❌
    ↓
Dead Letter Queue
```

---

# 📜 Available Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Starts Express server using Nodemon |
| `npm start` | Starts Express server using Node.js |
| `npm run worker` | Starts email background worker |
| `npm run cron` | Starts recurring job worker |
| `npm run dlq` | Starts Dead Letter Queue worker |

---

# 💡 What I Learned

Through this project, I learned how backend applications handle tasks that should not run directly inside an HTTP request.

The main concepts covered were:

- Redis
- BullMQ
- Job Queues
- Workers
- Producer-Consumer Pattern
- Background Processing
- Asynchronous Processing
- Retry Mechanisms
- Exponential Backoff
- Delayed Jobs
- Cron / Recurring Jobs
- Dead Letter Queues
- Docker and Redis integration

The biggest takeaway from this project is:

> **The API creates the task, the queue stores the task, and the worker processes the task in the background.**

This architecture helps keep APIs responsive and makes long-running tasks easier to manage and scale.

---

# 📈 Possible Real-World Uses

The same architecture can be used for much more than email processing.

Examples include:

```text
Image Processing
       ↓
Queue
       ↓
Worker

PDF Generation
       ↓
Queue
       ↓
Worker

Push Notifications
       ↓
Queue
       ↓
Worker

Report Generation
       ↓
Queue
       ↓
Worker
```

Background job queues are commonly used when a task is slow, resource-intensive, scheduled, or needs reliable retry handling.

---

# 👨‍💻 Author

**Nikhil Reddy**

Backend Developer | MERN Stack Developer

### 🚀 7 Days Backend Challenge

**Day 4 – Email Queue & Background Job Service**

Built to understand Redis, BullMQ, background processing, job queues, workers, retries, delayed jobs, recurring jobs, and Dead Letter Queues.