const { createClient } = require("redis");

const pubClient = createClient({
    url: "redis://localhost:6379"
});

const subClient = pubClient.duplicate();

pubClient.on("error", (err) => {
    console.error("Redis Publisher Error:", err);
});

subClient.on("error", (err) => {
    console.error("Redis Subscriber Error:", err);
});

module.exports = {
    pubClient,
    subClient
};