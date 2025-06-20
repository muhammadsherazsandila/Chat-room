const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { v4: uuidv4 } = require("uuid"); // for unique message IDs

const app = express();
const server = http.createServer(app);

// CORS configuration for both frontend dev and production (Vercel)
app.use(
  cors({
    origin: ["http://localhost:5173", "https://roomifychat.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://roomifychat.vercel.app"],
    methods: ["GET", "POST"],
  },
});

// In-memory storage
const users = new Map();
const messages = [];

io.on("connection", (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);

  // Handle user joining
  socket.on("join", (username) => {
    users.set(socket.id, username);
    io.emit("user-connected", username);
    io.emit("user-list", Array.from(users.values()));
    console.log(`✅ ${username} joined the chat.`);
  });

  // Handle incoming messages
  socket.on("send-message", (messageData) => {
    const message = {
      id: uuidv4(),
      userId: socket.id,
      username: users.get(socket.id) || "Anonymous",
      text: messageData.text,
      replyTo: messageData.replyTo,
      timestamp: new Date(),
    };

    messages.push(message);

    io.emit("new-message", message);
    console.log(`📨 Message from ${message.username}: ${message.text}`);
  });

  // Initial data when user connects
  socket.emit("init-data", {
    users: Array.from(users.values()),
    messages: messages.slice(-100), // send last 100 messages only
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    const username = users.get(socket.id);
    if (username) {
      users.delete(socket.id);
      io.emit("user-disconnected", username);
      io.emit("user-list", Array.from(users.values()));
      console.log(`❌ ${username} disconnected.`);
    }
  });
});

io.on("disconnect", () => {
  users.clear();
  messages.length = 0;
});

// Health check route
app.get("/", (req, res) => {
  res.send("✅ Roomify Chat server is running!");
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
