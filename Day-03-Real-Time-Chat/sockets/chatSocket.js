const Room = require("../models/Room");
const Message = require("../models/Message");

// Store connected users
const connectedUsers = new Map();

const chatSocket = (io) => {

    io.on("connection", (socket) => {

        console.log(`User Connected: ${socket.id}`);

        // Store connected socket
        connectedUsers.set(socket.id, socket);

        console.log("Connected Users:");
        console.log(Array.from(connectedUsers.keys()));

        // ==========================
        // Join Room
        // ==========================
        socket.on("join-room", async (roomName) => {

            socket.join(roomName);

            const roomExists = await Room.findOne({
                name: roomName
            });

            if (!roomExists) {

                await Room.create({
                    name: roomName
                });

            }

            console.log(`${socket.id} joined ${roomName}`);

            socket.to(roomName).emit("user-joined", {

                message: `A user joined ${roomName}`

            });

        });

        // ==========================
        // Leave Room
        // ==========================
        socket.on("leave-room", (roomName) => {

            socket.leave(roomName);

            console.log(`${socket.id} left ${roomName}`);

            socket.to(roomName).emit("user-left", {

                message: `A user left ${roomName}`

            });

        });

        // ==========================
        // Room Chat
        // ==========================
        socket.on("send-message", async (data) => {

            try {

                // Save message with default status = sent
                const newMessage = await Message.create({

                    sender: socket.id,

                    room: data.room,

                    message: data.message,

                    status: "sent"

                });

                io.to(data.room).emit("receive-message", {

                    id: newMessage._id,

                    sender: socket.id,

                    room: data.room,

                    message: data.message,

                    status: newMessage.status,

                    time: newMessage.createdAt

                });

            } catch (error) {

                console.log(error.message);

            }

        });

                socket.on("private-message", async (data) => {

            try {

                const targetSocket = connectedUsers.get(data.to);

                if (!targetSocket) {

                    socket.emit("private-error", {

                        message: "User not found or offline."

                    });

                    return;

                }

                // Save private message
                const newMessage = await Message.create({

                    sender: socket.id,

                    room: "PRIVATE",

                    message: data.message,

                    status: "sent"

                });

                // Send to receiver
                targetSocket.emit("private-message", {

                    id: newMessage._id,

                    from: socket.id,

                    message: data.message,

                    status: newMessage.status,

                    time: newMessage.createdAt

                });

                // Notify sender
                socket.emit("private-sent", {

                    id: newMessage._id,

                    to: data.to,

                    message: data.message,

                    status: newMessage.status,

                    time: newMessage.createdAt

                });

            } catch (error) {

                console.log(error.message);

            }

        });

        // ==========================
        // Message Delivered
        // ==========================
        socket.on("message-delivered", async (messageId) => {

            try {

                const updatedMessage = await Message.findByIdAndUpdate(

                    messageId,

                    {
                        status: "delivered"
                    },

                    {
                        new: true
                    }

                );

                if (!updatedMessage) {

                    return;

                }

                io.emit("message-status", {

                    id: updatedMessage._id,

                    status: updatedMessage.status

                });

            } catch (error) {

                console.log(error.message);

            }

        });

        // ==========================
        // Message Read
        // ==========================
        socket.on("message-read", async (messageId) => {

            try {

                const updatedMessage = await Message.findByIdAndUpdate(

                    messageId,

                    {
                        status: "read"
                    },

                    {
                        new: true
                    }

                );

                if (!updatedMessage) {

                    return;

                }

                io.emit("message-status", {

                    id: updatedMessage._id,

                    status: updatedMessage.status

                });

            } catch (error) {

                console.log(error.message);

            }

        });

        // ==========================
        // Typing Indicator
        // ==========================
        socket.on("typing", (room) => {

            socket.to(room).emit("typing", {

                user: socket.id

            });

        });

        // ==========================
        // Stop Typing
        // ==========================
        socket.on("stop-typing", (room) => {

            socket.to(room).emit("stop-typing");

        });

        // ==========================
        // Disconnect
        // ==========================
        socket.on("disconnect", () => {

            connectedUsers.delete(socket.id);

            console.log(`User Disconnected: ${socket.id}`);

            console.log("Connected Users:");

            console.log(Array.from(connectedUsers.keys()));

        });

    });

};

module.exports = chatSocket;