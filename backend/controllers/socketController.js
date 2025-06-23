import { Server } from "socket.io";
import { UserModel } from "../models/UserModel.js";
import { MessageModel } from "../models/MessagesModel.js";
export const socketHandler = (server) => {
  const io = new Server(
    server,
    {
      cors: {
        origin: ["https://roomifychat.vercel.app", "http://localhost:5173"],
        methods: ["GET", "POST"],
      },
    },
    { transports: ["websocket"] }
  );
  io.on("connection", async (socket) => {
    socket.on("join", async (username) => {
      if (!username) return;
      const user = await UserModel.findOne({ username });
      if (!user) return;
      user.socketId = socket.id;
      user.isOnline = true;
      await user.save();

      // Count total messages
      const count = await MessageModel.countDocuments();
      console.log(count);
      // If more than 50, delete oldest
      if (count > 50) {
        const oldest = await MessageModel.find()
          .sort({ createdAt: 1 }) // oldest first
          .limit(count - 50); // get extra messages beyond 50

        const idsToDelete = oldest.map((msg) => msg._id);

        await MessageModel.deleteMany({ _id: { $in: idsToDelete } });
      }

      const users = (await UserModel.find({})) || [];
      const messages = (await MessageModel.find({}).populate("sender")) || [];
      const onlineUsers = (await UserModel.find({ isOnline: true })) || [];
      io.emit("user-connected", username, { users, messages, onlineUsers });
    });

    socket.on("disconnect", async () => {
      const user = await UserModel.findOne({ socketId: socket.id });
      if (!user) return;
      user.socketId = null;
      user.isOnline = false;
      await user.save();
      const onlineUsers = (await UserModel.find({ isOnline: true })) || [];
      io.emit("user-disconnected", user.username, onlineUsers);
    });

    // send message
    socket.on("send-message", async (data) => {
      const user = await UserModel.findOne({ username: data.sender });
      if (!user) return;
      const msg = await MessageModel.create({
        text: data.text,
        replyTo: data.replyTo,
        sender: user._id,
      });
      user.messages.push(msg._id);
      await user.save();
      const updatedMsg = await MessageModel.findById(msg._id)
        .populate("sender")
        .populate("replyTo");
      io.emit("new-message", updatedMsg);
    });

    socket.on("typing", async (username) => {
      const user = await UserModel.findOne({ username });
      if (!user) return;
      io.emit("typing", user);
    });

    socket.on("stop-typing", async (username) => {
      const user = await UserModel.findOne({ username });
      if (!user) return;
      io.emit("stop-typing", user);
    });

    socket.on("leave", async (username) => {
      const user = await UserModel.findOne({ username });
      if (!user) return;
      user.socketId = null;
      user.isOnline = false;
      await user.save();
      const onlineUsers = (await UserModel.find({ isOnline: true })) || [];
      io.emit("user-disconnected", user.username, onlineUsers);
    });
  });

  io.on("disconnect", async () => {
    const users = await UserModel.find({});
    users.forEach((user) => {
      user.isOnline = false;
      user.save();
    });
  });
};
