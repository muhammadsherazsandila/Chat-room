import { Server } from "socket.io";
import { UserModel } from "../models/UserModel.js";
import { MessageModel } from "../models/MessagesModel.js";
export const socketHandler = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "https://roomifychat.vercel.app",
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", async (socket) => {
    socket.on("join", async (username) => {
      if (!username) return;
      const user = await UserModel.findOne({ username });
      if (!user) return;
      user.socketId = socket.id;
      user.isOnline = true;
      await user.save();
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
      console.log(data);
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
  });

  io.on("disconnect", async () => {
    const users = await UserModel.find({});
    users.forEach((user) => {
      user.isOnline = false;
      user.save();
    });
  });
};
