require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const { createAdapter } = require("@socket.io/redis-adapter");
const { pubClient, subClient } = require("./config/redis");

const connectDB = require("./config/db");
const app = require("./app");
const chatSocket = require("./sockets/chatSocket");

async function startServer() {
    try {
        // Connect MongoDB
        await connectDB();

        // Connect Redis
        await pubClient.connect();
        await subClient.connect();

        console.log("✅ Redis Connected");

        // Create HTTP Server
        const server = http.createServer(app);

        // Create Socket.IO Server
        const io = new Server(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });

        // Use Redis Adapter
        io.adapter(createAdapter(pubClient, subClient));

        // Initialize Socket Events
        chatSocket(io);

        const PORT = process.env.PORT || 5000;

        server.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("❌ Server Startup Failed:", error.message);
        process.exit(1);
    }
}

startServer();