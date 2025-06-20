const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: ["http://localhost:5173", "https://roomifychat.vercel.app/"],
    methods: ["GET", "POST"],
  },
});
const cors = require("cors");

app.use(cors());

// Data storage
const users = new Map();
const messages = [];

io.on("connection", (socket) => {
  // User joins
  socket.on("join", (username) => {
    users.set(socket.id, username);
    io.emit("user-connected", username);
    io.emit("user-list", Array.from(users.values()));
  });

  // Message handling
  socket.on("send-message", (messageData) => {
    const message = {
      id: Date.now(),
      userId: socket.id,
      username: users.get(socket.id),
      text: messageData.text,
      replyTo: messageData.replyTo,
      timestamp: new Date(),
    };

    messages.push(message);
    io.emit("new-message", message);
  });

  // User disconnects
  socket.on("disconnect", () => {
    const username = users.get(socket.id);
    if (username) {
      users.delete(socket.id);
      io.emit("user-disconnected", username);
      io.emit("user-list", Array.from(users.values()));
    }
  });

  // Initial data
  socket.emit("init-data", {
    users: Array.from(users.values()),
    messages: messages.slice(-100),
  });
});

http.listen(3001, () => {
  console.log("Server running on port 3001");
});
