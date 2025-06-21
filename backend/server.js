import express from "express";
import cors from "cors";
import http from "http";
import { socketHandler } from "./controllers/socketController.js";
import { connectDB } from "./config/db.js";
import { userRouter } from "./routes/userRouter.js";

const app = express();
export const server = http.createServer(app);
app.use(
  cors({
    origin: "https://roomifychat.vercel.app",
    methods: ["GET", "POST"],
  })
);
app.use(express.json());

connectDB();
app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.send("✅ Roomify Chat server is running!");
});

socketHandler(server);

server.listen(process.env.PORT || 3001, () => {
  console.log("✅ Roomify Chat server is running on port 3001");
});
