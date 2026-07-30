# 💬 Day 3 - Real-Time Chat Backend with Socket.IO

A scalable **Real-Time Chat Backend** built using **Node.js, Express.js, Socket.IO, MongoDB, Redis, and Docker**. This project demonstrates how modern chat applications enable instant messaging, room-based communication, private messaging, typing indicators, message persistence, read receipts, and scalable architecture using the Redis Adapter.

---

# 🚀 Features

- 🌐 Real-time communication using Socket.IO
- 🏠 Room-based chat
- 🔒 One-to-One Private Chat
- 💾 MongoDB Message Persistence
- ⌨️ Typing Indicator
- 📩 Read Receipts (Sent, Delivered, Read)
- 📡 Socket.IO Redis Adapter
- 🐳 Dockerized Redis Server
- ⚡ Scalable Architecture
- 📂 REST API to fetch room messages

---

# 📚 Technologies Used

| Technology | Purpose |
|------------|----------|
| Node.js | Backend Runtime |
| Express.js | Web Framework |
| Socket.IO | Real-Time Communication |
| MongoDB | Database |
| Mongoose | MongoDB ODM |
| Redis | Pub/Sub Message Broker |
| Docker | Redis Container |
| dotenv | Environment Variables |

---

# 📁 Project Structure

```
Day-03-Real-Time-Chat
│
├── config
│   ├── db.js
│   └── redis.js
│
├── controllers
│   └── messageController.js
│
├── middleware
│
├── models
│   ├── Message.js
│   └── Room.js
│
├── routes
│   └── messageRoutes.js
│
├── sockets
│   └── chatSocket.js
│
├── public
│   └── index.html
│
├── app.js
├── server.js
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/7-Days-Backend-Challenge.git

cd Day-03-Real-Time-Chat
```

---

## Install Dependencies

```bash
npm install
```

---

## Install Redis Packages

```bash
npm install redis
```

PowerShell users:

```powershell
npm install "@socket.io/redis-adapter"
```

Command Prompt / Git Bash:

```bash
npm install @socket.io/redis-adapter
```

---

# Environment Variables

Create a `.env` file.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret

JWT_EXPIRES_IN=1d
```

---

# Running MongoDB

Start MongoDB locally or use MongoDB Atlas.

---

# Docker Setup

Download Docker Desktop

https://www.docker.com/products/docker-desktop/

---

## Pull Redis Image

```bash
docker pull redis
```

---

## Run Redis Container

```bash
docker run -d --name redis-server -p 6379:6379 redis
```

---

## Verify Redis

```bash
docker ps
```

Expected

```
redis-server
Up
6379
```

---

## Redis Logs

```bash
docker logs redis-server
```

Expected

```
Ready to accept connections
```

---

# Start Server

```bash
npm start
```

Expected Output

```
MongoDB Connected

Redis Connected

Server running on port 5000
```

---

# Architecture

```
                   Browser

                      │

              Socket.IO Client

                      │

        Express + Socket.IO Server

          │                     │

          │                     │

      MongoDB              Redis Adapter

          │                     │

          └──────────┬──────────┘

                     │

                  Docker

                Redis Server
```

---

# Socket Events

## Join Room

```
join-room
```

User joins a room.

---

## Leave Room

```
leave-room
```

User exits the room.

---

## Send Message

```
send-message
```

Broadcasts a room message.

---

## Receive Message

```
receive-message
```

Receives room messages.

---

## Private Message

```
private-message
```

Send one-to-one messages.

---

## Typing

```
typing
```

Shows typing indicator.

---

## Stop Typing

```
stop-typing
```

Removes typing indicator.

---

## Delivered

```
message-delivered
```

Updates message status.

---

## Read

```
message-read
```

Marks message as read.

---

# Room Chat Workflow

```
User A

↓

Socket.IO

↓

Join Room

↓

Server

↓

MongoDB

↓

Broadcast

↓

User B
```

---

# Private Chat Workflow

```
Sender

↓

Socket.IO

↓

Server

↓

Receiver Socket

↓

Receiver
```

---

# Typing Workflow

```
User Starts Typing

↓

typing

↓

Other User

↓

Typing Indicator

↓

stop-typing

↓

Indicator Removed
```

---

# Read Receipt Workflow

```
Message Sent

↓

Status = Sent

↓

Receiver Gets Message

↓

Delivered Event

↓

Status = Delivered

↓

Receiver Reads

↓

Read Event

↓

Status = Read
```

---

# MongoDB Collections

## Room

```javascript
{

name,

createdAt,

updatedAt

}
```

---

## Message

```javascript
{

sender,

room,

message,

status,

createdAt,

updatedAt

}
```

---

# API Endpoints

## Get Room Messages

```
GET /api/messages/:room
```

Example

```
GET /api/messages/general
```

Returns

```json
[
    {
        "sender":"socket-id",
        "room":"general",
        "message":"Hello",
        "status":"read"
    }
]
```

---

# Why MongoDB?

MongoDB permanently stores

- Messages
- Rooms
- Chat History

Without MongoDB

- Chat history disappears after server restart.

---

# Why Redis?

Redis enables communication between multiple Socket.IO servers.

Example

```
Browser A

↓

Server 1

↓

Redis

↓

Server 2

↓

Browser B
```

Without Redis

```
Browser A

↓

Server 1

×

Server 2 doesn't know about it.
```

Redis solves this using Pub/Sub.

---

# Why Docker?

Docker provides

- Easy Redis installation
- Same environment everywhere
- No manual Redis installation
- One command deployment

Run Redis

```bash
docker run -d --name redis-server -p 6379:6379 redis
```

---

# Scalability

Current

```
Users

↓

One Server
```

Production

```
Users

↓

Load Balancer

↓

Node Server 1

Node Server 2

Node Server 3

↓

Redis

↓

MongoDB
```

Redis synchronizes Socket.IO events across every server.

---

# Future Improvements

- Authentication using JWT
- Online Users List
- File Sharing
- Image Sharing
- Voice Messages
- Video Calling
- Group Administration
- Push Notifications
- End-to-End Encryption
- Message Reactions
- Last Seen Status
- Emoji Support

---

# Learning Outcomes

After completing this project you understand

- Express.js Server
- Socket.IO
- WebSockets
- Real-Time Communication
- Event Emitters
- Rooms
- Private Messaging
- MongoDB Integration
- Redis Adapter
- Docker Basics
- Typing Indicators
- Read Receipts
- Message Persistence
- Backend Scalability

---

# Run the Project

Start Redis

```bash
docker start redis-server
```

Start Backend

```bash
npm start
```

Open

```
http://localhost:5000
```

Open two browser windows to test

- Room Chat
- Private Chat
- Typing Indicator
- Read Receipts

---

# Author

**Nikhil Reddy**

Backend Developer | MERN Stack Developer

7 Days Backend Challenge 🚀